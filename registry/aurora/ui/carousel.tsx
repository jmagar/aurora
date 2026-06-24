"use client"

/**
 * Aurora Carousel — horizontal snap track with prev/next controls.
 *
 * Visual layer is ported from the Claude Design source: a display-font section
 * title, two neutral icon buttons, and a snap-x track of panel-medium cards with
 * the documented top-sheen seam (opaque base + translucent top, layered so the
 * gradient never bands). Reads only `--aurora-*` tokens.
 *
 * Architecture stays Aurora: the Aurora `Button` (neutral icon variant) drives
 * the controls, `CarouselItem` wraps items with inline styles (no injected CSS so
 * `overflow-x: auto` is always present on the track), and the
 * `title`/HTML props/escape-hatch API is preserved.
 */

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
}

export function Carousel({ title, className, children, style, ...props }: CarouselProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" })
  }

  return (
    <section
      className={className}
      style={{ display: "grid", gap: 14, ...style }}
      {...props}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        {title ? (
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--aurora-font-display)",
              fontWeight: 800,
              fontSize: 26,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--aurora-text-primary)",
            }}
          >
            {title}
          </h3>
        ) : (
          <span />
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="button" size="icon" variant="neutral" aria-label="Previous slide" onClick={() => scroll(-1)}>
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button type="button" size="icon" variant="neutral" aria-label="Next slide" onClick={() => scroll(1)}>
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Scroll track — overflow-x: auto always present inline, never dependent on injected CSS */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 4,
          scrollbarWidth: "thin",
        }}
      >
        {React.Children.map(children, (child) => (
          <div style={{ minWidth: 240, scrollSnapAlign: "start" }}>{child}</div>
        ))}
      </div>
    </section>
  )
}

export function CarouselItem({ ref, className, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        borderRadius: 8,
        border: "1px solid var(--aurora-border-default)",
        background: "linear-gradient(180deg, var(--aurora-panel-medium-top), transparent 60%), var(--aurora-panel-medium)",
        boxShadow: "var(--aurora-shadow-medium), var(--aurora-highlight-medium)",
        padding: 16,
        ...style,
      }}
      {...props}
    />
  )
}

export default Carousel
