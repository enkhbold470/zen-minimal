import type { Metadata, Viewport } from "next"
import { Roboto } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

import { siteConfig } from "@/config/site" // Import siteConfig
import { cn } from "@/lib/utils" // Import cn function
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/Footer"
import Navigation from "@/components/Navigation"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const roboto = Roboto({ weight: ["300"], subsets: ["cyrillic", "latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@_rdev7",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          roboto.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}

          <Footer />
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
