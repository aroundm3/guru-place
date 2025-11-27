export const revalidate = 60 // Revalidate every 60 seconds

import { Metadata } from "next"
import BannerCarousel from "@modules/home/components/banner-carousel"
import HighlightService from "@modules/home/components/highlight-service"
import BlockProduct from "@modules/home/components/product/BlockProduct"
import { getListBanner } from "@lib/data/banner"

export const metadata: Metadata = {
  title: "Divi - Cửa hàng mỹ phẩm",
  description:
    "Dầu gội xả Delofil Silky Smooth sạch gàu, kiềm dầu, mềm mượt chống gãy · Kem ủ tóc Collagen Hair Mask Delofil phục hồi tóc hư tổn, làm mềm mượt.",
  icons: {
    icon: "/logo.png", // icon mặc định
    shortcut: "/logo.png", // shortcut icon (nhỏ hơn)
    apple: "/logo.png", // icon cho iOS
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const banners = await getListBanner()

  return (
    <>
      <div className="lg:max-w-5xl max-w-4xl mx-auto flex lg:flex-row flex-col gap-10">
        <BannerCarousel banners={banners} />
      </div>

      {/* <Hero /> */}
      <HighlightService />
      <BlockProduct />
      {/* <div className="lg:max-w-5xl max-w-4xl mx-auto lg:py-6 py-4 lg:px-0 px-4 flex lg:flex-row flex-col gap-10">
        <Categories />
      </div> */}
    </>
  )
}
