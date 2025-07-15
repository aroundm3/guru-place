export const dynamic = "force-dynamic"
import { Metadata, ResolvingMetadata } from "next"

import { getProductBySlug } from "@lib/data/product"

import { Breadcrumbs, Typography } from "@mui/material"
import Link from "next/link"
import { Product } from "types/global"
import { notFound } from "next/navigation"
import ImageCarousel from "./_compoents/ImageCarousel"
import RichTextBlockRender from "@modules/home/components/rich-text-block-render/RichTextBlockRender"
import Options from "./_compoents/Options"
import BlockProduct from "@modules/home/components/product/BlockProduct"
import { Divider } from "@medusajs/ui"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import { Fragment } from "react"

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  },
  _: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug

  try {
    const productDetail: Product = await getProductBySlug(slug)

    return {
      title: `Divi | ${productDetail.name}`,
      description: productDetail.short_description,
      icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
      },
      openGraph: {
        title: `Divi | ${productDetail.name}`,
        description: productDetail.short_description,
        url: `https://www.myphamdivi.com/product/${productDetail.slug}`,
        siteName: "Divi",
        images: [
          {
            url: productDetail.images[0]?.default || "/logo.png",
            width: 800,
            height: 600,
            alt: productDetail.name,
          },
        ],
        locale: "vi_VN",
        type: "website",
      },
    }
  } catch (err) {
    console.error("Failed to fetch product metadata", err)
    return {
      title: "Divi - Cửa hàng mỹ phẩm",
      description:
        "Dầu gội xả Delofil Silky Smooth sạch gàu, kiềm dầu, mềm mượt chống gãy · Kem ủ tóc Collagen Hair Mask Delofil phục hồi tóc hư tổn, làm mềm mượt.",
    }
  }
}

export default async function Home(props: { params: { slug: string } }) {
  const params = await props.params

  const productDetail: Product = await getProductBySlug(params.slug)

  if (!productDetail) {
    return notFound()
  }

  return (
    <Fragment>
      <div className="lg:max-w-5xl max-w-4xl lg:px-0 px-4 mx-auto flex flex-col space-y-10">
        <div className="relative flex space-x-2 justify-between bg-[#fffdf8] border border-stone-300 rounded-lg mt-10 p-4">
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <Link href="/" className="text-sm font-semibold">
              Trang chủ
            </Link>
            {productDetail.category ? (
              <Link href={`/category_${productDetail.category.slug}`}>
                {" "}
                <Typography
                  sx={{ color: "text.primary" }}
                  className="!text-sm !font-semibold"
                >
                  {productDetail.category.name}
                </Typography>
              </Link>
            ) : (
              ""
            )}

            {productDetail.brand ? (
              <Link href={`/brand_${productDetail.brand.slug}`}>
                {" "}
                <Typography
                  sx={{ color: "text.primary" }}
                  className="!text-sm !font-semibold"
                >
                  {productDetail.brand.name}
                </Typography>
              </Link>
            ) : (
              ""
            )}
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
              thumbImages={productDetail.images.map((image) => image.thumbnail)}
              productTitle={productDetail.name}
            />
          </div>
          <div className="flex flex-col space-y-2 justify-between sm:w-1/2 w-full">
            <div className="flex flex-col space-y-2">
              <h6 className="sm:text-2xl text-xl font-bold">
                {productDetail.name}
              </h6>
              <p className="sm:text-base text-sm">
                {productDetail.short_description}
              </p>
              <div className="flex flex-wrap gap-2">
                {productDetail.isTopSelling && (
                  <div className="px-2 py-0.5 cursor-pointer border border-orange-700 bg-orange-100 rounded">
                    <span className="text-orange-700 text-xs font-semibold">
                      Sản phẩm bán chạy
                    </span>
                  </div>
                )}
                {productDetail.isFreeShip && (
                  <div className="px-2 py-0.5 border border-teal-700 rounded cursor-pointer bg-teal-50 flex space-x-1 items-center">
                    <LocalShippingIcon className="text-teal-700 !h-4" />
                    <span className="text-teal-700 text-xs font-semibold">
                      Free ship
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="!mt-10">
              <Options productData={productDetail} />
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col space-y-6">
          <p className="sm: text-lg text=md font-semibold">Mô tả</p>
          <RichTextBlockRender blocks={productDetail.detail_description} />
        </div>
        <Divider />
      </div>
      <BlockProduct />
    </Fragment>
  )
}
