"use server"

import { fetcher, getFullLinkResource } from "@lib/config"
import { PAGINATION_CONFIG } from "@lib/constants/pagination"
import { Product, ProductListBlock } from "types/global"

export const getProductBySlug = async (slug: string) => {
  try {
    const data = await fetcher(
      `/api/products?filters[slug][$eq]=product-2&populate[brand]=true&populate[category]=true&populate[media]=true&populate[variants][populate][variant_image]=true`,
      {
        next: { revalidate: 10 },
      }
    )

    const productRs = data.data[0]

    if (productRs) {
      return {
        ...productRs,
        images: productRs.media.map((itemImage: any) => {
          return {
            small: getFullLinkResource(itemImage.formats.small.url),
            thumbnail: getFullLinkResource(itemImage.formats.thumbnail.url),
            default: getFullLinkResource(itemImage.url),
          }
        }),

        priceBaseRange: productRs.variants.reduce(
          ([min, max]: [number, number], v: { base_price: number }) => [
            Math.min(min, Number(v.base_price)),
            Math.max(max, Number(v.base_price)),
          ],
          [Infinity, -Infinity]
        ),
        priceSaleRange: productRs.variants.reduce(
          ([min, max]: [number, number], v: { sale_price: number }) => [
            Math.min(min, Number(v.sale_price)),
            Math.max(max, Number(v.sale_price)),
          ],
          [Infinity, -Infinity]
        ),
        totalQuantity: productRs.variants.reduce(
          (total: number, v: { quantity: number }) =>
            total + Number(v.quantity),
          0
        ),
      }
    }
  } catch (ex) {
    return
  }
}

export async function getListProducts(filter: {
  searchQuery?: string
  page?: number
  brandId?: string
  categoryId?: string
  blockProductId?: string
}): Promise<{ data: Product[]; pageCount: number }> {
  try {
    const data = await fetcher(
      `/api/products?pagination[page]=${
        filter.page ?? 1
      }&pagination[pageSize]=${PAGINATION_CONFIG.pageSize}&populate=media&${
        filter.searchQuery
          ? `filters[$or][0][name][$containsi]=${filter.searchQuery}&filters[$or][1][brand][name][$containsi]=${filter.searchQuery}&filters[$or][2][category][name][$containsi]=${filter.searchQuery}`
          : ""
      }${
        filter.categoryId
          ? `&filters[category][documentId]=${filter.categoryId}`
          : ""
      }${
        filter.brandId ? `&filters[brand][documentId]=${filter.brandId}` : ""
      }${
        filter.blockProductId
          ? `&filters[product_list_block][documentId]=${filter.blockProductId}`
          : ""
      }&[populate]=variants`,
      {
        next: { revalidate: 10 },
      }
    )

    return {
      data: data.data.map((item: any) => {
        return {
          ...item,

          images: item.media.map((itemImage: any) => {
            return {
              small: getFullLinkResource(itemImage.formats.small.url),
              thumbnail: getFullLinkResource(itemImage.formats.thumbnail.url),
              default: getFullLinkResource(itemImage.url),
            }
          }),

          priceBaseRange: item.variants.reduce(
            ([min, max]: [number, number], v: { base_price: number }) => [
              Math.min(min, Number(v.base_price)),
              Math.max(max, Number(v.base_price)),
            ],
            [Infinity, -Infinity]
          ),
          priceSaleRange: item.variants.reduce(
            ([min, max]: [number, number], v: { sale_price: number }) => [
              Math.min(min, Number(v.sale_price)),
              Math.max(max, Number(v.sale_price)),
            ],
            [Infinity, -Infinity]
          ),
          totalQuantity: item.variants.reduce(
            (total: number, v: { quantity: number }) =>
              total + Number(v.quantity),
            0
          ),
        }
      }),
      pageCount: data.meta.pagination.pageCount,
    }
  } catch (ex) {
    return {
      data: [],
      pageCount: 1,
    }
  }
}

//support data for landing page
export async function getListProductsBlock(
  id?: string
): Promise<ProductListBlock[]> {
  try {
    const data = await fetcher(
      `/api/product-list-blocks?populate[products][populate]=media&pagination[pageSize]=100&populate[products][populate]=variants`,
      {
        next: { revalidate: 10 },
      }
    )

    console.log({ data })

    return data.data.map((item: any) => {
      return {
        ...item,
        products: item.products.map((productItem: any) => {
          return {
            ...productItem,
            images: productItem.media.map((itemImage: any) => {
              return {
                small: getFullLinkResource(itemImage.formats.small.url),
                thumbnail: getFullLinkResource(itemImage.formats.thumbnail.url),
                default: getFullLinkResource(itemImage.url),
              }
            }),
            priceBaseRange: productItem.variants.reduce(
              ([min, max]: [number, number], v: { base_price: number }) => [
                Math.min(min, Number(v.base_price)),
                Math.max(max, Number(v.base_price)),
              ],
              [Infinity, -Infinity]
            ),
            priceSaleRange: productItem.variants.reduce(
              ([min, max]: [number, number], v: { sale_price: number }) => [
                Math.min(min, Number(v.sale_price)),
                Math.max(max, Number(v.sale_price)),
              ],
              [Infinity, -Infinity]
            ),
            totalQuantity: productItem.variants.reduce(
              (total: number, v: { quantity: number }) =>
                total + Number(v.quantity),
              0
            ),
          }
        }),
      }
    })
  } catch (ex) {
    return []
  }
}
