import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

// Contract tests for the dinglebear.ai co-hosted tenant (Aurora-native page).
// The tenant is a React page composed from Aurora registry components, served
// via the host rewrite in proxy.ts — see dinglebear/README.md.

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("static-HTML passthrough route stays retired", () => {
  assert.equal(
    existsSync(new URL("../app/dinglebear/route.ts", import.meta.url)),
    false,
    "app/dinglebear/route.ts was replaced by page.tsx — do not resurrect it",
  )
  assert.ok(existsSync(new URL("../app/dinglebear/page.tsx", import.meta.url)))
})

test("proxy maps the dinglebear.ai host: fleet page at root, full app elsewhere", () => {
  const proxy = read("proxy.ts")
  assert.match(proxy, /dinglebear\.ai/, "proxy must handle the dinglebear.ai host")
  assert.match(proxy, /\/dinglebear/, "root must rewrite to /dinglebear")
  assert.match(
    proxy,
    /application\/vnd\.shadcn\.v1\+json/,
    "root must preserve shadcn CLI content negotiation (runs before beforeFiles rewrites)",
  )
  assert.match(proxy, /\/r\/registry\.json/, "shadcn CLI requests must get the registry manifest")
})

test("fleet page composes Aurora registry components, not hand-rolled UI", () => {
  const page = read("app/dinglebear/fleet-page.tsx")
  for (const dep of [
    "@/registry/aurora/ui/button",
    "@/registry/aurora/ui/badge",
    "@/registry/aurora/ui/card",
    "@/registry/aurora/blocks/workspace/command-palette/command-palette",
  ]) {
    assert.match(page, new RegExp(dep.replace(/[/\\]/g, "[/\\\\]")), `must import ${dep}`)
  }
})

test("tenant styling is tokenized — no raw hex in the page or tenant CSS", () => {
  for (const path of ["app/dinglebear/fleet-page.tsx", "app/dinglebear/dinglebear.css"]) {
    const src = read(path)
    assert.doesNotMatch(
      src,
      /#[0-9a-fA-F]{3,8}\b/,
      `${path} must use --aurora-* tokens, not raw hex`,
    )
  }
})

test("fleet page does not fetch remote data at runtime", () => {
  const page = read("app/dinglebear/fleet-page.tsx")
  assert.doesNotMatch(page, /fetch\s*\(\s*["']https?:\/\//)
  assert.doesNotMatch(page, /XMLHttpRequest/)
})

test("fleet data is well-formed", async () => {
  const { servers } = await import("../app/dinglebear/servers.ts")
  assert.ok(servers.length > 0)
  for (const server of servers) {
    assert.match(server.mcpName, /^ai\.dinglebear\//, `${server.id} registry name`)
    assert.ok(server.packageName.length > 0, `${server.id} package name`)
    assert.match(server.repo, /^jmagar\//, `${server.id} repo`)
    assert.ok(server.capabilities.length > 0, `${server.id} capabilities`)
  }
})
