"use client"

import * as React from "react"
import { Mic, Square } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { Textarea } from "@/registry/aurora/ui/textarea"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// SpeechInput — voice capture: mic toggle, live level meter, transcript area.
//
// CD parity: a raised navy panel with a rose ("LISTENING") status, a pink mic
// glyph, a pulsing rose status dot, a row of rose pill bars that animate as a
// live level meter while recording, a neutral icon Stop/Mic toggle, and a
// transcript Textarea. Rose is the Aurora secondary accent for recording state;
// AI/automation identity remains Axon orange elsewhere.
//
// Architecture stays shadcn: forwardRef to the underlying <textarea> (so the
// public TextareaHTMLAttributes API is preserved), displayName, React.memo, and
// the Button escape hatches (variant="neutral" size="icon"). Recording state is
// uncontrolled (defaultRecording) and toggled by the header button.
// ---------------------------------------------------------------------------

const ROSE = "var(--aurora-accent-pink)"

// 14 pill bars. Relative heights (0..1) drive the live meter while recording.
const BAR_LEVELS = [0.4, 0.62, 0.5, 0.78, 0.46, 1, 0.84, 0.58, 0.7, 0.94, 0.66, 0.52, 0.74, 0.34]

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

export interface SpeechInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Start in the recording (listening) state — shows the live meter + LISTENING status. */
  defaultRecording?: boolean
}

const SpeechInput = function SpeechInput({ ref, className, style, defaultRecording = false, ...props }: SpeechInputProps & { ref?: React.Ref<HTMLTextAreaElement> }) {
    const [recording, setRecording] = React.useState(defaultRecording)

    return (
      <div
        style={{
          display: "grid",
          gap: "13px",
          padding: "16px 18px",
          borderRadius: "var(--aurora-radius-1)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-surface-raised)",
          boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        }}
      >
        {/* Header — mic glyph + title + LISTENING status, stop/mic toggle on the right */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <Mic size={18} strokeWidth={1.8} aria-hidden="true" style={{ color: ROSE, flexShrink: 0 }} />

          <span
            style={{
              fontSize: "15px",
              fontWeight: "var(--aurora-weight-heading)",
              letterSpacing: "var(--aurora-letter-ui)",
              color: "var(--aurora-text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            Speech Input
          </span>

          {recording && (
            <span
              aria-live="polite"
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", marginLeft: "2px" }}
            >
              <span
                className="aurora-speech-dot"
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: ROSE,
                  flexShrink: 0,
                  animation: "aurora-speech-dot 1.4s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: "var(--aurora-type-label)",
                  fontWeight: "var(--aurora-weight-label)",
                  letterSpacing: "var(--aurora-letter-eyebrow)",
                  textTransform: "uppercase",
                  color: ROSE,
                  whiteSpace: "nowrap",
                }}
              >
                Listening
              </span>
            </span>
          )}

          <Button
            type="button"
            variant="neutral"
            size="icon"
            onClick={() => setRecording((r) => !r)}
            aria-pressed={recording}
            aria-label={recording ? "Stop recording" : "Start recording"}
            style={{ marginLeft: "auto", flexShrink: 0 }}
          >
            {recording ? (
              <Square size={15} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Mic size={15} strokeWidth={2} aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Live level meter — row of rose pill bars */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "20px",
            opacity: recording ? 1 : 0.4,
            transition: "opacity 200ms var(--motion-ease-out)",
          }}
        >
          {BAR_LEVELS.map((level, i) => (
            <span
              key={i}
              className="aurora-speech-bar"
              style={{
                flex: 1,
                height: "12px",
                borderRadius: "999px",
                background: "var(--aurora-rose-gradient)",
                transformOrigin: "center",
                transform: recording ? undefined : `scaleY(${0.42 + level * 0.18})`,
                animation: recording
                  ? `aurora-speech-meter ${0.7 + level * 0.6}s var(--motion-ease-in-out) ${i * 0.06}s infinite`
                  : "none",
              }}
            />
          ))}
        </div>

        {/* Transcript */}
        <Textarea
          ref={ref}
          className={cn("min-h-20 resize-none", className)}
          style={{ borderRadius: "12px", ...style }}
          {...props}
        />
      </div>
    )
  }

SpeechInput.displayName = "SpeechInput"

const MemoSpeechInput = React.memo(SpeechInput)
MemoSpeechInput.displayName = "SpeechInput"

export { MemoSpeechInput as SpeechInput }
export default MemoSpeechInput
