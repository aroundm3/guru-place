"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/vi"
import Link from "next/link"
import * as XLSX from "xlsx"
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
import DownloadIcon from "@mui/icons-material/Download"
import {
  getCardBgClasses,
  getCardBadgeClasses,
  getCardColor,
  getCardTextClasses,
  getCardBorderClasses,
} from "@lib/util/card-colors"
import { CustomerCard, StoreMetadata } from "types/global"
import { CustomerCardModal } from "@modules/product/components/customer-card-modal"
import { useEmployees } from "@lib/context/employee-context"

const PAGE_SIZE = 10

dayjs.locale("vi")

type OrderProduct = {
  name?: string
  slug?: string
  images?: { url?: string; default?: string; thumbnail?: string }[]
  base_price?: number | string
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
  base_price?: number | string
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

type ExportSummaryRow = {
  productName: string
  variantName: string
  quantity: number
  unitPrice: number
  totalAmount: number
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
  employee?: string | null
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

type ItemPricing = {
  baseUnit: number
  saleUnit: number
  quantity: number
  baseLineTotal: number
  saleLineTotal: number
  lineDiscount: number
}

type OrderPricingSummary = {
  baseSubtotal: number
  saleSubtotal: number
  discountTotal: number
}

const getItemPricing = (item: OrderItem): ItemPricing => {
  const baseUnit = toNumber(
    item.variant?.base_price ?? item.product?.base_price ?? 0
  )
  const saleUnit = toNumber(
    item.variant?.sale_price ?? item.product?.sale_price ?? baseUnit
  )
  const quantity = toNumber(item.quantity || 0)
  const baseLineTotal = baseUnit * quantity
  const saleLineTotal = saleUnit * quantity
  const lineDiscount = Math.max(0, baseLineTotal - saleLineTotal)

  return {
    baseUnit,
    saleUnit,
    quantity,
    baseLineTotal,
    saleLineTotal,
    lineDiscount,
  }
}

const getOrderPricingSummary = (items: OrderItem[] = []): OrderPricingSummary =>
  items.reduce(
    (acc, item) => {
      const { baseLineTotal, saleLineTotal, lineDiscount } =
        getItemPricing(item)
      acc.baseSubtotal += baseLineTotal
      acc.saleSubtotal += saleLineTotal
      acc.discountTotal += lineDiscount
      return acc
    },
    { baseSubtotal: 0, saleSubtotal: 0, discountTotal: 0 }
  )

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
        text: "Hủy",
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
  const { employees } = useEmployees()

  const [isAuthenticated] = useState(true) // Always authenticated when this component is rendered
  const [orders, setOrders] = useState<OrderEntity[]>([])
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [loadingRevenue, setLoadingRevenue] = useState(false)
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
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [loadingQrCode, setLoadingQrCode] = useState(false)
  const [logoUrl, setLogoUrl] = useState("/logo.png")
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)

  console.log({ selectedOrderForInvoice })

  // Fetch QR code khi selectedOrderForInvoice thay đổi
  useEffect(() => {
    if (!selectedOrderForInvoice) {
      setQrCodeUrl(null)
      return
    }

    const generateQrCode = async () => {
      setLoadingQrCode(true)
      try {
        // Tính tổng tiền thanh toán (tiền hàng + phí ship)
        const subtotal = getOrderPricingSummary(
          selectedOrderForInvoice.order_items || []
        ).saleSubtotal
        const shippingFee = toNumber(selectedOrderForInvoice.shipping_fee)
        const totalAmount = subtotal + shippingFee

        console.log("Generating QR code for order:", {
          documentId: selectedOrderForInvoice.documentId,
          totalAmount,
        })

        const response = await fetch("/api/vietqr/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountNo: "272986868888",
            accountName: "VU THI THU TRANG",
            acqId: "970407",
            addInfo: selectedOrderForInvoice.documentId,
            amount: totalAmount,
            template: "qr_only",
          }),
        })

        console.log("QR code API response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("QR code API error:", errorData)
          throw new Error(errorData?.error || "Failed to generate QR code")
        }

        const data = await response.json()
        console.log("QR code API response data:", {
          hasData: !!data.data,
          hasQrDataURL: !!data?.data?.qrDataURL,
          hasQrCode: !!data?.data?.qrCode,
          keys: Object.keys(data),
          dataKeys: data.data ? Object.keys(data.data) : [],
        })

        // VietQR API trả về QR code image URL trong data.data.qrDataURL (base64 image)
        if (data?.data?.qrDataURL) {
          console.log("Setting QR code URL from data.data.qrDataURL")
          setQrCodeUrl(data.data.qrDataURL)
        } else if (data?.data?.qrCode) {
          console.log("Setting QR code URL from data.data.qrCode")
          setQrCodeUrl(data.data.qrCode)
        } else if (data?.qrDataURL) {
          console.log("Setting QR code URL from data.qrDataURL")
          setQrCodeUrl(data.qrDataURL)
        } else if (data?.qrCode) {
          console.log("Setting QR code URL from data.qrCode")
          setQrCodeUrl(data.qrCode)
        } else {
          console.warn("QR code URL not found in response:", data)
          setQrCodeUrl(null)
        }
      } catch (error) {
        console.error("Error generating QR code:", error)
        if (error instanceof Error) {
          console.error("Error message:", error.message)
          console.error("Error stack:", error.stack)
        }
        setQrCodeUrl(null)
      } finally {
        setLoadingQrCode(false)
      }
    }

    generateQrCode()
  }, [selectedOrderForInvoice])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogoUrl(`${window.location.origin}/logo.png`)
    }
  }, [])

  useEffect(() => {
    const fetchLogoAsDataUrl = async () => {
      try {
        const response = await fetch(logoUrl, { cache: "force-cache" })
        if (!response.ok) return
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setLogoDataUrl(reader.result)
          }
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.warn("Failed to load logo for printing:", error)
      }
    }

    if (logoUrl) {
      fetchLogoAsDataUrl()
    }
  }, [logoUrl])

  const [storeMetadata, setStoreMetadata] = useState<StoreMetadata | null>(null)

  // Filter state - sẽ được sync với URL query params
  const [phoneNumber, setPhoneNumber] = useState("")
  const [orderId, setOrderId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [employeeFilter, setEmployeeFilter] = useState<string>("all") // "all" | "unassigned" | employeeDocumentId
  // Default: 90 ngày gần nhất
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(
    dayjs().subtract(90, "day")
  )
  const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs())

  // Snackbar state for copy notification
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [exportingExcel, setExportingExcel] = useState(false)

  // Function để update URL query params
  const updateURLParams = (updates: {
    phoneNumber?: string
    orderId?: string
    customerName?: string
    status?: OrderStatus | "all"
    employee?: string
    dateFrom?: Dayjs | null
    dateTo?: Dayjs | null
    page?: number
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    // Xóa tab param để tránh duplicate khi push lại
    params.delete("tab")

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
    if (updates.employee !== undefined) {
      if (updates.employee && updates.employee !== "all") {
        params.set("employee", updates.employee)
      } else {
        params.delete("employee")
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
    if (hasFetchedStoreMetadataRef.current) return

    const fetchStoreMetadata = async () => {
      try {
        hasFetchedStoreMetadataRef.current = true
        const response = await fetch("/api/store-metadata")
        if (response.ok) {
          const data = await response.json()
          setStoreMetadata(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch store metadata:", error)
        hasFetchedStoreMetadataRef.current = false // Reset on error để có thể retry
      }
    }
    fetchStoreMetadata()
  }, [])

  // Set default date range (90 ngày gần nhất) khi mount lần đầu nếu không có trong URL
  useEffect(() => {
    const dateFromParam = searchParams.get("dateFrom")
    const dateToParam = searchParams.get("dateTo")

    // Chỉ set default và update URL 1 lần khi mount lần đầu nếu không có params trong URL
    if (!hasSetDefaultDateRef.current && (!dateFromParam || !dateToParam)) {
      hasSetDefaultDateRef.current = true
      const defaultDateFrom = dayjs().subtract(90, "day")
      const defaultDateTo = dayjs()

      setDateFrom(defaultDateFrom)
      setDateTo(defaultDateTo)

      // Update URL với default values (sẽ trigger fetch orders sau)
      updateURLParams({
        dateFrom: defaultDateFrom,
        dateTo: defaultDateTo,
      })
      return // Không đọc các params khác nữa, đợi URL update xong
    }

    // Nếu đã set default rồi hoặc đã có date trong URL, đọc tất cả params
    if (hasSetDefaultDateRef.current || (dateFromParam && dateToParam)) {
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
      const employeeParam = searchParams.get("employee") || "all"
      const pageParam = searchParams.get("page")

      setPhoneNumber(phoneNumberParam)
      setOrderId(orderIdParam)
      setCustomerName(customerNameParam)
      setStatusFilter(statusParam)
      setEmployeeFilter(employeeParam)

      // Set date từ URL params
      if (dateFromParam) {
        setDateFrom(dayjs(dateFromParam))
      }
      if (dateToParam) {
        setDateTo(dayjs(dateToParam))
      }

      if (pageParam) {
        const page = parseInt(pageParam, 10)
        if (!isNaN(page) && page > 0) {
          setPagination((prev) => ({ ...prev, page }))
        }
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
      const currentEmployeeFilter = searchParams.get("employee") || "all"
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
      if (currentEmployeeFilter && currentEmployeeFilter !== "all") {
        params.set("employee", currentEmployeeFilter)
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

  // Debounce timer cho fetchTotalRevenue
  const revenueDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch tổng doanh thu từ API endpoint riêng (tối ưu hơn)
  // Sử dụng debounce để tránh fetch quá nhiều lần
  const fetchTotalRevenue = async () => {
    // Clear previous debounce
    if (revenueDebounceRef.current) {
      clearTimeout(revenueDebounceRef.current)
    }

    // Debounce 500ms để tránh fetch quá nhiều lần khi filter thay đổi nhanh
    revenueDebounceRef.current = setTimeout(async () => {
      setLoadingRevenue(true)
      try {
        // Đọc filter từ URL query params (giống fetchOrders)
        const currentPhoneNumber = searchParams.get("phoneNumber") || ""
        const currentOrderId = searchParams.get("orderId") || ""
        const currentCustomerName = searchParams.get("customerName") || ""
        let currentStatusFilter =
          (searchParams.get("status") as OrderStatus | "all") || "all"
        if (currentStatusFilter === "approved") {
          currentStatusFilter = "shipping"
        }
        const currentDateFrom = searchParams.get("dateFrom")
        const currentDateTo = searchParams.get("dateTo")
        const currentEmployeeFilter = searchParams.get("employee") || "all"

        const params = new URLSearchParams()

        if (currentPhoneNumber) params.set("phoneNumber", currentPhoneNumber)
        if (currentOrderId) params.set("orderId", currentOrderId)
        if (currentCustomerName) params.set("customerName", currentCustomerName)
        if (currentStatusFilter && currentStatusFilter !== "all") {
          params.set("status", currentStatusFilter)
        }
        if (currentEmployeeFilter && currentEmployeeFilter !== "all") {
          params.set("employee", currentEmployeeFilter)
        }
        if (currentDateFrom) {
          params.set("dateFrom", currentDateFrom)
        }
        if (currentDateTo) {
          params.set("dateTo", currentDateTo)
        }

        // Gọi API endpoint riêng để tính tổng doanh thu (tối ưu hơn)
        const res = await fetch(
          `/api/admin/orders/revenue?${params.toString()}`
        )
        const data = await res.json()

        if (!res.ok) {
          setTotalRevenue(0)
          setLoadingRevenue(false)
          return
        }

        setTotalRevenue(data.totalRevenue || 0)
      } catch (err: any) {
        console.error("Error fetching total revenue:", err)
        setTotalRevenue(0)
      } finally {
        setLoadingRevenue(false)
      }
    }, 500) // Debounce 500ms
  }

  // Track previous filter values để tránh fetch không cần thiết
  const prevFiltersRef = useRef<string | null>(null)
  const hasMountedRef = useRef(false)
  const hasSetDefaultDateRef = useRef(false)
  const hasFetchedStoreMetadataRef = useRef(false)

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
      employee: searchParams.get("employee") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      page: searchParams.get("page") || "1",
    })

    // Lần đầu mount: đợi default date được set xong rồi mới fetch
    if (!hasMountedRef.current) {
      // Chỉ fetch nếu đã set default date (có dateFrom và dateTo trong URL)
      const hasDateFrom = searchParams.get("dateFrom")
      const hasDateTo = searchParams.get("dateTo")

      if (hasDateFrom && hasDateTo) {
        hasMountedRef.current = true
        prevFiltersRef.current = currentFilters
        fetchOrders()
        fetchTotalRevenue()
      }
      return
    }

    // Các lần sau: chỉ fetch nếu filter params thay đổi
    if (prevFiltersRef.current !== currentFilters) {
      prevFiltersRef.current = currentFilters
      fetchOrders()
      // Fetch tổng doanh thu khi filter thay đổi
      fetchTotalRevenue()
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
      employee: employeeFilter,
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
      employee: "all",
      dateFrom: null,
      dateTo: null,
      page: 1,
    })
  }

  const handleExportExcel = async () => {
    if (exportingExcel) return
    setExportingExcel(true)

    try {
      const currentPhoneNumber = searchParams.get("phoneNumber") || ""
      const currentOrderId = searchParams.get("orderId") || ""
      const currentCustomerName = searchParams.get("customerName") || ""
      let currentStatusFilter =
        (searchParams.get("status") as OrderStatus | "all") || "all"
      if (currentStatusFilter === "approved") {
        currentStatusFilter = "shipping"
      }
      const currentEmployeeFilter = searchParams.get("employee") || "all"
      const currentDateFrom = searchParams.get("dateFrom")
      const currentDateTo = searchParams.get("dateTo")

      const params = new URLSearchParams()
      if (currentPhoneNumber) params.set("phoneNumber", currentPhoneNumber)
      if (currentOrderId) params.set("orderId", currentOrderId)
      if (currentCustomerName) params.set("customerName", currentCustomerName)
      if (currentStatusFilter && currentStatusFilter !== "all") {
        params.set("status", currentStatusFilter)
      }
      if (currentEmployeeFilter && currentEmployeeFilter !== "all") {
        params.set("employee", currentEmployeeFilter)
      }
      if (currentDateFrom) params.set("dateFrom", currentDateFrom)
      if (currentDateTo) params.set("dateTo", currentDateTo)

      const queryString = params.toString()
      const endpoint = queryString
        ? `/api/admin/orders/export?${queryString}`
        : "/api/admin/orders/export"

      const response = await fetch(endpoint)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Không thể export Excel.")
      }

      const rows: ExportSummaryRow[] = data?.rows || []

      if (!rows.length) {
        setSnackbarMessage("Không có dữ liệu để export.")
        setSnackbarOpen(true)
        return
      }

      const worksheetData = [
        ["Tên sản phẩm", "Biến thể", "Số lượng đã bán", "Đơn giá", "Tổng tiền"],
        ...rows.map((row) => [
          row.productName || "N/A",
          row.variantName || "Không có biến thể",
          row.quantity ?? 0,
          Math.round((row.unitPrice ?? 0) * 100) / 100,
          Math.round((row.totalAmount ?? 0) * 100) / 100,
        ]),
      ]

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      worksheet["!cols"] = [
        { wch: 40 },
        { wch: 30 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
      ]

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Thong ke ban hang")

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `thong-ke-don-hang-${dayjs().format(
        "YYYYMMDD_HHmmss"
      )}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSnackbarMessage("Đã export Excel thành công.")
      setSnackbarOpen(true)
    } catch (error: any) {
      console.error("Export Excel error:", error)
      setSnackbarMessage(error?.message || "Không thể export Excel.")
      setSnackbarOpen(true)
    } finally {
      setExportingExcel(false)
    }
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
                font-family: "Courier New", Courier, monospace !important;
                width: 58mm;
                font-size: 11px !important;
                line-height: 1.2 !important;
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
                font-family: "Courier New", Courier, monospace !important;
              }
              img {
                image-rendering: -webkit-optimize-contrast !important;
                image-rendering: crisp-edges !important;
                image-rendering: pixelated !important;
                max-width: 100% !important;
                height: auto !important;
              }
            }
            body {
              font-family: "Courier New", Courier, monospace !important;
              color: black;
              margin: 0;
              padding: 2mm;
              width: 58mm;
              font-size: 11px !important;
              line-height: 1.2 !important;
            }
            body > * {
              width: 100%;
            }
            * {
              color: black !important;
              font-family: "Courier New", Courier, monospace !important;
            }
            img {
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
              image-rendering: pixelated !important;
              max-width: 100% !important;
              height: auto !important;
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

  // Tìm tên employee từ employee documentId
  const getEmployeeName = (employeeDocumentId?: string | null): string => {
    if (!employeeDocumentId) {
      return "Chưa ai tiếp nhận"
    }
    const employee = employees.find(
      (emp) => emp.documentId === employeeDocumentId
    )
    return employee?.name || "Chưa ai tiếp nhận"
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

    // Lấy employee hiện tại từ localStorage
    let employeeDocumentId: string | null = null
    try {
      const savedEmployee = localStorage.getItem("selectedEmployee")
      if (savedEmployee) {
        const employee = JSON.parse(savedEmployee)
        employeeDocumentId = employee.documentId || null
      }
    } catch (err) {
      console.error("Error parsing saved employee:", err)
    }

    setUpdatingStatus((prev) => ({ ...prev, [order.id]: true }))

    try {
      const response = await fetch(
        `/api/admin/orders/${order.documentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            employeeDocumentId: employeeDocumentId,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.error || "Failed to update order status")
      }

      // Lấy data từ response để có employee mới (nếu được gắn vào)
      const responseData = await response.json()
      const updatedOrder = responseData?.data

      // Cập nhật order trong danh sách với cả order_status và employee
      setOrders((prevOrders) =>
        prevOrders.map((o) => {
          if (o.id === order.id) {
            return {
              ...o,
              order_status: newStatus,
              employee: updatedOrder?.employee || o.employee,
            }
          }
          return o
        })
      )

      // Cập nhật order trong orderDetailsMap nếu có
      if (orderDetailsMap[order.id]) {
        setOrderDetailsMap((prev) => ({
          ...prev,
          [order.id]: {
            ...orderDetailsMap[order.id],
            order_status: newStatus,
            employee:
              updatedOrder?.employee || orderDetailsMap[order.id].employee,
          },
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
      { value: "cancelled", label: "Hủy" },
      { value: "refunded", label: "Đã hoàn tiền" },
    ]

    // Nếu là pending_approval, có thể chuyển sang shipping (Đang giao) hoặc cancelled
    if (currentStatus === "pending_approval") {
      return allStatuses.filter(
        (s) => s.value === "shipping" || s.value === "cancelled"
      )
    }

    // Nếu là approved hoặc shipping, có thể chuyển sang completed hoặc cancelled
    if (currentStatus === "approved" || currentStatus === "shipping") {
      return allStatuses.filter(
        (s) => s.value === "completed" || s.value === "cancelled"
      )
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
      cancelled: "Hủy",
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
          const { baseUnit, saleUnit, quantity, saleLineTotal, lineDiscount } =
            getItemPricing(item)
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
                <div className="flex flex-col items-end">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Đơn giá
                  </p>
                  {baseUnit > saleUnit && (
                    <p className="text-xs text-gray-400 line-through">
                      {formatBigNumber(baseUnit, true)}
                    </p>
                  )}
                  <p className="text-sm lg:text-base font-semibold text-pink-700">
                    {formatBigNumber(saleUnit, true)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Tổng: {formatBigNumber(saleLineTotal, true)}
                  </p>
                  {lineDiscount > 0 && (
                    <p className="text-xs text-emerald-600">
                      Giảm: -{formatBigNumber(lineDiscount, true)}
                    </p>
                  )}
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
    const summaryTotals = getOrderPricingSummary(items)
    const shippingFee = toNumber(order.shipping_fee)
    const total = summaryTotals.saleSubtotal + shippingFee

    return (
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Tiền hàng (giá gốc):</span>
          <span className="font-semibold">
            {formatBigNumber(summaryTotals.baseSubtotal, true)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Chiết khấu:</span>
          <span className="font-semibold text-emerald-600">
            -{formatBigNumber(summaryTotals.discountTotal, true)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tiền hàng sau CK:</span>
          <span className="font-semibold">
            {formatBigNumber(summaryTotals.saleSubtotal, true)}
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
        <div className="flex justify-between text-base font-semibold">
          <span>Tổng cộng:</span>
          <span className="text-pink-700">{formatBigNumber(total, true)}</span>
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
              <MenuItem value="cancelled">Hủy</MenuItem>
              <MenuItem value="refunded">Đã hoàn tiền</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Nhân viên phụ trách</InputLabel>
            <Select
              value={employeeFilter}
              label="Nhân viên phụ trách"
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="unassigned">Chưa ai phụ trách</MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee.documentId} value={employee.documentId}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
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
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="outlined"
            onClick={handleExportExcel}
            startIcon={
              exportingExcel ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
            disabled={exportingExcel}
            className="!normal-case !font-semibold !text-neutral-900 !border-neutral-300"
          >
            {exportingExcel ? "Đang xuất..." : "Export Excel"}
          </Button>
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

      {/* Tổng doanh thu */}
      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Tổng doanh thu (tiền hàng)
            </h3>
            {loadingRevenue ? (
              <CircularProgress size={24} />
            ) : (
              <p className="text-2xl font-bold text-pink-700">
                {formatBigNumber(totalRevenue, true)}
              </p>
            )}
          </div>
        </div>
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

          {orders.length > 0 && (
            <div className="flex flex-col items-end justify-end my-6">
              <span className="text-xs text-gray-500">
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
              const statusInfo = getOrderStatusInfo(order.order_status)

              const items = order.order_items || []
              const summaryTotals = getOrderPricingSummary(items)
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
                      <p className="text-sm font-semibold lg:text-sm text-stone-500 italic">
                        <span className="font-semibold">
                          Nhân viên phụ trách:
                        </span>{" "}
                        {getEmployeeName(order.employee)}
                      </p>
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
                        {formatBigNumber(
                          summaryTotals.saleSubtotal + shippingFee,
                          true
                        )}
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
                padding-top: 1mm !important;
                box-sizing: border-box !important;
                overflow: visible !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                color: black !important;
                font-family: "Courier New", Courier, monospace !important;
                line-height: 1.2 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                opacity: 1 !important;
              }
              .invoice-content * {
                color: black !important;
                font-weight: 700 !important;
                font-family: "Courier New", Courier, monospace !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                opacity: 1 !important;
              }
              .invoice-content h1 {
                font-size: 16px !important;
                font-weight: 900 !important;
                color: black !important;
                font-family: "Courier New", Courier, monospace !important;
                line-height: 1.3 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content h2 {
                font-size: 13px !important;
                font-weight: 800 !important;
                color: black !important;
                font-family: "Courier New", Courier, monospace !important;
                line-height: 1.2 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content p,
              .invoice-content span,
              .invoice-content div {
                font-size: 11px !important;
                font-weight: 700 !important;
                color: black !important;
                font-family: "Courier New", Courier, monospace !important;
                line-height: 1.2 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content img {
                image-rendering: -webkit-optimize-contrast !important;
                image-rendering: crisp-edges !important;
                image-rendering: pixelated !important;
                max-width: 100% !important;
                height: auto !important;
              }
              .invoice-content .print\\:hidden {
                display: none !important;
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
                font-size: 11px !important;
                font-weight: 700 !important;
                font-family: "Courier New", Courier, monospace !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .invoice-content th,
              .invoice-content td {
                padding: 2px 3px;
                word-wrap: break-word;
                overflow-wrap: break-word;
                font-size: 11px !important;
                font-weight: 700 !important;
                font-family: "Courier New", Courier, monospace !important;
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
        onClose={() => {
          setOpenInvoiceDialog(false)
          setQrCodeUrl(null)
        }}
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
              In hóa đơn
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
                // padding: "20px",
                paddingTop: "10px",
                fontFamily: "Courier New, Courier, monospace",
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
                  <img
                    src={logoDataUrl || logoUrl}
                    alt="DIVI"
                    style={{
                      width: "120px",
                      height: "auto",
                      objectFit: "contain",
                      filter: "grayscale(100%) contrast(220%) brightness(0.75)",
                      imageRendering: "pixelated",
                    }}
                  />
                </div>
                {(storeMetadata?.phone_number || storeMetadata?.address) && (
                  <div
                    className="mb-1 text-sm"
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
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{
                    color: "black",
                    fontWeight: 900,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  HÓA ĐƠN BÁN HÀNG
                </h2>
                <span
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
                </span>
                <br />
                <span
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
                </span>
              </div>

              {/* Customer Info */}
              {selectedOrderForInvoice.customer && (
                <div className="mb-3 border-b pb-2 border border-dashed">
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{
                      color: "black",
                      fontWeight: 800,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      colorAdjust: "exact",
                    }}
                  >
                    Thông tin khách hàng
                  </h3>
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

              {/* Order Items */}
              <div className="mb-3">
                <h2
                  className="text-lg font-semibold mb-1"
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
                <div className="space-y-2">
                  {(selectedOrderForInvoice.order_items || []).map((item) => {
                    const variant = item.variant
                    const product = variant?.product || item.product
                    const productName = product?.name || "N/A"
                    const {
                      baseUnit,
                      saleUnit,
                      quantity,
                      saleLineTotal,
                      lineDiscount,
                    } = getItemPricing(item)

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
                            {baseUnit > saleUnit && (
                              <span>
                                Giá gốc: {formatBigNumber(baseUnit, true)}
                              </span>
                            )}
                            <br />
                            <span>
                              SL: {quantity} x {formatBigNumber(saleUnit, true)}
                            </span>
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
                          Thành tiền: {formatBigNumber(saleLineTotal, true)}
                          {lineDiscount > 0 && (
                            <>
                              <br />
                              <span className="text-xs text-emerald-700">
                                Chiết khấu: -
                                {formatBigNumber(lineDiscount, true)}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="pb-3">
                          ---------------------------------
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-3">
                <div className="flex justify-end">
                  <div
                    className="space-y-1"
                    style={{ minWidth: "300px", maxWidth: "400px" }}
                  >
                    {(() => {
                      const totals = getOrderPricingSummary(
                        selectedOrderForInvoice.order_items || []
                      )
                      const shippingFee = toNumber(
                        selectedOrderForInvoice.shipping_fee
                      )
                      const grandTotal = totals.saleSubtotal + shippingFee

                      return (
                        <>
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
                              Tiền hàng (giá gốc):
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
                              {formatBigNumber(totals.baseSubtotal, true)}
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
                              Chiết khấu:
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
                              -{formatBigNumber(totals.discountTotal, true)}
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
                              Tiền hàng sau CK:
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
                              {formatBigNumber(totals.saleSubtotal, true)}
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
                              {shippingFee === 0
                                ? "Miễn phí"
                                : formatBigNumber(shippingFee, true)}
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
                              {formatBigNumber(grandTotal, true)}
                            </span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {loadingQrCode ? (
                <div className="text-center mt-4">
                  <CircularProgress size={24} />
                  <p
                    className="text-sm mt-2"
                    style={{
                      color: "black",
                      fontWeight: 700,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      colorAdjust: "exact",
                    }}
                  >
                    Đang tạo mã QR...
                  </p>
                </div>
              ) : qrCodeUrl ? (
                <div
                  className="flex flex-col items-center justify-center mt-4"
                  style={{
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    colorAdjust: "exact",
                  }}
                >
                  <div className="flex justify-center w-full items-center">
                    <p
                      className="text-sm font-semibold mb-2 text-center"
                      style={{
                        color: "black",
                        fontWeight: 700,
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                        colorAdjust: "exact",
                      }}
                    >
                      Quét mã QR để thanh toán
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      style={{
                        width: "150px",
                        height: "150px",
                        border: "2px solid black",
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                        colorAdjust: "exact",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {/* Footer */}
              <div
                className="text-center text-sm text-gray-600 mt-4 items-center"
                style={{
                  color: "black",
                  fontWeight: 700,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  colorAdjust: "exact",
                }}
              >
                <div className="flex justify-center w-full">
                  <p
                    className="text-center"
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
