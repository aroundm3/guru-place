"use client"

import { formatBigNumber } from "@lib/util/format-big-number"
import { Button } from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import { Product, Variant } from "types/global"
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"

interface OptionsProps {
  productData: Product
}

export default function Options({ productData }: OptionsProps) {
  const { variants } = productData
  const [currentPicked, setCurrentPicked] = useState<Variant | undefined>()

  const [quantityPicked, setQuantityPicked] = useState(1)

  const handleAddToCart = () => {
    console.log({
      currentPicked,
      quantityPicked,
      productId: productData.documentId,
    })

    // if (!productData) return

    // const cartItem = {
    //   variantId: currentPicked?.id || null,
    //   quantity: quantityPicked,
    //   product: {
    //     productData,
    //   },
    // }

    // // Đọc giỏ hàng hiện tại từ localStorage
    // let cart: any[] = []
    // if (typeof window !== "undefined") {
    //   const cartStr = localStorage.getItem("cart")
    //   if (cartStr) {
    //     cart = JSON.parse(cartStr)
    //   }

    //   // Kiểm tra sản phẩm đã có trong giỏ chưa (theo productId + variantId)
    //   const existingIndex = cart.findIndex(
    //     (item) =>
    //       item.productId === cartItem.productId &&
    //       item.variantId === cartItem.variantId
    //   )

    //   if (existingIndex > -1) {
    //     // Nếu đã có thì cộng dồn số lượng
    //     cart[existingIndex].quantity += cartItem.quantity
    //   } else {
    //     // Nếu chưa có thì thêm mới
    //     cart.push(cartItem)
    //   }

    //   // Lưu lại vào localStorage
    //   localStorage.setItem("cart", JSON.stringify(cart))
    // }
  }

  return (
    <div className="flex flex-col space-y-4">
      {variants.length ? (
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            return (
              <div
                onClick={() => setCurrentPicked(variant)}
                key={variant.id}
                className={`flex space-x-2 items-center pr-2 rounded border ${
                  currentPicked?.id === variant.id
                    ? "border-pink-700 text-pink-700"
                    : "border-stone-400"
                } cursor-pointer hover:bg-stone-100 bg-stone-50 duration-300`}
              >
                <Image
                  src={variant.variant_image?.thumbnail || "/logo.png"}
                  alt={variant.variant_value}
                  width={36}
                  height={36}
                  sizes="100vh"
                  className="object-cover rounded-tl rounded-bl"
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
            {Number(productData.base_price) > Number(productData.sale_price) ? (
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
  )
}
