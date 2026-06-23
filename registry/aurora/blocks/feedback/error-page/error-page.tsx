"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ErrorPageProps {
  code: 404 | 403 | 500
  path?: string
  incidentId?: string
  onRetry?: () => void
  countdown?: number
}

// ---------------------------------------------------------------------------
// Shared button style (Aurora glow border)
// ---------------------------------------------------------------------------

function ActionButton({
  children,
  onClick,
  href,
  variant = "primary",
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: "primary" | "ghost"
}) {
  const buttonVariant = variant === "primary" ? "aurora" : "neutral"

  if (href) {
    return (
      <Button
        asChild
        variant={buttonVariant}
        size="lg"
      >
        <a href={href}>
          {children}
        </a>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant={buttonVariant}
      size="lg"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Large code display (operator-first — no illustrations)
// ---------------------------------------------------------------------------

function ErrorCode({ code, color }: { code: number; color: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--aurora-font-display)",
        fontSize: "clamp(72px, 12vw, 120px)",
        fontWeight: 800,
        color,
        lineHeight: 1,
        letterSpacing: "-0.04em",
        opacity: 0.18,
        userSelect: "none",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      {code}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mono chip (path, incident ID)
// ---------------------------------------------------------------------------

function MonoChip({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "6px",
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-default)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: "12px",
        color: "var(--aurora-text-muted)",
        wordBreak: "break-all",
      }}
    >
      {children}
    </code>
  )
}

// ---------------------------------------------------------------------------
// Countdown ring — animated SVG circle
// ---------------------------------------------------------------------------

function CountdownRing({
  countdown,
  total,
}: {
  countdown: number
  total: number
}) {
  const radius = 18
  const circ = 2 * Math.PI * radius
  const progress = Math.max(0, countdown / total)

  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Track */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="var(--aurora-border-default)"
        strokeWidth="3"
      />
      {/* Progress */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="var(--aurora-accent-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        transform="rotate(-90 22 22)"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      {/* Number */}
      <text
        x="22"
        y="22"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--aurora-accent-primary)"
        fontFamily="var(--aurora-font-mono)"
        fontSize="13"
        fontWeight="700"
      >
        {countdown}
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// 404 page
// ---------------------------------------------------------------------------

function Page404({ path, onRetry }: ErrorPageProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
      <div style={{ position: "relative", width: "100%", height: "80px", marginBottom: "8px" }}>
        <ErrorCode code={404} color="var(--aurora-accent-primary)" />
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--aurora-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}
        >
          Not found
        </div>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "14px",
            color: "var(--aurora-text-muted)",
            lineHeight: 1.6,
          }}
        >
          The resource you were looking for doesn&apos;t exist or has been moved.
        </div>
      </div>

      {path && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              color: "var(--aurora-text-muted)",
            }}
          >
            Requested path
          </span>
          <MonoChip>{path}</MonoChip>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <ActionButton href="/" variant="primary">Go home</ActionButton>
        {onRetry && <ActionButton onClick={onRetry} variant="ghost">Try again</ActionButton>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 403 page
// ---------------------------------------------------------------------------

function Page403({ path }: ErrorPageProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
      <div style={{ position: "relative", width: "100%", height: "80px", marginBottom: "8px" }}>
        <ErrorCode code={403} color="var(--aurora-error)" />
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--aurora-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}
        >
          Access denied
        </div>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "14px",
            color: "var(--aurora-text-muted)",
            lineHeight: 1.6,
          }}
        >
          You don&apos;t have permission to access this resource.
          <br />
          If you believe this is an error, please contact your administrator.
        </div>
      </div>

      {path && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              color: "var(--aurora-text-muted)",
            }}
          >
            Restricted path
          </span>
          <MonoChip>{path}</MonoChip>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <ActionButton href="/" variant="primary">Go home</ActionButton>
        <ActionButton href="mailto:support@example.com" variant="ghost">Contact support</ActionButton>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 500 page with auto-retry countdown
// ---------------------------------------------------------------------------

function Page500({ incidentId, onRetry, countdown: initialCountdown = 30 }: ErrorPageProps) {
  const [countdown, setCountdown] = React.useState(initialCountdown)
  const [retrying, setRetrying] = React.useState(false)
  const total = initialCountdown

  React.useEffect(() => {
    if (retrying || countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          if (onRetry) {
            setRetrying(true)
            onRetry()
          }
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, retrying, onRetry])

  function handleManualRetry() {
    setRetrying(true)
    onRetry?.()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
      <div style={{ position: "relative", width: "100%", height: "80px", marginBottom: "8px" }}>
        <ErrorCode code={500} color="var(--aurora-error)" />
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--aurora-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}
        >
          Something went wrong
        </div>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "14px",
            color: "var(--aurora-text-muted)",
            lineHeight: 1.6,
          }}
        >
          An internal error occurred. Our team has been notified.
        </div>
      </div>

      {incidentId && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              color: "var(--aurora-text-muted)",
            }}
          >
            Incident ID
          </span>
          <MonoChip>{incidentId}</MonoChip>
        </div>
      )}

      {/* Countdown + retry */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {onRetry && countdown > 0 && !retrying && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "13px",
              color: "var(--aurora-text-muted)",
            }}
          >
            <CountdownRing countdown={countdown} total={total} />
            <span>Retrying automatically in {countdown}s</span>
          </div>
        )}

        {retrying && (
          <div
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "13px",
              color: "var(--aurora-accent-primary)",
            }}
          >
            Retrying…
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {onRetry && !retrying && (
            <ActionButton onClick={handleManualRetry} variant="primary">
              Retry now
            </ActionButton>
          )}
          <ActionButton href="/" variant="ghost">Go home</ActionButton>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main ErrorPage component
// ---------------------------------------------------------------------------

export const ErrorPage = React.forwardRef<HTMLDivElement, ErrorPageProps>(
  function ErrorPage(props, ref) {
    const { code } = props

    return (
      <div
        ref={ref}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--aurora-shell-bg, var(--aurora-page-bg))",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            padding: "48px 32px",
            // Opaque→opaque vertical gradient (lit top, deep base) — matches CD's
            // panel-strong tier. Both stops are opaque tokens so there is no
            // translucent-over-opaque seam.
            background:
              "linear-gradient(180deg, var(--aurora-panel-strong-top) 0%, var(--aurora-panel-strong) 100%)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-3)",
            boxShadow: "var(--aurora-shadow-strong)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {code === 404 && <Page404 {...props} />}
          {code === 403 && <Page403 {...props} />}
          {code === 500 && <Page500 {...props} />}
        </div>
      </div>
    )
  }
)

export default ErrorPage
