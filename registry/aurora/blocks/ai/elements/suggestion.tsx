"use client"

/**
 * Aurora Suggestion — suggested next steps as a stack of selectable actions.
 *
 * Each option renders as a full-width Aurora `Button` (neutral lit-outline) with
 * a cyan-tinted border + surface so the group reads as "pick one of these
 * suggested paths". Visual values are ported 1:1 from the Claude Design source:
 * 10px radius, `accent-primary 18%` border tint over the default border, an
 * `accent-primary 4%` wash over the medium panel, left-aligned title + optional
 * meta description + optional badge.
 *
 * Architecture stays shadcn: typed `SuggestionOption[]` API, `forwardRef`,
 * `displayName`, `React.memo`, and the existing `onClick`/`disabled` escape
 * hatches. Built on the Aurora `Button` (Radix `Slot`/cva) and `Badge`.
 */

import * as React from "react"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"

export interface SuggestionOption {
  id: string
  title: string
  description?: string
  badge?: string
}

export interface SuggestionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  options?: SuggestionOption[]
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const Suggestion = React.forwardRef<HTMLDivElement, SuggestionProps>(
  ({ className, style, options, children, onClick, disabled, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-2", className)}
      style={{ width: "100%", minWidth: 0, ...style }}
      {...props}
    >
      {(
        options ?? [
          {
            id: "default",
            title: typeof children === "string" ? children : "Suggested Next Step",
          },
        ]
      ).map((option) => (
        <Button
          key={option.id}
          type="button"
          variant="neutral"
          disabled={disabled}
          onClick={onClick}
          iconLeft={<Lightbulb aria-hidden />}
          className="h-auto min-w-0 justify-start whitespace-normal rounded-[10px] border px-3 py-3 text-left"
          style={{
            borderColor:
              "color-mix(in srgb, var(--axon-orange) 24%, var(--aurora-border-default))",
            background:
              "color-mix(in srgb, var(--axon-orange) 6%, var(--aurora-panel-medium))",
            color: "var(--aurora-text-primary)",
          }}
        >
          <span className="grid min-w-0 gap-1">
            <span className="flex min-w-0 flex-wrap items-center gap-2">
              <span
                className="aurora-text-control"
                style={{ color: "var(--aurora-text-primary)" }}
              >
                {option.title}
              </span>
              {option.badge ? <Badge tone="warn" shape="tag">{option.badge}</Badge> : null}
            </span>
            {option.description ? (
              <span className="aurora-text-meta" style={{ minWidth: 0 }}>
                {option.description}
              </span>
            ) : null}
          </span>
        </Button>
      ))}
    </div>
  )
)
Suggestion.displayName = "Suggestion"

const MemoSuggestion = React.memo(Suggestion)
MemoSuggestion.displayName = "Suggestion"

export { MemoSuggestion as Suggestion }
export default MemoSuggestion
