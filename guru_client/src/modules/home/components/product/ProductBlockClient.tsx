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
  const isMobile = useIsMobile()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)
  const products = block.products.slice(0, 6)
  const total = products.length + (block.products.length > 6 ? 1 : 0)

  // Ref cho từng item để đo chiều cao
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

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
    <div className="flex items-center bg-rose-300 rounded-xl shadow-sm border p-4 mb-4 sm:space-x-10 space-x-6">
      {/* Title bên trái */}
      <div className="sm:w-1/4 w-2/5 flex-shrink-0 flex flex-col space-y-4">
        <span className="font-bold text-2xl sm:text-3xl text-rose-50">
          {block.title}
        </span>
        <Link
          href={`/collection_${block.documentId}`}
          className="mt-2 inline-flex items-center text-white sm:text-lg text-base font-semibold group"
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
      <div
        className={`flex-1 relative overflow-hidden${
          isMobile ? " min-h-[340px]" : ""
        }`}
      >
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
        {/* Mobile: Carousel */}
        {isMobile ? (
          <>
            {/* Render ẩn để đo chiều cao lớn nhất */}
            <div className="absolute opacity-0 pointer-events-none w-full">
              {products.map((product: any, idx: number) => (
                <div
                  key={product.documentId}
                  ref={(el) => {
                    itemRefs.current[idx] = el
                  }}
                  className="w-full flex flex-col"
                >
                  <Product data={product} />
                </div>
              ))}
            </div>
            {/* Carousel thực tế */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md transition-all duration-200
                ${
                  currentIndex > 0
                    ? "bg-white text-pink-700 opacity-100 hover:bg-gray-100"
                    : "bg-white text-pink-700 opacity-20"
                }
              `}
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
              onClick={handleNext}
              disabled={currentIndex === total - 1}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md transition-all duration-200
                ${
                  currentIndex < total - 1
                    ? "bg-white text-pink-700 opacity-100 hover:bg-gray-100"
                    : "bg-white text-pink-700 opacity-20"
                }
              `}
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
            <motion.div
              className="flex w-full h-full items-stretch"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              style={{ minWidth: "100%", minHeight: "100%" }}
            >
              {products.map((product: any, idx: number) => (
                <div
                  key={product.documentId}
                  className="w-full h-full flex-shrink-0 flex flex-col px-2"
                >
                  <Product data={product} />
                </div>
              ))}
            </motion.div>
            {/* Indicator dots */}
            <div className="flex justify-center bottom-0 space-x-2 absolute left-1/2 -translate-x-1/2">
              {Array.from({ length: total }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 bg-white ${
                    idx === currentIndex ? "w-8 bg-white" : "w-3"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          // Desktop: scroll ngang như cũ
          <div className="w-full overflow-x-scroll no-scrollbar">
            <div className="flex w-max flex-nowrap gap-4 py-2 items-stretch">
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
