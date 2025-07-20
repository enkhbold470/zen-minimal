import AdminNavbar from "./adminNavbar"
import Breadcrumb from "@/components/Breadcrumb"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto py-10">
        <Breadcrumb
          items={[
            { label: "Админ", href: "/admin" }
          ]}
        />
        {children}
      </div>
    </div>
  )
}
