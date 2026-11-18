"""Cut the Edafat wordmark out of the supplied logo tile and write
img/logo-dark.png (for light backgrounds), img/logo-white.png (for dark ones) and favicon files.
Run:  python3 tools/make_logo.py <path-to-logo-tile.png>"""
import sys, os
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = Image.open(sys.argv[1]).convert("RGB")
BG = src.getpixel((5, 5))            # saffron tile colour
INK = (18, 9, 10)                    # darkest wordmark colour
SCALE = 4

def lum(p): return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]

# 1. alpha = how far each pixel is from the tile colour towards the ink colour
w, h = src.size
a = Image.new("L", (w, h))
span = lum(BG) - lum(INK)
a.putdata([max(0, min(255, int(255 * (lum(BG) - lum(p)) / span))) for p in src.getdata()])

# 2. crop to the wordmark and its "+"
box = (28, 140, 196, 190)
a = a.crop(box)

# 3. upscale and tighten the edges so the letters stay crisp (vector-like)
big = a.resize((a.width * SCALE, a.height * SCALE), Image.LANCZOS).filter(ImageFilter.GaussianBlur(.6))
def curve(v):                         # smoothstep around the 50% edge
    t = max(0.0, min(1.0, (v - 70) / (185 - 70)))
    return int(255 * t * t * (3 - 2 * t))
sharp = big.point(curve)

# 4. the "+" in the original is a muted, semi-transparent mark: keep it at ~55% opacity
plus_x0 = (174 - box[0]) * SCALE
soft = big.filter(ImageFilter.GaussianBlur(3.2))      # smooth away the hatching in the original "+"
def curve_plus(v):
    t = max(0.0, min(1.0, (v - 40) / (95 - 40)))
    return int(255 * t * t * (3 - 2 * t))
solid = soft.point(curve_plus)
px, sp = sharp.load(), solid.load()
for y in range(sharp.height):
    for x in range(plus_x0, sharp.width):
        px[x, y] = int(sp[x, y] * .6)

def write(colour, name):
    out = Image.new("RGBA", sharp.size, colour + (0,))
    out.putalpha(sharp)
    bb = out.getbbox()
    out = out.crop(bb)
    out.save(os.path.join(ROOT, "img", name), optimize=True)
    print(name, out.size)

write((21, 17, 15), "logo-dark.png")
write((255, 255, 255), "logo-white.png")

# 5. favicon: the "e" on the saffron tile
# find the first blank column after the "e" starts, so the glyph is cut exactly between letters
cols = [any(sharp.getpixel((x, y)) > 40 for y in range(sharp.height)) for x in range(sharp.width)]
x0 = cols.index(True); x1 = x0
while x1 < len(cols) and cols[x1]: x1 += 1
e = sharp.crop((0, 0, x1, sharp.height))
e = e.crop(e.getbbox())
for size, name in [(64, "favicon-64.png"), (180, "apple-touch-icon.png")]:
    tile = Image.new("RGBA", (size, size), BG + (255,))
    s = int(size * .62)
    glyph = e.copy(); glyph.thumbnail((s, s), Image.LANCZOS)
    ink = Image.new("RGBA", glyph.size, (21, 17, 15, 0)); ink.putalpha(glyph)
    tile.alpha_composite(ink, ((size - glyph.width) // 2, (size - glyph.height) // 2))
    tile.save(os.path.join(ROOT, "img", name))
    print(name)
