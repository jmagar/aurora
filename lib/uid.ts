/**
 * uid() — a tiny unique-id helper.
 *
 * Uses crypto.randomUUID() when available (all modern browsers + Node 19+),
 * falling back to a Date.now + Math.random composite for older environments.
 * The fallback is not cryptographically secure but is collision-resistant
 * enough for UI keys and transient IDs.
 */
export function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
