import { NextRequest, NextResponse } from "next/server"
import { fetcherForOrderModule } from "@lib/config"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const routeParams = await params
    const orderId = routeParams.orderId

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    const body = await request.json()
    const { status, employeeDocumentId } = body

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 })
    }

    // Tìm order bằng documentId để lấy id
    const findUrl = `/api/orders?filters[documentId][$eq]=${orderId}`
    const findResponse = await fetcherForOrderModule(findUrl, {
      cache: "no-store",
    })

    if (!findResponse?.data || findResponse.data.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = findResponse.data[0]
    const orderIdNumber = order.id

    // Chuẩn bị data để cập nhật
    const updateData: any = {
      order_status: status,
    }

    // Chỉ gắn employee nếu:
    // 1. Có employeeDocumentId được gửi lên
    // 2. Order chưa có employee (employee là null, undefined, hoặc empty string)
    if (employeeDocumentId && (!order.employee || order.employee === "")) {
      updateData.employee = employeeDocumentId
    }

    // Cập nhật order status (và employee nếu cần)
    const updateUrl = `/api/orders/${orderIdNumber}`
    const response = await fetcherForOrderModule(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: updateData,
      }),
      cache: "no-store",
    })

    if (!response || !response.data) {
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: response.data,
    })
  } catch (error: any) {
    console.error("Failed to update order status:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update order status" },
      { status: 500 }
    )
  }
}
