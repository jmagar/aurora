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
    "registry/aurora/blocks/ai/elements/source.tsx",
    "registry/aurora/blocks/ai/elements/sandbox.tsx",
    "registry/aurora/blocks/workspace/web-preview/web-preview.tsx",
  ]) {
    assert.match(await readFile(path, "utf8"), /safeHttpUrl/)
  }
})
