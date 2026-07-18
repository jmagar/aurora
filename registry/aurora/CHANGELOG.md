# Aurora Registry Changelog

## Unreleased

- URL-bearing components now accept only absolute HTTP(S) links and render
  unsafe or malformed values as non-actionable content.
- `Sources` now composes the canonical `Source` component instead of publishing
  a second implementation.
- Clipboard actions require the Async Clipboard API and report unsupported
  environments through the existing error state.

The `@aurora` shadcn registry is **copy-on-install**: components are copied into each
consumer at install time, so updates here do not propagate automatically. This file is a
lightweight, dated list of **behavioral changes to registry primitives** that consumers
should review when re-installing or re-syncing a component.

No semver — entries are grouped by date, newest first. Each entry notes the affected
primitive and whether the change is a behavioral fix or a behavior change callers may
need to account for.

## 2026-06-15

### Button (`ui/button.tsx`)

- **`asChild` + disabled handling (behavior change).** When `asChild` is set and the
  button is `disabled` or `loading`, the rendered child now receives `aria-disabled`,
  `tabIndex={-1}`, and `pointer-events-none` / reduced-opacity styling. Previously a
  disabled `asChild` button had no disabled affordance.
- **`onClick` guard (behavior change).** The Button's own `onClick` prop now
  `preventDefault()` + `stopPropagation()` and returns early when the button is
  `disabled` or `loading`, so a click no longer invokes the handler passed to
  `<Button onClick={...} />`. Note: with `asChild`, this guard only suppresses the
  Button's own `onClick` — a click handler attached to the Radix-Slot-composed
  **child** is not stopped by `stopPropagation()` (the child's handler runs in the
  same capture/bubble path, not below the Button). The reliable enforcement for the
  disabled/loading state is the `pointer-events-none` class applied to the rendered
  element, which prevents the click from being dispatched at all.
- **Memoization (no API change).** The computed `className` and merged inline `style`
  are now memoized via `useMemo`, and the component is wrapped in `React.memo`.
  Performance only — public API and rendered output are unchanged.

### Input (`ui/input.tsx`)

- **Ref-based clear (behavioral fix).** The clearable variant's clear button now mutates
  the real input element via a ref (native value setter) and dispatches a bubbling
  `input` event, instead of constructing a detached element and passing it as
  `event.target`. Form libraries (react-hook-form, Formik) reading `e.target.name` /
  `e.target.form` from the clear event now receive the real element.
- **`unstyled` escape hatch (additive API, no behavior change).** New optional
  `unstyled?: boolean` prop (default `false`). When `true`, the component renders a
  **bare `<input>`** — no wrapper `<div>`, no inline style skin, no imperative
  `onFocus`/`onBlur` border/box-shadow mutation, and no adornment/clear logic —
  forwarding only `className`, the `ref`, `type`, `value`/`defaultValue`/`onChange`,
  and the remaining props, so the consumer's className/CSS fully controls
  appearance. Lets bespoke-CSS-styled inputs route through the primitive. Existing
  (styled) usage is unchanged.

### Kbd (`ui/kbd.tsx`)

- **`unstyled` escape hatch (additive API, no behavior change).** New optional
  `unstyled?: boolean` prop (default `false`). When `true`, the component renders a
  **bare `<kbd>`** with only `className` and the forwarded props/ref and **no inline
  style object**, so the consumer's CSS fully controls appearance. Existing (styled)
  usage is unchanged.
