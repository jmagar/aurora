import { Terminal } from "@/registry/aurora/blocks/navigation/terminal/terminal"

export default function AuroraTerminalPage() {
  return (
    <main className="aurora-page-shell min-h-screen p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <div>
          <p className="aurora-text-eyebrow">Aurora starter</p>
          <h1 className="aurora-text-display-2">Terminal workspace</h1>
        </div>
        <Terminal
          title="gateway-shell"
          status="connected"
          lines={[
            { type: "command", text: "pnpm run registry:check" },
            { type: "success", text: "Registry build completed with no drift." },
            { type: "command", text: "pnpm run registry:smoke" },
            { type: "info", text: "Installed aurora-base into a fresh shadcn app." },
          ]}
        />
      </div>
    </main>
  )
}
