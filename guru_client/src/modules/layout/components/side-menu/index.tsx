"use client"

import { Popover } from "@headlessui/react"
import { Fragment, useState } from "react"
import { HttpTypes } from "@medusajs/types"

import { Drawer } from "@mui/material"
import useGetListCategory from "./_hooks/useGetListCategory"
import CategoryItem from "@modules/home/components/category/CategoryItem"
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded"

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const [isOpenSideBar, setIsOpenSideBar] = useState(false)
  const { listCategory, isLoading } = useGetListCategory()

  const [currentCategory, setCurrentCategory] = useState("")

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
        <header className="relative h-16 mx-auto border-b duration-200 bg-stone-100 flex justify-end px-4 w-full">
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

        <div className="flex flex-col space-y-6 p-6">
          <div className="flex flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
              <CategoryRoundedIcon className="sm:!h-5 !h-4" />
              <h6 className="my-auto sm:text-lg text-base font-semibold">
                Danh mục
              </h6>
            </div>
            <div className="flex-col space-y-2 content-end flex pl-2">
              {listCategory?.length && !isLoading
                ? listCategory.map((category) => {
                    return (
                      <CategoryItem
                        category={category}
                        key={category.documentId}
                        currentCategory={currentCategory}
                        setCurrentCategory={setCurrentCategory}
                        closeSideBar={closeSideBar}
                      />
                    )
                  })
                : ""}
            </div>
          </div>
          <div className="flex flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
              <LocalMallRoundedIcon className="sm:!h-5 !h-4" />
              <h6 className="my-auto sm:text-lg text-base font-semibold">
                Xem đơn hàng
              </h6>
            </div>
          </div>
          <div className="flex flex-col space-y-4 w-full min-w-[250px] cursor-pointer">
            <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
              <DateRangeRoundedIcon className="sm:!h-5 !h-4" />
              <h6 className="my-auto sm:text-lg text-base font-semibold">
                Đặt lịch online
              </h6>
            </div>
          </div>
        </div>
      </Drawer>
    </Fragment>
  )
}

export default SideMenu
