import Brands from "./Brands"
import HighlightServiceGrid from "./HighlightServiceGrid"
import LatestPromotions from "./LatestPromotions"
import { getListBrand } from "@lib/data/brand"
import { getLatestPromotions } from "@lib/data/product"
import Categories from "../category"
import { Fragment } from "react"
import { fetcher } from "@lib/config"
import { StoreMetadata } from "types/global"

export default async function HighlightService() {
  const brands = await getListBrand({ isHightlight: true })
  const latestPromotions = await getLatestPromotions()

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

        {/* danh sách mã giảm giá mới nhất */}
        <div className="mt-8">
          <LatestPromotions promotions={latestPromotions} />
        </div>

        <div className="lg:px-0 px-4 flex flex-col lg:gap-y-10 gap-y-6 mt-2">
          <Categories isShowList />
          <Brands brands={brands} />
        </div>
      </div>
    </Fragment>
  )
}
