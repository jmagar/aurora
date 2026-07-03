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
 * the controls, `CarouselItem` accepts a ref prop (React 19 style), and the
 * `title`/HTML props/escape-hatch API is preserved.
 */

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/registry/aurora/ui/button"

// Styles: registry/aurora/styles/aurora-components.css (@layer aurora-components).

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
}

export function Carousel({ title, className, children, style, ...props }: CarouselProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" })
  }

  return (
    <section className={["aurora-carousel", className].filter(Boolean).join(" ")} style={style} {...props}>
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

export function CarouselItem({ className, ref, ...props }: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={["aurora-carousel__item", className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}

export default Carousel
