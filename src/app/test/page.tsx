"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import { Product, ProductResponse } from "@/types/productTypes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        "http://192.168.0.28:1337/api/laptops?populate=images"
      )

      const data = await response.json()
      console.log(data)
      return data
    }
    fetchProducts().then((data) => setProducts(data.data))
  }, [])
  console.log(products)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Манай Дэлгүүрт</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardContent className="p-4">
              <div className="relative mb-4 aspect-square">
                <Image
                  src={product.images[0].url}
                  alt={product.title}
                  width={500}
                  height={500}
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
              <div className="mb-2">
                {/* <Badge>{product.category}</Badge> */}
              </div>
              <p className="text-gray-600">{product.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-xl font-semibold">{product.price}₮</span>
              <Button>Худалдан авах</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
