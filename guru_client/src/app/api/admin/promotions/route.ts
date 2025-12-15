import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY
const DEFAULT_PAGE_SIZE = 10

// GET - List promotions with pagination and filters
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
    const page = searchParams.get("page") || "1"
    const pageSize = searchParams.get("pageSize") || DEFAULT_PAGE_SIZE.toString()
    const searchQuery = searchParams.get("search") || ""

    // Build query params cho Strapi Content Manager API
    const params = new URLSearchParams()
    params.set("page", page)
    params.set("pageSize", pageSize)
    params.set("sort", "createdAt:DESC")

    // Populate relations
    params.set("populate[customers]", "true")
    params.set("populate[products]", "true")
    params.set("populate[image]", "true")

    // Filter by search query
    if (searchQuery) {
      params.set("filters[$or][0][code][$containsi]", searchQuery)
      params.set("filters[$or][1][title][$containsi]", searchQuery)
    }

    // Endpoint Content Manager API
    const url = `${BASE_URL}/content-manager/collection-types/api::promotion.promotion?${params.toString()}`

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
      throw new Error(errorData?.error?.message || "Failed to fetch promotions")
    }

    const data = await response.json()

    return NextResponse.json({
      data: data.results || [],
      meta: {
        pagination: data.pagination || {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: 1,
          total: 0,
        },
      },
    })
  } catch (error: any) {
    console.error("Failed to fetch promotions:", error)
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
        error: error?.message || "Failed to fetch promotions",
      },
      { status: 500 }
    )
  }
}

// POST - Create new promotion
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      code,
      title,
      description,
      type,
      value,
      discountMinimumOrderAmount,
      discountMaximumOrderAmount,
      isDisable,
      isPrivate,
      customerIds,
      productIds,
      imageId,
    } = body

    // Validate required fields
    if (!code || !title || !type || !value) {
      return NextResponse.json(
        { error: "Missing required fields: code, title, type, value" },
        { status: 400 }
      )
    }

    const promotionData: any = {
      code,
      title,
      description,
      type,
      value: parseInt(value, 10),
      discountMinimumOrderAmount: discountMinimumOrderAmount
        ? parseInt(discountMinimumOrderAmount, 10)
        : 0,
      isDisable: isDisable || false,
      isPrivate: isPrivate || false,
      publishedAt: new Date().toISOString(), // Publish ngay
    }

    if (discountMaximumOrderAmount) {
      promotionData.discountMaximumOrderAmount = parseInt(
        discountMaximumOrderAmount,
        10
      )
    }

    if (customerIds && customerIds.length > 0) {
      promotionData.customers = customerIds
    }

    if (productIds && productIds.length > 0) {
      promotionData.products = productIds
    }

    if (imageId) {
      promotionData.image = imageId
    }

    // Dùng REST API trực tiếp với FULL_ACCESS_API_KEY (như checkout)
    const createUrl = `${BASE_URL}/api/promotions`

    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
      },
      body: JSON.stringify({ data: promotionData }),
    })

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData?.error?.message || "Failed to create promotion" },
        { status: createResponse.status }
      )
    }

    const createdData = await createResponse.json()
    return NextResponse.json(createdData)
  } catch (error: any) {
    console.error("Error creating promotion:", error)
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
