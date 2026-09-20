/* ============================================================
   La Panini — Lasanhas Artesanais · app.js
   Catálogo, carrinho, cupom e pedido via WhatsApp
   ============================================================ */
"use strict";

const WHATSAPP_NUMBER = "5519994048354";

const PRODUCTS = [
  { id: 1, name: "Lasanha à Bolonhesa", cat: "Clássicos", price: 42.9, desc: "Molho à bolonhesa da casa, presunto e muçarela em camadas generosas.", badge: "Mais pedido", featured: true },
  { id: 2, name: "Lasanha Quatro Queijos", cat: "Clássicos", price: 45.9, desc: "Muçarela, prato, parmesão e gorgonzola com molho branco cremoso.", badge: "Clássica", featured: false },
  { id: 3, name: "Lasanha de Frango com Catupiry", cat: "Clássicos", price: 44.9, desc: "Frango desfiado, catupiry original e um toque de requeijão.", badge: null, featured: false },
  { id: 4, name: "Lasanha de Ragu de Picanha", cat: "Deluxe", price: 58.9, desc: "Ragu de picanha ao molho de tomate rústico, finalizada com parmesão.", badge: "Deluxe", featured: false },
  { id: 5, name: "Lasanha de Camarão ao Molho Branco", cat: "Deluxe", price: 62.9, desc: "Camarões salteados com molho branco de ervas e muçarela.", badge: "Deluxe", featured: false },
  { id: 6, name: "Lasanha de Palmito", cat: "Especiais", price: 48.9, desc: "Palmito fresco, molho branco leve e ervas finas.", badge: "Veggie", veg: true, featured: false },
  { id: 7, name: "Lasanha de Legumes Grelhados", cat: "Especiais", price: 43.9, desc: "Abobrinha, berinjela e pimentões grelhados ao sugo.", badge: "Veggie", veg: true, featured: false },
  { id: 8, name: "Lasanha da Casa", cat: "Seleções", price: 46.9, desc: "A receita assinada La Panini: ragu de carne, bechamel e massa fresca.", badge: "Mais pedido", featured: true },
  { id: 9, name: "Lasanha Caprese", cat: "Seleções", price: 49.9, desc: "Tomate confit, muçarela de búfala e manjericão fresco.", badge: "Especial", featured: true },
  { id: 10, name: "Monte a Sua — Bolonhesa", cat: "Personalizadas", price: 45.9, desc: "Escolha seus molhos e queijos. Sua lasanha, seu jeito.", badge: "Monte a sua", featured: false },
  { id: 11, name: "Monte a Sua — Frango & Catupiry", cat: "Personalizadas", price: 46.9, desc: "Combinações livres com ingredientes frescos da casa.", badge: "Monte a sua", featured: false },
  { id: 12, name: "Monte a Sua — Veggie", cat: "Personalizadas", price: 44.9, desc: "Legumes da estação e queijos de sua preferência.", badge: "Monte a sua", veg: true, featured: false },
  { id: 13, name: "Lasanha de Chocolate", cat: "Doces", price: 32.9, desc: "Camadas de massa fina, creme de chocolate e ganache.", badge: "Doce", featured: false },
  { id: 14, name: "Lasanha de Doce de Leite", cat: "Doces", price: 32.9, desc: "Doce de leite artesanal com toque de canela.", badge: "Doce", featured: false },
  { id: 15, name: "Lasanha de Banana com Canela", cat: "Sobremesas", price: 29.9, desc: "Banana caramelizada e creme, polvilhada com canela.", badge: "Sobremesa", featured: false },
  { id: 16, name: "Lasanha de Morango com Creme", cat: "Sobremesas", price: 34.9, desc: "Morangos frescos com creme delicado e calda.", badge: "Sobremesa", featured: false },
];

const BAIRROS = {
  "Retirada gratuita": 0,
  "Jardim Interlagos": 5.9,
  "Jardim Aurélia": 5.9,
  "Centro": 7.9,
  "Jardim Chapadão": 7.9,
  "Jardim Eulina": 8.9,
  "Cambuí": 8.9,
};

const COUPONS = { LAPANINI10: 0.1 };

/* ---------------- Estado ---------------- */
let cart = JSON.parse(localStorage.getItem("lapanini_cart") || "[]");
let appliedCoupon = null;
let currentCat = "Todos";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const money = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------------- Render: produtos ---------------- */
function productCard(p) {
  return `
  <article class="product" data-cat="${p.cat}" data-id="${p.id}">
    <div class="thumb">
      <div class="art"></div>
      <div class="layers"></div>
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      ${p.veg ? `<span class="veg" title="Opção vegetariana"></span>` : ""}
    </div>
    <div class="info">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="meta">
        <span class="price">${money(p.price)}<small>por unidade</small></span>
        <button class="add" onclick="addToCart(${p.id})" aria-label="Adicionar ${p.name}">+</button>
      </div>
    </div>
  </article>`;
}

function renderMenu() {
  const list = $("#products");
  const items = currentCat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === currentCat);
  list.innerHTML = items.map(productCard).join("");
  const empty = $("#featured-empty");
  if (empty) empty.remove();
  if (!items.length) {
    list.innerHTML = `<p class="empty" style="grid-column:1/-1"><b>—</b>Nada por aqui ainda nesta categoria.</p>`;
  }
}

function renderFeatured() {
  const favs = PRODUCTS.filter((p) => p.featured).slice(0, 3);
  $("#featured").innerHTML = favs.map(productCard).join("");
}

/* ---------------- Categorias ---------------- */
$$(".categories button").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".categories button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCat = btn.dataset.cat;
    renderMenu();
  });
});

/* ---------------- Carousel ---------------- */
let slide = 0;
function stepWidth() {
  const first = $("#products")?.querySelector(".product");
  if (!first) return 274;
  return first.getBoundingClientRect().width + 14;
}
function slideMenu(dir) {
  const wrap = $("#products");
  const n = wrap.children.length;
  if (!n) return;
  const per = window.innerWidth <= 760 ? 1 : 4;
  const max = Math.max(0, n - per);
  slide = Math.max(0, Math.min(slide + dir * per, max));
  wrap.scrollTo({ left: slide * stepWidth(), behavior: "smooth" });
}

/* ---------------- Carrinho ---------------- */
function saveCart() {
  localStorage.setItem("lapanini_cart", JSON.stringify(cart));
}

function addToCart(id) {
  const found = cart.find((i) => i.id === id);
  if (found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  bump("#count");
  bump("#mobile-count");
  bump("#float-count");
  if (window.innerWidth <= 520) openCart();
}

function bump(sel) {
  const el = $(sel);
  if (!el) return;
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function subtotal() {
  return cart.reduce((s, i) => s + PRODUCTS.find((p) => p.id === i.id).price * i.qty, 0);
}

function discountValue() {
  if (!appliedCoupon) return 0;
  return subtotal() * COUPONS[appliedCoupon];
}

function renderCart() {
  const wrap = $("#cart-items");
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  $("#count").textContent = totalQty;
  $("#mobile-count").textContent = totalQty;
  $("#float-count").textContent = totalQty;

  if (!cart.length) {
    wrap.innerHTML = `<p class="empty"><b>✦</b>Sua sacola está vazia.<br>Que tal uma lasanha da casa?</p>`;
  } else {
    wrap.innerHTML = cart.map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `
      <div class="cart-item">
        <h4>${p.name}</h4>
        <span class="price">${money(p.price * i.qty)}</span>
        <p>${money(p.price)} cada</p>
        <div class="qty">
          <button onclick="changeQty(${i.id},-1)" aria-label="Diminuir">−</button>
          <b>${i.qty}</b>
          <button onclick="changeQty(${i.id},1)" aria-label="Aumentar">+</button>
        </div>
        <button class="remove" onclick="removeItem(${i.id})">Remover</button>
      </div>`;
    }).join("");
  }

  const sub = subtotal();
  const disc = discountValue();
  $("#subtotal").textContent = money(sub);
  $("#discount-line").hidden = !disc;
  if (disc) $("#discount").textContent = `- ${money(disc)}`;
  $("#total").textContent = money(sub - disc);
  $("#mobile-total").textContent = money(sub - disc);
  $("#coupon-input").classList.toggle("discount-ok", !!appliedCoupon);
}

/* ---------------- Cupom ---------------- */
function coupon() {
  const input = $("#coupon-input");
  const code = input.value.trim().toUpperCase();
  if (!code) return;
  if (COUPONS[code]) {
    appliedCoupon = code;
    input.value = code;
    renderCart();
    toast(`Cupom ${code} aplicado! ${COUPONS[code] * 100}% OFF`);
  } else {
    appliedCoupon = null;
    renderCart();
    toast("Cupom inválido ou expirado.");
    $("#coupon-input").classList.add("shake");
    setTimeout(() => $("#coupon-input").classList.remove("shake"), 450);
  }
}

/* ---------------- Sacola / Modal ---------------- */
function openCart() { document.body.classList.add("cart-open"); }
function closeAll() { document.body.classList.remove("cart-open"); $("#modal").classList.remove("open"); }

function track() {
  openModal(`
    <button class="close" onclick="closeAll()">×</button>
    <h3>Acompanhar pedido</h3>
    <p>Informe seu código ou número de WhatsApp para acompanharmos sua lasanha até a sua mesa.</p>
    <form onsubmit="trackSubmit(event)">
      <label>Número do pedido
        <input required placeholder="Ex.: 0042" inputmode="numeric">
      </label>
      <div class="actions">
        <button type="button" class="ghost" onclick="closeAll()">Cancelar</button>
        <button class="primary" type="submit">Acompanhar</button>
      </div>
    </form>
  `);
}

function trackSubmit(e) {
  e.preventDefault();
  const code = e.target.querySelector("input").value.trim();
  openModal(`
    <button class="close" onclick="closeAll()">×</button>
    <h3>Pedido #${code} — em produção 🔥</h3>
    <p>Sua lasanha está sendo montada. Assim que sair para entrega, você recebe uma mensagem no WhatsApp.</p>
    <div class="actions"><button class="primary" onclick="closeAll()">Entendi</button></div>
  `);
}

function openModal(html) {
  $("#modal").innerHTML = `<div class="modal-card">${html}</div>`;
  $("#modal").classList.add("open");
}

/* ---------------- Checkout ---------------- */
function checkout() {
  if (!cart.length) { toast("Sua sacola está vazia!"); return; }
  const options = Object.keys(BAIRROS).map((b) => `<option value="${b}">${b} — ${b.startsWith("Retirada") ? "Grátis" : money(BAIRROS[b])}</option>`).join("");
  openModal(`
    <button class="close" onclick="closeAll()">×</button>
    <h3>Finalizar pedido</h3>
    <p>Preencha os dados e confirme. Enviamos seu pedido direto para o WhatsApp da La Panini.</p>
    <form onsubmit="checkoutSubmit(event)">
      <label>Nome
        <input required placeholder="Seu nome">
      </label>
      <label>Telefone / WhatsApp
        <input required placeholder="(19) 90000-0000" inputmode="tel">
      </label>
      <label>Forma de recebimento
        <select id="delivery-select" onchange="deliveryNote()">
          ${options}
        </select>
      </label>
      <label id="address-field">Endereço de entrega
        <input placeholder="Rua, número, complemento e referência">
      </label>
      <label>Forma de pagamento
        <select id="payment-select">
          <option>Pix</option>
          <option>Dinheiro</option>
          <option>Cartão na entrega</option>
        </select>
      </label>
      <div class="actions">
        <button type="button" class="ghost" onclick="closeAll()">Voltar</button>
        <button class="primary" type="submit">Enviar pedido →</button>
      </div>
    </form>
  `);
}

function deliveryNote() {
  const val = $("#delivery-select").value;
  $("#address-field").style.display = val.startsWith("Retirada") ? "none" : "grid";
}

function checkoutSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const name = f.querySelector("input").value.trim();
  const phone = f.querySelectorAll("input")[1].value.trim();
  const delivery = $("#delivery-select").value;
  const fee = BAIRROS[delivery];
  const address = delivery.startsWith("Retirada") ? "Retirada no local (Rua Osvaldo Serra, 193)" : f.querySelector("#address-field input").value.trim();
  const payment = $("#payment-select").value;
  const sub = subtotal();
  const disc = discountValue();

  const lines = cart.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return `• ${i.qty}x ${p.name} — ${money(p.price * i.qty)}`;
  });

  const msg = [
    `*NOVO PEDIDO — LA PANINI*`,
    ``,
    ...lines,
    ``,
    `Subtotal: ${money(sub)}`,
    ...(disc ? [`Cupom (${appliedCoupon}): -${money(disc)}`] : []),
    `Entrega: ${fee ? money(fee) : "Grátis"}`,
    `*Total: ${money(sub - disc + fee)}*`,
    ``,
    `👤 ${name}`,
    `📱 ${phone}`,
    `📍 ${address}`,
    `💳 Pagamento: ${payment}`,
    `🕒 Estimativa: 35–55 min`,
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");

  cart = [];
  appliedCoupon = null;
  saveCart();
  renderCart();
  closeAll();
  toast("Pedido enviado para o WhatsApp!");
}

/* ---------------- Tema ---------------- */
function theme() {
  const t = $(".theme");
  t.classList.add("rotating");
  setTimeout(() => t.classList.remove("rotating"), 500);
  const dark = document.documentElement.dataset.theme === "dark";
  document.documentElement.dataset.theme = dark ? "light" : "dark";
  localStorage.setItem("lapanini_theme", dark ? "light" : "dark");
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(text) {
  let el = $("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.style.cssText = "position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);background:var(--ink);color:var(--cream);padding:12px 20px;border-radius:999px;font-size:.88rem;font-weight:700;z-index:200;opacity:0;transition:.35s var(--ease);box-shadow:0 12px 30px -10px rgba(0,0,0,.5);pointer-events:none";
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.opacity = "1";
  el.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(20px)";
  }, 2600);
}

/* ---------------- Revelar ao rolar ---------------- */
function initReveal() {
  const els = $$("[data-reveal]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  els.forEach((el) => io.observe(el));
}

/* ---------------- Init ---------------- */
(function init() {
  const saved = localStorage.getItem("lapanini_theme");
  if (saved) document.documentElement.dataset.theme = saved;

  renderFeatured();
  renderMenu();
  renderCart();
  initReveal();

  document.querySelectorAll(".story,.order-journey,.faq,.operations,.service-band").forEach((s) => s.setAttribute("data-reveal", ""));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();
