import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const proxy = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8")

test("production CSP uses a per-request strict-dynamic nonce", () => {
  assert.match(proxy, /form-action 'self'/)
  assert.match(proxy, /upgrade-insecure-requests/)
  assert.match(proxy, /script-src 'self' 'nonce-\$\{nonce\}' 'strict-dynamic'/)
  assert.match(proxy, /crypto\.randomUUID\(\)/)
  assert.match(proxy, /requestHeaders\.set\("x-nonce", nonce\)/)
  assert.match(proxy, /buildContentSecurityPolicy\(nonce, development, !development && !isLoopback\)/)
  assert.doesNotMatch(proxy, /script-src[^`\n]*'unsafe-inline'/)
  assert.doesNotMatch(proxy, /NODE_ENV === "development" \|\| isLoopback/)
})

test("root layout remains request-rendered for nonce propagation", () => {
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
  assert.match(layout, /force-dynamic/)
})
