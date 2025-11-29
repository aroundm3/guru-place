"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/vi"
import Link from "next/link"
import Image from "next/image"
import { formatBigNumber } from "@lib/util/format-big-number"
import {
  Button,
  TextField,
  Alert,
  Collapse,
  IconButton,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import SearchIcon from "@mui/icons-material/Search"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import LogoutIcon from "@mui/icons-material/Logout"
import ReceiptIcon from "@mui/icons-material/Receipt"
import PrintIcon from "@mui/icons-material/Print"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import {
  getCardBgClasses,
  getCardBadgeClasses,
  getCardColor,
  getCardTextClasses,
  getCardBorderClasses,
} from "@lib/util/card-colors"
import { CustomerCard, StoreMetadata } from "types/global"
import { CustomerCardModal } from "@modules/product/components/customer-card-modal"

const PAGE_SIZE = 10

dayjs.locale("vi")

type OrderProduct = {
  name?: string
  slug?: string
  images?: { url?: string; default?: string; thumbnail?: string }[]
  sale_price?: number | string
}

type OrderVariantImage = {
  id?: number
  documentId?: string
  url?: string
  formats?: {
    large?: { url?: string }
    small?: { url?: string }
    medium?: { url?: string }
    thumbnail?: { url?: string }
  } | null
}

type OrderVariant = {
  variant_value?: string
  sale_price?: number | string
  variant_image?: OrderVariantImage | null
  product?: OrderProduct
}

type OrderItem = {
  id: number
  quantity: number | string
  product?: OrderProduct
  variant?: OrderVariant | null
}

type OrderCustomerCardImage = {
  id?: number
  documentId?: string
  url?: string
  formats?: {
    large?: { url?: string }
    small?: { url?: string }
    medium?: { url?: string }
    thumbnail?: { url?: string }
  } | null
}

type OrderCustomerCard = {
  id: number
  quantity: number
  customer_card?: {
    title?: string
    discount?: number | string
    description?: string | null
    image?: OrderCustomerCardImage | null
  }
}

type OrderStatus =
  | "pending_approval"
  | "approved"
  | "shipping"
  | "completed"
  | "cancelled"
  | "refunded"

type Customer = {
  documentId?: string
  full_name?: string
  phone_number?: string
  address?: string
  dob?: string
}

type OrderEntity = {
  id: number
  documentId: string
  createdAt: string
  shipping_fee?: number | string | null
  order_status?: OrderStatus
  order_items?: OrderItem[]
  order_customer_cards?: OrderCustomerCard[]
  customer?: Customer
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

const toNumber = (value: unknown) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const getOrderStatusInfo = (status?: OrderStatus) => {
  switch (status) {
    case "pending_approval":
      return {
        text: "Chờ duyệt",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
      }
    case "approved":
    case "shipping":
      return {
        text: "Đang giao",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        borderColor: "border-purple-300",
      }
    case "completed":
      return {
        text: "Hoàn thành",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-300",
      }
    case "cancelled":
      return {
        text: "Đã hủy",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-300",
      }
    case "refunded":
      return {
        text: "Đã hoàn tiền",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-300",
      }
    default:
      return {
        text: "Chờ duyệt",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
      }
  }
}

export default function ReconciliationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isAuthenticated] = useState(true) // Always authenticated when this component is rendered
  const [orders, setOrders] = useState<OrderEntity[]>([])
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [openCardModal, setOpenCardModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CustomerCard | undefined>(
    undefined
  )
  // Lưu order details đã fetch để không fetch lại
  const [orderDetailsMap, setOrderDetailsMap] = useState<
    Record<number, OrderEntity>
  >({})
  const [loadingOrderDetails, setLoadingOrderDetails] = useState<
    Record<number, boolean>
  >({})
  // State cho việc update status
  const [updatingStatus, setUpdatingStatus] = useState<Record<number, boolean>>(
    {}
  )
  // State cho dialog confirm update status
  const [openStatusConfirmDialog, setOpenStatusConfirmDialog] = useState(false)
  const [orderToUpdateStatus, setOrderToUpdateStatus] =
    useState<OrderEntity | null>(null)
  const [newStatusToUpdate, setNewStatusToUpdate] =
    useState<OrderStatus | null>(null)
  // State cho invoice dialog
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false)
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] =
    useState<OrderEntity | null>(null)
  const [loadingInvoice, setLoadingInvoice] = useState<Record<number, boolean>>(
    {}
  )

  console.log({ selectedOrderForInvoice })

  const [storeMetadata, setStoreMetadata] = useState<StoreMetadata | null>(null)

  // Filter state - sẽ được sync với URL query params
  const [phoneNumber, setPhoneNumber] = useState("")
  const [orderId, setOrderId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null)
  const [dateTo, setDateTo] = useState<Dayjs | null>(null)

  // Snackbar state for copy notification
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  // Function để update URL query params
  const updateURLParams = (updates: {
    phoneNumber?: string
    orderId?: string
    customerName?: string
    status?: OrderStatus | "all"
    dateFrom?: Dayjs | null
    dateTo?: Dayjs | null
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
    if (updates.orderId !== undefined) {
      if (updates.orderId) {
        params.set("orderId", updates.orderId)
      } else {
        params.delete("orderId")
      }
    }
    if (updates.customerName !== undefined) {
      if (updates.customerName) {
        params.set("customerName", updates.customerName)
      } else {
        params.delete("customerName")
      }
    }
    if (updates.status !== undefined) {
      if (updates.status && updates.status !== "all") {
        params.set("status", updates.status)
      } else {
        params.delete("status")
      }
    }
    if (updates.dateFrom !== undefined) {
      if (updates.dateFrom) {
        params.set("dateFrom", updates.dateFrom.format("YYYY-MM-DD"))
      } else {
        params.delete("dateFrom")
      }
    }
    if (updates.dateTo !== undefined) {
      if (updates.dateTo) {
        params.set("dateTo", updates.dateTo.format("YYYY-MM-DD"))
      } else {
        params.delete("dateTo")
      }
    }
    if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set("page", updates.page.toString())
      } else {
        params.delete("page")
      }
    }

    router.push(`/admin?tab=orders&${params.toString()}`, { scroll: false })
  }

  // Fetch store metadata
  useEffect(() => {
    const fetchStoreMetadata = async () => {
      try {
        const response = await fetch("/api/store-metadata")
        if (response.ok) {
          const data = await response.json()
          setStoreMetadata(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch store metadata:", error)
      }
    }
    fetchStoreMetadata()
  }, [])

  // Đọc query params từ URL khi component mount hoặc URL thay đổi
  useEffect(() => {
    const phoneNumberParam = searchParams.get("phoneNumber") || ""
    const orderIdParam = searchParams.get("orderId") || ""
    const customerNameParam = searchParams.get("customerName") || ""
    let statusParam =
      (searchParams.get("status") as OrderStatus | "all") || "all"
    // Convert "approved" thành "shipping" vì đã gộp lại
    if (statusParam === "approved") {
      statusParam = "shipping"
      // Update URL để đồng nhất
      updateURLParams({ status: "shipping" })
    }
    const dateFromParam = searchParams.get("dateFrom")
    const dateToParam = searchParams.get("dateTo")
    const pageParam = searchParams.get("page")

    setPhoneNumber(phoneNumberParam)
    setOrderId(orderIdParam)
    setCustomerName(customerNameParam)
    setStatusFilter(statusParam)
    setDateFrom(dateFromParam ? dayjs(dateFromParam) : null)
    setDateTo(dateToParam ? dayjs(dateToParam) : null)

    if (pageParam) {
      const page = parseInt(pageParam, 10)
      if (!isNaN(page) && page > 0) {
        setPagination((prev) => ({ ...prev, page }))
      }
    }
  }, [searchParams])

  const fetchOrders = async (targetPage?: number) => {
    setLoading(true)
    setError("")

    try {
      // Đọc filter từ URL query params
      const currentPhoneNumber = searchParams.get("phoneNumber") || ""
      const currentOrderId = searchParams.get("orderId") || ""
      const currentCustomerName = searchParams.get("customerName") || ""
      let currentStatusFilter =
        (searchParams.get("status") as OrderStatus | "all") || "all"
      // Convert "approved" thành "shipping" vì đã gộp lại
      if (currentStatusFilter === "approved") {
        currentStatusFilter = "shipping"
      }
      const currentDateFrom = searchParams.get("dateFrom")
      const currentDateTo = searchParams.get("dateTo")
      const currentPage =
        targetPage || parseInt(searchParams.get("page") || "1", 10)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
      })

      if (currentPhoneNumber) params.set("phoneNumber", currentPhoneNumber)
      if (currentOrderId) params.set("orderId", currentOrderId)
      if (currentCustomerName) params.set("customerName", currentCustomerName)
      if (currentStatusFilter && currentStatusFilter !== "all") {
        params.set("status", currentStatusFilter)
      }
      if (currentDateFrom) {
        params.set("dateFrom", currentDateFrom)
      }
      if (currentDateTo) {
        params.set("dateTo", currentDateTo)
      }

      const res = await fetch(`/api/admin/orders?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          // Authentication error - parent component will handle
          return
        }
        throw new Error(data?.error || "Không thể tải danh sách đơn hàng.")
      }

      const resultOrders: OrderEntity[] = data?.data || []
      setOrders(resultOrders)

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

      // Không auto expand khi load danh sách
      setExpandedOrderId(null)
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách đơn hàng.")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Track previous filter values để tránh fetch không cần thiết
  const prevFiltersRef = useRef<string | null>(null)
  const hasMountedRef = useRef(false)

  // Fetch orders khi authenticated hoặc khi filter params thay đổi
  useEffect(() => {
    if (!isAuthenticated) return

    // Chỉ fetch khi tab là "orders" hoặc không có tab (default là orders)
    const currentTab = searchParams.get("tab") || "orders"
    if (currentTab !== "orders") return

    // Lấy các filter params hiện tại (bỏ qua tab param)
    const currentFilters = JSON.stringify({
      phoneNumber: searchParams.get("phoneNumber") || "",
      orderId: searchParams.get("orderId") || "",
      customerName: searchParams.get("customerName") || "",
      status: searchParams.get("status") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      page: searchParams.get("page") || "1",
    })

    // Lần đầu mount: luôn fetch
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      prevFiltersRef.current = currentFilters
      fetchOrders()
      return
    }

    // Các lần sau: chỉ fetch nếu filter params thay đổi
    if (prevFiltersRef.current !== currentFilters) {
      prevFiltersRef.current = currentFilters
      fetchOrders()
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
      orderId,
      customerName,
      status: statusFilter,
      dateFrom,
      dateTo,
      page: 1,
    })
  }

  const handleReset = () => {
    // Reset tất cả filters và xóa query params
    updateURLParams({
      phoneNumber: "",
      orderId: "",
      customerName: "",
      status: "all",
      dateFrom: null,
      dateTo: null,
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

  const printInvoiceFromIframe = () => {
    if (!selectedOrderForInvoice) return

    // Tạo iframe ẩn
    const iFrame = document.createElement("iframe")
    document.body.appendChild(iFrame)
    iFrame.style.display = "none"
    iFrame.style.width = "0"
    iFrame.style.height = "0"
    iFrame.style.border = "none"

    // Lấy nội dung invoice
    const invoiceContent = document.querySelector(".invoice-content")
    if (!invoiceContent) {
      document.body.removeChild(iFrame)
      return
    }

    // Clone nội dung và thêm vào iframe
    iFrame.onload = () => {
      setTimeout(() => {
        if (iFrame.contentDocument && iFrame.contentWindow) {
          const iframeDoc = iFrame.contentDocument
          const iframeBody = iframeDoc.body

          // Clone nội dung
          const clonedContent = invoiceContent.cloneNode(true) as HTMLElement

          // Tạo style tag với CSS print
          const style = iframeDoc.createElement("style")
          style.textContent = `
            @media print {
              @page {
                size: 58mm auto;
                margin: 0;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              body {
                margin: 0;
                padding: 2mm;
                font-family: Arial, sans-serif;
                width: 58mm;
              }
              body > * {
                width: 100%;
                margin: 0;
              }
              body * {
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                opacity: 1 !important;
              }
            }
            body {
              font-family: Arial, sans-serif;
              color: black;
              margin: 0;
              padding: 2mm;
              width: 58mm;
              font-size: 10px;
            }
            body > * {
              width: 100%;
            }
            * {
              color: black !important;
            }
          `

          iframeDoc.head.appendChild(style)
          iframeBody.appendChild(clonedContent)

          // In
          iFrame.focus()
          iFrame.contentWindow.print()

          // Cleanup sau khi in
          setTimeout(() => {
            document.body.removeChild(iFrame)
          }, 1000)
        }
      }, 100)
    }

    // Set src để trigger onload
    iFrame.src = "about:blank"
  }

  const fetchOrderDetail = async (
    order: OrderEntity
  ): Promise<OrderEntity | null> => {
    // Nếu đã fetch rồi thì không fetch lại, return data đã có
    if (orderDetailsMap[order.id]) {
      return orderDetailsMap[order.id]
    }

    setLoadingOrderDetails((prev) => ({ ...prev, [order.id]: true }))

    try {
      const response = await fetch(`/api/admin/orders/${order.documentId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch order detail")
      }

      const data = await response.json()
      if (data.data) {
        // Đảm bảo giữ lại customer từ order ban đầu nếu API không trả về
        const detailedOrder = {
          ...data.data,
          customer: data.data.customer || order.customer,
        }
        setOrderDetailsMap((prev) => ({
          ...prev,
          [order.id]: detailedOrder,
        }))
        // Cập nhật order trong danh sách với data đầy đủ
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === order.id ? detailedOrder : o))
        )
        return detailedOrder
      }
      return null
    } catch (error) {
      console.error("Error fetching order detail:", error)
      return null
    } finally {
      setLoadingOrderDetails((prev) => ({ ...prev, [order.id]: false }))
    }
  }

  const handleToggleExpand = (order: OrderEntity) => {
    const isCurrentlyExpanded = expandedOrderId === order.id

    if (isCurrentlyExpanded) {
      // Đóng
      setExpandedOrderId(null)
    } else {
      // Mở - fetch detail nếu chưa có
      setExpandedOrderId(order.id)
      if (!orderDetailsMap[order.id]) {
        fetchOrderDetail(order)
      }
    }
  }

  const handleStatusChange = (order: OrderEntity, newStatus: OrderStatus) => {
    // Nếu order hiện tại là "approved" và user chọn "shipping" (Đang giao),
    // thì không cần update vì đã gộp lại
    if (order.order_status === "approved" && newStatus === "shipping") {
      return
    }

    // Nếu status không đổi, không cần update
    if (order.order_status === newStatus) {
      return
    }

    // Mở dialog confirm
    setOrderToUpdateStatus(order)
    setNewStatusToUpdate(newStatus)
    setOpenStatusConfirmDialog(true)
  }

  const handleCloseStatusConfirmDialog = () => {
    setOpenStatusConfirmDialog(false)
    setOrderToUpdateStatus(null)
    setNewStatusToUpdate(null)
  }

  const handleConfirmStatusUpdate = async () => {
    if (!orderToUpdateStatus || !newStatusToUpdate) {
      return
    }

    const order = orderToUpdateStatus
    const newStatus = newStatusToUpdate

    setUpdatingStatus((prev) => ({ ...prev, [order.id]: true }))

    try {
      const response = await fetch(
        `/api/admin/orders/${order.documentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error || "Failed to update order status")
      }

      // Cập nhật order trong danh sách
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, order_status: newStatus } : o
        )
      )

      // Cập nhật order trong orderDetailsMap nếu có
      if (orderDetailsMap[order.id]) {
        setOrderDetailsMap((prev) => ({
          ...prev,
          [order.id]: { ...orderDetailsMap[order.id], order_status: newStatus },
        }))
      }

      // Đóng dialog
      handleCloseStatusConfirmDialog()
    } catch (error: any) {
      console.error("Error updating order status:", error)
      setError(error?.message || "Không thể cập nhật trạng thái đơn hàng")
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [order.id]: false }))
    }
  }

  // Kiểm tra xem order có thể thay đổi trạng thái không
  const canChangeStatus = (status?: OrderStatus) => {
    return (
      status === "pending_approval" ||
      status === "approved" ||
      status === "shipping"
    )
  }

  // Lấy danh sách trạng thái có thể chọn (gộp approved và shipping thành "Đang giao")
  const getAvailableStatuses = (currentStatus?: OrderStatus) => {
    const allStatuses: { value: OrderStatus; label: string }[] = [
      { value: "pending_approval", label: "Chờ duyệt" },
      { value: "shipping", label: "Đang giao" }, // Gộp approved và shipping
      { value: "completed", label: "Hoàn thành" },
      { value: "cancelled", label: "Đã hủy" },
      { value: "refunded", label: "Đã hoàn tiền" },
    ]

    // Nếu là pending_approval, có thể chuyển sang shipping (Đang giao) hoặc cancelled
    if (currentStatus === "pending_approval") {
      return allStatuses.filter(
        (s) => s.value === "shipping" || s.value === "cancelled"
      )
    }

    // Nếu là approved hoặc shipping, có thể chuyển sang completed
    if (currentStatus === "approved" || currentStatus === "shipping") {
      return allStatuses.filter((s) => s.value === "completed")
    }

    return allStatuses
  }

  // Lấy label hiển thị cho status (gộp approved và shipping thành "Đang giao")
  const getStatusLabel = (status?: OrderStatus): string => {
    if (status === "approved" || status === "shipping") {
      return "Đang giao"
    }
    const statusMap: Record<OrderStatus, string> = {
      pending_approval: "Chờ duyệt",
      approved: "Đang giao",
      shipping: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      refunded: "Đã hoàn tiền",
    }
    return statusMap[status as OrderStatus] || "Chờ duyệt"
  }

  const renderOrderItems = (order: OrderEntity) => {
    const items = order.order_items || []

    if (items.length === 0) {
      return <p className="text-sm text-gray-500">Không có sản phẩm.</p>
    }

    return (
      <div className="space-y-3">
        {items.map((item) => {
          const variant = item.variant
          const product = variant?.product || item.product

          let imageSrc = "/logo.png"
          if (variant?.variant_image?.url) {
            imageSrc = variant.variant_image.url
          } else if (variant?.variant_image?.formats?.large?.url) {
            imageSrc = variant.variant_image.formats.large.url
          } else if (variant?.variant_image?.formats?.medium?.url) {
            imageSrc = variant.variant_image.formats.medium.url
          } else if (product?.images?.[0]?.url) {
            imageSrc = product.images[0].url
          } else if (product?.images?.[0]?.default) {
            imageSrc = product.images[0].default
          }
          const productName = product?.name || "Sản phẩm"
          const variantName = variant?.variant_value
          const price = toNumber(
            variant?.sale_price ?? product?.sale_price ?? 0
          )
          const quantity = toNumber(item.quantity)
          const productSlug = product?.slug

          return (
            <Link
              key={item.id}
              href={productSlug ? `/product/${productSlug}` : "#"}
              target="_blank"
              className="flex flex-col pb-2 lg:pb-4 cursor-pointer"
              style={{ borderBottom: "1px solid #e0e0e0" }}
            >
              <div className="flex lg:space-x-6 space-x-4 w-full">
                <div className="relative w-20 lg:w-24 h-20 lg:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-stone-50">
                  <img
                    src={imageSrc}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-1 w-full">
                  <h4 className="font-semibold text-sm lg:text-base text-gray-900 line-clamp-2">
                    {productName}
                  </h4>
                  <div className="w-full space-x-2 flex justify-between">
                    {variantName && (
                      <span className="text-sm lg:text-base text-gray-500">
                        • {variantName}
                      </span>
                    )}
                    <span className="text-sm lg:text-base text-gray-500 font-semibold">
                      x{quantity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col justify-center gap-1 flex-shrink-0">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Đơn giá
                  </p>
                  <p className="text-sm lg:text-base font-semibold text-pink-700">
                    {formatBigNumber(price, true)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Tổng: {formatBigNumber(price * quantity, true)}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  const renderOrderCards = (order: OrderEntity) => {
    const cards = order.order_customer_cards || []
    if (cards.length === 0) {
      return null
    }

    return (
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-gray-900">
          Thẻ tích điểm ghi nhận
        </h4>
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const baseCard = card.customer_card as any
            const color = getCardColor(baseCard)
            const discount = toNumber(baseCard?.discount)
            const title = baseCard?.title || "Thẻ tích điểm"
            const imageSrc = baseCard?.image?.url
              ? baseCard.image.url
              : baseCard?.image?.formats?.large?.url
              ? baseCard.image.formats.large.url
              : baseCard?.image?.formats?.medium?.url
              ? baseCard.image.formats.medium.url
              : baseCard?.image?.default || "/logo.png"
            const handleCardClick = () => {
              const customerCard = {
                id: baseCard?.id || 0,
                documentId: baseCard?.documentId || "",
                title: title,
                description: baseCard?.description || "",
                discount: discount,
                image: baseCard?.image
                  ? {
                      default: imageSrc,
                      small: baseCard.image.formats?.small?.url || imageSrc,
                      thumbnail:
                        baseCard.image.formats?.thumbnail?.url || imageSrc,
                    }
                  : {
                      default: "/logo.png",
                      small: "/logo.png",
                      thumbnail: "/logo.png",
                    },
                index: 0,
                products: [],
                createdAt: "",
                updatedAt: "",
                publishedAt: "",
              } as CustomerCard
              setSelectedCard(customerCard)
              setOpenCardModal(true)
            }

            return (
              <div
                key={card.id}
                onClick={handleCardClick}
                className={`${getCardBgClasses(
                  color
                )} border rounded-2xl relative cursor-pointer transition hover:shadow-lg`}
              >
                <span
                  className={`absolute -top-2 -right-2 ${getCardBadgeClasses(
                    color
                  )} text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg z-20 border-2 border-white`}
                >
                  x{card.quantity}
                </span>
                <div className="relative w-full overflow-hidden rounded-t-2xl bg-white">
                  <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className={`p-4 border-t ${getCardBorderClasses(color)}`}>
                  <h4
                    className={`${getCardTextClasses(
                      color
                    )} text-base font-bold line-clamp-2 mb-2`}
                  >
                    {title}
                  </h4>
                </div>
              </div>
            )
          })}
        </div>
        <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 pt-2">
          {cards.map((card) => {
            const baseCard = card.customer_card as any
            const color = getCardColor(baseCard)
            const discount = toNumber(baseCard?.discount)
            const title = baseCard?.title || "Thẻ tích điểm"
            const imageSrc = baseCard?.image?.url
              ? baseCard.image.url
              : baseCard?.image?.formats?.large?.url
              ? baseCard.image.formats.large.url
              : baseCard?.image?.formats?.medium?.url
              ? baseCard.image.formats.medium.url
              : baseCard?.image?.default || "/logo.png"

            const handleCardClick = () => {
              const customerCard = {
                id: baseCard?.id || 0,
                documentId: baseCard?.documentId || "",
                title: title,
                description: baseCard?.description || "",
                discount: discount,
                image: baseCard?.image
                  ? {
                      default: imageSrc,
                      small: baseCard.image.formats?.small?.url || imageSrc,
                      thumbnail:
                        baseCard.image.formats?.thumbnail?.url || imageSrc,
                    }
                  : {
                      default: "/logo.png",
                      small: "/logo.png",
                      thumbnail: "/logo.png",
                    },
                index: 0,
                products: [],
                createdAt: "",
                updatedAt: "",
                publishedAt: "",
              } as CustomerCard
              setSelectedCard(customerCard)
              setOpenCardModal(true)
            }

            return (
              <div
                key={card.id}
                onClick={handleCardClick}
                className={`${getCardBgClasses(
                  color
                )} border rounded-2xl p-3 flex-shrink-0 w-[220px] relative overflow-visible shadow-sm cursor-pointer`}
              >
                <span
                  className={`absolute -top-2 -right-2 ${getCardBadgeClasses(
                    color
                  )} text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg z-20 border-2 border-white`}
                >
                  x{card.quantity}
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
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderOrderSummary = (order: OrderEntity) => {
    const items = order.order_items || []
    const subtotal = items.reduce((sum, item) => {
      const unitPrice = toNumber(
        item.variant?.sale_price ?? item.product?.sale_price ?? 0
      )
      return sum + unitPrice * toNumber(item.quantity || 0)
    }, 0)
    const shippingFee = toNumber(order.shipping_fee)

    return (
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Thành tiền:</span>
          <span className="font-semibold">
            {formatBigNumber(subtotal, true)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold">
            {shippingFee === 0
              ? "Miễn phí"
              : formatBigNumber(shippingFee, true)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tìm kiếm & Lọc
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <TextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            size="small"
            placeholder="0901234567"
          />
          <TextField
            label="Mã đơn hàng"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            size="small"
            placeholder="Nhập mã đơn hàng"
          />
          <TextField
            label="Tên khách hàng"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            size="small"
            placeholder="Nhập tên khách hàng"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <FormControl size="small" fullWidth>
            <InputLabel>Trạng thái đơn</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái đơn"
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending_approval">Chờ duyệt</MenuItem>
              <MenuItem value="shipping">Đang giao</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
              <MenuItem value="refunded">Đã hoàn tiền</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Từ ngày"
              value={dateFrom}
              onChange={(newValue) => setDateFrom(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Đến ngày"
              value={dateTo}
              onChange={(newValue) => setDateTo(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>
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
              className="border border-stone-200 rounded-2xl bg-white shadow-sm"
            >
              <div className="flex flex-row items-center gap-3 lg:gap-6 justify-between p-4 lg:p-6">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Skeleton variant="text" width={60} height={16} />
                  <Skeleton variant="text" width={180} height={20} />
                </div>
                <Skeleton variant="circular" width={32} height={32} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {orders.length === 0 && !error && (
            <div className="text-center py-12 lg:py-16 border border-dashed rounded-2xl bg-white">
              <p className="text-sm lg:text-base text-gray-600">
                Không tìm thấy đơn hàng nào.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {orders.map((order) => {
              const orderItems = order.order_items || []
              const isExpanded = expandedOrderId === order.id
              const createdDate = dayjs(order.createdAt).format(
                "DD/MM/YYYY HH:mm"
              )
              const totalProducts = orderItems.reduce(
                (sum, item) => sum + toNumber(item.quantity || 0),
                0
              )
              const orderTotal = orderItems.reduce((sum, item) => {
                const unitPrice = toNumber(
                  item.variant?.sale_price ?? item.product?.sale_price ?? 0
                )
                return sum + unitPrice * toNumber(item.quantity || 0)
              }, 0)

              const statusInfo = getOrderStatusInfo(order.order_status)

              const items = order.order_items || []
              const subtotal = items.reduce((sum, item) => {
                const unitPrice = toNumber(
                  item.variant?.sale_price ?? item.product?.sale_price ?? 0
                )
                return sum + unitPrice * toNumber(item.quantity || 0)
              }, 0)
              const shippingFee = toNumber(order.shipping_fee)
              const totalItems = items.reduce(
                (sum, item) => sum + toNumber(item.quantity || 0),
                0
              )

              return (
                <div
                  key={order.id}
                  className="border border-stone-200 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="cursor-pointer flex flex-row items-center gap-3 lg:gap-6 justify-between p-4 lg:p-6">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">
                          Mã đơn:
                        </p>
                        <span className="text-xs !uppercase lg:text-sm font-semibold text-pink-700">
                          {order.documentId}
                        </span>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(order.documentId, "mã đơn hàng")
                          }
                          className="!p-1 !h-6 !w-6"
                          title="Copy mã đơn hàng"
                        >
                          <ContentCopyIcon className="!h-3 !w-3 text-gray-500 hover:text-gray-700" />
                        </IconButton>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor} border ${statusInfo.borderColor}`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>
                      <p className="text-sm lg:text-base text-gray-600 truncate">
                        Ngày đặt: {createdDate}
                      </p>
                      {order.customer && (
                        <div className="text-xs lg:text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-semibold">Khách hàng:</span>{" "}
                            {order.customer.full_name || "N/A"}
                          </p>
                          <div className="flex items-center gap-2">
                            <p>
                              <span className="font-semibold">SĐT:</span>{" "}
                              {order.customer.phone_number || "N/A"}
                            </p>
                            {order.customer?.phone_number && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleCopy(
                                    order.customer?.phone_number || "",
                                    "số điện thoại"
                                  )
                                }
                                className="!p-1 !h-5 !w-5"
                                title="Copy số điện thoại"
                              >
                                <ContentCopyIcon className="!h-3 !w-3 text-gray-500 hover:text-gray-700" />
                              </IconButton>
                            )}
                          </div>
                          {order.customer.address && (
                            <p>
                              <span className="font-semibold">Địa chỉ:</span>{" "}
                              {order.customer.address}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                      <IconButton
                        onClick={() => handleToggleExpand(order)}
                        disabled={loadingOrderDetails[order.id]}
                        className={`transition-transform text-pink-700 hover:bg-pink-50 flex-shrink-0 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        size="small"
                      >
                        <ExpandMoreRoundedIcon />
                      </IconButton>
                    </div>
                  </div>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <div className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-6">
                      {loadingOrderDetails[order.id] ? (
                        <div className="flex justify-center py-8">
                          <CircularProgress size={24} />
                        </div>
                      ) : (
                        <>
                          {renderOrderItems(orderDetailsMap[order.id] || order)}
                          {renderOrderCards(orderDetailsMap[order.id] || order)}
                          {renderOrderSummary(
                            orderDetailsMap[order.id] || order
                          )}
                        </>
                      )}
                    </div>
                  </Collapse>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pt-2 border-t p-3 lg:p-4">
                    <span className="font-semibold text-gray-900">
                      Tổng ({totalItems} sản phẩm)
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          loadingInvoice[order.id] ? (
                            <CircularProgress size={16} />
                          ) : (
                            <ReceiptIcon />
                          )
                        }
                        onClick={async () => {
                          // Nếu chưa có detail, fetch trước
                          if (!orderDetailsMap[order.id]) {
                            setLoadingInvoice((prev) => ({
                              ...prev,
                              [order.id]: true,
                            }))
                            try {
                              const detailedOrder = await fetchOrderDetail(
                                order
                              )
                              if (detailedOrder) {
                                // Đảm bảo giữ lại customer từ order ban đầu
                                const orderWithCustomer = {
                                  ...detailedOrder,
                                  customer:
                                    detailedOrder.customer || order.customer,
                                }
                                setSelectedOrderForInvoice(orderWithCustomer)
                                setOpenInvoiceDialog(true)
                              } else {
                                // Fallback to basic order if fetch fails
                                setSelectedOrderForInvoice(order)
                                setOpenInvoiceDialog(true)
                              }
                            } catch (error) {
                              console.error(
                                "Failed to fetch order detail:",
                                error
                              )
                              // Fallback to basic order if fetch fails
                              setSelectedOrderForInvoice(order)
                              setOpenInvoiceDialog(true)
                            } finally {
                              setLoadingInvoice((prev) => ({
                                ...prev,
                                [order.id]: false,
                              }))
                            }
                          } else {
                            // Đảm bảo giữ lại customer từ order ban đầu
                            const orderFromMap = orderDetailsMap[order.id]
                            const orderWithCustomer = {
                              ...orderFromMap,
                              customer: orderFromMap.customer || order.customer,
                            }
                            setSelectedOrderForInvoice(orderWithCustomer)
                            setOpenInvoiceDialog(true)
                          }
                        }}
                        disabled={loadingInvoice[order.id]}
                        className="!normal-case !font-semibold !text-neutral-900 !border-neutral-900"
                      >
                        {loadingInvoice[order.id]
                          ? "Đang tải..."
                          : "Export hóa đơn"}
                      </Button>
                      {canChangeStatus(order.order_status) && (
                        <FormControl size="small" className="!min-w-[150px]">
                          <InputLabel>Trạng thái</InputLabel>
                          <Select
                            value={order.order_status || "pending_approval"}
                            label="Trạng thái"
                            onChange={(e) =>
                              handleStatusChange(
                                order,
                                e.target.value as OrderStatus
                              )
                            }
                            disabled={updatingStatus[order.id]}
                            className="!normal-case"
                            renderValue={(value) =>
                              getStatusLabel(value as OrderStatus)
                            }
                          >
                            {getAvailableStatuses(order.order_status).map(
                              (status) => (
                                <MenuItem
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                  {updatingStatus[order.id] && (
                                    <CircularProgress
                                      size={16}
                                      className="ml-2"
                                    />
                                  )}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      )}
                      <span className="font-bold text-pink-700 text-lg">
                        {formatBigNumber(subtotal + shippingFee, true)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {orders.length > 0 && (
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mt-6 border-t pt-4">
              <span className="text-sm text-gray-500">
                Trang {pagination.page} / {pagination.pageCount} (Tổng:{" "}
                {pagination.total} đơn hàng)
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

      <CustomerCardModal
        open={openCardModal}
        onClose={() => setOpenCardModal(false)}
        card={selectedCard}
      />

      {/* Dialog confirm update status */}
      <Dialog
        open={openStatusConfirmDialog}
        onClose={handleCloseStatusConfirmDialog}
        aria-labelledby="status-confirm-dialog-title"
        aria-describedby="status-confirm-dialog-description"
      >
        <DialogTitle
          id="status-confirm-dialog-title"
          className="!font-semibold !my-4"
        >
          Xác nhận cập nhật trạng thái
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="status-confirm-dialog-description">
            Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng{" "}
            <strong className="uppercase">
              {orderToUpdateStatus?.documentId}
            </strong>{" "}
            từ{" "}
            <strong>{getStatusLabel(orderToUpdateStatus?.order_status)}</strong>{" "}
            sang{" "}
            <strong>{getStatusLabel(newStatusToUpdate || undefined)}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="mx-3 mb-3">
          <Button
            onClick={handleCloseStatusConfirmDialog}
            disabled={
              orderToUpdateStatus
                ? updatingStatus[orderToUpdateStatus.id]
                : false
            }
            color="inherit"
            className="!normal-case !font-semibold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmStatusUpdate}
            color="primary"
            variant="contained"
            disabled={
              orderToUpdateStatus
                ? updatingStatus[orderToUpdateStatus.id]
                : false
            }
            startIcon={
              orderToUpdateStatus && updatingStatus[orderToUpdateStatus.id] ? (
                <CircularProgress size={16} />
              ) : null
            }
            className="!bg-neutral-900 !text-white !normal-case !font-semibold"
          >
            {orderToUpdateStatus && updatingStatus[orderToUpdateStatus.id]
              ? "Đang xử lý..."
              : "Đồng ý"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invoice Dialog */}
      {openInvoiceDialog && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
              @page {
                size: 58mm auto;
                margin: 0;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              body * {
                visibility: hidden;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content,
              .invoice-content * {
                visibility: visible !important;
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                opacity: 1 !important;
              }
              .invoice-content {
                position: relative !important;
                left: 0 !important;
                top: 0 !important;
                width: 58mm !important;
                margin: 0 !important;
                padding: 2mm !important;
                box-sizing: border-box !important;
                overflow: visible !important;
                font-size: 10px !important;
                font-weight: 700 !important;
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                opacity: 1 !important;
              }
              .invoice-content * {
                color: black !important;
                font-weight: 700 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                opacity: 1 !important;
              }
              .invoice-content h1 {
                font-size: 14px !important;
                font-weight: 900 !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content h2 {
                font-size: 12px !important;
                font-weight: 800 !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content p,
              .invoice-content span,
              .invoice-content div {
                font-size: 10px !important;
                font-weight: 700 !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content strong {
                font-weight: 900 !important;
                color: black !important;
                text-transform: uppercase !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content .uppercase,
              .invoice-content [class*="uppercase"] {
                text-transform: uppercase !important;
              }
              .invoice-content .text-gray-600,
              .invoice-content .text-gray-700,
              .invoice-content .text-gray-500,
              .invoice-content .text-gray-400 {
                color: black !important;
                font-weight: 700 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content .text-pink-700 {
                color: black !important;
                font-weight: 900 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content table {
                width: 100%;
                table-layout: fixed;
                font-size: 15px !important;
                font-weight: 700 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content th,
              .invoice-content td {
                padding: 2px 3px;
                word-wrap: break-word;
                overflow-wrap: break-word;
                font-size: 9px !important;
                font-weight: 700 !important;
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content .text-right {
                white-space: nowrap;
              }
              .MuiDialog-root {
                position: relative;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .MuiDialog-paper {
                margin: 0 !important;
                max-width: 58mm !important;
                width: 58mm !important;
                height: auto !important;
                box-shadow: none !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .MuiDialogTitle-root {
                display: none !important;
              }
              .MuiDialogContent-root {
                padding: 0 !important;
                overflow: visible !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          `,
          }}
        />
      )}
      <Dialog
        open={openInvoiceDialog}
        onClose={() => setOpenInvoiceDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            "@media print": {
              width: "297mm",
              height: "420mm", // A3 size
              margin: 0,
              maxWidth: "none",
              boxShadow: "none",
            },
          },
        }}
      >
        <DialogTitle className="!font-semibold !flex !justify-between !items-center">
          <span>Hóa đơn</span>
          <div className="flex gap-2">
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={printInvoiceFromIframe}
              className="!bg-neutral-900 !text-white !normal-case !font-semibold"
            >
              In hoá đơn
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenInvoiceDialog(false)
              }}
              className="!normal-case !font-semibold"
            >
              Đóng
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedOrderForInvoice && (
            <div
              className="invoice-content"
              style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                position: "relative",
              }}
            >
              {/* Invoice Header */}
              <div className="text-center">
                <div
                  className="mb-1 flex justify-center"
                  style={{
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="DIVI"
                    width={100}
                    height={100}
                    style={{
                      width: "auto",
                      height: "100px",
                      objectFit: "contain",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      colorAdjust: "exact",
                    }}
                    className="print:block"
                  />
                </div>
                {(storeMetadata?.phone_number || storeMetadata?.address) && (
                  <div
                    className="mb-2 text-sm"
                    style={{
                      color: "black",
                      fontWeight: 700,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      colorAdjust: "exact",
                    }}
                  >
                    {storeMetadata?.phone_number && (
                      <p
                        style={{
                          color: "black",
                          fontWeight: 700,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        ĐT: {storeMetadata.phone_number}
                      </p>
                    )}
                    {storeMetadata?.address && (
                      <p
                        style={{
                          color: "black",
                          fontWeight: 700,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        {storeMetadata.address}
                      </p>
                    )}
                  </div>
                )}
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    color: "black",
                    fontWeight: 900,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  HÓA ĐƠN BÁN HÀNG
                </h1>
                <p
                  className="text-sm text-gray-600"
                  style={{
                    color: "black",
                    fontWeight: 700,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  Mã đơn:{" "}
                  <strong
                    className="!uppercase"
                    style={{
                      color: "black",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      colorAdjust: "exact",
                    }}
                  >
                    {selectedOrderForInvoice.documentId}
                  </strong>
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{
                    color: "black",
                    fontWeight: 700,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  Ngày đặt:{" "}
                  {dayjs(selectedOrderForInvoice.createdAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </p>
              </div>

              {/* Customer Info */}
              {selectedOrderForInvoice.customer && (
                <div className="mb-6 border-b pb-4">
                  <h2
                    className="text-lg font-semibold mb-2"
                    style={{
                      color: "black",
                      fontWeight: 800,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      colorAdjust: "exact",
                    }}
                  >
                    Thông tin khách hàng
                  </h2>
                  <div className="grid grid-cols-2 text-sm">
                    <span
                      style={{
                        color: "black",
                        fontWeight: 700,
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                        colorAdjust: "exact",
                      }}
                    >
                      <strong
                        style={{
                          color: "black",
                          fontWeight: 900,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        Tên:
                      </strong>{" "}
                      {selectedOrderForInvoice.customer.full_name || "N/A"}
                    </span>
                    <br />
                    <span
                      style={{
                        color: "black",
                        fontWeight: 700,
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                        colorAdjust: "exact",
                      }}
                    >
                      <strong
                        style={{
                          color: "black",
                          fontWeight: 900,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        SĐT:
                      </strong>{" "}
                      {selectedOrderForInvoice.customer.phone_number || "N/A"}
                    </span>
                    <br />
                    {selectedOrderForInvoice.customer.address && (
                      <span
                        className="col-span-2"
                        style={{
                          color: "black",
                          fontWeight: 700,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        <strong
                          style={{
                            color: "black",
                            fontWeight: 900,
                            WebkitPrintColorAdjust: "exact",
                            printColorAdjust: "exact",
                            colorAdjust: "exact",
                          }}
                        >
                          Địa chỉ:
                        </strong>{" "}
                        {selectedOrderForInvoice.customer.address}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <p>=====================================</p>
              {/* Order Items */}
              <div className="mb-6">
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{
                    color: "black",
                    fontWeight: 800,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  Chi tiết đơn hàng
                </h2>
                <div className="space-y-3">
                  {(selectedOrderForInvoice.order_items || []).map(
                    (item, _) => {
                      const variant = item.variant
                      const product = variant?.product || item.product
                      const productName = product?.name || "N/A"
                      const unitPrice = toNumber(
                        variant?.sale_price ?? product?.sale_price ?? 0
                      )
                      const quantity = toNumber(item.quantity || 0)
                      const total = unitPrice * quantity

                      return (
                        <div key={item.id}>
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex-1">
                              <span
                                className="font-medium"
                                style={{
                                  color: "black",
                                  fontWeight: 700,
                                  WebkitPrintColorAdjust: "exact",
                                  printColorAdjust: "exact",
                                  colorAdjust: "exact",
                                }}
                              >
                                {productName}
                              </span>
                              {variant?.variant_value && (
                                <span
                                  className="text-gray-600 ml-2"
                                  style={{
                                    color: "black",
                                    fontWeight: 700,
                                    WebkitPrintColorAdjust: "exact",
                                    printColorAdjust: "exact",
                                    colorAdjust: "exact",
                                  }}
                                >
                                  ({variant.variant_value})
                                </span>
                              )}
                            </div>
                            <div
                              className="text-right ml-4"
                              style={{
                                color: "black",
                                fontWeight: 700,
                                WebkitPrintColorAdjust: "exact",
                                printColorAdjust: "exact",
                                colorAdjust: "exact",
                              }}
                            >
                              SL: {quantity} x{" "}
                              {formatBigNumber(unitPrice, true)}
                            </div>
                          </div>
                          <div
                            className="text-right text-gray-600"
                            style={{
                              color: "black",
                              fontWeight: 700,
                              WebkitPrintColorAdjust: "exact",
                              printColorAdjust: "exact",
                              colorAdjust: "exact",
                            }}
                          >
                            Thành tiền: {formatBigNumber(total, true)}
                          </div>
                          <p className="pb-3">
                            -----------------------------------------------------------------
                          </p>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <div className="flex justify-end">
                  <div
                    className="space-y-2"
                    style={{ minWidth: "300px", maxWidth: "400px" }}
                  >
                    <div className="flex justify-between text-sm">
                      <span
                        style={{
                          color: "black",
                          fontWeight: 700,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        Tiền hàng:
                      </span>
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          marginLeft: "10px",
                          color: "black",
                          fontWeight: 700,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        {formatBigNumber(
                          (selectedOrderForInvoice.order_items || []).reduce(
                            (sum, item) => {
                              const unitPrice = toNumber(
                                item.variant?.sale_price ??
                                  item.product?.sale_price ??
                                  0
                              )
                              return (
                                sum + unitPrice * toNumber(item.quantity || 0)
                              )
                            },
                            0
                          ),
                          true
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        style={{
                          color: "black",
                          fontWeight: 700,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        Phí vận chuyển:
                      </span>
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          marginLeft: "10px",
                          color: "black",
                          fontWeight: 700,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        {toNumber(selectedOrderForInvoice.shipping_fee) === 0
                          ? "Miễn phí"
                          : formatBigNumber(
                              toNumber(selectedOrderForInvoice.shipping_fee),
                              true
                            )}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span
                        style={{
                          color: "black",
                          fontWeight: 900,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        Tổng cộng:
                      </span>
                      <span
                        className="text-pink-700"
                        style={{
                          whiteSpace: "nowrap",
                          marginLeft: "10px",
                          color: "black",
                          fontWeight: 900,
                          WebkitPrintColorAdjust: "exact",
                          printColorAdjust: "exact",
                          colorAdjust: "exact",
                        }}
                      >
                        {formatBigNumber(
                          (selectedOrderForInvoice.order_items || []).reduce(
                            (sum, item) => {
                              const unitPrice = toNumber(
                                item.variant?.sale_price ??
                                  item.product?.sale_price ??
                                  0
                              )
                              return (
                                sum + unitPrice * toNumber(item.quantity || 0)
                              )
                            },
                            0
                          ) + toNumber(selectedOrderForInvoice.shipping_fee),
                          true
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="text-center text-sm text-gray-600 mt-8"
                style={{
                  color: "black",
                  fontWeight: 700,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  colorAdjust: "exact",
                }}
              >
                <p
                  style={{
                    color: "black",
                    fontWeight: 700,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  Cảm ơn quý khách đã mua hàng!
                </p>
              </div>
            </div>
          )}
        </DialogContent>
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
