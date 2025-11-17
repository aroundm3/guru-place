import { NextRequest, NextResponse } from "next/server"
import { fetcherForOrderModule } from "@lib/config"

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
    console.log("dbahjbsjhasbd: ", url)

    const orders = await fetcherForOrderModule(url, {
      cache: "no-store",
    })

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
