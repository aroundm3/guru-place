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
    hasCustomerCards?: boolean
    isService?: boolean
  },
  isNotFetch?: boolean
) => {
  console.log("dbahbdjhabjsda filter:", { filter })

  const {
    searchQuery,
    page,
    brandId,
    categoryId,
    blockProductId,
    hasCustomerCards,
    isService,
  } = filter
  const { data, isLoading, mutate } = useSWR<Product[]>(
    isNotFetch
      ? null
      : [
          searchQuery,
          page,
          brandId,
          categoryId,
          blockProductId,
          hasCustomerCards,
          isService,
        ],
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
