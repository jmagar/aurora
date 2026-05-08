"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SortDirection = "asc" | "desc" | "none";

export interface Column<TRow extends Record<string, unknown> = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  numeric?: boolean;
  render?: (value: unknown, row: TRow) => React.ReactNode;
}

export interface DataTableProps<TRow extends Record<string, unknown> = Record<string, unknown>>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: Column<TRow>[];
  data: TRow[];
}

// ---------------------------------------------------------------------------
// Sort icon
// ---------------------------------------------------------------------------

function SortIcon({ direction }: { direction: SortDirection }) {
  const color =
    direction === "none"
      ? "var(--aurora-border-strong)"
      : "var(--aurora-accent-primary)";

  return (
    <span
      aria-hidden
      style={{ color, fontSize: 11, lineHeight: 1, userSelect: "none" }}
    >
      {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
    </span>
  );
}

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------

export function DataTable<TRow extends Record<string, unknown>>({
  columns,
  data,
  className,
  ...rest
}: DataTableProps<TRow>) {
  // Sort state: { key, direction }
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>("none");

  function handleSort(col: Column<TRow>) {
    if (!col.sortable) return;
    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDir("asc");
    } else {
      setSortDir((prev) =>
        prev === "none" ? "asc" : prev === "asc" ? "desc" : "none",
      );
      if (sortDir === "desc") setSortKey(null);
    }
  }

  const sorted = React.useMemo(() => {
    if (!sortKey || sortDir === "none") return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
              numeric: true,
            });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{
        background: "var(--aurora-panel-medium)",
        border: `1px solid var(--aurora-border-strong)`,
        borderRadius: 8,
      }}
      {...rest}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => handleSort(col)}
                  className={cn(
                    "px-4 py-2.5 text-left text-[10px] font-semibold uppercase",
                    col.sortable && "cursor-pointer select-none",
                    col.numeric && "text-right tabular-nums",
                  )}
                  style={{
                    letterSpacing: "0.14em",
                    color: "var(--aurora-text-muted)",
                    borderBottom: `1px solid var(--aurora-border-default)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        direction={
                          sortKey === col.key ? sortDir : "none"
                        }
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="group transition-colors"
                style={
                  {
                    "--hover-bg": "color-mix(in srgb, var(--aurora-hover-bg) 60%, transparent)",
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "color-mix(in srgb, var(--aurora-hover-bg) 60%, transparent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-[13px]",
                      col.numeric && "text-right tabular-nums",
                    )}
                    style={{
                      color: "var(--aurora-text-primary)",
                      borderBottom:
                        rowIdx < sorted.length - 1
                          ? `1px solid var(--aurora-border-default)`
                          : "none",
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] as React.ReactNode) ?? null}
                  </td>
                ))}
              </tr>
            ))}

            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-[13px]"
                  style={{ color: "var(--aurora-text-muted)" }}
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.displayName = "DataTable";
