import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function buildContentSecurityPolicy(nonce: string, development = false) {
  const developmentEval = development ? " 'unsafe-eval'" : ""
  return [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${developmentEval}`,
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    ...(development ? [] : ["upgrade-insecure-requests"]),
  ].join("; ")
}

function securityContext(request: NextRequest) {
  const nonce = crypto.randomUUID().replaceAll("-", "")
  const hostname = request.nextUrl.hostname
  const isLoopback = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
  // WebKit applies upgrade-insecure-requests to loopback origins, which turns
  // local HTTP assets into invalid HTTPS requests. Public production hosts keep
  // the directive; local development and browser verification do not need it.
  const csp = buildContentSecurityPolicy(
    nonce,
    process.env.NODE_ENV === "development" || isLoopback
  )
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  // Next.js reads the request CSP to apply the nonce to framework and page scripts.
  requestHeaders.set("Content-Security-Policy", csp)
  return { csp, requestHeaders }
}

function secure(response: NextResponse, csp: string) {
  response.headers.set("Content-Security-Policy", csp)
  response.headers.set("X-Aurora-Revision", process.env.AURORA_BUILD_SHA ?? "development")
  return response
}

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
  const { csp, requestHeaders } = securityContext(request)
  const init = { request: { headers: requestHeaders } }

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
      return secure(NextResponse.rewrite(url, init), csp)
    }
    return secure(NextResponse.next(init), csp)
  }

  return secure(NextResponse.next(init), csp)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
