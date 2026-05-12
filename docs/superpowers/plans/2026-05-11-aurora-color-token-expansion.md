# Aurora Color Token Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Aurora's color system into brand, semantic, and interaction layers; refactor Badge, Callout, and StatusIndicator to consume the new contract; and teach the contract through the gallery.

**Architecture:** Keep the existing surface shell intact in `registry/aurora/styles/aurora.css`. Add a violet expressive family (with surface/border tokens), a four-token semantic family for each state (base / surface / border / foreground), and interaction tokens. Components consume pre-computed CSS tokens only — no inline `color-mix()` in component code. Badge drops CVA entirely and uses a unified `badgeToneMap`; `variant="default"` remains a valid prop value and silently resolves to `neutral` for backward compatibility. Tasks 2 (component refactor) and 3 (gallery demos) are independent and can run in parallel. Validation uses ESLint and `pnpm registry:build` / `pnpm build`; no new test tooling is introduced.

**Tech Stack:** Next.js 16, React 19, TypeScript, Aurora CSS custom properties, shadcn registry (`pnpm registry:build`), ESLint

**Key decisions from research:**
- `variant` prop name is kept on Badge (20+ existing call sites; renaming is a separate migration)
- `default` variant resolves to `neutral`, not `info` — callers use "default" for running/provisioning/waiting states (operational neutral, not informational)
- CVA (`class-variance-authority`) is removed from Badge — all color values move to a unified inline `badgeToneMap`; the `badgeVariants` export is removed
- Rose and violet surface/border tokens are pre-computed in CSS (not inline strings in component code) — this makes all seven Badge/Callout tones equally themeable
- Light theme uses `var(--aurora-panel-medium)` as the `color-mix` base (not hardcoded `white`) for consistency
- `--aurora-status-offline` is aliased to `--aurora-neutral` (deprecated in place)

---

## File map

- `registry/aurora/styles/aurora.css` — token contract; dark and light theme additions
- `registry/aurora/ui/badge.tsx` — full CVA→toneMap rewrite; new `BadgeTone` type; `default` alias
- `registry/aurora/ui/callout.tsx` — add `neutral` and `violet` variants; move to `toneMap`
- `registry/aurora/ui/status-indicator.tsx` — add `automating` tone; `syncing` → `--aurora-info`; `labelColor` for dim tones
- `registry/aurora/blocks/ai/thinking/thinking.tsx` — replace cyan AI accents with violet
- `registry/aurora/blocks/ai/prompt-input/prompt-input.tsx` — replace cyan AI accents with violet
- `app/gallery/demos/colors-demo.tsx` — three-layer brand/semantic/interaction teaching page
- `app/gallery/demos/badges-demo.tsx` — semantic + expressive badge showcase
- `app/gallery/demos/parity-demo.tsx` — multi-example callout and status-indicator stacks
- `app/gallery/demos/thinking-demo.tsx` — AI/automation framing copy
- `app/gallery/demos/prompt-input-demo.tsx` — violet AI emphasis copy
- `registry.json` — generated; do not edit by hand
- `public/r/aurora-tokens.json` — generated
- `public/r/aurora-badge.json` — generated
- `public/r/aurora-callout.json` — generated
- `public/r/aurora-status-indicator.json` — generated
- `public/r/aurora-thinking.json` — generated
- `public/r/aurora-prompt-input.json` — generated
- `public/r/registry.json` — generated

---

### Task 1: Expand the Aurora token contract

**Files:**
- Modify: `registry/aurora/styles/aurora.css`
- Regenerate: `registry.json`, `public/r/aurora-tokens.json`, `public/r/registry.json`

- [ ] **Step 1: Add the violet accent family and expressive surface tokens to the dark theme**

In `registry/aurora/styles/aurora.css`, insert this block immediately after the `/* Secondary accent — Aurora rose */` block and before `/* Status — muted, never neon */`:

```css
  /* Expressive accent — Aurora violet (AI / automation identity) */
  --aurora-accent-violet:        #a78bfa;
  --aurora-accent-violet-strong: #c4b5fd;
  --aurora-accent-violet-deep:   #7c3aed;
  --aurora-accent-violet-button: #8b5cf6;
  --aurora-accent-violet-surface: color-mix(in srgb, var(--aurora-accent-violet) 12%, var(--aurora-panel-medium));
  --aurora-accent-violet-border:  color-mix(in srgb, var(--aurora-accent-violet) 32%, transparent);

  /* Expressive surface tokens — rose (extends existing rose family) */
  --aurora-accent-pink-surface: color-mix(in srgb, var(--aurora-accent-pink) 12%, var(--aurora-panel-medium));
  --aurora-accent-pink-border:  color-mix(in srgb, var(--aurora-accent-pink) 32%, transparent);
```

- [ ] **Step 2: Add semantic families and interaction tokens to the dark theme**

In `registry/aurora/styles/aurora.css`, insert this block immediately after the `/* Status — muted, never neon */` block (after the `--aurora-status-offline`, `--aurora-error-gradient` lines) and before `/* Code accents */`:

```css
  /* Semantic state families — surface / border / foreground per state */
  --aurora-info:            #72c8f5;
  --aurora-info-surface:    color-mix(in srgb, var(--aurora-info) 12%, var(--aurora-panel-medium));
  --aurora-info-border:     color-mix(in srgb, var(--aurora-info) 34%, transparent);
  --aurora-info-foreground: #dff5ff;

  --aurora-success-surface:    color-mix(in srgb, var(--aurora-success) 12%, var(--aurora-panel-medium));
  --aurora-success-border:     color-mix(in srgb, var(--aurora-success) 34%, transparent);
  --aurora-success-foreground: #dcfbf6;

  --aurora-warn-surface:    color-mix(in srgb, var(--aurora-warn) 12%, var(--aurora-panel-medium));
  --aurora-warn-border:     color-mix(in srgb, var(--aurora-warn) 34%, transparent);
  --aurora-warn-foreground: #f8ead0;

  --aurora-error-surface:    color-mix(in srgb, var(--aurora-error) 12%, var(--aurora-panel-medium));
  --aurora-error-border:     color-mix(in srgb, var(--aurora-error) 34%, transparent);
  --aurora-error-foreground: #fde6eb;

  --aurora-neutral:            #91a8b6;
  --aurora-neutral-surface:    color-mix(in srgb, var(--aurora-neutral) 10%, var(--aurora-panel-medium));
  --aurora-neutral-border:     color-mix(in srgb, var(--aurora-neutral) 28%, transparent);
  --aurora-neutral-foreground: #d7e3ea;

  /* Interaction + system */
  --aurora-overlay:           rgba(4, 10, 14, 0.72);
  --aurora-disabled-text:     color-mix(in srgb, var(--aurora-text-muted) 72%, var(--aurora-border-strong));
  --aurora-disabled-surface:  color-mix(in srgb, var(--aurora-control-surface) 88%, var(--aurora-border-default));
  --aurora-subtle-bg:         color-mix(in srgb, var(--aurora-hover-bg) 52%, transparent);
  --aurora-selected-bg:       color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent);
  --aurora-pressed-bg:        color-mix(in srgb, var(--aurora-accent-primary) 20%, transparent);
  --aurora-focus-ring-strong: color-mix(in srgb, var(--aurora-accent-primary) 52%, transparent);

  /* --aurora-status-offline is deprecated; alias to --aurora-neutral for gradual migration */
  --aurora-status-offline: var(--aurora-neutral);
```

- [ ] **Step 3: Mirror the violet family, expressive surfaces, semantic families, and interaction tokens in the light theme**

In the `.light { ... }` block of `registry/aurora/styles/aurora.css`, add the following after the `--aurora-accent-pink-button` line and before the `--aurora-success` line:

```css
  /* Violet (light) */
  --aurora-accent-violet:         #7c3aed;
  --aurora-accent-violet-strong:  #8b5cf6;
  --aurora-accent-violet-deep:    #5b21b6;
  --aurora-accent-violet-button:  #6d28d9;
  --aurora-accent-violet-surface: color-mix(in srgb, var(--aurora-accent-violet) 10%, var(--aurora-panel-medium));
  --aurora-accent-violet-border:  color-mix(in srgb, var(--aurora-accent-violet) 26%, transparent);

  /* Rose surfaces (light) */
  --aurora-accent-pink-surface: color-mix(in srgb, var(--aurora-accent-pink) 10%, var(--aurora-panel-medium));
  --aurora-accent-pink-border:  color-mix(in srgb, var(--aurora-accent-pink) 26%, transparent);
```

Then, after the existing `--aurora-error-lift` and `--aurora-status-offline` lines in the `.light` block, add:

```css
  /* Semantic families (light) */
  --aurora-info:            #0f7db8;
  --aurora-info-surface:    color-mix(in srgb, var(--aurora-info) 10%, var(--aurora-panel-medium));
  --aurora-info-border:     color-mix(in srgb, var(--aurora-info) 26%, transparent);
  --aurora-info-foreground: #0a4f74;

  --aurora-success-surface:    color-mix(in srgb, var(--aurora-success) 12%, var(--aurora-panel-medium));
  --aurora-success-border:     color-mix(in srgb, var(--aurora-success) 24%, transparent);
  --aurora-success-foreground: #184b43;

  --aurora-warn-surface:    color-mix(in srgb, var(--aurora-warn) 12%, var(--aurora-panel-medium));
  --aurora-warn-border:     color-mix(in srgb, var(--aurora-warn) 24%, transparent);
  --aurora-warn-foreground: #5c450c;

  --aurora-error-surface:    color-mix(in srgb, var(--aurora-error) 10%, var(--aurora-panel-medium));
  --aurora-error-border:     color-mix(in srgb, var(--aurora-error) 24%, transparent);
  --aurora-error-foreground: #6f2330;

  --aurora-neutral:            #6f8793;
  --aurora-neutral-surface:    color-mix(in srgb, var(--aurora-neutral) 12%, var(--aurora-panel-medium));
  --aurora-neutral-border:     color-mix(in srgb, var(--aurora-neutral) 24%, transparent);
  --aurora-neutral-foreground: #334e5d;

  /* Interaction (light) */
  --aurora-overlay:           rgba(7, 19, 28, 0.18);
  --aurora-disabled-text:     color-mix(in srgb, var(--aurora-text-muted) 66%, var(--aurora-border-strong));
  --aurora-disabled-surface:  color-mix(in srgb, var(--aurora-control-surface) 78%, var(--aurora-panel-medium));
  --aurora-subtle-bg:         color-mix(in srgb, var(--aurora-hover-bg) 66%, transparent);
  --aurora-selected-bg:       color-mix(in srgb, var(--aurora-accent-primary) 10%, var(--aurora-panel-medium));
  --aurora-pressed-bg:        color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-panel-medium));
  --aurora-focus-ring-strong: color-mix(in srgb, var(--aurora-accent-primary) 40%, transparent);

  /* Deprecated alias (light) */
  --aurora-status-offline: var(--aurora-neutral);
```

- [ ] **Step 4: Regenerate the token registry payloads**

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm registry:build
```

Expected: `shadcn build` completes and rewrites `registry.json`, `public/r/aurora-tokens.json`, and `public/r/registry.json`.

- [ ] **Step 5: Verify the build**

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm build
```

Expected: Next.js production build completes with no CSS syntax errors.

- [ ] **Step 6: Commit the token contract**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add registry/aurora/styles/aurora.css registry.json public/r/aurora-tokens.json public/r/registry.json
git commit -m "feat: add semantic, violet, and interaction tokens to Aurora contract"
```

---

### Task 2: Refactor Badge, Callout, and StatusIndicator onto semantic roles

> **Parallelizable with Task 3.** Tasks 2 and 3 write to completely different files and have no shared state. They can run concurrently once Task 1 is committed.

**Files:**
- Modify: `registry/aurora/ui/badge.tsx`
- Modify: `registry/aurora/ui/callout.tsx`
- Modify: `registry/aurora/ui/status-indicator.tsx`
- Regenerate: `public/r/aurora-badge.json`, `public/r/aurora-callout.json`, `public/r/aurora-status-indicator.json`, `registry.json`, `public/r/registry.json`

- [ ] **Step 1: Rewrite `badge.tsx` — remove CVA, add unified toneMap**

Replace the entire contents of `registry/aurora/ui/badge.tsx` with:

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Aurora badge tones: semantic roles (info/success/warn/error/neutral)
// and expressive identities (rose/violet).
// "default" is preserved as a backward-compatible alias for "neutral" —
// existing callers using variant="default" for running/provisioning states
// will render with neutral styling without any prop changes.
export type BadgeTone = "info" | "success" | "warn" | "error" | "neutral" | "rose" | "violet"

type ToneTokens = { text: string; border: string; bg: string; dot: string }

const badgeToneMap: Record<BadgeTone, ToneTokens> = {
  info: {
    text:   "var(--aurora-info-foreground)",
    border: "var(--aurora-info-border)",
    bg:     "var(--aurora-info-surface)",
    dot:    "var(--aurora-info)",
  },
  success: {
    text:   "var(--aurora-success-foreground)",
    border: "var(--aurora-success-border)",
    bg:     "var(--aurora-success-surface)",
    dot:    "var(--aurora-success)",
  },
  warn: {
    text:   "var(--aurora-warn-foreground)",
    border: "var(--aurora-warn-border)",
    bg:     "var(--aurora-warn-surface)",
    dot:    "var(--aurora-warn)",
  },
  error: {
    text:   "var(--aurora-error-foreground)",
    border: "var(--aurora-error-border)",
    bg:     "var(--aurora-error-surface)",
    dot:    "var(--aurora-error)",
  },
  neutral: {
    text:   "var(--aurora-neutral-foreground)",
    border: "var(--aurora-neutral-border)",
    bg:     "var(--aurora-neutral-surface)",
    dot:    "var(--aurora-neutral)",
  },
  rose: {
    text:   "var(--aurora-accent-pink-strong)",
    border: "var(--aurora-accent-pink-border)",
    bg:     "var(--aurora-accent-pink-surface)",
    dot:    "var(--aurora-accent-pink)",
  },
  violet: {
    text:   "var(--aurora-accent-violet-strong)",
    border: "var(--aurora-accent-violet-border)",
    bg:     "var(--aurora-accent-violet-surface)",
    dot:    "var(--aurora-accent-violet)",
  },
}

function resolveTone(variant: string | null | undefined): BadgeTone {
  if (!variant || variant === "default") return "neutral"
  return (variant as BadgeTone) in badgeToneMap ? (variant as BadgeTone) : "neutral"
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic or expressive tone. "default" is a deprecated alias for "neutral". */
  variant?: BadgeTone | "default"
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot = false, style, children, ...props }, ref) => {
    const tone = resolveTone(variant)
    const { text, border, bg, dot: dotColor } = badgeToneMap[tone]

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 uppercase leading-none border whitespace-nowrap",
          className
        )}
        style={{
          borderRadius: "4px",
          background: bg,
          borderColor: border,
          color: text,
          fontFamily: "var(--aurora-font-mono, 'JetBrains Mono', monospace)",
          fontSize: "var(--aurora-type-micro)",
          fontWeight: 650,
          letterSpacing: "0.075em",
          ...style,
        }}
        {...props}
      >
        {dot && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
              boxShadow: `0 0 4px ${dotColor}`,
            }}
          />
        )}
        {children}
      </span>
    )
  }
)
Badge.displayName = "Badge"

// Note: badgeVariants (CVA export) has been removed.
// Components that imported badgeVariants for composition should use
// className overrides on the Badge component directly.
export { Badge }
export default Badge
```

- [ ] **Step 2: Rewrite `callout.tsx` — add neutral and violet variants, use toneMap**

Replace the entire contents of `registry/aurora/ui/callout.tsx` with:

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CalloutVariant = "info" | "success" | "warn" | "error" | "neutral" | "rose" | "violet"

type ToneTokens = { accent: string; bg: string; border: string; text: string }

const toneMap: Record<CalloutVariant, ToneTokens> = {
  info: {
    accent: "var(--aurora-info)",
    bg:     "var(--aurora-info-surface)",
    border: "var(--aurora-info-border)",
    text:   "var(--aurora-info-foreground)",
  },
  success: {
    accent: "var(--aurora-success)",
    bg:     "var(--aurora-success-surface)",
    border: "var(--aurora-success-border)",
    text:   "var(--aurora-success-foreground)",
  },
  warn: {
    accent: "var(--aurora-warn)",
    bg:     "var(--aurora-warn-surface)",
    border: "var(--aurora-warn-border)",
    text:   "var(--aurora-warn-foreground)",
  },
  error: {
    accent: "var(--aurora-error)",
    bg:     "var(--aurora-error-surface)",
    border: "var(--aurora-error-border)",
    text:   "var(--aurora-error-foreground)",
  },
  neutral: {
    accent: "var(--aurora-neutral)",
    bg:     "var(--aurora-neutral-surface)",
    border: "var(--aurora-neutral-border)",
    text:   "var(--aurora-neutral-foreground)",
  },
  rose: {
    accent: "var(--aurora-accent-pink)",
    bg:     "var(--aurora-accent-pink-surface)",
    border: "var(--aurora-accent-pink-border)",
    text:   "var(--aurora-accent-pink-strong)",
  },
  violet: {
    accent: "var(--aurora-accent-violet)",
    bg:     "var(--aurora-accent-violet-surface)",
    border: "var(--aurora-accent-violet-border)",
    text:   "var(--aurora-accent-violet-strong)",
  },
}

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CalloutVariant
  title?: React.ReactNode
  icon?: React.ReactNode
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = "info", title, icon, children, style, ...props }, ref) => {
    const { accent, bg, border, text } = toneMap[variant]

    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[var(--aurora-radius-1)] border p-4", className)}
        style={{
          background: bg,
          borderColor: border,
          boxShadow: `inset 3px 0 0 ${accent}`,
          ...style,
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className="mt-0.5 size-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          {title && (
            <div style={{ color: "var(--aurora-text-primary)", fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-label)", letterSpacing: "var(--aurora-letter-ui)", lineHeight: "var(--aurora-line-ui)" }}>
              {title}
            </div>
          )}
          {children && (
            <div style={{ color: text, fontSize: "var(--aurora-type-control)", fontWeight: "var(--aurora-weight-body)", lineHeight: 1.5, marginTop: title ? 4 : 0 }}>
              {children}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Callout.displayName = "Callout"

export { Callout }
export default Callout
```

- [ ] **Step 3: Update `status-indicator.tsx` — add automating tone, update syncing, add labelColor**

Replace the entire contents of `registry/aurora/ui/status-indicator.tsx` with:

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusTone = "online" | "syncing" | "queued" | "degraded" | "offline" | "error" | "automating"

const toneColor: Record<StatusTone, string> = {
  online:     "var(--aurora-success)",
  syncing:    "var(--aurora-info)",
  queued:     "var(--aurora-neutral)",
  degraded:   "var(--aurora-warn)",
  offline:    "var(--aurora-neutral)",
  error:      "var(--aurora-error)",
  automating: "var(--aurora-accent-violet)",
}

// Dim tones use muted foreground so the label does not compete with the dot.
const dimTones = new Set<StatusTone>(["queued", "offline"])

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
  label?: React.ReactNode
  pulse?: boolean
}

function StatusIndicator({ className, tone = "online", label, pulse = tone === "syncing", style, ...props }: StatusIndicatorProps) {
  const color = toneColor[tone]
  const labelColor = dimTones.has(tone)
    ? "var(--aurora-neutral-foreground)"
    : "var(--aurora-text-primary)"

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      style={{
        color: labelColor,
        fontSize: "var(--aurora-type-body-sm)",
        fontWeight: "var(--aurora-weight-ui)",
        lineHeight: "var(--aurora-line-ui)",
        ...style,
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 rounded-full", pulse && "animate-pulse")}
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      {label ?? tone}
    </span>
  )
}

export { StatusIndicator }
export default StatusIndicator
```

- [ ] **Step 4: Regenerate the affected registry payloads**

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm registry:build
```

Expected: `public/r/aurora-badge.json`, `public/r/aurora-callout.json`, `public/r/aurora-status-indicator.json`, `registry.json`, and `public/r/registry.json` update to match the source files.

- [ ] **Step 5: Commit the semantic component refactor**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add registry/aurora/ui/badge.tsx registry/aurora/ui/callout.tsx registry/aurora/ui/status-indicator.tsx registry.json public/r/aurora-badge.json public/r/aurora-callout.json public/r/aurora-status-indicator.json public/r/registry.json
git commit -m "feat: apply semantic tokens to Aurora feedback components; remove CVA from Badge"
```

---

### Task 3: Teach the token contract in gallery demos

> **Parallelizable with Task 2.** These files are independent — start this task as soon as Task 1 commits.

**Files:**
- Modify: `app/gallery/demos/colors-demo.tsx`
- Modify: `app/gallery/demos/badges-demo.tsx`
- Modify: `app/gallery/demos/parity-demo.tsx`

- [ ] **Step 1: Rewrite `colors-demo.tsx` around the three-layer contract**

Replace the entire contents of `app/gallery/demos/colors-demo.tsx` with:

```tsx
"use client";

const COLOR_SECTIONS = [
  {
    label: "Brand tokens — identity",
    description: "Use cyan and rose for Aurora identity. Use violet to signal AI or automation emphasis. Never use brand tokens to communicate status.",
    tokens: [
      { name: "accent-primary", cssVar: "var(--aurora-accent-primary)" },
      { name: "accent-pink",    cssVar: "var(--aurora-accent-pink)" },
      { name: "accent-violet",  cssVar: "var(--aurora-accent-violet)" },
    ],
  },
  {
    label: "Semantic tokens — meaning",
    description: "Use these roles in component APIs instead of reaching for hue names. Each role ships a full surface / border / foreground family.",
    tokens: [
      { name: "info",    cssVar: "var(--aurora-info)" },
      { name: "success", cssVar: "var(--aurora-success)" },
      { name: "warn",    cssVar: "var(--aurora-warn)" },
      { name: "error",   cssVar: "var(--aurora-error)" },
      { name: "neutral", cssVar: "var(--aurora-neutral)" },
    ],
  },
  {
    label: "Interaction tokens — behavior",
    description: "Use these shared tokens for overlays, selection, disabled states, and pressed states.",
    tokens: [
      { name: "overlay",          cssVar: "var(--aurora-overlay)" },
      { name: "disabled-surface", cssVar: "var(--aurora-disabled-surface)" },
      { name: "subtle-bg",        cssVar: "var(--aurora-subtle-bg)" },
      { name: "selected-bg",      cssVar: "var(--aurora-selected-bg)" },
      { name: "pressed-bg",       cssVar: "var(--aurora-pressed-bg)" },
    ],
  },
];

export default function ColorsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--aurora-text-muted)", marginBottom: 6 }}>
          Foundations
        </p>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--aurora-text-primary)", margin: 0 }}>
          Color tokens
        </h2>
        <p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
          Aurora colors separate brand tokens for identity, semantic tokens for meaning, and interaction tokens for behavior. Reach for semantic roles in component APIs — never use brand tokens to communicate state.
        </p>
      </div>

      {COLOR_SECTIONS.map((section) => (
        <div key={section.label}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--aurora-text-muted)", marginBottom: 4 }}>
            {section.label}
          </p>
          <p style={{ fontSize: 12, color: "var(--aurora-text-muted)", marginBottom: 12, lineHeight: 1.5 }}>
            {section.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {section.tokens.map((token) => (
              <div key={token.name} style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 112 }}>
                <div
                  style={{
                    width: 112,
                    height: 60,
                    borderRadius: 14,
                    background: token.cssVar,
                    border: "1px solid var(--aurora-border-default)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--aurora-text-primary)", margin: 0, lineHeight: 1.4 }}>
                    {token.name}
                  </p>
                  <p style={{ fontSize: 10, color: "var(--aurora-text-muted)", margin: 0, fontFamily: "var(--aurora-font-mono)", lineHeight: 1.4 }}>
                    --aurora-{token.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Update `badges-demo.tsx` to showcase semantic and expressive usage**

In `app/gallery/demos/badges-demo.tsx`, replace the intro `<p style={subheading}>` and the first two `<div style={section}>` blocks (currently "Variants — no dot" and "Variants — with dot") with the following. The file's `section`, `row`, `groupLabel`, `heading`, and `subheading` style constants remain unchanged.

Replace from:
```tsx
        <p style={subheading}>
          Status badges in five semantic variants — with and without the dot indicator.
        </p>
      </div>

      <div style={section}>
        <div style={groupLabel}>Variants — no dot</div>
        <div style={row}>
          <Badge variant="default">Active</Badge>
          <Badge variant="success">Healthy</Badge>
          <Badge variant="warn">Degraded</Badge>
          <Badge variant="error">Offline</Badge>
          <Badge variant="rose">Escalated</Badge>
        </div>
      </div>

      <div style={section}>
        <div style={groupLabel}>Variants — with dot</div>
        <div style={row}>
          <Badge variant="default" dot>Running</Badge>
          <Badge variant="success" dot>Healthy</Badge>
          <Badge variant="warn" dot>Degraded</Badge>
          <Badge variant="error" dot>Offline</Badge>
          <Badge variant="rose" dot>Escalated</Badge>
        </div>
      </div>
```

To:
```tsx
        <p style={subheading}>
          Semantic badges communicate system meaning (info, success, warn, error, neutral). Expressive badges — rose and violet — carry identity emphasis, not status.
        </p>
      </div>

      <div style={section}>
        <div style={groupLabel}>Semantic roles — with dot</div>
        <div style={row}>
          <Badge variant="info"    dot>Syncing</Badge>
          <Badge variant="success" dot>Healthy</Badge>
          <Badge variant="warn"    dot>Degraded</Badge>
          <Badge variant="error"   dot>Offline</Badge>
          <Badge variant="neutral" dot>Queued</Badge>
        </div>

        <div style={groupLabel}>Expressive identity</div>
        <div style={row}>
          <Badge variant="violet" dot>Automated</Badge>
          <Badge variant="rose">Escalated</Badge>
        </div>

        <div style={groupLabel}>Without dot</div>
        <div style={row}>
          <Badge variant="info">Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warn">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </div>
```

Keep all remaining sections (Gateway statuses, Agent states, Environment types, Table context) unchanged — the existing `variant="default"` calls in those sections will continue to work and will now render with neutral styling.

- [ ] **Step 3: Update `parity-demo.tsx` to show multi-example callout and status stacks**

In `app/gallery/demos/parity-demo.tsx`, find the `case "callout":` and `case "status-indicator":` branches in the switch/render logic. Replace each with:

```tsx
case "callout":
  return (
    <div className="grid gap-3">
      <Callout title="Registry sync in progress" variant="info">
        Generated payloads are being refreshed.
      </Callout>
      <Callout title="Deployment completed" variant="success">
        All agents are running the latest build.
      </Callout>
      <Callout title="Gateway policy changed" variant="warn">
        Restart dependent agents before the next deployment.
      </Callout>
      <Callout title="Connection failed" variant="error">
        The upstream API is unreachable. Check credentials.
      </Callout>
      <Callout title="Agent queued" variant="neutral">
        Waiting for an available runner slot.
      </Callout>
      <Callout title="Agent automation available" variant="violet">
        This workflow can now execute unattended.
      </Callout>
    </div>
  )

case "status-indicator":
  return (
    <div className="grid gap-2">
      <StatusIndicator tone="online"     label="Gateway connected" />
      <StatusIndicator tone="syncing"    label="Syncing registry" />
      <StatusIndicator tone="queued"     label="Queued for rollout" />
      <StatusIndicator tone="degraded"   label="Elevated latency" />
      <StatusIndicator tone="offline"    label="Agent offline" />
      <StatusIndicator tone="error"      label="Connection failed" />
      <StatusIndicator tone="automating" label="Automation executing" />
    </div>
  )
```

- [ ] **Step 4: Commit the gallery teaching pass**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add app/gallery/demos/colors-demo.tsx app/gallery/demos/badges-demo.tsx app/gallery/demos/parity-demo.tsx
git commit -m "feat: teach semantic color token layers in the gallery"
```

---

### Task 4: Give AI-facing demos a distinct violet lane

**Files:**
- Modify: `registry/aurora/blocks/ai/thinking/thinking.tsx`
- Modify: `app/gallery/demos/thinking-demo.tsx`
- Modify: `registry/aurora/blocks/ai/prompt-input/prompt-input.tsx`
- Modify: `app/gallery/demos/prompt-input-demo.tsx`
- Regenerate: `public/r/aurora-thinking.json`, `public/r/aurora-prompt-input.json`, `registry.json`, `public/r/registry.json`

- [ ] **Step 1: Shift `Thinking` to violet for AI-specific affordances**

In `registry/aurora/blocks/ai/thinking/thinking.tsx`, add these constants at the top of the file, after the imports:

```tsx
// Aurora violet tokens represent AI/automation identity.
// Do not use for semantic state (success/warn/error) — use the semantic token layer for that.
const AI_ACCENT        = "var(--aurora-accent-violet)"
const AI_ACCENT_STRONG = "var(--aurora-accent-violet-strong)"
```

Then replace all AI-identity accent references:

1. In `StepIcon` — the `inprog` case border:
   ```tsx
   border: `2px solid ${AI_ACCENT}`,
   borderTopColor: "transparent",
   ```

2. In `Cursor` component — the background:
   ```tsx
   background: AI_ACCENT,
   ```

3. In `ThinkingBlock` — the streaming border left color:
   ```tsx
   const borderLeftColor = isStreaming ? AI_ACCENT : "var(--aurora-border-strong)"
   ```

4. In the brain/thinking icon — the stroke:
   ```tsx
   stroke={AI_ACCENT}
   ```

Leave all `success` and `error` step states pointing to their existing semantic tokens — do not change those.

- [ ] **Step 2: Update `thinking-demo.tsx` copy to reinforce the AI/automation framing**

In `app/gallery/demos/thinking-demo.tsx`, find the introductory paragraph or description text and add (or replace) with:

```tsx
<p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "8px", fontWeight: 500 }}>
  AI reasoning surface — violet marks automation and generated output. Semantic colors (success, error) remain reserved for step outcomes.
</p>
```

- [ ] **Step 3: Shift `PromptInput` avatar and trigger accents to violet**

In `registry/aurora/blocks/ai/prompt-input/prompt-input.tsx`, replace only the AI-identity cues. Look for cyan accent references used for the avatar gradient, the inline `/` or `@` affordance hints, and the streaming spinner ring. Replace them:

```tsx
// Avatar gradient (identity cue — use violet → rose for AI persona)
background: "linear-gradient(135deg, var(--aurora-accent-violet) 0%, var(--aurora-accent-pink) 100%)"

// Affordance hint color (/ and @ trigger icons)
color: "var(--aurora-accent-violet)"

// Streaming spinner ring
border: "1.5px solid var(--aurora-accent-violet)"
```

Do not change any semantic state colors (success, warn, error) that may appear elsewhere in the file.

- [ ] **Step 4: Update `prompt-input-demo.tsx` copy to call out the expressive lane**

In `app/gallery/demos/prompt-input-demo.tsx`, add a caption below the demo frame:

```tsx
<p
  style={{
    marginTop: "10px",
    fontSize: "11px",
    color: "var(--aurora-text-muted)",
    textAlign: "center",
  }}
>
  Violet marks AI and automation affordances. Semantic colors stay reserved for system meaning.
</p>
```

- [ ] **Step 5: Regenerate the affected registry payloads**

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm registry:build
```

Expected: `public/r/aurora-thinking.json`, `public/r/aurora-prompt-input.json`, `registry.json`, and `public/r/registry.json` update cleanly.

- [ ] **Step 6: Commit the AI expressive pass**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add registry/aurora/blocks/ai/thinking/thinking.tsx app/gallery/demos/thinking-demo.tsx registry/aurora/blocks/ai/prompt-input/prompt-input.tsx app/gallery/demos/prompt-input-demo.tsx registry.json public/r/aurora-thinking.json public/r/aurora-prompt-input.json public/r/registry.json
git commit -m "feat: add violet AI identity emphasis to Thinking and PromptInput"
```

---

### Task 5: Final verification and publish

**Files:** All modified files from Tasks 1–4

- [ ] **Step 1: Run the full repository lint**

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm lint
```

Expected: ESLint finishes without errors across all modified TypeScript and TSX files.

- [ ] **Step 2: Verify WCAG contrast for semantic foreground tokens**

Open the gallery in the browser (`pnpm dev -- --hostname 0.0.0.0`, then visit `http://localhost:3000/gallery/colors`) and manually verify each semantic surface/foreground pair meets WCAG AA (4.5:1 for text). Use the browser devtools color picker or the axe extension.

Check these pairs in **dark mode** and **light mode**:

| Surface token | Foreground token |
|---|---|
| `--aurora-info-surface` | `--aurora-info-foreground` |
| `--aurora-success-surface` | `--aurora-success-foreground` |
| `--aurora-warn-surface` | `--aurora-warn-foreground` |
| `--aurora-error-surface` | `--aurora-error-foreground` |
| `--aurora-neutral-surface` | `--aurora-neutral-foreground` |

If any pair fails contrast in either theme, adjust the foreground token value in `aurora.css` (Step 2 of Task 1) and re-run `pnpm registry:build` before continuing.

- [ ] **Step 3: Run the full production build**

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm build
```

Expected: Next.js production build succeeds with no CSS or TypeScript errors.

- [ ] **Step 4: Start the local gallery and manually inspect updated routes**

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm dev -- --hostname 0.0.0.0
```

Visit these routes and confirm the listed behaviors:

| URL | Expected |
|---|---|
| `http://localhost:3000/gallery/colors` | Three sections: Brand / Semantic / Interaction. Violet swatch visible in brand section. Info swatch present in semantic section. |
| `http://localhost:3000/gallery/badge` | Semantic row (info/success/warn/error/neutral) and expressive row (violet/rose) both present. No broken colors or invisible text. |
| `http://localhost:3000/gallery/callout` (or parity) | Six variants: info, success, warn, error, neutral, violet. All render with distinct surface backgrounds and left-border accents. |
| `http://localhost:3000/gallery/status-indicator` (or parity) | Seven tones including `automating` (violet dot). Queued and offline labels appear muted relative to other labels. |
| `http://localhost:3000/gallery/thinking` | Spinning step indicator and cursor are violet. Done/error step icons still use green/red semantic colors. |
| `http://localhost:3000/gallery/prompt-input` | Avatar gradient is violet→rose. Caption text below demo confirms the violet = AI identity convention. |

- [ ] **Step 5: Commit any registry artifacts changed during verification**

```bash
cd /home/jmagar/workspace/aurora-design-system
git status --short
```

If any `public/r/*.json` or `registry.json` files changed during verification, stage and commit them:

```bash
git add registry.json public/r/
git commit -m "chore: refresh Aurora registry artifacts after verification"
```

If `git status --short` shows nothing changed, skip this commit.

- [ ] **Step 6: Push the completed rollout**

```bash
cd /home/jmagar/workspace/aurora-design-system
git pull --rebase
bd dolt push
git push
git status -sb
```

Expected: branch is up to date with `origin/main` and no tracked file changes remain unpushed.
