import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

// GET - Get promotions by customer ID
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    if (!BASE_URL || !FULL_ACCESS_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    console.log("🔍 Searching promotions for customerId:", customerId)

    if (!customerId) {
      return NextResponse.json({ data: [] })
    }

    // Fetch promotions assigned to this customer
    const params = new URLSearchParams()
    params.set("pagination[pageSize]", "100")
    params.set("filters[publishedAt][$notNull]", "true")
    params.set("filters[isDisable][$ne]", "true")
    
    // Filter by customer
    params.set("filters[customers][documentId][$eq]", customerId)
    
    // Populate necessary fields
    params.set("populate[image]", "true")

    const url = `${BASE_URL}/api/promotions?${params.toString()}`

    console.log("📡 Fetching URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("❌ API Error:", errorData)
      throw new Error(
        errorData?.error?.message || "Failed to fetch customer promotions"
      )
    }

    const data = await response.json()
    const promotions = data.data || []

    console.log("📦 Total customer promotions fetched:", promotions.length)

    return NextResponse.json({
      data: promotions,
    })
  } catch (error: any) {
    console.error("❌ Failed to fetch promotions by customer:", error)
    return NextResponse.json(
      {
        data: [],
        error: error?.message || "Failed to fetch promotions",
      },
      { status: 500 }
    )
  }
}
