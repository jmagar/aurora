"use client"

import * as React from "react"

export interface GalleryPageIntroProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow: React.ReactNode
  heading: React.ReactNode
  description: React.ReactNode
}

export function GalleryPageIntro({ eyebrow, heading, description, style, ...props }: GalleryPageIntroProps) {
  return (
    <header
      className="grid gap-2"
      style={{
        maxWidth: 760,
        ...style,
      }}
      {...props}
    >
      <p
        className="aurora-text-eyebrow"
        style={{
          margin: 0,
          color: "var(--aurora-text-muted)",
        }}
      >
        {eyebrow}
      </p>
      <h1
        className="aurora-text-display-2"
        style={{
          margin: 0,
          color: "var(--aurora-text-primary)",
        }}
      >
        {heading}
      </h1>
      <p
        className="aurora-text-body"
        style={{
          margin: 0,
          color: "var(--aurora-text-muted)",
        }}
      >
        {description}
      </p>
    </header>
  )
}

export default GalleryPageIntro
