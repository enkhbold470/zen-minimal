'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Check, Send } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function ProductPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRequestPurchase = () => {
    // Here you would typically send the purchase request to your backend
    // For this example, we'll just open the dialog
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="UltraBook Pro X1"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative aspect-square">
                <Image
                  src={`/placeholder.svg?height=150&width=150&text=Image${i + 1}`}
                  alt={`Product image ${i + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">UltraBook Pro X1</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">4.8 (120 reviews)</span>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-gray-500">
              Experience unparalleled performance with the UltraBook Pro X1. This powerhouse laptop combines cutting-edge technology with sleek design, perfect for professionals and power users alike.
            </p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">$1,299.99</span>
              <span className="ml-2 text-sm text-gray-500 line-through">$1,499.99</span>
              <Badge className="ml-2">Save $200</Badge>
            </div>
          </div>
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>In stock - Ships within 24 hours</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>Free shipping on orders over $1000</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>30-day money-back guarantee</span>
              </div>
            </CardContent>
          </Card>
          <Button size="lg" className="w-full" onClick={handleRequestPurchase}>
            <Send className="w-5 h-5 mr-2" />
            Request to Purchase
          </Button>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Key Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>15.6" 4K Ultra HD Display</li>
              <li>Intel Core i9 Processor</li>
              <li>32GB DDR4 RAM</li>
              <li>1TB NVMe SSD</li>
              <li>NVIDIA GeForce RTX 3080 Graphics</li>
              <li>Thunderbolt 4, Wi-Fi 6, Bluetooth 5.2</li>
            </ul>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Request Sent</DialogTitle>
            <DialogDescription>
              Your request to purchase the UltraBook Pro X1 has been sent successfully. Our team will contact you shortly to finalize the purchase.
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

