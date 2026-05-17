(function () {
  const CART_KEY = "dobara_cart_v1";
  const ORDER_KEY = "dobara_pickup_orders_v1";
  const PROFILE_KEY = "dobara_customer_profile_v1";
  const TAX_RATE = 0.05;
  const catalog = window.DOBARA_MENU;
  const state = {
    category: "all",
    query: "",
    cart: readJson(CART_KEY, [])
  };

  const els = {
    rail: document.querySelector("[data-category-rail]"),
    featured: document.querySelector("[data-featured-row]"),
    featuredHeading: document.querySelector("[data-featured-heading]"),
    grid: document.querySelector("[data-menu-grid]"),
    empty: document.querySelector("[data-empty-state]"),
    search: document.querySelector("#menu-search"),
    drawer: document.querySelector("[data-cart-drawer]"),
    lines: document.querySelector("[data-cart-lines]"),
    cartCount: document.querySelector("[data-cart-count]"),
    subtotal: document.querySelector("[data-subtotal]"),
    tax: document.querySelector("[data-tax]"),
    total: document.querySelector("[data-total]"),
    checkoutForm: document.querySelector("[data-checkout-form]"),
    checkoutButton: document.querySelector("[data-checkout-button]"),
    itemDialog: document.querySelector("[data-item-dialog]"),
    itemDetail: document.querySelector("[data-item-detail]"),
    successDialog: document.querySelector("[data-success-dialog]"),
    successOrder: document.querySelector("[data-success-order]"),
    successTrack: document.querySelector("[data-success-track]"),
    successWhatsApp: document.querySelector("[data-success-whatsapp]")
  };

  init();

  function init() {
    renderCategories();
    renderMenu();
    renderCart();
    bindEvents();
    hydrateProfile();
  }

  function bindEvents() {
    els.search.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      renderMenu();
    });

    document.querySelectorAll("[data-open-cart]").forEach((button) => {
      button.addEventListener("click", openCart);
    });

    document.querySelectorAll("[data-close-cart]").forEach((button) => {
      button.addEventListener("click", closeCart);
    });

    document.querySelector("[data-close-item]").addEventListener("click", () => els.itemDialog.close());
    document.querySelector("[data-close-success]").addEventListener("click", () => els.successDialog.close());

    els.checkoutForm.addEventListener("submit", handleCheckout);
  }

  function renderCategories() {
    els.rail.innerHTML = catalog.categories.map((category) => {
      const active = category.id === state.category ? " active" : "";
      return `<button class="category-tab${active}" type="button" data-category="${escapeHtml(category.id)}">${escapeHtml(category.name)}</button>`;
    }).join("");

    els.rail.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category;
        renderCategories();
        renderMenu();
      });
    });
  }

  function renderMenu() {
    const items = filteredItems();
    const featured = catalog.items.filter((item) => item.featured && item.available).slice(0, 4);
    const showFeatured = state.category === "all" && !state.query;

    els.featured.hidden = !showFeatured;
    els.featuredHeading.hidden = !showFeatured;
    els.featured.innerHTML = showFeatured ? featured.map(renderMenuCard).join("") : "";
    els.grid.innerHTML = items.filter((item) => !(showFeatured && item.featured)).map(renderMenuCard).join("");
    els.empty.hidden = items.length > 0;

    document.querySelectorAll("[data-add]").forEach((button) => {
      button.addEventListener("click", () => addToCart(button.dataset.add));
    });

    document.querySelectorAll("[data-detail]").forEach((button) => {
      button.addEventListener("click", () => showItem(button.dataset.detail));
    });
  }

  function filteredItems() {
    return catalog.items.filter((item) => {
      const categoryMatch = state.category === "all" || item.category === state.category;
      const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      const queryMatch = !state.query || text.includes(state.query);
      return categoryMatch && queryMatch;
    });
  }

  function renderMenuCard(item) {
    const unavailable = item.available ? "" : " unavailable";
    const disabled = item.available ? "" : " disabled";
    const cta = item.available ? "Add" : "Unavailable";
    return `
      <article class="menu-card${unavailable}">
        <button class="menu-card-image" type="button" data-detail="${escapeHtml(item.id)}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" onerror="this.src='images/temp/default-food.jpg'">
          <span class="badge">${escapeHtml(categoryName(item.category))}</span>
        </button>
        <div class="menu-card-body">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="menu-card-footer">
            <span class="price">₹${item.price}</span>
            <button class="add-button" type="button" data-add="${escapeHtml(item.id)}"${disabled}>${cta}</button>
          </div>
        </div>
      </article>
    `;
  }

  function showItem(id) {
    const item = findItem(id);
    if (!item) return;
    els.itemDetail.innerHTML = `
      <article class="item-detail">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" onerror="this.src='images/temp/default-food.jpg'">
        <div class="item-detail-body">
          <p class="eyebrow">${escapeHtml(categoryName(item.category))}</p>
          <h2>${escapeHtml(item.name)}</h2>
          <p class="muted">${escapeHtml(item.description)}</p>
          <div class="menu-card-footer">
            <span class="price">₹${item.price}</span>
            <button class="primary-button" type="button" data-dialog-add="${escapeHtml(item.id)}" ${item.available ? "" : "disabled"}>${item.available ? "Add to cart" : "Unavailable"}</button>
          </div>
        </div>
      </article>
    `;
    els.itemDetail.querySelector("[data-dialog-add]").addEventListener("click", () => {
      addToCart(id);
      els.itemDialog.close();
      openCart();
    });
    els.itemDialog.showModal();
  }

  function addToCart(id) {
    const item = findItem(id);
    if (!item || !item.available) return;
    const line = state.cart.find((entry) => entry.id === id);
    if (line) line.qty += 1;
    else state.cart.push({ id, qty: 1 });
    saveCart();
    renderCart();
  }

  function updateQty(id, delta) {
    const line = state.cart.find((entry) => entry.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) state.cart = state.cart.filter((entry) => entry.id !== id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const lines = cartLines();
    const subtotal = lines.reduce((sum, line) => sum + line.item.price * line.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;
    const count = lines.reduce((sum, line) => sum + line.qty, 0);

    els.cartCount.textContent = String(count);
    els.subtotal.textContent = rupee(subtotal);
    els.tax.textContent = rupee(tax);
    els.total.textContent = rupee(total);
    els.checkoutButton.disabled = count === 0;

    if (!lines.length) {
      els.lines.innerHTML = `<div class="cart-empty">Your pickup cart is empty.</div>`;
      return;
    }

    els.lines.innerHTML = lines.map(({ item, qty }) => `
      <article class="cart-line">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" onerror="this.src='images/temp/default-food.jpg'">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <div class="cart-line-meta">
            <span class="price">₹${item.price * qty}</span>
            <span class="stepper">
              <button type="button" data-decrease="${escapeHtml(item.id)}">−</button>
              <span>${qty}</span>
              <button type="button" data-increase="${escapeHtml(item.id)}">+</button>
            </span>
          </div>
        </div>
      </article>
    `).join("");

    els.lines.querySelectorAll("[data-increase]").forEach((button) => {
      button.addEventListener("click", () => updateQty(button.dataset.increase, 1));
    });
    els.lines.querySelectorAll("[data-decrease]").forEach((button) => {
      button.addEventListener("click", () => updateQty(button.dataset.decrease, -1));
    });
  }

  function handleCheckout(event) {
    event.preventDefault();
    const lines = cartLines();
    if (!lines.length) return;
    const data = new FormData(els.checkoutForm);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").replace(/\D/g, "");
    if (name.length < 2) {
      alert("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }

    const subtotal = lines.reduce((sum, line) => sum + line.item.price * line.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const order = {
      orderNumber: `DOB-PICKUP-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer: { name, phone },
      fulfillmentMode: "pickup",
      items: lines.map(({ item, qty }) => ({ id: item.id, name: item.name, price: item.price, qty })),
      pricing: { subtotal, tax, deliveryFee: 0, total: subtotal + tax },
      status: "preparing"
    };
    const orders = readJson(ORDER_KEY, []);
    orders.unshift(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders.slice(0, 8)));
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, phone }));
    const whatsappUrl = buildWhatsAppUrl(order);
    state.cart = [];
    saveCart();
    renderCart();
    closeCart();
    els.successOrder.textContent = order.orderNumber;
    els.successTrack.href = `track.html?order=${encodeURIComponent(order.orderNumber)}`;
    els.successWhatsApp.href = whatsappUrl;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    els.successDialog.showModal();
  }

  function openCart() {
    els.drawer.classList.add("open");
    els.drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
  }

  function closeCart() {
    els.drawer.classList.remove("open");
    els.drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
  }

  function hydrateProfile() {
    const profile = readJson(PROFILE_KEY, {});
    if (profile.name) els.checkoutForm.elements.name.value = profile.name;
    if (profile.phone) els.checkoutForm.elements.phone.value = profile.phone;
  }

  function cartLines() {
    return state.cart
      .map((line) => ({ item: findItem(line.id), qty: line.qty }))
      .filter((line) => line.item);
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  }

  function findItem(id) {
    return catalog.items.find((item) => item.id === id);
  }

  function categoryName(id) {
    const category = catalog.categories.find((entry) => entry.id === id);
    return category ? category.name : "Cafe";
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function rupee(value) {
    return `₹${value.toLocaleString("en-IN")}`;
  }

  function buildWhatsAppUrl(order) {
    const lines = [
      `Dobara cafe pickup order`,
      `Order: ${order.orderNumber}`,
      `Name: ${order.customer.name}`,
      `Phone: ${order.customer.phone}`,
      "",
      "Items:",
      ...order.items.map((item) => `${item.qty} x ${item.name} - ₹${item.price * item.qty}`),
      "",
      `Subtotal: ₹${order.pricing.subtotal}`,
      `GST estimate: ₹${order.pricing.tax}`,
      `Total: ₹${order.pricing.total}`
    ];
    return `https://wa.me/917007420970?text=${encodeURIComponent(lines.join("\n"))}`;
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
