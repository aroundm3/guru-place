"use client"

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import CloseIcon from "@mui/icons-material/Close"

type Promotion = {
  id: number
  documentId: string
  code: string
  title: string
  description?: string
  type: "percent" | "cash"
  value: number | string
  discountMinimumOrderAmount?: number | string
  discountMaximumOrderAmount?: number | string
  isDisable?: boolean
  isPrivate?: boolean
  image?: {
    small?: string
    thumbnail?: string
    default?: string
  } | null
  quantity?: number | string | null
  expiredAt?: string | null
}

interface PromotionsListProps {
  promotions: Promotion[]
}

export default function PromotionsList({ promotions }: PromotionsListProps) {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  )
  const [openDialog, setOpenDialog] = useState(false)

  // Filter out disabled, private, out of stock, and expired promotions
  const activePromotions =
    promotions?.filter((promo) => {
      // Basic checks
      if (promo.isDisable || promo.isPrivate) return false

      // Check quantity (if set)
      if (
        promo.quantity !== null &&
        promo.quantity !== undefined &&
        typeof promo.quantity === "number" &&
        promo.quantity <= 0
      ) {
        return false
      }
      // Handle string quantity just in case
      if (
        promo.quantity !== null &&
        promo.quantity !== undefined &&
        typeof promo.quantity === "string" &&
        parseInt(promo.quantity) <= 0
      ) {
        return false
      }

      // Check expiration (if set)
      if (promo.expiredAt) {
        const expirationDate = new Date(promo.expiredAt)
        const now = new Date()
        if (expirationDate < now) {
          return false
        }
      }

      return true
    }) || []

  if (!activePromotions || activePromotions.length === 0) {
    return null
  }

  const formatCurrency = (value: number | string) => {
    const num = typeof value === "string" ? parseInt(value, 10) : value
    return num.toLocaleString("vi-VN")
  }

  const handleOpenDialog = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedPromotion(null)
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <LocalOfferIcon className="text-pink-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Khuyến mãi đặc biệt
          </h3>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide py-2">
          {activePromotions.map((promotion) => {
            return (
              <div
                key={promotion.documentId}
                onClick={() => handleOpenDialog(promotion)}
                className="flex-shrink-0 w-80 relative group cursor-pointer transition-transform hover:-translate-y-1 drop-shadow-sm filter"
              >
                {/* Coupon Card Container */}
                {/* Coupon Card Container */}
                <div
                  className="flex h-28 bg-white relative overflow-hidden"
                  style={{
                    // Use CSS Mask for true transparency
                    maskImage:
                      "radial-gradient(circle at 0px 8px, transparent 4px, black 4.5px), radial-gradient(circle at 100% 8px, transparent 4px, black 4.5px)",
                    maskSize: "50% 16px",
                    maskPosition: "top left, top right",
                    maskRepeat: "repeat-y",
                    WebkitMaskImage:
                      "radial-gradient(circle at 0px 8px, transparent 4px, black 4.5px), radial-gradient(circle at 100% 8px, transparent 4px, black 4.5px)",
                    WebkitMaskSize: "50% 16px",
                    WebkitMaskPosition: "top left, top right",
                    WebkitMaskRepeat: "repeat-y",
                  }}
                >
                  {/* Left Side - Logo */}
                  <div className="w-24 bg-pink-50 flex items-center justify-center p-2 relative border-r border-dashed border-pink-200">
                    <img
                      src="/logo.png"
                      alt="Divi Logo"
                      className="w-16 h-16 object-contain drop-shadow-sm"
                    />

                    {/* Divider Notches - Keep these as they are internal decoration */}
                    <div className="absolute -right-1.5 top-[-6px] w-3 h-3 bg-white rounded-full z-10 box-content border border-gray-100"></div>
                    <div className="absolute -right-1.5 bottom-[-6px] w-3 h-3 bg-white rounded-full z-10 box-content border border-gray-100"></div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0 relative bg-white">
                    {/* Quantity Badge - Larger */}
                    {promotion.quantity && (
                      <div className="absolute top-0 right-3">
                        <span className="bg-red-100 text-red-600 text-sm font-extrabold px-2 py-0.5 rounded-b-lg shadow-sm border border-red-100">
                          x{parseInt(promotion.quantity.toString(), 10)}
                        </span>
                      </div>
                    )}

                    <div className="mt-1">
                      {/* Title */}
                      <div className="pr-10">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
                          {promotion.title}
                        </h4>
                      </div>

                      {/* Code */}
                      <div className="mt-1.5">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 font-mono">
                          {promotion.code}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-end justify-between mt-auto">
                      <div className="text-[10px] text-gray-400">
                        {promotion.expiredAt ? (
                          <span>
                            HSD:{" "}
                            {new Date(promotion.expiredAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <span className="text-xs text-blue-600 font-bold mr-3 hover:underline">
                        Điều kiện
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="!font-bold !text-xl !pb-2">
          <div className="flex items-center justify-between">
            <span>Chi tiết khuyến mãi</span>
            <IconButton
              onClick={handleCloseDialog}
              size="small"
              className="!text-gray-500"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedPromotion && (
            <div className="flex flex-col space-y-4 py-2">
              {/* Header with logo and code */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <img
                  src="/logo.png"
                  alt="Divi Logo"
                  className="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2 shadow-sm"
                />
                <div className="flex-1">
                  <div className="bg-pink-600 text-white px-3 py-1 rounded-full inline-block mb-2">
                    <span className="text-sm font-bold uppercase">
                      {selectedPromotion.code}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {selectedPromotion.title}
                  </h4>
                </div>
              </div>

              {/* Discount Value */}
              <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      {selectedPromotion.type === "percent"
                        ? "Giảm giá"
                        : "Giảm tiền"}
                    </p>
                    <p className="text-3xl font-extrabold text-pink-600">
                      {selectedPromotion.type === "percent"
                        ? `${
                            typeof selectedPromotion.value === "string"
                              ? parseInt(selectedPromotion.value, 10)
                              : selectedPromotion.value
                          }%`
                        : `${formatCurrency(selectedPromotion.value)}đ`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedPromotion.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Mô tả:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedPromotion.description}
                  </p>
                </div>
              )}

              {/* Conditions */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Điều kiện áp dụng:
                </p>
                <div className="space-y-2">
                  {selectedPromotion.quantity && (
                    <div className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-700">
                          Số lượng còn lại:{" "}
                        </span>
                        <span className="text-orange-600 font-semibold">
                          {parseInt(
                            selectedPromotion.quantity.toString(),
                            10
                          ).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedPromotion.expiredAt && (
                    <div className="flex items-start gap-2 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-700">
                          Hạn sử dụng:{" "}
                        </span>
                        <span>
                          {new Date(
                            selectedPromotion.expiredAt
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedPromotion.discountMinimumOrderAmount ? (
                    <div className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-700">
                          Đơn hàng tối thiểu:{" "}
                        </span>
                        <span className="text-pink-600 font-semibold">
                          {formatCurrency(
                            selectedPromotion.discountMinimumOrderAmount
                          )}
                          đ
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        Không yêu cầu đơn hàng tối thiểu
                      </span>
                    </div>
                  )}

                  {selectedPromotion.discountMaximumOrderAmount ? (
                    <div className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-700">
                          Giảm tối đa:{" "}
                        </span>
                        <span className="text-blue-600 font-semibold">
                          {formatCurrency(
                            selectedPromotion.discountMaximumOrderAmount
                          )}
                          đ
                        </span>
                      </div>
                    </div>
                  ) : (
                    selectedPromotion.type === "percent" && (
                      <div className="flex items-start gap-2 text-sm">
                        <svg
                          className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">
                          Không giới hạn giảm tối đa
                        </span>
                      </div>
                    )
                  )}

                  <div className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      Áp dụng cho sản phẩm này
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
