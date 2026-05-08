import * as React from "react"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

const DEMOS: Record<string, React.ComponentType> = {
  colors:      dynamic(() => import("../demos/colors-demo")),
  type:        dynamic(() => import("../demos/type-demo")),
  spacing:     dynamic(() => import("../demos/spacing-demo")),
  brand:       dynamic(() => import("../demos/brand-demo")),
  buttons:     dynamic(() => import("../demos/buttons-demo")),
  badges:      dynamic(() => import("../demos/badges-demo")),
  switch:      dynamic(() => import("../demos/switch-demo")),
  avatar:      dynamic(() => import("../demos/avatar-demo")),
  progress:    dynamic(() => import("../demos/progress-demo")),
  forms:       dynamic(() => import("../demos/forms-demo")),
  checkboxes:  dynamic(() => import("../demos/checkboxes-demo")),
  tabs:        dynamic(() => import("../demos/tabs-demo")),
  banners:     dynamic(() => import("../demos/banners-demo")),
  toasts:      dynamic(() => import("../demos/toasts-demo")),
  tooltip:     dynamic(() => import("../demos/tooltip-demo")),
  empty:       dynamic(() => import("../demos/empty-demo")),
  skeleton:    dynamic(() => import("../demos/skeleton-demo")),
  breadcrumb:  dynamic(() => import("../demos/breadcrumb-demo")),
  pagination:  dynamic(() => import("../demos/pagination-demo")),
  stats:       dynamic(() => import("../demos/stats-demo")),
  tables:      dynamic(() => import("../demos/tables-demo")),
  filters:     dynamic(() => import("../demos/filters-demo")),
  modals:      dynamic(() => import("../demos/modals-demo")),
  dropdowns:   dynamic(() => import("../demos/dropdowns-demo")),
  "context-menu": dynamic(() => import("../demos/context-menu-demo")),
  "prompt-input": dynamic(() => import("../demos/prompt-input-demo")),
  "tool-calls":   dynamic(() => import("../demos/tool-calls-demo")),
  thinking:       dynamic(() => import("../demos/thinking-demo")),
  "code-block":   dynamic(() => import("../demos/code-block-demo")),
  artifact:       dynamic(() => import("../demos/artifact-demo")),
  terminal:       dynamic(() => import("../demos/terminal-demo")),
  "permission-prompt":    dynamic(() => import("../demos/permission-prompt-demo")),
  "ask-user-question":    dynamic(() => import("../demos/ask-user-question-demo")),
  "permissions-dropdown": dynamic(() => import("../demos/permissions-dropdown-demo")),
  attachment:     dynamic(() => import("../demos/attachment-demo")),
  "command-palette": dynamic(() => import("../demos/command-palette-demo")),
  sidebar:        dynamic(() => import("../demos/sidebar-demo")),
  "file-picker":  dynamic(() => import("../demos/file-picker-demo")),
  "file-tree":    dynamic(() => import("../demos/file-tree-demo")),
  "code-editor":  dynamic(() => import("../demos/code-editor-demo")),
  "web-preview":  dynamic(() => import("../demos/web-preview-demo")),
  "share-dialog": dynamic(() => import("../demos/share-dialog-demo")),
  login:          dynamic(() => import("../demos/login-demo")),
  oauth:          dynamic(() => import("../demos/oauth-demo")),
  "error-pages":  dynamic(() => import("../demos/error-pages-demo")),
  lightmode:      dynamic(() => import("../demos/lightmode-demo")),
}

export function generateStaticParams() {
  return Object.keys(DEMOS).map((section) => ({ section }))
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const Demo = DEMOS[section]
  if (!Demo) notFound()
  return <Demo />
}
