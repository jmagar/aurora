"use client"

import * as React from "react"
import { Message, MessageAvatar, MessageContent } from "@/components/aurora/ai/message"
import { PromptInput } from "@/components/aurora/prompt-input"

export default function AuroraChatPage() {
  const [value, setValue] = React.useState("")

  return (
    <main className="aurora-page-shell min-h-screen p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <div>
          <p className="aurora-text-eyebrow">Aurora starter</p>
          <h1 className="aurora-text-display-2">Agent chat</h1>
        </div>
        <section className="flex flex-col gap-3">
          <Message>
            <MessageAvatar label="AI" />
            <MessageContent tone="assistant">
              Aurora is installed. The registry base, tokens, and component styles are ready.
            </MessageContent>
          </Message>
          <Message role="user">
            <MessageAvatar label="JM" tone="cyan" />
            <MessageContent tone="user">Show me the gateway health summary.</MessageContent>
          </Message>
        </section>
        <PromptInput
          value={value}
          onChange={setValue}
          onSubmit={() => setValue("")}
          placeholder="Ask Aurora..."
        />
      </div>
    </main>
  )
}
