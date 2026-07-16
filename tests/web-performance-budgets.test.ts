import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("client catalog and plugin initial render stay within source-level budgets", () => {
  const catalog = readFileSync(new URL("../lib/client-catalog.json", import.meta.url), "utf8")
  const plugins = readFileSync(new URL("../components/site/plugins-view.tsx", import.meta.url), "utf8")
  assert.ok(Buffer.byteLength(catalog) <= 64 * 1024, "compact client catalog exceeded 64 KiB")
  assert.match(plugins, /initialItemLimit=\{18\}/)
})

test("gallery routes resolve through generated route-specific entries", () => {
  const page = readFileSync(new URL("../app/gallery/[section]/page.tsx", import.meta.url), "utf8")
  const manifest = JSON.parse(readFileSync(new URL("../lib/gallery-manifest.json", import.meta.url), "utf8")) as Record<string, string>
  assert.match(page, /import\(`\.\.\/entries\/\$\{section\}`\)/)
  assert.ok(Object.keys(manifest).length >= 200)
})
