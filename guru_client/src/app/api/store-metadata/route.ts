import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.BASE_URL
const API_KEY = process.env.FULL_ACCESS_API_KEY

export async function GET(request: NextRequest) {
  try {
    // Fetch store metadata from Strapi
    const url = `${BASE_URL}/api/store-metadata?populate=*`
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Error fetching store metadata:", errorData)
      return NextResponse.json(
        { error: errorData?.error?.message || "Failed to fetch store metadata" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Return the data
    return NextResponse.json({ data: data.data || data })
  } catch (error: any) {
    console.error("Error in GET /api/store-metadata:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

