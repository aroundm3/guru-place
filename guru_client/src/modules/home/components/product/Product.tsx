import { formatBigNumber } from "@lib/util/format-big-number"
import Image from "next/image"
import { Product as ProductData } from "types/global"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

interface ProductProps {
  data: ProductData
}

export default function Product({ data }: ProductProps) {
  return (
    <div className="bg-white border border-stone-300 rounded-lg flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-lg duration-300 w-full">
      <div className="flex flex-col">
        <Image
          src={data.images[0].default}
          alt={data.name}
          className={`!inline-block !aspect-square !w-full !rounded-t-lg !object-cover`}
          width={172}
          height={172}
          loading="eager"
          priority={true}
        />
        <div className="p-4 flex flex-col">
          <span className="sm:text-base text-sm font-semibold text-gray-600 line-clamp-2 whitespace-pre-wrap truncate">
            {data.name}
          </span>
          <span className="text-xs font-normal text-gray-400 line-clamp-2 whitespace-pre-wrap truncate">
            {data.short_description}
          </span>
        </div>
      </div>
      <div className="flex justify-between space-x-2 px-4 pb-4">
        <div className="flex flex-col my-auto">
          <span className="text-base font-bold text-pink-600">
            {formatBigNumber(data.priceSaleRange[0], true)}
          </span>
          {data.priceBaseRange[0] > data.priceSaleRange[0] ? (
            <span className="line-through text-xs font-medium text-gray-400">
              {formatBigNumber(data.priceBaseRange[0], true)}
            </span>
          ) : (
            ""
          )}
        </div>
        <ShoppingCartIcon className="my-auto text-stone-800" />
      </div>
    </div>
  )
}
