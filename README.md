# Aurora Design System

Operator-first design system for [Labby](https://github.com/jmagar/labby) — an AI-powered gateway control plane built with Rust.

![Aurora](https://img.shields.io/badge/Aurora-Design_System-29b6f6?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwxKSI+PHBhdGggZD0iTSA4IDEzIEwgMjQgNyBMIDQwIDEzIEwgMjQgMTkgWiIgZmlsbD0iIzI0NTM2YyIvPjxwYXRoIGQ9Ik0gOCAyMSBMIDI0IDE1IEwgNDAgMjEgTCAyNCAyNyBaIiBmaWxsPSIjMWM3ZmFjIi8+PHBhdGggZD0iTSA4IDI5IEwgMjQgMjMgTCA0MCAyOSBMIDI0IDM1IFoiIGZpbGw9IiMyOWI2ZjYiLz48cGF0aCBkPSJNIDggMzcgTCAyNCAzMSBMIDQwIDM3IEwgMjQgNDMgWiIgZmlsbD0iIzY3Y2JmYSIvPjwvZz48L3N2Zz4=)

## Overview

Aurora is a dark-first, operator-grade design system featuring:
- **41 components** — 22 UI primitives + 19 composed blocks
- **CSS custom properties** — compatible with both dark and light themes
- **shadcn registry** — install any component with one command
- **Manrope + Inter + JetBrains Mono** font stack

## Quick install

```bash
# Add the Aurora token CSS first
npx shadcn add https://raw.githubusercontent.com/jmagar/aurora-design-system/main/registry.json aurora-button
```

## Setup

1. Add to `app/globals.css`:
```css
@import "../registry/aurora/aurora.css";
```

2. Add to `app/layout.tsx`:
```tsx
import { Manrope, Inter, JetBrains_Mono } from "next/font/google"
// html className="dark"
```

## Components

### UI Primitives (`registry/aurora/ui/`)
| Component | Import |
|---|---|
| Button | `@/registry/aurora/ui/button` |
| Badge | `@/registry/aurora/ui/badge` |
| Input | `@/registry/aurora/ui/input` |
| Select | `@/registry/aurora/ui/select` |
| Textarea | `@/registry/aurora/ui/textarea` |
| Checkbox | `@/registry/aurora/ui/checkbox` |
| Switch | `@/registry/aurora/ui/switch` |
| Avatar | `@/registry/aurora/ui/avatar` |
| Progress | `@/registry/aurora/ui/progress` |
| Tabs | `@/registry/aurora/ui/tabs` |
| Breadcrumb | `@/registry/aurora/ui/breadcrumb` |
| Pagination | `@/registry/aurora/ui/pagination` |
| Dialog | `@/registry/aurora/ui/dialog` |
| DropdownMenu | `@/registry/aurora/ui/dropdown-menu` |
| ContextMenu | `@/registry/aurora/ui/context-menu` |
| Tooltip | `@/registry/aurora/ui/tooltip` |
| Banner | `@/registry/aurora/ui/banner` |
| Toast | `@/registry/aurora/ui/toast` |
| EmptyState | `@/registry/aurora/ui/empty-state` |
| Skeleton | `@/registry/aurora/ui/skeleton` |
| StatCard | `@/registry/aurora/ui/stat-card` |
| DataTable | `@/registry/aurora/ui/data-table` |
| FilterBar | `@/registry/aurora/ui/filter-bar` |

### Composed Blocks (`registry/aurora/blocks/`)
| Block | Import |
|---|---|
| PromptInput | `@/registry/aurora/blocks/prompt-input/prompt-input` |
| Terminal | `@/registry/aurora/blocks/terminal/terminal` |
| Thinking | `@/registry/aurora/blocks/thinking/thinking` |
| ToolCalls | `@/registry/aurora/blocks/tool-calls/tool-calls` |
| CodeBlock | `@/registry/aurora/blocks/code-block/code-block` |
| Artifact | `@/registry/aurora/blocks/artifact/artifact` |
| Sidebar | `@/registry/aurora/blocks/sidebar/sidebar` |
| CommandPalette | `@/registry/aurora/blocks/command-palette/command-palette` |
| PermissionPrompt | `@/registry/aurora/blocks/permission-prompt/permission-prompt` |
| AskUserQuestion | `@/registry/aurora/blocks/ask-user-question/ask-user-question` |
| PermissionsDropdown | `@/registry/aurora/blocks/permissions-dropdown/permissions-dropdown` |
| Attachment | `@/registry/aurora/blocks/attachment/attachment` |
| FilePicker | `@/registry/aurora/blocks/file-picker/file-picker` |
| FileTree | `@/registry/aurora/blocks/file-tree/file-tree` |
| CodeEditor | `@/registry/aurora/blocks/code-editor/code-editor` |
| WebPreview | `@/registry/aurora/blocks/web-preview/web-preview` |
| ShareDialog | `@/registry/aurora/blocks/share-dialog/share-dialog` |
| Login | `@/registry/aurora/blocks/login/login` |
| OAuth | `@/registry/aurora/blocks/oauth/oauth` |
| ErrorPage | `@/registry/aurora/blocks/error-page/error-page` |

## Theming

Aurora uses CSS custom properties for theming. Add `.light` to `<html>` or `<body>` to switch to light mode:

```tsx
document.documentElement.classList.toggle("dark")
document.documentElement.classList.toggle("light")
```

### Key tokens
```css
--aurora-accent-primary: #29b6f6;  /* cyan — primary CTA */
--aurora-accent-pink: #f9a8c4;     /* rose — secondary CTA, agent actions */
--aurora-success: #7dd3c7;
--aurora-warn: #c6a36b;
--aurora-error: #c78490;
```

## Development

```bash
pnpm install
pnpm dev        # starts on http://localhost:3000
pnpm build
pnpm lint
```

## Contributing

1. Components live in `registry/aurora/ui/` (primitives) or `registry/aurora/blocks/<name>/` (composed)
2. Add a demo at `app/gallery/demos/<name>-demo.tsx`
3. Register in `app/gallery/[section]/page.tsx`
4. Update `registry.json` with the new entry
5. Use inline styles with Aurora CSS vars — never hardcode hex values

## License

MIT
