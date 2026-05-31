import { readFile } from "fs/promises"
import path from "path"

// dinglebear.ai is a separate site co-hosted in this app (see dinglebear/README.md).
// proxy.ts rewrites the dinglebear.ai host to /dinglebear, served from
// public/dinglebear/index.html.
export async function GET() {
  const html = await readFile(
    path.join(process.cwd(), "public", "dinglebear", "index.html"),
    "utf-8"
  )
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
