"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/registry/aurora/ui/pagination";

// Mock data: 60 fake gateway rows (5 per page = 12 pages)

type GatewayStatus = "healthy" | "degraded" | "offline" | "deploying";

interface Gateway {
  id: string;
  name: string;
  env: string;
  region: string;
  rps: number;
  status: GatewayStatus;
}

const STATUS_COLORS: Record<GatewayStatus, string> = {
  healthy: "#7dd3c7",
  degraded: "#c6a36b",
  offline: "#c78490",
  deploying: "#29b6f6",
};

const SUFFIXES = ["prod", "edge", "auth", "proxy", "mesh", "core", "internal", "public", "admin", "worker"];
const ENVS = ["production", "staging", "development"];
const REGIONS = ["us-east-1", "eu-west-1", "ap-southeast-2", "us-west-2"];
const STATUSES: GatewayStatus[] = ["healthy", "healthy", "healthy", "degraded", "offline", "deploying"];

const ALL_GATEWAYS: Gateway[] = Array.from({ length: 60 }, (_, i) => {
  const index = i + 1;
  return {
    id: `gw-${String(index).padStart(3, "0")}`,
    name: `api-gateway-${SUFFIXES[i % 10]}-${index}`,
    env: ENVS[i % 3],
    region: REGIONS[i % 4],
    rps: Math.round(80 + ((i * 137 + 41) % 8000) / 10) * 10,
    status: STATUSES[(i * 7 + 3) % STATUSES.length],
  };
}) as Gateway[];

const PAGE_SIZE = 5;
const TOTAL_PAGES = Math.ceil(ALL_GATEWAYS.length / PAGE_SIZE);

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--aurora-text-muted)",
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

function buildPageItems(
  page: number,
  total: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", total];
  if (page >= total - 3)
    return [1, "ellipsis-start", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis-start", page - 1, page, page + 1, "ellipsis-end", total];
}

function InteractivePaginatedTable() {
  const [page, setPage] = React.useState(1);

  const rows = ALL_GATEWAYS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageItems = buildPageItems(page, TOTAL_PAGES);

  function go(n: number) {
    setPage(Math.max(1, Math.min(TOTAL_PAGES, n)));
  }

  const startRow = (page - 1) * PAGE_SIZE + 1;
  const endRow = Math.min(page * PAGE_SIZE, ALL_GATEWAYS.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          border: "1px solid var(--aurora-border-default)",
          borderRadius: "var(--aurora-radius-2)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--aurora-panel-strong)",
                borderBottom: "1px solid var(--aurora-border-default)",
              }}
            >
              {["Gateway", "Env", "Region", "RPS", "Status"].map((h, hi) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 14px",
                    textAlign: hi === 3 ? "right" : "left",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--aurora-text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((gw, ri) => (
              <tr
                key={gw.id}
                style={{
                  borderBottom:
                    ri < rows.length - 1
                      ? "1px solid var(--aurora-border-default)"
                      : undefined,
                  background:
                    ri % 2 === 0
                      ? "var(--aurora-panel-medium)"
                      : "var(--aurora-panel-strong)",
                }}
              >
                <td style={{ padding: "10px 14px", fontFamily: "var(--aurora-font-mono)", fontSize: 12, color: "var(--aurora-text-primary)", whiteSpace: "nowrap" }}>{gw.name}</td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--aurora-font-mono)", fontSize: 11, color: "var(--aurora-text-muted)" }}>{gw.env}</td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--aurora-font-mono)", fontSize: 11, color: "var(--aurora-text-muted)" }}>{gw.region}</td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--aurora-font-mono)", fontSize: 11, color: "var(--aurora-text-muted)", textAlign: "right" }}>{gw.rps.toLocaleString()}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "var(--aurora-font-mono)", color: STATUS_COLORS[gw.status] }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: STATUS_COLORS[gw.status], flexShrink: 0 }} />
                    {gw.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--aurora-text-muted)",
            fontFamily: "var(--aurora-font-mono)",
          }}
        >
          {startRow}-{endRow} of {ALL_GATEWAYS.length} gateways
        </span>

        <Pagination style={{ width: "auto", justifyContent: "flex-end" }}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => go(page - 1)}
                style={{
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.4 : 1,
                }}
              />
            </PaginationItem>

            {pageItems.map((p, i) =>
              typeof p === "string" ? (
                <PaginationItem key={`${p}-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => go(p)}
                    style={{ cursor: "pointer" }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => go(page + 1)}
                style={{
                  cursor: page === TOTAL_PAGES ? "not-allowed" : "pointer",
                  opacity: page === TOTAL_PAGES ? 0.4 : 1,
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default function PaginationDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <section>
        <Label>Interactive - gateway list (60 rows, 5 per page)</Label>
        <InteractivePaginatedTable />
      </section>

      <section>
        <Label>First page</Label>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious style={{ opacity: 0.4, pointerEvents: "none" }} />
            </PaginationItem>
            {[1, 2, 3, 4, 5].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === 1}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>12</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <section>
        <Label>Middle - page 6 of 12</Label>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {[5, 6, 7].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === 6}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>12</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <section>
        <Label>Last page</Label>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {[8, 9, 10, 11, 12].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === 12}>{p}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext style={{ opacity: 0.4, pointerEvents: "none" }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <section>
        <Label>Small size</Label>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious size="sm" />
            </PaginationItem>
            {[1, 2, 3, 4, 5].map((p) => (
              <PaginationItem key={p}>
                <PaginationLink size="sm" isActive={p === 2}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext size="sm" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  );
}
