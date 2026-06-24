/**
 * injectOnce — idempotent runtime CSS injection for Aurora registry components.
 *
 * Uses a DOM id guard rather than a module-level boolean so the style survives
 * React Fast Refresh / HMR: when a module re-evaluates under HMR the boolean
 * resets to false and the next render appends a duplicate <style> tag, whereas
 * getElementById still finds the existing tag and skips re-injection.
 *
 * Usage:
 *   import { injectOnce } from "@/registry/aurora/lib/inject-once"
 *   injectOnce("aurora-my-component", MY_CSS)
 *
 * Call this at the top of any render function or effect that needs styles
 * present before paint. It is a no-op on the server (SSR / RSC).
 */
export function injectOnce(id: string, css: string): void {
  if (typeof document === "undefined") return
  if (document.getElementById(id)) return
  const el = document.createElement("style")
  el.id = id
  el.textContent = css
  document.head.appendChild(el)
}
