import { getListProducts, getListProductsBlock } from "@lib/data/product"
import Product from "./Product"
import Link from "next/link"
import ProductBlockClient from "./ProductBlockClient"

export default async function BlockProduct() {
  const listProducBlock = await getListProductsBlock()
  const productsRs = await getListProducts({
    page: 1,
  })

  return (
    <div className="lg:max-w-5xl lg:mt-10 mt-6 max-w-4xl lg:px-0 px-4 mx-auto flex flex-col lg:gap-10 gap-6">
      {listProducBlock.map((block) => {
        return block.products.length ? (
          <ProductBlockClient key={block.documentId} block={block} />
        ) : (
          ""
        )
      })}

      {productsRs.data && productsRs.data.length ? (
        <div className="flex flex-col space-y-4">
          <Link
            href={`/products`}
            className="font-semibold text-gray-700 lg:text-xl text-lg"
          >
            Tất cả sản phẩm
          </Link>
          <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6">
            {productsRs.data.map((product) => {
              return <Product data={product} key={product.documentId} />
            })}
          </div>
          {productsRs.pageCount > 1 ? (
            <div className="w-full flex justify-center">
              <Link href={`/products`}>
                <span className="text-sm font-semibold cursor-pointer hover:text-pink-600 duration-300">
                  Xem thêm
                </span>
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
