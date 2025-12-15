"use client"

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import PercentIcon from "@mui/icons-material/Percent"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import CloseIcon from "@mui/icons-material/Close"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

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
}

interface PromotionsListProps {
  promotions: Promotion[]
}

export default function PromotionsList({ promotions }: PromotionsListProps) {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  )
  const [openDialog, setOpenDialog] = useState(false)

  // Filter out disabled and private promotions
  const activePromotions = promotions?.filter(
    (promo) => !promo.isDisable && !promo.isPrivate
  ) || []

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activePromotions.map((promotion) => {
            return (
              <div
                key={promotion.documentId}
                onClick={() => handleOpenDialog(promotion)}
                className="border-2 border-pink-200 rounded-xl p-4 bg-gradient-to-br from-pink-50 to-white hover:shadow-lg hover:border-pink-300 transition-all duration-300 cursor-pointer relative overflow-hidden group"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full -mr-10 -mt-10 opacity-30 group-hover:opacity-50 transition-opacity"></div>

                <div className="relative z-10 flex items-center gap-3">
                  {/* Logo Divi */}
                  <div className="flex-shrink-0">
                    <img
                      src="/logo.png"
                      alt="Divi Logo"
                      className="w-12 h-12 rounded-lg object-contain bg-white p-1 shadow-sm"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-pink-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase">
                        {promotion.code}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                      {promotion.title}
                    </h4>
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
