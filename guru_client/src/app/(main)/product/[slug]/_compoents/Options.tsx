"use client"

import { formatBigNumber } from "@lib/util/format-big-number"
import { Button } from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import { Product, Variant } from "types/global"

interface OptionsProps {
  productData: Product
}

export default function Options({ productData }: OptionsProps) {
  const { variants } = productData
  const [currentPicked, setCurrentPicked] = useState<Variant | undefined>()

  const [quantityPicked, setQuantityPicked] = useState(1)

  console.log({ quantityPicked })

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
      {/* <div className="flex space-x-1">
        <Button
          onClick={() => {
            if (quantityPicked === 1) {
              return
            }

            setQuantityPicked(quantityPicked - 1)
          }}
          variant="contained"
          className="!bg-neutral-200 !py-2 !px-1"
        >
          <span className="text-lg font-semibold text-neutral-600 leading-4">
            -
          </span>
        </Button>
        <input value={quantityPicked} type="number" className="no-spinner" />
        <Button
          onClick={() => {
            if (
              (currentPicked &&
                quantityPicked >= Number(currentPicked.quantity ?? 0)) ||
              (!currentPicked &&
                quantityPicked >= Number(productData.quantity ?? 0))
            ) {
              console.log("vdgavshdvs")

              return
            }
            setQuantityPicked(quantityPicked + 1)
          }}
          variant="contained"
          className="!bg-neutral-200 !py-2 !px-1"
        >
          <span className="text-lg font-semibold text-neutral-600 leading-4">
            +
          </span>
        </Button>
      </div> */}
      <Button
        variant="contained"
        className="!bg-neutral-900 !text-white !normal-case !font-semibold"
      >
        Thêm vào giỏ
      </Button>
    </div>
  )
}
