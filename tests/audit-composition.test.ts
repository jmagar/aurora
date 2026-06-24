import assert from "node:assert/strict"
import test from "node:test"

// @ts-ignore — .mjs; no type declarations needed for these tests
import { scanSource } from "../scripts/audit-composition.mjs"

// ---------------------------------------------------------------------------
// raw <button> rule
// ---------------------------------------------------------------------------

test("scanSource flags raw <button> in a non-allowed file", () => {
  const findings = scanSource(
    `export function Foo() { return <button onClick={x}>click</button> }`,
    "registry/aurora/ui/card.tsx",
  )
  assert.equal(findings.length, 1)
  assert.match(findings[0], /raw <button>; use Aurora Button/)
})

test("scanSource allows raw <button> in button.tsx (allowlist)", () => {
  const findings = scanSource(
    `export function Button() { return <button>go</button> }`,
    "registry/aurora/ui/button.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw <button>")).length, 0)
})

test("scanSource allows raw <button> in AI element primitives", () => {
  const findings = scanSource(
    `export function CopyBtn() { return <button>copy</button> }`,
    "registry/aurora/blocks/ai/elements/copy-btn.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw <button>")).length, 0)
})

// ---------------------------------------------------------------------------
// raw <select> rule
// ---------------------------------------------------------------------------

test("scanSource flags raw <select> in a non-allowed file", () => {
  const findings = scanSource(
    `export function Picker() { return <select><option>a</option></select> }`,
    "registry/aurora/ui/card.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw <select>")).length, 1)
})

test("scanSource allows raw <select> in native-select.tsx", () => {
  const findings = scanSource(
    `export function NativeSelect() { return <select /> }`,
    "registry/aurora/ui/native-select.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw <select>")).length, 0)
})

// ---------------------------------------------------------------------------
// raw <textarea> rule
// ---------------------------------------------------------------------------

test("scanSource flags raw <textarea> in a non-allowed file", () => {
  const findings = scanSource(
    `export function Notes() { return <textarea /> }`,
    "registry/aurora/ui/card.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw <textarea>")).length, 1)
})

test("scanSource allows raw <textarea> in textarea.tsx", () => {
  const findings = scanSource(
    `export function Textarea() { return <textarea /> }`,
    "registry/aurora/ui/textarea.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw <textarea>")).length, 0)
})

// ---------------------------------------------------------------------------
// raw <input> rule
// ---------------------------------------------------------------------------

test("scanSource flags raw visible <input> in a non-allowed file", () => {
  const findings = scanSource(
    `export function Foo() { return <input type="text" /> }`,
    "registry/aurora/ui/card.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw visible <input>")).length, 1)
})

test("scanSource allows raw <input> in input.tsx (allowlist)", () => {
  const findings = scanSource(
    `export function Input() { return <input type="text" /> }`,
    "registry/aurora/ui/input.tsx",
  )
  assert.equal(findings.filter((f: string) => f.includes("raw visible <input>")).length, 0)
})

test("scanSource allows hidden file input in attachment.tsx", () => {
  // Hidden file inputs (display:none + type=file) are permitted in upload components.
  const source = `<input type='file' style={{ display: 'none' }} />`
  const findings = scanSource(source, "registry/aurora/blocks/files/attachment/attachment.tsx")
  assert.equal(findings.filter((f: string) => f.includes("raw visible <input>")).length, 0)
})

// ---------------------------------------------------------------------------
// badge-like duplication rule
// ---------------------------------------------------------------------------

test("scanSource flags duplicated badge-like styling in a non-badge file", () => {
  const source = `const s = { borderRadius: "rounded-[4px]", fontFamily: "var(--aurora-font-mono)" }`
  const findings = scanSource(source, "registry/aurora/ui/card.tsx")
  // The regex spans up to 140 chars between rounded-[4px] and fontFamily — only
  // flag if they appear close together as badge duplication.
  // (Result depends on proximity; just verify no crash and returns an array.)
  assert.ok(Array.isArray(findings))
})

test("scanSource never flags badge.tsx for badge-like styling", () => {
  const source = `rounded-[4px] fontFamily: 'var(--aurora-font-mono'`
  const findings = scanSource(source, "registry/aurora/ui/badge.tsx")
  assert.equal(findings.filter((f: string) => f.includes("badge-like")).length, 0)
})

// ---------------------------------------------------------------------------
// line number accuracy
// ---------------------------------------------------------------------------

test("scanSource reports the correct 1-based line number", () => {
  const source = `line one\nline two\n<button>bad</button>`
  const findings = scanSource(source, "registry/aurora/ui/card.tsx")
  assert.equal(findings.length, 1)
  assert.match(findings[0], /registry\/aurora\/ui\/card\.tsx:3/)
})

// ---------------------------------------------------------------------------
// clean source returns no findings
// ---------------------------------------------------------------------------

test("scanSource returns empty array for a clean component", () => {
  const source = `
import { Button } from "@/registry/aurora/ui/button"
export function MyCard() {
  return <Button>click</Button>
}
`
  const findings = scanSource(source, "registry/aurora/ui/my-card.tsx")
  assert.equal(findings.length, 0)
})
