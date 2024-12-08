import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// This would typically come from an API or database
const products = [
  {
    id: 1,
    name: "UltraBook Pro X1",
    image: "https://placekeanu.com/1080/1080",
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 2,
    name: "PowerLaptop Y2",
    image: "https://placekeanu.com/2000",
    price: 999.99,
    originalPrice: 1199.99,
    rating: 4.5,
    reviews: 85,
  },
  {
    id: 3,
    name: "ThinBook Air Z3",
    image: "https://placekeanu.com/3000",
    price: 899.99,
    originalPrice: 999.99,
    rating: 4.7,
    reviews: 150,
  },
]

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Манай Дэлгүүрт</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardContent className="p-4">
              <div className="relative mb-4 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                />
              </div>
              <h2 className="mb-2 text-xl font-semibold">{product.name}</h2>
              <div className="mb-2 flex items-center">
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
              </div>
              <div className="mb-2 flex items-baseline">
                <span className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <Badge className="ml-2">
                  Хэмнэлт ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={`/products/${product.id}`}>Дэлгэрэнгүй</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
