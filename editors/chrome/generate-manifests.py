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

VERSION = "1.2.0"


def rgb(h):
    """'#103154' -> [16, 49, 84]."""
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# Aurora Neon palette — matched to the deployed "Aurora Neon" Zed theme: a bright
# lifted navy base (#102a3e), pure-white text, saturated raised surfaces, and
# neon accents (cyan #38d2ff, mint #5ef0d8, violet #c4a5ff). Poppier than the
# Warp pop palette. Map: Chrome slot -> hex.
DARK = {
    "frame":                     "#102a3e",  # Neon base (bright lifted navy)
    "frame_inactive":            "#0d2334",  # slightly deeper
    "frame_incognito":           "#16304a",  # cool slate-navy
    "frame_incognito_inactive":  "#0d2334",
    "toolbar":                   "#1d4263",  # Neon raised surface — tabs separate
    "tab_text":                  "#ffffff",  # Neon pure-white foreground
    "tab_background_text":       "#cfe0ea",  # Neon muted
    "bookmark_text":             "#ffffff",
    "ntp_background":            "#102a3e",  # Neon base — glow rides on top
    "ntp_text":                  "#ffffff",
    "ntp_link":                  "#38d2ff",  # Neon cyan — the pop accent
    "ntp_header":                "#38d2ff",
    "button_background":         "#1d4263",
    "toolbar_button_icon":       "#5ed0ff",  # Neon bright cyan icons
    "omnibox_background":        "#163a56",  # bright lifted control surface
    "omnibox_text":              "#ffffff",
}

LIGHT = {
    "frame":                     "#f1f7fa",  # Neon Light title/tab bar
    "frame_inactive":            "#e4f0f5",
    "frame_incognito":           "#edf5f8",
    "frame_incognito_inactive":  "#e4f0f5",
    "toolbar":                   "#ffffff",
    "tab_text":                  "#07131c",
    "tab_background_text":       "#3d6070",
    "bookmark_text":             "#07131c",
    "ntp_background":            "#eef6fa",
    "ntp_text":                  "#07131c",
    "ntp_link":                  "#0098e6",  # vivid cyan
    "ntp_header":                "#0098e6",
    "button_background":         "#ffffff",
    "toolbar_button_icon":       "#0277c0",
    "omnibox_background":        "#ffffff",
    "omnibox_text":              "#07131c",
}

# Neon glow accents painted onto the dark new-tab background.
NTP_BASE = hx(DARK["ntp_background"])
CYAN = hx("#38d2ff")    # Neon cyan
VIOLET = hx("#c4a5ff")  # Neon violet
MINT = hx("#5ef0d8")    # Neon mint


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
    add_glow(CYAN,   int(width * 0.50), int(height * 0.66), int(width * 0.34), 0.78)
    add_glow(VIOLET, int(width * 0.69), int(height * 0.28), int(width * 0.26), 0.50)
    add_glow(MINT,   int(width * 0.31), int(height * 0.38), int(width * 0.20), 0.30)

    return img.filter(ImageFilter.GaussianBlur(radius=3))


VARIANTS = [
    ("aurora", manifest(
        "Aurora Neon",
        "Aurora design system theme for Chrome — bright navy with neon cyan glow.",
        DARK, 1, ntp_image="images/ntp.png")),
    ("aurora-light", manifest(
        "Aurora Neon Light",
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
