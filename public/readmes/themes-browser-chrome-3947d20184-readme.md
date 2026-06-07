# Aurora for Chrome

Dark-first navy browser theme with a neon cyan accent, derived from the Aurora
design system (`aurora.tootie.tv`). A Chrome theme is a code-less MV3 extension —
a `manifest.json` with a `theme` block. It styles **browser chrome only** (window
frame, tabs, toolbar, bookmarks bar, new-tab page); it cannot style web page
content.

Uses the **Aurora Neon palette** — matched to the deployed "Aurora Neon" Zed
theme: a bright lifted navy base (`#102a3e`), pure-white text, saturated raised
surfaces, and neon accents (cyan `#38d2ff`, mint `#5ef0d8`, violet `#c4a5ff`).
The dark variant adds a cranked Aurora glow on the new-tab page.

Ships two variants, each a loadable unpacked folder:

- **Aurora Neon** (`aurora/`) — dark, navy base `#102a3e`, neon cyan `#38d2ff`, NTP glow
- **Aurora Neon Light** (`aurora-light/`) — light, frame `#f1f7fa`, cyan `#0098e6`

```
themes/browser/chrome/
├── generate-manifests.py        # token hex → Chrome RGB arrays + glow PNG (source of truth)
├── aurora/
│   ├── manifest.json            # dark, loadable unpacked
│   └── images/ntp.png           # Aurora glow for the new-tab page
└── aurora-light/manifest.json   # light, loadable unpacked
```

## Install (load unpacked)

1. Open `chrome://extensions`
2. Toggle **Developer mode** (top-right)
3. **Load unpacked** → select `themes/browser/chrome/aurora` (or `aurora-light`)

Chrome applies a theme immediately; only one theme can be active at a time.
Loading the other variant replaces it. To remove, open `chrome://extensions` and
remove the theme, or **Settings → Appearance → Reset to default**.

Or grab a zipped folder from the live site (served from `public/chrome/`),
unzip, and load unpacked:

```sh
curl -fsSL https://aurora.tootie.tv/chrome/aurora.zip       -o aurora.zip       && unzip aurora.zip -d aurora
curl -fsSL https://aurora.tootie.tv/chrome/aurora-light.zip -o aurora-light.zip && unzip aurora-light.zip -d aurora-light
```

> Chromium-based browsers (Edge, Brave, Vivaldi, Opera) read the same theme
> manifest — load unpacked the same way.

## Source of truth

`themes/browser/chrome/generate-manifests.py` holds the canonical Aurora token hex
values and emits every manifest. Edit the `DARK` / `LIGHT` maps there, never the
generated JSON. Regenerate after any change:

```sh
python3 themes/browser/chrome/generate-manifests.py
```

This rewrites `themes/browser/chrome/{aurora,aurora-light}/manifest.json`, the served
copies under `public/chrome/`, and the downloadable `public/chrome/*.zip`.

## Chrome theme notes

- **Colors are RGB integer arrays `[r, g, b]` (0–255), not hex.** The generator
  converts; that's its whole reason to exist.
- **Tints are HSL floats `[h, s, l]` (0–1, or `-1` to leave unchanged).** Button
  icons are colored directly via `toolbar_button_icon`, so the global `buttons`
  tint stays `[-1, -1, -1]`.
- **`ntp_logo_alternate`** — `1` forces the white Google wordmark (dark variant),
  `0` keeps the colored one (light variant).
- **NTP glow image.** `aurora/images/ntp.png` is a 2560×1440 Aurora Neon glow
  (cyan lower-center, violet upper, mint mid) on the navy `ntp_background`. Its
  glows fade to zero before the edges, so the PNG corners equal `ntp_background`
  exactly — centered with no tiling, any uncovered margin on large screens is
  seamless. Only the dark variant uses it; a background image under the light
  variant muddies contrast. Tune the glow positions/strengths in `make_ntp_glow`.

## Publish (optional)

Load unpacked is enough for personal use and sharing the folder/zip. To list on
the Chrome Web Store, zip the variant folder, register a developer account
(one-time $5 fee), and upload — themes are reviewed like any extension.

## Color map (Neon palette)

Matched to the deployed Aurora Neon Zed theme — edit the `DARK` / `LIGHT` maps in
`generate-manifests.py`:

| Chrome slot | Role | Dark | Light |
|------|------|------|-------|
| `frame` | window frame | `#102a3e` | `#f1f7fa` |
| `toolbar` | toolbar / active tab | `#1d4263` | `#ffffff` |
| `tab_text` | active tab / foreground | `#ffffff` | `#07131c` |
| `tab_background_text` | inactive tab text | `#cfe0ea` | `#3d6070` |
| `bookmark_text` | bookmarks bar | `#ffffff` | `#07131c` |
| `ntp_background` | new-tab base | `#102a3e` | `#eef6fa` |
| `ntp_text` | new-tab text | `#ffffff` | `#07131c` |
| `ntp_link` | new-tab links | `#38d2ff` | `#0098e6` |
| `omnibox_background` | address bar | `#163a56` | `#ffffff` |
| `toolbar_button_icon` | toolbar icons | `#5ed0ff` | `#0277c0` |
