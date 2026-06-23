"use client"

import * as React from "react"
import { Login } from "@/registry/aurora/blocks/auth/login/login"

// GitHub mark — matches the CD dsCard source 1:1
const GitHubIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 22 12.3C22 6.6 17.5 2 12 2Z" />
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
        title="Sign in"
        subtitle="Welcome back to the console."
        providers={[
          {
            label: "Continue with GitHub",
            icon: GitHubIcon,
            onClick: () => setLastEvent("Continue with GitHub"),
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
                setLastEvent("Request access")
              }}
              style={{
                color: "var(--aurora-accent-primary)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Request access
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
