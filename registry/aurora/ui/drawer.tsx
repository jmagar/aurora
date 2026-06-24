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

const DRAWER_STYLE_ID = "aurora-drawer-styles"

const DRAWER_CSS = `
@keyframes aurora-drawer-overlay-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes aurora-drawer-overlay-out { from { opacity: 1 } to { opacity: 0 } }
@keyframes aurora-drawer-in { from { transform: translateY(100%) } to { transform: translateY(0) } }
@keyframes aurora-drawer-out { from { transform: translateY(0) } to { transform: translateY(100%) } }

.aurora-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--aurora-overlay);
}
.aurora-drawer-overlay[data-state="open"] {
  animation: aurora-drawer-overlay-in var(--motion-duration-medium, 240ms) var(--motion-ease-out, cubic-bezier(0.2, 0.8, 0.2, 1));
}
.aurora-drawer-overlay[data-state="closed"] {
  animation: aurora-drawer-overlay-out var(--motion-duration-fast, 160ms) var(--motion-ease-in-out, cubic-bezier(0.4, 0, 0.2, 1));
}

.aurora-drawer-content {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  max-height: 82vh;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--aurora-border-strong);
  border-top-left-radius: var(--aurora-radius-3, 22px);
  border-top-right-radius: var(--aurora-radius-3, 22px);
  background: var(--aurora-panel-strong);
  color: var(--aurora-text-primary);
  box-shadow: 0 -28px 72px rgba(0, 0, 0, 0.42), var(--aurora-highlight-strong);
  outline: none;
}
.aurora-drawer-content[data-state="open"] {
  animation: aurora-drawer-in var(--motion-duration-slow, 360ms) var(--motion-ease-out, cubic-bezier(0.2, 0.8, 0.2, 1));
}
.aurora-drawer-content[data-state="closed"] {
  animation: aurora-drawer-out var(--motion-duration-medium, 240ms) var(--motion-ease-in-out, cubic-bezier(0.4, 0, 0.2, 1));
}

.aurora-drawer-handle-row {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  padding-bottom: 4px;
}
.aurora-drawer-handle {
  width: 44px;
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--aurora-accent-primary) 60%, transparent);
}

.aurora-drawer-header {
  padding: 12px 28px 18px;
}
.aurora-drawer-header[data-divider="true"] {
  border-bottom: 1px solid var(--aurora-border-default);
}
.aurora-drawer-title {
  margin: 0;
  font-family: var(--font-display, 'Manrope', system-ui, sans-serif);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--aurora-text-primary);
}
.aurora-drawer-description {
  margin: 6px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--aurora-text-muted);
}

.aurora-drawer-body {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 20px 28px 28px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--aurora-text-primary);
}
`

function DrawerStyles() {
  return <style id={DRAWER_STYLE_ID} dangerouslySetInnerHTML={{ __html: DRAWER_CSS }} />
}

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
      <DrawerStyles />
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
