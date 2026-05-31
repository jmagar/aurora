import * as React from "react"
import { TokensView } from "@/components/site/tokens-view"

export const metadata = {
  title: "Tokens — Aurora design system",
  description:
    "The Aurora token contract: surfaces, borders, text, accents, status colors, the type ramp, radii, and elevation — the CSS custom properties every Aurora surface reads from.",
}

export default function TokensPage() {
  return <TokensView />
}
