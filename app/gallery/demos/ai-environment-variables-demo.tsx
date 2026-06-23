"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { EnvironmentVariables } from "@/registry/aurora/blocks/ai/elements/environment-variables"

const variables = [
  { key: "DATABASE_URL", value: "postgres://localhost:5432/labby", required: true },
  { key: "GATEWAY_PORT", value: "8080" },
  { key: "API_TOKEN", value: "ghp_aZ19x7Qm2", secret: true, required: true },
]

export default function AiEnvironmentVariablesDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / environment-variables"
        heading="Environment variables"
        description="Env vars — reveal secrets, per-row copy, required/secret tagging."
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
        <EnvironmentVariables variables={variables} />
      </section>
    </div>
  )
}
