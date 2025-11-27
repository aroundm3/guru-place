"use client"
import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Banner } from "types/global"
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded"
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"

const BannerCarousel = ({ banners }: { banners: Banner[] }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < banners.length - 1) {
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
    } else if (offsetX < -50 && currentIndex < banners.length - 1) {
      handleNext()
    }
  }

  return (
    <div className="relative w-full mx-auto overflow-hidden">
      <motion.div
        ref={carouselRef}
        className="flex select-none relative w-full lg:h-[560px] md:h-[440px] h-[280px]"
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            className="min-w-full h-full relative"
            drag="x"
            dragElastic={0.2}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <img
              src={banner.image}
              alt={"Banner"}
              className="w-full object-cover pointer-events-none"
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
        disabled={currentIndex === banners.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity"
      >
        <ChevronRightRoundedIcon />
      </button>

      {/* Indicator Dots */}
      <div className="flex justify-center mt-4 space-x-2 absolute left-1/2 -translate-x-1/2 bottom-4">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndexClick(index)}
            className={`w-10 h-1 rounded-full ${
              currentIndex === index ? "bg-pink-600" : "bg-pink-300"
            } transition-colors duration-300`}
          />
        ))}
      </div>
    </div>
  )
}

export default BannerCarousel
