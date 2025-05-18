"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Laptop } from "@/types/productTypes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getLaptops } from "@/app/actions"

export default function ProductsPage() {
  const [products, setProducts] = useState<Laptop[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const data = await getLaptops()

        if (!data || !Array.isArray(data) || data.length === 0) {
          setError("Одоогоор бүтээгдэхүүн байхгүй байна")
          return
        }

        setProducts(data as unknown as Laptop[])
      } catch (error) {
        setError("Бүтээгдэхүүн татахад алдаа гарлаа")
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Манай Дэлгүүрт</h1>
        <div className="flex animate-pulse items-center justify-center text-2xl">
          Ачааллаж байна...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Манай Дэлгүүрт</h1>
        <div className="flex items-center justify-center text-xl text-gray-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Манай Дэлгүүрт</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const primaryImage =
            product.images && product.images.length > 0
              ? product.images[0]
              : null
          const imageUrl = primaryImage
            ? primaryImage.url
            : "/placeholder-image.png" // Fallback image
          const imageAlt = primaryImage
            ? primaryImage.alt || product.title
            : product.title

          return (
            <Card key={product.id} className="flex flex-col">
              <CardContent className="p-4">
                <div className="relative mb-4 flex aspect-square items-center">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    width={500}
                    height={500}
                    priority={true}
                    className="rounded-md object-cover"
                  />
                </div>
                <h2 className="mb-2 text-xl font-semibold">{product.title}</h2>
                <p className="mb-2 text-gray-600">{product.description}</p>
                <div className="mb-2 flex items-baseline">
                  <span className="text-2xl font-bold">
                    {product.price >= 1_000_000
                      ? `₮${(product.price / 1_000_000).toFixed(2)} сая`
                      : `₮${(product.price / 1_000).toFixed(0)} мян`}{" "}
                  </span>
                  <Badge
                    variant="destructive"
                    className="ml-2 text-sm font-bold"
                  >
                    <span>
                      эсвэл {""}
                      {product.price >= 1_000_000
                        ? `₮${(product.price / 6 / 1_000_000).toFixed(2)} сая`
                        : `₮${(product.price / 6 / 1_000).toFixed(0)} мян`}
                      /6 удаа
                    </span>
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  variant="default"
                  asChild
                  className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-400"
                >
                  <Link href={`/products/${product.id}`}>Дэлгэрэнгүй</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
