import { getListProductsBlock } from "@lib/data/product"
import useSWR from "swr"
import { ProductListBlock } from "types/global"

const useGetProductCollection = () => {
  const { data, isLoading } = useSWR<ProductListBlock[]>(
    ["GET_PRODUCT_LIST"],
    async () => {
      return await getListProductsBlock()
    },
    { revalidateIfStale: false, revalidateOnFocus: false }
  )

  return {
    productCollection: data,
    isLoading,
  }
}

export default useGetProductCollection
