"use client";

import * as React from "react";
import { DataTable, type Column } from "@/registry/aurora/ui/data-table";
import { Badge } from "@/registry/aurora/ui/badge";

type GatewayRow = {
  name: string;
  hostname: string;
  status: string;
  statusVariant: "success" | "warn" | "error";
  reqPerMin: number | null;
  p99: string | null;
  version: string;
};

const data: GatewayRow[] = [
  {
    name: "production-edge",
    hostname: "prod.lab.local",
    status: "Live",
    statusVariant: "success",
    reqPerMin: 1284,
    p99: "42 ms",
    version: "v2.4.1",
  },
  {
    name: "staging",
    hostname: "stage.lab.local",
    status: "Degraded",
    statusVariant: "warn",
    reqPerMin: 143,
    p99: "218 ms",
    version: "v2.5.0-rc",
  },
  {
    name: "dev-local",
    hostname: "localhost:8080",
    status: "Unreachable",
    statusVariant: "error",
    reqPerMin: null,
    p99: null,
    version: "v2.3.8",
  },
];

const columns: Column<GatewayRow>[] = [
  {
    key: "name",
    label: "Gateway",
    sortable: true,
    render: (_value, row) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ color: "var(--aurora-text-primary)", fontWeight: 500 }}>
          {row.name}
        </span>
        <span
          style={{
            fontFamily: "var(--aurora-font-mono, 'JetBrains Mono', monospace)",
            fontSize: 11,
            color: "var(--aurora-text-muted)",
          }}
        >
          {row.hostname}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (_value, row) => (
      <Badge variant={row.statusVariant} dot={true}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: "reqPerMin",
    label: "Req / min",
    sortable: true,
    numeric: true,
    render: (_value, row) =>
      row.reqPerMin !== null ? (
        <span className="tabular-nums">{row.reqPerMin.toLocaleString()}</span>
      ) : (
        <span style={{ color: "var(--aurora-text-muted)" }}>—</span>
      ),
  },
  {
    key: "p99",
    label: "P99",
    sortable: false,
    numeric: true,
    render: (_value, row) =>
      row.p99 !== null ? (
        <span className="tabular-nums">{row.p99}</span>
      ) : (
        <span style={{ color: "var(--aurora-text-muted)" }}>—</span>
      ),
  },
  {
    key: "version",
    label: "Version",
    sortable: true,
    render: (_value, row) => (
      <span
        style={{
          fontFamily: "var(--aurora-font-mono, 'JetBrains Mono', monospace)",
          fontSize: 12,
          color: "var(--aurora-text-muted)",
        }}
      >
        {row.version}
      </span>
    ),
  },
];

export default function TablesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--aurora-text-muted)",
          marginBottom: 4,
        }}
      >
        Gateway Registry — click column headers to sort
      </p>
      <DataTable columns={columns} data={data as unknown as GatewayRow[]} />
    </div>
  );
}
