"use client"

/**
 * Aurora Design System — Breadcrumb
 * No additional peer deps required.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, Dot } from "lucide-react"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

// ─── Variant context ──────────────────────────────────────────────────────────

type BreadcrumbVariant = "default" | "mono" | "pill-trail"

const BreadcrumbVariantContext = React.createContext<BreadcrumbVariant>("default")

// ─── Breadcrumb root ──────────────────────────────────────────────────────────

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  variant?: BreadcrumbVariant
  separator?: React.ReactNode
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ variant = "default", className, ...props }, ref) => (
    <BreadcrumbVariantContext.Provider value={variant}>
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn("flex", className)}
        {...props}
      />
    </BreadcrumbVariantContext.Provider>
  )
)
Breadcrumb.displayName = "Breadcrumb"

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => {
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
})
BreadcrumbList.displayName = "BreadcrumbList"

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex min-w-0 items-center gap-1", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

// ─── BreadcrumbLink ───────────────────────────────────────────────────────────

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, style, ...props }, ref) => {
    const variant = React.useContext(BreadcrumbVariantContext)
    const Comp = asChild ? Slot : "a"

    const baseClass = cn(
      "inline-flex min-w-0 items-center gap-1 rounded-[8px] px-2 py-1 transition-colors duration-150 focus-visible:outline-none",
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
        style={{
          ...baseStyle,
          boxShadow: "none",
        }}
        onFocus={(event: React.FocusEvent<HTMLAnchorElement>) => {
          event.currentTarget.dataset.previousBoxShadow = event.currentTarget.style.boxShadow
          event.currentTarget.style.boxShadow =
            "0 0 0 2px color-mix(in srgb, var(--aurora-accent-primary) 24%, transparent)"
          props.onFocus?.(event)
        }}
        onBlur={(event: React.FocusEvent<HTMLAnchorElement>) => {
          event.currentTarget.style.boxShadow = event.currentTarget.dataset.previousBoxShadow ?? ""
          props.onBlur?.(event)
        }}
        {...props}
      />
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

// ─── BreadcrumbPage (active/current crumb) ────────────────────────────────────

export interface BreadcrumbPageProps
  extends React.ComponentPropsWithoutRef<"span"> {
  /** Optionally embed a square-chip badge left of the label */
  badge?: React.ReactNode
}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, badge, children, style, ...props }, ref) => {
    const variant = React.useContext(BreadcrumbVariantContext)

    const baseClass = cn(
      variant === "default" && "aurora-text-control",
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
        : { color: "var(--aurora-text-primary)", ...style }

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
)
BreadcrumbPage.displayName = "BreadcrumbPage"

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────

export interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithoutRef<"li"> {
  /** Override the separator icon/char */
  children?: React.ReactNode
}

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, children, ...props }, ref) => {
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
})
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
