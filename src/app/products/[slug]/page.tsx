"use client"

import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
import products from "@/data/laptops.json"
// Form from https://ui.shadcn.com/docs/components/form
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

// Form schema username, phon number, email
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((product) => product.id === params.slug)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const handleRequestPurchase = () => {
    setIsDialogOpen(true)
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>
  }

  const savingsAmount = product.originalPrice - product.price

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            {/* map images*/}
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={product.title}
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Pricing */}
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
            <Badge className="ml-2">Save ${savingsAmount.toFixed(2)}</Badge>
          </div>

          {/* Purchase Button */}
          <Button size="lg" className="w-full" onClick={handleRequestPurchase}>
            <Send className="mr-2 h-5 w-5" />
            Request to Purchase
          </Button>

          {/* Key Features */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Key Features</h2>
            <ul className="list-inside list-disc space-y-2">
              {product.specs.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request to Purchase</DialogTitle>
            <DialogDescription>
              Please fill out the form below to request the purchase of{" "}
              {product.title}.
            </DialogDescription>
          </DialogHeader>
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your phone number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                onClick={() => {
                  toast({
                    title: "Request submitted for " + product.title + "!",
                    description:
                      "Your request has been submitted successfully, " +
                      form.getValues().username +
                      ". We will contact you within 72 hours.",
                  })
                  setIsDialogOpen(false)
                }}
              >
                Submit
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
