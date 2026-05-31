import { readFile } from "fs/promises"
import path from "path"
import { AURORA_THEMES } from "@/lib/themes"

// Serves a theme's README.md as plain text for the in-page README dialog.
// Only paths registered in the theme catalog are allowed (no arbitrary reads).
const ALLOWED = new Set(AURORA_THEMES.map((t) => t.readmePath))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rel = searchParams.get("path") ?? ""

  if (!ALLOWED.has(rel)) {
    return new Response("Not found", { status: 404 })
  }

  // Defense in depth: resolve and confirm the path stays inside the repo.
  const root = process.cwd()
  const abs = path.resolve(root, rel)
  if (!abs.startsWith(root + path.sep)) {
    return new Response("Forbidden", { status: 403 })
  }

  try {
    const md = await readFile(abs, "utf-8")
    return new Response(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
