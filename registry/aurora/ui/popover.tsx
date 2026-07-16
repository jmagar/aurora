"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { POPOVER_FOCUSABLE_SELECTOR } from "@/registry/aurora/lib/widget-interactions"

interface PopoverContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  registerTrigger: (node: HTMLElement | null) => void
  registerContent: (node: HTMLDivElement | null) => void
  focusContent: () => void
  contentId: string
  close: (restoreFocus?: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}

export function Popover({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  const triggerRef = React.useRef<HTMLElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const contentId = React.useId()
  const registerTrigger = React.useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
  }, [])
  const registerContent = React.useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node
  }, [])
  const focusContent = React.useCallback(() => {
    const content = contentRef.current
    if (!content || content.contains(document.activeElement)) return
    const focusable = content.querySelector<HTMLElement>(POPOVER_FOCUSABLE_SELECTOR)
    ;(focusable ?? content).focus()
  }, [])
  const close = React.useCallback((restoreFocus = false) => {
    // Restore focus while the popup contents are still mounted. Browsers move
    // focus to <body> when the active descendant is removed, so a deferred
    // focus call creates a race for keyboard users and interaction tests.
    if (restoreFocus) triggerRef.current?.focus()
    setOpen(false)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !contentRef.current?.contains(target)) close(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close(true)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  return <PopoverContext.Provider value={{ open, setOpen, registerTrigger, registerContent, focusContent, contentId, close }}>{children}</PopoverContext.Provider>
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function PopoverTrigger({ children, asChild, onClick, ...props }: PopoverTriggerProps) {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("PopoverTrigger must be used within Popover")
  const { contentId, open, registerTrigger, setOpen } = ctx

  type TriggerChildProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  if (asChild && React.isValidElement<TriggerChildProps>(children)) {
    const setTriggerRef = (node: HTMLElement | null) => {
      registerTrigger(node)
      assignRef(children.props.ref, node)
    }
    return React.cloneElement(children, {
      ref: setTriggerRef,
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        children.props.onClick?.(event)
        if (!event.defaultPrevented) setOpen((value) => !value)
      },
    })
  }

  return (
    <Button ref={registerTrigger as React.Ref<HTMLButtonElement>} variant="plain" size="unstyled"
      type="button"
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-controls={open ? contentId : undefined}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setOpen((value) => !value)
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
}

export function PopoverContent({ ref, className, align = "start", style, ...props }: PopoverContentProps & { ref?: React.Ref<HTMLDivElement> }) {
    const ctx = React.useContext(PopoverContext)
    const open = ctx?.open
    const focusContent = ctx?.focusContent
    const setRefs = (node: HTMLDivElement | null) => {
      ctx?.registerContent(node)
      assignRef(ref, node)
    }

    React.useLayoutEffect(() => {
      if (!open || !focusContent) return
      focusContent()
    }, [open, focusContent])

    if (!open || !ctx) return null

    return (
      <div
        ref={setRefs}
        id={ctx.contentId}
        role="dialog"
        tabIndex={-1}
        className={cn("absolute z-50 mt-2 min-w-64 rounded-[12px] border p-4", className)}
        style={{
          insetInlineStart: align === "start" ? 0 : undefined,
          insetInlineEnd: align === "end" ? 0 : undefined,
          left: align === "center" ? "50%" : undefined,
          transform: align === "center" ? "translateX(-50%)" : undefined,
          background: "var(--aurora-panel-strong)",
          borderColor: "var(--aurora-border-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          color: "var(--aurora-text-primary)",
          ...style,
        }}
        {...props}
      />
    )
}

export function PopoverAnchor({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative inline-block", className)}>{children}</div>
}
