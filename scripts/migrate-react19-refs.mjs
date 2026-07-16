#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import ts from "typescript"

const checkOnly = process.argv.includes("--check")
const search = spawnSync("rg", ["-l", "React\\.forwardRef", "registry/aurora", "--glob", "*.tsx"], {
  encoding: "utf8",
})
if (search.status !== 0 && search.status !== 1) throw new Error(search.stderr || "rg failed")
const files = search.stdout.trim().split("\n").filter(Boolean)

if (checkOnly) {
  if (files.length) {
    console.error(`React 19 direct-ref contract failed: ${files.length} files still use React.forwardRef.`)
    process.exit(1)
  }
  console.log("React 19 direct-ref contract validated.")
  process.exit(0)
}

let migrated = 0
for (const file of files) {
  const source = readFileSync(file, "utf8")
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const edits = []

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.getText(sourceFile) === "React" &&
      node.expression.name.text === "forwardRef"
    ) {
      const [refType, propsType] = node.typeArguments ?? []
      const callback = node.arguments[0]
      if (
        !refType ||
        !propsType ||
        (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback)) ||
        callback.parameters.length !== 2
      ) {
        throw new Error(`Unsupported forwardRef form in ${file}:${sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1}`)
      }

      const [propsParameter, refParameter] = callback.parameters
      if (refParameter.name.getText(sourceFile) !== "ref") {
        throw new Error(`Expected the forwarded ref parameter to be named ref in ${file}`)
      }

      const directRefType = `${propsType.getText(sourceFile)} & { ref?: React.Ref<${refType.getText(sourceFile)}> }`
      let propsText
      if (ts.isObjectBindingPattern(propsParameter.name)) {
        const binding = propsParameter.name.getText(sourceFile)
        propsText = `${binding.slice(0, 1)} ref,${binding.slice(1)}: ${directRefType}`
      } else if (ts.isIdentifier(propsParameter.name)) {
        propsText = `${propsParameter.name.text}: ${directRefType}`
        const body = callback.body
        if (!ts.isBlock(body)) throw new Error(`Identifier props require a block body in ${file}`)
        edits.push({ start: body.getStart(sourceFile) + 1, end: body.getStart(sourceFile) + 1, text: `\n    const { ref } = ${propsParameter.name.text}` })
      } else {
        throw new Error(`Unsupported props binding in ${file}`)
      }

      edits.push({ start: node.getStart(sourceFile), end: callback.getStart(sourceFile), text: "" })
      edits.push({ start: propsParameter.getStart(sourceFile), end: propsParameter.end, text: propsText })
      edits.push({ start: propsParameter.end, end: refParameter.end, text: "" })
      edits.push({ start: callback.end, end: node.end, text: "" })
      migrated += 1
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  let output = source
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    output = `${output.slice(0, edit.start)}${edit.text}${output.slice(edit.end)}`
  }
  writeFileSync(file, output)
}

console.log(`Migrated ${migrated} React.forwardRef wrappers across ${files.length} files.`)
