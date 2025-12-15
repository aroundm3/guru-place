export const revalidate = 60 // Revalidate every 60 seconds
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
import PromotionsList from "./_compoents/PromotionsList"
import { Divider } from "@medusajs/ui"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import { Fragment } from "react"
import DiscountCardClient from "@modules/product/components/client/discount-card-client"

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

    // Tạo description phong phú hơn cho SEO
    const enhancedDescription = productDetail.short_description
      ? `${productDetail.short_description} | Mua ngay tại Divi - Cửa hàng mỹ phẩm uy tín. Giao hàng nhanh, đảm bảo chất lượng.`
      : `${productDetail.name} - Sản phẩm mỹ phẩm chất lượng cao tại Divi. Giao hàng nhanh chóng toàn quốc.`

    // Tạo keywords từ tên sản phẩm và category
    const productKeywords = `${productDetail.name}, mỹ phẩm, ${
      productDetail.category?.name || "làm đẹp"
    }, Divi, mỹ phẩm chính hãng, chăm sóc da`

    return {
      title: `${productDetail.name} | Divi - Mỹ phẩm chính hãng`,
      description: enhancedDescription,
      keywords: productKeywords,
      icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
      },
      openGraph: {
        title: `${productDetail.name} | Divi`,
        description: enhancedDescription,
        url: `https://www.myphamdivi.com/product/${productDetail.slug}`,
        siteName: "Divi",
        images: [
          {
            url: productDetail.images[0]?.default || "/logo.png",
            width: 1200, // Facebook khuyến nghị 1200x630
            height: 630,
            alt: `${productDetail.name} - Mỹ phẩm Divi`,
            type: "image/jpeg",
          },
          // Thêm nhiều ảnh nếu có
          ...(productDetail.images?.slice(1, 4).map((img) => ({
            url: img.default,
            width: 1200,
            height: 630,
            alt: `${productDetail.name} - Hình ảnh sản phẩm`,
            type: "image/jpeg",
          })) || []),
        ],
        locale: "vi_VN",
        type: "website", // Sử dụng website type cho tương thích
        // Thêm các trường Facebook SEO quan trọng
        countryName: "Vietnam",
        determiner: "the",
        ttl: 604800, // Cache 7 ngày
      },
      // Thêm Twitter Card cho social sharing tốt hơn
      twitter: {
        card: "summary_large_image",
        title: `${productDetail.name} | Divi`,
        description: enhancedDescription,
        images: [productDetail.images[0]?.default || "/logo.png"],
        site: "@divi_cosmetics", // Thay bằng Twitter handle thực tế
      },
      // Thêm structured data cho SEO
      other: {
        "fb:app_id": "YOUR_FACEBOOK_APP_ID", // Thay bằng Facebook App ID thực tế
        "og:see_also": "https://www.myphamdivi.com",
        "product:brand": "Divi",
        "product:availability": "in stock",
        "product:condition": "new",
        "product:price:amount":
          productDetail.sale_price?.toString() ||
          productDetail.base_price?.toString(),
        "product:price:currency": "VND",
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
          <Breadcrumbs aria-label="breadcrumb" separator="•">
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
            className="underline min-w-9 text-xs font-medium my-auto"
          >
            {"Tất cả"}
          </Link>
        </div>
        <div className="flex lg:flex-row flex-col lg:gap-10 gap-6">
          <div className="lg:w-1/2 w-full">
            <ImageCarousel
              images={productDetail.images.map((image) => image.default)}
              thumbImages={productDetail.images.map((image) => image.thumbnail)}
              productTitle={productDetail.name}
            />
          </div>
          <div className="flex flex-col space-y-2 justify-between lg:w-1/2 w-full">
            <div className="flex flex-col space-y-2">
              <h6 className="lg:text-2xl text-xl font-bold">
                {productDetail.name}
              </h6>
              {!productDetail.isService && (
                <p className="lg:text-sm text-xs !leading-6">
                  {productDetail.short_description}
                </p>
              )}
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
                <DiscountCardClient
                  productId={productDetail.documentId}
                  customerCards={productDetail.variants.flatMap(
                    (variant) => variant.customer_cards || []
                  )}
                />
              </div>
            </div>
            <div className="!mt-6">
              <Options productData={productDetail} />
            </div>
          </div>
        </div>

        {/* Promotions Section */}
        {productDetail.promotions && productDetail.promotions.length > 0 && (
          <>
            <Divider />
            <PromotionsList promotions={productDetail.promotions} />
          </>
        )}

        {productDetail.isService && <Divider />}
        {!productDetail.isService && (
          <>
            <Divider />
            <div className="flex flex-col space-y-6">
              <p className="lg: text-lg text=md font-semibold">Mô tả</p>
              <RichTextBlockRender blocks={productDetail.detail_description} />
            </div>
            <Divider />
          </>
        )}
      </div>
      <BlockProduct />
    </Fragment>
  )
}
