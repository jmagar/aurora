"use client"

import * as React from "react"
import { Ellipsis, MessageSquareText, Plus, Search } from "lucide-react"

import { cn } from "@/lib/utils"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

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
  /** Optional plain-text value used for search filtering when `title` is rich markup. */
  searchText?: string
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
  /** Controlled search query shown in the search input. */
  searchValue?: string
  /** Initial search query for uncontrolled usage. */
  defaultSearchValue?: string
  /** Fired whenever the search query changes. */
  onSearchValueChange?: (value: string) => void
  /** Optional message rendered when no conversations match the current search. */
  emptyMessage?: React.ReactNode
  /** Footer user descriptor. */
  user?: ChatSidebarUser
  /** Fired when the account menu button is pressed. */
  onOpenAccountMenu?: () => void
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
    searchValue: controlledSearchValue,
    defaultSearchValue = "",
    onSearchValueChange,
    emptyMessage,
    user,
    onOpenAccountMenu,
    className,
    ref,
    ...props
  }: ChatSidebarProps & { ref?: React.Ref<HTMLElement> },
) {
  const isControlled = controlledActiveId != null
  const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState(
    defaultActiveId,
  )
  const isSearchControlled = controlledSearchValue != null
  const [uncontrolledSearchValue, setUncontrolledSearchValue] = React.useState(
    defaultSearchValue,
  )

  const activeId = isControlled ? controlledActiveId : uncontrolledActiveId
  const searchValue = isSearchControlled
    ? controlledSearchValue
    : uncontrolledSearchValue
  const normalizedQuery = searchValue.trim().toLowerCase()

  const handleSelect = React.useCallback(
    (id: string) => {
      if (!isControlled) setUncontrolledActiveId(id)
      onSelectThread?.(id)
    },
    [isControlled, onSelectThread],
  )

  const handleSearchChange = React.useCallback(
    (value: string) => {
      if (!isSearchControlled) {
        setUncontrolledSearchValue(value)
      }
      onSearchValueChange?.(value)
    },
    [isSearchControlled, onSearchValueChange],
  )

  const filteredThreads = React.useMemo(() => {
    if (!normalizedQuery) return threads

    return threads.filter((thread) => {
      const candidate =
        thread.searchText ??
        (typeof thread.title === "string" ? thread.title : "") ??
        ""
      return candidate.toLowerCase().includes(normalizedQuery)
    })
  }, [normalizedQuery, threads])

  const groups = React.useMemo(() => {
    const order: string[] = []
    const byBucket = new Map<string, ChatSidebarThread[]>()
    for (const thread of filteredThreads) {
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
  }, [filteredThreads])

  const resolvedEmptyMessage =
    emptyMessage ??
    (normalizedQuery
      ? `No conversations match "${searchValue.trim()}".`
      : "No conversations found.")

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
          disabled={onNewChat == null}
        >
          <Plus className="aurora-chat-sidebar__new-icon" size={18} strokeWidth={1.9} aria-hidden="true" />
          New Chat
        </button>

        <div className="aurora-chat-sidebar__search">
          <Search
            className="aurora-chat-sidebar__search-icon"
            size={18}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="search"
            className="aurora-chat-sidebar__search-input"
            placeholder={searchPlaceholder}
            aria-label="Search conversations"
            autoComplete="off"
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>
      </div>

      <div className="aurora-chat-sidebar__threads">
        {groups.length > 0 ? (
          groups.map((group, groupIndex) => {
            const headingId = `chat-sidebar-${groupIndex}-${group.bucket
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}`

            return (
              <section key={group.bucket} aria-labelledby={headingId}>
                <div id={headingId} className="aurora-chat-sidebar__bucket">
                  {group.bucket}
                </div>
                {group.items.map((thread) => {
                  const isActive = thread.id === activeId
                  return (
                    <button
                      key={thread.id}
                      type="button"
                      className="aurora-chat-sidebar__thread"
                      data-active={isActive}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => handleSelect(thread.id)}
                    >
                      <MessageSquareText
                        className="aurora-chat-sidebar__thread-icon"
                        size={18}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <span className="aurora-chat-sidebar__thread-title">
                        {thread.title}
                      </span>
                    </button>
                  )
                })}
              </section>
            )
          })
        ) : (
          <p
            className="aurora-text-body-sm"
            style={{
              margin: 0,
              padding: "18px 12px",
              color: "var(--aurora-text-muted)",
            }}
          >
            {resolvedEmptyMessage}
          </p>
        )}
      </div>

      {user != null ? (
        <div className="aurora-chat-sidebar__footer">
          <span className="aurora-chat-sidebar__avatar" aria-hidden="true">
            {user.initials}
          </span>
          <span className="aurora-chat-sidebar__user">
            <span className="aurora-chat-sidebar__user-name">{user.name}</span>
            {user.plan != null ? (
              <span className="aurora-chat-sidebar__user-plan">{user.plan}</span>
            ) : null}
          </span>
          {onOpenAccountMenu ? (
            <button
              type="button"
              className="aurora-chat-sidebar__menu"
              aria-label="Account Menu"
              onClick={onOpenAccountMenu}
            >
              <Ellipsis size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </nav>
  )
}

export { ChatSidebar }
export default ChatSidebar
