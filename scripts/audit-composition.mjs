import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const root = process.cwd()
const scanRoots = ["registry/aurora", "app/gallery/demos"]

const allowNativeInput = new Set([
  "registry/aurora/ui/input.tsx",
  "registry/aurora/ui/filter-bar.tsx",
  "registry/aurora/ui/input-otp.tsx",
  "registry/aurora/ui/checkbox.tsx",
  "registry/aurora/ui/slider.tsx",
  "registry/aurora/ui/resizable-panels.tsx",
])

const allowNativeTextarea = new Set(["registry/aurora/ui/textarea.tsx"])
const allowNativeSelect = new Set(["registry/aurora/ui/native-select.tsx"])
const allowNativeButton = new Set(["registry/aurora/ui/button.tsx"])

const allowedHiddenFileInputFiles = new Set([
  "registry/aurora/blocks/files/attachment/attachment.tsx",
  "registry/aurora/blocks/files/file-picker/file-picker.tsx",
  "registry/aurora/blocks/ai/prompt-input/prompt-input.tsx",
])

function walk(dir) {
  const entries = readdirSync(dir)
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) files.push(...walk(path))
    else if (path.endsWith(".tsx")) files.push(path)
  }
  return files
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length
}

function isHiddenFileInput(tag) {
  return /type=["']file["']/.test(tag) && /display:\s*["']none["']/.test(tag)
}

const findings = []

for (const scanRoot of scanRoots) {
  for (const file of walk(join(root, scanRoot))) {
    const rel = relative(root, file)
    const source = readFileSync(file, "utf8")

    for (const match of source.matchAll(/<button\b/g)) {
      if (!allowNativeButton.has(rel)) {
        findings.push(`${rel}:${lineNumber(source, match.index)} raw <button>; use Aurora Button`)
      }
    }

    for (const match of source.matchAll(/<select\b/g)) {
      if (!allowNativeSelect.has(rel)) {
        findings.push(`${rel}:${lineNumber(source, match.index)} raw <select>; use Aurora NativeSelect or Select`)
      }
    }

    for (const match of source.matchAll(/<textarea\b/g)) {
      if (!allowNativeTextarea.has(rel)) {
        findings.push(`${rel}:${lineNumber(source, match.index)} raw <textarea>; use Aurora Textarea`)
      }
    }

    for (const match of source.matchAll(/<input\b[^>]*>/g)) {
      if (allowNativeInput.has(rel)) continue
      if (allowedHiddenFileInputFiles.has(rel) && isHiddenFileInput(match[0])) continue
      findings.push(`${rel}:${lineNumber(source, match.index)} raw visible <input>; use Aurora Input or a dedicated primitive`)
    }

    if (/rounded-\[4px\][\s\S]{0,140}fontFamily:\s*["']var\(--aurora-font-mono/.test(source) && !rel.endsWith("badge.tsx")) {
      findings.push(`${rel}: duplicated badge-like styling; use Aurora Badge`)
    }
  }
}

if (findings.length > 0) {
  console.error("Composition audit failed:")
  for (const finding of findings) console.error(`- ${finding}`)
  process.exit(1)
}

console.log("Composition audit passed.")
