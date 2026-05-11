"use client"

import * as React from "react"
import { Avatar } from "@/registry/aurora/ui/avatar"
import { Button } from "@/registry/aurora/ui/button"
import { Input } from "@/registry/aurora/ui/input"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Session {
  id: string
  title: string
  updatedAt: Date
  isLive?: boolean
}

export interface Project {
  id: string
  name: string
  sessions: Session[]
}

export interface SidebarProps {
  projects: Project[]
  activeSessionId?: string
  onSessionSelect?: (sessionId: string) => void
  onNewSession?: () => void
  onSettings?: () => void
  variant?: "expanded" | "icon-only"
  userName?: string
  userAvatarUrl?: string
}

// ---------------------------------------------------------------------------
// Time formatting
// ---------------------------------------------------------------------------

function relativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// ---------------------------------------------------------------------------
// Aurora "Labby" stacked-plane SVG mark
// ---------------------------------------------------------------------------

function LabbyMark({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 10 14"
      fill="none"
      aria-label="Aurora"
      style={{ flexShrink: 0 }}
    >
      <path d="M5 0L9 2.5L5 5L1 2.5Z" fill="var(--aurora-accent-primary)" opacity="0.95" />
      <path d="M5 3L9 5.5L5 8L1 5.5Z" fill="var(--aurora-accent-primary)" opacity="0.75" />
      <path d="M5 6L9 8.5L5 11L1 8.5Z" fill="var(--aurora-accent-primary)" opacity="0.5" />
      <path d="M5 9L9 11.5L5 14L1 11.5Z" fill="var(--aurora-accent-primary)" opacity="0.28" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M6.5 2.5V10.5M2.5 6.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 9L11.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s",
        color: "var(--aurora-text-muted)",
      }}
    >
      <path d="M3.5 2.5L7 5.5L3.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M1 3.5C1 2.67 1.67 2 2.5 2H5L6.5 3.5H10.5C11.33 3.5 12 4.17 12 5V9.5C12 10.33 11.33 11 10.5 11H2.5C1.67 11 1 10.33 1 9.5V3.5Z"
        stroke="var(--aurora-text-muted)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 1.5V2.5M7 11.5V12.5M1.5 7H2.5M11.5 7H12.5M3.4 3.4L4.1 4.1M9.9 9.9L10.6 10.6M3.4 10.6L4.1 9.9M9.9 4.1L10.6 3.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Live beacon (pulsing dot)
// ---------------------------------------------------------------------------

function LiveBeacon() {
  return (
    <span
      style={{ position: "relative", display: "inline-block", width: "8px", height: "8px", flexShrink: 0 }}
      aria-label="Live"
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "var(--aurora-success)",
          opacity: 0.4,
          animation: "aurora-beacon 1.5s ease-out infinite",
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: "2px",
          borderRadius: "50%",
          background: "var(--aurora-success)",
        }}
      />
    </span>
  )
}

// ---------------------------------------------------------------------------
// Inline search input
// ---------------------------------------------------------------------------

function SearchInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        margin: "8px 10px 6px",
        padding: "5px 9px",
        background: "var(--aurora-control-surface)",
        border: `1px solid ${focused ? "var(--aurora-border-strong)" : "var(--aurora-border-default)"}`,
        borderRadius: "10px",
        boxShadow: focused
          ? "0 0 0 2px color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent)"
          : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      <span style={{ color: "var(--aurora-text-muted)", display: "flex", flexShrink: 0 }}>
        <SearchIcon />
      </span>
      <Input
        type="text"
        placeholder="Search sessions…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-auto border-none px-0 py-0 focus-visible:outline-none"
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: "12px",
          color: "var(--aurora-text-primary)",
          width: "100%",
          caretColor: "var(--aurora-accent-primary)",
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Session item
// ---------------------------------------------------------------------------

function SessionItem({
  session,
  isActive,
  onSelect,
  iconOnly,
}: {
  session: Session
  isActive: boolean
  onSelect: () => void
  iconOnly: boolean
}) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <Button variant="plain" size="unstyled"
      onClick={onSelect}
      title={iconOnly ? session.title : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={isActive ? "page" : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: iconOnly ? "7px 0" : "6px 10px 6px 12px",
        background: isActive
          ? "var(--aurora-panel-medium)"
          : hovered
          ? "var(--aurora-hover-bg)"
          : "transparent",
        border: "none",
        borderLeft: isActive
          ? "2px solid var(--aurora-accent-primary)"
          : "2px solid transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.12s, border-color 0.12s",
        justifyContent: iconOnly ? "center" : undefined,
        borderRadius: iconOnly ? "0" : "0",
      }}
    >
      {/* Live beacon or session dot */}
      {session.isLive ? (
        <LiveBeacon />
      ) : (
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: isActive ? "var(--aurora-accent-primary)" : "var(--aurora-border-strong)",
            flexShrink: 0,
          }}
        />
      )}

      {!iconOnly && (
        <>
          <span
            style={{
              fontSize: "12.5px",
              color: isActive ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
              fontWeight: isActive ? 500 : 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              minWidth: 0,
            }}
          >
            {session.title}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "var(--aurora-text-muted)",
              flexShrink: 0,
              opacity: 0.7,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {relativeTime(session.updatedAt)}
          </span>
        </>
      )}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// Project group
// ---------------------------------------------------------------------------

function ProjectGroup({
  project,
  activeSessionId,
  onSessionSelect,
  searchQuery,
  iconOnly,
}: {
  project: Project
  activeSessionId?: string
  onSessionSelect?: (id: string) => void
  searchQuery: string
  iconOnly: boolean
}) {
  const [open, setOpen] = React.useState(true)

  const filteredSessions = project.sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (filteredSessions.length === 0 && searchQuery) return null

  return (
    <div>
      {/* Group header */}
      <Button variant="plain" size="unstyled"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          width: "100%",
          padding: iconOnly ? "6px 0" : "5px 10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          justifyContent: iconOnly ? "center" : undefined,
        }}
      >
        {iconOnly ? (
          <FolderIcon />
        ) : (
          <>
            <ChevronIcon open={open} />
            <FolderIcon />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--aurora-text-muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {project.name}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--aurora-text-muted)",
                background: "var(--aurora-control-surface)",
                padding: "1px 5px",
                borderRadius: "8px",
                border: "1px solid var(--aurora-border-default)",
              }}
            >
              {project.sessions.length}
            </span>
          </>
        )}
      </Button>

      {/* Sessions */}
      {(open || iconOnly) && (
        <div>
          {filteredSessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isActive={session.id === activeSessionId}
              onSelect={() => onSessionSelect?.(session.id)}
              iconOnly={iconOnly}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Sidebar component
// ---------------------------------------------------------------------------

export function Sidebar({
  projects,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onSettings,
  variant = "expanded",
  userName,
  userAvatarUrl,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const iconOnly = variant === "icon-only"

  const width = iconOnly ? "48px" : "240px"

  return (
    <>
      <style>{`
        @keyframes aurora-beacon {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <nav
        aria-label="Project sidebar"
        style={{
          display: "flex",
          flexDirection: "column",
          width,
          minWidth: width,
          height: "100%",
          background: "var(--aurora-panel-strong)",
          borderRight: "1px solid var(--aurora-border-default)",
          overflow: "hidden",
          transition: "width 0.2s ease-out",
          boxShadow: "var(--aurora-highlight-medium)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: iconOnly ? "0" : "8px",
            padding: iconOnly ? "10px 0" : "10px 12px",
            borderBottom: "1px solid var(--aurora-border-default)",
            height: "48px",
            flexShrink: 0,
            justifyContent: iconOnly ? "center" : undefined,
          }}
        >
          <LabbyMark size={iconOnly ? 12 : 14} />

          {!iconOnly && (
            <>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--aurora-text-primary)",
                  letterSpacing: "-0.02em",
                  flex: 1,
                }}
              >
                Aurora
              </span>

              {/* New session button */}
              <Button variant="plain" size="unstyled"
                onClick={onNewSession}
                title="New session"
                aria-label="New session"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "7px",
                  background: "var(--aurora-control-surface)",
                  border: "1px solid var(--aurora-border-default)",
                  color: "var(--aurora-text-muted)",
                  cursor: "pointer",
                  transition: "background 0.12s, color 0.12s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--aurora-hover-bg)"
                  e.currentTarget.style.color = "var(--aurora-text-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--aurora-control-surface)"
                  e.currentTarget.style.color = "var(--aurora-text-muted)"
                }}
              >
                <PlusIcon />
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        {!iconOnly && (
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        )}

        {/* Project groups (scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: "8px",
          }}
        >
          {projects.length === 0 && !iconOnly && (
            <div
              style={{
                padding: "20px 14px",
                fontSize: "12px",
                color: "var(--aurora-text-muted)",
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              No projects yet
            </div>
          )}
          {projects.map((project) => (
            <ProjectGroup
              key={project.id}
              project={project}
              activeSessionId={activeSessionId}
              onSessionSelect={onSessionSelect}
              searchQuery={searchQuery}
              iconOnly={iconOnly}
            />
          ))}
        </div>

        {/* Bottom bar: avatar + username + settings */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: iconOnly ? "8px 0" : "8px 10px",
            borderTop: "1px solid var(--aurora-border-default)",
            flexShrink: 0,
            justifyContent: iconOnly ? "center" : undefined,
            height: "48px",
          }}
        >
          <Avatar src={userAvatarUrl} alt={userName ?? "User"} fallback={userName ?? "U"} size={26} />

          {!iconOnly && (
            <>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--aurora-text-primary)",
                  fontWeight: 500,
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                {userName ?? "User"}
              </span>

              <Button variant="plain" size="unstyled"
                onClick={onSettings}
                title="Settings"
                aria-label="Settings"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "7px",
                  background: "transparent",
                  border: "none",
                  color: "var(--aurora-text-muted)",
                  cursor: "pointer",
                  transition: "color 0.12s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--aurora-text-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--aurora-text-muted)"
                }}
              >
                <SettingsIcon />
              </Button>
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Sidebar
