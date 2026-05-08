"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/registry/aurora/ui/dropdown-menu";
import { Button } from "@/registry/aurora/ui/button";

export default function DropdownsDemo() {
  const [viewDetailsChecked, setViewDetailsChecked] = React.useState(true);

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
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" style={{ minWidth: "13rem" }}>
            <DropdownMenuLabel>Gateway options</DropdownMenuLabel>

            <DropdownMenuCheckboxItem
              checked={viewDetailsChecked}
              onCheckedChange={setViewDetailsChecked}
            >
              View details
            </DropdownMenuCheckboxItem>

            <DropdownMenuItem>Edit configuration</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6.5 1v7M3 5l3.5 3.5L10 5" />
                <path d="M1 10h11v2H1z" />
              </svg>
              Download logs
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem danger>
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2 3h9M5 3V2h3v1M3 3l.7 8h5.6L10 3" />
                <path d="M5.5 5.5v3M7.5 5.5v3" />
              </svg>
              Delete gateway
            </DropdownMenuItem>
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
  );
}
