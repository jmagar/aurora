import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import test from "node:test"

test("every generated README asset is reachable from the manifest and no stale hashes remain", () => {
  const directory = new URL("../public/readmes/", import.meta.url)
  const manifest = JSON.parse(readFileSync(new URL("manifest.json", directory), "utf8")) as Record<string, string>
  const referenced = new Set(Object.values(manifest).map((path) => path.split("/").at(-1)))
  const owned = readdirSync(directory).filter((name) => /^themes-[a-z0-9-]+-[a-f0-9]{10}-readme\.md$/.test(name))
  assert.deepEqual(new Set(owned), referenced)
  for (const path of Object.values(manifest)) assert.ok(existsSync(new URL(`..${path}`, directory)), path)
})
