import { formatBigNumber } from "@lib/util/format-big-number"
import Image from "next/image"
import { Product as ProductData } from "types/global"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import Link from "next/link"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"

interface ProductProps {
  data: ProductData
}

export default function Product({ data }: ProductProps) {
  return (
    <Link
      href={`/product/${data.slug}`}
      className="bg-white border border-stone-300 rounded-lg flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-lg duration-300 w-full h-full"
    >
      <div className="flex flex-col h-full">
        <div className="relative">
          <Image
            src={data.images[0].default}
            alt={data.name}
            className={`!inline-block !aspect-square !w-full !rounded-t-lg !object-cover`}
            width={172}
            height={172}
            loading="eager"
            priority={true}
          />
          {data.isTopSelling && (
            <div className="px-1 bg-orange-100 rounded absolute top-1 right-1 opacity-80">
              <span className="text-orange-700 text-xs font-semibold">
                Bán chạy
              </span>
            </div>
          )}
          {data.isFreeShip && (
            <div className="p-1 bg-teal-50 absolute bottom-0 left-0 w-full flex space-x-1 items-center">
              <LocalShippingIcon className="text-teal-700 !h-4" />
              <span className="text-teal-700 text-xs font-semibold">
                Free ship
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="sm:text-base text-sm font-semibold text-gray-600 line-clamp-2 whitespace-pre-wrap truncate">
            {data.name}
          </span>
          <span className="text-xs font-normal text-gray-400 line-clamp-2 whitespace-pre-wrap truncate">
            {data.short_description}
          </span>
        </div>
      </div>
      <div className="flex justify-between space-x-2 px-4 pb-4 h-14">
        <div className="flex flex-col my-auto">
          <span className="text-base font-bold text-pink-600">
            {formatBigNumber(data.sale_price, true)}
          </span>
          {Number(data.base_price) > Number(data.sale_price) ? (
            <span className="line-through text-xs font-medium text-gray-400">
              {formatBigNumber(data.base_price, true)}
            </span>
          ) : (
            ""
          )}
        </div>
        <ShoppingCartIcon className="my-auto text-stone-600 !h-5" />
      </div>
    </Link>
  )
}
