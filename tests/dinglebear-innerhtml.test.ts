import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

// Behavior tests for the dinglebear co-hosted tenant.
//
// Previous version grepped standalone.html (the wrong file) and README.md for
// literal strings.  These tests instead drive the actual route handler and
// inspect the real served page so breakage shows up as a test failure rather
// than as a stale pattern match.

import { GET } from "../app/dinglebear/route.ts"

async function getHtml(): Promise<string> {
  const res = await GET()
  return res.text()
}

test("dinglebear route returns 200 with text/html content type", async () => {
  const res = await GET()
  assert.equal(res.status, 200)
  assert.match(res.headers.get("content-type") ?? "", /text\/html/)
})

test("dinglebear route serves the dinglebear.ai page, not the Aurora landing", async () => {
  const html = await getHtml()
  assert.match(html, /dinglebear\.ai/, "page must identify as dinglebear.ai")
  // Aurora landing has a distinct marker; dinglebear must not load it
  assert.doesNotMatch(html, /aurora\.tootie\.tv\/r\//, "must not embed Aurora registry URLs")
})

test("dinglebear page is self-contained: no external script src attributes", async () => {
  const html = await getHtml()
  // All scripts must be inline; external src= would be a CSP / availability risk.
  assert.doesNotMatch(
    html,
    /<script[^>]+src=["']https?:\/\//i,
    "page must not load scripts from external origins",
  )
})

test("dinglebear page uses innerHTML only for repo-local FLEET data, not fetch()/XHR", async () => {
  const html = await getHtml()
  // The page may use innerHTML for the static FLEET array rendered at build time,
  // but must not fetch remote data to populate those templates.
  assert.doesNotMatch(
    html,
    /fetch\s*\(\s*["']https?:\/\//,
    "page must not fetch from remote URLs at runtime",
  )
  assert.doesNotMatch(
    html,
    /XMLHttpRequest/,
    "page must not use XHR (use static inline data instead)",
  )
})

test("dinglebear page has a valid DOCTYPE and html root", async () => {
  const html = await getHtml()
  assert.match(html, /^<!DOCTYPE html>/i)
  assert.match(html, /<html/)
})

test("dinglebear served file matches the source file in public/dinglebear/index.html", async () => {
  // Guard that the route reads the right file — not some other path.
  const html = await getHtml()
  const disk = readFileSync(
    new URL("../public/dinglebear/index.html", import.meta.url),
    "utf8",
  )
  assert.equal(html.trim(), disk.trim())
})
