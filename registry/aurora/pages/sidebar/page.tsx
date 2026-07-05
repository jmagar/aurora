import { Sidebar } from "@/registry/aurora/blocks/workspace/sidebar/sidebar"

export default function AuroraSidebarPage() {
  return (
    <main className="aurora-page-shell min-h-screen">
      <Sidebar
        brand={<span>Aurora</span>}
        defaultActiveId="gateway"
        items={[
          { id: "gateway", label: "Gateway", section: "Workspace" },
          { id: "terminal", label: "Terminal" },
          { id: "files", label: "Files" },
          { id: "settings", label: "Settings", section: "System" },
        ]}
      />
    </main>
  )
}
