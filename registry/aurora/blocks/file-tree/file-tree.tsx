"use client"

import * as React from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TreeNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: TreeNode[]
  language?: string
}

export type ContextAction = "new-file" | "rename" | "delete" | "copy-path"

export interface FileTreeProps {
  tree: TreeNode[]
  onSelect?: (node: TreeNode) => void
  onContextAction?: (action: ContextAction, node: TreeNode) => void
}

export interface FileChipProps {
  node: TreeNode
  onDismiss?: (node: TreeNode) => void
}

// ---------------------------------------------------------------------------
// Icon helpers (inline SVG only)
// ---------------------------------------------------------------------------

function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      {open ? (
        <path
          d="M1 3.5C1 2.948 1.448 2.5 2 2.5H5.382L6.618 4H12C12.552 4 13 4.448 13 5V11C13 11.552 12.552 12 12 12H2C1.448 12 1 11.552 1 11V3.5Z"
          fill="var(--aurora-warn)"
          opacity="0.85"
        />
      ) : (
        <>
          <path
            d="M1 3.5C1 2.948 1.448 2.5 2 2.5H5.382L6.618 4H12C12.552 4 13 4.448 13 5V11C13 11.552 12.552 12 12 12H2C1.448 12 1 11.552 1 11V3.5Z"
            fill="var(--aurora-warn)"
            opacity="0.55"
          />
          <path
            d="M1 5H13V11C13 11.552 12.552 12 12 12H2C1.448 12 1 11.552 1 11V5Z"
            fill="var(--aurora-warn)"
            opacity="0.35"
          />
        </>
      )}
    </svg>
  )
}

function FileIcon({ language }: { language?: string }) {
  const color =
    language === "typescript" || language === "ts" || language === "tsx"
      ? "var(--aurora-accent-primary)"
      : language === "css" || language === "scss"
      ? "var(--aurora-accent-pink)"
      : language === "json"
      ? "var(--aurora-warn)"
      : language === "md" || language === "markdown"
      ? "var(--aurora-text-muted)"
      : "var(--aurora-border-strong)"

  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="1" width="9" height="12" rx="1.5" fill={color} opacity="0.25" />
      <path
        d="M7.5 1H2C1.448 1 1 1.448 1 2V12C1 12.552 1.448 13 2 13H11C11.552 13 12 12.552 12 12V5.5L7.5 1Z"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.8"
      />
      <path d="M7.5 1V5.5H12" stroke={color} strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        flexShrink: 0,
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path d="M3 2L7 5L3 8" stroke="var(--aurora-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------------------

interface ContextMenuProps {
  x: number
  y: number
  node: TreeNode
  onAction: (action: ContextAction) => void
  onClose: () => void
}

function ContextMenu({ x, y, node, onAction, onClose }: ContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const items: { action: ContextAction; label: string; icon: string; danger?: boolean }[] = [
    { action: "new-file", label: "New file", icon: "+" },
    { action: "rename", label: "Rename", icon: "✎" },
    { action: "copy-path", label: "Copy path", icon: "⎘" },
    { action: "delete", label: "Delete", icon: "✕", danger: true },
  ]

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 9999,
        background: "var(--aurora-panel-strong)",
        border: "1px solid var(--aurora-border-strong)",
        borderRadius: "var(--aurora-radius-1)",
        boxShadow: "var(--aurora-shadow-strong)",
        padding: "4px",
        minWidth: "160px",
        fontFamily: "var(--aurora-font-sans)",
      }}
    >
      <div
        style={{
          padding: "4px 8px 6px",
          borderBottom: "1px solid var(--aurora-border-default)",
          marginBottom: "4px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "var(--aurora-text-muted)",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
            maxWidth: "140px",
          }}
        >
          {node.name}
        </span>
      </div>
      {items.map((item) => (
        <ContextMenuItem
          key={item.action}
          label={item.label}
          icon={item.icon}
          danger={item.danger}
          onClick={() => {
            onAction(item.action)
            onClose()
          }}
        />
      ))}
    </div>
  )
}

function ContextMenuItem({
  label,
  icon,
  danger,
  onClick,
}: {
  label: string
  icon: string
  danger?: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "6px 8px",
        borderRadius: "8px",
        background: hovered ? "var(--aurora-hover-bg)" : "transparent",
        border: "none",
        color: danger
          ? "var(--aurora-error)"
          : hovered
          ? "var(--aurora-text-primary)"
          : "var(--aurora-text-muted)",
        fontSize: "13px",
        fontFamily: "var(--aurora-font-sans)",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.1s, color 0.1s",
      }}
    >
      <span style={{ width: "14px", textAlign: "center", fontSize: "12px" }}>{icon}</span>
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Tree node row
// ---------------------------------------------------------------------------

interface TreeRowProps {
  node: TreeNode
  depth: number
  selected: string | null
  expanded: Set<string>
  onToggle: (id: string) => void
  onSelect: (node: TreeNode) => void
  onContextMenu: (e: React.MouseEvent, node: TreeNode) => void
}

function TreeRow({
  node,
  depth,
  selected,
  expanded,
  onToggle,
  onSelect,
  onContextMenu,
}: TreeRowProps) {
  const [hovered, setHovered] = React.useState(false)
  const isSelected = selected === node.id
  const isOpen = expanded.has(node.id)
  const isFolder = node.type === "folder"

  return (
    <>
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={isFolder ? isOpen : undefined}
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (isFolder) onToggle(node.id)
          onSelect(node)
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          onContextMenu(e, node)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            if (isFolder) onToggle(node.id)
            onSelect(node)
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          paddingLeft: `${8 + depth * 16}px`,
          paddingRight: "8px",
          height: "26px",
          borderRadius: "8px",
          cursor: "pointer",
          background: isSelected
            ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)"
            : hovered
            ? "var(--aurora-hover-bg)"
            : "transparent",
          boxShadow: isSelected ? "var(--aurora-active-glow)" : "none",
          color: isSelected ? "var(--aurora-accent-primary)" : "var(--aurora-text-primary)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "13px",
          fontWeight: isSelected ? 500 : 400,
          userSelect: "none",
          outline: "none",
          transition: "background 0.1s, color 0.1s",
          margin: "1px 0",
        }}
      >
        {isFolder ? (
          <ChevronIcon open={isOpen} />
        ) : (
          <span style={{ width: "10px", flexShrink: 0 }} />
        )}
        {isFolder ? <FolderIcon open={isOpen} /> : <FileIcon language={node.language} />}
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          {node.name}
        </span>
      </div>

      {isFolder && isOpen && node.children && (
        <div role="group">
          {node.children.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// FileTree — main export
// ---------------------------------------------------------------------------

export function FileTree({ tree, onSelect, onContextAction }: FileTreeProps) {
  const [selected, setSelected] = React.useState<string | null>(null)
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set())
  const [contextMenu, setContextMenu] = React.useState<{
    x: number
    y: number
    node: TreeNode
  } | null>(null)

  function handleToggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSelect(node: TreeNode) {
    setSelected(node.id)
    onSelect?.(node)
  }

  function handleContextMenu(e: React.MouseEvent, node: TreeNode) {
    setContextMenu({ x: e.clientX, y: e.clientY, node })
  }

  function handleContextAction(action: ContextAction) {
    if (!contextMenu) return
    onContextAction?.(action, contextMenu.node)
  }

  return (
    <div
      role="tree"
      style={{
        background: "var(--aurora-panel-medium)",
        border: "1px solid var(--aurora-border-default)",
        borderRadius: "var(--aurora-radius-2)",
        padding: "6px",
        fontFamily: "var(--aurora-font-sans)",
        overflowY: "auto",
      }}
    >
      {tree.map((node) => (
        <TreeRow
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          expanded={expanded}
          onToggle={handleToggle}
          onSelect={handleSelect}
          onContextMenu={handleContextMenu}
        />
      ))}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// FileChip — inline file reference chip
// ---------------------------------------------------------------------------

export function FileChip({ node, onDismiss }: FileChipProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 6px 2px 5px",
        borderRadius: "6px",
        background: "var(--aurora-panel-strong)",
        border: "1px solid var(--aurora-border-default)",
        fontFamily: "var(--aurora-font-sans)",
        fontSize: "12px",
        color: "var(--aurora-text-primary)",
        verticalAlign: "middle",
        lineHeight: 1,
      }}
    >
      <FileIcon language={node.language} />
      <span>{node.name}</span>
      {onDismiss && (
        <button
          onClick={() => onDismiss(node)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={`Remove ${node.name}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "14px",
            height: "14px",
            borderRadius: "3px",
            background: hovered ? "var(--aurora-hover-bg)" : "transparent",
            border: "none",
            color: hovered ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
            cursor: "pointer",
            fontSize: "10px",
            padding: 0,
            lineHeight: 1,
            transition: "background 0.1s, color 0.1s",
          }}
        >
          ×
        </button>
      )}
    </span>
  )
}

export default FileTree
