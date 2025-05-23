"use server"

import { fetcher, getFullLinkResource } from "@lib/config"
import { Brand } from "types/global"

export async function getListBrand(filter: {
  searchQuery?: string
  isHightlight?: boolean
  categoryId?: string
}): Promise<Brand[]> {
  try {
    const data = await fetcher(
      `/api/brands?populate=logo&pagination[page]=1&pagination[pageSize]=100${
        typeof filter.isHightlight === "boolean"
          ? `&filters[isHighlight][$eq]=${filter.isHightlight}`
          : ""
      }${
        filter.searchQuery
          ? `&filters[name][$containsi]=${filter.searchQuery}`
          : ""
      }${
        filter.categoryId
          ? `&filters[categories][documentId]=${filter.categoryId}`
          : ""
      }`,
      {
        next: { revalidate: 10 },
      }
    )

    return data.data.map((item: any) => {
      return {
        ...item,
        logo: getFullLinkResource(item.logo.url),
      }
    })
  } catch (ex) {
    return []
  }
}
