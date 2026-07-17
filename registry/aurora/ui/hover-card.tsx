"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "@/registry/aurora/lib/portal-container"

const HoverCardRoot = HoverCardPrimitive.Root
const HoverCardTrigger = HoverCardPrimitive.Trigger

function HoverCardContent({
  ref,
  className,
  align = "start",
  sideOffset = 8,
  style,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & {
  ref?: React.Ref<React.ComponentRef<typeof HoverCardPrimitive.Content>>
}) {
  const portalContainer = usePortalContainer()
  return (
    <HoverCardPrimitive.Portal container={portalContainer ?? undefined}>
      <HoverCardPrimitive.Content
        ref={ref}
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) overflow-hidden rounded-[var(--aurora-radius-2)] border p-3 outline-none",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
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
    </HoverCardPrimitive.Portal>
  )
}

export interface HoverCardProps
  extends Omit<React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>, "children"> {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  contentClassName?: string
  contentStyle?: React.CSSProperties
}

function HoverCard({
  trigger,
  children,
  className,
  style,
  contentClassName,
  contentStyle,
  openDelay = 180,
  closeDelay = 120,
  ...props
}: HoverCardProps) {
  return (
    <HoverCardRoot openDelay={openDelay} closeDelay={closeDelay} {...props}>
      <HoverCardTrigger asChild>
        <span className={cn("inline-flex", className)} style={style}>
          {trigger}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className={contentClassName} style={contentStyle}>
        {children}
      </HoverCardContent>
    </HoverCardRoot>
  )
}

export { HoverCard, HoverCardContent, HoverCardRoot, HoverCardTrigger }

export default HoverCard
