"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

import { Laptop } from "@/types/productTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPublishedLaptops } from "@/app/actions"

export default function ProductsPage() {
  const [products, setProducts] = useState<Laptop[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const data = await getPublishedLaptops()

        if (!data || !Array.isArray(data)) {
          setProducts([])
          setError("Одоогоор бүтээгдэхүүн байхгүй байна")
          return
        }

        setProducts(data as Laptop[])
        setError(null)
      } catch (error) {
        setProducts([])
        setError("Бүтээгдэхүүн татахад алдаа гарлаа")
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products
    }
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold sm:mb-8">Манай Дэлгүүрт</h1>
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Нэр, тайлбараар хайх..."
              className="w-full cursor-not-allowed rounded-lg bg-background py-2 pl-10 pr-4 opacity-50"
              disabled
            />
          </div>
        </div>
        <div className="flex animate-pulse items-center justify-center text-2xl">
          Ачааллаж байна...
        </div>
      </div>
    )
  }

  if (!isLoading && error && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold sm:mb-8">Манай Дэлгүүрт</h1>
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Нэр, тайлбараар хайх..."
              className="w-full rounded-lg bg-background py-2 pl-10 pr-4 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center rounded-md bg-destructive/10 p-6 text-xl text-destructive">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-center justify-between sm:mb-8 sm:flex-row">
        <h1 className="mb-4 text-3xl font-bold sm:mb-0">Манай Дэлгүүрт</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Нэр, тайлбараар хайх..."
            className="w-full rounded-lg bg-background py-2 pl-10 pr-4 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">Илэрц олдсонгүй</h2>
          <p className="mt-2 text-muted-foreground">
            {searchTerm
              ? `"${searchTerm}" гэсэн хайлтад тохирох бүтээгдэхүүн олдсонгүй.`
              : "Одоогоор бүтээгдэхүүн байхгүй байна."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const primaryImage =
              product.images && product.images.length > 0
                ? product.images[0]
                : null
            const imageUrl = primaryImage
              ? primaryImage.url
              : "/placeholder-image.png"
            const imageAlt = primaryImage
              ? primaryImage.alt || product.title
              : product.title

            return (
              <Card
                key={product.id}
                className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="flex-grow p-4 pb-2">
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={true}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h2
                    className="mb-1 line-clamp-2 h-14 text-lg font-semibold"
                    title={product.title}
                  >
                    {product.title}
                  </h2>
                  <p className="mb-3 line-clamp-3 h-[60px] text-sm text-gray-600">
                    {product.description}
                  </p>
                  <div className="mb-3 flex items-baseline">
                    <span className="text-xl font-bold text-primary">
                      {product.price >= 1_000_000
                        ? `₮${(product.price / 1_000_000).toFixed(1)} сая`
                        : `₮${(product.price / 1_000).toFixed(0)} мян`}{" "}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto p-4 pt-0">
                  <Button
                    variant="default"
                    asChild
                    className="w-full rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Link href={`/products/${product.id}`}>Дэлгэрэнгүй</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
