import { StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

//=============
export interface Brand {
  documentId: string
  name: string
  image: string
  logo: string
  slug: string
}

export interface Banner {
  documentId: string
  id: number
  image: string
}

export interface Category {
  documentId: string
  name: string
  description: string
  brands: Brand[]
  slug: string
  image: string
}

export type ImageMedia = {
  small: string
  thumbnail: string
  default: string
}

export interface RichTextBlock {
  type: string
  children: {
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }[]
  level?: number
  url?: string
}

export interface Variant {
  id: number
  documentId: string
  variant_value: string
  quantity: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  base_price: number
  sale_price: number
  SKU: string
  variant_image: ImageMedia
}

export interface Product {
  documentId: string
  name: string
  short_description: string
  detail_description: RichTextBlock[]
  sold_quantity: number
  slug: string
  images: ImageMedia[]
  priceBaseRange: number[]
  priceSaleRange: number[]
  base_price: number
  sale_price: number
  totalQuantity: number
  variants: Variant[]
  category: Category
  brand: Brand
}

export interface ProductListBlock {
  documentId: string
  index: number
  title: string
  products: Product[]
}

export interface StoreMetadata {
  documentId: string
  background_color: string
  phone_number: string
  address: string
  email_contact: string
  facebook_link: string
}
