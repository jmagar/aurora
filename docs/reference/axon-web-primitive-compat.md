# Axon Web Primitive Compatibility

Compatibility note for Axon primitive convergence rows W-PAL-002, W-PAL-004, W-PAL-005, and S-STL-004.

## NativeSelect

`aurora-native-select` is the registry surface for simple settings value lists. It forwards `HTMLSelectElement` refs and extends `React.SelectHTMLAttributes<HTMLSelectElement>`, so Axon settings lists can keep native `value`, `onChange`, `name`, `disabled`, and autocomplete behavior without a local wrapper.

## ScrollArea

`aurora-scroll-area` keeps the compatibility shape needed by the palette action list:

- root ref: `React.forwardRef<HTMLDivElement, ScrollAreaProps>` attaches the ref to the outer bordered root.
- root props: `ScrollAreaProps` extends `React.HTMLAttributes<HTMLDivElement>`, so `className`, `style`, ARIA attributes, and event handlers land on the root.
- viewport hook: `viewportClassName` styles the inner scrolling viewport while preserving the Aurora root chrome.

Axon should resync to this shape instead of carrying a local Aurora-like fork.

## StatusIndicator

`aurora-status-indicator` covers both labeled status rows and dot-only status surfaces. Use `showLabel={false}` for dot-only display, and `dotClassName` or `dotStyle` for the rare size/appearance adjustment. Keep an accessible name on dot-only usages with `aria-label`.

## Button

`aurora-button` already preserves disabled/loading `asChild` guards in the source and generated artifact: disabled or loading buttons set non-button child affordances with `aria-disabled`, `tabIndex={-1}`, disabled styling, and click suppression. Loading also sets `aria-busy` and renders the spinner.
