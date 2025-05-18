"use client"

import { useEffect, useRef, useState } from "react"
import { XCircle } from "lucide-react"
import { useFormState, useFormStatus } from "react-dom"

import { createLaptop, type CreateLaptopState } from "@/app/actions"

const initialState: CreateLaptopState = {
  message: "",
  errors: {},
  success: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {pending ? "Adding Laptop..." : "Add Laptop"}
    </button>
  )
}

export function AddLaptopForm() {
  const [state, formAction] = useFormState(createLaptop, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset() // Reset form on successful submission
      setImageFiles([])
      setImagePreviews([])
    }
  }, [state.success])

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles)
      setImageFiles((prevFiles) => [...prevFiles, ...newFiles])

      // Create URL previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
    }
  }

  // Remove an image from the selection
  const removeImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))

    // Revoke the URL object to free memory
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    )
  }

  // Create a FileList from the array of images
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (imageFiles.length === 0) {
      // Display error if no images
      return
    }

    // Create a FormData instance from the form
    const formData = new FormData(e.currentTarget)

    // Remove any existing images field
    formData.delete("images")

    // Add each file to the formData
    imageFiles.forEach((file) => {
      formData.append("images", file)
    })

    // Call the form action with the updated formData
    formAction(formData)
  }

  const commonInputClass =
    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
  const errorTextClass = "mt-1 text-sm text-red-600"

  return (
    <form
      action={formAction}
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-8 shadow-md"
    >
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
          className={commonInputClass}
        />
        {state.errors?.title && (
          <p className={errorTextClass}>{state.errors.title.join(", ")}</p>
        )}
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
          rows={4}
          required
          className={commonInputClass}
        ></textarea>
        {state.errors?.description && (
          <p className={errorTextClass}>
            {state.errors.description.join(", ")}
          </p>
        )}
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
          className={commonInputClass}
          placeholder="e.g. 16GB RAM, 512GB SSD, Intel i7"
        />
        {state.errors?.specs && (
          <p className={errorTextClass}>{state.errors.specs.join(", ")}</p>
        )}
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
            className={commonInputClass}
          />
          {state.errors?.price && (
            <p className={errorTextClass}>{state.errors.price.join(", ")}</p>
          )}
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
            className={commonInputClass}
          />
          {state.errors?.originalPrice && (
            <p className={errorTextClass}>
              {state.errors.originalPrice.join(", ")}
            </p>
          )}
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
          className={commonInputClass}
        />
        {state.errors?.discount && (
          <p className={errorTextClass}>{state.errors.discount.join(", ")}</p>
        )}
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
          className={commonInputClass}
        />
        {state.errors?.videoUrl && (
          <p className={errorTextClass}>{state.errors.videoUrl.join(", ")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Laptop Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {state.errors?.images && (
          <p className={errorTextClass}>{state.errors.images.join(", ")}</p>
        )}

        {/* Image preview section */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
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

      <SubmitButton />

      {state.message && !state.success && (
        <p
          className={`mt-4 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
        >
          {state.message}
        </p>
      )}
      {state.success && (
        <p className={`mt-4 text-sm text-green-600`}>{state.message}</p>
      )}
      {state.errors?.database && (
        <p className={errorTextClass}>{state.errors.database.join(", ")}</p>
      )}
    </form>
  )
}
