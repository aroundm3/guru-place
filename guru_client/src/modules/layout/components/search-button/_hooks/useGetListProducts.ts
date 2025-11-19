import { getListProducts } from "@lib/data/product"
import useSWR from "swr"
import { Product } from "types/global"

const useGetListProducts = (
  filter: {
    searchQuery?: string
    page?: number
    brandId?: string
    categoryId?: string
    blockProductId?: string
    pageSizeCustom?: number
  },
  isNotFetch?: boolean
) => {
  console.log("dbahbdjhabjsda filter:", { filter })

  const { searchQuery, page, brandId, categoryId, blockProductId } = filter
  const { data, isLoading, mutate } = useSWR<Product[]>(
    isNotFetch
      ? null
      : [searchQuery, page, brandId, categoryId, blockProductId],
    async (url) => {
      return await getListProducts(filter).then(({ data }) => data)
    },
    { revalidateIfStale: false, revalidateOnFocus: false }
  )

  return {
    listProduct: data,
    isLoading,
  }
}

export default useGetListProducts
