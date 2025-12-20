"use client"

import { useState, useEffect, useMemo } from "react"
import { formatBigNumber } from "@lib/util/format-big-number"
import Image from "next/image"
import Link from "next/link"
import { Product, Variant } from "types/global"
import { Customer } from "@lib/data/customer"
import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material"
import { Divider } from "@medusajs/ui"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import { useCustomerCards } from "@lib/context/customer-card-context"
import { CustomerCardModal } from "@modules/product/components/customer-card-modal"
import { useCustomer } from "@lib/context/customer-context"
import CustomerModalForCheckout from "@modules/layout/components/customer-modal/checkout-modal"
import { useRouter } from "next/navigation"
import {
  getCardColor,
  getCardBgClasses,
  getCardBorderClasses,
  getCardBadgeClasses,
  getCardTextClasses,
} from "@lib/util/card-colors"
import PromotionsSection from "./PromotionsSection"

interface CartItem {
  variantId: string | null
  quantity: number
  product: {
    productData: Product
  }
}

type Promotion = {
  id: number
  documentId: string
  code: string
  title: string
  description?: string
  type: "percent" | "cash"
  value: number | string
  discountMinimumOrderAmount?: number | string
  discountMaximumOrderAmount?: number | string
  isDisable?: boolean
  isPrivate?: boolean
}

export default function CartClientView() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [openCardModal, setOpenCardModal] = useState<string>("")
  const [openCustomerModal, setOpenCustomerModal] = useState(false)
  const [isCheckoutFlow, setIsCheckoutFlow] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  )

  console.log("promotions bdhajjsh: ", { selectedPromotion })

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })
  const { getCardById } = useCustomerCards()
  const { customer } = useCustomer()
  const router = useRouter()

  // Lấy tất cả customer_cards từ các variant của các sản phẩm đã chọn, kèm số lượng
  const selectedCustomerCards = useMemo(() => {
    const cardMap = new Map<string, { card: any; quantity: number }>()

    cart.forEach((item, index) => {
      if (!selectedItems.has(index)) return

      const productData = item.product?.productData
      if (!productData) return

      // Lấy customer_cards từ variant nếu có variantId
      if (item.variantId && productData.variants?.length) {
        const variant = productData.variants.find(
          (v) => v.documentId === item.variantId
        )
        if (variant?.customer_cards) {
          variant.customer_cards.forEach((card: any) => {
            // Lấy full card data từ context nếu có
            const fullCard = getCardById(card.documentId || card.id) || card
            const cardId = fullCard.documentId || fullCard.id

            if (cardId) {
              const existing = cardMap.get(cardId)
              if (existing) {
                // Cộng dồn số lượng nếu card đã tồn tại
                existing.quantity += item.quantity
              } else {
                // Tạo mới với số lượng từ item
                cardMap.set(cardId, {
                  card: fullCard,
                  quantity: item.quantity,
                })
              }
            }
          })
        }
      }
    })

    return Array.from(cardMap.values()).map(({ card, quantity }) => ({
      ...card,
      quantity,
    }))
  }, [cart, selectedItems, getCardById])

  // Lấy danh sách product IDs từ selected items
  const selectedProductIds = useMemo(() => {
    const productIds: string[] = []
    cart.forEach((item, index) => {
      if (selectedItems.has(index)) {
        const productId = item.product?.productData?.documentId
        if (productId && !productIds.includes(productId)) {
          productIds.push(productId)
        }
      }
    })
    return productIds
  }, [cart, selectedItems])

  // Đọc cart từ localStorage
  useEffect(() => {
    let isFirstLoad = true

    const loadCart = (showLoading = false) => {
      if (typeof window !== "undefined") {
        if (showLoading) {
          setIsLoadingCart(true)
        }
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
        // Simulate loading delay để skeleton hiển thị (chỉ lần đầu)
        if (showLoading) {
          setTimeout(() => {
            setIsLoadingCart(false)
          }, 300)
        }
      }
    }

    loadCart(true) // Lần đầu load với skeleton

    // Lắng nghe sự kiện storage để cập nhật khi cart thay đổi
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCart(false) // Không hiển thị skeleton khi update
      }
    }

    // Lắng nghe custom event để cập nhật ngay lập tức
    const handleCartUpdate = () => {
      loadCart(false) // Không hiển thị skeleton khi update
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

  // Xóa một item khỏi cart
  const handleRemoveItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)

    // Cập nhật selectedItems - loại bỏ index đã xóa và điều chỉnh các index sau đó
    const newSelectedItems = new Set<number>()
    selectedItems.forEach((selectedIndex) => {
      if (selectedIndex < index) {
        newSelectedItems.add(selectedIndex)
      } else if (selectedIndex > index) {
        newSelectedItems.add(selectedIndex - 1)
      }
    })

    // Cập nhật localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart))
      setCart(newCart)
      setSelectedItems(newSelectedItems)
      // Dispatch event để các component khác cập nhật
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  // Hàm checkout
  const handleCheckout = async () => {
    if (selectedItems.size === 0) return

    // Luôn mở modal để user có thể xem/chỉnh sửa thông tin hoặc tiếp tục
    setIsCheckoutFlow(true)
    setOpenCustomerModal(true)
  }

  // Hàm xử lý checkout khi đã có customer
  const processCheckout = async (overrideCustomer?: Customer | null) => {
    const checkoutCustomer = overrideCustomer || customer
    if (!checkoutCustomer) return

    setIsCheckoutLoading(true)

    try {
      // Chuẩn bị items để gửi lên API
      const items = Array.from(selectedItems).map((index) => {
        const item = {
          productId: cart[index].product.productData.documentId,
          quantity: cart[index].quantity,
        }
        // Chỉ thêm variantId nếu có
        if (cart[index].variantId) {
          return { ...item, variantId: cart[index].variantId }
        }
        return item
      })

      // Chuẩn bị customerCards với quantity (format theo Strapi API: cardId, quantity)
      const customerCards =
        selectedCustomerCards.length > 0
          ? selectedCustomerCards.map((card) => ({
              cardId: card.documentId || card.id,
              quantity: card.quantity,
            }))
          : []

      // Call API checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: checkoutCustomer.documentId,
          items,
          customerCards,
          shippingFee: null, // API sẽ tự tính dựa trên isFreeShip
          point: 0,
          promotionId: selectedPromotion?.documentId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Checkout failed")
      }

      // Tính tổng tiền để hiển thị
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

      // Hiển thị thông báo thành công
      setSnackbar({
        open: true,
        message: `Đặt hàng thành công ${
          checkoutItems.length
        } sản phẩm với tổng tiền ${formatBigNumber(checkoutSubtotal, true)}`,
        severity: "success",
      })

      // Redirect sang trang đơn hàng sau khi cho user thấy snackbar
      setTimeout(() => {
        router.push("/orders")
      }, 800)
    } catch (error: any) {
      console.error("Checkout error:", error)
      setSnackbar({
        open: true,
        message:
          error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.",
        severity: "error",
      })
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

  // Calculate subtotal for non-service items only (for promotion discount)
  const nonServiceSubtotal = useMemo(() => {
    return cart.reduce((acc, item, index) => {
      if (!selectedItems.has(index)) return acc

      const productData = item.product?.productData
      if (!productData || productData.isService === true) return acc

      // Find variant if variantId exists
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
  }, [cart, selectedItems])

  // Tính tổng số tiền tích được từ tất cả các card
  // discount là số tiền cố định (VND) sẽ được tích vào tài khoản
  const totalEarnedAmount = useMemo(() => {
    if (selectedCustomerCards.length === 0 || subtotal <= 0) {
      return 0
    }

    // Tổng discount từ tất cả các card
    return selectedCustomerCards.reduce((sum, card) => {
      return sum + (card.discount || 0)
    }, 0)
  }, [selectedCustomerCards, subtotal])

  // Calculate promotion discount (only on non-service items)
  const promotionDiscount = useMemo(() => {
    if (!selectedPromotion || nonServiceSubtotal === 0) return 0

    const minOrderAmount = Number(
      selectedPromotion.discountMinimumOrderAmount || 0
    )
    if (nonServiceSubtotal < minOrderAmount) return 0

    let discount = 0
    const promoValue = Number(selectedPromotion.value)

    if (selectedPromotion.type === "percent") {
      discount = (nonServiceSubtotal * promoValue) / 100
      if (selectedPromotion.discountMaximumOrderAmount) {
        const maxDiscount = Number(selectedPromotion.discountMaximumOrderAmount)
        if (maxDiscount > 0) {
          discount = Math.min(discount, maxDiscount)
        }
      }
    } else {
      discount = promoValue
    }

    return Math.min(discount, nonServiceSubtotal)
  }, [selectedPromotion, nonServiceSubtotal])

  // Calculate shipping fee
  const shippingFee = useMemo(() => {
    if (selectedItems.size === 0) return 0

    // Check if any selected item has isFreeShip
    const hasFreeShip = Array.from(selectedItems).some((index) => {
      const item = cart[index]
      return item.product?.productData?.isFreeShip === true
    })

    return hasFreeShip ? 0 : 15000
  }, [cart, selectedItems])

  const finalTotal = Math.max(0, subtotal - promotionDiscount + shippingFee)

  // Skeleton component cho cart items
  const CartItemSkeleton = () => (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 p-3 lg:p-4 border border-gray-200 rounded-lg bg-white animate-pulse">
      <div className="flex gap-3 lg:gap-4 flex-1 min-w-0">
        <div className="w-5 h-5 bg-gray-200 rounded mt-1 flex-shrink-0" />
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex items-center gap-2 mt-2">
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
      <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 lg:gap-3">
        <div className="flex flex-col items-end gap-1">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  )

  // Hiển thị skeleton khi đang load
  if (isLoadingCart) {
    return (
      <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-6xl">
        <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Giỏ hàng</h1>
        <div className="mb-3 lg:mb-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="h-px bg-gray-200 mb-4 lg:mb-6" />
        <div className="space-y-3 lg:space-y-4">
          {[1, 2, 3].map((i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Hiển thị empty state khi cart trống
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-6xl">
        <h1 className="text-xl lg:text-2xl font-bold mb-4">Giỏ hàng</h1>
        <div className="text-center py-12 lg:py-16">
          <p className="text-sm lg:text-base text-gray-600 mb-6">
            Giỏ hàng của bạn đang trống.
          </p>
          <Link href="/products">
            <Button
              variant="contained"
              className="!bg-pink-700 !text-white !px-6 !py-2.5 !text-sm lg:!text-base !font-semibold"
            >
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-6xl">
      <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Giỏ hàng</h1>

      {/* Select All */}
      <div className="mb-3 lg:mb-4 flex items-center gap-2">
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
        <span className="text-xs lg:text-sm font-medium">
          Chọn tất cả ({selectedCount}/{cart.length})
        </span>
      </div>

      <Divider className="mb-4 lg:mb-6" />

      {/* Cart Items List */}
      <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
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
          const isService = productData.isService === true

          return (
            <div
              key={`${productData.documentId}-${
                item.variantId || "default"
              }-${index}`}
              className={`flex flex-col lg:flex-row gap-3 lg:gap-4 p-3 lg:p-4 border rounded-lg transition-all ${
                isSelected ? "border-pink-700" : "border-gray-200"
              } bg-white`}
            >
              <div className="flex gap-2 lg:gap-3 flex-1 min-w-0">
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
                <Link
                  href={`/product/${productData.slug}`}
                  className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0"
                >
                  <Image
                    src={image}
                    alt={productData.name}
                    fill
                    className="object-cover rounded"
                    sizes="96px"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${productData.slug}`}>
                    <h3
                      className="font-semibold text-base lg:text-lg mb-1 truncate hover:text-pink-700 transition-colors cursor-pointer"
                      title={productData.name}
                    >
                      {productData.name}
                    </h3>
                  </Link>
                  {variantName && (
                    <p
                      className="text-xs lg:text-sm text-gray-600 mb-1 truncate"
                      title={variantName}
                    >
                      {isService ? "Loại dịch vụ:" : "Phân loại:"} {variantName}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs lg:text-sm font-semibold text-gray-600">
                      Số lượng:
                    </span>
                    <div className="flex items-center space-x-1">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          updateQuantity(index, item.quantity - 1)
                        }}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-50 duration-300 border border-stone-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RemoveRoundedIcon className="!w-4 !h-4" />
                      </IconButton>
                      <span className="text-sm font-semibold px-4 min-w-10 flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <IconButton
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
                        <AddRoundedIcon className="!w-4 !h-4" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-end lg:flex-col lg:text-right flex-shrink-0 lg:min-w-[100px] gap-2">
                <div className="flex flex-col items-end lg:items-end">
                  {basePrice > price && (
                    <div className="text-xs lg:text-sm text-gray-400 line-through">
                      {formatBigNumber(basePrice * item.quantity, true)}
                    </div>
                  )}
                  {!isService && (
                    <div className="text-xs lg:text-sm text-gray-500 mt-1">
                      {formatBigNumber(price, true)} × {item.quantity}
                    </div>
                  )}
                  <div className="text-base lg:text-lg font-semibold text-pink-700">
                    {formatBigNumber(itemTotal, true)}
                  </div>
                </div>
                {/* Nút xóa */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveItem(index)
                  }}
                  className="!p-2 hover:bg-pink-50 transition-colors"
                  aria-label="Xóa sản phẩm"
                >
                  <DeleteRoundedIcon className="!w-5 !h-5 !text-pink-600" />
                </IconButton>
              </div>
            </div>
          )
        })}
      </div>

      {/* Promotions Section - Luôn hiển thị để user nhập mã private */}
      <PromotionsSection
        productIds={selectedProductIds}
        onSelectPromotion={setSelectedPromotion}
        customer={customer}
        onRequestCustomerInfo={() => {
          setIsCheckoutFlow(false)
          setOpenCustomerModal(true)
        }}
        subtotal={nonServiceSubtotal}
      />

      {/* Summary */}
      <div className="border-t pt-4 lg:pt-6">
        {/* Customer Cards - Desktop: dàn ngang, Mobile: tối giản */}
        {selectedCustomerCards.length > 0 && (
          <div className="mb-4 lg:mb-6">
            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">
              Thẻ tích điểm nhận được
            </h3>
            {/* Desktop: Grid layout dàn ngang */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {selectedCustomerCards.map((card) => {
                const cardColor = getCardColor(card)
                return (
                  <div
                    key={card.documentId}
                    onClick={() => setOpenCardModal(card.documentId)}
                    className={`${getCardBgClasses(
                      cardColor
                    )} border rounded-lg relative cursor-pointer active:opacity-80 transition-opacity hover:shadow-lg`}
                  >
                    {/* Badge số lượng lòi ra ngoài ở góc trên bên phải */}
                    {card.quantity > 0 && (
                      <div
                        className={`absolute -top-2 -right-2 ${getCardBadgeClasses(
                          cardColor
                        )} text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg z-20 border-2 border-white`}
                      >
                        {card.quantity}
                      </div>
                    )}
                    {/* Ảnh card */}
                    <div className="relative w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={card.image?.default || "/logo.png"}
                        alt={card.title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    {/* Title dưới ảnh */}
                    <div
                      className={`p-3 border-b ${getCardBorderClasses(
                        cardColor
                      )}`}
                    >
                      <h4
                        className={`${getCardTextClasses(
                          cardColor
                        )} text-base font-bold line-clamp-2`}
                      >
                        {card.title}
                      </h4>
                    </div>
                    {/* Nội dung - chỉ hiển thị khi discount > 0 */}
                    {card.discount > 0 && (
                      <div className="p-3 lg:p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs lg:text-sm text-gray-600">
                            Số tiền tích được
                          </span>
                          <span
                            className={`text-sm lg:text-base font-bold ${getCardTextClasses(
                              cardColor
                            )}`}
                          >
                            {formatBigNumber(card.discount || 0, true)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {/* Mobile: Horizontal scroll, click để mở modal */}
            <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 pt-2">
              {selectedCustomerCards.map((card) => {
                const cardColor = getCardColor(card)
                return (
                  <div
                    key={card.documentId}
                    onClick={() => setOpenCardModal(card.documentId)}
                    className={`${getCardBgClasses(
                      cardColor
                    )} border rounded-lg relative cursor-pointer active:opacity-80 transition-opacity flex-shrink-0 w-[200px] overflow-visible`}
                  >
                    {/* Badge số lượng lòi ra ngoài ở góc trên bên phải */}
                    {card.quantity > 0 && (
                      <div
                        className={`absolute -top-2 -right-2 ${getCardBadgeClasses(
                          cardColor
                        )} text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg z-20 border-2 border-white`}
                      >
                        {card.quantity}
                      </div>
                    )}
                    <div className="relative w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={card.image?.default || "/logo.png"}
                        alt={card.title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                        sizes="200px"
                      />
                    </div>
                    {/* Title và discount dưới ảnh */}
                    <div className="p-2 border-t border-gray-200">
                      <h4
                        className={`${getCardTextClasses(
                          cardColor
                        )} text-xs font-bold line-clamp-2 ${
                          card.discount > 0 ? "mb-1" : ""
                        }`}
                      >
                        {card.title}
                      </h4>
                      {card.discount > 0 && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-gray-600">
                            Tích được
                          </span>
                          <span
                            className={`text-xs font-bold ${getCardTextClasses(
                              cardColor
                            )}`}
                          >
                            {formatBigNumber(card.discount || 0, true)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <Divider className="my-6" />
        <div className="max-w-md sm:ml-auto space-y-3 lg:space-y-4">
          <div className="flex justify-between text-base lg:text-lg">
            <span className="font-semibold">Tạm tính:</span>
            <span className="font-bold text-lg lg:text-xl">
              {formatBigNumber(subtotal, true)}
            </span>
          </div>
          {promotionDiscount > 0 && (
            <div className="flex justify-between text-base lg:text-lg text-pink-600">
              <span className="font-semibold">Mã giảm giá:</span>
              <span className="font-bold text-lg lg:text-xl">
                -{formatBigNumber(promotionDiscount, true)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base lg:text-lg">
            <span className="font-semibold">Phí vận chuyển:</span>
            <span className="font-bold text-lg lg:text-xl">
              {shippingFee === 0
                ? "Miễn phí"
                : formatBigNumber(shippingFee, true)}
            </span>
          </div>
          <div className="flex justify-between text-base lg:text-lg">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="font-bold text-pink-700 text-lg lg:text-xl">
              {formatBigNumber(finalTotal, true)}
            </span>
          </div>
          <div className="text-sm lg:text-base font-semibold text-gray-600">
            {selectedCount} sản phẩm được chọn
          </div>
          <Button
            variant="contained"
            className="!bg-pink-700 !text-white !w-full !py-2.5 lg:!py-3 !text-sm lg:!text-base !font-semibold"
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

      {/* Modal cho mobile - hiển thị chi tiết card */}
      {openCardModal && (
        <CustomerCardModal
          open={!!openCardModal}
          onClose={() => setOpenCardModal("")}
          card={
            selectedCustomerCards.find(
              (card) => card.documentId === openCardModal
            ) || undefined
          }
        />
      )}

      {/* Customer Modal cho checkout */}
      <CustomerModalForCheckout
        open={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
        onSuccess={(updatedCustomer) => {
          setOpenCustomerModal(false)
          if (isCheckoutFlow) {
            processCheckout(updatedCustomer)
          }
        }}
        message={
          isCheckoutFlow
            ? undefined
            : "Vui lòng nhập thông tin của bạn để có thêm nhiều mã giảm giá"
        }
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
