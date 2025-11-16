import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("bdhajshbjds body: ", body)

    if (!BASE_URL || !FULL_ACCESS_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Thử cả /orders/checkout và /order/checkout
    const response = await fetch(`${BASE_URL}/api/order/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    // Kiểm tra content-type trước khi parse JSON
    const contentType = response.headers.get("content-type")
    let data: any = {}

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      // Nếu không phải JSON, đọc text
      const text = await response.text()
      return NextResponse.json(
        { error: text || "Checkout failed" },
        { status: response.status }
      )
    }

    if (!response.ok) {
      // Xử lý error từ Strapi
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        data?.error ||
        "Checkout failed"
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Checkout API error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
