import * as React from "react"
import { DocsNav } from "@/components/site/docs-nav"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid items-start gap-9 pt-8 md:grid-cols-[210px_1fr]">
      <DocsNav />
      <div className="min-w-0 max-w-[680px]">{children}</div>
    </div>
  )
}
