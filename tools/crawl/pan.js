/* Pan (frozen bakery, wholesale catalogue, German site: no English catalogue exists). Each category is a paginated search result;
   a card = product photo + name + description + article number + carton content. Text stays in the brand's original language. */
const L = require('./lib');
const OUT = process.argv[2];
const ORIGIN = 'https://www.pan.it';
const CATS = [['regionale-spezialitaeten', 'Regional specialities'], ['minis', 'Minis'], ['strudel', 'Strudel'], ['italienische-desserts', 'Italian desserts'], ['basics', 'Basics']];
(async () => {
  const { browser, page } = await L.open({ locale: 'de-DE' });
  const items = [], seen = new Set();
  for (const [slug, label] of CATS) {
    for (let pg = 1; pg < 12; pg++) {
      const url = `${ORIGIN}/de/grosshandel/produkte/${slug}${pg > 1 ? '?tx_kesearch_pi1%5Bpage%5D=' + pg : ''}`;
      const r = await L.go(page, url, 2000); if (!r) break; await L.scrollAll(page);
      const cards = await page.evaluate(() => [...document.querySelectorAll('.product')].map(c => {
        const t = c.querySelector('.text'); const ps = [...(t ? t.querySelectorAll('p') : [])].map(p => p.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean);
        const desc = ps.find(p => !/^Art\.?Nr|^Kartoninhalt/i.test(p) && p.length > 25) || '';
        const carton = (ps.find(p => /^Kartoninhalt/i.test(p)) || '').replace(/^Kartoninhalt\s*/i, '');
        const weight = (c.querySelector('.weight') || {}).innerText;
        const im = c.querySelector('.image img');
        return { n: ((t && t.querySelector('h3')) || {}).innerText, d: desc.replace(/\s*Mehr erfahren\s*$/i, ''), carton, weight: weight && weight.trim(), vegan: !!c.querySelector('.vegan.active'), img: im && im.src, art: (ps.find(p => /^Art\.?Nr/i.test(p)) || '').replace(/^Art\.?Nr\.?\s*/i, '') };
      }));
      const fresh = cards.filter(c => c.n && c.img && !seen.has(c.art + c.n));
      fresh.forEach(c => { seen.add(c.art + c.n); items.push({ n: c.n.trim(), g: label, d: (c.d + (c.carton ? ` Karton: ${c.carton}.` : '') + (c.vegan ? ' Vegan.' : '')).trim().slice(0, 420), img: c.img, u: url }); });
      console.log(' ', label, 'page', pg, cards.length, 'cards,', fresh.length, 'new'); if (!fresh.length) break;
    }
  }
  L.save(OUT, 'pan', ORIGIN + '/de/grosshandel/produkte', items); await browser.close();
})();
