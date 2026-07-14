"use client"

import * as React from "react"
import { Login } from "@/registry/aurora/blocks/auth/login/login"

// Google mark — 4-color "G"
const GoogleIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3 0-5.6-2-6.6-4.8H1.4v3A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.4 14.5a7.2 7.2 0 0 1 0-4.6v-3H1.4a12 12 0 0 0 0 10.6l4-3Z" />
    <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3A12 12 0 0 0 1.4 6.9l4 3C6.4 6.8 9 4.8 12 4.8Z" />
  </svg>
)

export function LoginDemo() {
  const [lastEvent, setLastEvent] = React.useState<string | null>(null)

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        padding: "40px 16px",
        minHeight: "520px",
        // Radial cyan wash behind the card, matching the CD dsCard frame
        backgroundImage:
          "radial-gradient(700px 420px at 50% -10%, color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent), transparent 60%)",
      }}
    >
      <Login
        title="Sign In"
        subtitle="Welcome back to the console."
        providers={[
          {
            label: "Continue with Google",
            icon: GoogleIcon,
            onClick: () => setLastEvent("Continue with Google"),
          },
        ]}
        onSubmit={(data) =>
          setLastEvent(`Sign-in attempt — ${data.email ?? "no email"}`)
        }
        footer={
          <span>
            No account?{" "}
            <a
              href="#request-access"
              onClick={(e) => {
                e.preventDefault()
                setLastEvent("Request Access")
              }}
              style={{
                color: "var(--aurora-accent-primary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Request Access
            </a>
          </span>
        }
      />

      {lastEvent && (
        <span
          aria-live="polite"
          style={{
            marginTop: "16px",
            fontFamily: "var(--aurora-font-mono)",
            fontSize: "11px",
            color: "var(--aurora-success)",
          }}
        >
          {lastEvent}
        </span>
      )}
    </div>
  )
}

export default LoginDemo
