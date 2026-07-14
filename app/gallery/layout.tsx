"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon } from "lucide-react"
import { AuroraWordmark, LabbyLockup } from "@/components/labby-brand"
import { NAV, NAV_SLUG_ALIASES } from "@/app/gallery/nav-data"

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [light, setLight] = React.useState(false)
  const [navOpen, setNavOpen] = React.useState(false)

  // Apply theme class
  React.useEffect(() => {
    const previousColorScheme = document.documentElement.style.colorScheme
    document.documentElement.classList.toggle("light", light)
    document.documentElement.classList.toggle("dark", !light)
    document.documentElement.style.colorScheme = light ? "light" : "dark"
    return () => {
      document.documentElement.style.colorScheme = previousColorScheme
    }
  }, [light])

  // Lock body scroll while mobile nav is open (iOS-safe technique)
  React.useEffect(() => {
    if (!navOpen) return
    const scrollY = window.scrollY
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, scrollY)
    }
  }, [navOpen])

  const activeSlug = React.useMemo(() => {
    const section = pathname.split("/").pop() ?? ""
    const normalized = section.startsWith("ai-") ? section.slice(3) : section
    return NAV_SLUG_ALIASES[normalized] ?? normalized
  }, [pathname])

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Derive the current page label for the mobile header breadcrumb
  const activeLabel = React.useMemo(() => {
    for (const group of NAV) {
      const found = group.items.find((item) => item.slug === activeSlug)
      if (found) return found.label
    }
    return null
  }, [activeSlug])

  return (
    <div className="aurora-gallery-shell" data-nav-open={navOpen ? "true" : "false"}>
      <a href="#gallery-main" className="aurora-gallery-skip-link">
        Skip to Content
      </a>

      {/* Backdrop — mobile only, closes nav when tapped */}
      <div
        className="aurora-gallery-backdrop"
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
      />


      <nav
        className="aurora-gallery-nav"
        aria-label="Component gallery"
        data-open={navOpen ? "true" : "false"}
      >
        <div className="aurora-gallery-nav-header">
          <Link href="/" className="aurora-gallery-brand-link" aria-label="Aurora Design System home">
            <LabbyLockup
              markSize={28}
              wordmark={<AuroraWordmark fontSize={17} />}
              subtitle="Design System"
            />
          </Link>

          {/* Current page name — mobile only */}
          {activeLabel && (
            <span className="aurora-gallery-mobile-crumb" aria-hidden="true">
              {activeLabel}
            </span>
          )}

          <div className="aurora-gallery-nav-actions">
            {/* Theme toggle */}
            <button
              type="button"
              className="aurora-gallery-button aurora-gallery-button--icon"
              aria-pressed={light}
              aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
              title={light ? "Dark mode" : "Light mode"}
              onClick={() => setLight((v) => !v)}
            >
              {light ? <Moon size={15} strokeWidth={2} /> : <Sun size={15} strokeWidth={2} />}
            </button>

            {/* Mobile nav toggle — hidden on desktop via CSS */}
            <button
              type="button"
              className="aurora-gallery-button aurora-gallery-button--icon aurora-gallery-menu-toggle"
              aria-controls="gallery-nav-body"
              aria-expanded={navOpen}
              aria-label={navOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? <X size={15} strokeWidth={2.25} /> : <Menu size={15} strokeWidth={2.25} />}
            </button>
          </div>
        </div>

        {/* Animated collapse wrapper — on desktop this is display:contents */}
        <div className="aurora-gallery-nav-collapse">
          <div id="gallery-nav-body" className="aurora-gallery-nav-body">
            {NAV.map((group) => (
              <div key={group.group}>
                <div className="aurora-gallery-section-heading">{group.group}</div>
                {group.items.map((item) => {
                  const active = activeSlug === item.slug
                  return (
                    <Link
                      key={item.slug}
                      href={`/gallery/${item.slug}`}
                      className="aurora-gallery-link"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setNavOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main id="gallery-main" className="aurora-gallery-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
