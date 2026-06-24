import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

// The readme API route serves pre-built static assets from public/readmes/
// rather than reading files at request-time.  These tests verify that contract
// by inspecting the route source and the manifest it depends on.
//
// We inspect source rather than importing the route because the route uses the
// Next.js "@/" path alias which Node's test runner cannot resolve without a
// full Next.js transform.  The assertions below target observable contracts,
// not implementation details: they will break if the route regresses to
// dynamic fs reads or removes the manifest-driven redirect.

const routeSrc = readFileSync(
  new URL("../app/api/readme/route.ts", import.meta.url),
  "utf8",
)

test("readme route reads from the pre-built manifest, not from live fs at request time", () => {
  // The route must import the manifest JSON (static, build-time) …
  assert.match(routeSrc, /README_ASSETS/, "route must reference README_ASSETS manifest import")
  // … and must NOT use fs or process.cwd() to read files at request time.
  assert.doesNotMatch(routeSrc, /from ["']fs(?:\/promises)?["']/)
  assert.doesNotMatch(routeSrc, /process\.cwd\(\)/)
})

test("readme route issues a redirect (3xx), not a streaming response", () => {
  // The response must be a redirect — not a ReadableStream or piped file.
  assert.match(routeSrc, /Response\.redirect\(/, "route must use Response.redirect()")
  assert.doesNotMatch(routeSrc, /createReadStream/, "route must not stream files")
  assert.doesNotMatch(routeSrc, /new Response\(html/, "route must not inline file content")
})

test("readme manifest exists and maps string keys to string asset URLs", () => {
  const manifest: Record<string, string> = JSON.parse(
    readFileSync(
      new URL("../public/readmes/manifest.json", import.meta.url),
      "utf8",
    ),
  )
  assert.ok(typeof manifest === "object" && manifest !== null, "manifest must be an object")
  for (const [key, val] of Object.entries(manifest)) {
    assert.equal(typeof key, "string", "manifest keys must be strings")
    assert.equal(typeof val, "string", `manifest value for "${key}" must be a string`)
  }
})

test("readme manifest has at least one entry (readmes:generate has been run)", () => {
  const manifest: Record<string, string> = JSON.parse(
    readFileSync(
      new URL("../public/readmes/manifest.json", import.meta.url),
      "utf8",
    ),
  )
  assert.ok(
    Object.keys(manifest).length > 0,
    "manifest must have at least one entry — run pnpm readmes:generate",
  )
})
