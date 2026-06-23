"use client"

import * as React from "react"
import { FileTree, TreeNode } from "@/registry/aurora/blocks/files/file-tree/file-tree"

// CD dsCard composition, 1:1:
//   src/
//     components/   (Button.tsx [active], Badge.tsx, Input.tsx)
//     lib/          (tokens.css)   — collapsed
//     index.ts
//   README.md
//   package.json
const TREE: TreeNode[] = [
  {
    id: "/src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "/src/components",
        name: "components",
        type: "folder",
        children: [
          { id: "/src/components/Button.tsx", name: "Button.tsx", type: "file", language: "tsx" },
          { id: "/src/components/Badge.tsx", name: "Badge.tsx", type: "file", language: "tsx" },
          { id: "/src/components/Input.tsx", name: "Input.tsx", type: "file", language: "tsx" },
        ],
      },
      {
        id: "/src/lib",
        name: "lib",
        type: "folder",
        children: [{ id: "/src/lib/tokens.css", name: "tokens.css", type: "file", language: "css" }],
      },
      { id: "/src/index.ts", name: "index.ts", type: "file", language: "ts" },
    ],
  },
  { id: "/README.md", name: "README.md", type: "file", language: "md" },
  { id: "/package.json", name: "package.json", type: "file", language: "json" },
]

export function FileTreeDemo() {
  return (
    <div
      style={{
        maxWidth: "360px",
        padding: "20px",
        background: "var(--aurora-page-bg)",
        borderRadius: "var(--aurora-radius-2)",
      }}
    >
      <FileTree
        tree={TREE}
        defaultExpandedIds={["/src", "/src/components"]}
        defaultSelectedId="/src/components/Button.tsx"
      />
    </div>
  )
}

export default FileTreeDemo
