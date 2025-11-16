import type { Metadata } from "next"
import React from "react"

export const revalidate = 3600 // Revalidate every hour (static content)

export const metadata: Metadata = {
  title: "About Me | Divi",
  description: "Learn more about me and my journey",
}

export default function AboutMeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
