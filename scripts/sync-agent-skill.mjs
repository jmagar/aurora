#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"

const canonicalUrl = new URL("../plugin/skills/aurora/SKILL.md", import.meta.url)
const rootUrl = new URL("../SKILL.md", import.meta.url)
const check = process.argv.includes("--check")
const canonical = readFileSync(canonicalUrl, "utf8")

// The packaged skill owns the body and its co-located references. The root
// convenience copy is generated with repo-root-resolvable reference paths.
const generatedRoot = canonical
  .replaceAll("(references/", "(plugin/skills/aurora/references/")
  .replaceAll("`references/", "`plugin/skills/aurora/references/")
  .replaceAll("./references/", "./plugin/skills/aurora/references/")

if (check) {
  const current = readFileSync(rootUrl, "utf8")
  if (current !== generatedRoot) {
    console.error("Root SKILL.md differs from canonical plugin/skills/aurora/SKILL.md. Run node scripts/sync-agent-skill.mjs.")
    process.exit(1)
  }
  console.log("Root and packaged Aurora agent skills are synchronized.")
} else {
  writeFileSync(rootUrl, generatedRoot)
  console.log("Generated root SKILL.md from plugin/skills/aurora/SKILL.md.")
}
