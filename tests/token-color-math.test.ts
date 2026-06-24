import assert from "node:assert/strict"
import test from "node:test"

// The script guards its build/run side effects behind an `isMain` check
// (process.argv[1] === fileURLToPath(import.meta.url)), so importing it here
// only pulls in the pure color-math functions — no CSS is read, nothing is
// written, and process.exit is never called.
import {
  parseColor,
  hex2,
  rgbaToHex,
  blendColors,
  colorMixPercentages,
  tryResolveColorMix,
  resolveVars,
} from "../scripts/export-aurora-tokens.mjs"

// ─── parseColor ────────────────────────────────────────────────────────────

test("parseColor handles #rgb shorthand (each nibble doubled)", () => {
  // #abc → aa bb cc → 170, 187, 204, alpha 1
  assert.deepEqual(parseColor("#abc"), [170, 187, 204, 1])
})

test("parseColor handles #rrggbb", () => {
  // Aurora cyan accent
  assert.deepEqual(parseColor("#29b6f6"), [41, 182, 246, 1])
})

test("parseColor handles #rrggbbaa (alpha byte → 0..1)", () => {
  // 0x80 = 128; 128/255 = 0.5019607843137255
  assert.deepEqual(parseColor("#29b6f680"), [41, 182, 246, 128 / 255])
})

test("parseColor handles rgb() with implicit alpha 1", () => {
  assert.deepEqual(parseColor("rgb(41, 182, 246)"), [41, 182, 246, 1])
})

test("parseColor handles rgba() with explicit alpha", () => {
  assert.deepEqual(parseColor("rgba(41,182,246,0.5)"), [41, 182, 246, 0.5])
})

test("parseColor handles the transparent keyword", () => {
  assert.deepEqual(parseColor("transparent"), [0, 0, 0, 0])
})

test("parseColor is case-insensitive and trims whitespace", () => {
  assert.deepEqual(parseColor("  #29B6F6  "), [41, 182, 246, 1])
})

// Known limitations — pinned so a future change is a deliberate, visible diff.
test("parseColor returns null for color forms it does not support", () => {
  // oklch(), hsl(), and CSS named colors are NOT parsed by this script.
  // These assertions pin CURRENT behavior; they document a limitation, not a bug.
  assert.equal(parseColor("oklch(0.7 0.1 200)"), null)
  assert.equal(parseColor("hsl(200, 50%, 50%)"), null)
  assert.equal(parseColor("rebeccapurple"), null)
  assert.equal(parseColor("not-a-color"), null)
})

// ─── hex2 ────────────────────────────────────────────────────────────────────

test("hex2 clamps below 0 and above 255 and 2-pads", () => {
  assert.equal(hex2(-10), "00")
  assert.equal(hex2(0), "00")
  assert.equal(hex2(255), "ff")
  assert.equal(hex2(300), "ff")
  assert.equal(hex2(5), "05")
})

test("hex2 rounds half up", () => {
  // 0.3 * 255 = 76.5 → round → 77 → 0x4d
  assert.equal(hex2(0.3 * 255), "4d")
})

// ─── rgbaToHex ─────────────────────────────────────────────────────────────

test("rgbaToHex drops alpha at the a >= 0.9999 cutoff (→ #rrggbb)", () => {
  assert.equal(rgbaToHex(41, 182, 246, 1), "#29b6f6")
  assert.equal(rgbaToHex(41, 182, 246, 0.9999), "#29b6f6")
})

test("rgbaToHex emits 8-digit form below the cutoff", () => {
  // 0.5 * 255 = 127.5 → round → 128 → 0x80
  assert.equal(rgbaToHex(41, 182, 246, 0.5), "#29b6f680")
})

test("rgbaToHex below cutoff still emits a full ff alpha byte when it rounds to 255", () => {
  // Pins a subtle edge: alpha is below the 0.9999 short-circuit, so the 8-digit
  // branch runs, but 0.99989 * 255 rounds to 255 → 'ff'. Current behavior.
  assert.equal(rgbaToHex(41, 182, 246, 0.99989), "#29b6f6ff")
})

test("rgbaToHex round-trips through parseColor", () => {
  const hex = rgbaToHex(41, 182, 246, 0.5)
  const [r, g, b, a] = parseColor(hex)!
  assert.equal(r, 41)
  assert.equal(g, 182)
  assert.equal(b, 246)
  // 0x80 / 255 — the 8-bit hex round-trip is not exactly 0.5
  assert.equal(a, 128 / 255)
})

// ─── colorMixPercentages ─────────────────────────────────────────────────────

test("colorMixPercentages infers the second percentage when omitted", () => {
  assert.equal(colorMixPercentages("30", undefined), 30)
  assert.equal(colorMixPercentages("75", undefined), 75)
})

test("colorMixPercentages normalizes two explicit percentages to a ratio", () => {
  // 20% / (20% + 60%) = 25%
  assert.equal(colorMixPercentages("20", "60"), 25)
})

test("colorMixPercentages returns null when total weight is zero", () => {
  assert.equal(colorMixPercentages("0", "0"), null)
})

// ─── blendColors (premultiplied-alpha sRGB) ───────────────────────────────────

test("blendColors mixes a solid color with transparent (header spec example)", () => {
  // The script header documents:
  //   color-mix(in srgb, #29b6f6 30%, transparent)
  //   → rgba(41, 182, 246, 0.30)  (cyan at 30% opacity)
  // aOut = 1*0.3 + 0*0.7 = 0.3; premult channels divide back out to the
  // original RGB; 0.3 * 255 = 76.5 → round → 77 → 0x4d.
  const out = blendColors([41, 182, 246, 1], 30, [0, 0, 0, 0])
  assert.equal(out, "#29b6f64d")
})

test("blendColors averages two opaque colors at 50%", () => {
  // 50% white + 50% black; each channel 127.5 → round → 128 → 0x80
  const out = blendColors([255, 255, 255, 1], 50, [0, 0, 0, 1])
  assert.equal(out, "#808080")
})

test("blendColors collapses a fully transparent result to #00000000", () => {
  const out = blendColors([41, 182, 246, 0], 30, [0, 0, 0, 0])
  assert.equal(out, "#00000000")
})

// ─── tryResolveColorMix (string → hex) ─────────────────────────────────────

test("tryResolveColorMix evaluates the header spec example end-to-end", () => {
  assert.equal(
    tryResolveColorMix("color-mix(in srgb, #29b6f6 30%, transparent)"),
    "#29b6f64d",
  )
})

test("tryResolveColorMix evaluates a 50/50 mix of two hex colors", () => {
  assert.equal(
    tryResolveColorMix("color-mix(in srgb, #ffffff 50%, #000000)"),
    "#808080",
  )
})

test("tryResolveColorMix returns null for non color-mix input", () => {
  assert.equal(tryResolveColorMix("#29b6f6"), null)
})

test("tryResolveColorMix returns null when a color argument is unparseable", () => {
  // oklch() is not parseable by parseColor, so the mix cannot be resolved.
  assert.equal(
    tryResolveColorMix("color-mix(in srgb, oklch(0.7 0.1 200) 30%, transparent)"),
    null,
  )
})

// ─── resolveVars ───────────────────────────────────────────────────────────

test("resolveVars resolves a multi-hop var() chain to a concrete value", () => {
  const vars = {
    "--aurora-accent": "#29b6f6",
    "--aurora-ring": "var(--aurora-accent)",
    "--aurora-focus": "var(--aurora-ring)",
  }
  assert.equal(resolveVars("var(--aurora-focus)", vars), "#29b6f6")
})

test("resolveVars uses the fallback for an unknown var()", () => {
  assert.equal(resolveVars("var(--aurora-missing, #ff0000)", {}), "#ff0000")
})

test("resolveVars throws for an unknown var() with no fallback", () => {
  // resolveVars was hardened to throw instead of silently returning the
  // unresolved token — broken token exports now fail loudly at build time.
  assert.throws(
    () => resolveVars("var(--aurora-missing)", {}),
    /Unresolvable var\(\) reference/,
  )
})
