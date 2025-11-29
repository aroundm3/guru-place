import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BASE_URL = process.env.BASE_URL
const API_KEY = process.env.FULL_ACCESS_API_KEY

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin_jwt")?.value

    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!BASE_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Employee là collectionType, dùng Content Manager API
    // Load 1000 records để lấy toàn bộ danh sách
    const url = `${BASE_URL}/content-manager/collection-types/api::employee.employee?page=1&pageSize=1000`
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      // Fallback: thử với public API + FULL_ACCESS_API_KEY
      const publicUrl = `${BASE_URL}/api/employees?populate=*`
      const publicResponse = await fetch(publicUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        cache: "no-store",
      })

      if (publicResponse.ok) {
        const publicData = await publicResponse.json()
        if (Array.isArray(publicData.data)) {
          return NextResponse.json({ data: publicData.data })
        } else if (publicData.data) {
          return NextResponse.json({ data: [publicData.data] })
        }
        return NextResponse.json({ data: [] })
      }

      const errorData = await response.json().catch(() => ({}))
      console.error("Error fetching employees:", errorData)
      return NextResponse.json(
        { error: errorData?.error?.message || "Failed to fetch employees" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Content Manager API trả về format với results
    if (data.results && Array.isArray(data.results)) {
      return NextResponse.json({ data: data.results })
    } else if (Array.isArray(data)) {
      return NextResponse.json({ data })
    }

    return NextResponse.json({ data: [] })
  } catch (error: any) {
    console.error("Error in GET /api/admin/employees:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

