import { NextRequest, NextResponse } from "next/server"
import { fetcherForOrderModule, getFullLinkResource } from "@lib/config"

const DEFAULT_PAGE_SIZE = 5

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get("customerId")
  const page = searchParams.get("page") || "1"
  const pageSize = searchParams.get("pageSize") || DEFAULT_PAGE_SIZE.toString()

  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 })
  }

  try {
    const params = new URLSearchParams()
    params.set("filters[customer][documentId][$eq]", customerId)
    params.set("pagination[page]", page)
    params.set("pagination[pageSize]", pageSize)
    params.set("sort", "createdAt:desc")
    params.set(
      "populate[order_items][populate][variant][populate][variant_image]",
      "true"
    )
    params.set(
      "populate[order_customer_cards][populate][customer_card][populate][image]",
      "true"
    )
    params.set("populate[customer]", "true")

    params.set("customerId", customerId)
    params.set("page", page)
    params.set("pageSize", pageSize)
    params.set("sort", "createdAt:desc")

    const url = `/api/order/customer?${params.toString()}`

    const orders = await fetcherForOrderModule(url, {
      cache: "no-store",
    })

    // Transform data để xử lý ảnh bằng getFullLinkResource (giống product/category/brand)
    if (orders?.data) {
      const transformedData = orders.data.map((order: any) => {
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
        ...orders,
        data: transformedData,
      })
    }

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
