import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PackageIcon, Plus, HandCoins } from "lucide-react"
export default function AdminNavbar() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex gap-4">
        <Link href="/admin/add-laptop">
          <Button variant="outline">
            <Plus />
            Add New Product
          </Button>
        </Link>
        <Link href="/admin/laptops">
          <Button variant="outline">
            <PackageIcon /> 
            View Products
          </Button>
        </Link>
        <Link href="/admin/orders">
          <Button variant="outline">
            <HandCoins />
            View Orders
          </Button>
        </Link>
        {/* <Link href="/admin/settings">
          <Button variant="outline">Тогтмол тохиргоо</Button>
        </Link> */}
      </div>
    </div>
  )
}
