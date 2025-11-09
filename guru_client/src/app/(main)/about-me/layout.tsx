import type { Metadata } from "next"
import React from "react"

export const dynamic = "force-dynamic"

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
