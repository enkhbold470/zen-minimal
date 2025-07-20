import Breadcrumb from "@/components/Breadcrumb"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <Breadcrumb
        items={[
          { label: "Админ", href: "/admin" },
          { label: "Тохиргоо" }
        ]}
      />
      <div>Settings</div>
    </div>
  )
}
