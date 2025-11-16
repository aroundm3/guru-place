export const revalidate = 60 // Revalidate every 60 seconds

import React from "react"

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
