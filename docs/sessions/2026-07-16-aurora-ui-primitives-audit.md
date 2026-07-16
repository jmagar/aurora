---
date: 2026-07-16 14:14:46 EDT
repo: git@github.com:jmagar/aurora.git
branch: main
head: 2ae003cd23d47ff9599c9bd8cc85dd28e66f18fc
working directory: /home/jmagar/workspace/aurora
worktree: /home/jmagar/workspace/aurora
pr: "#53 fix: audit and polish Aurora UI primitives (https://github.com/jmagar/aurora/pull/53)"
beads: aurora-ggl4
---

# Aurora UI primitives audit

## User Request

Continue the Aurora design-system review through all shadcn blocks and UI components, dispatch parallel agents to speed up the work, fix every actionable issue consistently, verify the result, and save the completed session to Markdown.

## Session Overview

The broader conversation established an official Google Stitch-aligned `DESIGN.md`, corrected Aurora's accent semantics so cyan remains primary and Axon orange identifies AI/automation, reviewed the block catalog, and then completed a source-by-source audit of all 81 UI modules. The final UI pass reviewed 79 published primitives plus two internal support primitives, modified 52 UI modules and 54 demos, rebuilt the registry, and merged PR #53 as `2ae003c` after all local and protected CI gates passed.

Six isolated agents reviewed controls, forms, overlays, data/layout, feedback, and rich primitives. An independent reviewer then found and drove fixes for missing dependency declarations, lost compatibility aliases and refs, MultiSelect keyboard semantics, icon-only naming, Accordion defaults, NavigationMenu style merging, and clipboard feedback. All 51 changed published primitives passed a clean shadcn consumer install and typecheck.

## Sequence of Events

1. **Established design truth.** Researched the official Google Stitch DESIGN.md guidance, reconciled it with the live repository, and corrected stale counts and color-role wording.
2. **Corrected accent semantics.** Kept cyan as the primary interaction color and assigned Axon orange to AI/automation; removed violet from the web AI identity guidance.
3. **Reviewed blocks in groups.** Audited composed blocks and demos, fixed accessibility, composition, token, icon, and responsive defects, and rebuilt generated artifacts as work progressed.
4. **Scoped the primitive inventory.** Confirmed 81 UI source files: 79 published registry items plus `command.tsx` and `drawer.tsx` support modules.
5. **Dispatched parallel reviewers.** Split the inventory across six isolated worktrees and integrated all agent commits into one clean integration branch.
6. **Performed independent review.** Resolved eight cross-cutting findings involving dependencies, public APIs, refs, focus, keyboard behavior, defaults, styling, and copy feedback.
7. **Reconciled registry metadata.** Made every registry item's documented dependencies match its declared graph and added a permanent source/built-registry contract test.
8. **Verified real consumers and browsers.** Smoke-installed all 51 changed published primitives, ran static/build gates, exercised Storybook keyboard and axe contracts, and inspected representative desktop/mobile gallery screenshots.
9. **Resolved integration races.** Rebased over concurrent main changes, preserved upstream's deterministic focus completion marker, retained the Radix Popover migration, and reran affected gates.
10. **Merged and cleaned up.** Merged PR #53 after all required checks passed, closed and pushed bead state, removed seven temporary worktrees and branches, and synchronized clean `main` with `origin/main`.

## Key Findings

- `registry/aurora/ui/multi-select.tsx:169` needed explicit active-option state; its trigger now exposes `aria-activedescendant` and supports predictable keyboard selection at `registry/aurora/ui/multi-select.tsx:280`.
- `registry/aurora/ui/popover.tsx:4` now uses the proven Radix primitive, while `registry/aurora/ui/popover.tsx:29` preserves Aurora's preview portal-container behavior.
- Public API compatibility required restored aliases and direct React 19 refs across migrated compound primitives; static regression coverage lives in `tests/axon-web-primitives-contract.test.ts`.
- Registry documentation had dependency drift. `tests/registry-docs.test.ts:44` now checks the exact dependency list for both source and built registries.
- Storybook's Popover test originally searched only inside the canvas even though Radix portals to `document.body`; the final story queries the correct document scope and marks completion only after focus restoration at `stories/aurora/widgets.stories.tsx:75`.
- The authoritative inventory and color roles now appear in `CLAUDE.md:67`, `CLAUDE.md:78`, and `CLAUDE.md:97`; detailed guidance keeps Axon orange scoped to AI/automation in `DESIGN.md:313` and `DESIGN.md:369`.

## Technical Decisions

- Preferred repository-standard Radix/shadcn primitives for established interaction engines instead of maintaining custom overlay, menu, accordion, and disclosure logic.
- Preserved public aliases, default behavior, and DOM refs during migrations so downstream consumers do not pay for internal implementation changes.
- Treated keyboard, focus, naming, and portaled-content behavior as testable contracts rather than demo-only polish.
- Kept registry source, declared dependencies, human-readable install docs, and generated `public/r/*.json` artifacts mechanically synchronized.
- Changed Playwright server reuse to explicit opt-in so local verification cannot silently test a stale production build on the fixed test port.
- Preserved upstream's completion marker during rebase while using Radix's close/focus lifecycle, including its intentional exit-animation presence state.

## Files Changed

The table covers every path in merged component-audit commit `2ae003c`, plus this session artifact.

| status | path | previous path | purpose | evidence |
|---|---|---|---|---|
| created | `docs/sessions/2026-07-16-aurora-ui-primitives-audit.md` | - | Persistent session closeout | path-limited session-log commit |
| modified | `CLAUDE.md` | - | Inventory, design-role, and usage documentation | `git show --name-status 2ae003c` |
| modified | `DESIGN.md` | - | Inventory, design-role, and usage documentation | `git show --name-status 2ae003c` |
| modified | `README.md` | - | Inventory, design-role, and usage documentation | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/alert-dialog-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/aspect-ratio-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/avatar-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/badges-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/banners-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/button-group-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/buttons-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/callout-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/carousel-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/chat-message-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/chat-sidebar-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/checkbox-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/checkboxes-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/component-card-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/context-menu-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/copy-button-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/data-table-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/description-list-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/direction-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/drawer-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/dropdown-menu-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/dropdowns-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/filter-bar-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/filters-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/hover-card-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/input-group-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/input-otp-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/kbd-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/label-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/listbox-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/menubar-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/operation-icon-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/popover-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/progress-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/progress-ring-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/range-slider-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/rating-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/resizable-panels-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/search-results-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/segmented-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/select-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/separator-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/sheet-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/skeleton-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/sonner-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/spinner-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/stepper-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/switch-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/table-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/tables-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/tabs-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/toggle-group-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/toolbar-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `app/gallery/demos/tooltip-demo.tsx` | - | Gallery fidelity, states, accessibility, and responsive behavior | `git show --name-status 2ae003c` |
| modified | `package.json` | - | Required primitive dependencies and lockfile synchronization | `git show --name-status 2ae003c` |
| modified | `playwright.config.ts` | - | Current-build browser test server isolation | `git show --name-status 2ae003c` |
| modified | `pnpm-lock.yaml` | - | Required primitive dependencies and lockfile synchronization | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-accordion.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-agent-skill.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-ai-branch.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-ai-elements.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-ai-message-content.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-ai-response.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-alert-dialog.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-artifact.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-badge.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-banner.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-base.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-breadcrumb.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-calendar.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-callout.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-card.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-chart.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-chat-message.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-chat-sidebar.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-chat.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-checkbox.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-chrome-theme.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-clipboard.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-code-block.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-collapsible.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-combobox.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-component-card.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-components.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-copy-button.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-data-table.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-date-picker.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-description-list.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-empty-state.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-field.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-files.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-filter-bar.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-fonts.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-gateway.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-hover-card.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-input-group.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-input-otp.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-input.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-item.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-kbd.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-label.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-listbox.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-log-viewer.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-login.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-marketplace.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-menubar.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-multi-select.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-navigation-menu.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-operation-icon.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-pagination.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-palette.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-plugin-installer.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-popover.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-portal-container.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-progress-ring.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-progress.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-radio-group.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-rating.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-search-results.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-segmented.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-select.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-separator.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-share-dialog.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-sheet.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-shell-theme-pack.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-sidebar.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-skeleton.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-spotlight.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-stat-card.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-status-dot.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-status-indicator.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-stepper.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-table.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-tag-input.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-terminal.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-textarea.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-theme-dark.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-theme-light.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-toast.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-toggle-group.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-toggle.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-tokens.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-toolbar.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-warp-theme.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/aurora-zed-theme.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `public/r/registry.json` | - | Generated shadcn registry artifact | `git show --name-status 2ae003c` |
| modified | `registry.json` | - | Registry dependencies, descriptions, and install documentation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/accordion.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/alert-dialog.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/banner.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/breadcrumb.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/calendar.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/callout.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/card.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/chart.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/chat-message.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/chat-sidebar.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/checkbox.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/collapsible.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/command.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/component-card.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/copy-button.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/data-table.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/date-picker.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/description-list.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/empty-state.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/field.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/filter-bar.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/hover-card.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/input-group.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/input-otp.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/input.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/item.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/kbd.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/label.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/listbox.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/menubar.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/multi-select.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/navigation-menu.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/pagination.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/popover.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/progress-ring.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/progress.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/radio-group.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/rating.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/search-results.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/segmented.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/select.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/separator.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/spotlight.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/status-dot.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/status-indicator.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/stepper.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/table.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/tag-input.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/textarea.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/toast.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/toggle-group.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `registry/aurora/ui/toolbar.tsx` | - | Reviewed Aurora UI primitive implementation | `git show --name-status 2ae003c` |
| modified | `stories/aurora/widgets.stories.tsx` | - | Keyboard, focus, and accessibility interaction story | `git show --name-status 2ae003c` |
| modified | `tests/axon-web-primitives-contract.test.ts` | - | Regression and registry contract coverage | `git show --name-status 2ae003c` |
| modified | `tests/e2e/storybook.spec.ts` | - | Regression and registry contract coverage | `git show --name-status 2ae003c` |
| modified | `tests/registry-docs.test.ts` | - | Regression and registry contract coverage | `git show --name-status 2ae003c` |

## Beads Activity

| id | title | actions | final status | why it mattered |
|---|---|---|---|---|
| `aurora-ggl4` | Audit and polish all Aurora UI primitives | Created, claimed, scoped to 81 files, updated with agent assignments and verification evidence, closed, and pushed with `bd dolt push` | closed | Tracked the complete primitive audit, required gates, consumer smoke install, and final cleanup |

## Repository Maintenance

- **Plans:** `docs/plans/` does not exist, so there were no completed plan files to move and no ambiguous plans to preserve.
- **Beads:** `aurora-ggl4` is closed with notes covering all 81 reviewed source files, 51 changed published primitives, and the final verification set; Dolt push completed successfully.
- **Worktrees and branches:** Git initially showed six agent worktrees plus one integration worktree. All seven were clean, the integrated work was merged through PR #53, and those worktrees/local branches plus the remote integration branch were removed. Final `git worktree list` contains only `/home/jmagar/workspace/aurora` on `main`.
- **Remote branches:** Dependabot, release-please, feature, OpenWiki, and older Claude branches remain because this session did not establish that they were obsolete or safe to delete. No force deletion was attempted.
- **Stashes and status:** `git stash list` was empty. Final local and remote SHAs both resolved to `2ae003cd23d47ff9599c9bd8cc85dd28e66f18fc`, and `git status --short --branch` reported `main...origin/main` with no changes.
- **Stale documentation:** `CLAUDE.md`, `README.md`, and `DESIGN.md` now report 175 registry items and 79 published UI primitives plus two support modules. Registry dependency prose is checked against source metadata. `AGENTS.md` and `GEMINI.md` remain symlinks to `CLAUDE.md`.
- **Transcript transparency:** The auto-detected Claude transcript contained an unrelated prior prompt (`hi`) and was not used or attached as provenance for this Codex session.

## Tools and Skills Used

- **Skills:** `lavra:frontend-design` guided the UI review; `superpowers:dispatching-parallel-agents` supported the six-lane split; `vibin:save-to-md` produced this closeout. The initial dispatch required a second, more explicit assignment pass before work was distributed as intended.
- **Agents:** Six implementation agents handled non-overlapping UI categories and one independent reviewer audited the integrated result. Their commits were applied into an isolated integration worktree.
- **Shell and file tools:** `rg`, Git, pnpm, Node, `apply_patch`, and repository scripts were used for inventory, source inspection, editing, generation, and validation. Long-running build/test sessions were resumed through their PTY session IDs when the outer command yielded early.
- **Browser tools:** Playwright and image inspection exercised route hydration, keyboard/focus behavior, axe checks, and representative desktop/mobile layouts. A stale local Next server and a portal-scoping test bug were diagnosed from screenshots and runtime evidence.
- **External CLIs:** `gh` created, watched, and merged PR #53; `bd` tracked and closed the audit. Direct main push was rejected by repository rules, so the protected PR path was used.
- **Web research:** Official Google Stitch DESIGN.md pages were consulted for structure, import, usage, CLI validation, and linting guidance.
- **MCP:** No MCP server was required for the component implementation or final save workflow. The session-start Labby health advisory reported `localhost:8765` unreachable, but it did not block repository work.

## Commands Executed

| command | result |
|---|---|
| `bd show aurora-ggl4` | Confirmed the 81-file scope and final closed status |
| `pnpm registry:build` | Rebuilt all 175 registry items successfully |
| `pnpm test:unit` | Passed 102 tests |
| `pnpm exec tsc --noEmit --pretty false` | Passed with no diagnostics |
| `pnpm refs:check` | Validated the React 19 direct-ref contract |
| `pnpm lint` | Passed ESLint |
| `pnpm audit:composition` | Passed composition rules |
| `pnpm audit:standalone` | Passed standalone audit |
| `pnpm registry:validate` | Passed registry capability validation |
| `node scripts/validate-registry-graph.mjs` | Validated 175 items and 182 shipped source files |
| `pnpm registry:check` | Rebuilt registry and found no generated drift |
| `pnpm skill:check` | Confirmed root and packaged Aurora skills are synchronized |
| `pnpm build` | Completed the Next.js production build and 228-page generation |
| `pnpm test:e2e` | Passed 11 route, interaction, focus, and strict axe tests |
| `git pull --rebase origin main` | Rebased over concurrent main changes after resolving four Popover/test conflicts |
| `bd dolt push` | Pushed the closed bead state |
| `gh pr checks 53 --watch` | Observed all four required repository checks pass |
| `gh pr merge 53 --squash --delete-branch` | Merged PR #53 server-side as `2ae003c`; local branch cleanup was completed separately |

## Errors Encountered

- The first parallel-agent dispatch did not distribute enough files. The work was re-scoped into six explicit, non-overlapping category assignments with commit requirements.
- A production build command yielded while Next.js was still running. The existing execution session was polled until it returned exit code 0.
- `/gallery/buttons` failed once because Playwright reused an old Next server on port 3010. A fresh server proved the route healthy, and server reuse became explicit opt-in via `PLAYWRIGHT_REUSE_SERVER=1`.
- The Popover Storybook play function searched the canvas for portaled content and aborted before Escape. It now queries `document.body`, asserts the Radix closed state, waits for restored focus, and sets a completion marker.
- Rebasing over concurrent main changes produced four Popover/test conflicts. The resolution kept the Radix implementation, portal support, MultiSelect coverage, and upstream's deterministic completion marker, followed by a complete affected-gate rerun.
- Direct push to protected `main` was rejected because changes require a PR and four checks. PR #53 was created, watched to green, and merged.
- Repository auto-merge was disabled. Manual merge succeeded server-side; `gh` then failed only while trying to switch to `main` because that branch was already attached to the primary worktree. PR state and merge SHA were verified before manual cleanup.

## Behavior Changes (Before/After)

| area | before | after |
|---|---|---|
| UI architecture | Several custom compound controls diverged from current shadcn/Radix behavior | Established primitives use current Radix/shadcn composition with Aurora styling |
| Public compatibility | Some migrations dropped aliases, defaults, style merging, or refs | Compatibility aliases, direct refs, Accordion defaults, and consumer style merging are preserved |
| MultiSelect | Incomplete active-option and keyboard/focus semantics | Roving active option, `aria-activedescendant`, keyboard selection, and chip event isolation are explicit |
| Accessibility | Some icon-only controls and native checkbox/radio wrappers lacked reliable names or click targets | Icon-only status controls are named, visible labels activate controls, and Storybook axe contracts pass |
| Copy feedback | Chat demo used optimistic local copy state | Copy behavior uses the verified central clipboard primitive with error and timer handling |
| Visual system | Demos contained raw controls, raw colors, inconsistent icons, and weak responsive states | Demos use Aurora primitives/tokens, Lucide icons, richer states, and verified desktop/mobile layouts |
| Registry metadata | Dependency prose and manifests could drift | All source/built docs list exact declared dependencies and generated output is drift-checked |
| Browser testing | Local Playwright could reuse a stale server; portal tests raced lifecycle behavior | Current-build servers are the default, and portal/focus tests wait on explicit completion evidence |

## Verification Evidence

| command | expected | actual | status |
|---|---|---|---|
| `pnpm test:unit` | All unit and contract tests pass | 102 passed, 0 failed | pass |
| `pnpm exec tsc --noEmit --pretty false` | No TypeScript errors | No diagnostics | pass |
| `pnpm lint` | No ESLint errors | Exit 0 | pass |
| `pnpm refs:check` | React 19 refs are direct | Contract validated | pass |
| `pnpm audit:composition` | No forbidden raw composition | Audit passed | pass |
| `pnpm audit:standalone` | Standalone artifacts are valid | Audit passed | pass |
| `pnpm registry:validate` | Capability items are valid | Validation passed | pass |
| `node scripts/validate-registry-graph.mjs` | Registry graph is complete and acyclic | 175 items, 182 shipped files | pass |
| `pnpm registry:check` | Generated registry matches source | No drift | pass |
| changed-item consumer smoke | All changed entries install and typecheck | 51 of 51 passed | pass |
| `pnpm build` | Production app compiles and generates routes | Build passed; 228 pages generated | pass |
| `pnpm test:e2e` | Routes and interaction/axe contracts pass | 11 passed, 0 failed | pass |
| desktop/mobile visual check | No runtime errors or horizontal overflow | Four representative views clean at 1440px and 390px | pass |
| PR #53 required checks | Four protected checks pass | Policy, OSV, web/registry/standalone, and Android all passed | pass |
| final repository state | Local main equals remote main with one worktree | Both at `2ae003c`; clean | pass |

## Risks and Rollback

- This was a broad 206-file merge, but most breadth came from 54 demos and 89 generated registry artifacts; the reviewed behavior lives primarily in 52 UI source modules.
- Public compatibility is guarded by static alias/ref tests and consumer installs, but downstream applications with undocumented assumptions may still expose edge cases.
- Roll back the entire primitive audit with a normal revert of merge commit `2ae003c`; do not force-reset protected main. After any partial source rollback under `registry/aurora/**`, run `pnpm registry:build` and commit matching `public/r/*.json` output.

## Decisions Not Taken

- Did not preserve hand-rolled interaction engines where a maintained Radix primitive already matched the required behavior.
- Did not treat Radix's temporary closed-state DOM presence during exit animation as a failure; tests assert closed state and restored focus instead.
- Did not bypass branch protection, force-push, or leave the integration branch for the user to merge.
- Did not delete unrelated remote feature, release, Dependabot, OpenWiki, or Claude branches without proof that they were obsolete.
- Did not use the unrelated auto-detected Claude transcript as evidence for this Codex session.

## References

- [Google Stitch DESIGN.md overview](https://stitch.withgoogle.com/docs/design-md/overview/)
- [Google Stitch DESIGN.md specification](https://stitch.withgoogle.com/docs/design-md/specification/)
- [Google Stitch import guidance](https://stitch.withgoogle.com/docs/design-md/get-instructions/)
- [Google Stitch CLI validation](https://stitch.withgoogle.com/docs/design-md/cli/)
- [Google Stitch linting rules](https://stitch.withgoogle.com/docs/design-md/linting-rules/)
- [Aurora PR #53](https://github.com/jmagar/aurora/pull/53)
- `docs/sessions/2026-07-16-comprehensive-review-remediation-deployment.md`
- Bead `aurora-ggl4`

## Next Steps

No unfinished work remains in the UI primitive audit. The immediate repository state is clean and synchronized. Future component changes should preserve the new dependency-doc contract, run `pnpm registry:build` after registry source edits, and extend the Storybook interaction suite whenever keyboard or focus behavior changes.
