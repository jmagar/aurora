"use client"

import * as React from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StepStatus = "pending" | "inprog" | "done" | "error"

export interface Step {
  label: string
  status: StepStatus
  detail?: string
}

export interface ThinkingProps {
  type?: "thinking" | "cot" | "plan"
  steps?: Step[]
  isStreaming?: boolean
  duration?: number
  defaultOpen?: boolean
  content?: string
}

// ---------------------------------------------------------------------------
// Keyframe styles (injected once)
// ---------------------------------------------------------------------------

const KEYFRAMES = `
  @keyframes aurora-border-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes aurora-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes aurora-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes aurora-spin {
    to { transform: rotate(360deg); }
  }
`

// ---------------------------------------------------------------------------
// Step status icon
// ---------------------------------------------------------------------------

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "pending") {
    return (
      <span
        style={{
          display: "inline-block",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "1.5px solid var(--aurora-border-strong)",
          flexShrink: 0,
        }}
        aria-label="Pending"
      />
    )
  }
  if (status === "inprog") {
    return (
      <span
        style={{
          display: "inline-block",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "2px solid var(--aurora-accent-primary)",
          borderTopColor: "transparent",
          animation: "aurora-spin 0.7s linear infinite",
          flexShrink: 0,
        }}
        aria-label="In progress"
      />
    )
  }
  if (status === "error") {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-label="Error"
        style={{ flexShrink: 0 }}
      >
        <circle cx="8" cy="8" r="7" stroke="var(--aurora-error)" strokeWidth="1.4" />
        <path
          d="M8 5V8.5M8 10.5V10.6"
          stroke="var(--aurora-error)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  // done
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Done"
      style={{ flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7" stroke="var(--aurora-success)" strokeWidth="1.4" />
      <path
        d="M5 8.5L7 10.5L11 6"
        stroke="var(--aurora-success)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Shimmer skeleton
// ---------------------------------------------------------------------------

function SkeletonLines() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 14px" }}>
      {[100, 85, 92, 70].map((w, i) => (
        <div
          key={i}
          style={{
            height: "11px",
            borderRadius: "6px",
            width: `${w}%`,
            background:
              "linear-gradient(90deg, var(--aurora-border-default) 25%, var(--aurora-hover-bg) 50%, var(--aurora-border-default) 75%)",
            backgroundSize: "200% 100%",
            animation: `aurora-shimmer 1.4s ease ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Blinking cursor
// ---------------------------------------------------------------------------

function Cursor() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: "2px",
        height: "1em",
        background: "var(--aurora-accent-primary)",
        marginLeft: "2px",
        verticalAlign: "text-bottom",
        borderRadius: "1px",
        animation: "aurora-blink 1s step-end infinite",
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Thinking variant
// ---------------------------------------------------------------------------

function ThinkingBlock({
  isStreaming,
  content,
  duration,
  defaultOpen,
}: {
  isStreaming?: boolean
  content?: string
  duration?: number
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? false)
  const bodyRef = React.useRef<HTMLDivElement>(null)

  // Height transition
  const [height, setHeight] = React.useState<string | number>(open ? "auto" : 0)
  React.useEffect(() => {
    if (open) {
      const el = bodyRef.current
      if (el) {
        setHeight(el.scrollHeight)
        const t = setTimeout(() => setHeight("auto"), 250)
        return () => clearTimeout(t)
      }
    } else {
      setHeight(bodyRef.current?.scrollHeight ?? 0)
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)))
    }
  }, [open])

  const borderLeftColor = isStreaming
    ? "var(--aurora-accent-primary)"
    : "var(--aurora-border-strong)"

  const showSkeleton = isStreaming && !content

  return (
    <div
      style={{
        borderLeft: `3px solid ${borderLeftColor}`,
        animation: isStreaming ? "aurora-border-pulse 1.8s ease-in-out infinite" : "none",
        transition: "border-color 0.3s",
      }}
    >
      {/* Summary / toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "8px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Brain icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M7 1.5C5.9 1.5 5 2.4 5 3.5C4.2 3.5 3.5 4.2 3.5 5C2.7 5 2 5.7 2 6.5C2 7.5 2.7 8.2 3.5 8.4V10C3.5 11.1 4.4 12 5.5 12H8.5C9.6 12 10.5 11.1 10.5 10V8.4C11.3 8.2 12 7.5 12 6.5C12 5.7 11.3 5 10.5 5C10.5 4.2 9.8 3.5 9 3.5C9 2.4 8.1 1.5 7 1.5Z"
            stroke="var(--aurora-accent-primary)"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>

        <span
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--aurora-text-muted)",
          }}
        >
          {isStreaming && !duration
            ? "Thinking…"
            : duration !== undefined
            ? `Thought for ${duration}s`
            : "Reasoning"}
        </span>

        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            marginLeft: "auto",
            color: "var(--aurora-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            d="M2.5 4.5L6 7.5L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Collapsible body */}
      <div
        ref={bodyRef}
        style={{
          overflow: "hidden",
          height: typeof height === "number" ? `${height}px` : height,
          transition: "height 0.22s ease-out",
        }}
        aria-hidden={!open}
      >
        {showSkeleton ? (
          <SkeletonLines />
        ) : (
          <div
            style={{
              padding: "0 14px 12px",
              fontSize: "13px",
              lineHeight: "1.7",
              color: "var(--aurora-text-muted)",
              whiteSpace: "pre-wrap",
            }}
          >
            {content}
            {isStreaming && <Cursor />}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CoT (numbered steps with connector line) variant
// ---------------------------------------------------------------------------

function CotBlock({
  steps = [],
  isStreaming,
  defaultOpen,
}: {
  steps?: Step[]
  isStreaming?: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? true)

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="10" height="10" rx="2" stroke="var(--aurora-accent-primary)" strokeWidth="1.3" />
          <path d="M4.5 5H9.5M4.5 7H7.5M4.5 9H8.5" stroke="var(--aurora-accent-primary)" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--aurora-text-muted)" }}>
          Chain of Thought
          {steps.length > 0 && ` · ${steps.length} steps`}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            marginLeft: "auto",
            color: "var(--aurora-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: "4px 14px 12px" }}>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {steps.map((step, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  position: "relative",
                  paddingBottom: i < steps.length - 1 ? "16px" : "0",
                }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "20px",
                      bottom: "0",
                      width: "1px",
                      background: "var(--aurora-border-default)",
                    }}
                  />
                )}

                {/* Number badge */}
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "var(--aurora-control-surface)",
                    border: "1px solid var(--aurora-border-default)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--aurora-text-muted)",
                    flexShrink: 0,
                    zIndex: 1,
                    position: "relative",
                  }}
                >
                  {i + 1}
                </div>

                <div style={{ paddingTop: "3px", flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--aurora-text-primary)",
                      lineHeight: "1.5",
                    }}
                  >
                    {step.label}
                    {isStreaming && i === steps.length - 1 && <Cursor />}
                  </div>
                  {step.detail && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--aurora-text-muted)",
                        marginTop: "2px",
                        lineHeight: "1.5",
                      }}
                    >
                      {step.detail}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Plan variant (step list with status icons)
// ---------------------------------------------------------------------------

function PlanBlock({
  steps = [],
  isStreaming,
  defaultOpen,
}: {
  steps?: Step[]
  isStreaming?: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? true)
  const doneCount = steps.filter((s) => s.status === "done").length

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 3H12M2 7H9M2 11H11" stroke="var(--aurora-accent-primary)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--aurora-text-muted)" }}>
          Plan
        </span>
        {steps.length > 0 && (
          <span
            style={{
              fontSize: "11px",
              color: "var(--aurora-text-muted)",
              background: "var(--aurora-control-surface)",
              padding: "1px 7px",
              borderRadius: "20px",
              border: "1px solid var(--aurora-border-default)",
            }}
          >
            {doneCount}/{steps.length}
          </span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            marginLeft: "auto",
            color: "var(--aurora-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: "4px 14px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "6px 8px",
                borderRadius: "10px",
                background:
                  step.status === "inprog"
                    ? "color-mix(in srgb, var(--aurora-accent-primary) 6%, transparent)"
                    : step.status === "error"
                    ? "color-mix(in srgb, var(--aurora-error) 6%, transparent)"
                    : "transparent",
              }}
            >
              <StepIcon status={step.status} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "13px",
                    color:
                      step.status === "done"
                        ? "var(--aurora-text-muted)"
                        : "var(--aurora-text-primary)",
                    textDecoration: step.status === "done" ? "line-through" : "none",
                    lineHeight: "1.4",
                  }}
                >
                  {step.label}
                  {isStreaming && step.status === "inprog" && <Cursor />}
                </div>
                {step.detail && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--aurora-text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function Thinking({
  type = "thinking",
  steps,
  isStreaming,
  duration,
  defaultOpen,
  content,
}: ThinkingProps) {
  const borderLeftColor = isStreaming
    ? "var(--aurora-accent-primary)"
    : "var(--aurora-border-strong)"

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        style={{
          background: "var(--aurora-panel-medium)",
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--aurora-radius-2)",
          overflow: "hidden",
          boxShadow: "var(--aurora-highlight-medium)",
        }}
      >
        {type === "thinking" && (
          <ThinkingBlock
            isStreaming={isStreaming}
            content={content}
            duration={duration}
            defaultOpen={defaultOpen}
          />
        )}
        {type === "cot" && (
          <CotBlock steps={steps} isStreaming={isStreaming} defaultOpen={defaultOpen} />
        )}
        {type === "plan" && (
          <PlanBlock steps={steps} isStreaming={isStreaming} defaultOpen={defaultOpen} />
        )}
      </div>
    </>
  )
}

export default Thinking
