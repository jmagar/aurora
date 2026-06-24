import * as React from "react"
import { notFound, redirect } from "next/navigation"
import dynamic from "next/dynamic"
import { formatSectionTitle, getRegistryMeta, SECTION_REDIRECTS } from "@/lib/registry-meta"
import { ComponentInstall } from "@/components/component-install"

const COMPONENT_DEMOS: Record<string, React.ComponentType> = {
  alert: dynamic(() => import("../demos/alert-demo")),
  "alert-dialog": dynamic(() => import("../demos/alert-dialog-demo")),
  "aspect-ratio": dynamic(() => import("../demos/aspect-ratio-demo")),
  calendar: dynamic(() => import("../demos/calendar-demo")),
  card: dynamic(() => import("../demos/card-demo")),
  carousel: dynamic(() => import("../demos/carousel-demo")),
  chart: dynamic(() => import("../demos/chart-demo")),
  collapsible: dynamic(() => import("../demos/collapsible-demo")),
  command: dynamic(() => import("../demos/command-demo")),
  "data-table": dynamic(() => import("../demos/data-table-demo")),
  "date-picker": dynamic(() => import("../demos/date-picker-demo")),
  direction: dynamic(() => import("../demos/direction-demo")),
  drawer: dynamic(() => import("../demos/drawer-demo")),
  field: dynamic(() => import("../demos/field-demo")),
  "hover-card": dynamic(() => import("../demos/hover-card-demo")),
  input: dynamic(() => import("../demos/input-demo")),
  "input-group": dynamic(() => import("../demos/input-group-demo")),
  "input-otp": dynamic(() => import("../demos/input-otp-demo")),
  item: dynamic(() => import("../demos/item-demo")),
  label: dynamic(() => import("../demos/label-demo")),
  menubar: dynamic(() => import("../demos/menubar-demo")),
  "native-select": dynamic(() => import("../demos/native-select-demo")),
  "navigation-menu": dynamic(() => import("../demos/navigation-menu-demo")),
  popover: dynamic(() => import("../demos/popover-demo")),
  "radio-group": dynamic(() => import("../demos/radio-group-demo")),
  "scroll-area": dynamic(() => import("../demos/scroll-area-demo")),
  select: dynamic(() => import("../demos/select-demo")),
  slider: dynamic(() => import("../demos/slider-demo")),
  sonner: dynamic(() => import("../demos/sonner-demo")),
  table: dynamic(() => import("../demos/table-demo")),
  textarea: dynamic(() => import("../demos/textarea-demo")),
  toggle: dynamic(() => import("../demos/toggle-demo")),
  "toggle-group": dynamic(() => import("../demos/toggle-group-demo")),
  "number-input": dynamic(() => import("../demos/number-input-demo")),
  combobox: dynamic(() => import("../demos/combobox-demo")),
  sheet: dynamic(() => import("../demos/sheet-demo")),
  callout: dynamic(() => import("../demos/callout-demo")),
  "status-indicator": dynamic(() => import("../demos/status-indicator-demo")),
  timeline: dynamic(() => import("../demos/timeline-demo")),
  "description-list": dynamic(() => import("../demos/description-list-demo")),
  "resizable-panels": dynamic(() => import("../demos/resizable-panels-demo")),
  listbox: dynamic(() => import("../demos/listbox-demo")),
  "search-results": dynamic(() => import("../demos/search-results-demo")),
  kbd: dynamic(() => import("../demos/kbd-demo")),
  toolbar: dynamic(() => import("../demos/toolbar-demo")),
  "chat-message": dynamic(() => import("../demos/chat-message-demo")),
  "chat-sidebar": dynamic(() => import("../demos/chat-sidebar-demo")),
  "color-picker": dynamic(() => import("../demos/color-picker-demo")),
  "component-card": dynamic(() => import("../demos/component-card-demo")),
  "copy-button": dynamic(() => import("../demos/copy-button-demo")),
  "multi-select": dynamic(() => import("../demos/multi-select-demo")),
  "operation-icon": dynamic(() => import("../demos/operation-icon-demo")),
  "progress-ring": dynamic(() => import("../demos/progress-ring-demo")),
  "range-slider": dynamic(() => import("../demos/range-slider-demo")),
  rating: dynamic(() => import("../demos/rating-demo")),
  segmented: dynamic(() => import("../demos/segmented-demo")),
  spotlight: dynamic(() => import("../demos/spotlight-demo")),
  "status-dot": dynamic(() => import("../demos/status-dot-demo")),
  stepper: dynamic(() => import("../demos/stepper-demo")),
  "tag-input": dynamic(() => import("../demos/tag-input-demo")),
  checkbox: dynamic(() => import("../demos/checkbox-demo")),
  "dropdown-menu": dynamic(() => import("../demos/dropdown-menu-demo")),
  "empty-state": dynamic(() => import("../demos/empty-state-demo")),
  "filter-bar": dynamic(() => import("../demos/filter-bar-demo")),
  "stat-card": dynamic(() => import("../demos/stat-card-demo")),
}

const AI_DEMOS: Record<string, React.ComponentType> = {
  attachments: dynamic(() => import("../demos/ai-attachments-demo")),
  "chain-of-thought": dynamic(() => import("../demos/ai-chain-of-thought-demo")),
  checkpoint: dynamic(() => import("../demos/ai-checkpoint-demo")),
  confirmation: dynamic(() => import("../demos/ai-confirmation-demo")),
  context: dynamic(() => import("../demos/ai-context-demo")),
  conversation: dynamic(() => import("../demos/ai-conversation-demo")),
  "inline-citation": dynamic(() => import("../demos/ai-inline-citation-demo")),
  message: dynamic(() => import("../demos/ai-message-demo")),
  "model-selector": dynamic(() => import("../demos/ai-model-selector-demo")),
  plan: dynamic(() => import("../demos/ai-plan-demo")),
  queue: dynamic(() => import("../demos/ai-queue-demo")),
  reasoning: dynamic(() => import("../demos/ai-reasoning-demo")),
  shimmer: dynamic(() => import("../demos/ai-shimmer-demo")),
  sources: dynamic(() => import("../demos/ai-sources-demo")),
  suggestion: dynamic(() => import("../demos/ai-suggestion-demo")),
  task: dynamic(() => import("../demos/ai-task-demo")),
  tool: dynamic(() => import("../demos/ai-tool-demo")),
  agent: dynamic(() => import("../demos/ai-agent-demo")),
  commit: dynamic(() => import("../demos/ai-commit-demo")),
  "environment-variables": dynamic(() => import("../demos/ai-environment-variables-demo")),
  "jsx-preview": dynamic(() => import("../demos/ai-jsx-preview-demo")),
  "package-info": dynamic(() => import("../demos/ai-package-info-demo")),
  sandbox: dynamic(() => import("../demos/ai-sandbox-demo")),
  "schema-display": dynamic(() => import("../demos/ai-schema-display-demo")),
  snippet: dynamic(() => import("../demos/ai-snippet-demo")),
  "stack-trace": dynamic(() => import("../demos/ai-stack-trace-demo")),
  "test-results": dynamic(() => import("../demos/ai-test-results-demo")),
  "audio-player": dynamic(() => import("../demos/ai-audio-player-demo")),
  "mic-selector": dynamic(() => import("../demos/ai-mic-selector-demo")),
  persona: dynamic(() => import("../demos/ai-persona-demo")),
  "speech-input": dynamic(() => import("../demos/ai-speech-input-demo")),
  transcription: dynamic(() => import("../demos/ai-transcription-demo")),
  "voice-selector": dynamic(() => import("../demos/ai-voice-selector-demo")),
  canvas: dynamic(() => import("../demos/ai-canvas-demo")),
  connection: dynamic(() => import("../demos/ai-connection-demo")),
  controls: dynamic(() => import("../demos/ai-controls-demo")),
  edge: dynamic(() => import("../demos/ai-edge-demo")),
  node: dynamic(() => import("../demos/ai-node-demo")),
  panel: dynamic(() => import("../demos/ai-panel-demo")),
  image: dynamic(() => import("../demos/ai-image-demo")),
  "open-in-chat": dynamic(() => import("../demos/ai-open-in-chat-demo")),
  action: dynamic(() => import("../demos/ai-action-demo")),
  actions: dynamic(() => import("../demos/ai-actions-demo")),
  "ai-image-grid": dynamic(() => import("../demos/ai-ai-image-grid-demo")),
  branch: dynamic(() => import("../demos/ai-branch-demo")),
  loader: dynamic(() => import("../demos/ai-loader-demo")),
  "message-avatar": dynamic(() => import("../demos/ai-message-avatar-demo")),
  "message-content": dynamic(() => import("../demos/ai-message-content-demo")),
  response: dynamic(() => import("../demos/ai-response-demo")),
  source: dynamic(() => import("../demos/ai-source-demo")),
  "web-preview": dynamic(() => import("../demos/ai-web-preview-demo")),
}

const AI_CANONICAL_DEMOS: Record<string, React.ComponentType> = Object.fromEntries(
  Object.entries(AI_DEMOS).map(([slug, Demo]) => [`ai-${slug}`, Demo])
)

const DEMOS: Record<string, React.ComponentType> = {
  ...COMPONENT_DEMOS,
  ...AI_DEMOS,
  ...AI_CANONICAL_DEMOS,
  // Alias slugs (tokens, button, badge, …) are in SECTION_REDIRECTS and
  // redirect to their canonical slug — they don't need a static render here.
  colors:      dynamic(() => import("../demos/colors-demo")),
  type:        dynamic(() => import("../demos/type-demo")),
  spacing:     dynamic(() => import("../demos/spacing-demo")),
  brand:       dynamic(() => import("../demos/brand-demo")),
  buttons:     dynamic(() => import("../demos/buttons-demo")),
  "button-group": dynamic(() => import("../demos/button-group-demo")),
  badges:      dynamic(() => import("../demos/badges-demo")),
  switch:      dynamic(() => import("../demos/switch-demo")),
  avatar:      dynamic(() => import("../demos/avatar-demo")),
  progress:    dynamic(() => import("../demos/progress-demo")),
  spinner:     dynamic(() => import("../demos/spinner-demo")),
  separator:   dynamic(() => import("../demos/separator-demo")),
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
  marketplace: dynamic(() => import("../demos/marketplace-demo")),
  "new-components": dynamic(() => import("../demos/new-components-demo")),
  modals:      dynamic(() => import("../demos/modals-demo")),
  accordion:   dynamic(() => import("../demos/accordion-demo")),
  dropdowns:   dynamic(() => import("../demos/dropdowns-demo")),
  "context-menu": dynamic(() => import("../demos/context-menu-demo")),
  "prompt-input": dynamic(() => import("../demos/prompt-input-demo")),
  "ai-elements":   dynamic(() => import("../demos/ai-elements-demo")),
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
  "code-workspace": dynamic(() => import("../demos/code-workspace-demo")),
  "web-preview":  dynamic(() => import("../demos/web-preview-demo")),
  "share-dialog": dynamic(() => import("../demos/share-dialog-demo")),
  login:          dynamic(() => import("../demos/login-demo")),
  oauth:          dynamic(() => import("../demos/oauth-demo")),
  "error-pages":  dynamic(() => import("../demos/error-pages-demo")),
  lightmode:      dynamic(() => import("../demos/lightmode-demo")),
}

export function generateStaticParams() {
  // Build-time assertion: every DEMOS key that is not a redirect alias must
  // resolve to registry meta, otherwise the rendered page silently renders
  // without an install strip and there is no warning anywhere near the cause.
  //
  // Redirect keys (SECTION_REDIRECTS) are intentional aliases that never render
  // a full page — they are exempt. All other keys must be in the registry.
  const unmapped: string[] = []
  for (const slug of Object.keys(DEMOS)) {
    if (slug in SECTION_REDIRECTS) continue
    if (getRegistryMeta(slug) === null) unmapped.push(slug)
  }
  if (unmapped.length > 0) {
    const msg =
      `[aurora/gallery] ${unmapped.length} DEMOS slug(s) have no registry meta — ` +
      `these pages will render without an install strip:\n` +
      unmapped.map((s) => `  • ${s}`).join("\n") +
      `\nAdd each to lib/slug-map.ts or registry.json to fix.`
    if (process.env.NODE_ENV === "production") {
      // Fail the build so the issue is caught before deployment.
      throw new Error(msg)
    } else {
      console.warn(msg)
    }
  }

  return Object.keys(DEMOS).map((section) => ({ section }))
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const redirectTarget = SECTION_REDIRECTS[section]
  if (redirectTarget) redirect(`/gallery/${redirectTarget}`)

  const Demo = DEMOS[section]
  if (!Demo) notFound()

  const meta = getRegistryMeta(section)
  const title = formatSectionTitle(section)

  return (
    <div className="aurora-gallery-page grid gap-8">
      <style>{`
        .aurora-gallery-page {
          min-width: 0;
        }
        .aurora-gallery-page > * {
          min-width: 0;
        }
        .aurora-gallery-demo-region {
          display: grid;
          justify-items: start;
          width: 100%;
          max-width: min(100%, 1120px);
          min-width: 0;
        }
        .aurora-gallery-demo-region > * {
          max-width: 100%;
          min-width: 0;
        }
        .aurora-gallery-install-region {
          width: 100%;
          max-width: min(760px, 100%);
          min-width: 0;
        }
        .aurora-gallery-install-region > * {
          max-width: 100%;
          min-width: 0;
        }
      `}</style>
      <header className="grid gap-4" style={{ width: "min(760px, 100%)", minWidth: 0 }}>
        <div>
          <p
            className="aurora-text-eyebrow"
            style={{ margin: "0 0 6px", color: "var(--aurora-text-muted)" }}
          >
            Components
          </p>
          <h1
            className="aurora-text-display-2"
            style={{ margin: 0, color: "var(--aurora-text-primary)", textWrap: "balance" }}
          >
            {title}
          </h1>
        </div>
      </header>
      <section className="aurora-gallery-demo-region" data-section={section}>
        <Demo />
      </section>
      {meta && (
        // ComponentInstall is a client component (clipboard support requires browser APIs).
        // The install strip adds minimal JS — clipboard handling only activates on user interaction.
        <section className="aurora-gallery-install-region" aria-label={`${title} install`}>
          <ComponentInstall meta={meta} />
        </section>
      )}
    </div>
  )
}
