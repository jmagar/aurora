"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Input } from "@/registry/aurora/ui/input"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FileItemType = "image" | "document" | "code" | "video" | "audio" | "other"

export interface FileItem {
  id: string
  name: string
  type: FileItemType
  size: number
  modifiedAt: Date
  /** Thumbnail URL for images/videos */
  thumbnailUrl?: string
  path?: string
}

export type SidebarSection = "recent" | "documents" | "downloads" | "project" | "uploads"

export type FilterChip = "all" | "images" | "documents" | "code"

export type ViewMode = "grid" | "list"

export interface FilePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (files: FileItem[]) => void
  multiple?: boolean
  /** MIME type filter e.g. "image/*" */
  accept?: string
  files?: FileItem[]
}

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const DEMO_FILES: FileItem[] = [
  { id: "f1", name: "design-system.pdf", type: "document", size: 2_450_000, modifiedAt: new Date(Date.now() - 3600_000) },
  { id: "f2", name: "hero-image.png", type: "image", size: 890_000, modifiedAt: new Date(Date.now() - 7200_000) },
  { id: "f3", name: "aurora.css", type: "code", size: 14_200, modifiedAt: new Date(Date.now() - 86400_000) },
  { id: "f4", name: "index.tsx", type: "code", size: 8_400, modifiedAt: new Date(Date.now() - 172800_000) },
  { id: "f5", name: "logo-mark.svg", type: "image", size: 24_000, modifiedAt: new Date(Date.now() - 259200_000) },
  { id: "f6", name: "meeting-notes.md", type: "document", size: 5_120, modifiedAt: new Date(Date.now() - 432000_000) },
  { id: "f7", name: "prototype-video.mp4", type: "video", size: 42_800_000, modifiedAt: new Date(Date.now() - 518400_000) },
  { id: "f8", name: "usePrompt.ts", type: "code", size: 3_200, modifiedAt: new Date(Date.now() - 604800_000) },
  { id: "f9", name: "banner.jpg", type: "image", size: 1_200_000, modifiedAt: new Date(Date.now() - 691200_000) },
  { id: "f10", name: "spec.docx", type: "document", size: 340_000, modifiedAt: new Date(Date.now() - 777600_000) },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return "just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

function matchesFilter(file: FileItem, filter: FilterChip): boolean {
  if (filter === "all") return true
  if (filter === "images") return file.type === "image"
  if (filter === "documents") return file.type === "document"
  if (filter === "code") return file.type === "code"
  return true
}

// ---------------------------------------------------------------------------
// Static style objects — hoisted to module scope
// ---------------------------------------------------------------------------

const FP = {
  // Backdrop
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    background: "var(--aurora-overlay)",
  } as React.CSSProperties,

  // Dialog shell
  dialog: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 201,
    width: "780px",
    maxWidth: "calc(100vw - 32px)",
    height: "520px",
    maxHeight: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column" as const,
    background: "var(--aurora-panel-strong)",
    border: "1px solid var(--aurora-border-strong)",
    borderRadius: "var(--aurora-radius-2)",
    boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
    overflow: "hidden",
    animation: "aurora-fp-in 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
  } as React.CSSProperties,

  // Drag-drop overlay
  dragOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    background: "color-mix(in srgb, var(--aurora-accent-primary) 10%, rgba(7,19,28,0.72))",
    border: "2px dashed var(--aurora-accent-primary)",
    borderRadius: "var(--aurora-radius-2)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    pointerEvents: "none" as const,
  } as React.CSSProperties,

  dragOverlayText: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--aurora-accent-primary)",
    fontFamily: "var(--aurora-font-display)",
  } as React.CSSProperties,

  // Body flex row
  body: { display: "flex", flex: 1, overflow: "hidden" } as React.CSSProperties,

  // Sidebar
  sidebar: {
    width: "160px",
    flexShrink: 0,
    borderRight: "1px solid var(--aurora-border-default)",
    background: "var(--aurora-panel-medium)",
    display: "flex",
    flexDirection: "column" as const,
    padding: "12px 8px",
    gap: "2px",
  } as React.CSSProperties,

  sidebarTitle: {
    margin: "0 0 6px 8px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--aurora-text-muted)",
  } as React.CSSProperties,

  sidebarNavIcon: { flexShrink: 0 } as React.CSSProperties,

  uploadSpacer: { flex: 1 } as React.CSSProperties,

  uploadInput: { display: "none" } as React.CSSProperties,

  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 10px",
    background: "color-mix(in srgb, var(--aurora-accent-primary) 9%, transparent)",
    border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent)",
    borderRadius: "10px",
    cursor: "pointer",
    color: "var(--aurora-accent-primary)",
    fontSize: "12px",
    fontWeight: 600,
    width: "100%",
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  // Main area
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  } as React.CSSProperties,

  // Toolbar
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderBottom: "1px solid var(--aurora-border-default)",
    flexShrink: 0,
  } as React.CSSProperties,

  // Search box
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "6px 10px",
    background: "var(--aurora-control-surface)",
    border: "1px solid var(--aurora-border-default)",
    borderRadius: "10px",
  } as React.CSSProperties,

  searchIcon: { color: "var(--aurora-text-muted)", flexShrink: 0 } as React.CSSProperties,

  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "13px",
    color: "var(--aurora-text-primary)",
    fontFamily: "var(--aurora-font-sans)",
    caretColor: "var(--aurora-accent-primary)",
  } as React.CSSProperties,

  // Filter chips row
  filtersRow: { display: "flex", gap: "4px" } as React.CSSProperties,

  // View toggle container
  viewToggleContainer: {
    display: "flex",
    border: "1px solid var(--aurora-border-default)",
    borderRadius: "8px",
    overflow: "hidden",
  } as React.CSSProperties,

  // File area (padding varies by viewMode — computed inline)
  fileAreaGrid: { flex: 1, overflowY: "auto" as const, padding: "12px" } as React.CSSProperties,
  fileAreaList: { flex: 1, overflowY: "auto" as const, padding: "6px 0" } as React.CSSProperties,

  // Empty state
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: "12px",
    color: "var(--aurora-text-muted)",
  } as React.CSSProperties,

  emptyStateText: {
    margin: 0,
    fontSize: "13px",
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  // Grid container
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    gap: "8px",
  } as React.CSSProperties,

  // List header
  listHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 12px 6px",
    borderBottom: "1px solid var(--aurora-border-default)",
  } as React.CSSProperties,

  listHeaderSpacer: { width: "28px", flexShrink: 0 } as React.CSSProperties,

  listHeaderName: {
    flex: 1,
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--aurora-text-muted)",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  listHeaderSize: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--aurora-text-muted)",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    fontFamily: "var(--aurora-font-sans)",
    width: "60px",
    textAlign: "right" as const,
  } as React.CSSProperties,

  listHeaderModified: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--aurora-text-muted)",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    fontFamily: "var(--aurora-font-sans)",
    width: "60px",
    textAlign: "right" as const,
  } as React.CSSProperties,

  // Footer
  footer: {
    borderTop: "1px solid var(--aurora-border-default)",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "var(--aurora-panel-medium)",
    flexShrink: 0,
  } as React.CSSProperties,

  // Chips tray
  chipsTray: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "5px",
    minWidth: 0,
    overflowX: "auto" as const,
  } as React.CSSProperties,

  // Placeholder span (no files selected)
  placeholder: {
    fontSize: "12px",
    color: "var(--aurora-text-muted)",
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  // Actions row
  actionsRow: { display: "flex", gap: "8px", flexShrink: 0 } as React.CSSProperties,

  // Cancel button
  cancelBtn: {
    padding: "7px 14px",
    background: "var(--aurora-control-surface)",
    border: "1px solid var(--aurora-border-default)",
    borderRadius: "10px",
    color: "var(--aurora-text-muted)",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "var(--aurora-font-sans)",
    transition: "color 0.1s, border-color 0.1s",
  } as React.CSSProperties,

  // --- SelectionChip ---
  chipWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "3px 8px 3px 6px",
    background: "color-mix(in srgb, var(--aurora-accent-primary) 10%, var(--aurora-panel-medium))",
    border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 28%, var(--aurora-border-default))",
    borderRadius: "8px",
    flexShrink: 0,
  } as React.CSSProperties,

  chipLabel: {
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--aurora-text-primary)",
    fontFamily: "var(--aurora-font-sans)",
    maxWidth: "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,

  chipRemove: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--aurora-text-muted)",
    padding: 0,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  // --- FileGridCard ---
  gridCardThumb: {
    height: "80px",
    background: "var(--aurora-control-surface)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    overflow: "hidden",
  } as React.CSSProperties,

  gridCardThumbImg: { width: "100%", height: "100%", objectFit: "cover" as const } as React.CSSProperties,

  gridCardIconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "var(--aurora-panel-medium)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--aurora-border-default)",
  } as React.CSSProperties,

  gridCardCheck: {
    position: "absolute" as const,
    top: "6px",
    right: "6px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "var(--aurora-accent-primary)",
    color: "var(--aurora-accent-foreground)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  gridCardInfo: { padding: "7px 8px 8px" } as React.CSSProperties,

  gridCardName: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--aurora-text-primary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  gridCardDate: {
    margin: "2px 0 0",
    fontSize: "10px",
    color: "var(--aurora-text-muted)",
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  // --- FileListRow ---
  listRowIconBox: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: "var(--aurora-control-surface)",
    border: "1px solid var(--aurora-border-default)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,

  listRowName: {
    flex: 1,
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--aurora-text-primary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  listRowSize: {
    fontSize: "11px",
    color: "var(--aurora-text-muted)",
    fontVariantNumeric: "tabular-nums",
    flexShrink: 0,
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  listRowDate: {
    fontSize: "11px",
    color: "var(--aurora-text-muted)",
    flexShrink: 0,
    minWidth: "52px",
    textAlign: "right" as const,
    fontFamily: "var(--aurora-font-sans)",
  } as React.CSSProperties,

  listRowCheck: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "var(--aurora-accent-primary)",
    color: "var(--aurora-accent-foreground)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties,
} as const

// ---------------------------------------------------------------------------
// Derived style helpers (vary by active/selected/hovered state)
// ---------------------------------------------------------------------------

function gridCardStyle(selected: boolean, hovered: boolean): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    background: selected
      ? "color-mix(in srgb, var(--aurora-accent-primary) 9%, var(--aurora-panel-medium))"
      : hovered
      ? "var(--aurora-hover-bg)"
      : "var(--aurora-panel-medium)",
    border: selected
      ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"
      : "1px solid var(--aurora-border-default)",
    borderRadius: "var(--aurora-radius-1)",
    overflow: "hidden",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.1s, border-color 0.1s",
    position: "relative",
  }
}

function listRowStyle(selected: boolean, hovered: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "8px 12px",
    background: selected
      ? "color-mix(in srgb, var(--aurora-accent-primary) 8%, transparent)"
      : hovered
      ? "var(--aurora-hover-bg)"
      : "transparent",
    border: "none",
    borderLeft: selected ? "2px solid var(--aurora-accent-primary)" : "2px solid transparent",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.08s",
  }
}

function sidebarNavStyle(isActive: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 10px",
    background: isActive ? "var(--aurora-hover-bg)" : "transparent",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: isActive ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
    fontSize: "13px",
    fontWeight: isActive ? 600 : 400,
    textAlign: "left",
    width: "100%",
    fontFamily: "var(--aurora-font-sans)",
    transition: "background 0.1s, color 0.1s",
  }
}

function filterChipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "4px 10px",
    background: active
      ? "color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
      : "var(--aurora-control-surface)",
    border: active
      ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"
      : "1px solid var(--aurora-border-default)",
    borderRadius: "8px",
    color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
    fontSize: "11px",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    fontFamily: "var(--aurora-font-sans)",
    transition: "background 0.1s, color 0.1s, border-color 0.1s",
  }
}

function viewToggleBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: "5px 8px",
    background: active ? "var(--aurora-hover-bg)" : "transparent",
    border: "none",
    cursor: "pointer",
    color: active ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
    display: "flex",
    alignItems: "center",
    transition: "background 0.1s, color 0.1s",
  }
}

function confirmBtnStyle(hasSelection: boolean): React.CSSProperties {
  return {
    padding: "7px 18px",
    background: hasSelection ? "var(--aurora-accent-gradient)" : "var(--aurora-control-surface)",
    boxShadow: hasSelection
      ? "inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 8px color-mix(in srgb, var(--aurora-accent-primary) 25%, transparent)"
      : "none",
    border: hasSelection ? "none" : "1px solid var(--aurora-border-default)",
    borderRadius: "10px",
    color: hasSelection ? "var(--aurora-accent-foreground)" : "var(--aurora-text-muted)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: hasSelection ? "pointer" : "default",
    fontFamily: "var(--aurora-font-sans)",
    transition: "background 0.15s, color 0.15s",
  }
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function FileTypeIcon({ type }: { type: FileItemType }) {
  switch (type) {
    case "image":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="var(--aurora-accent-pink)" strokeWidth="1.2" />
          <circle cx="5.5" cy="5.5" r="1.2" fill="var(--aurora-accent-pink)" />
          <path d="M2 10.5L5 7.5L7.5 10L10 7.5L14 11.5" stroke="var(--aurora-accent-pink)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "code":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M5 4.5L2 8L5 11.5M11 4.5L14 8L11 11.5M9 3L7 13" stroke="var(--aurora-accent-primary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case "video":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1.5" y="3" width="10" height="10" rx="1.5" stroke="var(--aurora-warn)" strokeWidth="1.2" />
          <path d="M11.5 6L14.5 4.5V11.5L11.5 10V6Z" stroke="var(--aurora-warn)" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )
    case "audio":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 6V10M6 4V12M9 5.5V10.5M12 7V9" stroke="var(--aurora-success)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )
    case "document":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 2.5C3 1.95 3.45 1.5 4 1.5H9L13 5.5V13.5C13 14.05 12.55 14.5 12 14.5H4C3.45 14.5 3 14.05 3 13.5V2.5Z" stroke="var(--aurora-text-muted)" strokeWidth="1.2" fill="none" />
          <path d="M9 1.5V5.5H13" stroke="var(--aurora-text-muted)" strokeWidth="1.2" />
          <path d="M5.5 8.5H10.5M5.5 10.5H8.5" stroke="var(--aurora-text-muted)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 2.5C3 1.95 3.45 1.5 4 1.5H9L13 5.5V13.5C13 14.05 12.55 14.5 12 14.5H4C3.45 14.5 3 14.05 3 13.5V2.5Z" stroke="var(--aurora-border-strong)" strokeWidth="1.2" fill="none" />
          <path d="M9 1.5V5.5H13" stroke="var(--aurora-border-strong)" strokeWidth="1.2" />
        </svg>
      )
  }
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1.5 3.5H12.5M1.5 7H12.5M1.5 10.5H12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5L4.5 7.5L8.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function UploadCloudIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M26 24C28.8 24 31 21.8 31 19C31 16.5 29.2 14.4 26.8 13.9C27 13.3 27 12.7 27 12C27 8.7 24.3 6 21 6C18.6 6 16.5 7.3 15.4 9.2C14.7 8.8 13.8 8.5 12.9 8.5C10.2 8.5 8 10.7 8 13.4C8 13.6 8 13.9 8.1 14.1C6.1 14.8 5 16.7 5 18.5C5 21.5 7.2 24 10 24" stroke="var(--aurora-accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 16V28M18 16L14 20M18 16L22 20" stroke="var(--aurora-accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Sidebar sections
// ---------------------------------------------------------------------------

const SIDEBAR_ITEMS: { id: SidebarSection; label: string; icon: React.ReactNode }[] = [
  {
    id: "recent",
    label: "Recent",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "documents",
    label: "Documents",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2.5 2C2.5 1.45 2.95 1 3.5 1H8L11.5 4.5V12C11.5 12.55 11.05 13 10.5 13H3.5C2.95 13 2.5 12.55 2.5 12V2Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 1V4.5H11.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1V9M7 9L4.5 6.5M7 9L9.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 11H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "project",
    label: "Project",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M1.5 4C1.5 3.17 2.17 2.5 3 2.5H5.5L7 4H11C11.83 4 12.5 4.67 12.5 5.5V10.5C12.5 11.33 11.83 12 11 12H3C2.17 12 1.5 11.33 1.5 10.5V4Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "uploads",
    label: "Uploads",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 10V2M7 2L4.5 4.5M7 2L9.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
]

// ---------------------------------------------------------------------------
// Selection chip
// ---------------------------------------------------------------------------

function SelectionChip({ file, onRemove }: { file: FileItem; onRemove: () => void }) {
  return (
    <div style={FP.chipWrap}>
      <FileTypeIcon type={file.type} />
      <span style={FP.chipLabel}>{file.name}</span>
      <Button
        variant="plain"
        size="unstyled"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        style={FP.chipRemove}
      >
        <CloseIcon />
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Grid card
// ---------------------------------------------------------------------------

function FileGridCard({ file, selected, onToggle }: { file: FileItem; selected: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <Button
      variant="plain"
      size="unstyled"
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={selected}
      style={gridCardStyle(selected, hovered)}
    >
      {/* Thumbnail / icon area */}
      <div style={FP.gridCardThumb}>
        {file.thumbnailUrl ? (
          <img src={file.thumbnailUrl} alt={file.name} style={FP.gridCardThumbImg} />
        ) : (
          <div style={FP.gridCardIconBox}>
            <FileTypeIcon type={file.type} />
          </div>
        )}

        {/* Selection check */}
        {selected && (
          <div style={FP.gridCardCheck}>
            <CheckIcon />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={FP.gridCardInfo}>
        <p style={FP.gridCardName}>{file.name}</p>
        <p style={FP.gridCardDate}>{relativeTime(file.modifiedAt)}</p>
      </div>
    </Button>
  )
}

// ---------------------------------------------------------------------------
// List row
// ---------------------------------------------------------------------------

function FileListRow({ file, selected, onToggle }: { file: FileItem; selected: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <Button
      variant="plain"
      size="unstyled"
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={selected}
      style={listRowStyle(selected, hovered)}
    >
      {/* Icon */}
      <div style={FP.listRowIconBox}>
        <FileTypeIcon type={file.type} />
      </div>

      {/* Name */}
      <span style={FP.listRowName}>{file.name}</span>

      {/* Size */}
      <span style={FP.listRowSize}>{formatBytes(file.size)}</span>

      {/* Date */}
      <span style={FP.listRowDate}>{relativeTime(file.modifiedAt)}</span>

      {/* Check */}
      {selected && (
        <div style={FP.listRowCheck}>
          <CheckIcon />
        </div>
      )}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Drag-drop overlay (CSS keyframes + responsive overrides)
// ---------------------------------------------------------------------------

const KEYFRAMES_FP = `
@keyframes aurora-fp-in {
  from { opacity: 0; transform: translate(-50%, calc(-50% - 12px)); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}

.aurora-file-picker-search:focus-within {
  border-color: var(--aurora-border-strong);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent);
}

@media (max-width: 640px) {
  .aurora-file-picker-dialog {
    width: calc(100vw - 24px) !important;
    height: calc(100vh - 48px) !important;
    max-height: calc(100vh - 48px) !important;
  }

  .aurora-file-picker-body {
    flex-direction: column !important;
  }

  .aurora-file-picker-sidebar {
    width: 100% !important;
    max-height: 126px !important;
    border-right: 0 !important;
    border-bottom: 1px solid var(--aurora-border-default) !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 6px !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }

  .aurora-file-picker-sidebar-title,
  .aurora-file-picker-upload-spacer {
    display: none !important;
  }

  .aurora-file-picker-sidebar button {
    flex: 1 1 calc(33.333% - 6px) !important;
    justify-content: flex-start !important;
    min-width: 0 !important;
  }

  .aurora-file-picker-main {
    min-height: 0 !important;
  }

  .aurora-file-picker-toolbar {
    flex-wrap: wrap !important;
    align-items: stretch !important;
  }

  .aurora-file-picker-search {
    flex-basis: 100% !important;
  }

  .aurora-file-picker-filters {
    overflow-x: auto !important;
    max-width: 100% !important;
  }

  .aurora-file-picker-footer {
    align-items: stretch !important;
    flex-direction: column !important;
  }

  .aurora-file-picker-actions {
    width: 100% !important;
  }

  .aurora-file-picker-actions button {
    flex: 1 !important;
  }
}
`

// ---------------------------------------------------------------------------
// Main FilePicker
// ---------------------------------------------------------------------------

const FILTER_CHIPS: { id: FilterChip; label: string }[] = [
  { id: "all", label: "All" },
  { id: "images", label: "Images" },
  { id: "documents", label: "Documents" },
  { id: "code", label: "Code" },
]

export function FilePicker({
  open,
  onOpenChange,
  onSelect,
  multiple = true,
  accept,
  files = DEMO_FILES,
}: FilePickerProps) {
  const [activeSection, setActiveSection] = React.useState<SidebarSection>("recent")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<FilterChip>("all")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [draggingOver, setDraggingOver] = React.useState(false)
  const uploadInputRef = React.useRef<HTMLInputElement>(null)

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onOpenChange])

  const filteredFiles = React.useMemo(
    () =>
      files.filter((f) => {
        const nameMatch = f.name.toLowerCase().includes(query.toLowerCase())
        const filterMatch = matchesFilter(f, filter)
        return nameMatch && filterMatch
      }),
    [files, query, filter]
  )

  function toggleFile(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!multiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  function handleConfirm() {
    const pickedFiles = files.filter((f) => selected.has(f.id))
    onSelect(pickedFiles)
    setSelected(new Set())
    onOpenChange(false)
  }

  const selectedFiles = React.useMemo(
    () => files.filter((f) => selected.has(f.id)),
    [files, selected]
  )

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDraggingOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggingOver(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDraggingOver(false)
    // In a real app, handle dropped files here
  }

  if (!open) return null

  const hasSelection = selected.size > 0

  return (
    <>
      <style>{KEYFRAMES_FP}</style>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={() => {
          setSelected(new Set())
          onOpenChange(false)
        }}
        style={FP.backdrop}
      />

      {/* Dialog */}
      <div
        className="aurora-file-picker-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="File picker"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={FP.dialog}
      >
        {/* Drag-drop overlay */}
        {draggingOver && (
          <div style={FP.dragOverlay}>
            <UploadCloudIcon />
            <p style={FP.dragOverlayText}>Drop files to upload</p>
          </div>
        )}

        <div className="aurora-file-picker-body" style={FP.body}>
          {/* Sidebar */}
          <div className="aurora-file-picker-sidebar" style={FP.sidebar}>
            <p className="aurora-file-picker-sidebar-title" style={FP.sidebarTitle}>Files</p>

            {SIDEBAR_ITEMS.map((item) => (
              <Button
                variant="plain"
                size="unstyled"
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={sidebarNavStyle(activeSection === item.id)}
              >
                <span style={FP.sidebarNavIcon}>{item.icon}</span>
                {item.label}
              </Button>
            ))}

            {/* Upload button */}
            <div className="aurora-file-picker-upload-spacer" style={FP.uploadSpacer} />
            <input
              ref={uploadInputRef}
              type="file"
              multiple={multiple}
              accept={accept}
              style={{ display: "none" }}
              onChange={(e) => {
                // Handled by parent in real use
                e.target.value = ""
              }}
            />
            <Button
              variant="plain"
              size="unstyled"
              onClick={() => uploadInputRef.current?.click()}
              style={FP.uploadBtn}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M6.5 9V1M6.5 1L3.5 4M6.5 1L9.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1.5 11H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Upload
            </Button>
          </div>

          {/* Main area */}
          <div className="aurora-file-picker-main" style={FP.main}>
            {/* Toolbar */}
            <div className="aurora-file-picker-toolbar" style={FP.toolbar}>
              {/* Search */}
              <div className="aurora-file-picker-search" style={FP.searchBox}>
                <span style={FP.searchIcon}>
                  <SearchIcon />
                </span>
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search files…"
                  className="h-auto border-none px-0 py-0 focus-visible:outline-none"
                  style={FP.searchInput}
                />
              </div>

              {/* Filter chips */}
              <div className="aurora-file-picker-filters" style={FP.filtersRow}>
                {FILTER_CHIPS.map((chip) => (
                  <Button
                    variant="plain"
                    size="unstyled"
                    key={chip.id}
                    onClick={() => setFilter(chip.id)}
                    style={filterChipStyle(filter === chip.id)}
                  >
                    {chip.label}
                  </Button>
                ))}
              </div>

              {/* View toggle */}
              <div style={FP.viewToggleContainer}>
                {(["grid", "list"] as ViewMode[]).map((mode) => (
                  <Button
                    variant="plain"
                    size="unstyled"
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-label={mode === "grid" ? "Grid view" : "List view"}
                    style={viewToggleBtnStyle(viewMode === mode)}
                  >
                    {mode === "grid" ? <GridIcon /> : <ListIcon />}
                  </Button>
                ))}
              </div>
            </div>

            {/* File area */}
            <div style={viewMode === "grid" ? FP.fileAreaGrid : FP.fileAreaList}>
              {filteredFiles.length === 0 ? (
                <div style={FP.emptyState}>
                  <SearchIcon />
                  <p style={FP.emptyStateText}>No files found</p>
                </div>
              ) : viewMode === "grid" ? (
                <div style={FP.gridContainer}>
                  {filteredFiles.map((file) => (
                    <FileGridCard
                      key={file.id}
                      file={file}
                      selected={selected.has(file.id)}
                      onToggle={() => toggleFile(file.id)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  {/* List header */}
                  <div style={FP.listHeader}>
                    <div style={FP.listHeaderSpacer} />
                    <span style={FP.listHeaderName}>Name</span>
                    <span style={FP.listHeaderSize}>Size</span>
                    <span style={FP.listHeaderModified}>Modified</span>
                  </div>
                  {filteredFiles.map((file) => (
                    <FileListRow
                      key={file.id}
                      file={file}
                      selected={selected.has(file.id)}
                      onToggle={() => toggleFile(file.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Selection tray + confirm */}
            <div className="aurora-file-picker-footer" style={FP.footer}>
              {/* Selected chips */}
              <div style={FP.chipsTray}>
                {selectedFiles.length === 0 ? (
                  <span style={FP.placeholder}>
                    {multiple ? "Select files to attach" : "Select a file"}
                  </span>
                ) : (
                  selectedFiles.map((f) => (
                    <SelectionChip key={f.id} file={f} onRemove={() => toggleFile(f.id)} />
                  ))
                )}
              </div>

              {/* Actions */}
              <div className="aurora-file-picker-actions" style={FP.actionsRow}>
                <Button
                  variant="plain"
                  size="unstyled"
                  onClick={() => {
                    setSelected(new Set())
                    onOpenChange(false)
                  }}
                  style={FP.cancelBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--aurora-text-primary)"
                    e.currentTarget.style.borderColor = "var(--aurora-border-strong)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--aurora-text-muted)"
                    e.currentTarget.style.borderColor = "var(--aurora-border-default)"
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="plain"
                  size="unstyled"
                  onClick={handleConfirm}
                  disabled={!hasSelection}
                  style={confirmBtnStyle(hasSelection)}
                >
                  {hasSelection
                    ? `Attach ${selected.size} ${selected.size === 1 ? "file" : "files"}`
                    : "Select files"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilePicker
