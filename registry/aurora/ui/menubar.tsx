"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export type MenubarProps = React.ComponentProps<typeof MenubarPrimitive.Root>
export type MenubarTriggerProps = React.ComponentProps<typeof MenubarPrimitive.Trigger>

function Menubar({
  className,
  style,
  ...props
}: MenubarProps) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex items-center gap-1 rounded-[var(--aurora-radius-2)] border p-1.5",
        className
      )}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-default)",
        boxShadow: "var(--aurora-highlight-medium)",
        ...style,
      }}
      {...props}
    />
  )
}

const MenubarMenu = MenubarPrimitive.Menu
const MenubarGroup = MenubarPrimitive.Group
const MenubarPortal = MenubarPrimitive.Portal
const MenubarRadioGroup = MenubarPrimitive.RadioGroup
const MenubarSub = MenubarPrimitive.Sub

function MenubarTrigger({
  className,
  style,
  ...props
}: MenubarTriggerProps) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-[8px] px-3 py-1.5 aurora-text-control outline-none transition-[background-color,border-color,box-shadow,color] duration-150",
        "focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0",
        "data-[state=open]:shadow-[var(--aurora-active-glow)]",
        className
      )}
      style={{
        color: "var(--aurora-text-primary)",
        background: "transparent",
        ...style,
      }}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--aurora-radius-2)] border p-1 outline-none",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        style={{
          background: "var(--aurora-panel-strong)",
          borderColor: "var(--aurora-border-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[6px] px-2 py-2 aurora-text-control outline-none select-none transition-colors duration-100",
        "focus:bg-[var(--aurora-hover-bg)] focus:text-[var(--aurora-text-primary)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[inset]:pl-8",
        "data-[variant=destructive]:text-[var(--aurora-error)] data-[variant=destructive]:focus:bg-[color-mix(in_srgb,var(--aurora-error)_10%,transparent)] data-[variant=destructive]:focus:text-[var(--aurora-error)]",
        className
      )}
      style={style}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[6px] py-2 pr-2 pl-8 aurora-text-control outline-none select-none transition-colors duration-100",
        "focus:bg-[var(--aurora-hover-bg)] focus:text-[var(--aurora-text-primary)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Check className="size-4" aria-hidden />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-[6px] py-2 pr-2 pl-8 aurora-text-control outline-none select-none transition-colors duration-100",
        "focus:bg-[var(--aurora-hover-bg)] focus:text-[var(--aurora-text-primary)]",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current text-[var(--aurora-accent-primary)]" aria-hidden />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn("px-2 py-1.5 data-[inset]:pl-8", className)}
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

function MenubarSeparator({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px", className)}
      style={{ backgroundColor: "var(--aurora-border-default)", ...style }}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  style,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn("ml-auto", className)}
      style={{
        color: "var(--aurora-text-muted)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: "var(--aurora-type-caption)",
        letterSpacing: 0,
        ...style,
      }}
      {...props}
    />
  )
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-[6px] px-2 py-2 aurora-text-control outline-none select-none transition-colors duration-100",
        "focus:bg-[var(--aurora-hover-bg)] focus:text-[var(--aurora-text-primary)] data-[inset]:pl-8 data-[state=open]:bg-[var(--aurora-hover-bg)]",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 text-[var(--aurora-text-muted)]" aria-hidden />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-[var(--aurora-radius-2)] border p-1 outline-none",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        color: "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}

export default Menubar
