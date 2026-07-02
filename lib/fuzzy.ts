/**
 * Fuzzy subsequence scorer — higher is better, 0 = no match. Ported from the
 * Claude Design `aurora-site` (palette.jsx); shared by the landing catalog,
 * the icons view, and the site command palette.
 */
export function fuzzy(q: string, text: string): number {
  if (!q) return 1
  q = q.toLowerCase()
  text = text.toLowerCase()
  let ti = 0
  let score = 0
  let streak = 0
  let started = false
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi]
    let found = false
    while (ti < text.length) {
      if (text[ti] === ch) {
        found = true
        streak += 1
        score += streak * 2
        if (ti === 0 || /[\s\-_./]/.test(text[ti - 1])) score += 8 // word-boundary bonus
        if (!started && ti < 4) score += 4
        started = true
        ti += 1
        break
      }
      streak = 0
      ti += 1
    }
    if (!found) return 0
  }
  return score - text.length * 0.05
}
