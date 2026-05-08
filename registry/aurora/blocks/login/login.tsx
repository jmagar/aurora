"use client"

import * as React from "react"

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
  const [focused, setFocused] = React.useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--aurora-text-muted)",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: "40px",
            padding: trailing ? "0 40px 0 14px" : "0 14px",
            background: "var(--aurora-control-surface)",
            border: `1px solid ${focused ? "var(--aurora-accent-primary)" : "var(--aurora-border-default)"}`,
            borderRadius: "10px",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "14px",
            color: "var(--aurora-text-primary)",
            outline: "none",
            boxShadow: focused ? `0 0 0 3px var(--aurora-focus-ring)` : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxSizing: "border-box",
          }}
        />
        {trailing && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--aurora-text-muted)",
            }}
          >
            {trailing}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Style D — Aurora glow border button
// ---------------------------------------------------------------------------

function GlowButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        height: "44px",
        borderRadius: "12px",
        background: hovered
          ? "color-mix(in srgb, var(--aurora-accent-primary) 15%, var(--aurora-panel-strong))"
          : "var(--aurora-panel-strong)",
        border: "1px solid " + (hovered ? "var(--aurora-accent-primary)" : "var(--aurora-border-strong)"),
        boxShadow: hovered ? "var(--aurora-active-glow)" : "none",
        color: "var(--aurora-accent-primary)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "14px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// OTP input — 6 boxes, auto-advance
// ---------------------------------------------------------------------------

function OtpInput({ onComplete }: { onComplete?: (otp: string) => void }) {
  const [digits, setDigits] = React.useState<string[]>(Array(6).fill(""))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "").slice(-1)
    const next = [...digits]
    next[index] = cleaned
    setDigits(next)

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    const full = next.join("")
    if (full.length === 6 && !full.includes("")) {
      onComplete?.(full)
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const next = [...digits]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setDigits(next)
    const focusIdx = Math.min(pasted.length, 5)
    inputRefs.current[focusIdx]?.focus()
    if (pasted.length === 6) onComplete?.(pasted)
  }

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`OTP digit ${i + 1}`}
          style={{
            width: "44px",
            height: "52px",
            textAlign: "center",
            fontFamily: "var(--aurora-font-mono)",
            fontSize: "20px",
            fontWeight: 700,
            color: digit ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
            background: "var(--aurora-control-surface)",
            border: `1.5px solid ${digit ? "var(--aurora-accent-primary)" : "var(--aurora-border-default)"}`,
            borderRadius: "10px",
            outline: "none",
            boxShadow: digit ? "var(--aurora-active-glow)" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            caretColor: "var(--aurora-accent-primary)",
          }}
        />
      ))}
    </div>
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
    <>
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
          <button
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
          </button>
        }
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
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
        </button>
      </div>

      <GlowButton type="submit" onClick={() => onSubmit?.({ email, password })}>
        Sign in
      </GlowButton>

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

      <button
        type="button"
        onClick={() => email && onMagicLink?.(email)}
        style={{
          width: "100%",
          height: "40px",
          borderRadius: "10px",
          background: "transparent",
          border: "1px solid var(--aurora-border-default)",
          color: "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "13px",
          cursor: "pointer",
          transition: "border-color 0.12s, color 0.12s",
        }}
      >
        Send magic link
      </button>
    </>
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
        <OtpInput onComplete={(otp) => onSubmit?.({ otp })} />
      </div>
      <GlowButton onClick={() => {}}>Verify</GlowButton>
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
