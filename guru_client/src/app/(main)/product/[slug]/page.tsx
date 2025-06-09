import { Metadata, ResolvingMetadata } from "next"

import { getListCategories } from "@lib/data/category"
import { getListBrand } from "@lib/data/brand"
import {
  getListProducts,
  getListProductsBlock,
  getProductBySlug,
} from "@lib/data/product"

import { Breadcrumbs, Typography } from "@mui/material"
import Link from "next/link"
import { Product } from "types/global"
import { notFound } from "next/navigation"
import ImageCarousel from "./_compoents/ImageCarousel"

// export async function generateMetadata(
//   {
//     params,
//     searchParams,
//   }: {
//     params: Promise<{ slug: string[] }>
//     searchParams: Promise<{ [key: string]: string | string[] | undefined }>
//   },
//   _: ResolvingMetadata
// ): Promise<Metadata> {
//   const slug = (await params).slug

//   const listParamsToFilter = slug[0].split("_")

//   const typeSearch = listParamsToFilter[0]
//     ? decodeURIComponent(listParamsToFilter[0] as string)
//     : ""

//   const categories = await getListCategories({})
//   const brands = await getListBrand({})
//   const listProducBlock = await getListProductsBlock()

//   let products: Product[] = []

//   let subRouteTitle = ""

//   let currentCategory
//   let currentBrand
//   let currentBlockProduct
//   let pageCount = 1

//   if (listParamsToFilter.length) {
//     switch (typeSearch) {
//       case "category": {
//         currentCategory = categories.find(
//           (categoryItem) => categoryItem.slug === listParamsToFilter[1]
//         )

//         if (currentCategory) {
//           subRouteTitle = `Danh mục: ${currentCategory.name}`
//           const productsRs = await getListProducts({
//             categoryId: currentCategory.documentId,
//           })

//           products = productsRs.data
//           pageCount = productsRs.pageCount
//         }

//         break
//       }

//       case "brand": {
//         currentBrand = brands.find(
//           (brandItem) => brandItem.slug === listParamsToFilter[1]
//         )
//         if (currentBrand) {
//           subRouteTitle = `Thương hiệu: ${currentBrand.name}`
//           const productsRs = await getListProducts({
//             brandId: currentBrand.documentId,
//           })

//           products = productsRs.data
//           pageCount = productsRs.pageCount
//         }

//         break
//       }
//       case "brand&category": {
//         currentCategory = categories.find(
//           (categoryItem) => categoryItem.slug === listParamsToFilter[1]
//         )
//         currentBrand = brands.find(
//           (brandItem) => brandItem.slug === listParamsToFilter[2]
//         )
//         if (currentCategory && currentBrand) {
//           subRouteTitle = `Thương hiệu: ${currentBrand.name}`
//           const productsRs = await getListProducts({
//             brandId: currentBrand.documentId,
//             categoryId: currentCategory.documentId,
//           })

//           products = productsRs.data
//           pageCount = productsRs.pageCount
//         }

//         break
//       }
//       case "collection": {
//         currentBlockProduct = listProducBlock.find(
//           (block) => block.documentId === listParamsToFilter[1]
//         )
//         if (currentBlockProduct) {
//           subRouteTitle = `${currentBlockProduct.title}`
//           const productsRs = await getListProducts({
//             blockProductId: currentBlockProduct.documentId,
//           })

//           products = productsRs.data
//           pageCount = productsRs.pageCount
//         }

//         break
//       }

//       case "search": {
//         const searchQuery = listParamsToFilter[1]
//           ? decodeURIComponent(listParamsToFilter[1] as string)
//           : ""

//         if (searchQuery) {
//           subRouteTitle = `Từ khoá tìm kiếm: ${searchQuery}`
//         }

//         const productsRs = await getListProducts({
//           searchQuery: searchQuery,
//         })

//         products = productsRs.data
//         pageCount = productsRs.pageCount

//         break
//       }

//       case "products": {
//         const productsRs = await getListProducts({})

//         products = productsRs.data
//         pageCount = productsRs.pageCount

//         break
//       }
//     }
//   }

//   return {
//     title: `Divi | ${subRouteTitle ? subRouteTitle : "Tất cả sản phẩm"}`,
//     icons: {
//       icon: "/logo.png", // icon mặc định
//       shortcut: "/logo.png", // shortcut icon (nhỏ hơn)
//       apple: "/logo.png", // icon cho iOS
//     },
//   }
// }

export default async function Home(props: { params: { slug: string } }) {
  const params = await props.params

  const productDetail: Product = await getProductBySlug(params.slug)

  if (!productDetail) {
    return notFound()
  }

  console.log({ productDetail })

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
            {/* {subRouteTitle ? subRouteTitle : "Tất cả sản phẩm"} */}
          </Typography>
        </Breadcrumbs>
        <Link
          href={`/products`}
          className="underline text-xs font-medium my-auto"
        >
          Tất cả sản phẩm
        </Link>
      </div>
      <div className="flex sm:flex-row flex-col sm:gap-10 gap-6">
        <div className="sm:w-1/2 w-full">
          <ImageCarousel
            images={productDetail.images.map((image) => image.default)}
            productTitle={productDetail.name}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <h6 className="sm:text-2xl text-xl font-bold">
            {productDetail.name}
          </h6>
          <p className="sm:text-base text-sm">
            {productDetail.short_description}
          </p>
        </div>
      </div>
    </div>
  )
}
