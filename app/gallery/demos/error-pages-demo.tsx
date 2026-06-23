"use client"

import * as React from "react"
import { ErrorPage } from "@/registry/aurora/blocks/feedback/error-page/error-page"

/**
 * Standalone gallery demo — reproduces the Claude Design `ErrorPage.dsCard`
 * composition 1:1: a single 404 page with a requested-path chip and an
 * auto-retry-capable action row, rendered with the registry component.
 */
export function ErrorPagesDemo() {
  return (
    <ErrorPage
      code={404}
      path="/gateways/edge-9/logs"
      onRetry={() => {}}
    />
  )
}

export default ErrorPagesDemo
