"use client"

import { useState } from "react"
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded"
import ShippingExpressDialog from "./ShippingExpressDialog"

interface ShippingExpressClientProps {
  shippingExpressHtml?: string
}

export default function ShippingExpressClient({
  shippingExpressHtml,
}: ShippingExpressClientProps) {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <LocalShippingRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Giao Hoả Tốc
        </span>
      </div>
      <ShippingExpressDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        shippingExpressHtml={shippingExpressHtml}
      />
    </>
  )
}

