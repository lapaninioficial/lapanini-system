"use strict";

const API_BASE = (window.LAPANINI && window.LAPANINI.api) || "/api";
const csrf = () => (window.LAPANINI && window.LAPANINI.csrf) || document.querySelector('meta[name="csrf-token"]')?.content || "";
const money = v => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const STATUS = {
  received: "Pedido recebido",
  confirmed: "Pedido confirmado",
  preparing: "Em preparação",
  out_for_delivery: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

async function api(path, options = {}) {
  const headers = { Accept: "application/json", "X-CSRF-TOKEN": csrf() };
  if (options.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
    options = { ...options, body: JSON.stringify({ _csrf: csrf(), ...options.body }) };
  }
  const res = await fetch(API_BASE + path, { credentials: "same-origin", ...options, headers: { ...headers, ...(options.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || "Falha na requisição");
  return data;
}

const loginBox = document.getElementById("adminLogin");
const board = document.getElementById("adminBoard");
const ordersEl = document.getElementById("adminOrders");

function showBoard(on) {
  loginBox.hidden = on;
  board.hidden = !on;
}

async function loadOrders() {
  const payload = await api("/admin/pedidos");
  const orders = payload.orders || [];
  if (!orders.length) {
    ordersEl.innerHTML = "<p>Nenhum pedido no servidor ainda.</p>";
    return;
  }
  ordersEl.innerHTML = orders.map(order => `
    <article class="account-history" data-order="${order.id}">
      <div><b>#${order.order_number}</b> · ${money(order.total)}</div>
      <span>${order.customer?.name || ""} · ${order.customer?.phone || ""}</span>
      <p>${(order.items || []).map(i => `${i.quantity}× ${i.name}`).join(", ")}</p>
      <label>Status
        <select data-status="${order.id}">
          ${Object.entries(STATUS).map(([value, label]) => `<option value="${value}" ${order.status === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
    </article>`).join("");
  ordersEl.querySelectorAll("[data-status]").forEach(select => {
    select.onchange = async () => {
      try {
        await api("/admin/pedidos", { method: "POST", body: { id: +select.dataset.status, status: select.value } });
      } catch (err) {
        alert(err.message);
      }
    };
  });
}

document.getElementById("adminForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.target));
  try {
    await api("/admin/login", { method: "POST", body: payload });
    showBoard(true);
    await loadOrders();
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("adminLogout")?.addEventListener("click", async () => {
  try { await api("/admin/logout", { method: "POST", body: {} }); } catch {}
  showBoard(false);
});

(async function boot() {
  try {
    const session = await api("/session");
    if (session.csrf) window.LAPANINI = { ...(window.LAPANINI || {}), csrf: session.csrf };
    if (session.admin) {
      showBoard(true);
      await loadOrders();
    }
  } catch {}
})();
