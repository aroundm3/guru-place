import { Metadata } from "next"
import React from "react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Divi | Đối soát đơn hàng",
  description: "Trang đối soát và quản lý đơn hàng hệ thống",
}

export default function ReconciliationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

