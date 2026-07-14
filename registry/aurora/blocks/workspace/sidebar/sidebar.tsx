"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SidebarItem {
  /** Stable id, used for the active state. */
  id: string
  /** Visible label (also the tooltip when collapsed). */
  label: string
  /** Leading icon node (rendered at 17px in the CD spec). */
  icon?: React.ReactNode
  /**
   * Optional section label. When set, a section heading is rendered above
   * this item and every following item belongs to that section until the
   * next item that declares a new `section`.
   */
  section?: string
  /** Optional trailing badge (count / status pill). */
  badge?: React.ReactNode
  /** Disable the item. */
  disabled?: boolean
}

export interface SidebarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Nav items, in render order. Items carry their own `section`. */
  items: SidebarItem[]
  /** Brand node shown in the header (CD passes a styled <span>Axon</span>). */
  brand?: React.ReactNode
  /** Footer node shown pinned to the bottom of the rail. */
  footer?: React.ReactNode
  /** Active item id (controlled). */
  activeId?: string
  /** Active item id on first render (uncontrolled). */
  defaultActiveId?: string
  /** Fired when an item is selected. */
  onSelect?: (id: string) => void
  /** Collapsed (icon-only) state (controlled). */
  collapsed?: boolean
  /** Collapsed state on first render (uncontrolled). */
  defaultCollapsed?: boolean
  /** Fired when the collapse toggle is used. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Hide the built-in collapse toggle. */
  hideCollapseToggle?: boolean
  /** Accessible label for the nav landmark. */
  "aria-label"?: string
}

// ---------------------------------------------------------------------------
// Collapse chevrons (matches CD's 17px / 1.6 stroke icon weight)
// ---------------------------------------------------------------------------

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  const Icon = collapsed ? ChevronRight : ChevronLeft

  return <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: "12px 14px 5px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "var(--aurora-text-muted)",
        opacity: 0.72,
      }}
    >
      {label}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Nav item
// ---------------------------------------------------------------------------

function NavItem({
  item,
  isActive,
  collapsed,
  onSelect,
}: {
  item: SidebarItem
  isActive: boolean
  collapsed: boolean
  onSelect: () => void
}) {
  const [hovered, setHovered] = React.useState(false)

  const active = isActive && !item.disabled
  const showHover = hovered && !item.disabled

  return (
    <Button
      variant="plain"
      size="unstyled"
      onClick={item.disabled ? undefined : onSelect}
      disabled={item.disabled}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: collapsed ? "0" : "10px",
        width: "calc(100% - 16px)",
        margin: "1px 8px",
        padding: collapsed ? "9px 0" : "8px 11px",
        borderRadius: "10px",
        background: active
          ? "color-mix(in srgb, var(--aurora-accent-primary) 13%, transparent)"
          : showHover
          ? "var(--aurora-hover-bg)"
          : "transparent",
        border: "none",
        color: active
          ? "var(--aurora-accent-primary)"
          : item.disabled
          ? "var(--aurora-disabled-text)"
          : showHover
          ? "var(--aurora-text-primary)"
          : "var(--aurora-text-muted)",
        cursor: item.disabled ? "not-allowed" : "pointer",
        opacity: item.disabled ? 0.6 : 1,
        textAlign: "left",
        justifyContent: collapsed ? "center" : undefined,
        transition: "background 0.13s ease, color 0.13s ease",
      }}
    >
      {/* active accent rail on the left edge */}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: collapsed ? "-8px" : "-8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "3px",
            height: "18px",
            borderRadius: "0 3px 3px 0",
            background: "var(--aurora-accent-primary)",
          }}
        />
      )}

      {item.icon && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "currentColor",
          }}
        >
          {item.icon}
        </span>
      )}

      {!collapsed && (
        <>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: "13px",
              fontWeight: active ? 600 : 500,
              color: "currentColor",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "var(--aurora-font-sans)",
            }}
          >
            {item.label}
          </span>

          {item.badge != null && (
            <span
              style={{
                flexShrink: 0,
                fontSize: "10.5px",
                fontWeight: 600,
                lineHeight: 1,
                padding: "3px 7px",
                borderRadius: "999px",
                color: active
                  ? "var(--aurora-accent-primary)"
                  : "var(--aurora-text-muted)",
                background: active
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent)"
                  : "var(--aurora-control-surface)",
                border: active
                  ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 32%, transparent)"
                  : "1px solid var(--aurora-border-default)",
                fontVariantNumeric: "tabular-nums",
                fontFamily: "var(--aurora-font-sans)",
              }}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Main Sidebar — operator nav rail, collapsible
// ---------------------------------------------------------------------------

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  function Sidebar(
    {
      items,
      brand,
      footer,
      activeId,
      defaultActiveId,
      onSelect,
      collapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      hideCollapseToggle = false,
      "aria-label": ariaLabel = "Sidebar",
      style,
      ...rest
    },
    ref,
  ) {
    const [activeInternal, setActiveInternal] = React.useState(
      defaultActiveId ?? items[0]?.id,
    )
    const activeResolved = activeId ?? activeInternal

    const [collapsedInternal, setCollapsedInternal] =
      React.useState(defaultCollapsed)
    const isCollapsed = collapsed ?? collapsedInternal

    const handleSelect = React.useCallback(
      (id: string) => {
        if (activeId === undefined) setActiveInternal(id)
        onSelect?.(id)
      },
      [activeId, onSelect],
    )

    const toggleCollapsed = React.useCallback(() => {
      const next = !isCollapsed
      if (collapsed === undefined) setCollapsedInternal(next)
      onCollapsedChange?.(next)
    }, [collapsed, isCollapsed, onCollapsedChange])

    const width = isCollapsed ? "60px" : "240px"

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        style={{
          display: "flex",
          flexDirection: "column",
          width,
          minWidth: width,
          height: "100%",
          boxSizing: "border-box",
          background: "var(--aurora-panel-strong)",
          borderRight: "1px solid var(--aurora-border-default)",
          overflow: "hidden",
          transition: "width 0.2s ease-out",
          fontFamily: "var(--aurora-font-sans)",
          ...style,
        }}
        {...rest}
      >
        {/* Header: brand + collapse toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isCollapsed ? "0" : "8px",
            padding: isCollapsed ? "0 0" : "0 14px",
            height: "52px",
            flexShrink: 0,
            borderBottom: "1px solid var(--aurora-border-default)",
            justifyContent: isCollapsed ? "center" : "space-between",
          }}
        >
          {!isCollapsed && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: 0,
                color: "var(--aurora-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {brand}
            </span>
          )}

          {!hideCollapseToggle && (
            <Button
              variant="plain"
              size="unstyled"
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-pressed={isCollapsed}
              title={isCollapsed ? "Expand" : "Collapse"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                flexShrink: 0,
                borderRadius: "9px",
                background: "transparent",
                border: "none",
                color: "var(--aurora-text-muted)",
                cursor: "pointer",
                transition: "background 0.13s ease, color 0.13s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--aurora-hover-bg)"
                e.currentTarget.style.color = "var(--aurora-text-primary)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "var(--aurora-text-muted)"
              }}
            >
              <CollapseIcon collapsed={isCollapsed} />
            </Button>
          )}
        </div>

        {/* Items (scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "6px 0 8px",
          }}
        >
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {item.section && !isCollapsed && (
                <SectionHeading label={item.section} />
              )}
              {item.section && isCollapsed && (
                <div
                  aria-hidden="true"
                  style={{
                    height: "1px",
                    margin: "8px 14px",
                    background: "var(--aurora-border-default)",
                  }}
                />
              )}
              <NavItem
                item={item}
                isActive={item.id === activeResolved}
                collapsed={isCollapsed}
                onSelect={() => handleSelect(item.id)}
              />
            </React.Fragment>
          ))}
        </div>

        {/* Footer (optional) */}
        {footer != null && (
          <div
            style={{
              flexShrink: 0,
              borderTop: "1px solid var(--aurora-border-default)",
              padding: isCollapsed ? "10px 0" : "10px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : undefined,
            }}
          >
            {footer}
          </div>
        )}
      </nav>
    )
  },
)

Sidebar.displayName = "Sidebar"

export default Sidebar
