import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import test from "node:test"

test("theme served copies and archives pass the deterministic sync check", () => {
  assert.match(execFileSync("node", ["scripts/sync-themes.mjs", "--check"], { encoding: "utf8" }), /synchronized/)
})

test("theme README commands use repo-root-relative canonical paths", () => {
  const shell = readFileSync(new URL("../themes/shell/README.md", import.meta.url), "utf8")
  const zsh = readFileSync(new URL("../themes/shell/zsh/README.md", import.meta.url), "utf8")
  const zed = readFileSync(new URL("../themes/editors/zed/README.md", import.meta.url), "utf8")
  assert.match(shell, /AUR=~\/workspace\/aurora\/themes\/shell/)
  assert.match(zsh, /AUR=~\/workspace\/aurora\/themes\/shell\/zsh/)
  assert.equal((zed.match(/^## Publish$/gm) ?? []).length, 1)
})
