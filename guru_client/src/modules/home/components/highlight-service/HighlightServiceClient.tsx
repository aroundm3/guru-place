"use client"

import { useState } from "react"
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded"
import ServiceMenuDialog from "./ServiceMenuDialog"

interface HighlightServiceClientProps {
  serviceMenuHtml?: string
}

export default function HighlightServiceClient({
  serviceMenuHtml,
}: HighlightServiceClientProps) {
  console.log({ serviceMenuHtml })

  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <div
        className="flex flex-col space-y-2 items-center hover:scale-105 duration-300 cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <div className="flex rounded-full bg-rose-50 sm:w-14 w-12 aspect-square hover:bg-white cursor-pointer duration-300 text-rose-700">
          <WeekendRoundedIcon className="mx-auto my-auto" />
        </div>
        <span className="sm:text-sm text-xs font-semibold text-center mx-auto">
          Dịch vụ gội đầu
        </span>
      </div>
      <ServiceMenuDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        serviceMenuHtml={serviceMenuHtml}
      />
    </>
  )
}
