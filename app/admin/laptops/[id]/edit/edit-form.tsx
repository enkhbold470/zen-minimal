"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MoveDown, MoveUp, Trash2, XCircle } from "lucide-react"

import { Laptop } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { deleteImage, updateImagePositions, updateLaptop } from "@/app/actions"
import { ImageItem } from "@/app/actions/laptopTypes"

interface EditLaptopFormProps {
  laptop: Laptop & {
    images: ImageItem[]
  }
}

export function EditLaptopForm({ laptop }: EditLaptopFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<ImageItem[]>(
    laptop.images
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  // Handle image selection for new images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles)
      setNewImageFiles((prevFiles) => [...prevFiles, ...newFiles])

      // Create URL previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setNewImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
    }
  }

  // Remove a new image from the selection
  const removeNewImage = (index: number) => {
    setNewImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))

    // Revoke the URL object to free memory
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    )
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      // Create a FormData instance from the form
      const formData = new FormData(e.currentTarget)

      // Add any new image files
      formData.delete("newImages") // Remove any existing data
      newImageFiles.forEach((file) => {
        formData.append("newImages", file)
      })

      // Submit the form
      const result = await updateLaptop(laptop.id, formData)

      if (result.success) {
        setIsSuccess(true)
        setMessage(result.message || "Laptop updated successfully")
        // Reset new image files
        setNewImageFiles([])
        setNewImagePreviews([])
        // Refresh the router to get updated data
        router.refresh()
      } else {
        setIsSuccess(false)
        setMessage(result.message || "Failed to update laptop")
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage("An unexpected error occurred. Please try again.")
      console.error("Error updating laptop:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete an existing image
  const handleDeleteImage = async (imageId: number) => {
    try {
      const result = await deleteImage(imageId)
      if (result.success) {
        // Update the local state
        setExistingImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        )
        // Refresh the router to get updated data
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  // Move image up or down
  const moveImage = async (imageId: number, direction: "up" | "down") => {
    const imagesCopy = [...existingImages]
    const index = imagesCopy.findIndex((img) => img.id === imageId)

    if (index === -1) return

    if (direction === "up" && index > 0) {
      // Swap with the previous image
      ;[imagesCopy[index - 1], imagesCopy[index]] = [
        imagesCopy[index],
        imagesCopy[index - 1],
      ]
    } else if (direction === "down" && index < imagesCopy.length - 1) {
      // Swap with the next image
      ;[imagesCopy[index], imagesCopy[index + 1]] = [
        imagesCopy[index + 1],
        imagesCopy[index],
      ]
    } else {
      return // Can't move further
    }

    // Update the position values
    const updatedImages = imagesCopy.map((img, i) => ({
      id: img.id,
      position: i,
    }))

    try {
      const result = await updateImagePositions(updatedImages)
      if (result.success) {
        // Update local state with new positions
        setExistingImages(imagesCopy)
        // Refresh the router
        router.refresh()
      }
    } catch (error) {
      console.error("Error reordering images:", error)
    }
  }

  const commonInputClass =
    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-8 rounded-lg bg-white p-8 shadow-md"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <Separator className="my-4" />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={laptop.title}
            className={commonInputClass}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={6}
            required
            defaultValue={laptop.description}
            className={commonInputClass}
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="specs"
            className="block text-sm font-medium text-gray-700"
          >
            Specifications (comma-separated)
          </label>
          <input
            type="text"
            name="specs"
            id="specs"
            required
            defaultValue={laptop.specs.join(", ")}
            className={commonInputClass}
            placeholder="e.g. 16GB RAM, 512GB SSD, Intel i7"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              step="0.01"
              required
              defaultValue={laptop.price}
              className={commonInputClass}
            />
          </div>
          <div>
            <label
              htmlFor="originalPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Original Price
            </label>
            <input
              type="number"
              name="originalPrice"
              id="originalPrice"
              step="0.01"
              required
              defaultValue={laptop.originalPrice}
              className={commonInputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount (e.g., 10% off, $50 off)
          </label>
          <input
            type="text"
            name="discount"
            id="discount"
            defaultValue={laptop.discount || ""}
            className={commonInputClass}
          />
        </div>

        <div>
          <label
            htmlFor="videoUrl"
            className="block text-sm font-medium text-gray-700"
          >
            YouTube Video URL
          </label>
          <input
            type="url"
            name="videoUrl"
            id="videoUrl"
            placeholder="https://www.youtube.com/watch?v=..."
            defaultValue={laptop.videoUrl || ""}
            className={commonInputClass}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Image Management</h2>
          <Separator className="my-4" />
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Images</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {existingImages.map((image, index) => (
                <div
                  key={image.id}
                  className="flex items-center rounded-lg border p-3"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-md">
                    <Image
                      src={image.url}
                      alt={image.alt || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => moveImage(image.id, "up")}
                      >
                        <MoveUp className="h-4 w-4" />
                        <span className="sr-only">Move up</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={index === existingImages.length - 1}
                        onClick={() => moveImage(image.id, "down")}
                      >
                        <MoveDown className="h-4 w-4" />
                        <span className="sr-only">Move down</span>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Position: {image.position + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Images</h3>
          <input
            type="file"
            id="newImages"
            name="newImages"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />

          {/* New image preview section */}
          {newImagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {newImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`New image ${index + 1}`}
                    className="h-24 w-24 rounded-md object-cover"
                    width={96}
                    height={96}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-white text-red-500"
                  >
                    <XCircle size={20} />
                    <span className="sr-only">Remove image</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/laptops")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
