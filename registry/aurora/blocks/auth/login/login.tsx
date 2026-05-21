"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Input } from "@/registry/aurora/ui/input"
import { InputOTP } from "@/registry/aurora/ui/input-otp"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LoginMode = "password" | "magic-link-sent" | "2fa"

export interface LoginProps {
  mode?: LoginMode
  onSubmit?: (data: { email?: string; password?: string; otp?: string }) => void
  onMagicLink?: (email: string) => void
}

// ---------------------------------------------------------------------------
// Labby stacked-plane mark (same as terminal)
// ---------------------------------------------------------------------------

function LabbyMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 10 14"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path d="M5 0L9 2.5L5 5L1 2.5Z" fill="var(--aurora-accent-primary)" opacity="0.95" />
      <path d="M5 3L9 5.5L5 8L1 5.5Z" fill="var(--aurora-accent-primary)" opacity="0.75" />
      <path d="M5 6L9 8.5L5 11L1 8.5Z" fill="var(--aurora-accent-primary)" opacity="0.5" />
      <path d="M5 9L9 11.5L5 14L1 11.5Z" fill="var(--aurora-accent-primary)" opacity="0.28" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function EnvelopeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="9" width="32" height="22" rx="3" stroke="var(--aurora-accent-primary)" strokeWidth="1.8" opacity="0.6" />
      <path d="M4 13l16 10 16-10" stroke="var(--aurora-accent-primary)" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 4.2A6 6 0 0 1 8 4c3.9 0 7 4 7 4s-.9 1.5-2.3 2.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4.6 5.6C3.3 6.8 1 8 1 8s3.1 4 7 4a5.7 5.7 0 0 0 2.7-.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Shared input component
// ---------------------------------------------------------------------------

interface AuroraInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  trailing?: React.ReactNode
}

function AuroraInput({ id, label, type = "text", value, onChange, placeholder, autoComplete, trailing }: AuroraInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "12px",
          fontWeight: "var(--aurora-weight-label)" as React.CSSProperties["fontWeight"],
          letterSpacing: "var(--aurora-letter-label)",
          color: "var(--aurora-text-muted)",
        }}
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        endAdornment={trailing}
        className="h-10 rounded-[10px]"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Style D — Aurora glow border button
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// OTP input — 6 boxes, auto-advance
// ---------------------------------------------------------------------------

function OtpInput({ onComplete }: { onComplete?: (otp: string) => void }) {
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    if (value.length === 6) onComplete?.(value)
  }, [onComplete, value])

  return (
    <InputOTP length={6} value={value} onChange={setValue} className="justify-center gap-2.5" />
  )
}

// ---------------------------------------------------------------------------
// Password state view
// ---------------------------------------------------------------------------

function PasswordView({ onSubmit, onMagicLink }: LoginProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPw, setShowPw] = React.useState(false)

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.({ email, password }) }}
      style={{ display: "contents" }}
    >
      <AuroraInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <AuroraInput
        id="password"
        label="Password"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        autoComplete="current-password"
        trailing={
          <Button variant="plain" size="unstyled"
            type="button"
            onClick={() => setShowPw((p) => !p)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={showPw} />
          </Button>
        }
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="plain" size="unstyled"
          type="button"
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "12px",
            color: "var(--aurora-accent-primary)",
            cursor: "pointer",
            padding: 0,
            opacity: 0.8,
          }}
        >
          Forgot password?
        </Button>
      </div>

      <Button type="submit" variant="aurora" size="lg" style={{ width: "100%" }}>
        Sign in
      </Button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "4px 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--aurora-border-default)" }} />
        <span
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
          }}
        >
          or
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--aurora-border-default)" }} />
      </div>

      <Button
        type="button"
        variant="neutral"
        size="lg"
        onClick={() => email && onMagicLink?.(email)}
        style={{ width: "100%" }}
      >
        Send magic link
      </Button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Magic link sent view
// ---------------------------------------------------------------------------

function MagicLinkSentView() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "16px 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent)",
          border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 25%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EnvelopeIcon />
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--aurora-font-display)",
            fontSize: "18px",
            fontWeight: 800,
            color: "var(--aurora-text-primary)",
            marginBottom: "8px",
          }}
        >
          Check your email
        </div>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "13px",
            color: "var(--aurora-text-muted)",
            lineHeight: 1.5,
          }}
        >
          We sent a sign-in link to your email.
          <br />
          Check your inbox and click the link to continue.
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 2FA view
// ---------------------------------------------------------------------------

function TwoFactorView({ onSubmit }: LoginProps) {
  const [otp, setOtp] = React.useState("")

  function handleComplete(code: string) {
    setOtp(code)
    onSubmit?.({ otp: code })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "13px",
            color: "var(--aurora-text-muted)",
            marginBottom: "20px",
          }}
        >
          Enter the 6-digit code from your authenticator app.
        </div>
        <OtpInput onComplete={handleComplete} />
      </div>
      <Button
        type="button"
        variant="aurora"
        size="lg"
        disabled={otp.length < 6}
        onClick={() => otp.length === 6 && onSubmit?.({ otp })}
        style={{ width: "100%" }}
      >
        Verify
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Login component
// ---------------------------------------------------------------------------

export const Login = React.forwardRef<HTMLDivElement, LoginProps>(
  function Login({ mode = "password", onSubmit, onMagicLink }, ref) {
    const title =
      mode === "magic-link-sent"
        ? "Magic link sent"
        : mode === "2fa"
        ? "Two-factor auth"
        : "Sign in to Aurora"

    const subtitle =
      mode === "2fa"
        ? "Almost there"
        : mode === "magic-link-sent"
        ? ""
        : "Welcome back"

    return (
      <div
        ref={ref}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--aurora-shell-bg, var(--aurora-page-bg))",
          padding: "24px",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            background: "var(--aurora-panel-strong)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-3)",
            padding: "36px 32px 32px",
            boxShadow: "var(--aurora-shadow-strong)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Branding */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <LabbyMark size={32} />
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--aurora-font-display)",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--aurora-text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Aurora
              </div>
              {subtitle && (
                <div
                  style={{
                    fontFamily: "var(--aurora-font-sans)",
                    fontSize: "13px",
                    color: "var(--aurora-text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--aurora-text-primary)",
              }}
            >
              {title}
            </div>
          </div>

          {/* Mode content */}
          {mode === "magic-link-sent" ? (
            <MagicLinkSentView />
          ) : mode === "2fa" ? (
            <TwoFactorView onSubmit={onSubmit} />
          ) : (
            <PasswordView onSubmit={onSubmit} onMagicLink={onMagicLink} />
          )}
        </div>
      </div>
    )
  }
)

export default Login
