"""Optimise the Arpitim BuildTrade brand assets fetched from cognivra.net.
Usage: python3 -I tools/build_buildtrade_assets.py <raw-dir>
<raw-dir> must contain img/ (logo, service photos, sector photo, favicon) and frame_<t>.jpg (hero video still),
plus the page JSON dumps (copied to data/ for provenance)."""
import glob, os, shutil, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = sys.argv[1]
OUT = os.path.join(ROOT, "img/bt"); os.makedirs(OUT, exist_ok=True); os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)

def webp(src, dst, width, q=78):
    im = Image.open(src).convert("RGB"); im.thumbnail((width, width * 2), Image.LANCZOS)
    im.save(os.path.join(OUT, dst), quality=q, method=6); print(dst, im.size, os.path.getsize(os.path.join(OUT, dst)) // 1024, "KB")

# hero: a still from the site's hero video (clearest frame, no people covering the headline side)
frame = os.path.join(RAW, "frame_8.jpg")
webp(frame, "hero.webp", 1920, 74); webp(frame, "hero-900.webp", 1000, 70)
# service + sector photos
for i, n in enumerate(["BUILTTD1.png", "BUILTTD12.png", "BUILTTD13.png"], 1):
    webp(os.path.join(RAW, "img", n), f"service-{i}.webp", 1045, 78)
webp(os.path.join(RAW, "img", "SECB4.png"), "sector-fb.webp", 875, 78)

# logo: the supplied artwork is white on transparent (for dark backgrounds); derive a dark version for the light header
logo = Image.open(os.path.join(RAW, "img", "builtrade_logo-preview.webp")).convert("RGBA")
bb = logo.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox(); logo = logo.crop(bb)
# the supplied artwork has a stray dash above the wordmark (a rendering artefact): clear it, then re-trim
la = logo.getchannel("A").load(); lp = logo.load()
rows = [y for y in range(logo.height) if any(la[x, y] > 8 for x in range(logo.width))]
gap_end = next((y for y in range(rows[0], logo.height) if not any(la[x, y] > 8 for x in range(logo.width))), None)
if gap_end is not None and gap_end < 20:                       # a thin blob followed by an empty gap = the dash
    for y in range(gap_end):
        for x in range(logo.width): lp[x, y] = (0, 0, 0, 0)
    logo = logo.crop(logo.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
logo.save(os.path.join(ROOT, "img/logo-white.png"), optimize=True)
dark = logo.copy(); px = dark.load()
for y in range(dark.height):
    for x in range(dark.width):
        r, g, b, a = px[x, y]
        if a and min(r, g, b) > 170 and max(r, g, b) - min(r, g, b) < 40:       # near-white pixels -> espresso ink
            t = (min(r, g, b) - 170) / 85.0; px[x, y] = (int(21 + (1 - t) * (r - 21)), int(17 + (1 - t) * (g - 17)), int(15 + (1 - t) * (b - 15)), a)
dark.save(os.path.join(ROOT, "img/logo-dark.png"), optimize=True); print("logo", logo.size)

# favicon / touch icon from the site's own icon
icon = Image.open(os.path.join(RAW, "img", "apple-touch-icon.png")).convert("RGBA")
icon.save(os.path.join(ROOT, "img/apple-touch-icon.png")); icon.resize((64, 64), Image.LANCZOS).save(os.path.join(ROOT, "img/favicon-64.png"))

# keep the raw page text next to the data for provenance
for f in glob.glob(os.path.join(RAW, "*.json")):
    if os.path.basename(f) in ("bgs.json", "files.json"): continue
    shutil.copy(f, os.path.join(ROOT, "data", "buildtrade-" + os.path.basename(f)))
print("done")
