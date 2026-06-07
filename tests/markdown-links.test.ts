import assert from "node:assert/strict"
import test from "node:test"

import { sanitizeMarkdownHref } from "../lib/markdown-links.ts"

test("sanitizeMarkdownHref allows relative and safe absolute links", () => {
  assert.equal(sanitizeMarkdownHref("/themes"), "/themes")
  assert.equal(sanitizeMarkdownHref("./README.md"), "./README.md")
  assert.equal(sanitizeMarkdownHref("#install"), "#install")
  assert.equal(sanitizeMarkdownHref("https://aurora.tootie.tv/themes"), "https://aurora.tootie.tv/themes")
  assert.equal(sanitizeMarkdownHref("mailto:hello@example.com"), "mailto:hello@example.com")
})

test("sanitizeMarkdownHref blocks unsafe markdown link protocols", () => {
  assert.equal(sanitizeMarkdownHref("javascript:alert(1)"), null)
  assert.equal(sanitizeMarkdownHref("JaVaScRiPt:alert(1)"), null)
  assert.equal(sanitizeMarkdownHref("data:text/html,<script>alert(1)</script>"), null)
  assert.equal(sanitizeMarkdownHref("vbscript:msgbox(1)"), null)
})
