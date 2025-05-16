"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Laptop } from "@/types/productTypes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductsPage() {
  const [products, setProducts] = useState<Laptop[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`/api/laptops`)
      const data = await response.json()
      console.log(data)
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        setProducts([data]) // Wrap single object in an array
      }
    }

    fetchProducts().catch((error) =>
      console.error("Error fetching products:", error)
    )
  }, [])

  console.log(products)

  // if (!Array.isArray(products)) {
  //   return (
  //     <div className="flex animate-pulse items-center justify-center text-2xl">
  //       Ачааллаж байна...
  //     </div>
  //   )
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Манай Дэлгүүрт</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardContent className="p-4">
              <div className="relative mb-4 flex aspect-square items-center">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={500}
                  height={500}
                  priority={true}
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
                <Badge variant="destructive" className="ml-2 text-sm font-bold">
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
        ))}
      </div>
    </div>
  )
}
