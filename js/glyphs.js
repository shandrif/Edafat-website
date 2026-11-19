/* Item illustrations: one consistent line-icon family (64x64, stroke only).
   glyphFor(itemName) picks the closest drawing by keyword; add a rule to GLYPH_RULES for new items. */
(function () {
  const G = {
    jar: '<rect x="18" y="9" width="28" height="9" rx="2.5"/><path d="M21 18v3c-5 3-7 7-7 13v14c0 4 3 7 7 7h22c4 0 7-3 7-7V34c0-6-2-10-7-13v-3"/><rect x="20" y="31" width="24" height="15" rx="2.5"/>',
    leaf: '<path d="M13 51C13 28 27 13 52 12c0 25-14 39-39 39Z"/><path d="M13 51 40 24M30 38h10M24 45h8"/>',
    bottle: '<path d="M27 8h10v11c0 5 9 7 9 15v16c0 4-3 7-7 7H25c-4 0-7-3-7-7V34c0-8 9-10 9-15Z"/><path d="M26 13h12"/><rect x="23" y="34" width="18" height="13" rx="2.5"/>',
    carton: '<path d="M19 21 32 10l13 11v33H19Z"/><path d="M19 21h26M32 10v11"/><path d="M26 34h12M26 42h12"/>',
    berry: '<circle cx="23" cy="41" r="10"/><circle cx="41" cy="41" r="10"/><circle cx="32" cy="26" r="10"/><path d="M32 16c0-5 3-8 8-9M19 38l3-2M37 38l3-2M28 23l3-2"/>',
    bean: '<g transform="rotate(32 32 32)"><ellipse cx="32" cy="32" rx="14" ry="21"/><path d="M32 11c-8 7 8 14 0 21s8 14 0 21"/></g>',
    pod: '<path d="M19 22h26l-4 30H23Z"/><ellipse cx="32" cy="22" rx="13" ry="5"/><path d="M26 34h12M27 43h10"/>',
    cup: '<path d="M16 28h28v9c0 8-6 14-14 14s-14-6-14-14Z"/><path d="M44 31h3a5 5 0 0 1 0 10h-4"/><path d="M12 55h40"/><path d="M25 11c-3 4 3 6 0 11M34 11c-3 4 3 6 0 11"/>',
    bag: '<path d="M17 19h30l4 36H13Z"/><path d="M17 19c0-5 30-5 30 0"/><circle cx="32" cy="38" r="7"/><path d="M29 38h6M32 35v6"/>',
    tub: '<path d="M15 25h34l-4 28H19Z"/><path d="M13 18h38v7H13Z"/><path d="M22 36h20M23 44h18"/>',
    pop: '<rect x="21" y="8" width="22" height="32" rx="11"/><rect x="29" y="40" width="6" height="16" rx="3"/><path d="M21 22h22M27 14v6"/>',
    pastry: '<g transform="rotate(-14 32 32)"><rect x="8" y="22" width="48" height="20" rx="10"/><path d="M20 24l-2 16M30 23l-2 18M40 23l-2 18M49 25l-2 14"/></g>',
    canape: '<rect x="12" y="38" width="40" height="11" rx="3"/><circle cx="23" cy="31" r="5.5"/><circle cx="34" cy="29" r="5.5"/><circle cx="44" cy="32" r="5"/><path d="M46 13l-9 15"/>',
    pizza: '<path d="M9 19C26 8 38 8 55 19L32 57Z"/><path d="M13 24c13-7 25-7 38 0"/><circle cx="26" cy="31" r="3.2"/><circle cx="38" cy="33" r="3.2"/><circle cx="32" cy="44" r="3.2"/>',
    wheat: '<path d="M32 57V12"/><path d="M32 22c-8 0-11-5-11-10 8 0 11 5 11 10ZM32 22c8 0 11-5 11-10-8 0-11 5-11 10ZM32 35c-8 0-11-5-11-10 8 0 11 5 11 10ZM32 35c8 0 11-5 11-10-8 0-11 5-11 10ZM32 48c-8 0-11-5-11-10 8 0 11 5 11 10ZM32 48c8 0 11-5 11-10-8 0-11 5-11 10Z"/>',
    loaf: '<path d="M9 42c0-13 10-20 23-20s23 7 23 20v6H9Z"/><path d="M22 29l5 9M33 27l5 11M44 30l4 8"/>',
    apple: '<path d="M32 22c-6-6-19-4-19 11 0 12 8 22 14 22 2 0 3-1 5-1s3 1 5 1c6 0 14-10 14-22 0-15-13-17-19-11Z"/><path d="M32 22c0-6 2-10 7-12M40 11c4-2 8 0 8 5-4 1-8-1-8-5Z"/>',
    bar: '<g transform="rotate(18 32 32)"><rect x="15" y="8" width="34" height="48" rx="4"/><path d="M15 24h34M15 40h34M32 8v48"/></g>',
    dragee: '<circle cx="21" cy="42" r="11"/><circle cx="43" cy="42" r="11"/><circle cx="32" cy="21" r="11"/><path d="M15 38a7 7 0 0 1 5-5M37 38a7 7 0 0 1 5-5M26 17a7 7 0 0 1 5-4"/>',
    gift: '<rect x="12" y="29" width="40" height="25" rx="2"/><rect x="9" y="20" width="46" height="9" rx="2"/><path d="M32 20v34"/><path d="M32 20c-9-11-17-6-13 0 3 3 13 0 13 0Zm0 0c9-11 17-6 13 0-3 3-13 0-13 0Z"/>',
    globe: '<circle cx="32" cy="32" r="21"/><ellipse cx="32" cy="32" rx="9" ry="21"/><path d="M11 32h42M14 21h36M14 43h36"/>',
    shield: '<path d="M32 8 51 15v15c0 13-8 21-19 26C21 51 13 43 13 30V15Z"/><path d="m23 31 6 6 12-13"/>',
    truck: '<path d="M7 20h31v24H7Z"/><path d="M38 27h10l9 9v8H38Z"/><circle cx="19" cy="47" r="5"/><circle cx="46" cy="47" r="5"/><path d="M14 27h18"/>',
    compass: '<circle cx="32" cy="32" r="22"/><path d="m41 23-5 13-13 5 5-13Z"/><circle cx="32" cy="32" r="1.5"/>',
    puzzle: '<path d="M13 24h12a5 5 0 1 1 10 0h14v13a5 5 0 1 0 0 10v10H36a5 5 0 1 0-10 0H13V47a5 5 0 1 0 0-10Z"/>',
    chart: '<path d="M12 10v42h42"/><rect x="19" y="34" width="8" height="12" rx="1.5"/><rect x="31" y="25" width="8" height="21" rx="1.5"/><rect x="43" y="15" width="8" height="31" rx="1.5"/>',
    flute: '<path d="M23 7h18l-2 27c-1 8-3 11-7 11s-6-3-7-11Z"/><path d="M32 45v10M22 57h20"/><circle cx="30" cy="18" r="1.6"/><circle cx="35" cy="27" r="1.6"/><circle cx="30" cy="33" r="1.6"/>',
  };
  // order matters: first match wins
  const GLYPH_RULES = [
    [/sparkling|alcohol/i, 'flute'],
    [/pod|capsule/i, 'pod'], [/drinking chocolate/i, 'cup'], [/espresso blends/i, 'cup'], [/whole beans|ground coffee/i, 'bag'],
    [/arabica|gran |dolce vita|coffee/i, 'bean'],
    [/organic range|organic flours/i, 'leaf'], [/syrup|concentrate|kefir/i, 'bottle'], [/nectar|juice/i, 'carton'],
    [/pur[ée]es|iqf|berry|berries/i, 'berry'], [/preserve|chutney|spread/i, 'jar'], [/dried apple/i, 'apple'],
    [/yogurt (tub)|greek/i, 'tub'], [/stick/i, 'pop'], [/strudel|pastry/i, 'pastry'], [/canap/i, 'canape'], [/pizza/i, 'pizza'],
    [/wheat|rye|wholemeal|flour/i, 'wheat'], [/polenta/i, 'bag'], [/bread/i, 'loaf'],
    [/bar|nougat/i, 'bar'], [/drag/i, 'dragee'], [/gift/i, 'gift'],
  ];
  window.glyphFor = name => { const r = GLYPH_RULES.find(([re]) => re.test(name)); return (r && r[1]) || 'jar'; };
  window.glyphSVG = (key, cls = '') => `<svg class="gl ${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${G[key] || G.jar}</svg>`;
  window.GLYPH_KEYS = Object.keys(G);
})();
