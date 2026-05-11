# Aurora color token expansion design

## Problem

Aurora's current token layer is strong at brand identity and core surfaces, but it is still thin in two areas:

1. Semantic UI coverage for status-bearing components and messaging states
2. Expressive differentiation for AI and automation moments that should not borrow status or brand colors

Today the system has solid foundations for surfaces, borders, primary text, muted text, cyan brand action, rose secondary emphasis, and a small set of raw status hues. What it lacks is a clear semantic contract that components can consume consistently across the gallery and registry.

## Goals

- Preserve the existing Aurora shell and dark-first visual identity
- Expand the token contract without turning Aurora into a large generic palette library
- Separate identity, meaning, and behavior into distinct token layers
- Add one expressive family for AI and automation moments
- Update the foundations/colors gallery and representative component demos so the gallery teaches the contract in use

## Non-goals

- Reworking Aurora's base surfaces, border system, or typography
- Introducing full 10-step ramps for every color family
- Retheming every component in one pass
- Using hue names directly in semantic component APIs

## Design principles

1. Keep the existing surface system stable
2. Prefer semantic roles over direct hue selection in component usage
3. Add the smallest number of new tokens that still makes component state styling clear
4. Reserve expressive colors for real product meaning, not decoration

## Token architecture

The expanded color system should use three layers.

### 1. Brand families

Brand tokens continue to carry Aurora's identity:

- Cyan remains the primary action family
- Rose remains the secondary and human-emphasis family
- Violet is added as the expressive family for AI and automation

These tokens are used when a component needs Aurora product identity or a purposeful AI/automation cue, not when it needs to communicate system state.

### 2. Semantic state families

Aurora should add dedicated families for:

- `info`
- `success`
- `warn`
- `error`
- `neutral`

Each family gets a compact four-token contract:

- `--aurora-<state>`
- `--aurora-<state>-surface`
- `--aurora-<state>-border`
- `--aurora-<state>-foreground`

This gives components enough expressive range for badges, callouts, banners, indicators, and inline messaging without requiring a full ramp.

### 3. Interaction and system tokens

Cross-cutting UI behaviors should remain derived tokens:

- `--aurora-overlay`
- `--aurora-disabled-text`
- `--aurora-disabled-surface`
- `--aurora-subtle-bg`
- `--aurora-selected-bg`
- `--aurora-pressed-bg`
- `--aurora-focus-ring-strong`

These tokens encode behavior, not meaning. They should be shared across components regardless of semantic state.

## Proposed naming contract

### Brand tokens

Retain the existing cyan and rose families and add violet in the same style:

- `--aurora-accent-primary`
- `--aurora-accent-strong`
- `--aurora-accent-deep`
- `--aurora-accent-lift`
- `--aurora-accent-button`
- `--aurora-accent-pink`
- `--aurora-accent-pink-strong`
- `--aurora-accent-pink-deep`
- `--aurora-accent-pink-button`
- `--aurora-accent-violet`
- `--aurora-accent-violet-strong`
- `--aurora-accent-violet-deep`
- `--aurora-accent-violet-button`

If implementation does not need all four violet variants immediately, the family can start with `violet`, `violet-strong`, and `violet-deep`, but the naming should stay consistent with the existing accent pattern.

### Semantic tokens

Each state uses the same role-based naming:

- `--aurora-info`
- `--aurora-info-surface`
- `--aurora-info-border`
- `--aurora-info-foreground`

Repeat the same shape for `success`, `warn`, `error`, and `neutral`.

### Interaction and system tokens

- `--aurora-overlay`
- `--aurora-disabled-text`
- `--aurora-disabled-surface`
- `--aurora-subtle-bg`
- `--aurora-selected-bg`
- `--aurora-pressed-bg`
- `--aurora-focus-ring-strong`

## Role mapping

- **Cyan** = primary product action and Aurora brand identity
- **Rose** = secondary emphasis and human-facing accent moments
- **Violet** = AI, automation, generated output, and model-driven moments
- **Info/success/warn/error/neutral** = semantic component state and system meaning
- **Interaction/system tokens** = shared behavior for disabled, selected, pressed, overlay, and focus states

Violet should not replace semantic `info`. It serves a different purpose: AI or automation identity, not status messaging.

## Component usage model

### Keep foundations stable

The following tokens remain the shell foundation and should not change meaning in this rollout:

- `page-bg`
- `nav-bg`
- `panel-*`
- `control-surface`
- `hover-bg`
- border tokens
- primary and muted text tokens

### Move state-bearing components onto semantic roles

Representative components should consume semantic state tokens instead of raw hue tokens when their job is to communicate state:

- `Badge`
- `Callout`
- `StatusIndicator`
- banners and alerts
- progress and inline status affordances
- empty or error states where semantic meaning is primary

### Use violet for AI and automation

Representative AI-oriented components can adopt violet where they currently lean on cyan or rose for non-status emphasis:

- `thinking`
- `artifact`
- `tool-calls`
- `prompt-input`
- other automation-driven affordances in the gallery

### Use derived interaction tokens for behavior

- disabled controls use `disabled-text` and `disabled-surface`
- selected rows, chips, or cards use `selected-bg`
- pressed states use `pressed-bg`
- modal, sheet, dialog, and command-palette scrims use `overlay`
- stronger visible keyboard focus can use `focus-ring-strong`

## Gallery and docs rollout

The gallery should explicitly teach the contract.

### Foundations/colors gallery

Update the colors page so it presents three separate sections:

1. **Brand tokens for identity**
   - cyan
   - rose
   - violet

2. **Semantic tokens for meaning**
   - info
   - success
   - warn
   - error
   - neutral

3. **Interaction/system tokens for behavior**
   - overlay
   - disabled
   - subtle
   - selected
   - pressed
   - stronger focus ring

The gallery intro copy should explicitly teach:

- brand tokens are for identity
- semantic tokens are for meaning
- interaction tokens are for behavior

### Representative component demos

The first implementation pass should update:

- the foundations/colors gallery
- representative demos for `Badge`, `Callout`, and `StatusIndicator`

The purpose is to prove the contract through real usage, not only through swatches.

## Suggested rollout order

1. Add new tokens to the Aurora CSS token file and registry token export
2. Update the colors gallery to reflect the three-layer contract
3. Update `Badge`, `Callout`, and `StatusIndicator` to consume semantic roles
4. Update their demos so the gallery shows the new meaning-bearing contract
5. Apply violet selectively to representative AI and automation demos where it improves meaning without fighting semantic state colors

## Tradeoff summary

This design intentionally chooses a hybrid model:

- smaller and clearer than a fully dedicated palette system
- more semantically useful than deriving everything from a small core palette
- expressive enough to give AI and automation a distinct visual lane

It preserves Aurora's operator-grade voice while making the token system easier to teach and easier for components to consume correctly.
