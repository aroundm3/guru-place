import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

// GET - Search products with infinite scroll
export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin_jwt")?.value

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!BASE_URL || !FULL_ACCESS_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"
    const pageSize = searchParams.get("pageSize") || "20"
    const search = searchParams.get("search") || ""

    // Build query params cho Strapi REST API
    const params = new URLSearchParams()
    params.set("pagination[page]", page)
    params.set("pagination[pageSize]", pageSize)
    params.set("sort", "name:ASC")
    params.set("fields[0]", "documentId")
    params.set("fields[1]", "name")

    // Filter by search query
    if (search) {
      params.set("filters[$or][0][name][$containsi]", search)
      params.set("filters[$or][1][documentId][$containsi]", search)
    }

    // Dùng REST API
    const url = `${BASE_URL}/api/products?${params.toString()}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData?.error?.message || "Failed to fetch products")
    }

    const data = await response.json()

    return NextResponse.json({
      data: data.data || [],
      meta: data.meta || {
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: 1,
          total: 0,
        },
      },
    })
  } catch (error: any) {
    console.error("Failed to search products:", error)
    return NextResponse.json(
      {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 20,
            pageCount: 1,
            total: 0,
          },
        },
        error: error?.message || "Failed to search products",
      },
      { status: 500 }
    )
  }
}
