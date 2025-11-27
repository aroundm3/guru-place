"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Product from "./Product"
import { motion } from "framer-motion"

// Hook detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  return isMobile
}

interface ProductBlockClientProps {
  block: any
}

// Danh sách màu sắc đẹp cho background
const COLOR_PALETTE = [
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#14b8a6", // Teal
]

// Function để lấy màu cố định cho mỗi block dựa trên documentId
const getBlockColor = (documentId: string): string => {
  // Hash documentId để chọn màu cố định
  let hash = 0
  for (let i = 0; i < documentId.length; i++) {
    hash = documentId.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length
  return COLOR_PALETTE[index]
}

export default function ProductBlockClient({ block }: ProductBlockClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
  const [bannerHeight, setBannerHeight] = useState<number | undefined>(
    undefined
  )
  const products = block.products.slice(0, 6)
  const total = products.length + (block.products.length > 6 ? 1 : 0)

  // Lấy màu cố định cho block này
  const blockColor = getBlockColor(block.documentId || "")

  // Ref cho từng item để đo chiều cao
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-fit chiều cao banner với products container
  useEffect(() => {
    if (!isMobile && scrollRef.current) {
      const updateBannerHeight = () => {
        if (scrollRef.current) {
          // Đo chiều cao của inner container chứa products
          const innerContainer = scrollRef.current.querySelector(".flex.w-max")
          if (innerContainer) {
            const height = (innerContainer as HTMLElement).offsetHeight
            setBannerHeight(height)
          } else {
            // Fallback: đo chiều cao của container chính
            const height = scrollRef.current.offsetHeight
            setBannerHeight(height)
          }
        }
      }

      // Đo ngay khi mount và sau khi images load
      setTimeout(updateBannerHeight, 100)
      setTimeout(updateBannerHeight, 500)

      // Đo lại khi resize
      window.addEventListener("resize", updateBannerHeight)
      return () => window.removeEventListener("resize", updateBannerHeight)
    }
  }, [isMobile, block.products])

  // Auto-fit chiều cao lớn nhất
  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        let max = 0
        itemRefs.current.forEach((el) => {
          if (el) {
            max = Math.max(max, el.offsetHeight)
          }
        })
        setMaxHeight(max)
      }, 50)
    }
  }, [isMobile, block.products, currentIndex])

  // Auto next cho carousel mobile
  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total)
    }, 5000)
    return () => clearInterval(interval)
  }, [isMobile, total])

  // Handler for mobile carousel
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }
  const handleNext = () => {
    if (currentIndex < total - 1) setCurrentIndex(currentIndex + 1)
  }

  // Tính toán màu text dựa trên độ sáng của màu nền
  const getTextColor = (bgColor: string) => {
    // Convert hex to RGB
    const hex = bgColor.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // Tính độ sáng (luminance)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Nếu màu sáng thì dùng text tối, ngược lại dùng text sáng
    return luminance > 0.5 ? "#1f2937" : "#ffffff"
  }

  const textColor = getTextColor(blockColor)

  return (
    <div
      className="border-stone-200 shadow-lg border rounded-lg overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${blockColor}20, ${blockColor}10, transparent)`,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Title ở trên cùng với background blur */}
      <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-3 lg:pb-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0"
        >
          <span
            className="font-bold text-lg lg:text-xl transition-colors duration-300 text-pink-700"
            // style={{ color: textColor }}
          >
            {block.title}
          </span>
          <Link
            href={`/collection_${block.documentId}`}
            className="inline-flex items-center text-pink-600 hover:text-pink-700 lg:text-base text-sm font-semibold group transition-colors duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          >
            Xem thêm
            <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Content: Banner + Products */}
      <div className="flex items-center space-x-4 px-4 lg:px-6 pb-4 lg:pb-6">
        {!isMobile && (
          <div className="lg:w-2/5 w-1/2 flex-shrink-0 relative">
            {block.banner.default ? (
              <img
                src={block.banner.default}
                alt={block.title}
                className={`!inline-block w-auto !rounded-lg !object-cover`}
                width={0}
                height={0}
                loading="eager"
                style={
                  bannerHeight ? { height: `${bannerHeight}px` } : undefined
                }
              />
            ) : (
              ""
            )}
          </div>
        )}
        <div className={`flex-1 relative overflow-hidden`}>
          {/* Desktop: Nút prev/next */}
          {!isMobile && (
            <>
              <button
                onClick={() => {
                  if (scrollRef.current)
                    scrollRef.current.scrollBy({
                      left: -200,
                      behavior: "smooth",
                    })
                }}
                className="hidden lg:block absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md bg-white text-pink-700 opacity-30 hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
                aria-label="Prev"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (scrollRef.current)
                    scrollRef.current.scrollBy({
                      left: 200,
                      behavior: "smooth",
                    })
                }}
                className="hidden lg:block absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md bg-white text-pink-700 opacity-30 hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
                aria-label="Next"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
          {/* Mobile: Banner + Products */}
          {isMobile ? (
            <div className="flex flex-col w-full gap-4">
              {block.banner.default ? (
                <>
                  {/* Banner không có text overlay */}
                  <div className="relative w-full rounded-lg overflow-hidden">
                    <img
                      src={block.banner.default}
                      alt={block.title}
                      className="w-full h-64 object-cover"
                      loading="eager"
                    />
                  </div>
                  {/* Hàng dưới: Danh sách scroll ngang với nút prev/next */}
                  <div className="relative w-full pb-4">
                    <button
                      onClick={() => {
                        if (mobileScrollRef.current)
                          mobileScrollRef.current.scrollBy({
                            left: -200,
                            behavior: "smooth",
                          })
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full shadow-lg bg-white text-pink-700 opacity-80 hover:opacity-100 hover:bg-pink-50 hover:shadow-xl transition-all duration-200 border border-pink-200"
                      aria-label="Prev"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (mobileScrollRef.current)
                          mobileScrollRef.current.scrollBy({
                            left: 200,
                            behavior: "smooth",
                          })
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full shadow-lg bg-white text-pink-700 opacity-80 hover:opacity-100 hover:bg-pink-50 hover:shadow-xl transition-all duration-200 border border-pink-200"
                      aria-label="Next"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <div
                      ref={mobileScrollRef}
                      className="w-full overflow-x-scroll no-scrollbar px-0"
                    >
                      <div className="flex w-max flex-nowrap gap-4 items-stretch">
                        {products.map((product: any) => (
                          <div
                            key={product.documentId}
                            className="min-w-[140px] max-w-[160px]"
                          >
                            <Product data={product} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Giao diện cũ: 1 sản phẩm ở hàng 1 */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1 flex flex-col justify-center">
                      {products[0] && <Product data={products[0]} />}
                    </div>
                  </div>
                  {/* Hàng dưới: Danh sách scroll ngang với nút prev/next */}
                  <div className="relative w-full pb-4">
                    <button
                      onClick={() => {
                        if (mobileScrollRef.current)
                          mobileScrollRef.current.scrollBy({
                            left: -200,
                            behavior: "smooth",
                          })
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full shadow-lg bg-white text-pink-700 opacity-80 hover:opacity-100 hover:bg-pink-50 hover:shadow-xl transition-all duration-200 border border-pink-200"
                      aria-label="Prev"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (mobileScrollRef.current)
                          mobileScrollRef.current.scrollBy({
                            left: 200,
                            behavior: "smooth",
                          })
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full shadow-lg bg-white text-pink-700 opacity-80 hover:opacity-100 hover:bg-pink-50 hover:shadow-xl transition-all duration-200 border border-pink-200"
                      aria-label="Next"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <div
                      ref={mobileScrollRef}
                      className="w-full overflow-x-scroll no-scrollbar px-4"
                    >
                      <div className="flex w-max flex-nowrap gap-4 items-stretch">
                        {products.slice(1).map((product: any) => (
                          <div
                            key={product.documentId}
                            className="min-w-[140px] max-w-[160px]"
                          >
                            <Product data={product} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Desktop: scroll ngang như cũ
            <div
              ref={scrollRef}
              className="w-full overflow-x-scroll no-scrollbar"
            >
              <div className="flex w-max flex-nowrap gap-4 py-0 pr-4 items-stretch">
                {products.map((product: any) => (
                  <div
                    key={product.documentId}
                    className="min-w-[140px] max-w-[160px]"
                  >
                    <Product data={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
