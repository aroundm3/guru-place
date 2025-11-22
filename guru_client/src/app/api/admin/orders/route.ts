import { NextRequest, NextResponse } from "next/server"
import { getFullLinkResource } from "@lib/config"
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

    if (!BASE_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"
    const pageSize =
      searchParams.get("pageSize") || DEFAULT_PAGE_SIZE.toString()
    const phoneNumber = searchParams.get("phoneNumber") || ""
    const orderId = searchParams.get("orderId") || ""
    const customerName = searchParams.get("customerName") || ""
    const status = searchParams.get("status") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""

    // Dùng Content Manager API endpoint như Strapi admin panel
    const params = new URLSearchParams()
    params.set("page", page)
    params.set("pageSize", pageSize)
    params.set("sort", "id:DESC") // hoặc createdAt:DESC tùy preference

    // Populate nested relations trực tiếp trong query chính (join bảng)
    params.set("populate[customer]", "true")
    params.set(
      "populate[order_items][populate][variant][populate][product]",
      "true"
    )
    params.set(
      "populate[order_items][populate][variant][populate][variant_image]",
      "true"
    )
    params.set("populate[order_items][populate][product]", "true")
    params.set(
      "populate[order_customer_cards][populate][customer_card][populate][image]",
      "true"
    )

    // Build filters - Content Manager API dùng format filters[key][operator]
    if (phoneNumber) {
      params.set("filters[customer][phone_number][$containsi]", phoneNumber)
    }

    if (orderId) {
      params.set("filters[documentId][$containsi]", orderId)
    }

    if (customerName) {
      params.set("filters[customer][full_name][$containsi]", customerName)
    }

    if (status) {
      // Gộp "approved" và "shipping" thành "Đang giao"
      if (status === "shipping") {
        params.set("filters[$or][0][order_status][$eq]", "approved")
        params.set("filters[$or][1][order_status][$eq]", "shipping")
      } else {
        params.set("filters[order_status][$eq]", status)
      }
    }

    if (dateFrom) {
      params.set("filters[createdAt][$gte]", `${dateFrom}T00:00:00.000Z`)
    }

    if (dateTo) {
      params.set("filters[createdAt][$lte]", `${dateTo}T23:59:59.999Z`)
    }

    // Endpoint Content Manager API
    const url = `${BASE_URL}/content-manager/collection-types/api::order.order?${params.toString()}`

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
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData?.error?.message || "Failed to fetch orders" },
        { status: response.status }
      )
    }

    const orders = await response.json()

    // Content Manager API trả về format khác, cần check structure
    // Có thể là { results: [...], pagination: {...} } hoặc { data: [...], meta: {...} }
    const ordersData = orders.results || orders.data || []
    const paginationMeta = orders.pagination || orders.meta?.pagination

    // Data đã được populate trực tiếp từ query chính (join bảng), không cần fetch riêng
    // Transform data để xử lý ảnh bằng getFullLinkResource
    const transformedData = ordersData.map((order: any) => {
      // Transform order_items - xử lý variant_image
      const transformedOrderItems = (order.order_items || []).map(
        (item: any) => {
          if (item.variant?.variant_image) {
            const variantImage = item.variant.variant_image
            item.variant.variant_image = {
              ...variantImage,
              url: variantImage.url
                ? getFullLinkResource(variantImage.url)
                : variantImage.url,
              formats: variantImage.formats
                ? {
                    ...variantImage.formats,
                    thumbnail: variantImage.formats.thumbnail
                      ? {
                          ...variantImage.formats.thumbnail,
                          url: getFullLinkResource(
                            variantImage.formats.thumbnail.url
                          ),
                        }
                      : undefined,
                    small: variantImage.formats.small
                      ? {
                          ...variantImage.formats.small,
                          url: getFullLinkResource(
                            variantImage.formats.small.url
                          ),
                        }
                      : undefined,
                  }
                : null,
            }
          }
          return item
        }
      )

      // Transform order_customer_cards - xử lý customer_card.image
      const transformedOrderCards = (order.order_customer_cards || []).map(
        (card: any) => {
          if (card.customer_card?.image) {
            const cardImage = card.customer_card.image
            card.customer_card.image = {
              ...cardImage,
              url: cardImage.url
                ? getFullLinkResource(cardImage.url)
                : cardImage.url,
              formats: cardImage.formats
                ? {
                    ...cardImage.formats,
                    thumbnail: cardImage.formats.thumbnail
                      ? {
                          ...cardImage.formats.thumbnail,
                          url: getFullLinkResource(
                            cardImage.formats.thumbnail.url
                          ),
                        }
                      : undefined,
                    small: cardImage.formats.small
                      ? {
                          ...cardImage.formats.small,
                          url: getFullLinkResource(cardImage.formats.small.url),
                        }
                      : undefined,
                  }
                : null,
            }
          }
          return card
        }
      )

      return {
        ...order,
        order_items: transformedOrderItems,
        order_customer_cards: transformedOrderCards,
      }
    })

    return NextResponse.json({
      data: transformedData,
      meta: {
        pagination: paginationMeta || {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: 1,
          total: transformedData.length,
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
