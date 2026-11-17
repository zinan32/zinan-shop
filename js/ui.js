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

function safeImg(url) {
  // allowed: https links, or files in this site's img/ folder
  return typeof url === 'string' && /^(https:\/\/|img\/[a-z0-9_-]+\.(webp|jpg|png)$)/i.test(url) ? url : '';
}

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

/* ===== SECTION 4: FOOTER + NEWSLETTER · START =====
   In js/ui.js, replace the whole old Section 4 with this: from its START line
   down to its END line (the line just before "SECTION 5: PRODUCT CARD"). */
const SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  facebook:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  tiktok:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.2 1.7 3.8 4 4v3.1c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6v3.2a2.9 2.9 0 1 0 2.9 2.9V3h3.1z"/></svg>'
};

function realValue(v) { return v && !String(v).startsWith('['); } // hides [PLACEHOLDER] values
function footLinks(list) { return (list || []).filter(l => l && realValue(l.href)); }

function socialIcons() {
  return el('div', { class: 'foot-icons' }, ...(Z.SOCIALS || []).map(s => {
    const a = el('a', { class: 'soc-ic', href: s.url, rel: 'noopener', target: '_blank', 'aria-label': 'Zinan on ' + s.name });
    const svg = SOCIAL_ICONS[String(s.name).toLowerCase()];
    if (svg) a.innerHTML = svg; else a.textContent = String(s.name).charAt(0); // fixed icon markup above, no user text
    return a;
  }));
}

function buildNewsletter(n) {
  // no visible label; the field keeps an invisible one (aria-label) for screen readers
  const input = el('input', { id: 'nl-email', type: 'email', class: 'input', autocomplete: 'email', maxlength: 120,
                              placeholder: n.PLACEHOLDER, 'aria-label': n.PLACEHOLDER });
  const status = el('p', { class: 'nl-status', role: 'status' });
  const form = el('form', { class: 'nl-form', novalidate: true },
    el('div', { class: 'nl-row' }, input, el('button', { class: 'btn', type: 'submit' }, n.BUTTON)),
    status);
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Nothing is sent or stored yet. Connect this to the database later.
    status.textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? n.MSG : 'Please enter a valid email address.';
  });
  return el('section', { class: 'nl-strip', id: 'join' }, el('div', { class: 'wrap nl' },
    el('div', null, el('p', { class: 'eyebrow' }, n.EYEBROW), el('h2', null, n.TITLE), el('p', { class: 'nl-text' }, n.TEXT)),
    form));
}

function renderFooter() {
  const host = document.getElementById('site-footer');
  if (!host) return;
  const F = Z.FOOTER || {};
  const n = F.NEWSLETTER;
  const showStrip = n && (n.SHOW_ON || ['home2']).includes(document.body.dataset.page);
  const ig = (Z.SOCIALS || []).find(s => String(s.name).toLowerCase() === 'instagram');

  let logo;
  if (F.LOGO_WHITE_URL) {
    logo = el('img', { src: F.LOGO_WHITE_URL, alt: Z.BRAND, class: 'foot-logo', height: 30 });
    logo.addEventListener('error', () => logo.replaceWith(el('span', { class: 'wordmark' }, Z.BRAND)));
  } else logo = el('span', { class: 'wordmark' }, Z.BRAND);

  const columns = (F.COLUMNS || []).map(c => {
    const links = footLinks(c.links);
    return links.length ? el('nav', { class: 'foot-col', 'aria-label': c.title },
      el('h3', null, c.title), el('ul', null, links.map(l => el('li', null, el('a', { href: l.href }, l.label))))) : null;
  });

  const legal = footLinks(F.LEGAL).map(l => el('a', { href: l.href }, l.label));
  const name = realValue(Z.BUSINESS_NAME) ? Z.BUSINESS_NAME : Z.BRAND;

  host.replaceChildren(
    showStrip ? buildNewsletter(n) : null,
    el('footer', { class: 'footer sitefoot' }, el('div', { class: 'wrap' },
      el('div', { class: 'foot-grid' },
        el('div', { class: 'foot-brand' },
          logo,
          el('p', { class: 'foot-about' }, F.ABOUT || Z.TAGLINE),
          ig ? el('p', { class: 'foot-handle' }, 'Follow us ', el('a', { href: ig.url, rel: 'noopener', target: '_blank' }, '@' + Z.INSTAGRAM)) : null,
          socialIcons()),
        ...columns,
        el('div', { class: 'foot-col foot-contact' },
          el('h3', null, 'Contact'),
          el('ul', null,
            el('li', null, el('a', { href: 'mailto:' + Z.EMAIL }, Z.EMAIL)),
            realValue(Z.PHONE) ? el('li', null, el('span', null, Z.PHONE)) : null,
            F.HOURS ? el('li', null, el('span', { class: 'muted-on-dark' }, F.HOURS)) : null))),
      el('div', { class: 'foot-bottom' },
        el('span', { class: 'small muted-on-dark' }, '\u00a9 ' + new Date().getFullYear() + ' ' + name + '. All rights reserved.'),
        legal.length ? el('span', { class: 'foot-legal' }, ...legal) : null))));
}
/* ===== SECTION 4: FOOTER + NEWSLETTER · END ===== */

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
