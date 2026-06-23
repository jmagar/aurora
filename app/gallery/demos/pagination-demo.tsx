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

// ─── CD dsCard composition ──────────────────────────────────────────────────
// Mirrors the Claude Design source 1:1:
//   <Pagination total={12} defaultPage={4} />
// rendered on a small padded card. Numbered · ellipsis · glow, page 4 active.

const TOTAL = 12;

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

function CdPagination({
  total = TOTAL,
  defaultPage = 4,
}: {
  total?: number;
  defaultPage?: number;
}) {
  const [page, setPage] = React.useState(defaultPage);

  function go(n: number) {
    setPage(Math.max(1, Math.min(total, n)));
  }

  const pageItems = buildPageItems(page, total);

  return (
    <Pagination>
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
              cursor: page === total ? "not-allowed" : "pointer",
              opacity: page === total ? 0.4 : 1,
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default function PaginationDemo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "34px 30px",
        background: "var(--aurora-page-bg)",
        color: "var(--aurora-text-primary)",
        borderRadius: "var(--aurora-radius-2)",
        border: "1px solid var(--aurora-border-default)",
      }}
    >
      <CdPagination total={12} defaultPage={4} />
    </div>
  );
}
