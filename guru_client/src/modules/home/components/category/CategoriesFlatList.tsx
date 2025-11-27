"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { Category } from "types/global"

// Hàm chia mảng thành các chunk
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

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

export default function CategoriesFlatList({
  categories,
}: {
  categories: Category[]
}) {
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

  // Chia categories thành 2 chunk nếu là mobile, còn không thì 1 chunk chứa tất cả
  let categoryChunks: Category[][]
  if (isMobile) {
    const half = Math.ceil(categories.length / 2)
    categoryChunks = [categories.slice(0, half), categories.slice(half)]
  } else {
    categoryChunks = [categories]
  }

  return (
    <div className="relative flex flex-col pt-3 pb-4 border-stone-200 shadow-lg rounded-lg border">
      <div className="mr-4 flex lg:space-x-1 space-x-0.5 px-4 text-gray-700 items-center">
        <h6 className="my-auto lg:text-xl text-lg font-semibold text-pink-700">
          Danh mục
        </h6>
      </div>
      <div className="!mb-4" />

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-4 opacity-60 hover:opacity-100 duration-300 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
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
          className="top-1/2 -translate-y-1/2 absolute right-4 opacity-60 hover:opacity-100 duration-300 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
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
          <div className="flex w-max flex-nowrap lg:gap-x-4 gap-y-3 flex-col lg:flex-row">
            {categoryChunks.map((chunk, chunkIdx) => (
              <div key={chunkIdx} className="flex flex-row lg:gap-x-4 gap-x-3">
                {chunk.map((category) => (
                  <Link
                    href={`category_${category.slug}`}
                    key={category.documentId}
                    className="flex flex-col h-auto px-2 border border-stone-300 bg-white rounded-lg cursor-pointer duration-300 text-pink-700"
                  >
                    <div className="py-2 w-fit mx-auto">
                      <Image
                        src={category.image}
                        alt={category.name}
                        height={0}
                        width={0}
                        className="lg:w-24 w-20 lg:h-24 h-20 object-scale-down my-auto rounded-t-lg aspect-square"
                        loading="eager"
                        sizes="80vw"
                      />
                    </div>
                    <div className="text-center lg:w-32 w-28 py-2 mx-auto my-auto">
                      <span className="text-xs font-semibold">
                        {category.name}
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
