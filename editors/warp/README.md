# Aurora for Warp

Dark-first navy theme with cyan / rose / violet accents, derived from the Aurora
design system (`aurora.tootie.tv`) and the Claude Code Aurora theme tokens.

Ships two variants:

- **Aurora** — dark, navy base `#07131c`, cyan primary `#29b6f6`, gradient + background image
- **Aurora Light** — light, white base, cyan primary `#0288d1`, gradient

## Install (Windows)

Warp reads custom themes from a platform-specific directory. On **Windows** the
authoritative path is the AppData one; `~/.warp/themes` (macOS convention) is also
discovered, so it's safe to install to both.

```powershell
# authoritative
$dst = "$env:APPDATA\warp\Warp\data\themes"
mkdir $dst -Force
copy editors\warp\themes\*.yaml $dst
copy editors\warp\themes\aurora.jpg $dst
```

Or straight from `aurora.tootie.tv` (served from `public/warp/`):

```sh
curl -fsSL https://aurora.tootie.tv/warp/aurora.yaml       -o "$APPDATA/warp/Warp/data/themes/aurora.yaml"
curl -fsSL https://aurora.tootie.tv/warp/aurora-light.yaml -o "$APPDATA/warp/Warp/data/themes/aurora-light.yaml"
curl -fsSL https://aurora.tootie.tv/warp/aurora.jpg        -o "$APPDATA/warp/Warp/data/themes/aurora.jpg"
```

### Other platforms

| OS | Themes directory |
|----|------------------|
| macOS | `~/.warp/themes/` |
| Linux | `${XDG_DATA_HOME:-$HOME/.local/share}/warp-terminal/themes/` |
| Windows | `%APPDATA%\warp\Warp\data\themes\` |

Warp can take a few minutes to discover a brand-new themes directory.
**Restart Warp** to force a rescan, then **Settings → Appearance → Themes → Aurora / Aurora Light**.

## Source of truth

`editors/warp/themes/*.yaml` is canonical. `public/warp/*` is a served copy —
keep them in sync when editing. `editors/warp/aurora_bg.py` regenerates the
background image.

## Background image

`aurora.jpg` (2560×1440) is a navy vertical gradient (`#102535 → #06111a`) with a
soft cyan glow lower-left and a fainter violet glow upper-right, Gaussian-blurred.

```sh
# regenerate themes/aurora.jpg (requires Pillow)
python3 editors/warp/aurora_bg.py
cp editors/warp/themes/aurora.jpg public/warp/aurora.jpg
```

Only the **dark** theme uses a background image — a background image under the
light theme muddies text contrast.

## Warp YAML notes

Learned from the [Warp custom-themes docs](https://docs.warp.dev/terminal/appearance/custom-themes):

- **Gradient** uses `top`/`bottom` (vertical) or `left`/`right` (horizontal) keys —
  Warp does **not** support CSS `linear-gradient` / color-stops / angles.
- **`background_image`** needs `path` (relative to the themes dir; absolute also works)
  and a **mandatory** `opacity` integer `0–100`. **JPG/JPEG only** — PNG is unsupported.
- `details: darker` for dark themes, `lighter` for light.

### Tuning

| Want | Change |
|------|--------|
| More vivid background | Raise `background_image.opacity` toward 80–100 |
| Subtler background | Lower `opacity` toward ~30 |
| Tighter/darker gradient | e.g. `top: "#0c1c28"`, `bottom: "#07131c"` |
| No background image | Delete the `background_image:` block |
| Regenerate the image | Edit glow params + run `aurora_bg.py` |

## Palette

| Role | Dark | Light |
|------|------|-------|
| background | `#07131c` | `#ffffff` |
| foreground | `#e6f4fb` | `#07131c` |
| cyan (primary) | `#29b6f6` | `#0288d1` |
| rose (magenta) | `#f9a8c4` | `#d63a6f` |
| violet (bright magenta) | `#a78bfa` | `#7c3aed` |
| teal (green) | `#7dd3c7` | `#2d7d6e` |
| amber (yellow) | `#c6a36b` | `#8a6914` |
| error (red) | `#c78490` | `#9c3545` |
