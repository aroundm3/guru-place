import dayjs from "dayjs"
import { formatBigNumber } from "./format-big-number"

// Types for thermal printer
type OrderItem = {
  id: number
  quantity: number | string
  product?: {
    name?: string
    sale_price?: number | string
  }
  variant?: {
    variant_value?: string
    sale_price?: number | string
    product?: {
      name?: string
      sale_price?: number | string
    }
  } | null
}

type OrderEntity = {
  id: number
  documentId: string
  createdAt: string
  shipping_fee?: number | string | null
  order_items?: OrderItem[]
  customer?: {
    full_name?: string
    phone_number?: string
    address?: string
  }
}

/**
 * Utility functions for thermal printer (K58x45 - 58mm width)
 * ESC/POS commands for thermal receipt printers
 */

// ESC/POS Commands
const ESC = "\x1B"
const GS = "\x1D"

export const ESC_POS_COMMANDS = {
  // Initialize printer
  INIT: ESC + "@",
  // Text alignment
  ALIGN_LEFT: ESC + "a" + "\x00",
  ALIGN_CENTER: ESC + "a" + "\x01",
  ALIGN_RIGHT: ESC + "a" + "\x02",
  // Font size
  FONT_NORMAL: ESC + "!" + "\x00",
  FONT_LARGE: ESC + "!" + "\x10", // Double width
  FONT_TALL: ESC + "!" + "\x01", // Double height
  FONT_LARGE_TALL: ESC + "!" + "\x11", // Double width + height
  // Bold
  BOLD_ON: ESC + "E" + "\x01",
  BOLD_OFF: ESC + "E" + "\x00",
  // Underline
  UNDERLINE_ON: ESC + "-" + "\x01",
  UNDERLINE_OFF: ESC + "-" + "\x00",
  // Cut paper
  CUT: GS + "V" + "\x41" + "\x03",
  // Feed lines
  FEED: (n: number) => ESC + "d" + String.fromCharCode(n),
  // Line separator
  LINE_SEPARATOR: "--------------------------------\n",
}

/**
 * Format text to fit 58mm thermal printer (32 characters per line)
 * Returns array of lines
 */
export function formatTextFor58mm(
  text: string,
  align: "left" | "center" | "right" = "left",
  maxWidth: number = 32
): string[] {
  const lines: string[] = []
  const words = text.split(" ")

  let currentLine = ""
  for (const word of words) {
    if ((currentLine + word).length <= maxWidth) {
      currentLine += (currentLine ? " " : "") + word
    } else {
      if (currentLine) lines.push(currentLine)
      // If word is longer than maxWidth, split it
      if (word.length > maxWidth) {
        let remaining = word
        while (remaining.length > maxWidth) {
          lines.push(remaining.substring(0, maxWidth))
          remaining = remaining.substring(maxWidth)
        }
        currentLine = remaining
      } else {
        currentLine = word
      }
    }
  }
  if (currentLine) lines.push(currentLine)

  return lines.map((line) => {
    if (align === "center") {
      const padding = Math.floor((maxWidth - line.length) / 2)
      return " ".repeat(padding) + line
    } else if (align === "right") {
      const padding = maxWidth - line.length
      return " ".repeat(padding) + line
    }
    return line
  })
}

/**
 * Generate ESC/POS receipt for thermal printer
 */
export function generateThermalReceipt(order: OrderEntity): string {
  let receipt = ESC_POS_COMMANDS.INIT
  receipt += ESC_POS_COMMANDS.ALIGN_CENTER
  receipt += ESC_POS_COMMANDS.FONT_LARGE_TALL
  receipt += ESC_POS_COMMANDS.BOLD_ON
  receipt += "MY PHAM DIVI\n"
  receipt += ESC_POS_COMMANDS.BOLD_OFF
  receipt += ESC_POS_COMMANDS.FONT_NORMAL
  receipt += ESC_POS_COMMANDS.FEED(1)

  receipt += ESC_POS_COMMANDS.FONT_LARGE
  receipt += ESC_POS_COMMANDS.BOLD_ON
  receipt += "HOA DON BAN HANG\n"
  receipt += ESC_POS_COMMANDS.BOLD_OFF
  receipt += ESC_POS_COMMANDS.FONT_NORMAL
  receipt += ESC_POS_COMMANDS.FEED(1)

  receipt += ESC_POS_COMMANDS.ALIGN_LEFT
  receipt += ESC_POS_COMMANDS.LINE_SEPARATOR
  receipt += `Ma don: ${order.documentId}\n`
  receipt += `Ngay: ${dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}\n`
  receipt += ESC_POS_COMMANDS.LINE_SEPARATOR
  receipt += ESC_POS_COMMANDS.FEED(1)

  // Customer info
  if (order.customer) {
    receipt += ESC_POS_COMMANDS.BOLD_ON
    receipt += "KHACH HANG:\n"
    receipt += ESC_POS_COMMANDS.BOLD_OFF
    receipt += `Ten: ${order.customer.full_name || "N/A"}\n`
    receipt += `SDT: ${order.customer.phone_number || "N/A"}\n`
    if (order.customer.address) {
      receipt += `Dia chi: ${order.customer.address}\n`
    }
    receipt += ESC_POS_COMMANDS.LINE_SEPARATOR
    receipt += ESC_POS_COMMANDS.FEED(1)
  }

  // Order items
  receipt += ESC_POS_COMMANDS.BOLD_ON
  receipt += "CHI TIET:\n"
  receipt += ESC_POS_COMMANDS.BOLD_OFF
  receipt += ESC_POS_COMMANDS.LINE_SEPARATOR

  const items = order.order_items || []
  items.forEach((item, index) => {
    const variant = item.variant
    const product = variant?.product || item.product
    const productName = product?.name || "N/A"
    const variantValue = variant?.variant_value || ""
    const unitPrice = Number(variant?.sale_price ?? product?.sale_price ?? 0)
    const quantity = Number(item.quantity || 0)
    const total = unitPrice * quantity

    // Product name (may need to wrap)
    const fullName = variantValue
      ? `${productName} (${variantValue})`
      : productName

    // Format: Tên sản phẩm (biến thể) - số lượng x đơn giá
    const firstLine = `${fullName} - ${quantity} x ${formatBigNumber(
      unitPrice,
      true
    )}`
    const firstLineFormatted = formatTextFor58mm(firstLine, "left")
    receipt += `${index + 1}. ${firstLineFormatted[0]}\n`
    if (firstLineFormatted.length > 1) {
      firstLineFormatted.slice(1).forEach((line) => {
        receipt += `   ${line}\n`
      })
    }

    // Thành tiền below
    receipt += `   Thanh tien: ${formatBigNumber(total, true)}\n`
  })

  receipt += ESC_POS_COMMANDS.LINE_SEPARATOR
  receipt += ESC_POS_COMMANDS.FEED(1)

  // Summary
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = Number(
      item.variant?.sale_price ?? item.product?.sale_price ?? 0
    )
    return sum + unitPrice * Number(item.quantity || 0)
  }, 0)

  const shippingFee = Number(order.shipping_fee || 0)
  const total = subtotal + shippingFee

  receipt += `Tien hang: ${formatBigNumber(subtotal, true)}\n`
  receipt += `Phi van chuyen: ${
    shippingFee === 0 ? "Mien phi" : formatBigNumber(shippingFee, true)
  }\n`
  receipt += ESC_POS_COMMANDS.BOLD_ON
  receipt += ESC_POS_COMMANDS.FONT_LARGE
  receipt += `TONG: ${formatBigNumber(total, true)}\n`
  receipt += ESC_POS_COMMANDS.FONT_NORMAL
  receipt += ESC_POS_COMMANDS.BOLD_OFF
  receipt += ESC_POS_COMMANDS.FEED(1)

  receipt += ESC_POS_COMMANDS.LINE_SEPARATOR
  receipt += ESC_POS_COMMANDS.ALIGN_CENTER
  receipt += ESC_POS_COMMANDS.FEED(1)
  receipt += "Cam on quy khach!\n"
  receipt += ESC_POS_COMMANDS.FEED(2)
  receipt += ESC_POS_COMMANDS.CUT

  return receipt
}

/**
 * Print to thermal printer using Web Serial API
 */
export async function printToThermalPrinter(order: OrderEntity): Promise<void> {
  if (!("serial" in navigator)) {
    throw new Error("Web Serial API không được hỗ trợ trên trình duyệt này")
  }

  try {
    // Request port access
    const port = await (navigator as any).serial.requestPort()

    // Open port with baud rate 9600 (common for thermal printers)
    await port.open({ baudRate: 9600 })

    // Generate receipt
    const receipt = generateThermalReceipt(order)

    // Convert string to Uint8Array
    const encoder = new TextEncoder()
    const data = encoder.encode(receipt)

    // Write data to printer
    const writer = port.writable?.getWriter()
    if (writer) {
      await writer.write(data)
      writer.releaseLock()
    }

    // Close port
    await port.close()

    return Promise.resolve()
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      throw new Error(
        "Không tìm thấy máy in. Vui lòng kết nối máy in và thử lại."
      )
    }
    throw error
  }
}
