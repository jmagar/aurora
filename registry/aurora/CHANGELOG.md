# Aurora Registry Changelog

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
- **`onClick` guard (behavior change).** `onClick` now `preventDefault()` +
  `stopPropagation()` and returns early when the button is `disabled` or `loading`.
  **Callers relying on a disabled `asChild` button still firing `onClick` will see that
  click now suppressed.**
- **Memoization (no API change).** The computed `className` and merged inline `style`
  are now memoized via `useMemo`, and the component is wrapped in `React.memo`.
  Performance only — public API and rendered output are unchanged.

### Input (`ui/input.tsx`)

- **Ref-based clear (behavioral fix).** The clearable variant's clear button now mutates
  the real input element via a ref (native value setter) and dispatches a bubbling
  `input` event, instead of constructing a detached element and passing it as
  `event.target`. Form libraries (react-hook-form, Formik) reading `e.target.name` /
  `e.target.form` from the clear event now receive the real element.
