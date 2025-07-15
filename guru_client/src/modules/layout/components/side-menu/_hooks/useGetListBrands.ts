import { getListBrand } from "@lib/data/brand"
import useSWR from "swr"
import { Brand } from "types/global"

const useGetListBrand = () => {
  const { data, isLoading } = useSWR<Brand[]>(
    ["GET_LIST_BRAND"],
    async () => {
      return await getListBrand({})
    },
    { revalidateIfStale: false, revalidateOnFocus: false }
  )

  return {
    listbrand: data,
    isLoading,
  }
}

export default useGetListBrand
