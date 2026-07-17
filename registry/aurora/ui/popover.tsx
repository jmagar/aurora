"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { usePortalContainer } from "@/registry/aurora/lib/portal-container"

export type PopoverTriggerProps = React.ComponentProps<typeof PopoverPrimitive.Trigger>
export type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content>

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: PopoverTriggerProps) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  ref,
  className,
  align = "start",
  sideOffset = 8,
  style,
  ...props
}: PopoverContentProps & {
  ref?: React.Ref<React.ComponentRef<typeof PopoverPrimitive.Content>>
}) {
  const portalContainer = usePortalContainer()

  return (
    <PopoverPrimitive.Portal container={portalContainer ?? undefined}>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-[var(--aurora-radius-2)] border p-4 outline-none",
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
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, style, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="popover-title"
      className={cn("aurora-text-control", className)}
      style={{ color: "var(--aurora-text-primary)", ...style }}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  style,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("aurora-text-body-sm", className)}
      style={{ color: "var(--aurora-text-muted)", ...style }}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
