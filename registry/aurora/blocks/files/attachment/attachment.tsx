"use client"

import * as React from "react"
import { CloudUpload, File, FileText, FileVideo, Pause, Play, X } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

// ---------------------------------------------------------------------------
// Shared icons
// ---------------------------------------------------------------------------

const ICON_STROKE = 1.65

function GenericFileIcon({
  color = "var(--aurora-text-muted)",
  size = 16,
}: {
  color?: string
  size?: number
}) {
  return <File size={size} strokeWidth={ICON_STROKE} color={color} aria-hidden="true" />
}

function VideoFileIcon() {
  return (
    <FileVideo size={16} strokeWidth={ICON_STROKE} color="var(--aurora-accent-primary)" aria-hidden="true" />
  )
}

function PDFIcon() {
  return (
    <FileText size={16} strokeWidth={ICON_STROKE} color="var(--aurora-accent-pink)" aria-hidden="true" />
  )
}

function CloudUploadIcon() {
  return (
    <CloudUpload size={28} strokeWidth={ICON_STROKE} color="var(--aurora-accent-primary)" aria-hidden="true" />
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg", "bmp"]

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? ""
}

function isImage(name: string): boolean {
  return IMAGE_EXTS.includes(getExt(name))
}

function isPDF(name: string): boolean {
  return getExt(name) === "pdf"
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// AttachmentChip
// ---------------------------------------------------------------------------

export interface AttachmentChipProps {
  name: string
  size: number
  /** For images: data URL or object URL to show as thumbnail */
  thumbnailUrl?: string
  onDismiss?: () => void
}

export function AttachmentChip({ name, size, thumbnailUrl, onDismiss }: AttachmentChipProps) {
  const isImg = isImage(name)
  const showThumb = isImg && thumbnailUrl

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: showThumb ? "6px 10px 6px 6px" : "8px 12px",
        background: "color-mix(in srgb, var(--aurora-accent-pink) 8%, var(--aurora-panel-medium))",
        border: "1px solid color-mix(in srgb, var(--aurora-accent-pink) 24%, var(--aurora-border-default))",
        borderRadius: "12px",
        maxWidth: "240px",
        flexShrink: 0,
      }}
    >
      {showThumb ? (
        <img
          src={thumbnailUrl}
          alt={name}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      ) : (
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <GenericFileIcon color="var(--aurora-accent-pink)" size={18} />
        </span>
      )}

      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "var(--aurora-font-sans)",
            lineHeight: 1.25,
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "var(--aurora-text-muted)",
            lineHeight: 1.3,
          }}
        >
          {formatBytes(size)}
        </span>
      </div>

      {onDismiss && (
        <Button
          type="button"
          variant="plain"
          size="unstyled"
          onClick={onDismiss}
          aria-label={`Remove ${name}`}
          style={{
            width: 24,
            height: 24,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginLeft: 2,
            borderRadius: 8,
            color: "var(--aurora-text-muted)",
          }}
        >
          <X size={13} strokeWidth={ICON_STROKE} aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AttachmentGrid
// ---------------------------------------------------------------------------

export interface AttachmentGridItem {
  id: string
  name: string
  size: number
  url: string
  /** "image" | "video" */
  mediaType: "image" | "video"
}

export interface AttachmentGridProps {
  items: AttachmentGridItem[]
  columns?: number
  onRemove?: (id: string) => void
}

export function AttachmentGrid({ items, columns = 3, onRemove }: AttachmentGridProps) {
  const [hovered, setHovered] = React.useState<string | null>(null)

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "8px",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            borderRadius: "var(--aurora-radius-1)",
            overflow: "hidden",
            border: "1px solid var(--aurora-border-default)",
            background: "var(--aurora-control-surface)",
          }}
        >
          {item.mediaType === "video" ? (
            <video
              src={item.url}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <img
              src={item.url}
              alt={item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          {/* Hover overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "color-mix(in srgb, var(--aurora-page-bg) 68%, transparent)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "8px",
              opacity: hovered === item.id ? 1 : 0,
              transition: "opacity 0.15s",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--aurora-text-primary)",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
                fontFamily: "var(--aurora-font-sans)",
              }}
            >
              {item.name}
            </span>
            <span style={{ fontSize: "10px", color: "var(--aurora-text-muted)" }}>
              {formatBytes(item.size)}
            </span>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                style={{ marginTop: "4px", fontSize: "11px" }}
              >
                Remove
              </Button>
            )}
          </div>

          {/* Video badge */}
          {item.mediaType === "video" && (
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: "6px",
                background: "color-mix(in srgb, var(--aurora-page-bg) 72%, transparent)",
                borderRadius: "6px",
                padding: "2px 5px",
              }}
            >
              <VideoFileIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AttachmentDocCard
// ---------------------------------------------------------------------------

export interface AttachmentDocCardProps {
  name: string
  size: number
  pageCount?: number
  onDismiss?: () => void
  onOpen?: () => void
}

export function AttachmentDocCard({ name, size, pageCount, onDismiss, onOpen }: AttachmentDocCardProps) {
  const pdf = isPDF(name)
  const ext = getExt(name).toUpperCase() || "FILE"

  // CD: PDF accent is rose/pink, non-PDF stays cyan.
  const accent = pdf ? "var(--aurora-accent-pink)" : "var(--aurora-accent-primary)"
  const badgeBg = pdf
    ? "color-mix(in srgb, var(--aurora-accent-pink) 12%, transparent)"
    : "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)"
  const badgeBorder = pdf
    ? "color-mix(in srgb, var(--aurora-accent-pink) 30%, transparent)"
    : "color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)"

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        background: "color-mix(in srgb, var(--aurora-accent-pink) 5%, var(--aurora-panel-medium))",
        border: "1px solid color-mix(in srgb, var(--aurora-accent-pink) 16%, var(--aurora-border-default))",
        borderRadius: "var(--aurora-radius-2)",
        boxSizing: "border-box",
        width: "300px",
        maxWidth: "100%",
        position: "relative",
      }}
    >
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label={`Remove ${name}`}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: 26,
            height: 26,
            color: "var(--aurora-text-muted)",
          }}
        >
          <X size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
        </Button>
      )}

      {/* File type badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          alignSelf: "flex-start",
          padding: "4px 9px",
          background: badgeBg,
          border: `1px solid ${badgeBorder}`,
          borderRadius: "999px",
          fontSize: "11px",
          fontWeight: 700,
          color: accent,
          letterSpacing: 0,
          fontFamily: "var(--aurora-font-sans)",
        }}
      >
        {pdf ? <PDFIcon /> : <GenericFileIcon color={accent} />}
        {ext}
      </div>

      {/* File icon area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px",
          background: "color-mix(in srgb, var(--aurora-page-bg) 55%, var(--aurora-control-surface))",
          borderRadius: "12px",
          border: "1px solid color-mix(in srgb, var(--aurora-accent-pink) 14%, var(--aurora-border-default))",
        }}
      >
        <FileText size={40} strokeWidth={ICON_STROKE} color={accent} aria-hidden="true" />
      </div>

      {/* Name */}
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--aurora-text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "var(--aurora-font-sans)",
          }}
        >
          {name}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "4px",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--aurora-text-muted)" }}>
            {formatBytes(size)}
          </span>
          {pageCount != null && (
            <>
              <span style={{ fontSize: "11px", color: "var(--aurora-text-muted)" }}>·</span>
              <span style={{ fontSize: "12px", color: "var(--aurora-text-muted)" }}>
                {pageCount} {pageCount === 1 ? "page" : "pages"}
              </span>
            </>
          )}
        </div>
      </div>

      {onOpen && (
        <Button
          type="button"
          variant="plain"
          size="unstyled"
          onClick={onOpen}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "9px 12px",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--aurora-text-primary)",
            background: "transparent",
            border: "1px solid color-mix(in srgb, var(--aurora-accent-pink) 24%, var(--aurora-border-default))",
            borderRadius: "10px",
            fontFamily: "var(--aurora-font-sans)",
          }}
        >
          Open
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AttachmentAudioChip
// ---------------------------------------------------------------------------

export interface AttachmentAudioChipProps {
  title: string
  duration: string
  /** Compact single-line layout (smaller play button + inline duration) */
  compact?: boolean
  /** Optional waveform seed — array of 5 amplitudes 0..1 */
  waveform?: [number, number, number, number, number]
}

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

export function AttachmentAudioChip({
  title,
  duration,
  compact = false,
  waveform = [0.5, 0.9, 0.6, 0.8, 0.4],
}: AttachmentAudioChipProps) {
  const [playing, setPlaying] = React.useState(false)

  const btnSize = compact ? 26 : 34
  const iconSize = compact ? 14 : 15
  const waveHeight = compact ? 16 : 22

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? "8px" : "12px",
        padding: compact ? "7px 12px" : "10px 14px",
        background: "color-mix(in srgb, var(--aurora-accent-primary) 7%, var(--aurora-panel-medium))",
        border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 24%, var(--aurora-border-default))",
        borderRadius: "12px",
        maxWidth: "320px",
      }}
    >
        {/* Play/pause toggle — circular outline */}
        <Button
          type="button"
          variant="plain"
          size="unstyled"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            width: btnSize,
            height: btnSize,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            flexShrink: 0,
            color: "var(--aurora-accent-primary)",
            background: "transparent",
            border: "1.5px solid color-mix(in srgb, var(--aurora-accent-primary) 55%, transparent)",
          }}
        >
          {playing ? (
            <Pause size={iconSize} strokeWidth={ICON_STROKE} aria-hidden="true" />
          ) : (
            <Play size={iconSize} strokeWidth={ICON_STROKE} fill="currentColor" aria-hidden="true" />
          )}
        </Button>

        {/* Waveform bars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5px",
            height: `${waveHeight}px`,
          }}
        >
          {waveform.map((amp, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: `${amp * 100}%`,
                background: "var(--aurora-accent-primary)",
                borderRadius: "2px",
                transformOrigin: "center",
                animation: playing
                  ? `aurora-bar-bounce ${0.5 + i * 0.11}s ease-in-out ${i * 0.07}s infinite`
                  : "none",
                opacity: playing ? 1 : 0.55,
                transition: "opacity 0.2s",
              }}
            />
          ))}
        </div>

        {/* Info */}
        {compact ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--aurora-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "var(--aurora-font-sans)",
              }}
            >
              {title}
            </span>
            <span style={{ fontSize: "11px", color: "var(--aurora-text-muted)", flexShrink: 0 }}>{duration}</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--aurora-text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "var(--aurora-font-sans)",
              }}
            >
              {title}
            </span>
            <span style={{ fontSize: "11px", color: "var(--aurora-text-muted)" }}>{duration}</span>
          </div>
        )}
      </div>
  )
}

// ---------------------------------------------------------------------------
// AttachmentUploadProgress
// ---------------------------------------------------------------------------

export interface AttachmentUploadProgressProps {
  name: string
  /** 0–100 */
  progress: number
  onCancel?: () => void
}

export function AttachmentUploadProgress({ name, progress, onCancel }: AttachmentUploadProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress))
  const done = clamped >= 100

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        padding: "12px 16px",
        background: "var(--aurora-panel-medium)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "12px",
        width: "100%",
      }}
    >
      {/* Icon */}
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <GenericFileIcon color={done ? "var(--aurora-success)" : "var(--aurora-accent-primary)"} size={18} />
      </span>

      {/* Name */}
      <span
        style={{
          flex: 1,
          minWidth: "120px",
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--aurora-text-primary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: "var(--aurora-font-sans)",
        }}
      >
        {name}
      </span>

      {/* Progress track */}
      <div
        style={{
          width: "min(160px, 36vw)",
          height: "5px",
          borderRadius: "3px",
          background: "var(--aurora-control-surface)",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${clamped}%`,
            background: done ? "var(--aurora-success)" : "var(--aurora-accent-primary)",
            borderRadius: "3px",
            transition: "width 0.3s ease-out, background 0.3s",
          }}
        />
      </div>

      {/* Percentage */}
      <span
        style={{
          fontSize: "13px",
          color: done ? "var(--aurora-success)" : "var(--aurora-text-muted)",
          fontVariantNumeric: "tabular-nums",
          width: "40px",
          textAlign: "right",
          flexShrink: 0,
          transition: "color 0.3s",
        }}
      >
        {done ? "Done" : `${clamped}%`}
      </span>

      {onCancel && !done && (
        <Button
          type="button"
          variant="plain"
          size="unstyled"
          onClick={onCancel}
          aria-label="Cancel upload"
          style={{
            width: 24,
            height: 24,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: 8,
            color: "var(--aurora-text-muted)",
          }}
        >
          <X size={13} strokeWidth={ICON_STROKE} aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// AttachmentDragZone
// ---------------------------------------------------------------------------

export interface AttachmentDragZoneProps {
  onFiles?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  sublabel?: string
}

export function AttachmentDragZone({
  onFiles,
  accept,
  multiple = true,
  label = "Drop files here",
  sublabel = "or click to browse",
}: AttachmentDragZoneProps) {
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) onFiles?.(files)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onFiles?.(files)
    e.target.value = ""
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="File drop zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "32px 24px",
        border: `2px dashed ${dragging ? "var(--aurora-accent-primary)" : "var(--aurora-border-strong)"}`,
        borderRadius: "var(--aurora-radius-2)",
        background: dragging
          ? "color-mix(in srgb, var(--aurora-accent-primary) 6%, var(--aurora-panel-medium))"
          : "var(--aurora-panel-medium)",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        userSelect: "none",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={handleFileInput}
      />

      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: dragging
            ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
            : "var(--aurora-control-surface)",
          border: `1px solid ${dragging ? "color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)" : "var(--aurora-border-default)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        <CloudUploadIcon />
      </div>

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
            color: dragging ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
            transition: "color 0.15s",
            fontFamily: "var(--aurora-font-sans)",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "3px 0 0",
            fontSize: "12px",
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-sans)",
          }}
        >
          {sublabel}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Default export (convenience)
// ---------------------------------------------------------------------------

export default AttachmentChip
