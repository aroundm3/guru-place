import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE_URL = process.env.BASE_URL

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
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
    const status = searchParams.get("status") || ""
    const employee = searchParams.get("employee") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""

    // Dùng Content Manager API endpoint
    const params = new URLSearchParams()
    params.set("page", "1")
    params.set("pageSize", "1000") // Lấy tối đa 1000 orders
    params.set("sort", "id:DESC")

    // Chỉ populate order_items để tính tổng, không cần populate các relation khác
    params.set(
      "populate[order_items][populate][variant][populate][product]",
      "true"
    )
    params.set("populate[order_items][populate][product]", "true")

    // Build filters
    if (phoneNumber) {
      params.set("filters[customer][phone_number][$containsi]", phoneNumber)
    }

    if (orderId) {
      params.set("filters[documentId][$containsi]", orderId)
    }

    if (customerName) {
      params.set("filters[customer][full_name][$containsi]", customerName)
    }

    // Luôn chỉ tính đơn có trạng thái "shipping" (đang giao) hoặc "completed" (hoàn thành)
    // Bỏ qua filter status từ query params
    params.set("filters[$or][0][order_status][$eq]", "approved")
    params.set("filters[$or][1][order_status][$eq]", "shipping")
    params.set("filters[$or][2][order_status][$eq]", "completed")

    if (employee) {
      if (employee === "unassigned") {
        params.set("filters[$or][0][employee][$null]", "true")
        params.set("filters[$or][1][employee][$eq]", "")
      } else {
        params.set("filters[employee][$eq]", employee)
      }
    }

    if (dateFrom) {
      params.set("filters[createdAt][$gte]", `${dateFrom}T00:00:00.000Z`)
    }

    if (dateTo) {
      params.set("filters[createdAt][$lte]", `${dateTo}T23:59:59.999Z`)
    }

    // Endpoint Content Manager API
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
        { error: errorData?.error?.message || "Failed to fetch orders" },
        { status: response.status }
      )
    }

    const orders = await response.json()
    const ordersData = orders.results || orders.data || []

    // Filter unassigned ở server side nếu cần
    let filteredOrders = ordersData
    if (employee === "unassigned") {
      filteredOrders = ordersData.filter(
        (order: any) =>
          !order.employee || order.employee === "" || order.employee === null
      )
    }

    // Tính tổng doanh thu (tính subtotal - promotion_discount, không tính shipping fee)
    let totalServiceRevenue = 0
    let totalProductRevenue = 0

    const totalRevenue = filteredOrders.reduce((sum: number, order: any) => {
      const orderItems = order.order_items || []

      let orderServiceSubtotal = 0
      let orderProductSubtotal = 0

      orderItems.forEach((item: any) => {
        const unitPrice =
          Number(item.variant?.sale_price ?? item.product?.sale_price ?? 0) || 0
        const quantity = Number(item.quantity || 0) || 0
        const lineTotal = unitPrice * quantity

        const isService =
          item.product?.isService === true ||
          item.variant?.product?.isService === true

        if (isService) {
          orderServiceSubtotal += lineTotal
        } else {
          orderProductSubtotal += lineTotal
        }
      })

      // Service revenue is raw
      totalServiceRevenue += orderServiceSubtotal

      // Product revenue subtracts discount (assuming discount only applies to products)
      const promotionDiscount = Number(order.promotion_discount || 0)
      // Ensure specific product order revenue is not negative
      const orderProductRevenue = Math.max(
        0,
        orderProductSubtotal - promotionDiscount
      )

      totalProductRevenue += orderProductRevenue

      // Total for this order
      return sum + orderServiceSubtotal + orderProductRevenue
    }, 0)

    return NextResponse.json({
      totalRevenue,
      totalServiceRevenue,
      totalProductRevenue,
      orderCount: filteredOrders.length,
    })
  } catch (error: any) {
    console.error("Error calculating total revenue:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to calculate total revenue" },
      { status: 500 }
    )
  }
}
