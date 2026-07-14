"use client"

import * as React from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button";
import {
  ShareDialog,
  Collaborator,
  ExportFormat,
} from "@/registry/aurora/blocks/workspace/share-dialog/share-dialog"

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
        <Button
          variant="aurora"
          size="lg"
          onClick={() => setOpen(true)}
        >
          <Share2 size={15} strokeWidth={1.7} aria-hidden="true" />
          Share
        </Button>
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
            <div style={{ fontFamily: "var(--aurora-font-sans)", fontSize: "12px", fontWeight: 600, color: "var(--aurora-accent-primary)" }}>
              Exported as {lastExport.toUpperCase()}
            </div>
          )}
          {invitedEmails.map((email) => (
            <div key={email} style={{ fontFamily: "var(--aurora-font-sans)", fontSize: "12px", fontWeight: 600, color: "var(--aurora-success)" }}>
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
