"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationMenuTriggerStyle = [
  "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-[8px] border px-3 py-1.5 outline-none transition-[background-color,border-color,box-shadow,color] duration-150",
  "focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0",
  "data-[state=open]:shadow-[var(--aurora-active-glow)]",
].join(" ")

function NavigationMenuRoot({
  className,
  style,
  children,
  viewport = false,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn("group/navigation-menu relative inline-flex max-w-max flex-col", className)}
      style={style}
      {...props}
    >
      {children}
      {viewport ? <NavigationMenuViewport /> : null}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-[var(--aurora-radius-2)] border p-1",
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

export type NavigationMenuProps = Omit<
  React.ComponentProps<typeof NavigationMenuPrimitive.Root>,
  "children"
> & {
  children: React.ReactNode
  viewport?: boolean
  listClassName?: string
}

export interface NavigationMenuItemProps
  extends React.ComponentProps<typeof NavigationMenuPrimitive.Link> {
  active?: boolean
  itemClassName?: string
}

function NavigationMenu({
  children,
  listClassName,
  viewport = false,
  ...props
}: NavigationMenuProps) {
  return (
    <NavigationMenuRoot viewport={viewport} {...props}>
      <NavigationMenuList className={listClassName}>{children}</NavigationMenuList>
    </NavigationMenuRoot>
  )
}

function NavigationMenuItem({
  active = false,
  className,
  itemClassName,
  children,
  style,
  ...props
}: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", itemClassName)}
    >
      <NavigationMenuPrimitive.Link
        data-slot="navigation-menu-link"
        active={active}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex items-center rounded-[6px] border px-3 py-1.5 no-underline aurora-text-control transition-[background-color,border-color,box-shadow,color] duration-150",
          "focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0",
          className
        )}
        style={{
          background: active
            ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)"
            : "transparent",
          borderColor: active
            ? "color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"
            : "transparent",
          color: active ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
          boxShadow: active ? "var(--aurora-active-glow)" : "none",
          ...style,
        }}
        {...props}
      >
        {children}
      </NavigationMenuPrimitive.Link>
    </NavigationMenuPrimitive.Item>
  )
}

function NavigationMenuTrigger({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle, className)}
      style={{
        background: "var(--aurora-control-surface)",
        borderColor: "transparent",
        color: "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    >
      {children}
      <ChevronDown
        className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "left-0 top-0 w-full p-2 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
        "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-[var(--aurora-radius-2)] group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:duration-200 group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        className
      )}
      style={{
        background: "var(--aurora-panel-strong)",
        borderColor: "var(--aurora-border-strong)",
        color: "var(--aurora-text-primary)",
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        ...style,
      }}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full isolate z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top-center overflow-hidden rounded-[var(--aurora-radius-2)] border md:w-[var(--radix-navigation-menu-viewport-width)]",
          "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90",
          className
        )}
        style={{
          background: "var(--aurora-panel-strong)",
          borderColor: "var(--aurora-border-strong)",
          color: "var(--aurora-text-primary)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          ...style,
        }}
        {...props}
      />
    </div>
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-2 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div
        className="relative top-[60%] size-2 rotate-45 rounded-[2px]"
        style={{ background: "var(--aurora-border-strong)" }}
      />
    </NavigationMenuPrimitive.Indicator>
  )
}

function NavigationMenuLink({
  className,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-[8px] p-2 text-sm outline-none transition-[background-color,border-color,box-shadow,color] duration-150",
        "focus-visible:ring-2 focus-visible:ring-[var(--aurora-focus-ring)] focus-visible:ring-offset-0",
        className
      )}
      style={{
        color: "var(--aurora-text-primary)",
        ...style,
      }}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}

export default NavigationMenu
