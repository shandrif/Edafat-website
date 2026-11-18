"""Make product photos transparent: flood-fill the plain backdrop from the corners.
Run after tools/build_catalog.py:  python3 tools/cutouts.py"""
import glob, os
from PIL import Image, ImageDraw, ImageFilter, ImageChops
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAG = (255, 0, 255)
SKIP = {'cremosette-cremosette-pistachio.webp','cremosette-cremosette-gianduia.webp','dairy-burrata-fresh-cheese.webp','dairy-pecorino-romano-pdo.webp'}
for f in sorted(glob.glob(os.path.join(ROOT, "img/p/*.webp"))):
    im = Image.open(f)
    if im.mode == "RGBA": continue                      # already transparent
    rgb = im.convert("RGB"); w, h = rgb.size
    corners = [rgb.getpixel(p) for p in [(1, 1), (w - 2, 1), (1, h - 2), (w - 2, h - 2)]]
    if os.path.basename(f) in SKIP: continue              # lifestyle / gradient photos: leave alone
    if min(min(c) for c in corners) < 200: continue       # dark / gradient backdrop: leave alone
    mask_src = rgb.copy()
    for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(mask_src, p, MAG, thresh=34)
    bg = Image.new("RGB", (w, h), MAG)
    alpha = ImageChops.difference(mask_src, bg).convert("L").point(lambda v: 255 if v > 0 else 0)
    if sum(1 for v in alpha.resize((40, 40)).getdata() if v == 0) < 40: continue  # nothing removed
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.9))
    out = rgb.convert("RGBA"); out.putalpha(alpha); out.save(f, quality=84, method=6)
    print("cut", os.path.basename(f))
