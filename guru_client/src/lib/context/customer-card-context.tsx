"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { CustomerCard } from "types/global"
import { fetcher } from "@lib/config"

interface CustomerCardContextType {
  customerCards: CustomerCard[]
  loading: boolean
  error: string | null
  refreshCustomerCards: () => Promise<void>
  getCardByIndex: (index: number) => CustomerCard | undefined
  getActiveCards: () => CustomerCard[]
  getCardById: (id: string | number) => CustomerCard | undefined
}

const CustomerCardContext = createContext<CustomerCardContextType | null>(null)

interface CustomerCardProviderProps {
  children: React.ReactNode
  initialCards?: CustomerCard[]
}

export const CustomerCardProvider = ({
  children,
  initialCards,
}: CustomerCardProviderProps) => {
  const [customerCards, setCustomerCards] = useState<CustomerCard[]>(
    initialCards || []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshCustomerCards = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch customer cards from guru-server/Strapi
      const response = await fetcher("/api/customer-cards?populate=*")
      const cards: CustomerCard[] = response.data || []

      // Sort by index for consistent ordering
      const sortedCards = cards.sort((a, b) => a.index - b.index)
      setCustomerCards(sortedCards)
    } catch (err) {
      console.error("Failed to fetch customer cards:", err)
      setError("Không thể tải danh sách thẻ giảm giá")
    } finally {
      setLoading(false)
    }
  }

  const getCardByIndex = (index: number): CustomerCard | undefined => {
    return customerCards.find((card) => card.index === index)
  }

  const getActiveCards = (): CustomerCard[] => {
    // Return cards that are published and have discount > 0
    return customerCards.filter((card) => card.publishedAt && card.discount > 0)
  }

  const getCardById = (id: string | number): CustomerCard | undefined => {
    return customerCards.find(
      (card) => card.id === id || card.documentId === id
    )
  }

  // Auto refresh cards on mount if no initial cards provided
  useEffect(() => {
    if (!initialCards || initialCards.length === 0) {
      refreshCustomerCards()
    }
  }, [])

  const value: CustomerCardContextType = {
    customerCards,
    loading,
    error,
    refreshCustomerCards,
    getCardByIndex,
    getActiveCards,
    getCardById,
  }

  return (
    <CustomerCardContext.Provider value={value}>
      {children}
    </CustomerCardContext.Provider>
  )
}

export const useCustomerCards = () => {
  const context = useContext(CustomerCardContext)
  if (context === null) {
    throw new Error(
      "useCustomerCards must be used within a CustomerCardProvider"
    )
  }
  return context
}

export const useCardById = (customerCards: CustomerCard[]) => {
  if (!customerCards.length) return null
  return customerCards.filter((card) =>
    customerCards.map((card) => card.id).includes(card.id)
  )
}

export const useBestDiscountCard = () => {
  const { getActiveCards } = useCustomerCards()
  const activeCards = getActiveCards()

  return activeCards.reduce((best, current) => {
    return current.discount > (best?.discount || 0) ? current : best
  }, activeCards[0] || null)
}
