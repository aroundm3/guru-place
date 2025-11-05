"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { formatBigNumber } from "@lib/util/format-big-number"
import { Button, Divider } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment, useEffect, useRef, useState } from "react"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import Image from "next/image"
import { Product } from "types/global"

interface CartItem {
  variantId: string | null
  quantity: number
  product: {
    productData: Product
  }
}

const CartDropdown = () => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartUpdated, setCartUpdated] = useState(0)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  // Đọc cart từ localStorage
  useEffect(() => {
    const loadCart = () => {
      if (typeof window !== "undefined") {
        const cartStr = localStorage.getItem("cart")
        if (cartStr) {
          try {
            const cartData = JSON.parse(cartStr)
            setCart(cartData || [])
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

    // Lắng nghe sự kiện storage để cập nhật khi cart thay đổi từ component khác
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        loadCart()
      }
    }

    // Lắng nghe custom event để cập nhật ngay lập tức (khi cùng tab)
    const handleCartUpdate = () => {
      loadCart()
      setCartUpdated((prev) => prev + 1)
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("cartUpdated", handleCartUpdate)

    // Polling để kiểm tra thay đổi (fallback)
    const interval = setInterval(() => {
      loadCart()
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleCartUpdate)
      clearInterval(interval)
    }
  }, [])

  const totalItems = cart.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

  const subtotal = cart.reduce((acc, item) => {
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

  const itemRef = useRef<number>(totalItems || 0)

  const handleRemoveItem = (index: number) => {
    if (typeof window !== "undefined") {
      const newCart = cart.filter((_, i) => i !== index)
      localStorage.setItem("cart", JSON.stringify(newCart))
      setCart(newCart)

      // Dispatch event để các component khác cập nhật
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (cartUpdated > 0 && itemRef.current !== totalItems) {
      timedOpen()
      itemRef.current = totalItems
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, cartUpdated])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      {/* Mobile sticky cart bar */}
      {cart && cart.length > 0 ? (
        <div className="small:hidden fixed inset-x-3 bottom-4 z-[60]">
          <button
            onClick={openAndCancel}
            className="w-full flex items-center justify-between bg-slate-900 text-white rounded-md px-4 py-3 shadow-lg"
            aria-label="Mở giỏ hàng"
          >
            <span className="text-sm font-medium">
              Giỏ hàng • {totalItems} sản phẩm
            </span>
            <span className="text-sm font-semibold">
              {formatBigNumber(subtotal, true)}
            </span>
          </button>
        </div>
      ) : null}

      {/* Mobile bottom sheet cart panel */}
      <Transition
        show={cartDropdownOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="small:hidden fixed inset-0 z-[70] overflow-x-hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-black/30" onClick={close} />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-200"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in duration-150"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[50vh] overflow-hidden">
              <div className="flex justify-center pt-2">
                <div className="h-1.5 w-10 rounded-full bg-gray-300" />
              </div>
              <div className="p-3 flex items-center justify-between border-b border-gray-200">
                <h3 className="text-sm font-semibold">Giỏ hàng</h3>
                <button
                  onClick={close}
                  className="text-xs text-ui-fg-interactive"
                >
                  Đóng
                </button>
              </div>
              {cart && cart.length > 0 ? (
                <>
                  <div className="overflow-y-auto overflow-x-hidden max-h-[32vh] p-4 grid grid-cols-1 gap-y-3 no-scrollbar">
                    {cart.map((item, index) => {
                      const productData = item.product?.productData
                      if (!productData) return null

                      // Tìm variant nếu có variantId
                      let variant = null as any
                      let price = productData.sale_price
                      let basePrice = productData.base_price
                      let image =
                        productData.images?.[0]?.default || "/logo.png"
                      let variantName = ""

                      if (item.variantId && productData.variants?.length) {
                        variant = productData.variants.find(
                          (v) => v.documentId === item.variantId
                        )
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

                      return (
                        <div
                          className="flex space-x-4"
                          key={`${productData.documentId}-${
                            item.variantId || "default"
                          }-${index}`}
                          data-testid="cart-item-mobile"
                        >
                          <LocalizedClientLink
                            href={`/product/${productData.slug}`}
                            className="w-16"
                            onClick={close}
                          >
                            <div className="relative w-16 h-16">
                              <Image
                                src={image}
                                alt={productData.name}
                                fill
                                className="object-cover rounded"
                                sizes="64px"
                              />
                            </div>
                          </LocalizedClientLink>
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col mr-2 min-w-0">
                                <h4
                                  className="text-sm font-semibold overflow-hidden"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {productData.name}
                                </h4>
                                {variantName && (
                                  <div className="text-xs text-ui-fg-subtle truncate">
                                    Phân loại: {variantName}
                                  </div>
                                )}
                                <div className="text-xs text-ui-fg-subtle truncate">
                                  Số lượng: {item.quantity}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold">
                                  {formatBigNumber(price * item.quantity, true)}
                                </div>
                                {basePrice > price && (
                                  <div className="text-xs text-ui-fg-muted line-through">
                                    {formatBigNumber(
                                      basePrice * item.quantity,
                                      true
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="mt-1 text-right text-xs text-red-500 font-semibold hover:text-red-700"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Divider className="mt-1" />
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Tổng cộng</span>
                    <span className="text-base font-semibold">
                      {formatBigNumber(subtotal, true)}
                    </span>
                  </div>
                  <div className="px-3 pb-3">
                    <Button className="w-full" size="small" asChild>
                      <LocalizedClientLink href="/cart" onClick={close}>
                        Đi đến giỏ hàng
                      </LocalizedClientLink>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-sm">
                  Giỏ hàng của bạn đang trống.
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Transition>

      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <div
            className="hover:text-ui-fg-base relative"
            data-testid="nav-cart-link"
          >
            <LocalMallRoundedIcon />
            <div
              className={`absolute rounded-full ${
                !totalItems ? "bg-gray-300" : "bg-red-500"
              } text-white`}
              style={{
                fontSize: "12px",
                top: "-12px",
                right: "-6px",
                padding: "1px 5px",
              }}
            >
              {totalItems}
            </div>
          </div>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Cart</h3>
            </div>
            {cart && cart.length > 0 ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-4 no-scrollbar p-px">
                  {cart.map((item, index) => {
                    const productData = item.product?.productData
                    if (!productData) return null

                    // Tìm variant nếu có variantId
                    let variant = null
                    let price = productData.sale_price
                    let basePrice = productData.base_price
                    let image = productData.images?.[0]?.default || "/logo.png"
                    let variantName = ""

                    if (item.variantId && productData.variants?.length) {
                      variant = productData.variants.find(
                        (v) => v.documentId === item.variantId
                      )
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

                    return (
                      <div
                        className="flex space-x-4"
                        key={`${productData.documentId}-${
                          item.variantId || "default"
                        }-${index}`}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/product/${productData.slug}`}
                          className="w-24"
                          onClick={close}
                        >
                          <div className="relative w-24 h-24">
                            <Image
                              src={image}
                              alt={productData.name}
                              fill
                              className="object-cover rounded"
                              sizes="96px"
                            />
                          </div>
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3
                                  className="text-base-regular overflow-hidden"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  <LocalizedClientLink
                                    href={`/product/${productData.slug}`}
                                    data-testid="product-link"
                                    onClick={close}
                                  >
                                    {productData.name}
                                  </LocalizedClientLink>
                                </h3>
                                {variantName && (
                                  <div
                                    data-testid="cart-item-variant"
                                    className="text-sm text-ui-fg-subtle"
                                  >
                                    Phân loại: {variantName}
                                  </div>
                                )}
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                  className="text-sm text-ui-fg-subtle"
                                >
                                  Số lượng: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <div className="flex flex-col items-end">
                                  <span className="text-base-regular font-semibold text-ui-fg-base">
                                    {formatBigNumber(
                                      price * item.quantity,
                                      true
                                    )}
                                  </span>
                                  {basePrice > price && (
                                    <span className="text-sm text-ui-fg-muted line-through">
                                      {formatBigNumber(
                                        basePrice * item.quantity,
                                        true
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="mt-1 text-right text-xs text-red-500 font-semibold hover:text-red-700"
                            data-testid="cart-item-remove-button"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Divider className="mt-4" />
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-ui-fg-base font-semibold text-sm">
                      Tổng cộng
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {formatBigNumber(subtotal, true)}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="large"
                    data-testid="go-to-cart-button"
                    asChild
                  >
                    <LocalizedClientLink href="/cart" onClick={close}>
                      Đi đến giỏ hàng
                    </LocalizedClientLink>
                  </Button>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>Giỏ hàng của bạn đang trống.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button onClick={close}>Khám phá sản phẩm</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
