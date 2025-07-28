"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Image from "next/image"
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <p className="font-semibold text-xl">{card.title}</p>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 200,
              borderRadius: 2,
              overflow: "hidden",
              mb: 2,
            }}
          >
            <Image
              src={card.image?.default || "/placeholder-card.png"}
              alt={card.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </Box>

          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            Giảm {formatBigNumber(card.discount, true)} cho lần mua tiếp theo
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {card.description}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Áp dụng khi mua sản phẩm này
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
