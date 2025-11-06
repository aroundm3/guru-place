"use client"

import { useCardById } from "@lib/context/customer-card-context"
import { Tooltip } from "@mui/material"
import { useState } from "react"
import { CustomerCardModal } from "./customer-card-modal"
import { CustomerCard } from "types/global"
import { formatBigNumber } from "@lib/util/format-big-number"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"

interface DiscountCardDisplayProps {
  productId: string
  customerCards: CustomerCard[]
}

export default function DiscountCardDisplay({
  productId,
  customerCards,
}: DiscountCardDisplayProps) {
  const discountCard = useCardById(customerCards)
  const [openModal, setOpenModal] = useState("")

  if (!discountCard?.length) {
    return null // Don't render anything if no discount card is available
  }

  console.log({ discountCard, customerCards })

  return (
    <>
      {discountCard.map((card) => (
        <Tooltip key={card.documentId} title="Nhấn để xem chi tiết ưu đãi">
          <div
            className="px-3 py-1 border-2 border-rose-600 rounded-lg cursor-pointer bg-gradient-to-r from-rose-100 to-pink-100 flex space-x-1.5 items-center hover:from-rose-200 hover:to-pink-200 hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
            onClick={() => setOpenModal(card.documentId)}
          >
            <CardGiftcardRoundedIcon className="text-rose-700 !h-5 !w-5 animate-pulse" />
            <span className="text-rose-800 text-xs font-bold">
              {card.title}
            </span>
          </div>
        </Tooltip>
      ))}

      <CustomerCardModal
        open={!!openModal}
        onClose={() => setOpenModal("")}
        card={discountCard.find((card) => card.documentId === openModal)}
      />
    </>
  )
}
