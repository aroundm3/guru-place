"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Customer } from "@lib/data/customer"
import { getCookie, setCookie } from "@lib/util/cookies"

interface CustomerContextType {
  customer: Customer | null
  setCustomer: (customer: Customer | null) => void
  isLoading: boolean
}

const CustomerContext = createContext<CustomerContextType | null>(null)

interface CustomerProviderProps {
  children: React.ReactNode
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [customer, setCustomerState] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load customer from cookie on mount
    const customerStr = getCookie("customer")
    if (customerStr) {
      try {
        const customerData = JSON.parse(customerStr)
        setCustomerState(customerData)
      } catch (error) {
        console.error("Error parsing customer from cookie:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const setCustomer = (customerData: Customer | null) => {
    setCustomerState(customerData)
    if (customerData) {
      setCookie("customer", JSON.stringify(customerData), 30) // 30 days
    } else {
      // Remove cookie if customer is null
      if (typeof window !== "undefined") {
        document.cookie =
          "customer=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
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
