"use client"

import * as React from "react"
import { Thinking, type ThinkingProps } from "@/registry/aurora/blocks/ai/thinking/thinking"

export function ChainOfThought(props: Omit<ThinkingProps, "type">) {
  return <Thinking type="cot" {...props} />
}
