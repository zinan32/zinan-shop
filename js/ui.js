/* =====================================================
   ZINAN · SHARED UI (header, footer, cards, helpers)
   All database text is inserted as text, never as HTML.
   ===================================================== */

/* ---------- SECTION 1: HELPERS ---------- */
function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) {
    if (c == null || c === false) continue;
    n.append(typeof c === 'object' ? c : String(c));
  }
  return n;
}

function money(v) {
  const n = Number(v);
  if (!n) return Z.PRICE_PLACEHOLDER;
  return Z.CURRENCY + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function safeImg(url) { return typeof url === 'string' && /^https:\/\//i.test(url) ? url : ''; }

function photo(url, alt, cls) {
  const src = safeImg(url);
  if (!src) return el('div', { class: 'ph ' + (cls || ''), role: 'img', 'aria-label': alt }, '[PHOTO]');
  return el('img', { class: cls || '', src, alt, loading: 'lazy', decoding: 'async' });
}

function showMessage(container, text) {
  container.replaceChildren(el('p', { class: 'notice', role: 'status' }, text));
}

/* ---------- SECTION 2: TOAST (add-to-cart confirmation) ---------- */
function toast(text) {
  let t = document.getElementById('toast');
  if (!t) {
    t = el('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(t);
  }
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- SECTION 3: HEADER ---------- */
function renderHeader() {
  const host = document.getElementById('site-header');
  if (!host) return;
  const logo = Z.LOGO_URL
    ? el('img', { src: Z.LOGO_URL, alt: Z.BRAND, class: 'logo-img' })
    : Z.BRAND;
  host.replaceChildren(
    el('div', { class: 'announce' }, Z.ANNOUNCEMENT),
    el('header', { class: 'bar' },
      el('div', { class: 'wrap bar-in' },
        el('a', { href: 'index.html', class: 'wordmark', 'aria-label': Z.BRAND + ' home' }, logo),
        el('nav', { class: 'nav', 'aria-label': 'Main' },
          el('a', { href: 'index.html' }, 'Home'),
          el('a', { href: 'shop.html' }, 'Shop')),
        el('a', { href: 'cart.html', class: 'cart-link', 'aria-label': 'Cart' },
          'Cart ', el('span', { class: 'badge', id: 'cart-badge' }, '0')))));
  updateBadge();
  document.addEventListener('cart:changed', updateBadge);
}

function updateBadge() {
  const b = document.getElementById('cart-badge');
  if (!b) return;
  b.textContent = Cart.count();
  b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
}

/* ---------- SECTION 4: FOOTER ---------- */
function renderFooter() {
  const host = document.getElementById('site-footer');
  if (!host) return;
  host.replaceChildren(el('footer', { class: 'footer' }, el('div', { class: 'wrap' },
    el('p', { class: 'wordmark' }, Z.BRAND),
    el('p', { class: 'muted-on-dark' }, Z.TAGLINE),
    el('p', null, el('a', { href: 'mailto:' + Z.EMAIL }, Z.EMAIL)),
    el('p', null, el('a', { href: 'https://instagram.com/' + Z.INSTAGRAM, rel: 'noopener' }, '@' + Z.INSTAGRAM)),
    el('p', { class: 'muted-on-dark' }, Z.PHONE),
    el('p', { class: 'small muted-on-dark' }, '© ' + new Date().getFullYear() + ' ' + Z.BUSINESS_NAME + ' · [PRIVACY AND TERMS LINKS]'))));
}

/* ---------- SECTION 5: PRODUCT CARD ---------- */
function productCard(p) {
  const href = 'product.html?id=' + encodeURIComponent(p.id);
  const add = el('button', {
    class: 'add-sq', type: 'button', 'aria-label': 'Add ' + p.name + ' to cart',
    onclick: () => { Cart.add(p.id, 1); toast(p.name + ' added to cart'); }
  }, '+');
  return el('article', { class: 'card' },
    el('a', { href, class: 'card-img', 'aria-label': p.name }, photo(p.image_url, p.name)),
    el('div', { class: 'card-body' },
      el('a', { href, class: 'card-name' }, p.name),
      el('p', { class: 'card-note' }, p.description || ''),
      el('div', { class: 'card-row' }, el('span', { class: 'price' }, money(p.price)), add)));
}

function renderGrid(host, products) {
  if (!products.length) return showMessage(host, Z.MSG_EMPTY_SHOP);
  host.replaceChildren(...products.map(productCard));
}

function trustRow() {
  return el('ul', { class: 'trust-row' }, Z.TRUST.map(t => el('li', null, t)));
}
