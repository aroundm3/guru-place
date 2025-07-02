"use client"

import { Fragment, useEffect, useState } from "react"
import { Brand, Category, ProductListBlock } from "types/global"
import { Button, Collapse, Skeleton } from "@mui/material"
import useGetListBrandByCategory from "../_hooks/useGetListBrandByCategory"
import Link from "next/link"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import Image from "next/image"
import SortRoundedIcon from "@mui/icons-material/SortRounded"
import FilterMobile from "./FilterMobile"

interface FilterProps {
  brands: Brand[]
  categories: Category[]
  listProducBlock: ProductListBlock[]
  currentCategory?: Category
  currentBrand?: Brand
  currentBlockProduct?: ProductListBlock
}

export default function Filter({
  brands,
  categories,
  listProducBlock,
  currentCategory,
  currentBrand,
  currentBlockProduct,
}: FilterProps) {
  console.log({ categories })

  const [currentCategorySelect, setCurrentCategorySelect] = useState("")
  const [listBrandToDisplay, setListBrandToDisplay] = useState<Brand[]>([])
  const { isLoadingListBrandByCategory, listBrandByCategory } =
    useGetListBrandByCategory(currentCategorySelect)
  const [isOpenFilterMobile, setIsOpenFilterMobile] = useState(false)

  useEffect(() => {
    if (currentCategory) {
      setCurrentCategorySelect(currentCategory.documentId)
      if (listBrandByCategory?.length) {
        setListBrandToDisplay(listBrandByCategory)
      }
    }
  }, [currentCategory, listBrandByCategory, brands])

  return (
    <Fragment>
      <FilterMobile
        categories={categories}
        isLoadingListBrandByCategory={isLoadingListBrandByCategory}
        listBrandToDisplay={listBrandToDisplay}
        listProducBlock={listProducBlock}
        currentBrand={currentBrand}
        currentCategory={currentCategory}
        isOpenSideBar={isOpenFilterMobile}
        onClose={() => setIsOpenFilterMobile(false)}
        brands={brands}
        currentBlockProduct={currentBlockProduct}
      />
      <div className="flex justify-end w-full sm:hidden">
        <Button
          variant="text"
          className="!flex !space-x-1 !text-gray-600 !px-2 !justify-center"
          onClick={() => setIsOpenFilterMobile(true)}
        >
          <span className="text-md font-semibold my-auto normal-case">
            Bộ lọc sản phẩm
          </span>
          <SortRoundedIcon className="!h-5 my-auto" />
        </Button>
      </div>
      <div className="bg-[#fffdf8] sm:min-w-[200px] sm:flex hidden flex-col p-4 rounded h-fit pb-10 sticky top-24">
        <span className="text-md font-semibold text-gray-600">
          Bộ lọc sản phẩm
        </span>
        <div className="flex flex-col space-y-2 mt-8">
          <p className="flex space-x-2 text-xs font-sm uppercase font-semibold text-gray-400 cursor-pointer">
            Thương hiệu
          </p>
          <div className="ml-1 flex flex-col space-y-2">
            {brands.map((brand) => {
              return (
                <div
                  key={brand.documentId}
                  className="flex flex-col space-y-2 text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                >
                  <div className="flex space-x-2 items-center">
                    <Link
                      href={`/brand_${brand.slug}`}
                      className={`text-sm flex space-x-1 items-center ${
                        currentBrand?.documentId === brand.documentId &&
                        !currentCategory
                          ? "font-semibold text-pink-700"
                          : "font-normal pl-5"
                      }`}
                    >
                      {currentBrand?.documentId === brand.documentId &&
                      !currentCategory ? (
                        <PlayArrowRoundedIcon className="!w-4" />
                      ) : (
                        ""
                      )}
                      <span className="uppercase">{brand.name}</span>
                      {/* <Image
                        src={brand.logo}
                        alt={brand.name}
                        height={0}
                        width={0}
                        className="h-3.5 w-3.5 object-scale-down my-auto rounded-full"
                        loading="eager"
                        sizes="80vw"
                      /> */}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="sm:flex hidden flex-col space-y-2 mt-4">
          <p className="flex space-x-2 text-xs font-sm uppercase font-semibold text-gray-400 cursor-pointer">
            Danh mục
          </p>
          <div className="ml-1 flex flex-col space-y-2">
            {categories.map((category) => {
              return (
                <div
                  key={category.documentId}
                  className="flex flex-col text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <Link
                      href={`/category_${category.slug}`}
                      className={`text-sm ${
                        currentCategory?.documentId === category.documentId
                          ? "font-semibold text-pink-700"
                          : "font-normal pl-4"
                      }`}
                    >
                      {currentCategory?.documentId === category.documentId ? (
                        <PlayArrowRoundedIcon className="!w-4" />
                      ) : (
                        ""
                      )}
                      <span>{category.name}</span>
                    </Link>
                    {/* brand of category */}
                    <Collapse
                      in={currentCategory?.documentId === category.documentId}
                    >
                      <div className="ml-1 mt-2 flex flex-col space-y-2">
                        {listBrandToDisplay.map((brand) => {
                          return (
                            <div
                              key={brand.documentId}
                              className="flex flex-col space-y-1.5 text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                            >
                              <div className="flex space-x-2 items-center">
                                <Link
                                  href={
                                    currentCategory
                                      ? `/brand&category_${currentCategory.slug}_${brand.slug}`
                                      : `/brand_${brand.slug}`
                                  }
                                  className={`text-xs flex space-x-1 items-center pl-5 duration-300 ${
                                    currentBrand?.documentId ===
                                    brand.documentId
                                      ? "font-semibold text-pink-700"
                                      : "font-normal duration-300 hover:text-stone-500 "
                                  }`}
                                >
                                  <span className="uppercase">
                                    {brand.name}
                                  </span>
                                  <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    height={0}
                                    width={0}
                                    className="h-3.5 w-3.5 object-cover my-auto rounded-full"
                                    loading="eager"
                                    sizes="80vw"
                                  />
                                </Link>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Collapse>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="sm:flex hidden flex-col space-y-2 mt-4">
          <p className="flex space-x-2 text-xs font-sm uppercase font-semibold text-gray-400 cursor-pointer">
            Bộ sản phẩm
          </p>
          <div className="ml-1 flex flex-col space-y-2">
            {listProducBlock.map((block) => {
              return (
                <div
                  key={block.documentId}
                  className="flex flex-col space-y-2 text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                >
                  <div className="flex space-x-2 items-center">
                    <Link
                      href={`/collection_${block.documentId}`}
                      className={`text-sm ${
                        currentBlockProduct?.documentId === block.documentId
                          ? "font-semibold text-pink-700"
                          : "font-normal pl-4"
                      }`}
                    >
                      {currentBlockProduct?.documentId === block.documentId ? (
                        <PlayArrowRoundedIcon className="!w-4" />
                      ) : (
                        ""
                      )}
                      <span>{block.title}</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
