import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import BannerCarousel from "@modules/home/components/banner-carousel"
import HighlightService from "@modules/home/components/highlight-service"
import Categories from "@modules/home/components/category"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  // const params = await props.params

  // const { countryCode } = params

  // const region = await getRegion(countryCode)

  // const { collections } = await listCollections({
  //   fields: "id, handle, title",
  // })

  // if (!collections || !region) {
  //   return null
  // }

  console.log("vdhgavhgsdvhasg")

  return (
    <>
      <BannerCarousel />
      {/* <Hero /> */}
      <HighlightService />
      <div className="max-w-4xl mx-auto lg:py-6 py-4 lg:px-0 px-4 flex flex-row-reverse gap-3">
        <div></div>
        <Categories />
      </div>

      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts collections={collections} region={region} /> */}
        </ul>
      </div>
    </>
  )
}
