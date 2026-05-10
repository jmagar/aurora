"use client"

import * as React from "react"
import {
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  CircleAlert,
  CircleDashed,
  ExternalLink,
  FileCode2,
  FileText,
  FlaskConical,
  GitCommitHorizontal,
  KeyRound,
  Layers3,
  ListChecks,
  Mic,
  Network,
  Package,
  Play,
  Route,
  Save,
  Send,
  Sparkles,
  UserRound,
  Workflow,
  X,
  XCircle,
} from "lucide-react"
import { Avatar as AuroraAvatar } from "@/registry/aurora/ui/avatar"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"
import { NativeSelect } from "@/registry/aurora/ui/native-select"
import { Separator } from "@/registry/aurora/ui/separator"
import { Spinner } from "@/registry/aurora/ui/spinner"
import { Textarea } from "@/registry/aurora/ui/textarea"

export interface MessageProps extends React.HTMLAttributes<HTMLElement> {
  role?: "assistant" | "user" | "system"
}

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  tone?: "cyan" | "rose" | "muted"
}

export interface SourcesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
}

export interface SourceItem {
  title: string
  href?: string
  description?: string
  badge?: string
}

export interface SourceProps extends React.HTMLAttributes<HTMLAnchorElement> {
  source: SourceItem
}

export interface InlineCitationProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  index: number
}

export interface AgentTask {
  id: string
  title: string
  description?: string
  status: "queued" | "running" | "completed" | "failed"
}

export interface TaskListProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: AgentTask[]
}

export interface TestResult {
  name: string
  status: "passed" | "failed" | "skipped" | "running"
  duration?: string
  message?: string
}

export interface TestResultsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "results"> {
  results: TestResult[]
}

export interface StackFrame {
  file: string
  line?: number
  column?: number
  label?: string
}

export interface StackTraceProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  frames: StackFrame[]
}

export interface EnvironmentVariable {
  key: string
  value?: string
  secret?: boolean
  required?: boolean
}

export interface EnvironmentVariablesProps extends React.HTMLAttributes<HTMLDivElement> {
  variables: EnvironmentVariable[]
}

export interface CheckpointProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: string
}

export interface ConfirmationProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
}

export interface ContextPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SourceItem[]
}

export type ConversationProps = React.HTMLAttributes<HTMLDivElement>

export interface ModelSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  models: string[]
}

export interface QueueProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: AgentTask[]
}

export type SuggestionProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface AgentProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  role?: string
  status?: "idle" | "running" | "blocked"
}

export interface CommitProps extends React.HTMLAttributes<HTMLDivElement> {
  hash: string
  message: string
  author?: string
}

export interface JsxPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
}

export interface PackageInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  version: string
  description?: string
}

export interface SandboxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  command?: string
}

export interface SchemaDisplayProps extends React.HTMLAttributes<HTMLPreElement> {
  schema: unknown
}

export interface SnippetProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string
  language?: string
}

export interface AuroraImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: string
}

export type OpenInChatProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface AudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  duration?: string
}

export interface MicSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  devices: string[]
}

export interface PersonaProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  description?: string
}

export type SpeechInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export interface TranscriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: string[]
}

export interface VoiceSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  voices: string[]
}

export type CanvasProps = React.HTMLAttributes<HTMLDivElement>
export interface ConnectionProps extends React.HTMLAttributes<HTMLDivElement> {
  from: string
  to: string
}
export type ControlsProps = React.HTMLAttributes<HTMLDivElement>
export interface EdgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}
export interface NodeProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}
export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
}

const taskTone = {
  queued: { color: "var(--aurora-text-muted)", icon: <CircleDashed className="size-4" aria-hidden /> },
  running: { color: "var(--aurora-accent-primary)", icon: <Spinner size="sm" /> },
  completed: { color: "var(--aurora-success)", icon: <CheckCircle2 className="size-4" aria-hidden /> },
  failed: { color: "var(--aurora-error)", icon: <XCircle className="size-4" aria-hidden /> },
}

const resultVariant = {
  passed: "success",
  failed: "error",
  skipped: "default",
  running: "default",
} as const

function panelStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--aurora-panel-medium)",
    border: "1px solid var(--aurora-border-default)",
    borderRadius: 8,
    boxShadow: "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,0.04)",
    ...style,
  }
}

const Message = React.forwardRef<HTMLElement, MessageProps>(({ className, role = "assistant", style, ...props }, ref) => (
  <article
    ref={ref}
    className={["grid grid-cols-[auto_minmax(0,1fr)] gap-3", className].filter(Boolean).join(" ")}
    data-role={role}
    style={{
      color: "var(--aurora-text-primary)",
      ...style,
    }}
    {...props}
  />
))
Message.displayName = "Message"

const MessageAvatar = React.forwardRef<React.ElementRef<typeof AuroraAvatar>, MessageAvatarProps>(
  ({ className, label, tone = "cyan", style, ...props }, ref) => {
    const color =
      tone === "rose" ? "var(--aurora-accent-pink)" : tone === "muted" ? "var(--aurora-text-muted)" : "var(--aurora-accent-primary)"

    return (
      <AuroraAvatar
        ref={ref}
        variant="bot"
        size={32}
        alt={label}
        fallback={label.slice(0, 2).toUpperCase()}
        className={className}
        style={{
          borderColor: `color-mix(in srgb, ${color} 35%, var(--aurora-border-default))`,
          color,
          fontFamily: "var(--aurora-font-display)",
          fontSize: 12,
          fontWeight: 800,
          ...style,
        }}
        {...props}
      />
    )
  }
)
MessageAvatar.displayName = "MessageAvatar"

const MessageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={["min-w-0 rounded-[8px] border px-4 py-3 aurora-text-body", className].filter(Boolean).join(" ")}
      style={panelStyle(style)}
      {...props}
    />
  )
)
MessageContent.displayName = "MessageContent"

const InlineCitation = React.forwardRef<HTMLAnchorElement, InlineCitationProps>(
  ({ className, index, style, children, ...props }, ref) => (
    <a
      ref={ref}
      className={["inline-flex items-center rounded-[4px] border px-1.5 py-0.5 align-baseline no-underline", className].filter(Boolean).join(" ")}
      style={{
        borderColor: "color-mix(in srgb, var(--aurora-accent-primary) 34%, transparent)",
        color: "var(--aurora-accent-strong)",
        fontFamily: "var(--aurora-font-mono)",
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,
        ...style,
      }}
      {...props}
    >
      {children ?? index}
    </a>
  )
)
InlineCitation.displayName = "InlineCitation"

const Sources = React.forwardRef<HTMLDivElement, SourcesProps>(({ className, title = "Sources", style, children, ...props }, ref) => (
  <div ref={ref} className={["grid gap-2 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
    <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>
      <FileText className="size-3.5" aria-hidden />
      {title}
    </div>
    <div className="grid gap-2">{children}</div>
  </div>
))
Sources.displayName = "Sources"

const Source = React.forwardRef<HTMLAnchorElement, SourceProps>(({ className, source, style, ...props }, ref) => (
  <a
    ref={ref}
    href={source.href ?? "#"}
    className={["grid gap-1 rounded-[7px] border px-3 py-2 no-underline transition-colors hover:bg-[var(--aurora-hover-bg)]", className].filter(Boolean).join(" ")}
    style={{
      borderColor: "var(--aurora-border-default)",
      color: "var(--aurora-text-primary)",
      ...style,
    }}
    {...props}
  >
    <span className="flex min-w-0 items-center gap-2">
      <span className="truncate aurora-text-control">{source.title}</span>
      {source.badge ? <Badge>{source.badge}</Badge> : null}
      <ExternalLink className="ml-auto size-3.5 shrink-0" aria-hidden style={{ color: "var(--aurora-text-muted)" }} />
    </span>
    {source.description ? <span className="aurora-text-meta">{source.description}</span> : null}
  </a>
))
Source.displayName = "Source"

const TaskList = React.forwardRef<HTMLDivElement, TaskListProps>(({ className, tasks, style, ...props }, ref) => (
  <div ref={ref} className={["grid gap-2 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
    <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>
      <ListChecks className="size-3.5" aria-hidden />
      Tasks
    </div>
    <Separator />
    <div className="grid gap-2">
      {tasks.map((task) => {
        const tone = taskTone[task.status]
        return (
          <div key={task.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-[7px] px-2 py-2" style={{ color: tone.color }}>
            <span className="mt-0.5">{tone.icon}</span>
            <span className="min-w-0">
              <span className="block truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{task.title}</span>
              {task.description ? <span className="block aurora-text-meta">{task.description}</span> : null}
            </span>
            <Badge variant={task.status === "failed" ? "error" : task.status === "completed" ? "success" : "default"}>{task.status}</Badge>
          </div>
        )
      })}
    </div>
  </div>
))
TaskList.displayName = "TaskList"

const TestResults = React.forwardRef<HTMLDivElement, TestResultsProps>(({ className, results, style, ...props }, ref) => (
  <div ref={ref} className={["grid gap-2 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
    <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>
      <FlaskConical className="size-3.5" aria-hidden />
      Test results
    </div>
    <Separator />
    <div className="grid gap-1">
      {results.map((result) => (
        <div key={result.name} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-[6px] px-2 py-1.5">
          <span className="truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{result.name}</span>
          {result.duration ? <span className="aurora-text-meta">{result.duration}</span> : null}
          <Badge variant={resultVariant[result.status]} dot={result.status === "running"}>{result.status}</Badge>
          {result.message ? <span className="col-span-3 aurora-text-meta">{result.message}</span> : null}
        </div>
      ))}
    </div>
  </div>
))
TestResults.displayName = "TestResults"

const StackTrace = React.forwardRef<HTMLDivElement, StackTraceProps>(({ className, title = "Stack trace", frames, style, ...props }, ref) => (
  <div ref={ref} className={["grid gap-2 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
    <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-error)" }}>
      <CircleAlert className="size-3.5" aria-hidden />
      {title}
    </div>
    <div className="overflow-hidden rounded-[7px] border" style={{ borderColor: "var(--aurora-border-default)" }}>
      {frames.map((frame, index) => (
        <div key={`${frame.file}-${index}`} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-b px-3 py-2 last:border-b-0" style={{ borderColor: "var(--aurora-border-default)" }}>
          <span className="aurora-text-code" style={{ color: "var(--aurora-text-muted)" }}>{index + 1}</span>
          <span className="min-w-0">
            <span className="block truncate aurora-text-code" style={{ color: "var(--aurora-text-primary)" }}>
              {frame.file}{frame.line ? `:${frame.line}` : ""}{frame.column ? `:${frame.column}` : ""}
            </span>
            {frame.label ? <span className="block aurora-text-meta">{frame.label}</span> : null}
          </span>
        </div>
      ))}
    </div>
  </div>
))
StackTrace.displayName = "StackTrace"

const EnvironmentVariables = React.forwardRef<HTMLDivElement, EnvironmentVariablesProps>(
  ({ className, variables, style, ...props }, ref) => (
    <div ref={ref} className={["grid gap-2 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>
        <KeyRound className="size-3.5" aria-hidden />
        Environment
      </div>
      <Separator />
      <div className="grid gap-1">
        {variables.map((item) => (
          <div key={item.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-[6px] px-2 py-1.5">
            <span className="truncate aurora-text-code" style={{ color: "var(--aurora-text-primary)" }}>{item.key}</span>
            <span className="flex items-center gap-2">
              {item.required ? <Badge variant="warn">Required</Badge> : null}
              {item.secret ? <Badge variant="rose">Secret</Badge> : <span className="aurora-text-code" style={{ color: "var(--aurora-text-muted)" }}>{item.value ?? "Unset"}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
)
EnvironmentVariables.displayName = "EnvironmentVariables"

const Checkpoint = React.forwardRef<HTMLDivElement, CheckpointProps>(
  ({ label, description, className, style, ...props }, ref) => (
    <div ref={ref} className={["grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <Save className="mt-0.5 size-4" aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />
      <div className="min-w-0">
        <div className="aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{label}</div>
        {description ? <div className="aurora-text-meta">{description}</div> : null}
      </div>
    </div>
  )
)
Checkpoint.displayName = "Checkpoint"

const Confirmation = React.forwardRef<HTMLDivElement, ConfirmationProps>(
  ({ title, description, confirmLabel = "Approve", cancelLabel = "Cancel", className, style, ...props }, ref) => (
    <div ref={ref} className={["grid gap-3 rounded-[8px] border p-4", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <div className="flex items-center gap-2 aurora-text-card-title">
        <CircleAlert className="size-4" aria-hidden style={{ color: "var(--aurora-warn)" }} />
        {title}
      </div>
      {description ? <p className="aurora-text-body" style={{ margin: 0 }}>{description}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="neutral" size="sm"><X className="size-3.5" aria-hidden />{cancelLabel}</Button>
        <Button type="button" variant="rose" size="sm"><Check className="size-3.5" aria-hidden />{confirmLabel}</Button>
      </div>
    </div>
  )
)
Confirmation.displayName = "Confirmation"

const ContextPanel = React.forwardRef<HTMLDivElement, ContextPanelProps>(
  ({ items, className, style, ...props }, ref) => (
    <div ref={ref} className={["grid gap-2 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>
        <Layers3 className="size-3.5" aria-hidden />
        Context
      </div>
      {items.map((item) => <Source key={item.title} source={item} />)}
    </div>
  )
)
ContextPanel.displayName = "ContextPanel"

const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={["grid gap-4 rounded-[8px] border p-4", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props} />
  )
)
Conversation.displayName = "Conversation"

const ModelSelector = React.forwardRef<HTMLSelectElement, ModelSelectorProps>(
  ({ models, className, style, ...props }, ref) => (
    <NativeSelect
      ref={ref}
      className={["rounded-[8px] aurora-text-control", className].filter(Boolean).join(" ")}
      style={style}
      {...props}
    >
      {models.map((model) => <option key={model}>{model}</option>)}
    </NativeSelect>
  )
)
ModelSelector.displayName = "ModelSelector"

const Queue = React.forwardRef<HTMLDivElement, QueueProps>(
  ({ tasks, ...props }, ref) => <TaskList ref={ref} tasks={tasks} {...props} />
)
Queue.displayName = "Queue"

const Shimmer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={["h-3 overflow-hidden rounded-full", className].filter(Boolean).join(" ")}
      style={{
        background: "linear-gradient(90deg, var(--aurora-control-surface), color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent), var(--aurora-control-surface))",
        backgroundSize: "220% 100%",
        animation: "aurora-shimmer 1.4s linear infinite",
        ...style,
      }}
      {...props}
    />
  )
)
Shimmer.displayName = "Shimmer"

const Suggestion = React.forwardRef<HTMLButtonElement, SuggestionProps>(
  ({ className, style, ...props }, ref) => (
    <Button
      ref={ref}
      type="button"
      variant="neutral"
      className={["justify-start text-left", className].filter(Boolean).join(" ")}
      style={{
        height: "auto",
        paddingTop: 8,
        paddingBottom: 8,
        ...style,
      }}
      {...props}
    />
  )
)
Suggestion.displayName = "Suggestion"

const Agent = React.forwardRef<HTMLDivElement, AgentProps>(
  ({ name, role, status = "idle", className, style, ...props }, ref) => (
    <div ref={ref} className={["grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <Bot className="size-5" aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />
      <span className="min-w-0">
        <span className="block truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{name}</span>
        {role ? <span className="block aurora-text-meta">{role}</span> : null}
      </span>
      <Badge variant={status === "blocked" ? "warn" : status === "running" ? "success" : "default"} dot={status === "running"}>{status}</Badge>
    </div>
  )
)
Agent.displayName = "Agent"

const Commit = React.forwardRef<HTMLDivElement, CommitProps>(
  ({ hash, message, author, className, style, ...props }, ref) => (
    <div ref={ref} className={["grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <GitCommitHorizontal className="size-4" aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />
      <span className="min-w-0">
        <span className="block truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{message}</span>
        <span className="block aurora-text-code" style={{ color: "var(--aurora-text-muted)" }}>{hash}{author ? ` by ${author}` : ""}</span>
      </span>
    </div>
  )
)
Commit.displayName = "Commit"

const JsxPreview = React.forwardRef<HTMLDivElement, JsxPreviewProps>(
  ({ code, className, style, ...props }, ref) => (
    <div ref={ref} className={["grid gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}>
        <FileCode2 className="size-3.5" aria-hidden />
        JSX preview
      </div>
      <pre className="overflow-auto rounded-[7px] border p-3 aurora-text-code" style={{ borderColor: "var(--aurora-border-default)", background: "var(--aurora-panel-strong)" }}>{code}</pre>
    </div>
  )
)
JsxPreview.displayName = "JsxPreview"

const PackageInfo = React.forwardRef<HTMLDivElement, PackageInfoProps>(
  ({ name, version, description, className, style, ...props }, ref) => (
    <div ref={ref} className={["grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <Package className="size-5" aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />
      <span className="min-w-0">
        <span className="block truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{name}</span>
        <span className="block aurora-text-code" style={{ color: "var(--aurora-accent-strong)" }}>{version}</span>
        {description ? <span className="block aurora-text-meta">{description}</span> : null}
      </span>
    </div>
  )
)
PackageInfo.displayName = "PackageInfo"

const Sandbox = React.forwardRef<HTMLDivElement, SandboxProps>(
  ({ title = "Sandbox", command = "pnpm dev", className, style, children, ...props }, ref) => (
    <div ref={ref} className={["grid gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}><Boxes className="size-3.5" aria-hidden />{title}</span>
        <Badge>{command}</Badge>
      </div>
      {children}
    </div>
  )
)
Sandbox.displayName = "Sandbox"

const SchemaDisplay = React.forwardRef<HTMLPreElement, SchemaDisplayProps>(
  ({ schema, className, style, ...props }, ref) => (
    <pre ref={ref} className={["overflow-auto rounded-[8px] border p-3 aurora-text-code", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      {JSON.stringify(schema, null, 2)}
    </pre>
  )
)
SchemaDisplay.displayName = "SchemaDisplay"

const Snippet = React.forwardRef<HTMLPreElement, SnippetProps>(
  ({ code, language = "tsx", className, style, ...props }, ref) => (
    <pre ref={ref} className={["overflow-auto rounded-[8px] border p-3 aurora-text-code", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <span style={{ color: "var(--aurora-text-muted)" }}>{language}</span>{"\n"}{code}
    </pre>
  )
)
Snippet.displayName = "Snippet"

const Image = React.forwardRef<HTMLImageElement, AuroraImageProps>(
  ({ caption, className, style, alt = "", ...props }, ref) => (
    <figure className={["grid gap-2", className].filter(Boolean).join(" ")} style={{ margin: 0 }}>
      <img ref={ref} alt={alt} className="w-full rounded-[8px] border object-cover" style={{ borderColor: "var(--aurora-border-default)", ...style }} {...props} />
      {caption ? <figcaption className="aurora-text-meta">{caption}</figcaption> : null}
    </figure>
  )
)
Image.displayName = "Image"

const OpenInChat = React.forwardRef<HTMLButtonElement, OpenInChatProps>(
  ({ children = "Open in chat", ...props }, ref) => (
    <Button ref={ref} type="button" variant="neutral" size="sm" {...props}>
      <Send className="size-3.5" aria-hidden />
      {children}
    </Button>
  )
)
OpenInChat.displayName = "OpenInChat"

const AudioPlayer = React.forwardRef<HTMLDivElement, AudioPlayerProps>(
  ({ title = "Voice response", duration = "00:42", className, style, ...props }, ref) => (
    <div ref={ref} className={["grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <Button type="button" size="icon" variant="neutral"><Play className="size-4" aria-hidden /></Button>
      <span className="min-w-0">
        <span className="block truncate aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{title}</span>
        <span className="block h-1.5 rounded-full" style={{ background: "linear-gradient(90deg, var(--aurora-accent-primary) 48%, var(--aurora-control-surface) 48%)" }} />
      </span>
      <span className="aurora-text-code" style={{ color: "var(--aurora-text-muted)" }}>{duration}</span>
    </div>
  )
)
AudioPlayer.displayName = "AudioPlayer"

const MicSelector = React.forwardRef<HTMLSelectElement, MicSelectorProps>(
  ({ devices, ...props }, ref) => <ModelSelector ref={ref} models={devices} aria-label="Microphone" {...props} />
)
MicSelector.displayName = "MicSelector"

const Persona = React.forwardRef<HTMLDivElement, PersonaProps>(
  ({ name, description, className, style, ...props }, ref) => (
    <div ref={ref} className={["grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <UserRound className="size-5" aria-hidden style={{ color: "var(--aurora-accent-pink)" }} />
      <span className="min-w-0">
        <span className="block aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}>{name}</span>
        {description ? <span className="block aurora-text-meta">{description}</span> : null}
      </span>
    </div>
  )
)
Persona.displayName = "Persona"

const SpeechInput = React.forwardRef<HTMLTextAreaElement, SpeechInputProps>(
  ({ className, style, ...props }, ref) => (
    <div className="grid gap-2 rounded-[8px] border p-3" style={panelStyle()}>
      <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}><Mic className="size-3.5" aria-hidden />Speech input</div>
      <Textarea ref={ref} className={["min-h-20 resize-none rounded-[8px] p-3 aurora-text-body", className].filter(Boolean).join(" ")} style={{ ...style }} {...props} />
    </div>
  )
)
SpeechInput.displayName = "SpeechInput"

const Transcription = React.forwardRef<HTMLDivElement, TranscriptionProps>(
  ({ segments, className, style, ...props }, ref) => (
    <div ref={ref} className={["grid gap-2 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      {segments.map((segment, index) => <p key={index} className="aurora-text-body" style={{ margin: 0 }}>{segment}</p>)}
    </div>
  )
)
Transcription.displayName = "Transcription"

const VoiceSelector = React.forwardRef<HTMLSelectElement, VoiceSelectorProps>(
  ({ voices, ...props }, ref) => <ModelSelector ref={ref} models={voices} aria-label="Voice" {...props} />
)
VoiceSelector.displayName = "VoiceSelector"

const Canvas = React.forwardRef<HTMLDivElement, CanvasProps>(
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={["relative min-h-64 rounded-[8px] border p-4", className].filter(Boolean).join(" ")} style={{ ...panelStyle(style), backgroundImage: "linear-gradient(var(--aurora-border-default) 1px, transparent 1px), linear-gradient(90deg, var(--aurora-border-default) 1px, transparent 1px)", backgroundSize: "24px 24px" }} {...props} />
  )
)
Canvas.displayName = "Canvas"

const Connection = React.forwardRef<HTMLDivElement, ConnectionProps>(
  ({ from, to, className, style, ...props }, ref) => (
    <div ref={ref} className={["flex items-center gap-2 aurora-text-control", className].filter(Boolean).join(" ")} style={{ color: "var(--aurora-text-primary)", ...style }} {...props}>
      <Network className="size-4" aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />{from}<Route className="size-4" aria-hidden />{to}
    </div>
  )
)
Connection.displayName = "Connection"

const Controls = React.forwardRef<HTMLDivElement, ControlsProps>(
  ({ className, style, ...props }, ref) => (
    <div ref={ref} className={["flex items-center gap-2 rounded-[8px] border p-2", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props} />
  )
)
Controls.displayName = "Controls"

const Edge = React.forwardRef<HTMLDivElement, EdgeProps>(
  ({ label = "edge", className, style, ...props }, ref) => (
    <div ref={ref} className={["flex items-center gap-2 aurora-text-meta", className].filter(Boolean).join(" ")} style={style} {...props}>
      <span className="h-px flex-1" style={{ background: "var(--aurora-accent-primary)" }} />
      {label}
      <span className="h-px flex-1" style={{ background: "var(--aurora-accent-primary)" }} />
    </div>
  )
)
Edge.displayName = "Edge"

const Node = React.forwardRef<HTMLDivElement, NodeProps>(
  ({ title, description, className, style, ...props }, ref) => (
    <div ref={ref} className={["w-56 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      <div className="flex items-center gap-2 aurora-text-control" style={{ color: "var(--aurora-text-primary)" }}><Workflow className="size-4" aria-hidden style={{ color: "var(--aurora-accent-primary)" }} />{title}</div>
      {description ? <div className="aurora-text-meta">{description}</div> : null}
    </div>
  )
)
Node.displayName = "Node"

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ title, className, children, style, ...props }, ref) => (
    <aside ref={ref} className={["grid gap-3 rounded-[8px] border p-3", className].filter(Boolean).join(" ")} style={panelStyle(style)} {...props}>
      {title ? <div className="flex items-center gap-2 aurora-text-label" style={{ color: "var(--aurora-text-muted)" }}><Sparkles className="size-3.5" aria-hidden />{title}</div> : null}
      {children}
    </aside>
  )
)
Panel.displayName = "Panel"

export {
  Agent,
  AudioPlayer,
  Canvas,
  Checkpoint,
  Commit,
  Confirmation,
  Connection,
  ContextPanel,
  ContextPanel as Context,
  Controls,
  Conversation,
  Edge,
  EnvironmentVariables,
  Image,
  InlineCitation,
  JsxPreview,
  MicSelector,
  Message,
  MessageAvatar,
  MessageContent,
  ModelSelector,
  Node,
  OpenInChat,
  PackageInfo,
  Panel,
  Persona,
  Queue,
  Sandbox,
  SchemaDisplay,
  Shimmer,
  Snippet,
  Source,
  Sources,
  SpeechInput,
  StackTrace,
  Suggestion,
  TaskList,
  TestResults,
  Transcription,
  VoiceSelector,
}
