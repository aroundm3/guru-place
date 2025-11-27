"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "@lib/context/customer-context"
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
import { CustomerCard } from "types/global"

type CardWithQuantity = {
  card: CustomerCard
  quantity: number
}

type GroupedCards = {
  color: "pink" | "blue" | "yellow"
  cards: CardWithQuantity[]
  totalQuantity: number
}

export default function DiscountCardPage() {
  const { customer } = useCustomer()
  const {
    customerCards,
    loading: cardsLoading,
    getActiveCards,
  } = useCustomerCards()
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0)
  const [cardsFromOrders, setCardsFromOrders] = useState<CardWithQuantity[]>([])
  const [groupedCards, setGroupedCards] = useState<GroupedCards[]>([])
  const [loadingOrdersCards, setLoadingOrdersCards] = useState<boolean>(true)
  const [selectedCardFromOrder, setSelectedCardFromOrder] =
    useState<CardWithQuantity | null>(null)
  const [activeTab, setActiveTab] = useState<"system" | "my-cards">("system")
  const [productsWithGifts, setProductsWithGifts] = useState<ProductType[]>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(true)
  const [pageCount, setPageCount] = useState<number>(1)
  const activeCards = getActiveCards()

  // Chọn card đầu tiên nếu có (từ hệ thống)
  const selectedCard =
    activeCards.length > 0
      ? activeCards[selectedCardIndex] || activeCards[0]
      : null

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleModalSkip = () => {
      setActiveTab("system")
    }

    window.addEventListener("discount-cards-modal-skip", handleModalSkip)

    return () => {
      window.removeEventListener("discount-cards-modal-skip", handleModalSkip)
    }
  }, [])

  // Fetch customer cards from orders
  useEffect(() => {
    const fetchCardsFromOrders = async () => {
      if (!customer?.documentId) {
        setLoadingOrdersCards(false)
        return
      }

      try {
        setLoadingOrdersCards(true)
        const response = await fetch(
          `/api/customer-cards-from-orders?customerId=${customer.documentId}`
        )
        const data = await response.json()

        if (data.data) {
          const cards: CardWithQuantity[] = data.data.map((item: any) => ({
            card: item.card as CustomerCard,
            quantity: item.quantity,
          }))
          setCardsFromOrders(cards)

          // Nhóm cards theo màu
          const grouped: GroupedCards[] = [
            { color: "pink", cards: [], totalQuantity: 0 },
            { color: "blue", cards: [], totalQuantity: 0 },
            { color: "yellow", cards: [], totalQuantity: 0 },
          ]

          cards.forEach((cardWithQty) => {
            const color = getCardColor(cardWithQty.card)
            const group = grouped.find((g) => g.color === color) || grouped[2]
            group.cards.push(cardWithQty)
            group.totalQuantity += cardWithQty.quantity
          })

          // Chỉ giữ lại các nhóm có cards
          const filteredGroups = grouped.filter((g) => g.cards.length > 0)
          setGroupedCards(filteredGroups)

          // Chọn card đầu tiên từ orders
          if (filteredGroups.length > 0 && filteredGroups[0].cards.length > 0) {
            setSelectedCardFromOrder(filteredGroups[0].cards[0])
          }
        }
      } catch (error) {
        console.error("Error fetching cards from orders:", error)
      } finally {
        setLoadingOrdersCards(false)
      }
    }

    fetchCardsFromOrders()
  }, [customer?.documentId])

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

  if (cardsLoading) {
    return (
      <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8">
        <div className="text-center py-12 lg:py-16">
          <p className="text-sm lg:text-base text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (activeCards.length === 0) {
    return (
      <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8">
        <h1 className="text-xl lg:text-2xl font-bold mb-4">Thẻ tích điểm</h1>
        <div className="text-center py-12 lg:py-16">
          <p className="text-sm lg:text-base text-gray-600">
            Hiện tại không có tích điểm nào.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 max-w-7xl">
      <h1 className="text-2xl uppercase lg:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6 lg:mb-8 tracking-tight">
        Thẻ tích điểm
      </h1>

      <CustomerInfoEdit />

      {/* Tabs để chuyển đổi giữa thẻ hệ thống và thẻ của bạn */}
      <div className="flex gap-2 mb-4 lg:mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 text-base font-semibold transition-colors ${
            activeTab === "system"
              ? "text-pink-700 border-b-2 border-pink-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Thẻ tích điểm
        </button>
        <button
          onClick={() => {
            setActiveTab("my-cards")
            if (!customer) {
              window.dispatchEvent(
                new Event("discount-cards-open-profile-modal")
              )
            }
          }}
          className={`px-4 py-2 text-base font-semibold transition-colors ${
            activeTab === "my-cards"
              ? "text-pink-700 border-b-2 border-pink-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Thẻ tích điểm của bạn
          {groupedCards.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs lg:text-sm">
              {groupedCards.reduce((sum, g) => sum + g.totalQuantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:gap-8">
        {/* Tabs bên trái */}
        <div className="lg:w-1/3 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 lg:sticky lg:top-24">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
              Danh sách thẻ
            </h2>
            {activeTab === "system" ? (
              // Cards từ hệ thống (UI cũ)
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
                      className={`w-full text-left p-2.5 lg:p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? cardColor === "pink"
                            ? "bg-pink-600 text-white font-medium shadow-sm"
                            : cardColor === "blue"
                            ? "bg-blue-600 text-white font-medium shadow-sm"
                            : "bg-yellow-600 text-white font-medium shadow-sm"
                          : `${getCardBgClasses(
                              cardColor
                            )} border ${getCardBorderClasses(
                              cardColor
                            )} hover:opacity-80 text-gray-900`
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CardGiftcardRoundedIcon
                          className={`!h-4 !w-4 lg:!h-5 lg:!w-5 flex-shrink-0 ${
                            isSelected
                              ? "text-white"
                              : getCardIconClasses(cardColor)
                          }`}
                        />
                        <span className="text-xs lg:text-sm lg:text-base truncate">
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
            ) : // Cards từ orders của customer
            loadingOrdersCards ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">Đang tải...</p>
              </div>
            ) : groupedCards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  Bạn chưa có thẻ tích điểm nào từ đơn hàng.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupedCards.map((group) => {
                  const colorName =
                    group.color === "pink"
                      ? "Hồng"
                      : group.color === "blue"
                      ? "Xanh"
                      : "Trung tính"
                  return (
                    <div key={group.color} className="space-y-2">
                      <div className="flex items-center justify-between px-2">
                        <span
                          className={`text-xs font-semibold uppercase tracking-wide ${getCardTextClasses(
                            group.color
                          )}`}
                        >
                          {colorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {group.totalQuantity} thẻ
                        </span>
                      </div>
                      {group.cards.map((cardWithQty) => {
                        const cardColor = getCardColor(cardWithQty.card)
                        const isSelected =
                          selectedCardFromOrder?.card.documentId ===
                          cardWithQty.card.documentId
                        return (
                          <motion.button
                            key={cardWithQty.card.documentId}
                            onClick={() =>
                              setSelectedCardFromOrder(cardWithQty)
                            }
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left p-2.5 lg:p-3 rounded-lg transition-all duration-200 ${
                              isSelected
                                ? cardColor === "pink"
                                  ? "bg-pink-600 text-white font-medium shadow-sm"
                                  : cardColor === "blue"
                                  ? "bg-blue-600 text-white font-medium shadow-sm"
                                  : "bg-yellow-600 text-white font-medium shadow-sm"
                                : `${getCardBgClasses(
                                    cardColor
                                  )} border ${getCardBorderClasses(
                                    cardColor
                                  )} hover:opacity-80 text-gray-900`
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <CardGiftcardRoundedIcon
                                  className={`!h-4 !w-4 lg:!h-5 lg:!w-5 flex-shrink-0 ${
                                    isSelected
                                      ? "text-white"
                                      : getCardIconClasses(cardColor)
                                  }`}
                                />
                                <span className="text-xs lg:text-sm lg:text-base truncate">
                                  {cardWithQty.card.title}
                                </span>
                              </div>
                              <span
                                className={`text-xs font-semibold flex-shrink-0 ${
                                  isSelected ? "text-white" : "text-gray-600"
                                }`}
                              >
                                x{cardWithQty.quantity}
                              </span>
                            </div>
                            {cardWithQty.card.discount > 0 && (
                              <div
                                className={`text-xs mt-1 ${
                                  isSelected ? "text-white/80" : "text-gray-500"
                                }`}
                              >
                                Giảm{" "}
                                {formatBigNumber(
                                  cardWithQty.card.discount,
                                  true
                                )}
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Nội dung bên phải */}
        <div className="lg:w-2/3 flex-1">
          <AnimatePresence mode="wait">
            {(() => {
              // Chọn card để hiển thị dựa trên activeTab
              const displayCard =
                activeTab === "system"
                  ? selectedCard
                  : selectedCardFromOrder?.card || null
              const displayQuantity =
                activeTab === "my-cards"
                  ? selectedCardFromOrder?.quantity
                  : null

              if (!displayCard) {
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 lg:p-8 text-center py-12">
                    <p className="text-sm text-gray-500">
                      {activeTab === "system"
                        ? "Vui lòng chọn một thẻ tích điểm"
                        : "Vui lòng chọn một thẻ tích điểm của bạn"}
                    </p>
                  </div>
                )
              }

              const cardColor = getCardColor(displayCard)
              return (
                <motion.div
                  key={displayCard.documentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 lg:p-8"
                >
                  {/* Ảnh */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative w-full mb-4 lg:mb-6 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={displayCard.image?.default || "/logo.png"}
                      alt={displayCard.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </motion.div>

                  {/* Title và Quantity */}
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <motion.h2
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className={`text-2xl lg:text-3xl lg:text-4xl font-bold ${getCardTextClasses(
                        cardColor
                      )} tracking-tight`}
                    >
                      {displayCard.title}
                    </motion.h2>
                    {displayQuantity && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                        className={`px-3 py-1.5 rounded-full text-sm font-bold ${getCardBgClasses(
                          cardColor
                        )} ${getCardTextClasses(
                          cardColor
                        )} border ${getCardBorderClasses(cardColor)}`}
                      >
                        Số lượng: {displayQuantity}
                      </motion.span>
                    )}
                  </div>

                  <Divider className="my-3 lg:my-4" />

                  {/* Discount Info - chỉ hiển thị khi discount > 0 */}
                  {displayCard.discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className={`mb-4 lg:mb-6 p-4 lg:p-5 ${getCardBgClasses(
                        cardColor
                      )} rounded-lg border ${getCardBorderClasses(cardColor)}`}
                    >
                      <div className="flex items-center gap-3 lg:gap-4">
                        <CardGiftcardRoundedIcon
                          className={`!h-6 !w-6 lg:!h-7 lg:!w-7 ${getCardIconClasses(
                            cardColor
                          )} flex-shrink-0`}
                        />
                        <div>
                          <p className="text-xs lg:text-sm text-gray-600 font-medium uppercase tracking-wide mb-1">
                            Giảm giá
                          </p>
                          <p
                            className={`text-2xl lg:text-3xl font-bold ${getCardTextClasses(
                              cardColor
                            )}`}
                          >
                            {formatBigNumber(displayCard.discount, true)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Description */}
                  {displayCard.description && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="mb-4 lg:mb-6"
                    >
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2.5">
                        Mô tả
                      </h3>
                      <p className="text-sm lg:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {displayCard.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Products (nếu có) */}
                  {displayCard.products && displayCard.products.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                        Sản phẩm áp dụng ({displayCard.products.length})
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                        {displayCard.products.map((product, idx) => (
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
                                  product.images?.[0]?.default || "/logo.png"
                                }
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-2.5">
                              <p className="text-xs lg:text-sm font-medium text-gray-900 truncate">
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
          className="mt-8 lg:mt-12 lg:mt-16"
        >
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Sản phẩm trong chương trình tích điểm
            </h2>
          </div>
          <div className="grid lg:grid-cols-4 lg:grid-cols-3 grid-cols-2 lg:gap-6 gap-4">
            {productsWithGifts.map((product) => (
              <Product key={product.documentId} data={product} />
            ))}
          </div>
          {pageCount > 1 && (
            <div className="w-full flex justify-center mt-6 lg:mt-8">
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
        <div className="mt-8 lg:mt-12 lg:mt-16">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Sản phẩm trong chương trình tích điểm
            </h2>
          </div>
          <div className="text-center py-8">
            <p className="text-sm lg:text-base text-gray-600">Đang tải...</p>
          </div>
        </div>
      )}
    </div>
  )
}
