# Changelog

All notable changes to Aurora are documented here. Aurora follows
[Semantic Versioning](https://semver.org/). Install URLs at
`aurora.tootie.tv/r/<name>.json` are a public contract — renames are
breaking changes and will be listed here.

---

## Unreleased

### Breaking and migration notes

- **Production delivery is immutable.** The public service no longer uses the
  writable `pnpm dev` container. Operators must deploy the tested GHCR digest
  through `ops/compose/production.yaml`; `docker compose up` without an explicit
  development profile is intentionally a no-op. See `docs/deployment.md`.
- **Node 24 ESM is the project contract.** Local and CI tooling now require Node
  24 and treat `.js`/`.ts` as ES modules. Remove CommonJS-only test assumptions
  and use `import`/`export` in project tooling.
- **Android local consumption requires explicit composite substitution.** Aurora
  is not published to Maven. Consumers must include this repository's `android/`
  build and substitute `tv.tootie.aurora:aurora`; use the current checkout path,
  not the retired `aurora-design-system` path. See the packaged skill's Android
  reference.

### Security and delivery

- Added per-request nonce CSP propagation and removed `script-src 'unsafe-inline'`.
- Added short caching for mutable `/r/*.json` discovery URLs and documented
  commit-SHA registry URLs for reproducible installs.
- Added exact-SHA image builds, SBOM/provenance attestations, vulnerability
  scanning, keyless signing, signature verification, and digest-only promotion.
- Split OpenWiki generation (model secret, read-only repository token) from PR
  creation (write token, no model secret), pinned its dependency graph, and use
  fresh superseding branches.
- Added public landing/content-negotiation/schema/checksum/TLS synthetics,
  optional failure webhooks, production resource/log limits, and tracked
  Compose/SWAG topology.

### Registry and tokens

- Mutable registry URLs remain supported for interactive discovery and receive
  short revalidation caching. Production consumers should pin the immutable
  `raw.githubusercontent.com/jmagar/aurora/<full-commit>/public/r/<name>.json`
  form described in `docs/versioning.md`.
- Current main includes registry graph, component API, token export, theme, and
  Android light/dark parity changes made after v0.3.1. Consumers upgrading from
  v0.3.1 should rebuild vendored components, review changed component props,
  regenerate Android tokens, and verify both color modes before release.

## [0.3.1](https://github.com/jmagar/aurora/compare/v0.3.0...v0.3.1) (2026-07-11)


### Fixed

* **ci:** switch OpenWiki to local openai-compatible proxy ([7caa3bc](https://github.com/jmagar/aurora/commit/7caa3bc95673fd98025c332b595c7db22862e4c9))
* **ui:** correct token/color bugs across Aurora UI primitives ([#33](https://github.com/jmagar/aurora/issues/33)) ([494f06a](https://github.com/jmagar/aurora/commit/494f06a699602caf99fb2af52eda61d355695600))

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
