"""Generate Aurora theme manifests + glow art for Google Chrome.

Chrome themes are code-less MV3 extensions whose `manifest.json` carries a
`theme` block. Colors are RGB integer arrays [r, g, b] (0-255), NOT hex, so this
script is the bridge: it holds the Aurora "pop" palette (brightened over the
source tokens, matching the deployed Warp theme) and emits the converted
manifests, plus an Aurora glow PNG for the new-tab page.

Writes loadable unpacked theme folders:
    editors/chrome/aurora/        manifest.json + images/ntp.png   (dark)
    editors/chrome/aurora-light/  manifest.json                    (light)
and served copies + downloadable zips under public/chrome/. Requires Pillow.

    python3 editors/chrome/generate-manifests.py
"""
import json
import math
import os
import zipfile

from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
PUBLIC = os.path.join(ROOT, "public", "chrome")

VERSION = "1.1.0"


def rgb(h):
    """'#103154' -> [16, 49, 84]."""
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# Aurora "pop" palette — brightened over the source tokens so the browser chrome
# really reads as Aurora rather than near-black navy. Mirrors the deployed Warp
# pop palette (cyan #4dc8fa, foreground #f0f8fd). Map: Chrome slot -> hex.
DARK = {
    "frame":                     "#103154",  # vivid lifted navy (was near-black)
    "frame_inactive":            "#0b2540",  # dimmer lifted navy
    "frame_incognito":           "#15243a",  # cool slate-navy
    "frame_incognito_inactive":  "#0b2540",
    "toolbar":                   "#16395c",  # brighter than frame — tabs separate
    "tab_text":                  "#f0f8fd",  # bright foreground
    "tab_background_text":       "#bcd6e6",  # bright muted, readable on lifted frame
    "bookmark_text":             "#f0f8fd",
    "ntp_background":            "#0a1c2e",  # deep navy so the glow art pops
    "ntp_text":                  "#f0f8fd",
    "ntp_link":                  "#4dc8fa",  # vivid cyan — the pop accent
    "ntp_header":                "#4dc8fa",
    "button_background":         "#16395c",
    "toolbar_button_icon":       "#7fcdfa",  # bright cyan-leaning icons
    "omnibox_background":        "#0e2a44",  # lifted, not near-black
    "omnibox_text":              "#f0f8fd",
}

LIGHT = {
    "frame":                     "#d6ecf5",  # cyan-tinted light frame (pop)
    "frame_inactive":            "#e4f0f5",
    "frame_incognito":           "#cfe3ee",
    "frame_incognito_inactive":  "#e4f0f5",
    "toolbar":                   "#ffffff",
    "tab_text":                  "#05121b",
    "tab_background_text":       "#2c5366",
    "bookmark_text":             "#05121b",
    "ntp_background":            "#e8f4fa",
    "ntp_text":                  "#05121b",
    "ntp_link":                  "#0098e6",  # vivid cyan (Warp light pop)
    "ntp_header":                "#0098e6",
    "button_background":         "#ffffff",
    "toolbar_button_icon":       "#0277c0",
    "omnibox_background":        "#f2f9fc",
    "omnibox_text":              "#05121b",
}

# Glow accents painted onto the dark new-tab background.
NTP_BASE = hx(DARK["ntp_background"])
CYAN = hx("#29b6f6")
VIOLET = hx("#a78bfa")
ROSE = hx("#f9a8c4")


def manifest(name, description, colors, logo_alternate, ntp_image=None):
    theme = {
        "colors": {slot: rgb(hexv) for slot, hexv in colors.items()},
        # icons are colored via toolbar_button_icon; keep the global tint neutral.
        "tints": {"buttons": [-1.0, -1.0, -1.0]},
        "properties": {
            # 1 = white wordmark for dark backgrounds, 0 = default.
            "ntp_logo_alternate": logo_alternate,
        },
    }
    if ntp_image:
        theme["images"] = {"theme_ntp_background": ntp_image}
        # Centered, no tile — glow fades to the solid ntp_background at the edges,
        # so any uncovered margin on large screens is seamless.
        theme["properties"]["ntp_background_alignment"] = "center"
        theme["properties"]["ntp_background_repeat"] = "no-repeat"
    return {
        "manifest_version": 3,
        "version": VERSION,
        "name": name,
        "description": description,
        "theme": theme,
    }


def make_ntp_glow(width=2560, height=1440):
    """Aurora glow on a deep-navy field. Glows fade to zero before the edges so
    the PNG corners equal ntp_background — seamless when centered on any screen.
    """
    img = Image.new("RGB", (width, height), NTP_BASE)

    def add_glow(color, cx, cy, radius, strength):
        bp = img.load()
        r2 = radius * radius
        x0, y0 = max(0, cx - radius), max(0, cy - radius)
        x1, y1 = min(width, cx + radius), min(height, cy + radius)
        for y in range(y0, y1):
            dy = y - cy
            for x in range(x0, x1):
                dx = x - cx
                d2 = dx * dx + dy * dy
                if d2 >= r2:
                    continue
                f = (1 - math.sqrt(d2) / radius) ** 2 * strength
                cr, cg, cb = bp[x, y]
                bp[x, y] = (
                    min(255, round(cr + color[0] * f)),
                    min(255, round(cg + color[1] * f)),
                    min(255, round(cb + color[2] * f)),
                )

    # Kept within the central band so center-cropping on smaller screens still
    # shows the glow, and radii stay clear of the edges for seamless margins.
    add_glow(CYAN,   int(width * 0.50), int(height * 0.66), int(width * 0.30), 0.55)
    add_glow(VIOLET, int(width * 0.68), int(height * 0.30), int(width * 0.24), 0.34)
    add_glow(ROSE,   int(width * 0.33), int(height * 0.40), int(width * 0.18), 0.18)

    return img.filter(ImageFilter.GaussianBlur(radius=3))


VARIANTS = [
    ("aurora", manifest(
        "Aurora",
        "Aurora design system theme for Chrome — vivid navy with cyan glow.",
        DARK, 1, ntp_image="images/ntp.png")),
    ("aurora-light", manifest(
        "Aurora Light",
        "Aurora design system theme for Chrome — bright cyan-tinted light.",
        LIGHT, 0)),
]


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("wrote", os.path.relpath(path, ROOT))


def main():
    os.makedirs(PUBLIC, exist_ok=True)
    glow = make_ntp_glow()

    for folder, data in VARIANTS:
        has_image = "images" in data["theme"]
        src_dir = os.path.join(HERE, folder)
        pub_dir = os.path.join(PUBLIC, folder)
        write_json(os.path.join(src_dir, "manifest.json"), data)
        write_json(os.path.join(pub_dir, "manifest.json"), data)

        if has_image:
            for d in (src_dir, pub_dir):
                img_path = os.path.join(d, "images", "ntp.png")
                os.makedirs(os.path.dirname(img_path), exist_ok=True)
                glow.save(img_path, "PNG", optimize=True)
                print("wrote", os.path.relpath(img_path, ROOT))

        # downloadable unpacked-folder zip (load via chrome://extensions)
        zip_path = os.path.join(PUBLIC, folder + ".zip")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
            zi = zipfile.ZipInfo("manifest.json", (1980, 1, 1, 0, 0, 0))
            z.writestr(zi, json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            if has_image:
                z.write(os.path.join(src_dir, "images", "ntp.png"),
                        "images/ntp.png")
        print("wrote", os.path.relpath(zip_path, ROOT))


if __name__ == "__main__":
    main()
