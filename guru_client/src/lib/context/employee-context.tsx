"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"

export interface Employee {
  id: number
  documentId: string
  name: string
  phone_number?: string
  dob?: string
}

interface EmployeeContextType {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  refreshEmployees: () => Promise<void>
}

const EmployeeContext = createContext<EmployeeContextType | null>(null)

interface EmployeeProviderProps {
  children: React.ReactNode
}

export const EmployeeProvider = ({ children }: EmployeeProviderProps) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetchedRef = useRef(false)

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/employees")
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }

      const data = await response.json()
      const employeesData = data.data || []

      setEmployees(employeesData)
    } catch (err: any) {
      console.error("Error fetching employees:", err)
      setError(err.message || "Không thể tải danh sách nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshEmployees = async () => {
    await fetchEmployees()
  }

  useEffect(() => {
    // Tránh double fetch do React StrictMode
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    // Luôn fetch từ API khi mount (F5 sẽ reset state và fetch lại)
    fetchEmployees()
  }, [])

  return (
    <EmployeeContext.Provider
      value={{ employees, isLoading, error, refreshEmployees }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export const useEmployees = () => {
  const context = useContext(EmployeeContext)
  if (context === null) {
    throw new Error("useEmployees must be used within an EmployeeProvider")
  }
  return context
}

