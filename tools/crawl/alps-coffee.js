/* Alps Coffee (Schreyögg): category pages list the products; each product has its own page (name, text, photo). */
const L = require('./lib');
const OUT = process.argv[2];
const ORIGIN = 'https://www.alps-coffee.it';
const CATS = [['espresso', 'Espresso'], ['for-fully-automatic-coffee-machines', 'Fully automatic machines'], ['filter-coffee', 'Filter coffee'], ['ground-espresso', 'Ground espresso'], ['pods', 'Pods'], ['capsules', 'Capsules']];
(async () => {
  const { browser, page } = await L.open();
  const found = new Map();
  for (const [cat, label] of CATS) {
    await L.go(page, `${ORIGIN}/en/coffee-shop/${cat}/`, 2500); await L.scrollAll(page);
    const links = await page.evaluate(cat => [...new Set([...document.querySelectorAll('a[href]')].map(a => a.pathname).filter(p => new RegExp(`/coffee-shop/${cat}/[^/]+/?$`).test(p)))], cat);
    console.log(' ', label, links.length); links.forEach(l => { if (!found.has(l)) found.set(l, label); });
  }
  const items = [];
  for (const [path, group] of found) {
    const r = await L.productPage(page, ORIGIN + path); if (!r) continue;
    items.push({ n: r.n.replace(/\s+/g, ' '), g: group, d: r.d.slice(0, 380), img: r.img, u: r.u });
  }
  L.save(OUT, 'alps-coffee', ORIGIN + '/en/', items); await browser.close();
})();
