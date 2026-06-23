"use client"

import * as React from "react"
import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { Action } from "@/registry/aurora/blocks/ai/elements/action"

function Icon({ paths }: { paths: React.ReactNode }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths}
    </svg>
  )
}

const CopyIcon = (
  <Icon
    paths={
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    }
  />
)

const RefreshIcon = (
  <Icon
    paths={
      <>
        <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.7 3L3 8" />
        <path d="M3 3v5h5" />
      </>
    }
  />
)

const ThumbIcon = (
  <Icon
    paths={
      <>
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </>
    }
  />
)

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono, monospace)",
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--aurora-text-muted)",
        marginBottom: 11,
      }}
    >
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {children}
    </div>
  )
}

export default function AiActionDemo() {
  const [good, setGood] = React.useState(true)
  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Action"
        description="A quiet, icon-first action button for AI message affordances — copy, retry, thumbs-up — with icon-only, icon + text, pressed, and small variants."
      />
      <section
        style={{
          boxSizing: "border-box",
          width: "100%",
          maxWidth: 440,
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          gap: 30,
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
          boxShadow:
            "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
        }}
      >
        <div>
          <Caption>Icon only · default</Caption>
          <Row>
            <Action aria-label="Copy">{CopyIcon}</Action>
            <Action aria-label="Retry">{RefreshIcon}</Action>
            <Action
              aria-label="Good"
              pressed={good}
              onClick={() => setGood((g) => !g)}
            >
              {ThumbIcon}
            </Action>
          </Row>
        </div>

        <div>
          <Caption>Icon + text</Caption>
          <Row>
            <Action label="Copy">{CopyIcon}</Action>
            <Action label="Retry">{RefreshIcon}</Action>
            <Action label="Good">{ThumbIcon}</Action>
          </Row>
        </div>

        <div>
          <Caption>Small · sm</Caption>
          <Row>
            <Action size="sm" aria-label="Copy">
              {CopyIcon}
            </Action>
            <Action size="sm" aria-label="Retry">
              {RefreshIcon}
            </Action>
            <Action size="sm" label="Retry">
              {RefreshIcon}
            </Action>
          </Row>
        </div>
      </section>
    </div>
  )
}
