"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Sparkles, UploadCloud, XCircle } from "lucide-react"
import { useFormState, useFormStatus } from "react-dom"

import { CreateLaptopState } from "@/types/productTypes"
import { Button } from "@/components/ui/button"
import { createLaptop } from "@/app/actions"

const initialState: CreateLaptopState = {
  message: "",
  errors: {},
  success: false,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-4 w-full rounded-md bg-primary py-8 text-xl font-bold text-primary-foreground"
    >
      {pending ? "Laptop нэмэж байна..." : "Laptop нэмэх"}
    </Button>
  )
}

export function AddLaptopForm() {
  const [state, formAction] = useFormState(createLaptop, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // State for AI generation
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // State for price calculation
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [isDragging, setIsDragging] = useState(false) // For drag-and-drop UI

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset() // Reset form on successful submission
      setImageFiles([])
      setImagePreviews([])
      setPrice("")
      setDiscount("")
      setOriginalPrice("")
      if (formRef.current) {
        const titleInput = formRef.current.elements.namedItem(
          "title"
        ) as HTMLInputElement | null
        const descriptionTextarea = formRef.current.elements.namedItem(
          "description"
        ) as HTMLTextAreaElement | null
        const specsInput = formRef.current.elements.namedItem(
          "specs"
        ) as HTMLInputElement | null
        const priceInput = formRef.current.elements.namedItem(
          "price"
        ) as HTMLInputElement | null
        const discountInput = formRef.current.elements.namedItem(
          "discount"
        ) as HTMLInputElement | null
        const originalPriceInput = formRef.current.elements.namedItem(
          "originalPrice"
        ) as HTMLInputElement | null

        if (titleInput) titleInput.value = ""
        if (descriptionTextarea) descriptionTextarea.value = ""
        if (specsInput) specsInput.value = ""
        if (priceInput) priceInput.value = ""
        if (discountInput) discountInput.value = ""
        if (originalPriceInput) originalPriceInput.value = ""
      }
    }
  }, [state.success])

  // Calculate original price based on price and discount
  useEffect(() => {
    const numericPrice = parseFloat(price)
    if (isNaN(numericPrice) || numericPrice <= 0) {
      // If price is not valid, don't attempt calculation, or clear originalPrice
      // setOriginalPrice(""); // Optionally clear if price is invalid
      return
    }

    let calculatedOriginalPrice = numericPrice
    const discountTrimmed = discount.trim()

    if (discountTrimmed) {
      if (discountTrimmed.endsWith("%")) {
        const percentageStr = discountTrimmed
          .substring(0, discountTrimmed.length - 1)
          .trim()
        const percentage = parseFloat(percentageStr)
        if (!isNaN(percentage) && percentage > 0 && percentage < 100) {
          calculatedOriginalPrice = numericPrice / (1 - percentage / 100)
        }
      } else {
        // Try to parse as a fixed amount (e.g., "$50" or "50")
        const amountStr = discountTrimmed.startsWith("$")
          ? discountTrimmed.substring(1).trim()
          : discountTrimmed
        const amount = parseFloat(amountStr)
        if (!isNaN(amount) && amount > 0) {
          calculatedOriginalPrice = numericPrice + amount
        }
      }
    }
    // Update originalPrice state, which will update the input field value
    // Only update if calculatedOriginalPrice is different from numericPrice (i.e., a valid discount was applied)
    // or if there's no discount, originalPrice should be the same as price.
    if (calculatedOriginalPrice !== numericPrice || !discountTrimmed) {
      setOriginalPrice(
        calculatedOriginalPrice > 0 ? calculatedOriginalPrice.toFixed(2) : ""
      )
    } else if (discountTrimmed && calculatedOriginalPrice === numericPrice) {
      // This case means discount was present but invalid, so original price should be same as price
      setOriginalPrice(numericPrice.toFixed(2))
    }
  }, [price, discount])

  const processFiles = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files)
      const validImageFiles = newFilesArray.filter((file) =>
        file.type.startsWith("image/")
      )

      setImageFiles((prevFiles) => [...prevFiles, ...validImageFiles])

      const newPreviews = validImageFiles.map((file) =>
        URL.createObjectURL(file)
      )
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews])
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
  }

  const removeImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    )
  }

  const handleGenerateWithAI = async () => {
    if (!formRef.current) return
    const titleInput = formRef.current.elements.namedItem(
      "title"
    ) as HTMLInputElement
    const productTitle = titleInput?.value

    if (!productTitle?.trim()) {
      setAiError("Please enter a product title first.")
      return
    }

    setIsGenerating(true)
    setAiError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productTitle }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || `API request failed with status ${response.status}`
        )
      }

      const data = await response.json()

      if (formRef.current) {
        const descriptionTextarea = formRef.current.elements.namedItem(
          "description"
        ) as HTMLTextAreaElement
        const specsInput = formRef.current.elements.namedItem(
          "specs"
        ) as HTMLInputElement

        if (descriptionTextarea && data.description) {
          descriptionTextarea.value = data.description
        }
        if (specsInput && data.specs) {
          specsInput.value = data.specs
        }
      }
      if (!data.description && !data.specs) {
        setAiError(
          "AI did not return description or specs. Raw: " + JSON.stringify(data)
        )
      }
    } catch (error: any) {
      console.error("AI generation error:", error)
      setAiError(error.message || "Failed to generate content.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.delete("images")
    imageFiles.forEach((file) => {
      formData.append("images", file)
    })
    formAction(formData)
  }

  // Drag and drop handlers
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
      processFiles(event.dataTransfer.files)
    },
    [processFiles]
  )

  const commonInputClass =
    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
  const errorTextClass = "mt-1 text-sm text-red-600"

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6 rounded-lg border p-8 shadow-md"
    >
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            className="flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-xs  transition-colors duration-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Sparkles size={16} className="mr-1.5" />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
        </div>
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
        {aiError && <p className={`${errorTextClass} mt-2`}>{aiError}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium  ">
          Description <span className="text-red-500">*</span>
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
        <label htmlFor="specs" className="block text-sm font-medium  ">
          Specifications (comma-separated){" "}
          <span className="text-red-500">*</span>
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
          <label htmlFor="price" className="block text-sm font-medium  ">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            id="price"
            step="0.01"
            required
            className={commonInputClass}
            value={price} // Controlled component
            onChange={(e) => setPrice(e.target.value)}
          />
          {state.errors?.price && (
            <p className={errorTextClass}>{state.errors.price.join(", ")}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="originalPrice"
            className="block text-sm font-medium  "
          >
            Original Price (auto-calculated){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="originalPrice"
            id="originalPrice"
            step="0.01"
            required // Should this be required if auto-calculated?
            className={`${commonInputClass} opacity-50 `} // Slightly different style for auto-filled
            value={originalPrice} // Controlled component
            onChange={(e) => setOriginalPrice(e.target.value)} // Allow manual override
            readOnly // Or make it readOnly if manual override is not desired immediately
          />
          {state.errors?.originalPrice && (
            <p className={errorTextClass}>
              {state.errors.originalPrice.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="discount" className="block text-sm font-medium  ">
          Discount (e.g., 10% off, $50 off, or 50){" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text" // Changed to text to allow "%" or "$"
          name="discount"
          id="discount"
          className={commonInputClass}
          value={discount} // Controlled component
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="e.g. 10% or 50"
        />
        {state.errors?.discount && (
          <p className={errorTextClass}>{state.errors.discount.join(", ")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="videoUrl"
          className="block text-sm font-medium text-foreground"
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
        <label htmlFor="images" className="mb-1 block text-sm font-medium  ">
          Laptop Images (drag & drop or click){" "}
          <span className="text-red-500">*</span>
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("imageUploadInput")?.click()} // Trigger hidden input click
          className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pb-6 pt-5 
            ${isDragging ? "border-indigo-600 bg-indigo-50" : "border-gray-300"}
            cursor-pointer transition-colors duration-150 ease-in-out hover:border-indigo-500`}
        >
          <div className="space-y-1 text-center">
            <UploadCloud
              className={`mx-auto h-12 w-12 ${isDragging ? "text-indigo-500" : "text-gray-400"}`}
            />
            <div className="flex text-sm text-foreground">
              <p className="pl-1">
                {isDragging
                  ? "Drop files here"
                  : "Drag & drop files here, or click to select"}
              </p>
            </div>
            <p className="text-xs text-foreground">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        <input
          type="file"
          id="imageUploadInput" // Added ID for click trigger
          name="images" // Name might be redundant if handled by state, but good for non-JS
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="sr-only" // Visually hidden, functionality handled by the div
        />
        {state.errors?.images && (
          <p className={errorTextClass}>{state.errors.images.join(", ")}</p>
        )}

        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 rounded-md object-cover"
                  width={96}
                  height={96}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
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
