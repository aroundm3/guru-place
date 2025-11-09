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
        <div className="relative w-full h-64 sm:h-80">
          <Image
            src={card.image?.default || "/placeholder-card.png"}
            alt={card.title}
            fill
            className="object-cover"
            priority
          />

          {/* Lớp mờ phía trên ảnh */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

          {/* Title nằm trên ảnh */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h2 className="text-white text-2xl sm:text-4xl font-bold drop-shadow-lg">
              {card.title}
            </h2>
          </div>

          {/* Close button */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
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
              {card.description}s
            </Typography>
          )}

          {/* Discount info */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-2 sm:p-3">
            <Typography className="text-pink-700 font-bold !text-sm text-center">
              Giảm {formatBigNumber(card.discount, true)} cho lần mua tiếp theo
            </Typography>
          </div>

          {/* Apply info */}
          <Typography
            variant="body2"
            color="text.secondary"
            className="text-xs sm:text-sm text-center"
          >
            Áp dụng khi mua sản phẩm này
          </Typography>

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
