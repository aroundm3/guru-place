"use client"

export interface Customer {
  documentId: string
  full_name: string
  phone_number: string
  dob?: string
  address: string
  point?: number
}

export async function getCustomerByPhone(
  phoneNumber: string
): Promise<Customer | null> {
  try {
    const response = await fetch("/api/customer/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    })

    if (!response.ok) {
      throw new Error("Failed to check customer")
    }

    const data = await response.json()
    return data.exists ? data.customer : null
  } catch (error) {
    console.error("Error fetching customer:", error)
    return null
  }
}

export async function createCustomer(data: {
  full_name: string
  phone_number: string
  dob?: string
  address: string
}): Promise<Customer | null> {
  try {
    const response = await fetch("/api/customer/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create customer")
    }

    const result = await response.json()
    return result.customer || null
  } catch (error) {
    console.error("Error creating customer:", error)
    return null
  }
}

export async function updateCustomer(data: {
  documentId: string
  full_name: string
  phone_number: string
  dob?: string
  address: string
}): Promise<Customer | null> {
  try {
    const response = await fetch("/api/customer/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update customer")
    }

    const result = await response.json()
    return result.customer || null
  } catch (error) {
    console.error("Error updating customer:", error)
    return null
  }
}
