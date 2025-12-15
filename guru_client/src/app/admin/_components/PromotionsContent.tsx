"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import {
  Button,
  TextField,
  Alert,
  CircularProgress,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  Box,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

const PAGE_SIZE = 10

dayjs.locale("vi")

type Promotion = {
  id: number
  documentId: string
  code: string
  title: string
  description?: string
  type: "percent" | "cash"
  value: number | string
  discountMinimumOrderAmount?: number | string
  discountMaximumOrderAmount?: number | string
  isDisable?: boolean
  isPrivate?: boolean
  createdAt?: string
  updatedAt?: string
  customers?: Array<{
    id: number
    documentId: string
    full_name?: string
    phone_number?: string
  }>
  products?: Array<{
    id: number
    documentId: string
    name?: string
  }>
  image?: {
    url?: string
    name?: string
  }
}

interface PaginationState {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

const defaultPagination: PaginationState = {
  page: 1,
  pageSize: PAGE_SIZE,
  pageCount: 1,
  total: 0,
}

type Customer = {
  id: number
  documentId: string
  full_name?: string
  phone_number?: string
}

type Product = {
  id: number
  documentId: string
  name?: string
}

export default function PromotionsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  )

  // Form states
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    type: "cash" as "percent" | "cash",
    value: "",
    discountMinimumOrderAmount: "",
    discountMaximumOrderAmount: "",
    isDisable: false,
    isPrivate: false,
  })
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Autocomplete states for products
  const [productOptions, setProductOptions] = useState<Product[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [productPage, setProductPage] = useState(1)
  const [productHasMore, setProductHasMore] = useState(true)

  // Autocomplete states for customers
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([])
  const [customerLoading, setCustomerLoading] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")
  const [customerPage, setCustomerPage] = useState(1)
  const [customerHasMore, setCustomerHasMore] = useState(true)

  // Delete dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(
    null
  )
  const [deleting, setDeleting] = useState(false)

  // Snackbar state for copy notification
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")

  // Function to update URL query params
  const updateURLParams = (updates: { search?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.search !== undefined) {
      if (updates.search) {
        params.set("search", updates.search)
      } else {
        params.delete("search")
      }
    }
    if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set("page", updates.page.toString())
      } else {
        params.delete("page")
      }
    }

    router.push(`/admin?tab=promotions&${params.toString()}`, { scroll: false })
  }

  // Read query params from URL
  useEffect(() => {
    const searchParam = searchParams.get("search") || ""
    const pageParam = searchParams.get("page")

    setSearchQuery(searchParam)

    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (!isNaN(page) && page > 0) {
        setPagination((prev) => ({ ...prev, page }))
      }
    }
  }, [searchParams])

  const fetchPromotions = async (targetPage?: number) => {
    setLoading(true)
    setError("")

    try {
      const currentSearch = searchParams.get("search") || ""
      const currentPage =
        targetPage || parseInt(searchParams.get("page") || "1", 10)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
      })

      if (currentSearch) params.set("search", currentSearch)

      const res = await fetch(`/api/admin/promotions?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized or session expired.")
        }
        throw new Error(data?.error || "Không thể tải danh sách khuyến mãi.")
      }

      const resultPromotions: Promotion[] = data?.data || []
      setPromotions(resultPromotions)

      const meta = data?.meta?.pagination
      if (meta) {
        setPagination({
          page: meta.page,
          pageSize: meta.pageSize,
          pageCount: meta.pageCount,
          total: meta.total,
        })
      } else {
        setPagination((prev) => ({
          ...prev,
          page: currentPage,
        }))
      }
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách khuyến mãi.")
      setPromotions([])
    } finally {
      setLoading(false)
    }
  }

  // Track previous filter values
  const prevFiltersRef = useRef<string | null>(null)
  const hasMountedRef = useRef(false)

  // Fetch promotions when filters change
  useEffect(() => {
    const currentTab = searchParams.get("tab")
    if (currentTab !== "promotions") return

    const currentFilters = JSON.stringify({
      search: searchParams.get("search") || "",
      page: searchParams.get("page") || "1",
    })

    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      prevFiltersRef.current = currentFilters
      fetchPromotions()
      return
    }

    if (prevFiltersRef.current !== currentFilters) {
      prevFiltersRef.current = currentFilters
      fetchPromotions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handlePageChange = (direction: "prev" | "next") => {
    const targetPage =
      direction === "prev" ? pagination.page - 1 : pagination.page + 1
    if (targetPage < 1 || targetPage > pagination.pageCount || loading) {
      return
    }
    updateURLParams({ page: targetPage })
  }

  const handleSearch = () => {
    updateURLParams({
      search: searchQuery,
      page: 1,
    })
  }

  const handleReset = () => {
    updateURLParams({
      search: "",
      page: 1,
    })
  }

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSnackbarMessage(`Đã copy ${label}`)
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Failed to copy:", error)
      setSnackbarMessage("Không thể copy")
      setSnackbarOpen(true)
    }
  }

  // Fetch products for autocomplete
  const fetchProducts = async (search: string, page: number) => {
    setProductLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "20",
      })
      if (search) params.set("search", search)

      const res = await fetch(`/api/admin/products/search?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        const products = data?.data || []
        if (page === 1) {
          setProductOptions(products)
        } else {
          setProductOptions((prev) => [...prev, ...products])
        }
        setProductHasMore(
          data?.meta?.pagination?.page < data?.meta?.pagination?.pageCount
        )
      }
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setProductLoading(false)
    }
  }

  // Fetch customers for autocomplete
  const fetchCustomers = async (search: string, page: number) => {
    setCustomerLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "20",
      })
      if (search) params.set("search", search)

      const res = await fetch(
        `/api/admin/customers/search?${params.toString()}`
      )
      const data = await res.json()

      if (res.ok) {
        const customers = data?.data || []
        if (page === 1) {
          setCustomerOptions(customers)
        } else {
          setCustomerOptions((prev) => [...prev, ...customers])
        }
        setCustomerHasMore(
          data?.meta?.pagination?.page < data?.meta?.pagination?.pageCount
        )
      }
    } catch (err) {
      console.error("Error fetching customers:", err)
    } finally {
      setCustomerLoading(false)
    }
  }

  // Handle product search
  useEffect(() => {
    if (openDialog) {
      const timer = setTimeout(() => {
        setProductPage(1)
        fetchProducts(productSearch, 1)
      }, 300)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch, openDialog])

  // Handle customer search
  useEffect(() => {
    if (openDialog) {
      const timer = setTimeout(() => {
        setCustomerPage(1)
        fetchCustomers(customerSearch, 1)
      }, 300)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSearch, openDialog])

  const handleOpenCreateDialog = () => {
    setDialogMode("create")
    setFormData({
      code: "",
      title: "",
      description: "",
      type: "cash",
      value: "",
      discountMinimumOrderAmount: "",
      discountMaximumOrderAmount: "",
      isDisable: false,
      isPrivate: false,
    })
    setSelectedCustomers([])
    setSelectedProducts([])
    setFormError("")
    setOpenDialog(true)

    // Reset autocomplete states
    setProductOptions([])
    setProductSearch("")
    setProductPage(1)
    setProductHasMore(true)
    setCustomerOptions([])
    setCustomerSearch("")
    setCustomerPage(1)
    setCustomerHasMore(true)

    // Initial load
    fetchProducts("", 1)
    fetchCustomers("", 1)
  }

  const handleOpenEditDialog = (promotion: Promotion) => {
    setDialogMode("edit")
    setSelectedPromotion(promotion)
    setFormData({
      code: promotion.code,
      title: promotion.title,
      description: promotion.description || "",
      type: promotion.type,
      value: promotion.value.toString(),
      discountMinimumOrderAmount:
        promotion.discountMinimumOrderAmount?.toString() || "",
      discountMaximumOrderAmount:
        promotion.discountMaximumOrderAmount?.toString() || "",
      isDisable: promotion.isDisable || false,
      isPrivate: promotion.isPrivate || false,
    })
    setSelectedCustomers(promotion.customers || [])
    setSelectedProducts(promotion.products || [])
    setFormError("")
    setOpenDialog(true)

    // Reset autocomplete states
    setProductOptions(promotion.products || [])
    setProductSearch("")
    setProductPage(1)
    setProductHasMore(true)
    setCustomerOptions(promotion.customers || [])
    setCustomerSearch("")
    setCustomerPage(1)
    setCustomerHasMore(true)

    // Initial load with existing data
    fetchProducts("", 1)
    fetchCustomers("", 1)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedPromotion(null)
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setFormError("")

    // Validate
    if (!formData.code || !formData.title || !formData.value) {
      setFormError("Vui lòng điền đầy đủ thông tin bắt buộc.")
      return
    }

    setSubmitting(true)

    try {
      const body = {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        discountMinimumOrderAmount: formData.discountMinimumOrderAmount,
        discountMaximumOrderAmount: formData.discountMaximumOrderAmount,
        isDisable: formData.isDisable,
        isPrivate: formData.isPrivate,
        customerIds: selectedCustomers.map((c) => c.documentId),
        productIds: selectedProducts.map((p) => p.documentId),
      }

      const url =
        dialogMode === "create"
          ? "/api/admin/promotions"
          : `/api/admin/promotions/${selectedPromotion?.documentId}`

      const method = dialogMode === "create" ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Có lỗi xảy ra khi lưu khuyến mãi.")
      }

      // Success
      handleCloseDialog()
      fetchPromotions()
    } catch (err: any) {
      setFormError(err?.message || "Có lỗi xảy ra khi lưu khuyến mãi.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenDeleteDialog = (promotion: Promotion) => {
    setPromotionToDelete(promotion)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setPromotionToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!promotionToDelete) return

    setDeleting(true)

    try {
      const res = await fetch(
        `/api/admin/promotions/${promotionToDelete.documentId}`,
        {
          method: "DELETE",
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Không thể xóa khuyến mãi.")
      }

      // Success
      handleCloseDeleteDialog()
      fetchPromotions()
    } catch (err: any) {
      setFormError(err?.message || "Không thể xóa khuyến mãi.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tìm kiếm khuyến mãi
            </h2>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <TextField
                  label="Tìm theo mã hoặc tên"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  placeholder="Nhập mã hoặc tên khuyến mãi"
                  className="flex-1"
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  className="!bg-neutral-900 !text-white !normal-case !font-semibold"
                >
                  Tìm kiếm
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  className="!normal-case !font-semibold !text-neutral-900 !border-neutral-900"
                >
                  Đặt lại
                </Button>
              </div>
              <Button
                variant="contained"
                onClick={handleOpenCreateDialog}
                startIcon={<AddIcon />}
                className="!bg-green-600 !text-white !normal-case !font-semibold hover:!bg-green-700"
              >
                Tạo khuyến mãi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="border border-stone-200 rounded-2xl bg-white shadow-sm p-4 lg:p-6"
            >
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="50%" height={24} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {promotions.length === 0 && !error && (
            <div className="text-center py-12 lg:py-16 border border-dashed rounded-2xl bg-white">
              <p className="text-sm lg:text-base text-gray-600">
                Không tìm thấy khuyến mãi nào.
              </p>
            </div>
          )}
          {promotions.length > 0 && (
            <div className="flex flex-col items-end justify-end gap-1 my-6">
              <span className="text-xs text-gray-500">
                Trang {pagination.page} / {pagination.pageCount} (Tổng:{" "}
                {pagination.total} khuyến mãi)
              </span>
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={() => handlePageChange("prev")}
                  disabled={pagination.page <= 1 || loading}
                  className="!border !border-neutral-200 !text-gray-700 hover:!bg-gray-50 disabled:!opacity-50"
                  size="small"
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={() => handlePageChange("next")}
                  disabled={pagination.page >= pagination.pageCount || loading}
                  className="!border !border-neutral-200 !text-gray-700 hover:!bg-gray-50 disabled:!opacity-50"
                  size="small"
                >
                  <ChevronRightIcon />
                </IconButton>
              </div>
            </div>
          )}
          <div className="space-y-5">
            {promotions.map((promotion) => {
              const createdDate = promotion.createdAt
                ? dayjs(promotion.createdAt).format("DD/MM/YYYY HH:mm")
                : "N/A"
              const value =
                typeof promotion.value === "string"
                  ? parseInt(promotion.value, 10)
                  : promotion.value

              return (
                <div
                  key={promotion.id}
                  className="border border-stone-200 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md p-4 lg:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-6 justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs uppercase lg:text-sm font-bold text-pink-700">
                          {promotion.code}
                        </span>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(promotion.code, "mã giảm giá")
                          }
                          className="!p-1 !h-6 !w-6"
                          title="Copy mã giảm giá"
                        >
                          <ContentCopyIcon className="!h-3 !w-3 text-gray-500 hover:text-gray-700" />
                        </IconButton>
                        {promotion.isPrivate && (
                          <Chip
                            label="Khách hàng riêng"
                            size="small"
                            color="warning"
                            className="!text-xs !font-semibosld"
                          />
                        )}
                        {promotion.isDisable && (
                          <Chip
                            label="Vô hiệu hóa"
                            size="small"
                            color="error"
                            className="!text-xs !font-semibold"
                          />
                        )}
                      </div>
                      <p className="text-base lg:text-lg font-bold text-gray-900">
                        {promotion.title}
                      </p>
                      {promotion.description && (
                        <p className="text-sm text-gray-600">
                          {promotion.description}
                        </p>
                      )}
                      <div className="text-xs lg:text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-semibold">Loại:</span>{" "}
                          {promotion.type === "percent"
                            ? `Giảm ${value}%`
                            : `Giảm ${value.toLocaleString("vi-VN")}đ`}
                        </p>
                        {promotion.discountMinimumOrderAmount && (
                          <p>
                            <span className="font-semibold">
                              Đơn hàng tối thiểu:
                            </span>{" "}
                            {parseInt(
                              promotion.discountMinimumOrderAmount.toString(),
                              10
                            ).toLocaleString("vi-VN")}
                            đ
                          </p>
                        )}
                        {promotion.discountMaximumOrderAmount && (
                          <p>
                            <span className="font-semibold">Giảm tối đa:</span>{" "}
                            {parseInt(
                              promotion.discountMaximumOrderAmount.toString(),
                              10
                            ).toLocaleString("vi-VN")}
                            đ
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">Khách hàng:</span>
                          {promotion.customers && promotion.customers.length > 0
                            ? promotion.customers.map((c) => (
                                <Chip
                                  key={c.documentId}
                                  label={`${c.full_name} (${c.phone_number})`}
                                  size="small"
                                  className="!text-xs"
                                />
                              ))
                            : "Tất cả"}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">Sản phẩm:</span>
                          {promotion.products && promotion.products.length > 0
                            ? promotion.products.map((p) => (
                                <Chip
                                  key={p.documentId}
                                  label={p.name}
                                  size="small"
                                  className="!text-xs"
                                />
                              ))
                            : "Tất cả"}
                        </div>
                        <p className="text-gray-500">
                          <span className="font-semibold">Ngày tạo:</span>{" "}
                          {createdDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-3 lg:mt-0">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEditDialog(promotion)}
                        className="!normal-case !font-semibold !text-blue-600 !border-blue-600"
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleOpenDeleteDialog(promotion)}
                        className="!normal-case !font-semibold !text-red-600 !border-red-600"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {promotions.length > 0 && (
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mt-6 border-t pt-4">
              <span className="text-sm text-gray-500">
                Trang {pagination.page} / {pagination.pageCount} (Tổng:{" "}
                {pagination.total} khuyến mãi)
              </span>
              <div className="flex items-center gap-2">
                <IconButton
                  onClick={() => handlePageChange("prev")}
                  disabled={pagination.page <= 1 || loading}
                  className="!border !border-neutral-200 !text-gray-700 hover:!bg-gray-50 disabled:!opacity-50"
                  size="small"
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={() => handlePageChange("next")}
                  disabled={pagination.page >= pagination.pageCount || loading}
                  className="!border !border-neutral-200 !text-gray-700 hover:!bg-gray-50 disabled:!opacity-50"
                  size="small"
                >
                  <ChevronRightIcon />
                </IconButton>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        // onClose={handleCloseDialog}s
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="!font-semibold">
          {dialogMode === "create" ? "Tạo khuyến mãi mới" : "Sửa khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            {formError && (
              <Alert severity="error" className="!mb-4">
                {formError}
              </Alert>
            )}

            <TextField
              label="Mã khuyến mãi *"
              value={formData.code}
              onChange={(e) => handleFormChange("code", e.target.value)}
              fullWidth
              size="small"
              placeholder="VD: SALE2024"
            />

            <TextField
              label="Tên khuyến mãi *"
              value={formData.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              fullWidth
              size="small"
              placeholder="VD: Giảm giá mùa hè"
            />

            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder="Mô tả chi tiết về khuyến mãi"
            />

            <FormControl fullWidth size="small">
              <InputLabel>Loại khuyến mãi *</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) =>
                  handleFormChange("type", e.target.value as "percent" | "cash")
                }
                label="Loại khuyến mãi *"
              >
                <MenuItem value="cash">Giảm tiền (VNĐ)</MenuItem>
                <MenuItem value="percent">Giảm phần trăm (%)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={
                formData.type === "percent"
                  ? "Giá trị giảm (%) *"
                  : "Giá trị giảm (VNĐ) *"
              }
              value={formData.value}
              onChange={(e) => handleFormChange("value", e.target.value)}
              fullWidth
              size="small"
              type="number"
              placeholder={formData.type === "percent" ? "10" : "50000"}
            />

            <TextField
              label="Giá trị đơn hàng tối thiểu (VNĐ)"
              value={formData.discountMinimumOrderAmount}
              onChange={(e) =>
                handleFormChange("discountMinimumOrderAmount", e.target.value)
              }
              fullWidth
              size="small"
              type="number"
              placeholder="0"
            />

            <TextField
              label="Giảm tối đa (VNĐ)"
              value={formData.discountMaximumOrderAmount}
              onChange={(e) =>
                handleFormChange("discountMaximumOrderAmount", e.target.value)
              }
              fullWidth
              size="small"
              type="number"
              placeholder="Không giới hạn"
            />

            {/* Checkboxes for isDisable and isPrivate */}
            <div className="flex gap-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isDisable}
                    onChange={(e) =>
                      handleFormChange("isDisable", e.target.checked)
                    }
                  />
                }
                label="Vô hiệu hóa"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isPrivate}
                    onChange={(e) =>
                      handleFormChange("isPrivate", e.target.checked)
                    }
                  />
                }
                label="Mã dành khách hàng riêng"
              />
            </div>
            <FormHelperText>
              Disable: Khuyến mãi sẽ không được áp dụng | Private: Chỉ áp dụng
              cho khách hàng được chọn
            </FormHelperText>

            <Autocomplete
              multiple
              options={customerOptions}
              value={selectedCustomers}
              onChange={(_, newValue) => setSelectedCustomers(newValue)}
              getOptionLabel={(option) =>
                `${option.full_name} (${option.phone_number})`
              }
              isOptionEqualToValue={(option, value) =>
                option.documentId === value.documentId
              }
              loading={customerLoading}
              onInputChange={(_, value) => setCustomerSearch(value)}
              filterOptions={(x) => x}
              ListboxProps={{
                onScroll: (event: React.SyntheticEvent) => {
                  const listboxNode = event.currentTarget
                  if (
                    listboxNode.scrollTop + listboxNode.clientHeight ===
                    listboxNode.scrollHeight
                  ) {
                    if (customerHasMore && !customerLoading) {
                      const nextPage = customerPage + 1
                      setCustomerPage(nextPage)
                      fetchCustomers(customerSearch, nextPage)
                    }
                  }
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Khách hàng áp dụng"
                  placeholder="Tìm theo tên hoặc số điện thoại"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {customerLoading ? (
                          <CircularProgress size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`${option.full_name} (${option.phone_number})`}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
            <FormHelperText>
              Để trống nếu áp dụng cho tất cả khách hàng
            </FormHelperText>

            <Autocomplete
              multiple
              options={productOptions}
              value={selectedProducts}
              onChange={(_, newValue) => setSelectedProducts(newValue)}
              getOptionLabel={(option) => option.name || "N/A"}
              isOptionEqualToValue={(option, value) =>
                option.documentId === value.documentId
              }
              loading={productLoading}
              onInputChange={(_, value) => setProductSearch(value)}
              filterOptions={(x) => x}
              ListboxProps={{
                onScroll: (event: React.SyntheticEvent) => {
                  const listboxNode = event.currentTarget
                  if (
                    listboxNode.scrollTop + listboxNode.clientHeight ===
                    listboxNode.scrollHeight
                  ) {
                    if (productHasMore && !productLoading) {
                      const nextPage = productPage + 1
                      setProductPage(nextPage)
                      fetchProducts(productSearch, nextPage)
                    }
                  }
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sản phẩm áp dụng"
                  placeholder="Tìm theo tên hoặc mã sản phẩm"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {productLoading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
            <FormHelperText>
              Để trống nếu áp dụng cho tất cả sản phẩm
            </FormHelperText>
          </div>
        </DialogContent>
        <DialogActions className="mx-3 mb-3">
          <Button
            onClick={handleCloseDialog}
            disabled={submitting}
            className="!normal-case !font-semibold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : null}
            className="!bg-neutral-900 !text-white !normal-case !font-semibold"
          >
            {submitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="!font-semibold">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p className="text-gray-700">
            Bạn có chắc chắn muốn xóa khuyến mãi{" "}
            <strong>{promotionToDelete?.title}</strong>? Hành động này không thể
            hoàn tác.
          </p>
        </DialogContent>
        <DialogActions className="mx-3 mb-3">
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
            className="!normal-case !font-semibold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : null}
            className="!bg-red-600 !text-white !normal-case !font-semibold"
          >
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for copy notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  )
}
