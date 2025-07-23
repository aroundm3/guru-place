"use client"

import { Popover } from "@headlessui/react"
import { Fragment, useState } from "react"
import { HttpTypes } from "@medusajs/types"

import { Collapse, Drawer } from "@mui/material"
import useGetListCategory from "./_hooks/useGetListCategory"
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import BrandingWatermarkRoundedIcon from "@mui/icons-material/BrandingWatermarkRounded"
import Link from "next/link"
import useGetListBrand from "./_hooks/useGetListBrands"
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded"
import useGetProductCollection from "./_hooks/useGetProductCollection"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const [isOpenSideBar, setIsOpenSideBar] = useState(false)
  const { listCategory, isLoading } = useGetListCategory()
  const { listbrand } = useGetListBrand()
  const { productCollection } = useGetProductCollection()

  const [isExpandCate, setIsExpandCate] = useState(false)
  const [isExpandBand, setIsExpandBrand] = useState(false)
  const [isProductCollection, setIsProductCollection] = useState(false)

  const closeSideBar = () => {
    setIsOpenSideBar(false)
  }

  return (
    <Fragment>
      <div className="h-full">
        <div className="flex items-center h-full">
          <Popover className="h-full flex">
            <div className="relative flex h-full">
              <div
                onClick={() => setIsOpenSideBar(!isOpenSideBar)}
                className="cursor-pointer relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base text-lg font-semibold uppercase"
              >
                {/* Custom Hamburger to X Icon */}
                <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                  <span
                    className={`bg-current h-0.5 w-5 transition-all duration-300 ease-in-out ${
                      isOpenSideBar
                        ? "rotate-45 translate-y-2"
                        : "rotate-0 translate-y-0"
                    }`}
                  ></span>
                  <span
                    className={`bg-current h-0.5 w-5 transition-all duration-300 ease-in-out ${
                      isOpenSideBar ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`bg-current h-0.5 w-5 transition-all duration-300 ease-in-out ${
                      isOpenSideBar
                        ? "-rotate-45 -translate-y-2"
                        : "rotate-0 translate-y-0"
                    }`}
                  ></span>
                </div>
              </div>
            </div>
          </Popover>
        </div>
      </div>
      <Drawer
        anchor="left"
        open={isOpenSideBar}
        onClose={() => setIsOpenSideBar(false)}
      >
        <header className="sticky top-0 py-5 mx-auto border-b duration-200 bg-stone-100 flex justify-end px-4 w-full z-10">
          <div className="h-full">
            <div className="flex items-center h-full">
              <Popover className="h-full flex">
                <div className="relative flex h-full">
                  <div
                    onClick={() => setIsOpenSideBar(!isOpenSideBar)}
                    className="cursor-pointer relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base text-lg font-semibold uppercase"
                  >
                    {/* Custom Hamburger to X Icon */}
                    <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                      <span
                        className={`bg-current h-0.5 w-5 transition-all duration-300 ease-in-out ${
                          isOpenSideBar
                            ? "rotate-45 translate-y-2"
                            : "rotate-0 translate-y-0"
                        }`}
                      ></span>
                      <span
                        className={`bg-current h-0.5 w-5 transition-all duration-300 ease-in-out ${
                          isOpenSideBar ? "opacity-0" : "opacity-100"
                        }`}
                      ></span>
                      <span
                        className={`bg-current h-0.5 w-5 transition-all duration-300 ease-in-out ${
                          isOpenSideBar
                            ? "-rotate-45 -translate-y-2"
                            : "rotate-0 translate-y-0"
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        </header>

        <div className="flex flex-col p-6">
          <div className="flex flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div
              className="mr-4 flex justify-between text-gray-700 items-center"
              onClick={() => setIsExpandCate((prevValue) => !prevValue)}
            >
              <div className="flex sm:space-x-1 space-x-0.5">
                <CategoryRoundedIcon className="sm:!h-5 !h-4 my-auto" />
                <h6 className="my-auto sm:text-lg text-base font-semibold">
                  Danh mục sản phẩm
                </h6>
              </div>
              <KeyboardArrowDownRoundedIcon
                className={`${isExpandCate ? "rotate-180" : ""} duration-300`}
              />
            </div>
            <Collapse in={isExpandCate}>
              <div className="flex-col space-y-3 content-end flex pl-3 pb-4">
                {listCategory?.length && !isLoading
                  ? listCategory.map((category) => {
                      return (
                        <Link
                          href={`/category_${category.slug}`}
                          key={category.documentId}
                          className="flex text-gray-500 hover:text-gray-700 duration-300 cursor-pointer"
                        >
                          <div className="flex space-x-2">
                            <span className="sm:text-sm text-xs font-semibold">
                              {category.name}
                            </span>
                          </div>
                        </Link>
                      )
                    })
                  : ""}
              </div>
            </Collapse>
          </div>
          <div className="flex flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div
              className="mr-4 flex justify-between text-gray-700 items-center"
              onClick={() => setIsExpandBrand((prevValue) => !prevValue)}
            >
              <div className="flex sm:space-x-1 space-x-0.5">
                <BrandingWatermarkRoundedIcon className="sm:!h-5 !h-4 my-auto" />
                <h6 className="my-auto sm:text-lg text-base font-semibold">
                  Thương hiệu
                </h6>
              </div>
              <KeyboardArrowDownRoundedIcon
                className={`${isExpandBand ? "rotate-180" : ""} duration-300`}
              />
            </div>
            <Collapse in={isExpandBand}>
              <div className="flex-col space-y-3 content-end flex pl-3 pb-4">
                {listbrand?.length && !isLoading
                  ? listbrand.map((brand) => {
                      return (
                        <Link
                          href={`/brand_${brand.slug}`}
                          key={brand.documentId}
                          className="flex text-gray-500 hover:text-gray-700 duration-300 cursor-pointer"
                        >
                          <div className="flex space-x-2">
                            <span className="sm:text-sm text-xs font-semibold">
                              {brand.name}
                            </span>
                          </div>
                        </Link>
                      )
                    })
                  : ""}
              </div>
            </Collapse>
          </div>
          <div className="flex flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div
              className="mr-4 flex justify-between text-gray-700 items-center"
              onClick={() => setIsProductCollection((prevValue) => !prevValue)}
            >
              <div className="flex sm:space-x-1 space-x-0.5">
                <AccountTreeRoundedIcon className="sm:!h-5 !h-4 my-auto" />
                <h6 className="my-auto sm:text-lg text-base font-semibold">
                  Bộ sản phẩm
                </h6>
              </div>
              <KeyboardArrowDownRoundedIcon
                className={`${
                  isProductCollection ? "rotate-180" : ""
                } duration-300`}
              />
            </div>
            <Collapse in={isProductCollection}>
              <div className="flex-col space-y-3 content-end flex pl-3 pb-4">
                {productCollection?.length && !isLoading
                  ? productCollection.map((collection) => {
                      return (
                        <Link
                          href={`/collection_${collection.documentId}`}
                          key={collection.documentId}
                          className="flex text-gray-500 hover:text-gray-700 duration-300 cursor-pointer"
                        >
                          <div className="flex space-x-2">
                            <span className="sm:text-sm text-xs font-semibold">
                              {collection.title}
                            </span>
                          </div>
                        </Link>
                      )
                    })
                  : ""}
              </div>
            </Collapse>
          </div>
          <div className="flex flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
              <LocalMallRoundedIcon className="sm:!h-5 !h-4" />
              <h6 className="my-auto sm:text-lg text-base font-semibold">
                Giỏ hàng
              </h6>
            </div>
          </div>
          <div className="flex mt-4 flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
              <DateRangeRoundedIcon className="sm:!h-5 !h-4" />
              <h6 className="my-auto sm:text-lg text-base font-semibold">
                Dịch vụ gội đầu Divi
              </h6>
            </div>
          </div>
          <div className="flex mt-4 flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
              <CardGiftcardRoundedIcon className="sm:!h-5 !h-4" />
              <h6 className="my-auto sm:text-lg text-base font-semibold">
                Tra cứu tích điểm
              </h6>
            </div>
          </div>
          <div className="flex mt-4 flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
              <DateRangeRoundedIcon className="sm:!h-5 !h-4" />
              <h6 className="my-auto sm:text-lg text-base font-semibold">
                Liên hệ hỗ trợ
              </h6>
            </div>
          </div>
        </div>
      </Drawer>
    </Fragment>
  )
}

export default SideMenu
