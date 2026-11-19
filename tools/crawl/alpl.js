/* ALPL sparkling: the site shows three drinks. Only "Golden Times Alcohol Free" is taken, because it is the product the
   Cognivra Food & Beverage page lists (the other two are 8% ABV and are not part of that range). */
const L = require('./lib');
const OUT = process.argv[2];
const ORIGIN = 'https://www.alplsparkling.com';
(async () => {
  const { browser, page } = await L.open();
  await L.go(page, ORIGIN + '/en', 4000); await L.scrollAll(page);
  const paras = await page.evaluate(() => [...document.querySelectorAll('p')].map(p => p.innerText.replace(/\s+/g, ' ').trim()));
  const p1 = paras.find(t => t.startsWith('Alcohol-free natural sparkling')) || '';
  const p2 = paras.find(t => t.startsWith('Let yourself be enveloped')) || '';
  const items = [{ n: 'Golden Times Alcohol Free', g: 'Sparkling 0.0%', d: (p1 + ' ' + p2).trim(), img: ORIGIN + '/wp-content/uploads/2025/01/bottle-gold-free.webp', u: ORIGIN + '/en' }];
  L.save(OUT, 'alpl', ORIGIN + '/en', items); await browser.close();
})();
