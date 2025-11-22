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

    // Populate relations - Content Manager API format
    // Có thể dùng populate=* hoặc specify cụ thể
    params.set("populate", "*")

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

    // Fetch thêm order_items và customer_cards với populate đầy đủ (vì populate=* chỉ populate cấp 1)
    if (ordersData && ordersData.length > 0) {
      const orderIds = ordersData.map((order: any) => order.id)

      // Fetch order_items và customer_cards với filter trực tiếp theo orderIds (join hợp lý)
      // Sử dụng $in operator để filter ngay trong query, không fetch tất cả rồi filter
      const [allOrderItems, allOrderCards] = await Promise.all([
        // Fetch order_items với filter theo orderIds sử dụng $in operator
        (async () => {
          try {
            const itemsParams = new URLSearchParams()
            itemsParams.set("populate", "*")
            // Filter theo orderIds sử dụng $in để join hợp lý
            orderIds.forEach((orderId: number, index: number) => {
              itemsParams.set(
                `filters[order][id][$in][${index}]`,
                orderId.toString()
              )
            })

            const itemsResponse = await fetch(
              `${BASE_URL}/content-manager/collection-types/api::order-item.order-item?${itemsParams.toString()}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${adminToken}`,
                },
                cache: "no-store",
              }
            )

            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json()
              return itemsData.results || itemsData.data || []
            }
          } catch (error) {
            console.error("Error fetching order items:", error)
          }
          return []
        })(),

        // Fetch customer_cards với filter theo orderIds sử dụng $in operator
        (async () => {
          try {
            const cardsParams = new URLSearchParams()
            cardsParams.set("populate", "*")
            // Filter theo orderIds sử dụng $in để join hợp lý
            orderIds.forEach((orderId: number, index: number) => {
              cardsParams.set(
                `filters[order][id][$in][${index}]`,
                orderId.toString()
              )
            })

            const cardsResponse = await fetch(
              `${BASE_URL}/content-manager/collection-types/api::order-customer-card.order-customer-card?${cardsParams.toString()}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${adminToken}`,
                },
                cache: "no-store",
              }
            )

            if (cardsResponse.ok) {
              const cardsData = await cardsResponse.json()
              return cardsData.results || cardsData.data || []
            }
          } catch (error) {
            console.error("Error fetching order customer cards:", error)
          }
          return []
        })(),
      ])

      // Map order_items và customer_cards vào từng order
      const enrichedOrders = ordersData.map((order: any) => {
        const orderItems = (allOrderItems || []).filter((item: any) => {
          const itemOrderId = item.order?.id || item.order
          return itemOrderId === order.id
        })
        const orderCards = (allOrderCards || []).filter((card: any) => {
          const cardOrderId = card.order?.id || card.order
          return cardOrderId === order.id
        })

        return {
          ...order,
          order_items:
            orderItems.length > 0 ? orderItems : order.order_items || [],
          order_customer_cards:
            orderCards.length > 0
              ? orderCards
              : order.order_customer_cards || [],
        }
      })

      // Transform data để xử lý ảnh bằng getFullLinkResource
      const transformedData = enrichedOrders.map((order: any) => {
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
                            url: getFullLinkResource(
                              cardImage.formats.small.url
                            ),
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
    }

    return NextResponse.json({
      data: [],
      meta: {
        pagination: paginationMeta || {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: 0,
          total: 0,
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
