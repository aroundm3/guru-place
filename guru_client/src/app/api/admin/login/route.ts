import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const BASE_URL = process.env.BASE_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      )
    }

    if (!BASE_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Đăng nhập với Strapi Admin API
    // Thử admin endpoint trước, nếu không được thì dùng user endpoint
    let response = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    // Nếu admin endpoint không hoạt động, thử user endpoint
    if (!response.ok) {
      response = await fetch(`${BASE_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      })
    }

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || data?.message || "Đăng nhập thất bại",
        },
        { status: response.status }
      )
    }

    // Lấy token từ response (có thể là jwt hoặc data.token tùy endpoint)
    const token = data.jwt || data.token || data.data?.token

    const responseWithCookie = NextResponse.json({
      user: data.user,
      jwt: token,
    })

    // Lưu token vào cookie
    responseWithCookie.cookies.set("admin_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return responseWithCookie
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
