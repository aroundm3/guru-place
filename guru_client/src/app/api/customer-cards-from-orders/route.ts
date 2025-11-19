import { NextRequest, NextResponse } from "next/server"
import { fetcherForOrderModule, getFullLinkResource } from "@lib/config"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get("customerId")

  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 })
  }

  try {
    // Fetch tất cả orders của customer (không phân trang để lấy hết)
    const params = new URLSearchParams()
    params.set("filters[customer][documentId][$eq]", customerId)
    params.set("pagination[page]", "1")
    params.set("pagination[pageSize]", "1000") // Lấy tối đa 1000 orders
    params.set("sort", "createdAt:desc")
    params.set(
      "populate[order_customer_cards][populate][customer_card][populate][image]",
      "true"
    )

    params.set("customerId", customerId)
    params.set("page", "1")
    params.set("pageSize", "1000")

    const url = `/api/order/customer?${params.toString()}`

    const orders = await fetcherForOrderModule(url, {
      cache: "no-store",
    })

    if (!orders?.data) {
      return NextResponse.json({ data: [] })
    }

    // Nhóm customer cards theo documentId và đếm số lượng
    const cardMap = new Map<
      string,
      {
        card: any
        quantity: number
      }
    >()

    orders.data.forEach((order: any) => {
      const orderCards = order.order_customer_cards || []
      orderCards.forEach((orderCard: any) => {
        const baseCard = orderCard.customer_card
        if (baseCard?.documentId) {
          const cardId = baseCard.documentId
          const quantity = Number(orderCard.quantity || 1)

          if (cardMap.has(cardId)) {
            cardMap.get(cardId)!.quantity += quantity
          } else {
            // Transform image URLs
            let imageSrc = "/logo.png"
            if (baseCard.image) {
              if (baseCard.image.url) {
                imageSrc = getFullLinkResource(baseCard.image.url)
              } else if (baseCard.image.formats?.large?.url) {
                imageSrc = getFullLinkResource(baseCard.image.formats.large.url)
              } else if (baseCard.image.formats?.medium?.url) {
                imageSrc = getFullLinkResource(
                  baseCard.image.formats.medium.url
                )
              } else if (baseCard.image.default) {
                imageSrc = getFullLinkResource(baseCard.image.default)
              }
            }

            cardMap.set(cardId, {
              card: {
                ...baseCard,
                image: {
                  default: imageSrc,
                  small: baseCard.image?.formats?.small?.url
                    ? getFullLinkResource(baseCard.image.formats.small.url)
                    : imageSrc,
                  thumbnail: baseCard.image?.formats?.thumbnail?.url
                    ? getFullLinkResource(baseCard.image.formats.thumbnail.url)
                    : imageSrc,
                },
              },
              quantity: quantity,
            })
          }
        }
      })
    })

    // Convert map to array
    const groupedCards = Array.from(cardMap.values())

    return NextResponse.json({ data: groupedCards })
  } catch (error: any) {
    console.error("Error fetching customer cards from orders:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch customer cards" },
      { status: 500 }
    )
  }
}
