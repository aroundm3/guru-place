import { getListProductsBlock } from "@lib/data/product"
import Product from "./Product"

export default async function BlockProduct() {
  const listProducBlock = await getListProductsBlock()

  return (
    <div className="lg:max-w-5xl mt-10 max-w-4xl lg:px-0 px-4 mx-auto flex flex-col sm:gap-10 gap-8">
      {listProducBlock.map((block) => {
        return (
          <div key={block.documentId} className="flex flex-col space-y-4">
            <span className="font-semibold text-gray-700 sm:text-xl text-lg">
              {block.title}
            </span>
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6">
              {block.products.map((product) => {
                return <Product data={product} key={product.documentId} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
