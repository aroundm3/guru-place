"use client"

import { getListBrand } from "@lib/data/brand"
import { Collapse } from "@mui/material"
import { useState } from "react"
import { Brand, Category } from "types/global"

export default function CategoryItem({ category }: { category: Category }) {
  const [listBrands, setListBrands] = useState<Brand[]>([])
  const [isExpand, setIsExpand] = useState(false)

  console.log({ listBrands })

  const handleCategoryClick = async () => {
    if (!isExpand) {
      const brandsData = await getListBrand({ categoryId: category.documentId })

      console.log({ brandsData })

      setListBrands(brandsData)
      setIsExpand(true)
    } else {
      setIsExpand(false)
    }
  }

  return (
    <div
      key={category.documentId}
      className="flex flex-col space-y-1 text-stone-400 hover:text-stone-500 duration-300 cursor-pointer"
    >
      <span
        className="sm:text-base text-sm font-semibold"
        onClick={handleCategoryClick}
      >
        {category.name}
      </span>

      <Collapse in={isExpand}>
        <div className="flex flex-col space-y-0.5 pl-1">
          {listBrands.length
            ? listBrands.map((brand) => {
                return (
                  <span
                    key={brand.documentId}
                    className="text-xs text-stone-300 hover:text-stone-400 duration-300"
                  >
                    {brand.name}
                  </span>
                )
              })
            : ""}
        </div>
      </Collapse>
    </div>
  )
}
