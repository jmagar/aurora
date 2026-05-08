"use client"

/**
 * Aurora Design System — Context Menu
 * peer dep: @radix-ui/react-context-menu
 */

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Shared menu styles (mirror dropdown-menu) ────────────────────────────────

const menuContentStyle: React.CSSProperties = {
  backgroundColor: "var(--aurora-panel-strong)",
  borderColor: "var(--aurora-border-strong)",
  boxShadow:
    "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.04)",
  color: "var(--aurora-text-primary)",
}

const menuItemBase = [
  "relative flex cursor-pointer select-none items-center gap-2",
  "rounded-[6px] px-2 py-2 text-sm outline-none",
  "transition-colors duration-100",
].join(" ")

// ─── Root primitives ──────────────────────────────────────────────────────────

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

// ─── Content ──────────────────────────────────────────────────────────────────

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, style, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-[var(--aurora-radius-1)] border p-1",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "duration-150",
        className
      )}
      style={{ ...menuContentStyle, ...style }}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

// ─── Sub trigger ─────────────────────────────────────────────────────────────

const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, style, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      menuItemBase,
      "data-[state=open]:bg-[var(--aurora-hover-bg)]",
      inset && "pl-8",
      className
    )}
    style={{ color: "var(--aurora-text-primary)", ...style }}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto size-4 opacity-60" aria-hidden />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

// ─── Sub content ─────────────────────────────────────────────────────────────

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, style, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-[var(--aurora-radius-1)] border p-1",
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "duration-150",
      className
    )}
    style={{ ...menuContentStyle, ...style }}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

// ─── MenuItem ─────────────────────────────────────────────────────────────────

export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  inset?: boolean
  /** Renders the item in the error/danger color */
  danger?: boolean
}

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, danger, style, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      menuItemBase,
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      danger
        ? "hover:bg-[color-mix(in_srgb,var(--aurora-error)_10%,transparent)] focus:bg-[color-mix(in_srgb,var(--aurora-error)_10%,transparent)]"
        : "hover:bg-[var(--aurora-hover-bg)] focus:bg-[var(--aurora-hover-bg)]",
      inset && "pl-8",
      className
    )}
    style={{
      color: danger ? "var(--aurora-error)" : "var(--aurora-text-primary)",
      ...style,
    }}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

// ─── CheckboxItem ─────────────────────────────────────────────────────────────

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, style, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      menuItemBase,
      "pl-8",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      "hover:bg-[var(--aurora-hover-bg)] focus:bg-[var(--aurora-hover-bg)]",
      "data-[state=checked]:font-semibold",
      className
    )}
    style={{
      color: checked
        ? "var(--aurora-accent-primary)"
        : "var(--aurora-text-primary)",
      ...style,
    }}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="size-3.5" aria-hidden />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

// ─── RadioItem ────────────────────────────────────────────────────────────────

const ContextMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, style, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      menuItemBase,
      "pl-8",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      "hover:bg-[var(--aurora-hover-bg)] focus:bg-[var(--aurora-hover-bg)]",
      "data-[state=checked]:font-semibold",
      className
    )}
    style={{ color: "var(--aurora-text-primary)", ...style }}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle
          className="size-2 fill-current"
          style={{ color: "var(--aurora-accent-primary)" }}
          aria-hidden
        />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

// ─── Label ────────────────────────────────────────────────────────────────────

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, style, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold uppercase tracking-wider",
      inset && "pl-8",
      className
    )}
    style={{ color: "var(--aurora-text-muted)", ...style }}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

// ─── Separator ────────────────────────────────────────────────────────────────

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, style, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px", className)}
    style={{ backgroundColor: "var(--aurora-border-default)", ...style }}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

// ─── Shortcut ─────────────────────────────────────────────────────────────────

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    style={{ color: "var(--aurora-text-muted)" }}
    {...props}
  />
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
