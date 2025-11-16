import { NextRequest, NextResponse } from "next/server"
import { getListProducts } from "@lib/data/product"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")

    const result = await getListProducts({
      page,
      hasCustomerCards: true,
    })

    return NextResponse.json({
      data: result.data,
      pageCount: result.pageCount,
    })
  } catch (error: any) {
    console.error("Error fetching products with gifts:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
