import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

// PUT - Update promotion
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ promotionId: string }> }
) {
  const params = await props.params
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

    const { promotionId } = params
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
      quantity,
      expiredAt,
    } = body

    const promotionData: any = {
      publishedAt: new Date().toISOString(), // Đảm bảo published
    }

    if (code !== undefined) promotionData.code = code
    if (title !== undefined) promotionData.title = title
    if (description !== undefined) promotionData.description = description
    if (type !== undefined) promotionData.type = type
    if (value !== undefined) promotionData.value = parseInt(value, 10)
    if (discountMinimumOrderAmount !== undefined) {
      promotionData.discountMinimumOrderAmount = parseInt(
        discountMinimumOrderAmount,
        10
      )
    }
    if (discountMaximumOrderAmount !== undefined) {
      promotionData.discountMaximumOrderAmount =
        discountMaximumOrderAmount === null || discountMaximumOrderAmount === ""
          ? null
          : parseInt(discountMaximumOrderAmount, 10)
    }

    if (isDisable !== undefined) {
      promotionData.isDisable = isDisable
    }

    if (isPrivate !== undefined) {
      promotionData.isPrivate = isPrivate
    }

    if (customerIds !== undefined) {
      promotionData.customers = customerIds
    }

    if (productIds !== undefined) {
      promotionData.products = productIds
    }

    if (imageId !== undefined) {
      promotionData.image = imageId
    }

    if (quantity !== undefined) {
      promotionData.quantity = quantity
    }

    if (expiredAt !== undefined) {
      promotionData.expiredAt = expiredAt
    }

    // Dùng REST API trực tiếp với FULL_ACCESS_API_KEY
    const updateUrl = `${BASE_URL}/api/promotions/${promotionId}`

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
      },
      body: JSON.stringify({ data: promotionData }),
    })

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData?.error?.message || "Failed to update promotion" },
        { status: updateResponse.status }
      )
    }

    const updatedData = await updateResponse.json()
    return NextResponse.json(updatedData)
  } catch (error: any) {
    console.error("Error updating promotion:", error)
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete promotion
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ promotionId: string }> }
) {
  const params = await props.params
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

    const { promotionId } = params

    // Dùng REST API trực tiếp với FULL_ACCESS_API_KEY
    const deleteUrl = `${BASE_URL}/api/promotions/${promotionId}`

    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
      },
    })

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData?.error?.message || "Failed to delete promotion" },
        { status: deleteResponse.status }
      )
    }

    // Handle empty response (204 No Content) or possible empty 200 OK
    const text = await deleteResponse.text()
    const data = text ? JSON.parse(text) : { success: true }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error deleting promotion:", error)
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
