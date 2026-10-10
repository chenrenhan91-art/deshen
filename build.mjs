import fs from "node:fs";
import path from "node:path";
import {
  collections,
  products,
  homeIds,
  featureId,
  formatPrice,
  getProduct,
  productsIn,
} from "./js/catalog.js";

const rootDir = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function href(base, file) {
  return `${base}/${file}`;
}

function icon(name) {
  return `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function sprite() {
  const names = [
    "magnifying-glass",
    "shopping-bag",
    "list",
    "x",
    "plus",
    "minus",
    "moon",
    "sun",
    "arrow-left",
    "check",
    "caret-down",
  ];
  const symbols = names
    .map((name) => {
      const raw = fs.readFileSync(path.join(rootDir, "icons", `${name}.svg`), "utf8");
      const inner = raw
        .replace(/^<svg[^>]*>/, "")
        .replace(/<\/svg>\s*$/, "")
        .replaceAll("<path ", '<path fill="currentColor" ');
      return `<symbol id="i-${name}" viewBox="0 0 256 256">${inner}</symbol>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" hidden>${symbols}</svg>`;
}

const navItems = [
  ["shop.html", "商店", "shop"],
  ["collections/seating.html", "坐具", "seating"],
  ["collections/lighting.html", "灯具", "lighting"],
  ["collections/table.html", "餐桌", "table"],
  ["collections/home.html", "家居", "home"],
  ["about.html", "关于", "about"],
];

function navLinks(base, current, mobile) {
  return navItems
    .map(([file, label, id]) => {
      const currentAttr = id === current ? ' aria-current="page"' : "";
      return `<a href="${href(base, file)}"${currentAttr}>${label}</a>`;
    })
    .join(mobile ? "" : "");
}

function layout({ title, description, base, current, main }) {
  return `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%231a1c1e'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="${href(base, "css/store.css")}">
  <script>
    (function () {
      try {
        var saved = localStorage.getItem("deshen-theme");
        var theme = saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", theme);
      } catch (error) {}
    })();
  </script>
</head>
<body data-root="${base}">
  <a class="skip" href="#main">跳到内容</a>
  ${sprite()}
  <div class="topbar">
    <div class="announce">香港订单满 US$120 免运费</div>
    <div class="wrap header">
      <button class="icon-btn menu-toggle" type="button" data-menu aria-expanded="false" aria-label="打开菜单">${icon("list")}</button>
      <a class="logo" href="${href(base, "index.html")}">DESHEN</a>
      <nav class="nav" aria-label="主导航">${navLinks(base, current, false)}</nav>
      <div class="tools">
        <button class="icon-btn" type="button" data-open-search aria-label="搜索">${icon("magnifying-glass")}</button>
        <button class="icon-btn" type="button" data-theme-toggle aria-label="切换到深色">${icon("moon")}</button>
        <button class="icon-btn" type="button" data-open-cart aria-label="打开购物袋">${icon("shopping-bag")}<span class="count" data-cart-count hidden>0</span></button>
      </div>
    </div>
    <div class="wrap mobile-nav" data-mobile-nav>${navLinks(base, current, true)}</div>
    <div class="search-panel" data-search hidden>
      <div class="wrap">
        <form role="search" onsubmit="return false">
          <label for="q">搜索商品</label>
          <input id="q" type="search" name="q" placeholder="输入商品名" autocomplete="off">
        </form>
        <div class="search-results" data-search-results></div>
      </div>
    </div>
  </div>
  <div class="drawer-back" data-drawer hidden>
    <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
      <header>
        <h2 id="bag-title">购物袋</h2>
        <button class="icon-btn" type="button" data-close-drawer aria-label="关闭购物袋">${icon("x")}</button>
      </header>
      <div class="drawer-body" data-drawer-body></div>
      <footer data-drawer-foot>
        <div class="totals"><div><span>小计</span><strong data-drawer-subtotal></strong></div></div>
        <a class="btn" href="${href(base, "checkout.html")}">去结算</a>
        <a class="link" href="${href(base, "cart.html")}">查看购物袋</a>
      </footer>
    </aside>
  </div>
  <main id="main">${main}</main>
  <footer class="footer">
    <div class="wrap footer-grid">
      <div>
        <h3>商店</h3>
        <ul>
          ${navItems
            .slice(0, 5)
            .map(([file, label]) => `<li><a href="${href(base, file)}">${label}</a></li>`)
            .join("")}
        </ul>
      </div>
      <div>
        <h3>帮助</h3>
        <ul>
          <li><a href="${href(base, "shipping.html")}">配送</a></li>
          <li><a href="${href(base, "returns.html")}">退换</a></li>
          <li><a href="${href(base, "faq.html")}">常见问题</a></li>
          <li><a href="${href(base, "contact.html")}">联系</a></li>
        </ul>
      </div>
      <div>
        <h3>公司</h3>
        <p>DESHEN INTERNATIONAL LIMITED</p>
        <p>德晟國際有限公司</p>
        <p>香港九龙观塘开源道 45 号<br>有利中心 3 楼 89 室</p>
        <p><a href="mailto:hello@deshenintl.com">hello@deshenintl.com</a></p>
      </div>
      <div>
        <h3>营业时间</h3>
        <p>周一至周五 10:00-18:00</p>
        <p class="note">银行转账，香港地址可以货到付款。</p>
      </div>
    </div>
    <div class="wrap legal">© 2026 DESHEN INTERNATIONAL LIMITED. 商业登记号码 75926687.</div>
  </footer>
  <script type="module" src="${href(base, "js/store.js")}"></script>
</body>
</html>`;
}

function card(product, base, index) {
  return `<article class="card" data-price="${product.price}" data-name="${esc(product.name)}" data-index="${index}">
    <a href="${href(base, `products/${product.id}.html`)}">
      <div class="card-media">
        <img src="${href(base, product.image)}" alt="${esc(product.name)}" style="object-position:${product.position}">
      </div>
      <h3>${esc(product.name)}</h3>
      <p class="price">${formatPrice(product.price)}</p>
    </a>
    <button class="text-add" type="button" data-add="${product.id}">加入购物袋</button>
  </article>`;
}

function grid(list, base) {
  return `<div class="grid" data-product-grid>${list.map((item, index) => card(item, base, index)).join("")}</div>`;
}

function homePage() {
  const feature = getProduct(featureId);
  const tiles = collections
    .map((collection) => {
      const count = productsIn(collection.id).length;
      const klass = {
        seating: "tile-seat",
        lighting: "tile-light",
        table: "tile-table",
        home: "tile-home",
      }[collection.id];
      return `<a class="tile ${klass}" href="./collections/${collection.id}.html">
        <figure>
          <div class="tile-media"><img src="./${collection.image}" alt="${esc(collection.name)}" style="object-position:${collection.position}"></div>
          <figcaption><strong>${esc(collection.name)}</strong><span>${count} 件</span></figcaption>
        </figure>
      </a>`;
    })
    .join("");
  const frames = [
    ["collections/home.html", "images/banners/bedroom.jpg", "center", "卧室一角"],
    ["collections/table.html", "images/banners/table.jpg", "center", "餐桌陈列"],
    ["products/arc-lamp.html", "images/products/arc-lamp.jpg", "center 34%", "银色弧形落地灯"],
  ]
    .map(
      ([file, image, position, caption]) => `<a class="film" href="./${file}">
        <figure>
          <div class="film-media"><img src="./${image}" alt="${esc(caption)}" style="object-position:${position}"></div>
          <figcaption>${esc(caption)}</figcaption>
        </figure>
      </a>`,
    )
    .join("");

  const main = `
    <section class="hero">
      <div class="hero-copy">
        <h1>本季新品现已开售</h1>
        <p class="hero-lead">坐具、灯具和餐桌器皿。</p>
        <div class="cta-row">
          <a class="btn" href="./shop.html">进入商店</a>
          <a class="link" href="./collections/seating.html">看坐具</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="./images/banners/hero.jpg" alt="银色弧形落地灯放在白色房间里">
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <h2>分类</h2>
        <div class="mosaic">${tiles}</div>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <h2>新品</h2>
        ${grid(homeIds.map((id) => getProduct(id)), ".")}
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap feature">
        <div class="feature-media">
          <img src="./${feature.image}" alt="${esc(feature.name)}" style="object-position:${feature.position}">
        </div>
        <div>
          <h2>${esc(feature.name)}</h2>
          <p>${esc(feature.summary)}</p>
          <p class="price">${formatPrice(feature.price)}</p>
          <a class="btn" href="./products/${feature.id}.html">查看这件</a>
        </div>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <h2>评价</h2>
        <figure>
          <blockquote class="quote">颜色和页面一致，到货就是那只墨绿色。</blockquote>
          <figcaption>陈可欣<br>室内设计师</figcaption>
        </figure>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap">
        <h2>店里的样子</h2>
        <div class="film-row">${frames}</div>
      </div>
    </section>
    <section class="band">
      <div class="wrap section">
        <form class="news" data-newsletter novalidate>
          <h2>新品到了会写信</h2>
          <label for="news-email">邮箱</label>
          <div class="inline-form">
            <input id="news-email" name="email" type="email" autocomplete="email" required>
            <button class="btn" type="submit">订阅</button>
          </div>
          <p class="field-error" data-error-for="email"></p>
          <p class="note" data-news-note></p>
        </form>
      </div>
    </section>`;
  return layout({
    title: "DESHEN - 家具与器皿",
    description: "DESHEN INTERNATIONAL LIMITED 的家具与器皿商店。坐具、灯具、餐桌器皿从香港寄出。",
    base: ".",
    current: "index",
    main,
  });
}

function shopPage() {
  const filters = [
    ["shop.html", "全部", "shop"],
    ...collections.map((item) => [`collections/${item.id}.html`, item.name, item.id]),
  ]
    .map(
      ([file, label, id]) =>
        `<a href="./${file}"${id === "shop" ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("");
  const main = `
    <div class="wrap catalog">
      <div class="page-head">
        <h1>商店</h1>
        <p class="note">${products.length} 件商品</p>
      </div>
      <div class="toolbar">
        <nav class="filters" aria-label="分类">${filters}</nav>
        <label class="sort">排序
          <select data-sort>
            <option value="featured">默认</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
            <option value="name">名称</option>
          </select>
        </label>
      </div>
      ${grid(products, ".")}
    </div>`;
  return layout({
    title: "商店 - DESHEN",
    description: "DESHEN 全部商品，包括坐具、灯具、餐桌器皿和家居。",
    base: ".",
    current: "shop",
    main,
  });
}

function collectionPage(collection) {
  const list = productsIn(collection.id);
  const main = `
    <div class="wrap catalog">
      <div class="page-head">
        <p class="crumbs"><a href="../index.html">首页</a> / <a href="../shop.html">商店</a> / ${esc(collection.name)}</p>
        <h1>${esc(collection.name)}</h1>
        <p class="note">${list.length} 件商品</p>
      </div>
      <div class="banner-media">
        <img src="../${collection.image}" alt="${esc(collection.name)}" style="object-position:${collection.position}">
      </div>
      <div class="toolbar">
        <nav class="filters" aria-label="分类">
          <a href="../shop.html">全部</a>
          ${collections
            .map(
              (item) =>
                `<a href="./${item.id}.html"${item.id === collection.id ? ' aria-current="page"' : ""}>${item.name}</a>`,
            )
            .join("")}
        </nav>
      </div>
      ${grid(list, "..")}
    </div>`;
  return layout({
    title: `${collection.name} - DESHEN`,
    description: `DESHEN ${collection.name}，共 ${list.length} 件。`,
    base: "..",
    current: collection.id,
    main,
  });
}

function related(product) {
  const same = products.filter((item) => item.collection === product.collection && item.id !== product.id);
  const rest = products.filter((item) => item.collection !== product.collection);
  return [...same, ...rest].slice(0, 4);
}

function productPage(product) {
  const collection = collections.find((item) => item.id === product.collection);
  const reviews = product.reviews
    .map(
      (review) => `<article>
        <p>${esc(review.text)}</p>
        <h3>${esc(review.name)}，${esc(review.role)}</h3>
      </article>`,
    )
    .join("");
  const more = related(product)
    .map(
      (item) => `<a class="film" href="./${item.id}.html">
        <figure>
          <div class="film-media"><img src="../${item.image}" alt="${esc(item.name)}" style="object-position:${item.position}"></div>
          <figcaption>${esc(item.name)}<br>${formatPrice(item.price)}</figcaption>
        </figure>
      </a>`,
    )
    .join("");
  const main = `
    <div class="wrap">
      <div class="page-head">
        <p class="crumbs">
          <a href="../index.html">首页</a> /
          <a href="../collections/${collection.id}.html">${esc(collection.name)}</a> /
          ${esc(product.name)}
        </p>
      </div>
      <div class="pdp">
        <div class="pdp-media">
          <img src="../${product.image}" alt="${esc(product.name)}" style="object-position:${product.position}">
        </div>
        <div class="pdp-info">
          <h1>${esc(product.name)}</h1>
          <p class="price">${formatPrice(product.price)}</p>
          <p class="stock">有货</p>
          <p class="summary">${esc(product.summary)}</p>
          <div class="buy-row">
            <div class="qty" data-qty>
              <button type="button" data-qty-minus aria-label="减少数量">${icon("minus")}</button>
              <input id="qty" value="1" inputmode="numeric" aria-label="数量">
              <button type="button" data-qty-plus aria-label="增加数量">${icon("plus")}</button>
            </div>
            <button class="btn" type="button" data-add="${product.id}" data-use-qty="true">加入购物袋</button>
          </div>
          <p class="note">香港满 US$120 免运费。未使用的商品可在 30 天内退换。</p>
          <details open>
            <summary>包含与不包含</summary>
            <p>包含：${esc(product.inbox)}</p>
            <p>不包含：${esc(product.scene)}</p>
          </details>
          <details>
            <summary>保养</summary>
            <p>${esc(product.care)}</p>
          </details>
          <details>
            <summary>配送与退换</summary>
            <p>香港订单满 US$120 免运费，否则运费 US$8，约 3 至 5 个工作日。澳门和台湾运费 US$18。其他地区运费 US$28。</p>
            <p>签收后 30 天内，未使用的商品可以退换。质量问题由我们承担退回运费。</p>
          </details>
        </div>
      </div>
      <section class="reviews">
        <h2>评价</h2>
        ${reviews}
      </section>
      <section class="related">
        <h2>还可以看看</h2>
        <div class="film-row">${more}</div>
      </section>
    </div>`;
  return layout({
    title: `${product.name} - DESHEN`,
    description: product.summary,
    base: "..",
    current: product.collection,
    main,
  });
}

function cartPage() {
  const main = `
    <div class="wrap" data-cart-page>
      <div class="page-head"><h1>购物袋</h1></div>
      <div class="cart-layout">
        <div>
          <p class="empty" data-cart-empty hidden>购物袋是空的。 <a class="link" href="./shop.html">进入商店</a></p>
          <div data-cart-lines></div>
        </div>
        <aside class="summary-box" data-cart-summary hidden>
          <h2>小计</h2>
          <div class="totals"><div><span>商品</span><strong data-cart-subtotal></strong></div></div>
          <p class="note">运费在结算时按地址计算。香港满 US$120 免运费。</p>
          <a class="btn" href="./checkout.html">去结算</a>
        </aside>
      </div>
    </div>`;
  return layout({
    title: "购物袋 - DESHEN",
    description: "查看 DESHEN 购物袋里的商品。",
    base: ".",
    current: "cart",
    main,
  });
}

function checkoutPage() {
  const main = `
    <div class="wrap" data-checkout>
      <div class="page-head"><h1>结算</h1></div>
      <p class="empty" data-check-empty hidden>购物袋是空的。 <a class="link" href="./shop.html">进入商店</a></p>
      <div class="confirm" data-check-done hidden>
        <h1 tabindex="-1">订单已提交</h1>
        <p>订单号 <strong data-order-no></strong></p>
        <p>合计 <strong data-order-total></strong></p>
        <p>确认信会发到 <strong data-order-mail></strong>。</p>
        <p data-order-pay></p>
        <p><a class="link" href="./shop.html">继续选购</a></p>
      </div>
      <form class="check-layout" data-check-form hidden novalidate>
        <div>
          <div class="field"><label for="name">姓名</label><input id="name" name="name" autocomplete="name" required><p class="field-error" data-error-for="name"></p></div>
          <div class="field"><label for="email">邮箱</label><input id="email" name="email" type="email" autocomplete="email" required><p class="field-error" data-error-for="email"></p></div>
          <div class="field"><label for="phone">电话</label><input id="phone" name="phone" type="tel" autocomplete="tel" required><p class="field-error" data-error-for="phone"></p></div>
          <div class="field"><label for="region">地区</label>
            <select id="region" name="region">
              <option value="hk">香港</option>
              <option value="mo">澳门</option>
              <option value="tw">台湾</option>
              <option value="other">其他地区</option>
            </select>
          </div>
          <div class="field"><label for="city">城市</label><input id="city" name="city" autocomplete="address-level2" required><p class="field-error" data-error-for="city"></p></div>
          <div class="field"><label for="address">地址</label><textarea id="address" name="address" autocomplete="street-address" required></textarea><p class="field-error" data-error-for="address"></p></div>
          <fieldset class="pay">
            <legend>付款方式</legend>
            <label><input type="radio" name="pay" value="transfer" checked> 银行转账</label>
            <label data-cod><input type="radio" name="pay" value="cod"> 货到付款（仅香港）</label>
            <p class="field-error" data-error-for="pay"></p>
          </fieldset>
          <button class="btn" type="submit">提交订单</button>
        </div>
        <aside class="summary-box">
          <h2>订单摘要</h2>
          <div data-check-lines></div>
          <div class="totals">
            <div><span>运费</span><span data-ship></span></div>
            <div><span>合计</span><strong data-total></strong></div>
          </div>
          <p class="note">香港满 US$120 免运费。澳门、台湾 US$18。其他地区 US$28。</p>
        </aside>
      </form>
    </div>`;
  return layout({
    title: "结算 - DESHEN",
    description: "填写收货地址并提交 DESHEN 订单。",
    base: ".",
    current: "checkout",
    main,
  });
}

function aboutPage() {
  const main = `
    <div class="wrap section prose">
      <h1>关于 DESHEN</h1>
      <p>DESHEN INTERNATIONAL LIMITED（德晟國際有限公司）的办事处在香港九龙观塘开源道 45 号有利中心 3 楼 89 室。</p>
      <p>店里现在有坐具、灯具、餐桌器皿和少量家居用品，从香港发出。</p>
      <div class="banner-media">
        <img src="./images/banners/hero.jpg" alt="银色弧形落地灯放在白色房间里" style="object-position:center 28%">
      </div>
      <p>周一至周五 10:00-18:00。邮箱 <a class="link" href="mailto:hello@deshenintl.com">hello@deshenintl.com</a>。</p>
    </div>`;
  return layout({
    title: "关于 - DESHEN",
    description: "DESHEN INTERNATIONAL LIMITED，香港观塘。",
    base: ".",
    current: "about",
    main,
  });
}

function contactPage() {
  const main = `
    <div class="wrap section prose">
      <h1>联系</h1>
      <p>写信给我们，我们会在营业时间内回复。</p>
      <form data-contact novalidate>
        <div class="field"><label for="name">姓名</label><input id="name" name="name" required><p class="field-error" data-error-for="name"></p></div>
        <div class="field"><label for="email">邮箱</label><input id="email" name="email" type="email" required><p class="field-error" data-error-for="email"></p></div>
        <div class="field"><label for="topic">主题</label><input id="topic" name="topic" required><p class="field-error" data-error-for="topic"></p></div>
        <div class="field"><label for="message">内容</label><textarea id="message" name="message" required></textarea><p class="field-error" data-error-for="message"></p></div>
        <button class="btn" type="submit">发送</button>
      </form>
      <p data-contact-done hidden>已记下。我们会回复到你留的邮箱。</p>
      <p>DESHEN INTERNATIONAL LIMITED<br>香港九龙观塘开源道 45 号有利中心 3 楼 89 室<br><a class="link" href="mailto:hello@deshenintl.com">hello@deshenintl.com</a></p>
    </div>`;
  return layout({
    title: "联系 - DESHEN",
    description: "联系 DESHEN INTERNATIONAL LIMITED。",
    base: ".",
    current: "contact",
    main,
  });
}

function shippingPage() {
  const main = `
    <div class="wrap section prose">
      <h1>配送</h1>
      <p>货物从香港发出。</p>
      <p>香港：订单满 US$120 免运费，未满收取 US$8，约 3 至 5 个工作日。</p>
      <p>澳门、台湾：运费 US$18，约 5 至 8 个工作日。</p>
      <p>其他地区：运费 US$28，约 7 至 14 个工作日。偏远地址可能另计，下单后如果需要补差，我们会先写信说明。</p>
      <p>提交订单后，发货通知会发到你的邮箱。</p>
    </div>`;
  return layout({
    title: "配送 - DESHEN",
    description: "DESHEN 的运费和送达时间。",
    base: ".",
    current: "shipping",
    main,
  });
}

function returnsPage() {
  const main = `
    <div class="wrap section prose">
      <h1>退换</h1>
      <p>签收后 30 天内，未使用、包装完好的商品可以退换。</p>
      <p>请先写信到 hello@deshenintl.com，我们会回复退回地址。非质量问题的退回运费由买家承担。</p>
      <p>蜡烛点燃后、植物枯萎后，不能按无理由退换。质量问题和运输破损由我们处理，退回运费也由我们承担。</p>
      <p>退款按原付款路径退回。银行转账通常在收到退货后 7 个工作日内处理。</p>
    </div>`;
  return layout({
    title: "退换 - DESHEN",
    description: "DESHEN 的退换规则。",
    base: ".",
    current: "returns",
    main,
  });
}

function faqPage() {
  const items = [
    ["运费怎么算", "香港订单满 US$120 免运费，否则 US$8。澳门和台湾 US$18。其他地区 US$28。"],
    ["多久能收到", "香港约 3 至 5 个工作日，澳门和台湾约 5 至 8 个工作日，其他地区约 7 至 14 个工作日。"],
    ["可以怎么付款", "可以选择银行转账。香港地址还可以货到付款。收款账户会在订单邮件里。"],
    ["可以退货吗", "签收后 30 天内，未使用的商品可以退换。点燃过的蜡烛和不健康的植物不在无理由退换范围内。"],
    ["照片里的其他东西呢", "商品名写的是你买到的那一件。如果照片里还有桌子、靠垫或植物，商品页会写明那些不随货。"],
    ["什么时间能联系到人", "周一至周五 10:00-18:00，邮箱 hello@deshenintl.com。"],
  ]
    .map(
      ([q, a]) => `<details>
        <summary>${q}</summary>
        <p>${a}</p>
      </details>`,
    )
    .join("");
  const main = `
    <div class="wrap section prose">
      <h1>常见问题</h1>
      ${items}
    </div>`;
  return layout({
    title: "常见问题 - DESHEN",
    description: "DESHEN 的配送、付款和退换说明。",
    base: ".",
    current: "faq",
    main,
  });
}

const files = new Map([
  ["index.html", homePage()],
  ["shop.html", shopPage()],
  ["cart.html", cartPage()],
  ["checkout.html", checkoutPage()],
  ["about.html", aboutPage()],
  ["contact.html", contactPage()],
  ["shipping.html", shippingPage()],
  ["returns.html", returnsPage()],
  ["faq.html", faqPage()],
]);

for (const collection of collections) {
  files.set(`collections/${collection.id}.html`, collectionPage(collection));
}
for (const product of products) {
  files.set(`products/${product.id}.html`, productPage(product));
}

for (const [file, html] of files) {
  const target = path.join(rootDir, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (html.includes("—") || html.includes("–")) {
    throw new Error(`Dash character in ${file}`);
  }
  fs.writeFileSync(target, html);
}

console.log(`Wrote ${files.size} pages`);
