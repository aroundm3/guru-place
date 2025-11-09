"use client"

import { formatBigNumber } from "@lib/util/format-big-number"
import { Button, Snackbar, Drawer } from "@mui/material"
import Image from "next/image"
import { Fragment, useState, useEffect } from "react"
import { Product, Variant } from "types/global"
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import CloseIcon from "@mui/icons-material/Close"
import { Divider } from "@medusajs/ui"

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
  const [currentPicked, setCurrentPicked] = useState<Variant | undefined>()
  const [quantityPicked, setQuantityPicked] = useState(1)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [showWarning, setShowWarning] = useState({
    isOpen: false,
    message: "",
  })

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

    const cartItem = {
      variantId: currentPicked?.documentId || null,
      quantity: quantityPicked,
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
        console.log("vdagsgdas check------: ", {
          documentIdMatch:
            item.product?.productData?.documentId ===
            cartItem?.product?.productData?.documentId,
          variantIdMatch: item.variantId === cartItem.variantId,
        })

        return (
          item.product?.productData?.documentId ===
            cartItem?.product?.productData?.documentId &&
          item.variantId === cartItem.variantId
        )
      })

      console.log("vdagsgdas check:", {
        existingIndex,
        cartItem,
        cart,
      })

      if (existingIndex > -1) {
        // Nếu đã có thì cộng dồn số lượng
        console.log("vdagsgdas: ", {
          current: cart[existingIndex].quantity,
          new: cartItem.quantity,
        })

        cart[existingIndex].quantity += cartItem.quantity
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
        <div className="hidden sm:flex flex-col space-y-4">
          {productData?.variants?.length > 1 && (
            <p className="text-sm font-medium text-neutral-600">Phân loại: </p>
          )}
          {variants.length ? (
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => {
                return (
                  <div
                    onClick={() => setCurrentPicked(variant)}
                    key={variant.id}
                    className={`flex space-x-2 items-center pr-2 rounded border-2 ${
                      currentPicked?.id === variant.id
                        ? "border-pink-700 text-pink-700"
                        : "border-stone-300"
                    } cursor-pointer hover:bg-stone-100 bg-stone-50 duration-300`}
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
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            ""
          )}
          <div className="flex sm:flex-row flex-col justify-between sm:gap-4 gap-2">
            {currentPicked ? (
              <div className="flex flex-col my-auto">
                <span className="sm:text-2xl text-xl font-bold text-pink-600">
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
                <span className="sm:text-2xl text-xl font-bold text-pink-600">
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

            {currentPicked ? (
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
                    {formatBigNumber(Number(currentPicked.sold_quantity ?? 0))}
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
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-semibold text-gray-400">
              Chọn số lượng
            </span>
            <div className="flex space-x-1">
              <div
                onClick={() => {
                  if (quantityPicked === 1) {
                    return
                  }

                  setQuantityPicked(quantityPicked - 1)
                }}
                className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded"
              >
                <RemoveRoundedIcon className="!w-5" />
              </div>
              <div className="text-sm font-semibold px-4 min-w-20 flex items-center justify-center bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded">
                <span className="mx-auto my-auto">{quantityPicked}</span>
              </div>

              <div
                onClick={() => {
                  if (
                    (currentPicked &&
                      quantityPicked >= Number(currentPicked.quantity ?? 0)) ||
                    (!currentPicked &&
                      quantityPicked >= Number(productData.quantity ?? 0))
                  ) {
                    return
                  }
                  setQuantityPicked(quantityPicked + 1)
                }}
                className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded"
              >
                <AddRoundedIcon className="!w-5" />
              </div>
            </div>
          </div>

          <Button
            variant="contained"
            className="!bg-neutral-900 !text-white !normal-case !font-semibold"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </Button>
        </div>

        {/* Mobile: Chỉ hiện nút thêm vào giỏ */}
        <div className="sm:hidden">
          <Button
            variant="contained"
            className="!bg-neutral-900 !text-white !normal-case !font-semibold !w-full"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </Button>
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
                </div>
              </div>
            </div>

            {/* Variant Selection */}

            {productData?.variants?.length > 1 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  Phân loại:
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    return (
                      <div
                        onClick={() => setCurrentPicked(variant)}
                        key={variant.id}
                        className={`flex space-x-2 items-center pr-2 rounded border-2 ${
                          currentPicked?.id === variant.id
                            ? "border-pink-700 text-pink-700"
                            : "border-stone-300"
                        } cursor-pointer hover:bg-stone-100 bg-stone-50 duration-300`}
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
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="flex flex-col space-y-1 ">
              <span className="text-xs font-semibold text-gray-400">
                Chọn số lượng
              </span>
              <div className="flex space-x-1">
                <div
                  onClick={() => {
                    if (quantityPicked === 1) {
                      return
                    }

                    setQuantityPicked(quantityPicked - 1)
                  }}
                  className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded"
                >
                  <RemoveRoundedIcon className="!w-5" />
                </div>
                <div className="text-sm font-semibold px-4 min-w-20 flex items-center justify-center bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded">
                  <span className="mx-auto my-auto">{quantityPicked}</span>
                </div>

                <div
                  onClick={() => {
                    if (
                      (currentPicked &&
                        quantityPicked >=
                          Number(currentPicked.quantity ?? 0)) ||
                      (!currentPicked &&
                        quantityPicked >= Number(productData.quantity ?? 0))
                    ) {
                      return
                    }
                    setQuantityPicked(quantityPicked + 1)
                  }}
                  className="px-2 py-1 bg-neutral-100 cursor-pointer hover:bg-neutral-50 duration-300 border border-stone-300 rounded"
                >
                  <AddRoundedIcon className="!w-5" />
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Confirm Button */}
            <Button
              variant="contained"
              className="!bg-neutral-900 !text-white !normal-case !font-semibold !w-full !py-3"
              onClick={handleConfirmAddToCart}
            >
              Xác nhận thêm vào giỏ
            </Button>
          </div>
        </Drawer>
      )}
    </Fragment>
  )
}
