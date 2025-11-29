"use client"

import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import Link from "next/link"
import CustomerInfoEdit from "@modules/layout/components/customer-info-edit"
import { CustomerCardModal } from "@modules/product/components/customer-card-modal"
import { useCustomer } from "@lib/context/customer-context"
import { formatBigNumber } from "@lib/util/format-big-number"
import { CustomerCard } from "types/global"
import {
  Button,
  CircularProgress,
  IconButton,
  Alert,
  Collapse,
  Snackbar,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import {
  getCardBgClasses,
  getCardBadgeClasses,
  getCardColor,
  getCardTextClasses,
  getCardBorderClasses,
} from "@lib/util/card-colors"

const PAGE_SIZE = 5

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
  quantity: number | string // Có thể là string từ API
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

type OrderStatusFilter = OrderStatus | "all"

const ORDER_STATUS_OPTIONS: { label: string; value: OrderStatusFilter }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ duyệt", value: "pending_approval" },
  { label: "Đang giao", value: "shipping" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Hủy", value: "cancelled" },
  { label: "Đã hoàn tiền", value: "refunded" },
]

type OrderEntity = {
  id: number
  documentId: string
  createdAt: string
  shipping_fee?: number | string | null
  order_status?: OrderStatus
  order_items?: OrderItem[]
  order_customer_cards?: OrderCustomerCard[]
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
      return {
        text: "Đang giao",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        borderColor: "border-purple-300",
      }
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

export default function OrdersPage() {
  const { customer } = useCustomer()
  const [orders, setOrders] = useState<OrderEntity[]>([])
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
  }>({ open: false, message: "" })
  const [openCardModal, setOpenCardModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CustomerCard | undefined>(
    undefined
  )
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<OrderEntity | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const handleCopyOrderId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId)
      setSnackbar({ open: true, message: "Đã sao chép mã đơn hàng!" })
    } catch (err) {
      console.error("Failed to copy:", err)
      setSnackbar({ open: true, message: "Không thể sao chép mã đơn hàng" })
    }
  }

  const fetchOrders = async (
    targetPage: number,
    status: OrderStatusFilter = statusFilter
  ) => {
    if (!customer) return

    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams({
        customerId: customer.documentId,
        page: targetPage.toString(),
        pageSize: pagination.pageSize.toString(),
      })

      if (status && status !== "all") {
        params.set("status", status)
      }

      const res = await fetch(`/api/orders?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
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
          page: targetPage,
        }))
      }

      if (resultOrders.length > 0) {
        setExpandedOrderId((prev) => prev ?? resultOrders[0].id)
      } else {
        setExpandedOrderId(null)
      }
    } catch (err: any) {
      console.error("Failed to load orders", err)
      setError(err?.message || "Không thể tải danh sách đơn hàng.")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (customer?.documentId) {
      fetchOrders(1, statusFilter)
    } else {
      setOrders([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.documentId, statusFilter])

  const handlePageChange = (direction: "prev" | "next") => {
    const targetPage =
      direction === "prev" ? pagination.page - 1 : pagination.page + 1
    if (
      targetPage < 1 ||
      targetPage > pagination.pageCount ||
      loading ||
      !customer
    ) {
      return
    }
    fetchOrders(targetPage, statusFilter)
  }

  const handleOpenCancelDialog = (order: OrderEntity) => {
    setOrderToCancel(order)
    setCancelDialogOpen(true)
  }

  const handleCloseCancelDialog = () => {
    if (!cancelling) {
      setCancelDialogOpen(false)
      setOrderToCancel(null)
    }
  }

  const handleConfirmCancel = async () => {
    if (!orderToCancel || !customer) return

    setCancelling(true)
    try {
      const res = await fetch(
        `/api/orders/${orderToCancel.documentId}/cancel`,
        {
          method: "PUT",
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Không thể hủy đơn hàng.")
      }

      setSnackbar({
        open: true,
        message: "Hủy đơn hàng thành công!",
      })
      setCancelDialogOpen(false)
      setOrderToCancel(null)

      // Refresh danh sách đơn hàng
      await fetchOrders(pagination.page, statusFilter)
    } catch (err: any) {
      console.error("Failed to cancel order:", err)
      setSnackbar({
        open: true,
        message: err?.message || "Không thể hủy đơn hàng.",
      })
    } finally {
      setCancelling(false)
    }
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

          // Lấy ảnh variant nếu có, nếu không thì lấy ảnh product
          // Ưu tiên formats.large hoặc url (default) để có chất lượng tốt hơn
          // URL đã được transform bằng getFullLinkResource trong API route
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
          Thẻ tích điểm nhận được
        </h4>
        <div className="hidden lg:grid lg:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const baseCard = card.customer_card as any
            const color = getCardColor(baseCard)
            const discount = toNumber(baseCard?.discount)
            const title = baseCard?.title || "Thẻ tích điểm"
            const description = baseCard?.description
            // Ưu tiên url (default) hoặc formats.large để có chất lượng tốt hơn
            // URL đã được transform bằng getFullLinkResource trong API route
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
            // Ưu tiên url (default) hoặc formats.large để có chất lượng tốt hơn
            // URL đã được transform bằng getFullLinkResource trong API route
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
    <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-6xl">
      <div className="mb-4 lg:mb-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
          Đơn hàng của tôi
        </h1>
        <p className="text-sm text-gray-500">
          Theo dõi trạng thái và chi tiết từng đơn hàng của bạn
        </p>
      </div>

      <CustomerInfoEdit />

      {customer && (
        <div className="mt-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUS_OPTIONS.map((option) => {
              const isActive = statusFilter === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    if (statusFilter !== option.value) {
                      setStatusFilter(option.value)
                      setPagination((prev) => ({ ...prev, page: 1 }))
                    }
                  }}
                  className={`px-3 lg:px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    isActive
                      ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!customer && (
        <Alert severity="warning" className="mb-6">
          Vui lòng nhập thông tin khách hàng để xem đơn hàng.
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="border border-stone-200 rounded-2xl bg-white shadow-sm"
            >
              <div className="flex flex-row items-center gap-3 lg:gap-6 justify-between p-4 lg:p-6">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Skeleton variant="text" width={60} height={16} />
                    <Skeleton
                      variant="rectangular"
                      width={120}
                      height={28}
                      className="rounded-md"
                    />
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={24}
                      className="rounded"
                    />
                  </div>
                  <Skeleton variant="text" width={180} height={20} />
                </div>
                <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                  <Skeleton variant="circular" width={32} height={32} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && customer && orders.length === 0 && !error && (
        <div className="text-center py-12 lg:py-16 border border-dashed rounded-2xl bg-white">
          <p className="text-sm lg:text-base text-gray-600 mb-3">
            Bạn chưa có đơn hàng nào.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order) => {
          const orderItems = order.order_items || []
          const isExpanded = expandedOrderId === order.id
          const createdDate = dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")
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
              <div
                // onClick={() =>
                //   setExpandedOrderId((prev) =>
                //     prev === order.id ? null : order.id
                //   )
                // }
                className="cursor-pointer flex flex-row items-center gap-3 lg:gap-6 justify-between p-4 lg:p-6"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide">
                      Mã đơn:
                    </p>
                    <button
                      onClick={() => handleCopyOrderId(order.documentId)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-pink-50 hover:bg-pink-100 transition-colors group"
                    >
                      <span className="text-xs lg:text-sm font-semibold uppercase text-pink-700">
                        {order.documentId}
                      </span>
                      <ContentCopyIcon className="!w-4 !h-4 text-pink-600 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor} border ${statusInfo.borderColor}`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 truncate">
                    Ngày đặt: {createdDate}
                  </p>
                </div>
                <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                  <IconButton
                    onClick={() =>
                      setExpandedOrderId((prev) =>
                        prev === order.id ? null : order.id
                      )
                    }
                    className={`transition-transform text-pink-700 hover:bg-pink-50 flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    size="medium"
                  >
                    <ExpandMoreRoundedIcon />
                  </IconButton>
                </div>
              </div>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <div className="px-4 lg:px-6 pb-4 lg:pb-6 space-y-6">
                  {renderOrderItems(order)}
                  {renderOrderCards(order)}
                  {renderOrderSummary(order)}
                </div>
              </Collapse>
              <div className="flex justify-between items-center pt-2 border-t p-3 lg:p-4">
                <span className="font-semibold text-gray-900">
                  Tổng ({totalItems} sản phẩm)
                </span>
                <div className="flex items-center gap-3">
                  {order.order_status === "pending_approval" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleOpenCancelDialog(order)}
                      className="!normal-case !text-sm !font-semibold"
                    >
                      Hủy đơn
                    </Button>
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

      {customer && orders.length > 0 && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mt-6 border-t pt-4">
          <span className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.pageCount}
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

      <CustomerCardModal
        open={openCardModal}
        onClose={() => setOpenCardModal(false)}
        card={selectedCard}
      />

      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle
          id="cancel-dialog-title"
          className="!font-semibold uppercase !my-4"
        >
          Xác nhận hủy đơn hàng
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Bạn có chắc chắn muốn hủy đơn hàng{" "}
            <strong className="uppercase">{orderToCancel?.documentId}</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="mx-3 mb-3">
          <Button
            onClick={handleCloseCancelDialog}
            disabled={cancelling}
            color="inherit"
            className="!normal-case !font-semibold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            disabled={cancelling}
            startIcon={cancelling ? <CircularProgress size={16} /> : null}
            className="!bg-neutral-900 !text-white !normal-case !font-semibold"
          >
            {cancelling ? "Đang xử lý..." : "Đồng ý"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          icon={false}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            width: "100%",
            bgcolor: "#111",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "999px",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
