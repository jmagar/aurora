# Aurora Registry Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the hybrid Aurora registry taxonomy described in `docs/superpowers/specs/2026-05-11-aurora-registry-taxonomy-design.md` while keeping public registry install names stable.

**Architecture:** Keep `registry/aurora/ui/` as the flat primitive layer, move `aurora.css` into `registry/aurora/styles/`, and organize product blocks under domain folders inside `registry/aurora/blocks/`. Treat `registry.json` as the source registry manifest and regenerate `public/r/*.json` with `pnpm registry:build` after source paths are updated.

**Tech Stack:** Next.js 16, React 19, TypeScript, shadcn registry v3, Tailwind CSS v4, pnpm.

---

## Context

Current source layout:

- `registry/aurora/aurora.css`
- `registry/aurora/ui/*.tsx`
- `registry/aurora/blocks/<block>/<block>.tsx`
- `registry/aurora/blocks/ai-elements/*.tsx`

Current generated registry output:

- `public/r/registry.json`
- `public/r/aurora-*.json`

Important constraints:

- Keep registry item `name` values stable, for example `aurora-button`, `aurora-prompt-input`, and `aurora-tokens`.
- Update every `files[].path`, `meta.sourcePath`, local import, README path, and CSS import affected by physical file moves.
- Do not introduce top-level `hooks/` or `icons/` in this pass because there is no current inventory requiring them.
- Treat `marketplace` as a product block even though it is not listed in the spec mapping; place it under `blocks/workspace/` unless product direction says otherwise.
- Keep `terminal` under `blocks/navigation/` for this first implementation, matching the spec recommendation.

## Target File Structure

- Create: `registry/aurora/styles/aurora.css`
- Preserve: `registry/aurora/ui/*.tsx`
- Create domain folders:
  - `registry/aurora/blocks/ai/`
  - `registry/aurora/blocks/workspace/`
  - `registry/aurora/blocks/files/`
  - `registry/aurora/blocks/auth/`
  - `registry/aurora/blocks/navigation/`
  - `registry/aurora/blocks/feedback/`
- Modify: `registry.json`
- Modify: `app/globals.css`
- Modify: `app/gallery/demos/*.tsx` imports that reference moved block files
- Modify: `app/gallery/[section]/page.tsx` only if path-derived copy or demo routing needs taxonomy labels
- Modify: `README.md`
- Regenerate: `public/r/*.json`

## Block Move Map

Move source directories as follows:

```txt
registry/aurora/aurora.css
  -> registry/aurora/styles/aurora.css

registry/aurora/blocks/prompt-input
  -> registry/aurora/blocks/ai/prompt-input
registry/aurora/blocks/thinking
  -> registry/aurora/blocks/ai/thinking
registry/aurora/blocks/tool-calls
  -> registry/aurora/blocks/ai/tool-calls
registry/aurora/blocks/artifact
  -> registry/aurora/blocks/ai/artifact
registry/aurora/blocks/ask-user-question
  -> registry/aurora/blocks/ai/ask-user-question
registry/aurora/blocks/ai-elements
  -> registry/aurora/blocks/ai/elements

registry/aurora/blocks/sidebar
  -> registry/aurora/blocks/workspace/sidebar
registry/aurora/blocks/command-palette
  -> registry/aurora/blocks/workspace/command-palette
registry/aurora/blocks/web-preview
  -> registry/aurora/blocks/workspace/web-preview
registry/aurora/blocks/share-dialog
  -> registry/aurora/blocks/workspace/share-dialog
registry/aurora/blocks/code-block
  -> registry/aurora/blocks/workspace/code-block
registry/aurora/blocks/marketplace
  -> registry/aurora/blocks/workspace/marketplace

registry/aurora/blocks/attachment
  -> registry/aurora/blocks/files/attachment
registry/aurora/blocks/file-picker
  -> registry/aurora/blocks/files/file-picker
registry/aurora/blocks/file-tree
  -> registry/aurora/blocks/files/file-tree
registry/aurora/blocks/code-editor
  -> registry/aurora/blocks/files/code-editor

registry/aurora/blocks/login
  -> registry/aurora/blocks/auth/login
registry/aurora/blocks/oauth
  -> registry/aurora/blocks/auth/oauth
registry/aurora/blocks/permission-prompt
  -> registry/aurora/blocks/auth/permission-prompt
registry/aurora/blocks/permissions-dropdown
  -> registry/aurora/blocks/auth/permissions-dropdown

registry/aurora/blocks/error-page
  -> registry/aurora/blocks/feedback/error-page

registry/aurora/blocks/terminal
  -> registry/aurora/blocks/navigation/terminal
```

## Task 1: Capture Baseline Registry Integrity

**Files:**

- Read: `registry.json`
- Read: `public/r/registry.json`
- Read: `package.json`

- [ ] **Step 1: Confirm the worktree before editing**

Run:

```bash
git status --short --branch
```

Expected: note unrelated existing changes and do not stage or modify them.

- [ ] **Step 2: Run the current registry build**

Run:

```bash
pnpm registry:build
```

Expected: command exits 0. If it changes `public/r/*.json` before taxonomy edits, inspect and keep those generated changes only if they reflect current source truth.

- [ ] **Step 3: Run the current quality gates**

Run:

```bash
pnpm lint
pnpm audit:composition
pnpm build
```

Expected: all commands exit 0. If any fail before edits, record the exact failure in the handoff and decide whether it blocks taxonomy work.

- [ ] **Step 4: Commit only if baseline generation changed tracked files**

Run:

```bash
git diff --name-only
git add public/r registry.json
git commit -m "chore: refresh registry baseline"
```

Expected: commit only if there are real tracked baseline changes. Skip if `git diff --name-only` is empty.

## Task 2: Move Source Files Into the Taxonomy

**Files:**

- Move: `registry/aurora/aurora.css`
- Move: `registry/aurora/blocks/*`
- Preserve: `registry/aurora/ui/*.tsx`

- [ ] **Step 1: Create the target directories**

Run:

```bash
mkdir -p registry/aurora/styles \
  registry/aurora/blocks/ai \
  registry/aurora/blocks/workspace \
  registry/aurora/blocks/files \
  registry/aurora/blocks/auth \
  registry/aurora/blocks/navigation \
  registry/aurora/blocks/feedback
```

Expected: directories exist and no source files changed yet.

- [ ] **Step 2: Move the style file**

Run:

```bash
mv -f registry/aurora/aurora.css registry/aurora/styles/aurora.css
```

Expected: `registry/aurora/styles/aurora.css` exists and `registry/aurora/aurora.css` does not.

- [ ] **Step 3: Move AI block directories**

Run:

```bash
mv -f registry/aurora/blocks/prompt-input registry/aurora/blocks/ai/prompt-input
mv -f registry/aurora/blocks/thinking registry/aurora/blocks/ai/thinking
mv -f registry/aurora/blocks/tool-calls registry/aurora/blocks/ai/tool-calls
mv -f registry/aurora/blocks/artifact registry/aurora/blocks/ai/artifact
mv -f registry/aurora/blocks/ask-user-question registry/aurora/blocks/ai/ask-user-question
mv -f registry/aurora/blocks/ai-elements registry/aurora/blocks/ai/elements
```

Expected: each old path is absent and each new path contains the original `.tsx` files.

- [ ] **Step 4: Move workspace block directories**

Run:

```bash
mv -f registry/aurora/blocks/sidebar registry/aurora/blocks/workspace/sidebar
mv -f registry/aurora/blocks/command-palette registry/aurora/blocks/workspace/command-palette
mv -f registry/aurora/blocks/web-preview registry/aurora/blocks/workspace/web-preview
mv -f registry/aurora/blocks/share-dialog registry/aurora/blocks/workspace/share-dialog
mv -f registry/aurora/blocks/code-block registry/aurora/blocks/workspace/code-block
mv -f registry/aurora/blocks/marketplace registry/aurora/blocks/workspace/marketplace
```

Expected: workspace block source paths are under `registry/aurora/blocks/workspace/`.

- [ ] **Step 5: Move files, auth, feedback, and navigation block directories**

Run:

```bash
mv -f registry/aurora/blocks/attachment registry/aurora/blocks/files/attachment
mv -f registry/aurora/blocks/file-picker registry/aurora/blocks/files/file-picker
mv -f registry/aurora/blocks/file-tree registry/aurora/blocks/files/file-tree
mv -f registry/aurora/blocks/code-editor registry/aurora/blocks/files/code-editor
mv -f registry/aurora/blocks/login registry/aurora/blocks/auth/login
mv -f registry/aurora/blocks/oauth registry/aurora/blocks/auth/oauth
mv -f registry/aurora/blocks/permission-prompt registry/aurora/blocks/auth/permission-prompt
mv -f registry/aurora/blocks/permissions-dropdown registry/aurora/blocks/auth/permissions-dropdown
mv -f registry/aurora/blocks/error-page registry/aurora/blocks/feedback/error-page
mv -f registry/aurora/blocks/terminal registry/aurora/blocks/navigation/terminal
```

Expected: no direct child block directories remain except domain folders.

- [ ] **Step 6: Verify source tree shape**

Run:

```bash
find registry/aurora -maxdepth 3 -type d | sort
find registry/aurora/blocks -mindepth 1 -maxdepth 1 -type d | sort
```

Expected: top-level registry source contains `styles`, `ui`, and `blocks`; `blocks` contains only `ai`, `auth`, `feedback`, `files`, `navigation`, and `workspace`.

- [ ] **Step 7: Commit the physical move**

Run:

```bash
git add registry/aurora
git commit -m "refactor: group registry blocks by taxonomy"
```

Expected: commit contains only source file moves and no generated registry output yet.

## Task 3: Update Source Imports and Style References

**Files:**

- Modify: `app/globals.css`
- Modify: `app/gallery/demos/*.tsx`
- Modify: `registry/aurora/blocks/**/*.tsx`
- Modify: `scripts/audit-composition.mjs`

- [ ] **Step 1: Update the global CSS import**

Change `app/globals.css`:

```css
@import "../registry/aurora/styles/aurora.css";
```

Expected: the old `../registry/aurora/aurora.css` import no longer appears.

- [ ] **Step 2: Replace moved block import prefixes**

Run these search commands to identify exact files:

```bash
rg -n "@/registry/aurora/blocks/(prompt-input|thinking|tool-calls|artifact|ask-user-question|ai-elements|sidebar|command-palette|web-preview|share-dialog|code-block|marketplace|attachment|file-picker|file-tree|code-editor|login|oauth|permission-prompt|permissions-dropdown|error-page|terminal)" app registry scripts
rg -n "registry/aurora/blocks/(prompt-input|thinking|tool-calls|artifact|ask-user-question|ai-elements|sidebar|command-palette|web-preview|share-dialog|code-block|marketplace|attachment|file-picker|file-tree|code-editor|login|oauth|permission-prompt|permissions-dropdown|error-page|terminal)" app registry scripts
```

Expected: every match is an import, path literal, or sample path that needs update.

- [ ] **Step 3: Apply path replacements**

Replace these exact path prefixes:

```txt
@/registry/aurora/blocks/prompt-input/ -> @/registry/aurora/blocks/ai/prompt-input/
@/registry/aurora/blocks/thinking/ -> @/registry/aurora/blocks/ai/thinking/
@/registry/aurora/blocks/tool-calls/ -> @/registry/aurora/blocks/ai/tool-calls/
@/registry/aurora/blocks/artifact/ -> @/registry/aurora/blocks/ai/artifact/
@/registry/aurora/blocks/ask-user-question/ -> @/registry/aurora/blocks/ai/ask-user-question/
@/registry/aurora/blocks/ai-elements/ -> @/registry/aurora/blocks/ai/elements/
@/registry/aurora/blocks/sidebar/ -> @/registry/aurora/blocks/workspace/sidebar/
@/registry/aurora/blocks/command-palette/ -> @/registry/aurora/blocks/workspace/command-palette/
@/registry/aurora/blocks/web-preview/ -> @/registry/aurora/blocks/workspace/web-preview/
@/registry/aurora/blocks/share-dialog/ -> @/registry/aurora/blocks/workspace/share-dialog/
@/registry/aurora/blocks/code-block/ -> @/registry/aurora/blocks/workspace/code-block/
@/registry/aurora/blocks/marketplace/ -> @/registry/aurora/blocks/workspace/marketplace/
@/registry/aurora/blocks/attachment/ -> @/registry/aurora/blocks/files/attachment/
@/registry/aurora/blocks/file-picker/ -> @/registry/aurora/blocks/files/file-picker/
@/registry/aurora/blocks/file-tree/ -> @/registry/aurora/blocks/files/file-tree/
@/registry/aurora/blocks/code-editor/ -> @/registry/aurora/blocks/files/code-editor/
@/registry/aurora/blocks/login/ -> @/registry/aurora/blocks/auth/login/
@/registry/aurora/blocks/oauth/ -> @/registry/aurora/blocks/auth/oauth/
@/registry/aurora/blocks/permission-prompt/ -> @/registry/aurora/blocks/auth/permission-prompt/
@/registry/aurora/blocks/permissions-dropdown/ -> @/registry/aurora/blocks/auth/permissions-dropdown/
@/registry/aurora/blocks/error-page/ -> @/registry/aurora/blocks/feedback/error-page/
@/registry/aurora/blocks/terminal/ -> @/registry/aurora/blocks/navigation/terminal/
```

Also apply the same replacements without the `@/` prefix for plain string paths in demos, audit allow-lists, docs snippets, and registry metadata.

Expected: TypeScript imports resolve to the new moved source files.

- [ ] **Step 4: Update composition audit allow-list paths**

Change `scripts/audit-composition.mjs`:

```js
const allowedHiddenFileInputFiles = new Set([
  "registry/aurora/blocks/files/attachment/attachment.tsx",
  "registry/aurora/blocks/files/file-picker/file-picker.tsx",
  "registry/aurora/blocks/ai/prompt-input/prompt-input.tsx",
])
```

Expected: `pnpm audit:composition` still allows intentional hidden file inputs only in the moved files.

- [ ] **Step 5: Verify no stale source references remain**

Run:

```bash
rg -n "registry/aurora/aurora.css|registry/aurora/blocks/(prompt-input|thinking|tool-calls|artifact|ask-user-question|ai-elements|sidebar|command-palette|web-preview|share-dialog|code-block|marketplace|attachment|file-picker|file-tree|code-editor|login|oauth|permission-prompt|permissions-dropdown|error-page|terminal)" app registry scripts
```

Expected: no matches except historical text in `docs/superpowers/specs/2026-05-11-aurora-registry-taxonomy-design.md` and this plan.

- [ ] **Step 6: Run TypeScript-facing checks**

Run:

```bash
pnpm lint
```

Expected: command exits 0.

- [ ] **Step 7: Commit import/reference updates**

Run:

```bash
git add app scripts registry/aurora
git commit -m "chore: update imports for registry taxonomy"
```

Expected: commit contains import/path reference updates only.

## Task 4: Update Registry Manifest Paths and Metadata

**Files:**

- Modify: `registry.json`

- [ ] **Step 1: Update `aurora-tokens` file paths**

In `registry.json`, change the `aurora-tokens` item:

```json
{
  "path": "registry/aurora/styles/aurora.css",
  "type": "registry:style"
}
```

Also change:

```json
"sourcePath": "registry/aurora/styles/aurora.css"
```

Expected: no `registry/aurora/aurora.css` path remains in `registry.json`.

- [ ] **Step 2: Update block file paths and `meta.sourcePath` values**

For every moved block item, update each `files[].path` and `meta.sourcePath` to the new path from the Block Move Map.

Example for `aurora-prompt-input`:

```json
"files": [
  {
    "path": "registry/aurora/blocks/ai/prompt-input/prompt-input.tsx",
    "type": "registry:block"
  }
],
"meta": {
  "sourcePath": "registry/aurora/blocks/ai/prompt-input/prompt-input.tsx"
}
```

Example for `aurora-ai-elements` with multiple files:

```json
"files": [
  {
    "path": "registry/aurora/blocks/ai/elements/ai-elements.tsx",
    "type": "registry:block"
  },
  {
    "path": "registry/aurora/blocks/ai/elements/core.tsx",
    "type": "registry:block"
  }
],
"meta": {
  "sourcePath": "registry/aurora/blocks/ai/elements/ai-elements.tsx"
}
```

Expected: item names and public install URLs remain unchanged; only source paths change.

- [ ] **Step 3: Add taxonomy metadata for blocks**

For moved block items, add or update `meta.taxonomy` using these values:

```json
"meta": {
  "taxonomy": "ai"
}
```

Use:

```txt
ai: prompt-input, thinking, tool-calls, artifact, ask-user-question, ai-elements, all aurora-ai-* element items
workspace: sidebar, command-palette, web-preview, share-dialog, code-block, marketplace
files: attachment, file-picker, file-tree, code-editor
auth: login, oauth, permission-prompt, permissions-dropdown
feedback: error-page
navigation: terminal
```

Expected: browsing clients can group blocks by taxonomy without deriving domain from file paths.

- [ ] **Step 4: Validate JSON syntax**

Run:

```bash
node -e "JSON.parse(require('node:fs').readFileSync('registry.json', 'utf8')); console.log('registry.json ok')"
```

Expected: prints `registry.json ok`.

- [ ] **Step 5: Verify no stale manifest paths remain**

Run:

```bash
rg -n "registry/aurora/aurora.css|registry/aurora/blocks/(prompt-input|thinking|tool-calls|artifact|ask-user-question|ai-elements|sidebar|command-palette|web-preview|share-dialog|code-block|marketplace|attachment|file-picker|file-tree|code-editor|login|oauth|permission-prompt|permissions-dropdown|error-page|terminal)" registry.json
```

Expected: no matches.

- [ ] **Step 6: Commit manifest updates**

Run:

```bash
git add registry.json
git commit -m "chore: update registry manifest taxonomy paths"
```

Expected: commit contains only `registry.json`.

## Task 5: Regenerate Public Registry Payloads

**Files:**

- Regenerate: `public/r/registry.json`
- Regenerate: `public/r/aurora-*.json`

- [ ] **Step 1: Build the registry**

Run:

```bash
pnpm registry:build
```

Expected: command exits 0 and updates generated files under `public/r/`.

- [ ] **Step 2: Verify public token payload path**

Run:

```bash
node -e "const p=require('./public/r/aurora-tokens.json'); console.log(p.files.map(f=>f.path).join('\\n'))"
```

Expected output includes:

```txt
registry/aurora/styles/aurora.css
```

- [ ] **Step 3: Verify representative block payload paths**

Run:

```bash
node - <<'NODE'
for (const name of ['aurora-prompt-input', 'aurora-code-block', 'aurora-attachment', 'aurora-login', 'aurora-error-page', 'aurora-terminal']) {
  const payload = require(`./public/r/${name}.json`)
  console.log(name)
  for (const file of payload.files) console.log(`  ${file.path}`)
}
NODE
```

Expected: paths use `blocks/ai`, `blocks/workspace`, `blocks/files`, `blocks/auth`, `blocks/feedback`, and `blocks/navigation` respectively.

- [ ] **Step 4: Verify root public registry still exposes stable item names**

Run:

```bash
node - <<'NODE'
const registry = require('./public/r/registry.json')
const required = ['aurora-tokens', 'aurora-prompt-input', 'aurora-ai-elements', 'aurora-terminal']
for (const name of required) {
  if (!registry.items.some((item) => item.name === name)) {
    throw new Error(`missing ${name}`)
  }
}
console.log('stable names ok')
NODE
```

Expected: prints `stable names ok`.

- [ ] **Step 5: Commit generated payloads**

Run:

```bash
git add public/r
git commit -m "chore: regenerate taxonomy registry payloads"
```

Expected: commit contains generated JSON only.

## Task 6: Update Documentation and Browsing Copy

**Files:**

- Modify: `README.md`
- Optional Modify: `app/gallery/[section]/page.tsx`
- Optional Modify: `app/gallery/page.tsx`

- [ ] **Step 1: Update README setup import**

Change:

```css
@import "../registry/aurora/aurora.css";
```

to:

```css
@import "../registry/aurora/styles/aurora.css";
```

Expected: README points to the new token path.

- [ ] **Step 2: Update README overview and component sections**

Update copy to say:

```markdown
Aurora is a shadcn-compatible registry for agent products and operator-grade application workflows.
```

Add a short taxonomy summary:

```markdown
- `registry/aurora/styles/` contains the Aurora token and theme contract.
- `registry/aurora/ui/` contains stable UI primitives.
- `registry/aurora/blocks/` contains domain-oriented product blocks for AI, workspace, files, auth, navigation, and feedback workflows.
```

Expected: README no longer presents blocks as one undifferentiated flat folder.

- [ ] **Step 3: Update README block import examples**

Use examples from each domain:

```markdown
| PromptInput | `@/registry/aurora/blocks/ai/prompt-input/prompt-input` |
| CodeBlock | `@/registry/aurora/blocks/workspace/code-block/code-block` |
| Attachment | `@/registry/aurora/blocks/files/attachment/attachment` |
| Login | `@/registry/aurora/blocks/auth/login/login` |
| Terminal | `@/registry/aurora/blocks/navigation/terminal/terminal` |
| ErrorPage | `@/registry/aurora/blocks/feedback/error-page/error-page` |
```

Expected: examples reflect taxonomy and install names remain documented separately from source paths.

- [ ] **Step 4: Check gallery copy for stale flat block language**

Run:

```bash
rg -n "Composed Blocks|registry/aurora/blocks/|aurora.css|AI Elements|Marketplace" app README.md
```

Expected: update any user-facing stale path/copy in `app/gallery/page.tsx` or `app/gallery/[section]/page.tsx`; leave code-only import paths if already updated.

- [ ] **Step 5: Commit docs updates**

Run:

```bash
git add README.md app/gallery
git commit -m "docs: describe registry taxonomy"
```

Expected: commit contains docs and optional browsing-copy changes only.

## Task 7: Final Verification

**Files:**

- Verify: entire worktree

- [ ] **Step 1: Run stale path scan**

Run:

```bash
rg -n "registry/aurora/aurora.css|registry/aurora/blocks/(prompt-input|thinking|tool-calls|artifact|ask-user-question|ai-elements|sidebar|command-palette|web-preview|share-dialog|code-block|marketplace|attachment|file-picker|file-tree|code-editor|login|oauth|permission-prompt|permissions-dropdown|error-page|terminal)" app registry scripts README.md public/r
```

Expected: no stale paths.

- [ ] **Step 2: Run quality gates**

Run:

```bash
pnpm lint
pnpm audit:composition
pnpm registry:build
pnpm build
```

Expected: all commands exit 0 and `pnpm registry:build` leaves no unexpected diff.

- [ ] **Step 3: Inspect generated diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: no unstaged source changes. If `pnpm registry:build` touched generated payloads after the generated commit, inspect and commit them.

- [ ] **Step 4: Push source and Beads state**

Run:

```bash
git pull --rebase
bd dolt push
git push
git status --short --branch
```

Expected: git status shows the branch is up to date with origin and no taxonomy work is stranded locally.

## Review Notes

The normal `writing-plans` review loop asks for a separate plan-document-reviewer subagent. This environment only allows spawning subagents when the user explicitly requests agent delegation, so the implementer should run a fresh review pass before executing:

```bash
sed -n '1,260p' docs/superpowers/plans/2026-05-11-aurora-registry-taxonomy.md
sed -n '1,260p' docs/superpowers/specs/2026-05-11-aurora-registry-taxonomy-design.md
```

Reviewer acceptance criteria:

- Every moved file path has a matching registry manifest update.
- Public registry item names remain stable.
- `public/r/*.json` is regenerated from `registry.json`.
- README and gallery copy explain the taxonomy without exposing install-name churn.
- Final verification includes lint, composition audit, registry build, and production build.
