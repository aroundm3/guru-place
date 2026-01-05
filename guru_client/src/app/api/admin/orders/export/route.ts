import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE_URL = process.env.BASE_URL
const PAGE_SIZE = 200
const MAX_PAGE = 20

const toNumber = (value: any) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

type OrderStatus =
  | "pending_approval"
  | "approved"
  | "shipping"
  | "completed"
  | "cancelled"
  | "refunded"

const resolveStatuses = (statusParam?: string | null): OrderStatus[] => {
  if (!statusParam || statusParam === "all") {
    return ["approved", "shipping", "completed"]
  }

  if (statusParam === "shipping") {
    return ["approved", "shipping"]
  }

  if (statusParam === "completed") {
    return ["completed"]
  }

  // Nếu filter khác, vẫn chỉ tính các đơn đang giao / hoàn thành
  return ["approved", "shipping", "completed"]
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin_jwt")?.value

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!BASE_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const phoneNumber = searchParams.get("phoneNumber") || ""
    const orderId = searchParams.get("orderId") || ""
    const customerName = searchParams.get("customerName") || ""
    const statusParam = searchParams.get("status")
    const employee = searchParams.get("employee") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""

    const statusesToInclude = resolveStatuses(statusParam)

    const shouldFilterUnassigned = employee === "unassigned"
    const employeeFilter = !shouldFilterUnassigned ? employee : ""

    let page = 1
    let pageCount = 1
    const allOrders: any[] = []

    while (page <= pageCount && page <= MAX_PAGE) {
      const params = new URLSearchParams()
      params.set("page", page.toString())
      params.set("pageSize", PAGE_SIZE.toString())
      params.set("sort", "id:DESC")
      params.set("populate[customer]", "true")
      params.set(
        "populate[order_items][populate][variant][populate][product]",
        "true"
      )
      params.set("populate[order_items][populate][product]", "true")

      if (phoneNumber) {
        params.set("filters[customer][phone_number][$containsi]", phoneNumber)
      }

      if (orderId) {
        params.set("filters[documentId][$containsi]", orderId)
      }

      if (customerName) {
        params.set("filters[customer][full_name][$containsi]", customerName)
      }

      statusesToInclude.forEach((status, index) => {
        params.set(`filters[$or][${index}][order_status][$eq]`, status)
      })

      if (employeeFilter) {
        params.set("filters[employee][$eq]", employeeFilter)
      }

      if (dateFrom) {
        params.set("filters[createdAt][$gte]", `${dateFrom}T00:00:00.000Z`)
      }

      if (dateTo) {
        params.set("filters[createdAt][$lte]", `${dateTo}T23:59:59.999Z`)
      }

      const url = `${BASE_URL}/content-manager/collection-types/api::order.order?${params.toString()}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return NextResponse.json(
          {
            error: errorData?.error?.message || "Failed to fetch orders",
          },
          { status: response.status }
        )
      }

      const responseJson = await response.json()
      const ordersData = responseJson.results || responseJson.data || []
      const paginationMeta =
        responseJson.pagination || responseJson.meta?.pagination

      allOrders.push(...ordersData)

      pageCount = paginationMeta?.pageCount || 1
      page += 1
    }

    let filteredOrders = allOrders
    if (shouldFilterUnassigned) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          !order.employee || order.employee === "" || order.employee === null
      )
    }

    const summaryMap = new Map<
      string,
      {
        productName: string
        variantName: string
        quantity: number
        totalAmount: number
        variantDocumentId?: string | null
        productDocumentId?: string | null
        isService: boolean
      }
    >()

    let totalPromotionDiscount = 0

    filteredOrders.forEach((order) => {
      // Accumulate total discount
      totalPromotionDiscount += Number(order.promotion_discount || 0)

      const items = order.order_items || []
      items.forEach((item: any) => {
        const quantity = toNumber(item.quantity || 0)
        if (quantity <= 0) return

        const variant = item.variant
        const product = variant?.product || item.product
        const productName = product?.name || "Sản phẩm"
        const variantName = variant?.variant_value || "Không có biến thể"
        const variantDocumentId = variant?.documentId || null
        const productDocumentId = product?.documentId || null
        const unitPrice = toNumber(
          variant?.sale_price ?? product?.sale_price ?? 0
        )
        const lineTotal = unitPrice * quantity
        const isService = !!(
          product?.isService === true || variant?.product?.isService === true
        )

        const key =
          variantDocumentId ||
          `${productDocumentId || productName}-${variantName}`

        if (!summaryMap.has(key)) {
          summaryMap.set(key, {
            productName,
            variantName,
            quantity: 0,
            totalAmount: 0,
            variantDocumentId,
            productDocumentId,
            isService,
          })
        }

        const entry = summaryMap.get(key)
        if (entry) {
          entry.quantity += quantity
          entry.totalAmount += lineTotal
        }
      })
    })

    const rows = Array.from(summaryMap.values())
      .map((entry) => ({
        productName: entry.productName,
        variantName: entry.variantName,
        quantity: entry.quantity,
        unitPrice: entry.quantity > 0 ? entry.totalAmount / entry.quantity : 0,
        totalAmount: entry.totalAmount,
        isService: entry.isService,
      }))
      .sort((a, b) => b.quantity - a.quantity)

    return NextResponse.json({
      rows,
      meta: {
        totalOrders: filteredOrders.length,
        totalVariants: rows.length,
        totalPromotionDiscount,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Failed to export orders",
      },
      { status: 500 }
    )
  }
}
