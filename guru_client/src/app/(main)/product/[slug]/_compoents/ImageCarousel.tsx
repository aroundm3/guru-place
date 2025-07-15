"use client"
import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded"
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"
import Image from "next/image"

interface ImageCarouselProps {
  images: string[]
  thumbImages: string[]
  productTitle: string
}

export default function ImageCarousel({
  images,
  productTitle,
  thumbImages,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleIndexClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    const offsetX = info.offset.x
    if (offsetX > 50 && currentIndex > 0) {
      handlePrev()
    } else if (offsetX < -50 && currentIndex < images.length - 1) {
      handleNext()
    }
  }

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
    <div className="flex flex-col space-y-2">
      <div className="relative w-full mx-auto overflow-hidden border border-stone-400 rounded-lg">
        <motion.div
          ref={carouselRef}
          className="flex select-none relative w-full aspect-square"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="min-w-full h-full relative flex"
              drag="x"
              dragElastic={0.2}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
            >
              <img
                src={image}
                alt={productTitle}
                className="w-full h-full object-scale-down pointer-events-none my-auto mx-auto rounded-lg"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity"
        >
          <KeyboardArrowLeftRoundedIcon />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === images.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity"
        >
          <ChevronRightRoundedIcon />
        </button>
      </div>
      {/* list thumbs */}
      {/* <div className="relative mt-2">
        <button
          onClick={scrollLeft}
          className="absolute left-4 opacity-30 hover:opacity-100 duration-300 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-stone-100"
          aria-label="Scroll left"
        >
          <svg
            className="w-4 h-4 text-pink-700"
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
          className="top-1/2 -translate-y-1/2 absolute right-4 opacity-30 hover:opacity-100 duration-300 z-10 p-2 bg-white rounded-full shadow-md hover:bg-stone-100"
          aria-label="Scroll right"
        >
          <svg
            className="w-4 h-4 text-pink-700"
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
          className="w-full overflow-x-scroll no-scrollbar bg-white"
          ref={scrollRef}
        >
          <div className="flex w-max flex-nowrap gap-1">
            {thumbImages.map((image, idx) => {
              return (
                <div
                  onClick={() => handleIndexClick(idx)}
                  key={idx}
                  className={`sm:h-16 cursor-pointer h-12 aspect-square p-1 bg-white border rounded ${
                    currentIndex === idx
                      ? "border-pink-600"
                      : "border-stone-400"
                  }`}
                >
                  <Image
                    src={image}
                    alt={productTitle}
                    height={0}
                    width={0}
                    className="object-cover my-auto w-full h-full rounded"
                    loading="eager"
                    sizes="80vw"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div> */}
    </div>
  )
}
