import { notFound } from "next/navigation"

import { prisma } from "@/lib/prisma"

import { EditLaptopForm } from "./edit-form"

interface EditLaptopPageProps {
  params: {
    id: string
  }
}

export default async function EditLaptopPage({ params }: EditLaptopPageProps) {
  const laptopId = parseInt(params.id, 10)

  // Fetch the laptop with its images
  const laptop = await prisma.laptop.findUnique({
    where: { id: laptopId },
    include: { images: { orderBy: { position: "asc" } } },
  })

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

      <EditLaptopForm laptop={laptop} />
    </div>
  )
}
