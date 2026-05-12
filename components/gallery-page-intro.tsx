"use client"

import * as React from "react"

export interface GalleryPageIntroProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow: React.ReactNode
  heading: React.ReactNode
  description: React.ReactNode
}

export function GalleryPageIntro({ eyebrow, heading, description, className = "", style, ...props }: GalleryPageIntroProps) {
  return (
    <header
      className={`aurora-gallery-page-intro ${className}`}
      style={style}
      {...props}
    >
      <style>{`
        .aurora-gallery-page-intro {
          display: grid;
          gap: 6px;
          max-width: min(760px, 100%);
          margin-bottom: 28px;
        }
        .aurora-gallery-page-intro + * {
          /* ensure siblings aren't pushed oddly */
        }
        .aurora-gallery-page-intro__eyebrow {
          margin: 0;
          color: var(--aurora-text-muted);
        }
        .aurora-gallery-page-intro__heading {
          margin: 0;
          color: var(--aurora-text-primary);
          text-wrap: balance;
        }
        .aurora-gallery-page-intro__description {
          margin: 0;
          color: var(--aurora-text-muted);
          line-height: 1.6;
          max-width: 62ch;
        }
        @media (max-width: 760px) {
          .aurora-gallery-page-intro {
            margin-bottom: 20px;
          }
        }
      `}</style>
      <p className="aurora-text-eyebrow aurora-gallery-page-intro__eyebrow">
        {eyebrow}
      </p>
      <h2 className="aurora-text-display-2 aurora-gallery-page-intro__heading">
        {heading}
      </h2>
      <p className="aurora-text-body aurora-gallery-page-intro__description">
        {description}
      </p>
    </header>
  )
}

export default GalleryPageIntro
