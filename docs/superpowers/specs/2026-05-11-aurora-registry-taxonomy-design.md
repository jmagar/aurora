# Aurora Registry Taxonomy Design

## Problem

Aurora currently presents a strong set of installable primitives and higher-level blocks, but its registry structure still reads more like a traditional design system than a product-oriented registry for agent applications. The current top-level shape of `registry/aurora/` is simple and workable:

- `aurora.css`
- `ui/`
- `blocks/`

That shape is close to a solid long-term foundation, but it does not yet clearly communicate Aurora's product identity or provide an obvious browsing model for users looking for agent-app workflows, workspace surfaces, and task-oriented building blocks.

The goal is to define a registry taxonomy that preserves a stable primitive layer while making Aurora's product and agent-app blocks easier to discover, explain, and evolve.

## Goals

- Keep primitives easy to find and stable to reuse.
- Make Aurora feel like an agent-app and product registry, not only a component library.
- Improve browsing and documentation clarity for higher-level blocks.
- Avoid unnecessary top-level sprawl.
- Leave room for future growth in themes, hooks, icons, and domain-specific blocks.

## Non-Goals

- Renaming every existing registry item immediately.
- Redesigning the registry item naming convention.
- Rewriting implementation code as part of this design.
- Creating domain folders that do not yet have enough real inventory to justify them.

## Recommended Approach

Use a **hybrid taxonomy**:

- keep a flat, stable primitive layer for reusable UI
- add shared support layers only when they contain reusable registry-worthy assets
- organize product-facing blocks by domain under `blocks/`

This approach balances two competing needs:

1. Aurora still needs a predictable primitive foundation.
2. Aurora's differentiated value is in installable agent-app and workspace-oriented blocks.

Purely layer-first organization would undersell the product story. Purely domain-first organization would make primitives harder to browse and reuse. A hybrid structure gives Aurora a durable base and a clearer market identity.

## Proposed Directory Structure

```txt
registry/aurora/
  styles/
    aurora.css
  ui/
    ...
  hooks/
    ...
  icons/
    ...
  blocks/
    ai/
    workspace/
    files/
    auth/
    navigation/
    feedback/
```

## Directory Responsibilities

### `styles/`

Contains Aurora's theme and token contract. This starts with `aurora.css` and can later expand to multiple token or theme packs if needed.

Use this directory for:

- CSS variable definitions
- theme packs
- future branded variants such as dark/light or product-specific skins

Do not use this directory for component-specific styling fragments.

### `ui/`

Contains the flat primitive layer. This directory should remain intentionally boring and predictable.

Use this directory for:

- buttons
- inputs
- menus
- overlays
- cards
- tables
- layout primitives
- low-level composable UI parts

This layer is the stable foundation that other Aurora blocks build on.

### `hooks/`

Contains shared behavioral primitives that are worth distributing through the registry.

Examples:

- media query hooks
- keyboard shortcut hooks
- local storage hooks
- clipboard hooks
- command state hooks

This directory should only exist for genuinely reusable installable behavior.

### `icons/`

Contains reusable icon assets or icon wrappers when Aurora needs to distribute brand-specific or system-specific iconography.

This directory should only be introduced if Aurora accumulates enough shared icon inventory to justify it.

### `blocks/`

Contains the product layer and should become the primary story of the registry.

This is where Aurora should differentiate itself as a registry for agent products and operator workflows. These blocks should feel installable, task-oriented, and closer to complete user-facing surfaces than raw primitives.

## Proposed Block Domains

Start with these domain folders under `blocks/`:

- `ai/`
- `workspace/`
- `files/`
- `auth/`
- `navigation/`
- `feedback/`

These domains are broad enough to be understandable and narrow enough to help browsing.

## Suggested Mapping of Current Blocks

The current block inventory should move toward the following conceptual grouping:

```txt
blocks/
  ai/
    prompt-input
    thinking
    tool-calls
    artifact
    ask-user-question
  workspace/
    sidebar
    command-palette
    web-preview
    share-dialog
    code-block
  files/
    attachment
    file-picker
    file-tree
    code-editor
  auth/
    login
    oauth
    permission-prompt
    permissions-dropdown
  feedback/
    error-page
  navigation/
    terminal
```

## Notes on Ambiguous Placements

- `terminal` is the least stable categorization in this mapping. It could also fit under `workspace/` or `ai/` depending on how Aurora wants to position it.
- `code-block` could belong in `ai/` if its primary meaning is assistant output rather than general workspace rendering.
- `permission-prompt` and `permissions-dropdown` can remain in `auth/` for now, but if the permission and governance surface expands, Aurora may later introduce a `security/` or `controls/` domain.

These ambiguities do not block the taxonomy. The important outcome is a browsing model that feels intuitive to users.

## Decision Rules for New Directories

Aurora should avoid adding top-level directories unless they are justified by multiple real registry items and a clear user-facing browsing need.

Rules:

- keep the top-level root small
- prefer adding subdirectories under `blocks/` before adding new top-level directories
- do not create `hooks/`, `icons/`, or niche block domains until there is enough inventory to make them useful
- optimize for discoverability over taxonomy purity

## Public Positioning

Aurora should describe itself as:

> a shadcn-compatible registry for agent products and operator-grade application workflows

The structure should support that message:

- `ui/` is the primitive layer
- `blocks/` is the domain-oriented product layer
- `styles/` is the Aurora token and theme contract
- `hooks/` and `icons/` are supporting layers when needed

This positioning is more aligned with Aurora's current inventory and future differentiation than describing it only as a general-purpose design system.

## Migration Guidance

The taxonomy should evolve carefully:

1. Keep public registry item names stable where possible.
2. Prefer internal directory reorganization before public install-name churn.
3. Update docs and discovery surfaces to foreground domain-oriented blocks.
4. Preserve a simple install story for primitives.
5. Only introduce new folders when their contents are large enough to browse as a category.

If the physical directory layout changes, documentation should continue to emphasize stable install names and clear browsing categories rather than exposing churn to users.

## Recommendation

Adopt the hybrid model now:

- preserve a flat primitive layer in `ui/`
- move `aurora.css` under `styles/`
- add `hooks/` and `icons/` only when inventory justifies them
- make `blocks/` the main product story by grouping items into domain-oriented folders

This gives Aurora a cleaner long-term information architecture and a clearer identity as an agent-app registry without sacrificing the usability of its primitive layer.
