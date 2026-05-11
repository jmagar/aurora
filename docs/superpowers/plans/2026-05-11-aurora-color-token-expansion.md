# Aurora Color Token Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Aurora's color system into brand, semantic, and interaction layers; update representative components to consume the new contract; and teach the contract through the gallery.

**Architecture:** Keep the existing surface shell intact in `registry/aurora/styles/aurora.css`, add a compact semantic token contract plus a violet expressive family, then move meaning-bearing components onto role-based tokens while the gallery demonstrates the contract. This repo does not currently ship a dedicated component test runner, so validation in this plan uses focused ESLint runs for changed TypeScript files, `pnpm registry:build` for generated registry payloads, and a final `pnpm build` instead of introducing new test tooling.

**Tech Stack:** Next.js 16, React 19, TypeScript, Aurora CSS custom properties, shadcn registry generation (`pnpm registry:build`), ESLint

---

## File map

- `registry/aurora/styles/aurora.css` — source of truth for the Aurora token contract in dark and light themes
- `registry/aurora/ui/badge.tsx` — semantic badge primitive and expressive rose/violet badge support
- `registry/aurora/ui/callout.tsx` — semantic callout primitive with state-driven surfaces and borders
- `registry/aurora/ui/status-indicator.tsx` — compact operational status primitive with semantic tones and violet automation tone
- `registry/aurora/blocks/ai/thinking/thinking.tsx` — AI reasoning surface that should use violet for AI identity while preserving semantic success/error states
- `registry/aurora/blocks/ai/prompt-input/prompt-input.tsx` — AI composer block with avatar, hint, and streaming affordances that should move to the new expressive lane
- `app/gallery/demos/colors-demo.tsx` — foundations gallery page that teaches brand vs semantic vs interaction token usage
- `app/gallery/demos/badges-demo.tsx` — representative badge demo proving semantic roles and expressive exceptions
- `app/gallery/demos/parity-demo.tsx` — parity gallery surface for `callout` and `status-indicator`, used instead of dedicated hand-written demos for those components
- `app/gallery/demos/thinking-demo.tsx` — gallery proof that violet reads as AI/automation identity
- `app/gallery/demos/prompt-input-demo.tsx` — gallery proof that prompt affordances use violet while semantic colors stay reserved for system meaning
- `registry.json` — generated registry index that must mirror updated source files
- `public/r/aurora-tokens.json` — generated token registry payload
- `public/r/aurora-badge.json` — generated badge registry payload
- `public/r/aurora-callout.json` — generated callout registry payload
- `public/r/aurora-status-indicator.json` — generated status-indicator registry payload
- `public/r/aurora-thinking.json` — generated thinking registry payload
- `public/r/aurora-prompt-input.json` — generated prompt-input registry payload
- `public/r/registry.json` — generated public registry index

---

### Task 1: Expand the Aurora token contract

**Files:**
- Modify: `registry/aurora/styles/aurora.css`
- Regenerate: `registry.json`
- Regenerate: `public/r/aurora-tokens.json`
- Regenerate: `public/r/registry.json`

- [ ] **Step 1: Add violet, semantic, and interaction tokens to the dark theme**

Insert a new block in `registry/aurora/styles/aurora.css` immediately after the existing rose accent tokens and before the code accent section.

```css
  /* Expressive accent — Aurora violet */
  --aurora-accent-violet:        #a78bfa;
  --aurora-accent-violet-strong: #c4b5fd;
  --aurora-accent-violet-deep:   #7c3aed;
  --aurora-accent-violet-button: #8b5cf6;

  /* Semantic state families */
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
```

- [ ] **Step 2: Mirror the same contract in the light theme**

Add the light-theme equivalents inside the existing `.light` block so the semantic contract exists in both themes.

```css
  --aurora-accent-violet:        #7c3aed;
  --aurora-accent-violet-strong: #8b5cf6;
  --aurora-accent-violet-deep:   #5b21b6;
  --aurora-accent-violet-button: #6d28d9;

  --aurora-info:            #0f7db8;
  --aurora-info-surface:    color-mix(in srgb, var(--aurora-info) 10%, white);
  --aurora-info-border:     color-mix(in srgb, var(--aurora-info) 26%, transparent);
  --aurora-info-foreground: #0a4f74;

  --aurora-success-surface:    color-mix(in srgb, var(--aurora-success) 12%, white);
  --aurora-success-border:     color-mix(in srgb, var(--aurora-success) 24%, transparent);
  --aurora-success-foreground: #184b43;

  --aurora-warn-surface:    color-mix(in srgb, var(--aurora-warn) 12%, white);
  --aurora-warn-border:     color-mix(in srgb, var(--aurora-warn) 24%, transparent);
  --aurora-warn-foreground: #5c450c;

  --aurora-error-surface:    color-mix(in srgb, var(--aurora-error) 10%, white);
  --aurora-error-border:     color-mix(in srgb, var(--aurora-error) 24%, transparent);
  --aurora-error-foreground: #6f2330;

  --aurora-neutral:            #6f8793;
  --aurora-neutral-surface:    color-mix(in srgb, var(--aurora-neutral) 12%, white);
  --aurora-neutral-border:     color-mix(in srgb, var(--aurora-neutral) 24%, transparent);
  --aurora-neutral-foreground: #334e5d;

  --aurora-overlay:           rgba(7, 19, 28, 0.18);
  --aurora-disabled-text:     color-mix(in srgb, var(--aurora-text-muted) 66%, var(--aurora-border-strong));
  --aurora-disabled-surface:  color-mix(in srgb, var(--aurora-control-surface) 78%, var(--aurora-panel-medium));
  --aurora-subtle-bg:         color-mix(in srgb, var(--aurora-hover-bg) 66%, transparent);
  --aurora-selected-bg:       color-mix(in srgb, var(--aurora-accent-primary) 10%, white);
  --aurora-pressed-bg:        color-mix(in srgb, var(--aurora-accent-primary) 16%, white);
  --aurora-focus-ring-strong: color-mix(in srgb, var(--aurora-accent-primary) 40%, transparent);
```

- [ ] **Step 3: Regenerate the token registry payloads**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm registry:build
```

Expected: `shadcn build` completes successfully and rewrites `registry.json`, `public/r/aurora-tokens.json`, and `public/r/registry.json` with the new token entries.

- [ ] **Step 4: Verify the token file still builds**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm build
```

Expected: `next build` completes successfully with no CSS syntax errors from `registry/aurora/styles/aurora.css`.

- [ ] **Step 5: Commit the token contract**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add registry/aurora/styles/aurora.css registry.json public/r/aurora-tokens.json public/r/registry.json
git commit -m "feat: add semantic Aurora color tokens" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 2: Move Badge, Callout, and StatusIndicator onto semantic roles

**Files:**
- Modify: `registry/aurora/ui/badge.tsx`
- Modify: `registry/aurora/ui/callout.tsx`
- Modify: `registry/aurora/ui/status-indicator.tsx`
- Regenerate: `public/r/aurora-badge.json`
- Regenerate: `public/r/aurora-callout.json`
- Regenerate: `public/r/aurora-status-indicator.json`
- Regenerate: `registry.json`
- Regenerate: `public/r/registry.json`

- [ ] **Step 1: Refactor `Badge` to semantic variants plus expressive violet**

Replace the current raw-hue maps in `registry/aurora/ui/badge.tsx` with a tone contract so semantic variants use `*-surface`, `*-border`, and `*-foreground`, while `rose` and `violet` stay expressive.

```tsx
type BadgeTone = "default" | "info" | "success" | "warn" | "error" | "neutral" | "rose" | "violet"

const badgeToneMap: Record<BadgeTone, { text: string; border: string; bg: string; dot: string }> = {
  default: {
    text: "var(--aurora-info-foreground)",
    border: "var(--aurora-info-border)",
    bg: "var(--aurora-info-surface)",
    dot: "var(--aurora-info)",
  },
  info: {
    text: "var(--aurora-info-foreground)",
    border: "var(--aurora-info-border)",
    bg: "var(--aurora-info-surface)",
    dot: "var(--aurora-info)",
  },
  success: {
    text: "var(--aurora-success-foreground)",
    border: "var(--aurora-success-border)",
    bg: "var(--aurora-success-surface)",
    dot: "var(--aurora-success)",
  },
  warn: {
    text: "var(--aurora-warn-foreground)",
    border: "var(--aurora-warn-border)",
    bg: "var(--aurora-warn-surface)",
    dot: "var(--aurora-warn)",
  },
  error: {
    text: "var(--aurora-error-foreground)",
    border: "var(--aurora-error-border)",
    bg: "var(--aurora-error-surface)",
    dot: "var(--aurora-error)",
  },
  neutral: {
    text: "var(--aurora-neutral-foreground)",
    border: "var(--aurora-neutral-border)",
    bg: "var(--aurora-neutral-surface)",
    dot: "var(--aurora-neutral)",
  },
  rose: {
    text: "var(--aurora-accent-pink-strong)",
    border: "color-mix(in srgb, var(--aurora-accent-pink) 32%, transparent)",
    bg: "color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent)",
    dot: "var(--aurora-accent-pink)",
  },
  violet: {
    text: "var(--aurora-accent-violet-strong)",
    border: "color-mix(in srgb, var(--aurora-accent-violet) 32%, transparent)",
    bg: "color-mix(in srgb, var(--aurora-accent-violet) 12%, transparent)",
    dot: "var(--aurora-accent-violet)",
  },
}
```

- [ ] **Step 2: Refactor `Callout` to use semantic family tokens**

Replace the single-color-only approach in `registry/aurora/ui/callout.tsx` with a role contract so `info`, `success`, `warn`, `error`, and `neutral` use semantic tokens while `rose` and `violet` remain expressive options.

```tsx
export type CalloutVariant = "info" | "success" | "warn" | "error" | "neutral" | "rose" | "violet"

const toneMap: Record<CalloutVariant, { accent: string; bg: string; border: string; text: string }> = {
  info: {
    accent: "var(--aurora-info)",
    bg: "var(--aurora-info-surface)",
    border: "var(--aurora-info-border)",
    text: "var(--aurora-info-foreground)",
  },
  success: {
    accent: "var(--aurora-success)",
    bg: "var(--aurora-success-surface)",
    border: "var(--aurora-success-border)",
    text: "var(--aurora-success-foreground)",
  },
  warn: {
    accent: "var(--aurora-warn)",
    bg: "var(--aurora-warn-surface)",
    border: "var(--aurora-warn-border)",
    text: "var(--aurora-warn-foreground)",
  },
  error: {
    accent: "var(--aurora-error)",
    bg: "var(--aurora-error-surface)",
    border: "var(--aurora-error-border)",
    text: "var(--aurora-error-foreground)",
  },
  neutral: {
    accent: "var(--aurora-neutral)",
    bg: "var(--aurora-neutral-surface)",
    border: "var(--aurora-neutral-border)",
    text: "var(--aurora-neutral-foreground)",
  },
  rose: {
    accent: "var(--aurora-accent-pink)",
    bg: "color-mix(in srgb, var(--aurora-accent-pink) 8%, var(--aurora-panel-medium))",
    border: "color-mix(in srgb, var(--aurora-accent-pink) 32%, transparent)",
    text: "var(--aurora-text-primary)",
  },
  violet: {
    accent: "var(--aurora-accent-violet)",
    bg: "color-mix(in srgb, var(--aurora-accent-violet) 8%, var(--aurora-panel-medium))",
    border: "color-mix(in srgb, var(--aurora-accent-violet) 32%, transparent)",
    text: "var(--aurora-text-primary)",
  },
}
```

- [ ] **Step 3: Refactor `StatusIndicator` to semantic state colors and add an automation tone**

Update `registry/aurora/ui/status-indicator.tsx` so operational tones map to semantic tokens and add a violet-backed automation state.

```tsx
export type StatusTone = "online" | "syncing" | "queued" | "degraded" | "offline" | "error" | "automating"

const toneColor: Record<StatusTone, string> = {
  online: "var(--aurora-success)",
  syncing: "var(--aurora-info)",
  queued: "var(--aurora-neutral)",
  degraded: "var(--aurora-warn)",
  offline: "var(--aurora-neutral)",
  error: "var(--aurora-error)",
  automating: "var(--aurora-accent-violet)",
}
```

Also update the wrapper style so the label color can follow neutral vs semantic emphasis cleanly:

```tsx
const labelColor = tone === "queued" || tone === "offline"
  ? "var(--aurora-neutral-foreground)"
  : "var(--aurora-text-primary)"
```

- [ ] **Step 4: Regenerate the affected registry item payloads**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm registry:build
```

Expected: `public/r/aurora-badge.json`, `public/r/aurora-callout.json`, `public/r/aurora-status-indicator.json`, `registry.json`, and `public/r/registry.json` update to match the source files.

- [ ] **Step 5: Lint the changed component files**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm eslint registry/aurora/ui/badge.tsx registry/aurora/ui/callout.tsx registry/aurora/ui/status-indicator.tsx
```

Expected: no ESLint errors for the three updated UI primitives.

- [ ] **Step 6: Commit the semantic component refactor**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add registry/aurora/ui/badge.tsx registry/aurora/ui/callout.tsx registry/aurora/ui/status-indicator.tsx registry.json public/r/aurora-badge.json public/r/aurora-callout.json public/r/aurora-status-indicator.json public/r/registry.json
git commit -m "feat: apply semantic tokens to Aurora feedback components" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 3: Teach the contract in the colors gallery and representative demos

**Files:**
- Modify: `app/gallery/demos/colors-demo.tsx`
- Modify: `app/gallery/demos/badges-demo.tsx`
- Modify: `app/gallery/demos/parity-demo.tsx`

- [ ] **Step 1: Rewrite `colors-demo.tsx` around the three-layer contract**

Replace the current generic sections with explicit brand, semantic, and interaction groups.

```tsx
const COLOR_SECTIONS = [
  {
    label: "Brand tokens for identity",
    description: "Use cyan and rose for Aurora identity, and violet for AI or automation emphasis.",
    tokens: [
      { name: "accent-primary", cssVar: "var(--aurora-accent-primary)" },
      { name: "accent-pink", cssVar: "var(--aurora-accent-pink)" },
      { name: "accent-violet", cssVar: "var(--aurora-accent-violet)" },
    ],
  },
  {
    label: "Semantic tokens for meaning",
    description: "Use semantic roles instead of reaching for hue names in component APIs.",
    tokens: [
      { name: "info", cssVar: "var(--aurora-info)" },
      { name: "success", cssVar: "var(--aurora-success)" },
      { name: "warn", cssVar: "var(--aurora-warn)" },
      { name: "error", cssVar: "var(--aurora-error)" },
      { name: "neutral", cssVar: "var(--aurora-neutral)" },
    ],
  },
  {
    label: "Interaction tokens for behavior",
    description: "Use shared behavior tokens for overlays, selection, disabled, and pressed states.",
    tokens: [
      { name: "overlay", cssVar: "var(--aurora-overlay)" },
      { name: "disabled-surface", cssVar: "var(--aurora-disabled-surface)" },
      { name: "subtle-bg", cssVar: "var(--aurora-subtle-bg)" },
      { name: "selected-bg", cssVar: "var(--aurora-selected-bg)" },
      { name: "pressed-bg", cssVar: "var(--aurora-pressed-bg)" },
    ],
  },
]
```

Update the page copy so the intro literally teaches:

```tsx
<p style={{ fontSize: 13, color: "var(--aurora-text-muted)", marginTop: 6, lineHeight: 1.55 }}>
  Aurora colors now separate brand tokens for identity, semantic tokens for meaning, and interaction tokens for behavior.
</p>
```

- [ ] **Step 2: Update `badges-demo.tsx` to showcase semantic and expressive usage**

Add neutral, info, and violet examples, and reframe the demo copy around meaning vs identity.

```tsx
<p style={subheading}>
  Semantic badges use info, success, warn, error, and neutral roles; expressive badges reserve rose and violet for identity-driven emphasis.
</p>

<div style={row}>
  <Badge variant="info" dot>Syncing</Badge>
  <Badge variant="success" dot>Healthy</Badge>
  <Badge variant="warn" dot>Degraded</Badge>
  <Badge variant="error" dot>Offline</Badge>
  <Badge variant="neutral" dot>Queued</Badge>
  <Badge variant="violet" dot>Automated</Badge>
  <Badge variant="rose">Escalated</Badge>
</div>
```

- [ ] **Step 3: Turn the parity demos into contract examples for callout and status indicator**

Replace the single-instance parity cases in `app/gallery/demos/parity-demo.tsx` with small multi-example stacks.

```tsx
case "callout":
  return (
    <div className="grid gap-3">
      <Callout title="Registry sync in progress" variant="info">Generated payloads are being refreshed.</Callout>
      <Callout title="Gateway policy changed" variant="warn">Restart dependent agents before the next deployment.</Callout>
      <Callout title="Agent automation available" variant="violet">This workflow can now execute unattended.</Callout>
    </div>
  )

case "status-indicator":
  return (
    <div className="grid gap-2">
      <StatusIndicator tone="online" label="Gateway connected" />
      <StatusIndicator tone="syncing" label="Syncing registry" />
      <StatusIndicator tone="queued" label="Queued for rollout" />
      <StatusIndicator tone="automating" label="Automation executing" />
    </div>
  )
```

- [ ] **Step 4: Lint the gallery demo changes**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm eslint app/gallery/demos/colors-demo.tsx app/gallery/demos/badges-demo.tsx app/gallery/demos/parity-demo.tsx
```

Expected: no ESLint errors in the gallery demo files.

- [ ] **Step 5: Commit the gallery teaching pass**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add app/gallery/demos/colors-demo.tsx app/gallery/demos/badges-demo.tsx app/gallery/demos/parity-demo.tsx
git commit -m "feat: teach semantic color tokens in the gallery" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 4: Give AI-facing demos a distinct violet lane

**Files:**
- Modify: `registry/aurora/blocks/ai/thinking/thinking.tsx`
- Modify: `app/gallery/demos/thinking-demo.tsx`
- Modify: `registry/aurora/blocks/ai/prompt-input/prompt-input.tsx`
- Modify: `app/gallery/demos/prompt-input-demo.tsx`
- Regenerate: `public/r/aurora-thinking.json`
- Regenerate: `public/r/aurora-prompt-input.json`
- Regenerate: `registry.json`
- Regenerate: `public/r/registry.json`

- [ ] **Step 1: Shift `Thinking` to violet for AI-specific affordances**

Replace the AI affordance accents in `registry/aurora/blocks/ai/thinking/thinking.tsx` so the component keeps semantic success/error colors for state, but uses violet for the AI identity layer.

```tsx
const AI_ACCENT = "var(--aurora-accent-violet)"
const AI_ACCENT_STRONG = "var(--aurora-accent-violet-strong)"

// in StepIcon -> in-progress spinner
border: `2px solid ${AI_ACCENT}`,

// in Cursor
background: AI_ACCENT,

// in ThinkingBlock
const borderLeftColor = isStreaming ? AI_ACCENT : "var(--aurora-border-strong)"

// in the brain icon
stroke={AI_ACCENT}
```

- [ ] **Step 2: Update `thinking-demo.tsx` so the examples explicitly show AI/automation framing**

Refresh the demo labels so the gallery copy reinforces why violet exists.

```tsx
<p style={{ fontSize: "12px", color: "var(--aurora-text-muted)", marginBottom: "8px", fontWeight: 500 }}>
  AI reasoning surface — violet is reserved for automation and generated output, not semantic alerting
</p>
```

- [ ] **Step 3: Shift `PromptInput` avatar and trigger accents to violet**

In `registry/aurora/blocks/ai/prompt-input/prompt-input.tsx`, replace cyan-only AI accents with violet while keeping semantic roles available elsewhere.

```tsx
background: "linear-gradient(135deg, var(--aurora-accent-violet) 0%, var(--aurora-accent-pink) 100%)"

color: "var(--aurora-accent-violet)"

border: "1.5px solid var(--aurora-accent-violet)"
```

Use those replacements only for AI identity cues such as the avatar gradient, inline `/` or `@` affordance hints, and the streaming spinner ring.

- [ ] **Step 4: Update `prompt-input-demo.tsx` copy to call out the new expressive lane**

Add a short note below the demo frame that distinguishes violet AI emphasis from semantic status colors.

```tsx
<p
  style={{
    marginTop: "10px",
    fontSize: "11px",
    color: "var(--aurora-text-muted)",
    textAlign: "center",
  }}
>
  Violet now marks AI and automation affordances, while semantic colors stay reserved for system meaning.
</p>
```

- [ ] **Step 5: Regenerate the affected registry payloads and lint the TS files**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm registry:build
pnpm eslint registry/aurora/blocks/ai/thinking/thinking.tsx app/gallery/demos/thinking-demo.tsx registry/aurora/blocks/ai/prompt-input/prompt-input.tsx app/gallery/demos/prompt-input-demo.tsx
```

Expected: registry JSON regenerates cleanly and ESLint reports no errors on the four modified files.

- [ ] **Step 6: Commit the AI expressive pass**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add registry/aurora/blocks/ai/thinking/thinking.tsx app/gallery/demos/thinking-demo.tsx registry/aurora/blocks/ai/prompt-input/prompt-input.tsx app/gallery/demos/prompt-input-demo.tsx registry.json public/r/aurora-thinking.json public/r/aurora-prompt-input.json public/r/registry.json
git commit -m "feat: add violet AI emphasis to Aurora demos" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 5: Run final verification and publish the rollout

**Files:**
- Verify: `registry/aurora/styles/aurora.css`
- Verify: `registry/aurora/ui/badge.tsx`
- Verify: `registry/aurora/ui/callout.tsx`
- Verify: `registry/aurora/ui/status-indicator.tsx`
- Verify: `registry/aurora/blocks/ai/thinking/thinking.tsx`
- Verify: `registry/aurora/blocks/ai/prompt-input/prompt-input.tsx`
- Verify: `app/gallery/demos/colors-demo.tsx`
- Verify: `app/gallery/demos/badges-demo.tsx`
- Verify: `app/gallery/demos/parity-demo.tsx`
- Verify: `app/gallery/demos/thinking-demo.tsx`
- Verify: `app/gallery/demos/prompt-input-demo.tsx`

- [ ] **Step 1: Run the full repository lint**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm lint
```

Expected: ESLint finishes without errors.

- [ ] **Step 2: Run the full production build**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm build
```

Expected: Next.js production build succeeds and the gallery routes compile with the updated token contract.

- [ ] **Step 3: Start the local gallery and manually inspect the updated routes**

Run:

```bash
cd /home/jmagar/workspace/aurora-design-system
pnpm dev -- --hostname 0.0.0.0
```

Open:

```text
http://localhost:3000/gallery/colors
http://localhost:3000/gallery/badge
http://localhost:3000/gallery/callout
http://localhost:3000/gallery/status-indicator
http://localhost:3000/gallery/thinking
http://localhost:3000/gallery/prompt-input
```

Expected:

- the colors page is split into brand, semantic, and interaction sections
- badge, callout, and status-indicator demos show semantic roles plus violet where appropriate
- AI demos use violet for automation/AI emphasis without replacing semantic success, warn, or error states

- [ ] **Step 4: Commit the final artifact refresh if registry output changed during verification**

```bash
cd /home/jmagar/workspace/aurora-design-system
git add registry.json public/r
git commit -m "chore: refresh Aurora registry artifacts" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

If `git status --short` shows no changes after verification, skip this commit.

- [ ] **Step 5: Push the completed rollout**

```bash
cd /home/jmagar/workspace/aurora-design-system
git pull --rebase
bd dolt push
git push
git status -sb
```

Expected: branch is up to date with `origin/main` and there are no tracked file changes left to push.
