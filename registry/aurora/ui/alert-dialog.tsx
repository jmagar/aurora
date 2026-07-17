"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { Info, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/aurora/ui/button"

const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal
const AlertDialogAction = AlertDialogPrimitive.Action
const AlertDialogCancel = AlertDialogPrimitive.Cancel

function AlertDialogOverlay({
  ref,
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Overlay>>
}) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-[2px]",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      style={{ backgroundColor: "var(--aurora-overlay)", ...style }}
      {...props}
    />
  )
}

function AlertDialogContent({
  ref,
  className,
  children,
  size = "default",
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: "default" | "sm"
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Content>>
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[var(--aurora-radius-3)] border p-6 outline-none",
          "data-[size=sm]:max-w-sm data-[size=default]:sm:max-w-lg",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        style={{
          background:
            "linear-gradient(180deg, var(--aurora-panel-strong-top), var(--aurora-panel-strong))",
          borderColor:
            "color-mix(in srgb, var(--aurora-border-default) 55%, var(--aurora-page-bg))",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function AlertDialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-body"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({
  ref,
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Title>>
}) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      data-slot="alert-dialog-title"
      className={cn("aurora-text-section", className)}
      style={{ color: "var(--aurora-text-primary)", ...style }}
      {...props}
    />
  )
}

function AlertDialogDescription({
  ref,
  className,
  style,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description> & {
  ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Description>>
}) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn("aurora-text-body-sm", className)}
      style={{ color: "var(--aurora-text-muted)", ...style }}
      {...props}
    />
  )
}

export interface AlertDialogCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  destructive?: boolean
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
}

function AlertDialogCard({
  ref,
  className,
  title,
  description,
  destructive = true,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  ...props
}: AlertDialogCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const Icon = destructive ? TriangleAlert : Info
  const titleId = React.useId()
  const descriptionId = React.useId()

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      className={cn("aurora-alert", !destructive && "aurora-alert--info", className)}
      {...props}
    >
      <span className="aurora-alert__icon" aria-hidden>
        <Icon className="size-5" />
      </span>
      <div className="aurora-alert__main">
        {title ? (
          <h2 id={titleId} className="aurora-alert__title">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p id={descriptionId} className="aurora-alert__desc">
            {description}
          </p>
        ) : null}
        <div className="aurora-alert__footer">
          <Button variant="neutral" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "rose" : "aurora"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

type InlineAlertDialogProps = AlertDialogCardProps & { children?: never }
type PrimitiveAlertDialogProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Root
>

export type AlertDialogProps = InlineAlertDialogProps | PrimitiveAlertDialogProps

function AlertDialog(props: AlertDialogProps) {
  if (!("children" in props) && ("title" in props || "description" in props)) {
    return <AlertDialogCard {...(props as InlineAlertDialogProps)} />
  }

  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...(props as PrimitiveAlertDialogProps)} />
}

AlertDialog.displayName = "AlertDialog"

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogCard,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}

export default AlertDialog
