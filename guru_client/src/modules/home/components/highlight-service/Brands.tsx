"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { Brand } from "types/global"

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

export default function Brands({ brands }: { brands: Brand[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  // Chia brands thành 2 chunk nếu là mobile, còn không thì 1 chunk chứa tất cả
  let brandChunks: Brand[][]
  if (isMobile) {
    const half = Math.ceil(brands.length / 2)
    brandChunks = [brands.slice(0, half), brands.slice(half)]
  } else {
    brandChunks = [brands]
  }

  return (
    <div className="relative flex flex-col pt-3 pb-4 border-stone-200 shadow-lg rounded-lg border">
      <div className="mr-4 flex sm:space-x-1 space-x-0.5 px-4 text-gray-700 items-center">
        <h6 className="my-auto sm:text-xl text-lg font-semibold text-pink-700">
          Thương hiệu nổi bật
        </h6>
      </div>
      <div className="!mb-4" />

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-4 opacity-30 hover:opacity-100 duration-300 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          aria-label="Scroll left"
        >
          <svg
            className="w-6 h-6 text-pink-700"
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
          onClick={scrollRight}
          className="top-1/2 -translate-y-1/2 absolute right-4 opacity-30 hover:opacity-100 duration-300 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          aria-label="Scroll right"
        >
          <svg
            className="w-6 h-6 text-pink-700"
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
        <div
          className="w-full overflow-x-scroll no-scrollbar px-4"
          ref={scrollRef}
        >
          <div className="flex w-max flex-nowrap sm:gap-x-4 gap-y-3 flex-col sm:flex-row">
            {brandChunks.map((chunk, chunkIdx) => (
              <div key={chunkIdx} className="flex flex-row sm:gap-x-4 gap-x-3">
                {chunk.map((brand) => (
                  <Link
                    href={`brand_${brand.slug}`}
                    key={brand.documentId}
                    className="flex flex-col h-fit bg-white rounded-lg cursor-pointer duration-300 text-pink-700 border-stone-300 border"
                  >
                    <div className="px-2 py-4">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        height={0}
                        width={0}
                        className="sm:h-20 h-16 sm:w-28 w-24 object-scale-down my-auto rounded-t-lg"
                        loading="eager"
                        sizes="80vw"
                      />
                    </div>
                    <div className="text-center w-full py-2">
                      <span className="text-xs font-semibold">
                        {brand.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
