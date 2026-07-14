import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// shadcn CLI detection — mirrors the root content-negotiation rewrites in
// next.config.ts. Needed here because this proxy runs BEFORE beforeFiles
// rewrites: once the dinglebear host rewrite changes the pathname, the
// `source: "/"` rewrites in next.config.ts can no longer match.
function wantsRegistryJson(request: NextRequest) {
  const accept = request.headers.get("accept") ?? ""
  const userAgent = request.headers.get("user-agent") ?? ""
  return (
    accept.includes("application/vnd.shadcn.v1+json") ||
    userAgent.includes("shadcn")
  )
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  // Multi-tenant host mapping: dinglebear.ai is the umbrella home for the
  // MCP server fleet AND the Aurora design system. The root serves the fleet
  // page (or the registry manifest for the shadcn CLI); every other path
  // passes through to the full app, so /components, /themes, /gallery,
  // /docs, and /r/*.json all work on this host too.
  // See dinglebear/README.md for the tenant contract.
  if (host === "dinglebear.ai" || host === "www.dinglebear.ai") {
    if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone()
      url.pathname = wantsRegistryJson(request) ? "/r/registry.json" : "/dinglebear"
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
