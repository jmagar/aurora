"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface PopoverContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

export function Popover({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function PopoverTrigger({ children, asChild, onClick, ...props }: PopoverTriggerProps) {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("PopoverTrigger must be used within Popover")

  if (asChild && React.isValidElement<React.HTMLAttributes<HTMLElement>>(children)) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        children.props.onClick?.(event)
        ctx.setOpen((value) => !value)
      },
    })
  }

  return (
    <Button variant="plain" size="unstyled"
      type="button"
      aria-expanded={ctx.open}
      onClick={(event) => {
        onClick?.(event)
        ctx.setOpen((value) => !value)
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "start", style, ...props }, ref) => {
    const ctx = React.useContext(PopoverContext)
    if (!ctx?.open) return null

    return (
      <div
        ref={ref}
        role="dialog"
        className={cn("absolute z-50 mt-2 w-72 rounded-[var(--aurora-radius-1)] border p-4", className)}
        style={{
          insetInlineStart: align === "start" ? 0 : undefined,
          insetInlineEnd: align === "end" ? 0 : undefined,
          left: align === "center" ? "50%" : undefined,
          transform: align === "center" ? "translateX(-50%)" : undefined,
          background: "var(--aurora-panel-strong)",
          borderColor: "var(--aurora-border-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-medium)",
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        {...props}
      />
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export function PopoverAnchor({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative inline-block", className)}>{children}</div>
}
