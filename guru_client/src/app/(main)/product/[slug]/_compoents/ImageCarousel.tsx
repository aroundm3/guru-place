"use client"
import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded"
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"
import CloseIcon from "@mui/icons-material/Close"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalIndex, setModalIndex] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<number>(1) // 1 for next, -1 for prev
  const [zoom, setZoom] = useState<number>(1)
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const carouselRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

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

  // Modal handlers
  const openModal = (index: number) => {
    setModalIndex(index)
    setIsModalOpen(true)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setSlideDirection(1)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleModalPrev = () => {
    if (modalIndex > 0) {
      setSlideDirection(-1)
      setModalIndex(modalIndex - 1)
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleModalNext = () => {
    if (modalIndex < images.length - 1) {
      setSlideDirection(1)
      setModalIndex(modalIndex + 1)
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isModalOpen])

  const handleImageDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    if (zoom > 1) {
      setPosition({ x: info.offset.x, y: info.offset.y })
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal()
      } else if (e.key === "ArrowLeft" && modalIndex > 0) {
        setSlideDirection(-1)
        setModalIndex(modalIndex - 1)
        setZoom(1)
        setPosition({ x: 0, y: 0 })
      } else if (e.key === "ArrowRight" && modalIndex < images.length - 1) {
        setSlideDirection(1)
        setModalIndex(modalIndex + 1)
        setZoom(1)
        setPosition({ x: 0, y: 0 })
      } else if (e.key === "+" || e.key === "=") {
        setZoom((prev) => Math.min(prev + 0.25, 3))
      } else if (e.key === "-") {
        setZoom((prev) => Math.max(prev - 0.25, 0.5))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen, modalIndex, images.length])

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
              className="min-w-full h-full relative flex cursor-pointer"
              drag="x"
              dragElastic={0.2}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onClick={() => openModal(index)}
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

      {/* Image View Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            >
              <CloseIcon />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
              >
                <ZoomInIcon />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
              >
                <ZoomOutIcon />
              </button>
            </div>

            {/* Main Image Container */}
            <div
              className="flex-1 flex items-center justify-center overflow-hidden relative"
              onWheel={handleWheel}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={modalIndex}
                  className="relative max-w-full max-h-full"
                  initial={{ opacity: 0, x: slideDirection * 100 }}
                  animate={{
                    opacity: 1,
                    x: zoom > 1 ? position.x : 0,
                    y: zoom > 1 ? position.y : 0,
                    scale: zoom,
                  }}
                  exit={{ opacity: 0, x: slideDirection * -100 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    x: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    },
                    y: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    },
                    scale: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    },
                  }}
                  drag={zoom > 1}
                  dragConstraints={{
                    left: -200,
                    right: 200,
                    top: -200,
                    bottom: 200,
                  }}
                  onDragEnd={handleImageDrag}
                >
                  <img
                    ref={imageRef}
                    src={images[modalIndex]}
                    alt={`${productTitle} - Image ${modalIndex + 1}`}
                    className="max-w-full max-h-[80vh] object-contain"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              {modalIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModalPrev()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  <KeyboardArrowLeftRoundedIcon />
                </button>
              )}
              {modalIndex < images.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModalNext()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRightRoundedIcon />
                </button>
              )}
            </div>

            {/* Thumbnail List */}
            <div className="h-24 bg-black/50 flex items-center justify-center gap-2 px-4 overflow-x-auto">
              {thumbImages.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSlideDirection(idx > modalIndex ? 1 : -1)
                    setModalIndex(idx)
                    setZoom(1)
                    setPosition({ x: 0, y: 0 })
                  }}
                  className={`flex-shrink-0 h-16 w-16 border-2 rounded overflow-hidden transition-all ${
                    modalIndex === idx
                      ? "border-white scale-110"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
