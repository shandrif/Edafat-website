# Premium European F&B brands: prototype

Static website (HTML, CSS, vanilla JS; no build step). Pages: `index.html`, `brand.html?b=<slug>`, `products.html`, `about.html`, `contact.html`.

## Where the content comes from

Brand details come from <https://cognivra.net/food-beverage-buildtrade/> (Food & Beverages sector page).

```bash
# 1. fetch the page with a real browser (Playwright) and download photos + logos into a raw folder
node tools/fetch_cognivra.js /path/to/raw
# 2. optimise images into img/brands/ and generate js/data.js
python3 -I tools/build_brands.py /path/to/raw
```

- `data/cognivra-source.json` keeps the raw scrape for provenance.
- Item lists marked `DERIVED` in `tools/build_brands.py` were split out of a one-sentence "flagship" description on the source page.
- Item illustrations are drawn in `js/glyphs.js` (the source has no per-item photos). Add a keyword rule there for new items.

## Theme and motion

- Colours: espresso `#221c19`, saffron `#f4a900`, gelato white `#faf8f4`. Type: Instrument Serif + Manrope.
- Motion follows Emil Kowalski's rules (<https://github.com/emilkowalski/skills>): `transform`/`opacity`/`clip-path` only, strong ease-out `cubic-bezier(.23,1,.32,1)`, non-uniform stagger, hover gated by `(hover:hover)`, press feedback, `prefers-reduced-motion` respected.

## To confirm before launch

- Site name and logo (currently the supplied "edafat" logo as a placeholder).
- Contact details (placeholders in `js/app.js`).
- Rights to use the brands' photos and logos.
- Claims such as Halal/SFDA readiness are quoted from the source page; verify with the brands.
