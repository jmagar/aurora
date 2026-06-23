"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Suggestion } from "@/registry/aurora/blocks/ai/elements/suggestion"

export default function AiSuggestionDemo() {
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI elements / suggestion"
        heading="Suggestion"
        description="Suggested next steps rendered as a stack of selectable Aurora actions, each with an optional description and badge."
      />
      <section
        style={{
          boxSizing: "border-box",
          padding: "26px 28px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          backgroundImage:
            "radial-gradient(520px 300px at 80% -20%, color-mix(in srgb, var(--aurora-accent-pink) 6%, transparent), transparent 60%)",
          boxShadow:
            "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
            color: "var(--aurora-text-muted)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--aurora-accent-strong)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
            <path d="M19 3v4M21 5h-4" />
          </svg>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Suggested next steps
          </span>
        </div>
        <Suggestion
          options={[
            {
              id: "1",
              title: "Show a worked example",
              description: "#[derive(Serialize)] on a real struct",
            },
            {
              id: "2",
              title: "Explain custom impls",
              description: "When derive isn’t enough",
              badge: "deep dive",
            },
            { id: "3", title: "Compare to serde_json" },
          ]}
        />
      </section>
    </div>
  )
}
