import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.BASE_URL
const FULL_ACCESS_API_KEY = process.env.FULL_ACCESS_API_KEY

// GET - Get promotions by product IDs
export async function GET(request: NextRequest) {
  try {
    if (!BASE_URL || !FULL_ACCESS_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productIds = searchParams.get("productIds")

    console.log("🔍 Searching promotions for productIds:", productIds)

    if (!productIds) {
      return NextResponse.json({ data: [] })
    }

    const productIdArray = productIds.split(",").filter((id) => id.trim())

    if (productIdArray.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // Fetch TẤT CẢ promotions đã published
    const params = new URLSearchParams()
    params.set("pagination[pageSize]", "1000")
    params.set("filters[publishedAt][$notNull]", "true")
    
    // Populate products relation đầy đủ
    params.set("populate[products]", "true")
    params.set("populate[image]", "true")

    const url = `${BASE_URL}/api/promotions?${params.toString()}`

    console.log("📡 Fetching URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FULL_ACCESS_API_KEY}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("❌ API Error:", errorData)
      throw new Error(
        errorData?.error?.message || "Failed to fetch promotions"
      )
    }

    const data = await response.json()
    const allPromotions = data.data || []

    console.log("📦 Total promotions fetched:", allPromotions.length)

    // Filter ở server side với logic rõ ràng
    const filteredPromotions = allPromotions.filter((promotion: any) => {
      // Check 1: isDisable phải là false (hoặc null/undefined)
      if (promotion.isDisable === true) {
        console.log(`  ❌ "${promotion.code}" - Disabled`)
        return false
      }

      // Check 2: isPrivate phải là false (hoặc null/undefined)
      if (promotion.isPrivate === true) {
        console.log(`  ❌ "${promotion.code}" - Private`)
        return false
      }

      // Check 3: Products matching
      const hasProducts = promotion.products && promotion.products.length > 0

      console.log(
        `🏷️ Promotion "${promotion.code}":`,
        `isDisable=${promotion.isDisable}, isPrivate=${promotion.isPrivate},`,
        hasProducts
          ? `has ${promotion.products.length} products`
          : "applies to ALL products"
      )

      // Nếu không có products → áp dụng cho tất cả sản phẩm
      if (!hasProducts) {
        console.log("  ✅ Included (applies to all)")
        return true
      }

      // Kiểm tra match
      const matches = promotion.products.some((product: any) => {
        const productDocId = product.documentId || product.id
        const isMatch = productIdArray.includes(productDocId)
        if (isMatch) {
          console.log(`  ✅ Matched product: ${productDocId}`)
        }
        return isMatch
      })

      if (!matches) {
        console.log(`  ❌ No matching products`)
      }

      return matches
    })

    console.log("✅ Final filtered promotions:", filteredPromotions.length)

    return NextResponse.json({
      data: filteredPromotions,
    })
  } catch (error: any) {
    console.error("❌ Failed to fetch promotions by products:", error)
    return NextResponse.json(
      {
        data: [],
        error: error?.message || "Failed to fetch promotions",
      },
      { status: 500 }
    )
  }
}
