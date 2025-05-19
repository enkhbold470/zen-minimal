"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MoveDown, MoveUp, Trash2, UploadCloud, XCircle } from "lucide-react"

import { EditLaptopFormProps, ImageItem, Laptop } from "@/types/productTypes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { deleteImage, updateImagePositions, updateLaptop } from "@/app/actions"

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
  const [isDragging, setIsDragging] = useState(false)

  // Process new files (from input or drag-and-drop)
  const processNewFiles = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files)
      const validImageFiles = newFilesArray.filter((file) =>
        file.type.startsWith("image/")
      )

      setNewImageFiles((prevFiles) => [...prevFiles, ...validImageFiles])

      const newPreviewsArray = validImageFiles.map((file) =>
        URL.createObjectURL(file)
      )
      setNewImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviewsArray,
      ])
    }
  }, [])

  // Handle image selection for new images (file input)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processNewFiles(e.target.files)
  }

  // Remove a new image from the selection
  const removeNewImage = (index: number) => {
    // Revoke the URL object to free memory before removing from state
    URL.revokeObjectURL(newImagePreviews[index])

    setNewImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
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
      const formData = new FormData(e.currentTarget)
      formData.delete("newImages")
      newImageFiles.forEach((file) => {
        formData.append("newImages", file)
      })

      const result = await updateLaptop(laptop.id, formData)

      if (result.success) {
        setIsSuccess(true)
        setMessage(result.message || "Laptop updated successfully")
        setNewImageFiles([])
        setNewImagePreviews([])
        // No need to reset existingImages here, they are managed separately
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

  const handleDeleteImage = async (imageId: number) => {
    try {
      const result = await deleteImage(imageId)
      if (result.success) {
        setExistingImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        )
        router.refresh()
      } else {
        const errorMessage = result.error || "Failed to delete image."
        console.error("Failed to delete image:", errorMessage)
        setMessage(errorMessage)
        setIsSuccess(false)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      setMessage("An error occurred while deleting the image.")
      setIsSuccess(false)
    }
  }

  const moveImage = async (imageId: number, direction: "up" | "down") => {
    const imagesCopy = [...existingImages]
    const index = imagesCopy.findIndex((img) => img.id === imageId)

    if (index === -1) return

    if (direction === "up" && index > 0) {
      ;[imagesCopy[index - 1], imagesCopy[index]] = [
        imagesCopy[index],
        imagesCopy[index - 1],
      ]
    } else if (direction === "down" && index < imagesCopy.length - 1) {
      ;[imagesCopy[index], imagesCopy[index + 1]] = [
        imagesCopy[index + 1],
        imagesCopy[index],
      ]
    } else {
      return
    }

    const updatedImagePositions = imagesCopy.map((img, i) => ({
      id: img.id,
      position: i,
    }))

    try {
      const result = await updateImagePositions(updatedImagePositions)
      if (result.success) {
        setExistingImages(imagesCopy.map((img, i) => ({ ...img, position: i })))
        router.refresh()
      } else {
        const errorMessage = result.error || "Failed to reorder images."
        console.error("Failed to reorder images:", errorMessage)
        setMessage(errorMessage)
        setIsSuccess(false)
      }
    } catch (error) {
      console.error("Error reordering images:", error)
      setMessage("An error occurred while reordering images.")
      setIsSuccess(false)
    }
  }

  // Drag and drop handlers for new images
  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(true)
    },
    []
  )

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)
    },
    []
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)
      processNewFiles(event.dataTransfer.files)
    },
    [processNewFiles]
  )

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
            Title <span className="text-red-500">*</span>
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
            Description <span className="text-red-500">*</span>
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
            Specifications (comma-separated){" "}
            <span className="text-red-500">*</span>
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
              Price <span className="text-red-500">*</span>
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
              Original Price <span className="text-red-500">*</span>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {existingImages
                .sort((a, b) => a.position - b.position)
                .map(
                  (
                    image,
                    index // Ensure sorted by position for UI
                  ) => (
                    <div
                      key={image.id}
                      className="flex flex-col items-center space-y-2 rounded-lg border p-3"
                    >
                      <div className="relative h-24 w-24 overflow-hidden rounded-md">
                        <Image
                          src={image.url}
                          alt={image.alt || `Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Move Up"
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
                          title="Move Down"
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
                          title="Delete"
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
                  )
                )}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            Add New Images <span className="text-red-500">*</span>
          </h3>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              document.getElementById("newImageUploadInput")?.click()
            }
            className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5 
              ${isDragging ? "border-indigo-600 bg-indigo-50" : "border-gray-300"}
              cursor-pointer transition-colors duration-150 ease-in-out hover:border-indigo-500`}
          >
            <div className="space-y-1 text-center">
              <UploadCloud
                className={`mx-auto h-12 w-12 ${isDragging ? "text-indigo-500" : "text-gray-400"}`}
              />
              <div className="flex text-sm text-gray-600">
                <p className="pl-1">
                  {isDragging
                    ? "Drop files here"
                    : "Drag & drop files here, or click to select"}
                </p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <input
            type="file"
            id="newImageUploadInput" // ID for click trigger
            name="newImages" // This name is used in FormData processing
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="sr-only" // Visually hidden
          />

          {/* New image preview section */}
          {newImagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
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
                    className="absolute -right-2 -top-2 rounded-full bg-white text-red-500 transition-colors hover:text-red-700"
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
