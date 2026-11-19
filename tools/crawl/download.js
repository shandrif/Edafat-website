/* Download every item image listed in <raw>/*.json (written by the per-brand crawlers) into <raw>/img/<slug>/<n>.<ext>.
   Images are fetched through the browser (same network path as the crawl), with the product page as referrer.
   Usage: node tools/crawl/download.js <raw-dir>    ->  adds "file" to each item in the json files */
const L = require('./lib');
const fs = require('fs'), path = require('path');
const RAW = process.argv[2];
(async () => {
  const { browser, ctx } = await L.open();
  const jobs = [];
  for (const f of fs.readdirSync(RAW).filter(f => f.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(RAW, f))); fs.mkdirSync(path.join(RAW, 'img', j.slug), { recursive: true });
    j.items.forEach((it, i) => jobs.push({ j, f, it, i }));
  }
  console.log('images to download:', jobs.length);
  let done = 0, failed = 0, next = 0;
  const worker = async () => {
    const page = await ctx.newPage();
    while (next < jobs.length) {
      const { j, it, i } = jobs[next++];
      try {
        const r = await page.goto(it.img, { waitUntil: 'load', timeout: 45000, referer: it.u });
        const ct = (r.headers()['content-type'] || ''); const body = await r.body();
        if (!r.ok() || !/image/.test(ct) || body.length < 1500) throw new Error(`${r.status()} ${ct} ${body.length}b`);
        const ext = /png/.test(ct) ? 'png' : /webp/.test(ct) ? 'webp' : /gif/.test(ct) ? 'gif' : /svg/.test(ct) ? 'svg' : 'jpg';
        const file = path.join(j.slug, `${String(i).padStart(3, '0')}.${ext}`); fs.writeFileSync(path.join(RAW, 'img', file), body); it.file = file;
      } catch (e) { failed++; it.file = null; console.log(' x', j.slug, it.n.slice(0, 40), e.message.slice(0, 80)); }
      if (++done % 40 === 0) console.log(`  ${done}/${jobs.length}`);
    }
    await page.close();
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  for (const f of fs.readdirSync(RAW).filter(f => f.endsWith('.json'))) { const j = JSON.parse(fs.readFileSync(path.join(RAW, f))); const m = new Map(jobs.filter(x => x.j.slug === j.slug).map(x => [x.i, x.it.file])); j.items.forEach((it, i) => it.file = m.get(i)); fs.writeFileSync(path.join(RAW, f), JSON.stringify(j, null, 1)); }
  console.log(`downloaded ${jobs.length - failed}, failed ${failed}`); await browser.close();
})();
