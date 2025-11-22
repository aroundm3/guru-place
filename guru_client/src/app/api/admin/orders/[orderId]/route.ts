import { NextRequest, NextResponse } from "next/server"
import { fetcherForOrderModule, getFullLinkResource } from "@lib/config"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const routeParams = await params
    const orderId = routeParams.orderId

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    // Dùng custom endpoint /api/order/detail/:documentId với populate đầy đủ
    const url = `/api/order/detail/${orderId}`

    const response = await fetcherForOrderModule(url, {
      cache: "no-store",
    })

    if (!response?.data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = response.data

    // Transform data để xử lý ảnh bằng getFullLinkResource
    const transformedOrderItems = (order.order_items || []).map((item: any) => {
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
                      url: getFullLinkResource(variantImage.formats.small.url),
                    }
                  : undefined,
              }
            : null,
        }
      }

      // Transform product images trong variant
      if (item.variant?.product?.images) {
        item.variant.product.images = item.variant.product.images.map(
          (img: any) => ({
            ...img,
            url: img.url ? getFullLinkResource(img.url) : img.url,
            default: img.default
              ? getFullLinkResource(img.default)
              : img.default,
            thumbnail: img.thumbnail
              ? getFullLinkResource(img.thumbnail)
              : img.thumbnail,
          })
        )
      }

      // Transform product images trực tiếp
      if (item.product?.images) {
        item.product.images = item.product.images.map((img: any) => ({
          ...img,
          url: img.url ? getFullLinkResource(img.url) : img.url,
          default: img.default ? getFullLinkResource(img.default) : img.default,
          thumbnail: img.thumbnail
            ? getFullLinkResource(img.thumbnail)
            : img.thumbnail,
        }))
      }

      return item
    })

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

    return NextResponse.json({
      data: {
        ...order,
        order_items: transformedOrderItems,
        order_customer_cards: transformedOrderCards,
      },
    })
  } catch (error: any) {
    console.error("Failed to fetch order detail:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch order detail" },
      { status: 500 }
    )
  }
}
