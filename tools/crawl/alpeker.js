/* Alpeker: the frozen-yogurt range lives on yogurteriafrozen.it/en/products. Each flavour = one photo + one text block; the names
   are in the page's headings/filenames and descriptions are copied from the text blocks (matched by their opening words). */
const L = require('./lib');
const OUT = process.argv[2];
const BASE = 'https://yogurteriafrozen.it';
const U = '/assets/uploads/';
const JARS = [ // name, image file, opening words of the description paragraph
  ['Frozen Yogurt Natural', '2026/03/Scroll-Group-15.png', 'The taste that has won everyone over'],
  ['Frozen Yogurt Forest Fruit', '2026/02/Frutti-di-bosco.png', 'The creaminess of frozen yogurt combines with the sweetness of berries'],
  ['Frozen Natural Kefir', '2026/02/Kefir-Naurale.png', 'Fresh, creamy, and one of a kind'],
  ['Frozen Multifruit Kefir', '2026/02/Kafir-multifrutti.png', 'Creamy, light, and full of energy'],
  ['Frozen Yogurt Raspberry & Chocolate', '2026/02/Lampone.png', 'Deliciously crunchy and fruity freshness'],
  ['Greek Frozen Yogurt Natural', '2026/02/Grecco-Naturale.png', 'The authentic taste of tradition'],
  ['Greek Frozen Yogurt Mango & Passion Fruit', '2026/02/Grecco-Mango.png', 'Exotic, creamy, and irresistible'],
  ['Frozen Yogurt Blueberry', '2026/02/barattolo_fronte_mirtillo-e1771413443707.png', 'Creamy, fragrant, and full of flavor'],
];
const STICKS = [
  ['Frozen Yogurt Stick Natural', '2026/03/alpeker-p21-5pz-frozen-stecco-bianco-e1772703733261.png', 'Unique, creamy, and irresistible'],
  ['Frozen Yogurt Stick Forest Fruit', '2026/03/stecco_fruttidibosco_obliquo_04-e1772703648540.png', 'Creamy frozen yogurt on a stick with a swirl of berries'],
  ['Frozen Yogurt Stick Blueberry Kefir', '2026/03/stecco_mirtillo_obliquo_04-e1772703600372.png', null],
  ['Frozen Yogurt Stick Grapefruit Kefir', '2026/03/stecco_pompelmo_obliquo_04-e1772703342499.png', null],
  ['Frozen Yogurt Stick Mango & Passion Fruit', '2026/03/alpeker-p21-4pz-frozen-stecco-mangopassion-e1772703531812.png', null],
  ['Frozen Yogurt Stick Strawberry', '2026/03/alpeker-p21-4pz-frozen-stecco-fragola-e1772703461917.png', null],
];
(async () => {
  const { browser, page } = await L.open();
  await L.go(page, BASE + '/en/products/', 3000); await L.scrollAll(page);
  const paras = await page.evaluate(() => [...document.querySelectorAll('p')].map(p => p.innerText.replace(/\s+/g, ' ').trim()).filter(t => t.length > 60));
  const sticksIntro = (paras.find(t => t.startsWith('Yogurteria® Frozen Yogurt on a stick')) || '').slice(0, 300);
  const find = start => { const t = paras.find(p => p.startsWith(start)); return t ? t.replace(/\s*Open,? (it,? )?(taste|take).*$/i, '').slice(0, 380) : ''; };
  const items = [
    ...JARS.map(([n, f, s]) => ({ n, g: 'Frozen yogurt tubs', d: find(s), img: BASE + U + f, u: BASE + '/en/products/' })),
    ...STICKS.map(([n, f, s]) => ({ n, g: 'Frozen yogurt sticks', d: (s ? find(s) : '') || sticksIntro, img: BASE + U + f, u: BASE + '/en/products/' })),
  ];
  L.save(OUT, 'alpeker', BASE + '/en/products/', items); await browser.close();
})();
