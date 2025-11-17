"use client"

import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import CustomerInfoEdit from "@modules/layout/components/customer-info-edit"
import { useCustomer } from "@lib/context/customer-context"
import { formatBigNumber } from "@lib/util/format-big-number"
import Image from "next/image"
import { Button, CircularProgress, IconButton, Alert } from "@mui/material"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"

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
      <div className="space-y-4">
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
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 border rounded-lg"
            >
              <div className="relative w-full sm:w-28 h-36 sm:h-24 flex-shrink-0">
                <Image
                  src={imageSrc}
                  alt={productName}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
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
                <p className="text-sm text-gray-500">Đơn giá</p>
                <p className="text-base font-semibold text-pink-700">
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
      <div className="space-y-2">
        <h4 className="font-semibold text-base">Thẻ quà tặng</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="border rounded-lg p-3 bg-stone-50 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">
                  {card.customer_card?.title || "Thẻ quà tặng"}
                </span>
                <span className="text-xs text-gray-500">x{card.quantity}</span>
              </div>
              {typeof card.customer_card?.discount !== "undefined" && (
                <p className="text-xs text-gray-600">
                  Giá trị:{" "}
                  {formatBigNumber(
                    toNumber(card.customer_card?.discount),
                    true
                  )}
                </p>
              )}
              {card.customer_card?.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {card.customer_card.description}
                </p>
              )}
            </div>
          ))}
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
      (sum, item) => sum + (item.quantity || 0),
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
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Đơn hàng của tôi
      </h1>

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
        <div className="text-center py-12 sm:py-16">
          <p className="text-sm sm:text-base text-gray-600">
            Bạn chưa có đơn hàng nào.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const orderItems = order.order_items || []
          const isExpanded = expandedOrderId === order.id
          const createdDate = dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")
          const totalProducts = orderItems.reduce(
            (sum, item) => sum + (item.quantity || 0),
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
              className="border rounded-xl p-4 sm:p-6 bg-white"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Mã đơn #{order.documentId}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    Ngày đặt: {createdDate}
                  </p>
                </div>
                <div className="flex items-center sm:items-end sm:flex-col gap-2 sm:gap-1">
                  <span className="text-sm text-gray-500">
                    {totalProducts} sản phẩm
                  </span>
                  <span className="text-base font-bold text-pink-700">
                    {formatBigNumber(finalTotal, true)}
                  </span>
                </div>
                <IconButton
                  onClick={() =>
                    setExpandedOrderId((prev) =>
                      prev === order.id ? null : order.id
                    )
                  }
                  className={`self-start sm:self-auto transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <ExpandMoreRoundedIcon />
                </IconButton>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-6">
                  {renderOrderItems(order)}
                  {renderOrderCards(order)}
                  {renderOrderSummary(order)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {customer && orders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outlined"
            onClick={() => handlePageChange("prev")}
            disabled={pagination.page <= 1 || loading}
          >
            Trang trước
          </Button>
          <span className="text-sm text-gray-600">
            Trang {pagination.page} / {pagination.pageCount}
          </span>
          <Button
            variant="outlined"
            onClick={() => handlePageChange("next")}
            disabled={pagination.page >= pagination.pageCount || loading}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  )
}
