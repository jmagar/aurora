"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import {
  ChevronRight,
  Copy,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"

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
  defaultExpandedIds?: string[]
  defaultSelectedId?: string
}

export interface FileChipProps {
  node: TreeNode
  onDismiss?: (node: TreeNode) => void
}

// ---------------------------------------------------------------------------
// Icon helpers
// ---------------------------------------------------------------------------

function FolderIcon({ open }: { open: boolean }) {
  const Icon = open ? FolderOpen : Folder
  return <Icon className="size-3.5 shrink-0" strokeWidth={1.7} style={{ color: "var(--aurora-text-muted)" }} aria-hidden />
}

function FileIcon({ language }: { language?: string }) {
  const Icon =
    language === "typescript" || language === "ts" || language === "tsx" || language === "rust"
      ? FileCode
      : language === "json"
        ? FileJson
        : language === "md" || language === "markdown"
          ? FileText
          : File
  const color =
    language === "typescript" || language === "ts" || language === "tsx" || language === "rust"
      ? "var(--aurora-accent-primary)"
      : language === "css" || language === "scss"
      ? "var(--aurora-accent-pink)"
      : language === "json"
      ? "var(--aurora-accent-pink)"
      : language === "md" || language === "markdown"
      ? "var(--aurora-text-muted)"
      : "var(--aurora-text-muted)"

  return <Icon className="size-3.5 shrink-0" strokeWidth={1.65} style={{ color }} aria-hidden />
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <ChevronRight
      className="size-3 shrink-0"
      strokeWidth={1.8}
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
        color: "var(--aurora-text-muted)",
      }}
      aria-hidden
    />
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

  const items: { action: ContextAction; label: string; icon: React.ReactNode; danger?: boolean }[] = [
    { action: "new-file", label: "New File", icon: <Plus className="size-3.5" aria-hidden /> },
    { action: "rename", label: "Rename", icon: <Pencil className="size-3.5" aria-hidden /> },
    { action: "copy-path", label: "Copy Path", icon: <Copy className="size-3.5" aria-hidden /> },
    { action: "delete", label: "Delete", icon: <Trash2 className="size-3.5" aria-hidden />, danger: true },
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
        borderRadius: 8,
        boxShadow: "var(--aurora-shadow-strong), var(--aurora-highlight-medium)",
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
  icon: React.ReactNode
  danger?: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <Button variant="plain" size="unstyled"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "6px 8px",
        borderRadius: "6px",
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
      <span style={{ alignItems: "center", display: "inline-flex", justifyContent: "center", width: 14 }}>{icon}</span>
      {label}
    </Button>
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
        className="aurora-tree-item"
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
          gap: "6px",
          paddingLeft: `${8 + depth * 14}px`,
          paddingRight: "8px",
          height: "30px",
          borderRadius: 8,
          cursor: "pointer",
          background: isSelected
            ? "color-mix(in srgb, var(--aurora-accent-primary) 12%, transparent)"
            : hovered
            ? "var(--aurora-hover-bg)"
            : "transparent",
          border: isSelected
            ? "1px solid color-mix(in srgb, var(--aurora-accent-primary) 22%, transparent)"
            : "1px solid transparent",
          boxShadow: "none",
          color: isSelected
            ? "var(--aurora-accent-primary)"
            : hovered
            ? "var(--aurora-text-primary)"
            : "var(--aurora-text-muted)",
          fontFamily: "var(--aurora-font-sans)",
          fontSize: "14px",
          fontWeight: isSelected ? 600 : 450,
          userSelect: "none",
          transition: "background 0.1s, border-color 0.1s, color 0.1s",
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

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

export function FileTree({ tree, onSelect, onContextAction, defaultExpandedIds, defaultSelectedId }: FileTreeProps) {
  const [selected, setSelected] = React.useState<string | null>(defaultSelectedId ?? null)
  const [expanded, setExpanded] = React.useState<Set<string>>(
    () => new Set(defaultExpandedIds ?? tree.filter((node) => node.type === "folder").map((node) => node.id))
  )
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
        background: "transparent",
        border: "none",
        borderRadius: 0,
        padding: "0",
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
        <Button variant="plain" size="unstyled"
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
            borderRadius: 3,
            background: hovered ? "var(--aurora-hover-bg)" : "transparent",
            border: "none",
            color: hovered ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            transition: "background 0.1s, color 0.1s",
          }}
        >
          <X className="size-3" aria-hidden />
        </Button>
      )}
    </span>
  )
}

export default FileTree
