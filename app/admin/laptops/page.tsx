import Image from "next/image"
import Link from "next/link"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getLaptops } from "@/app/actions"

import { DeleteLaptopButton } from "./delete-button"

export default async function LaptopsAdminPage() {
  const laptops = await getLaptops()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Laptops</h1>
          <p className="mt-2 text-muted-foreground">
            View, edit, and delete laptop listings
          </p>
        </div>
        <Link href="/admin/add-laptop">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </Link>
      </div>

      {laptops.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No laptops found</h2>
          <p className="mt-2 text-muted-foreground">
            Get started by creating your first laptop
          </p>
          <Link href="/admin/add-laptop" className="mt-4">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Laptop
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {laptops.map((laptop) => (
            <Card key={laptop.id}>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1">{laptop.title}</CardTitle>
                <CardDescription>${laptop.price.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {laptop.images.length > 0 ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-md">
                    <Image
                      src={laptop.images[0].url}
                      alt={laptop.images[0].alt || laptop.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 w-full items-center justify-center rounded-md bg-gray-100">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
                <div className="mt-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {laptop.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <Link href={`/admin/laptops/${laptop.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <DeleteLaptopButton id={laptop.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
