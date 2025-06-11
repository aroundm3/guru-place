import { getListProducts, getListProductsBlock } from "@lib/data/product"
import Product from "./Product"
import Link from "next/link"

export default async function BlockProduct() {
  const listProducBlock = await getListProductsBlock()
  const productsRs = await getListProducts({
    page: 1,
  })

  return (
    <div className="lg:max-w-5xl mt-10 max-w-4xl lg:px-0 px-4 mx-auto flex flex-col sm:gap-10 gap-8">
      {listProducBlock.map((block) => {
        return block.products.length ? (
          <div key={block.documentId} className="flex flex-col space-y-4">
            <Link
              href={`/collection_${block.documentId}`}
              className="font-semibold text-gray-700 sm:text-xl text-lg"
            >
              {block.title}
            </Link>
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6">
              {block.products.slice(0, 6).map((product) => {
                return <Product data={product} key={product.documentId} />
              })}
              {block.products.length > 6 ? (
                <Link href={`/collection_${block.documentId}`}>
                  <div className="bg-white border border-stone-300 h-full rounded-lg flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-lg duration-300 w-full">
                    <span className="text-blue-600 text-sm font-semibold mx-auto my-auto underline">
                      Xem thêm
                    </span>
                  </div>
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )
      })}

      {productsRs.data && productsRs.data.length ? (
        <div className="flex flex-col space-y-4">
          <Link
            href={`/products`}
            className="font-semibold text-gray-700 sm:text-xl text-lg"
          >
            Tất cả sản phẩm
          </Link>
          <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6">
            {productsRs.data.map((product) => {
              return <Product data={product} key={product.documentId} />
            })}
            {productsRs.pageCount > 1 ? (
              <Link href={`/products`}>
                <div className="bg-white border border-stone-300 h-full rounded-lg flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-lg duration-300 w-full">
                  <span className="text-blue-600 text-sm font-semibold mx-auto my-auto underline">
                    Xem thêm
                  </span>
                </div>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
