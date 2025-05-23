import { formatBigNumber } from "@lib/util/format-big-number"
import Image from "next/image"
import { Product as ProductData } from "types/global"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"

interface ProductProps {
  data: ProductData
}

export default function Product({ data }: ProductProps) {
  console.log({ data })

  return (
    <div className="bg-stone-50 rounded-md border border-gray-100 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-lg duration-300 w-full">
      <div className="flex flex-col space-y-2">
        <Image
          src={data.images[0].thumbnail}
          alt={data.name}
          className={`!inline-block !aspect-square !w-full !rounded-t-lg !object-cover`}
          width={172}
          height={172}
          loading="eager"
          priority={true}
        />
        <div className="p-2 flex flex-col">
          <span className="sm:text-base text-sm font-semibold text-gray-600 line-clamp-2 whitespace-pre-wrap truncate">
            {data.name}
          </span>
          <span className="text-xs font-normal text-gray-400 line-clamp-2 whitespace-pre-wrap truncate">
            {data.short_description}
          </span>
        </div>
      </div>
      <div className="flex justify-between space-x-2 px-2 pb-2">
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
        <ShoppingCartOutlinedIcon className="my-auto text-gray-600" />
      </div>
    </div>
  )
}
