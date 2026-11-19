/* Fetch the Food & Beverage partner brands from cognivra.net with a real browser (Playwright),
   write data/cognivra.json and download each brand's photo + logo into a raw folder.
   Usage:  node tools/fetch_cognivra.js <raw-output-dir>
   Then:   python3 -I tools/build_brands.py <raw-output-dir>        (optimises images, writes js/data.js)  */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const URL_ = 'https://cognivra.net/food-beverage-buildtrade/';
const OUT = process.argv[2];
if (!OUT) { console.error('usage: node tools/fetch_cognivra.js <raw-output-dir>'); process.exit(1); }
fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL_, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
  await p.waitForTimeout(1500);

  const page = await p.evaluate(() => {
    const txt = e => e.innerText.split('\n').map(s => s.trim()).filter(Boolean);
    const hs = [...document.querySelectorAll('h3')];
    const cards = [...document.querySelectorAll('.cg-card')].map(c => {
      let cat = ''; for (const h of hs) if (h.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) cat = h.textContent.trim();
      const imgs = [...c.querySelectorAll('img')].map(i => i.currentSrc || i.src);
      const link = [...c.querySelectorAll('a[href]')].map(a => a.href).find(h => !h.includes('cognivra.net'));
      return { category: cat, lines: txt(c), photo: imgs[0], logo: imgs[1], url: link };
    });
    const demand = hs.find(h => /Key demand/.test(h.textContent));
    const sectors = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /companies?$/.test(e.textContent.trim())).map(e => e.parentElement.innerText.replace(/\n+/g, ' | '));
    return { cards, demand: demand ? txt(demand.parentElement) : [], sectors: [...new Set(sectors)] };
  });

  // download images through the same browser session
  const files = {};
  for (const c of page.cards) for (const u of [c.photo, c.logo]) {
    if (!u || files[u]) continue;
    // fetch inside the page (same origin, goes through the browser's network path)
    const b64 = await p.evaluate(async u => { const r = await fetch(u); if (!r.ok) return null; const buf = new Uint8Array(await r.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode(...buf.subarray(i, i + 8192)); return btoa(s); }, u);
    if (!b64) { console.log('skip', u); continue; }
    const name = decodeURIComponent(u.split('/').pop()).replace(/[^A-Za-z0-9._-]+/g, '_');
    fs.writeFileSync(path.join(OUT, 'img', name), Buffer.from(b64, 'base64')); files[u] = name;
  }
  page.files = files; page.source = URL_; page.fetchedAt = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'cognivra.json'), JSON.stringify(page, null, 1));
  console.log('brands:', page.cards.length, ' images:', Object.keys(files).length);
  await b.close();
})();
