import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, phone_number, dob, address } = body
    const normalizedAddress =
      typeof address === "string" && address.trim().length > 0
        ? address.trim()
        : null

    if (!full_name || !phone_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const response = await fetch(`${BASE_URL}/api/customers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          full_name,
          phone_number,
          dob: dob || null,
          address: normalizedAddress,
          point: 0,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData?.error?.message || "Failed to create customer")
    }

    const data = await response.json()
    return NextResponse.json({ customer: data.data })
  } catch (error: any) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
