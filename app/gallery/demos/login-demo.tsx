"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import { Login, LoginMode } from "@/registry/aurora/blocks/auth/login/login"

const MODES: { id: LoginMode; label: string }[] = [
  { id: "password",        label: "Password" },
  { id: "magic-link-sent", label: "Magic link sent" },
  { id: "2fa",             label: "2FA / OTP" },
]

export function LoginDemo() {
  const [mode, setMode] = React.useState<LoginMode>("password")
  const [lastEvent, setLastEvent] = React.useState<string | null>(null)

  function handleSubmit(data: { email?: string; password?: string; otp?: string }) {
    if (data.otp) {
      setLastEvent(`OTP submitted: ${data.otp}`)
    } else {
      setLastEvent(`Sign-in attempt — ${data.email ?? "no email"}`)
    }
  }

  function handleMagicLink(email: string) {
    setLastEvent(`Magic link requested for ${email}`)
    setMode("magic-link-sent")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 24px",
          borderBottom: "1px solid var(--aurora-border-default)",
          background: "var(--aurora-panel-strong)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--aurora-text-muted)",
            marginRight: "4px",
          }}
        >
          Mode:
        </span>
        {MODES.map((m) => {
          const active = mode === m.id
          return (
            <Button variant="plain" size="unstyled"
              key={m.id}
              onClick={() => { setMode(m.id); setLastEvent(null) }}
              style={{
                height: "28px",
                padding: "0 12px",
                borderRadius: "7px",
                border: active
                  ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"
                  : "1px solid var(--aurora-border-default)",
                background: active
                  ? "color-mix(in srgb, var(--aurora-accent-primary) 10%, transparent)"
                  : "transparent",
                color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "12px",
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {m.label}
            </Button>
          )
        })}

        {lastEvent && (
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--aurora-font-mono)",
              fontSize: "11px",
              color: "var(--aurora-success)",
              maxWidth: "280px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lastEvent}
          </span>
        )}
      </div>

      <div style={{ minHeight: "560px", position: "relative" }}>
        <Login mode={mode} onSubmit={handleSubmit} onMagicLink={handleMagicLink} />
      </div>
    </div>
  )
}

export default LoginDemo
