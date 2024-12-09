"use client"

import { useEffect, useState } from "react"
import products from "@/data/laptops.json"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import { z } from "zod"

import { env } from "@/env.mjs"
import { Product } from "@/types/productTypes"
import { useToast } from "@/hooks/use-toast"
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
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `http://${env.NEXT_PUBLIC_SERVER_URL}/api/laptops?populate=images`
      )

      const data = await response.json()
      console.log(data)
      return data
    }
    fetchProducts().then((data) => setProducts(data.data))
  }, [])
  const product = products.find((product) => product.id === Number(params.slug))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
      laptopChoice: "",
    },
  })

  const handleRequestPurchase = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

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
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={product.title}
                className="mb-2 h-full w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
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
          <Button size="lg" className="w-full" onClick={handleRequestPurchase}>
            <Send className="mr-2 h-5 w-5" />
            Худалдан авах хүсэлт илгээх
          </Button>
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Тайлбар</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
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
                      <Input
                        placeholder="Оюун-Эрдэнэ Лувсаннамсрай"
                        {...field}
                      />
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
                <Button variant="default" type="submit">
                  {isLoading ? (
                    <h1 className="animate-pulse">Илгээж байна...</h1>
                  ) : isSubscribed ? (
                    <h1 className="font-bold text-green-500">Илгээгдсэн!</h1>
                  ) : (
                    <h1 className="font-bold">Илгээх</h1>
                  )}
                </Button>
                <Button variant="destructive" onClick={closeDialog}>
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
