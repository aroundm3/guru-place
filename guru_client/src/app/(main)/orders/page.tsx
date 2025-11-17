"use client"

import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import CustomerInfoEdit from "@modules/layout/components/customer-info-edit"
import { useCustomer } from "@lib/context/customer-context"
import { formatBigNumber } from "@lib/util/format-big-number"
import Image from "next/image"
import {
  Button,
  CircularProgress,
  IconButton,
  Alert,
  Collapse,
} from "@mui/material"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
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
  images?: { default?: string; thumbnail?: string }[]
  sale_price?: number | string
}

type OrderVariant = {
  variant_value?: string
  sale_price?: number | string
  variant_image?: { default?: string; thumbnail?: string }
  product?: OrderProduct
}

type OrderItem = {
  id: number
  quantity: number
  product?: OrderProduct
  variant?: OrderVariant | null
}

type OrderCustomerCard = {
  id: number
  quantity: number
  customer_card?: {
    title?: string
    discount?: number | string
    description?: string | null
  }
}

type OrderEntity = {
  id: number
  documentId: string
  createdAt: string
  shipping_fee?: number | string | null
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

export default function OrdersPage() {
  const { customer } = useCustomer()
  const [orders, setOrders] = useState<OrderEntity[]>([])
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  const fetchOrders = async (targetPage: number) => {
    if (!customer) return

    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams({
        customerId: customer.documentId,
        page: targetPage.toString(),
        pageSize: pagination.pageSize.toString(),
      })

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
      fetchOrders(1)
    } else {
      setOrders([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer?.documentId])

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
    fetchOrders(targetPage)
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
          const imageSrc =
            variant?.variant_image?.thumbnail ||
            variant?.variant_image?.default ||
            product?.images?.[0]?.default ||
            "/logo.png"
          const productName = product?.name || "Sản phẩm"
          const variantName = variant?.variant_value
          const price = toNumber(
            variant?.sale_price ?? product?.sale_price ?? 0
          )
          const quantity = item.quantity || 0

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-stone-200 rounded-xl bg-white"
            >
              <div className="relative w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-stone-50">
                <Image
                  src={imageSrc}
                  alt={productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-semibold text-base text-gray-900">
                  {productName}
                </h4>
                {variantName && (
                  <p className="text-sm text-gray-500">
                    Phân loại: {variantName}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Số lượng: <span className="font-semibold">{quantity}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Đơn giá
                </p>
                <p className="text-base sm:text-lg font-semibold text-pink-700">
                  {formatBigNumber(price, true)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tổng: {formatBigNumber(price * quantity, true)}
                </p>
              </div>
            </div>
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
          Thẻ quà tặng nhận được
        </h4>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const baseCard = card.customer_card as any
            const color = getCardColor(baseCard)
            const discount = toNumber(baseCard?.discount)
            const title = baseCard?.title || "Thẻ quà tặng"
            const description = baseCard?.description
            const imageSrc = baseCard?.image?.default || "/logo.png"
            return (
              <div
                key={card.id}
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
                  <Image
                    src={imageSrc}
                    alt={title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 1024px) 50vw, 33vw"
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
                  {discount > 0 && (
                    <div className="text-sm text-gray-700">
                      Tích được{" "}
                      <span
                        className={`font-semibold ${getCardTextClasses(color)}`}
                      >
                        {formatBigNumber(discount, true)}
                      </span>
                    </div>
                  )}
                  {description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-3 px-3">
          {cards.map((card) => {
            const baseCard = card.customer_card as any
            const color = getCardColor(baseCard)
            const discount = toNumber(baseCard?.discount)
            const title = baseCard?.title || "Thẻ quà tặng"
            const description = baseCard?.description
            return (
              <div
                key={card.id}
                className={`${getCardBgClasses(
                  color
                )} border rounded-2xl p-3 flex-shrink-0 w-[220px] relative overflow-visible shadow-sm`}
              >
                <span
                  className={`absolute -top-2 -right-2 ${getCardBadgeClasses(
                    color
                  )} text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg z-20 border-2 border-white`}
                >
                  x{card.quantity}
                </span>
                <p
                  className={`${getCardTextClasses(
                    color
                  )} font-semibold text-sm mb-1`}
                >
                  {title}
                </p>
                {discount > 0 && (
                  <p className="text-xs text-gray-600">
                    Giá trị: {formatBigNumber(discount, true)}
                  </p>
                )}
                {description && (
                  <p className="text-xs text-gray-500 line-clamp-3 mt-1">
                    {description}
                  </p>
                )}
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
      return sum + unitPrice * (item.quantity || 0)
    }, 0)
    const shippingFee = toNumber(order.shipping_fee)
    const totalItems = items.reduce(
      (sum, item) => sum + toNumber(item.quantity || 0),
      0
    )

    return (
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span className="font-semibold">
            {formatBigNumber(subtotal, true)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span className="font-semibold">
            {shippingFee === 0
              ? "Miễn phí"
              : formatBigNumber(shippingFee, true)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-semibold text-gray-900">
            Tổng ({totalItems} sản phẩm)
          </span>
          <span className="font-bold text-pink-700 text-lg">
            {formatBigNumber(subtotal + shippingFee, true)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Đơn hàng của tôi
        </h1>
        <p className="text-sm text-gray-500">
          Theo dõi trạng thái và chi tiết từng đơn hàng của bạn
        </p>
      </div>

      <CustomerInfoEdit />

      {!customer && (
        <Alert severity="info" className="mb-6">
          Vui lòng nhập thông tin khách hàng để xem đơn hàng.
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      )}

      {!loading && customer && orders.length === 0 && !error && (
        <div className="text-center py-12 sm:py-16 border border-dashed rounded-2xl bg-white">
          <p className="text-sm sm:text-base text-gray-600 mb-3">
            Bạn chưa có đơn hàng nào.
          </p>
          <p className="text-xs text-gray-400">
            Khi đặt hàng thành công, đơn của bạn sẽ xuất hiện ở đây.
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
            return sum + unitPrice * (item.quantity || 0)
          }, 0)
          const finalTotal = orderTotal + toNumber(order.shipping_fee)

          return (
            <div
              key={order.id}
              className="border border-stone-200 rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 justify-between p-4 sm:p-6">
                <div className="flex-1 space-y-1">
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
                    Mã đơn #{order.documentId}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    Ngày đặt: {createdDate}
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 uppercase block">
                      Số sản phẩm
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {totalProducts}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 uppercase block">
                      Tổng tiền
                    </span>
                    <span className="text-lg font-bold text-pink-700">
                      {formatBigNumber(finalTotal, true)}
                    </span>
                  </div>
                  <IconButton
                    onClick={() =>
                      setExpandedOrderId((prev) =>
                        prev === order.id ? null : order.id
                      )
                    }
                    className={`transition-transform text-pink-700 hover:bg-pink-50 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <ExpandMoreRoundedIcon />
                  </IconButton>
                </div>
              </div>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-6">
                  {renderOrderItems(order)}
                  {renderOrderCards(order)}
                  {renderOrderSummary(order)}
                </div>
              </Collapse>
            </div>
          )
        })}
      </div>

      {customer && orders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 border-t pt-4">
          <span className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.pageCount}
          </span>
          <div className="flex w-full sm:w-auto gap-3">
            <Button
              variant="outlined"
              onClick={() => handlePageChange("prev")}
              disabled={pagination.page <= 1 || loading}
              className="flex-1 sm:flex-none !border-neutral-200 !text-gray-700"
            >
              Trang trước
            </Button>
            <Button
              variant="contained"
              onClick={() => handlePageChange("next")}
              disabled={pagination.page >= pagination.pageCount || loading}
              className="flex-1 sm:flex-none !bg-neutral-900 !text-white"
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
