"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import { z } from "zod"

import { Laptop } from "@/types/productTypes"
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
import ShareButtons from "@/components/shareButtons"

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
  const [products, setProducts] = useState<Laptop[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form validation and handlers (moved up)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
      laptopChoice: "", // This will be updated later if product exists
    },
  })

  const handleRequestPurchase = () => setIsDialogOpen(true)
  const closeDialog = () => setIsDialogOpen(false)

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/laptops`)
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`)
          setProducts([])
          return
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, []) // Removed params.slug as dependency, products list is independent of current slug

  // Derive product from products list after fetch
  // This calculation can stay here as it's not a hook and depends on `products` state.
  const product =
    !isLoading && products.length > 0
      ? products.find((p) => p.id == Number(params.slug))
      : null

  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl || "/logo.svg")
      // Update form's default/current value for laptopChoice if product changes
      form.setValue("laptopChoice", product.title + "?id=" + product.id || "")
    } else {
      // Reset selected image if no product or product is not found
      setSelectedImage(null)
      form.setValue("laptopChoice", "")
    }
  }, [product, form]) // Added form to dependency array as per eslint exhaustive-deps rule

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Ensure product is available before proceeding with submission logic if needed
    if (!product) {
      toast({
        title: "Алдаа!",
        description: "Бүтээгдэхүүн олдсонгүй. Дахин оролдоно уу.",
        variant: "destructive",
      })
      return
    }
    try {
      setIsLoading(true) // Re-use isLoading for form submission indication
      // values.laptopChoice is already set by the form or updated by useEffect

      const response = await fetch(`${process.env.NEXT_PUBLIC_SHEETS_URL}`, {
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
      closeDialog() // Close dialog on success
    } catch (error) {
      toast({
        title: "Алдаа гарлаа!",
        description: "Хүсэлт илгээх явцад алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false) // Reset loading state
      // Optional: Reset isSubscribed after a delay if needed, or manage it differently
      setTimeout(() => {
        setIsSubscribed(false)
        // closeDialog() // Moved to success path
      }, 3000)
    }
  }

  // Conditional Rendering starts here
  if (isLoading && !product) {
    // Show main loading if still fetching products and product isn't derived yet
    return (
      <div className="flex animate-pulse items-center justify-center text-2xl">
        Ачааллаж байна...
      </div>
    )
  }

  if (!product) {
    // If, after loading, product is still not found
    return (
      <div className="flex items-center justify-center text-2xl">
        Product with ID {params.slug} not found.
      </div>
    )
  }

  // Main component render once product is available
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 border-b border-gray-200 pb-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg">
            <div className="flex flex-col space-y-4">
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={selectedImage || "/logo.svg"} // Use state for selectedImage
                    alt={product.title}
                    className="h-full w-full object-cover"
                    width={600}
                    height={600}
                    priority
                  />
                </div>
                <div className="aspect-w-1 aspect-h-1 grid grid-cols-4 gap-2">
                  {product.imageUrl && (
                    <div
                      className={`aspect-square cursor-pointer overflow-hidden rounded-lg border ${
                        selectedImage === product.imageUrl
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(product.imageUrl)} // Use state setter
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        width={150}
                        height={150}
                        priority
                      />
                    </div>
                  )}
                  {/* Add more thumbnails if product.imageUrls (plural) exists and is an array */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" space-y-6 ">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="jutify-between mb-2 flex items-center gap-2">
            <Badge variant="default">{product.discount}</Badge>
            <span className="text-2xl font-bold text-primary">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through">
                ${product.originalPrice}
              </span>
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
          <ReactMarkdown className="prose max-w-none">
            {product.description}
          </ReactMarkdown>

          <Button onClick={handleRequestPurchase} size="lg" className="w-full">
            Худалдан авах хүсэлт илгээх <Send className="ml-2 h-5 w-5" />
          </Button>

          <ShareButtons product={product} />
        </div>
      </div>

      {/* TODO: Add otherProducts section if needed, ensuring it also handles loading/empty states correctly */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Худалдан авах хүсэлт</DialogTitle>
                <DialogDescription>
                  Таны сонгосон бүтээгдэхүүн: {product.title}. Хүсэлтээ бөглөнө
                  үү.
                </DialogDescription>
              </DialogHeader>
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
