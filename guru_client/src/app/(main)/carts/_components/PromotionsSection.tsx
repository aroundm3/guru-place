"use client"

import { useState, useEffect, useMemo } from "react"
import {
  TextField,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Snackbar,
  Radio,
  Typography,
  Skeleton,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
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
        className={`border-2 rounded-xl p-3 relative cursor-pointer transition-all duration-200 ${
          isSelected
            ? "border-pink-600 bg-pink-50 shadow-md"
            : isEligible
            ? "border-pink-200 bg-gradient-to-br from-pink-50 to-white hover:border-pink-400"
            : "border-gray-200 bg-gray-50 opacity-60 grayscale cursor-not-allowed"
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            <span
              className={`${
                isEligible ? "bg-pink-600" : "bg-gray-500"
              } text-white px-2 py-0.5 rounded text-xs font-bold uppercase`}
            >
              {promotion.code}
            </span>
            <IconButton
              size="small"
              onClick={(e) => handleCopy(promotion.code, e)}
              className="!p-1 !h-5 !w-5"
              title="Copy mã"
            >
              <ContentCopyIcon className="!h-3 !w-3 text-gray-500 hover:text-gray-700" />
            </IconButton>
          </div>
          <Radio
            checked={isSelected}
            className={`!p-0 ${
              isEligible ? "!text-pink-600" : "!text-gray-400"
            }`}
            size="small"
            disabled={!isEligible}
          />
        </div>

        <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
          {promotion.title}
        </h4>

        <div className="text-xs text-gray-600 space-y-0.5">
          <p>
            <span className="font-semibold">Giảm:</span>{" "}
            {promotion.type === "percent"
              ? `${value}%`
              : `${formatCurrency(value)}đ`}
          </p>
          {minOrderAmount > 0 && (
            <p className={!isEligible ? "text-red-500 font-semibold" : ""}>
              <span className="font-semibold">Đơn tối thiểu:</span>{" "}
              {formatCurrency(minOrderAmount)}đ
            </p>
          )}
          {promotion.discountMaximumOrderAmount && (
            <p>
              <span className="font-semibold">Giảm tối đa:</span>{" "}
              {formatCurrency(promotion.discountMaximumOrderAmount)}đ
            </p>
          )}
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
      ) : allPromotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allPromotions.map(renderPromotionCard)}
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
    </div>
  )
}
