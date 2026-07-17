"use client"

/**
 * Aurora Design System — Context Menu
 * peer dep: @radix-ui/react-context-menu
 */

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "@/registry/aurora/lib/portal-container"

// ─── Shared menu styles (mirror dropdown-menu) ────────────────────────────────

const menuContentStyle: React.CSSProperties = {
  backgroundColor: "var(--aurora-panel-strong)",
  borderColor: "var(--aurora-border-strong)",
  boxShadow:
    "var(--aurora-shadow-strong), var(--aurora-highlight-medium)",
  color: "var(--aurora-text-primary)",
}

const menuItemBase = [
  "relative flex cursor-pointer select-none items-center gap-2",
  "rounded-[6px] px-2 py-2 outline-none",
  "transition-colors duration-100",
].join(" ")

const menuTextStyle: React.CSSProperties = {
  fontFamily: "var(--aurora-font-sans)",
  fontSize: "var(--aurora-type-control)",
  fontWeight: "var(--aurora-weight-ui)",
  letterSpacing: "var(--aurora-letter-ui)",
  lineHeight: "var(--aurora-line-dense)",
}

// ─── Root primitives ──────────────────────────────────────────────────────────

// Inside a scoped preview container, force non-modal so an auto-open menu
// preview never scroll-locks / focus-traps the surrounding page (mirrors Drawer).
function ContextMenu({ ...rootProps }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  const portalContainer = usePortalContainer()
  return <ContextMenuPrimitive.Root {...rootProps} modal={portalContainer ? false : rootProps.modal} />
}
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

// ─── Content ──────────────────────────────────────────────────────────────────

function ContextMenuContent({ ref, className, style, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  const portalContainer = usePortalContainer()
  return (
    <ContextMenuPrimitive.Portal container={portalContainer ?? undefined}>
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
  )
}

// ─── Sub trigger ─────────────────────────────────────────────────────────────

function ContextMenuSubTrigger({ ref, className, inset, children, style, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        menuItemBase,
        "outline-none",
        "data-[state=open]:bg-[var(--aurora-hover-bg)] data-[highlighted]:bg-[var(--aurora-hover-bg)]",
        inset && "pl-8",
        className
      )}
      style={{ ...menuTextStyle, color: "var(--aurora-text-primary)", ...style }}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 opacity-60" aria-hidden />
    </ContextMenuPrimitive.SubTrigger>
  )
}

// ─── Sub content ─────────────────────────────────────────────────────────────

function ContextMenuSubContent({ ref, className, style, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
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
  )
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

export interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> {
  inset?: boolean
  /** Renders the item in the error/danger color */
  danger?: boolean
}

function ContextMenuItem({ ref, className, inset, danger, style, ...props }: ContextMenuItemProps & { ref?: React.Ref<React.ComponentRef<typeof ContextMenuPrimitive.Item>> }) {
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(
        menuItemBase,
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "outline-none",
        danger
          ? "hover:bg-[color-mix(in_srgb,var(--aurora-error)_10%,transparent)] data-[highlighted]:bg-[color-mix(in_srgb,var(--aurora-error)_10%,transparent)]"
          : "hover:bg-[var(--aurora-hover-bg)] data-[highlighted]:bg-[var(--aurora-hover-bg)]",
        inset && "pl-8",
        className
      )}
      style={{
        ...menuTextStyle,
        color: danger ? "var(--aurora-error)" : "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    />
  )
}

// ─── CheckboxItem ─────────────────────────────────────────────────────────────

function ContextMenuCheckboxItem({ ref, className, children, checked, style, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        menuItemBase,
        "pl-8",
        "outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "hover:bg-[var(--aurora-hover-bg)] data-[highlighted]:bg-[var(--aurora-hover-bg)]",
        "data-[state=checked]:font-semibold",
        className
      )}
      style={{
        ...menuTextStyle,
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
  )
}

// ─── RadioItem ────────────────────────────────────────────────────────────────

function ContextMenuRadioItem({ ref, className, children, style, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        menuItemBase,
        "pl-8",
        "outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "hover:bg-[var(--aurora-hover-bg)] data-[highlighted]:bg-[var(--aurora-hover-bg)]",
        "data-[state=checked]:font-semibold",
        className
      )}
      style={{ ...menuTextStyle, color: "var(--aurora-text-primary)", ...style }}
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
  )
}

// ─── Label ────────────────────────────────────────────────────────────────────

function ContextMenuLabel({ ref, className, inset, style, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5",
        inset && "pl-8",
        className
      )}
      style={{
        color: "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-label)",
        fontWeight: "var(--aurora-weight-label)",
        letterSpacing: "var(--aurora-letter-label)",
        lineHeight: "var(--aurora-line-dense)",
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

function ContextMenuSeparator({ ref, className, style, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px", className)}
      style={{ backgroundColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
}

// ─── Shortcut ─────────────────────────────────────────────────────────────────

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto opacity-70", className)}
    style={{
      color: "var(--aurora-text-muted)",
      fontFamily: "var(--aurora-font-mono)",
      fontSize: "var(--aurora-type-caption)",
      letterSpacing: 0,
    }}
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
