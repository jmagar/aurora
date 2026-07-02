import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Kotlin/Compose parity map — parsed from the authoritative table in
 * docs/component-kotlin-map.md ("Current Registry → Android Counterparts"),
 * so the /components Android flavor can never drift from the doc.
 *
 * Server-only (fs): call from a server component and pass the result down as
 * a prop. Returns registry item name → Kotlin file (e.g. "aurora-button" →
 * "AuroraButton.kt"). Rows whose counterpart is prose ("No direct Kotlin
 * component; …") are omitted — those components don't appear in the Android
 * flavor.
 */
export function getKotlinMap(): Record<string, string> {
  const src = readFileSync(join(process.cwd(), "docs/component-kotlin-map.md"), "utf8")

  const start = src.indexOf("## Current Registry → Android Counterparts")
  const end = src.indexOf("## Observed Alignment Notes")
  if (start < 0 || end <= start) {
    throw new Error(
      "[aurora/kotlin-map] could not locate the 'Current Registry → Android Counterparts' table in docs/component-kotlin-map.md",
    )
  }

  const map: Record<string, string> = {}
  for (const m of src
    .slice(start, end)
    .matchAll(/^\|\s*`(aurora-[a-z0-9-]+)`\s*\|[^|]*\|\s*([^|]*)\|/gm)) {
    const kt = m[2].match(/`([A-Za-z0-9]+\.kt)`/)
    if (kt) map[m[1]] = kt[1]
  }

  if (Object.keys(map).length < 30) {
    throw new Error(
      `[aurora/kotlin-map] parsed only ${Object.keys(map).length} Kotlin counterparts — the table format in docs/component-kotlin-map.md probably changed`,
    )
  }
  return map
}
