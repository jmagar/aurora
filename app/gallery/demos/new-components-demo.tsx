"use client"

import * as React from "react"
import { Button } from "@/registry/aurora/ui/button"
import { Callout } from "@/registry/aurora/ui/callout"
import { Combobox } from "@/registry/aurora/ui/combobox"
import { DescriptionItem, DescriptionList } from "@/registry/aurora/ui/description-list"
import { Field } from "@/registry/aurora/ui/field"
import { Input } from "@/registry/aurora/ui/input"
import { Kbd } from "@/registry/aurora/ui/kbd"
import { NumberInput } from "@/registry/aurora/ui/number-input"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/registry/aurora/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/registry/aurora/ui/radio-group"
import { ResizablePanels } from "@/registry/aurora/ui/resizable-panels"
import { SearchResultItem, SearchResults, SearchResultsGroup } from "@/registry/aurora/ui/search-results"
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/aurora/ui/sheet"
import { Slider } from "@/registry/aurora/ui/slider"
import { StatusIndicator } from "@/registry/aurora/ui/status-indicator"
import { Timeline, TimelineItem } from "@/registry/aurora/ui/timeline"
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/registry/aurora/ui/toolbar"
import { GitBranch, Play, Search, Settings2 } from "lucide-react"

const panel: React.CSSProperties = {
  background: "var(--aurora-panel-medium)",
  border: "1px solid var(--aurora-border-default)",
  borderRadius: "var(--aurora-radius-2)",
  padding: 24,
}

const heading: React.CSSProperties = {
  color: "var(--aurora-text-primary)",
  fontFamily: "var(--aurora-font-display)",
  fontSize: 18,
  fontWeight: 760,
  lineHeight: 1.2,
  marginBottom: 6,
}

const copy: React.CSSProperties = {
  color: "var(--aurora-text-muted)",
  fontSize: 13,
  lineHeight: 1.55,
}

const gateways = [
  { value: "prod-edge", label: "production-edge", description: "Primary gateway in us-east-1" },
  { value: "staging", label: "staging-router", description: "Pre-release validation surface" },
  { value: "local", label: "local-dev", description: "Docker compose development target" },
]

export default function NewComponentsDemo() {
  const [temperature, setTemperature] = React.useState(0.7)
  const [retries, setRetries] = React.useState(3)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: 0 }}>
      <div>
        <h2 style={heading}>New Primitives</h2>
        <p style={copy}>The missing operator-facing pieces: fields, choice controls, search, overlays, run status, timeline, metadata, and split panes.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
        <section style={panel}>
          <h3 style={heading}>Forms and Choice</h3>
          <div style={{ display: "grid", gap: 16 }}>
            <Field label="Gateway" description="Searchable selection for large option sets" required>
              <Combobox options={gateways} defaultValue="prod-edge" />
            </Field>
            <Field label="Execution Mode">
              <RadioGroup defaultValue="review">
                <RadioGroupItem value="review">Review before running tools</RadioGroupItem>
                <RadioGroupItem value="auto">Run approved tools automatically</RadioGroupItem>
              </RadioGroup>
            </Field>
            <Field label={`Temperature ${temperature.toFixed(1)}`}>
              <Slider min={0} max={2} step={0.1} value={temperature} onValueChange={setTemperature} />
            </Field>
            <Field label="Retry Budget">
              <NumberInput min={0} max={8} value={retries} onValueChange={setRetries} />
            </Field>
          </div>
        </section>

        <section style={panel}>
          <h3 style={heading}>Overlays and Notices</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <Callout title="Gateway policy changed" variant="warn">
              Restart dependent agents before running the next deployment.
            </Callout>
            <Popover>
              <PopoverAnchor>
                <PopoverTrigger asChild>
                  <Button variant="neutral" size="sm">Inspect Policy</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div style={{ ...copy, color: "var(--aurora-text-primary)", fontWeight: 680 }}>Policy Scope</div>
                  <p style={{ ...copy, marginTop: 4 }}>Read-only filesystem access with network tools disabled for this run.</p>
                </PopoverContent>
              </PopoverAnchor>
            </Popover>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="aurora" size="sm">Open Inspector</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle style={{ fontFamily: "var(--aurora-font-display)", fontSize: 18, fontWeight: 760 }}>Run Inspector</SheetTitle>
                  <SheetDescription style={copy}>Live metadata and activity for the selected run.</SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <DescriptionList>
                    <DescriptionItem label="Model" value="gpt-5.5" />
                    <DescriptionItem label="Branch" value="feat/functional-components" />
                    <DescriptionItem label="Latency" value="412 ms" />
                  </DescriptionList>
                </SheetBody>
                <SheetFooter>
                  <Button variant="neutral" size="sm">Export Log</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </section>
      </div>

      <section style={panel}>
        <h3 style={heading}>Operational Status</h3>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StatusIndicator tone="online" label="Gateway connected" />
            <StatusIndicator tone="syncing" label="Syncing registry" />
            <StatusIndicator tone="degraded" label="Partial tool outage" />
            <StatusIndicator tone="error" label="Build failed" />
          </div>
          <Timeline>
            <TimelineItem tone="online" title="Policy loaded" meta="09:41">Read and write grants resolved from project settings.</TimelineItem>
            <TimelineItem tone="syncing" title="Registry build started" meta="09:42">Component JSON is being regenerated.</TimelineItem>
            <TimelineItem tone="queued" title="Docker build queued" meta="next">Waiting for registry output.</TimelineItem>
          </Timeline>
        </div>
      </section>

      <section style={panel}>
        <h3 style={heading}>Metadata and Search</h3>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: 18 }}>
          <DescriptionList>
            <DescriptionItem label="Gateway" value="production-edge" />
            <DescriptionItem label="Commit" value={<code style={{ fontFamily: "var(--aurora-font-mono)" }}>8f31c5a</code>} />
            <DescriptionItem label="Owner" value="platform" />
          </DescriptionList>
          <SearchResults>
            <SearchResultsGroup heading="Commands">
              <SearchResultItem active title="Rebuild Registry" description="Run shadcn build and refresh public/r" meta="⌘R" />
              <SearchResultItem title="Open Logs" description="Tail the dev container logs" meta="⌘L" />
            </SearchResultsGroup>
            <SearchResultsGroup heading="Files">
              <SearchResultItem title="registry.json" description="Published component manifest" />
              <SearchResultItem title="aurora.css" description="Token bridge and utilities" />
            </SearchResultsGroup>
          </SearchResults>
        </div>
      </section>

      <section style={panel}>
        <h3 style={heading}>Toolbar and Shortcuts</h3>
        <Toolbar>
          <ToolbarGroup>
            <Button variant="neutral" size="sm"><Play className="size-3.5" aria-hidden />Run</Button>
            <Button variant="neutral" size="sm"><GitBranch className="size-3.5" aria-hidden />Branch</Button>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <Button variant="ghost" size="sm"><Search className="size-3.5" aria-hidden />Search <Kbd>⌘K</Kbd></Button>
            <Button variant="ghost" size="sm"><Settings2 className="size-3.5" aria-hidden />Settings</Button>
          </ToolbarGroup>
        </Toolbar>
      </section>

      <section style={panel}>
        <h3 style={heading}>Resizable Workbench</h3>
        <ResizablePanels>
          <div style={{ padding: 18 }}>
            <Field label="Prompt">
              <Input defaultValue="Audit new registry components" />
            </Field>
          </div>
          <div style={{ padding: 18 }}>
            <Timeline>
              <TimelineItem tone="online" title="Explorer finished">Found component inventory gaps.</TimelineItem>
              <TimelineItem tone="syncing" title="Executor running">Adding primitives and demos.</TimelineItem>
            </Timeline>
          </div>
        </ResizablePanels>
      </section>
    </div>
  )
}
