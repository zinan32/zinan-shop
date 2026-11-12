/* =====================================================
   ZINAN · HOME PAGE (index.html)
   Text comes from js/config.js. Only the settings below
   live here.
   ===================================================== */

/* ===== SECTION 1: HOME SETTINGS · START ===== */
const HOME = {
  FEATURED_COUNT: 4,
  SHOW_PLACEHOLDER_TRUST: false // false = hides trust lines that still say [PLACEHOLDER]
};
/* ===== SECTION 1: HOME SETTINGS · END ===== */

/* ===== SECTION 2: FILL TEXT · START ===== */
function fillHomeText() {
  document.querySelectorAll('[data-cfg]').forEach(n => { n.textContent = Z[n.dataset.cfg] || ''; });

  const trust = Z.TRUST.filter(t => HOME.SHOW_PLACEHOLDER_TRUST || !t.startsWith('['));
  document.getElementById('trust-strip').replaceChildren(...trust.map(t => el('li', null, t)));

  document.getElementById('values').replaceChildren(...Z.WHY_VALUES.map(v =>
    el('div', null, el('h3', null, v.title), el('p', null, v.text))));

  const f = document.getElementById('follow-link');
  f.href = 'https://instagram.com/' + Z.INSTAGRAM;
  f.textContent = 'Follow @' + Z.INSTAGRAM;
}
/* ===== SECTION 2: FILL TEXT · END ===== */

/* ===== SECTION 3: FEATURED PRODUCTS · START ===== */
async function loadFeatured() {
  const host = document.getElementById('featured');
  try { renderGrid(host, (await getProducts()).slice(0, HOME.FEATURED_COUNT)); }
  catch (e) { showMessage(host, Z.MSG_LOAD_ERROR); }
}
/* ===== SECTION 3: FEATURED PRODUCTS · END ===== */

/* ===== SECTION 4: START · START ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'home2') return;
  fillHomeText();
  loadFeatured();
});
/* ===== SECTION 4: START · END ===== */
