/* Oberhöller (Magento shop, English store view): six category listings with ?p=N pagination, then each product page. */
const L = require('./lib');
const OUT = process.argv[2];
const ORIGIN = 'https://www.oberhoeller.com';
const CATS = [['chocolate', 'Chocolate'], ['spreadable-creams', 'Spreadable creams'], ['dragees', 'Dragées'], ['chocolate-breaks', 'Chocolate breaks'], ['nougat-cubes', 'Nougat cubes'], ['seasonal-products', 'Seasonal products']];
(async () => {
  const { browser, page } = await L.open();
  const found = new Map();
  for (const [slug, label] of CATS) {
    for (let pg = 1; pg < 8; pg++) {
      const r = await L.go(page, `${ORIGIN}/en/products/${slug}${pg > 1 ? '?p=' + pg : ''}`, 2200); if (!r) break;
      await L.scrollAll(page);
      const cards = await page.evaluate(() => [...document.querySelectorAll('.product-item, li.item.product')].map(c => { const a = c.querySelector('a.product-item-link, .product-item-name a, a[href]'); const im = c.querySelector('img'); return a ? { n: a.innerText.trim(), u: a.href, img: im && (im.currentSrc || im.src) } : null; }).filter(Boolean));
      const fresh = cards.filter(c => !found.has(c.u)); fresh.forEach(c => found.set(c.u, { ...c, g: label }));
      console.log(' ', label, 'page', pg, cards.length, 'cards,', fresh.length, 'new'); if (!fresh.length) break;
    }
  }
  const items = [];
  for (const [u, c] of found) {
    const r = await L.productPage(page, u, { wait: 900 }); if (!r) continue;
    const name = (c.n && c.n.length > 2 ? c.n : r.n).replace(/\s+/g, ' ');
    // the marketing text is German even in the English store view; the detail table is English, so use that
    const rows = await page.evaluate(() => [...document.querySelectorAll('table.additional-attributes tr, #product-attribute-specs-table tr')].map(tr => [(tr.querySelector('th') || {}).innerText, (tr.querySelector('td') || {}).innerText]).filter(x => x[0] && x[1]));
    const pick = k => (rows.find(([a]) => a.trim().toLowerCase() === k) || [])[1];
    const parts = [pick('chocolate type') && `${pick('chocolate type')} chocolate`, pick('chocolate') && `${pick('chocolate')} cocoa`, pick('addition') && `Addition: ${pick('addition')}`].filter(Boolean);
    const ing = pick('ingredients'); const d = (parts.join(', ') + (parts.length ? '. ' : '') + (ing ? `Ingredients: ${ing.replace(/\s+/g, ' ')}` : '')).trim();
    items.push({ n: name, g: c.g, d: (d || r.d).slice(0, 380), img: r.img || c.img, u });
  }
  L.save(OUT, 'oberhoeller', ORIGIN + '/en/products', items); await browser.close();
})();
