"use client"

import { useState, useEffect } from "react"
import { formatBigNumber } from "@lib/util/format-big-number"
import Image from "next/image"
import { Product, Variant } from "types/global"
import { Button, Checkbox, CircularProgress } from "@mui/material"
import { Divider } from "@medusajs/ui"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded"
import { useCustomerCards } from "@lib/context/customer-card-context"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"

interface CartItem {
  variantId: string | null
  quantity: number
  product: {
    productData: Product
  }
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const { getActiveCards } = useCustomerCards()
  const activeCards = getActiveCards()
  // Lấy card có discount nhỏ nhất
  const minDiscountCard =
    activeCards.length > 0
      ? activeCards.reduce((min, card) =>
          card.discount < min.discount ? card : min
        )
      : null

  // Đọc cart từ localStorage
  useEffect(() => {
    const loadCart = () => {
      if (typeof window !== "undefined") {
        const cartStr = localStorage.getItem("cart")
        if (cartStr) {
          try {
            const cartData = JSON.parse(cartStr)
            setCart(cartData || [])
            // Mặc định chọn tất cả items
            setSelectedItems(
              new Set(cartData.map((_: any, index: number) => index))
            )
          } catch (error) {
            console.error("Error parsing cart from localStorage:", error)
            setCart([])
          }
        } else {
          setCart([])
        }
      }
    }

    loadCart()

    // Lắng nghe sự kiện storage để cập nhật khi cart thay đổi
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCart()
      }
    }

    // Lắng nghe custom event để cập nhật ngay lập tức
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  // Toggle selection của một item
  const toggleItemSelection = (index: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Select/Deselect all
  const toggleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(cart.map((_, index) => index)))
    }
  }

  // Update quantity của một item
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const productData = cart[index]?.product?.productData
    if (!productData) return

    // Kiểm tra số lượng tối đa
    let maxQuantity = Number(productData.quantity) || 0
    if (cart[index].variantId && productData.variants?.length) {
      const variant = productData.variants.find(
        (v) => v.documentId === cart[index].variantId
      )
      if (variant) {
        maxQuantity = Number(variant.quantity) || 0
      }
    }

    if (newQuantity > maxQuantity) {
      newQuantity = maxQuantity
    }

    const newCart = [...cart]
    newCart[index].quantity = newQuantity

    // Cập nhật localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart))
      setCart(newCart)
      // Dispatch event để các component khác cập nhật
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  // Hàm checkout
  const handleCheckout = async () => {
    if (selectedItems.size === 0) return

    setIsCheckoutLoading(true)

    try {
      // Tính tổng tiền trước khi checkout
      const checkoutSubtotal = cart.reduce((acc, item, index) => {
        if (!selectedItems.has(index)) return acc

        const productData = item.product?.productData
        if (!productData) return acc

        let price = productData.sale_price
        if (item.variantId && productData.variants?.length) {
          const variant = productData.variants.find(
            (v) => v.documentId === item.variantId
          )
          if (variant) {
            price = variant.sale_price
          }
        }

        return acc + price * item.quantity
      }, 0)

      // Giả lập call API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Lấy danh sách items đã checkout
      const checkoutItems = Array.from(selectedItems).sort((a, b) => b - a)

      // Xóa các item đã checkout khỏi cart
      const newCart = cart.filter((_, index) => !selectedItems.has(index))

      // Cập nhật localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newCart))
        setCart(newCart)
        setSelectedItems(new Set())
        // Dispatch event để các component khác cập nhật
        window.dispatchEvent(new Event("cartUpdated"))
      }

      // TODO: Redirect hoặc hiển thị thông báo thành công
      alert(
        `Checkout thành công ${
          checkoutItems.length
        } sản phẩm với tổng tiền ${formatBigNumber(checkoutSubtotal, true)}`
      )
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Có lỗi xảy ra khi checkout. Vui lòng thử lại.")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  // Tính tổng tiền cho các item được chọn
  const calculateSubtotal = () => {
    return cart.reduce((acc, item, index) => {
      if (!selectedItems.has(index)) return acc

      const productData = item.product?.productData
      if (!productData) return acc

      // Tìm variant nếu có variantId
      let price = productData.sale_price
      if (item.variantId && productData.variants?.length) {
        const variant = productData.variants.find(
          (v) => v.documentId === item.variantId
        )
        if (variant) {
          price = variant.sale_price
        }
      }

      return acc + price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const selectedCount = selectedItems.size

  // Tính số tiền tích được dựa vào customer cards
  // discount là số tiền cố định (VND) sẽ được tích vào tài khoản
  const calculateEarnedAmount = () => {
    if (!minDiscountCard || !minDiscountCard.discount || subtotal <= 0) {
      return 0
    }

    // Discount là số tiền cố định (VND) sẽ được tích vào tài khoản
    return minDiscountCard.discount
  }

  const earnedAmount = calculateEarnedAmount()

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Giỏ hàng</h1>
        <div className="text-center py-12 sm:py-16">
          <p className="text-sm sm:text-base text-gray-600">
            Giỏ hàng của bạn đang trống.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Giỏ hàng</h1>

      {/* Select All */}
      <div className="mb-3 sm:mb-4 flex items-center gap-2">
        <Checkbox
          checked={selectedItems.size === cart.length && cart.length > 0}
          indeterminate={
            selectedItems.size > 0 && selectedItems.size < cart.length
          }
          onChange={toggleSelectAll}
          sx={{
            color: "#ec4899",
            "&.Mui-checked": {
              color: "#ec4899",
            },
            "&.MuiCheckbox-indeterminate": {
              color: "#ec4899",
            },
          }}
        />
        <span className="text-xs sm:text-sm font-medium">
          Chọn tất cả ({selectedCount}/{cart.length})
        </span>
      </div>

      <Divider className="mb-4 sm:mb-6" />

      {/* Cart Items List */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {cart.map((item, index) => {
          const productData = item.product?.productData
          if (!productData) return null

          // Tìm variant nếu có variantId
          let variant: Variant | null = null
          let price = productData.sale_price
          let basePrice = productData.base_price
          let image = productData.images?.[0]?.default || "/logo.png"
          let variantName = ""

          if (item.variantId && productData.variants?.length) {
            variant =
              productData.variants.find(
                (v) => v.documentId === item.variantId
              ) || null
            if (variant) {
              price = variant.sale_price
              basePrice = variant.base_price
              image =
                variant.variant_image?.default ||
                productData.images?.[0]?.default ||
                "/logo.png"
              variantName = variant.variant_value
            }
          }

          const isSelected = selectedItems.has(index)
          const itemTotal = price * item.quantity

          return (
            <div
              key={`${productData.documentId}-${
                item.variantId || "default"
              }-${index}`}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg transition-all ${
                isSelected ? "border-pink-700" : "border-gray-200"
              } bg-white`}
            >
              <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleItemSelection(index)}
                  className="!mt-1 flex-shrink-0"
                  sx={{
                    color: "#ec4899",
                    "&.Mui-checked": {
                      color: "#ec4899",
                    },
                  }}
                />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                  <Image
                    src={image}
                    alt={productData.name}
                    fill
                    className="object-cover rounded"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-base sm:text-lg mb-1 truncate"
                    title={productData.name}
                  >
                    {productData.name}
                  </h3>
                  {variantName && (
                    <p
                      className="text-xs sm:text-sm text-gray-600 mb-1 truncate"
                      title={variantName}
                    >
                      Phân loại: {variantName}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">
                      Số lượng:
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          updateQuantity(index, item.quantity - 1)
                        }}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-50 duration-300 border border-stone-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RemoveRoundedIcon className="!w-3 !h-3" />
                      </button>
                      <span className="text-sm font-semibold px-4 min-w-10 flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const maxQty = variant
                            ? Number(variant.quantity) || 0
                            : Number(productData.quantity) || 0
                          updateQuantity(
                            index,
                            Math.min(item.quantity + 1, maxQty)
                          )
                        }}
                        disabled={
                          item.quantity >=
                          Number(
                            variant ? variant.quantity : productData.quantity
                          )
                        }
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-50 duration-300 border border-stone-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <AddRoundedIcon className="!w-3 !h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:text-right flex-shrink-0 sm:min-w-[100px]">
                <div className="text-base sm:text-lg font-semibold text-pink-700">
                  {formatBigNumber(itemTotal, true)}
                </div>
                <div className="flex flex-col items-end sm:items-end">
                  {basePrice > price && (
                    <div className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatBigNumber(basePrice * item.quantity, true)}
                    </div>
                  )}
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">
                    {formatBigNumber(price, true)} × {item.quantity}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="border-t pt-4 sm:pt-6">
        <div className="max-w-md sm:ml-auto space-y-3 sm:space-y-4">
          {earnedAmount > 0 && minDiscountCard && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 sm:p-4 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <CardGiftcardRoundedIcon className="!w-5 !h-5 text-pink-600" />
                <span className="text-sm sm:text-base font-semibold text-pink-700">
                  Số tiền tích được
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">
                  {minDiscountCard.title}
                </span>
                <span className="text-base sm:text-lg font-bold text-pink-700">
                  {formatBigNumber(earnedAmount, true)}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-between text-base sm:text-lg">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="font-bold text-pink-700 text-lg sm:text-xl">
              {formatBigNumber(subtotal, true)}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {selectedCount} sản phẩm được chọn
          </div>
          <Button
            variant="contained"
            className="!bg-pink-700 !text-white !w-full !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold"
            disabled={selectedCount === 0 || isCheckoutLoading}
            onClick={handleCheckout}
            startIcon={
              isCheckoutLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {isCheckoutLoading
              ? "Đang xử lý..."
              : `Thanh toán (${selectedCount} sản phẩm)`}
          </Button>
        </div>
      </div>
    </div>
  )
}
