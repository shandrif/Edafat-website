# Arpitim BuildTrade by Cognivra: Food & Beverages

Static website (HTML, CSS, vanilla JS; no build step). The Food & Beverage sector is the whole site.

Pages: `index.html` (hero, brands, what they sell, where we sell, occasions), `brand.html?b=<slug>` (one brand: facts, searchable range, item dialog),
`products.html` (all 317 items, search + brand filter), `contact.html`.

## Where everything comes from (nothing is drawn or generated)

| What | Source |
| --- | --- |
| Company name, logo, favicon, addresses, phone, email, footer | cognivra.net `/buildtrade/`, `/contact-buildtrade/` (`js/content.js`, `img/logo-*.png`) |
| Brand profiles, logos, category photos, "where we sell", "occasions" | cognivra.net `/food-beverage-buildtrade/` (`tools/fetch_cognivra.js`, `tools/build_brands.py`) |
| **Every item: name, text, photo** | the brand's own website (`tools/crawl/<brand>.js`, then `tools/crawl/download.js`, then `tools/build_items.py`) |

| Brand | Items | Item source |
| --- | --- | --- |
| Alpe Pragas | 87 | alpepragas.com (Shopify catalogue) |
| Mamis Caffè | 29 | mamiscaffe-international.com (Shopify catalogue) |
| Alps Coffee | 27 | alps-coffee.it/en/coffee-shop |
| Alpeker | 14 | yogurteriafrozen.it/en/products (its frozen yogurt site) |
| Pan | 48 | pan.it/de/grosshandel/produkte (German wholesale catalogue) |
| Rieper | 47 | rieper.com/en/flour-for-home |
| VOG Products | 13 | vog-products.it (product portfolio and consumer brands) |
| Oberhöller | 51 | oberhoeller.com/en/products |
| ALPL Sparkling | 1 | alplsparkling.com (Golden Times Alcohol Free) |

```bash
# refresh everything (needs Playwright + Pillow; the brand sites must be reachable)
node tools/fetch_cognivra.js /path/to/raw-cognivra          # brand profiles
python3 -I tools/build_brands.py /path/to/raw-cognivra      # js/data.js (brand level)
for b in alpe-pragas mamis-caffe alps-coffee alpeker pan rieper vog-products oberhoeller alpl; do node tools/crawl/$b.js /path/to/crawl; done
node tools/crawl/download.js /path/to/crawl                 # every item photo
python3 -I tools/build_items.py /path/to/crawl x            # img/items + js/data.js (items)
```

## Theme and motion

Cognivra palette (read from the live site): deep navy `#0c0638`, near-black `#000006`, purple `#3b0c8a`, link blue `#3522e8`, heading navy `#03225c`, light grey `#f2f2f2`.
Type: Poppins (headings), Plus Jakarta Sans (UI), Inter (body).
Motion follows Emil Kowalski's rules (<https://github.com/emilkowalski/skills>): `transform`/`opacity`/`clip-path` only, strong ease-out, non-uniform stagger,
hover gated by `(hover:hover)`, press feedback, `prefers-reduced-motion` respected.

## Known limits / to confirm before launch

- Pan's catalogue is only published in German and Italian, so its item text is German (a note says so on the brand page).
- Rieper's product detail pages are on a separate shop site, so its items show the pack photo, name and pack size only.
- Pan's own photos are small (about 170 px wide), so they look soft when enlarged.
- VOG Products is a B2B processor: its "items" are product lines and consumer brands, with the brand's own photo for each.
- ALPL shows only the alcohol-free drink, because that is what the Cognivra page lists.
- Karuna Chocolates is counted on the Cognivra page but has no profile card, so it is not listed.
- Rights to use the brands' photos and text, and Cognivra's logo, need confirming. Claims like Halal/SFDA readiness are quoted from Cognivra's pages.
- The contact form opens the visitor's email app addressed to info@cognivra.net (no server).
