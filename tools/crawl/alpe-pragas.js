/* Alpe Pragas (Shopify store): the full catalogue comes from the public /products.json endpoint.
   Groups are derived from the product names; gift bags/boxes/wrapping are skipped; sizes of one product are merged. */
const L = require('./lib');
const OUT = process.argv[2];
const SIZE = /\s*\b\d+([.,]\d+)?\s?(g|kg|ml|l|cl)\b\.?/ig;
const group = t => {
  if (/gift|box|kit\b|wrapping|bag\b|ribbon|basket|hamper|card|packag/i.test(t)) return null;
  if (/chutney|mustard|senape/i.test(t)) return 'Chutneys';
  if (/in syrup/i.test(t)) return 'Fruits in syrup';
  if (/nectar/i.test(t)) return 'Organic fruit nectars';
  if (/smoothie/i.test(t)) return 'Organic smoothies';
  if (/pur[ée]e/i.test(t)) return 'Fruit purée';
  if (/syrup|sirup/i.test(t)) return 'Fruit syrups';
  if (/preserve|spread|jam|marmalade|compote|honey|chocolate/i.test(t)) return 'Fruit preserves';
  return null;
};
(async () => {
  const { browser, page } = await L.open();
  await L.go(page, 'https://www.alpepragas.com/en', 1500);
  const prods = await page.evaluate(async () => { const out = []; for (let pg = 1; pg < 6; pg++) { const r = await fetch(`/en/products.json?limit=250&page=${pg}`); if (!r.ok) break; const j = await r.json(); if (!j.products.length) break; out.push(...j.products); } return out; });
  const byBase = new Map();
  for (const p of prods) {
    const g = group(p.title); if (!g || !p.images.length) continue;
    const base = p.title.replace(SIZE, '').replace(/\s+/g, ' ').trim();
    const size = (p.title.match(SIZE) || []).map(s => s.trim()).join(' ');
    const cur = byBase.get(base);
    if (cur) { if (size && !cur.sizes.includes(size)) cur.sizes.push(size); continue; }
    byBase.set(base, { n: base, g, d: L.text(p.body_html).slice(0, 380), img: p.images[0].src.replace(/\?.*$/, '') + '?width=800', u: `https://www.alpepragas.com/en/products/${p.handle}`, sizes: size ? [size] : [] });
  }
  const items = [...byBase.values()].map(i => ({ ...i, d: (i.d + (i.sizes.length ? ` Sizes: ${i.sizes.join(', ')}.` : '')).trim(), sizes: undefined }));
  const counts = {}; items.forEach(i => counts[i.g] = (counts[i.g] || 0) + 1); console.log(JSON.stringify(counts));
  L.save(OUT, 'alpe-pragas', 'https://www.alpepragas.com/en', items);
  await browser.close();
})();
