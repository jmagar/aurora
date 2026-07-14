"use client"

import * as React from "react"
import { FileTree, TreeNode } from "@/registry/aurora/blocks/files/file-tree/file-tree"
import { CodeEditor } from "@/registry/aurora/blocks/files/code-editor/code-editor"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FileEntry {
  filename: string
  language: string
  code: string
}

export interface CodeWorkspaceProps {
  /** The file tree to display in the left rail. */
  tree: TreeNode[]
  /** Map from tree node id to file content. Only file nodes need entries. */
  files: Record<string, FileEntry>
  /** Id of the node to open on first render. */
  defaultSelectedId?: string
  /** Ids of folder nodes to expand on first render. */
  defaultExpandedIds?: string[]
  /** Optional fixed height for the workspace container. Defaults to 480px. */
  height?: number | string
  /** Optional CSS class for the outermost container. */
  className?: string
  style?: React.CSSProperties
}

const RESPONSIVE_CSS = `
@container aurora-code-workspace (max-width: 560px) {
  .aurora-code-workspace {
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: minmax(150px, 36%) minmax(0, 1fr);
  }

  .aurora-code-workspace__explorer {
    width: 100% !important;
    border-right: 0 !important;
    border-bottom: 1px solid var(--aurora-border-default);
    min-height: 150px;
    max-height: 220px;
  }

  .aurora-code-workspace__editor {
    min-height: 240px;
  }
}
`

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Walk a tree and return the first file node id encountered depth-first. */
function firstFileId(nodes: TreeNode[]): string | undefined {
  for (const node of nodes) {
    if (node.type === "file") return node.id
    if (node.children) {
      const found = firstFileId(node.children)
      if (found) return found
    }
  }
  return undefined
}

// ---------------------------------------------------------------------------
// CodeWorkspace
// ---------------------------------------------------------------------------

export function CodeWorkspace({
  tree,
  files,
  defaultSelectedId,
  defaultExpandedIds,
  height = 480,
  className,
  style,
}: CodeWorkspaceProps) {
  const initialId = defaultSelectedId ?? firstFileId(tree)
  const [activeId, setActiveId] = React.useState<string | undefined>(initialId)

  const activeFile = activeId ? files[activeId] : undefined

  function handleSelect(node: TreeNode) {
    if (node.type === "file") setActiveId(node.id)
  }

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>
      <div
        className="aurora-code-workspace-shell"
        style={{
          containerType: "inline-size",
          containerName: "aurora-code-workspace",
          width: "100%",
          minWidth: 0,
        }}
      >
        <div
          className={["aurora-code-workspace", className].filter(Boolean).join(" ")}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px, 220px) minmax(0, 1fr)",
            width: "100%",
            height,
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-2)",
            overflow: "hidden",
            boxShadow: "var(--aurora-shadow-medium)",
            background: "var(--aurora-panel-medium)",
            ...style,
          }}
        >
          {/* Left rail — Explorer */}
          <div
            className="aurora-code-workspace__explorer"
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              background: "var(--aurora-panel-medium)",
              borderRight: "1px solid var(--aurora-border-default)",
              overflow: "hidden",
            }}
          >
            {/* Explorer header */}
            <div
              style={{
                height: "38px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                paddingLeft: "12px",
                paddingRight: "8px",
                borderBottom: "1px solid var(--aurora-border-default)",
                background: "var(--aurora-panel-strong)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--aurora-font-sans)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--aurora-text-muted)",
                  userSelect: "none",
                }}
              >
                Explorer
              </span>
            </div>

            {/* Tree scroll area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 4px" }}>
              <FileTree
                tree={tree}
                onSelect={handleSelect}
                defaultSelectedId={initialId}
                defaultExpandedIds={defaultExpandedIds}
              />
            </div>
          </div>

          {/* Right side — Code editor (flush / embedded) */}
          {activeFile ? (
            <div className="aurora-code-workspace__editor" style={{ minWidth: 0, minHeight: 0, display: "flex" }}>
              <CodeEditor
                filename={activeFile.filename}
                language={activeFile.language}
                code={activeFile.code}
                embedded
              />
            </div>
          ) : (
            /* Empty state when no file is selected or file map has no entry */
            <div
              className="aurora-code-workspace__editor"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--aurora-control-surface)",
                color: "var(--aurora-text-muted)",
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "13px",
              }}
            >
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CodeWorkspace
