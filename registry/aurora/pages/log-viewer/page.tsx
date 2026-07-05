import { CodeBlock } from "@/registry/aurora/blocks/workspace/code-block/code-block"
import { Badge } from "@/registry/aurora/ui/badge"

export default function AuroraLogViewerPage() {
  return (
    <main className="aurora-page-shell min-h-screen p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="aurora-text-display-2">Log viewer</h1>
          <Badge tone="info">Live tail</Badge>
        </div>
        <CodeBlock
          language="log"
          code={[
            "2026-07-04T21:00:00Z INFO gateway connected upstream=labby",
            "2026-07-04T21:00:04Z WARN registry smoke waiting for install",
            "2026-07-04T21:00:07Z INFO registry smoke passed",
          ].join("\n")}
        />
      </div>
    </main>
  )
}
