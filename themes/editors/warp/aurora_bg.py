"""Generate an Aurora-themed background JPG for Warp.
Navy vertical gradient (#102535 -> #07131c) with a soft cyan (#29b6f6) radial glow
in the lower-left, plus a fainter violet (#a78bfa) glow upper-right. Subtle, dark,
so terminal text stays readable at moderate opacity.
"""
import math
import os
from PIL import Image, ImageFilter

# Output next to this script, in themes/aurora.jpg
HERE = os.path.dirname(os.path.abspath(__file__))

W, H = 2560, 1440

def hx(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

TOP    = hx("#102535")   # lifted navy
BOTTOM = hx("#06111a")   # deep navy (a touch darker than base for richness)
CYAN   = hx("#29b6f6")
VIOLET = hx("#a78bfa")
ROSE   = hx("#f9a8c4")

img = Image.new("RGB", (W, H))
px = img.load()

# Vertical gradient base
for y in range(H):
    t = y / (H - 1)
    r = round(TOP[0] + (BOTTOM[0] - TOP[0]) * t)
    g = round(TOP[1] + (BOTTOM[1] - TOP[1]) * t)
    b = round(TOP[2] + (BOTTOM[2] - TOP[2]) * t)
    for x in range(W):
        px[x, y] = (r, g, b)

def add_glow(base, color, cx, cy, radius, strength):
    """Additive radial glow onto base image (in place)."""
    bp = base.load()
    r2 = radius * radius
    for y in range(H):
        dy = y - cy
        for x in range(W):
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

# Punchier glows: bright cyan lower-left, vivid violet upper-right,
# plus a soft rose mid-right for warmth. Stronger + wider than the subtle pass.
add_glow(img, CYAN,   int(W * 0.16), int(H * 0.84), int(W * 0.60), 0.42)
add_glow(img, VIOLET, int(W * 0.90), int(H * 0.10), int(W * 0.52), 0.30)
add_glow(img, ROSE,   int(W * 0.72), int(H * 0.66), int(W * 0.34), 0.14)

# Soften so the glows read as ambient light, not blobs
img = img.filter(ImageFilter.GaussianBlur(radius=2))

out = os.path.join(HERE, "themes", "aurora.jpg")
img.save(out, "JPEG", quality=88, optimize=True)
print("wrote", out)
