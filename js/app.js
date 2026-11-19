/* Arpitim BuildTrade by Cognivra: Food & Beverage showcase.
   Renders every page from window.SITE (js/data.js: brands + real items from the brands' own websites) and window.CONTENT (js/content.js).
   Motion: reveal-on-scroll with a decelerating, non-uniform stagger; parallax only for mouse devices. */
const S = window.SITE, C = window.CONTENT, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const page = document.body.dataset.page;
const file = location.pathname.split("/").pop() || "index.html";
const ext = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 10 10 2M4 2h6v6"/></svg>';
const arr = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 9h13M10 3l6 6-6 6"/></svg>';
const bySlug = s => S.brands.find(b => b.slug === s);
const host = u => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nItems = S.brands.reduce((n, b) => n + b.items.length, 0);
const SECTOR = { RETAIL: "Retail", DISTRIBUTION: "Distribution", HORECA: "HoReCa", "FOOD SERVICE": "Food service" };
const NOTES = { pan: "Product names and descriptions are shown in German, as published by the brand." };

/* decelerating, non-uniform stagger (never a metronome); later items arrive with the last step */
const STEPS = [0, .06, .12, .17, .21, .24, .26, .28];
const dly = i => STEPS[Math.min(i, STEPS.length - 1)];
const fit = b => (b.slug === "vog-products" ? "cover" : "contain");

/* product card: real photo from the brand's website; opens the detail dialog */
const pcard = (b, i, d = 0, showBrand = true) => { const it = b.items[i];
  return `<button type="button" class="pc rv ${fit(b)}" data-b="${b.slug}" data-i="${i}" style="--d:${d}s" aria-label="${esc(it.n)}, ${esc(b.name)}: view details">
  <span class="pimg"><img src="${it.img}" alt="${esc(it.n)}" width="${it.size[0]}" height="${it.size[1]}" loading="lazy" decoding="async"></span>
  <span class="pbody">${showBrand ? `<small>${esc(b.name)}</small>` : (it.g ? `<small>${esc(it.g)}</small>` : "")}<span class="pname">${esc(it.n)}</span></span></button>`; };

const brandCard = (b, i) => `<article class="bc rv" style="--d:${dly(i % 3)}s">
  <div class="ph"><img class="p" src="${b.photo}" alt="" width="${b.photoSize[0]}" height="${b.photoSize[1]}" loading="lazy" decoding="async"><span class="cat">${b.tag}</span><img class="lg" src="${b.logo}" alt="" loading="lazy" decoding="async"></div>
  <div class="bd"><h3><a href="brand.html?b=${b.slug}">${b.name}</a></h3><p class="loc">${[b.place, ...b.facts].join(", ")}</p>
   <p class="tx">${b.blurb}</p>
   <div class="thumbs">${b.items.slice(0, 4).map(x => `<span><img src="${x.img}" alt="" loading="lazy" decoding="async"></span>`).join("")}<em>${b.items.length} items</em></div>
   <div class="ft"><span class="go">View range ${arr}</span><a class="visit" href="${b.url}" target="_blank" rel="noopener" aria-label="Visit ${b.name} website (opens in a new tab)">Visit site ${ext}</a></div></div></article>`;

/* ---------- chrome (header + footer follow the source site) ---------- */
const links = [["index.html#brands", "Brands", "brand"], ["products.html", "All items", "products"], ["index.html#formats", "Where we sell", ""], ["contact.html", "Contact", "contact"]];
$("#hdr").className = "hdr";
$("#hdr").innerHTML = `<a class="logo" href="index.html" aria-label="${C.full}, home"><img src="img/logo-white.png" alt="${C.full}"></a>
 <button class="burger" aria-label="Menu" aria-expanded="false"></button>
 <nav>${links.map(([h, t, p]) => `<a href="${h}" class="${p && p === page ? "on" : ""}">${t}</a>`).join("")}<a href="${C.parent}" target="_blank" rel="noopener" class="ext" style="display:inline-flex;align-items:center;gap:6px">Cognivra ${ext}</a></nav>`;
const ad = a => `<p>${a.line}<br>${a.country}<br>SPL Short Code: ${a.spl}</p>`;
$("#ftr").className = "ftr";
$("#ftr").innerHTML = `<div class="fgrid bt"><div><a class="logo" href="index.html" aria-label="${C.full}, home"><img src="img/logo-white.png" alt="${C.full}"></a>
 <p style="max-width:32ch;margin-top:16px">${C.fb.title}: ${C.fb.tagline}.</p></div>
 <div><h4>Menu</h4><a href="index.html#brands">Brands</a><a href="products.html">All items</a><a href="index.html#formats">Where we sell</a><a href="contact.html">Contact</a><a class="ext" href="${C.parent}" target="_blank" rel="noopener">Cognivra ${ext}</a></div>
 <div class="addr-f"><h4>${C.contact.postal.label}</h4>${ad(C.contact.postal)}<h4>${C.contact.office.label}</h4>${ad(C.contact.office)}</div>
 <div><h4>Phone</h4><a href="tel:${C.contact.phone.replace(/\s/g, "")}">${C.contact.phone}</a><h4 style="margin-top:18px">Email</h4><a href="mailto:${C.contact.email}">${C.contact.email}</a></div></div>
 <div class="legal"><span>${C.copyright}</span><span>Brand details, photographs and product information are taken from each brand's own website and belong to the respective owners. Brand profiles compiled from <a href="${S.source}" target="_blank" rel="noopener" style="display:inline;padding:0;text-decoration:underline">cognivra.net</a>.</span></div>`;
const hdr = $("#hdr"), nav = $("#hdr nav"), burger = $(".burger");
const setMenu = o => { nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); hdr.classList.toggle("menu", o); document.documentElement.style.overflow = o ? "hidden" : ""; };
burger.onclick = () => setMenu(!nav.classList.contains("open"));
$$("#hdr nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 1100) setMenu(false); });

/* ---------- item detail dialog ---------- */
const dlg = document.createElement("dialog"); dlg.className = "dlg"; dlg.setAttribute("aria-label", "Item details"); document.body.appendChild(dlg);
let lastFocus = null;
const openItem = (slug, i) => { const b = bySlug(slug), it = b.items[i]; lastFocus = document.activeElement;
  dlg.innerHTML = `<button class="dx" type="button" aria-label="Close">&times;</button>
   <div class="dimg ${fit(b)}"><img src="${it.img}" alt="${esc(it.n)}"></div>
   <div class="dtx"><img class="dlg-logo" src="${b.logo}" alt="${esc(b.name)}"><p class="dg">${esc([b.name, it.g].filter(Boolean).join(" · "))}</p><h3>${esc(it.n)}</h3>
    ${it.d ? `<p class="dd">${esc(it.d)}</p>` : ""}${NOTES[b.slug] ? `<p class="dn">${NOTES[b.slug]}</p>` : ""}
    <div class="dact"><a class="btn gold" href="${it.u}" target="_blank" rel="noopener">View on ${host(it.u)} ${ext}</a><a class="btn light" href="brand.html?b=${b.slug}">More from ${esc(b.name)}</a></div></div>`;
  dlg.showModal(); document.documentElement.style.overflow = "hidden"; };
dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest(".dx")) dlg.close(); });
dlg.addEventListener("close", () => { document.documentElement.style.overflow = nav.classList.contains("open") ? "hidden" : ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); });
document.addEventListener("click", e => { const c = e.target.closest(".pc"); if (c) openItem(c.dataset.b, +c.dataset.i); });

/* ---------- reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08, rootMargin: "0px 0px -4% 0px" });
const observe = () => $$(".rv:not(.in)").forEach(el => io.observe(el));
/* paged grid: render PAGE items, then a "Show more" button */
const PAGE = 36;
const pagedGrid = (grid, more, list, render) => { let shown = 0;
  const add = () => { const next = list.slice(shown, shown + PAGE); grid.insertAdjacentHTML("beforeend", next.map((x, i) => render(x, i)).join("")); shown += next.length; more.hidden = shown >= list.length; more.textContent = `Show more (${list.length - shown} left)`; observe(); };
  grid.innerHTML = ""; more.onclick = add; add(); };

/* ---------- pages ---------- */
if (page === "home") {
  const pick = (s, d) => { const b = bySlug(s); return `<a class="fr" href="brand.html?b=${b.slug}" style="--d:${d}s"><img src="${b.photo}" alt="" width="${b.photoSize[0]}" height="${b.photoSize[1]}" ${d === .15 ? 'fetchpriority="high"' : ""} decoding="async"><b>${b.name}</b></a>`; };
  $("#mosaic").innerHTML = `<div data-par="-.05">${pick("alpe-pragas", .15)}${pick("alpeker", .36)}</div><div class="col2" data-par=".06">${pick("alps-coffee", .28)}${pick("pan", .44)}</div>`;
  const cats = S.categories.filter(c => S.brands.some(b => b.category === c));
  $("#hmeta").textContent = `${S.brands.length} partner brands across ${cats.length} categories, ${nItems} items to explore.`;
  $("#logos").innerHTML = `<div>${[0, 1].map(k => S.brands.map(b => `<img src="${b.logo}" alt="${k ? "" : b.name}" loading="lazy" decoding="async">`).join("")).join("")}</div>`;
  $("#sectors").innerHTML = `<small>Built for</small>` + S.sectors.map(s => `<span class="tag">${SECTOR[s] || s}</span>`).join("");
  const chips = $("#chips"); let cur = "all";
  chips.innerHTML = `<button class="chip on" data-c="all">All brands</button>` + cats.map(c => `<button class="chip" data-c="${c}">${c}</button>`).join("");
  const grid = $("#bgrid");
  const draw = () => { const l = S.brands.filter(b => cur === "all" || b.category === cur); grid.innerHTML = l.map(brandCard).join(""); observe(); };
  chips.onclick = e => { const c = e.target.closest(".chip"); if (!c || c.dataset.c === cur) return; cur = c.dataset.c; $$(".chip", chips).forEach(x => x.classList.toggle("on", x === c)); draw(); };
  draw();
  // "what they sell": two items per brand, all real photos
  $("#track").innerHTML = S.brands.flatMap(b => [0, Math.min(5, b.items.length - 1)].filter((v, k, a) => a.indexOf(v) === k).map(i => [b, i])).map(([b, i], k) => pcard(b, i, dly(k % 6))).join("");
  const t = $("#track"); let down = false, sx, sl;
  t.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = t.scrollLeft; t.classList.add("drag"); });
  addEventListener("pointerup", () => { down = false; t.classList.remove("drag"); });
  addEventListener("pointermove", e => { if (down) t.scrollLeft = sl - (e.clientX - sx); });
  t.addEventListener("dragstart", e => e.preventDefault());
  $("#fmtTitle").textContent = C.fb.formats.title; $("#fmtIntro").textContent = C.fb.formats.intro;
  $("#fmts").innerHTML = C.fb.formats.items.map((f, i) => `<article class="fmt rv ${f.next ? "next" : ""}" style="--d:${dly(i)}s"><span class="n">${i + 1}</span>
    <div><h3>${f.t}</h3><p class="sub">${f.sub}</p>${f.next ? '<span class="soon">Coming next</span>' : ""}</div>
    <div><small>Who we approach</small><p>${f.who}</p></div><div><small>Lead products</small><p>${f.lead}</p></div><div><small>How we work</small><p>${f.how}</p></div></article>`).join("");
  $("#occTitle").textContent = C.fb.occasions.title; $("#occIntro").textContent = C.fb.occasions.intro;
  $("#occs").innerHTML = C.fb.occasions.items.map((o, i) => `<article class="occ rv" style="--d:${dly(i % 3)}s"><span class="n">${i + 1}</span><h3>${o.t}</h3>
    <div><small>The moment</small><p>${o.moment}</p></div><div><small>Products</small><p>${o.products}</p></div></article>`).join("");
}

if (page === "brand") {
  const b = bySlug(new URLSearchParams(location.search).get("b")) || S.brands[0];
  document.title = `${b.name} | ${C.full}`;
  $("#bh").innerHTML = `<div><div class="crumb"><a href="index.html#brands">Food &amp; Beverage</a> / ${b.name}</div>
    <img class="lg" src="${b.logo}" alt="${b.name} logo"><h1>${b.name}</h1>
    <div class="tags"><span class="tag">${b.tag}</span><span class="tag">${b.place}</span>${b.facts.map(f => `<span class="tag">${f}</span>`).join("")}</div>
    <p class="bl">${b.blurb}</p>
    <div class="acts"><a class="btn gold" href="${b.url}" target="_blank" rel="noopener">Visit ${host(b.url)} ${ext}</a><a class="btn line" href="#range">See the range</a></div></div>
    <div class="bph"><img src="${b.photo}" alt="${b.name}: ${b.tag}" width="${b.photoSize[0]}" height="${b.photoSize[1]}" fetchpriority="high"></div>`;
  const factList = [["Category", b.category], ["Based in", b.place]];
  b.facts.forEach(f => { const m = f.match(/^since (\d{4})$/i); factList.push(m ? ["Since", m[1]] : /^by /i.test(f) ? ["Part of", f.replace(/^by /i, "")] : ["Certification", f]); });
  factList.push(["Range", `${b.items.length} ${b.items.length === 1 ? "item" : "items"}`]);
  $("#facts").innerHTML = factList.slice(0, 4).map(([k, v]) => `<div class="fact"><small>${k}</small><b>${v}</b></div>`).join("");
  $("#rangeTitle").textContent = b.items.length === 1 ? "The flagship" : "The range";
  $("#rangeNote").innerHTML = `${NOTES[b.slug] ? NOTES[b.slug] + " " : ""}Photos and details come from <a class="link" style="padding-top:0" href="${b.itemSource}" target="_blank" rel="noopener">${host(b.itemSource)} ${ext}</a>`;
  const q = $("#q"), chips = $("#chips"), grid = $("#grid"), more = $("#more-btn"), count = $("#count"); let cur = "all";
  if (b.items.length < 8) { $(".tools").hidden = true; chips.hidden = true; } else if (b.groups.length < 2) chips.hidden = true;
  chips.innerHTML = `<button class="chip on" data-g="all">All</button>` + b.groups.map(g => `<button class="chip" data-g="${esc(g)}">${esc(g)}</button>`).join("");
  const draw = () => { const t = q.value.trim().toLowerCase(); const idx = b.items.map((x, i) => i).filter(i => (cur === "all" || b.items[i].g === cur) && (b.items[i].n + " " + b.items[i].d).toLowerCase().includes(t));
    count.textContent = `${idx.length} ${idx.length === 1 ? "item" : "items"}`; $(".empty").style.display = idx.length ? "none" : "block";
    pagedGrid(grid, more, idx, (i, k) => pcard(b, i, dly(k % 6), false)); };
  chips.onclick = e => { const c = e.target.closest(".chip"); if (!c) return; cur = c.dataset.g; $$(".chip", chips).forEach(x => x.classList.toggle("on", x === c)); c.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); draw(); };
  q.oninput = draw; draw();
  $("#bandTitle").textContent = `Interested in ${b.name}?`; $("#bandBtn").href = "contact.html"; $("#bandBtn").textContent = "Get in touch";
  const sameCat = S.brands.filter(x => x !== b && x.category === b.category);
  const i0 = S.brands.indexOf(b), ordered = [...S.brands.slice(i0 + 1), ...S.brands.slice(0, i0)].filter(x => !sameCat.includes(x));
  const others = [...sameCat, ...ordered].slice(0, 3);
  $("#moreTitle").textContent = sameCat.length ? `More in ${b.category.toLowerCase()} and beyond` : "More brands";
  $("#more").innerHTML = others.map((x, i) => `<a class="mini rv" href="brand.html?b=${x.slug}" style="--d:${dly(i)}s"><img class="p" src="${x.photo}" alt="" loading="lazy" decoding="async"><small>${x.tag}</small><h3>${x.name}</h3></a>`).join("");
  const sc = $("#sc"); sc.innerHTML = `<span>${b.name}</span><a class="btn gold" href="${b.url}" target="_blank" rel="noopener">Visit site ${ext}</a>`;
  new IntersectionObserver(([e]) => sc.classList.toggle("show", !e.isIntersecting), { threshold: 0 }).observe($(".phead"));
}

if (page === "products") {
  const q = $("#q"), chips = $("#chips"), grid = $("#grid"), more = $("#more-btn"), count = $("#count"); let cur = "all";
  chips.innerHTML = `<button class="chip on" data-b="all">All brands</button>` + S.brands.map(b => `<button class="chip" data-b="${b.slug}">${b.name} <span>${b.items.length}</span></button>`).join("");
  const draw = () => { const t = q.value.trim().toLowerCase();
    const l = S.brands.filter(b => cur === "all" || b.slug === cur).flatMap(b => b.items.map((x, i) => [b, i])).filter(([b, i]) => (b.items[i].n + " " + b.name + " " + b.items[i].g + " " + b.items[i].d).toLowerCase().includes(t));
    count.textContent = `${l.length} ${l.length === 1 ? "item" : "items"}`; $(".empty").style.display = l.length ? "none" : "block";
    pagedGrid(grid, more, l, ([b, i], k) => pcard(b, i, dly(k % 6))); };
  chips.onclick = e => { const c = e.target.closest(".chip"); if (!c) return; cur = c.dataset.b; $$(".chip", chips).forEach(x => x.classList.toggle("on", x === c)); c.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); draw(); };
  q.oninput = draw; draw();
}

if (page === "contact") {
  const k = C.contact;
  $("#cTitle").textContent = k.title; $("#cTag").textContent = k.tagline;
  $("#cDetails").innerHTML = `<div><h3>Email</h3><p><a href="mailto:${k.email}">${k.email}</a></p></div><div><h3>Phone</h3><p><a href="tel:${k.phone.replace(/\s/g, "")}">${k.phone}</a></p></div>
    <div class="addr"><div><h3>${k.postal.label}</h3>${ad(k.postal)}</div><div><h3>${k.office.label}</h3>${ad(k.office)}</div></div>`;
  const f = $("#cform"), msg = $("textarea", f), cnt = $("#fcount"); msg.maxLength = k.form.max; cnt.textContent = `0 / ${k.form.max}`;
  msg.addEventListener("input", () => { cnt.textContent = `${msg.value.length} / ${k.form.max}`; });
  f.onsubmit = e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f));
    const body = Object.entries(d).map(([n, v]) => `${n}: ${v}`).join("\n");
    location.href = `mailto:${k.email}?subject=${encodeURIComponent("Enquiry from " + d["Full Name"] + (d["Company Name"] ? ", " + d["Company Name"] : ""))}&body=${encodeURIComponent(body)}`; };
}

/* ---------- scroll: header, parallax (mouse devices only), statement ---------- */
const stmt = $("#stmt");
if (stmt) { stmt.textContent = S.context; stmt.innerHTML = stmt.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" "); }
const words = $$("#stmt .w"), pars = $$("[data-par]");
const parOK = matchMedia("(min-width: 901px) and (hover: hover) and (prefers-reduced-motion: no-preference)"); let lastN = 0, ticking = false;
const tick = () => { ticking = false; const vh = innerHeight;
  hdr.classList.toggle("solid", scrollY > 60);
  if (parOK.matches) pars.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
    el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * -el.dataset.par).toFixed(1)}px,0)`; });
  if (words.length) { const r = stmt.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (vh * .78 - r.top) / (r.height + vh * .18)));
    const n = Math.round(p * words.length); if (n !== lastN) { for (let i = Math.min(n, lastN); i < Math.max(n, lastN); i++) words[i].classList.toggle("on", i < n); lastN = n; } } };
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); tick(); observe();
