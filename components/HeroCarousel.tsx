'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { firstSentenceDetector } from '@/lib/utils'

type Product = {
  id: number
  title: string
  description: string
  price: number
  Image: { url: string }[]
  published: boolean
  datePublished: Date
}

type HeroCarouselProps = {
  featuredProducts: Product[]
}

export default function HeroCarousel({ featuredProducts }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [featuredProducts.length])

  const filteredProducts = featuredProducts.filter(product => product.published)

  const currentProduct = filteredProducts[currentIndex]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen overflow-hidden"
    > 
      <Image
        src={currentProduct?.Image[0]?.url || `https://placekeanu.com/1920/1080`}
        alt={currentProduct?.title || `Product ${currentProduct?.id}`}
        fill
        className="object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            {currentProduct?.title || `Product ${currentProduct?.id}`}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {firstSentenceDetector(currentProduct?.description || `Product ${currentProduct?.id}`)}     
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full text-lg px-8 py-6">
            <Link href={`/products/${currentProduct?.id}`}>Худалдаж Авах</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  )
}