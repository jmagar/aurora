"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

/**
 * Aurora Drawer — a bottom-sheet overlay extension.
 *
 * Self-contained (no external Aurora component dependencies beyond Radix
 * Dialog + cn). Renders a scrim, a rounded-top panel that slides up from the
 * bottom edge, a drag-handle grip, an optional title + description header with
 * a divider, and a body. Swipe-down / tap-outside dismiss is handled by the
 * Radix overlay; pointer drag is purely affordance.
 *
 * The simple CD-parity surface is the single-element form:
 *   <Drawer defaultOpen title="Quick actions" description="edge-1 · production">
 *     body content
 *   </Drawer>
 *
 * Compound parts are also exported for fully custom compositions.
 */

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

const DrawerRoot = DialogPrimitive.Root
const DrawerTrigger = DialogPrimitive.Trigger
const DrawerClose = DialogPrimitive.Close
const DrawerPortal = DialogPrimitive.Portal

function DrawerOverlay({ ref, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay ref={ref} className={cn("aurora-drawer-overlay", className)} {...props} />
}

function DrawerHandle({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={cn("aurora-drawer-handle-row", className)} {...props}>
      <div aria-hidden="true" className="aurora-drawer-handle" />
    </div>
  )
}

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Show the centered drag-handle grip at the top of the sheet. Defaults to true. */
  showHandle?: boolean
}

function DrawerContent({ ref, className, children, showHandle = true, ...props }: DrawerContentProps & { ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>> }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content ref={ref} className={cn("aurora-drawer-content", className)} {...props}>
        {showHandle ? <DrawerHandle /> : null}
        {children}
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
}

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render the bottom divider beneath the header. Defaults to true. */
  divider?: boolean
}

function DrawerHeader({ ref, className, divider = true, ...props }: DrawerHeaderProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-divider={divider ? "true" : "false"}
      className={cn("aurora-drawer-header", className)}
      {...props}
    />
  )
}

function DrawerTitle({ ref, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title ref={ref} className={cn("aurora-drawer-title", className)} {...props} />
}

function DrawerDescription({ ref, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("aurora-drawer-description", className)}
      {...props}
    />
  )
}

function DrawerBody({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn("aurora-drawer-body", className)} {...props} />
}

export interface DrawerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>, "children"> {
  /** Sheet heading rendered in the header. */
  title?: React.ReactNode
  /** Muted sub-line rendered beneath the title. */
  description?: React.ReactNode
  /** Show the centered drag-handle grip. Defaults to true. */
  showHandle?: boolean
  /** Optional trigger element; when provided it is wrapped in a DrawerTrigger. */
  trigger?: React.ReactNode
  /** Body content of the drawer. */
  children?: React.ReactNode
  /** className forwarded to the drawer content panel. */
  className?: string
}

/**
 * Convenience Drawer — the CD-parity single-element form. Composes the parts
 * into a bottom sheet with header + body. For full control, use the compound
 * parts (DrawerContent, DrawerHeader, …) directly.
 */
function Drawer({ ref, title, description, showHandle = true, trigger, children, className, ...rootProps }: DrawerProps & { ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>> }) {
  return (
    <DrawerRoot {...rootProps}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent ref={ref} showHandle={showHandle} className={className}>
        {title || description ? (
          <DrawerHeader>
            {title ? <DrawerTitle>{title}</DrawerTitle> : null}
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>
        ) : null}
        {children ? <DrawerBody>{children}</DrawerBody> : null}
      </DrawerContent>
    </DrawerRoot>
  )
}

export {
  Drawer,
  DrawerRoot,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
}

export default Drawer
