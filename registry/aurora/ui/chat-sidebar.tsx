"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Scoped style layer (reads --aurora-* tokens)                              */
/* -------------------------------------------------------------------------- */

const STYLE_ID = "aurora-chat-sidebar-styles"

const CHAT_SIDEBAR_CSS = `
.aurora-chat-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-sans);
  color: var(--aurora-text-primary);
  background: var(--aurora-page-bg);
  border-right: 1px solid var(--aurora-border-default);
}

/* Brand row */
.aurora-chat-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 18px 14px;
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--aurora-text-primary);
}
.aurora-chat-sidebar__brand svg {
  flex: 0 0 auto;
}

/* New chat + search live in a padded header block */
.aurora-chat-sidebar__head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 18px 14px;
}

/* New chat button */
.aurora-chat-sidebar__new {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 11px 16px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 42%, transparent);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--aurora-accent-primary) 16%, var(--aurora-panel-strong)) 0%,
    var(--aurora-panel-strong) 100%
  );
  color: var(--aurora-text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 18%, transparent),
    0 8px 18px color-mix(in srgb, var(--aurora-accent-primary) 14%, transparent);
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
}
.aurora-chat-sidebar__new:hover {
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 60%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--aurora-accent-primary) 28%, transparent),
    0 10px 22px color-mix(in srgb, var(--aurora-accent-primary) 20%, transparent);
}
.aurora-chat-sidebar__new:focus-visible {
  outline: none;
  border-color: var(--aurora-accent-strong);
  box-shadow: 0 0 0 3px var(--aurora-focus-ring-strong);
}
.aurora-chat-sidebar__new-icon {
  flex: 0 0 auto;
  color: var(--aurora-text-primary);
}

/* Search field */
.aurora-chat-sidebar__search {
  position: relative;
  display: flex;
  align-items: center;
}
.aurora-chat-sidebar__search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--aurora-text-muted);
  pointer-events: none;
}
.aurora-chat-sidebar__search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 14px 9px 40px;
  border-radius: 8px;
  border: 1px solid var(--aurora-border-default);
  background: var(--aurora-control-surface);
  color: var(--aurora-text-primary);
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.2;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
.aurora-chat-sidebar__search-input::placeholder {
  color: var(--aurora-text-muted);
}
.aurora-chat-sidebar__search-input:focus-visible {
  outline: none;
  border-color: var(--aurora-accent-strong);
  box-shadow: 0 0 0 3px var(--aurora-focus-ring-strong);
}

/* Thread list */
.aurora-chat-sidebar__threads {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.aurora-chat-sidebar__bucket {
  padding: 18px 8px 4px;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--aurora-text-muted);
}
.aurora-chat-sidebar__thread {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--aurora-text-muted);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}
.aurora-chat-sidebar__thread:hover {
  background: var(--aurora-panel-medium);
  color: var(--aurora-text-primary);
}
.aurora-chat-sidebar__thread:focus-visible {
  outline: none;
  border-color: var(--aurora-accent-strong);
  box-shadow: 0 0 0 3px var(--aurora-focus-ring-strong);
}
.aurora-chat-sidebar__thread[data-active="true"] {
  background: color-mix(in srgb, var(--aurora-accent-primary) 12%, var(--aurora-panel-medium));
  border-color: color-mix(in srgb, var(--aurora-accent-primary) 48%, transparent);
  color: var(--aurora-text-primary);
  font-weight: 700;
}
.aurora-chat-sidebar__thread-icon {
  flex: 0 0 auto;
  color: var(--aurora-accent-strong);
}
.aurora-chat-sidebar__thread[data-active="false"] .aurora-chat-sidebar__thread-icon {
  color: var(--aurora-text-muted);
}
.aurora-chat-sidebar__thread-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* User footer */
.aurora-chat-sidebar__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
  padding: 12px 16px;
  border-top: 1px solid var(--aurora-border-default);
  background: var(--aurora-page-bg);
}
.aurora-chat-sidebar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill, 999px);
  border: 1px solid color-mix(in srgb, var(--aurora-accent-primary) 48%, transparent);
  background: color-mix(in srgb, var(--aurora-accent-primary) 14%, var(--aurora-panel-medium));
  color: var(--aurora-accent-strong);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
}
.aurora-chat-sidebar__user {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1 1 auto;
}
.aurora-chat-sidebar__user-name {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--aurora-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.aurora-chat-sidebar__user-plan {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--aurora-text-muted);
}
.aurora-chat-sidebar__menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: var(--radius-1, 14px);
  border: 1px solid transparent;
  background: transparent;
  color: var(--aurora-text-muted);
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}
.aurora-chat-sidebar__menu:hover {
  background: var(--aurora-panel-medium);
  color: var(--aurora-text-primary);
}
.aurora-chat-sidebar__menu:focus-visible {
  outline: none;
  border-color: var(--aurora-accent-strong);
  box-shadow: 0 0 0 3px var(--aurora-focus-ring-strong);
}
`

function useChatSidebarStyles() {
  React.useInsertionEffect(() => {
    if (typeof document === "undefined") return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement("style")
    el.id = STYLE_ID
    el.textContent = CHAT_SIDEBAR_CSS
    document.head.appendChild(el)
  }, [])
}

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ThreadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function KebabIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface ChatSidebarThread {
  /** Stable identifier used for selection state. */
  id: string
  /** Conversation title shown in the rail. */
  title: React.ReactNode
  /** Bucket label this thread belongs to (e.g. "Today"). Threads are grouped by bucket in source order. */
  bucket: string
}

export interface ChatSidebarUser {
  /** Display name shown in the footer. */
  name: React.ReactNode
  /** Initials rendered in the avatar disc. */
  initials: string
  /** Plan / subtitle line under the name. */
  plan?: React.ReactNode
}

export interface ChatSidebarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Brand content for the top row (icon + wordmark). */
  brand?: React.ReactNode
  /** Conversation threads, grouped by their `bucket` in first-seen order. */
  threads?: ChatSidebarThread[]
  /** Initially-active thread id (uncontrolled). */
  defaultActiveId?: string
  /** Controlled active thread id. */
  activeId?: string
  /** Fired when a thread is chosen. */
  onSelectThread?: (id: string) => void
  /** Fired when the New chat button is pressed. */
  onNewChat?: () => void
  /** Placeholder for the search input. */
  searchPlaceholder?: string
  /** Footer user descriptor. */
  user?: ChatSidebarUser
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

function ChatSidebar({
  ref,
  brand,
  threads = [],
  defaultActiveId,
  activeId: controlledActiveId,
  onSelectThread,
  onNewChat,
  searchPlaceholder = "Search conversations...",
  user,
  className,
  ...props
}: ChatSidebarProps & { ref?: React.Ref<HTMLElement> }) {
    useChatSidebarStyles()

    const isControlled = controlledActiveId != null
    const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState(
      defaultActiveId,
    )
    const activeId = isControlled ? controlledActiveId : uncontrolledActiveId

    const handleSelect = React.useCallback(
      (id: string) => {
        if (!isControlled) setUncontrolledActiveId(id)
        onSelectThread?.(id)
      },
      [isControlled, onSelectThread],
    )

    // Group threads by bucket, preserving first-seen order.
    const groups = React.useMemo(() => {
      const order: string[] = []
      const byBucket = new Map<string, ChatSidebarThread[]>()
      for (const thread of threads) {
        if (!byBucket.has(thread.bucket)) {
          byBucket.set(thread.bucket, [])
          order.push(thread.bucket)
        }
        byBucket.get(thread.bucket)!.push(thread)
      }
      return order.map((bucket) => ({
        bucket,
        items: byBucket.get(bucket)!,
      }))
    }, [threads])

    return (
      <nav
        ref={ref}
        className={cn("aurora-chat-sidebar", className)}
        aria-label="Conversations"
        {...props}
      >
        {brand != null ? (
          <div className="aurora-chat-sidebar__brand">{brand}</div>
        ) : null}

        <div className="aurora-chat-sidebar__head">
          <button
            type="button"
            className="aurora-chat-sidebar__new"
            onClick={onNewChat}
          >
            <PlusIcon className="aurora-chat-sidebar__new-icon" />
            New chat
          </button>

          <div className="aurora-chat-sidebar__search">
            <SearchIcon className="aurora-chat-sidebar__search-icon" />
            <input
              type="search"
              className="aurora-chat-sidebar__search-input"
              placeholder={searchPlaceholder}
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="aurora-chat-sidebar__threads">
          {groups.map((group) => (
            <React.Fragment key={group.bucket}>
              <div className="aurora-chat-sidebar__bucket">{group.bucket}</div>
              {group.items.map((thread) => {
                const isActive = thread.id === activeId
                return (
                  <button
                    key={thread.id}
                    type="button"
                    className="aurora-chat-sidebar__thread"
                    data-active={isActive}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => handleSelect(thread.id)}
                  >
                    <ThreadIcon className="aurora-chat-sidebar__thread-icon" />
                    <span className="aurora-chat-sidebar__thread-title">
                      {thread.title}
                    </span>
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>

        {user != null ? (
          <div className="aurora-chat-sidebar__footer">
            <span className="aurora-chat-sidebar__avatar" aria-hidden="true">
              {user.initials}
            </span>
            <span className="aurora-chat-sidebar__user">
              <span className="aurora-chat-sidebar__user-name">{user.name}</span>
              {user.plan != null ? (
                <span className="aurora-chat-sidebar__user-plan">
                  {user.plan}
                </span>
              ) : null}
            </span>
            <button
              type="button"
              className="aurora-chat-sidebar__menu"
              aria-label="Account menu"
            >
              <KebabIcon />
            </button>
          </div>
        ) : null}
      </nav>
    )
}

export { ChatSidebar }
export default ChatSidebar
