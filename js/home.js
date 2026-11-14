/* =====================================================
   ZINAN · HOME PAGE (index.html)
   Text and settings come from js/config.js
   ===================================================== */

/* ===== SECTION 1: HOME SETTINGS · START ===== */
const HOME = { FEATURED_COUNT: 4 };
/* ===== SECTION 1: HOME SETTINGS · END ===== */

/* ===== SECTION 2: FILL TEXT · START =====
   In js/home.js, replace the whole old Section 2 (START line to END line) with this. */
function fillHomeText() {
  document.querySelectorAll('[data-cfg]').forEach(n => { n.textContent = Z[n.dataset.cfg] || ''; });

  document.getElementById('socials').replaceChildren(...(Z.SOCIALS || []).map(s =>
    el('a', { class: 'social', href: s.url, rel: 'noopener', target: '_blank', 'aria-label': 'Zinan on ' + s.name }, s.name)));
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

/* ===== SECTION 8: THE ZINAN EXPERIENCE · START =====
   Paste at the very bottom of js/home.js (after Section 7). */
function renderExperience() {
  const x = Z.EXPERIENCE;
  if (!x) return;
  document.getElementById('exp-eyebrow').textContent = x.EYEBROW;
  document.getElementById('exp-title').textContent = x.TITLE;
  document.getElementById('exp-intro').textContent = x.INTRO;
  document.getElementById('exp-list').replaceChildren(...x.ITEMS.map((it, i) =>
    el('li', { class: 'exp-item' },
      el('span', { class: 'exp-num', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')),
      el('div', null, el('h3', null, it.title), el('p', null, it.text)))));
}
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'home2') renderExperience();
});
/* ===== SECTION 8: THE ZINAN EXPERIENCE · END ===== */

/* ===== SECTION 9: REVIEWS CAROUSEL · START =====
   In js/home.js, replace the whole old Section 9 (START line to END line) with this. */
const RV_ICON = {
  prev: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'
};

function reviewCard(r) {
  const rating = Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 ? r.rating : 0;
  return el('figure', { class: 'rv-card' },
    el('span', { class: 'rv-quote', 'aria-hidden': 'true' }, '\u201C'),
    el('blockquote', null, el('p', null, r.text)),
    el('figcaption', { class: 'rv-who' },
      el('span', { class: 'rv-avatar', 'aria-hidden': 'true' }, String(r.name).trim().charAt(0).toUpperCase()),
      el('div', null,
        el('strong', null, r.name),
        r.source ? el('span', { class: 'rv-src' }, r.source) : null,
        rating ? el('span', { class: 'rv-rate', role: 'img', 'aria-label': 'Rated ' + rating + ' out of 5' },
          el('span', { class: 'stars', 'aria-hidden': 'true' }, '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating)),
          el('span', { class: 'rv-num', 'aria-hidden': 'true' }, rating + '/5')) : null)));
}

function renderReviews() {
  const host = document.getElementById('reviews');
  if (!host) return;
  const real = Array.isArray(Z.REVIEWS) ? Z.REVIEWS.filter(r => r && r.name && r.text) : [];
  const preview = new URLSearchParams(location.search).has('preview-reviews');
  const list = real.length ? real : (preview ? (Z.REVIEWS_SAMPLE || []) : []);
  if (!list.length) return; // no real reviews yet: section stays hidden

  const track = el('div', { class: 'rv-track', tabindex: '0', role: 'region', 'aria-label': 'Customer reviews' }, list.map(reviewCard));
  const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = dir => {
    const card = track.querySelector('.rv-card');
    const w = card ? card.getBoundingClientRect().width + 16 : 300;
    track.scrollBy({ left: dir * w, behavior: calm() ? 'auto' : 'smooth' });
  };
  const arrow = (cls, dir, label, icon) => {
    const b = el('button', { type: 'button', class: 'rv-btn ' + cls, 'aria-label': label, onclick: () => step(dir) });
    b.innerHTML = icon; // fixed icon markup above, no user text
    return b;
  };
  const prev = arrow('rv-prev', -1, 'Previous review', RV_ICON.prev);
  const next = arrow('rv-next', 1, 'Next review', RV_ICON.next);

  host.replaceChildren(el('div', { class: 'wrap' },
    el('h2', null, Z.REVIEWS_HEADING || 'What our customers say'),
    el('div', { class: 'rv-wrap' }, prev, track, next),
    !real.length ? el('p', { class: 'small' }, 'Preview only: these are sample cards, not real reviews.') : null));
  host.hidden = false;

  const sync = () => {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    prev.hidden = next.hidden = prev.disabled && next.disabled; // only one card: no arrows
  };
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  requestAnimationFrame(sync);
}
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'home2') renderReviews();
});
/* ===== SECTION 9: REVIEWS CAROUSEL · END ===== */
