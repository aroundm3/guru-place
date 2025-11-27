"use client"

import ProductCart from "@modules/home/components/product/Product"
import ProductCartLoading from "@modules/home/components/product/ProductCartLoading"
import useGetListProducts from "@modules/layout/components/search-button/_hooks/useGetListProducts"
import { Fragment, useEffect, useState } from "react"
import { Brand, Category, Product, ProductListBlock } from "types/global"

interface ListProductsProps {
  products: Product[]
  currentCategory?: Category
  currentBrand?: Brand
  currentBlockProduct?: ProductListBlock
  pageCount: number
}

export default function ListProducts({
  products,
  currentCategory,
  currentBrand,
  currentBlockProduct,
  pageCount,
}: ListProductsProps) {
  const [listProductDisplay, setListProductDisplay] =
    useState<Product[]>(products)
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryId, setCategoryId] = useState(currentCategory?.documentId)
  const [brandId, setBrandId] = useState(currentBrand?.documentId)
  const [blockProductId, setBlockProductId] = useState(
    currentBlockProduct?.documentId
  )
  const { listProduct, isLoading } = useGetListProducts(
    {
      page: currentPage,
      brandId: brandId,
      categoryId: categoryId,
      blockProductId: blockProductId,
    },
    currentPage <= 1
  )

  console.log("dbahbdjhabjsda filter2, ", {
    page: currentPage,
    brandId: brandId,
    categoryId: categoryId,
    blockProductId: blockProductId,
  })

  useEffect(() => {
    setListProductDisplay(products)
    setCurrentPage(1)
    setCategoryId(currentCategory?.documentId)
    setBrandId(currentBrand?.documentId)
    setBlockProductId(currentBlockProduct?.documentId)
  }, [currentCategory, currentBrand, currentBlockProduct, products])

  useEffect(() => {
    if (listProduct) {
      setListProductDisplay([...listProductDisplay, ...listProduct])
    }
  }, [listProduct])

  const handleClickNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  return listProductDisplay.length ? (
    <div className="flex flex-col lg:gap-6 gap-4">
      <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-4 h-fit">
        {listProductDisplay.map((product) => {
          return <ProductCart key={product.documentId} data={product} />
        })}
        {isLoading ? <ProductCartLoading /> : ""}
      </div>
      {pageCount > 1 && currentPage < pageCount ? (
        <p
          onClick={handleClickNextPage}
          className="mx-auto text-sm font-semibold cursor-pointer hover:text-pink-600 duration-300"
        >
          Xem thêm
        </p>
      ) : (
        ""
      )}
    </div>
  ) : (
    <p className="text-2xl font-bold text-stone-300 mx-auto my-auto mt-10">
      Không tìm thấy sản phẩm nào
    </p>
  )
}
