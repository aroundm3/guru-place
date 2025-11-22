import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { fetcherForOrderModule } from "@lib/config"

const BASE_URL = process.env.BASE_URL

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
    const { exchangeQuantity, cardId } = await request.json()

    if (!exchangeQuantity || !cardId) {
      return NextResponse.json(
        { error: "Missing exchangeQuantity or cardId" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin_jwt")?.value

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Fetch tất cả orders của customer có trạng thái completed (sắp xếp từ cũ đến mới)
    // Sử dụng Content Manager API để fetch orders
    const paramsForOrders = new URLSearchParams()
    paramsForOrders.set("filters[customer][documentId][$eq]", customerId)
    paramsForOrders.set("filters[order_status][$eq]", "completed")
    paramsForOrders.set("pagination[page]", "1")
    paramsForOrders.set("pagination[pageSize]", "1000")
    paramsForOrders.set("sort", "createdAt:asc") // Từ cũ đến mới
    paramsForOrders.set("populate", "*")

    const ordersUrl = `${BASE_URL}/content-manager/collection-types/api::order.order?${paramsForOrders.toString()}`
    const ordersResponse = await fetch(ordersUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      cache: "no-store",
    })

    if (!ordersResponse.ok) {
      const errorData = await ordersResponse.json().catch(() => ({}))
      console.error("Error fetching orders:", errorData)
      return NextResponse.json(
        { error: errorData?.error?.message || "Failed to fetch orders" },
        { status: ordersResponse.status }
      )
    }

    const ordersData = await ordersResponse.json()
    const orders = {
      data: ordersData.results || ordersData.data || [],
    }

    if (!orders?.data || orders.data.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng đã hoàn thành" },
        { status: 404 }
      )
    }

    // 2. Tính tổng số lượng thẻ tích được
    let totalCards = 0
    const orderCardsList: Array<{
      orderId: number
      orderCardId: number
      orderCardDocumentId: string
      quantity: number
      originalQuantity?: number // Lưu quantity gốc để update nếu cần
    }> = []

    // Fetch tất cả order_customer_cards với populate customer_card
    const cardsParams = new URLSearchParams()
    cardsParams.set("populate", "*")
    cardsParams.set("pageSize", "1000")

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

    let allOrderCards: any[] = []
    if (cardsResponse.ok) {
      const cardsData = await cardsResponse.json()
      allOrderCards = cardsData.results || cardsData.data || []
    }

    // Lọc order_customer_cards theo orderIds và cardId
    const orderIds = orders.data.map((order: any) => order.id)
    const filteredOrderCards = allOrderCards.filter((orderCard: any) => {
      const cardOrderId = orderCard.order?.id || orderCard.order
      if (!orderIds.includes(cardOrderId)) return false

      // Chỉ lấy thẻ có customer_card.documentId trùng với cardId cần xóa
      const cardDocumentId =
        orderCard.customer_card?.documentId || orderCard.customer_card?.id
      return cardDocumentId === cardId
    })

    // Sắp xếp order_customer_cards theo order.createdAt (từ cũ đến mới)
    filteredOrderCards.sort((a: any, b: any) => {
      const orderA = orders.data.find(
        (o: any) => o.id === (a.order?.id || a.order)
      )
      const orderB = orders.data.find(
        (o: any) => o.id === (b.order?.id || b.order)
      )
      if (!orderA || !orderB) return 0
      return (
        new Date(orderA.createdAt).getTime() -
        new Date(orderB.createdAt).getTime()
      )
    })

    // Tạo danh sách các thẻ cần xóa (mỗi thẻ là một entry riêng nếu quantity > 1)
    filteredOrderCards.forEach((orderCard: any) => {
      const quantity = Number(orderCard.quantity || 1)
      totalCards += quantity

      // Nếu quantity > 1, tạo nhiều entry (mỗi entry là 1 thẻ)
      // Nhưng thực tế trong DB, mỗi order_customer_card chỉ có 1 record với quantity
      // Nên ta chỉ cần 1 entry và xử lý quantity khi xóa
      orderCardsList.push({
        orderId: orderCard.order?.id || orderCard.order,
        orderCardId: orderCard.id,
        orderCardDocumentId: orderCard.documentId,
        quantity: quantity,
      })
    })

    // 3. Kiểm tra số lượng có đủ để đổi không
    if (totalCards < exchangeQuantity) {
      return NextResponse.json(
        {
          error: `Không đủ thẻ để đổi. Khách hàng chỉ có ${totalCards} thẻ tích được.`,
        },
        { status: 400 }
      )
    }

    // 4. Xóa thẻ từ đơn cũ nhất đến mới nhất (theo số lượng cần đổi)
    let remainingToDelete = exchangeQuantity
    const deletePromises: Promise<void>[] = []
    const updatePromises: Promise<void>[] = []
    let deletedCount = 0

    for (const orderCard of orderCardsList) {
      if (remainingToDelete <= 0) break

      const cardQuantity = orderCard.quantity
      let deleteQuantity = 0

      if (cardQuantity <= remainingToDelete) {
        // Xóa toàn bộ order_customer_card này
        deleteQuantity = cardQuantity

        // Xóa bằng documentId sử dụng custom endpoint
        const findAndDelete = async () => {
          try {
            const deleteUrl = `${BASE_URL}/api/order-customer-cards/document/${orderCard.orderCardDocumentId}`
            const deleteResponse = await fetch(deleteUrl, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
            })

            if (deleteResponse.ok) {
              deletedCount += cardQuantity // Đếm số lượng thẻ đã xóa
            } else {
              const errorData = await deleteResponse.json().catch(() => ({}))
              console.error(
                `Failed to delete order_customer_card ${orderCard.orderCardDocumentId}:`,
                errorData
              )
            }
          } catch (error) {
            console.error(
              `Error deleting order_customer_card ${orderCard.orderCardDocumentId}:`,
              error
            )
          }
        }

        deletePromises.push(findAndDelete())
      } else {
        // Giảm quantity của order_customer_card này
        deleteQuantity = remainingToDelete

        // Update quantity
        const findAndUpdate = async () => {
          try {
            // Tìm lại bằng documentId để lấy id mới nhất
            const findParams = new URLSearchParams()
            findParams.set(
              "filters[documentId][$eq]",
              orderCard.orderCardDocumentId
            )
            const findUrl = `${BASE_URL}/content-manager/collection-types/api::order-customer-card.order-customer-card?${findParams.toString()}`

            const findResponse = await fetch(findUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
            })

            if (findResponse.ok) {
              const findData = await findResponse.json()
              const foundCard = findData.results?.[0] || findData.data?.[0]

              if (foundCard && foundCard.id) {
                const updateUrl = `${BASE_URL}/content-manager/collection-types/api::order-customer-card.order-customer-card/${foundCard.id}`
                const updateResponse = await fetch(updateUrl, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                  },
                  body: JSON.stringify({
                    data: {
                      quantity: cardQuantity - deleteQuantity,
                    },
                  }),
                })

                if (updateResponse.ok) {
                  deletedCount += deleteQuantity // Đếm số lượng thẻ đã xóa (giảm quantity)
                } else {
                  const errorData = await updateResponse
                    .json()
                    .catch(() => ({}))
                  console.error(
                    `Failed to update order_customer_card ${orderCard.orderCardDocumentId} (id: ${foundCard.id}):`,
                    errorData
                  )
                }
              }
            }
          } catch (error) {
            console.error(
              `Error updating order_customer_card ${orderCard.orderCardDocumentId}:`,
              error
            )
          }
        }

        updatePromises.push(findAndUpdate())
      }

      remainingToDelete -= deleteQuantity
    }

    // Thực hiện tất cả các thao tác xóa và update song song
    await Promise.all([...deletePromises, ...updatePromises])

    return NextResponse.json({
      success: true,
      message: `Đã đổi ${exchangeQuantity} thẻ thành công`,
      deletedCount,
    })
  } catch (error: any) {
    console.error("Error in exchange cards:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
