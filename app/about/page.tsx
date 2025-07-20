import Image from "next/image"

import { siteConfig } from "@/config/site"
import { Card, CardContent } from "@/components/ui/card"
import Breadcrumb from "@/components/Breadcrumb"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Тухай" }
        ]}
      />
      <h1 className="mb-8 text-3xl font-bold">Тухай</h1>
      <Card className="grid items-center lg:grid-cols-3">
        <CardContent className="p-4">
          <div className="relative">
            <Image
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
          <p>{siteConfig.about}</p>
        </CardContent>

        <CardContent className="p-4">
          <h2 className="mb-4 text-2xl font-bold">Зорилт</h2>
          <p>{siteConfig.goal}</p>
        </CardContent>
      </Card>
    </div>
  )
}
