/* Mamis Caffè (Shopify): beans, ESE pods, drinking chocolate, frappè. Cups/merchandise are skipped. */
const { crawlShopify } = require('./shopify');
crawlShopify({
  slug: 'mamis-caffe', home: 'https://www.mamiscaffe-international.com/en', base: '/en',
  group: p => { const t = (p.title + ' ' + p.handle + ' ' + (p.product_type || '')).toLowerCase();
    if (/tasse|cup|becher|glas|gift|geschenk|abo\b|subscription|merch|gutschein|voucher|machine|maschine|zubehör|accessor/.test(t)) return null;
    if (/\bese\b|pads?\b/.test(t)) return 'ESE pods';
    if (/trink|drinking|cacao|kakao|chocolate|schokolade/.test(t)) return 'Drinking chocolate';
    if (/frapp/.test(t)) return 'Frappè';
    if (/bohnen|beans|espresso|caff|kaffee|coffee|crema|riserva|amabile|dolce|deca/.test(t)) return 'Espresso beans';
    return null; },
  clean: t => t.replace(/^Mamis Caff[èe]\s*/i, '').split(/\s[–—-]\s/)[0],
});
