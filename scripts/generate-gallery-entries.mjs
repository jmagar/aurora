#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const sourcePath = resolve(root, "app/gallery/demo-map.tsx")
const source = readFileSync(sourcePath, "utf8")
const ast = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const entries = new Map()
function collectObject(node, canonicalAi = false, allowOverride = false) {
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property) || !ts.isCallExpression(property.initializer)) continue
    const dynamicCall = property.initializer
    const loader = dynamicCall.arguments[0]
    if (!loader || (!ts.isArrowFunction(loader) && !ts.isFunctionExpression(loader))) continue
    const body = loader.body
    if (!ts.isCallExpression(body) || body.expression.kind !== ts.SyntaxKind.ImportKeyword) continue
    const specifier = body.arguments[0]
    if (!specifier || !ts.isStringLiteral(specifier) || !specifier.text.startsWith("./demos/")) continue
    const rawKey = property.name && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
      ? property.name.text : null
    if (!rawKey) throw new Error(`Unsupported demo key at ${property.getStart(ast)}`)
    const key = canonicalAi ? `ai-${rawKey}` : rawKey
    if (!allowOverride && entries.has(key) && entries.get(key) !== specifier.text.slice(8)) {
      throw new Error(`Duplicate demo slug ${key}`)
    }
    const moduleName = specifier.text.slice(8)
    if (!existsSync(resolve(root, "app/gallery/demos", `${moduleName}.tsx`))) {
      throw new Error(`Demo ${key} imports missing module ${specifier.text}`)
    }
    entries.set(key, moduleName)
  }
}
for (const statement of ast.statements) {
  if (!ts.isVariableStatement(statement)) continue
  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name) || !declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) continue
    if (["COMPONENT_DEMOS", "AI_DEMOS", "DEMOS"].includes(declaration.name.text)) {
      collectObject(declaration.initializer, false, declaration.name.text === "DEMOS")
    }
    if (declaration.name.text === "AI_DEMOS") collectObject(declaration.initializer, true)
  }
}
if (entries.size < 50) throw new Error(`Parsed only ${entries.size} demos; refusing to replace generated routes`)

const outputDir = resolve(root, "app/gallery/entries")
const tempDir = resolve(root, "app/gallery/.entries-next")
rmSync(tempDir, { recursive: true, force: true })
mkdirSync(tempDir, { recursive: true })
for (const [slug, moduleName] of [...entries].sort(([a], [b]) => a.localeCompare(b))) {
  writeFileSync(resolve(tempDir, `${slug}.tsx`), `export { default } from "../demos/${moduleName}"\n`)
}
const manifest = Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b)))
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`
if (process.argv.includes("--check")) {
  const currentManifest = readFileSync(resolve(root, "lib/gallery-manifest.json"), "utf8")
  const currentFiles = existsSync(outputDir) ? new Set(Object.keys(manifest).filter((slug) => existsSync(resolve(outputDir, `${slug}.tsx`)))) : new Set()
  rmSync(tempDir, { recursive: true, force: true })
  if (currentManifest !== manifestText || currentFiles.size !== entries.size) throw new Error("Gallery generated artifacts are stale; run pnpm gallery:generate")
} else {
  rmSync(outputDir, { recursive: true, force: true })
  renameSync(tempDir, outputDir)
  writeFileSync(resolve(root, "lib/gallery-manifest.json"), manifestText)
}
console.log(`Generated ${entries.size} route-specific gallery entries.`)
