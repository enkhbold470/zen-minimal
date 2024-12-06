"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Product interface
export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number
  keyFeatures: string[]
  images: string[]
  slug: string
}

// Mock product data (in a real app, this would come from an API or database)
const products: Record<string, Product> = {
  "ultrabook-pro-x1": {
    id: "1",
    title: "UltraBook Pro X1",
    description:
      "Experience unparalleled performance with the UltraBook Pro X1.",
    price: 1299.99,
    originalPrice: 1499.99,
    keyFeatures: [
      '15.6" 4K Ultra HD Display',
      "Intel Core i9 Processor",
      "32GB DDR4 RAM",
      "1TB NVMe SSD",
      "NVIDIA GeForce RTX 3080 Graphics",
      "Thunderbolt 4, Wi-Fi 6, Bluetooth 5.2",
    ],
    images: ["/placeholder.svg?height=600&width=600"],
    slug: "ultrabook-pro-x1",
  },
  "powerlaptop-y2": {
    id: "2",
    title: "PowerLaptop Y2",
    description: "Powerful performance for professionals.",
    price: 999.99,
    originalPrice: 1199.99,
    keyFeatures: [
      '14" Full HD Display',
      "Intel Core i7 Processor",
      "16GB DDR4 RAM",
      "512GB NVMe SSD",
      "NVIDIA GeForce RTX 3060 Graphics",
    ],
    images: ["https://placekeanu.com/1080"],
    slug: "powerlaptop-y2",
  },
}

// Fetch product data (simulated)
const fetchProductData = (slug: string): Product | null => {
  return products[slug] || null
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = fetchProductData(params.slug)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRequestPurchase = () => {
    setIsDialogOpen(true)
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>
  }

  const savingsAmount = product.originalPrice - product.price

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            <img
              src={product.images[0]}
              alt={product.title}
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Pricing */}
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
            <Badge className="ml-2">Save ${savingsAmount.toFixed(2)}</Badge>
          </div>

          {/* Purchase Button */}
          <Button size="lg" className="w-full" onClick={handleRequestPurchase}>
            <Send className="mr-2 h-5 w-5" />
            Request to Purchase
          </Button>

          {/* Key Features */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Key Features</h2>
            <ul className="list-inside list-disc space-y-2">
              {product.keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Purchase Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Request Sent</DialogTitle>
            <DialogDescription>
              Your request to purchase the {product.title} has been sent
              successfully. Our team will contact you shortly to finalize the
              purchase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button asChild>
              <Link href="/products">View More Products</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
