"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

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

function ChatSidebar(
  {
    brand,
    threads = [],
    defaultActiveId,
    activeId: controlledActiveId,
    onSelectThread,
    onNewChat,
    searchPlaceholder = "Search conversations...",
    user,
    className,
    ref,
    ...props
  }: ChatSidebarProps & { ref?: React.Ref<HTMLElement> },
) {
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
            New Chat
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
