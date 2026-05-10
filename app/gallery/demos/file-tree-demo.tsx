"use client"

import * as React from "react"
import { FileTree, FileChip, TreeNode, ContextAction } from "@/registry/aurora/blocks/file-tree/file-tree"

const TREE: TreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "src-main",    name: "main.rs",    type: "file", language: "rust" },
      { id: "src-gateway", name: "gateway.rs", type: "file", language: "rust" },
      { id: "src-lib",     name: "lib.rs",     type: "file", language: "rust" },
      {
        id: "src-handlers",
        name: "handlers",
        type: "folder",
        children: [
          { id: "hdl-auth",    name: "auth.rs",    type: "file", language: "rust" },
          { id: "hdl-proxy",   name: "proxy.rs",   type: "file", language: "rust" },
          { id: "hdl-metrics", name: "metrics.rs", type: "file", language: "rust" },
        ],
      },
    ],
  },
  {
    id: "config",
    name: "config",
    type: "folder",
    children: [
      { id: "cfg-toml",   name: "default.toml",    type: "file", language: "toml" },
      { id: "cfg-prod",   name: "production.toml", type: "file", language: "toml" },
      { id: "cfg-schema", name: "schema.json",     type: "file", language: "json" },
    ],
  },
  { id: "readme",      name: "README.md",   type: "file", language: "md" },
  { id: "cargo",       name: "Cargo.toml",  type: "file", language: "toml" },
  { id: "env-example", name: ".env.example",type: "file", language: "sh" },
]

const INITIAL_NODE = TREE[2]

export function FileTreeDemo() {
  const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(INITIAL_NODE)
  const [lastAction, setLastAction] = React.useState<string | null>(null)
  const [openChips, setOpenChips] = React.useState<TreeNode[]>([INITIAL_NODE])

  function handleSelect(node: TreeNode) {
    setSelectedNode(node)
    if (node.type === "file" && !openChips.find((c) => c.id === node.id)) {
      setOpenChips((prev) => [...prev.slice(-2), node])
    }
  }

  function handleContextAction(action: ContextAction, node: TreeNode) {
    setLastAction(`${action} on ${node.name}`)
  }

  return (
    <div
      className="aurora-file-tree-demo"
    >
      <style>{`
        .aurora-file-tree-demo {
          display: grid;
          grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
          gap: 20px;
          padding: 24px;
          align-items: start;
        }

        @media (max-width: 640px) {
          .aurora-file-tree-demo {
            grid-template-columns: minmax(0, 1fr);
            padding: 0;
          }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-label)",
            fontWeight: "var(--aurora-weight-label)",
            letterSpacing: "var(--aurora-letter-label)",
            color: "var(--aurora-text-muted)",
          }}
        >
          Explorer
        </div>
        <FileTree
          tree={TREE}
          defaultSelectedId={INITIAL_NODE.id}
          onSelect={handleSelect}
          onContextAction={handleContextAction}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "var(--aurora-type-label)",
            fontWeight: "var(--aurora-weight-label)",
            letterSpacing: "var(--aurora-letter-label)",
            color: "var(--aurora-text-muted)",
          }}
        >
          Selection
        </div>

        <div
          style={{
            padding: "18px",
            background: "var(--aurora-panel-medium)",
            border: "1px solid var(--aurora-border-default)",
            borderRadius: "var(--aurora-radius-2)",
            fontFamily: "var(--aurora-font-sans)",
            fontSize: "13px",
            color: "var(--aurora-text-muted)",
            minHeight: "180px",
          }}
        >
          {selectedNode ? (
            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <div style={{ color: "var(--aurora-text-primary)", fontSize: 15, fontWeight: 720 }}>
                  {selectedNode.name}
                </div>
                <div style={{ marginTop: 3 }}>
                  {selectedNode.type === "folder" ? "Folder in gateway workspace" : "Tracked project file"}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "10px",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Type</div>
                  <div style={{ color: "var(--aurora-text-primary)", marginTop: 4 }}>{selectedNode.type}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Language</div>
                  <div style={{ color: "var(--aurora-text-primary)", marginTop: 4 }}>{selectedNode.language ?? "None"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Children</div>
                  <div style={{ color: "var(--aurora-text-primary)", marginTop: 4 }}>{selectedNode.children?.length ?? 0}</div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--aurora-border-default)",
                  color: "var(--aurora-text-muted)",
                  paddingTop: 12,
                }}
              >
                Right-click any row to open file actions. Selecting files keeps the latest three as open tabs below.
              </div>
            </div>
          ) : (
            "Click a file or folder to select it. Right-click for context menu."
          )}
        </div>

        {lastAction && (
          <div
            style={{
              padding: "10px 14px",
              background: "color-mix(in srgb, var(--aurora-accent-primary) 8%, var(--aurora-panel-medium))",
              border: "1px solid color-mix(in srgb, var(--aurora-accent-primary) 20%, transparent)",
              borderRadius: "10px",
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "12px",
              fontWeight: "var(--aurora-weight-ui)",
              color: "var(--aurora-accent-primary)",
            }}
          >
            Action: {lastAction}
          </div>
        )}

        {openChips.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                fontFamily: "var(--aurora-font-sans)",
                fontSize: "var(--aurora-type-label)",
                fontWeight: "var(--aurora-weight-label)",
                letterSpacing: "var(--aurora-letter-label)",
                color: "var(--aurora-text-muted)",
              }}
            >
              Open tabs
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {openChips.map((node) => (
                <FileChip
                  key={node.id}
                  node={node}
                  onDismiss={(n) =>
                    setOpenChips((prev) => prev.filter((c) => c.id !== n.id))
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileTreeDemo
