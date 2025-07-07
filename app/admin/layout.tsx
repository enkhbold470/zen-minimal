import AdminNavbar from "./adminNavbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto py-10">{children}</div>
    </div>
  )
}
