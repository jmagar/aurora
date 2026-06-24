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
 * the controls, `CarouselItem` is a `forwardRef` with `displayName`, and the
 * `title`/HTML props/escape-hatch API is preserved.
 */

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"
import { injectOnce } from "@/registry/aurora/lib/inject-once"

const CSS = `
.aurora-carousel { display: grid; gap: 14px; }
.aurora-carousel__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.aurora-carousel__title {
  margin: 0;
  font-family: var(--aurora-font-display);
  font-weight: 800;
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--aurora-text-primary);
}
.aurora-carousel__controls { display: flex; gap: 8px; }
.aurora-carousel__track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 4px;
  scrollbar-width: thin;
  /* Constrain visible area to ~2 slides so there is always something to scroll */
  max-width: 100%;
  width: 100%;
}
.aurora-carousel__slide {
  min-width: 240px;
  max-width: 240px;
  flex-shrink: 0;
  scroll-snap-align: start;
}
.aurora-carousel__item {
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--aurora-border-default);
  background:
    linear-gradient(180deg, var(--aurora-panel-medium-top), transparent 60%),
    var(--aurora-panel-medium);
  box-shadow: var(--aurora-shadow-medium), var(--aurora-highlight-medium);
  padding: 16px;
}
`

function ensureCSS() { injectOnce("aurora-carousel", CSS) }

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
}

export function Carousel({ title, className, children, style, ...props }: CarouselProps) {
  React.useEffect(() => {
    ensureCSS()
  }, [])

  const trackRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" })
  }

  return (
    <section className={["aurora-carousel", className].filter(Boolean).join(" ")} style={{ overflow: "hidden", ...style }} {...props}>
      <div className="aurora-carousel__head">
        {title ? <h3 className="aurora-carousel__title">{title}</h3> : <span />}
        <div className="aurora-carousel__controls">
          <Button type="button" size="icon" variant="neutral" aria-label="Previous slide" onClick={() => scroll(-1)}>
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button type="button" size="icon" variant="neutral" aria-label="Next slide" onClick={() => scroll(1)}>
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      <div ref={trackRef} className="aurora-carousel__track">
        {React.Children.map(children, (child) => (
          <div className="aurora-carousel__slide">{child}</div>
        ))}
      </div>
    </section>
  )
}

export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    React.useEffect(() => {
      ensureCSS()
    }, [])

    return (
      <div
        ref={ref}
        className={["aurora-carousel__item", className].filter(Boolean).join(" ")}
        {...props}
      />
    )
  }
)
CarouselItem.displayName = "CarouselItem"

export default Carousel
