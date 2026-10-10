import {
  products,
  formatPrice,
  getProduct,
  getCollection,
} from "./catalog.js";

const CART_KEY = "deshen-cart-v1";
const THEME_KEY = "deshen-theme";
const ORDER_KEY = "deshen-last-order";

const root = document.body.dataset.root || ".";

function asset(path) {
  return `${root}/${path}`;
}

function readCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data.filter((line) => getProduct(line.id) && line.qty > 0);
  } catch {
    return [];
  }
}

function writeCart(lines) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  renderCart();
}

function addItem(id, qty) {
  const amount = Math.max(1, Math.min(9, qty || 1));
  const lines = readCart();
  const found = lines.find((line) => line.id === id);
  if (found) found.qty = Math.min(9, found.qty + amount);
  else lines.push({ id, qty: amount });
  writeCart(lines);
  openDrawer();
}

function setQty(id, qty) {
  const lines = readCart()
    .map((line) => (line.id === id ? { ...line, qty } : line))
    .filter((line) => line.qty > 0);
  writeCart(lines);
}

function shippingFor(region, subtotal) {
  if (region === "hk") return subtotal >= 120 ? 0 : 8;
  if (region === "mo" || region === "tw") return 18;
  return 28;
}

function regionLabel(region) {
  return { hk: "香港", mo: "澳门", tw: "台湾", other: "其他地区" }[region] || "其他地区";
}

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("viewBox", "0 0 256 256");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#i-${name}`);
  svg.appendChild(use);
  return svg;
}

function renderCart() {
  const lines = readCart();
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = String(count);
    node.hidden = count === 0;
  });

  const subtotal = lines.reduce((sum, line) => sum + getProduct(line.id).price * line.qty, 0);
  const body = document.querySelector("[data-drawer-body]");
  const foot = document.querySelector("[data-drawer-foot]");
  if (body && foot) {
    if (!lines.length) {
      body.innerHTML = '<p class="empty">购物袋是空的。</p>';
      foot.hidden = true;
    } else {
      foot.hidden = false;
      body.replaceChildren();
      lines.forEach((line) => {
        const product = getProduct(line.id);
        const row = document.createElement("article");
        row.className = "line";
        const img = document.createElement("img");
        img.src = asset(product.image);
        img.alt = product.name;
        img.style.objectPosition = product.position;
        const copy = document.createElement("div");
        copy.innerHTML = `<div class="line-top"><h3></h3><button class="remove" type="button">移除</button></div><p class="price"></p>`;
        copy.querySelector("h3").textContent = product.name;
        copy.querySelector(".price").textContent = formatPrice(product.price);
        const qty = document.createElement("div");
        qty.className = "qty";
        qty.style.marginTop = "8px";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.setAttribute("aria-label", "减少数量");
        minus.append(icon("minus"));
        const input = document.createElement("input");
        input.value = String(line.qty);
        input.inputMode = "numeric";
        input.setAttribute("aria-label", `${product.name} 数量`);
        const plus = document.createElement("button");
        plus.type = "button";
        plus.setAttribute("aria-label", "增加数量");
        plus.append(icon("plus"));
        minus.addEventListener("click", () => setQty(line.id, line.qty - 1));
        plus.addEventListener("click", () => setQty(line.id, Math.min(9, line.qty + 1)));
        input.addEventListener("change", () => {
          const next = Number(input.value);
          setQty(line.id, Number.isFinite(next) ? Math.max(0, Math.min(9, next)) : line.qty);
        });
        qty.append(minus, input, plus);
        copy.append(qty);
        copy.querySelector(".remove").addEventListener("click", () => setQty(line.id, 0));
        row.append(img, copy);
        body.append(row);
      });
      const sub = document.querySelector("[data-drawer-subtotal]");
      if (sub) sub.textContent = formatPrice(subtotal);
    }
  }

  const page = document.querySelector("[data-cart-page]");
  if (page) renderCartPage(lines, subtotal);
  const checkout = document.querySelector("[data-checkout]");
  if (checkout) renderCheckout(lines, subtotal);
}

function renderCartPage(lines, subtotal) {
  const page = document.querySelector("[data-cart-page]");
  const list = page.querySelector("[data-cart-lines]");
  const empty = page.querySelector("[data-cart-empty]");
  const box = page.querySelector("[data-cart-summary]");
  if (!lines.length) {
    list.replaceChildren();
    empty.hidden = false;
    box.hidden = true;
    return;
  }
  empty.hidden = true;
  box.hidden = false;
  list.replaceChildren();
  lines.forEach((line) => {
    const product = getProduct(line.id);
    const row = document.createElement("article");
    row.className = "line";
    row.innerHTML = `<a><img alt=""></a><div><div class="line-top"><h3></h3><button class="remove" type="button">移除</button></div><p class="price"></p><p class="note"></p></div>`;
    const link = row.querySelector("a");
    link.href = `${root}/products/${product.id}.html`;
    const img = row.querySelector("img");
    img.src = asset(product.image);
    img.alt = product.name;
    img.style.objectPosition = product.position;
    row.querySelector("h3").textContent = product.name;
    row.querySelector(".price").textContent = formatPrice(product.price * line.qty);
    row.querySelector(".note").textContent = `数量 ${line.qty}`;
    row.querySelector(".remove").addEventListener("click", () => setQty(line.id, 0));
    list.append(row);
  });
  page.querySelector("[data-cart-subtotal]").textContent = formatPrice(subtotal);
}

function renderCheckout(lines, subtotal) {
  const rootEl = document.querySelector("[data-checkout]");
  const empty = rootEl.querySelector("[data-check-empty]");
  const form = rootEl.querySelector("[data-check-form]");
  const done = rootEl.querySelector("[data-check-done]");
  if (location.hash === "#done") {
    const order = JSON.parse(localStorage.getItem(ORDER_KEY) || "null");
    if (order) {
      empty.hidden = true;
      form.hidden = true;
      done.hidden = false;
      done.querySelector("[data-order-no]").textContent = order.no;
      done.querySelector("[data-order-total]").textContent = formatPrice(order.total);
      done.querySelector("[data-order-mail]").textContent = order.email;
      done.querySelector("[data-order-pay]").textContent =
        order.pay === "cod"
          ? "付款方式是香港货到付款。"
          : "付款方式是银行转账，收款账户会写在邮件里。";
      return;
    }
  }
  done.hidden = true;
  if (!lines.length) {
    empty.hidden = false;
    form.hidden = true;
    return;
  }
  empty.hidden = true;
  form.hidden = false;
  paintTotals();
}

function paintTotals() {
  const lines = readCart();
  const subtotal = lines.reduce((sum, line) => sum + getProduct(line.id).price * line.qty, 0);
  const region = document.querySelector("[name=region]")?.value || "hk";
  const ship = shippingFor(region, subtotal);
  const box = document.querySelector("[data-check-lines]");
  if (!box) return;
  box.replaceChildren();
  lines.forEach((line) => {
    const product = getProduct(line.id);
    const row = document.createElement("div");
    row.className = "totals";
    const item = document.createElement("div");
    const name = document.createElement("span");
    name.textContent = `${product.name} x ${line.qty}`;
    const price = document.createElement("span");
    price.textContent = formatPrice(product.price * line.qty);
    item.append(name, price);
    row.append(item);
    box.append(row);
  });
  const shipNode = document.querySelector("[data-ship]");
  const totalNode = document.querySelector("[data-total]");
  if (shipNode) shipNode.textContent = ship === 0 ? "免运费" : formatPrice(ship);
  if (totalNode) totalNode.textContent = formatPrice(subtotal + ship);
  const cod = document.querySelector("[data-cod]");
  if (cod) cod.hidden = region !== "hk";
  const codInput = document.querySelector("[value=cod]");
  if (codInput && region !== "hk" && codInput.checked) {
    document.querySelector("[value=transfer]").checked = true;
  }
}

function openDrawer() {
  const back = document.querySelector("[data-drawer]");
  if (!back) return;
  back.hidden = false;
  document.body.classList.add("lock");
  back.querySelector("[data-close-drawer]")?.focus();
}

function closeDrawer() {
  const back = document.querySelector("[data-drawer]");
  if (!back) return;
  back.hidden = true;
  document.body.classList.remove("lock");
}

function bindQty(scope) {
  scope.querySelectorAll("[data-qty]").forEach((box) => {
    const input = box.querySelector("input");
    box.querySelector("[data-qty-minus]")?.addEventListener("click", () => {
      input.value = String(Math.max(1, Number(input.value || 1) - 1));
    });
    box.querySelector("[data-qty-plus]")?.addEventListener("click", () => {
      input.value = String(Math.min(9, Number(input.value || 1) + 1));
    });
  });
}

function showError(form, name, message) {
  const node = form.querySelector(`[data-error-for="${name}"]`);
  if (node) node.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = "";
  });
}

function requireFields(form, names) {
  let ok = true;
  names.forEach((name) => {
    const field = form.elements[name];
    const value = field?.value?.trim() || "";
    if (!value) {
      showError(form, name, "请填写这一项。");
      ok = false;
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError(form, name, "邮箱格式不对。");
      ok = false;
    }
  });
  return ok;
}

function bindSearch() {
  const panel = document.querySelector("[data-search]");
  const input = document.querySelector("#q");
  const results = document.querySelector("[data-search-results]");
  const openBtn = document.querySelector("[data-open-search]");
  if (!panel || !input || !results || !openBtn) return;

  const close = () => {
    panel.hidden = true;
  };
  const open = () => {
    panel.hidden = false;
    input.focus();
  };

  openBtn.addEventListener("click", () => {
    if (panel.hidden) open();
    else close();
  });

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (!query) return;
    const hits = products.filter((item) => {
      const collection = getCollection(item.collection);
      return (
        item.name.toLowerCase().includes(query) ||
        collection.name.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query)
      );
    });
    if (!hits.length) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "没有找到和这个词有关的商品。";
      results.append(empty);
      return;
    }
    hits.slice(0, 6).forEach((item) => {
      const link = document.createElement("a");
      link.className = "search-hit";
      link.href = `${root}/products/${item.id}.html`;
      const img = document.createElement("img");
      img.src = asset(item.image);
      img.alt = "";
      img.style.objectPosition = item.position;
      const name = document.createElement("span");
      name.textContent = item.name;
      const price = document.createElement("span");
      price.textContent = formatPrice(item.price);
      link.append(img, name, price);
      results.append(link);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function bindMenu() {
  const btn = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-mobile-nav]");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.replaceChildren(icon(open ? "x" : "list"));
    document.body.classList.toggle("lock", open);
  });
}

function bindTheme() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  const paint = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    btn.replaceChildren(icon(dark ? "sun" : "moon"));
    btn.setAttribute("aria-label", dark ? "切换到浅色" : "切换到深色");
  };
  paint();
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
    paint();
  });
}

function bindSort() {
  const select = document.querySelector("[data-sort]");
  const grid = document.querySelector("[data-product-grid]");
  if (!select || !grid) return;
  select.addEventListener("change", () => {
    const cards = [...grid.children];
    const value = select.value;
    cards.sort((a, b) => {
      if (value === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (value === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (value === "name") return a.dataset.name.localeCompare(b.dataset.name, "zh");
      return Number(a.dataset.index) - Number(b.dataset.index);
    });
    cards.forEach((card) => grid.append(card));
  });
}

function bindAdds() {
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const id = button.dataset.add;
    const qtyInput = document.querySelector("#qty");
    const qty = button.dataset.useQty && qtyInput ? Number(qtyInput.value) : 1;
    addItem(id, qty);
    const previous = button.textContent;
    button.textContent = "已加入";
    window.setTimeout(() => {
      button.textContent = previous;
    }, 900);
  });
}

function bindCheckout() {
  const form = document.querySelector("[data-check-form]");
  if (!form) return;
  form.addEventListener("change", paintTotals);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);
    const ok = requireFields(form, ["name", "email", "phone", "address", "city"]);
    if (!ok) return;
    const lines = readCart();
    if (!lines.length) return;
    const region = form.elements.region.value;
    const subtotal = lines.reduce((sum, line) => sum + getProduct(line.id).price * line.qty, 0);
    const ship = shippingFor(region, subtotal);
    const pay = form.elements.pay.value;
    if (pay === "cod" && region !== "hk") {
      showError(form, "pay", "货到付款只用于香港地址。");
      return;
    }
    const no = "DS" + String(Date.now()).slice(-8);
    const order = {
      no,
      email: form.elements.email.value.trim(),
      total: subtotal + ship,
      region: regionLabel(region),
      pay,
    };
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    writeCart([]);
    location.hash = "done";
    renderCheckout([], 0);
    document.querySelector("[data-check-done] h1")?.focus();
  });
}

function bindContact() {
  const form = document.querySelector("[data-contact]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);
    if (!requireFields(form, ["name", "email", "topic", "message"])) return;
    form.hidden = true;
    const note = document.querySelector("[data-contact-done]");
    note.hidden = false;
  });
}

function bindNews() {
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);
      if (!requireFields(form, ["email"])) return;
      const note = form.querySelector("[data-news-note]");
      note.textContent = "这个邮箱已记下。有新品时我们会写信。";
      form.elements.email.value = "";
    });
  });
}

document.querySelector("[data-open-cart]")?.addEventListener("click", openDrawer);
document.querySelector("[data-drawer]")?.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-drawer]") || event.target.matches("[data-drawer]")) closeDrawer();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDrawer();
});

bindQty(document);
bindAdds();
bindSearch();
bindMenu();
bindTheme();
bindSort();
bindCheckout();
bindContact();
bindNews();
renderCart();
