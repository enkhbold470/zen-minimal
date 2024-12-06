import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// This would typically come from an API or database
const products = [
  {
    id: 1,
    name: "UltraBook Pro X1",
    image: "/placeholder.svg?height=300&width=300&text=UltraBook+Pro+X1",
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 2,
    name: "PowerLaptop Y2",
    image: "/placeholder.svg?height=300&width=300&text=PowerLaptop+Y2",
    price: 999.99,
    originalPrice: 1199.99,
    rating: 4.5,
    reviews: 85,
  },
  {
    id: 3,
    name: "ThinBook Air Z3",
    image: "/placeholder.svg?height=300&width=300&text=ThinBook+Air+Z3",
    price: 899.99,
    originalPrice: 999.99,
    rating: 4.7,
    reviews: 150,
  },
  {
    id: 4,
    name: "GamerPro GTX",
    image: "/placeholder.svg?height=300&width=300&text=GamerPro+GTX",
    price: 1599.99,
    originalPrice: 1799.99,
    rating: 4.9,
    reviews: 200,
  },
  {
    id: 5,
    name: "WorkStation Pro",
    image: "/placeholder.svg?height=300&width=300&text=WorkStation+Pro",
    price: 1399.99,
    originalPrice: 1599.99,
    rating: 4.6,
    reviews: 95,
  },
  {
    id: 6,
    name: "StudentBook Lite",
    image: "/placeholder.svg?height=300&width=300&text=StudentBook+Lite",
    price: 599.99,
    originalPrice: 699.99,
    rating: 4.4,
    reviews: 180,
  },
]

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Laptops</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardContent className="p-4">
              <div className="relative aspect-square mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 fill-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <div className="flex items-baseline mb-2">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <Badge className="ml-2">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={`/product/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

