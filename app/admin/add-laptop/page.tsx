import { AddLaptopForm } from "./add-laptop-form"

export default function AddLaptopPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-foreground">
          Add New Laptop
        </h1>
        <AddLaptopForm />
      </div>
    </div>
  )
}
