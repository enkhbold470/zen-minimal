"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import products from "@/data/laptops.json"
import { Star } from "lucide-react"

import { env } from "@/env.mjs"
import { Product, ProductResponse } from "@/types/productTypes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/laptops?populate=images`
      )

      const data = await response.json()
      // console.log(data)
      return data
    }
    fetchProducts().then((data) => setProducts(data.data))
  }, [])
  //loading data
  if (products.length === 0)
    return (
      <div className="flex animate-pulse items-center justify-center text-2xl">
        Ачааллаж байна...
      </div>
    )
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Манай Дэлгүүрт</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardContent className="p-4">
              <div className="relative mb-4 flex aspect-square items-center">
                <Image
                  src={product.images[0].url}
                  alt={product.title}
                  width={500}
                  height={500}
                  priority={true}
                />
              </div>
              <h2 className="mb-2 text-xl font-semibold">{product.title}</h2>
              {/* <div className="mb-2 flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating} ({product.reviews} сэтгэгдэл)
                </span>
              </div> */}
              <div className="mb-2 flex items-baseline">
                <span className="text-2xl font-bold">
                  ₮
                  {product.price
                    .toFixed()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₮
                  {product.originalPrice
                    .toFixed()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
                <Badge variant="destructive" className="ml-2">
                  Хэмнэлт ₮
                  {(product.originalPrice - product.price)
                    .toFixed()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button variant="default" asChild className="w-full">
                <Link href={`/products/${product.id}`}>Дэлгэрэнгүй</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
