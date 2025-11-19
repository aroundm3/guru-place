export const revalidate = 60 // Revalidate every 60 seconds

import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Divi | Đơn hàng của tôi",
  description: "Theo dõi trạng thái và chi tiết từng đơn hàng của bạn tại Divi",
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
