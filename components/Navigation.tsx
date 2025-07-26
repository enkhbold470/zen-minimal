"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  Menu,
  Mail,
  ShoppingCart,
} from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

const navigation = [
  { href: "/", label: "Нүүр", icon: Home },
  { href: "/products", label: "Бараанууд", icon: ShoppingCart },
  // { href: "/about", label: "Бидний Тухай", icon: ShoppingCart },
  // { href: "/contact", label: "Contact", icon: Contact },
]

const actionButton = {
  href: "mailto:zen@enk.icu",
  label: "zen@enk.icu",
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const closeSheet = () => {
    setIsOpen(false)
  }
  return (
    <header className="relative top-0 left-0 right-0 z-50 flex h-14 w-full shrink-0 items-center px-4 md:px-6 bg-background">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-background">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col justify-between">
            <div className="grid gap-6 py-6">
              <Link
                href="/"
                className="flex items-center gap-2"
                prefetch={false}
                onClick={closeSheet}
              >
                <Image src="/logo.svg" alt="" width={32} height={32} />
                <span className="text-lg font-semibold">{siteConfig.name}</span>
              </Link>
              <nav className="grid gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground"
                    prefetch={false}
                    onClick={closeSheet}
                  >
                    <item.icon className="h-6 w-6" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="ml-auto flex space-x-4">
              <Link href={actionButton.href}>
                <Button variant="outline" className="gap-2 p-2">
                  <Mail className="h-4 w-4" />
                  {actionButton.label}
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="mr-6 hidden lg:flex">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image src="/logo.svg" alt="" width={32} height={32} />
          <span className="text-lg font-semibold">{siteConfig.name}</span>
        </Link>
      </div>
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {navigation.map((item) => (
            <NavigationMenuLink asChild key={item.label}>
              <Link
                href={item.href}
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="ml-auto flex space-x-4">
        <Link href={actionButton.href}>
          <Button variant="outline" className="gap-2 p-2">
            <Mail className="h-4 w-4" />
            {actionButton.label}
          </Button>
        </Link>
      </div>
    </header>
  )
}
