#!/usr/bin/env node
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const root = resolve(new URL("..", import.meta.url).pathname)
const check = process.argv.includes("--check")
const pairs = [
  ["themes/editors/zed/themes/aurora.json", "public/zed/aurora.json"],
  ["themes/editors/warp/themes/aurora.yaml", "public/warp/aurora.yaml"],
  ["themes/editors/warp/themes/aurora-light.yaml", "public/warp/aurora-light.yaml"],
  ["themes/editors/warp/themes/aurora.jpg", "public/warp/aurora.jpg"],
  ["themes/browser/chrome/aurora", "public/chrome/aurora"],
  ["themes/browser/chrome/aurora-light", "public/chrome/aurora-light"],
]

function filesEqual(left, right) {
  if (!existsSync(right)) return false
  return readFileSync(left).equals(readFileSync(right))
}

function assertTreeEqual(source, target) {
  const probe = mkdtempSync(join(tmpdir(), "aurora-theme-tree-"))
  cpSync(source, probe, { recursive: true })
  try {
    execFileSync("diff", ["-qr", probe, target], { stdio: "pipe" })
  } catch {
    throw new Error(`${target} differs from ${source}`)
  } finally {
    rmSync(probe, { recursive: true, force: true })
  }
}

for (const [sourcePath, targetPath] of pairs) {
  const source = resolve(root, sourcePath)
  const target = resolve(root, targetPath)
  if (check) {
    if (sourcePath.includes("chrome/aurora")) assertTreeEqual(source, target)
    else if (!filesEqual(source, target)) throw new Error(`${targetPath} differs from ${sourcePath}`)
  } else {
    rmSync(target, { recursive: true, force: true })
    cpSync(source, target, { recursive: true })
  }
}

for (const variant of ["aurora", "aurora-light"]) {
  const source = resolve(root, `themes/browser/chrome/${variant}`)
  const target = resolve(root, `public/chrome/${variant}.zip`)
  if (check) {
    const probeDir = mkdtempSync(join(tmpdir(), "aurora-theme-zip-"))
    const probe = join(probeDir, `${variant}.zip`)
    execFileSync("python3", [resolve(root, "scripts/deterministic-zip.py"), source, probe])
    if (!filesEqual(probe, target)) throw new Error(`${target} is not the deterministic archive for ${source}`)
    rmSync(probeDir, { recursive: true, force: true })
  } else {
    execFileSync("python3", [resolve(root, "scripts/deterministic-zip.py"), source, target])
  }
}
console.log(check ? "Theme source, served copies, and archives are synchronized." : "Synchronized deterministic theme artifacts.")
