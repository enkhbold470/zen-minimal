import { NextResponse } from "next/server"
import { getLaptops } from "@/app/actions"


export async function GET(request: Request) {
  try {
    const laptops = await getLaptops();
    return NextResponse.json(laptops);
  } catch (error) {
    console.error("Error in GET /api/laptops:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    });
    return NextResponse.json(
      {
        message: "Failed to fetch laptops. Please check server logs for details.",
      },
      { status: 500 }
    );
  }
}
    