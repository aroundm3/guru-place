import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

//===================================

const BASE_URL = process.env.BASE_URL
const API_KEY = process.env.FULL_ACCESS_API_KEY
const API_KEY_FOR_ORDER = process.env.FULL_ACCESS_API_KEY

type FetcherOptions = RequestInit & {
  next?: {
    revalidate?: number // seconds
    tags?: string[]
  }
  cache?: RequestCache
}

export async function fetcher(
  path: string,
  options: FetcherOptions = {}
): Promise<any> {
  const url = `${BASE_URL}${path}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
    ...(options.headers || {}),
  }

  const res = await fetch(url, {
    ...options,
    headers,
    next: options.next,
    cache: options.cache,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.message || "API request failed")
  }

  return res.json()
}

export async function fetcherForOrderModule(
  path: string,
  options: FetcherOptions = {}
): Promise<any> {
  const url = `${BASE_URL}${path}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY_FOR_ORDER}`,
    ...(options.headers || {}),
  }

  const res = await fetch(url, {
    ...options,
    headers,
    next: options.next,
    cache: options.cache,
  })

  if (!res.ok) {
    console.log("dbahjsbdhas: ", { res })

    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData?.message || "API request failed")
  }

  return res.json()
}

export const getFullLinkResource = (urlResponseFromServer: string) => {
  return urlResponseFromServer ? BASE_URL + urlResponseFromServer : "/logo.png"
}
