import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("dinglebear innerHTML usage is documented as static local data only", () => {
  const standalone = readFileSync(new URL("../dinglebear/standalone.html", import.meta.url), "utf8")
  const readme = readFileSync(new URL("../dinglebear/README.md", import.meta.url), "utf8")

  assert.match(standalone, /const FLEET = \[/)
  assert.match(standalone, /innerHTML/)
  assert.match(readme, /fixed, repo-local arrays/)
  assert.match(readme, /textContent/)
})
