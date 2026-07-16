"use client"

import * as React from "react"
import { Check, Copy, Download, Link as LinkGlyph, UserPlus, X } from "lucide-react"
import { Avatar } from "@/registry/aurora/ui/avatar"
import { Button } from "@/registry/aurora/ui/button"
import { Input } from "@/registry/aurora/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/aurora/ui/select"
import { RadioGroup, RadioGroupItem } from "@/registry/aurora/ui/radio-group"
import { useClipboard } from "@/registry/aurora/lib/use-clipboard"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CollaboratorRole = "viewer" | "editor" | "admin"

export interface Collaborator {
  id: string
  name: string
  email: string
  /** Initials or avatar URL */
  avatar?: string
  role: CollaboratorRole
}

export type ExportFormat = "html" | "pdf" | "png" | "markdown"

export interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  collaborators?: Collaborator[]
  onExport?: (format: ExportFormat) => void
  onRoleChange?: (id: string, role: CollaboratorRole) => void
  onInvite?: (email: string) => void
}

// ---------------------------------------------------------------------------
// Default collaborators (demo)
// ---------------------------------------------------------------------------

const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: "u1", name: "Alex Morgan", email: "alex@example.com", role: "admin" },
  { id: "u2", name: "Sam Rivera", email: "sam@example.com", role: "editor" },
  { id: "u3", name: "Jordan Lee", email: "jordan@example.com", role: "viewer" },
]

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const ICON_STROKE = 1.7

const SHARE_DIALOG_RESPONSIVE_CSS = `
@media (max-width: 560px) {
  .aurora-share-dialog {
    width: calc(100vw - 24px) !important;
    max-width: calc(100vw - 24px) !important;
    max-height: calc(100vh - 24px);
  }

  .aurora-share-dialog-body {
    max-height: calc(100vh - 124px);
    overflow-y: auto;
  }

  .aurora-share-link-row,
  .aurora-share-invite-form {
    flex-direction: column !important;
  }

  .aurora-share-link-row > button,
  .aurora-share-invite-form > button {
    width: 100%;
    justify-content: center;
  }
}
`

function CloseIcon() {
  return <X size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
}

function CopyIcon() {
  return <Copy size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
}

function CheckIcon() {
  return <Check size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
}

function DownloadIcon() {
  return <Download size={15} strokeWidth={ICON_STROKE} aria-hidden="true" />
}

function LinkIcon() {
  return <LinkGlyph size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
}

function PersonAddIcon() {
  return <UserPlus size={14} strokeWidth={ICON_STROKE} aria-hidden="true" />
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function AvatarCircle({ name, avatar, size = 32 }: { name: string; avatar?: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Avatar src={avatar} alt={name} fallback={initials} size={size} />
  )
}

// ---------------------------------------------------------------------------
// Role select
// ---------------------------------------------------------------------------

const ROLE_LABELS: Record<CollaboratorRole, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
}

function RoleSelect({
  value,
  onChange,
}: {
  value: CollaboratorRole
  onChange: (role: CollaboratorRole) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as CollaboratorRole)}
    >
      <SelectTrigger aria-label="Role" className="h-7 w-[104px] rounded-[8px] px-2 text-[11px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(["viewer", "editor", "admin"] as CollaboratorRole[]).map((r) => (
            <SelectItem key={r} value={r}>
              {ROLE_LABELS[r]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

// ---------------------------------------------------------------------------
// Export format radio
// ---------------------------------------------------------------------------

const EXPORT_FORMATS: { id: ExportFormat; label: string; description: string }[] = [
  { id: "html", label: "HTML", description: "Interactive web page" },
  { id: "pdf", label: "PDF", description: "Printable document" },
  { id: "png", label: "PNG", description: "Flat image snapshot" },
  { id: "markdown", label: "Markdown", description: "Plain text with formatting" },
]

// ---------------------------------------------------------------------------
// Inline share chip
// ---------------------------------------------------------------------------

function ShareChip({ url }: { url: string }) {
  const { copied, error, copy } = useClipboard(2000)
  const copyLink = React.useCallback(() => void copy(url), [copy, url])

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px 4px 6px",
        background: "color-mix(in srgb, var(--aurora-accent-primary) 9%, var(--aurora-panel-medium))",
        border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 25%, var(--aurora-border-default))",
        borderRadius: "10px",
        maxWidth: "320px",
      }}
    >
      <span style={{ color: "var(--aurora-accent-primary)", display: "flex", alignItems: "center" }}>
        <LinkIcon />
      </span>
      <span
        style={{
          fontSize: "12px",
          color: "var(--aurora-text-muted)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          minWidth: 0,
          fontFamily: "var(--aurora-font-sans)",
          fontWeight: 500,
        }}
      >
        {url}
      </span>
      <Button variant="plain" size="unstyled"
        onClick={copyLink}
        aria-label={copied ? "Copied link" : error ? "Unable to copy link" : "Copy link"}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: copied ? "var(--aurora-success)" : "var(--aurora-text-muted)",
          padding: 0,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transition: "color 0.15s",
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab button
// ---------------------------------------------------------------------------

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button variant="plain" size="unstyled"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active
          ? "2px solid var(--aurora-accent-primary)"
          : "2px solid transparent",
        color: active ? "var(--aurora-accent-primary)" : "var(--aurora-text-muted)",
        fontSize: "13px",
        fontWeight: active ? 600 : 500,
        padding: "10px 16px",
        cursor: "pointer",
        fontFamily: "var(--aurora-font-sans)",
        transition: "color 0.12s, border-color 0.12s",
      }}
    >
      {children}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Main dialog
// ---------------------------------------------------------------------------

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

export function ShareDialog({
  open,
  onOpenChange,
  url,
  collaborators = DEFAULT_COLLABORATORS,
  onExport,
  onRoleChange,
  onInvite,
}: ShareDialogProps) {
  const [activeTab, setActiveTab] = React.useState<"share" | "export">("share")
  const { copied, error: copyError, copy } = useClipboard(2500)
  const [roles, setRoles] = React.useState<Record<string, CollaboratorRole>>(
    () => Object.fromEntries(collaborators.map((c) => [c.id, c.role]))
  )
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("pdf")

  const copyLink = React.useCallback(() => void copy(url), [copy, url])

  function handleRoleChange(id: string, role: CollaboratorRole) {
    setRoles((prev) => ({ ...prev, [id]: role }))
    onRoleChange?.(id, role)
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    onInvite?.(inviteEmail.trim())
    setInviteEmail("")
  }

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <>
      <style>{SHARE_DIALOG_RESPONSIVE_CSS}</style>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "var(--aurora-overlay)",
        }}
      />

      {/* Dialog */}
      <div
        className="aurora-share-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Share dialog"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          width: "520px",
          maxWidth: "calc(100vw - 32px)",
          background: "var(--aurora-panel-strong)",
          border: "1px solid var(--aurora-border-strong)",
          borderRadius: "var(--aurora-radius-2)",
          boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-strong)",
          overflow: "hidden",
          animation: "aurora-share-in 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 0",
            borderBottom: "1px solid var(--aurora-border-default)",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--aurora-text-primary)",
                fontFamily: "var(--aurora-font-display)",
              }}
            >
              Share
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            <TabButton active={activeTab === "share"} onClick={() => setActiveTab("share")}>
              Share
            </TabButton>
            <TabButton active={activeTab === "export"} onClick={() => setActiveTab("export")}>
              Export
            </TabButton>
          </div>

          <Button variant="plain" size="unstyled"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--aurora-text-muted)",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--aurora-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--aurora-text-muted)")}
          >
            <CloseIcon />
          </Button>
        </div>

        {/* Body */}
        <div className="aurora-share-dialog-body" style={{ padding: "20px" }}>
          {/* ── Share tab ── */}
          {activeTab === "share" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* URL row */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  Shareable link
                </label>
                <div className="aurora-share-link-row" style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "8px 11px",
                      background: "var(--aurora-control-surface)",
                      border: "1px solid var(--aurora-border-default)",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }}>
                      <LinkIcon />
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontFamily: "var(--aurora-font-sans)",
                        fontWeight: 500,
                        color: "var(--aurora-text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {url}
                    </span>
                  </div>
                  <Button variant="plain" size="unstyled"
                    onClick={copyLink}
                    aria-label={copied ? "Copied link" : copyError ? "Unable to copy link" : "Copy link"}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      background: copied
                        ? "color-mix(in srgb, var(--aurora-success) 14%, transparent)"
                        : "var(--aurora-accent-primary)",
                      border: copied
                        ? "1px solid color-mix(in srgb, var(--aurora-success) 35%, transparent)"
                        : "none",
                      borderRadius: "10px",
                      color: copied ? "var(--aurora-success)" : "var(--aurora-accent-foreground)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "background 0.2s, color 0.2s",
                      fontFamily: "var(--aurora-font-sans)",
                    }}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    {copied ? "Copied" : copyError ? "Copy Failed" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Collaborators */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  People with access
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    maxHeight: "180px",
                    overflowY: "auto",
                  }}
                >
                  {collaborators.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "7px 10px",
                        borderRadius: "10px",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--aurora-hover-bg)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <AvatarCircle name={c.name} avatar={c.avatar} size={30} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--aurora-text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: "var(--aurora-font-sans)",
                          }}
                        >
                          {c.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "var(--aurora-text-muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.email}
                        </p>
                      </div>
                      <RoleSelect
                        value={roles[c.id] ?? c.role}
                        onChange={(role) => handleRoleChange(c.id, role)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite */}
              <form
                onSubmit={handleInvite}
                className="aurora-share-invite-form"
                style={{ display: "flex", gap: "8px" }}
                aria-label="Invite people"
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "8px 11px",
                    background: "var(--aurora-control-surface)",
                    border: "1px solid var(--aurora-border-default)",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ color: "var(--aurora-text-muted)", flexShrink: 0 }}>
                    <PersonAddIcon />
                  </span>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Add people by email…"
                    className="h-auto border-none px-0 py-0 focus-visible:outline-none"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontSize: "13px",
                      color: "var(--aurora-text-primary)",
                      fontFamily: "var(--aurora-font-sans)",
                      caretColor: "var(--aurora-accent-primary)",
                    }}
                  />
                </div>
                <Button variant="plain" size="unstyled"
                  type="submit"
                  disabled={!inviteEmail.trim()}
                  style={{
                    padding: "8px 14px",
                    background: inviteEmail.trim()
                      ? "var(--aurora-accent-primary)"
                      : "var(--aurora-control-surface)",
                    border: "1px solid var(--aurora-border-default)",
                    borderRadius: "10px",
                    color: inviteEmail.trim() ? "var(--aurora-accent-foreground)" : "var(--aurora-text-muted)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: inviteEmail.trim() ? "pointer" : "default",
                    flexShrink: 0,
                    transition: "background 0.15s, color 0.15s",
                    fontFamily: "var(--aurora-font-sans)",
                  }}
                >
                  Invite
                </Button>
              </form>
            </div>
          )}

          {/* ── Export tab ── */}
          {activeTab === "export" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  Format
                </p>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={(next) => setExportFormat(next as ExportFormat)}
                  aria-label="Export format"
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  {EXPORT_FORMATS.map((fmt) => {
                    const selected = exportFormat === fmt.id
                    return (
                      <div
                        key={fmt.id}
                        onClick={() => setExportFormat(fmt.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 14px",
                          background: selected
                            ? "color-mix(in srgb, var(--aurora-accent-primary) 9%, var(--aurora-panel-medium))"
                            : "var(--aurora-panel-medium)",
                          border: selected
                            ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 35%, transparent)"
                            : "1px solid var(--aurora-border-default)",
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "background 0.12s, border-color 0.12s",
                        }}
                      >
                        <RadioGroupItem
                          value={fmt.id}
                        />
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              fontWeight: 600,
                              color: selected
                                ? "var(--aurora-accent-primary)"
                                : "var(--aurora-text-primary)",
                              fontFamily: "var(--aurora-font-sans)",
                              transition: "color 0.12s",
                            }}
                          >
                            {fmt.label}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              color: "var(--aurora-text-muted)",
                              fontFamily: "var(--aurora-font-sans)",
                            }}
                          >
                            {fmt.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>

              {/* Share chip preview */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--aurora-text-muted)",
                  }}
                >
                  Share link
                </p>
                <ShareChip url={url} />
              </div>

              {/* Download button */}
              <Button variant="plain" size="unstyled"
                onClick={() => onExport?.(exportFormat)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "11px",
                  background: "var(--aurora-accent-gradient)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.22), 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 45%, transparent), 0 2px 10px color-mix(in srgb, var(--aurora-accent-primary) 30%, transparent)",
                  border: "none",
                  borderRadius: "var(--aurora-radius-1)",
                  color: "var(--aurora-accent-foreground)",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--aurora-font-sans)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <DownloadIcon />
                Export as {exportFormat.toUpperCase()}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ShareDialog
