import { NextRequest, NextResponse } from "next/server"
import { fetcherForOrderModule } from "@lib/config"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
  }

  try {
    // Cập nhật trạng thái đơn sang "cancelled" sử dụng Strapi REST API
    // Tìm order bằng documentId trước
    const findUrl = `/api/orders?filters[documentId][$eq]=${orderId}`
    const findResponse = await fetcherForOrderModule(findUrl, {
      cache: "no-store",
    })

    if (!findResponse?.data || findResponse.data.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = findResponse.data[0]
    const orderIdNumber = order.id

    // Cập nhật order bằng id (số)
    const updateUrl = `/api/orders/${orderIdNumber}`

    console.log("Updating order:", {
      orderIdNumber,
      updateUrl,
      documentId: orderId,
    })

    const response = await fetcherForOrderModule(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          order_status: "cancelled",
        },
      }),
      cache: "no-store",
    })

    console.log("Update response:", response)

    if (!response || !response.data) {
      return NextResponse.json(
        { error: "Failed to cancel order" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: response.data,
    })
  } catch (error: any) {
    console.error("Failed to cancel order:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to cancel order" },
      { status: 500 }
    )
  }
}
