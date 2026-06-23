"use client"

import { InputOTP } from "@/registry/aurora/ui/input-otp"

export default function InputOTPDemo() {
  return (
    <div
      style={{
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        padding: "34px 30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
          margin: "0 0 12px",
        }}
      >
        Enter 2FA code
      </div>
      <InputOTP length={6} defaultValue="429" separatorAfter={3} />
    </div>
  )
}
