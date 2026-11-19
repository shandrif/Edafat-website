/* Rieper (flour mill): English consumer catalogue. The full list has one card per flour (name + size + hidden "Details" link + pack photo);
   product families come from the category pages. The image URL contains the size (270cX270c); the same path serves a larger crop. */
const L = require('./lib');
const OUT = process.argv[2];
const ORIGIN = 'https://www.rieper.com';
const BASE = ORIGIN + '/en/flour-for-home/products/';
const CATS = [['classic-flours', 'Classic flours'], ['specialty-flours', 'Specialty flours'], ['vitagran', 'Vitagran'], ['pizza-flours', 'Pizza flours'], ['bread-mixes', 'Bread mixes'],
  ['maismehle-polenta', 'Polenta'], ['semolina', 'Semolina'], ['biomehle', 'Organic flours'], ['molino-zenorini', 'Molino Zenorini']];
const readCards = page => page.evaluate(() => [...document.querySelectorAll('.f_product-item')].map(c => {
  const im = c.querySelector('img'); const a = [...c.querySelectorAll('a')].find(x => /detail/i.test(x.innerText)) || c.querySelector('a');
  return { n: (c.innerText || '').trim().split('\n')[0].trim(), size: (c.innerText.match(/\d+\s?(g|kg)\b/i) || [])[0], u: a && a.href, img: im && (im.currentSrc || im.src) };
}));
const loadAll = async page => { let last = -1; for (let k = 0; k < 12; k++) { await page.evaluate(() => { const b = [...document.querySelectorAll('button,a')].find(x => /load more|show more|more products|weitere/i.test(x.innerText || '')); if (b) b.click(); window.scrollTo(0, document.body.scrollHeight); }); await page.waitForTimeout(1200); const n = await page.locator('.f_product-item').count(); if (n === last) break; last = n; } };
(async () => {
  const { browser, page } = await L.open();
  const group = new Map();
  for (const [slug, label] of CATS) {
    await L.go(page, BASE + slug, 2500); await loadAll(page);
    const cs = await readCards(page); cs.forEach(c => { if (!group.has(c.n)) group.set(c.n, label); }); console.log(' ', label, cs.length);
  }
  await L.go(page, BASE + 'all-flours', 2500); await loadAll(page);
  const all = await readCards(page); console.log('  all-flours', all.length);
  const items = [], seen = new Set();
  for (const c of all) {
    const key = c.n + '|' + c.size; if (!c.n || seen.has(key)) continue; seen.add(key);
    let d = '';
    if (c.u && /^https?:/.test(c.u) && !/all-flours$/.test(c.u)) { const r = await L.productPage(page, c.u, { wait: 900 }); if (r) d = r.d; }
    items.push({ n: c.n.toLowerCase().replace(/(^|\s)\S/g, s => s.toUpperCase()), g: group.get(c.n) || 'Flours', d: (d || '').slice(0, 380) + (c.size ? ` Pack: ${c.size}.` : ''), img: (c.img || '').replace(/\/\d+cX\d+c\//, '/800cX800c/'), u: c.u || BASE + 'all-flours' });
  }
  L.save(OUT, 'rieper', BASE + 'all-flours', items); await browser.close();
})();
