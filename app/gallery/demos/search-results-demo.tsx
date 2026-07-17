"use client"

import * as React from "react"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { FilterBar, FilterSearch } from "@/registry/aurora/ui/filter-bar"
import {
  SearchResultItem,
  SearchResults,
  SearchResultsGroup,
} from "@/registry/aurora/ui/search-results"

const resultGroups = [
  {
    heading: "Commands",
    items: [
      {
        id: "command-rebuild",
        title: "Rebuild Registry",
        description: "Run the shadcn registry build and refresh public output.",
        meta: "Task",
      },
      {
        id: "command-lint",
        title: "Run Lint",
        description: "Check the worktree for token and composition drift.",
        meta: "Workflow",
      },
    ],
  },
  {
    heading: "Conversations",
    items: [
      {
        id: "chat-docs",
        title: "Search component docs",
        description: "Review the latest shadcn API guidance before editing.",
        meta: "Thread",
      },
      {
        id: "chat-registry",
        title: "Registry follow-up",
        description: "Validate generated JSON after the source updates land.",
        meta: "Thread",
      },
    ],
  },
]

export default function SearchResultsDemo() {
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState("command-rebuild")

  const filteredGroups = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return resultGroups

    return resultGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          `${item.title} ${item.description}`.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [query])

  return (
    <div className="grid gap-6">
      <GalleryPageIntro
        eyebrow="Components"
        heading="SearchResults"
        description="Grouped result rows with active selection, metadata, and a searchable empty state."
      />

      <section
        className="grid gap-4"
        style={{
          padding: "30px",
          borderRadius: "var(--aurora-radius-2)",
          border: "1px solid var(--aurora-border-strong)",
          background: "var(--aurora-panel-strong)",
        }}
      >
        <FilterBar showClearAll={query.length > 0} onClearAll={() => setQuery("")}>
          <FilterSearch
            placeholder="Search commands and conversations…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
          />
        </FilterBar>

        {filteredGroups.length > 0 ? (
          <SearchResults style={{ maxWidth: 560 }}>
            {filteredGroups.map((group) => (
              <SearchResultsGroup key={group.heading} heading={group.heading}>
                {group.items.map((item) => (
                  <SearchResultItem
                    key={item.id}
                    active={selectedId === item.id}
                    title={item.title}
                    description={item.description}
                    meta={item.meta}
                    onClick={() => setSelectedId(item.id)}
                  />
                ))}
              </SearchResultsGroup>
            ))}
          </SearchResults>
        ) : (
          <div
            className="aurora-text-body-sm"
            style={{
              borderRadius: "var(--aurora-radius-2)",
              border: "1px solid var(--aurora-border-default)",
              background: "var(--aurora-panel-medium)",
              color: "var(--aurora-text-muted)",
              padding: "18px 20px",
            }}
          >
            No results match &quot;{query}&quot;.
          </div>
        )}
      </section>
    </div>
  )
}
