import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const DEFAULT_PAGE_SIZE = 10
const BASE_URL = process.env.BASE_URL

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin_jwt")?.value

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(
      searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE),
      10
    )
    const phoneNumber = searchParams.get("phoneNumber") || ""
    const customerName = searchParams.get("customerName") || ""

    // Build query params cho Strapi Content Manager API
    const params = new URLSearchParams()
    params.set("pagination[page]", page.toString())
    params.set("pagination[pageSize]", pageSize.toString())
    params.set("sort", "createdAt:desc")
    params.set("populate", "*")

    // Filter by phone number
    if (phoneNumber) {
      params.set("filters[phone_number][$containsi]", phoneNumber)
    }

    // Filter by customer name
    if (customerName) {
      params.set("filters[full_name][$containsi]", customerName)
    }

    // Endpoint Content Manager API
    const url = `${BASE_URL}/content-manager/collection-types/api::customer.customer?${params.toString()}`

    // Gọi Strapi với admin token trong header
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData?.error?.message || "Failed to fetch customers")
    }

    const data = await response.json()

    return NextResponse.json({
      data: data.results || [],
      meta: {
        pagination: data.pagination || {
          page,
          pageSize,
          pageCount: 1,
          total: 0,
        },
      },
    })
  } catch (error: any) {
    console.error("Failed to fetch customers:", error)
    return NextResponse.json(
      {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            pageCount: 1,
            total: 0,
          },
        },
        error: error?.message || "Failed to fetch customers",
      },
      { status: 500 }
    )
  }
}
