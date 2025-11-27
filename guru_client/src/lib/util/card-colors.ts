import { CustomerCard } from "types/global"

export type CardColorType = "pink" | "blue" | "yellow"

/**
 * Xác định màu sắc của card dựa vào title
 * - Nếu title chứa "hồng" → màu hồng
 * - Nếu title chứa "xanh" → màu xanh
 * - Mặc định → màu vàng
 */
export function getCardColor(
  card: CustomerCard | null | undefined
): CardColorType {
  if (!card?.title) return "yellow"

  const titleLower = card.title.toLowerCase()
  if (titleLower.includes("hồng")) return "pink"
  if (titleLower.includes("xanh")) return "blue"
  return "yellow"
}

/**
 * Lấy các class CSS cho background dựa vào màu card
 */
export function getCardBgClasses(color: CardColorType): string {
  switch (color) {
    case "pink":
      return "bg-pink-50 border-pink-200"
    case "blue":
      return "bg-blue-50 border-blue-200"
    case "yellow":
      return "bg-yellow-50 border-yellow-200"
    default:
      return "bg-yellow-50 border-yellow-200"
  }
}

/**
 * Lấy các class CSS cho text dựa vào màu card
 */
export function getCardTextClasses(color: CardColorType): string {
  switch (color) {
    case "pink":
      return "text-pink-700"
    case "blue":
      return "text-blue-700"
    case "yellow":
      return "text-yellow-700"
    default:
      return "text-yellow-700"
  }
}

/**
 * Lấy các class CSS cho border dựa vào màu card
 */
export function getCardBorderClasses(color: CardColorType): string {
  switch (color) {
    case "pink":
      return "border-pink-200"
    case "blue":
      return "border-blue-200"
    case "yellow":
      return "border-yellow-200"
    default:
      return "border-yellow-200"
  }
}

/**
 * Lấy màu badge dựa vào màu card
 */
export function getCardBadgeClasses(color: CardColorType): string {
  switch (color) {
    case "pink":
      return "bg-pink-600"
    case "blue":
      return "bg-blue-600"
    case "yellow":
      return "bg-yellow-600"
    default:
      return "bg-yellow-600"
  }
}

/**
 * Lấy màu icon dựa vào màu card
 */
export function getCardIconClasses(color: CardColorType): string {
  switch (color) {
    case "pink":
      return "text-pink-600"
    case "blue":
      return "text-blue-600"
    case "yellow":
      return "text-yellow-600"
    default:
      return "text-yellow-600"
  }
}
