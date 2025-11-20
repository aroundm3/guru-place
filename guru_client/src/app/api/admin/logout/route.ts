import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Xóa cookie
  response.cookies.delete("admin_jwt")
  
  return response
}

