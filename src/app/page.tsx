"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push("/products")
  }, [router])
  return (
    <div className="flex justify-center items-center">
      <h1>Redirecting...</h1>
    </div>
  )
}
