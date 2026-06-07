const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"])

export function sanitizeMarkdownHref(rawHref: string): string | null {
  const href = rawHref.trim()
  if (!href) return null

  if (href.startsWith("#") || href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) {
    return href
  }

  try {
    const url = new URL(href)
    return SAFE_PROTOCOLS.has(url.protocol) ? href : null
  } catch {
    return null
  }
}
