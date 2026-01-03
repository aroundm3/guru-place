"use client"

import { useState, useEffect, useMemo } from "react"
import {
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Radio,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SearchIcon from "@mui/icons-material/Search"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import PersonIcon from "@mui/icons-material/Person"
import { Customer } from "@lib/data/customer"

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
  quantity?: number | string | null
  expiredAt?: string | null
}

interface PromotionsSectionProps {
  productIds: string[]
  onSelectPromotion?: (promotion: Promotion | null) => void
  customer?: Customer | null
  onRequestCustomerInfo?: () => void
  subtotal: number
}

export default function PromotionsSection({
  productIds,
  onSelectPromotion,
  customer,
  onRequestCustomerInfo,
  subtotal,
}: PromotionsSectionProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [customerPromotions, setCustomerPromotions] = useState<Promotion[]>([])
  const [searchCode, setSearchCode] = useState("")
  const [searchedPromotion, setSearchedPromotion] = useState<Promotion | null>(
    null
  )
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null
  )
  const [viewPromotion, setViewPromotion] = useState<Promotion | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true) // Start with loading true
  const [searching, setSearching] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  // Memoize productIds string to prevent unnecessary effect runs
  const productIdsString = useMemo(() => productIds.join(","), [productIds])
  // Memoize customer ID
  const customerId = customer
    ? customer.documentId || (customer as any).id
    : null

  // Fetch promotions by products
  useEffect(() => {
    console.log("🛒 Cart productIds:", productIdsString)

    if (!productIdsString) {
      console.log("⚠️ No products selected, skip fetching promotions")
      setPromotions([])
      setLoading(false)
      return
    }

    const fetchPromotions = async () => {
      // Only set loading if we don't have data yet or if we want to show loading on change
      // For better UX, maybe keep old data while fetching? But here we'll show skeleton
      setLoading(true)
      try {
        const url = `/api/promotions/by-products?productIds=${productIdsString}`
        console.log("📡 Client fetching:", url)

        const response = await fetch(url)
        const data = await response.json()

        console.log("📦 Client received:", data)

        if (response.ok) {
          setPromotions(data.data || [])
          console.log("✅ Promotions set:", data.data?.length || 0)
        } else {
          console.error("❌ API returned error:", data.error)
        }
      } catch (error) {
        console.error("❌ Error fetching promotions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [productIdsString])

  // Fetch promotions by customer
  useEffect(() => {
    if (!customerId) {
      setCustomerPromotions([])
      return
    }

    const fetchCustomerPromotions = async () => {
      try {
        const url = `/api/promotions/by-customer?customerId=${customerId}`
        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
          setCustomerPromotions(data.data || [])
        }
      } catch (error) {
        console.error("❌ Error fetching customer promotions:", error)
      }
    }

    fetchCustomerPromotions()
  }, [customerId])

  const handleSearchByCode = async () => {
    // Nếu chưa đăng nhập và bấm Áp dụng (dù có code hay không), hiển thị popup
    if (!customer && onRequestCustomerInfo) {
      onRequestCustomerInfo()
      if (!searchCode.trim()) return
    }

    if (!searchCode.trim()) {
      setSearchedPromotion(null)
      return
    }

    setSearching(true)
    try {
      const response = await fetch(
        `/api/promotions/search-by-code?code=${encodeURIComponent(
          searchCode.trim()
        )}`
      )
      const data = await response.json()

      if (response.ok) {
        setSearchedPromotion(data.data)
        if (!data.data) {
          setSnackbarMessage("Không tìm thấy mã giảm giá")
          setSnackbarOpen(true)
        } else {
          // Auto select searched promotion if found
          handleSelectPromotion(data.data)
        }
      }
    } catch (error) {
      console.error("Error searching promotion:", error)
      setSnackbarMessage("Có lỗi xảy ra khi tìm kiếm")
      setSnackbarOpen(true)
    } finally {
      setSearching(false)
    }
  }

  const handleSelectPromotion = (promotion: Promotion) => {
    // Check eligibility logic duplicated here for safety, though UI should prevent it
    const minOrderAmount = promotion.discountMinimumOrderAmount
      ? typeof promotion.discountMinimumOrderAmount === "string"
        ? parseInt(promotion.discountMinimumOrderAmount, 10)
        : promotion.discountMinimumOrderAmount
      : 0

    if (subtotal < minOrderAmount) {
      setSnackbarMessage(
        `Đơn hàng chưa đạt giá trị tối thiểu ${formatCurrency(minOrderAmount)}đ`
      )
      setSnackbarOpen(true)
      return
    }

    if (selectedPromotionId === promotion.documentId) {
      // Deselect if already selected
      setSelectedPromotionId(null)
      if (onSelectPromotion) onSelectPromotion(null)
    } else {
      setSelectedPromotionId(promotion.documentId)
      if (onSelectPromotion) onSelectPromotion(promotion)
    }
  }

  const handleCopy = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering selection when copying
    try {
      await navigator.clipboard.writeText(code)
      setSnackbarMessage(`Đã copy mã "${code}"`)
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Failed to copy:", error)
      setSnackbarMessage("Không thể copy")
      setSnackbarOpen(true)
    }
  }

  const formatCurrency = (value: number | string) => {
    const num = typeof value === "string" ? parseInt(value, 10) : value
    return num.toLocaleString("vi-VN")
  }

  const handleViewPromotion = (e: React.MouseEvent, promotion: Promotion) => {
    e.stopPropagation()
    setViewPromotion(promotion)
    setOpenDialog(true)
  }

  const handleClosePromotionDialog = () => {
    setOpenDialog(false)
    setViewPromotion(null)
  }

  const renderPromotionCard = (promotion: Promotion) => {
    const value =
      typeof promotion.value === "string"
        ? parseInt(promotion.value, 10)
        : promotion.value

    const isSelected = selectedPromotionId === promotion.documentId

    // Check eligibility
    const minOrderAmount = promotion.discountMinimumOrderAmount
      ? typeof promotion.discountMinimumOrderAmount === "string"
        ? parseInt(promotion.discountMinimumOrderAmount, 10)
        : promotion.discountMinimumOrderAmount
      : 0

    const isEligible = subtotal >= minOrderAmount

    return (
      <div
        key={promotion.documentId}
        onClick={() => handleSelectPromotion(promotion)}
        className={`relative group cursor-pointer transition-transform hover:-translate-y-1 drop-shadow-sm filter w-full`}
      >
        <div
          className={`flex h-28 relative overflow-hidden ${
            isSelected ? "ring-2 ring-pink-500" : ""
          }`}
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
          {/* Left Side - Logo/Code */}
          <div
            className={`w-24 flex items-center justify-center p-2 relative border-r border-dashed ${
              isEligible
                ? "bg-pink-50 border-pink-200"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center">
              <img
                src="/logo.png"
                alt="Divi Logo"
                className={`w-12 h-12 object-contain drop-shadow-sm mb-1 ${
                  !isEligible && "grayscale opacity-50"
                }`}
              />
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase text-center break-all ${
                  isEligible
                    ? "bg-white text-pink-600 border-pink-200"
                    : "bg-gray-200 text-gray-500 border-gray-300"
                }`}
              >
                {promotion.code}
              </span>
            </div>

            {/* Divider Notches */}
            <div className="absolute -right-1.5 top-[-6px] w-3 h-3 bg-white rounded-full z-10 box-content border border-gray-100"></div>
            <div className="absolute -right-1.5 bottom-[-6px] w-3 h-3 bg-white rounded-full z-10 box-content border border-gray-100"></div>
          </div>

          {/* Right Side - Content */}
          <div
            className={`flex-1 p-3 flex flex-col justify-between min-w-0 relative ${
              isEligible ? "bg-white" : "bg-gray-50"
            }`}
          >
            {/* Radio Button Top Right */}
            <div className="absolute top-2 right-2 z-20">
              <Radio
                checked={isSelected}
                size="small"
                className={`!p-0 ${
                  isEligible ? "!text-pink-600" : "!text-gray-400"
                }`}
                disabled={!isEligible}
              />
            </div>

            {/* Quantity Badge - Left of Radio/Overlapping? Let's put it top-right but shift left of radio */}
            {promotion.quantity && (
              <div className="absolute top-0 right-8">
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-b shadow-sm border ${
                    isEligible
                      ? "bg-red-100 text-red-600 border-red-100"
                      : "bg-gray-200 text-gray-500 border-gray-200"
                  }`}
                >
                  x{parseInt(promotion.quantity.toString(), 10)}
                </span>
              </div>
            )}

            <div className="mt-1 pr-6">
              {" "}
              {/* pr-6 for Radio */}
              <h4
                className={`text-sm font-bold line-clamp-2 leading-snug ${
                  isEligible ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {promotion.title}
              </h4>
            </div>

            <div className="flex flex-col gap-0.5 mt-auto">
              {/* Conditions */}
              <div className="text-[10px] text-gray-500">
                {minOrderAmount > 0 && (
                  <span
                    className={!isEligible ? "text-red-500 font-semibold" : ""}
                  >
                    Đơn tối thiểu: {formatCurrency(minOrderAmount)}đ
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between">
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
                <span
                  className="text-xs text-blue-600 font-bold mr-1 hover:underline z-30 relative"
                  onClick={(e) => handleViewPromotion(e, promotion)}
                >
                  Điều kiện
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Combine all promotions (from products + customer + searched)
  // Use Map to deduplicate by documentId
  const promotionsMap = new Map<string, Promotion>()

  promotions.forEach((p) => promotionsMap.set(p.documentId, p))
  customerPromotions.forEach((p) => promotionsMap.set(p.documentId, p))
  if (searchedPromotion) {
    promotionsMap.set(searchedPromotion.documentId, searchedPromotion)
  }

  const allPromotions = Array.from(promotionsMap.values())

  // Filter invalid promotions (expired or out of stock)
  // BUT: keep the selected one/searched one visible if needed?
  // Usually we hide them. If selected one becomes invalid, it should probably be auto-deselected or shown as invalid.
  // For now, let's filter them out from the listing.
  const visiblePromotions = allPromotions.filter((promo) => {
    // Check quantity
    if (promo.quantity !== null && promo.quantity !== undefined) {
      const qty =
        typeof promo.quantity === "string"
          ? parseInt(promo.quantity, 10)
          : promo.quantity
      if (qty <= 0) return false
    }
    // Check expiration
    if (promo.expiredAt) {
      if (new Date(promo.expiredAt) < new Date()) return false
    }
    return true
  })

  useEffect(() => {
    if (onSelectPromotion && allPromotions.length === 0) onSelectPromotion(null)
  }, [allPromotions])

  // Luôn hiển thị section để user có thể nhập mã private
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <LocalOfferIcon className="text-pink-600" />
        <h3 className="text-lg font-bold text-gray-900">Mã giảm giá</h3>
      </div>
      {/* Search by code */}
      <div className="mb-4">
        <div className="flex gap-2">
          <TextField
            label="Nhập mã giảm giá"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearchByCode()
              }
            }}
            size="small"
            placeholder="VD: SALE2024"
            className="flex-1"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#be185d", // pink-700
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "#be185d", // pink-700
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearchByCode}
            disabled={searching}
            startIcon={
              searching ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            className="!bg-pink-600 !text-white !normal-case !font-semibold !h-10 !mt-0"
          >
            {searching ? "Tìm..." : "Áp dụng"}
          </Button>
        </div>

        {/* Prompt for non-logged in users */}
        {!customer && onRequestCustomerInfo && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 bg-pink-50 p-2 rounded border border-pink-100">
            <PersonIcon className="text-pink-600 !w-5 !h-5" />
            <span>
              Bạn có mã giảm giá riêng?{" "}
              <button
                onClick={onRequestCustomerInfo}
                className="text-pink-700 font-semibold hover:underline"
              >
                Nhập thông tin
              </button>{" "}
              để xem ưu đãi.
            </span>
          </div>
        )}
      </div>
      {/* Promotions List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={120}
              className="rounded-xl"
            />
          ))}
        </div>
      ) : visiblePromotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visiblePromotions.map(renderPromotionCard)}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-4">
          Không tìm thấy mã giảm giá
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {/* Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClosePromotionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="!font-bold !text-xl !pb-2">
          <div className="flex items-center justify-between">
            <span>Chi tiết khuyến mãi</span>
            <IconButton
              onClick={handleClosePromotionDialog}
              size="small"
              className="!text-gray-500"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {viewPromotion && (
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
                      {viewPromotion.code}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {viewPromotion.title}
                  </h4>
                </div>
              </div>

              {/* Discount Value */}
              <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      {viewPromotion.type === "percent"
                        ? "Giảm giá"
                        : "Giảm tiền"}
                    </p>
                    <p className="text-3xl font-extrabold text-pink-600">
                      {viewPromotion.type === "percent"
                        ? `${
                            typeof viewPromotion.value === "string"
                              ? parseInt(viewPromotion.value, 10)
                              : viewPromotion.value
                          }%`
                        : `${formatCurrency(viewPromotion.value)}đ`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {viewPromotion.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Mô tả:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {viewPromotion.description}
                  </p>
                </div>
              )}

              {/* Conditions */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Điều kiện áp dụng:
                </p>
                <div className="space-y-2">
                  {viewPromotion.quantity && (
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
                            viewPromotion.quantity.toString(),
                            10
                          ).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  )}

                  {viewPromotion.expiredAt && (
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
                          {new Date(viewPromotion.expiredAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {viewPromotion.discountMinimumOrderAmount ? (
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
                            viewPromotion.discountMinimumOrderAmount
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

                  {viewPromotion.discountMaximumOrderAmount ? (
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
                            viewPromotion.discountMaximumOrderAmount
                          )}
                          đ
                        </span>
                      </div>
                    </div>
                  ) : (
                    viewPromotion.type === "percent" && (
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
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
