import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { shuffleArray, commafy } from "@/lib/utils"
import { Laptop } from "@/types/productTypes"


export default function OtherProducts({ products }: { products: Laptop[] }) {
  return (
    <div>
      {/* Other products in random order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shuffleArray(products).slice(0, 3).map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
                <Card
                  className="group flex flex-col overflow-hidden rounded-xl border-0 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <CardContent className="flex-grow p-3 pb-2 sm:p-4 sm:pb-2">
                    <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg sm:mb-4">
                      <Image
                        src={product.Image[0].url}
                        alt={product.Image[0].alt || product.title}      
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
                    <span className="text-xl lg:text-2xl font-bold">
                      {commafy(Math.round(product.price / 100) * 100)}
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
        ))}
      </div>

    </div>
  );
}
