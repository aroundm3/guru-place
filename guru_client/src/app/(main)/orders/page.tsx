"use client"

import CustomerInfoEdit from "@modules/layout/components/customer-info-edit"

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Đơn hàng của tôi
      </h1>

      <CustomerInfoEdit />

      <div className="text-center py-12 sm:py-16">
        <p className="text-sm sm:text-base text-gray-600">
          Chức năng đang được phát triển...
        </p>
      </div>
    </div>
  )
}
