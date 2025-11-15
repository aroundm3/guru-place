"use client"

import { Tooltip } from "@mui/material"
import { useState } from "react"
import { CustomerCardModal } from "./customer-card-modal"
import { CustomerCard } from "types/global"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"
import { useCustomerCards } from "@lib/context/customer-card-context"
import {
  getCardColor,
  getCardBgClasses,
  getCardBorderClasses,
  getCardIconClasses,
  getCardTextClasses,
  getCardBadgeClasses,
} from "@lib/util/card-colors"

interface DiscountCardDisplayProps {
  productId: string
  customerCards: CustomerCard[]
}

export default function DiscountCardDisplay({
  productId,
  customerCards,
}: DiscountCardDisplayProps) {
  const [openModal, setOpenModal] = useState("")
  const { getCardById } = useCustomerCards()

  // Lấy card có discount nhỏ nhất từ customer_cards của product
  const minDiscountCardFromProduct =
    customerCards && customerCards.length > 0
      ? customerCards.reduce((min, card) =>
          card.discount < min.discount ? card : min
        )
      : null

  // Lấy đầy đủ data từ context dựa vào id
  const minDiscountCard = minDiscountCardFromProduct
    ? getCardById(minDiscountCardFromProduct.documentId) ||
      getCardById(minDiscountCardFromProduct.id) ||
      minDiscountCardFromProduct
    : null

  if (!minDiscountCard) {
    return null // Don't render anything if no discount card is available
  }

  const cardColor = getCardColor(minDiscountCard)

  return (
    <>
      <Tooltip title="Nhấn để xem chi tiết ưu đãi">
        <div
          className={`px-3 py-1 border-2 ${getCardBorderClasses(
            cardColor
          )} rounded-lg cursor-pointer ${getCardBgClasses(
            cardColor
          )} flex space-x-1.5 items-center hover:opacity-80 hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-sm`}
          onClick={() => setOpenModal(minDiscountCard.documentId)}
        >
          <CardGiftcardRoundedIcon
            className={`${getCardIconClasses(
              cardColor
            )} !h-5 !w-5 flex-shrink-0`}
          />
          <span
            className={`${getCardTextClasses(cardColor)} text-xs font-bold`}
          >
            {minDiscountCard.title}
          </span>
        </div>
      </Tooltip>

      <CustomerCardModal
        open={!!openModal}
        onClose={() => setOpenModal("")}
        card={minDiscountCard}
      />
    </>
  )
}
