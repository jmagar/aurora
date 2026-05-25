"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button";
import { FilePicker, FileItem } from "@/registry/aurora/blocks/files/file-picker/file-picker"

const MOCK_FILES: FileItem[] = [
  {
    id: "fp1",
    name: "config.toml",
    type: "code",
    size: 3_200,
    modifiedAt: new Date(Date.now() - 60_000),
    path: "/gateway/config.toml",
  },
  {
    id: "fp2",
    name: "gateway.rs",
    type: "code",
    size: 18_400,
    modifiedAt: new Date(Date.now() - 300_000),
    path: "/src/gateway.rs",
  },
  {
    id: "fp3",
    name: "README.md",
    type: "document",
    size: 5_120,
    modifiedAt: new Date(Date.now() - 86_400_000),
    path: "/README.md",
  },
  {
    id: "fp4",
    name: "schema.json",
    type: "code",
    size: 9_800,
    modifiedAt: new Date(Date.now() - 172_800_000),
    path: "/api/schema.json",
  },
  {
    id: "fp5",
    name: ".env.example",
    type: "code",
    size: 1_024,
    modifiedAt: new Date(Date.now() - 604_800_000),
    path: "/.env.example",
  },
]

export function FilePickerDemo() {
  const [open, setOpen] = React.useState(true)
  const [selectedFiles, setSelectedFiles] = React.useState<FileItem[]>([])

  function handleSelect(files: FileItem[]) {
    setSelectedFiles(files)
    setOpen(false)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "24px",
        minHeight: "520px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <Button
          variant="aurora"
          size="lg"
          onClick={() => setOpen(true)}
        >
          Open file picker
        </Button>

        {selectedFiles.length > 0 && (
          <span
            style={{
              fontFamily: "var(--aurora-font-sans)",
              fontSize: "13px",
              color: "var(--aurora-text-muted)",
            }}
          >
            Selected:{" "}
            <span style={{ color: "var(--aurora-accent-primary)", fontWeight: 600 }}>
              {selectedFiles.map((f) => f.name).join(", ")}
            </span>
          </span>
        )}
      </div>

      <FilePicker
        open={open}
        onOpenChange={setOpen}
        onSelect={handleSelect}
        multiple
        files={MOCK_FILES}
      />
    </div>
  )
}

export default FilePickerDemo
