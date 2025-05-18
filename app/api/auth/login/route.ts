import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    // Check against environment variables
    const adminUsername = process.env.ADMIN_USERNAME || "admin"
    const adminPassword = process.env.ADMIN_PASSWORD || "admin"

    if (!adminUsername || !adminPassword) {
      console.error("Admin credentials not configured in environment variables")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    if (username !== adminUsername || password !== adminPassword) {
      // Clear cookie on failed login attempt if it exists
      cookies().delete("admin-auth")
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Set cookie on successful login
    cookies().set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", // Cookie accessible for all paths
      maxAge: 60 * 60 * 24, // 1 day
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    // Clear cookie on error if it exists
    cookies().delete("admin-auth")
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

