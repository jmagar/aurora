# dinglebear.ai — co-hosted tenant

`dinglebear.ai` is a separate site co-hosted inside this Aurora Next.js app.
It is the home domain of the Aurora deployment (`aurora.dinglebear.ai`) and,
since 2026-07, an **Aurora-native page**: it composes registry components
directly instead of shipping its own styling system.

## How it is served

1. `proxy.ts` (repo root) inspects the request `Host`. When it is
   `dinglebear.ai` / `www.dinglebear.ai`, it rewrites the path to `/dinglebear`.
2. `app/dinglebear/page.tsx` renders the fleet landing page
   (`fleet-page.tsx`) built on `registry/aurora/{ui,blocks}` components with
   the fleet data in `app/dinglebear/servers.ts`.
3. `next.config.ts` lists `dinglebear.ai` / `www.dinglebear.ai` in
   `allowedDevOrigins`.

So a browser hitting `dinglebear.ai` gets the React page at `/dinglebear`,
while `aurora.tootie.tv` is unaffected.

## Files

| Path | Purpose |
|---|---|
| `app/dinglebear/page.tsx` | Route entry: metadata + renders the fleet page. |
| `app/dinglebear/fleet-page.tsx` | The landing page, composed from Aurora registry components. |
| `app/dinglebear/servers.ts` | Fleet data: published MCP servers, categories, URL helpers. |
| `app/dinglebear/dinglebear.css` | Tenant-scoped `db-*` classes (hero radar visualization), Aurora tokens only. |
| `public/dinglebear/*` | Legacy static-HTML tenant (pre-2026-07) kept as handoff artifacts; no longer in the serving path. |
| `dinglebear/standalone.html` | Original standalone export kept as source. |

## Editing

Edit `app/dinglebear/fleet-page.tsx` and `servers.ts` like any other page in
the app. The page must follow Aurora rules: registry components over hand-rolled
elements, `--aurora-*` tokens over raw hex, the `.aurora-text-*` type ramp, and
sentence-case copy. Tenant-only styling goes in `dinglebear.css` under the
`db-` prefix.

The standalone Next.js repo at `github.com/jmagar/dinglebear.ai` predates this
tenant page and is superseded by it; the fleet data there
(`lib/servers.ts`) was ported to `app/dinglebear/servers.ts`.
