import { NextResponse } from "next/server"
import laptops from "@/data/laptops.json";

export async function GET(request: Request) {
  return NextResponse.json(laptops);
}
