"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

type SheetSide = "left" | "right" | "top" | "bottom"

export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: SheetSide
  hideClose?: boolean
}

const sideClass: Record<SheetSide, string> = {
  left: "left-0 top-0 h-full w-[min(396px,92vw)]",
  right: "right-0 top-0 h-full w-[min(396px,92vw)]",
  top: "left-0 top-0 h-[min(360px,80vh)] w-full",
  bottom: "bottom-0 left-0 h-[min(420px,82vh)] w-full",
}

const SheetContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ className, children, side = "right", style, hideClose = false, ...props }, ref) => (
    <SheetPortal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50" style={{ backgroundColor: "var(--aurora-overlay)" }} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn("fixed z-50 flex flex-col overflow-hidden border focus-visible:outline-none", sideClass[side], className)}
        style={{
          background: "var(--aurora-panel-strong)",
          borderColor: "var(--aurora-border-strong)",
          boxShadow: "0 28px 72px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.05)",
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        {...props}
      >
        {children}
        {!hideClose ? (
          <SheetClose
            className="absolute right-5 top-5 rounded-full border p-1.5 text-[var(--aurora-text-muted)] transition-colors hover:text-[var(--aurora-text-primary)] focus-visible:outline-none focus-visible:ring-2 [&:focus-visible]:ring-[var(--aurora-focus-ring)]"
            style={{
              borderColor: "var(--aurora-border-default)",
              background: "var(--aurora-control-surface)",
            }}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </SheetClose>
        ) : null}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
)
SheetContent.displayName = "SheetContent"

const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("border-b px-6 py-5 pr-16", className)} style={{ borderColor: "var(--aurora-border-default)" }} {...props} />
))
SheetHeader.displayName = "SheetHeader"

const SheetBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-5", className)} {...props} />
))
SheetBody.displayName = "SheetBody"

const SheetFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("border-t px-6 py-4", className)} style={{ borderColor: "var(--aurora-border-default)" }} {...props} />
))
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    style={{ color: "var(--aurora-text-primary)", ...style }}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ style, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    style={{ color: "var(--aurora-text-muted)", ...style }}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription }
