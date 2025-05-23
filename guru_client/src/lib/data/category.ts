"use server"

import { fetcher, getFullLinkResource } from "@lib/config"
import { Category } from "types/global"

export async function getListCategories(filter: {
  searchQuery?: string
}): Promise<Category[]> {
  try {
    const data = await fetcher(
      `/api/categories?populate=image&populate=brands&pagination[page]=1&pagination[pageSize]=100${
        filter.searchQuery
          ? `&filters[name][$containsi]=${filter.searchQuery}`
          : ""
      }`,
      {
        next: { revalidate: 10 },
      }
    )

    return data.data.map((item: any) => {
      return {
        ...item,
        image: getFullLinkResource(item.image.url),
      }
    })
  } catch (ex) {
    return []
  }
}
