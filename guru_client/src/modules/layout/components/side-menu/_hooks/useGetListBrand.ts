import { getListBrand } from "@lib/data/brand"
import useSWR from "swr"
import { Brand } from "types/global"

const useGetListBrand = (filter?: {
  searchQuery?: string
  isHightlight?: boolean
  categoryId?: string
}) => {
  const { data, isLoading, mutate } = useSWR<Brand[]>(
    ["GET_LIST_BRAND", filter],
    async () => {
      return await getListBrand(filter || {})
    },
    { revalidateIfStale: false, revalidateOnFocus: false }
  )

  return {
    brands: data || [],
    isLoading,
    mutate,
  }
}

export default useGetListBrand
