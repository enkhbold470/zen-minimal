import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in environment variables
});

export async function POST(req: Request) {
  try {
    const { productTitle } = await req.json();

    if (!productTitle) {
      return NextResponse.json(
        { error: "productTitle is required" },
        { status: 400 }
      );
    }

    const prompt = `
For the product named "${productTitle}", please generate:
1. A concise and appealing product description.
2. A comma-separated list of key specifications.

Return the output as a JSON object with two keys: "description" and "specs".
For example:
{
  "description": "This is an amazing product that will change your life in mongolian language...",
  "specs": "Spec1, Spec2, Spec3, Another Spec"
}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates product details in mongolian language.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" }, // Request JSON output
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Failed to get content from OpenAI" },
        { status: 500 }
      );
    }

    // Attempt to parse the content, as OpenAI should return a JSON string
    // when response_format: { type: "json_object" } is used.
    try {
      const parsedContent = JSON.parse(content);
      return NextResponse.json(parsedContent);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.error("Raw OpenAI response content:", content);
      return NextResponse.json(
        { error: "Failed to parse AI-generated content. Raw content: " + content },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
