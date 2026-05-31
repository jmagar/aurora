# dinglebear.ai — co-hosted tenant

`dinglebear.ai` is a **separate site** co-hosted inside this Aurora Next.js app.
It is unrelated to the Aurora design system; it just shares the same deployment.

## How it is served

1. `proxy.ts` (repo root) inspects the request `Host`. When it is
   `dinglebear.ai` / `www.dinglebear.ai`, it rewrites the path to `/dinglebear`.
2. `app/dinglebear/route.ts` reads `public/dinglebear/index.html` and returns it
   as `text/html`.
3. `next.config.ts` lists `dinglebear.ai` / `www.dinglebear.ai` in
   `allowedDevOrigins`.

So a browser hitting `dinglebear.ai` gets `public/dinglebear/index.html`, while
`aurora.tootie.tv` is unaffected.

## Files

| Path | Purpose |
|---|---|
| `public/dinglebear/index.html` | The served page (self-contained, ~660 KB). |
| `public/dinglebear/{animations,scenes,components}.jsx` | Source/handoff artifacts (not in the serving path). |
| `public/dinglebear/video.html` | Standalone video handoff page. |
| `dinglebear/standalone.html` | Original standalone export kept as source. |

## Editing

`index.html` is self-contained — it inlines its own styles and scripts and does
**not** reference the sibling `.jsx` files. To update the live page, replace
`public/dinglebear/index.html`.

> This folder is intentionally walled off from the Aurora design system. Don't
> wire Aurora tokens, the registry, or `themes/` into it.
