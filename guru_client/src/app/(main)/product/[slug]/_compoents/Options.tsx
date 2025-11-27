"use client"

import { formatBigNumber } from "@lib/util/format-big-number"
import { Button, Snackbar, Drawer, Collapse, IconButton } from "@mui/material"
import Image from "next/image"
import { Fragment, useState, useEffect, useMemo } from "react"
import { Product, Variant, CustomerCard } from "types/global"
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import CloseIcon from "@mui/icons-material/Close"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"
import { Divider } from "@medusajs/ui"
import { CustomerCardModal } from "@modules/product/components/customer-card-modal"
import { useCustomerCards } from "@lib/context/customer-card-context"
import {
  getCardColor,
  getCardBgClasses,
  getCardBorderClasses,
  getCardBadgeClasses,
  getCardIconClasses,
  getCardTextClasses,
} from "@lib/util/card-colors"

// Hook detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  return isMobile
}

interface OptionsProps {
  productData: Product
}

export default function Options({ productData }: OptionsProps) {
  const { variants } = productData
  const isMobile = useIsMobile()
  const { getCardById } = useCustomerCards()
  const [currentPicked, setCurrentPicked] = useState<Variant | undefined>()
  const [quantityPicked, setQuantityPicked] = useState(1)
  const isService = productData.isService === true
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [showWarning, setShowWarning] = useState({
    isOpen: false,
    message: "",
  })
  const [openCardModal, setOpenCardModal] = useState(false)

  // Lấy card có discount nhỏ nhất từ variant được chọn
  const minDiscountCardFromVariant: CustomerCard | null = useMemo(() => {
    if (
      !currentPicked?.customer_cards ||
      currentPicked.customer_cards.length === 0
    ) {
      return null
    }
    return currentPicked.customer_cards.reduce((min, card) =>
      card.discount < min.discount ? card : min
    )
  }, [currentPicked])

  // Lấy full card data từ context
  const minDiscountCard: CustomerCard | null = useMemo(() => {
    if (!minDiscountCardFromVariant) return null
    const fullCard =
      getCardById(minDiscountCardFromVariant.documentId) ||
      getCardById(minDiscountCardFromVariant.id) ||
      minDiscountCardFromVariant
    return fullCard
  }, [minDiscountCardFromVariant, getCardById])

  // Hàm xử lý khi switch variant
  const handleVariantChange = (variant: Variant) => {
    setCurrentPicked(variant)

    // Kiểm tra nếu số lượng hiện tại lớn hơn số lượng sẵn của variant mới
    const maxQuantity = Number(variant.quantity ?? 0)
    if (quantityPicked > maxQuantity) {
      setQuantityPicked(maxQuantity > 0 ? maxQuantity : 1)
    }
  }

  const handleConfirmAddToCart = () => {
    if (!currentPicked && productData.variants.length > 1) {
      setShowWarning({
        isOpen: true,
        message:
          "Bạn chưa chọn phân loại sản phẩm, vui lòng lựa chọn trước khi thêm vào giỏ!",
      })
      return
    }

    if (!productData) return

    // Nếu là dịch vụ, mặc định quantity = 1
    const finalQuantity = isService ? 1 : quantityPicked

    const cartItem = {
      variantId: currentPicked?.documentId || null,
      quantity: finalQuantity,
      product: {
        productData,
      },
    }

    // Đọc giỏ hàng hiện tại từ localStorage
    let cart: any[] = []
    if (typeof window !== "undefined") {
      const cartStr = localStorage.getItem("cart")
      if (cartStr) {
        cart = JSON.parse(cartStr)
      }

      // Kiểm tra sản phẩm đã có trong giỏ chưa (theo productId + variantId)
      const existingIndex = cart.findIndex((item) => {
        return (
          item.product?.productData?.documentId ===
            cartItem?.product?.productData?.documentId &&
          item.variantId === cartItem.variantId
        )
      })

      if (existingIndex > -1) {
        // Nếu là dịch vụ, không cộng dồn số lượng (giữ nguyên 1)
        if (isService) {
          // Không làm gì cả, giữ nguyên số lượng = 1
        } else {
          // Nếu không phải dịch vụ thì cộng dồn số lượng như bình thường
          cart[existingIndex].quantity += cartItem.quantity
        }
      } else {
        // Nếu chưa có thì thêm mới
        cart.push(cartItem)
      }

      // Lưu lại vào localStorage
      localStorage.setItem("cart", JSON.stringify(cart))

      // Dispatch event để CartDropdown cập nhật ngay lập tức
      window.dispatchEvent(new Event("cartUpdated"))
    }

    setQuantityPicked(1)
    setCurrentPicked(undefined)
    setIsBottomSheetOpen(false)
  }

  const handleAddToCart = () => {
    if (isMobile) {
      // Mobile: mở bottom sheet
      setIsBottomSheetOpen(true)
    } else {
      // Desktop: add to cart luôn
      handleConfirmAddToCart()
    }
  }

  return (
    <Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={showWarning.isOpen}
        autoHideDuration={4000}
        onClose={() => {
          setShowWarning({ ...showWarning, isOpen: false })
        }}
        message={showWarning.message}
      />
      <div className="flex flex-col space-y-2">
        {/* Desktop: Hiển thị đầy đủ options */}
        <div className="hidden lg:flex flex-col space-y-4">
          {productData?.variants?.length > 1 && (
            <p className="text-sm font-medium text-neutral-600">
              {isService ? "Loại dịch vụ:" : "Phân loại:"}
            </p>
          )}
          {variants.length ? (
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => {
                const isOutOfStock = Number(variant.quantity ?? 0) === 0
                return (
                  <div
                    onClick={() => {
                      if (!isOutOfStock) {
                        handleVariantChange(variant)
                      }
                    }}
                    key={variant.id}
                    className={`flex space-x-2 items-center pr-2 rounded border-2 ${
                      currentPicked?.id === variant.id
                        ? "border-pink-700 text-pink-700"
                        : "border-stone-300"
                    } ${
                      isOutOfStock
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-stone-100"
                    } bg-stone-50 duration-300`}
                  >
                    <Image
                      src={variant.variant_image?.thumbnail || "/logo.png"}
                      alt={variant.variant_value}
                      width={0}
                      height={0}
                      sizes="50vh"
                      style={{ height: "36px", width: "36px" }}
                      className="!object-contain aspect-square rounded-tl rounded-bl"
                    />
                    <span className="text-xs font-medium">
                      {variant.variant_value}
                      {isOutOfStock && (
                        <span className="text-red-500 ml-1">(Hết hàng)</span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            ""
          )}
          <div className="flex lg:flex-row flex-col justify-between lg:gap-4 gap-2">
            {currentPicked ? (
              <div className="flex flex-col my-auto">
                <span className="lg:text-2xl text-xl font-bold text-pink-600">
                  {formatBigNumber(currentPicked.sale_price, true)}
                </span>
                {currentPicked.base_price > currentPicked.sale_price ? (
                  <span className="line-through text-xs font-medium text-gray-400">
                    {formatBigNumber(currentPicked.sale_price, true)}
                  </span>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div className="flex flex-col my-auto">
                <span className="lg:text-2xl text-xl font-bold text-pink-600">
                  {formatBigNumber(productData.sale_price, true)}
                </span>
                {Number(productData.base_price) >
                Number(productData.sale_price) ? (
                  <span className="line-through text-xs font-medium text-gray-400">
                    {formatBigNumber(productData.base_price, true)}
                  </span>
                ) : (
                  ""
                )}
              </div>
            )}

            {!isService &&
              (currentPicked ? (
                <div className="flex items-end flex-col gap-1">
                  <span className="text-sm font-normal text-neutral-600">
                    Sẵn:{" "}
                    <span className="text-base font-semibold">
                      {formatBigNumber(Number(currentPicked.quantity ?? 0))}
                    </span>
                  </span>
                  <span className="text-sm font-normal text-neutral-600">
                    Đã bán:{" "}
                    <span className="text-base font-semibold">
                      {formatBigNumber(
                        Number(currentPicked.sold_quantity ?? 0)
                      )}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="flex items-end flex-col gap-1">
                  <span className="text-sm font-normal text-neutral-600">
                    Sẵn:{" "}
                    <span className="text-base font-semibold">
                      {formatBigNumber(Number(productData.quantity ?? 0))}
                    </span>
                  </span>
                  <span className="text-sm font-normal text-neutral-600">
                    Đã bán:{" "}
                    <span className="text-base font-semibold">
                      {formatBigNumber(Number(productData.sold_quantity ?? 0))}
                    </span>
                  </span>
                </div>
              ))}
          </div>
          {/* Message tích điểm khi chọn variant có customer_cards (Desktop) */}
          <Collapse in={!!minDiscountCard}>
            {minDiscountCard &&
              (() => {
                const cardColor = getCardColor(minDiscountCard)
                return (
                  <div
                    className={`relative ${getCardBgClasses(
                      cardColor
                    )} border ${getCardBorderClasses(
                      cardColor
                    )} rounded-lg p-3`}
                  >
                    {/* Badge số lượng ở góc trên bên trái */}
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 ${getCardBadgeClasses(
                        cardColor
                      )} text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md`}
                    >
                      x{quantityPicked}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardGiftcardRoundedIcon
                        className={`!w-5 !h-5 ${getCardIconClasses(
                          cardColor
                        )} flex-shrink-0`}
                      />
                      <p className="text-xs lg:text-sm font-semibold text-neutral-900">
                        Phần quà khi mua sản phẩm này
                      </p>
                    </div>
                    <p
                      className={`text-sm lg:text-base font-bold ${getCardTextClasses(
                        cardColor
                      )} mb-2`}
                    >
                      {minDiscountCard.title || "Thẻ tích điểm"}
                    </p>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenCardModal(true)}
                      className="!normal-case !text-xs !font-semibold !border-neutral-300 !text-neutral-700 hover:!bg-neutral-100"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                )
              })()}
          </Collapse>
          {!isService && (
            <div className="flex flex-col space-y-1">
              <span className="text-xs font-semibold text-gray-400">
                Chọn số lượng
              </span>
              <div className="flex space-x-1">
                <IconButton
                  onClick={() => {
                    if (quantityPicked === 1) {
                      return
                    }

                    setQuantityPicked(quantityPicked - 1)
                  }}
                  disabled={quantityPicked === 1}
                  className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RemoveRoundedIcon className="!w-5" />
                </IconButton>
                <div className="text-base font-semibold px-4 min-w-16 flex items-center justify-center cursor-pointer">
                  <span className="mx-auto my-auto">{quantityPicked}</span>
                </div>

                <IconButton
                  onClick={() => {
                    const maxQuantity = currentPicked
                      ? Number(currentPicked.quantity ?? 0)
                      : Number(productData.quantity ?? 0)
                    if (quantityPicked >= maxQuantity) {
                      return
                    }
                    setQuantityPicked(quantityPicked + 1)
                  }}
                  disabled={
                    (currentPicked &&
                      quantityPicked >= Number(currentPicked.quantity ?? 0)) ||
                    (!currentPicked &&
                      quantityPicked >= Number(productData.quantity ?? 0))
                  }
                  className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AddRoundedIcon className="!w-5" />
                </IconButton>
              </div>
            </div>
          )}

          {(() => {
            const availableQuantity = currentPicked
              ? Number(currentPicked.quantity ?? 0)
              : Number(productData.quantity ?? 0)
            const isOutOfStock = availableQuantity === 0

            return (
              <Button
                variant="contained"
                className="!bg-neutral-900 !text-white !normal-case !font-semibold"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock
                  ? "Hết hàng"
                  : isService
                  ? "Đặt dịch vụ"
                  : "Thêm vào giỏ"}
              </Button>
            )
          })()}
        </div>

        {/* Mobile: Chỉ hiện nút thêm vào giỏ */}
        <div className="lg:hidden">
          {(() => {
            const availableQuantity = currentPicked
              ? Number(currentPicked.quantity ?? 0)
              : Number(productData.quantity ?? 0)
            const isOutOfStock = availableQuantity === 0

            return (
              <Button
                variant="contained"
                className="!bg-neutral-900 !text-white !normal-case !font-semibold !w-full"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock
                  ? "Hết hàng"
                  : isService
                  ? "Đặt dịch vụ"
                  : "Thêm vào giỏ"}
              </Button>
            )
          })()}
        </div>
      </div>

      {/* Bottom Sheet cho Mobile */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
        >
          <div className="p-4 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thêm vào giỏ hàng</h3>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {productData.name}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-pink-600">
                  {currentPicked
                    ? formatBigNumber(currentPicked.sale_price, true)
                    : formatBigNumber(productData.sale_price, true)}
                </span>
                {!isService && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-normal text-neutral-600">
                      Sẵn:{" "}
                      <span className="text-sm font-semibold">
                        {formatBigNumber(
                          Number(
                            currentPicked?.quantity ?? productData.quantity ?? 0
                          )
                        )}
                      </span>
                    </span>
                    <span className="text-xs font-normal text-neutral-600">
                      Đã bán:{" "}
                      <span className="text-sm font-semibold">
                        {formatBigNumber(
                          Number(
                            currentPicked?.sold_quantity ??
                              productData.sold_quantity ??
                              0
                          )
                        )}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Variant Selection */}

            {productData?.variants?.length > 1 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {isService ? "Loại dịch vụ:" : "Phân loại:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    const isOutOfStock = Number(variant.quantity ?? 0) === 0
                    return (
                      <div
                        onClick={() => {
                          if (!isOutOfStock) {
                            handleVariantChange(variant)
                          }
                        }}
                        key={variant.id}
                        className={`flex space-x-2 items-center pr-2 rounded border-2 ${
                          currentPicked?.id === variant.id
                            ? "border-pink-700 text-pink-700"
                            : "border-stone-300"
                        } ${
                          isOutOfStock
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-stone-100"
                        } bg-stone-50 duration-300`}
                      >
                        <Image
                          src={variant.variant_image?.thumbnail || "/logo.png"}
                          alt={variant.variant_value}
                          width={0}
                          height={0}
                          sizes="50vh"
                          style={{ height: "36px", width: "36px" }}
                          className="!object-contain aspect-square rounded-tl rounded-bl"
                        />
                        <span className="text-xs font-medium">
                          {variant.variant_value}
                          {isOutOfStock && (
                            <span className="text-red-500 ml-1">
                              (Hết hàng)
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Message tích điểm khi chọn variant có customer_cards (Mobile) */}
            <Collapse in={!!minDiscountCard}>
              {minDiscountCard &&
                (() => {
                  const cardColor = getCardColor(minDiscountCard)
                  return (
                    <div
                      className={`relative mb-4 ${getCardBgClasses(
                        cardColor
                      )} border ${getCardBorderClasses(
                        cardColor
                      )} rounded-lg p-3`}
                    >
                      {/* Badge số lượng ở góc trên bên trái */}
                      <div
                        className={`absolute -top-2 -right-2 w-6 h-6 ${getCardBadgeClasses(
                          cardColor
                        )} text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md`}
                      >
                        x{quantityPicked}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <CardGiftcardRoundedIcon
                          className={`!w-5 !h-5 ${getCardIconClasses(
                            cardColor
                          )} flex-shrink-0`}
                        />
                        <p className="text-xs lg:text-sm font-semibold text-neutral-900">
                          Phần quà khi mua sản phẩm này
                        </p>
                      </div>
                      <p
                        className={`text-sm lg:text-base font-bold ${getCardTextClasses(
                          cardColor
                        )} mb-2`}
                      >
                        {minDiscountCard.title || "Thẻ tích điểm"}
                      </p>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOpenCardModal(true)}
                        className="!normal-case !text-xs !font-semibold !border-neutral-300 !text-neutral-700 hover:!bg-neutral-100 !w-full"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  )
                })()}
            </Collapse>

            {/* Quantity Selection */}
            {!isService && (
              <div className="flex flex-col space-y-1 ">
                <span className="text-xs font-semibold text-gray-400">
                  Chọn số lượng
                </span>
                <div className="flex space-x-1">
                  <IconButton
                    onClick={() => {
                      if (quantityPicked === 1) {
                        return
                      }

                      setQuantityPicked(quantityPicked - 1)
                    }}
                    disabled={quantityPicked === 1}
                    className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RemoveRoundedIcon className="!w-5" />
                  </IconButton>
                  <div className="text-sm font-semibold px-4 min-w-16 flex items-center justify-center">
                    <span className="mx-auto my-auto">{quantityPicked}</span>
                  </div>

                  <IconButton
                    onClick={() => {
                      const maxQuantity = currentPicked
                        ? Number(currentPicked.quantity ?? 0)
                        : Number(productData.quantity ?? 0)
                      if (quantityPicked >= maxQuantity) {
                        return
                      }
                      setQuantityPicked(quantityPicked + 1)
                    }}
                    disabled={
                      (currentPicked &&
                        quantityPicked >=
                          Number(currentPicked.quantity ?? 0)) ||
                      (!currentPicked &&
                        quantityPicked >= Number(productData.quantity ?? 0))
                    }
                    className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AddRoundedIcon className="!w-5" />
                  </IconButton>
                </div>
              </div>
            )}

            <Divider className="my-4" />

            {/* Confirm Button */}
            {(() => {
              const availableQuantity = currentPicked
                ? Number(currentPicked.quantity ?? 0)
                : Number(productData.quantity ?? 0)
              const isOutOfStock = availableQuantity === 0

              return (
                <Button
                  variant="contained"
                  className="!bg-neutral-900 !text-white !normal-case !font-semibold !w-full !py-3"
                  onClick={handleConfirmAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock
                    ? "Hết hàng"
                    : isService
                    ? "Xác nhận đặt dịch vụ"
                    : "Xác nhận thêm vào giỏ"}
                </Button>
              )
            })()}
          </div>
        </Drawer>
      )}

      {/* Modal hiển thị chi tiết card */}
      <CustomerCardModal
        open={openCardModal}
        onClose={() => setOpenCardModal(false)}
        card={minDiscountCard || undefined}
      />
    </Fragment>
  )
}
