"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { InputOTP } from "@/registry/aurora/ui/input-otp"

export default function InputOTPDemo() {
  const [value, setValue] = React.useState("429")

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Form Elements"
        heading="Input OTP"
        description="One-time passcode entry with auto-advance, paste support, keyboard navigation, and grouped separators for 2FA and recovery flows."
      />
      <div
        style={{
          background: "var(--aurora-page-bg)",
          color: "var(--aurora-text-primary)",
          padding: "34px 30px",
          boxSizing: "border-box",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-default)",
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
          Enter 2FA Code
        </div>
        <InputOTP length={6} value={value} onChange={setValue} separatorAfter={3} />
      </div>
    </div>
  )
}
