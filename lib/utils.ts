import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Price calculation constants
const TUGRIK_RATE = 3602.00 // 1 USD = 3602.00 MNT
const CA_TAX_RATE = 0.0925 // 9.25% CA tax rate
const RECYCLE_FEE = 5 // 5% recycle fee
const COMMISSION_FEE = 0.1 // 10% commission fee
const SHIPPING_FEE = 20 // $20 shipping fee


// Price calculation interface
export interface PriceCalculation {
  basePrice: number
  taxAmount: number
  subtotalWithTax: number
  recycleFee: number
  commissionFee: number
  shippingFee: number
  totalUSD: number
  totalMNT: number
  discountPercentage: number
  finalPriceMNT: number
}


export function firstSentenceDetector(string: string) {
  const firstPeriodIndex = string.indexOf('.');
  if (firstPeriodIndex !== -1) {
    return string.substring(0, firstPeriodIndex + 1);
  }
  return string;
}

// Utility function to shuffle an array
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}




// Calculate price from USD to MNT with all fees
export const calculatePriceFromUSD = (basePriceUSD: number): PriceCalculation => {
  const taxAmount = basePriceUSD * CA_TAX_RATE
  const recycleFee = RECYCLE_FEE
  const commissionFee = basePriceUSD * COMMISSION_FEE
  const subtotalWithTax = basePriceUSD + taxAmount + recycleFee
  const totalUSD = subtotalWithTax + commissionFee + SHIPPING_FEE
  const totalMNT = Math.round(totalUSD * TUGRIK_RATE) // Rounded to avoid floating point issues
  
  // Add up price on final price and call it discount
  const discountPercentage = 10
  return {
    basePrice: basePriceUSD,
    taxAmount,
    subtotalWithTax,
    recycleFee,
    commissionFee,
    shippingFee: SHIPPING_FEE,
    totalUSD,
    totalMNT,
    discountPercentage,
    finalPriceMNT: totalMNT
  }
}


// Format USD price
export const formatUSDPrice = (price: number | string): string => { 
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price as number)
}

// Test function to verify price calculation
export const testPriceCalculation = (basePriceUSD: number = 999) => {
  const calculation = calculatePriceFromUSD(basePriceUSD)
  console.log('Price Calculation Test:', {
    basePrice: formatUSDPrice(calculation.basePrice),
    taxAmount: formatUSDPrice(calculation.taxAmount),
    commissionFee: formatUSDPrice(calculation.commissionFee),
    shippingFee: formatUSDPrice(calculation.shippingFee),
    totalUSD: formatUSDPrice(calculation.totalUSD),
    totalMNT: formatUSDPrice(calculation.totalMNT),
    discountPercentage: `${calculation.discountPercentage.toFixed(1)}%`
  })
  return calculation
}

// find % from the string 
export const checkPercentage = (num:  string) => {
  const percentage = num.search("%")
  if (percentage !== -1) {
    return true
  }
  return false
}



export function commafy( num: number | string ) {
  if (typeof num === "string") {
    num = parseInt(num)
  }
  const str = num.toString().split(".")
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,")
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ")
  }
  return str.join(".")
}

export const getYoutubeEmbedUrl = (url: string): string | null => {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      if (urlObj.pathname === "/watch" || urlObj.pathname === "/") {
        const videoId = urlObj.searchParams.get("v")
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
      } else if (urlObj.pathname.startsWith("/embed/")) {
        return url // Already an embed URL
      }
    } else if (urlObj.hostname === "youtu.be") {
      const videoId = urlObj.pathname.substring(1)
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
  } catch (error) {
    console.error("Error parsing video URL:", error)
    return null
  }
  return null // Not a recognized YouTube URL
}

export const getYoutubeId = (url: string): string | null => {
  if (!url) return null

  let videoId: string | null = null

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname
    const pathname = parsedUrl.pathname

    if (hostname.includes("youtube.com")) {
      if (pathname === "/watch") {
        videoId = parsedUrl.searchParams.get("v")
      } else if (pathname.startsWith("/shorts/")) {
        videoId = pathname.substring("/shorts/".length)
      } else if (pathname.startsWith("/embed/")) {
        videoId = pathname.substring("/embed/".length)
      } else if (parsedUrl.searchParams.get("v")) {
        // Fallback for youtube.com/?v=ID
        videoId = parsedUrl.searchParams.get("v")
      }
    } else if (hostname.includes("youtu.be")) {
      videoId = pathname.substring(1) // Remove the leading '/'
    }
  } catch (error) {
    // If URL parsing fails, try regex as a fallback (less robust)
    console.warn(
      "URL parsing failed, falling back to regex for YouTube ID extraction:",
      error
    )
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    if (match && match[1]) {
      videoId = match[1]
    }
  }

  // Clean up any extra params from the videoId if they exist
  if (videoId && videoId.includes("?")) {
    videoId = videoId.split("?")[0]
  }
  if (videoId && videoId.includes("&")) {
    videoId = videoId.split("&")[0]
  }

  return videoId
}


export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
