"use client";

import * as React from "react";
import { GalleryPageIntro } from "@/components/gallery-page-intro";
import { DataTable, type Column } from "@/registry/aurora/ui/data-table";

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

type GatewayStatus = "active" | "inactive" | "deploying" | "error";

const STATUS_CONFIG: Record<GatewayStatus, { color: string; label: string }> = {
  active:    { color: "var(--aurora-success)",        label: "Active"    },
  inactive:  { color: "var(--aurora-text-muted)",     label: "Inactive"  },
  deploying: { color: "var(--aurora-accent-primary)", label: "Deploying" },
  error:     { color: "var(--aurora-error)",          label: "Error"     },
};

function StatusBadge({ status }: { status: GatewayStatus }) {
  const { color, label } = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px 2px 5px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
        color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 4px 1px ${color}66`,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Version chip
// ---------------------------------------------------------------------------

function VersionChip({ version }: { version: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--aurora-font-mono)",
        fontSize: 11,
        padding: "2px 6px",
        borderRadius: 4,
        background: "var(--aurora-control-surface)",
        border: "1px solid var(--aurora-border-default)",
        color: "var(--aurora-text-muted)",
      }}
    >
      {version}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type GatewayRow = {
  name: string;
  status: GatewayStatus;
  reqPerMin: number;
  p99Ms: number;
  version: string;
};

const GATEWAYS: GatewayRow[] = [
  { name: "api-gateway-prod",    status: "active",    reqPerMin: 2841, p99Ms: 72,  version: "v3.2.1"      },
  { name: "api-gateway-prod-2",  status: "active",    reqPerMin: 1540, p99Ms: 88,  version: "v3.2.1"      },
  { name: "api-gateway-staging", status: "deploying", reqPerMin: 320,  p99Ms: 104, version: "v3.3.0-rc1"  },
  { name: "internal-gw",        status: "active",    reqPerMin: 890,  p99Ms: 61,  version: "v3.2.0"      },
  { name: "partner-gw",         status: "error",     reqPerMin: 0,    p99Ms: 0,   version: "v3.1.4"      },
  { name: "dev-gw",             status: "inactive",  reqPerMin: 0,    p99Ms: 0,   version: "v3.3.0-dev"  },
  { name: "eu-west-gw",         status: "active",    reqPerMin: 1205, p99Ms: 95,  version: "v3.2.1"      },
  { name: "apac-gw",            status: "active",    reqPerMin: 678,  p99Ms: 142, version: "v3.2.0"      },
];

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

const COLUMNS: Column<Record<string, unknown>>[] = [
  {
    key: "name",
    label: "Name",
    sortable: false,
    render: (val) => (
      <span style={{ fontFamily: "var(--aurora-font-mono)", fontSize: 12 }}>
        {val as string}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (val) => <StatusBadge status={val as GatewayStatus} />,
  },
  {
    key: "reqPerMin",
    label: "Req / min",
    sortable: true,
    numeric: true,
    render: (val) => (
      <span style={{ fontVariantNumeric: "tabular-nums" } as React.CSSProperties}>
        {(val as number).toLocaleString()}
      </span>
    ),
  },
  {
    key: "p99Ms",
    label: "P99 (ms)",
    sortable: true,
    numeric: true,
    render: (val) => {
      const ms = val as number;
      const color =
        ms === 0   ? "var(--aurora-text-muted)"
        : ms < 100 ? "var(--aurora-success)"
        : ms < 150 ? "var(--aurora-warn)"
        :             "var(--aurora-error)";
      return (
        <span style={{ color, fontWeight: 600 }}>
          {ms === 0 ? "—" : `${ms}`}
        </span>
      );
    },
  },
  {
    key: "version",
    label: "Version",
    sortable: true,
    render: (val) => <VersionChip version={val as string} />,
  },
];

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

export default function TablesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GalleryPageIntro
        eyebrow="Data"
        heading="Tables"
        description="This is the sortable data-table pattern. Keep the separate Table route for primitive structure when you need fully custom layouts."
      />

      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
        }}
      >
        Gateway roster — click column headers to sort
      </p>

      <DataTable
        columns={COLUMNS}
        data={GATEWAYS as unknown as Record<string, unknown>[]}
      />

      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
          marginTop: 8,
        }}
      >
        Empty state
      </p>
      <DataTable columns={COLUMNS} data={[]} />
    </div>
  );
}
