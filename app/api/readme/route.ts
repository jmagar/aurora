import README_ASSETS from "@/public/readmes/manifest.json"

const assets: Record<string, string> = README_ASSETS

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rel = searchParams.get("path") ?? ""
  const asset = assets[rel]

  if (!asset) {
    return new Response("Not found", { status: 404 })
  }

  return Response.redirect(new URL(asset, request.url), 307)
}
