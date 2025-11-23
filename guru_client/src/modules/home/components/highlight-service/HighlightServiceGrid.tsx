"use client"

import { useRouter } from "next/navigation"
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded"
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded"
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded"
import HighlightServiceClient from "./HighlightServiceClient"
import ShippingExpressClient from "./ShippingExpressClient"
import { StoreMetadata } from "types/global"

interface HighlightServiceGridProps {
  metadata: StoreMetadata | null | undefined
  serviceMenuHtml?: string
  shippingExpressHtml?: string
}

export default function HighlightServiceGrid({
  metadata,
  serviceMenuHtml,
  shippingExpressHtml,
}: HighlightServiceGridProps) {
  const router = useRouter()

  const handleSupport = () => {
    // Dispatch custom event để mở floating contact button
    window.dispatchEvent(new CustomEvent("openFloatingContact"))
  }

  const handleSchedule = () => {
    if (metadata?.zalo_link) {
      let url = metadata.zalo_link
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`
      }
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleOrders = () => {
    router.push("/orders")
  }

  const handleDiscountCards = () => {
    router.push("/discount-cards")
  }

  const handleAddress = () => {
    const footer = document.querySelector("footer")
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleCategory = () => {
    // Dispatch custom event để mở sidebar và expand category
    window.dispatchEvent(new CustomEvent("openSidebarWithCategory"))
  }

  return (
    <div className="grid sm:grid-cols-8 grid-cols-4 sm:gap-6 gap-4 bg-rose-300 px-4 py-5 sm:rounded-b-lg text-white">
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={handleCategory}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <CategoryRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Danh mục
        </span>
      </div>
      <ShippingExpressClient shippingExpressHtml={shippingExpressHtml} />
      <HighlightServiceClient serviceMenuHtml={serviceMenuHtml} />
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={handleSchedule}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <DateRangeRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Đặt lịch online
        </span>
      </div>
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={handleSupport}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <ContactPhoneRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Hỗ trợ
        </span>
      </div>
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={handleOrders}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <LocalMallRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Đơn hàng
        </span>
      </div>
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={handleDiscountCards}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <CardGiftcardRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Tích điểm
        </span>
      </div>
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={handleAddress}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <PlaceRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Địa chỉ
        </span>
      </div>
    </div>
  )
}
