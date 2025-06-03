import { getListBrand } from "@lib/data/brand"
import useSWR from "swr"
import { Brand } from "types/global"

const useGetListBrandByCategory = (categoryId: string) => {
  const { data, isLoading, mutate } = useSWR<Brand[]>(
    categoryId ? [categoryId] : null,
    async (url) => {
      return await getListBrand({ categoryId })
    },
    { revalidateIfStale: false, revalidateOnFocus: false }
  )

  return {
    listBrandByCategory: data,
    isLoadingListBrandByCategory: isLoading,
  }
}

export default useGetListBrandByCategory
