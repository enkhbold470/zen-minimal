import Image from "next/image"
import Link from "next/link"
import { getPublishedLaptops } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { CometCard } from "@/components/ui/comet-card"
import { CardContent, CardFooter } from "@/components/ui/card"
import { commafy, shuffleArray } from "@/lib/utils"
import HeroCarousel from "@/components/HeroCarousel"

// Force dynamic rendering - prevents Vercel from caching this page
// This ensures the shuffle logic runs fresh on every request
export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getPublishedLaptops()
  // console.log(products)
  const featuredProducts = shuffleArray(products).slice(0,4)
  // console.log(featuredProducts)

  return (
    <div className="min-h-screen bg-background pt-2 md:pt-0">
      {/* Hero Section */}
      <HeroCarousel featuredProducts={featuredProducts} />

      {/* Featured Products */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight">Онцлох бараанууд</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <CometCard key={product.id}>
              <Link href={`/products/${product.id}`}>
              <div 
                className="my-10 flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 saturate-0 md:my-20 md:p-4"
                >
                <div className="mx-2 flex-1">
                  <div className="relative mt-2 aspect-[3/4] w-full">
                    <Image
                      src={product.Image[0]?.url || `https://placekeanu.com/400/300`}
                      alt={product.title}
                      fill
                      className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover contrast-75"
                      />
                  </div>
                </div>
                <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                  <div className="text-xs line-clamp-1">{product.title}</div>
                  <div className="text-xs text-gray-300 opacity-50">{commafy(Math.round(product.price / 100) * 100)}</div>
                </div>
              </div>
                        </Link>
            </CometCard>
          ))}
        </div>
      </section>
    </div>
  )
}
