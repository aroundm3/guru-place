import { Metadata } from "next"

import BannerCarousel from "@modules/home/components/banner-carousel"
import HighlightService from "@modules/home/components/highlight-service"
import BlockProduct from "@modules/home/components/product/BlockProduct"
import { getListBanner } from "@lib/data/banner"

export const metadata: Metadata = {
  title: "Divi - Cửa hàng mỹ phẩm",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const banners = await getListBanner()

  return (
    <>
      <div className="lg:max-w-5xl max-w-4xl mx-auto flex sm:flex-row flex-col gap-10">
        <BannerCarousel banners={banners} />
      </div>

      {/* <Hero /> */}
      <HighlightService />
      <BlockProduct />
      {/* <div className="lg:max-w-5xl max-w-4xl mx-auto lg:py-6 py-4 lg:px-0 px-4 flex sm:flex-row flex-col gap-10">
        <Categories />
      </div> */}
    </>
  )
}
