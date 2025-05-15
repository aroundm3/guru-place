"use client"
import React, { useState, useRef } from "react"
import { motion } from "framer-motion"

interface Banner {
  id: number
  image: string
  text: string
}

const banners: Banner[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    text: "Biển Xanh",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    text: "Núi Rừng",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    text: "Hoàng Hôn",
  },
]

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const containerWidth = carouselRef.current?.offsetWidth || 1
    const offset = info.offset.x
    const threshold = containerWidth * 0.3

    if (offset < -threshold) {
      if (currentIndex === banners.length - 1) {
        setCurrentIndex(0)
        return
      }
      setCurrentIndex(currentIndex + 1)
    } else if (offset > threshold) {
      if (currentIndex === 0) {
        setCurrentIndex(0)
        return
      }
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleIndexClick = (index: number) => {
    setCurrentIndex(index)
  }

  console.log({ currentIndex })

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden touch-pan-x">
      <motion.div
        ref={carouselRef}
        className="flex cursor-grab active:cursor-grabbing select-none relative w-full h-64"
        drag="x"
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-96 relative">
            <img
              src={banner.image}
              alt={banner.text}
              className="w-inherit h-inherit object-cover pointer-events-none"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
              {banner.text}
            </div>
          </div>
        ))}
      </motion.div>

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
