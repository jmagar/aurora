"use client"

/**
 * Aurora Design System — Breadcrumb
 * No additional peer deps required.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, Dot, Ellipsis } from "lucide-react"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

// ─── Variant context ──────────────────────────────────────────────────────────

type BreadcrumbVariant = "default" | "mono" | "pill-trail"

const BreadcrumbVariantContext = React.createContext<BreadcrumbVariant>("default")

// ─── Breadcrumb root ──────────────────────────────────────────────────────────

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  variant?: BreadcrumbVariant
  separator?: React.ReactNode
}

function Breadcrumb({ ref, variant = "default", className, ...props }: BreadcrumbProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <BreadcrumbVariantContext.Provider value={variant}>
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("flex", className)}
        {...props}
      />
    </BreadcrumbVariantContext.Provider>
  )
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

function BreadcrumbList({ ref, className, ...props }: React.ComponentProps<"ol"> & { ref?: React.Ref<HTMLOListElement> }) {
  const variant = React.useContext(BreadcrumbVariantContext)
  return (
    <ol
      ref={ref}
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-1.5 break-words",
        variant === "mono" && "font-mono",
        variant === "pill-trail" && "gap-1.5",
        className
      )}
      style={
        variant === "mono"
          ? { fontFamily: "var(--aurora-font-mono)" }
          : undefined
      }
      {...props}
    />
  )
}

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

function BreadcrumbItem({ ref, className, ...props }: React.ComponentProps<"li"> & { ref?: React.Ref<HTMLLIElement> }) {
  return (
    <li
      ref={ref}
      className={cn("inline-flex min-w-0 items-center gap-1", className)}
      {...props}
    />
  )
}

// ─── BreadcrumbLink ───────────────────────────────────────────────────────────

export interface BreadcrumbLinkProps
  extends React.ComponentProps<"a"> {
  asChild?: boolean
}

function BreadcrumbLink({ ref, asChild, className, style, ...props }: BreadcrumbLinkProps & { ref?: React.Ref<HTMLAnchorElement> }) {
  const variant = React.useContext(BreadcrumbVariantContext)
  const Comp = asChild ? Slot : "a"

  const baseClass = cn(
    "inline-flex min-w-0 items-center gap-1 rounded-[8px] px-2 py-1 transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0",
    variant === "default" && "aurora-text-control",
    variant === "mono" && "aurora-text-code",
    variant === "pill-trail" &&
      "aurora-text-control inline-flex items-center rounded-full border px-3 py-0.5 transition-all",
    className
  )

  const baseStyle: React.CSSProperties =
    variant === "pill-trail"
      ? {
          color: "var(--aurora-text-muted)",
          backgroundColor: "var(--aurora-control-surface)",
          borderColor: "var(--aurora-border-default)",
          ...style,
        }
      : {
          color: "var(--aurora-text-muted)",
          backgroundColor: "transparent",
          ...style,
        }

  return (
    <Comp
      ref={ref}
      className={baseClass}
      style={baseStyle}
      {...props}
    />
  )
}

// ─── BreadcrumbPage (active/current crumb) ────────────────────────────────────

export interface BreadcrumbPageProps
  extends React.ComponentProps<"span"> {
  /** Optionally embed a square-chip badge left of the label */
  badge?: React.ReactNode
}

function BreadcrumbPage({ ref, className, badge, children, style, ...props }: BreadcrumbPageProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const variant = React.useContext(BreadcrumbVariantContext)

  // CD spec: the current/active crumb is a bordered pill chip with a
  // brighter, semibold label — links stay plain muted text with chevrons.
  const baseClass = cn(
    variant === "default" &&
      "inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-[13px] font-semibold",
    variant === "mono" && "aurora-text-code",
    variant === "pill-trail" &&
      "aurora-text-control inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5",
    className
  )

  const baseStyle: React.CSSProperties =
    variant === "pill-trail"
      ? {
          color: "var(--aurora-accent-primary)",
          backgroundColor: "color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent)",
          borderColor: "color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)",
          ...style,
        }
      : variant === "mono"
      ? { color: "var(--aurora-accent-primary)", ...style }
      : {
          color: "var(--aurora-text-primary)",
          backgroundColor: "var(--aurora-control-surface)",
          borderColor: "var(--aurora-border-default)",
          ...style,
        }

  return (
    <span
      ref={ref}
      role="link"
      aria-current="page"
      aria-disabled="true"
      className={cn("inline-flex items-center gap-1.5", baseClass)}
      style={{
        ...baseStyle,
        maxWidth: "100%",
      }}
      {...props}
    >
      {badge && <Badge>{badge}</Badge>}
      {children}
    </span>
  )
}

// ─── BreadcrumbEllipsis (collapsed-trail indicator) ───────────────────────────

function BreadcrumbEllipsis({ ref, className, ...props }: React.ComponentProps<"span"> & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn("inline-flex size-5 items-center justify-center", className)}
      style={{ color: "var(--aurora-text-muted)" }}
      {...props}
    >
      <Ellipsis className="size-4" aria-hidden />
      <span className="sr-only">More</span>
    </span>
  )
}

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────

export interface BreadcrumbSeparatorProps
  extends React.ComponentProps<"li"> {
  /** Override the separator icon/char */
  children?: React.ReactNode
}

function BreadcrumbSeparator({ ref, className, children, ...props }: BreadcrumbSeparatorProps & { ref?: React.Ref<HTMLLIElement> }) {
  const variant = React.useContext(BreadcrumbVariantContext)

  // pill-trail has no visible separator — items are self-contained chips
  if (variant === "pill-trail") return null

  const defaultSep =
    variant === "mono" ? (
      <Dot className="size-3" aria-hidden />
    ) : (
      <ChevronRight className="size-3.5" aria-hidden />
    )

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn("flex items-center", className)}
      style={{ color: "var(--aurora-border-strong)" }}
      {...props}
    >
      {children ?? defaultSep}
    </li>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
