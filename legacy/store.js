/* ============================================================
   La Panini — Lasanhas Artesanais · store.js
   Catálogo dinâmico, sacola, checkout e acompanhamento.
   (Fonte de dados local — demo de delivery)
   ============================================================ */
"use strict";

let savedCart = [];
try { savedCart = JSON.parse(localStorage.getItem("lapanini_cart") || "[]") || []; } catch { savedCart = []; }
const state = { menu: null, cart: savedCart, coupon: null };

const money = v => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];
const save = () => {
  localStorage.setItem("lapanini_cart", JSON.stringify(state.cart));
  qsa("[data-cart-count]").forEach(x => x.textContent = state.cart.reduce((a, i) => a + i.quantity, 0));
};
const toast = t => {
  const e = document.createElement("div");
  e.className = "toast";
  e.textContent = t;
  document.body.append(e);
  setTimeout(() => e.remove(), 2200);
};
const categoryName = p => MENU.categories.find(c => c.slug === p.category_slug)?.name || "Cardápio";

/* ============================================================
   Cardápio local
   ============================================================ */
const MENU = {
  categories: [
    { slug: "selecoes", name: "Seleções especiais" },
    { slug: "clasicos", name: "Clássicos" },
    { slug: "deluxe", name: "Deluxe" },
    { slug: "especiais", name: "Especiais" },
    { slug: "doces", name: "Doces" },
    { slug: "sobremesas", name: "Sobremesas" },
  ],
  products: [
    { id: 1,  category_slug: "selecoes",   name: "Lasanha da Casa", price: 46.9,  description: "A receita assinada La Panini: ragu de carne, bechamel e massa fresca.", ingredients: "Ragu de carne,bechamel,massa fresca,muçarela,parmesão", badge: "Mais pedido", featured: 1 },
    { id: 2,  category_slug: "selecoes",   name: "Lasanha Caprese", price: 49.9,  description: "Tomate confit, muçarela de búfala e manjericão fresco.", ingredients: "Tomate confit,muçarela de búfala,manjericão,massa fresca", badge: "Especial", featured: 1 },
    { id: 3,  category_slug: "selecoes",   name: "Lasanha à Parmegiana", price: 51.9, description: "Berinjela, molho sugo e camadas generosas de parmesão.", ingredients: "Berinjela,molho sugo,parmesão,massa fresca", badge: "Especial", featured: 1 },
    { id: 4,  category_slug: "clasicos",   name: "Lasanha à Bolonhesa", price: 42.9, description: "Molho à bolonhesa da casa, presunto e muçarela em camadas generosas.", ingredients: "Molho à bolonhesa,presunto,muçarela,massa fresca", badge: "Mais pedido", featured: 0 },
    { id: 5,  category_slug: "clasicos",   name: "Lasanha Quatro Queijos", price: 45.9, description: "Muçarela, prato, parmesão e gorgonzola com molho branco cremoso.", ingredients: "Muçarela,queijo prato,parmesão,gorgonzola,molho branco", badge: null, featured: 0 },
    { id: 6,  category_slug: "clasicos",   name: "Lasanha de Frango com Catupiry", price: 44.9, description: "Frango desfiado, catupiry original e um toque de requeijão.", ingredients: "Frango desfiado,catupiry,requeijão,molho branco", badge: null, featured: 0 },
    { id: 7,  category_slug: "deluxe",     name: "Lasanha de Ragu de Picanha", price: 58.9, description: "Ragu de picanha ao molho de tomate rústico, finalizada com parmesão.", ingredients: "Ragu de picanha,molho de tomate,parmesão,massa fresca", badge: "Deluxe", featured: 0 },
    { id: 8,  category_slug: "deluxe",     name: "Lasanha de Camarão", price: 62.9, description: "Camarões salteados com molho branco de ervas e muçarela.", ingredients: "Camarão,molho branco,ervas,muçarela", badge: "Deluxe", featured: 0 },
    { id: 9,  category_slug: "especiais",  name: "Lasanha de Palmito", price: 48.9, description: "Palmito fresco, molho branco leve e ervas finas. Opção vegetariana.", ingredients: "Palmito,molho branco,ervas finas,massa fresca", badge: "Veggie", featured: 0 },
    { id: 10, category_slug: "especiais",  name: "Lasanha de Legumes Grelhados", price: 43.9, description: "Abobrinha, berinjela e pimentões grelhados ao sugo. Opção vegetariana.", ingredients: "Abobrinha,berinjela,pimentão,molho sugo", badge: "Veggie", featured: 0 },
    { id: 11, category_slug: "especiais",  name: "Lasanha de Berinjela", price: 42.9, description: "Berinjela assada, molho sugo e queijos derretidos. Opção vegetariana.", ingredients: "Berinjela,molho sugo,muçarela,parmesão", badge: "Veggie", featured: 0 },
    { id: 12, category_slug: "doces",      name: "Lasanha de Chocolate", price: 32.9, description: "Camadas de massa fina, creme de chocolate e ganache.", ingredients: "Chocolate,ganache,massa fina", badge: "Doce", featured: 0 },
    { id: 13, category_slug: "doces",      name: "Lasanha de Doce de Leite", price: 32.9, description: "Doce de leite artesanal com um toque de canela.", ingredients: "Doce de leite,canela,massa fina", badge: "Doce", featured: 0 },
    { id: 14, category_slug: "sobremesas", name: "Lasanha de Banana com Canela", price: 29.9, description: "Banana caramelizada e creme, polvilhada com canela.", ingredients: "Banana,caramelo,canela,creme", badge: "Sobremesa", featured: 0 },
    { id: 15, category_slug: "sobremesas", name: "Lasanha de Morango com Creme", price: 34.9, description: "Morangos frescos com creme delicado e calda da casa.", ingredients: "Morango,creme,calda da casa", badge: "Sobremesa", featured: 0 },
    { id: 16, category_slug: "sobremesas", name: "Petit Lasagna de Nutella", price: 31.9, description: "Massa fina com creme de avelã e crocante de avelãs.", ingredients: "Creme de avelã,avelã,massa fina", badge: "Sobremesa", featured: 0 },
  ],
  areas: [
    { id: 1, name: "Jardim Interlagos", fee: 5.9 },
    { id: 2, name: "Jardim Aurélia", fee: 5.9 },
    { id: 3, name: "Centro", fee: 7.9 },
    { id: 4, name: "Jardim Chapadão", fee: 7.9 },
    { id: 5, name: "Jardim Eulina", fee: 8.9 },
    { id: 6, name: "Cambuí", fee: 8.9 },
  ],
  settings: { delivery_enabled: "1", pickup_enabled: "1", payment_pix: "1", payment_cash: "1", payment_debit: "1", payment_credit: "1" },
  customer: null,
};
const COUPONS = { LAPANINI10: 0.1, QUARTA: 0.15 };
const WHATSAPP_NUMBER = "5519994048354";

/* Adicionais por produto */
(function buildAddons() {
  const rows = [];
  let opt = 1000;
  const savory = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const sweet = [12, 13, 14, 15, 16];
  savory.forEach(pid => {
    rows.push({ product_id: pid, group_id: 1, group_name: "Tamanho", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Individual (500 g)", price: 0 });
    rows.push({ product_id: pid, group_id: 1, group_name: "Tamanho", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Familiar (800 g)", price: 18 });
    rows.push({ product_id: pid, group_id: 2, group_name: "Molho extra", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Sem molho extra", price: 0 });
    rows.push({ product_id: pid, group_id: 2, group_name: "Molho extra", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Sugo da casa", price: 2.5 });
    rows.push({ product_id: pid, group_id: 2, group_name: "Molho extra", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Molho branco", price: 3 });
    rows.push({ product_id: pid, group_id: 3, group_name: "Adicionais", min_select: 0, max_select: 3, selection_type: "multi", option_id: opt++, option_name: "Muçarela extra", price: 4 });
    rows.push({ product_id: pid, group_id: 3, group_name: "Adicionais", min_select: 0, max_select: 3, selection_type: "multi", option_id: opt++, option_name: "Parmesão ralado", price: 2.5 });
    rows.push({ product_id: pid, group_id: 3, group_name: "Adicionais", min_select: 0, max_select: 3, selection_type: "multi", option_id: opt++, option_name: "Bacon crocante", price: 5.5 });
    rows.push({ product_id: pid, group_id: 3, group_name: "Adicionais", min_select: 0, max_select: 3, selection_type: "multi", option_id: opt++, option_name: "Catupiry", price: 4.5 });
  });
  sweet.forEach(pid => {
    rows.push({ product_id: pid, group_id: 4, group_name: "Cobertura", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Calda da casa", price: 0 });
    rows.push({ product_id: pid, group_id: 4, group_name: "Cobertura", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Chantilly", price: 3 });
    rows.push({ product_id: pid, group_id: 4, group_name: "Cobertura", min_select: 1, max_select: 1, selection_type: "single", option_id: opt++, option_name: "Sorvete de creme", price: 5 });
    rows.push({ product_id: pid, group_id: 5, group_name: "Adicionais", min_select: 0, max_select: 2, selection_type: "multi", option_id: opt++, option_name: "Calda extra", price: 3 });
    rows.push({ product_id: pid, group_id: 5, group_name: "Adicionais", min_select: 0, max_select: 2, selection_type: "multi", option_id: opt++, option_name: "Avelãs crocantes", price: 2.5 });
  });
  MENU.addons = rows;
})();

/* ---------- Imagens SVG geradas (arte de lasanha por categoria) ---------- */
const TINTS = {
  selecoes: ["#7A3A10", "#F26B21", "#FFB35C"],
  clasicos: ["#6E2E10", "#E85A1F", "#FF9C55"],
  deluxe: ["#6E1F0F", "#D14A12", "#FF7B31"],
  especiais: ["#6E3A10", "#D9A441", "#F2C76A"],
  doces: ["#5E2440", "#D96A8C", "#F2A9C4"],
  sobremesas: ["#5E3A10", "#C9864A", "#E8B076"],
};
function art(slug) {
  const [dark, base, light] = TINTS[slug] || TINTS.clasicos;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#241608"/><stop offset="1" stop-color="#120c07"/></linearGradient></defs><rect width="400" height="300" fill="url(#b)"/><ellipse cx="200" cy="222" rx="150" ry="42" fill="#0a0806" opacity=".7"/><ellipse cx="200" cy="150" rx="150" ry="150" fill="#2a1c12"/><ellipse cx="200" cy="150" rx="134" ry="134" fill="#1a110b"/><ellipse cx="200" cy="148" rx="120" ry="120" fill="${dark}"/><ellipse cx="200" cy="146" rx="102" ry="102" fill="${base}"/><ellipse cx="200" cy="144" rx="84" ry="84" fill="${light}"/><ellipse cx="200" cy="142" rx="66" ry="66" fill="${base}"/><ellipse cx="200" cy="140" rx="46" ry="46" fill="#FFE0A6"/><ellipse cx="200" cy="138" rx="26" ry="26" fill="${base}"/><ellipse cx="200" cy="136" rx="12" ry="12" fill="#8A4B22"/><path d="M120 196q40-40 80-30q50-14 80 20" fill="#FFE0A6" opacity=".85"/><g stroke="rgba(255,255,255,.5)" stroke-width="6" stroke-linecap="round" fill="none"><path d="M168 56c-6-22 8-38 2-60"/><path d="M208 66c-6-22 8-38 2-60" opacity=".8"/><path d="M244 56c-6-22 8-38 2-60" opacity=".6"/></g></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* ---------- Reveal ao rolar ---------- */
const fadeObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); fadeObserver.unobserve(entry.target); }
  }), { threshold: .12, rootMargin: "0px 0px -35px" })
  : null;
function observeFadeUps() {
  qsa(".benefits>div,.row-title,.card,.promo>div,.promo>strong,.steps header,.steps article,.faq>p,.faq>h2,.faq>span,.faq details,body>footer>*").forEach((element, index) => {
    if (element.dataset.fadeReady) return;
    element.dataset.fadeReady = "1";
    element.classList.add("fade-up");
    element.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
    if (fadeObserver) fadeObserver.observe(element);
    else element.classList.add("is-visible");
  });
}

/* ============================================================
   Cardápio / Carrossel
   ============================================================ */
state.menu = MENU;
renderCategories();
renderRows();
setupCategorySync();
save();

function renderCategories() {
  const c = qs("#categories");
  const order = ["selecoes", "clasicos", "deluxe", "especiais", "doces", "sobremesas"];
  const data = [...MENU.categories].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  c.insertAdjacentHTML("beforeend", data.map(x => `<button data-category="${esc(x.slug)}">${esc(x.name)}</button>`).join(""));
}

function renderRows() {
  const ps = MENU.products;
  const groups = [
    ["featured", "Mais pedidos", "OS FAVORITOS DA CASA", "As lasanhas que já conquistaram muitas mesas.", ps.filter(p => +p.featured)],
    ["selecoes", "Seleções especiais", "ESCOLHA A SUA", "Receitas autorais assinadas La Panini.", ps.filter(p => p.category_slug === "selecoes")],
    ["clasicos", "Clássicos", "OS TRADICIONAIS", "As que todo mundo ama e pede de novo.", ps.filter(p => p.category_slug === "clasicos")],
    ["deluxe", "Deluxe", "O TOPO DA CASA", "Camadas generosas para ocasiões especiais.", ps.filter(p => p.category_slug === "deluxe")],
    ["especiais", "Especiais", "OPÇÕES LEVES", "Sabores frescos, incluindo as vegetarianas.", ps.filter(p => p.category_slug === "especiais")],
    ["doces", "Doces", "PRA FECHAR COM DOCE", "Para fechar a noite com doçura.", ps.filter(p => p.category_slug === "doces")],
    ["sobremesas", "Sobremesas", "PORÇÕES DE CARINHO", "Pequenas porções que valem um capítulo.", ps.filter(p => p.category_slug === "sobremesas")],
  ];
  const rowsEl = qs("#menuRows");
  rowsEl.className = "menu-rows";
  rowsEl.innerHTML = groups.filter(([, , , , items]) => items.length).map(([slug, name, eyebrow, subtitle, items], row) => `
    <section class="menu-row" id="cat-${slug}" data-cat-section="${slug}">
      <div class="row-title">
        <div>
          <p>${eyebrow}</p>
          <h2>${esc(name)}</h2>
        </div>
        <span>${esc(subtitle)}</span>
      </div>
      <div class="carousel-shell">
        <button class="carousel-arrow previous" type="button" data-carousel="${row}" data-direction="-1" aria-label="Lasanhas anteriores">‹</button>
        <div class="carousel" data-carousel-track="${row}">${items.map(card).join("")}</div>
        <button class="carousel-arrow next" type="button" data-carousel="${row}" data-direction="1" aria-label="Próximas lasanhas">›</button>
      </div>
    </section>`).join("") || '<p style="padding:30px">Nenhuma lasanha nesta categoria.</p>';
  qsa("[data-product]").forEach(b => b.onclick = () => openProduct(+b.dataset.product));
  observeFadeUps();
  qsa("[data-direction]").forEach(button => button.onclick = () => {
    const track = qs(`[data-carousel-track="${button.dataset.carousel}"]`);
    if (!track) return;
    const firstCard = qs(".card", track);
    if (firstCard) track.scrollBy({ left: Number(button.dataset.direction) * (firstCard.getBoundingClientRect().width + 18), behavior: "smooth" });
  });
}

function card(p) {
  return `<article class="card" data-product="${+p.id}" role="button" tabindex="0" aria-label="Abrir ${esc(p.name)}">
    <figure><img src="${art(p.category_slug)}" alt="${esc(p.name)}" loading="lazy">${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}</figure>
    <div class="card-content">
      <small>${esc(categoryName(p).toUpperCase())}</small>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.description)}</p>
      <footer><b>${money(p.price)}</b><button type="button" aria-label="Abrir ${esc(p.name)}">+</button></footer>
    </div>
  </article>`;
}

/* ---------- Sincronização de categorias (scroll-spy) ---------- */
function setupCategorySync() {
  const bar = qs("#categories");
  if (!bar) return;
  const buttons = qsa("[data-category]", bar);
  const sections = qsa("[data-cat-section]");
  let ticking = false;
  const centerActive = () => {
    const act = buttons.find(b => b.classList.contains("active"));
    if (!act) return;
    const barLeft = bar.scrollLeft;
    const barRight = barLeft + bar.clientWidth;
    const elLeft = act.offsetLeft;
    const elRight = elLeft + act.offsetWidth;
    if (elLeft < barLeft + 4 || elRight > barRight - 4) {
      act.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  };
  const setActive = slug => {
    buttons.forEach(b => b.classList.toggle("active", b.dataset.category === slug));
    centerActive();
  };
  const sync = () => {
    const menu = qs("#cardapio");
    const menuTop = (menu?.getBoundingClientRect().top || 0) + window.scrollY;
    const probe = window.scrollY + 78;
    let current = "all";
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) current = sec.dataset.catSection;
    });
    if (window.scrollY < menuTop - 10) current = "all";
    setActive(current);
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { sync(); ticking = false; });
  };
  buttons.forEach(b => b.onclick = () => {
    setActive(b.dataset.category);
    const target = b.dataset.category === "all" ? qs("#cardapio") : qs(`[data-cat-section="${b.dataset.category}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  sync();
}

/* ---------- Modal do produto ---------- */
function openProduct(id) {
  const p = MENU.products.find(x => +x.id === id);
  if (!p) return;
  const ads = MENU.addons.filter(x => +x.product_id === id);
  const m = qs("#modal");
  const groups = ads.reduce((all, a) => {
    all[a.group_id] ??= { name: a.group_name, min: +a.min_select, max: +a.max_select, type: a.selection_type, items: [] };
    all[a.group_id].items.push(a);
    return all;
  }, {});
  const ingredients = (p.ingredients || p.description || "").split(",").map(x => x.trim()).filter(Boolean).slice(0, 7);
  m.hidden = false;
  document.body.classList.add("modal-open");
  m.innerHTML = `<div class="modal-card product-modal">
    <div class="modal-photo"><img src="${art(p.category_slug)}" alt="${esc(p.name)}"></div>
    <div class="modal-body">
      <button class="modal-close" aria-label="Fechar">×</button>
      <small class="modal-category">${esc(categoryName(p))}</small>
      <h2>${esc(p.name)}</h2>
      <p class="modal-description">${esc(p.description)}</p>
      ${Object.values(groups).map(g => `
        <section class="option-block">
          <header><div><h4>${esc(g.name)}</h4><small>${g.min ? `Escolha de ${g.min} a ${g.max}` : "Opcional"}</small></div></header>
          ${g.items.map(a => `<label><input type="${g.type === "single" ? "radio" : "checkbox"}" name="addon${g.type === "single" ? `-${a.group_id}` : ""}" value="${+a.option_id}" data-price="${+a.price}"><span>${esc(a.option_name)}</span><b>${a.price ? "+ " + money(a.price) : "Incluso"}</b></label>`).join("")}
        </section>`).join("")}
      ${ingredients.length ? `
        <section class="option-block">
          <header><div><h4>Quer tirar algo?</h4><small>Opcional</small></div></header>
          ${ingredients.map(i => `<label><input type="checkbox" name="remove" value="${esc(i)}"><span>Sem ${esc(i.toLowerCase())}</span></label>`).join("")}
        </section>` : ""}
      <label class="note"><span>Observação</span><textarea id="notes" maxlength="500" placeholder="Ex.: cortar ao meio, molho à parte..."></textarea></label>
      <div class="modal-add">
        <div class="stepper"><button type="button" data-qty="-1">−</button><b id="qtyValue">1</b><button type="button" data-qty="1">+</button></div>
        <button class="primary" id="add"><span>Adicionar</span><strong id="modalTotal">${money(p.price)}</strong></button>
      </div>
    </div>
  </div>`;
  let qty = 1;
  const close = () => { m.hidden = true; document.body.classList.remove("modal-open"); };
  const update = () => {
    const extra = qsa("[data-price]:checked", m).reduce((s, x) => s + Number(x.dataset.price), 0);
    qs("#modalTotal", m).textContent = money((Number(p.price) + extra) * qty);
  };
  qs(".modal-close", m).onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  qsa("[data-price]", m).forEach(x => x.onchange = update);
  qsa("[data-qty]", m).forEach(b => b.onclick = () => {
    qty = Math.max(1, Math.min(20, qty + Number(b.dataset.qty)));
    qs("#qtyValue", m).textContent = qty;
    update();
  });
  qs("#add", m).onclick = () => {
    const removed = qsa("[name=remove]:checked", m).map(x => `Sem ${x.value}`).join(", ");
    const typed = qs("#notes", m).value.trim();
    state.cart.push({ product_id: id, quantity: qty, addons: qsa("[data-price]:checked", m).map(x => +x.value), notes: [removed, typed].filter(Boolean).join(" — ") });
    save();
    close();
    openCart();
    toast("Lasanha adicionada à sacola");
  };
}

document.addEventListener("keydown", e => {
  const c = e.target.closest?.(".card[data-product]");
  if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProduct(+c.dataset.product); }
});

/* ============================================================
   Sacola
   ============================================================ */
function cartTotals() {
  let subtotal = 0;
  state.cart.forEach(i => {
    const p = MENU.products.find(x => +x.id === +i.product_id);
    if (!p) return;
    let u = +p.price;
    i.addons.forEach(id => u += +(MENU.addons.find(a => +a.option_id === +id)?.price || 0));
    subtotal += u * i.quantity;
  });
  const discount = state.coupon ? subtotal * (COUPONS[state.coupon.code] || 0) : 0;
  return { subtotal, discount };
}

function openCart() {
  const a = qs("#cart");
  a.hidden = false;
  const t = cartTotals();
  const settings = MENU.settings || {};
  const fulfillment = [
    settings.delivery_enabled !== "0" ? '<option value="delivery">Entrega</option>' : "",
    settings.pickup_enabled !== "0" ? '<option value="pickup">Retirada grátis</option>' : "",
  ].join("");
  const payments = [
    ["pix", "Pix na entrega"],
    ["cash", "Dinheiro na entrega"],
    ["debit", "Débito na entrega"],
    ["credit", "Crédito na entrega"],
  ].filter(([key]) => settings[`payment_${key}`] !== "0").map(([key, label]) => `<option value="${key}">${label}</option>`).join("");
  const customer = state.menu.customer;
  const account = customer
    ? `<div class="account-ready"><span>Conta conectada</span><p>Olá, <b>${esc(customer.name)}</b>.</p><button type="button" id="accountLogout">Sair</button></div>`
    : `<details class="account-box"><summary>Acesse sua conta</summary>
       <form id="account" class="account-form">
       <label class="register-only">Nome<input name="name" autocomplete="name"></label>
       <label class="register-only">WhatsApp<input name="phone" inputmode="tel" autocomplete="tel"></label>
       <label>E-mail<input type="email" name="email" autocomplete="email"></label>
       <label>Senha<input type="password" name="password" minlength="10" autocomplete="current-password"></label>
       <button type="submit" name="mode" value="login">Entrar</button>
       <small id="accountHint">Entre para continuar seu pedido.</small></form></details>`;
  a.innerHTML = `<header><h2>Sua sacola</h2><button data-cart-close>×</button></header>
    ${account}
    ${state.cart.map((i, n) => {
      const p = MENU.products.find(x => +x.id === +i.product_id);
      return `<div class="cart-item"><b>${i.quantity}× ${p.name}</b><button data-remove="${n}">Remover</button><span>${money(unitPrice(i) * i.quantity)}</span></div>`;
    }).join("") || '<p>Sua sacola está vazia.</p>'}
    <button type="button" class="continue-shopping">← Continuar comprando</button>
    <form id="checkout"><h3>Finalizar pedido</h3>
      <label>Nome<input name="customer_name" required value="${customer?.name || ""}"></label>
      <label>WhatsApp<input name="customer_phone" required value="${customer?.phone || ""}"></label>
      <label>E-mail<input type="email" name="customer_email" required value="${customer?.email || ""}"></label>
      <label>Recebimento<select name="fulfillment">${fulfillment}</select></label>
      <label>Bairro<select name="delivery_area_id">${MENU.areas.map(x => `<option value="${x.id}">${x.name} · ${money(x.fee)}</option>`).join("")}</select></label>
      <label>Endereço<input name="address_line"></label>
      <label>Número<input name="address_number"></label>
      <label>Complemento<input name="address_complement"></label>
      <label>Pagamento<select name="payment_method">${payments}</select></label>
      <label>Cupom<input name="coupon_code" value="${state.coupon?.code || ""}"></label>
      <button type="button" id="couponApply">Aplicar cupom</button>
      <p>Subtotal <b>${money(t.subtotal)}</b><br>Desconto <b>${money(t.discount)}</b></p>
      <button ${!state.cart.length ? "disabled" : ""}>Enviar pedido</button>
    </form>`;
  setupCartAccount(a);
  setupCheckoutSteps(a);
  qs("[data-cart-close]", a).onclick = () => a.hidden = true;
  qs(".continue-shopping", a).onclick = () => { a.hidden = true; qs("#cardapio")?.scrollIntoView({ behavior: "smooth" }); };
  qsa("[data-remove]", a).forEach(b => b.onclick = () => { state.cart.splice(+b.dataset.remove, 1); save(); openCart(); });
  qs("#couponApply", a).onclick = applyCoupon;
  qs("#checkout", a).onsubmit = checkout;
  if (qs("#account", a)) qs("#account", a).onsubmit = accountSubmit;
  if (qs("#accountLogout", a)) qs("#accountLogout", a).onclick = accountLogout;
}

function unitPrice(item) {
  const p = MENU.products.find(x => +x.id === +item.product_id);
  let u = +p.price;
  (item.addons || []).forEach(id => u += +(MENU.addons.find(a => +a.option_id === +id)?.price || 0));
  return u;
}

function setupCartAccount(root) {
  const form = qs("#account", root);
  if (!form) return;
  let heading = qs("h3", form);
  if (!heading) { heading = document.createElement("h3"); form.prepend(heading); }
  const registerOnly = qsa(".register-only", form);
  const submit = qs("[name=mode]", form);
  const hint = qs("#accountHint", form);
  const tabs = document.createElement("div");
  tabs.className = "account-tabs cart-account-tabs";
  tabs.innerHTML = '<button type="button" class="active" data-cart-account="login">Entrar</button><button type="button" data-cart-account="register">Cadastrar</button>';
  heading.after(tabs);
  const show = mode => {
    const isRegister = mode === "register";
    registerOnly.forEach(el => el.hidden = !isRegister);
    submit.value = isRegister ? "register" : "login";
    submit.textContent = isRegister ? "Criar minha conta" : "Entrar";
    heading.textContent = isRegister ? "Crie sua conta" : "Acesse sua conta";
    hint.textContent = isRegister ? "Preencha nome, WhatsApp, e-mail e uma senha de 10 caracteres." : "Use seu e-mail e senha para entrar.";
    qsa("[data-cart-account]", tabs).forEach(button => button.classList.toggle("active", button.dataset.cartAccount === mode));
    qs("[name=password]", form).autocomplete = isRegister ? "new-password" : "current-password";
  };
  qsa("[data-cart-account]", tabs).forEach(button => button.onclick = () => show(button.dataset.cartAccount));
  show("login");
}

function setupCheckoutSteps(root) {
  const form = qs("#checkout", root);
  if (!form) return;
  const title = qs("h3", form);
  const submit = qs("button:not([type])", form);
  const coupon = qs("[name=coupon_code]", form)?.closest("label");
  const apply = qs("#couponApply", form);
  const totals = qsa("p", form).find(p => p.textContent.includes("Subtotal"));
  const names = [["customer_name", "customer_phone", "customer_email"], ["fulfillment", "delivery_area_id", "address_line", "address_number", "address_complement"], ["payment_method"]];
  const nav = document.createElement("nav");
  nav.className = "checkout-progress";
  nav.innerHTML = '<b class="active">1 Pedido</b><b>2 Endereço</b><b>3 Pagamento</b>';
  title.after(nav);
  const panes = names.map((group, index) => {
    const pane = document.createElement("section");
    pane.className = "checkout-pane";
    pane.dataset.checkoutStep = String(index);
    group.forEach(name => {
      const label = qs(`[name="${name}"]`, form)?.closest("label");
      if (label) pane.append(label);
    });
    return pane;
  });
  if (coupon) panes[0].append(coupon);
  if (apply) panes[0].append(apply);
  if (totals) panes[0].append(totals);
  panes[2].insertAdjacentHTML("afterbegin", '<p class="payment-note"><b>Pagamento somente na entrega ou retirada.</b><br>Não cobramos nada pelo site.</p>');
  panes.forEach((pane, index) => {
    pane.hidden = index !== 0;
    if (index < 2) pane.insertAdjacentHTML("beforeend", `<button type="button" class="checkout-next" data-next="${index + 1}">Continuar →</button>`);
    if (index > 0) pane.insertAdjacentHTML("beforeend", `<button type="button" class="checkout-back" data-back="${index - 1}">← Voltar</button>`);
    form.append(pane);
  });
  if (submit) panes[2].append(submit);
  const show = step => {
    panes.forEach((pane, index) => pane.hidden = index !== step);
    qsa("b", nav).forEach((item, index) => item.classList.toggle("active", index <= step));
  };
  qsa("[data-next]", form).forEach(button => button.onclick = () => show(+button.dataset.next));
  qsa("[data-back]", form).forEach(button => button.onclick = () => show(+button.dataset.back));
}

/* ---------- Conta (local) ---------- */
function accountSubmit(e) {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.target));
  const mode = e.submitter?.value || payload.mode || "login";
  if (mode === "register") {
    if ((payload.name || "").trim().length < 2 || (payload.phone || "").replace(/\D/g, "").length < 10) {
      return toast("Preencha nome e WhatsApp para criar sua conta");
    }
    const account = { name: payload.name.trim(), email: payload.email.trim().toLowerCase(), phone: payload.phone.trim(), password: payload.password, address_line: "", address_number: "", address_complement: "" };
    localStorage.setItem("lapanini_account", JSON.stringify(account));
    state.menu.customer = account;
    toast("Conta criada com sucesso");
  } else {
    const saved = JSON.parse(localStorage.getItem("lapanini_account") || "null");
    if (!saved || saved.email !== payload.email.trim().toLowerCase() || saved.password !== payload.password) {
      return toast("E-mail ou senha inválidos");
    }
    state.menu.customer = saved;
    toast("Login realizado");
  }
  openCart();
}

function accountLogout() {
  state.menu.customer = null;
  openCart();
}

/* ---------- Minha conta (modal) ---------- */
function openAccount() {
  const m = qs("#modal");
  m.hidden = false;
  document.body.classList.add("modal-open");
  const connected = state.menu?.customer;
  m.innerHTML = `<div class="account-panel">
    <header><p>MINHA CONTA</p><h2>${connected ? "Olá, " + esc(connected.name) : "Acesse sua conta"}</h2><button class="modal-close" aria-label="Fechar">×</button></header>
    ${connected
      ? `<div class="account-ready"><span>Conta conectada</span><p>${esc(connected.email)}</p><button type="button" id="modalAccountLogout">Sair da conta</button></div><section class="account-history"><div class="account-loading">Carregando seus pedidos…</div></section>`
      : `<div class="account-tabs" role="tablist"><button type="button" class="active" data-account-tab="login">Entrar</button><button type="button" data-account-tab="register">Fazer cadastro</button></div>
         <form id="modalAccount" class="account-form"><input type="hidden" name="mode" value="login">
           <div class="register-fields" hidden><label>Nome<input name="name" autocomplete="name" placeholder="Como podemos chamar você?"></label><label>WhatsApp<input name="phone" inputmode="tel" autocomplete="tel" placeholder="(19) 99999-9999"></label></div>
           <label>E-mail<input type="email" name="email" required autocomplete="email" placeholder="voce@email.com"></label>
           <label>Senha<input type="password" name="password" minlength="10" required autocomplete="current-password" placeholder="Mínimo de 10 caracteres"></label>
           <button type="submit" class="primary account-submit" value="login">Entrar</button>
         </form>`}
  </div>`;
  const close = () => { m.hidden = true; document.body.classList.remove("modal-open"); };
  qs(".modal-close", m).onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  qsa("[data-account-tab]", m).forEach(tab => tab.onclick = () => {
    const register = tab.dataset.accountTab === "register";
    const form = qs("#modalAccount", m);
    qsa("[data-account-tab]", m).forEach(item => item.classList.toggle("active", item === tab));
    qs("[name=mode]", form).value = register ? "register" : "login";
    qs(".register-fields", form).hidden = !register;
    qs(".account-submit", form).textContent = register ? "Criar minha conta" : "Entrar";
    qs(".account-submit", form).value = register ? "register" : "login";
    qs("[name=password]", form).autocomplete = register ? "new-password" : "current-password";
  });
  qs("#modalAccount", m)?.addEventListener("submit", async e => {
    await accountSubmit(e);
    if (state.menu.customer) openAccount();
  });
  qs("#modalAccountLogout", m)?.addEventListener("click", () => {
    state.menu.customer = null;
    openAccount();
  });
  if (connected) renderAccountHistory(m);
}

function renderAccountHistory(m) {
  const history = qs(".account-history", m);
  if (!history) return;
  const orders = loadOrders().filter(o => (o.customer?.email || "").toLowerCase() === (state.menu.customer.email || "").toLowerCase());
  history.innerHTML = `<h3>Últimos pedidos</h3>` +
    (orders.length
      ? orders.map((o, n) => `
        <article><div><b>#${esc(o.order_number)}</b><span>${new Date(o.created_at).toLocaleDateString("pt-BR")} · ${esc(statusLabel(orderStatus(o)))}</span></div><strong>${money(o.total)}</strong>
        <div class="account-order-actions"><button type="button" data-order-track="${n}">Acompanhar</button><button type="button" class="primary" data-order-repeat="${n}">Repetir pedido</button></div></article>`).join("")
      : "<p>Você ainda não fez nenhum pedido.</p>");
  qsa("[data-order-track]", history).forEach(button => button.onclick = () => { closeModal(); openTracker(); });
  qsa("[data-order-repeat]", history).forEach(button => {
    button.onclick = () => {
      const order = orders[+button.dataset.orderRepeat];
      state.cart = order.items.filter(item => MENU.products.some(product => +product.id === +item.product_id)).map(item => ({ product_id: +item.product_id, quantity: +item.quantity, addons: item.addons || [], notes: item.notes || "" }));
      save();
      closeModal();
      openCart();
      toast(state.cart.length ? "Pedido adicionado à sacola" : "Os itens deste pedido não estão mais disponíveis");
    };
  });
}

function closeModal() { const m = qs("#modal"); m.hidden = true; document.body.classList.remove("modal-open"); }

/* ============================================================
   Cupom
   ============================================================ */
async function applyCoupon() {
  const code = qs("[name=coupon_code]", qs("#cart")).value.trim().toUpperCase();
  if (!code) return toast("Digite um cupom");
  if (COUPONS[code]) {
    state.coupon = { code };
    toast(`Cupom ${code} aplicado: ${COUPONS[code] * 100}% OFF`);
  } else {
    state.coupon = null;
    toast("Cupom inválido ou expirado");
  }
  openCart();
}

/* ============================================================
   Checkout
   ============================================================ */
async function checkout(e) {
  e.preventDefault();
  if (!state.cart.length) return toast("Sua sacola está vazia");
  const f = Object.fromEntries(new FormData(e.target));
  if (f.fulfillment !== "pickup" && !((f.address_line || "").trim() && (f.address_number || "").trim())) {
    return toast("Informe o endereço e o número da entrega");
  }
  const t = cartTotals();
  const fee = f.fulfillment === "pickup" ? 0 : (MENU.areas.find(x => +x.id === +f.delivery_area_id)?.fee || 0);
  const total = t.subtotal - t.discount + fee;
  const order = {
    order_number: String(Math.floor(1000 + Math.random() * 9000)),
    created_at: new Date().toISOString(),
    status: "received",
    customer: { name: f.customer_name, phone: f.customer_phone, email: f.customer_email },
    fulfillment: f.fulfillment,
    address: f.fulfillment === "pickup" ? "Retirada grátis (Rua Osvaldo Serra, 193)" : `${f.address_line}, ${f.address_number}${f.address_complement ? " — " + f.address_complement : ""}`,
    payment: f.payment_method,
    coupon: state.coupon?.code || null,
    items: state.cart,
    subtotal: t.subtotal,
    discount: t.discount,
    delivery_fee: fee,
    total,
  };
  const orders = loadOrders();
  orders.unshift(order);
  localStorage.setItem("lapanini_orders", JSON.stringify(orders));

  const lines = state.cart.map(i => {
    const p = MENU.products.find(x => +x.id === +i.product_id);
    const addons = (i.addons || []).map(id => MENU.addons.find(a => +a.option_id === +id)?.option_name).filter(Boolean).join(", ");
    return `• ${i.quantity}x ${p.name}${addons ? " (" + addons + ")" : ""} — ${money(unitPrice(i) * i.quantity)}`;
  });
  const msg = [
    "*NOVO PEDIDO — LA PANINI*",
    "",
    ...lines,
    "",
    `Subtotal: ${money(t.subtotal)}`,
    ...(state.coupon ? [`Cupom (${state.coupon.code}): -${money(t.discount)}`] : []),
    `Entrega: ${fee ? money(fee) : "Grátis"}`,
    `*Total: ${money(total)}*`,
    "",
    `👤 ${f.customer_name}`,
    `📱 ${f.customer_phone}`,
    `📧 ${f.customer_email}`,
    `📍 ${order.address}`,
    `💳 Pagamento: ${f.payment_method}`,
    `🕒 Estimativa: 35–55 min`,
  ].join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

  state.cart = [];
  state.coupon = null;
  save();
  qs("#cart").innerHTML = `
    <header><h2>Pedido confirmado!</h2><button data-cart-close>×</button></header>
    <p style="margin-top:22px">Número <b>#${order.order_number}</b></p>
    <p>Total ${money(total)}</p>
    <p>Status: ${statusLabel(orderStatus(order))}</p>
    <p style="color:var(--muted);font-size:12px">Seu pedido foi enviado para o WhatsApp da La Panini. Acompanhe o status pelo botão "Acompanhar pedido".</p>
    <button data-cart-close>Acompanhar</button>`;
  qsa("[data-cart-close]", qs("#cart")).forEach(b => b.onclick = () => { qs("#cart").hidden = true; openTracker(); });
  toast("Pedido enviado para o WhatsApp!");
}

/* ============================================================
   Pedidos / Rastreio
   ============================================================ */
function loadOrders() {
  try { return JSON.parse(localStorage.getItem("lapanini_orders") || "[]"); } catch { return []; }
}
const FLOW = ["received", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STATUS_LABELS = { received: "Pedido recebido", confirmed: "Pedido confirmado", preparing: "Em preparação", out_for_delivery: "Saiu para entrega", delivered: "Entregue" };
function statusLabel(status) { return STATUS_LABELS[status] || status; }
function orderStatus(order) {
  const mins = Math.floor((Date.now() - new Date(order.created_at)) / 60000);
  const idx = Math.min(FLOW.length - 1, Math.floor(mins / 6));
  return FLOW[idx];
}

function openTracker() {
  const m = qs("#modal");
  m.hidden = false;
  document.body.classList.add("modal-open");
  const connected = state.menu?.customer;
  m.innerHTML = `<div class="tracker-modal">
    <button class="modal-close" aria-label="Fechar">×</button>
    <div id="trackerIntro">
      <p>ACOMPANHAMENTO</p>
      <h2>Acompanhar pedido</h2>
      <span>${connected ? "Buscando seu pedido mais recente…" : "Informe apenas o e-mail usado na compra."}</span>
      ${connected ? "" : `<form id="tracker"><label>E-mail<input type="email" name="email" autocomplete="email" required placeholder="voce@email.com"></label><button class="primary">Consultar pedido →</button></form>`}
    </div>
    <div id="trackResult"></div>
  </div>`;
  const close = () => { m.hidden = true; document.body.classList.remove("modal-open"); };
  qs(".modal-close", m).onclick = close;
  m.onclick = e => { if (e.target === m) close(); };
  const load = payload => {
    const orders = loadOrders();
    let order = orders.find(o => (o.customer?.email || "").toLowerCase() === (payload.email || "").toLowerCase());
    if (!order && !(payload.email || "").trim()) order = orders[0];
    if (!order) {
      qs("#trackResult", m).innerHTML = '<p class="track-error">Nenhum pedido encontrado com esse e-mail.</p>';
      return;
    }
    const status = orderStatus(order);
    const current = Math.max(0, FLOW.indexOf(status));
    qs("#trackerIntro", m).hidden = true;
    const times = { received: new Date(order.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    qs("#trackResult", m).innerHTML = `
      <p class="track-number">PEDIDO #${esc(order.order_number)}</p>
      <h2>${current >= 3 ? "A LA PANINI ESTÁ A CAMINHO." : "A PANINI ESTÁ ACESA."}</h2>
      <span>Pedido realizado em ${new Date(order.created_at).toLocaleString("pt-BR")}</span>
      <div class="track-progress">${FLOW.map((s, i) => `<i class="${i < current ? "done" : i === current ? "active" : ""}"></i>`).join("")}</div>
      <div class="track-steps">${FLOW.map((s, i) => `
        <article class="${i < current ? "done" : i === current ? "active" : ""}">
          <i>${i < current ? "✓" : i + 1}</i><b>${STATUS_LABELS[s]}</b><span>${i === current ? "Agora" : i === 0 ? times.received : "Aguardando"}</span>
        </article>`).join("")}</div>
      <a class="track-whatsapp" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">Falar com a La Panini no WhatsApp</a>`;
  };
  const form = qs("#tracker", m);
  if (form) form.onsubmit = e => {
    e.preventDefault();
    const button = qs("button", e.target);
    button.disabled = true;
    load(Object.fromEntries(new FormData(e.target)));
    button.disabled = false;
  };
  if (connected) load({ email: connected.email });
}

/* ============================================================
   Eventos globais / Tema / Navegação
   ============================================================ */
document.addEventListener("click", e => {
  const copy = e.target.closest("[data-copy]");
  if (copy) navigator.clipboard.writeText(copy.dataset.copy).then(() => toast("Cupom copiado"));
  if (e.target.closest("[data-close-offer]")) qs("#offer")?.remove();
  if (e.target.closest("[data-cart-open]")) openCart();
  if (e.target.closest("[data-track-open]")) openTracker();
  if (e.target.closest("[data-account-open]")) openAccount();
  if (e.target.closest("[data-theme]")) {
    document.body.classList.toggle("light");
    localStorage.setItem("lapanini_theme", document.body.classList.contains("light") ? "light" : "dark");
  }
});
if (localStorage.getItem("lapanini_theme") === "light") document.body.classList.add("light");

/* ---------- Categorias fixas ---------- */
(function stickyCategories() {
  const categories = qs("#categories");
  const anchor = qs(".categories-anchor");
  if (!categories || !anchor) return;
  let anchorTop = 0;
  const measure = () => {
    const fixed = categories.classList.contains("is-fixed");
    if (fixed) categories.classList.remove("is-fixed");
    anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
    if (fixed) categories.classList.add("is-fixed");
  };
  const update = () => {
    const fixed = window.scrollY >= anchorTop;
    categories.classList.toggle("is-fixed", fixed);
    anchor.classList.toggle("is-active", fixed);
  };
  measure();
  addEventListener("resize", () => { measure(); update(); }, { passive: true });
  addEventListener("scroll", update, { passive: true });
  update();
})();

observeFadeUps();
