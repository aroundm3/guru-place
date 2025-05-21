import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded"
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded"
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded"
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded"
import { getListBrand } from "@lib/data/brand"
import Image from "next/image"
import { Divider } from "@mui/material"

export default async function HighlightService() {
  const brands = await getListBrand({ isHightlight: true })

  return (
    <div className="max-w-4xl mx-auto lg:py-6 py-4 lg:px-0 px-4 flex flex-col gap-3">
      <div className="grid sm:grid-cols-6 grid-cols-4 gap-6">
        <div className="flex flex-col space-y-2 p-2 bg-pink-50 rounded hover:bg-pink-100 cursor-pointer duration-300 text-pink-700 hover:scale-105">
          <LocalShippingRoundedIcon className="mx-auto" />
          <span className="text-xs font-semibold text-center mx-auto">
            Giao Hoả Tốc
          </span>
        </div>
        <div className="flex flex-col space-y-2 p-2 bg-pink-50 rounded hover:bg-pink-100 cursor-pointer duration-300 text-pink-700 hover:scale-105">
          <WeekendRoundedIcon className="mx-auto" />
          <span className="text-xs font-semibold text-center mx-auto">
            Dịch vụ gội đầu
          </span>
        </div>
        <div className="flex flex-col space-y-2 p-2 bg-pink-50 rounded hover:bg-pink-100 cursor-pointer duration-300 text-pink-700 hover:scale-105">
          <DateRangeRoundedIcon className="mx-auto" />
          <span className="text-xs font-semibold text-center mx-auto">
            Đặt lịch online
          </span>
        </div>
        <div className="flex flex-col space-y-2 p-2 bg-pink-50 rounded hover:bg-pink-100 cursor-pointer duration-300 text-pink-700 hover:scale-105">
          <ContactPhoneRoundedIcon className="mx-auto" />
          <span className="text-xs font-semibold text-center mx-auto">
            Hỗ trợ
          </span>
        </div>
        <div className="flex flex-col space-y-2 p-2 bg-pink-50 rounded hover:bg-pink-100 cursor-pointer duration-300 text-pink-700 hover:scale-105">
          <LocalMallRoundedIcon className="mx-auto" />
          <span className="text-xs font-semibold text-center mx-auto">
            Đơn hàng
          </span>
        </div>
        <div className="flex flex-col space-y-2 p-2 bg-pink-50 rounded hover:bg-pink-100 cursor-pointer duration-300 text-pink-700 hover:scale-105">
          <CreditScoreRoundedIcon className="mx-auto" />
          <span className="text-xs font-semibold text-center mx-auto">
            Tích điểm
          </span>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <Divider className="!my-auto bg-pink-500 w-20" />
        <Image
          src={"/logo.png"}
          alt={"Divi Cosmetics"}
          width={80}
          height={80}
          className="my-auto"
          sizes="100vw"
        />
        <Divider className="!my-auto bg-pink-500 w-20" />
      </div>
      <div className="flex flex-wrap sm:gap-x-6 gap-x-3 gap-y-2">
        <div className="flex space-x-4 text-stone-400 mr-4">
          <h6 className="my-auto sm:text-2xl text-xl font-bold">
            Thương hiệu
            <br /> nổi bật
          </h6>
        </div>
        {brands.map((brand) => {
          return (
            <div
              key={brand.documentId}
              className="flex h-fit space-x-2 bg-white rounded-lg border border-gray-100 pr-2 hover:bg-pink-50 cursor-pointer duration-300 text-pink-700"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                height={0}
                width={0}
                className="h-10 w-auto object-contain my-auto rounded-l-lg"
                loading="eager"
                sizes="80vw"
              />
              <span className="text-xs font-semibold text-center my-auto">
                {brand.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
