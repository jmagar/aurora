"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ *
 * Aurora · Controls (AI element)
 *
 * A toolbar cluster — a raised, rounded panel holding icon ControlButtons
 * with an optional active (cyan ring + tint) state, separated by hairline
 * ControlsDividers. Lays out horizontally by default; orientation="vertical"
 * stacks the cluster and rotates the dividers.
 *
 * Architecture (forwardRef, displayName, compound parts, HTMLAttributes
 * passthrough, full a11y on the button) is kept from the Aurora registry.
 * Prefer Lucide icon components for `icon`; legacy path strings are accepted
 * only for existing registry consumers.
 * ------------------------------------------------------------------ */

type ControlsOrientation = "horizontal" | "vertical"
type ControlIcon = LucideIcon | React.ReactElement<React.SVGProps<SVGSVGElement>> | string

const OrientationContext = React.createContext<ControlsOrientation>("horizontal")

export interface ControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ControlsOrientation
}

export interface ControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Lucide icon component or element. Legacy inner SVG path markup is still
   * accepted for compatibility. Mutually optional with `children`
   * (text-labelled buttons like "Fit").
   */
  icon?: ControlIcon
  /** Active / selected state — cyan ring, tint fill and accent glyph. */
  active?: boolean
}

const Controls = React.forwardRef<HTMLDivElement, ControlsProps>(
  ({ orientation = "horizontal", className, style, children, ...props }, ref) => {
    const vertical = orientation === "vertical"
    return (
      <OrientationContext.Provider value={orientation}>
        <div
          ref={ref}
          className={cn("aurora-controls", className)}
          data-orientation={orientation}
          style={{
            display: "inline-flex",
            flexDirection: vertical ? "column" : "row",
            alignItems: "center",
            gap: 4,
            boxSizing: "border-box",
            padding: 6,
            background: "var(--aurora-surface-raised)",
            border: "1px solid var(--aurora-border-strong)",
            borderRadius: "var(--aurora-radius-1)",
            boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </OrientationContext.Provider>
    )
  }
)
Controls.displayName = "Controls"

const ControlButton = React.forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ icon, active = false, className, style, children, type, ...props }, ref) => {
    const hasText = children != null && children !== false
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        aria-pressed={active || undefined}
        data-active={active || undefined}
        className={cn("aurora-control-button", className)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: hasText ? 7 : 0,
          boxSizing: "border-box",
          height: 36,
          minWidth: 36,
          padding: hasText ? "0 12px" : 0,
          fontFamily: "var(--aurora-font-sans)",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1,
          cursor: "pointer",
          borderRadius: 9,
          border: active
            ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 70%, transparent)"
            : "1px solid transparent",
          background: active ? "var(--aurora-selected-bg)" : "transparent",
          color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
          boxShadow: active
            ? "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent), 0 0 12px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent)"
            : "none",
          transition: "background var(--aurora-motion-fast, 150ms) ease, color var(--aurora-motion-fast, 150ms) ease, box-shadow var(--aurora-motion-fast, 150ms) ease, border-color var(--aurora-motion-fast, 150ms) ease",
          ...style,
        }}
        {...props}
      >
        {renderControlIcon(icon)}
        {hasText ? (
          <span style={{ color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)" }}>{children}</span>
        ) : null}
      </button>
    )
  }
)
ControlButton.displayName = "ControlButton"

const ControlsDivider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    const orientation = React.useContext(OrientationContext)
    const vertical = orientation === "vertical"
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={vertical ? "horizontal" : "vertical"}
        className={cn("aurora-controls-divider", className)}
        style={
          vertical
            ? { width: 22, height: 1, margin: "2px 0", background: "var(--aurora-border-default)", flexShrink: 0, ...style }
            : { width: 1, height: 22, margin: "0 2px", background: "var(--aurora-border-default)", flexShrink: 0, ...style }
        }
        {...props}
      />
    )
  }
)
ControlsDivider.displayName = "ControlsDivider"

function renderControlIcon(icon: ControlIcon | undefined): React.ReactNode {
  if (!icon) return null

  if (typeof icon === "string") {
    return (
      <svg
        aria-hidden
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.65}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    )
  }

  if (React.isValidElement<React.SVGProps<SVGSVGElement>>(icon)) {
    return React.cloneElement(icon, {
      "aria-hidden": true,
      width: 18,
      height: 18,
      strokeWidth: 1.65,
      focusable: "false",
      style: { flexShrink: 0, ...icon.props.style },
    })
  }

  const Icon = icon
  return (
    <Icon
      aria-hidden
      width={18}
      height={18}
      strokeWidth={1.65}
      focusable="false"
      style={{ flexShrink: 0 }}
    />
  )
}

export { Controls, ControlButton, ControlsDivider }
