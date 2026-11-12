/* =====================================================
   ZINAN · SHOP PAGE with category chips (shop.html)
   ===================================================== */

/* ===== SECTION 1: CATEGORY CHIPS · START ===== */
function renderShopChips(active) {
  const items = [{ key: '', label: 'All' }].concat(Z.CATEGORIES);
  document.getElementById('chips').replaceChildren(...items.map(c =>
    el('a', { class: 'chip', href: c.key ? 'shop.html?cat=' + encodeURIComponent(c.key) : 'shop.html',
              'aria-current': c.key === active ? 'page' : null }, c.label)));
}
/* ===== SECTION 1: CATEGORY CHIPS · END ===== */

/* ===== SECTION 2: SHOP GRID · START ===== */
async function initShopPage() {
  const asked = new URLSearchParams(location.search).get('cat') || '';
  const cat = Z.CATEGORIES.some(c => c.key === asked) ? asked : '';
  renderShopChips(cat);
  const host = document.getElementById('grid');
  try {
    const all = await getProducts();
    renderGrid(host, cat ? all.filter(p => p.category === cat) : all);
  } catch (e) { showMessage(host, Z.MSG_LOAD_ERROR); }
}
/* ===== SECTION 2: SHOP GRID · END ===== */

/* ===== SECTION 3: START · START ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'shop2') initShopPage();
});
/* ===== SECTION 3: START · END ===== */
