"use client"

import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Button,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"
import Image from "next/image"
import Link from "next/link"
import { CustomerCard } from "types/global"
import { formatBigNumber } from "@lib/util/format-big-number"
import {
  getCardColor,
  getCardBorderClasses,
  getCardTextClasses,
} from "@lib/util/card-colors"

interface CustomerCardModalProps {
  open: boolean
  onClose: () => void
  card: CustomerCard | undefined
}

export const CustomerCardModal = ({
  open,
  onClose,
  card,
}: CustomerCardModalProps) => {
  if (!card) return null

  const cardColor = getCardColor(card)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Ảnh tràn viền modal */}
        <div className="relative w-full">
          <Image
            src={card.image?.default || "/placeholder-card.png"}
            alt={card.title}
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />

          {/* Close button */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "gray.900",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {/* Title dưới ảnh */}
        <div
          className={`p-4 sm:p-6 border-b ${getCardBorderClasses(cardColor)}`}
        >
          <h2
            className={`${getCardTextClasses(
              cardColor
            )} text-2xl sm:text-4xl font-bold`}
          >
            {card.title}
          </h2>
        </div>

        {/* Nội dung phía dưới */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Description */}
          {card.description && (
            <Typography
              variant="body1"
              color="text.secondary"
              className="text-sm sm:text-base font-semibold"
            >
              {card.description}
            </Typography>
          )}

          {/* Tìm hiểu thêm button */}
          <Link href="/discount-cards" onClick={onClose}>
            <Button
              variant="contained"
              fullWidth
              className="!bg-neutral-900 !text-white !normal-case !font-semibold !mt-4"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Tìm hiểu thêm
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
