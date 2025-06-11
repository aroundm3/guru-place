"use client"

import { Divider } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { Category } from "types/global"

export default function CategoriesFlatList({
  categories,
}: {
  categories: Category[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="relative flex flex-col bg-[#fffdf8] border pt-3 pb-4 border-stone-300 rounded-lg">
      <div className="mr-4 flex sm:space-x-1 space-x-0.5 px-4 text-gray-700 items-center">
        <h6 className="my-auto sm:text-xl text-lg font-semibold">Danh mục</h6>
      </div>
      <Divider className="text-[#fffdf8] !mt-3 !mb-4" />

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
          <div className="flex sm:gap-4 gap-3 w-max flex-nowrap">
            {categories.map((category) => {
              return (
                <Link
                  href={`category_${category.slug}`}
                  key={category.documentId}
                  className="flex flex-col h-fit bg-white rounded-lg border border-stone-300 cursor-pointer duration-300 text-pink-700"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    height={0}
                    width={0}
                    className="sm:h-32 h-28 sm:w-32 w-28 object-cover my-auto rounded-t-lg"
                    loading="eager"
                    sizes="80vw"
                  />
                  <div className="text-center w-full py-2">
                    <span className="text-xs font-semibold">
                      {category.name}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
