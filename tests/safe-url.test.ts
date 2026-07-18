import assert from "node:assert/strict"
import test from "node:test"

import { safeHttpUrl } from "../registry/aurora/lib/safe-url.ts"

test("safeHttpUrl accepts only absolute HTTP(S) URLs", () => {
  assert.equal(safeHttpUrl("https://example.com/a"), "https://example.com/a")
  assert.equal(safeHttpUrl("http://localhost:3000"), "http://localhost:3000/")
  for (const value of ["javascript:alert(1)", "data:text/html,x", "file:///etc/passwd", "/relative", "not a url", ""]) {
    assert.equal(safeHttpUrl(value), undefined, value)
  }
})

test("all published URL-bearing surfaces use the shared policy", async () => {
  const { readFile } = await import("node:fs/promises")
  for (const path of [
    "registry/aurora/ui/chat-message.tsx",
    "registry/aurora/blocks/ai/elements/inline-citation.tsx",
    "registry/aurora/blocks/ai/elements/core.tsx",
    "registry/aurora/blocks/ai/elements/response.tsx",
    "registry/aurora/blocks/ai/elements/source.tsx",
    "registry/aurora/blocks/ai/elements/sandbox.tsx",
    "registry/aurora/blocks/workspace/web-preview/web-preview.tsx",
  ]) {
    assert.match(await readFile(path, "utf8"), /safeHttpUrl/)
  }
})

test("Source cannot apply an unsanitized href after its shared URL policy", async () => {
  const { readFile } = await import("node:fs/promises")
  const source = await readFile("registry/aurora/blocks/ai/elements/source.tsx", "utf8")
  assert.match(source, /style, href, target/)
  assert.match(source, /safeHttpUrl\(href \?\? source\.href\)/)
  assert.match(source, /\.\.\.props[\s\S]*href=\{safeHref\}/)
  assert.doesNotMatch(source, /href=\{safeHref\}[\s\S]*\.\.\.props/)
})

test("umbrella AI Sources sanitize each href-bearing export", async () => {
  const { readFile } = await import("node:fs/promises")
  const core = await readFile("registry/aurora/blocks/ai/elements/core.tsx", "utf8")
  const sourceExport = core.slice(core.indexOf("const Source ="), core.indexOf('Source.displayName = "Source"'))
  assert.match(core, /href=\{safeHttpUrl\(href\)\}/)
  assert.match(sourceExport, /\.\.\.props[\s\S]*href=\{safeHttpUrl\(source\.href\)\}/)
  assert.doesNotMatch(sourceExport, /href=\{safeHttpUrl\(source\.href\)\}[\s\S]*\.\.\.props/)
  assert.doesNotMatch(sourceExport, /href=\{source\.href/)
})
