const S = window.SITE, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const page = document.body.dataset.page;
const CONTACT = { email: "hello@example.com", phone: "+966 00 000 0000", city: "Riyadh, Saudi Arabia" }; // placeholders
const up = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 10 10 2M4 2h6v6"/></svg>';
const right = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 9h14M10 3l6 6-6 6"/></svg>';
const PREFER = { cones: "Chocolate Plated Cone Std", ravello: "Ravello Olive Oil", madeleine: "Chocolate Chip Madeleines", stickaway: "Strawberry Stickaway - Covering", soft: "Easy Coconut", dairy: "Mozzarella Panetto" };
const FLAT = ["cremosette"]; // brands whose photo has a solid backdrop (shown as a rounded tile)
const coverOf = b => (b.products.find(p => p.n === PREFER[b.slug]) || b.products[0]).img;
const brandOf = slug => S.brands.find(b => b.slug === slug);
const card = (b, p, d = 0) => `<article class="card rv" style="--d:${d}s"><div class="panel"><img loading="lazy" decoding="async" width="700" height="700" src="${p.img}" srcset="${p.img.replace("img/p/", "img/p/s/")} 540w, ${p.img} 700w" sizes="(max-width:700px) 46vw, (max-width:1100px) 30vw, 300px" alt="${p.n}"></div>
 <div class="cap"><div><h3>${p.n}</h3><div class="by">${b.name}${p.price ? ` · <span class="price">${p.price} ${S.currency}</span>` : ""}</div></div>
 <a class="buy" target="_blank" rel="noopener" href="${buyUrl(b, p)}" aria-label="Buy ${p.n} on ${b.name}">Buy now ${up}</a></div></article>`;

/* chrome */
const links = [["index.html#brands", "Brands"], ["products.html", "Products"], ["about.html", "About"]];
$("#hdr").className = "hdr";
$("#hdr").innerHTML = `<a class="logo" href="index.html" aria-label="Edafat home"><img class="lw" src="img/logo-white.png" alt="Edafat"><img class="ld" src="img/logo-dark.png" alt="" aria-hidden="true"></a>
 <button class="burger" aria-label="Menu" aria-expanded="false"></button>
 <nav>${links.map(([h, t]) => `<a href="${h}" class="${h.startsWith(page) ? "on" : ""}">${t}</a>`).join("")}<button class="lang" type="button" lang="${LANG === "ar" ? "en" : "ar"}">${LANG === "ar" ? "English" : "العربية"}</button><a class="pill" href="contact.html">Contact</a></nav>`;
$("#ftr").className = "ftr";
$("#ftr").innerHTML = `<div class="fgrid"><div><a class="logo" href="index.html" aria-label="Edafat home"><img class="lw" src="img/logo-white.png" alt="Edafat"></a><p style="max-width:32ch">Italian ingredients and trusted food brands, distributed from Riyadh. Every purchase is completed on the brand's own store.</p></div>
 <div><h4>Brands</h4>${S.brands.map(b => `<a href="brand.html?b=${b.slug}">${b.name}</a>`).join("")}</div>
 <div><h4>Company</h4><a href="about.html">About</a><a href="products.html">All products</a><a href="contact.html">Contact</a></div>
 <div><h4>Contact</h4><a href="mailto:${CONTACT.email}">${CONTACT.email}</a><a href="tel:${CONTACT.phone.replace(/\s/g, "")}">${CONTACT.phone}</a><span>${CONTACT.city}</span></div></div>
 ${LANG === "ar" ? '<div class="big" aria-hidden="true">edafat</div>' : '<div class="big big-logo" aria-hidden="true"><img src="img/logo-white.png" alt=""></div>'}<div class="copy"><span>© ${new Date().getFullYear()} Edafat. All rights reserved.</span><span>Checkout happens on each brand's website.</span></div>`;
const hdr = $("#hdr"), nav = $("#hdr nav"), burger = $(".burger");
$(".lang").onclick = () => setLang(LANG === "ar" ? "en" : "ar");
const setMenu = o => { nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); hdr.classList.toggle("menu", o); document.documentElement.style.overflow = o ? "hidden" : ""; };
burger.onclick = () => setMenu(!nav.classList.contains("open"));
$$("#hdr nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 900) setMenu(false); });

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
const observe = () => { translateDOM(); $$(".rv:not(.in)").forEach(el => io.observe(el)); };

/* pages */
if (page === "home") {
  $("#rows").innerHTML = S.brands.map(b => `<a class="row" href="brand.html?b=${b.slug}" data-img="${coverOf(b)}" data-flat="${FLAT.includes(b.slug) ? 1 : ""}"><div class="thumb"><img loading="lazy" decoding="async" width="76" height="76" src="${coverOf(b)}" alt=""></div>
    <h3>${b.name}</h3><div class="meta"><span>${b.tag}</span><span>${b.count} items</span><i class="arrow">${right}</i></div></a>`).join("");
  $("#track").innerHTML = S.brands.flatMap(b => b.products.slice(0, 2).map(p => card(b, p))).join("");
  // phone/tablet: swipeable brand cards (product slides + tilts as you swipe, neighbours dim, progress bar fills)
  const TINT = { cones: ["#e8761e", "#f7a54a"], cremosette: ["#7a4b2f", "#b98355"], ravello: ["#55702f", "#93b152"], madeleine: ["#c58a14", "#e9b94a"], stickaway: ["#c42a4d", "#f0708a"], soft: ["#2a7fb0", "#6fc0e6"], dairy: ["#34567f", "#7aa3d1"] };
  const bt = $("#btrack");
  bt.innerHTML = S.brands.map(b => { const [c1, c2] = TINT[b.slug] || ["#3a2f2a", "#6b5a4f"];
    return `<a class="bcard" href="brand.html?b=${b.slug}" style="--c1:${c1};--c2:${c2}"><span class="bc-count">${b.count} items</span>
     <div class="bc-art${FLAT.includes(b.slug) ? " flat" : ""}"><img loading="lazy" decoding="async" src="${coverOf(b)}" alt=""></div>
     <div class="bc-foot"><small>${b.tag}</small><h3>${b.name}</h3></div><i class="bc-go">${right}</i></a>`; }).join("");
  const cards = $$(".bcard", bt), arts = cards.map(c => $(".bc-art", c)), foots = cards.map(c => $(".bc-foot", c)), bbar = $("#bbar"), bcount = $("#bcount");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches; let bTick = false;
  const bUpdate = () => { bTick = false; const r = bt.getBoundingClientRect(), mid = r.left + r.width / 2; let best = 0, bd = 9;
    cards.forEach((c, i) => { const cr = c.getBoundingClientRect(); const p = (cr.left + cr.width / 2 - mid) / cr.width, a = Math.min(1, Math.abs(p));
      if (a < bd) { bd = a; best = i; }
      if (calm || Math.abs(p) > 2) return;
      c.style.transform = `scale(${(1 - a * .07).toFixed(3)})`; c.style.opacity = (1 - a * .45).toFixed(2);
      arts[i].style.transform = `translate3d(${(-p * 38).toFixed(1)}px,0,0) rotate(${(p * -10).toFixed(1)}deg)`;
      foots[i].style.transform = `translate3d(${(-p * 16).toFixed(1)}px,0,0)`; });
    const max = bt.scrollWidth - bt.clientWidth; bbar.style.transform = `scaleX(${(.1 + .9 * (max > 0 ? Math.min(1, Math.abs(bt.scrollLeft) / max) : 0)).toFixed(3)})`;
    bcount.textContent = `${best + 1} / ${cards.length}`; };
  const bSched = () => { if (!bTick) { bTick = true; requestAnimationFrame(bUpdate); } };
  bt.addEventListener("scroll", bSched, { passive: true }); addEventListener("resize", bSched); bUpdate();
  // cursor-following product preview on brand rows (mouse devices only; the loop sleeps when idle)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const peek = $(".peek"), pimg = $("img", peek), tilt = $(".t", peek), pop = $(".s", peek); let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const clamp = (v, m) => Math.max(-m, Math.min(m, v));
    const step = () => { const vx = tx - x, vy = ty - y; x += vx * .12; y += vy * .12;
      peek.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      tilt.style.transform = `rotateY(${clamp(vx * .45, 38)}deg) rotateX(${clamp(-vy * .45, 28)}deg) rotateZ(${clamp(vx * .06, 10)}deg)`;
      raf = peek.classList.contains("on") || Math.abs(vx) > .4 || Math.abs(vy) > .4 ? requestAnimationFrame(step) : 0; };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
    $$(".row").forEach(r => { r.addEventListener("mouseenter", () => { pimg.src = r.dataset.img; peek.classList.toggle("flat", !!r.dataset.flat); pop.classList.remove("pop"); void pop.offsetWidth; pop.classList.add("pop"); peek.classList.add("on"); kick(); });
      r.addEventListener("mouseleave", () => peek.classList.remove("on")); });
    addEventListener("mousemove", e => { const w = peek.offsetWidth, g = 44;
      tx = LANG === "ar" ? (e.clientX - g - w < 8 ? e.clientX + g : e.clientX - g - w) : (e.clientX + g + w > innerWidth * .8 ? e.clientX - g - w : e.clientX + g);
      ty = e.clientY - peek.offsetHeight / 2; if (peek.classList.contains("on")) kick(); }, { passive: true });
  }
  // drag to scroll
  const t = $("#track"); let down = false, sx, sl;
  t.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = t.scrollLeft; t.classList.add("drag"); });
  addEventListener("pointerup", () => { down = false; t.classList.remove("drag"); });
  addEventListener("pointermove", e => { if (down) t.scrollLeft = sl - (e.clientX - sx); });
  t.addEventListener("dragstart", e => e.preventDefault());
}
if (page === "brand") {
  const b = brandOf(new URLSearchParams(location.search).get("b")) || S.brands[0];
  document.title = `${b.name} | Edafat`;
  $("#bhead").innerHTML = `<div><div class="crumb"><a href="index.html#brands">Brands</a> / ${b.name}</div><h1>${b.name}</h1><p>${b.desc}</p><div class="count">${b.count} products</div></div>
   <div class="panel"><img src="${coverOf(b)}" alt="${b.name}"></div>`;
  $("#shopnote").textContent = `When you press Buy now you'll go to the ${b.name} store to complete your order.`;
  const g = $("#grid"), q = $("#q");
  const draw = () => { const t = q.value.trim().toLowerCase(); const l = b.products.filter(p => p.n.toLowerCase().includes(t));
    g.innerHTML = l.map((p, i) => card(b, p, (i % 4) * .06)).join(""); $(".empty").style.display = l.length ? "none" : "block"; observe(); };
  q.oninput = draw; draw();
}
if (page === "products") {
  const g = $("#grid"), q = $("#q"), chips = $("#chips"); let cur = "all";
  chips.innerHTML = `<button class="chip on" data-b="all">All</button>` + S.brands.map(b => `<button class="chip" data-b="${b.slug}">${b.name}</button>`).join("");
  chips.onclick = e => { const c = e.target.closest(".chip"); if (!c) return; cur = c.dataset.b; $$(".chip").forEach(x => x.classList.toggle("on", x === c)); c.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); draw(); };
  const draw = () => { const t = q.value.trim().toLowerCase();
    const l = S.brands.filter(b => cur === "all" || b.slug === cur).flatMap(b => b.products.map(p => [b, p])).filter(([b, p]) => (p.n + b.name).toLowerCase().includes(t));
    g.innerHTML = l.map(([b, p], i) => card(b, p, (i % 4) * .05)).join(""); $(".empty").style.display = l.length ? "none" : "block"; observe(); };
  q.oninput = draw; draw();
}
if (page === "contact") {
  const f = $("#cform"); f.onsubmit = e => { e.preventDefault(); const d = new FormData(f);
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent((LANG === "ar" ? "استفسار من " : "Enquiry from ") + d.get("name"))}&body=${encodeURIComponent(d.get("message") + "\n\n" + d.get("name") + "\n" + d.get("email"))}`; };
  $("#c-mail").textContent = CONTACT.email; $("#c-phone").textContent = CONTACT.phone; $("#c-city").textContent = CONTACT.city;
}

/* scroll: header, parallax, statement */
translateDOM();
const stmt = $("#stmt");
if (stmt) stmt.innerHTML = stmt.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
const words = $$("#stmt .w"), pars = $$("[data-par]");
const parOK = matchMedia("(min-width: 901px) and (hover: hover)"); let lastN = 0, ticking = false;
const tick = () => { ticking = false; const vh = innerHeight;
  hdr.classList.toggle("solid", scrollY > 60);
  if (parOK.matches) pars.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
    el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * -el.dataset.par).toFixed(1)}px,0)`; });
  if (words.length) { const r = stmt.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (vh * .78 - r.top) / (r.height + vh * .18)));
    const n = Math.round(p * words.length); if (n !== lastN) { for (let i = Math.min(n, lastN); i < Math.max(n, lastN); i++) words[i].classList.toggle("on", i < n); lastN = n; } } };
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); tick(); observe();
