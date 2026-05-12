"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Thinking } from "@/registry/aurora/blocks/ai/thinking/thinking"
import { ToolCalls } from "@/registry/aurora/blocks/ai/tool-calls/tool-calls"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/registry/aurora/ui/alert-dialog"
import { AspectRatio } from "@/registry/aurora/ui/aspect-ratio"
import { Badge } from "@/registry/aurora/ui/badge"
import { Button } from "@/registry/aurora/ui/button"
import { Calendar } from "@/registry/aurora/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/aurora/ui/card"
import { Carousel, CarouselItem } from "@/registry/aurora/ui/carousel"
import { Chart } from "@/registry/aurora/ui/chart"
import { Collapsible } from "@/registry/aurora/ui/collapsible"
import { DatePicker } from "@/registry/aurora/ui/date-picker"
import { Direction } from "@/registry/aurora/ui/direction"
import { HoverCard } from "@/registry/aurora/ui/hover-card"
import { InputGroup, InputGroupAddon } from "@/registry/aurora/ui/input-group"
import { InputOTP } from "@/registry/aurora/ui/input-otp"
import { Item } from "@/registry/aurora/ui/item"
import { Label } from "@/registry/aurora/ui/label"
import { NavigationMenu, NavigationMenuItem } from "@/registry/aurora/ui/navigation-menu"
import { ScrollArea } from "@/registry/aurora/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/aurora/ui/table"
import { Toggle } from "@/registry/aurora/ui/toggle"
import { ToggleGroup } from "@/registry/aurora/ui/toggle-group"
import {
  Agent,
  AudioPlayer,
  Canvas,
  Checkpoint,
  Commit,
  Confirmation,
  Connection,
  ContextPanel,
  Controls,
  Conversation,
  Edge,
  EnvironmentVariables,
  Image,
  InlineCitation,
  JsxPreview,
  MicSelector,
  Message,
  MessageAvatar,
  MessageContent,
  ModelSelector,
  Node,
  OpenInChat,
  PackageInfo,
  Panel,
  Persona,
  Queue,
  Sandbox,
  SchemaDisplay,
  Shimmer,
  Snippet,
  Source,
  Sources,
  SpeechInput,
  StackTrace,
  Suggestion,
  TaskList,
  TestResults,
  Transcription,
  VoiceSelector,
} from "@/registry/aurora/blocks/ai/elements/ai-elements"
import { Callout } from "@/registry/aurora/ui/callout"
import { Combobox } from "@/registry/aurora/ui/combobox"
import { DescriptionItem, DescriptionList } from "@/registry/aurora/ui/description-list"
import { Field } from "@/registry/aurora/ui/field"
import { Input } from "@/registry/aurora/ui/input"
import { Kbd } from "@/registry/aurora/ui/kbd"
import { Listbox, ListboxGroup, ListboxItem } from "@/registry/aurora/ui/listbox"
import { NumberInput } from "@/registry/aurora/ui/number-input"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/registry/aurora/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/registry/aurora/ui/radio-group"
import { ResizablePanels } from "@/registry/aurora/ui/resizable-panels"
import { NativeSelect } from "@/registry/aurora/ui/native-select"
import { SearchResultItem, SearchResults, SearchResultsGroup } from "@/registry/aurora/ui/search-results"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/aurora/ui/select"
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/aurora/ui/sheet"
import { Slider } from "@/registry/aurora/ui/slider"
import { StatusIndicator } from "@/registry/aurora/ui/status-indicator"
import { Textarea } from "@/registry/aurora/ui/textarea"
import { Timeline, TimelineItem } from "@/registry/aurora/ui/timeline"
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/registry/aurora/ui/toolbar"

const TITLES: Record<string, string> = {
  "alert-dialog": "Alert dialog",
  "aspect-ratio": "Aspect ratio",
  calendar: "Calendar",
  card: "Card",
  carousel: "Carousel",
  chart: "Chart",
  collapsible: "Collapsible",
  "date-picker": "Date picker",
  direction: "Direction",
  "hover-card": "Hover card",
  "input-group": "Input group",
  "input-otp": "Input OTP",
  item: "Item",
  label: "Label",
  menubar: "Menubar",
  "navigation-menu": "Navigation menu",
  "scroll-area": "Scroll area",
  table: "Table",
  toggle: "Toggle",
  "toggle-group": "Toggle group",
  "number-input": "Number input",
  combobox: "Combobox",
  sheet: "Sheet",
  callout: "Callout",
  "status-indicator": "Status indicator",
  timeline: "Timeline",
  "description-list": "Description list",
  "resizable-panels": "Resizable panels",
  listbox: "Listbox",
  "search-results": "Search results",
  kbd: "Kbd",
  toolbar: "Toolbar",
}

const AI_TITLES: Record<string, string> = {
  "chain-of-thought": "Chain of thought",
  checkpoint: "Checkpoint",
  confirmation: "Confirmation",
  context: "Context",
  conversation: "Conversation",
  "inline-citation": "Inline citation",
  message: "Message",
  "model-selector": "Model selector",
  plan: "Plan",
  queue: "Queue",
  reasoning: "Reasoning",
  shimmer: "Shimmer",
  sources: "Sources",
  suggestion: "Suggestion",
  task: "Task",
  tool: "Tool",
  agent: "Agent",
  commit: "Commit",
  "environment-variables": "Environment variables",
  "jsx-preview": "JSX preview",
  "package-info": "Package info",
  sandbox: "Sandbox",
  "schema-display": "Schema display",
  snippet: "Snippet",
  "stack-trace": "Stack trace",
  "test-results": "Test results",
  "audio-player": "Audio player",
  "mic-selector": "Mic selector",
  persona: "Persona",
  "speech-input": "Speech input",
  transcription: "Transcription",
  "voice-selector": "Voice selector",
  canvas: "Canvas",
  connection: "Connection",
  controls: "Controls",
  edge: "Edge",
  node: "Node",
  panel: "Panel",
  image: "Image",
  "open-in-chat": "Open in chat",
}

const sourceItems = [
  { title: "Gateway registry", href: "#", description: "Source-backed metadata", badge: "doc" },
  { title: "Runtime policy", href: "#", description: "Permission constraints", badge: "toml" },
]

const tasks = [
  { id: "1", title: "Resolve package", status: "completed" as const },
  { id: "2", title: "Build sandbox", status: "running" as const },
  { id: "3", title: "Publish result", status: "queued" as const },
]

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid gap-4 rounded-[var(--aurora-radius-2)] border p-5" style={{ background: "var(--aurora-panel-strong)", borderColor: "var(--aurora-border-strong)", boxShadow: "var(--aurora-shadow-strong), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      {children}
    </section>
  )
}

function ShadcnDemo({ slug }: { slug: string }) {
  switch (slug) {
    case "alert":
      return <Callout title="Backend unavailable." variant="warn">Retry is queued. No operator action is required.</Callout>
    case "alert-dialog":
      return <AlertDialog><AlertDialogTrigger asChild><Button>Open confirmation</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Restart gateway</AlertDialogTitle><AlertDialogDescription>Active requests will drain before the service restarts.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel asChild><Button variant="neutral">Cancel</Button></AlertDialogCancel><AlertDialogAction asChild><Button variant="rose">Restart</Button></AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    case "aspect-ratio":
      return <AspectRatio ratio={16 / 9}><div className="grid h-full place-items-center rounded-[8px] border aurora-text-card-title" style={{ borderColor: "var(--aurora-border-default)", background: "var(--aurora-control-surface)" }}>16:9 preview</div></AspectRatio>
    case "calendar":
      return <Calendar selected={new Date()} />
    case "card":
      return <Card><CardHeader><CardTitle>Gateway health</CardTitle><CardDescription>Operational summary</CardDescription></CardHeader><CardContent><p className="aurora-text-body" style={{ margin: 0 }}>12 services reporting within threshold.</p></CardContent><CardFooter><Badge variant="success">Live</Badge></CardFooter></Card>
    case "carousel":
      return <Carousel title="Registry sources">{["Local", "Curated", "Remote"].map((item) => <CarouselItem key={item}><div className="aurora-text-card-title">{item}</div><p className="aurora-text-meta">Marketplace source card</p></CarouselItem>)}</Carousel>
    case "chart":
      return <Chart data={[{ label: "Search", value: 42 }, { label: "Install", value: 27 }, { label: "Update", value: 18 }]} />
    case "collapsible":
      return <Collapsible title="Sync diagnostics" defaultOpen><p className="aurora-text-body" style={{ margin: 0 }}>Registry index refreshed 18 seconds ago.</p></Collapsible>
    case "date-picker":
      return <DatePicker label="Maintenance window" defaultValue="2026-05-10" />
    case "direction":
      return <Direction dir="rtl" className="rounded-[8px] border p-3 aurora-text-body" style={{ borderColor: "var(--aurora-border-default)" }}>RTL layout sample</Direction>
    case "drawer":
      return <Sheet><SheetTrigger asChild><Button>Open drawer</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Plugin details</SheetTitle></SheetHeader><SheetBody><p className="aurora-text-body">Sheet-backed drawer parity surface.</p></SheetBody></SheetContent></Sheet>
    case "hover-card":
      return <HoverCard trigger={<Button variant="neutral">Inspect source</Button>}><div className="aurora-text-control">Source registry</div><div className="aurora-text-meta">Last synced 2 minutes ago.</div></HoverCard>
    case "input-group":
      return <InputGroup><InputGroupAddon>https://</InputGroupAddon><Input defaultValue="aurora.tootie.tv" /></InputGroup>
    case "input-otp":
      return <InputOTP value="428019" />
    case "item":
      return <Item title="aurora-marketplace" description="Registry block" action={<Badge>block</Badge>} />
    case "label":
      return <div className="grid gap-2"><Label htmlFor="label-demo">Registry name</Label><Input id="label-demo" defaultValue="aurora-button" /></div>
    case "menubar":
      return <Callout title="Menubar">See the dedicated menubar demo for functional menu patterns.</Callout>
    case "navigation-menu":
      return <NavigationMenu><NavigationMenuItem active href="#">Overview</NavigationMenuItem><NavigationMenuItem href="#">Sources</NavigationMenuItem><NavigationMenuItem href="#">Runs</NavigationMenuItem></NavigationMenu>
    case "native-select":
      return <NativeSelect defaultValue="local"><option value="local">Local registry</option><option value="remote">Remote registry</option></NativeSelect>
    case "scroll-area":
      return <ScrollArea><div className="grid gap-2 p-3">{Array.from({ length: 16 }, (_, i) => <div key={i} className="aurora-text-control">Log line {i + 1}</div>)}</div></ScrollArea>
    case "table":
      return <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>gateway-admin</TableCell><TableCell><Badge variant="success">Live</Badge></TableCell></TableRow></TableBody></Table>
    case "toggle":
      return <Toggle pressed aria-label="Bold text">Bold</Toggle>
    case "toggle-group":
      return <ToggleGroup aria-label="View mode"><Toggle pressed>Cards</Toggle><Toggle>Table</Toggle><Toggle>Split</Toggle></ToggleGroup>
    case "command":
      return <Callout title="Command">Covered by the Aurora command palette block.</Callout>
    case "data-table":
      return <Callout title="Data table">Covered by the sortable Aurora data table component.</Callout>
    case "resizable":
      return <ResizablePanels><div className="p-3 aurora-text-control">Editor</div><div className="p-3 aurora-text-control">Preview</div></ResizablePanels>
    case "sonner":
      return <Callout title="Sonner">Covered by Aurora toast surfaces and registry toast component.</Callout>
    case "typography":
      return <div className="grid gap-2"><h2 className="aurora-text-display-2" style={{ margin: 0 }}>Typography</h2><p className="aurora-text-body" style={{ margin: 0 }}>Inter handles normal UI copy; Manrope stays reserved for display and titles.</p></div>
    case "combobox":
      return <Combobox options={[{ value: "button", label: "Button" }, { value: "dialog", label: "Dialog" }]} placeholder="Find component" />
    case "field":
      return <Field label="Plugin ID" description="Stable registry identifier"><Input defaultValue="aurora-marketplace" /></Field>
    case "popover":
      return <Popover defaultOpen><PopoverAnchor><PopoverTrigger asChild><Button>Open popover</Button></PopoverTrigger><PopoverContent><div className="aurora-text-body">Compact floating detail surface.</div></PopoverContent></PopoverAnchor></Popover>
    case "radio-group":
      return <RadioGroup defaultValue="auto"><RadioGroupItem value="auto">Auto</RadioGroupItem><RadioGroupItem value="manual">Manual</RadioGroupItem></RadioGroup>
    case "slider":
      return <Slider defaultValue={64} />
    case "input":
      return <Input defaultValue="gateway-admin" />
    case "select":
      return (
        <Select defaultValue="active">
          <SelectTrigger className="max-w-64">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      )
    case "textarea":
      return <Textarea defaultValue={"Operator note\n\nRegistry build succeeded. Waiting on deployment approval."} autoResize />
    case "number-input":
      return <NumberInput min={0} max={8} defaultValue={3} />
    default:
      return <Callout title="Covered component">This parity route points at the existing Aurora implementation.</Callout>
    case "sheet":
      return <Sheet><SheetTrigger asChild><Button>Open sheet</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Run inspector</SheetTitle></SheetHeader><SheetBody><p className="aurora-text-body">Live metadata and activity for the selected run.</p></SheetBody></SheetContent></Sheet>
    case "callout":
      return <Callout title="Gateway policy changed" variant="warn">Restart dependent agents before running the next deployment.</Callout>
    case "status-indicator":
      return <div className="grid gap-2"><StatusIndicator tone="online" label="Gateway connected" /><StatusIndicator tone="syncing" label="Syncing registry" /><StatusIndicator tone="degraded" label="Partial tool outage" /></div>
    case "timeline":
      return <Timeline><TimelineItem tone="online" title="Policy loaded" meta="09:41">Read and write grants resolved from project settings.</TimelineItem><TimelineItem tone="syncing" title="Registry build started" meta="09:42">Component JSON is being regenerated.</TimelineItem><TimelineItem tone="queued" title="Docker build queued" meta="next">Waiting for registry output.</TimelineItem></Timeline>
    case "description-list":
      return <DescriptionList><DescriptionItem label="Gateway" value="production-edge" /><DescriptionItem label="Commit" value={<code style={{ fontFamily: "var(--aurora-font-mono)" }}>8f31c5a</code>} /><DescriptionItem label="Owner" value="platform" /></DescriptionList>
    case "resizable-panels":
      return <ResizablePanels><div className="p-3 aurora-text-control">Editor</div><div className="p-3 aurora-text-control">Preview</div></ResizablePanels>
    case "listbox":
      return <Listbox><ListboxGroup heading="Components"><ListboxItem active title="Button" description="Primary command surface" meta="ui" /><ListboxItem title="Dialog" description="Modal decision surface" meta="ui" /></ListboxGroup></Listbox>
    case "search-results":
      return <SearchResults><SearchResultsGroup heading="Commands"><SearchResultItem active title="Rebuild registry" description="Run shadcn build and refresh public/r" meta="cmd" /><SearchResultItem title="Open logs" description="Tail the dev container logs" meta="log" /></SearchResultsGroup></SearchResults>
    case "kbd":
      return <div className="flex items-center gap-2 aurora-text-body">Open command palette <Kbd>Cmd</Kbd><Kbd>K</Kbd></div>
    case "toolbar":
      return <Toolbar><ToolbarGroup><Button variant="neutral" size="sm">Run</Button><Button variant="neutral" size="sm">Branch</Button></ToolbarGroup><ToolbarSeparator /><ToolbarGroup><Button variant="ghost" size="sm">Search <Kbd>Cmd K</Kbd></Button></ToolbarGroup></Toolbar>
  }
}

function AiDemo({ slug }: { slug: string }) {
  switch (slug) {
    case "message":
      return <Message><MessageAvatar label="AI" /><MessageContent tone="assistant">Gateway sync completed. <InlineCitation index={1} href="#" /></MessageContent></Message>
    case "inline-citation":
      return <p className="aurora-text-body">Registry source verified <InlineCitation index={2} href="#" /> with local metadata.</p>
    case "sources":
      return <Sources>{sourceItems.map((source) => <Source key={source.title} source={source} />)}</Sources>
    case "task":
    case "plan":
      return <TaskList tasks={tasks} />
    case "test-results":
      return <TestResults results={[{ name: "pnpm lint", status: "passed", duration: "3.2s" }, { name: "pnpm build", status: "running" }]} />
    case "stack-trace":
      return <StackTrace frames={[{ file: "registry/aurora/ui/button.tsx", line: 141, label: "Button render" }]} />
    case "environment-variables":
      return <EnvironmentVariables variables={[{ key: "NEXT_PUBLIC_API_URL", value: "https://aurora.tootie.tv" }, { key: "LAB_TOKEN", value: "tok_live_4ab93c", secret: true, required: true }]} />
    case "checkpoint":
      return <Checkpoint label="Checkpoint saved" description="User-approved marketplace state captured." />
    case "confirmation":
      return <Confirmation title="Install plugin" description="This will update the local plugin cache." />
    case "context":
      return <ContextPanel used={42100} limit={128000} items={sourceItems} />
    case "conversation":
      return <Conversation><Message role="user"><MessageAvatar label="U" tone="rose" /><MessageContent tone="user">Show installed plugins.</MessageContent></Message><Message><MessageAvatar label="AI" /><MessageContent tone="assistant">Found 18 active plugins.</MessageContent></Message></Conversation>
    case "model-selector":
      return <ModelSelector label="Model" models={["gpt-5.5", "gpt-5.4", "gpt-5.3-codex"]} />
    case "queue":
      return <Queue tasks={tasks} />
    case "reasoning":
      return <Thinking type="thinking" content="Checked registry, compared source metadata, then selected the minimal install plan." />
    case "chain-of-thought":
      return <Collapsible title="Reasoning summary" defaultOpen><p className="aurora-text-body" style={{ margin: 0 }}>Checked registry, compared source metadata, then selected the minimal install plan.</p></Collapsible>
    case "shimmer":
      return <div className="grid gap-3"><Shimmer /><Shimmer style={{ width: "70%" }} /></div>
    case "suggestion":
      return <Suggestion options={[{ id: "latest", title: "Install the latest compatible version", description: "Fastest when the local registry already has the dependency graph." }, { id: "locked", title: "Pin to the deployed version", description: "Safer when you need parity with production." }, { id: "preview", title: "Open the diff first", description: "Best when you want to inspect target files before install." }]} />
    case "tool":
      return <ToolCalls calls={[{ id: "1", tool: "registry.lookup", status: "completed", args: { package: "aurora-button" }, result: "Resolved aurora-button from the local registry." }, { id: "2", tool: "registry.lookup", status: "completed", args: { package: "aurora-dialog" }, result: "Resolved aurora-dialog from the local registry." }]} />
    case "agent":
      return <Agent name="Marketplace agent" role="Registry resolver" status="running" />
    case "commit":
      return <Commit hash="a1b2c3d" message="Add marketplace parity route" author="labby" />
    case "jsx-preview":
      return <JsxPreview code={'<Button variant="rose">Install</Button>'} />
    case "package-info":
      return <PackageInfo name="@labby/marketplace" version="1.4.0" description="Local registry integration" />
    case "sandbox":
      return <Sandbox command="pnpm dev" status="running" runtime="Node 20" envCount={12} paths={["/workspace/app", "/workspace/registry", "/workspace/.next"]}><p className="aurora-text-body" style={{ margin: 0 }}>Container-ready preview process.</p></Sandbox>
    case "schema-display":
      return <SchemaDisplay schema={{ name: "aurora-button", type: "registry:ui" }} />
    case "snippet":
      return <Snippet language="tsx" code={'import { Button } from "@/components/ui/button"'} />
    case "image":
      return <Image alt="Aurora placeholder" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 420'%3E%3Crect width='800' height='420' fill='%2307131a'/%3E%3Cpath d='M130 130h540v160H130z' fill='%23122430'/%3E%3Cpath d='M250 170h300v24H250z' fill='%2329b6f6'/%3E%3C/svg%3E" caption="Aurora media frame" />
    case "open-in-chat":
      return <OpenInChat />
    case "audio-player":
      return <AudioPlayer />
    case "mic-selector":
      return <MicSelector devices={["Studio mic", "System default"]} />
    case "persona":
      return <Persona name="Operator" description="Concise, evidence-first assistant voice." />
    case "speech-input":
      return <SpeechInput defaultValue="Search installed plugins" />
    case "transcription":
      return <Transcription segments={[{ speaker: "Operator", timecode: "00:01", text: "Search installed plugins.", confidence: 97 }, { speaker: "Assistant", timecode: "00:04", text: "Open the marketplace detail panel.", confidence: 94 }]} />
    case "voice-selector":
      return <VoiceSelector voices={["Neutral", "Focused", "Brief"]} />
    case "canvas":
      return <Canvas><Node title="Registry" description="Source index" /><Edge label="sync" /><Node title="Install" description="Cache update" /></Canvas>
    case "connection":
      return <Connection from="Registry" to="Gateway" />
    case "controls":
      return <Controls><Button size="sm">Run</Button><Button size="sm" variant="neutral">Stop</Button></Controls>
    case "edge":
      return <Edge label="stream" />
    case "node":
      return <Node title="Agent node" description="Runs install checks" />
    case "panel":
      return <Panel title="Inspector"><p className="aurora-text-body" style={{ margin: 0 }}>Workflow metadata and selected node details.</p></Panel>
    default:
      return <Callout title="AI element">Covered by the corresponding Aurora block route.</Callout>
  }
}

export function ComponentDemoPage({ slug }: { slug: string }) {
  const isAi = slug in AI_TITLES
  return <Shell>{isAi ? <AiDemo slug={slug} /> : <ShadcnDemo slug={slug} />}</Shell>
}

export function createComponentDemo(slug: string) {
  function ComponentDemo() {
    return <ComponentDemoPage slug={slug} />
  }
  ComponentDemo.displayName = `ComponentDemo(${slug})`
  return ComponentDemo
}

export default function ParityDemo() {
  const slug = usePathname().split("/").filter(Boolean).pop() ?? ""
  return <ComponentDemoPage slug={slug} />
}
