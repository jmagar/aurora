"use client"

import * as React from "react"

export interface GalleryPageIntroProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow: React.ReactNode
  heading: React.ReactNode
  description: React.ReactNode
}

export function GalleryPageIntro(props: GalleryPageIntroProps) {
  void props
  return null
}

export default GalleryPageIntro
