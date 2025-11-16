import { Metadata } from "next"
import React from "react"

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Divi | Thẻ quà tặng",
  description: "Xem các thẻ quà tặng và ưu đãi đặc biệt tại Divi",
}

export default function DiscountCardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
