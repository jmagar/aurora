"use client";

import * as React from "react";
import { DataTable, type Column } from "@/registry/aurora/ui/data-table";
import { GalleryPageIntro } from "@/components/gallery-page-intro";

type Row = { gw: string; code: number; p99: number };

const columns: Column<Row>[] = [
  {
    key: "gw",
    label: "Gateway",
    sortable: true,
    render: (v) => <span>{v as string}</span>,
  },
  {
    key: "code",
    label: "Code",
    sortable: true,
    numeric: true,
    render: (v) => (
      <span
        style={{
          color:
            v === 200 ? "var(--aurora-success)" : "var(--aurora-error)",
        }}
      >
        {v as number}
      </span>
    ),
  },
  { key: "p99", label: "P99 (ms)", sortable: true, numeric: true },
];

const data: Row[] = [
  { gw: "edge-1", code: 200, p99: 42 },
  { gw: "edge-2", code: 200, p99: 51 },
  { gw: "edge-3", code: 502, p99: 88 },
  { gw: "edge-4", code: 200, p99: 37 },
];

export default function DataTableDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <GalleryPageIntro
        eyebrow="Components"
        heading="Data Table"
        description="Sortable table — click any header to cycle ascending, descending, then unsorted. Status codes and gateway IDs keep the same UI text treatment as the rest of the grid."
      />

      <div style={{ maxWidth: 520 }}>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
