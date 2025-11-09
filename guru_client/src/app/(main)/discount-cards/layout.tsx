import { Metadata } from "next"
import React from "react"

export const dynamic = "force-dynamic" // Prevent prerendering errors

export const metadata: Metadata = {
  title: "Divi | Thẻ giảm giá",
  description: "Xem các thẻ giảm giá và ưu đãi đặc biệt tại Divi",
}

export default function DiscountCardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
