import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const proxy = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8")

test("production CSP restricts forms and upgrades insecure requests", () => {
  assert.match(proxy, /form-action 'self'/)
  assert.match(proxy, /upgrade-insecure-requests/)
  assert.match(proxy, /script-src 'self'/)
})

test("root layout remains statically renderable", () => {
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
  assert.doesNotMatch(layout, /force-dynamic/)
})
