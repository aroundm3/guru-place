"use client"

import { getListBrand } from "@lib/data/brand"
import { CircularProgress, Collapse } from "@mui/material"
import { useEffect, useState } from "react"
import { Brand, Category } from "types/global"
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded"
import Link from "next/link"

export default function CategoryItem({
  category,
  currentCategory,
  setCurrentCategory,
  closeSideBar,
}: {
  category: Category
  currentCategory?: string
  setCurrentCategory?: (data: string) => void
  closeSideBar?: () => void
}) {
  const [listBrands, setListBrands] = useState<Brand[]>([])
  const [isExpand, setIsExpand] = useState(
    currentCategory === category.documentId
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleCategoryClick = async () => {
    if (setCurrentCategory && typeof setCurrentCategory === "function") {
      if (currentCategory !== category.documentId) {
        setCurrentCategory(category.documentId)
      } else {
        setCurrentCategory("")
      }
    }
    if (!isExpand) {
      setIsLoading(true)
      const brandsData = await getListBrand({ categoryId: category.documentId })
      setIsLoading(false)
      setListBrands(brandsData)
    }
  }

  useEffect(() => {
    setIsExpand(currentCategory === category.documentId)
  }, [currentCategory, category])

  return (
    <div
      key={category.documentId}
      className="flex flex-col space-y-1 text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
    >
      <div className="flex space-x-2">
        <span
          className="sm:text-base text-base font-semibold"
          onClick={handleCategoryClick}
        >
          {category.name} {isLoading ? <CircularProgress size={14} /> : ""}
        </span>
        <Link
          href={`/category_${category.slug}`}
          onClick={() => {
            if (closeSideBar && typeof closeSideBar === "function") {
              closeSideBar()
            }
          }}
        >
          <OpenInNewRoundedIcon className="text-blue-600 !h-3.5" />
        </Link>
      </div>

      <Collapse in={isExpand}>
        <div className="flex flex-col space-y-0.5 pl-1">
          {listBrands.length
            ? listBrands.map((brand) => {
                return (
                  <Link
                    href={`/brand_${brand.slug}`}
                    key={brand.documentId}
                    className="text-sm text-stone-400 hover:text-gray-600 hover:font-semibold duration-300"
                    onClick={() => {
                      if (closeSideBar && typeof closeSideBar === "function") {
                        closeSideBar()
                      }
                    }}
                  >
                    {brand.name}
                  </Link>
                )
              })
            : ""}
        </div>
      </Collapse>
    </div>
  )
}
