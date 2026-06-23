"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial size of the first pane, as a percentage of the total width. */
  defaultSize?: number
  /** Minimum size of the first pane, as a percentage. */
  minSize?: number
  /** Maximum size of the first pane, as a percentage. */
  maxSize?: number
  /** Keyboard / drag step, in percent. */
  step?: number
  /** Accessible label for the resize handle. */
  handleLabel?: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  (
    {
      className,
      children,
      defaultSize = 42,
      minSize = 12,
      maxSize = 88,
      step = 2,
      handleLabel = "Resize panels",
      style,
      ...props
    },
    ref,
  ) => {
    const [size, setSize] = React.useState(defaultSize)
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const draggingRef = React.useRef(false)
    const childrenArray = React.Children.toArray(children)

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref],
    )

    const updateFromClientX = React.useCallback(
      (clientX: number) => {
        const el = containerRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.width === 0) return
        const pct = ((clientX - rect.left) / rect.width) * 100
        setSize(clamp(pct, minSize, maxSize))
      },
      [minSize, maxSize],
    )

    React.useEffect(() => {
      const onMove = (event: PointerEvent) => {
        if (!draggingRef.current) return
        event.preventDefault()
        updateFromClientX(event.clientX)
      }
      const onUp = () => {
        draggingRef.current = false
        document.body.style.removeProperty("cursor")
        document.body.style.removeProperty("user-select")
      }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
      return () => {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }
    }, [updateFromClientX])

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      draggingRef.current = true
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      updateFromClientX(event.clientX)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        setSize((s) => clamp(s - step, minSize, maxSize))
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        setSize((s) => clamp(s + step, minSize, maxSize))
      } else if (event.key === "Home") {
        event.preventDefault()
        setSize(minSize)
      } else if (event.key === "End") {
        event.preventDefault()
        setSize(maxSize)
      }
    }

    return (
      <div
        ref={setRefs}
        data-slot="resizable"
        className={cn(
          "grid h-full min-h-[var(--aurora-resizable-min-h)] w-full overflow-hidden",
          "rounded-[var(--aurora-radius-2)] border border-[var(--aurora-border-strong)]",
          className,
        )}
        style={
          {
            "--aurora-resizable-min-h": "200px",
            gridTemplateColumns: `minmax(0, ${size}%) 0px minmax(0, 1fr)`,
            background: "var(--aurora-page-bg)",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <div data-slot="resizable-pane" className="min-w-0 overflow-auto">
          {childrenArray[0]}
        </div>
        <div
          data-slot="resizable-handle"
          role="separator"
          aria-orientation="vertical"
          aria-label={handleLabel}
          aria-valuenow={Math.round(size)}
          aria-valuemin={Math.round(minSize)}
          aria-valuemax={Math.round(maxSize)}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          className={cn(
            "relative z-10 -mx-px cursor-col-resize touch-none select-none outline-none",
            "before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2",
            "before:bg-[var(--aurora-border-strong)] before:content-['']",
            "after:absolute after:inset-y-0 after:left-1/2 after:w-[11px] after:-translate-x-1/2 after:content-['']",
            "hover:before:bg-[var(--aurora-accent-primary)] focus-visible:before:bg-[var(--aurora-accent-primary)]",
          )}
        />
        <div data-slot="resizable-pane" className="min-w-0 overflow-auto">
          {childrenArray[1]}
        </div>
      </div>
    )
  },
)
Resizable.displayName = "Resizable"

export type ResizablePaneProps = React.HTMLAttributes<HTMLDivElement>

const ResizablePane = React.forwardRef<HTMLDivElement, ResizablePaneProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="resizable-pane-content"
      className={cn(
        "grid h-full place-items-center text-center font-[family-name:var(--aurora-font-mono)]",
        "text-[12px] text-[var(--aurora-text-muted)]",
        className,
      )}
      style={{
        background: "var(--aurora-control-surface)",
        ...style,
      }}
      {...props}
    />
  ),
)
ResizablePane.displayName = "ResizablePane"

export { Resizable, ResizablePane }
export default Resizable
