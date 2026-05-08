"use client"

import * as React from "react"
import {
  ShareDialog,
  Collaborator,
  ExportFormat,
} from "@/registry/aurora/blocks/share-dialog/share-dialog"

const INITIAL_COLLABORATORS: Collaborator[] = [
  { id: "u1", name: "Josh Magar",  email: "jmagar@gmail.com",   role: "admin" },
  { id: "u2", name: "Aria Chen",   email: "aria@lab.local",      role: "editor" },
  { id: "u3", name: "Dev Bot",     email: "bot@lab.local",       role: "viewer" },
  { id: "u4", name: "Sam Rivera",  email: "sam@example.com",     role: "editor" },
]

export function ShareDialogDemo() {
  const [open, setOpen] = React.useState(false)
  const [lastExport, setLastExport] = React.useState<ExportFormat | null>(null)
  const [invitedEmails, setInvitedEmails] = React.useState<string[]>([])
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>(INITIAL_COLLABORATORS)

  function handleExport(format: ExportFormat) {
    setLastExport(format)
  }

  function handleInvite(email: string) {
    setInvitedEmails((prev) => [...prev, email])
    setCollaborators((prev) => [
      ...prev,
      { id: `invited-${email}`, name: email.split("@")[0], email, role: "viewer" },
    ])
  }

  function handleRoleChange(id: string, role: Collaborator["role"]) {
    setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, role } : c)))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            height: "36px",
            padding: "0 16px",
            borderRadius: "10px",
            background: "var(--aurora-accent-primary)",
            border: "none",
            color: "#051520",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4.4 6.3L9.6 3.7M4.4 7.7L9.6 10.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Share
        </button>
        <span style={{ fontFamily: "var(--aurora-font-sans)", fontSize: "12px", color: "var(--aurora-text-muted)" }}>
          {collaborators.length} people with access
        </span>
      </div>

      {(lastExport || invitedEmails.length > 0) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "14px",
            background: "var(--aurora-panel-medium)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--aurora-text-muted)",
              marginBottom: "4px",
            }}
          >
            Activity
          </div>
          {lastExport && (
            <div style={{ fontFamily: "var(--aurora-font-mono)", fontSize: "12px", color: "var(--aurora-accent-primary)" }}>
              Exported as {lastExport.toUpperCase()}
            </div>
          )}
          {invitedEmails.map((email) => (
            <div key={email} style={{ fontFamily: "var(--aurora-font-mono)", fontSize: "12px", color: "var(--aurora-success)" }}>
              Invited {email}
            </div>
          ))}
        </div>
      )}

      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        url="https://lab.local/share/gw-config-abc123"
        collaborators={collaborators}
        onExport={handleExport}
        onRoleChange={handleRoleChange}
        onInvite={handleInvite}
      />
    </div>
  )
}

export default ShareDialogDemo
