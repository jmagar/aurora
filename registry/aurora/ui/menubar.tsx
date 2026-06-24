"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export type MenubarProps = React.HTMLAttributes<HTMLDivElement>
export type MenubarTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Menubar({ ref, className, style, ...props }: MenubarProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      role="menubar"
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-[var(--aurora-radius-2)] border p-1.5",
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

export const MenubarMenu = DropdownMenu
export const MenubarLabel = DropdownMenuLabel
export const MenubarSeparator = DropdownMenuSeparator
export const MenubarShortcut = DropdownMenuShortcut
export const MenubarItem = DropdownMenuItem
export const MenubarCheckboxItem = DropdownMenuCheckboxItem
export const MenubarRadioGroup = DropdownMenuRadioGroup
export const MenubarRadioItem = DropdownMenuRadioItem

export function MenubarTrigger({ ref, className, style, type = "button", ...props }: MenubarTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        ref={ref}
        role="menuitem"
        aria-haspopup="menu"
        type={type}
        variant="plain"
        size="unstyled"
        className={cn(
          "rounded-[8px] px-3 py-1.5 aurora-text-control font-semibold transition-colors duration-150",
          "hover:bg-[var(--aurora-hover-bg)] focus-visible:outline-none data-[state=open]:bg-[var(--aurora-hover-bg)]",
          className
        )}
        style={{
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        onFocus={(event) => {
          event.currentTarget.dataset.previousBoxShadow = event.currentTarget.style.boxShadow
          event.currentTarget.style.boxShadow = "0 0 0 2px var(--aurora-focus-ring)"
          props.onFocus?.(event)
        }}
        onBlur={(event) => {
          event.currentTarget.style.boxShadow = event.currentTarget.dataset.previousBoxShadow ?? ""
          props.onBlur?.(event)
        }}
        {...props}
      />
    </DropdownMenuTrigger>
  )
}

export function MenubarContent({ ref, className, sideOffset = 10, align = "start", ...props }: React.ComponentPropsWithRef<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      ref={ref}
      sideOffset={sideOffset}
      align={align}
      className={cn("min-w-[14rem]", className)}
      {...props}
    />
  )
}

export default Menubar
