import Link from "next/link"
import { Laptop, List, PlusCircle, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage products and content
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Add New Laptop
            </CardTitle>
            <PlusCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardDescription className="px-6">
            Create a new laptop listing with images and details
          </CardDescription>
          <CardContent className="pt-4">
            <Link href="/admin/add-laptop">
              <Button className="w-full">Create New</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              Manage Laptops
            </CardTitle>
            <List className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardDescription className="px-6">
            Edit, delete, and manage existing laptop listings
          </CardDescription>
          <CardContent className="pt-4">
            <Link href="/admin/laptops">
              <Button className="w-full" variant="outline">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Settings</CardTitle>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardDescription className="px-6">
            Configure system settings and preferences
          </CardDescription>
          <CardContent className="pt-4">
            <Link href="/admin/settings">
              <Button className="w-full" variant="outline">
                Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
