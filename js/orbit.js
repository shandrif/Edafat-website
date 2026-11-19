/* Brand orbit: the brand picker on the home page.
   A vanilla-JS (GSAP + ScrollTrigger) port of the "dish orbit carousel" layout: the round brand photo swings out on a wide orbit and the next one
   swings in, the two-weight title wipes out and back in, the card cross-fades, a pastel arc behind the scene turns and takes the brand's colour.
   The section pins and each stretch of scroll brings the next brand. Arrows, thumbnails, side pager, arrow keys and swipes jump too.
   Every photo, name and fact comes from SITE (the brands' own sites); nothing is drawn here. */
(function () {
  const ORBIT_X = 299, ORBIT_Y = -450, ORBIT_R = 650, SWING = 50, ITEM = 118, VISIBLE = 4, PER = .55;
  const HIDE_1 = "inset(0% 0% 0% 100%)", HIDE_2 = "inset(0% 100% 0% 0%)", SHOW = "inset(0% 0% 0% 0%)";
  const wrap = (i, n) => ((Math.round(i) % n) + n) % n;
  const fitSize = (chars, max, width, em) => Math.min(max, width / (Math.max(1, chars) * em));
  const ARC_REST = [[50, 98], [46, 124], [60, 126], [40, 100]], ARC_SWEEP = [38, 146];
  function arcPath(a0, a1, cx, cy, r, w, steps = 48) {
    const o = [], n = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, a = ((a0 + (a1 - a0) * t) * Math.PI) / 180, h = (w / 2) * Math.pow(Math.sin(Math.PI * t), .45), c = Math.cos(a), s = Math.sin(a);
      o.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1)); n.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1));
    }
    return "M" + o.join("L") + "L" + n.reverse().join("L") + "Z";
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const prev = '<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M11 0v16L0 8z"/></svg>', next = '<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M1 0v16l11-8z"/></svg>';
  const arrow = '<svg class="bo-ico" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 9h13M10 3l6 6-6 6"/></svg>';
  const extIco = '<svg class="bo-ico" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 10 10 2M4 2h6v6"/></svg>';

  window.BrandOrbit = function (host, D, L, open) {
    const n = D.length, steps = Math.max(0, n - 1);
    host.innerHTML = `<div class="bo-trk" style="height:calc(100svh * ${1 + steps * PER})"><div class="bo-root" role="region" aria-roledescription="carousel" aria-label="${esc(L.label)}" tabindex="0">
      <div class="bo-canvas">
       <svg class="bo-arc" viewBox="0 0 960 520" aria-hidden="true"><path style="opacity:.34"/></svg>
       <div class="bo-pager" role="tablist" aria-label="${esc(L.label)}">${D.map((d, i) => `<button type="button" role="tab" class="bo-btn bo-dot" aria-label="${esc(d.name)}"><i></i></button>`).join("")}</div>
       <div class="bo-plates">${D.map(d => `<div class="bo-orbit"><img src="${d.photo}" style="object-position:${d.fx}% 50%" alt="${esc(d.name)}" width="245" height="245" draggable="false" decoding="async"></div>`).join("")}</div>
       <div class="bo-head" aria-live="polite">${D.map((d, i) => `<div class="bo-hd"><p class="bo-eye">${esc(d.eyebrow)}</p><h3><span class="bo-t1" style="font-size:${fitSize(d.t1.length, 54, 330, .56)}px">${esc(d.t1)}</span><span class="bo-t2" style="font-size:${fitSize(d.t2.length, 58, 320, .66)}px">${esc(d.t2)}</span></h3></div>`).join("")}</div>
       <div class="bo-acts"><a class="bo-btn bo-go" href="#">${esc(L.range)} ${arrow}</a><a class="bo-btn bo-visit" href="#" target="_blank" rel="noopener">${esc(L.visit)} ${extIco}</a></div>
       <div class="bo-card">
        <div class="bo-tabs" role="tablist" aria-label="${esc(L.label)}"><button type="button" role="tab" class="bo-btn bo-tab" data-t="ov" aria-selected="true">${esc(L.overview)}</button><button type="button" role="tab" class="bo-btn bo-tab" data-t="pop" aria-selected="false">${esc(L.popular)}</button></div>
        <div class="bo-bodies">${D.map((d, i) => `<div class="bo-body"><div class="bo-rate"><div class="bo-badge" style="background:${d.accent}"><b>${d.count}</b><small>${esc(d.count === 1 ? L.item : L.items)}</small></div><div><p class="bo-place">${esc(d.place)}</p><p class="bo-kit">${esc(d.facts)}</p></div></div>
          <p class="bo-desc bo-ov">${esc(d.blurb)}</p>
          <div class="bo-pop">${d.thumbs.map(t => `<button type="button" class="bo-btn bo-it" data-b="${d.slug}" data-i="${t.i}" tabindex="${i ? -1 : 0}"><img src="${t.img}" alt="" loading="lazy" decoding="async"><span>${esc(t.name)}</span></button>`).join("")}</div></div>`).join("")}</div>
       </div>
       <div class="bo-strip"><button type="button" class="bo-btn bo-arrow" data-d="-1" aria-label="${esc(L.prev)}">${prev}</button>
        <div class="bo-win"><div class="bo-track">${D.map((d, i) => `<div class="bo-th"><button type="button" class="bo-btn" aria-label="${esc(d.name)}"><img src="${d.photo}" alt="" width="56" height="56" style="object-position:${d.fx}% 50%" loading="lazy" decoding="async" draggable="false"><span>${esc(d.name)}</span></button></div>`).join("")}</div></div>
        <button type="button" class="bo-btn bo-arrow" data-d="1" aria-label="${esc(L.next)}">${next}</button></div>
      </div><p class="bo-sr" aria-live="polite"></p></div></div>`;

    const $ = (s, r = host) => r.querySelector(s), $$ = (s, r = host) => [...r.querySelectorAll(s)];
    const trk = $(".bo-trk"), root = $(".bo-root"), arcEl = $(".bo-arc path"), sr = $(".bo-sr");
    const orbits = $$(".bo-orbit"), heads = $$(".bo-hd"), bodies = $$(".bo-body"), dots = $$(".bo-dot"), ths = $$(".bo-th .bo-btn"), track = $(".bo-track");
    const go1 = $(".bo-go"), visit = $(".bo-visit");
    let index = 0, shown = -1, dir = 1, tl = null, reduced = matchMedia("(prefers-reduced-motion: reduce)").matches, st = null, seg = 0, swipe = null;
    const arc = { a0: 0, a1: 0 };

    /* fit the 960 x 520 design canvas to the stage (below 640px the CSS stacks it instead) */
    const fit = () => { const w = root.clientWidth, h = root.clientHeight - 76; root.style.setProperty("--bo-s", Math.max(.3, Math.min(w / 960, h / 520, 1.5))); };
    fit(); new ResizeObserver(fit).observe(root);

    const parts = i => { const h = heads[i]; return { orbit: orbits[i], head: h, eye: h.querySelector(".bo-eye"), t1: h.querySelector(".bo-t1"), t2: h.querySelector(".bo-t2"), body: bodies[i] }; };
    const drawArc = () => arcEl.setAttribute("d", arcPath(arc.a0, arc.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118));

    const render = () => {
      const from = shown, to = index, d = D[to], rest = ARC_REST[to % ARC_REST.length];
      if (tl) tl.progress(1).kill();
      const b = parts(to);
      /* state that is not animated */
      dots.forEach((x, i) => { x.toggleAttribute("aria-current", i === to); x.setAttribute("aria-selected", i === to); });
      ths.forEach((x, i) => x.toggleAttribute("aria-current", i === to));
      go1.href = "brand.html?b=" + d.slug; visit.href = d.url;
      $$(".bo-it").forEach(x => x.tabIndex = x.dataset.b === d.slug ? 0 : -1);
      track.style.transform = `translateX(${-Math.max(0, Math.min(to - 1, n - VISIBLE)) * ITEM * (n > VISIBLE ? 1 : 0)}px)`;
      sr.textContent = `${to + 1} / ${n}: ${d.name}`;
      if (from === -1 || from === to || reduced) {
        D.forEach((x, i) => { if (i !== to) { const p = parts(i); gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0 }); } });
        gsap.set([b.orbit, b.head, b.body, b.eye], { autoAlpha: 1, rotation: 0, y: 0 });
        gsap.set([b.t1, b.t2], { clipPath: SHOW });
        arc.a0 = rest[0]; arc.a1 = rest[1]; drawArc(); gsap.set(arcEl, { fill: d.accent }); shown = to; return;
      }
      const a = parts(from);
      tl = gsap.timeline({ onComplete: () => { tl = null; } });
      tl.to(a.orbit, { rotation: SWING * dir, duration: .62, ease: "power2.in" }, 0).set(a.orbit, { autoAlpha: 0, rotation: 0 }, .62)
        .fromTo(b.orbit, { autoAlpha: 1, rotation: -SWING * dir }, { rotation: 0, duration: .95, ease: "power3.out" }, .3);
      tl.to(a.t1, { clipPath: HIDE_1, duration: .42, ease: "power2.in" }, 0).to(a.t2, { clipPath: HIDE_2, duration: .42, ease: "power2.in" }, .06)
        .to(a.eye, { autoAlpha: 0, duration: .25 }, 0).set(a.head, { autoAlpha: 0 }, .5).set(b.head, { autoAlpha: 1 }, .5)
        .fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .4, ease: "power2.out" }, .55)
        .fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: .7, ease: "power3.out" }, .55)
        .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: .7, ease: "power3.out" }, .62);
      tl.to(a.body, { autoAlpha: 0, y: -6, duration: .3, ease: "power1.in" }, .05).set(b.body, { autoAlpha: 1, y: 0 }, .4)
        .fromTo(b.body.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .06, ease: "power2.out" }, .4);
      tl.to(arc, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: .6, ease: "power2.inOut", onUpdate: drawArc }, 0)
        .to(arc, { a0: rest[0], a1: rest[1], duration: .85, ease: "power3.out", onUpdate: drawArc }, .6)
        .to(arcEl, { fill: d.accent, duration: 1.1, ease: "power1.inOut" }, .1);
      shown = to;
    };

    const select = (to, d) => { if (to === index) return; dir = d; index = to; render(); };

    /* the page scroll drives the brand: the stage pins, one stretch of scroll per brand, snapping between them */
    if (steps > 0 && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      st = ScrollTrigger.create({ trigger: trk, start: "top top", end: "bottom bottom", snap: { snapTo: 1 / steps, duration: { min: .3, max: .7 }, delay: .08, ease: "power2.inOut" },
        onUpdate: self => { const s = Math.round(self.progress * steps); if (s === seg) return; const d = s > seg ? 1 : -1; seg = s; select(s, d); } });
    }
    const jump = (to, d) => {
      if (to < 0 || to >= n || to === index) return;
      if (st) { const y = st.scroll(); if (y >= st.start - 1 && y <= st.end + 1) { seg = to; st.scroll(st.start + (st.end - st.start) * to / steps); } }
      select(to, d || (to > index ? 1 : -1));
    };
    dots.forEach((x, i) => x.onclick = () => jump(i));
    ths.forEach((x, i) => x.onclick = () => jump(i));
    $$(".bo-arrow").forEach(x => x.onclick = () => jump(index + +x.dataset.d, +x.dataset.d));
    root.addEventListener("keydown", e => { const r = getComputedStyle(document.documentElement).direction === "rtl"; if (e.key === "ArrowRight") { e.preventDefault(); jump(index + (r ? -1 : 1)); } else if (e.key === "ArrowLeft") { e.preventDefault(); jump(index + (r ? 1 : -1)); } });
    const pl = $(".bo-plates");
    pl.addEventListener("pointerdown", e => { swipe = { x: e.clientX, y: e.clientY }; });
    pl.addEventListener("pointerup", e => { const s = swipe; swipe = null; if (!s) return; const dx = e.clientX - s.x; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) jump(index + (dx < 0 ? 1 : -1)); });
    $$(".bo-tab").forEach(x => x.onclick = () => { root.dataset.tab = x.dataset.t; $$(".bo-tab").forEach(y => y.setAttribute("aria-selected", y === x)); });
    host.addEventListener("click", e => { const c = e.target.closest(".bo-it"); if (c) open(c.dataset.b, +c.dataset.i); });
    root.dataset.tab = "ov";
    render();
    /* deep link: #brands keeps its meaning (the section top); ?brand=slug is not needed */
    return { jump, refresh: () => st && st.refresh() };
  };
})();
