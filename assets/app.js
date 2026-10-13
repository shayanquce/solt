(() => {
  const CFG = window.SOLT_CONFIG || {};
  const PRODUCTS = window.SOLT_PRODUCTS || [];
  const byId = (id) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = (n) => "$" + n.toFixed(2);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  /* ================= icons ================= */
  const I = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    left: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m15 5-7 7 7 7"/></svg>',
    right: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 5 7 7-7 7"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="10" fill="#111" stroke="none"/><path d="m7.5 12.5 3 3 6-6.5" stroke="#d6ff3a"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="m9 9 6 6m0-6-6 6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.1-2.8V9.1a6.3 6.3 0 1 0 5.5 6.3V8.6a8 8 0 0 0 4.7 1.5V6.7a4.7 4.7 0 0 1-4.7-4.7Z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    loop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  };
  const cubeHTML = (cls = "") => `<div class="cube ${cls}"><i></i><i></i><i></i><i></i><i></i><i></i></div>`;

  /* ================= 3D product renders ================= */
  const vars = (p) => `--bag:${p.bag};--band:${p.band};--bandInk:${p.bandInk};--ink:${p.ink}`;
  function pouch(p, style = "") {
    return `<div class="pouch" style="${vars(p)};${style}">
      <div class="pouch__side"></div>
      <div class="pouch__body">
        <div class="pouch__band"><span>${p.bandText}</span></div>
        <div class="pouch__brand">SOLT</div>
        <div class="pouch__meta">${p.meta}</div>
        <ul class="pouch__ingr">${p.ingr.map((i) => `<li>${i}</li>`).join("")}</ul>
        <div class="pouch__badge">${p.badge}</div>
        <div class="pouch__word">${p.word}</div>
        <div class="pouch__gloss"></div>
      </div>
      <div class="pouch__shadow"></div>
    </div>`;
  }
  const stick = (p, style = "") => `<div class="stick" style="${vars(p)};${style}"><span>${p.word}</span></div>`;

  /* ================= tracking ================= */
  const sid = (() => { let s = sessionStorage.getItem("solt_sid"); if (!s) { s = Math.random().toString(36).slice(2, 10); sessionStorage.setItem("solt_sid", s); } return s; })();
  const utm = (() => {
    const q = new URLSearchParams(location.search), out = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "ttclid", "gclid"].forEach((k) => q.get(k) && (out[k] = q.get(k)));
    if (Object.keys(out).length) store.set("solt_utm", out);
    return Object.keys(out).length ? out : store.get("solt_utm", {});
  })();
  const META_MAP = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", generate_lead: "Lead", sign_up: "CompleteRegistration" };
  function track(event, data = {}) {
    const payload = { event, ...data, session: sid, page: location.pathname + location.search, ts: new Date().toISOString(), ...utm };
    (window.dataLayer = window.dataLayer || []).push(payload);
    try { if (window.fbq && META_MAP[event]) fbq("track", META_MAP[event], { value: data.value, currency: CFG.CURRENCY, content_ids: data.ids }); } catch {}
    try { if (window.gtag) gtag("event", event, { value: data.value, currency: CFG.CURRENCY, ...data }); } catch {}
    try { if (window.ttq && META_MAP[event]) ttq.track(META_MAP[event], { value: data.value, currency: CFG.CURRENCY }); } catch {}
    if (CFG.WEBHOOK_URL) {
      const body = new Blob([JSON.stringify(payload)], { type: "text/plain" });
      if (!(navigator.sendBeacon && navigator.sendBeacon(CFG.WEBHOOK_URL, body))) fetch(CFG.WEBHOOK_URL, { method: "POST", body, mode: "no-cors", keepalive: true }).catch(() => {});
    }
    const log = store.get("solt_events", []); log.push(payload); store.set("solt_events", log.slice(-300));
    if (location.hash === "#debug") console.log("[track]", payload);
  }
  window.soltTrack = track;

  function loadPixels() {
    if (CFG.META_PIXEL_ID) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", CFG.META_PIXEL_ID); fbq("track", "PageView");
    }
    if (CFG.GA4_ID) {
      const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + CFG.GA4_ID; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", CFG.GA4_ID);
    }
    if (CFG.TIKTOK_PIXEL_ID) {
      !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify"]; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.load = function (e) { var n = "https://analytics.tiktok.com/i18n/pixel/events.js"; var o = d.createElement("script"); o.async = !0; o.src = n + "?sdkid=" + e + "&lib=" + t; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a); }; ttq.load(CFG.TIKTOK_PIXEL_ID); ttq.page(); }(window, document, "ttq");
    }
  }

  /* ================= cart ================= */
  let cart = store.get("solt_cart", []);
  const unit = (l) => byId(l.id).price[l.pack] * (l.sub ? 1 - CFG.SUBSCRIBE_DISCOUNT : 1);
  const subtotal = () => cart.reduce((s, l) => s + unit(l) * l.qty, 0);
  const count = () => cart.reduce((s, l) => s + l.qty, 0);
  function addToCart(id, pack = 15, sub = true, qty = 1, source = "") {
    const hit = cart.find((l) => l.id === id && l.pack === pack && l.sub === sub);
    hit ? (hit.qty += qty) : cart.push({ id, pack, sub, qty });
    store.set("solt_cart", cart);
    const p = byId(id);
    track("add_to_cart", { product: id, pack, subscribe: sub, qty, value: +(p.price[pack] * (sub ? 1 - CFG.SUBSCRIBE_DISCOUNT : 1) * qty).toFixed(2), ids: [id], source });
    renderCart(); openDrawer();
    const c = $(".cart-count"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  }
  function setQty(i, q) { if (q <= 0) cart.splice(i, 1); else cart[i].qty = q; store.set("solt_cart", cart); renderCart(); }

  function renderCart() {
    const c = $(".cart-count"); c.textContent = count(); c.classList.toggle("has", count() > 0);
    const left = Math.max(0, CFG.FREE_SHIPPING_THRESHOLD - subtotal());
    $("#drawer-ship").innerHTML = left > 0 ? `You're <b>${money(left)}</b> away from free shipping<div class="bar"><i style="width:${(subtotal() / CFG.FREE_SHIPPING_THRESHOLD) * 100}%"></i></div>` : `<b>You've unlocked free shipping.</b><div class="bar"><i style="width:100%"></i></div>`;
    const items = $("#drawer-items");
    if (!cart.length) {
      items.innerHTML = `<div class="drawer__empty"><p class="h-md">Your bag is empty</p><p style="color:var(--muted)">Salt is calling.</p><a class="btn btn--dark" href="product.html?id=yuzu">Shop best seller</a></div>`;
    } else {
      items.innerHTML = cart.map((l, i) => { const p = byId(l.id); return `<div class="line-item">
        <a class="line-item__media" href="product.html?id=${p.id}">${pouch(p)}</a>
        <div><h5>${p.name}</h5><small>${l.pack} sticks · ${l.sub ? "Subscribe & save, every 30 days" : "One-time purchase"}</small>
          <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div>
        <div class="line-item__price">${money(unit(l) * l.qty)}${l.sub ? `<s>${money(p.price[l.pack] * l.qty)}</s>` : ""}</div></div>`; }).join("");
    }
    const upsellP = PRODUCTS.find((p) => !cart.some((l) => l.id === p.id));
    $("#drawer-upsell").innerHTML = upsellP && cart.length ? `<div class="fine" style="margin-bottom:8px;font-weight:700;color:var(--ink)">PAIRS WELL WITH</div><div class="upsell">${pouch(upsellP)}<div class="upsell__text"><b>${upsellP.short}</b>${money(upsellP.price[15] * (1 - CFG.SUBSCRIBE_DISCOUNT))} with subscribe</div><button class="btn btn--dark" data-upsell="${upsellP.id}">+ Add</button></div>` : "";
    $("#drawer-total").innerHTML = `<span>Subtotal</span><span>${money(subtotal())}</span>`;
    $("#checkout-btn").disabled = !cart.length;
  }
  const openDrawer = () => { $("#drawer").classList.add("open"); $("#scrim").classList.add("open"); };
  const closeAll = () => { $$(".drawer, .modal, .mobile-nav").forEach((e) => e.classList.remove("open")); $("#scrim").classList.remove("open"); document.body.style.overflow = ""; };
  function openModal(id) { closeAll(); $("#" + id).classList.add("open"); $("#scrim").classList.add("open"); document.body.style.overflow = "hidden"; }

  /* ================= shared chrome ================= */
  function chrome(overlay) {
    const nav = `<a href="index.html#shop">Shop all</a><a href="product.html?id=yuzu">Hydration</a><a href="product.html?id=coldbrew">Focus</a><a href="product.html?id=night">Sleep</a><a href="index.html#science">Science</a>`;
    document.body.insertAdjacentHTML("afterbegin", `
      <div class="announce"><div class="announce__track"><span>Free shipping on orders $${CFG.FREE_SHIPPING_THRESHOLD}+</span><span>Subscribe &amp; save ${Math.round(CFG.SUBSCRIBE_DISCOUNT * 100)}% on every order</span><span>Zero sugar · Real sea salt · Made in the USA</span></div></div>
      <header class="header ${overlay ? "header--overlay" : "is-solid"}">
        <div class="header__inner">
          <div class="header__left"><button class="icon-btn menu-btn" data-open-nav aria-label="Menu">${I.menu}</button><nav class="nav-links">${nav}</nav></div>
          <a class="logo" href="index.html" aria-label="SOLT home"><span class="logo__cube">${cubeHTML()}</span>SOLT</a>
          <div class="header__right"><button class="icon-btn" aria-label="Search" data-soon>${I.search}</button><button class="icon-btn" aria-label="Account" data-soon>${I.user}</button><button class="icon-btn" aria-label="Cart" data-open-cart>${I.bag}<span class="cart-count">0</span></button></div>
        </div>
      </header>
      <nav class="mobile-nav"><button class="icon-btn" data-close aria-label="Close">${I.close}</button>${nav}</nav>`);

    document.body.insertAdjacentHTML("beforeend", `
      <section class="connect"><h2 class="h-lg"><span class="underline-draw reveal-trigger">CONNECT WITH US!</span></h2>
        <div class="socials"><a class="icon-btn" href="#" aria-label="Instagram" data-soon>${I.ig}</a><a class="icon-btn" href="#" aria-label="TikTok" data-soon>${I.tt}</a></div></section>
      <footer class="footer"><div class="wrap">
        <div class="footer__signup"><p>Drop your email. Be first to know about new flavors, restocks and members-only drops.</p>
          <form class="inline-form" data-lead="footer"><input type="email" required placeholder="Email address" aria-label="Email"><button class="btn btn--dark">Sign Up</button></form></div>
        <div class="footer__cols">
          <div><h4>Salt, solved.</h4><p>SOLT makes clean electrolyte sticks with real sea salt, real fruit and nothing your body has to decode. Built for athletes, early mornings, long flights and everyone who's just a little bit thirsty.</p></div>
          <div><h4>Quick links</h4><ul><li><a href="#" data-soon>Contact us</a></li><li><a href="#" data-soon>Become an ambassador</a></li><li><a href="#" data-soon>Wholesale</a></li><li><a href="#" data-soon>Manage subscription</a></li><li><a href="#" data-soon>Shipping policy</a></li><li><a href="#" data-soon>Refund policy</a></li></ul></div>
        </div>
        <div class="footer__bottom"><span>© ${new Date().getFullYear()} SOLT. These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</span>
          <div class="pay"><span>VISA</span><span>MC</span><span>AMEX</span><span>PAYPAL</span><span>APPLE PAY</span><span>G PAY</span><span>SHOP PAY</span></div></div>
      </div></footer>

      <div class="scrim" id="scrim"></div>
      <aside class="drawer" id="drawer" aria-label="Cart">
        <div class="drawer__head"><span class="h-md">Your bag</span><button class="icon-btn" data-close aria-label="Close cart">${I.close}</button></div>
        <div class="drawer__ship" id="drawer-ship"></div>
        <div class="drawer__items" id="drawer-items"></div>
        <div class="drawer__upsell" id="drawer-upsell"></div>
        <div class="drawer__foot"><div class="drawer__total" id="drawer-total"></div><button class="btn btn--dark btn--block" id="checkout-btn">Checkout</button><p class="fine" style="text-align:center;margin:10px 0 0">Taxes and shipping calculated at checkout</p></div>
      </aside>

      <div class="modal" id="waitlist" role="dialog" aria-modal="true" aria-label="Reserve your order"><div class="modal__card"><button class="icon-btn modal__close" data-close aria-label="Close">${I.close}</button>
        <div class="split"><div class="split__art"><div class="cubes" data-cubes="5"></div><div class="tilt floaty">${pouch(byId("yuzu"))}</div></div>
        <div class="split__body" id="waitlist-body"></div></div></div></div>

      <div class="modal" id="popup" role="dialog" aria-modal="true" aria-label="Discount offer"><div class="modal__card"><button class="icon-btn modal__close" data-close aria-label="Close">${I.close}</button>
        <div class="split"><div class="split__art" style="background:linear-gradient(160deg,#d6ff3a,#7fd0ff)"><div class="cubes" data-cubes="6"></div><div class="tilt floaty">${pouch(byId("watermelon"))}</div></div>
        <div class="split__body" id="popup-body"></div></div></div></div>

      <div class="modal" id="quickview" role="dialog" aria-modal="true" aria-label="Quick view"><div class="modal__card"><button class="icon-btn modal__close" data-close aria-label="Close">${I.close}</button><div id="qv-body"></div></div></div>
      <div class="toast" id="toast"></div>`);
  }

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2600); }

  function fillCubes() {
    $$("[data-cubes]").forEach((box) => {
      const n = +box.dataset.cubes; let html = "";
      for (let i = 0; i < n; i++) {
        const s = 14 + ((i * 37) % 36), x = (i * 53 + 7) % 92, y = (i * 29 + 11) % 86, d = 9 + (i % 4) * 4;
        html += `<div class="float" style="left:${x}%;top:${y}%;animation-delay:${-i * 1.3}s"><div class="cube" style="--s:${s}px;animation-duration:${d}s;animation-delay:${-i}s"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`;
      }
      box.innerHTML = html;
    });
  }

  /* ================= checkout = fake door ================= */
  function startCheckout() {
    const value = +subtotal().toFixed(2);
    track("begin_checkout", { value, items: cart.map((l) => `${l.id}x${l.qty}(${l.pack}${l.sub ? "-sub" : ""})`).join(","), ids: cart.map((l) => l.id) });
    const hp = byId(cart[0].id);
    $("#waitlist .split__art").style.background = `linear-gradient(160deg, ${hp.sky[0]}, ${hp.sky[1]})`;
    $("#waitlist .split__art .tilt").innerHTML = pouch(hp);
    $("#waitlist-body").innerHTML = `
      <span class="eyebrow" style="justify-content:center">${I.spark.replace("<svg", '<svg width="14" height="14"')} You're early</span>
      <h3 class="h-lg" style="font-size:clamp(32px,4vw,46px)">Our first batch isn't shipping yet.</h3>
      <p style="margin:0;line-height:1.5">We've saved your ${money(value)} bag. Leave your email and you'll get first access at launch, plus <b>30% off</b> and free shipping on this order. No payment taken today.</p>
      <form data-lead="checkout" style="display:grid;gap:10px;margin-top:6px"><input class="field" type="email" required placeholder="you@email.com" aria-label="Email"><button class="btn btn--accent btn--block">Reserve my order</button></form>
      <p class="fine">We'll only email you about SOLT. Unsubscribe anytime.</p>`;
    openModal("waitlist");
  }

  function handleLead(form) {
    const email = form.querySelector("input[type=email]").value.trim();
    if (!email) return;
    const src = form.dataset.lead;
    const extra = src === "checkout" ? { value: +subtotal().toFixed(2), items: cart.map((l) => `${l.id}x${l.qty}`).join(",") } : {};
    if (src === "popup") extra.goal = store.get("solt_goal", "");
    track("generate_lead", { email, source: src, ...extra });
    store.set("solt_lead", email);
    if (src === "checkout") {
      $("#waitlist-body").innerHTML = `<h3 class="h-lg" style="font-size:clamp(32px,4vw,46px)">You're on the list.</h3><p style="line-height:1.5;margin:0">Your bag is reserved. We'll email <b>${email.replace(/</g, "")}</b> the moment SOLT ships, with your 30% code attached.</p><button class="btn btn--dark btn--block" data-close>Keep browsing</button>`;
    } else if (src === "popup") {
      $("#popup-body").innerHTML = `<div class="logo" style="justify-content:center">SOLT</div><h3 class="h-lg" style="font-size:clamp(30px,3.6vw,44px)">Here's your code</h3><div class="code-box">${CFG.POPUP_DISCOUNT_CODE}</div><p class="fine">Applies automatically at checkout. Free shipping included.</p><button class="btn btn--dark btn--block" data-close>Start shopping</button>`;
    } else {
      form.innerHTML = `<p style="margin:12px auto;font-weight:700">You're in. Watch your inbox.</p>`;
    }
  }

  /* ================= discount popup ================= */
  function popup() {
    if (store.get("solt_popup_seen", false) || store.get("solt_lead", "")) return;
    setTimeout(() => {
      if ($(".modal.open, .drawer.open")) return;
      store.set("solt_popup_seen", true);
      $("#popup-body").innerHTML = `<div class="logo" style="justify-content:center;font-size:22px">SOLT</div>
        <h3 class="h-lg" style="font-size:clamp(32px,3.8vw,48px)">You've got up to <br>30% off</h3><div class="h-md">+ free shipping</div>
        <p class="fine" style="color:var(--ink)">To claim your discount... what's your main goal?</p>
        <div class="goal-btns"><button data-goal="hydration">Hydration &amp; recovery</button><button data-goal="focus">Energy &amp; focus</button><button data-goal="sleep">Better sleep</button><button data-goal="endurance">Endurance</button></div>`;
      openModal("popup"); track("popup_view");
    }, CFG.POPUP_DELAY_MS);
  }

  /* ================= quick view ================= */
  function quickView(id) {
    const p = byId(id); let pack = 15;
    track("quick_view", { product: id, ids: [id] });
    const render = () => {
      $("#qv-body").innerHTML = `<div class="qv"><div class="qv__media tilt" data-tilt>${pouch(p)}</div><div class="qv__body">
        <div class="buy__brand">SOLT</div><h3 class="buy__title" style="font-size:36px;margin:0">${p.name}</h3>
        <div class="buy__price">${money(p.price[pack] * (1 - CFG.SUBSCRIBE_DISCOUNT))} <s>${money(p.price[pack])}</s></div>
        <p style="margin:0;line-height:1.5">${p.oneLiner}</p>
        <div class="packs">${[15, 30].map((n) => `<button class="pack ${n === pack ? "is-active" : ""}" data-qv-pack="${n}"><b>${n} sticks</b><small>${money(p.price[n])}</small>${n === 30 ? `<span class="save">save ${saving(p)}%</span>` : ""}</button>`).join("")}</div>
        <button class="btn btn--dark btn--block" data-qv-add>Add to cart · subscribe &amp; save</button>
        <a href="product.html?id=${p.id}" style="text-align:center;font-weight:700;font-size:14px">View full details</a></div></div>`;
      bindTilt($("#qv-body"));
    };
    render(); openModal("quickview");
    $("#qv-body").onclick = (e) => {
      const b = e.target.closest("[data-qv-pack]"); if (b) { pack = +b.dataset.qvPack; render(); }
      if (e.target.closest("[data-qv-add]")) { closeAll(); addToCart(p.id, pack, true, 1, "quick_view"); }
    };
  }
  const saving = (p) => Math.round((1 - p.price[30] / (p.price[15] * 2)) * 100);
  const range = (p) => `${money(p.price[15] * (1 - CFG.SUBSCRIBE_DISCOUNT))} – ${money(p.price[30])}`;

  /* ================= motion helpers ================= */
  function bindTilt(root = document) {
    $$("[data-tilt]", root).forEach((el) => {
      if (el._tilt) return; el._tilt = true;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        $$(".pouch", el).forEach((p) => { p.style.setProperty("--ry", x * 46 + "deg"); p.style.setProperty("--rx", -y * 20 + "deg"); });
      });
      el.addEventListener("pointerleave", () => $$(".pouch", el).forEach((p) => { p.style.removeProperty("--ry"); p.style.removeProperty("--rx"); }));
    });
  }
  function splitWords() {
    $$(".reveal-word").forEach((el) => { if (el._split) return; el._split = true; el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span style="--i:${i}">${w}</span>`).join(" "); });
  }
  function observe() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } }), { threshold: .2 });
    $$(".reveal, .reveal-word, .always, .connect, .reveal-trigger").forEach((el) => io.observe(el));
  }
  function bindCarousels() {
    $$("[data-carousel]").forEach((c) => {
      const track = $(".carousel__track, .reviews__track", c);
      $$("[data-dir]", c).forEach((b) => b.addEventListener("click", () => track.scrollBy({ left: +b.dataset.dir * (track.firstElementChild.offsetWidth + 16), behavior: "smooth" })));
    });
  }

  /* ================= home page ================= */
  function cardHTML(p, i) {
    return `<div class="card"><div class="card__wrap"><a href="product.html?id=${p.id}" class="card__media" style="--glow:${p.accent}" data-tilt>${i === 0 ? '<span class="card__badge">Best seller</span>' : p.id === "coldbrew" ? '<span class="card__badge">New</span>' : ""}${pouch(p)}</a>
      <div class="card__quick"></div></div>
      <a href="product.html?id=${p.id}" style="text-decoration:none"><h3 class="card__name">${p.name}</h3><div class="card__price">From <b>${range(p)}</b></div></a></div>`;
  }

  function initHome() {
    // hero
    const hero = $("#hero");
    hero.innerHTML = PRODUCTS.map((p, i) => `<div class="hero__slide ${i === 0 ? "is-active" : ""}" style="--sky1:${p.sky[0]};--sky2:${p.sky[1]}" data-tilt>
        <div class="hero__sun"></div><div class="cubes" data-cubes="7"></div>
        <h2 class="hero__word"><span>${p.hero[0]}</span><span>${p.hero[1]}</span></h2>
        <div class="hero__product"><div class="tilt floaty" style="position:relative">${pouch(p)}<div class="hero__sticks">${stick(p)}${stick(p)}</div></div></div>
        <a class="btn btn--accent hero__cta" href="product.html?id=${p.id}" data-track="hero_cta" data-product="${p.id}">Shop ${p.short}</a>
      </div>`).join("") + `<button class="hero__arrow hero__arrow--prev" aria-label="Previous slide">${I.left}</button><button class="hero__arrow hero__arrow--next" aria-label="Next slide">${I.right}</button><div class="hero__dots">${PRODUCTS.map((_, i) => `<button aria-label="Slide ${i + 1}" class="${i === 0 ? "is-active" : ""}"></button>`).join("")}</div>`;
    let cur = 0, timer;
    const go = (n) => {
      const slides = $$(".hero__slide", hero), dots = $$(".hero__dots button", hero);
      slides[cur].classList.remove("is-active"); dots[cur].classList.remove("is-active");
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add("is-active"); dots[cur].classList.add("is-active");
      restart();
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000); };
    $(".hero__arrow--prev", hero).onclick = () => go(cur - 1);
    $(".hero__arrow--next", hero).onclick = () => go(cur + 1);
    $$(".hero__dots button", hero).forEach((d, i) => (d.onclick = () => go(i)));
    let sx = null; hero.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    hero.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    restart();

    // tickers
    const tick = (items) => { const one = items.map((t) => `<span class="ticker__item">${t} ${I.spark}</span>`).join(""); return one + one + one + one; };
    $$("[data-ticker]").forEach((t) => (t.innerHTML = tick(t.dataset.ticker.split("|"))));

    // products
    $("#products").innerHTML = PRODUCTS.map(cardHTML).join("");
    $$("#products .card").forEach((c, i) => ($(".card__quick", c).innerHTML = `<button class="btn btn--white btn--block" data-quick="${PRODUCTS[i].id}" style="padding:12px">Quick View</button>`));

    // "first" banner
    const cb = byId("coldbrew");
    $("#first-product").innerHTML = `<div class="tilt floaty">${pouch(cb)}</div>`;

    // crystals
    $("#crystals").innerHTML = PRODUCTS.map((p) => `<a class="crystal" href="product.html?id=${p.id}"><span class="crystal__blob" style="--b1:${p.blob[0]};--b2:${p.blob[1]}"></span><b>${p.short}</b><small>${p.bandText.toLowerCase()}</small></a>`).join("");

    // comparison slider
    const cmp = $("#compare");
    $("input", cmp).addEventListener("input", (e) => cmp.style.setProperty("--pos", e.target.value + "%"));
    $("#compare-sticks").innerHTML = PRODUCTS.slice(0, 3).map((p, i) => stick(p, `--w:${44 + i * 6}px;left:${14 + i * 9}%;bottom:${-6 + i * 4}%;transform:rotate(${-14 + i * 12}deg)`)).join("");

    // reviews (SAMPLE copy: replace with real customer reviews before you run ads)
    const reviews = [
      ["I drink a gallon a day and still got headaches on long shifts. One yuzu stick at lunch and that's gone. Tastes like a fancy soda.", "Maya R.", "ICU nurse", "yuzu"],
      ["Cold brew + salt sounded insane. Now it's my pre-lift every single morning. Focused, not jittery, and no 2pm crash.", "Dre T.", "Powerlifter", "coldbrew"],
      ["The night stick is the first magnesium thing I actually look forward to. Warm water, lights off, done.", "Priya S.", "Founder, early riser", "night"],
      ["Ran my first marathon on Endure. Zero GI issues and I never hit the wall. Already bought the 30 pack.", "Sam K.", "Marathoner", "endure"],
      ["Watermelon mint after hot yoga is unreal. My whole studio asks what's in my bottle.", "Lena M.", "Yoga instructor", "watermelon"],
    ];
    $("#reviews").innerHTML = reviews.map(([q, n, r, id]) => { const p = byId(id); return `<article class="review">
        <div class="review__stars">${I.star.repeat(5)} 5/5 <span class="sample-tag">sample review</span></div>
        <p class="review__quote">${q}</p>
        <div class="review__foot"><div class="review__who"><span class="avatar">${n[0]}</span><b>${n}</b><small>${r}</small></div>
          <a class="review__product" href="product.html?id=${p.id}">${pouch(p)}<span><b>${p.name}</b>${range(p)}<br><u>Shop Now</u></span></a></div></article>`; }).join("");

    // UGC strip
    const scenes = [["#ffd23f", "#ff8a1f", "yuzu", "pouch", "gym bag essential"], ["#1b1b1b", "#555", "coldbrew", "stick", "5:30am"], ["#7dd3fc", "#e6f7ff", "watermelon", "pouch", ""], ["#2b2e73", "#8b86ff", "night", "pouch", "lights out"], ["#ff7a1a", "#ffd1a8", "endure", "stick", "mile 18"], ["#d6ff3a", "#7fd0ff", "yuzu", "stick", ""], ["#ff5d73", "#ffd1d8", "watermelon", "stick", "post hot yoga"], ["#3a2a22", "#c08a5b", "coldbrew", "pouch", ""]];
    const tiles = scenes.map(([a, b, id, kind, big]) => { const p = byId(id); return `<div class="ugc__tile" style="--t1:${a};--t2:${b}">${big ? `<span class="big">${big}</span>` : ""}<div class="tilt" style="transform:rotate(${(id.length % 3) * 6 - 6}deg)">${kind === "pouch" ? pouch(p) : `<div style="display:flex;gap:8px">${stick(p)}${stick(p)}${stick(p)}</div>`}</div><span class="tag">@drinksolt</span></div>`; }).join("");
    $("#ugc").innerHTML = tiles + tiles;
  }

  /* ================= product page ================= */
  function initPDP() {
    const id = new URLSearchParams(location.search).get("id") || "yuzu";
    const p = byId(id);
    let pack = 15, sub = true;
    document.title = `${p.name} | SOLT`;
    document.documentElement.style.setProperty("--sky1", p.sky[0]); document.documentElement.style.setProperty("--sky2", p.sky[1]);

    const views = [
      { thumb: pouch(p), html: `<div class="tilt" data-drag>${pouch(p)}</div><span class="hint">Drag to rotate</span>` },
      { thumb: stick(p), html: `<div class="gallery__sticks">${stick(p)}${stick(p)}${stick(p)}${stick(p)}</div>`, cls: "" },
      { thumb: `<span style="font-weight:800;font-size:11px">FACTS</span>`, html: `<div class="panel"><h4>Supplement Facts</h4><small>Serving size 1 stick (6g)</small>${p.nutrition.map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join("")}<p class="fine" style="margin:10px 0 0">Other ingredients: ${p.ingr.join(", ")}, citric acid, natural flavors, stevia leaf extract.</p></div>` },
      { thumb: `<span style="width:100%;height:100%;background:linear-gradient(180deg,${p.sky[0]},${p.sky[1]})"></span>`, html: `<div class="cubes" data-cubes="9"></div><div class="tilt floaty">${pouch(p)}</div>`, cls: "gallery__view--sky" },
    ];
    $("#pdp").innerHTML = `
      <div class="gallery"><div class="gallery__thumbs">${views.map((v, i) => `<button class="${i === 0 ? "is-active" : ""}" data-view="${i}" aria-label="Image ${i + 1}">${v.thumb}</button>`).join("")}</div>
        <div class="gallery__main" data-tilt>${views.map((v, i) => `<div class="gallery__view ${v.cls || ""} ${i === 0 ? "is-active" : ""}">${v.html}</div>`).join("")}</div></div>
      <div class="buy">
        <div class="buy__brand">SOLT</div>
        <h1 class="buy__title">${p.name}</h1>
        <div class="buy__rating"><span class="sample-tag" style="background:var(--accent);color:var(--ink)">NEW</span><span>First batch · limited run</span></div>
        <div class="buy__price" id="price"></div>
        <div class="buy__ship">Shipping calculated at checkout.</div>
        <p class="buy__one">${p.oneLiner}</p>
        <p class="buy__desc">${p.desc}</p>
        <div class="buy__tag">${p.tagline}</div>
        <div class="opt-label"><span>Pack size:</span><span id="pack-label"></span></div>
        <div class="packs">${[15, 30].map((n) => `<button class="pack" data-pack="${n}"><b>${n} sticks</b><small>${money(p.price[n] / n)}/serving</small>${n === 30 ? `<span class="save">save ${saving(p)}%</span>` : ""}</button>`).join("")}</div>
        <div class="opt-label"><span>Purchase type:</span></div>
        <div class="purchase">
          <label data-sub="1"><input type="radio" name="sub" checked><span>Subscribe &amp; save ${Math.round(CFG.SUBSCRIBE_DISCOUNT * 100)}%<small>Delivered every 30 days · skip or cancel anytime</small></span><em id="sub-price"></em></label>
          <label data-sub="0"><input type="radio" name="sub"><span>One-time purchase</span><em id="once-price"></em></label>
        </div>
        <div style="height:16px"></div>
        <button class="btn btn--dark btn--block" id="atc">Add to Cart</button>
        <p class="fine" id="sub-note" style="margin:10px 0 0">This item is a recurring purchase. By continuing, you agree to be charged every 30 days until you cancel.</p>
        <div class="stock"><i></i> In stock, ships in 1-2 business days</div>
        <div class="perks"><div>${I.truck}Free shipping $${CFG.FREE_SHIPPING_THRESHOLD}+</div><div>${I.loop}Skip or cancel anytime</div><div>${I.shield}30-day taste guarantee</div></div>
      </div>`;

    const sync = () => {
      $$(".pack").forEach((b) => b.classList.toggle("is-active", +b.dataset.pack === pack));
      $$(".purchase label").forEach((l) => { const on = l.dataset.sub === (sub ? "1" : "0"); l.classList.toggle("is-active", on); $("input", l).checked = on; });
      const full = p.price[pack], disc = full * (1 - CFG.SUBSCRIBE_DISCOUNT);
      $("#price").innerHTML = sub ? `${money(disc)} <s>${money(full)}</s>` : money(full);
      $("#sub-price").textContent = money(disc); $("#once-price").textContent = money(full);
      $("#pack-label").textContent = `${pack} sticks`;
      $("#sub-note").style.display = sub ? "" : "none";
      $("#sticky-price").textContent = money(sub ? disc : full) + ` · ${pack} sticks`;
    };
    $("#sticky-pouch").innerHTML = pouch(p); $("#sticky-name").firstChild.textContent = p.name;
    $$(".pack").forEach((b) => (b.onclick = () => { pack = +b.dataset.pack; sync(); }));
    $$(".purchase label").forEach((l) => (l.onclick = (e) => { e.preventDefault(); sub = l.dataset.sub === "1"; sync(); }));
    $("#atc").onclick = $("#sticky-atc-btn").onclick = (e) => addToCart(p.id, pack, sub, 1, e.currentTarget.id === "atc" ? "pdp" : "sticky_bar");
    sync();

    // gallery
    $$("[data-view]").forEach((b) => (b.onclick = () => {
      $$("[data-view]").forEach((x) => x.classList.toggle("is-active", x === b));
      $$(".gallery__view").forEach((v, i) => v.classList.toggle("is-active", i === +b.dataset.view));
    }));
    // drag to rotate the 3D pouch
    const drag = $("[data-drag]"), dp = $(".pouch", drag); let start = null, base = -14;
    drag.addEventListener("pointerdown", (e) => { start = e.clientX; drag.setPointerCapture(e.pointerId); dp.style.transition = "none"; });
    drag.addEventListener("pointermove", (e) => { if (start === null) return; const ry = Math.max(-75, Math.min(75, base + (e.clientX - start) * .5)); dp.style.setProperty("--ry", ry + "deg"); });
    const end = (e) => { if (start === null) return; base = parseFloat(dp.style.getPropertyValue("--ry")) || base; start = null; dp.style.transition = ""; };
    drag.addEventListener("pointerup", end); drag.addEventListener("pointercancel", end);
    drag.style.touchAction = "pan-y"; drag.style.cursor = "grab";

    // comparison table + science + related
    const rows = [["Real sea salt", 1, 0, 0], ["1000mg sodium per serving", 1, 0, 0], ["Zero sugar", 1, 0, 1], ["No artificial dyes", 1, 0, 1], ["Tastes amazing", 1, 1, 0], ["Fits in your pocket", 1, 0, 0]];
    $("#vs").innerHTML = `<thead><tr><th></th><th class="ours">SOLT</th><th>Sports drink</th><th>Plain water</th></tr></thead><tbody>${rows.map(([k, ...v]) => `<tr><td>${k}</td>${v.map((x, i) => `<td class="${i === 0 ? "ours" : ""}">${x ? I.check : I.x}</td>`).join("")}</tr>`).join("")}</tbody>`;
    $("#related").innerHTML = PRODUCTS.filter((x) => x.id !== p.id).map(cardHTML).join("");
    $$("#related .card").forEach((c) => { const rid = $("a", c).href.split("id=")[1]; $(".card__quick", c).innerHTML = `<button class="btn btn--white btn--block" data-quick="${rid}" style="padding:12px">Quick View</button>`; });
    $$("[data-ticker]").forEach((t) => { const one = t.dataset.ticker.split("|").map((x) => `<span class="ticker__item">${x} ${I.spark}</span>`).join(""); t.innerHTML = one + one + one + one; });

    // sticky add-to-cart bar
    new IntersectionObserver(([e]) => $("#sticky-atc").classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0)).observe($("#atc"));

    track("view_item", { product: p.id, value: p.price[15], ids: [p.id] });
  }

  /* ================= boot ================= */
  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    chrome(page === "home");
    loadPixels();
    if (page === "home") initHome(); else initPDP();
    fillCubes(); splitWords(); observe(); bindTilt(); bindCarousels(); renderCart(); popup();
    track("page_view", { page_type: page, referrer: document.referrer });

    const header = $(".header");
    if (page === "home") { const onScroll = () => header.classList.toggle("is-solid", scrollY > 40); addEventListener("scroll", onScroll, { passive: true }); onScroll(); }

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (t.closest("[data-open-cart]")) { openDrawer(); track("cart_open"); }
      else if (t.closest("[data-open-nav]")) { $(".mobile-nav").classList.add("open"); }
      else if (t.closest("[data-close]") || t.id === "scrim") closeAll();
      else if (t.closest("#checkout-btn")) startCheckout();
      else if (t.closest("[data-upsell]")) addToCart(t.closest("[data-upsell]").dataset.upsell, 15, true, 1, "cart_upsell");
      else if (t.closest("[data-quick]")) { e.preventDefault(); quickView(t.closest("[data-quick]").dataset.quick); }
      else if (t.closest("[data-goal]")) {
        const goal = t.closest("[data-goal]").dataset.goal; store.set("solt_goal", goal); track("popup_goal", { goal });
        $("#popup-body").innerHTML = `<div class="logo" style="justify-content:center;font-size:22px">SOLT</div><h3 class="h-lg" style="font-size:clamp(30px,3.6vw,44px)">Almost there.</h3><p style="margin:0">Where should we send your 30% off code?</p>
          <form data-lead="popup" style="display:grid;gap:10px"><input class="field" type="email" required placeholder="you@email.com" aria-label="Email"><button class="btn btn--accent btn--block">Unlock 30% off</button></form><p class="fine">By signing up you agree to receive marketing emails from SOLT.</p>`;
        $("#popup-body input").focus();
      }
      else if (t.closest("[data-soon]")) { e.preventDefault(); toast("Coming soon"); track("dead_click", { label: t.closest("[data-soon]").getAttribute("aria-label") || t.closest("[data-soon]").textContent.trim() }); }
      else if (t.closest("[data-track]")) { const el = t.closest("[data-track]"); track(el.dataset.track, { product: el.dataset.product }); }
      const q = t.closest("[data-q]"); if (q) setQty(+q.dataset.q, cart[+q.dataset.q].qty + +q.dataset.d);
    });
    document.addEventListener("submit", (e) => { const f = e.target.closest("[data-lead]"); if (f) { e.preventDefault(); handleLead(f); } });
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll());
    addEventListener("scroll", function depth() { const d = Math.round((scrollY + innerHeight) / document.body.scrollHeight * 4) * 25; if (d >= 75 && !depth.sent) { depth.sent = 1; track("scroll_75"); } }, { passive: true });
  });
})();
