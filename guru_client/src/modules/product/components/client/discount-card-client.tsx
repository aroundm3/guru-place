"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { CustomerCard } from "types/global"

interface DiscountCardClientProps {
  productId: string
  customerCards?: CustomerCard[]
}

// Loading component for the discount card
const LoadingSkeleton = () => null

// Dynamically import the DiscountCardDisplay component with no SSR
const DiscountCardDisplay = dynamic(
  () => import("../discount-card-display").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
)

function DiscountCardContent({
  productId,
  customerCards,
}: {
  productId: string
  customerCards?: CustomerCard[]
}) {
  if (!customerCards || customerCards.length === 0) {
    return null
  }

  return (
    <DiscountCardDisplay productId={productId} customerCards={customerCards} />
  )
}

export default function DiscountCardClient({
  productId,
  customerCards,
}: DiscountCardClientProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DiscountCardContent
        productId={productId}
        customerCards={customerCards}
      />
    </Suspense>
  )
}
