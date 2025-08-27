"use client"

import { useCallback, useEffect, useRef, useState, useActionState } from "react"
import Image from "next/image"
import { Sparkles, UploadCloud, XCircle, Calculator, DollarSign } from "lucide-react"


import { CreateLaptopState } from "@/types/productTypes"
import { Button } from "@/components/ui/button"
import { createLaptop } from "@/app/actions"
import { calculatePriceFromUSD, formatUSDPrice, commafy, type PriceCalculation, testPriceCalculation } from "@/lib/utils"
import { useTransition } from "react"

const initialState: CreateLaptopState = {
  message: "",
  errors: {},
  success: false,
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="mt-4 w-full rounded-md bg-primary py-8 text-xl font-bold text-primary-foreground"
    >
      {isPending ? "Laptop нэмэж байна..." : "Laptop нэмэх"}
    </Button>
  )
}

export function AddLaptopForm() {
  const [state, formAction] = useActionState(createLaptop, initialState)
  const [isPending, startTransition] = useTransition()
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
  const [usdPrice, setUsdPrice] = useState("")
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null)
  const [isDragging, setIsDragging] = useState(false) // For drag-and-drop UI

  // Custom action handler for form submission
  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
      // Add image files to form data
      formData.delete("images")
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })
      formAction(formData)
    })
  }

  // Demo price calculation on mount
  useEffect(() => {
    console.log("🚀 Price Calculator Demo:")
    testPriceCalculation(999) // Test with $999 USD
  }, [])

  // Calculate price when USD price changes
  useEffect(() => {
    const numericUsdPrice = parseFloat(usdPrice)
    if (!isNaN(numericUsdPrice) && numericUsdPrice > 0) {
      const calculation = calculatePriceFromUSD(numericUsdPrice)
      setPriceCalculation(calculation)
      
      // Round to nearest 100
      const roundedPrice = Math.round(calculation.finalPriceMNT / 100) * 100
      
      // Auto-fill the price fields
      setPrice(roundedPrice.toFixed(2))
      setOriginalPrice((roundedPrice * 1.1).toFixed(2))
      setDiscount(`${calculation.discountPercentage.toFixed(1)}%`)
    } else {
      setPriceCalculation(null)
    }
  }, [usdPrice])

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset() // Reset form on successful submission
      setImageFiles([])
      setImagePreviews([])
      setPrice("")
      setDiscount("")
      setOriginalPrice("")
      setUsdPrice("")
      setPriceCalculation(null)
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
        const usdPriceInput = formRef.current.elements.namedItem(
          "usdPrice"
        ) as HTMLInputElement | null

        if (titleInput) titleInput.value = ""
        if (descriptionTextarea) descriptionTextarea.value = ""
        if (specsInput) specsInput.value = ""
        if (priceInput) priceInput.value = ""
        if (discountInput) discountInput.value = ""
        if (originalPriceInput) originalPriceInput.value = ""
        if (usdPriceInput) usdPriceInput.value = ""
      }
    }
  }, [state.success])

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
    console.log("[FRONTEND] handleGenerateWithAI called")
    
    if (!formRef.current) {
      console.log("[FRONTEND] No form ref, returning")
      return
    }
    
    const titleInput = formRef.current.elements.namedItem(
      "title"
    ) as HTMLInputElement
    const productTitle = titleInput?.value
    
    console.log("[FRONTEND] Product title from input:", productTitle)

    if (!productTitle?.trim()) {
      console.log("[FRONTEND] No product title provided")
      setAiError("Please enter a product title first.")
      return
    }

    setIsGenerating(true)
    setAiError(null)
    
    console.log("[FRONTEND] Starting AI generation for:", productTitle)

    try {
      const requestBody = { productTitle }
      console.log("[FRONTEND] Request body:", JSON.stringify(requestBody, null, 2))
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      
      console.log("[FRONTEND] Response status:", response.status)
      console.log("[FRONTEND] Response ok:", response.ok)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[FRONTEND] Error response data:", JSON.stringify(errorData, null, 2))
        throw new Error(
          errorData.error || `API request failed with status ${response.status}`
        )
      }

      const data = await response.json()
      console.log("[FRONTEND] Success response data:", JSON.stringify(data, null, 2))

      if (formRef.current) {
        const descriptionTextarea = formRef.current.elements.namedItem(
          "description"
        ) as HTMLTextAreaElement
        const specsInput = formRef.current.elements.namedItem(
          "specs"
        ) as HTMLInputElement

        console.log("[FRONTEND] Found description textarea:", !!descriptionTextarea)
        console.log("[FRONTEND] Found specs input:", !!specsInput)
        console.log("[FRONTEND] Data has description:", !!data.description)
        console.log("[FRONTEND] Data has specs:", !!data.specs)

        if (descriptionTextarea && data.description) {
          descriptionTextarea.value = data.description
          console.log("[FRONTEND] Set description value")
        }
        if (specsInput && data.specs) {
          // Convert specs object to string format if it's an object
          let specsString = data.specs
          if (typeof data.specs === 'object' && data.specs !== null) {
            specsString = Object.entries(data.specs)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
            console.log("[FRONTEND] Converted specs object to string:", specsString)
          }
          specsInput.value = specsString
          console.log("[FRONTEND] Set specs value")
        }
      }
      if (!data.description && !data.specs) {
        console.log("[FRONTEND] No description or specs in response")
        setAiError(
          "AI did not return description or specs. Raw: " + JSON.stringify(data)
        )
      } else {
        console.log("[FRONTEND] AI generation completed successfully")
      }
    } catch (error: unknown) {
      console.error("[FRONTEND] AI generation error:", error)
      console.error("[FRONTEND] Error details:", error instanceof Error ? error.stack : 'No stack trace')
      setAiError(error instanceof Error ? error.message : "Failed to generate content.")
    } finally {
      setIsGenerating(false)
      console.log("[FRONTEND] AI generation process finished")
    }
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
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form
            ref={formRef}
            action={handleFormAction}
            className="space-y-6 rounded-lg border p-8 shadow-md"
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
                  className="flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-xs text-white transition-colors duration-200 hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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
              <label htmlFor="description" className="block text-sm font-medium">
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
              <label htmlFor="specs" className="block text-sm font-medium">
                Specifications (comma-separated) <span className="text-red-500">*</span>
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

            {/* USD Price Calculator */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Price Calculator</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="usdPrice" className="block text-sm font-medium text-blue-900">
                    Base Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="usdPrice"
                      id="usdPrice"
                      step="0.01"
                      placeholder="999.00"
                      className={`${commonInputClass} pl-10`}
                      value={usdPrice}
                      onChange={(e) => setUsdPrice(e.target.value)}
                    />
                  </div>
                  <p className="mt-1 text-xs text-blue-700">
                    Enter the base price in USD to auto-calculate MNT price with fees
                  </p>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-blue-900">
                    Final Price (MNT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    required
                    className={`${commonInputClass} bg-white`}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  {state.errors?.price && (
                    <p className={errorTextClass}>{state.errors.price.join(", ")}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium">
                  Original Price (MNT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  id="originalPrice"
                  step="0.01"
                  required
                  className={`${commonInputClass} bg-gray-50`}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  readOnly
                />
                {state.errors?.originalPrice && (
                  <p className={errorTextClass}>
                    {state.errors.originalPrice.join(", ")}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="discount" className="block text-sm font-medium">
                  Discount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="discount"
                  id="discount"
                  className={`${commonInputClass} bg-gray-50`}
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Auto-calculated"
                  readOnly
                />
                {state.errors?.discount && (
                  <p className={errorTextClass}>{state.errors.discount.join(", ")}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-foreground">
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
              <label htmlFor="imageUrls" className="block text-sm font-medium text-foreground">
                Image URLs (one per line)
              </label>
              <textarea
                name="imageUrls"
                id="imageUrls"
                rows={3}
                placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg
https://placekeanu.com/500"
                className={commonInputClass}
              />
              {state.errors?.imageUrls && (
                <p className={errorTextClass}>{state.errors.imageUrls.join(", ")}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter image URLs, one per line. These will be combined with uploaded files.
              </p>
            </div>

            <div>
              <label htmlFor="images" className="mb-1 block text-sm font-medium">
                Upload Laptop Images (drag & drop or click)
              </label>
              <p className="mb-2 text-xs text-gray-600">
                <span className="text-red-500">*</span> At least one image (URL or file upload) is required
              </p>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("imageUploadInput")?.click()}
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
                id="imageUploadInput"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="sr-only"
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

            <SubmitButton isPending={isPending} />

            {state.message && !state.success && (
              <p className={`mt-4 text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
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
        </div>

        {/* Price Calculation Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg border bg-white p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Price Breakdown</h3>
            </div>
            
            {priceCalculation ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="font-medium text-blue-900">Base Price</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatUSDPrice(priceCalculation.basePrice)}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CA Tax (9.25%)</span>
                    <span className="font-medium">{formatUSDPrice(priceCalculation.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recycle Fee</span>
                    <span className="font-medium">{formatUSDPrice(priceCalculation.recycleFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Fee</span>
                    <span className="font-medium">{formatUSDPrice(priceCalculation.commissionFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium">{formatUSDPrice(priceCalculation.shippingFee)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total USD</span>
                      <span>{formatUSDPrice(priceCalculation.totalUSD)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg text-blue-600">
                      <span>Total MNT</span>
                      <span> {commafy(priceCalculation.totalMNT)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-green-50 p-3">
                  <div className="text-center">
                    <p className="text-sm text-green-700">Exchange Rate</p>
                    <p className="text-lg font-bold text-green-700">1 USD = 3,602 MNT</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Calculator className="mx-auto h-12 w-12 mb-2 text-gray-300" />
                <p className="text-sm">Enter a USD price to see calculation breakdown</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
