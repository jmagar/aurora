"use client"

/**
 * Aurora Design System — Dialog / Modal
 * peer dep: @radix-ui/react-dialog
 */

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Re-exports ───────────────────────────────────────────────────────────────

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// ─── Overlay / Backdrop ───────────────────────────────────────────────────────

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    style={{ backgroundColor: "rgba(4, 10, 14, 0.72)" }}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// ─── Content ──────────────────────────────────────────────────────────────────

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Hide the default X close button */
  hideClose?: boolean
}

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, hideClose = false, children, style, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-lg",
        "flex flex-col",
        "rounded-[var(--aurora-radius-2)]",
        "border",
        "focus-visible:outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "duration-200",
        className
      )}
      style={{
        backgroundColor: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow:
          "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.055)",
        ...style,
      }}
      {...props}
    >
      {children}
      {!hideClose && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4 z-10",
            "rounded-[8px] p-1",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2",
            "disabled:pointer-events-none",
          )}
          style={{
            color: "var(--aurora-text-muted)",
          }}
          aria-label="Close"
        >
          <X className="size-4" aria-hidden />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// ─── Header ───────────────────────────────────────────────────────────────────

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1.5 px-6 pb-4 pt-6 pr-12 border-b",
      className
    )}
    style={{ borderColor: "var(--aurora-border-default)" }}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

// ─── Body (optional wrapper) ──────────────────────────────────────────────────

const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto px-6 py-5", className)}
    {...props}
  />
))
DialogBody.displayName = "DialogBody"

// ─── Footer ───────────────────────────────────────────────────────────────────

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse gap-2 border-t px-6 pb-6 pt-4",
      "sm:flex-row sm:justify-end",
      className
    )}
    style={{ borderColor: "var(--aurora-border-default)" }}
    {...props}
  />
))
DialogFooter.displayName = "DialogFooter"

// ─── Title ────────────────────────────────────────────────────────────────────

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-tight", className)}
    style={{ color: "var(--aurora-text-primary)", ...style }}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// ─── Description ─────────────────────────────────────────────────────────────

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm leading-relaxed", className)}
    style={{ color: "var(--aurora-text-muted)", ...style }}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
