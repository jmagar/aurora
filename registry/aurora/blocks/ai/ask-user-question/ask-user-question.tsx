"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Textarea } from "@/registry/aurora/ui/textarea"

// ---------------------------------------------------------------------------
// Keyframes (React 19 deduplication via href)
// ---------------------------------------------------------------------------

const AUQ_KEYFRAMES = `
@keyframes aurora-auq-fadein {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuestionOption {
  id: string
  label: string
  description?: string
  /** Optional code snippet shown inside the card */
  preview?: string
}

export type QuestionType = "radio" | "multi" | "text"

export interface AskUserQuestionProps {
  question: string
  options?: QuestionOption[]
  type?: QuestionType
  onSubmit: (value: string | string[]) => void
  /** Placeholder for text input */
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Code preview panel inside an option card
// ---------------------------------------------------------------------------

function OptionCodePreview({ code }: { code: string }) {
  return (
    <pre
      style={{
        margin: "8px 0 0",
        padding: "8px 10px",
        borderRadius: "var(--aurora-radius-1)",
        background: "var(--aurora-bg)",
        border: "1px solid var(--aurora-border-default)",
        fontSize: 11,
        lineHeight: 1.6,
        fontFamily: "var(--aurora-font-mono)",
        color: "var(--aurora-text-primary)",
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        maxWidth: "100%",
      }}
    >
      <code>{code}</code>
    </pre>
  )
}

// ---------------------------------------------------------------------------
// Single option card
// ---------------------------------------------------------------------------

interface OptionCardProps {
  option: QuestionOption
  selected: boolean
  type: "radio" | "multi"
  onToggle: (id: string) => void
}

function OptionCard({ option, selected, type, onToggle }: OptionCardProps) {
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)

  const borderColor = selected
    ? "var(--aurora-accent-primary)"
    : focused
    ? "color-mix(in srgb, var(--aurora-accent-primary) 38%, var(--aurora-border-default))"
    : hovered
    ? "color-mix(in srgb, var(--aurora-accent-primary) 45%, var(--aurora-border-default))"
    : "var(--aurora-border-default)"

  const boxShadow = selected
    ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
    : focused
    ? "0 0 0 2px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent)"
    : hovered
    ? "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 15%, transparent)"
    : "none"

  const background = selected
    ? "color-mix(in srgb, var(--aurora-accent-primary) 7%, var(--aurora-panel-medium))"
    : hovered
    ? "var(--aurora-hover-bg)"
    : "var(--aurora-panel-medium)"

  return (
    <Button variant="plain" size="unstyled"
      type="button"
      role={type === "radio" ? "radio" : "checkbox"}
      aria-checked={selected}
      onClick={() => onToggle(option.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        width: "100%",
        padding: "12px 14px",
        borderRadius: "var(--aurora-radius-1)",
        border: `1.5px solid ${borderColor}`,
        background,
        cursor: "pointer",
        textAlign: "left",
        outline: "none",
        overflow: "hidden",
        transition: "border-color 150ms, background 150ms, box-shadow 150ms",
        boxShadow,
        animation: "aurora-auq-fadein 180ms ease both",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 10,
          bottom: 10,
          width: 3,
          borderRadius: "0 999px 999px 0",
          background: "var(--aurora-accent-primary)",
          opacity: selected ? 1 : hovered ? 0.45 : 0,
          transition: "opacity 150ms ease",
        }}
      />
      {/* Indicator */}
      <div
        style={{
          flexShrink: 0,
          marginTop: 2,
          width: 16,
          height: 16,
          borderRadius: type === "radio" ? "50%" : 4,
          border: selected
            ? "1.5px solid var(--aurora-accent-primary)"
            : "1.5px solid var(--aurora-border-strong)",
          background: selected ? "var(--aurora-accent-primary)" : "var(--aurora-control-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 150ms, border-color 150ms",
        }}
      >
        {selected && type === "radio" && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--aurora-accent-foreground)",
            }}
          />
        )}
        {selected && type === "multi" && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path
              d="M1.5 4L3.8 6.5L8.5 1.5"
              stroke="var(--aurora-accent-foreground)"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--aurora-text-primary)",
            fontFamily: "var(--aurora-font-sans)",
            lineHeight: 1.4,
          }}
        >
          {option.label}
        </p>
        {option.description && (
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 12,
              color: "var(--aurora-text-muted)",
              fontFamily: "var(--aurora-font-sans)",
              lineHeight: 1.55,
            }}
          >
            {option.description}
          </p>
        )}
        {option.preview && <OptionCodePreview code={option.preview} />}
      </div>
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Text input variant
// ---------------------------------------------------------------------------

function TextInput({
  placeholder,
  onSubmit,
}: {
  placeholder?: string
  onSubmit: (value: string) => void
}) {
  const [value, setValue] = React.useState("")
  const [focused, setFocused] = React.useState(false)

  function submit() {
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Textarea
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder ?? "Type your answer…"}
        style={{
          width: "100%",
          resize: "vertical",
          minHeight: 80,
          padding: "10px 12px",
          borderRadius: "var(--aurora-radius-1)",
          border: focused
            ? "1.5px solid var(--aurora-accent-primary)"
            : "1.5px solid var(--aurora-border-strong)",
          background: "var(--aurora-control-surface)",
          color: "var(--aurora-text-primary)",
          fontSize: 14,
          fontFamily: "var(--aurora-font-sans)",
          lineHeight: 1.6,
          outline: "none",
          transition: "border-color 150ms, box-shadow 150ms",
          boxShadow: focused
            ? [
                "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent)",
                "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 40%, transparent)",
              ].join(", ")
            : "none",
          boxSizing: "border-box",
        }}
      />
      <SubmitButton disabled={!value.trim()} onClick={submit} label="Submit" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Submit button
// ---------------------------------------------------------------------------

function SubmitButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <Button
      type="button"
      variant="aurora"
      size="default"
      disabled={disabled}
      onClick={onClick}
      style={{
        gap: 6,
        alignSelf: "flex-end",
      }}
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AskUserQuestion({
  question,
  options = [],
  type = "radio",
  onSubmit,
  placeholder,
  className,
  style,
}: AskUserQuestionProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  function toggleOption(id: string) {
    if (type === "radio") {
      setSelectedIds([id])
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      )
    }
  }

  function handleSubmit() {
    if (type === "multi") {
      onSubmit(selectedIds)
    } else {
      onSubmit(selectedIds[0] ?? "")
    }
  }

  const canSubmit =
    type === "text" ? true : selectedIds.length > 0

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
        width: "100%",
        ...style,
      }}
      role={type === "radio" ? "radiogroup" : undefined}
    >
      <style href="aurora-auq-keyframes" precedence="default">{AUQ_KEYFRAMES}</style>
      {/* Question */}
      <p
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "var(--aurora-text-primary)",
          fontFamily: "var(--aurora-font-sans)",
          lineHeight: 1.5,
        }}
      >
        {question}
      </p>

      {/* Text input */}
      {type === "text" ? (
        <TextInput placeholder={placeholder} onSubmit={(v) => onSubmit(v)} />
      ) : (
        <>
          {/* Option cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {options.map((opt, i) => (
              <div
                key={opt.id}
                style={{
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <OptionCard
                  option={opt}
                  selected={selectedIds.includes(opt.id)}
                  type={type}
                  onToggle={toggleOption}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SubmitButton
              onClick={handleSubmit}
              disabled={!canSubmit}
              label={type === "multi" ? `Confirm (${selectedIds.length})` : "Continue"}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default AskUserQuestion
