(function () {
  const ORDER_KEY = "dobara_demo_orders_v1";
  const params = new URLSearchParams(window.location.search);
  const orderNumber = params.get("order");
  const orders = readJson(ORDER_KEY, []);
  const order = orders.find((entry) => entry.orderNumber === orderNumber) || orders[0];

  const orderEl = document.querySelector("[data-track-order]");
  const metaEl = document.querySelector("[data-track-meta]");
  const summaryEl = document.querySelector("[data-track-summary]");

  if (!order) {
    orderEl.textContent = "No demo order found";
    metaEl.textContent = "Create a demo pickup order from the menu to preview tracking.";
    summaryEl.innerHTML = `<a class="primary-button full-width" href="index.html#menu">Start demo order</a>`;
    return;
  }

  orderEl.textContent = order.orderNumber;
  metaEl.textContent = `${order.customer.name} · pickup · ${new Date(order.createdAt).toLocaleString("en-IN")}`;
  summaryEl.innerHTML = `
    <strong>Order summary</strong>
    ${order.items.map((item) => `<span>${escapeHtml(item.qty)} × ${escapeHtml(item.name)} · ₹${item.price * item.qty}</span>`).join("")}
    <strong>Total ₹${order.pricing.total}</strong>
  `;

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
