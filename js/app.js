const S = window.SITE, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const page = document.body.dataset.page;
const CONTACT = { email: "hello@example.com", phone: "+966 00 000 0000", city: "Riyadh, Saudi Arabia" }; // placeholders
const up = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 10 10 2M4 2h6v6"/></svg>';
const right = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 9h14M10 3l6 6-6 6"/></svg>';
const brandOf = slug => S.brands.find(b => b.slug === slug);
const card = (b, p, d = 0) => `<article class="card rv" style="--d:${d}s"><div class="panel"><img loading="lazy" src="${p.img}" alt="${p.n}"></div>
 <div class="cap"><div><h3>${p.n}</h3><div class="by">${b.name}${p.price ? ` · <span class="price">${p.price} ${S.currency}</span>` : ""}</div></div>
 <a class="buy" target="_blank" rel="noopener" href="${buyUrl(b, p)}" aria-label="Buy ${p.n} on ${b.name}">Buy now ${up}</a></div></article>`;

/* chrome */
const links = [["index.html#brands", "Brands"], ["products.html", "Products"], ["about.html", "About"]];
$("#hdr").className = "hdr";
$("#hdr").innerHTML = `<a class="logo" href="index.html" aria-label="Edafat home">edafat<i></i></a>
 <button class="burger" aria-label="Menu" aria-expanded="false"></button>
 <nav>${links.map(([h, t]) => `<a href="${h}" class="${h.startsWith(page) ? "on" : ""}">${t}</a>`).join("")}<button class="lang" type="button" lang="${LANG === "ar" ? "en" : "ar"}">${LANG === "ar" ? "English" : "العربية"}</button><a class="pill" href="contact.html">Contact</a></nav>`;
$("#ftr").className = "ftr";
$("#ftr").innerHTML = `<div class="fgrid"><div><a class="logo" href="index.html">edafat<i></i></a><p style="max-width:32ch">Italian ingredients and trusted food brands, distributed from Riyadh. Every purchase is completed on the brand's own store.</p></div>
 <div><h4>Brands</h4>${S.brands.map(b => `<a href="brand.html?b=${b.slug}">${b.name}</a>`).join("")}</div>
 <div><h4>Company</h4><a href="about.html">About</a><a href="products.html">All products</a><a href="contact.html">Contact</a></div>
 <div><h4>Contact</h4><a href="mailto:${CONTACT.email}">${CONTACT.email}</a><a href="tel:${CONTACT.phone.replace(/\s/g, "")}">${CONTACT.phone}</a><span>${CONTACT.city}</span></div></div>
 <div class="big" aria-hidden="true">edafat</div><div class="copy"><span>© ${new Date().getFullYear()} Edafat. All rights reserved.</span><span>Checkout happens on each brand's website.</span></div>`;
const hdr = $("#hdr"), nav = $("#hdr nav"), burger = $(".burger");
$(".lang").onclick = () => setLang(LANG === "ar" ? "en" : "ar");
burger.onclick = () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); hdr.classList.toggle("menu", o); };
$$("#hdr nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); hdr.classList.remove("menu"); burger.setAttribute("aria-expanded", false); }));

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
const observe = () => { translateDOM(); $$(".rv:not(.in)").forEach(el => io.observe(el)); };

/* pages */
if (page === "home") {
  $("#rows").innerHTML = S.brands.map(b => `<a class="row" href="brand.html?b=${b.slug}" data-img="${b.cover}"><div class="thumb"><img src="${b.cover}" alt=""></div>
    <h3>${b.name}</h3><div class="meta"><span>${b.tag}</span><span>${b.count} items</span><i class="arrow">${right}</i></div></a>`).join("");
  $("#track").innerHTML = S.brands.flatMap(b => b.products.slice(0, 2).map(p => card(b, p))).join("");
  // cursor-following product preview on brand rows
  const peek = $(".peek"), pimg = $("img", peek); let tx = 0, ty = 0, x = 0, y = 0;
  $$(".row").forEach(r => { r.addEventListener("mouseenter", () => { pimg.src = r.dataset.img; peek.classList.add("on"); });
    r.addEventListener("mouseleave", () => peek.classList.remove("on")); });
  addEventListener("mousemove", e => { const w = peek.offsetWidth; tx = LANG === "ar" ? (e.clientX - 28 - w < 8 ? e.clientX + 28 : e.clientX - 28 - w) : (e.clientX + 28 + w > innerWidth * .74 ? e.clientX - 28 - w : e.clientX + 28); ty = e.clientY - peek.offsetHeight / 2; }, { passive: true });
  (function loop() { x += (tx - x) * .14; y += (ty - y) * .14; peek.style.transform = `translate(${x}px,${y}px) rotate(${(tx - x) * .04}deg)`; requestAnimationFrame(loop); })();
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
   <div class="panel"><img src="${b.cover}" alt="${b.name}"></div>`;
  $("#shopnote").textContent = `When you press Buy now you'll go to ${b.name}'s store to complete your order.`;
  const g = $("#grid"), q = $("#q");
  const draw = () => { const t = q.value.trim().toLowerCase(); const l = b.products.filter(p => p.n.toLowerCase().includes(t));
    g.innerHTML = l.map((p, i) => card(b, p, (i % 4) * .06)).join(""); $(".empty").style.display = l.length ? "none" : "block"; observe(); };
  q.oninput = draw; draw();
}
if (page === "products") {
  const g = $("#grid"), q = $("#q"), chips = $("#chips"); let cur = "all";
  chips.innerHTML = `<button class="chip on" data-b="all">All</button>` + S.brands.map(b => `<button class="chip" data-b="${b.slug}">${b.name}</button>`).join("");
  chips.onclick = e => { const c = e.target.closest(".chip"); if (!c) return; cur = c.dataset.b; $$(".chip").forEach(x => x.classList.toggle("on", x === c)); draw(); };
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
const tick = () => { const vh = innerHeight;
  hdr.classList.toggle("solid", scrollY > 60);
  pars.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
    el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * -el.dataset.par).toFixed(1)}px,0)`; });
  if (words.length) { const r = stmt.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (vh * .78 - r.top) / (r.height + vh * .18)));
    const n = Math.round(p * words.length); words.forEach((w, i) => w.classList.toggle("on", i < n)); } };
addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true }); addEventListener("resize", tick); tick(); observe();
