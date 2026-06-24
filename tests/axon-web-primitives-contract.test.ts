import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const root = new URL("..", import.meta.url)

function read(path: string): string {
  return readFileSync(new URL(path, root), "utf8")
}

function artifactContent(name: string): string {
  const artifact = JSON.parse(read(`public/r/${name}.json`)) as {
    files?: Array<{ content?: string }>
  }

  return artifact.files?.map((file) => file.content ?? "").join("\n") ?? ""
}

function assertAllIncludes(label: string, content: string, needles: string[]) {
  const missing = needles.filter((needle) => !content.includes(needle))
  assert.deepEqual(missing, [], `${label} is missing expected contract markers`)
}

test("Axon web primitive registry surfaces are published", () => {
  const registry = JSON.parse(read("public/r/registry.json")) as {
    items?: Array<{ name?: string }>
  }
  const names = new Set(registry.items?.map((item) => item.name))

  assert.equal(names.has("aurora-native-select"), true)
  assert.equal(names.has("aurora-scroll-area"), true)
  assert.equal(names.has("aurora-status-indicator"), true)
  assert.equal(names.has("aurora-button"), true)
})

test("NativeSelect keeps native select ref and props compatibility", () => {
  const content = artifactContent("aurora-native-select")

  assertAllIncludes("aurora-native-select", content, [
    "React.SelectHTMLAttributes<HTMLSelectElement>",
    // React 19 ref-as-prop (migrated from React.forwardRef): ref still forwarded.
    "React.Ref<HTMLSelectElement>",
    "placeholder?: string",
    "onFocus, onBlur, ref, ...props",
    "{...props}",
    "disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed",
  ])
})

test("ScrollArea keeps Axon-compatible root ref, root props, and viewport styling hook", () => {
  const content = artifactContent("aurora-scroll-area")

  assertAllIncludes("aurora-scroll-area", content, [
    "React.HTMLAttributes<HTMLDivElement>",
    "viewportClassName?: string",
    // React 19 ref-as-prop (migrated from React.forwardRef): ref still forwarded.
    "React.Ref<HTMLDivElement>",
    "max-h-72 overflow-auto aurora-scrollbar",
  ])
})

test("StatusIndicator supports labeled and dot-only status surfaces", () => {
  const source = read("registry/aurora/ui/status-indicator.tsx")
  const artifact = artifactContent("aurora-status-indicator")
  const markers = [
    "showLabel?: boolean",
    "dotClassName?: string",
    "dotStyle?: React.CSSProperties",
    "showLabel ? label ?? safeTone : null",
    "\"automating\"",
  ]

  assertAllIncludes("registry/aurora/ui/status-indicator.tsx", source, markers)
  assertAllIncludes("aurora-status-indicator", artifact, markers)
})

test("Button artifact preserves disabled/loading asChild guards", () => {
  const content = artifactContent("aurora-button")

  assertAllIncludes("aurora-button", content, [
    "asChild?: boolean",
    "loading?: boolean",
    "const isDisabled = disabled || loading",
    "asChild && isDisabled && \"pointer-events-none opacity-45\"",
    "event.preventDefault()",
    "event.stopPropagation()",
    "? { \"aria-disabled\": true, tabIndex: -1 }",
    "aria-busy={loading ? \"true\" : undefined}",
  ])
})
