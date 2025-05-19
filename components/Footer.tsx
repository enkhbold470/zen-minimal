import Link from "next/link"

import { siteConfig } from "@/config/site"

const navigation = [
  { href: "/", label: "Нүүр" },
  { href: "/privacy-policy", label: "Нууцлалын Бодлого" },
]

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-center border-t bg-background px-6 py-8">
      <nav className="flex space-x-4">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="text-sm text-muted-foreground hover:underline">
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
      <div className="mt-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}.
      </div>
    </footer>
  )
}
