"use client"

/**
 * Aurora Design System — Dropdown Menu
 * peer dep: @radix-ui/react-dropdown-menu
 */

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "@/registry/aurora/lib/portal-container"

// ─── Shared menu content styles ───────────────────────────────────────────────

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
function DropdownMenu({ ...rootProps }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  const portalContainer = usePortalContainer()
  return <DropdownMenuPrimitive.Root {...rootProps} modal={portalContainer ? false : rootProps.modal} />
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// ─── Content ──────────────────────────────────────────────────────────────────

function DropdownMenuContent({ ref, className, sideOffset = 6, style, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const portalContainer = usePortalContainer()
  return (
    <DropdownMenuPrimitive.Portal container={portalContainer ?? undefined}>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden rounded-[var(--aurora-radius-1)] border p-1",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "duration-150",
          className
        )}
        style={{ ...menuContentStyle, ...style }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

// ─── Sub trigger ─────────────────────────────────────────────────────────────

function DropdownMenuSubTrigger({ ref, className, inset, children, style, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        menuItemBase,
        "data-[state=open]:bg-[var(--aurora-hover-bg)]",
        inset && "pl-8",
        className
      )}
      style={{ ...menuTextStyle, color: "var(--aurora-text-primary)", ...style }}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 opacity-60" aria-hidden />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

// ─── Sub content ─────────────────────────────────────────────────────────────

function DropdownMenuSubContent({ ref, className, style, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-[var(--aurora-radius-1)] border p-1",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "duration-150",
        className
      )}
      style={{ ...menuContentStyle, ...style }}
      {...props}
    />
  )
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  inset?: boolean
  /** Renders the item in the error/danger color */
  danger?: boolean
}

function DropdownMenuItem({ ref, className, inset, danger, style, ...props }: DropdownMenuItemProps & { ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.Item>> }) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        menuItemBase,
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        danger
          ? "hover:bg-[color-mix(in_srgb,var(--aurora-error)_10%,transparent)] data-[highlighted]:bg-[color-mix(in_srgb,var(--aurora-error)_10%,transparent)]"
          : "hover:bg-[var(--aurora-hover-bg)] data-[highlighted]:bg-[var(--aurora-hover-bg)]",
        inset && "pl-8",
        className
      )}
      style={{
        color: danger ? "var(--aurora-error)" : "var(--aurora-text-primary)",
        ...menuTextStyle,
        ...style,
      }}
      {...props}
    />
  )
}

// ─── CheckboxItem ─────────────────────────────────────────────────────────────

function DropdownMenuCheckboxItem({ ref, className, children, checked, style, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        menuItemBase,
        "pl-8",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "hover:bg-[var(--aurora-hover-bg)] data-[highlighted]:bg-[var(--aurora-hover-bg)]",
        "data-[state=checked]:font-semibold",
        className
      )}
      style={{
        color: checked
          ? "var(--aurora-accent-primary)"
          : "var(--aurora-text-primary)",
        ...menuTextStyle,
        ...style,
      }}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-3.5" aria-hidden />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

// ─── RadioItem ────────────────────────────────────────────────────────────────

function DropdownMenuRadioItem({ ref, className, children, style, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        menuItemBase,
        "pl-8",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        "hover:bg-[var(--aurora-hover-bg)] data-[highlighted]:bg-[var(--aurora-hover-bg)]",
        "data-[state=checked]:font-semibold",
        className
      )}
      style={{ ...menuTextStyle, color: "var(--aurora-text-primary)", ...style }}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle
            className="size-2 fill-current"
            style={{ color: "var(--aurora-accent-primary)" }}
            aria-hidden
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

// ─── Label ────────────────────────────────────────────────────────────────────

function DropdownMenuLabel({ ref, className, inset, style, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5",
        inset && "pl-8",
        className
      )}
      style={{
        color: "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "var(--aurora-type-caption)",
        fontWeight: "var(--aurora-weight-label)",
        letterSpacing: "0.08em",
        lineHeight: "var(--aurora-line-dense)",
        textTransform: "uppercase",
        ...style,
      }}
      {...props}
    />
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

function DropdownMenuSeparator({ ref, className, style, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px", className)}
      style={{ backgroundColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
}

// ─── Shortcut ─────────────────────────────────────────────────────────────────

const DropdownMenuShortcut = ({
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
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
