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
import { cn } from "@/lib/utils"

export type MenubarProps = React.HTMLAttributes<HTMLDivElement>
export type MenubarTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      role="menubar"
      className={cn("flex flex-wrap items-center gap-1 rounded-[10px] border p-1.5", className)}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-default)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
      {...props}
    />
  )
)
Menubar.displayName = "Menubar"

export const MenubarMenu = DropdownMenu
export const MenubarLabel = DropdownMenuLabel
export const MenubarSeparator = DropdownMenuSeparator
export const MenubarShortcut = DropdownMenuShortcut
export const MenubarItem = DropdownMenuItem
export const MenubarCheckboxItem = DropdownMenuCheckboxItem
export const MenubarRadioGroup = DropdownMenuRadioGroup
export const MenubarRadioItem = DropdownMenuRadioItem

export const MenubarTrigger = React.forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  ({ className, style, type = "button", ...props }, ref) => (
    <DropdownMenuTrigger asChild>
      <button
        ref={ref}
        role="menuitem"
        aria-haspopup="menu"
        type={type}
        className={cn(
          "rounded-[8px] px-3 py-1.5 aurora-text-control transition-colors duration-150",
          "focus-visible:outline-none data-[state=open]:bg-[var(--aurora-hover-bg)]",
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
)
MenubarTrigger.displayName = "MenubarTrigger"

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, sideOffset = 10, align = "start", ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    sideOffset={sideOffset}
    align={align}
    className={cn("min-w-[14rem]", className)}
    {...props}
  />
))
MenubarContent.displayName = "MenubarContent"

export default Menubar
