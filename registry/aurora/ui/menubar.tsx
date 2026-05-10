"use client"

import * as React from "react"
import { Button } from "./button"

export type MenubarProps = React.HTMLAttributes<HTMLDivElement>
export type MenubarItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      role="menubar"
      className={["flex items-center gap-1 rounded-[8px] border p-1", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-default)",
        ...style,
      }}
      {...props}
    />
  )
)
Menubar.displayName = "Menubar"

export const MenubarItem = React.forwardRef<HTMLButtonElement, MenubarItemProps>(
  ({ className, style, ...props }, ref) => (
    <Button variant="plain" size="unstyled"
      ref={ref}
      role="menuitem"
      type="button"
      className={["rounded-[6px] px-3 py-1.5 aurora-text-control transition-colors hover:bg-[var(--aurora-hover-bg)]", className].filter(Boolean).join(" ")}
      style={{ color: "var(--aurora-text-primary)", ...style }}
      {...props}
    />
  )
)
MenubarItem.displayName = "MenubarItem"

export default Menubar
