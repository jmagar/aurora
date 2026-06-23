"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { JsxPreview } from "@/registry/aurora/blocks/ai/elements/jsx-preview"

const DEPLOY_BUTTON = `export function DeployButton({ env }) {
  return (
    <Button variant="aurora" onClick={() => deploy(env)}>
      Deploy to {env}
    </Button>
  );
}`

export default function AiJsxPreviewDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / jsx-preview"
        heading="JsxPreview"
        description="JSX code surface — filename header, language pill, line numbers, and copy-to-clipboard."
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
        <JsxPreview filename="DeployButton.jsx" code={DEPLOY_BUTTON} />
      </section>
    </div>
  )
}
