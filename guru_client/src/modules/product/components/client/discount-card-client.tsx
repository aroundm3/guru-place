"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useCustomerCards } from "@lib/context/customer-card-context"

interface DiscountCardClientProps {
  productId: string
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

function DiscountCardContent({ productId }: { productId: string }) {
  const { customerCards } = useCustomerCards()

  if (!customerCards || customerCards.length === 0) {
    return null
  }

  return (
    <DiscountCardDisplay productId={productId} customerCards={customerCards} />
  )
}

export default function DiscountCardClient({
  productId,
}: DiscountCardClientProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DiscountCardContent productId={productId} />
    </Suspense>
  )
}
