import { Metadata } from "next"

import { getListCategories } from "@lib/data/category"
import { getListBrand } from "@lib/data/brand"
import { getListProducts, getListProductsBlock } from "@lib/data/product"
import ListProducts from "./_components/ListProducts"
import { Breadcrumbs, Typography } from "@mui/material"
import Link from "next/link"
import { Product } from "types/global"
import Filter from "./_components/Filter"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: { params: { slug: string[] } }) {
  const params = await props.params

  const listParamsToFilter = params.slug[0].split("_")

  const typeSearch = listParamsToFilter[0]
    ? decodeURIComponent(listParamsToFilter[0] as string)
    : ""

  console.log({ listParamsToFilter })

  const categories = await getListCategories({})
  const brands = await getListBrand({})
  const listProducBlock = await getListProductsBlock()

  let products: Product[] = []

  let subRouteTitle = ""

  let currentCategory
  let currentBrand
  let currentBlockProduct

  if (listParamsToFilter.length) {
    switch (typeSearch) {
      case "category": {
        currentCategory = categories.find(
          (categoryItem) => categoryItem.slug === listParamsToFilter[1]
        )

        if (currentCategory) {
          subRouteTitle = `Danh mục: ${currentCategory.name}`
          products = await getListProducts({
            categoryId: currentCategory.documentId,
          })
        }

        break
      }

      case "brand": {
        currentBrand = brands.find(
          (brandItem) => brandItem.slug === listParamsToFilter[1]
        )
        if (currentBrand) {
          subRouteTitle = `Thương hiệu: ${currentBrand.name}`
          products = await getListProducts({
            brandId: currentBrand.documentId,
          })
        }

        break
      }
      case "brand&category": {
        currentCategory = categories.find(
          (categoryItem) => categoryItem.slug === listParamsToFilter[1]
        )
        currentBrand = brands.find(
          (brandItem) => brandItem.slug === listParamsToFilter[2]
        )
        if (currentCategory && currentBrand) {
          subRouteTitle = `Thương hiệu: ${currentBrand.name}`
          products = await getListProducts({
            brandId: currentBrand.documentId,
            categoryId: currentCategory.documentId,
          })
        }

        break
      }
      case "collection": {
        currentBlockProduct = listProducBlock.find(
          (block) => block.documentId === listParamsToFilter[1]
        )
        currentBrand = brands.find(
          (brandItem) => brandItem.slug === listParamsToFilter[2]
        )
        if (currentCategory && currentBrand) {
          subRouteTitle = `Thương hiệu: ${currentBrand.name}`
          products = await getListProducts({
            brandId: currentBrand.documentId,
            categoryId: currentCategory.documentId,
          })
        }

        break
      }

      case "search": {
        const searchQuery = listParamsToFilter[1]
          ? decodeURIComponent(listParamsToFilter[1] as string)
          : ""

        if (searchQuery) {
          subRouteTitle = `Từ khoá tìm kiếm: ${searchQuery}`
        }

        products = await getListProducts({
          searchQuery: searchQuery,
        })

        break
      }

      case "products": {
        products = await getListProducts({})
        break
      }
    }
  }

  return (
    <div className="lg:max-w-5xl max-w-4xl lg:px-0 px-4 mx-auto flex flex-col space-y-10">
      <div className="relative flex space-x-2 justify-between bg-[#fffdf8] border border-stone-300 rounded-lg mt-10 p-4">
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <Link href="/" className="text-sm font-semibold">
            Trang chủ
          </Link>
          <Typography
            sx={{ color: "text.primary" }}
            className="!text-sm !font-semibold"
          >
            {subRouteTitle ? subRouteTitle : "Tất cả sản phẩm"}
          </Typography>
        </Breadcrumbs>
        {listParamsToFilter[0] !== "products" && (
          <Link
            href={`/products`}
            className="underline text-xs font-medium my-auto"
          >
            Tất cả sản phẩm
          </Link>
        )}
      </div>
      <div className="flex sm:flex-row flex-col sm:gap-8 gap-6">
        <Filter
          categories={categories}
          brands={brands}
          listProducBlock={listProducBlock}
          currentBrand={currentBrand}
          currentCategory={currentCategory}
        />
        <ListProducts products={products} />
      </div>
    </div>
  )
}
