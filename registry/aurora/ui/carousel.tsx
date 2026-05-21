"use client"

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
    <section className={["grid gap-3", className].filter(Boolean).join(" ")} style={style} {...props}>
      <div className="flex items-center justify-between gap-2">
        {title ? <h3 className="aurora-text-section">{title}</h3> : <span />}
        <div className="flex gap-2">
          <Button type="button" size="icon" variant="neutral" aria-label="Previous slide" onClick={() => scroll(-1)}>
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button type="button" size="icon" variant="neutral" aria-label="Next slide" onClick={() => scroll(1)}>
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      <div ref={trackRef} className="flex snap-x gap-3 overflow-x-auto pb-1">
        {React.Children.map(children, (child) => (
          <div className="min-w-[240px] snap-start">{child}</div>
        ))}
      </div>
    </section>
  )
}

export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={["rounded-[8px] border p-4", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--aurora-panel-medium)",
        borderColor: "var(--aurora-border-default)",
        boxShadow: "var(--aurora-shadow-medium), inset 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
      {...props}
    />
  )
)
CarouselItem.displayName = "CarouselItem"

export default Carousel
