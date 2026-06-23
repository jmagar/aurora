"use client"

import * as React from "react"
import { AlertDialog } from "@/registry/aurora/ui/alert-dialog"

const heading: React.CSSProperties = {
  color: "var(--aurora-text-primary)",
  fontFamily: "var(--aurora-font-display)",
  fontSize: 22,
  fontWeight: 760,
  lineHeight: 1.2,
  marginBottom: 6,
}

const copy: React.CSSProperties = {
  color: "var(--aurora-text-muted)",
  fontSize: 13,
  lineHeight: 1.55,
}

export default function AlertDialogDemo() {
  return (
    <div style={{ display: "grid", gap: 24, padding: 0 }}>
      <div>
        <h2 style={heading}>Alert Dialog</h2>
        <p style={copy}>
          Confirmation surface for destructive or high-friction decisions.
        </p>
      </div>

      <div style={{ maxWidth: 520 }}>
        <AlertDialog
          destructive
          title="Delete environment?"
          description="This removes prod-edge-3 and its 7 gateways. This cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  )
}
