"use client"

import * as React from "react"
import { ChevronDown, Download, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/registry/aurora/ui/dropdown-menu"
import { Button } from "@/registry/aurora/ui/button"

export default function DropdownsDemo() {
  const [viewDetailsChecked, setViewDetailsChecked] = React.useState(true)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        Gateway options menu
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="neutral" size="sm">
              production-edge
              <ChevronDown data-icon="inline-end" aria-hidden />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" style={{ minWidth: "13rem" }}>
            <DropdownMenuLabel>Gateway Options</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={viewDetailsChecked}
                onCheckedChange={setViewDetailsChecked}
              >
                View Details
              </DropdownMenuCheckboxItem>

              <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Download aria-hidden />
                Download Logs
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem danger>
                <Trash2 aria-hidden />
                Delete Gateway
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <p
          style={{
            fontSize: 12,
            color: "var(--aurora-text-muted)",
            alignSelf: "center",
            fontStyle: "italic",
          }}
        >
          Click the button to open the gateway options menu.
        </p>
      </div>
    </div>
  )
}
