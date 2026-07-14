"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Confirmation } from "@/registry/aurora/blocks/ai/elements/confirmation"

export default function AiConfirmationDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / confirmation"
        heading="Confirmation"
        description="Approve / cancel gate for a risky action — intent icon, detail list, and a right-aligned action row, using the real registry implementation."
      />
      <section
        className="grid gap-4"
        style={{
          padding: "20px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <Confirmation
          intent="danger"
          title="Apply migration to prod?"
          description="This runs the following statements against the production database."
          confirmLabel="Run Migration"
          details={[
            "ALTER TABLE users ADD COLUMN seed int;",
            "CREATE INDEX idx_users_seed ON users(seed);",
            "DROP TABLE legacy_sessions;",
          ]}
        />
      </section>
    </div>
  )
}
