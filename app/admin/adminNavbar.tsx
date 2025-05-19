import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function AdminNavbar() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex gap-4">
        <Link href="/admin/add-laptop">
          <Button variant="outline">Laptop Үүсгэх</Button>
        </Link>
        <Link href="/admin/laptops">
          <Button variant="outline">Laptop Үзэх</Button>
        </Link>
        {/* <Link href="/admin/settings">
          <Button variant="outline">Тогтмол тохиргоо</Button>
        </Link> */}
      </div>
    </div>
  )
}
