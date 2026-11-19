/* Shared helpers for the per-brand crawlers (Playwright, real browser).
   Each crawler writes <out>/<slug>.json = { slug, source, items:[{ n, g, d, img, u }] }  (name, group, description, image URL, product page URL)
   tools/crawl/download.js then downloads every image, tools/build_items.py optimises them and writes js/data.js. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

exports.open = async (opts = {}) => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: opts.locale || 'en-US', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  return { browser, ctx, page };
};
exports.go = async (page, url, wait = 2500) => {
  const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => ({ err: e.message }));
  if (r && r.err) { console.log('  ! goto failed', url, r.err.slice(0, 80)); return null; }
  await page.waitForTimeout(wait);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button,a')].find(x => /^(accept all|accept|accetta tutt[oi]?|alle akzeptieren|akzeptieren|allow all|ok)$/i.test((x.innerText || '').trim())); if (b) b.click(); }).catch(() => {});
  return r;
};
exports.scrollAll = page => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 140)); } scrollTo(0, 0); });
exports.text = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
exports.save = (out, slug, source, items) => {
  fs.mkdirSync(out, { recursive: true });
  const seen = new Set(), clean = items.filter(i => i.n && i.img && !seen.has(i.n.toLowerCase() + '|' + i.img) && seen.add(i.n.toLowerCase() + '|' + i.img));
  fs.writeFileSync(path.join(out, slug + '.json'), JSON.stringify({ slug, source, items: clean }, null, 1));
  console.log(`[${slug}] ${clean.length} items with images (of ${items.length})`);
  return clean;
};

/* Visit one product page and read name, description and main image (og:* tags first, then the page). */
exports.productPage = async (page, url, opt = {}) => {
  const r = await exports.go(page, url, opt.wait || 1500); if (!r) return null;
  return page.evaluate(sel => {
    const meta = n => (document.querySelector(`meta[property="${n}"],meta[name="${n}"]`) || {}).content || '';
    const abs = u => { try { return new URL(u, location.href).href; } catch (e) { return ''; } };
    const h1 = (document.querySelector(sel.name || 'h1') || {}).innerText;
    const name = (h1 || meta('og:title') || document.title).replace(/\s+/g, ' ').trim();
    let desc = meta('og:description') || meta('description');
    if (sel.desc) { const e = document.querySelector(sel.desc); if (e && e.innerText.trim().length > 30) desc = e.innerText; }
    let img = sel.img ? ((document.querySelector(sel.img) || {}).currentSrc || (document.querySelector(sel.img) || {}).src) : '';
    if (!img) img = meta('og:image');
    if (!img) { const big = [...document.images].filter(i => i.naturalWidth > 300).sort((a, b) => b.naturalWidth * b.naturalHeight - a.naturalWidth * a.naturalHeight)[0]; img = big && (big.currentSrc || big.src); }
    return { n: name, d: (desc || '').replace(/\s+/g, ' ').trim(), img: abs(img), u: location.href };
  }, opt.sel || {});
};
