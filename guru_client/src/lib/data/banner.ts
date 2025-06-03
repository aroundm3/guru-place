"use server"

import { fetcher, getFullLinkResource } from "@lib/config"
import { Banner } from "types/global"

export async function getListBanner(): Promise<Banner[]> {
  try {
    const data = await fetcher(
      `/api/banners?=&pagination[page]=1&pagination[pageSize]=100&populate=image&sort=index:asc`,
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
