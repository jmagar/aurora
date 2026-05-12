"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Textarea } from "@/registry/aurora/ui/textarea"

export interface Attachment {
  id: string
  name: string
  type: "image" | "file"
  /** Data URL or object URL for images */
  url?: string
}

export interface SlashCommand {
  id: string
  label: string
  description?: string
}

export interface MentionItem {
  id: string
  label: string
  kind: "file" | "agent" | "folder"
}

export interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string, attachments: Attachment[]) => void
  onAddAttachment?: (attachment: Attachment) => void
  onStop?: () => void
  attachments?: Attachment[]
  onRemoveAttachment?: (id: string) => void
  model?: string
  onModelChange?: (model: string) => void
  isStreaming?: boolean
  placeholder?: string
  slashCommands?: SlashCommand[]
  mentionItems?: MentionItem[]
}

const DEFAULT_MODELS = [
  { id: "claude-opus-4-5", label: "Claude Opus 4.5" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
]

const DEFAULT_SLASH_COMMANDS: SlashCommand[] = [
  { id: "clear", label: "/clear", description: "Clear conversation" },
  { id: "search", label: "/search", description: "Search the web" },
  { id: "code", label: "/code", description: "Enter code mode" },
  { id: "plan", label: "/plan", description: "Generate a plan" },
  { id: "summarize", label: "/summarize", description: "Summarize context" },
]

const DEFAULT_MENTIONS: MentionItem[] = [
  { id: "src", label: "src/", kind: "folder" },
  { id: "readme", label: "README.md", kind: "file" },
  { id: "agent-coder", label: "Coder Agent", kind: "agent" },
  { id: "agent-reviewer", label: "Reviewer Agent", kind: "agent" },
]

function insertTrigger(current: string, char: string, setter: (v: string) => void) {
  const sep = current.length > 0 && !current.endsWith(" ") ? " " : ""
  setter(current + sep + char)
}

function AttachIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.5 7.5L7.5 13.5C6.1 14.9 3.9 14.9 2.5 13.5C1.1 12.1 1.1 9.9 2.5 8.5L9 2C9.9 1.1 11.3 1.1 12.2 2C13.1 2.9 13.1 4.3 12.2 5.2L6.2 11.2C5.8 11.6 5.2 11.6 4.8 11.2C4.4 10.8 4.4 10.2 4.8 9.8L10.5 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M7.5 1.5L7.5 13.5M7.5 1.5L3 6M7.5 1.5L12 6"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="8" height="8" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function FileIcon({ kind }: { kind: "file" | "agent" | "folder" }) {
  if (kind === "folder") {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M1 3.5C1 2.67 1.67 2 2.5 2H5L6.5 3.5H10.5C11.33 3.5 12 4.17 12 5V9.5C12 10.33 11.33 11 10.5 11H2.5C1.67 11 1 10.33 1 9.5V3.5Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    )
  }
  if (kind === "agent") {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 12C1.5 9.5 3.8 7.5 6.5 7.5C9.2 7.5 11.5 9.5 11.5 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2.5 1.5H7.5L10.5 4.5V11.5C10.5 12.05 10.05 12.5 9.5 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V2.5C1.5 1.95 1.95 1.5 2.5 1.5Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M7.5 1.5V4.5H10.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  onStop,
  attachments = [],
  onAddAttachment,
  onRemoveAttachment,
  model = "claude-sonnet-4-6",
  onModelChange,
  isStreaming = false,
  placeholder = "Ask anything…",
  slashCommands = DEFAULT_SLASH_COMMANDS,
  mentionItems = DEFAULT_MENTIONS,
}: PromptInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const objectUrlsRef = React.useRef<string[]>([])
  const blurTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevAttachmentsRef = React.useRef<Attachment[]>(attachments)

  const [isFocused, setIsFocused] = React.useState(false)
  const [showModelMenu, setShowModelMenu] = React.useState(false)

  const [slashOpen, setSlashOpen] = React.useState(false)
  const [slashQuery, setSlashQuery] = React.useState("")
  const [slashIndex, setSlashIndex] = React.useState(0)

  const [mentionOpen, setMentionOpen] = React.useState(false)
  const [mentionQuery, setMentionQuery] = React.useState("")
  const [mentionIndex, setMentionIndex] = React.useState(0)
  const [selectedMentions, setSelectedMentions] = React.useState<MentionItem[]>([])

  React.useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [value])

  // Revoke object URLs when parent removes attachments to prevent silent memory leaks
  React.useEffect(() => {
    const prev = prevAttachmentsRef.current
    const currentIds = new Set(attachments.map((c) => c.id))
    const removed = prev.filter((p) => !currentIds.has(p.id))
    removed.forEach((att) => {
      if (att.url) {
        URL.revokeObjectURL(att.url)
        objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== att.url)
      }
    })
    prevAttachmentsRef.current = attachments
  }, [attachments])

  const filteredSlash = slashCommands.filter((c) =>
    c.label.toLowerCase().includes(slashQuery.toLowerCase())
  )
  const filteredMentions = mentionItems.filter(
    (m) =>
      m.label.toLowerCase().includes(mentionQuery.toLowerCase()) &&
      !selectedMentions.find((s) => s.id === m.id)
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Slash popup nav
    if (slashOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSlashIndex((i) => (i + 1) % Math.max(filteredSlash.length, 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSlashIndex((i) => (i - 1 + filteredSlash.length) % Math.max(filteredSlash.length, 1))
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        const cmd = filteredSlash[slashIndex]
        if (cmd) insertSlashCommand(cmd)
        return
      }
      if (e.key === "Escape") {
        setSlashOpen(false)
        return
      }
    }

    // Mention popup nav
    if (mentionOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setMentionIndex((i) => (i + 1) % Math.max(filteredMentions.length, 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setMentionIndex((i) => (i - 1 + filteredMentions.length) % Math.max(filteredMentions.length, 1))
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        const item = filteredMentions[mentionIndex]
        if (item) insertMention(item)
        return
      }
      if (e.key === "Escape") {
        setMentionOpen(false)
        return
      }
    }

    // Submit on Enter (no shift)
    if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value
    onChange(v)

    // Detect / trigger
    const slashMatch = v.match(/(?:^|\s)\/(\w*)$/)
    if (slashMatch) {
      setSlashQuery(slashMatch[1])
      setSlashIndex(0)
      setSlashOpen(true)
      setMentionOpen(false)
    } else {
      setSlashOpen(false)
    }

    // Detect @ trigger
    const mentionMatch = v.match(/@(\w*)$/)
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1])
      setMentionIndex(0)
      setMentionOpen(true)
      setSlashOpen(false)
    } else {
      setMentionOpen(false)
    }
  }

  function insertSlashCommand(cmd: SlashCommand) {
    const newVal = value.replace(/(?:^|\s)\/\w*$/, (m) => m.replace(/\/\w*$/, cmd.label))
    onChange(newVal)
    setSlashOpen(false)
    textareaRef.current?.focus()
  }

  function insertMention(item: MentionItem) {
    setSelectedMentions((prev) => [...prev, item])
    const newVal = value.replace(/@\w*$/, "")
    onChange(newVal)
    setMentionOpen(false)
    textareaRef.current?.focus()
  }

  function removeMention(id: string) {
    setSelectedMentions((prev) => prev.filter((m) => m.id !== id))
  }

  function handleSubmit() {
    if (!value.trim() && attachments.length === 0) return
    onSubmit(value, attachments)
    setSelectedMentions([])
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    // In a real app this would upload; here we just demonstrate the chip pattern
    const files = Array.from(e.target.files ?? [])
    files.forEach((f) => {
      const isImage = f.type.startsWith("image/")
      let url: string | undefined
      if (isImage) {
        try {
          url = URL.createObjectURL(f)
          objectUrlsRef.current.push(url)
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("[Aurora PromptInput] Failed to create object URL for image:", f.name, err)
          }
          return
        }
      }
      const att: Attachment = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name}`,
        name: f.name,
        type: isImage ? "image" : "file",
        url,
      }
      onAddAttachment?.(att)
    })
    e.target.value = ""
  }

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current)
    }
  }, [])

  const modelLabel = DEFAULT_MODELS.find((m) => m.id === model)?.label ?? model

  const containerBoxShadow = isFocused
    ? [
        "0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent)",
        "0 0 0 3px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent)",
        "var(--aurora-shadow-medium)",
      ].join(", ")
    : "var(--aurora-shadow-medium)"

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Popups */}
      {slashOpen && filteredSlash.length > 0 && (
        <div
          role="listbox"
          aria-label="Slash commands"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            width: "280px",
            background: "var(--aurora-panel-strong)",
            border: "1px solid var(--aurora-border-strong)",
            borderRadius: "var(--aurora-radius-2)",
            boxShadow: "var(--aurora-shadow-strong)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "6px 10px 4px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--aurora-text-muted)",
              borderBottom: "1px solid var(--aurora-border-default)",
            }}
          >
            Commands
          </div>
          {filteredSlash.map((cmd, i) => (
            <Button variant="plain" size="unstyled"
              key={cmd.id}
              role="option"
              aria-selected={i === slashIndex}
              onClick={() => insertSlashCommand(cmd)}
              onMouseEnter={() => setSlashIndex(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "7px 12px",
                background: i === slashIndex ? "var(--aurora-hover-bg)" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                borderLeft: i === slashIndex ? "2px solid var(--aurora-accent-violet)" : "2px solid transparent",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--aurora-font-mono)",
                  fontSize: "13px",
                  color: "var(--aurora-accent-violet)",
                  minWidth: "90px",
                }}
              >
                {cmd.label}
              </span>
              {cmd.description && (
                <span style={{ fontSize: "12px", color: "var(--aurora-text-muted)" }}>
                  {cmd.description}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      {mentionOpen && filteredMentions.length > 0 && (
        <div
          role="listbox"
          aria-label="Mentions"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            width: "260px",
            background: "var(--aurora-panel-strong)",
            border: "1px solid var(--aurora-border-strong)",
            borderRadius: "var(--aurora-radius-2)",
            boxShadow: "var(--aurora-shadow-strong)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "6px 10px 4px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--aurora-text-muted)",
              borderBottom: "1px solid var(--aurora-border-default)",
            }}
          >
            Mention
          </div>
          {filteredMentions.map((item, i) => (
            <Button variant="plain" size="unstyled"
              key={item.id}
              role="option"
              aria-selected={i === mentionIndex}
              onClick={() => insertMention(item)}
              onMouseEnter={() => setMentionIndex(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "7px 12px",
                background: i === mentionIndex ? "var(--aurora-hover-bg)" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                borderLeft: i === mentionIndex ? "2px solid var(--aurora-accent-violet)" : "2px solid transparent",
                color: "var(--aurora-text-primary)",
              }}
            >
              <span style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }}>
                <FileIcon kind={item.kind} />
              </span>
              <span style={{ fontSize: "13px" }}>{item.label}</span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "10px",
                  color: "var(--aurora-text-muted)",
                  textTransform: "capitalize",
                }}
              >
                {item.kind}
              </span>
            </Button>
          ))}
        </div>
      )}

      {/* Model selector dropdown */}
      {showModelMenu && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            right: 0,
            width: "220px",
            background: "var(--aurora-panel-strong)",
            border: "1px solid var(--aurora-border-strong)",
            borderRadius: "var(--aurora-radius-2)",
            boxShadow: "var(--aurora-shadow-strong)",
            zIndex: 50,
            overflow: "hidden",
            padding: "4px",
          }}
        >
          {DEFAULT_MODELS.map((m) => (
            <Button variant="plain" size="unstyled"
              key={m.id}
              onClick={() => {
                onModelChange?.(m.id)
                setShowModelMenu(false)
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "7px 10px",
                background: m.id === model ? "var(--aurora-hover-bg)" : "transparent",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                color: m.id === model ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
                fontWeight: m.id === model ? 600 : 400,
              }}
            >
              {m.label}
            </Button>
          ))}
        </div>
      )}

      {/* Main container */}
      <div
        style={{
          background: "var(--aurora-panel-medium)",
          border: "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-2)",
          boxShadow: containerBoxShadow,
          transition: "box-shadow 0.15s ease-out",
          overflow: "hidden",
        }}
      >
        {/* Mention chips row */}
        {selectedMentions.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              padding: "8px 12px 0",
            }}
          >
            {selectedMentions.map((m) => (
              <span
                key={m.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px 2px 6px",
                  background: "var(--aurora-accent-violet-surface)",
                  border: "1px solid var(--aurora-accent-violet-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--aurora-accent-violet)",
                  fontWeight: 500,
                }}
              >
                <FileIcon kind={m.kind} />
                {m.label}
                <Button variant="plain" size="unstyled"
                  onClick={() => removeMention(m.id)}
                  aria-label={`Remove ${m.label}`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 0 0 2px",
                    color: "var(--aurora-text-muted)",
                    fontSize: "11px",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ×
                </Button>
              </span>
            ))}
          </div>
        )}

        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              padding: "8px 12px 0",
            }}
          >
            {attachments.map((att) => (
              <div
                key={att.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: att.type === "image" ? "2px 8px 2px 2px" : "3px 8px",
                  background: "var(--aurora-control-surface)",
                  border: "1px solid var(--aurora-border-default)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "var(--aurora-text-primary)",
                  maxWidth: "180px",
                }}
              >
                {att.type === "image" && att.url ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "6px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <span style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }}>
                    <FileIcon kind="file" />
                  </span>
                )}
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                  }}
                >
                  {att.name}
                </span>
                {onRemoveAttachment && (
                  <Button variant="plain" size="unstyled"
                    onClick={() => {
                      if (att.url) {
                        URL.revokeObjectURL(att.url)
                        objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== att.url)
                      }
                      onRemoveAttachment(att.id)
                    }}
                    aria-label={`Remove ${att.name}`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--aurora-text-muted)",
                      padding: "0",
                      fontSize: "13px",
                      lineHeight: 1,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            // Delay close so click events on popups register first
            if (blurTimerRef.current) clearTimeout(blurTimerRef.current)
            blurTimerRef.current = setTimeout(() => {
              setSlashOpen(false)
              setMentionOpen(false)
              setShowModelMenu(false)
            }, 150)
          }}
          disabled={isStreaming}
          placeholder={isStreaming ? "Generating…" : placeholder}
          autoResize
          rows={1}
          aria-label="Prompt input"
          className="border-none focus-visible:outline-none"
          style={{
            display: "block",
            width: "100%",
            resize: "none",
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "12px 14px 4px",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "var(--aurora-text-primary)",
            fontFamily: "inherit",
            minHeight: "44px",
            maxHeight: "200px",
            overflowY: "auto",
            caretColor: "var(--aurora-accent-primary)",
          }}
        />

        {/* Bottom toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 10px 8px",
          }}
        >
          {/* Attach */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
            title="Attach file"
          >
            <AttachIcon />
          </ToolbarButton>

          {/* Slash command trigger */}
          <ToolbarButton
            onClick={() => {
              insertTrigger(value, "/", onChange)
              setSlashQuery("")
              setSlashIndex(0)
              setSlashOpen(true)
              setMentionOpen(false)
              setShowModelMenu(false)
              textareaRef.current?.focus()
            }}
            aria-label="Slash commands"
            title="Commands"
            style={{ fontFamily: "var(--aurora-font-mono)", fontSize: "13px", fontWeight: 600 }}
          >
            /
          </ToolbarButton>

          {/* Mention trigger */}
          <ToolbarButton
            onClick={() => {
              insertTrigger(value, "@", onChange)
              setMentionQuery("")
              setMentionIndex(0)
              setMentionOpen(true)
              setSlashOpen(false)
              setShowModelMenu(false)
              textareaRef.current?.focus()
            }}
            aria-label="Mention"
            title="Mention file or agent"
            style={{ fontFamily: "var(--aurora-font-mono)", fontSize: "13px", fontWeight: 600 }}
          >
            @
          </ToolbarButton>

          {/* Model selector pill */}
          <Button
            type="button"
            variant="neutral"
            size="sm"
            onClick={() => setShowModelMenu((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={showModelMenu}
            style={{
              gap: "5px",
              fontSize: "11px",
              marginLeft: "2px",
            }}
          >
            {modelLabel}
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M2 3.5L4.5 6L7 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Stop button (streaming) */}
          {isStreaming && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onStop}
              aria-label="Stop generation"
              style={{ flexShrink: 0 }}
            >
              <StopIcon />
            </Button>
          )}

          {/* Send button */}
          {!isStreaming && (
            <Button
              type="button"
              variant="rose"
              size="icon"
              onClick={handleSubmit}
              disabled={!value.trim() && attachments.length === 0}
              aria-label="Send message"
              style={{ flexShrink: 0 }}
            >
              <SendIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  children,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      {...props}
      type="button"
      variant="ghost"
      size="icon"
      style={{
        width: 28,
        height: 28,
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </Button>
  )
}

export default PromptInput
