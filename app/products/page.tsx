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
import Breadcrumb from "@/components/Breadcrumb"
import { commafy, shuffleArray } from "@/lib/utils"
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

        // Shuffle the products before setting them
        setProducts(shuffleArray(data as Laptop[]))
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
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="text-center sm:text-left">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 sm:h-10 sm:w-64"></div>
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100 sm:w-40"></div>
          </div>
          <div className="relative w-full sm:w-80 lg:w-96">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Нэр, тайлбараар хайх..."
              className="w-full cursor-not-allowed rounded-xl bg-background py-3 pl-12 pr-4 text-base opacity-50 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white p-3 shadow-md sm:p-4">
              <div className="mb-3 aspect-square w-full animate-pulse rounded-lg bg-gray-200 sm:mb-4"></div>
              <div className="mb-2 h-5 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-gray-100"></div>
              <div className="mb-3 h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isLoading && error && products.length === 0) {
    return (
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Breadcrumb
            items={[
              { label: "Бүтээгдэхүүнүүд" }
            ]}
          />
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Манай Дэлгүүрт</h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">Чанартай лаптоп компьютерүүд</p>
          </div>
          <div className="relative w-full sm:w-80 lg:w-96">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Нэр, тайлбараар хайх..."
              className="w-full rounded-xl bg-background py-3 pl-12 pr-4 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-red-50 p-6 text-center sm:p-8">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-2 text-lg font-semibold text-red-800 sm:text-xl">Алдаа гарлаа</h2>
          <p className="text-sm text-red-600 sm:text-base">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Breadcrumb
          items={[
            { label: "Бүтээгдэхүүнүүд" }
          ]}
        />
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Манай Дэлгүүрт</h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">Чанартай лаптоп компьютерүүд</p>
        </div>
        <div className="relative w-full sm:w-80 lg:w-96">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Нэр, тайлбараар хайх..."
            className="w-full rounded-xl bg-background py-3 pl-12 pr-4 text-base shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center sm:p-8">
          <div className="mb-4 text-5xl sm:text-6xl">🔍</div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800 sm:text-xl">Илэрц олдсонгүй</h2>
          <p className="max-w-md text-sm text-gray-600 sm:text-base">
            {searchTerm
              ? `"${searchTerm}" гэсэн хайлтад тохирох бүтээгдэхүүн олдсонгүй. Өөр түлхүүр үг ашиглан хайж үзнэ үү.`
              : "Одоогоор бүтээгдэхүүн байхгүй байна. Удахгүй шинэ бүтээгдэхүүнүүд нэмэгдэх болно."}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="mt-4 rounded-lg px-6 py-2"
            >
              Бүх бүтээгдэхүүн харах
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
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
              <Link href={`/products/${product.id}`} key={product.id}>
                <Card
                  className="group flex flex-col overflow-hidden rounded-xl border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <CardContent className="flex-grow p-3 pb-2 sm:p-4 sm:pb-2">
                    <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg sm:mb-4">
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
                    className="mb-2 line-clamp-2 h-12 text-base font-semibold text-gray-900 sm:h-14 sm:text-lg"
                    title={product.title}
                  >
                    {product.title}
                  </h2>
                  <p className="line-clamp-1 text-xs text-gray-600 lg:text-sm lg:line-clamp-2">
                    {product.description}
                  </p>
                  <div className="my-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary sm:text-xl">
                      {commafy(Math.round(product.price / 100) * 100)} ₮
                    </span>
                    {/* {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through sm:text-sm">
                        ₮{(product.originalPrice / 1_000).toFixed(0)} мян
                      </span>
                    )} */}
                  </div>
                </CardContent>
             
              </Card>
            </Link> 
           )})}
        </div>
      )}
    </div>
  )
}
