/**
 * Repo-local mirror of the `aurora-attachment` install target.
 *
 * Registry sources that re-export another block (e.g.
 * `registry/aurora/blocks/ai/elements/attachments.tsx`) import from the
 * consumer install path `@/components/aurora/attachment` so the published JSON
 * resolves after `npx shadcn add` (see registry.json `target:
 * "@components/aurora/attachment.tsx"`). This shim makes that path resolve
 * inside the source repo too. The real implementation lives in
 * `registry/aurora/blocks/files/attachment/attachment.tsx` — edit it there.
 */
export * from "@/registry/aurora/blocks/files/attachment/attachment"
