"use client"

import * as React from "react"
import { Thinking, type ThinkingProps } from "@/registry/aurora/blocks/thinking/thinking"

export function Plan(props: Omit<ThinkingProps, "type">) {
  return <Thinking type="plan" {...props} />
}
