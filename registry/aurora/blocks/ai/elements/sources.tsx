"use client"

import * as React from "react"
import { ChevronDown, ExternalLink, FileText, Globe } from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Types (architecture source of truth — keep the existing registry API)
// ---------------------------------------------------------------------------

export interface SourcesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  /** Render the count badge + chevron and allow the body to collapse. */
  collapsible?: boolean
  /** Control the collapsed state (uncontrolled defaults to expanded). */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface SourceItem {
  title: string
  href?: string
  description?: string
  badge?: string
}

export interface SourceProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  source: SourceItem
  /** Ordinal rendered in the numbered badge. */
  index?: number
}

// ---------------------------------------------------------------------------
// Shared surface helpers (ported from CD injected CSS)
// ---------------------------------------------------------------------------

function panelStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--aurora-surface-raised)",
    border: "1px solid var(--aurora-border-strong)",
    borderRadius: "var(--aurora-radius-1)",
    boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
    ...style,
  }
}

function hostname(href?: string): string | null {
  if (!href) return null
  try {
    return new URL(href).hostname.replace(/^www\./, "")
  } catch {
    return href.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || null
  }
}

// ---------------------------------------------------------------------------
// Count badge — small neutral pill next to the title
// ---------------------------------------------------------------------------

function CountBadge({ count }: { count: number }) {
  return (
    <Badge
      tone="neutral"
      fill="outline"
      className="min-w-[22px] justify-center px-1.5 tabular-nums"
    >
      {count}
    </Badge>
  )
}

// ---------------------------------------------------------------------------
// Sources — bordered panel with file icon, title, count badge, collapsible body
// ---------------------------------------------------------------------------

const Sources = React.forwardRef<HTMLDivElement, SourcesProps>(
  (
    {
      className,
      title = "Sources",
      collapsible = false,
      open: openProp,
      defaultOpen = true,
      onOpenChange,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = openProp !== undefined
    const [openState, setOpenState] = React.useState(defaultOpen)
    const open = isControlled ? openProp : openState

    const count = React.Children.toArray(children).filter(React.isValidElement).length

    const toggle = React.useCallback(() => {
      const next = !open
      if (!isControlled) setOpenState(next)
      onOpenChange?.(next)
    }, [open, isControlled, onOpenChange])

    const headerInner = (
      <>
        <FileText className="size-[18px] shrink-0" aria-hidden style={{ color: "var(--aurora-accent-pink)" }} />
        <span
          className="aurora-text-label"
          style={{ color: "var(--aurora-text-primary)", fontSize: 16, fontWeight: 700 }}
        >
          {title}
        </span>
        {collapsible ? <CountBadge count={count} /> : null}
        {collapsible ? (
          <ChevronDown
            className="ml-auto size-[18px] shrink-0 transition-transform"
            aria-hidden
            style={{
              color: "var(--aurora-text-muted)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        ) : null}
      </>
    )

    return (
      <div
        ref={ref}
        className={["grid gap-3 p-4", className].filter(Boolean).join(" ")}
        style={panelStyle(style)}
        {...props}
      >
        {collapsible ? (
          <Button
            type="button"
            variant="plain"
            size="unstyled"
            onClick={toggle}
            aria-expanded={open}
            className="flex items-center gap-2.5 bg-transparent p-0 text-left outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0"
            style={{ borderRadius: "var(--aurora-radius-1)", cursor: "pointer", color: "inherit" }}
          >
            {headerInner}
          </Button>
        ) : (
          <div className="flex items-center gap-2.5">{headerInner}</div>
        )}
        {!collapsible || open ? <div className="grid gap-2.5">{children}</div> : null}
      </div>
    )
  }
)
Sources.displayName = "Sources"

// ---------------------------------------------------------------------------
// Source — numbered row card with title, optional DOCS chip, host, arrow
// ---------------------------------------------------------------------------

const Source = React.forwardRef<HTMLAnchorElement, SourceProps>(
  ({ className, source, index, style, target, rel, tabIndex, ...props }, ref) => {
    const host = hostname(source.href)
    const isLinked = Boolean(source.href)
    return (
      <a
        ref={ref}
        href={source.href}
        target={target ?? (isLinked ? "_blank" : undefined)}
        rel={rel ?? (isLinked ? "noreferrer noopener" : undefined)}
        tabIndex={tabIndex ?? (isLinked ? undefined : -1)}
        aria-disabled={isLinked ? undefined : true}
        aria-label={host ? `${source.title}, ${host}` : source.title}
        className={[
          "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 p-3.5 no-underline",
          "transition-[background,border-color,box-shadow,transform] duration-150 ease-out",
          "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0",
          isLinked
            ? "hover:-translate-y-px hover:border-[color:var(--aurora-border-strong)] hover:bg-[var(--aurora-hover-bg)]"
            : undefined,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          background: "var(--aurora-control-surface)",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "calc(var(--aurora-radius-1) - 4px)",
          color: "var(--aurora-text-primary)",
          boxShadow: "var(--aurora-highlight-medium)",
          ...style,
        }}
        {...props}
      >
        {index != null ? (
          <span
            className="inline-flex size-7 shrink-0 items-center justify-center aurora-text-control"
            aria-hidden
            style={{
              borderRadius: "calc(var(--aurora-radius-1) - 6px)",
              background: "var(--aurora-accent-pink-surface)",
              border: "1px solid var(--aurora-accent-pink-border)",
              color: "var(--aurora-accent-pink-strong)",
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {index}
          </span>
        ) : (
          <span className="shrink-0" aria-hidden style={{ width: 0 }} />
        )}

        <span className="grid min-w-0 gap-1.5">
          <span className="flex min-w-0 items-center gap-2">
            <span
              className="truncate aurora-text-control"
              style={{ color: "var(--aurora-text-primary)", fontSize: 16, fontWeight: 700 }}
            >
              {source.title}
            </span>
            {source.badge ? (
              <Badge tone="neutral" fill="outline" className="shrink-0">
                {source.badge}
              </Badge>
            ) : null}
          </span>
          {host ? (
            <span
              className="flex min-w-0 items-center gap-1.5 aurora-text-meta"
              style={{ color: "var(--aurora-text-muted)" }}
            >
              <Globe className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{host}</span>
            </span>
          ) : null}
          {source.description ? <span className="aurora-text-meta">{source.description}</span> : null}
        </span>

        {isLinked ? (
          <ExternalLink
            className="size-[18px] shrink-0 self-center text-[var(--aurora-text-muted)] transition-colors group-hover:text-[var(--aurora-accent-primary)]"
            aria-hidden
          />
        ) : (
          <span aria-hidden className="size-[18px] shrink-0" />
        )}
      </a>
    )
  }
)
Source.displayName = "Source"

export { Source, Sources }
