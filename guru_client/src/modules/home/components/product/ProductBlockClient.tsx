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

export default function ProductBlockClient({ block }: ProductBlockClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const bannerTextRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
  const [bannerHeight, setBannerHeight] = useState<number | undefined>(
    undefined
  )
  const products = block.products.slice(0, 6)
  const total = products.length + (block.products.length > 6 ? 1 : 0)

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

  return (
    <div className="flex items-center border-stone-200 shadow-lg border rounded-lg space-x-4">
      {!isMobile && (
        <div className="sm:w-2/5 w-1/2 flex-shrink-0 relative">
          {/* <div className="w-full h-full bg-blue-500"></div> */}
          {block.banner.default ? (
            <img
              src={block.banner.default}
              alt={block.title}
              className={`!inline-block w-auto !rounded-l-lg !object-cover`}
              width={0}
              height={0}
              loading="eager"
              style={bannerHeight ? { height: `${bannerHeight}px` } : undefined}
            />
          ) : (
            ""
          )}

          {/* Overlay mờ mờ */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent rounded-l-lg"></div>

          {/* Text content với animation */}
          <motion.div
            ref={bannerTextRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col space-y-4 absolute inset-0 justify-center text-left px-6"
          >
            <span
              className={`font-bold text-2xl sm:text-3xl drop-shadow-lg ${
                block.banner.default ? "text-rose-50" : "text-pink-600"
              }`}
            >
              {block.title}
            </span>
            <Link
              href={`/collection_${block.documentId}`}
              className={`inline-flex items-center ${
                block.banner.default ? "text-rose-50" : "text-pink-600"
              } sm:text-base text-sm font-semibold group drop-shadow-lg`}
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
      )}
      <div className={`flex-1 relative overflow-hidden`}>
        {/* Desktop: Nút prev/next */}
        {!isMobile && (
          <>
            <button
              onClick={() => {
                if (scrollRef.current)
                  scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
              }}
              className="hidden sm:block absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md bg-white text-pink-700 opacity-30 hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
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
                  scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
              }}
              className="hidden sm:block absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md bg-white text-pink-700 opacity-30 hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
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
                {/* Hàng 1: Banner với text */}
                <div className="relative w-full rounded-t-lg overflow-hidden">
                  <img
                    src={block.banner.default}
                    alt={block.title}
                    className="w-full h-48 object-cover"
                    loading="eager"
                  />
                  {/* Overlay mờ mờ */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent"></div>
                  {/* Text content với animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col space-y-4 absolute inset-0 justify-center text-left px-6"
                  >
                    <span
                      className={`font-bold text-2xl sm:text-3xl ${
                        block.banner.default ? "text-rose-50" : "text-pink-600"
                      } drop-shadow-lg`}
                    >
                      {block.title}
                    </span>
                    <Link
                      href={`/collection_${block.documentId}`}
                      className="inline-flex items-center text-white sm:text-base text-sm font-semibold group drop-shadow-lg"
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
                {/* Giao diện cũ: Text + 1 sản phẩm ở hàng 1 */}
                <div className="flex w-full gap-4 px-4 pt-4">
              <div className="flex-shrink-0 flex flex-col space-y-4 w-1/2">
                    <span
                      className={`font-bold text-2xl sm:text-3xl ${
                        block.banner.default ? "text-rose-50" : "text-pink-600"
                      }`}
                    >
                  {block.title}
                </span>
                <Link
                  href={`/collection_${block.documentId}`}
                      className={`inline-flex items-center sm:text-base text-sm font-semibold group ${
                        block.banner.default ? "text-rose-50" : "text-pink-600"
                      }`}
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
              </div>
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
            <div className="flex w-max flex-nowrap gap-4 py-4 pr-4 items-stretch">
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
  )
}
