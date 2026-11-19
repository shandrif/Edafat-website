# Arpitim BuildTrade by Cognivra: Food & Beverage prototype

Static website (HTML, CSS, vanilla JS; no build step).

Pages: `index.html` (company home), `services.html`, `food-beverage.html` (sector: brands, where we sell, occasions),
`brand.html?b=<slug>`, `products.html` (all items), `why-us.html`, `about.html`, `contact.html`.

## Content sources (all from cognivra.net)

| What | Source page | File |
| --- | --- | --- |
| Company copy, services, capabilities, Why Us, contact details, footer | `/buildtrade/`, `/services-buildtrade/`, `/why-us-buildtrade/`, `/contact-buildtrade/` | `js/content.js` (verbatim) |
| Food & Beverage brands, items, formats, occasions | `/food-beverage-buildtrade/` | `js/data.js` (generated), `js/content.js` |
| Logo, favicon, hero still, service and sector photos | `/buildtrade/` | `img/logo-*.png`, `img/bt/`, `img/favicon-64.png` |
| Brand photos and logos | `/food-beverage-buildtrade/` | `img/brands/` |

Raw page dumps are in `data/` for provenance.

```bash
# Food & Beverage brands: fetch with a real browser, then optimise images and generate js/data.js
node tools/fetch_cognivra.js /path/to/raw
python3 -I tools/build_brands.py /path/to/raw
# Company assets (logo, hero still, service/sector photos) from a raw folder
python3 -I tools/build_buildtrade_assets.py /path/to/raw-buildtrade
```

- The hero image is a still frame from the source site's hero video (`Buildtrade-New.mp4`).
- Item lists marked `DERIVED` in `tools/build_brands.py` were split out of a one-sentence "flagship" description on the source page.
- Item illustrations are drawn in `js/glyphs.js` (the source has no per-item photos).

## Theme and motion

Espresso `#221c19`, saffron `#f4a900`, gelato white `#faf8f4`; Instrument Serif + Manrope.
Motion follows Emil Kowalski's rules (<https://github.com/emilkowalski/skills>): `transform`/`opacity`/`clip-path` only,
strong ease-out, non-uniform stagger, hover gated by `(hover:hover)`, press feedback, `prefers-reduced-motion` respected.

## To confirm before launch

- Rights to use Cognivra's logo, photography and the brands' photos and logos.
- Claims such as Halal/SFDA readiness are quoted from the source pages; verify with the brands.
- The contact form opens the visitor's email app addressed to info@cognivra.net (no server).
- Karuna Chocolates is counted on the source page but has no profile card, so it is not listed.
