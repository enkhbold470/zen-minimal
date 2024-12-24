"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import products from "@/data/laptops.json"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share"
import { z } from "zod"

import { env } from "@/env.mjs"
import { Product } from "@/types/productTypes"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Хэрэглэгчийн нэр хамгийн багадаа 2 тэмдэгт байх ёстой.",
  }),
  phoneNumber: z.string().min(8, {
    message: "Утасны дугаар хамгийн багадаа 8 тэмдэгт байх ёстой.",
  }),
  email: z.string().email({ message: "Зөв и-мэйл хаяг оруулна уу." }),
  laptopChoice: z.string(),
})

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`/api/laptops?populate=*&randomSort=true`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      })

      const data = await response.json()
      // console.log(data)
      return data
    }
    fetchProducts().then((data) => setProducts(data.data))
  }, [])
  const product = products.find((product) => product.id === Number(params.slug))
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0]?.url || "/logo.svg")
    }
  }, [product])

  //Fetch other products
  const otherProducts = products
    .filter((p) => p.id !== Number(params.slug))
    .slice(0, 3)

  // Form validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
      laptopChoice: "",
    },
  })
  // Handle form submission
  const handleRequestPurchase = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      values.laptopChoice = product?.title + "?id=" + product?.id || ""
      // Close the dialog immediately

      // Send POST request to your API endpoint
      // const response = await fetch(
      //   `${process.env.NEXT_PUBLIC_PURCHASE_FUNCTIONS_URL}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${process.env.PURCHASE_BEARER_TOKEN}`,
      //     },
      //     body: JSON.stringify(values),
      //   }
      // )

      const response = await fetch(`${process.env.NEXT_PUBLIC_SHEETS_URL}`, {
        method: "POST",
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to send request.")
      }

      // Show success toast
      toast({
        title: `Хүсэлт илгээгдлээ ${product?.title}!`,
        description: `Баярлалаа, ${values.username}. Бид удахгүй тантай холбогдох болно.`,
        variant: "default",
      })
      setIsSubscribed(true)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      // Show error toast
      toast({
        title: "Алдаа гарлаа!",
        description: "Хүсэлт илгээх явцад алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      })

      // console.error(error)
    }
    setTimeout(() => {
      setIsSubscribed(false)
      closeDialog()
    }, 3000)
  }

  // If product is not found, show loading state
  if (!product) {
    return (
      <div className="flex animate-pulse items-center justify-center text-2xl">
        Ачааллаж байна...
      </div>
    )
  }

  const savingsAmount = product.originalPrice - product.price

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 border-b border-gray-200 pb-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg">
            {/** Show images of the product, if there is no image we will show default logo */}
            <div className="flex flex-col space-y-4">
              {/* Main image */}
              {/* Image Section */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={selectedImage || "/logo.svg"}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    width={600}
                    height={600}
                    priority
                  />
                </div>

                {/* Thumbnails */}
                <div className="aspect-w-1 aspect-h-1 grid grid-cols-4 gap-2">
                  {product.images?.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-square cursor-pointer overflow-hidden rounded-lg border ${
                        selectedImage === image.url
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <Image
                        src={image.url}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        width={150}
                        height={150}
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/** Show video of unboxing, embed youtube link, if there is nothing in product.video we will show nothing*/}
            {product.video && (
              <div className="border-shadow mt-4 aspect-video rounded-lg">
                <h2 className="my-2 text-xl font-semibold">
                  Бүтээгдэхүүний видео
                </h2>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${product.video.split("v=")[1]}?rel=0&loop=1&color=white&autoplay=1&mute=1`}
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            )}
          </div>
        </div>
        {/** Product details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mb-2 flex items-baseline">
            <span className="text-2xl font-bold">
              ₮{product.price.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₮
              {product.originalPrice
                .toFixed()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            <Badge variant="destructive" className="ml-2">
              Хэмнэлт ₮
              {(product.originalPrice - product.price)
                .toFixed()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Badge>
          </div>
          <Button
            size="lg"
            className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-400"
            onClick={handleRequestPurchase}
          >
            <Send className="mr-2 h-5 w-5" />
            Худалдан авах хүсэлт илгээх
          </Button>
          {/** share buttons */}
          <div className="flex space-x-2">
            <div className="flex items-center">Share:</div>

            <FacebookShareButton
              url={window.location.href}
              hashtag="#ZenStore.enk.icu"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton
              url={window.location.href}
              title={product.title}
              separator=" - "
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <ViberShareButton
              url={window.location.href}
              title={product.title}
              separator=" - "
            >
              <ViberIcon size={32} round />
            </ViberShareButton>
            <LinkedinShareButton url={window.location.href}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <TwitterShareButton
              url={window.location.href}
              title={product.title}
              via="ZenStore"
              hashtags={["ZenStore", "Laptop"]}
              related={["ZenStore"]}
            >
              <XIcon size={32} round />
            </TwitterShareButton>
            <TelegramShareButton
              url={window.location.href}
              title={product.title}
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
            <EmailShareButton url={window.location.href}>
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>

          {/** product specs */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Үзүүлэлтүүд</h2>
            <ul className="list-inside list-disc space-y-2">
              <ReactMarkdown
                components={{
                  // Customize h3 (###)
                  h3: ({ node, ...props }) => (
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                      }}
                      {...props}
                    />
                  ),
                  // Customize strong (**)
                  strong: ({ node, ...props }) => (
                    <strong
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        opacity: 0.7,
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {product.specs}
              </ReactMarkdown>
            </ul>
          </div>
          {/** product description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Тайлбар</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      {/** Cards for other products */}

      <h2 className="my-12 text-2xl font-semibold">Бусад бараанууд</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {otherProducts.map((product) => (
          <Card key={product?.id} className="flex flex-col">
            <CardContent className="p-4">
              <div className="relative mb-4 flex aspect-square items-center">
                <Image
                  src={
                    product.images?.length > 0
                      ? product.images[0].url
                      : "/logo.svg"
                  }
                  alt={product.title}
                  width={500}
                  height={500}
                  priority={true}
                />
              </div>
              <h2 className="mb-2 text-xl font-semibold">{product.title}</h2>
              {/* <div className="mb-2 flex items-center">
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
              </div> */}
              <div className="mb-2 flex items-baseline">
                <span className="text-2xl font-bold">
                  ₮
                  {product.price
                    .toFixed()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₮
                  {product.originalPrice
                    .toFixed()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
                <Badge variant="destructive" className="ml-2">
                  Хэмнэлт ₮
                  {(product.originalPrice - product.price)
                    .toFixed()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                variant="default"
                asChild
                className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-400"
              >
                <Link href={`/products/${product.id}`}>Дэлгэрэнгүй</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/** Dialog for purchase request */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Худалдан авах хүсэлт</DialogTitle>
            <DialogDescription>
              Доорх маягтыг бөглөж {product.title} худалдан авах хүсэлтээ
              илгээнэ үү.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нэр, Овог</FormLabel>
                    <FormControl>
                      <Input placeholder="Нэр, Овог" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Утасны дугаар</FormLabel>
                    <FormControl>
                      <Input placeholder="92120293" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>И-мэйл хаяг</FormLabel>
                    <FormControl>
                      <Input placeholder="boldoo@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="default"
                  type="submit"
                  className=" rounded-full bg-blue-400 text-white hover:bg-blue-500"
                >
                  {isLoading ? (
                    <h1 className="animate-pulse">Илгээж байна...</h1>
                  ) : isSubscribed ? (
                    <h1 className="font-bold text-green-500">Илгээгдсэн!</h1>
                  ) : (
                    <h1 className="font-bold">Илгээх</h1>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-full"
                  onClick={closeDialog}
                >
                  Цуцлах
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
