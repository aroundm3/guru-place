import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded"
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded"
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded"
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded"

export default function HighlightService() {
  return (
    <div className="grid lg:grid-cols-6 grid-cols-4 max-w-4xl mx-auto py-4 gap-6 lg:px-0 px-4">
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
  )
}
