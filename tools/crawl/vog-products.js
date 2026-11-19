/* VOG Products (B2B fruit processor): the "product portfolio" pages are the product lines, each with its own photo and text;
   the consumer brands (Leni's, Leni's Selection, Marlene, Vinschgau) have their own pages. */
const L = require('./lib');
const OUT = process.argv[2];
const ORIGIN = 'https://www.vog-products.it';
const PAGES = [
  ['/en/product-portfolio/fruit-juice-concentrates', 'Product portfolio'], ['/en/product-portfolio/nfc-fruit-juices', 'Product portfolio'], ['/en/product-portfolio/fruit-puree', 'Product portfolio'],
  ['/en/product-portfolio/fermented-bases-and-apples', 'Product portfolio'], ['/en/product-portfolio/natural-food-flavors', 'Product portfolio'], ['/en/product-portfolio/steamed-fruits', 'Product portfolio'],
  ['/en/product-portfolio/iqf-frozen-fruit', 'Product portfolio'], ['/en/product-portfolio/dried-apples', 'Product portfolio'], ['/en/product-portfolio/fresh-cut-fruits', 'Product portfolio'],
  ['/en/semi-finished-products-food-industry/finished-products/lenis-mele-with-liebe', 'Consumer brands'], ['/en/semi-finished-products-food-industry/finished-products/lenis-selection', 'Consumer brands'],
  ['/en/halbwaren-maerkte-loesungen/fertigprodukte/marlene', 'Consumer brands'], ['/en/halbwaren-maerkte-loesungen/fertigprodukte/valvenosta', 'Consumer brands'],
];
(async () => {
  const { browser, page } = await L.open();
  const items = [];
  for (const [path, group] of PAGES) {
    const r = await L.productPage(page, ORIGIN + path, { wait: 2500 }); if (!r) continue;
    // body copy: the first substantial paragraph in the main content (the meta description is often generic)
    const para = await page.evaluate(() => { const ps = [...document.querySelectorAll('main p, .content p, article p')].map(p => p.innerText.replace(/\s+/g, ' ').trim()).filter(t => t.length > 60 && !/cookie|privacy|©/i.test(t)); return ps[0] || ''; });
    // each page's own hero photo: the first large image that is not the shared site photo / an icon
    const hero = await page.evaluate(() => { const im = [...document.images].filter(i => i.naturalWidth >= 1200 && !/produzione|icon|logo|csm_0[1-9]_/i.test(i.currentSrc || i.src)); return im[0] && (im[0].currentSrc || im[0].src); });
    if (hero) r.img = hero;
    console.log('  ', r.n, '|', (para || r.d).slice(0, 60), '|', r.img.slice(-40));
    items.push({ n: r.n, g: group, d: (para || r.d).slice(0, 380), img: r.img, u: r.u });
  }
  L.save(OUT, 'vog-products', ORIGIN + '/en/product-portfolio/natural-ingredients-for-food', items); await browser.close();
})();
