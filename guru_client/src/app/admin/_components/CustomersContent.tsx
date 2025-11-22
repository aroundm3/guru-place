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
  DialogContentText,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import LogoutIcon from "@mui/icons-material/Logout"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { formatBigNumber } from "@lib/util/format-big-number"
import {
  getCardBgClasses,
  getCardBadgeClasses,
  getCardColor,
  getCardTextClasses,
} from "@lib/util/card-colors"

const PAGE_SIZE = 20

dayjs.locale("vi")

type Customer = {
  id: number
  documentId: string
  full_name?: string
  phone_number?: string
  address?: string
  dob?: string
  point?: number | string
  createdAt?: string
  updatedAt?: string
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

export default function CustomersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isAuthenticated] = useState(true) // Always authenticated when this component is rendered
  const [customers, setCustomers] = useState<Customer[]>([])
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // State cho customer detail dialog
  const [openCustomerDetailDialog, setOpenCustomerDetailDialog] =
    useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )
  const [customerCards, setCustomerCards] = useState<
    Array<{ card: any; quantity: number }>
  >([])
  const [loadingCustomerCards, setLoadingCustomerCards] = useState(false)

  // State cho exchange cards dialog
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false)
  const [selectedCardForExchange, setSelectedCardForExchange] = useState<{
    card: any
    quantity: number
  } | null>(null)
  const [exchangeQuantity, setExchangeQuantity] = useState<string>("")
  const [exchanging, setExchanging] = useState(false)
  const [exchangeError, setExchangeError] = useState("")

  // Filter state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [customerName, setCustomerName] = useState("")

  // Function để update URL query params
  const updateURLParams = (updates: {
    phoneNumber?: string
    customerName?: string
    page?: number
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.phoneNumber !== undefined) {
      if (updates.phoneNumber) {
        params.set("phoneNumber", updates.phoneNumber)
      } else {
        params.delete("phoneNumber")
      }
    }
    if (updates.customerName !== undefined) {
      if (updates.customerName) {
        params.set("customerName", updates.customerName)
      } else {
        params.delete("customerName")
      }
    }
    if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set("page", updates.page.toString())
      } else {
        params.delete("page")
      }
    }

    router.push(`/admin?tab=customers&${params.toString()}`, { scroll: false })
  }

  // Đọc query params từ URL khi component mount hoặc URL thay đổi
  useEffect(() => {
    const phoneNumberParam = searchParams.get("phoneNumber") || ""
    const customerNameParam = searchParams.get("customerName") || ""
    const pageParam = searchParams.get("page")

    setPhoneNumber(phoneNumberParam)
    setCustomerName(customerNameParam)

    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (!isNaN(page) && page > 0) {
        setPagination((prev) => ({ ...prev, page }))
      }
    }
  }, [searchParams])

  const fetchCustomers = async (targetPage?: number) => {
    setLoading(true)
    setError("")

    try {
      // Đọc filter từ URL query params
      const currentPhoneNumber = searchParams.get("phoneNumber") || ""
      const currentCustomerName = searchParams.get("customerName") || ""
      const currentPage =
        targetPage || parseInt(searchParams.get("page") || "1", 10)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
      })

      if (currentPhoneNumber) params.set("phoneNumber", currentPhoneNumber)
      if (currentCustomerName) params.set("customerName", currentCustomerName)

      const res = await fetch(`/api/admin/customers?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          // This component assumes authentication is handled by parent,
          // but if token expires during fetch, it might still get 401.
          // In this case, parent AdminPage will re-evaluate auth.
          throw new Error("Unauthorized or session expired.")
        }
        throw new Error(data?.error || "Không thể tải danh sách khách hàng.")
      }

      const resultCustomers: Customer[] = data?.data || []
      setCustomers(resultCustomers)

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
      setError(err?.message || "Không thể tải danh sách khách hàng.")
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  // Track previous filter values để tránh fetch không cần thiết
  const prevFiltersRef = useRef<string | null>(null)
  const hasMountedRef = useRef(false)

  // Fetch customers khi authenticated hoặc khi filter params thay đổi
  useEffect(() => {
    if (!isAuthenticated) return

    // Lấy các filter params hiện tại (bỏ qua tab param)
    const currentFilters = JSON.stringify({
      phoneNumber: searchParams.get("phoneNumber") || "",
      customerName: searchParams.get("customerName") || "",
      page: searchParams.get("page") || "1",
    })

    // Lần đầu mount: luôn fetch
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      prevFiltersRef.current = currentFilters
      fetchCustomers()
      return
    }

    // Các lần sau: chỉ fetch nếu filter params thay đổi
    if (prevFiltersRef.current !== currentFilters) {
      prevFiltersRef.current = currentFilters
      fetchCustomers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, searchParams])

  const handlePageChange = (direction: "prev" | "next") => {
    const targetPage =
      direction === "prev" ? pagination.page - 1 : pagination.page + 1
    if (
      targetPage < 1 ||
      targetPage > pagination.pageCount ||
      loading ||
      !isAuthenticated
    ) {
      return
    }
    updateURLParams({ page: targetPage })
  }

  const handleSearch = () => {
    // Update URL với filter hiện tại từ state
    updateURLParams({
      phoneNumber,
      customerName,
      page: 1,
    })
  }

  const handleReset = () => {
    // Reset tất cả filters và xóa query params
    updateURLParams({
      phoneNumber: "",
      customerName: "",
      page: 1,
    })
  }

  const handleViewCustomerDetail = async (customer: Customer) => {
    setSelectedCustomer(customer)
    setOpenCustomerDetailDialog(true)
    setLoadingCustomerCards(true)
    setCustomerCards([])

    try {
      const response = await fetch(
        `/api/customer-cards-from-orders?customerId=${customer.documentId}`
      )
      if (!response.ok) {
        throw new Error("Failed to fetch customer cards")
      }

      const data = await response.json()
      setCustomerCards(data.data || [])
    } catch (error) {
      console.error("Error fetching customer cards:", error)
      setCustomerCards([])
    } finally {
      setLoadingCustomerCards(false)
    }
  }

  const handleOpenExchangeDialog = (cardItem: {
    card: any
    quantity: number
  }) => {
    setSelectedCardForExchange(cardItem)
    setOpenExchangeDialog(true)
    setExchangeQuantity("")
    setExchangeError("")
  }

  const handleConfirmExchange = async () => {
    if (!selectedCustomer || !selectedCardForExchange) return

    const quantity = parseInt(exchangeQuantity, 10)
    if (!quantity || quantity <= 0) {
      setExchangeError("Vui lòng nhập số lượng hợp lệ")
      return
    }

    const availableQuantity = selectedCardForExchange.quantity

    if (quantity > availableQuantity) {
      setExchangeError(
        `Không đủ thẻ để đổi. Chỉ có ${availableQuantity} thẻ loại này.`
      )
      return
    }

    setExchanging(true)
    setExchangeError("")

    try {
      const response = await fetch(
        `/api/admin/customers/${selectedCustomer.documentId}/exchange-cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exchangeQuantity: quantity,
            cardId: selectedCardForExchange.card.documentId, // ID của thẻ cần xóa
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to exchange cards")
      }

      // Đóng dialog và refresh danh sách thẻ
      setOpenExchangeDialog(false)
      setSelectedCardForExchange(null)
      // Refresh customer cards
      await handleViewCustomerDetail(selectedCustomer)
    } catch (error: any) {
      setExchangeError(error.message || "Có lỗi xảy ra khi đổi thẻ")
    } finally {
      setExchanging(false)
    }
  }

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tìm kiếm & Lọc
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <TextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            size="small"
            placeholder="0901234567"
          />
          <TextField
            label="Tên khách hàng"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            size="small"
            placeholder="Nhập tên khách hàng"
          />
        </div>
        <div className="flex gap-2">
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
              className="border border-stone-200 rounded-2xl bg-white shadow-sm p-4 sm:p-6"
            >
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="50%" height={24} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {customers.length === 0 && !error && (
            <div className="text-center py-12 sm:py-16 border border-dashed rounded-2xl bg-white">
              <p className="text-sm sm:text-base text-gray-600">
                Không tìm thấy khách hàng nào.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {customers.map((customer) => {
              const createdDate = customer.createdAt
                ? dayjs(customer.createdAt).format("DD/MM/YYYY HH:mm")
                : "N/A"
              const point = customer.point
                ? typeof customer.point === "string"
                  ? parseInt(customer.point, 10)
                  : customer.point
                : 0

              return (
                <div
                  key={customer.id}
                  className="border border-stone-200 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 justify-between">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
                          ID:
                        </p>
                        <span className="text-xs uppercase sm:text-sm font-semibold text-pink-700">
                          #{customer.documentId}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">
                        {customer.full_name || "N/A"}
                      </p>
                      <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-semibold">SĐT:</span>{" "}
                          {customer.phone_number || "N/A"}
                        </p>
                        {customer.address && (
                          <p>
                            <span className="font-semibold">Địa chỉ:</span>{" "}
                            {customer.address}
                          </p>
                        )}
                        {customer.dob && (
                          <p>
                            <span className="font-semibold">Ngày sinh:</span>{" "}
                            {dayjs(customer.dob).format("DD/MM/YYYY")}
                          </p>
                        )}
                        {/* <p>
                          <span className="font-semibold">Điểm tích lũy:</span>{" "}
                          <span className="text-pink-700 font-bold">
                            {formatBigNumber(point, false)}
                          </span>
                        </p> */}
                        <p className="text-gray-500">
                          <span className="font-semibold">Ngày tạo:</span>{" "}
                          {createdDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-3 sm:mt-0">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewCustomerDetail(customer)}
                        className="!normal-case !font-semibold !text-neutral-900 !border-neutral-900"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {customers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 border-t pt-4">
              <span className="text-sm text-gray-500">
                Trang {pagination.page} / {pagination.pageCount} (Tổng:{" "}
                {pagination.total} khách hàng)
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

      {/* Customer Detail Dialog */}
      <Dialog
        open={openCustomerDetailDialog}
        onClose={() => setOpenCustomerDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="!font-semibold !flex !justify-between !items-center">
          <span>
            Chi tiết khách hàng: {selectedCustomer?.full_name || "N/A"}
          </span>
          <Button
            variant="outlined"
            onClick={() => setOpenCustomerDetailDialog(false)}
            className="!normal-case !font-semibold"
          >
            Đóng
          </Button>
        </DialogTitle>
        <DialogContent>
          {loadingCustomerCards ? (
            <div className="flex justify-center py-8">
              <CircularProgress />
            </div>
          ) : customerCards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Khách hàng chưa có thẻ tích điểm nào từ đơn hàng đã hoàn thành.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thẻ tích điểm đã nhận được
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customerCards.map((item, index) => {
                  const card = item.card
                  const quantity = item.quantity
                  const color = getCardColor(card.index || 0)
                  const title = card.title || "N/A"
                  const discount = Number(card.discount || 0)
                  const imageSrc = card.image?.default || "/logo.png"

                  return (
                    <div
                      key={card.documentId || index}
                      className={`${getCardBgClasses(
                        color
                      )} border rounded-2xl p-3 relative overflow-visible shadow-sm`}
                    >
                      <span
                        className={`absolute -top-2 -right-2 ${getCardBadgeClasses(
                          color
                        )} text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg z-20 border-2 border-white`}
                      >
                        x{quantity}
                      </span>
                      <div className="relative w-full overflow-hidden rounded-t-2xl bg-white mb-2">
                        <img
                          src={imageSrc}
                          alt={title}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="p-3 border-t border-gray-200">
                        <h4
                          className={`${getCardTextClasses(
                            color
                          )} text-sm font-bold line-clamp-2 ${
                            discount > 0 ? "mb-1" : ""
                          }`}
                        >
                          {title}
                        </h4>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<SwapHorizIcon />}
                          onClick={() => handleOpenExchangeDialog(item)}
                          className="!mt-2 !normal-case !font-semibold !text-neutral-900 !border-neutral-900 !w-full"
                        >
                          Đổi thẻ
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exchange Cards Dialog */}
      <Dialog
        open={openExchangeDialog}
        onClose={() => !exchanging && setOpenExchangeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="!font-semibold">Đổi thẻ tích điểm</DialogTitle>
        <DialogContent>
          {selectedCardForExchange && (
            <>
              <DialogContentText className="!mb-4">
                Đổi thẻ:{" "}
                <strong>{selectedCardForExchange.card.title || "N/A"}</strong>
                <br />
                Số lượng hiện có:{" "}
                <strong>{selectedCardForExchange.quantity}</strong>
              </DialogContentText>

              {exchangeError && (
                <Alert severity="error" className="!mb-4">
                  {exchangeError}
                </Alert>
              )}

              <div className="space-y-4">
                <TextField
                  label="Số lượng thẻ muốn đổi"
                  type="number"
                  value={exchangeQuantity}
                  onChange={(e) => {
                    const value = e.target.value
                    setExchangeQuantity(value)

                    // Validate ngay khi nhập
                    const numValue = parseInt(value, 10)
                    if (value && (!numValue || numValue <= 0)) {
                      setExchangeError(
                        "Vui lòng nhập số lượng hợp lệ (lớn hơn 0)"
                      )
                    } else if (
                      value &&
                      numValue > selectedCardForExchange.quantity
                    ) {
                      setExchangeError(
                        `Số lượng muốn đổi (${numValue}) vượt quá số lượng hiện có (${selectedCardForExchange.quantity}).`
                      )
                    } else {
                      setExchangeError("")
                    }
                  }}
                  fullWidth
                  size="small"
                  inputProps={{
                    min: 1,
                    max: selectedCardForExchange.quantity,
                  }}
                  disabled={exchanging}
                  helperText={`Tối đa: ${selectedCardForExchange.quantity} thẻ`}
                  error={!!exchangeError}
                />

                {exchangeQuantity &&
                  parseInt(exchangeQuantity, 10) > 0 &&
                  parseInt(exchangeQuantity, 10) <=
                    selectedCardForExchange.quantity && (
                    <div className="text-sm text-gray-600">
                      <p>
                        Số thẻ còn lại sau khi đổi:{" "}
                        <strong>
                          {selectedCardForExchange.quantity -
                            parseInt(exchangeQuantity, 10)}
                        </strong>
                      </p>
                    </div>
                  )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions className="mx-3 mb-3">
          <Button
            onClick={() => setOpenExchangeDialog(false)}
            disabled={exchanging}
            className="!normal-case !font-semibold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmExchange}
            variant="contained"
            disabled={
              exchanging ||
              !exchangeQuantity ||
              parseInt(exchangeQuantity, 10) <= 0 ||
              !selectedCardForExchange ||
              parseInt(exchangeQuantity, 10) > selectedCardForExchange.quantity
            }
            startIcon={exchanging ? <CircularProgress size={16} /> : null}
            className="!bg-neutral-900 !text-white !normal-case !font-semibold"
          >
            {exchanging ? "Đang xử lý..." : "Xác nhận đổi"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
