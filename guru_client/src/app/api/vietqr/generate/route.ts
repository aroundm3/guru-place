import { NextRequest, NextResponse } from "next/server"

// Hardcoded VietQR credentials
const VIETQR_CLIENT_ID = "YOUR_CLIENT_ID_HERE" // Thay bằng CLIENT_ID thực tế
const VIETQR_API_KEY = "YOUR_API_KEY_HERE" // Thay bằng API_KEY thực tế

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("VietQR Generate - Request body:", {
      accountNo: body.accountNo,
      accountName: body.accountName,
      acqId: body.acqId,
      addInfo: body.addInfo,
      amount: body.amount,
      template: body.template,
    })

    const { accountNo, accountName, acqId, addInfo, amount, template } = body

    if (
      !accountNo ||
      !accountName ||
      !acqId ||
      !addInfo ||
      amount === undefined
    ) {
      console.error("Missing required fields:", {
        accountNo: !!accountNo,
        accountName: !!accountName,
        acqId: !!acqId,
        addInfo: !!addInfo,
        amount: amount !== undefined,
      })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const requestPayload = {
      accountNo,
      accountName,
      acqId,
      addInfo,
      amount: amount.toString(),
      template: template || "qr_only",
    }

    console.log("VietQR Generate - Calling API with payload:", requestPayload)

    const response = await fetch("https://api.vietqr.io/v2/generate", {
      method: "POST",
      headers: {
        "x-client-id": VIETQR_CLIENT_ID,
        "x-api-key": VIETQR_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(requestPayload),
    })

    console.log("VietQR Generate - Response status:", response.status)
    console.log(
      "VietQR Generate - Response headers:",
      Object.fromEntries(response.headers.entries())
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("VietQR Generate - Error response:", errorText)
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      return NextResponse.json(
        {
          error:
            errorData?.message ||
            errorData?.desc ||
            "Failed to generate QR code",
        },
        { status: response.status }
      )
    }

    const responseText = await response.text()
    console.log("VietQR Generate - Response text length:", responseText.length)
    console.log(
      "VietQR Generate - Response preview:",
      responseText.substring(0, 200)
    )

    let data
    try {
      data = JSON.parse(responseText)
      console.log("VietQR Generate - Parsed data structure:", {
        hasData: !!data.data,
        hasQrDataURL: !!data?.data?.qrDataURL,
        hasQrCode: !!data?.data?.qrCode,
        keys: Object.keys(data),
        dataKeys: data.data ? Object.keys(data.data) : [],
      })
    } catch (parseError) {
      console.error("VietQR Generate - Failed to parse JSON:", parseError)
      return NextResponse.json(
        { error: "Invalid response from VietQR API" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("VietQR Generate - Exception:", error)
    console.error("VietQR Generate - Error stack:", error?.stack)
    return NextResponse.json(
      { error: error?.message || "Failed to generate QR code" },
      { status: 500 }
    )
  }
}
