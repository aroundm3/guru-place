"use client"

import { useCardById } from "@lib/context/customer-card-context"
import { Card, CardContent, Typography, Tooltip, Box } from "@mui/material"
import { useState } from "react"
import { CustomerCardModal } from "./customer-card-modal"
import { getFullLinkResource } from "@lib/config"
import { CustomerCard } from "types/global"
import { formatBigNumber } from "@lib/util/format-big-number"

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
    <Box className="mt-4">
      {discountCard.map((card) => (
        <Tooltip title="Nhấn để xem chi tiết ưu đãi">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow duration-300 max-w-xs !border !border-stone-300 !rounded-lg"
            onClick={() => setOpenModal(card.documentId)}
          >
            <CardContent className="flex items-center !p-0 !h-24">
              {card.image && (
                <img
                  src={card.image.default}
                  alt={`Thẻ ưu đãi ${card.title}`}
                  className="h-24 w-24 object-cover"
                  loading="lazy"
                />
              )}
              <Box className="ml-3 !py-2">
                <Typography
                  variant="subtitle2"
                  className="font-semibold line-clamp-1"
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  className="font-bold"
                >
                  Giảm {formatBigNumber(card.discount, true)} cho lần mua tiếp
                  theo
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  className="block mt-1"
                >
                  Nhấn để xem chi tiết
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Tooltip>
      ))}

      <CustomerCardModal
        open={!!openModal}
        onClose={() => setOpenModal("")}
        card={discountCard.find((card) => card.documentId === openModal)}
      />
    </Box>
  )
}
