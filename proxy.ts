import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  // Multi-tenant host rewrite: dinglebear.ai requests are served from /dinglebear.
  // See dinglebear/README.md for the full co-hosted tenant contract.
  if (host === "dinglebear.ai" || host === "www.dinglebear.ai") {
    const url = request.nextUrl.clone()
    url.pathname = "/dinglebear"
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
