"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Copy, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import { z } from "zod"

import { Laptop } from "@/types/productTypes"
import {
  checkPercentage,
  commafy,
  copyToClipboard,
  getYoutubeId,

} from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ShareButtons from "@/components/shareButtons"
import { getPublishedLaptops } from "@/app/actions"
import Breadcrumb from "@/components/Breadcrumb"
import { shuffleArray } from "@/lib/utils"
import Link from "next/link"
import OtherProducts from "./otherProducs"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Хэрэглэгчийн нэр хамгийн багадаа 2 тэмдэгт байх ёстой.",
  }),
  phoneNumber: z.string().min(8, {
    message: "Утасны дугаар хамгийн багадаа 8 тэмдэгт байх ёстой.",
  }),
  email: z.string().email({ message: "Зөв и-мэйл хаяг оруулна уу." }),
  laptopChoice: z.string(),
  productLink: z.string(),
})

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [products, setProducts] = useState<Laptop[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)           
  const [slug, setSlug] = useState<string>("")
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      laptopChoice: "",
      phoneNumber: "",
      email: "",
      productLink: "",
    },
  })

  const handleRequestPurchase = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  // Handle async params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getParams()
  }, [params])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const data = await getPublishedLaptops()
        if (!data) {
          setProducts([])
          return
        }
        setProducts(data as unknown as Laptop[])
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const product =
    !isLoading && products.length > 0 && slug
      ? products.find((p) => p.id == Number(slug))
      : null

  useEffect(() => {
    if (product) {
      setSelectedImage(
        product.Image && product.Image.length > 0
          ? product.Image[0].url
          : "/logo.svg"
      )
      form.setValue("laptopChoice", product.title || "")
      form.setValue("productLink", `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}`)
    } else {
      setSelectedImage(null)
      form.setValue("laptopChoice", "")
      form.setValue("productLink", "")
    }
  }, [product, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!product) {
      toast({
        title: "Алдаа!",
        description: "Бүтээгдэхүүн олдсонгүй. Дахин оролдоно уу.",
        variant: "destructive",
      })
      return
    }
    try {
      setIsLoading(true)
      const response = await fetch(`/api/interest-form`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          productLink: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}`
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send request.")
      }

      toast({
        title: "✅ Захиалга баталгаажлаа!",
        description: `Баярлалаа, ${values.username}. Дэлгэрэнгүй мэдээллийг и-мэйлээр илгээнэ. И-мэйлээ шалгана уу. 📧`,
        variant: "default",
      })
      setIsSubscribed(true)
      closeDialog()
    } catch {
      toast({
        title: "Алдаа гарлаа!",
        description: "Хүсэлт илгээх явцад алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setIsSubscribed(false)
      }, 3000)
    }
  }

  if (isLoading && !product) {
    return (
      <div className="flex animate-pulse items-center justify-center text-2xl">
        Ачааллаж байна...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center text-2xl">
        Product with ID {slug} not found.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Breadcrumb
          items={[
            { label: "Бүтээгдэхүүнүүд", href: "/products" },
            { label: product?.title || "Бүтээгдэхүүн" }
          ]}
        />
      </div>
      <div className="grid gap-6 border-b border-gray-200 pb-6 sm:gap-8 sm:pb-8 lg:grid-cols-2">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <Image
                src={selectedImage || "/logo.svg"}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                width={600}
                height={600}
                priority
              />
            </div>
            {product.Image && product.Image.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.Image.map((image) => (
                  <div
                    key={image.id}
                    className={`aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      selectedImage === image.url
                        ? "border-primary shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || "Laptop Image"}
                      className="h-full w-full object-cover transition-transform duration-200 hover:scale-110"
                      width={150}
                      height={150}
                      priority
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 sm:mt-8">
              <h2 className="mb-3 text-lg font-semibold sm:text-xl">
                Бүтээгдэхүүн видео
              </h2>
              {product.videoUrl && getYoutubeId(product.videoUrl) && (
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYoutubeId(product.videoUrl)}?rel=0&loop=1&color=white&mute=1`}
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">{product.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
                {commafy(Math.round(product.price / 100) * 100)} ₮
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-gray-500 line-through sm:text-lg lg:text-xl">
                  {commafy(Math.round(product.originalPrice / 100) * 100)} ₮
                </span>
              )}
              {product.discount && (
                <Badge variant="outline" className="border-red-500 text-red-600">
                  {product.discount} Хямд
                </Badge>
              )}
            </div>
          </div>
          
          <div className="rounded-xl bg-gray-50 p-4 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Онцлог</h2>
            <ul className="space-y-2">
              {product.specs.map((spec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                  <span className="text-gray-700">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="rounded-xl bg-white border border-gray-200 p-4 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Дэлгэрэнгүй мэдээлэл</h2>
            <div className="prose prose-sm max-w-none text-gray-700 sm:prose-base">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>
          
          <div className="sticky bottom-4 z-10 space-y-3 rounded-xl bg-white p-4 shadow-lg border border-gray-200 sm:static sm:bg-transparent sm:p-0 sm:shadow-none sm:border-0">
            <Button
              onClick={handleRequestPurchase}
              size="lg"
              variant="default"
              className="w-full rounded-xl py-4 text-base font-semibold sm:text-lg"
            >
              Худалдан авах хүсэлт илгээх <Send className="ml-2 h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <ShareButtons product={product} />
            </div>
          </div>
          
          <div className="block sm:hidden">
            <ShareButtons product={product} />
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-3 max-h-[90vh] overflow-y-auto rounded-xl sm:mx-auto sm:max-w-[500px]">
          <Form {...form}>
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <DialogTitle className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Худалдан авах хүсэлт
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-gray-600 sm:text-base">
                  {product.title} - Хүсэлтээ бөглөнө үү
                </DialogDescription>
              </div>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">Хэрэглэгчийн нэр</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Нэрээ оруулна уу" 
                          className="rounded-lg py-3 text-base focus:ring-2 focus:ring-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">Утасны дугаар</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Утасны дугаараа оруулна уу"
                          className="rounded-lg py-3 text-base focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">И-мэйл</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="И-мэйл хаягаа оруулна уу"
                          className="rounded-lg py-3 text-base focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="flex-col gap-3 pt-4 sm:flex-row sm:gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    disabled={isLoading && !isSubscribed}
                    className="w-full rounded-lg py-3 text-base sm:w-auto"
                  >
                    Цуцлах
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading && !isSubscribed}
                    className="w-full rounded-lg py-3 text-base font-semibold sm:w-auto"
                  >
                    {isLoading && !isSubscribed
                      ? "Илгээж байна..."
                      : isSubscribed
                        ? "Илгээгдлээ!"
                        : "Илгээх"}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="mt-8 sm:mt-12">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Бусад бүтээгдэхүүнүүд</h2>
        <OtherProducts products={products} />
      </div>
    </div>
  )
}
