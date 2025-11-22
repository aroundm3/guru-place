import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

const BASE_URL = process.env.BASE_URL

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin_jwt")?.value

    if (!adminToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    if (!BASE_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Verify token bằng cách gọi một endpoint nhẹ của Strapi
    // Sử dụng /admin/users/me hoặc một endpoint tương tự
    const verifyResponse = await fetch(`${BASE_URL}/admin/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    })

    if (verifyResponse.ok) {
      return NextResponse.json({ authenticated: true })
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error: any) {
    console.error("Error checking auth:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

