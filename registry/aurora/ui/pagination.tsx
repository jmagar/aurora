"use client"

/**
 * Aurora Design System — Pagination
 * No additional peer deps required.
 */

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Pagination root ──────────────────────────────────────────────────────────

const Pagination = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="pagination"
    className={cn("flex w-full items-center justify-center", className)}
    {...props}
  />
))
Pagination.displayName = "Pagination"

// ─── PaginationContent ────────────────────────────────────────────────────────

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

// ─── PaginationItem ───────────────────────────────────────────────────────────

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

// ─── PaginationLink ───────────────────────────────────────────────────────────

export interface PaginationLinkProps
  extends React.ComponentPropsWithoutRef<"a"> {
  isActive?: boolean
  size?: "default" | "sm" | "lg"
}

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "default", style, ...props }, ref) => {
    const activeStyle: React.CSSProperties = isActive
      ? {
          color: "var(--aurora-accent-primary)",
          backgroundColor: "var(--aurora-control-surface)",
          borderColor: "var(--aurora-accent-primary)",
          boxShadow: "var(--aurora-active-glow)",
        }
      : {
          color: "var(--aurora-text-muted)",
          backgroundColor: "var(--aurora-control-surface)",
          borderColor: "var(--aurora-border-default)",
        }

    return (
      <a
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--aurora-radius-1)]",
          "border text-sm font-medium transition-all duration-150",
          "select-none cursor-pointer",
          "hover:border-[var(--aurora-border-strong)] hover:text-[var(--aurora-text-primary)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "[&:focus-visible]:ring-[var(--aurora-focus-ring)]",
          size === "sm" && "h-7 min-w-7 px-2 text-xs",
          size === "default" && "h-8 min-w-8 px-2.5",
          size === "lg" && "h-10 min-w-10 px-3 text-base",
          isActive && "font-semibold",
          className
        )}
        style={{ ...activeStyle, ...style }}
        {...props}
      />
    )
  }
)
PaginationLink.displayName = "PaginationLink"

// ─── PaginationPrevious ───────────────────────────────────────────────────────

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink>
>(({ className, children, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    className={cn("gap-1 pl-2.5 pr-3", className)}
    {...props}
  >
    <ChevronLeft className="size-4" aria-hidden />
    <span>{children ?? "Previous"}</span>
  </PaginationLink>
))
PaginationPrevious.displayName = "PaginationPrevious"

// ─── PaginationNext ───────────────────────────────────────────────────────────

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof PaginationLink>
>(({ className, children, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    className={cn("gap-1 pl-3 pr-2.5", className)}
    {...props}
  >
    <span>{children ?? "Next"}</span>
    <ChevronRight className="size-4" aria-hidden />
  </PaginationLink>
))
PaginationNext.displayName = "PaginationNext"

// ─── PaginationEllipsis ───────────────────────────────────────────────────────

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-8 w-8 items-center justify-center",
      className
    )}
    style={{ color: "var(--aurora-text-muted)" }}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
))
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
