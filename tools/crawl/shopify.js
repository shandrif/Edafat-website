/* Generic Shopify catalogue crawler (public /products.json): crawlShopify({ slug, home, base, group, clean, imgWidth })
   - group(product) -> group name, or null to skip (gift bags, merchandise ...)
   - clean(title)   -> display name (default: drop sizes, keep text before " – ")
   Sizes of the same product are merged into one item. */
const L = require('./lib');
const SIZE = /\s*\b\d+([.,]\d+)?\s?(g|kg|ml|l|cl|pads?|pcs|capsules?|x)\b\.?/ig;
exports.crawlShopify = async cfg => {
  const OUT = process.argv[2];
  const { browser, page } = await L.open({ locale: cfg.locale || 'en-US' });
  await L.go(page, cfg.home, 1500);
  const prods = await page.evaluate(async base => { const out = []; for (let pg = 1; pg < 8; pg++) { const r = await fetch(`${base}/products.json?limit=250&page=${pg}`); if (!r.ok) break; const j = await r.json(); if (!j.products.length) break; out.push(...j.products); } return out; }, cfg.base);
  console.log(`  ${prods.length} products in catalogue`);
  const clean = cfg.clean || (t => t.split(/\s[–—-]\s/)[0]);
  const byBase = new Map();
  for (const p of prods) {
    const g = cfg.group(p); if (!g || !p.images.length) continue;
    const name = clean(p.title).replace(SIZE, '').replace(/\s+/g, ' ').trim(); if (!name) continue;
    const size = (p.title.match(SIZE) || []).map(s => s.trim()).join(' ');
    const key = g + '|' + name.toLowerCase(); const cur = byBase.get(key);
    if (cur) { if (size && !cur.sizes.includes(size)) cur.sizes.push(size); continue; }
    byBase.set(key, { n: name, g, d: L.text(p.body_html).slice(0, cfg.descLen || 380), img: p.images[0].src.replace(/\?.*$/, '') + `?width=${cfg.imgWidth || 800}`, u: `${new URL(cfg.home).origin}${cfg.base}/products/${p.handle}`, sizes: size ? [size] : [] });
  }
  const items = [...byBase.values()].map(i => ({ n: i.n, g: i.g, d: (i.d + (i.sizes.length ? ` Sizes: ${i.sizes.join(', ')}.` : '')).trim(), img: i.img, u: i.u }));
  const counts = {}; items.forEach(i => counts[i.g] = (counts[i.g] || 0) + 1); console.log('  ' + JSON.stringify(counts));
  L.save(OUT, cfg.slug, cfg.home, items); await browser.close();
};
