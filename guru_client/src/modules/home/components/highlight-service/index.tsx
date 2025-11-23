import Brands from "./Brands"
import HighlightServiceGrid from "./HighlightServiceGrid"
import { getListBrand } from "@lib/data/brand"
import Categories from "../category"
import { Fragment } from "react"
import { fetcher } from "@lib/config"
import { StoreMetadata } from "types/global"

export default async function HighlightService() {
  const brands = await getListBrand({ isHightlight: true })

  // Fetch store metadata để lấy service_menu, shipping_express và các thông tin khác
  let metadata: StoreMetadata | null = null
  let serviceMenuHtml: string | undefined
  let shippingExpressHtml: string | undefined
  try {
    const storeMetadataRs = await fetcher("/api/store-metadata")
    metadata = storeMetadataRs.data
    serviceMenuHtml = metadata?.service_menu
    shippingExpressHtml = metadata?.shipping_express
  } catch (error) {
    console.error("Failed to fetch store metadata:", error)
  }

  return (
    <Fragment>
      <div className="lg:max-w-5xl max-w-4xl mx-auto flex flex-col">
        <HighlightServiceGrid
          metadata={metadata}
          serviceMenuHtml={serviceMenuHtml}
          shippingExpressHtml={shippingExpressHtml}
        />
        <div className="lg:px-0 px-4 flex flex-col sm:gap-y-10 gap-y-6 mt-8">
          <Categories isShowList />
          <Brands brands={brands} />
        </div>
      </div>
    </Fragment>
  )
}
