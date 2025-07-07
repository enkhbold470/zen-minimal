import { notFound } from "next/navigation"

import { EditLaptopPageProps, Laptop } from "@/types/productTypes"
import { getLaptopById } from "@/app/actions/laptopActions"

import { EditLaptopForm } from "./edit-form"

export default async function EditLaptopPage({ params }: EditLaptopPageProps) {
  const { id } = await params
  const laptopId = parseInt(id, 10)

  // Fetch the laptop with its images using cached function
  const laptop = await getLaptopById(laptopId)

  if (!laptop) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Laptop</h1>
        <p className="mt-2 text-muted-foreground">
          Update laptop details and manage images
        </p>
      </div>

      <EditLaptopForm laptop={laptop as unknown as Laptop} />
    </div>
  )
}
