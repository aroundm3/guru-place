"use server"

import { fetcher, getFullLinkResource } from "@lib/config"
import { PAGINATION_CONFIG } from "@lib/constants/pagination"
import { Product, ProductListBlock } from "types/global"

export const getProductBySlug = async (slug: string) => {
  try {
    const data = await fetcher(
      `/api/products?filters[slug][$eq]=${slug}&populate[brand]=true&populate[category]=true&populate[media]=true&populate[variants][populate][variant_image]=true&populate[variants][populate][customer_cards]=true`,
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
            small: getFullLinkResource(
              itemImage.formats?.small?.url ?? itemImage.url
            ),
            thumbnail: getFullLinkResource(
              itemImage.formats?.thumbnail?.url ?? itemImage.url
            ),
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
        // totalQuantity: productRs.variants.reduce(
        //   (total: number, v: { quantity: number }) =>
        //     total + Number(v.quantity),
        //   0
        // ),
        variants: productRs.variants.map((variant: any) => ({
          ...variant,
          variant_image: {
            small: getFullLinkResource(
              variant.variant_image?.formats?.small?.url ??
                variant.variant_image?.url
            ),
            thumbnail: getFullLinkResource(
              variant.variant_image?.formats?.thumbnail?.url ??
                variant.variant_image?.url
            ),
            default: getFullLinkResource(variant.variant_image?.url),
          },
        })),
        customerCartId: productRs.customer_card?.data?.id || null,
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
  pageSizeCustom?: number
}): Promise<{ data: Product[]; pageCount: number }> {
  try {
    console.log(
      "urlrequest: ",
      `/api/products?pagination[page]=${
        filter.page ?? 1
      }&pagination[pageSize]=${
        filter.pageSizeCustom
          ? filter.pageSizeCustom
          : PAGINATION_CONFIG.pageSize
      }&populate=media&${
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
          ? `&filters[product_list_blocks][documentId]=${filter.blockProductId}`
          : ""
      }&[populate]=variants`
    )

    const data = await fetcher(
      `/api/products?pagination[page]=${
        filter.page ?? 1
      }&pagination[pageSize]=${
        filter.pageSizeCustom
          ? filter.pageSizeCustom
          : PAGINATION_CONFIG.pageSize
      }&populate=media&${
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
          ? `&filters[product_list_blocks][documentId]=${filter.blockProductId}`
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
              small: getFullLinkResource(
                itemImage.formats?.small?.url ?? itemImage.url
              ),
              thumbnail: getFullLinkResource(
                itemImage.formats?.thumbnail?.url ?? itemImage.url
              ),
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
      `/api/product-list-blocks?populate[products][populate]=media&pagination[pageSize]=100&sort=index:asc&populate[products][populate]=variants&populate[banner]=true`,
      {
        next: { revalidate: 10 },
      }
    )

    console.log("jbdjahbsdas: ", data.data[0].banner)

    return data.data.map((item: any) => {
      return {
        ...item,
        banner: {
          small: item.banner
            ? getFullLinkResource(
                item.banner?.formats?.small?.url ?? item.banner.url ?? ""
              )
            : "",
          thumbnail: item.banner
            ? getFullLinkResource(
                item.banner?.formats?.thumbnail?.url ?? item.banner.url ?? ""
              )
            : "",
          default: item.banner ? getFullLinkResource(item.banner?.url) : "",
        },
        products: item.products.map((productItem: any) => {
          return {
            ...productItem,
            images: productItem.media.map((itemImage: any) => {
              return {
                small: getFullLinkResource(
                  itemImage.formats?.small?.url ?? itemImage.url
                ),
                thumbnail: getFullLinkResource(
                  itemImage.formats?.thumbnail?.url ?? itemImage.url
                ),
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
