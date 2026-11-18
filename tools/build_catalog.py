"""Scrape the sample catalogue (edafat.sa) -> img/p/*.webp + js/data.js.
Placeholder source until the real brand data (cognivra.net) is reachable.
Run:  python3 tools/build_catalog.py"""
import re, json, html, os, io, urllib.request
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATS = ["products","product_cat/powder-gelato-soft-serve","product_cat/food-services","product_cat/pastes-dipping",
        "product_cat/creams-spreads","product_cat/biscuites-cones-for-sweets","product_cat/sauce-for-sweet-decoration"]
get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent":"Mozilla/5.0"}), timeout=40).read()
items = {}
for c in CATS:
    h = get(f"https://www.edafat.sa/en/{c}/").decode()
    for u, i, t in re.findall(r'<a[^>]+href="(https://www\.edafat\.sa/en/products/[^"]+)"[^>]*>.*?<img[^>]+src="([^"]+)".*?<h\d[^>]*>\s*(.*?)\s*</h\d>', h, re.S):
        items[u] = (i, html.unescape(re.sub(r"<.*?>", "", t)).replace("–","-").strip())
BRANDS = [
 ("cones","Cones & Wafers","Biscuits, cones and wafers","Golden wafer cones and bowls, from everyday standards to chocolate-plated and cacao.",
  lambda n:re.search(r"cone|waffle|lady finger",n,re.I)),
 ("cremosette","Cremosette","Nut creams & spreads","Hazelnut, pistachio and gianduia creams for filling, swirling and spreading.",
  lambda n:"CREMOSETTE" in n.upper()),
 ("ravello","Ravello","Olive oil & dressings","Olive oil and herb-infused dressings: rosemary, basil, garlic and chili pepper.",
  lambda n:re.search(r"dressing|olive oil",n,re.I) and "TRUFFLE" not in n.upper()),
 ("madeleine","Madeleines","Bakery","Sweet and savoury madeleines, ready for the counter.",
  lambda n:"MADELEINE" in n.upper()),
 ("stickaway","Stickaway & Toppings","Coverings, pastes & sauces","Coverings, rippling sauces, toppings and flavour pastes for gelato and desserts.",
  lambda n:re.search(r"stickaway|topping|rippling|paste|sauce|covering",n,re.I) and "TRUFFLE" not in n.upper()),
 ("soft","Soft Serve Mixes","Powder gelato & soft serve","Powder bases and flavoured mixes for creamy soft serve and gelato.",
  lambda n:re.match(r"(easy|soft|ready|lactocream|integra)",n,re.I)),
 ("dairy","Dairy & Truffle","Italian cheese & truffle","Italian cheeses, truffle products and pasta for professional kitchens.",
  lambda n:re.search(r"cheese|truffle|ricotta|mozzarella|mascarpone|burrata|pecorino|pici|linguine",n,re.I) and not re.search(r"flavoured extra|condiment",n,re.I)),
]
slug = lambda s: re.sub(r"[^a-z0-9]+","-",s.lower()).strip("-")
out, seen_img, seen_name = [], set(), set()
for bs, bn, tag, desc, test in BRANDS:
    prods = []
    for u,(img,name) in items.items():
        if not test(name) or name.upper()=="CREMOSETTE HAZELNUT": continue  # source photo is a Pistachio tub
        key = name.lower()
        base = img.rsplit("/",1)[-1]
        if key in seen_name or base in seen_img: continue
        if any(name in [p["n"] for p in b["products"]] for b in out): continue
        full = re.sub(r"-\d+x\d+(?=\.\w+$)","",img)
        try: raw = get(full)
        except Exception:
            try: raw = get(img)
            except Exception: continue
        im = Image.open(io.BytesIO(raw)); im.thumbnail((800,800))
        im = im.convert("RGBA") if im.mode in ("RGBA","LA","P") else im.convert("RGB")
        fn = f"{bs}-{slug(name)[:40]}.webp"; im.save(os.path.join(ROOT,"img/p",fn), quality=82, method=6)
        seen_img.add(base); seen_name.add(key); prods.append({"n":name.title() if name.isupper() else name,"img":"img/p/"+fn})
        if len(prods) >= 12: break
    if prods: out.append({"slug":bs,"name":bn,"tag":tag,"desc":desc,"count":len(prods),"cover":prods[0]["img"],"products":prods})
js = """/* ============================================================
   DATA FILE: the only place to edit brands and products.
   PLACEHOLDER: built from the sample catalogue (tools/build_catalog.py).
   Replace with the real Foods & Beverages brands from cognivra.net.
   Per brand: `shop` = where "Buy now" sends the customer.
   Per product (optional): `buy` = exact product/checkout URL, `price` = number.
   ============================================================ */
window.SITE = %s;
window.buyUrl = (b, p) => p.buy || b.shop;
""" % json.dumps({"currency":"SAR","brands":[dict(b,shop="https://edafat.shop/") for b in out]}, ensure_ascii=False, indent=1)
open(os.path.join(ROOT,"js/data.js"),"w").write(js)
print({b["name"]:len(b["products"]) for b in out})
