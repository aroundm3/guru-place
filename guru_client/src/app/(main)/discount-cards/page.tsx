"use client"

import { useState, useEffect } from "react"
import { useCustomerCards } from "@lib/context/customer-card-context"
import Image from "next/image"
import { formatBigNumber } from "@lib/util/format-big-number"
import { Divider } from "@medusajs/ui"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"
import { motion, AnimatePresence } from "framer-motion"
import {
  getCardColor,
  getCardBgClasses,
  getCardBorderClasses,
  getCardIconClasses,
  getCardTextClasses,
} from "@lib/util/card-colors"
import Product from "@modules/home/components/product/Product"
import Link from "next/link"
import { Product as ProductType } from "types/global"
import CustomerInfoEdit from "@modules/layout/components/customer-info-edit"

export default function DiscountCardPage() {
  const { customerCards, loading, getActiveCards } = useCustomerCards()
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0)
  const [productsWithGifts, setProductsWithGifts] = useState<ProductType[]>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(true)
  const [pageCount, setPageCount] = useState<number>(1)

  const activeCards = getActiveCards()

  // Chọn card đầu tiên nếu có
  const selectedCard =
    activeCards.length > 0
      ? activeCards[selectedCardIndex] || activeCards[0]
      : null

  // Fetch products with customer cards
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true)
        const response = await fetch(`/api/products-with-gifts?page=1`)
        const data = await response.json()

        if (data.data) {
          setProductsWithGifts(data.data)
          setPageCount(data.pageCount || 1)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center py-12 sm:py-16">
          <p className="text-sm sm:text-base text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (activeCards.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Thẻ quà tặng</h1>
        <div className="text-center py-12 sm:py-16">
          <p className="text-sm sm:text-base text-gray-600">
            Hiện tại không có thẻ quà tặng nào.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 tracking-tight">
        Thẻ quà tặng
      </h1>

      <CustomerInfoEdit />

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Tabs bên trái */}
        <div className="lg:w-1/3 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:sticky lg:top-24">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Danh sách thẻ
            </h2>
            <div className="space-y-2">
              {activeCards.map((card, index) => {
                const cardColor = getCardColor(card)
                const isSelected = selectedCardIndex === index
                return (
                  <motion.button
                    key={card.documentId}
                    onClick={() => setSelectedCardIndex(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? cardColor === "pink"
                          ? "bg-pink-600 text-white font-medium shadow-sm"
                          : cardColor === "blue"
                          ? "bg-blue-600 text-white font-medium shadow-sm"
                          : "bg-neutral-900 text-white font-medium shadow-sm"
                        : `${getCardBgClasses(
                            cardColor
                          )} border ${getCardBorderClasses(
                            cardColor
                          )} hover:opacity-80 text-gray-900`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CardGiftcardRoundedIcon
                        className={`!h-4 !w-4 sm:!h-5 sm:!w-5 flex-shrink-0 ${
                          isSelected
                            ? "text-white"
                            : getCardIconClasses(cardColor)
                        }`}
                      />
                      <span className="text-xs sm:text-sm lg:text-base truncate">
                        {card.title}
                      </span>
                    </div>
                    {card.discount > 0 && (
                      <div
                        className={`text-xs mt-1 ${
                          isSelected ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        Giảm {formatBigNumber(card.discount, true)}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Nội dung bên phải */}
        <div className="lg:w-2/3 flex-1">
          <AnimatePresence mode="wait">
            {selectedCard &&
              (() => {
                const cardColor = getCardColor(selectedCard)
                return (
                  <motion.div
                    key={selectedCard.documentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8"
                  >
                    {/* Ảnh */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="relative w-full mb-4 sm:mb-6 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={selectedCard.image?.default || "/logo.png"}
                        alt={selectedCard.title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${getCardTextClasses(
                        cardColor
                      )} mb-3 sm:mb-4 tracking-tight`}
                    >
                      {selectedCard.title}
                    </motion.h2>

                    <Divider className="my-3 sm:my-4" />

                    {/* Discount Info - chỉ hiển thị khi discount > 0 */}
                    {selectedCard.discount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className={`mb-4 sm:mb-6 p-4 sm:p-5 ${getCardBgClasses(
                          cardColor
                        )} rounded-lg border ${getCardBorderClasses(
                          cardColor
                        )}`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <CardGiftcardRoundedIcon
                            className={`!h-6 !w-6 sm:!h-7 sm:!w-7 ${getCardIconClasses(
                              cardColor
                            )} flex-shrink-0`}
                          />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wide mb-1">
                              Giảm giá
                            </p>
                            <p
                              className={`text-2xl sm:text-3xl font-bold ${getCardTextClasses(
                                cardColor
                              )}`}
                            >
                              {formatBigNumber(selectedCard.discount, true)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Description */}
                    {selectedCard.description && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="mb-4 sm:mb-6"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2.5">
                          Mô tả
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                          {selectedCard.description}
                        </p>
                      </motion.div>
                    )}

                    {/* Products (nếu có) */}
                    {selectedCard.products &&
                      selectedCard.products.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                            Sản phẩm áp dụng ({selectedCard.products.length})
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {selectedCard.products.map((product, idx) => (
                              <motion.div
                                key={product.documentId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.6 + idx * 0.05,
                                }}
                                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                              >
                                <div className="relative w-full aspect-square">
                                  <Image
                                    src={
                                      product.images?.[0]?.default ||
                                      "/logo.png"
                                    }
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="p-2.5">
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                  </motion.div>
                )
              })()}
          </AnimatePresence>
        </div>
      </div>

      {/* Danh sách sản phẩm có ưu đãi */}
      {productsWithGifts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Sản phẩm có ưu đãi
            </h2>
          </div>
          <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-4">
            {productsWithGifts.map((product) => (
              <Product key={product.documentId} data={product} />
            ))}
          </div>
          {pageCount > 1 && (
            <div className="w-full flex justify-center mt-6 sm:mt-8">
              <Link href="/has_gift">
                <span className="text-sm font-semibold cursor-pointer hover:text-pink-600 duration-300">
                  Xem thêm
                </span>
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {productsLoading && (
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Sản phẩm có ưu đãi
            </h2>
          </div>
          <div className="text-center py-8">
            <p className="text-sm sm:text-base text-gray-600">Đang tải...</p>
          </div>
        </div>
      )}
    </div>
  )
}
