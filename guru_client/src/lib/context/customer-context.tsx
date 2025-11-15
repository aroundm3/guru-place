"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Customer } from "@lib/data/customer"

interface CustomerContextType {
  customer: Customer | null
  setCustomer: (customer: Customer | null) => void
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | null>(null)

interface CustomerProviderProps {
  children: React.ReactNode
}

const CUSTOMER_STORAGE_KEY = "customer"

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [customer, setCustomerState] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load customer from localStorage on mount
    if (typeof window !== "undefined") {
      try {
        const customerStr = localStorage.getItem(CUSTOMER_STORAGE_KEY)
        if (customerStr) {
          const customerData = JSON.parse(customerStr)
          setCustomerState(customerData)
        }
      } catch (error) {
        console.error("Error parsing customer from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const setCustomer = (customerData: Customer | null) => {
    setCustomerState(customerData)
    if (typeof window !== "undefined") {
      if (customerData) {
        // Save to localStorage
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData))
      } else {
        // Remove from localStorage if customer is null
        localStorage.removeItem(CUSTOMER_STORAGE_KEY)
      }
    }
  }

  return (
    <CustomerContext.Provider value={{ customer, setCustomer, isLoading }}>
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => {
  const context = useContext(CustomerContext)
  if (context === null) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return context
}
