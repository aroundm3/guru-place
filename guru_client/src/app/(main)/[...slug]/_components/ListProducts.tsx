"use client"

import ProductCart from "@modules/home/components/product/Product"
import { Product } from "types/global"

interface ListProductsProps {
  products: Product[]
}

export default function ListProducts({ products }: ListProductsProps) {
  return products.length ? (
    <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-6 gap-4 h-fit">
      {products.map((product) => {
        return <ProductCart key={product.documentId} data={product} />
      })}
    </div>
  ) : (
    <p className="text-2xl font-bold text-stone-300 mx-auto my-auto">
      Không tìm thấy sản phẩm nào
    </p>
  )
}
