"use client"

/**
 * Aurora Design System — Pagination
 * No additional peer deps required.
 */

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Pagination root ──────────────────────────────────────────────────────────

function Pagination({ ref, className, ...props }: React.ComponentProps<"nav"> & { ref?: React.Ref<HTMLElement> }) {
  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn("flex w-full max-w-full items-center justify-center overflow-x-auto", className)}
      {...props}
    />
  )
}

// ─── PaginationContent ────────────────────────────────────────────────────────

function PaginationContent({ ref, className, ...props }: React.ComponentProps<"ul"> & { ref?: React.Ref<HTMLUListElement> }) {
  return (
    <ul
      ref={ref}
      className={cn("flex min-w-max items-center gap-1", className)}
      {...props}
    />
  )
}

// ─── PaginationItem ───────────────────────────────────────────────────────────

function PaginationItem({ ref, className, ...props }: React.ComponentProps<"li"> & { ref?: React.Ref<HTMLLIElement> }) {
  return <li ref={ref} className={cn("", className)} {...props} />
}

// ─── PaginationLink ───────────────────────────────────────────────────────────

export interface PaginationLinkProps
  extends React.ComponentPropsWithoutRef<"a"> {
  isActive?: boolean
  size?: "default" | "sm" | "lg"
}

function PaginationLink({ ref, className, isActive, size = "default", style, ...props }: PaginationLinkProps & { ref?: React.Ref<HTMLAnchorElement> }) {
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
          "border transition-all duration-150",
          "select-none cursor-pointer",
          "hover:border-[var(--aurora-border-strong)] hover:text-[var(--aurora-text-primary)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "[&:focus-visible]:ring-[var(--aurora-focus-ring)]",
          size === "sm" && "h-7 min-w-7 px-2",
          size === "default" && "h-8 min-w-8 px-2.5",
          size === "lg" && "h-10 min-w-10 px-3",
          className
        )}
        style={{
          fontFamily: "var(--aurora-font-sans)",
          fontSize: size === "lg" ? "var(--aurora-type-body)" : size === "sm" ? "var(--aurora-type-label)" : "var(--aurora-type-control)",
          fontWeight: isActive ? "var(--aurora-weight-label)" : "var(--aurora-weight-ui)",
          letterSpacing: "var(--aurora-letter-ui)",
          lineHeight: "var(--aurora-line-dense)",
          ...activeStyle,
          ...style,
        }}
        {...props}
      />
    )
}

// ─── PaginationPrevious ───────────────────────────────────────────────────────

function PaginationPrevious({ ref, className, children, ...props }: React.ComponentProps<typeof PaginationLink> & { ref?: React.Ref<HTMLAnchorElement> }) {
  return (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      className={cn("gap-1 pl-2.5 pr-3", className)}
      {...props}
    >
      <ChevronLeft className="size-4" aria-hidden />
      <span>{children ?? "Previous"}</span>
    </PaginationLink>
  )
}

// ─── PaginationNext ───────────────────────────────────────────────────────────

function PaginationNext({ ref, className, children, ...props }: React.ComponentProps<typeof PaginationLink> & { ref?: React.Ref<HTMLAnchorElement> }) {
  return (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      className={cn("gap-1 pl-3 pr-2.5", className)}
      {...props}
    >
      <span>{children ?? "Next"}</span>
      <ChevronRight className="size-4" aria-hidden />
    </PaginationLink>
  )
}

// ─── PaginationEllipsis ───────────────────────────────────────────────────────

function PaginationEllipsis({ ref, className, ...props }: React.ComponentProps<"span"> & { ref?: React.Ref<HTMLSpanElement> }) {
  return (
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
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
