"use client"

import * as React from "react"
import { Brain, Check, ChevronDown } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

// ChainOfThought — collapsible reasoning timeline with per-step status + streaming.
// Visual spec ported 1:1 from the Claude Design source. Axon orange is the
// AI/automation identity accent here (violet was removed from the system).
// Status colors come from the semantic token layer (success / error / muted).

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CotStepStatus = "pending" | "inprog" | "done" | "error"

export interface CotStep {
  /** Primary line of the step. */
  label: string
  /** Optional secondary line below the label. */
  detail?: string
  /** Step state — drives the status node + tinting. Defaults to "inprog". */
  status?: CotStepStatus
  /** Optional right-aligned timing label (e.g. "0.4s"). */
  duration?: string
}

export interface ChainOfThoughtProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Ordered reasoning steps. */
  steps?: CotStep[]
  /** Header summary on the right (e.g. "Thought for 4.2s"). */
  summary?: string
  /** Show the orange "AI" identity badge next to the title. */
  badge?: boolean
  /** Streaming mode — pulses the orange accent and adds a cursor to the active step. */
  isStreaming?: boolean
  /** Whether the timeline starts expanded. Defaults to open. */
  defaultOpen?: boolean
  /** Header title. Defaults to "Chain of thought". */
  title?: string
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

const AXON = "var(--axon-orange)"

// ---------------------------------------------------------------------------
// Streaming cursor
// ---------------------------------------------------------------------------

function Cursor() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: "2px",
        height: "1em",
        background: AXON,
        marginLeft: "3px",
        verticalAlign: "text-bottom",
        borderRadius: "1px",
        animation: "aurora-cot-blink 1s step-end infinite",
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Status node — circular timeline marker
// ---------------------------------------------------------------------------

function StatusNode({ status }: { status: CotStepStatus }) {
  // done — success ring + check
  if (status === "done") {
    return (
      <span
        aria-label="Done"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid var(--aurora-success-border)",
          background: "var(--aurora-success-surface)",
          color: "var(--aurora-success)",
          flexShrink: 0,
        }}
      >
        <Check size={16} strokeWidth={2.4} aria-hidden="true" />
      </span>
    )
  }

  // error — error ring + dash
  if (status === "error") {
    return (
      <span
        aria-label="Error"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid var(--aurora-error-border)",
          background: "var(--aurora-error-surface)",
          color: "var(--aurora-error)",
          fontSize: "15px",
          fontWeight: 700,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        !
      </span>
    )
  }

  // pending — muted hollow ring
  if (status === "pending") {
    return (
      <span
        aria-label="Pending"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: "1.5px solid var(--aurora-border-strong)",
          background: "var(--aurora-control-surface)",
          flexShrink: 0,
        }}
      />
    )
  }

  // inprog — orange ring with a spinning arc
  return (
    <span
      aria-label="In progress"
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1.5px solid var(--axon-orange-border)",
        background: "var(--axon-orange-surface)",
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: `2px solid ${AXON}`,
          borderTopColor: "transparent",
          animation: "aurora-cot-spin 0.8s linear infinite",
        }}
      />
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const ChainOfThought = function ChainOfThought(
    { ref,
      steps = [],
      summary,
      badge,
      isStreaming,
      defaultOpen = true,
      title = "Chain of Thought",
      style,
      ...rest
    }: ChainOfThoughtProps & { ref?: React.Ref<HTMLDivElement> },
  ) {
    const [open, setOpen] = React.useState(defaultOpen)
    const lastStreamingIndex = isStreaming ? steps.length - 1 : -1

    return (
      <div
        ref={ref}
        style={{
          background: "var(--aurora-surface-raised)",
          border: "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-3)",
          boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        {/* Header */}
        <Button
          variant="plain"
          size="unstyled"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            width: "100%",
            minWidth: 0,
            padding: "16px 20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <Brain
            size={17}
            strokeWidth={1.9}
            aria-hidden="true"
            style={{
              color: AXON,
              flexShrink: 0,
              animation: isStreaming ? "aurora-cot-pulse 1.8s ease-in-out infinite" : "none",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--aurora-text-primary)",
              minWidth: 0,
            }}
          >
            {title}
          </span>

          {badge && (
            <span
              className="aurora-text-caption"
              style={{
                fontWeight: 600,
                letterSpacing: "0.075em",
                color: "var(--axon-orange-strong)",
                background: "var(--axon-orange-surface)",
                border: "1px solid var(--axon-orange-border)",
                borderRadius: "7px",
                padding: "2px 7px",
                flexShrink: 0,
              }}
            >
              AI
            </span>
          )}

          {summary && (
            <span
              className="aurora-text-meta tabular-nums"
              style={{
                marginLeft: "auto",
                color: "var(--aurora-text-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {summary}
            </span>
          )}

          <ChevronDown
            size={16}
            aria-hidden="true"
            style={{
              marginLeft: summary ? "10px" : "auto",
              color: "var(--aurora-text-muted)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              flexShrink: 0,
            }}
          />
        </Button>

        {/* Timeline */}
        {open && (
          <ol
            style={{
              listStyle: "none",
              margin: 0,
              padding: "2px 20px 18px",
            }}
          >
            {steps.map((step, i) => {
              const status = step.status ?? "inprog"
              const isLast = i === steps.length - 1
              return (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "16px",
                    position: "relative",
                    paddingBottom: isLast ? "0" : "20px",
                  }}
                >
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "17px",
                        top: "34px",
                        bottom: "0",
                        width: "1px",
                        background: "var(--aurora-border-default)",
                      }}
                    />
                  )}

                  <StatusNode status={status} />

                  <div style={{ flex: 1, minWidth: 0, paddingTop: "5px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: "17px",
                          fontWeight: 500,
                          lineHeight: "1.3",
                          color: "var(--aurora-text-primary)",
                        }}
                      >
                        {step.label}
                        {i === lastStreamingIndex && <Cursor />}
                      </div>
                      {step.duration && (
                        <span
                          className="aurora-text-meta tabular-nums"
                          style={{
                            color: "var(--aurora-text-muted)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {step.duration}
                        </span>
                      )}
                    </div>
                    {step.detail && (
                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "15px",
                          lineHeight: "1.4",
                          color: "var(--aurora-text-muted)",
                        }}
                      >
                        {step.detail}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    )
  }

ChainOfThought.displayName = "ChainOfThought"

export default ChainOfThought
