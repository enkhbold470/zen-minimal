import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {siteConfig} from "@/config/site"
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Тухай</h1>
      <Card className="grid lg:grid-cols-3 items-center">
        <CardContent className="p-4">
          <div className="relative">
            <img
              src="/android-chrome-512x512.png"
              alt={siteConfig.name}
              width={500}
              height={500}
              className="rounded-full "
            />
          </div>
          
        </CardContent>
        <CardContent className="p-4">
          <h2 className="mb-4 text-2xl font-bold">{siteConfig.name}</h2>
          <p>
            {siteConfig.about}
          </p>
        </CardContent>
      
        <CardContent className="p-4">
          <h2 className="mb-4 text-2xl font-bold">Зорилт</h2>
          <p>
            {siteConfig.goal}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
