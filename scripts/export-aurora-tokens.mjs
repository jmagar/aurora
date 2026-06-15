#!/usr/bin/env node
/**
 * export-aurora-tokens.mjs
 *
 * Extracts Aurora design tokens from aurora.css and emits W3C DTCG JSON.
 *
 * Scope (v1): dark theme only (:root/.dark block).
 * Pipeline coverage: hex/rgba colors + px/em/number dimensions.
 * Excluded: gradients, shadows, font families, unresolvable expressions.
 *
 * Resolution order:
 *   1. Collect all --aurora-* custom property raw values
 *   2. Resolve var(--aurora-*) chains recursively
 *   3. Resolve color-mix(in srgb, A N%, B) via premultiplied-alpha sRGB mixing
 *   4. Convert rgba() to 8-digit hex
 *   5. Classify by type; exclude anything not representable as Color/Dp/number
 *   6. Emit aurora.tokens.json + EXCLUSIONS.json
 *   7. Validate: fail non-zero if any $value still contains a CSS function
 */

import { parse, walk, generate } from 'css-tree';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Paths ────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const CSS_SOURCE    = resolve(ROOT, 'registry/aurora/styles/aurora.css');
const OUTPUT_DIR    = resolve(ROOT, 'android/tokens');
const TOKENS_PATH   = resolve(OUTPUT_DIR, 'aurora.tokens.json');
const EXCLUSIONS_PATH = resolve(OUTPUT_DIR, 'EXCLUSIONS.json');

// ─── Color helpers ────────────────────────────────────────────────────────────

/**
 * Parse a CSS color string to [r, g, b, a] where r/g/b ∈ [0,255], a ∈ [0,1].
 * Returns null if unparseable.
 */
export function parseColor(str) {
  str = str.trim().toLowerCase();

  if (str === 'transparent') return [0, 0, 0, 0];

  // #rgb
  if (/^#[0-9a-f]{3}$/.test(str)) {
    return [
      parseInt(str[1] + str[1], 16),
      parseInt(str[2] + str[2], 16),
      parseInt(str[3] + str[3], 16),
      1,
    ];
  }

  // #rrggbb
  if (/^#[0-9a-f]{6}$/.test(str)) {
    return [
      parseInt(str.slice(1, 3), 16),
      parseInt(str.slice(3, 5), 16),
      parseInt(str.slice(5, 7), 16),
      1,
    ];
  }

  // #rrggbbaa
  if (/^#[0-9a-f]{8}$/.test(str)) {
    return [
      parseInt(str.slice(1, 3), 16),
      parseInt(str.slice(3, 5), 16),
      parseInt(str.slice(5, 7), 16),
      parseInt(str.slice(7, 9), 16) / 255,
    ];
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    const [, r, g, b, a] = rgbMatch;
    return [+r, +g, +b, a !== undefined ? +a : 1];
  }

  return null;
}

/** Clamp n to [0, 255] and return as 2-digit hex. */
export function hex2(n) {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
}

/** Convert [r,g,b,a] to lowercase hex string (#rrggbb or #rrggbbaa). */
export function rgbaToHex(r, g, b, a) {
  const base = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  if (a >= 0.9999) return base;
  return `${base}${hex2(a * 255)}`;
}

/**
 * Blend two colors using CSS color-mix(in srgb) semantics.
 * Uses premultiplied-alpha interpolation (CSS Color Level 5 spec).
 *
 * color-mix(in srgb, colorA percentA%, colorB)
 * → colorA's premult channel * (percentA/100) + colorB's premult channel * (1 - percentA/100)
 * → divide result channels by result alpha
 *
 * This correctly handles mixing with `transparent`:
 *   color-mix(in srgb, #29b6f6 30%, transparent)
 *   → rgba(41, 182, 246, 0.30)  (cyan at 30% opacity)
 *
 * @param {[number,number,number,number]} colorA - [r,g,b,a]
 * @param {number} percentA - percentage for colorA (0-100)
 * @param {[number,number,number,number]} colorB - [r,g,b,a]
 * @returns {string} hex color
 */
export function blendColors(colorA, percentA, colorB) {
  const [rA, gA, bA, aA] = colorA;
  const [rB, gB, bB, aB] = colorB;
  const pA = percentA / 100;
  const pB = 1 - pA;

  const aOut = aA * pA + aB * pB;

  if (aOut < 0.0001) return '#00000000';

  // Premultiplied channels
  const rOut = (rA * aA * pA + rB * aB * pB) / aOut;
  const gOut = (gA * aA * pA + gB * aB * pB) / aOut;
  const bOut = (bA * aA * pA + bB * aB * pB) / aOut;

  return rgbaToHex(rOut, gOut, bOut, aOut);
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

const COLOR_MIX_RE =
  /^color-mix\(\s*in\s+srgb\s*,\s*(.+?)\s+(\d+(?:\.\d+)?)%\s*,\s*(.+?)(?:\s+(\d+(?:\.\d+)?)%)?\s*\)$/;

export function colorMixPercentages(firstPercent, secondPercent) {
  const first = parseFloat(firstPercent);
  const second = secondPercent === undefined ? 100 - first : parseFloat(secondPercent);
  const total = first + second;
  if (total <= 0) return null;
  return (first / total) * 100;
}

/**
 * If value is a simple color-mix(in srgb, ...) expression (no nesting),
 * evaluate it and return a hex string. Returns null if not a color-mix or
 * the colors cannot be parsed.
 */
export function tryResolveColorMix(value) {
  const m = value.trim().match(COLOR_MIX_RE);
  if (!m) return null;
  const [, rawA, pctStr, rawB, rawPctB] = m;
  const colorA = parseColor(rawA.trim());
  const colorB = parseColor(rawB.trim());
  if (!colorA || !colorB) return null;
  const normalizedPercentA = colorMixPercentages(pctStr, rawPctB);
  if (normalizedPercentA === null) return null;
  return blendColors(colorA, normalizedPercentA, colorB);
}

/**
 * Resolve all var(--aurora-*) references in a value string.
 * Stops at depth 20 to prevent infinite loops on circular references.
 */
export function resolveVars(value, vars, visited = new Set(), depth = 0) {
  if (depth > 20) {
    console.warn(`  warn: var() depth limit reached for value: ${value.slice(0, 60)}`);
    return value;
  }
  return value.replace(/var\(\s*(--aurora-[\w-]+)\s*(?:,\s*([^)]+?))?\s*\)/g, (_match, varName, fallback) => {
    if (visited.has(varName)) {
      console.warn(`  warn: circular var() reference: ${varName}`);
      return fallback === undefined ? `var(${varName})` : resolveVars(fallback.trim(), vars, visited, depth + 1);
    }
    const raw = vars[varName];
    if (raw === undefined) {
      if (fallback !== undefined) {
        return resolveVars(fallback.trim(), vars, new Set(visited), depth + 1);
      }
      return `var(${varName})`;
    }
    return resolveVars(raw, vars, new Set([...visited, varName]), depth + 1);
  });
}

/**
 * Attempt to fully resolve a raw token value to a concrete scalar.
 * Returns { resolved, type } or null if the value cannot be represented
 * as a DTCG-compatible scalar.
 *
 * Types: 'color' | 'dimension' | 'number'
 */
function resolveToken(rawValue) {
  let v = rawValue.trim();

  // Resolve var() chains first
  v = resolveVars(v, rawVars);

  // Then try color-mix (after var resolution, all arguments should be hex/rgba)
  if (v.includes('color-mix')) {
    const mixed = tryResolveColorMix(v);
    if (mixed) {
      v = mixed;
    } else {
      return null; // complex / nested color-mix — exclude
    }
  }

  // Convert standalone rgba() to hex
  const parsed = parseColor(v);
  if (parsed) {
    return { resolved: rgbaToHex(...parsed), type: 'color' };
  }

  // px dimension (font sizes, radii, etc.)
  if (/^[\d.]+px$/.test(v)) {
    return { resolved: v, type: 'dimension' };
  }

  // em dimension (letter-spacing)
  if (/^-?[\d.]+em$/.test(v)) {
    return { resolved: v, type: 'dimension' };
  }

  // Unitless number (font weights, line heights)
  if (/^[\d.]+$/.test(v)) {
    return { resolved: parseFloat(v), type: 'number' };
  }

  // Anything else (gradient, shadow, font stack, etc.) — exclude
  return null;
}

/**
 * Classify the reason for excluding a raw value.
 */
function exclusionReason(rawValue) {
  const v = rawValue.toLowerCase();
  if (v.includes('linear-gradient') || v.includes('radial-gradient')) return 'gradient';
  if (v.includes('font-') || v.includes("'") || v.includes('"')) return 'font-family';
  if (/^\s*\d+px\s+\d+px\s+\d+px/.test(v)) return 'shadow';
  if (v.includes('inset ') || (v.includes('rgba') && v.includes('px'))) return 'shadow';
  if (v.includes('color-mix')) return 'unresolvable-color-mix';
  if (v.includes('var(')) return 'unresolved-var';
  return 'complex-value';
}

// ─── CSS extraction ───────────────────────────────────────────────────────────

// Module-level map of --aurora-varName → raw value string, populated by the
// run path. `resolveToken` reads this global. Declared here (not inside the
// isMain guard) so its scope matches the original top-level behavior.
/** @type {Record<string, string>} */
let rawVars = {};

// Only execute the build/run side effects when invoked directly
// (e.g. `node scripts/export-aurora-tokens.mjs` / `pnpm tokens:generate`),
// not when the pure functions above are imported by a test.
const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {

console.log('Reading CSS:', CSS_SOURCE);
const cssText = readFileSync(CSS_SOURCE, 'utf8');
const ast = parse(cssText);

rawVars = {};

walk(ast, function (node) {
  if (node.type !== 'Rule') return;

  // We want only explicit dark theme selectors.
  const selectorText = generate(node.prelude).replace(/\s+/g, '');
  const hasDarkSelector = selectorText.split(',').some((selector) => selector.includes('.dark'));
  if (!hasDarkSelector) return;

  // Collect all --aurora-* declarations
  walk(node.block, function (decl) {
    if (decl.type !== 'Declaration') return;
    if (!decl.property.startsWith('--aurora-')) return;
    rawVars[decl.property] = generate(decl.value).trim();
  });
});

const count = Object.keys(rawVars).length;
console.log(`Collected ${count} --aurora-* raw declarations from dark theme block`);
if (count === 0) {
  console.error('ERROR: No --aurora-* tokens found. Check the CSS selector matching.');
  process.exit(1);
}

// ─── Token processing ─────────────────────────────────────────────────────────

/** @type {Record<string, { $value: string|number, $type: string }>} flat map before nesting */
const emittedFlat = {};

/** @type {Array<{ name: string, rawValue: string, reason: string }>} */
const exclusions = [];

for (const [prop, rawValue] of Object.entries(rawVars)) {
  // Strip --aurora- prefix, split by hyphens to get path segments
  const suffix = prop.slice('--aurora-'.length); // e.g. 'accent-primary'
  const segments = suffix.split('-');             // e.g. ['accent', 'primary']

  const result = resolveToken(rawValue);

  if (result) {
    emittedFlat[suffix] = { $value: result.resolved, $type: result.type, _segments: segments };
  } else {
    exclusions.push({
      name: prop,
      rawValue,
      reason: exclusionReason(resolveVars(rawValue, rawVars)),
    });
  }
}

console.log(`Emitted: ${Object.keys(emittedFlat).length} tokens`);
console.log(`Excluded: ${exclusions.length} tokens`);

// ─── Build nested DTCG structure ──────────────────────────────────────────────

/**
 * Set a value at a nested path in an object.
 *
 * When a shorter prefix token conflicts with a longer one (e.g. --aurora-error vs
 * --aurora-error-surface), the shorter one becomes the `base` key of the branch
 * so the structure remains a valid DTCG group.
 *
 * The `base` sentinel is also applied at the leaf position if a branch already
 * exists there, guarding against CSS declaration order variation.
 */
function setNested(obj, segments, value) {
  let cur = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (cur[key] === undefined) {
      cur[key] = {};
    } else if (cur[key].$value !== undefined) {
      // A leaf exists where we need a branch — promote it to `base`
      const leaf = cur[key];
      cur[key] = { base: leaf };
    }
    cur = cur[key];
  }
  const lastKey = segments[segments.length - 1];
  if (cur[lastKey] !== undefined && cur[lastKey].$value === undefined) {
    // A branch already exists — this token is the base value for the group
    cur[lastKey].base = value;
  } else {
    cur[lastKey] = value;
  }
}

const dark = {};

for (const [, tokenData] of Object.entries(emittedFlat)) {
  const { _segments, ...dtcgToken } = tokenData;
  setNested(dark, _segments, dtcgToken);
}

const output = { dark };

// ─── Output validation gate ───────────────────────────────────────────────────

const outputStr = JSON.stringify(output, null, 2);
const FORBIDDEN_PATTERNS = ['var(', 'color-mix(', 'linear-gradient(', 'radial-gradient('];
const violations = [];

for (const [suffix, tokenData] of Object.entries(emittedFlat)) {
  const val = String(tokenData.$value);
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (val.includes(pattern)) {
      violations.push({ token: `--aurora-${suffix}`, value: val, pattern });
    }
  }
}

if (violations.length > 0) {
  console.error('\nERROR: Output validation failed — unresolved CSS functions in token values:');
  for (const v of violations) {
    console.error(`  ${v.token}: "${v.value}" contains "${v.pattern}"`);
  }
  process.exit(1);
}

// ─── Write outputs ────────────────────────────────────────────────────────────

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

writeFileSync(TOKENS_PATH, outputStr, 'utf8');
console.log(`\nWrote: ${TOKENS_PATH}`);

const exclusionsOutput = {
  source: 'registry/aurora/styles/aurora.css',
  theme: 'dark',
  note: 'These tokens cannot be represented as Color/Dp/number in Kotlin Compose. Handle manually in AuroraTheme.kt or AuroraBrushes.kt.',
  excluded: exclusions.sort((a, b) => a.reason.localeCompare(b.reason) || a.name.localeCompare(b.name)),
};

writeFileSync(EXCLUSIONS_PATH, JSON.stringify(exclusionsOutput, null, 2), 'utf8');
console.log(`Wrote: ${EXCLUSIONS_PATH}`);

// ─── Summary ──────────────────────────────────────────────────────────────────

const colorCount = Object.values(emittedFlat).filter(t => t.$type === 'color').length;
const dimCount   = Object.values(emittedFlat).filter(t => t.$type === 'dimension').length;
const numCount   = Object.values(emittedFlat).filter(t => t.$type === 'number').length;

const byReason = {};
for (const e of exclusions) {
  byReason[e.reason] = (byReason[e.reason] || 0) + 1;
}

console.log('\n── Token summary ────────────────────────────────────────────');
console.log(`  color      : ${colorCount}`);
console.log(`  dimension  : ${dimCount}`);
console.log(`  number     : ${numCount}`);
console.log(`  total emitted: ${Object.keys(emittedFlat).length}`);
console.log('\n── Exclusion summary ────────────────────────────────────────');
for (const [reason, n] of Object.entries(byReason).sort()) {
  console.log(`  ${reason.padEnd(28)}: ${n}`);
}
console.log(`  total excluded: ${exclusions.length}`);
console.log('\nDone. Output validation passed.');

} // end if (isMain)
