import { getListProducts } from "@lib/data/product"
import useSWR from "swr"
import { Product } from "types/global"

const useGetListProducts = (filter: {
  searchQuery?: string
  page?: number
  brandId?: string
  categoryId?: string
}) => {
  const { searchQuery, page, brandId, categoryId } = filter
  const { data, isLoading, mutate } = useSWR<Product[]>(
    [searchQuery, page, brandId, categoryId],
    async (url) => {
      return await getListProducts(filter)
    },
    { revalidateIfStale: false, revalidateOnFocus: false }
  )

  return {
    listProduct: data,
    isLoading,
  }
}

export default useGetListProducts
