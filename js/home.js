/* =====================================================
   ZINAN · HOME PAGE (index.html)
   Text and settings come from js/config.js
   ===================================================== */

/* ===== SECTION 1: HOME SETTINGS · START ===== */
const HOME = { FEATURED_COUNT: 4 };
/* ===== SECTION 1: HOME SETTINGS · END ===== */

/* ===== SECTION 2: FILL TEXT · START ===== */
function fillHomeText() {
  document.querySelectorAll('[data-cfg]').forEach(n => { n.textContent = Z[n.dataset.cfg] || ''; });
  document.getElementById('values').replaceChildren(...Z.WHY_VALUES.map(v =>
    el('div', null, el('h3', null, v.title), el('p', null, v.text))));
  const f = document.getElementById('follow-link');
  f.href = 'https://instagram.com/' + Z.INSTAGRAM;
  f.textContent = 'Follow @' + Z.INSTAGRAM;
}
/* ===== SECTION 2: FILL TEXT · END ===== */

/* ===== SECTION 3: TRUST CARD · START ===== */
function renderTrustCard() {
  document.getElementById('trustcard').replaceChildren(...Z.TRUST_CARD.map(t =>
    el('div', { class: 'tc-item' },
      el('span', { class: 'tc-icon', 'aria-hidden': 'true' }, t.icon),
      el('div', null, el('strong', null, t.title), el('p', null, t.text)))));
}
/* ===== SECTION 3: TRUST CARD · END ===== */

/* ===== SECTION 4: OFFER BANNER · START ===== */
function renderOffer() {
  const o = Z.OFFER, host = document.getElementById('offer');
  if (!o || !o.ENABLED || !o.TITLE) return;
  host.replaceChildren(el('div', { class: 'wrap' },
    el('p', { class: 'eyebrow' }, o.EYEBROW),
    el('h2', null, o.TITLE),
    el('p', null, o.TEXT),
    el('a', { class: 'btn', href: o.LINK }, o.CTA)));
  host.hidden = false;
}
/* ===== SECTION 4: OFFER BANNER · END ===== */

/* ===== SECTION 5: CATEGORY TILES · START ===== */
function renderTiles() {
  document.getElementById('tiles').replaceChildren(...Z.CATEGORIES.map(c =>
    el('a', { class: 'tile', href: 'shop.html?cat=' + encodeURIComponent(c.key) },
      el('div', { class: 'tile-img' }, photo(c.img, c.label)),
      el('span', { class: 'tile-label' }, c.label))));
}
/* ===== SECTION 5: CATEGORY TILES · END ===== */

/* ===== SECTION 6: PRODUCTS (featured + spotlight) · START ===== */
function renderSpotlight(products) {
  const s = Z.SPOTLIGHT, host = document.getElementById('spotlight');
  if (!s || !s.ENABLED) return;
  const p = products.find(x => x.name === s.PRODUCT_NAME);
  if (!p) return;
  host.replaceChildren(el('div', { class: 'wrap spot' },
    el('a', { class: 'spot-img', href: 'product.html?id=' + encodeURIComponent(p.id), 'aria-label': p.name }, photo(p.image_url, p.name)),
    el('div', { class: 'spot-text' },
      el('p', { class: 'eyebrow' }, s.EYEBROW),
      el('h2', null, p.name),
      el('p', { class: 'desc' }, p.description || ''),
      el('p', { class: 'price big' }, money(p.price)),
      el('a', { class: 'btn', href: 'product.html?id=' + encodeURIComponent(p.id) }, s.CTA))));
  host.hidden = false;
}

async function loadProducts() {
  const grid = document.getElementById('featured');
  try {
    const products = await getProducts();
    renderGrid(grid, products.slice(0, HOME.FEATURED_COUNT));
    renderSpotlight(products);
  } catch (e) { showMessage(grid, Z.MSG_LOAD_ERROR); }
}
/* ===== SECTION 6: PRODUCTS · END ===== */

/* ===== SECTION 7: START · START ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'home2') return;
  fillHomeText(); renderTrustCard(); renderOffer(); renderTiles(); loadProducts();
});
/* ===== SECTION 7: START · END ===== */
