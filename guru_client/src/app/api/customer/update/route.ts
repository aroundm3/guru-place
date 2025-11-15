import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, full_name, phone_number, dob, address } = body

    if (!documentId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      )
    }

    if (!full_name || !phone_number || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const response = await fetch(`${BASE_URL}/api/customers/${documentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          full_name,
          phone_number,
          dob: dob || null,
          address,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData?.error?.message || "Failed to update customer")
    }

    const data = await response.json()
    return NextResponse.json({ customer: data.data })
  } catch (error: any) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
