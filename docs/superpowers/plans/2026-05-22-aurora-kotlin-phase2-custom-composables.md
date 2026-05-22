# Aurora Kotlin Phase 2 — Custom Composables

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 32 custom Aurora Kotlin/Compose components that have no direct M3 equivalent, completing Tier 2 of the Android component library.

**Architecture:** Each component is a genuinely custom Composable built from Foundation primitives (LazyColumn, Canvas, BasicTextField, Popup, etc.) with Aurora theme tokens applied via `LocalAuroraColors.current`. All public declarations require explicit `public` modifier (`kotlin { explicitApi() }` is enforced). No `@OptIn` unless required by specific experimental APIs.

**Tech Stack:** Kotlin 2.1.0, Jetpack Compose BOM 2026.04.01, Material3, `material-icons-extended`, Coil 3, `kotlinx-collections-immutable`.

**Beads:** `aurora-design-system-6s5` | **Epic:** `aurora-design-system-xr7`

**Component directory:** `android/aurora/src/main/kotlin/tv/tootie/aurora/components/`

---

## Batch A — Simple Display Components
AuroraBanner, AuroraBreadcrumb, AuroraCallout, AuroraKbd, AuroraDescriptionList, AuroraEmptyState

## Batch B — Form / Input Components
AuroraField, AuroraFilterBar, AuroraInputOtp, AuroraNumberInput, AuroraListbox

## Batch C — Data Display Components
AuroraDataTable, AuroraTable, AuroraStatCard, AuroraStatusIndicator, AuroraTimeline

## Batch D — Navigation / Layout Components
AuroraToolbar, AuroraCarousel, AuroraPagination, AuroraResizablePanels

## Batch E — Workspace / Files Components
AuroraCodeBlock, AuroraCodeEditor, AuroraFileTree, AuroraAttachment, AuroraFilePicker

## Batch F — Screens / Complex Components
AuroraTerminal, AuroraCommandPalette, AuroraMarketplace, AuroraErrorPage, AuroraLogin, AuroraMenubar
