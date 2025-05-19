"use client"

// Convert to client component
import { useEffect, useMemo, useState } from "react" // Import useState, useEffect, useMemo
import Image from "next/image"
import Link from "next/link"
import { Pencil, Plus, Search, Trash2 } from "lucide-react" // Import Search icon

import { Laptop } from "@/types/productTypes" // Import Laptop type
import { commafy } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input" // Import Input component
import { getLaptops } from "@/app/actions"

import { DeleteLaptopButton } from "./delete-button"

export default function LaptopsAdminPage() {
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchLaptops() {
      try {
        setIsLoading(true)
        const data = await getLaptops()
        setLaptops(data || [])
        setError(null)
      } catch (err) {
        console.error("Failed to fetch laptops:", err)
        setError("Failed to load laptops. Please try again.")
        setLaptops([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchLaptops()
  }, [])

  const filteredLaptops = useMemo(() => {
    if (!searchTerm) {
      return laptops
    }
    return laptops.filter(
      (laptop) =>
        laptop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        laptop.description.toLowerCase().includes(searchTerm.toLowerCase())
      // Add more fields to search if needed, e.g., specs
      // laptop.specs.join(', ').toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [laptops, searchTerm])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold">Manage Laptops</h1>
          <p className="mt-2 text-muted-foreground">
            View, edit, and delete laptop listings
          </p>
        </div>
        <Link href="/admin/add-laptop">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or description..."
            className="w-full rounded-lg bg-background py-2 pl-10 pr-4 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-xl">Loading laptops...</p>
        </div>
      )}
      {!isLoading && error && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-destructive/10 p-8 text-center text-destructive">
          <h2 className="text-xl font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}
      {!isLoading && !error && filteredLaptops.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No laptops found</h2>
          <p className="mt-2 text-muted-foreground">
            {searchTerm
              ? `No laptops match your search for "${searchTerm}". Try a different term or clear the search.`
              : "Get started by creating your first laptop."}
          </p>
          {!searchTerm && (
            <Link href="/admin/add-laptop" className="mt-4">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Laptop
              </Button>
            </Link>
          )}
        </div>
      )}
      {!isLoading && !error && filteredLaptops.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLaptops.map((laptop) => (
            <Card key={laptop.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1 h-6" title={laptop.title}>
                  {laptop.title}
                </CardTitle>
                <CardDescription>₮{commafy(laptop.price)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-4 pt-0">
                {laptop.images && laptop.images.length > 0 ? (
                  <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md">
                    <Image
                      src={laptop.images[0].url}
                      alt={laptop.images[0].alt || laptop.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="mb-3 flex aspect-video w-full items-center justify-center rounded-md bg-muted">
                    <p className="text-sm text-muted-foreground">No image</p>
                  </div>
                )}
                <div className="mt-2">
                  <p className="h-15 line-clamp-3 text-sm text-muted-foreground">
                    {laptop.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="mt-auto flex justify-between border-t p-4">
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
