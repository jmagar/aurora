"use client"

import * as React from "react"

export type NavigationMenuProps = React.HTMLAttributes<HTMLElement>
export interface NavigationMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

export function NavigationMenu({ className, style, ref, ...props }: NavigationMenuProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <nav
      ref={ref}
      className={["flex flex-wrap items-center gap-1 rounded-[8px] border p-1", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "var(--aurora-border-default)",
        ...style,
      }}
      {...props}
    />
  )
}

export function NavigationMenuItem({ active = false, className, style, ref, ...props }: NavigationMenuItemProps & { ref?: React.Ref<HTMLAnchorElement> }) {
  return (
    <a
      ref={ref}
      className={["rounded-[6px] border px-3 py-1.5 no-underline aurora-text-control transition-colors", className].filter(Boolean).join(" ")}
      aria-current={active ? "page" : undefined}
      style={{
        background: active ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)" : "transparent",
        borderColor: active ? "color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)" : "transparent",
        color: active ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
        boxShadow: active ? "var(--aurora-active-glow)" : "none",
        ...style,
      }}
      {...props}
    />
  )
}

export default NavigationMenu
