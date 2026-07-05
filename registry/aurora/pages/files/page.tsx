import { FileTree } from "@/registry/aurora/blocks/files/file-tree/file-tree"

export default function AuroraFilesPage() {
  return (
    <main className="aurora-page-shell min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <p className="aurora-text-eyebrow">Aurora starter</p>
        <h1 className="aurora-text-display-2">Files</h1>
        <div
          className="mt-5 rounded-[var(--aurora-radius-2)] border p-4"
          style={{
            borderColor: "var(--aurora-border-default)",
            background: "var(--aurora-panel-medium)",
          }}
        >
          <FileTree
            tree={[
              { id: "registry", name: "registry.json", type: "file" },
              { id: "styles", name: "aurora.css", type: "file" },
              { id: "pages", name: "pages", type: "folder" },
            ]}
          />
        </div>
      </div>
    </main>
  )
}
