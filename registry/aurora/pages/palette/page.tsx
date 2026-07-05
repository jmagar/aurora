import { Badge } from "@/components/ui/aurora/badge"

const swatches = [
  ["Primary", "var(--aurora-accent-primary)"],
  ["Rose", "var(--aurora-accent-pink)"],
  ["Success", "var(--aurora-success)"],
  ["Warn", "var(--aurora-warn)"],
  ["Error", "var(--aurora-error)"],
]

export default function AuroraPalettePage() {
  return (
    <main className="aurora-page-shell min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <p className="aurora-text-eyebrow">Aurora starter</p>
        <h1 className="aurora-text-display-2">Palette</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {swatches.map(([label, color]) => (
            <div
              key={label}
              className="rounded-[var(--aurora-radius-2)] border p-4"
              style={{
                borderColor: "var(--aurora-border-default)",
                background: "var(--aurora-panel-medium)",
              }}
            >
              <div className="mb-3 h-16 rounded-[12px]" style={{ background: color }} />
              <Badge tone="neutral">{label}</Badge>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
