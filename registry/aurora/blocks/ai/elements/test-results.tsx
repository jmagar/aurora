"use client"

import * as React from "react"
import { CircleCheck, FlaskConical, CircleMinus, CircleX } from "lucide-react"
import { Badge } from "@/registry/aurora/ui/badge"

export interface TestResult {
  name: string
  status: "passed" | "failed" | "skipped" | "running"
  duration?: string
  message?: string
}

export interface TestResultsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "results"> {
  results: TestResult[]
}

const statusMeta = {
  passed: {
    color: "var(--aurora-success)",
    icon: CircleCheck,
    badge: "success" as const,
    label: "passed",
  },
  failed: {
    color: "var(--aurora-error)",
    icon: CircleX,
    badge: "error" as const,
    label: "failed",
  },
  skipped: {
    color: "var(--aurora-neutral)",
    icon: CircleMinus,
    badge: "neutral" as const,
    label: "skipped",
  },
  running: {
    color: "var(--aurora-info)",
    icon: FlaskConical,
    badge: "info" as const,
    label: "running",
  },
} as const

function panelStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--aurora-surface-raised)",
    border: "1px solid var(--aurora-border-strong)",
    borderRadius: "var(--aurora-radius-1)",
    boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
    ...style,
  }
}

const TestResults = React.forwardRef<HTMLDivElement, TestResultsProps>(
  ({ className, results, style, ...props }, ref) => {
    const total = results.length
    const passed = results.filter((r) => r.status === "passed").length
    const failed = results.filter((r) => r.status === "failed").length
    const skipped = results.filter((r) => r.status === "skipped").length
    const running = results.filter((r) => r.status === "running").length

    const segments = [
      { count: passed, color: "var(--aurora-success)" },
      { count: failed, color: "var(--aurora-error)" },
      { count: running, color: "var(--aurora-info)" },
      { count: skipped, color: "var(--aurora-neutral)" },
    ].filter((s) => s.count > 0)

    return (
      <div
        ref={ref}
        className={["grid", className].filter(Boolean).join(" ")}
        style={panelStyle({ gap: 14, padding: 16, ...style })}
        {...props}
      >
        <div className="flex items-center justify-between" style={{ gap: 12 }}>
          <div
            className="flex items-center aurora-text-control"
            style={{ gap: 8, color: "var(--aurora-text-primary)", fontWeight: 600 }}
          >
            <FlaskConical
              className="size-4"
              aria-hidden
              style={{ color: "var(--aurora-text-muted)" }}
            />
            Test results
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            {passed > 0 ? <Badge variant="success">{passed} pass</Badge> : null}
            {failed > 0 ? <Badge variant="error">{failed} fail</Badge> : null}
            {running > 0 ? <Badge variant="info">{running} run</Badge> : null}
            {skipped > 0 && passed === 0 && failed === 0 ? (
              <Badge variant="neutral">{skipped} skip</Badge>
            ) : null}
          </div>
        </div>

        {total > 0 ? (
          <div
            role="presentation"
            className="flex w-full overflow-hidden"
            style={{
              gap: 3,
              height: 4,
              borderRadius: 999,
              background: "var(--aurora-control-surface)",
            }}
          >
            {segments.map((segment, index) => (
              <span
                key={index}
                style={{
                  flex: segment.count,
                  background: segment.color,
                  borderRadius: 999,
                }}
              />
            ))}
          </div>
        ) : null}

        <div className="grid" style={{ gap: 2 }}>
          {results.map((result) => {
            const meta = statusMeta[result.status]
            const StatusIcon = meta.icon
            return (
              <div
                key={result.name}
                className="grid items-center"
                style={{
                  gridTemplateColumns: "auto minmax(0,1fr) auto auto",
                  columnGap: 12,
                  rowGap: 4,
                  borderRadius: 10,
                  padding: "8px 6px",
                  border: "1px solid",
                  borderColor:
                    result.status === "running"
                      ? "var(--aurora-info-border)"
                      : "transparent",
                  background:
                    result.status === "running"
                      ? "var(--aurora-info-surface)"
                      : "transparent",
                }}
              >
                <StatusIcon
                  className="size-4 shrink-0"
                  aria-hidden
                  style={{ color: meta.color }}
                />
                <span
                  className="truncate"
                  style={{
                    fontFamily: "var(--aurora-font-mono)",
                    fontSize: 14,
                    color: "var(--aurora-text-primary)",
                  }}
                >
                  {result.name}
                </span>
                <span
                  className="aurora-text-meta"
                  style={{
                    fontFamily: "var(--aurora-font-mono)",
                    justifySelf: "end",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  {result.duration ?? ""}
                </span>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Badge variant={meta.badge} dot={result.status === "running"}>
                    {meta.label}
                  </Badge>
                </div>
                {result.message ? (
                  <span
                    className="aurora-text-meta"
                    style={{ gridColumn: "2 / -1", color: "var(--aurora-text-muted)" }}
                  >
                    {result.message}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
TestResults.displayName = "TestResults"

export { TestResults }
