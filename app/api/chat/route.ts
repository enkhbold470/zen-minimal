import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[CHAT API] Request received")
    
    const requestBody = await request.json()
    console.log("[CHAT API] Request body:", JSON.stringify(requestBody, null, 2))
    
    const { productTitle } = requestBody
    console.log("[CHAT API] Extracted productTitle:", productTitle)

    if (!productTitle) {
      console.log("[CHAT API] No productTitle provided, returning error")
      return NextResponse.json(
        { error: "Product title is required" },
        { status: 400 }
      )
    }

    console.log("[CHAT API] Generating AI content for product:", productTitle)
    
    // Generate AI content based on product title
    // For now, we'll return mock data. In a real implementation,
    // you would integrate with an AI service like OpenAI
    const description = `This is a high-quality ${productTitle} featuring cutting-edge technology and premium build quality. Perfect for professionals and enthusiasts who demand the best performance and reliability. With advanced features and sleek design, this product delivers exceptional value and user experience.`
    
    const specs = `Display: 15.6" Full HD, Processor: Intel Core i7, RAM: 16GB DDR4, Storage: 512GB SSD, Graphics: Dedicated GPU, Battery: 8+ hours, Weight: 2.1kg, Connectivity: Wi-Fi 6, Bluetooth 5.0, USB-C, HDMI`

    const response = {
      description,
      specs
    }
    
    console.log("[CHAT API] Generated response:", JSON.stringify(response, null, 2))
    console.log("[CHAT API] Sending successful response")

    return NextResponse.json(response)
  } catch (error) {
    console.error("[CHAT API] Error occurred:", error)
    console.error("[CHAT API] Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

