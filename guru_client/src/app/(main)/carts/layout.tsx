import { Metadata } from "next"
import React from "react"

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Divi | Giỏ hàng",
  description:
    "Xem và quản lý giỏ hàng của bạn. Chọn sản phẩm để thanh toán và đặt hàng.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function CartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
