"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SortState = { column: string; direction: "asc" | "desc" } | null;

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

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" | null }) {
  const color = active
    ? "var(--aurora-accent-primary)"
    : "var(--aurora-text-muted)";

  const glyph =
    !active || direction === null ? "↕" : direction === "asc" ? "↑" : "↓";

  return (
    <span
      aria-hidden
      style={{ color, fontSize: 11, lineHeight: 1, userSelect: "none" }}
    >
      {glyph}
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
  const [sortState, setSortState] = React.useState<SortState>(null);

  function handleSort(col: Column<TRow>) {
    if (!col.sortable) return;
    setSortState((prev) => {
      if (prev === null || prev.column !== col.key) {
        // New column — start ascending
        return { column: col.key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        // asc → desc
        return { column: col.key, direction: "desc" };
      }
      // desc → null (clear sort)
      return null;
    });
  }

  const sorted = React.useMemo(() => {
    if (sortState === null) return data;
    const { column, direction } = sortState;
    return [...data].sort((a, b) => {
      const av = a[column];
      const bv = b[column];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
              numeric: true,
            });
      return direction === "asc" ? cmp : -cmp;
    });
  }, [data, sortState]);

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
              {columns.map((col) => {
                const isActive = sortState !== null && sortState.column === col.key;
                return (
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
                          active={isActive}
                          direction={isActive ? sortState!.direction : null}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {sorted.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="group transition-colors"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "color-mix(in srgb, var(--aurora-hover-bg) 60%, transparent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                {columns.map((col) => (
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
