/* ============================================================
   DATA FILE — the only place to edit to change brands/products.
   Placeholder data for now. Replace with real data from
   cognivra.net/buildtrade (Foods & Beverages) when reachable.
   For each product, `buy` must be the real brand's checkout/product URL.
   ============================================================ */
window.SITE = {
  name: "Edafat",
  currency: "SAR",
  brands: [
    { slug:"cones", name:"Edafat Cones", emoji:"🍦", c1:"#ff8a3d", c2:"#ffb86b", tag:"Biscuits & cones",
      desc:"Crisp, golden cones and wafers for ice cream makers and dessert shops.", site:"https://example.com/edafat-cones",
      products:[
        {n:"Cone STD", p:12, e:"🍦", d:"Classic standard ice-cream cone."},
        {n:"Chocolate Plated Cone", p:18, e:"🍫", d:"Cone plated with rich chocolate inside."},
        {n:"Cacao Cone", p:16, e:"🍦", d:"Cacao-flavoured crunchy cone."},
        {n:"Danish Cone Large", p:20, e:"🥐", d:"Large buttery Danish-style cone."},
        {n:"Danish Cone", p:15, e:"🥐", d:"Regular Danish-style cone."},
        {n:"Mini Cone", p:9, e:"🍦", d:"Bite-size cone for tasting cups."} ]},
    { slug:"cremosette", name:"Cremosette", emoji:"🌰", c1:"#8b5a3c", c2:"#c9915f", tag:"Creams & spreads",
      desc:"Velvety nut creams and spreads for fillings, desserts and bakery.", site:"https://example.com/cremosette",
      products:[
        {n:"Hazelnut Cream", p:42, e:"🌰", d:"Smooth roasted hazelnut cream."},
        {n:"Pistachio Cream", p:55, e:"🥜", d:"Rich pistachio spread."},
        {n:"Gianduia Cream", p:48, e:"🍫", d:"Chocolate-hazelnut gianduia."},
        {n:"Hazelnut & Cacao", p:46, e:"🍫", d:"Hazelnut with deep cacao."},
        {n:"White Choco Spread", p:44, e:"🤍", d:"Creamy white chocolate spread."},
        {n:"Caramel Cream", p:40, e:"🍯", d:"Salted caramel filling."} ]},
    { slug:"ravello", name:"Ravello", emoji:"🫒", c1:"#5f7d3a", c2:"#a8c46a", tag:"Oils & dressings",
      desc:"Mediterranean olive oil and herb-infused dressings for the table and the kitchen.", site:"https://example.com/ravello",
      products:[
        {n:"Olive Oil", p:38, e:"🫒", d:"Cold-pressed extra virgin olive oil."},
        {n:"Rosemary Dressing", p:22, e:"🌿", d:"Rosemary-flavoured dressing."},
        {n:"Basil Dressing", p:22, e:"🌿", d:"Fresh basil dressing."},
        {n:"Garlic Dressing", p:22, e:"🧄", d:"Bold garlic dressing."},
        {n:"Chili Pepper Dressing", p:24, e:"🌶️", d:"Spicy chili dressing."},
        {n:"Cheddar & Emmental Madeleine", p:19, e:"🧀", d:"Savoury cheese madeleine."} ]},
    { slug:"stickaway", name:"Stickaway", emoji:"🍓", c1:"#d6335a", c2:"#ff8fa8", tag:"Coatings & toppings",
      desc:"Ice-cream coatings, rippling sauces and toppings in bold flavours.", site:"https://example.com/stickaway",
      products:[
        {n:"Strawberry Coating", p:35, e:"🍓", d:"Bright strawberry covering."},
        {n:"Pure Pistachio Coating", p:52, e:"🥜", d:"Pistachio covering."},
        {n:"Milk Chocolate Coating", p:33, e:"🍫", d:"Classic milk chocolate."},
        {n:"White Chocolate Coating", p:34, e:"🤍", d:"Smooth white chocolate."},
        {n:"Wildberries Rippling Sauce", p:30, e:"🫐", d:"Berry ripple for gelato."},
        {n:"Berries Topping", p:28, e:"🍒", d:"Mixed berry topping."} ]},
    { slug:"softserve", name:"Soft Serve", emoji:"🍨", c1:"#2f8fbf", c2:"#8fd3f0", tag:"Powder & gelato mixes",
      desc:"Easy powder mixes for creamy soft-serve and gelato in minutes.", site:"https://example.com/softserve",
      products:[
        {n:"Easy Coconut", p:26, e:"🥥", d:"Coconut soft-serve mix."},
        {n:"Soft Chili Pepper Choco", p:29, e:"🌶️", d:"Spiced chocolate mix."},
        {n:"Soft Cardamom", p:27, e:"🌱", d:"Cardamom soft-serve mix."},
        {n:"Soft Custard", p:25, e:"🍮", d:"Vanilla custard mix."},
        {n:"Vanilla Gelato Base", p:31, e:"🍨", d:"Versatile gelato powder."},
        {n:"Mango Mix", p:28, e:"🥭", d:"Tropical mango mix."} ]},
    { slug:"foodservice", name:"Chef's Choice", emoji:"👨‍🍳", c1:"#c9302c", c2:"#f58a5c", tag:"Food services",
      desc:"Kitchen essentials and professional ingredients for restaurants and caterers.", site:"https://example.com/chefs-choice",
      products:[
        {n:"Cooking Cream", p:21, e:"🥛", d:"Stable cooking cream."},
        {n:"Tomato Sauce", p:17, e:"🍅", d:"Slow-cooked tomato base."},
        {n:"Pizza Mix", p:23, e:"🍕", d:"Ready pizza dough mix."},
        {n:"Mayonnaise", p:18, e:"🥚", d:"Creamy professional mayo."},
        {n:"BBQ Sauce", p:19, e:"🍖", d:"Smoky barbecue sauce."},
        {n:"Spice Blend", p:15, e:"🧂", d:"All-purpose seasoning."} ]}
  ]
};
// Build the buy URL. Replace with each product's real checkout link when known.
window.buyUrl = (b, p) => b.site + "?add=" + encodeURIComponent(p.n);
