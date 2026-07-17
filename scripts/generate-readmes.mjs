#!/usr/bin/env node
import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { basename, dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, "..")
const themesSource = readFileSync(join(root, "lib", "themes.ts"), "utf8")
const outputDir = join(root, "public", "readmes")

mkdirSync(outputDir, { recursive: true })

const readmePaths = Array.from(
  new Set(Array.from(themesSource.matchAll(/readmePath:\s*"([^"]+)"/g), (match) => match[1]))
).sort()

if (readmePaths.length === 0) {
  console.error("No theme readmePath entries found in lib/themes.ts")
  process.exit(1)
}

const manifest = {}
const generatedFiles = new Set()

for (const readmePath of readmePaths) {
  const abs = resolve(root, readmePath)
  if (!abs.startsWith(root + "/")) {
    console.error(`Refusing to copy README outside repo: ${readmePath}`)
    process.exit(1)
  }

  const source = readFileSync(abs, "utf8")
  const slug = readmePath
    .replace(/\/README\.md$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
  const hash = createHash("sha256").update(source).digest("hex").slice(0, 10)
  const fileName = `${slug}-${hash}-${basename(readmePath).toLowerCase()}`

  writeFileSync(join(outputDir, fileName), source)
  generatedFiles.add(fileName)
  manifest[readmePath] = `/readmes/${fileName}`
}

// Delete only assets matching this generator's hashed naming contract. Other
// hand-authored files in public/readmes are never touched.
const ownedPattern = /^themes-[a-z0-9-]+-[a-f0-9]{10}-readme\.md$/
for (const fileName of readdirSync(outputDir)) {
  if (ownedPattern.test(fileName) && !generatedFiles.has(fileName)) unlinkSync(join(outputDir, fileName))
}

writeFileSync(join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
for (const servedPath of Object.values(manifest)) {
  const fileName = basename(servedPath)
  if (!generatedFiles.has(fileName)) throw new Error(`README manifest points to an ungenerated file: ${servedPath}`)
}
console.log(`Generated ${readmePaths.length} README assets.`)
