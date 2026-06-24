# Changelog

All notable changes to Aurora are documented here. Aurora follows
[Semantic Versioning](https://semver.org/). Install URLs at
`aurora.tootie.tv/r/<name>.json` are a public contract — renames are
breaking changes and will be listed here.

---

## 0.3.0

### Breaking

- **`Badge` — `badgeVariants` export removed.** The named `badgeVariants` CVA
  helper is gone. A deprecated no-op shim (`export const badgeVariants = undefined`)
  remains to surface a clear import error instead of a silent undefined. If you
  depended on `badgeVariants`, switch to the `<Badge>` component directly.

- **`Badge` — `tone="default"` deprecated.** Passing `tone="default"` (or the
  old `variant="default"` alias) now emits a `console.warn` in development:
  ```
  [Aurora Badge] tone="default" is deprecated. Use tone="neutral" instead.
  ```
  Switch to `tone="neutral"`. The alias still renders but will be removed in a
  future version.

### New

- **`aurora-inject-once` lib helper** (`registry/aurora/lib/inject-once.ts`).
  Shared utility that guards a dynamic `<style>` injection against duplicates
  using a stable DOM `id` attribute — safe across React Fast Refresh hot
  reloads, where module-level booleans reset but the DOM persists.
  Install: `npx shadcn@latest add https://aurora.tootie.tv/r/aurora-inject-once.json`

- Eight UI components migrated to `inject-once`:
  `Button`, `AlertDialog`, `OperationIcon`, `NumberInput`, `Carousel`,
  `CopyButton`, `Card`, and `Avatar`. These components now declare
  `@aurora/aurora-inject-once` in their `registryDependencies`.

### Changed

- **`next.config.ts`** — `AURORA_DEV_ORIGIN` environment variable now controls
  the dev-proxy origin (was hardcoded). Set it if your dev network differs from
  the default.

- **`export-aurora-tokens.mjs`** — `resolveVars` now throws hard errors instead
  of silently returning `undefined` for unresolvable tokens, circular variable
  references, or base/base key collisions. Broken token exports will fail loudly
  at build time rather than producing corrupt output.

- **Gallery `generateStaticParams`** — production builds now assert that every
  DEMOS key resolves to a registered registry item. Unknown slugs throw at build
  time; dev emits a `console.warn`.

---

## 0.2.x and earlier

Pre-0.3.0 changes are not retroactively documented. See git history for the
full record.
