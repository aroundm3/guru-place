import { Collapse, Drawer } from "@mui/material"
import Link from "next/link"
import { Brand, Category, ProductListBlock } from "types/global"
import { Popover } from "@headlessui/react"
import Image from "next/image"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"

interface FilterMobileProps {
  isOpenSideBar: boolean
  onClose: () => void
  categories: Category[]
  brands: Brand[]
  listProducBlock: ProductListBlock[]
  isLoadingListBrandByCategory: boolean
  listBrandToDisplay: Brand[]
  currentCategory?: Category
  currentBrand?: Brand
  currentBlockProduct?: ProductListBlock
}

export default function FilterMobile({
  isOpenSideBar,
  onClose,
  categories,
  listProducBlock,
  listBrandToDisplay,
  currentCategory,
  currentBrand,
  brands,
  currentBlockProduct,
}: FilterMobileProps) {
  return (
    <Drawer anchor="right" open={isOpenSideBar} onClose={onClose}>
      <header className="relative h-16 mx-auto border-b duration-200 bg-stone-100 flex justify-start px-4 w-full">
        <div className="h-full">
          <div className="flex items-center h-full">
            <Popover className="h-full flex">
              <div className="relative flex h-full">
                <div
                  onClick={onClose}
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

      <div className="flex flex-col p-6 min-w-[250px]">
        <div className="flex flex-col space-y-2 mt-8">
          <p className="flex space-x-2 text-xs font-sm uppercase font-semibold text-gray-400 cursor-pointer">
            Thương hiệu
          </p>
          <div className="ml-1 flex flex-col space-y-2">
            {brands.map((brand) => {
              return (
                <div
                  key={brand.documentId}
                  className="flex flex-col space-y-2 text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                >
                  <div className="flex space-x-2 items-center">
                    <Link
                      href={`/brand_${brand.slug}`}
                      className={`text-sm flex space-x-1 items-center ${
                        currentBrand?.documentId === brand.documentId &&
                        !currentCategory
                          ? "font-semibold text-pink-700"
                          : "font-normal pl-5"
                      }`}
                    >
                      {currentBrand?.documentId === brand.documentId &&
                      !currentCategory ? (
                        <PlayArrowRoundedIcon className="!w-4" />
                      ) : (
                        ""
                      )}
                      <span className="uppercase">{brand.name}</span>
                      {/* <Image
                        src={brand.logo}
                        alt={brand.name}
                        height={0}
                        width={0}
                        className="h-3.5 w-3.5 object-cover my-auto rounded-full"
                        loading="eager"
                        sizes="80vw"
                      /> */}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <p className="flex space-x-2 text-xs font-sm uppercase font-semibold text-gray-400 cursor-pointer">
            Danh mục
          </p>
          <div className="ml-1 flex flex-col space-y-2">
            {categories.map((category) => {
              return (
                <div
                  key={category.documentId}
                  className="flex flex-col text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <Link
                      href={`/category_${category.slug}`}
                      className={`text-sm ${
                        currentCategory?.documentId === category.documentId
                          ? "font-semibold text-pink-700"
                          : "font-normal pl-4"
                      }`}
                    >
                      {currentCategory?.documentId === category.documentId ? (
                        <PlayArrowRoundedIcon className="!w-4" />
                      ) : (
                        ""
                      )}
                      <span>{category.name}</span>
                    </Link>
                    {/* brand of category */}
                    <Collapse
                      in={currentCategory?.documentId === category.documentId}
                    >
                      <div className="ml-1 mt-2 flex flex-col space-y-2">
                        {listBrandToDisplay.map((brand) => {
                          return (
                            <div
                              key={brand.documentId}
                              className="flex flex-col space-y-1.5 text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                            >
                              <div className="flex space-x-2 items-center">
                                <Link
                                  href={
                                    currentCategory
                                      ? `/brand&category_${currentCategory.slug}_${brand.slug}`
                                      : `/brand_${brand.slug}`
                                  }
                                  className={`text-xs flex space-x-1 items-center pl-5 duration-300 ${
                                    currentBrand?.documentId ===
                                    brand.documentId
                                      ? "font-semibold text-pink-700"
                                      : "font-normal duration-300 hover:text-stone-500 "
                                  }`}
                                >
                                  <span className="uppercase">
                                    {brand.name}
                                  </span>
                                  <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    height={0}
                                    width={0}
                                    className="h-3.5 w-3.5 object-cover my-auto rounded-full"
                                    loading="eager"
                                    sizes="80vw"
                                  />
                                </Link>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Collapse>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <p className="flex space-x-2 text-xs font-sm uppercase font-semibold text-gray-400 cursor-pointer">
            Bộ sản phẩm
          </p>
          <div className="ml-1 flex flex-col space-y-2">
            {listProducBlock.map((block) => {
              return (
                <div
                  key={block.documentId}
                  className="flex flex-col space-y-2 text-gray-600 hover:text-gray-700 duration-300 cursor-pointer"
                >
                  <div className="flex space-x-2 items-center">
                    <Link
                      href={`/collection_${block.documentId}`}
                      className={`text-sm ${
                        currentBlockProduct?.documentId === block.documentId
                          ? "font-semibold text-pink-700"
                          : "font-normal pl-4"
                      }`}
                    >
                      {currentBlockProduct?.documentId === block.documentId ? (
                        <PlayArrowRoundedIcon className="!w-4" />
                      ) : (
                        ""
                      )}
                      <span>{block.title}</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Drawer>
  )
}
