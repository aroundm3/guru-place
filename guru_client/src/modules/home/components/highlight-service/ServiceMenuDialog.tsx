"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Image from "next/image"
import Link from "next/link"
import { Product } from "types/global"
import { formatBigNumber } from "@lib/util/format-big-number"
import useGetListProducts from "@modules/layout/components/search-button/_hooks/useGetListProducts"
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"

interface ServiceMenuDialogProps {
  open: boolean
  onClose: () => void
  serviceMenuHtml?: string
}

export default function ServiceMenuDialog({
  open,
  onClose,
  serviceMenuHtml,
}: ServiceMenuDialogProps) {
  // Fetch danh sách sản phẩm dịch vụ
  const { listProduct: serviceProducts, isLoading } = useGetListProducts(
    {
      isService: true,
      pageSizeCustom: 1000,
    },
    !open // Chỉ fetch khi dialog mở
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle className="!flex !justify-between !items-center !font-semibold !text-xl">
        <span>Dịch vụ gội đầu</span>
        <IconButton onClick={onClose} className="!p-1" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="!p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress size={40} />
          </div>
        ) : serviceProducts && serviceProducts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {serviceProducts.map((service: Product) => {
              const image = service.images?.[0]?.default || "/logo.png"
              const price = service.sale_price || service.base_price || 0
              const basePrice = service.base_price || 0
              const hasDiscount = basePrice > price

              return (
                <div
                  key={service.documentId}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-pink-300"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-48 lg:h-56 bg-gray-100">
                    <Image
                      src={image}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 lg:p-5">
                    <h3 className="font-semibold text-base lg:text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-pink-700 transition-colors">
                      {service.name}
                    </h3>
                    {service.short_description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service.short_description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg lg:text-xl font-bold text-pink-600">
                        {formatBigNumber(price, true)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatBigNumber(basePrice, true)}
                        </span>
                      )}
                    </div>

                    {/* Button */}
                    <Link href={`/product/${service.slug}`} onClick={onClose}>
                      <Button
                        variant="contained"
                        fullWidth
                        className="!bg-pink-600 !text-white !normal-case !font-semibold hover:!bg-pink-700 !transition-colors"
                        endIcon={<ArrowForwardRoundedIcon />}
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Hiện chưa có dịch vụ nào</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
