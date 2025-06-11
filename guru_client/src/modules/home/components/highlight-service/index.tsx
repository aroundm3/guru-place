import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded"
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded"
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded"
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded"
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded"
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded"
import Image from "next/image"
import { Divider } from "@mui/material"
import Brands from "./Brands"
import { getListBrand } from "@lib/data/brand"
import Categories from "../category"

export default async function HighlightService() {
  const brands = await getListBrand({ isHightlight: true })

  return (
    <div className="lg:max-w-5xl max-w-4xl mx-auto lg:pb-6 pb-4 flex flex-col sm:gap-10 gap-6">
      <div className="grid sm:grid-cols-8 grid-cols-4 sm:gap-6 gap-4 bg-rose-300 px-4 py-5 sm:rounded-b-lg text-white">
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <CategoryRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Danh mục
          </span>
        </div>
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <LocalShippingRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Giao Hoả Tốc
          </span>
        </div>
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <WeekendRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Dịch vụ gội đầu
          </span>
        </div>
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <DateRangeRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Đặt lịch online
          </span>
        </div>
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <ContactPhoneRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Hỗ trợ
          </span>
        </div>
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <LocalMallRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Đơn hàng
          </span>
        </div>
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <CreditScoreRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Tích điểm
          </span>
        </div>
        <div className="flex flex-col space-y-2 items-center hover:scale-105 duration-300">
          <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
            <PlaceRoundedIcon className="mx-auto my-auto" />
          </div>
          <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
            Địa chỉ
          </span>
        </div>
      </div>
      <div className="lg:px-0 px-4 flex flex-col sm:gap-y-10 gap-y-6">
        <div className="flex w-full justify-center">
          <Image
            src={"/logo.png"}
            alt={"Divi Cosmetics"}
            width={80}
            height={80}
            className="my-auto"
            sizes="100vw"
          />
        </div>
        <Categories isShowList />
        <Brands brands={brands} />
      </div>
    </div>
  )
}
