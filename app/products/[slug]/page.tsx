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
import { Input } from "@/components/ui/input"
import ShareButtons from "@/components/shareButtons"
import { getPublishedLaptops } from "@/app/actions"

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
        product.images && product.images.length > 0
          ? product.images[0].url
          : "/logo.svg"
      )
      form.setValue("laptopChoice", product.title + "?id=" + product.id || "")
    } else {
      setSelectedImage(null)
      form.setValue("laptopChoice", "")
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
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to send request.")
      }

      toast({
        title: `Хүсэлт илгээгдлээ ${product?.title}!`,
        description: `Баярлалаа, ${values.username}. Бид удахгүй тантай холбогдох болно.`,
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 border-b border-gray-200 pb-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg">
            <div className="flex flex-col space-y-4">
              <div className="space-y-4">
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
                <div className="aspect-w-1 aspect-h-1 grid grid-cols-4 gap-2">
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className={`aspect-square cursor-pointer overflow-hidden rounded-lg border ${
                        selectedImage === image.url
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || "Laptop Image"}
                        className="h-full w-full object-cover"
                        width={150}
                        height={150}
                        priority
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 ">
                <h2 className="mb-2 text-xl font-semibold">
                  Бүтээгдэхүүн видео
                </h2>
              </div>
              {product.videoUrl && getYoutubeId(product.videoUrl) && (
                <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg border">
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
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mb-2 flex items-center gap-2">
            {/* this is price */}
            <span className="text-2xl font-bold text-primary">
              {commafy(product.price)}₮
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through">
                {commafy(product.originalPrice)}₮
              </span>
            )}

            {/* this is discount badge */}
            {product.discount && checkPercentage(product.discount) && (
              <Badge variant="outline" className="text-xl">
                {product.discount} Хямдралтай
              </Badge>
            )}
            {product.discount && !checkPercentage(product.discount) && (
              <Badge variant="outline" className="text-xl">
                {commafy(product.discount)}₮ Хямдралтай
              </Badge>
            )}
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">Онцлог</h2>
            <ul className="list-disc space-y-1 pl-5">
              {product.specs.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
          <div className="prose max-w-none">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </div>
          {/* product id */}{" "}
          <span className="text-sm">
            <Button
              onClick={() => {
                copyToClipboard(
                  `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}`
                )
                toast({
                  title: "Хуулагдлаа",
                  description: "Линк амжилттай хуулагдлаа.",
                })
              }}
              className="cursor-pointer"
              variant="outline"
            >
              Бүтээгдэхүүний Регистер ID:{" "}
              <span className="text-bold text-orange-500">
                {product.id.toString()}
              </span>
              <Copy className="ml-2 h-5 w-5" />
            </Button>
          </span>
          <Button
            onClick={handleRequestPurchase}
            size="lg"
            variant="default"
            className="w-full text-xl"
          >
            Худалдан авах хүсэлт илгээх <Send className="ml-2 h-5 w-5" />
          </Button>
          <ShareButtons product={product} />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <DialogTitle>
              Бүтээгдэхүүн: {product.title} - Регистер: {product.id}
            </DialogTitle>
            <DialogDescription>Хүсэлтээ бөглөнө үү.</DialogDescription>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хэрэглэгчийн нэр</FormLabel>
                    <FormControl>
                      <Input placeholder="Нэрээ оруулна уу" {...field} />
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
                      <Input
                        placeholder="Утасны дугаараа оруулна уу"
                        {...field}
                      />
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
                    <FormLabel>И-мэйл</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="И-мэйл хаягаа оруулна уу"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={isLoading && !isSubscribed}
                >
                  Цуцлах
                </Button>
                <Button type="submit" disabled={isLoading && !isSubscribed}>
                  {isLoading && !isSubscribed
                    ? "Илгээж байна..."
                    : isSubscribed
                      ? "Илгээгдлээ!"
                      : "Илгээх"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
