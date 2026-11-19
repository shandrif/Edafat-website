/* One-off cleanup of js/data.js item text (also applied by tools/build_items.py for future builds):
   - sizes ("Sizes: 30g.") and pack/carton info become their own fields (s, c)
   - ingredient lists are dropped (the crawl cut them off mid-list; full ingredients are on the brand's site)
   - descriptions end on a complete sentence */
const fs = require('fs'); global.window = {};
const P = process.argv[2] || 'js/data.js'; const src = fs.readFileSync(P, 'utf8'); const head = src.slice(0, src.indexOf('window.SITE'));
eval(src); const S = window.SITE;
const clean = it => {
  let d = it.d || '', s = '', c = '', m;
  if ((m = d.match(/\s*Sizes?:\s*(.*?)\.?\s*$/))) { s = m[1].replace(/\.$/, ''); d = d.slice(0, m.index); }
  if ((m = d.match(/\s*Pack:\s*(.*?)\.?\s*$/))) { s = m[1].replace(/\.$/, ''); d = d.slice(0, m.index); }
  if ((m = d.match(/\s*Karton:\s*(.*?)\.?\s*(Vegan\.)?\s*$/))) { c = m[1].replace(/\.$/, ''); d = d.slice(0, m.index) + (m[2] ? ' ' + m[2] : ''); }
  d = d.replace(/^Produktvideo ansehen\s*\|\s*/i, '').replace(/\s*VEGAN\.\s*(Vegan\.)$/, ' $1');
  d = d.replace(/\s*Ingredients?\s*[-:,]?.*$/i, '').replace(/\s*Zutaten.*$/i, '').trim();
  if (d && !/[.!?)”"]$/.test(d)) { const k = Math.max(d.lastIndexOf('. '), d.lastIndexOf('! '), d.lastIndexOf('? ')); d = k > 40 ? d.slice(0, k + 1) : d.replace(/[\s,;:\-–…]+$/, '') + '…'; }
  it.d = d; if (s) it.s = s; else delete it.s; if (c) it.c = c; else delete it.c; return it;
};
S.brands.forEach(b => b.items.forEach(clean));
// casing fixes from the crawl
const fix = { "Leni'S": "Leni's", "Leni'S Selection": "Leni's Selection", "Nfc Juices": "NFC Juices", "Iqf - Frozen Fruits": "IQF - Frozen Fruits", "Marlene - Tochter Der Alpen": "Marlene - Tochter der Alpen" };
S.brands.forEach(b => b.items.forEach(i => { if (fix[i.n]) i.n = fix[i.n]; }));
fs.writeFileSync(P, head + 'window.SITE = ' + JSON.stringify(S, null, 1) + ';\n');
const n = S.brands.reduce((a, b) => a + b.items.filter(i => i.d).length, 0); console.log('cleaned; items with description:', n);
