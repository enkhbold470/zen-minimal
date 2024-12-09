"use client"

import { useEffect, useState } from "react"
import products from "@/data/laptops.json"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
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
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([])
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
    },
  })

  const handleRequestPurchase = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast({
      title: `Хүсэлт илгээгдлээ ${product?.title}!`,
      description: `Баярлалаа, ${values.username}. Бид удахгүй тантай холбогдох болно.`,
    })
    closeDialog()
  }

  if (!product) {
    return (
      <div className="container mx-auto flex justify-center px-4 py-8">
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
                className="rounded-lg object-cover"
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
            <h2 className="text-xl font-semibold">Key Features</h2>
            <ul className="list-inside list-disc space-y-2">{product.specs}</ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
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
                <Button type="submit">Илгээх</Button>
                <Button variant="outline" onClick={closeDialog}>
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
