"use server"

import { fetcher } from "@lib/config"
import { Category } from "types/global"

export async function getListCategories(filter: {
  searchQuery?: string
}): Promise<Category[]> {
  try {
    const data = await fetcher(
      `/api/categories?populate=brands&pagination[page]=1&pagination[pageSize]=100${
        filter.searchQuery
          ? `&filters[name][$containsi]=${filter.searchQuery}`
          : ""
      }`,
      {
        next: { revalidate: 10 },
      }
    )

    return data.data
  } catch (ex) {
    return []
  }
}
