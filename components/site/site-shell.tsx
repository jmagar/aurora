"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sun, Moon, Github } from "lucide-react"
import { LabbyMark, AuroraWordmark } from "@/components/labby-brand"
import { SITE_STYLES } from "@/components/site/site-ui"
import { tint } from "@/components/site/style-tokens"

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Components", href: "/gallery/buttons" },
  { label: "Themes", href: "/themes" },
  { label: "Tokens", href: "/tokens" },
]

const GITHUB_URL = "https://github.com/jmagar/aurora-design-system"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  if (href === "/themes") return pathname === "/themes" || pathname.startsWith("/themes/")
  return pathname.startsWith(href)
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [light, setLight] = React.useState(false)
  const [still, setStill] = React.useState(false)

  // Sync external client-only state (persisted theme + URL flags) into React on
  // mount. setState-in-effect is the correct tool here — the values aren't known
  // until the client, and reading them in a useState initializer would mismatch
  // SSR hydration.
  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = window.localStorage.getItem("aurora-site-theme")
    if (stored === "light") setLight(true)
    const p = new URLSearchParams(window.location.search)
    if (p.get("still") === "1") setStill(true)
    if (p.get("theme") === "light") setLight(true)
    if (p.get("theme") === "dark") setLight(false)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle("light", light)
    document.documentElement.classList.toggle("dark", !light)
    document.documentElement.style.colorScheme = light ? "light" : "dark"
    window.localStorage.setItem("aurora-site-theme", light ? "light" : "dark")
  }, [light])

  return (
    <div
      className={`aurora-page-shell${still ? " aurora-still" : ""}`}
      style={{ position: "relative", overflow: "clip", minHeight: "100vh" }}
    >
      <style>{SITE_STYLES}</style>
      <div aria-hidden className="aurora-grain" />

      <header
        className="sticky top-0 z-40 flex items-center gap-4 px-5 py-3 md:px-10"
        style={{
          background: tint("--aurora-nav-bg", 84),
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--aurora-border-default)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="Aurora home">
          <LabbyMark size={26} />
          <AuroraWordmark fontSize={17} />
          <span
            className="aurora-text-meta ml-0.5 hidden pl-2 sm:inline"
            style={{ color: "var(--aurora-text-muted)", borderLeft: "1px solid var(--aurora-border-strong)" }}
          >
            Design system
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="aurora-text-control rounded-[10px] border px-3 py-[7px] transition-colors"
                style={{
                  color: active ? "var(--aurora-text-primary)" : "var(--aurora-text-muted)",
                  background: active ? "var(--aurora-control-surface)" : "transparent",
                  borderColor: active ? tint("--aurora-accent-primary", 28) : "transparent",
                  boxShadow: active ? `0 0 0 1px ${tint("--aurora-accent-primary", 12)}` : "none",
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />

        <button
          onClick={() => setLight((v) => !v)}
          aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
          title={light ? "Dark mode" : "Light mode"}
          className="grid size-[34px] place-items-center rounded-[10px]"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,.045), rgba(0,0,0,.1))",
            border: "1px solid var(--aurora-border-strong)",
            color: "var(--aurora-text-primary)",
            boxShadow: "var(--aurora-highlight-medium)",
          }}
        >
          {light ? <Moon size={15} strokeWidth={1.75} /> : <Sun size={15} strokeWidth={1.75} />}
        </button>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
          title="GitHub"
          className="grid size-[34px] place-items-center rounded-[10px]"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,.045), rgba(0,0,0,.1))",
            border: "1px solid var(--aurora-border-strong)",
            color: "var(--aurora-text-primary)",
            boxShadow: "var(--aurora-highlight-medium)",
          }}
        >
          <Github size={15} strokeWidth={1.75} />
        </a>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1160px] px-5 md:px-10">
        {children}
      </main>

      <footer
        className="relative z-10 mt-20 px-5 py-8 md:px-10"
        style={{ borderTop: "1px solid var(--aurora-border-default)" }}
      >
        <div
          className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4"
          style={{ color: "var(--aurora-text-muted)" }}
        >
          <span className="aurora-text-body-sm" style={{ color: "var(--aurora-text-muted)" }}>
            Aurora design system — operator-first, built for Labby.
          </span>
          <span className="aurora-text-code">aurora.tootie.tv</span>
        </div>
      </footer>
    </div>
  )
}
