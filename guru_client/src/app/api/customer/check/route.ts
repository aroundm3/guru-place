import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json()

    if (!phone_number) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${BASE_URL}/api/customers?filters[phone_number][$eq]=${phone_number}`,
      {
        headers: {
          Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch customer")
    }

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      return NextResponse.json({ customer: data.data[0], exists: true })
    }

    return NextResponse.json({ customer: null, exists: false })
  } catch (error) {
    console.error("Error checking customer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
