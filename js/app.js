const S = window.SITE, $ = (s, r=document) => r.querySelector(s);
const page = document.body.dataset.page;
const nav = [["index.html","Home"],["about.html","About"],["products.html","Our Products"],["contact.html","Contact"]];
const brandCard = (b,i) => `<a class="brand rv" style="--c1:${b.c1};--c2:${b.c2};--d:${(i%3)*.1}s" href="brand.html?b=${b.slug}">
 <span class="em">${b.emoji}</span><small>${b.tag}</small><h3>${b.name}</h3><p>${b.desc}</p><span class="go">View items →</span></a>`;

function observe(){ document.querySelectorAll(".rv:not(.in)").forEach(el => io.observe(el)); }
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.15});
observe();
// header + footer
$("#hdr").innerHTML = `<div class="wrap"><a class="logo" href="index.html">eda<b>fat</b></a>
 <button class="burger" aria-label="Menu">☰</button>
 <nav>${nav.map(([h,t])=>`<a href="${h}" class="${h.startsWith(page)?'on':''}">${t}</a>`).join("")}<a class="btn" href="index.html#brands">Shop brands</a></nav></div>`;
$("#ftr").innerHTML = `<div class="wrap"><div class="fg"><div><a class="logo" href="index.html" style="color:#fff">eda<b>fat</b></a>
 <p style="margin-top:12px;max-width:320px">Quality food & beverage brands, brought together in one place.</p></div>
 <div><h4>Explore</h4>${nav.map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}</div>
 <div><h4>Brands</h4>${S.brands.map(b=>`<a href="brand.html?b=${b.slug}">${b.name}</a>`).join("")}</div></div>
 <div class="copy">© ${new Date().getFullYear()} Edafat. All purchases are completed securely on each brand's own website.</div></div>`;
const hdr = $("#hdr");
const onScroll = () => { hdr.classList.toggle("scrolled", scrollY > 40);
  document.querySelectorAll("[data-speed]").forEach(el => el.style.transform = `translateY(${scrollY*el.dataset.speed}px)`); };
addEventListener("scroll", onScroll, {passive:true}); onScroll();
$(".burger").onclick = () => $("nav").classList.toggle("open");
document.querySelectorAll("nav a").forEach(a => a.addEventListener("click", () => $("nav").classList.remove("open")));

// home
if ($("#brandGrid")) {
  $("#brandGrid").innerHTML = S.brands.map(brandCard).join(""); observe();
  $("#mq").innerHTML = "<div>" + S.brands.concat(S.brands).map(b=>`<span>${b.emoji} ${b.name}</span>`).join("") + "</div>";
  const h = $("#h1"); h.innerHTML = h.dataset.t.split(" ").map((w,i)=>`<span class="w"><span style="animation-delay:${.15+i*.12}s">${w==="taste"?"<em>taste</em>":w}</span></span>`).join(" ");
  S.brands.slice(0,5).forEach((b,i)=>{ const p=[[8,70],[78,18],[88,66],[62,78],[46,12]][i];
    const f=document.createElement("div"); f.className="float"; f.dataset.speed=[-.12,.1,-.2,.15,-.08][i];
    f.style.cssText=`left:${p[0]}%;top:${p[1]}%`; f.innerHTML=`<i style="animation-delay:${-i}s">${b.emoji}</i>`; $(".hero").appendChild(f); });
  document.querySelectorAll("[data-count]").forEach(el => el._t = +el.dataset.count);
}
// brand page
if (page === "brand") {
  const b = S.brands.find(x => x.slug === new URLSearchParams(location.search).get("b")) || S.brands[0];
  document.title = b.name + " — Edafat";
  const ph = $(".phead"); ph.style.setProperty("--c1", b.c1); ph.style.setProperty("--c2", b.c2);
  ph.innerHTML = `<div class="wrap"><div class="crumb"><a href="index.html">Home</a> / <a href="index.html#brands">Brands</a> / ${b.name}</div>
   <h1>${b.name}</h1><p>${b.desc}</p></div><span class="em">${b.emoji}</span>`;
  const g = $("#pgrid"), q = $("#q");
  const draw = () => { const t = q.value.toLowerCase(); const list = b.products.filter(p => (p.n+p.d).toLowerCase().includes(t));
    g.innerHTML = list.map((p,i)=>`<article class="prod rv" style="--c1:${b.c1};--c2:${b.c2};--d:${(i%4)*.07}s"><div class="pic">${p.e}</div>
     <div class="b"><h3>${p.n}</h3><p>${p.d}</p><div class="row"><span class="price">${p.p} <small>${S.currency}</small></span>
     <a class="btn" target="_blank" rel="noopener" href="${buyUrl(b,p)}">Buy now ↗</a></div></div></article>`).join("");
    $(".empty").style.display = list.length ? "none" : "block"; observe(); };
  q.oninput = draw; draw();
  $("#visit").href = b.site;
}
if ($("#allGrid")) { $("#allGrid").innerHTML = S.brands.map(brandCard).join(""); observe(); }

// reveal + counters
const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; cio.unobserve(e.target);
  const t = +e.target.dataset.count; let s; const step = ts => { s ??= ts; const k = Math.min((ts-s)/1600,1);
  e.target.textContent = Math.round(t*(1-Math.pow(1-k,3))) + (e.target.dataset.suffix||""); if (k<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }), {threshold:.6});
document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));
// contact form (front-end only)
const cf = $("#cform"); if (cf) cf.onsubmit = e => { e.preventDefault(); cf.innerHTML = "<h3>Thank you! 🎉</h3><p>We'll get back to you shortly.</p>"; };
