"use client"

import { GalleryPageIntro } from "@/components/gallery-page-intro"
import { ModelSelector } from "@/registry/aurora/blocks/ai/elements/model-selector"

export default function AiModelSelectorDemo() {
  return (
    <div className="flex flex-col gap-8">
      <GalleryPageIntro
        eyebrow="AI Elements"
        heading="Model Selector"
        description="Model picker — choose the model for the current conversation."
      />

      <div className="max-w-[420px]">
        <ModelSelector models={["Claude Sonnet", "Claude Opus", "GPT-4o", "Local · Qwen3"]} />
      </div>
    </div>
  )
}
