/* Arpitim BuildTrade by Cognivra: renders every page from window.CONTENT (js/content.js) and window.SITE (js/data.js).
   Motion: reveal-on-scroll with a decelerating, non-uniform stagger; parallax only for mouse devices. */
const S = window.SITE, C = window.CONTENT, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const page = document.body.dataset.page, section = document.body.dataset.nav || "";
const file = location.pathname.split("/").pop() || "index.html";
const ext = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 10 10 2M4 2h6v6"/></svg>';
const arr = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 9h13M10 3l6 6-6 6"/></svg>';
const bySlug = s => S.brands.find(b => b.slug === s);
const host = u => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const nItems = S.brands.reduce((n, b) => n + b.items.length, 0);
const SECTOR = { RETAIL: "Retail", DISTRIBUTION: "Distribution", HORECA: "HoReCa", "FOOD SERVICE": "Food service" };

/* decelerating, non-uniform stagger (never a metronome); later items arrive with the last step */
const STEPS = [0, .06, .12, .17, .21, .24, .26, .28];
const dly = i => STEPS[Math.min(i, STEPS.length - 1)];
const tint = b => `--t1:${b.tint[0]};--t2:${b.tint[1]}`;
const icon = g => `<div class="ic">${glyphSVG(g)}</div>`;

const tile = (b, it, i, showBrand = true) => `<a class="it rv" href="brand.html?b=${b.slug}" style="${tint(b)};--d:${dly(i % 6)}s">
  <div class="wm">${glyphSVG(glyphFor(it.n))}</div><div class="art">${glyphSVG(glyphFor(it.n))}</div>
  ${showBrand ? `<small>${b.name}</small>` : ""}<h3>${it.n}</h3></a>`;

const brandCard = (b, i) => `<article class="bc rv" style="--d:${dly(i % 3)}s">
  <div class="ph"><img class="p" src="${b.photo}" alt="" width="${b.photoSize[0]}" height="${b.photoSize[1]}" loading="lazy" decoding="async"><span class="cat">${b.tag}</span><img class="lg" src="${b.logo}" alt="" loading="lazy" decoding="async"></div>
  <div class="bd"><h3><a href="brand.html?b=${b.slug}">${b.name}</a></h3><p class="loc">${[b.place, ...b.facts].join(", ")}</p>
   <p class="tx">${b.blurb}</p>
   <div class="its">${b.items.slice(0, 3).map(x => `<span>${x.n}</span>`).join("")}${b.items.length > 3 ? `<span>+${b.items.length - 3} more</span>` : ""}</div>
   <div class="ft"><span class="go">View range ${arr}</span><a class="visit" href="${b.url}" target="_blank" rel="noopener" aria-label="Visit ${b.name} website (opens in a new tab)">Visit site ${ext}</a></div></div></article>`;

/* ---------- chrome (header + footer follow the source site: Services, Sector, Why Us, Contact, Cognivra) ---------- */
const links = [["services.html", "Services"], ["food-beverage.html", "Food & Beverage"], ["why-us.html", "Why Us"], ["about.html", "About"]];
$("#hdr").className = "hdr";
$("#hdr").innerHTML = `<a class="logo" href="index.html" aria-label="${C.full}, home"><img class="lw" src="img/logo-white.png" alt="${C.full}"><img class="ld" src="img/logo-dark.png" alt="" aria-hidden="true"></a>
 <button class="burger" aria-label="Menu" aria-expanded="false"></button>
 <nav>${links.map(([h, t]) => `<a href="${h}" class="${h === file || (section === "fb" && h === "food-beverage.html") ? "on" : ""}">${t}</a>`).join("")}<a href="${C.parent}" target="_blank" rel="noopener" class="ext" style="display:inline-flex;align-items:center;gap:6px">Cognivra ${ext}</a><a class="pill" href="contact.html">Contact</a></nav>`;
const ad = a => `<p>${a.line}<br>${a.country}<br>SPL Short Code: ${a.spl}</p>`;
$("#ftr").className = "ftr";
$("#ftr").innerHTML = `<div class="fgrid bt"><div><a class="logo" href="index.html" aria-label="${C.full}, home"><img class="lw" src="img/logo-white.png" alt="${C.full}"></a>
 <p style="max-width:30ch;margin-top:16px">${C.hero.kicker.join(" ")}</p></div>
 <div><h4>Menu</h4><a href="services.html">Services</a><a href="food-beverage.html">Sector</a><a href="why-us.html">Why Us</a><a href="about.html">About</a><a href="contact.html">Contact</a><a class="ext" href="${C.parent}" target="_blank" rel="noopener">Cognivra ${ext}</a></div>
 <div class="addr-f"><h4>${C.contact.postal.label}</h4>${ad(C.contact.postal)}<h4>${C.contact.office.label}</h4>${ad(C.contact.office)}</div>
 <div><h4>Phone</h4><a href="tel:${C.contact.phone.replace(/\s/g, "")}">${C.contact.phone}</a><h4 style="margin-top:18px">Email</h4><a href="mailto:${C.contact.email}">${C.contact.email}</a></div></div>
 <div class="big-logo" aria-hidden="true"><img src="img/logo-white.png" alt=""></div>
 <div class="legal"><span>${C.copyright}</span><span>Food &amp; Beverage brand details are compiled from <a href="${S.source}" target="_blank" rel="noopener" style="display:inline;padding:0;text-decoration:underline">cognivra.net</a>. Brand names, logos and photographs belong to their respective owners.</span></div>`;
const hdr = $("#hdr"), nav = $("#hdr nav"), burger = $(".burger");
const setMenu = o => { nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); hdr.classList.toggle("menu", o); document.documentElement.style.overflow = o ? "hidden" : ""; };
burger.onclick = () => setMenu(!nav.classList.contains("open"));
$$("#hdr nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 1100) setMenu(false); });

/* ---------- reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1, rootMargin: "0px 0px -5% 0px" });
const observe = () => $$(".rv:not(.in)").forEach(el => io.observe(el));
const capCard = (c, i) => `<div class="cap rv" style="--d:${dly(i)}s">${icon(c.g)}<h3>${c.t}</h3><p>${c.p}</p></div>`;
const strip = (el, withBrand = true) => { el.innerHTML = S.brands.flatMap(b => b.items.slice(0, 2).map(it => [b, it])).map(([b, it], i) => tile(b, it, i, withBrand)).join("");
  let down = false, sx, sl;
  el.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = el.scrollLeft; el.classList.add("drag"); });
  addEventListener("pointerup", () => { down = false; el.classList.remove("drag"); });
  addEventListener("pointermove", e => { if (down) el.scrollLeft = sl - (e.clientX - sx); });
  el.addEventListener("dragstart", e => e.preventDefault()); };

/* ---------- pages ---------- */
if (page === "home") {
  $("#kick").innerHTML = C.hero.kicker.map(k => `<span>${k.replace(/\.$/, "")}</span>`).join("");
  $("#h1").innerHTML = C.hero.title.map(l => `<span class="l"><span>${l}</span></span>`).join("");
  $("#lede").textContent = C.hero.text;
  $("#logos").innerHTML = `<div>${[0, 1].map(k => S.brands.map(b => `<img src="${b.logo}" alt="${k ? "" : b.name}" loading="lazy" decoding="async">`).join("")).join("")}</div>`;
  $("#presence").innerHTML = `<h2>${C.presence.title}</h2><p>${C.presence.text}</p>`;
  $("#svc").innerHTML = C.services.items.map((s, i) => `<a class="sv rv" href="services.html" style="--d:${dly(i)}s"><div class="ph"><img src="img/bt/service-${i + 1}.webp" alt="" width="1045" height="730" loading="lazy" decoding="async"></div><div class="bd"><h3>${s.t}</h3><p>${s.p}</p></div></a>`).join("");
  $("#capsTitle").textContent = C.capabilities.title;
  $("#caps").innerHTML = C.capabilities.items.map(capCard).join("");
  $("#sector").innerHTML = `<div class="sp rv"><img src="img/bt/sector-fb.webp" alt="${C.sector.name}" width="875" height="850" loading="lazy" decoding="async"></div>
    <div class="rv" style="--d:.1s"><h2 style="font-size:clamp(1rem,1.2vw,1.1rem);font-family:var(--sans);font-weight:700;color:var(--mute);letter-spacing:0;margin-bottom:12px">${C.sector.title}</h2><h3>${C.sector.name}</h3><h4>${C.sector.head}</h4><p>${C.sector.text}</p>
    <div class="acts"><a class="btn dark" href="food-beverage.html">Explore ${C.sector.name} ${ext}</a></div></div>`;
}

if (page === "fb") {
  // hero mosaic: four brand photos on the logo's slant; the first frame leads, the rest follow with shrinking gaps
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
  $("#fmtTitle").textContent = C.fb.formats.title; $("#fmtIntro").textContent = C.fb.formats.intro;
  $("#fmts").innerHTML = C.fb.formats.items.map((f, i) => `<article class="fmt rv" style="--d:${dly(i)}s"><span class="n">${i + 1}</span>
    <div><h3>${f.t}</h3><p class="sub">${f.sub}</p>${f.next ? '<span class="soon">Coming next</span>' : ""}</div>
    <div><small>Who we approach</small><p>${f.who}</p></div><div><small>Lead products</small><p>${f.lead}</p></div><div><small>How we work</small><p>${f.how}</p></div></article>`).join("");
  $("#occTitle").textContent = C.fb.occasions.title; $("#occIntro").textContent = C.fb.occasions.intro;
  $("#occs").innerHTML = C.fb.occasions.items.map((o, i) => `<article class="occ rv" style="--d:${dly(i % 3)}s"><span class="n">${i + 1}</span><h3>${o.t}</h3>
    <div><small>The moment</small><p>${o.moment}</p></div><div><small>Products</small><p>${o.products}</p></div></article>`).join("");
  strip($("#track"));
}

if (page === "brand") {
  const b = bySlug(new URLSearchParams(location.search).get("b")) || S.brands[0];
  document.title = `${b.name} | ${C.full}`;
  $("#bh").innerHTML = `<div><div class="crumb"><a href="food-beverage.html#brands">Food &amp; Beverage</a> / ${b.name}</div>
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
  $("#rangeNote").innerHTML = (b.note ? `${b.note} ` : "") + `Full catalogue and ordering on <a class="link" style="padding-top:0" href="${b.url}" target="_blank" rel="noopener">${host(b.url)} ${ext}</a>`;
  $("#tiles").innerHTML = b.items.map((it, i) => tile(b, it, i, false)).join("");
  $("#bandTitle").textContent = `Interested in ${b.name}?`;
  $("#bandBtn").href = "contact.html"; $("#bandBtn").textContent = "Get in touch";
  const sameCat = S.brands.filter(x => x !== b && x.category === b.category);
  const i0 = S.brands.indexOf(b), ordered = [...S.brands.slice(i0 + 1), ...S.brands.slice(0, i0)].filter(x => !sameCat.includes(x));
  const more = [...sameCat, ...ordered].slice(0, 3);
  $("#moreTitle").textContent = sameCat.length ? `More in ${b.category.toLowerCase()} and beyond` : "More brands";
  $("#more").innerHTML = more.map((x, i) => `<a class="mini rv" href="brand.html?b=${x.slug}" style="--d:${dly(i)}s"><img class="p" src="${x.photo}" alt="" loading="lazy" decoding="async"><small>${x.tag}</small><h3>${x.name}</h3></a>`).join("");
  const sc = $("#sc"); sc.innerHTML = `<span>${b.name}</span><a class="btn gold" href="${b.url}" target="_blank" rel="noopener">Visit site ${ext}</a>`;
  new IntersectionObserver(([e]) => sc.classList.toggle("show", !e.isIntersecting), { threshold: 0 }).observe($(".phead"));
}

if (page === "products") {
  const g = $("#tiles"), q = $("#q"), chips = $("#chips"), count = $("#count"); let cur = "all";
  chips.innerHTML = `<button class="chip on" data-b="all">All brands</button>` + S.brands.map(b => `<button class="chip" data-b="${b.slug}">${b.name}</button>`).join("");
  const draw = () => { const t = q.value.trim().toLowerCase();
    const l = S.brands.filter(b => cur === "all" || b.slug === cur).flatMap(b => b.items.map(it => [b, it])).filter(([b, it]) => (it.n + " " + b.name + " " + b.tag).toLowerCase().includes(t));
    g.innerHTML = l.map(([b, it], i) => tile(b, it, i)).join(""); count.textContent = `${l.length} ${l.length === 1 ? "item" : "items"}`;
    $(".empty").style.display = l.length ? "none" : "block"; observe(); };
  chips.onclick = e => { const c = e.target.closest(".chip"); if (!c) return; cur = c.dataset.b; $$(".chip", chips).forEach(x => x.classList.toggle("on", x === c)); c.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); draw(); };
  q.oninput = draw; draw();
}

if (page === "services") {
  $("#svrows").innerHTML = C.services.items.map((s, i) => `<div class="svrow"><div class="sp rv"><img src="img/bt/service-${i + 1}.webp" alt="" width="1045" height="730" loading="${i ? "lazy" : "eager"}" decoding="async"></div>
    <div class="rv" style="--d:.1s">${s.head ? `<h4>${s.head}</h4>` : ""}<h2>${s.t}</h2><p>${s.p}</p></div></div>`).join("");
}

if (page === "why") {
  $("#whyKicker").textContent = C.why.kicker; $("#whyTitle").textContent = C.why.title;
  $("#whyIntro").innerHTML = C.why.intro.map((p, i) => `<p class="rv" style="--d:${dly(i)}s">${p}</p>`).join("");
  $("#pillars").innerHTML = C.why.pillars.map(capCard).join("");
}

if (page === "about") {
  $("#aboutLead").textContent = C.presence.text;
  $("#duo").innerHTML = [1, 2].map(i => `<div class="bph"><img src="img/bt/service-${i}.webp" alt="" loading="lazy" decoding="async"></div>`).join("");
  $("#aboutBody").innerHTML = [C.hero.text, C.why.intro[0] + " " + C.why.intro[1] + " " + C.why.intro[2], C.why.pillars[5].p, C.capabilities.items[4].p].map(p => `<p>${p}</p>`).join("");
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
