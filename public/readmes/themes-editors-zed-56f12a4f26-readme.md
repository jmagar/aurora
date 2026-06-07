# Aurora for Zed

Dark-first navy theme with cyan / rose / violet accents, derived from the Aurora
design system (`aurora.tootie.tv`) and the Claude Code Aurora theme tokens.

Ships **UI themes** + a matching **icon theme**:

- **Aurora Neon** / **Aurora Neon Light** — editor color themes (`themes/aurora.json`)
- **Aurora Neon Icons** / **Aurora Neon Icons Light** — full file-type icon set
  (`icon_themes/aurora.json` + `icons/*.svg`): glyph tiles tinted by category
  (cyan=web, gold=systems, mint=scripting, violet=jvm/config, rose=docs/media)

```
themes/editors/zed/
├── extension.toml
├── themes/aurora.json          # 2 UI themes
├── icon_themes/aurora.json     # 2 icon themes
├── icons/*.svg                 # 60 generated tile/folder/chevron icons
└── generate-icons.py           # regenerate icons + icon_themes/aurora.json
```

Regenerate icons after editing the tables in `generate-icons.py`:

```sh
python3 themes/editors/zed/generate-icons.py
```

## Install (extension — gives UI themes AND icons)

Icon themes only load from an installed extension. In Zed, run
`zed: install dev extension` and select this directory (`themes/editors/zed`). That
registers all four themes. Then:

- `theme selector: toggle` → **Aurora Neon** / **Aurora Neon Light**
- `icon theme selector: toggle` → **Aurora Neon Icons** / **Aurora Neon Icons Light**

## UI theme only (no extension, no icons)

The color theme alone can be dropped in without an extension:

```sh
cp themes/editors/zed/themes/aurora.json ~/.config/zed/themes/aurora.json
# or from the live site:
curl -fsSL https://aurora.tootie.tv/zed/aurora.json -o ~/.config/zed/themes/aurora.json
```

If you install the extension, remove this drop-in copy to avoid a duplicate
"Aurora" entry in the theme picker.

## Publish

Open a PR adding this extension to
[`zed-industries/extensions`](https://github.com/zed-industries/extensions).

## Publish

Open a PR adding this extension to
[`zed-industries/extensions`](https://github.com/zed-industries/extensions).

## Source of truth

`themes/editors/zed/themes/aurora.json` is canonical. `public/zed/aurora.json` is a
served copy — keep them in sync (or regenerate the copy) when editing.

## Palette

| Role | Dark | Light |
|------|------|-------|
| background | `#07131c` | `#ffffff` |
| cyan (primary) | `#29b6f6` | `#0288d1` |
| rose | `#f9a8c4` | `#d63a6f` |
| violet (keyword) | `#a78bfa` | `#7c3aed` |
| teal (string) | `#7dd3c7` | `#2d7d6e` |
| amber (number) | `#c6a36b` | `#8a6914` |
