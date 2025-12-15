import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

// GET - Search promotion by exact code match (bao gồm cả private promotions)
export async function GET(request: NextRequest) {
  try {
    if (!BASE_URL || !FULL_ACCESS_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code || !code.trim()) {
      return NextResponse.json({ data: null })
    }

    // Build query - exact match với code
    const params = new URLSearchParams()
    params.set("filters[code][$eq]", code.trim()) // Exact match
    
    // Filter: chỉ isDisable = false (cho phép isPrivate = true)
    params.set("filters[isDisable][$eq]", "false")
    
    // Only get published promotions
    params.set("filters[publishedAt][$notNull]", "true")

    // Populate image
    params.set("populate[image]", "true")

    const url = `${BASE_URL}/api/promotions?${params.toString()}`

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
      throw new Error(
        errorData?.error?.message || "Failed to search promotion"
      )
    }

    const data = await response.json()

    // Return first match hoặc null
    return NextResponse.json({
      data: data.data && data.data.length > 0 ? data.data[0] : null,
    })
  } catch (error: any) {
    console.error("Failed to search promotion by code:", error)
    return NextResponse.json(
      {
        data: null,
        error: error?.message || "Failed to search promotion",
      },
      { status: 500 }
    )
  }
}
