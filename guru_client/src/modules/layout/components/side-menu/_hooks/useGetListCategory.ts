import { getListCategories } from "@lib/data/category"
import useSWR from "swr"
import { Category, Product } from "types/global"

const useGetListCategory = () => {
  const { data, isLoading, mutate } = useSWR<Category[]>(
    ["GET_LIST_CATEGORY"],
    async () => {
      return await getListCategories({})
    },
    { revalidateIfStale: false, revalidateOnFocus: false }
  )

  return {
    listCategory: data,
    isLoading,
  }
}

export default useGetListCategory
