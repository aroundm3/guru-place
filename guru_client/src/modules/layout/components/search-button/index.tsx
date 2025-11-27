"use client"

import { IconButton } from "@medusajs/ui"
import SearchIcon from "@mui/icons-material/Search"
import { Dialog, Skeleton } from "@mui/material"
import { ChangeEvent, Fragment, useState } from "react"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import debounce from "lodash/debounce"
import useGetListProducts from "./_hooks/useGetListProducts"
import Image from "next/image"
import { formatBigNumber } from "@lib/util/format-big-number"
import Link from "next/link"
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded"
import { useRouter } from "next/navigation"

export default function SearchButton() {
  const router = useRouter()
  const [isShowSearchList, setIsShowSearchList] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const { listProduct, isLoading } = useGetListProducts({
    searchQuery: query,
    page: 1,
    pageSizeCustom: 6,
  })

  const debounceSearch = debounce((inputValue) => setQuery(inputValue), 500)

  const handleChangeValueInputSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsShowSearchList(true)
    debounceSearch(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      router.push(`/search_${query}`)
      setIsShowSearchList(false)
    }
    if (e.key === "Escape") {
      setIsShowSearchList(false)
    }
  }

  return (
    <Fragment>
      <div
        className="lg:flex hidden justify-center items-center cursor-pointer"
        onClick={() => setIsShowSearchList(true)}
      >
        <div className="relative">
          <div
            className={`flex items-center  rounded-full
                     transition-all duration-300 ease-in-out
                     ${
                       isExpanded ? "w-80 border border-stone-300" : "w-12"
                     } h-12`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full">
              <SearchIcon className="h-5 w-5 text-gray-600" />
            </div>
            <input
              type="text"
              defaultValue={query}
              className={`bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-500
                       transition-all duration-300 ease-in-out
                       ${
                         isExpanded
                           ? "w-full opacity-100 pr-4"
                           : "w-0 opacity-0"
                       }`}
              placeholder="Bạn đang tìm kiếm sản phẩm gì?"
            />
          </div>
        </div>
      </div>
      <SearchIcon
        className="cursor-pointer lg:!hidden !block"
        onClick={() => setIsShowSearchList(!isShowSearchList)}
      />
      <Dialog
        open={isShowSearchList}
        onClose={() => setIsShowSearchList(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            boxShadow: "none", // Removes shadow for a cleaner look
            height: "auto", // Fits content height
            margin: 0, // Removes default margin
            position: "absolute", // Allows precise positioning
            top: 0, // Aligns dialog to the top of the viewport
            left: "50%", // Centers horizontally (adjust if needed)
            transform: "translateX(-50%)",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "#03071280", // Removes default backdrop color
            backdropFilter: "blur(5px)", // Applies blur effect to backdrop
          },
        }}
      >
        <div className="lg:w-[400px] w-screen mx-auto p-4 flex space-x-2 items-center sticky top-0">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-4 w-4 text-white" />
            </div>
            <input
              type="text"
              defaultValue={query}
              autoFocus
              // value={query}
              onKeyDown={handleKeyDown}
              onChange={handleChangeValueInputSearch}
              className="w-full bg-gray-900/30 border border-gray-300/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white
                    placeholder:text-white focus:outline-none focus:ring-2 focus:ring-pink-300/50
                    hover:border-gray-400/50 transition-colors"
              placeholder="Bạn đang tìm kiếm sản phẩm gì?"
            />
          </div>
          <IconButton
            variant="transparent"
            className="rounded-full hover:text-stone-800 text-white duration-200"
            onClick={() => setIsShowSearchList(false)}
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mt-6 lg:px-0 px-4">
          {isLoading ? (
            <Fragment>
              <div className="flex lg:flex-col flex-row gap-2 bg-white rounded-lg p-2">
                <div
                  className={`!aspect-square !rounded-lg lg:!h-[172px] !h-[50px] animate-pulse bg-stone-200`}
                />
                <div>
                  <Skeleton className="h-[10px] lg:w-full w-40 rounded-lg" />
                  <Skeleton className="w-20 h-[10px] rounded-lg" />
                </div>
              </div>
              <div className="flex lg:flex-col flex-row gap-2 bg-white rounded-lg p-2">
                <div
                  className={`!aspect-square !rounded-lg lg:!h-[172px] !h-[50px] animate-pulse bg-stone-200`}
                />
                <div>
                  <Skeleton className="h-[10px] lg:w-full w-40 rounded-lg" />
                  <Skeleton className="w-20 h-[10px] rounded-lg" />
                </div>
              </div>
            </Fragment>
          ) : listProduct?.length ? (
            listProduct.map((product) => {
              return (
                <Link
                  href={`/product/${product.slug}`}
                  onClick={() => setIsShowSearchList(false)}
                  key={product.documentId}
                  className="flex lg:flex-col flex-row gap-2 bg-white rounded-lg p-3 cursor-pointer"
                >
                  <Image
                    src={product.images[0].default}
                    alt={product.name}
                    className={`!inline-block !aspect-square !rounded-lg !object-cover lg:w-[172px] lg:h-[172px] w-[50px] h-[50px]`}
                    width={0}
                    height={0}
                    loading="eager"
                    priority={true}
                    sizes="10vh"
                  />
                  <div>
                    <span className="text-stone-800 text-sm font-semibold lg:line-clamp-3 line-clamp-2 whitespace-pre-line truncate">
                      {product.name}
                    </span>
                    <div className="flex justify-between space-x-2 lg:mt-2">
                      <div className="flex flex-col my-auto">
                        <span className="text-sm font-bold text-pink-600">
                          {formatBigNumber(product.sale_price, true)}
                        </span>
                        {Number(product.base_price) >
                        Number(product.sale_price) ? (
                          <span className="line-through text-[10px] font-medium text-gray-400">
                            {formatBigNumber(product.base_price, true)}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <p className="text-white text-2xl font-bold mx-auto col-span-3 flex flex-col space-y-1">
              <span>Không tìm thấy kết quả nào!</span>
              <Link
                href={"/products"}
                className="text-base font-medium hover:text-blue-400 duration-200"
              >
                Click vào đây để khám phá toàn bộ sản phẩm{" "}
                <OpenInNewRoundedIcon className="!h-4" />
              </Link>
            </p>
          )}
        </div>

        {!isLoading && listProduct?.length ? (
          <Link
            href={`/search_${query}`}
            className="text-white text-md mt-4 font-bold mx-auto col-span-3 flex flex-col space-y-1"
            onClick={() => setIsShowSearchList(false)}
          >
            Xem thêm
          </Link>
        ) : (
          ""
        )}
      </Dialog>
    </Fragment>
  )
}
