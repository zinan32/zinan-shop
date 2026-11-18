/* =====================================================
   ZINAN · PAGE LOGIC
   Each page has its own SECTION. Edit one without
   touching the others.
   ===================================================== */

/* ===== SECTION 2: SHOP (browse) · START ===== */
async function initShop() {
  const host = document.getElementById('grid');
  try { renderGrid(host, await getProducts()); }
  catch (e) { showMessage(host, Z.MSG_LOAD_ERROR); }
}

/* ===== SECTION 2: SHOP (browse) · END ===== */

/* ===== SECTION 3: PRODUCT DETAIL · START ===== */
async function initProduct() {
  const host = document.getElementById('product');
  const id = new URLSearchParams(location.search).get('id') || '';
  let p;
  try { p = await getProduct(id); }
  catch (e) { return showMessage(host, Z.MSG_LOAD_ERROR); }
  if (!p) return showMessage(host, Z.MSG_NOT_FOUND);

  document.title = p.name + ' · ' + Z.BRAND;
  let qty = 1;
  const qtyOut = el('output', { class: 'qty-n', 'aria-live': 'polite' }, '1');
  const setQty = n => { qty = Math.max(1, Math.min(MAX_QTY, n)); qtyOut.textContent = qty; };
  const addBtn = el('button', {
    class: 'btn', type: 'button',
    onclick: () => {
      Cart.add(p.id, qty);
      addBtn.textContent = 'Added to cart';
      toast(p.name + ' added to cart');
      setTimeout(() => (addBtn.textContent = 'Add to cart'), 1600);
    }
  }, 'Add to cart');

  host.replaceChildren(
    el('div', { class: 'gallery' }, photo(p.image_url, p.name)),
    el('div', { class: 'detail' },
      el('p', { class: 'eyebrow' }, Z.BRAND),
      el('h1', null, p.name),
      el('p', { class: 'price big' }, money(p.price)),
      el('p', { class: 'desc' }, p.description || ''),
      el('div', { class: 'buy' },
        el('div', { class: 'qty', role: 'group', 'aria-label': 'Quantity' },
          el('button', { type: 'button', 'aria-label': 'Decrease quantity', onclick: () => setQty(qty - 1) }, '−'),
          qtyOut,
          el('button', { type: 'button', 'aria-label': 'Increase quantity', onclick: () => setQty(qty + 1) }, '+')),
        addBtn),
      trustRow(),
      buildTabs(p)));
}

function buildTabs(p) {
  const names = Object.keys(Z.TABS);
  const tabs = el('div', { class: 'tabs', role: 'tablist' });
  const panel = el('div', { class: 'tab-panel', role: 'tabpanel' });
  const show = (name, btn) => {
    tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b === btn));
    panel.textContent = Z.TABS[name] === null ? (p.description || '') : Z.TABS[name];
  };
  names.forEach((name, i) => {
    const b = el('button', { type: 'button', role: 'tab', 'aria-selected': i === 0, onclick: e => show(name, e.currentTarget) }, name);
    tabs.append(b);
  });
  show(names[0], tabs.firstChild);
  return el('div', { class: 'tabs-wrap' }, tabs, panel);
}

/* ===== SECTION 3: PRODUCT DETAIL · END ===== */

/* ===== SECTION 4: CART PAGE · START ===== */
async function initCart() {
  const host = document.getElementById('cart');
  async function draw() {
    const items = Cart.read();
    if (!items.length) {
      return host.replaceChildren(
        el('p', { class: 'notice' }, Z.MSG_EMPTY_CART),
        el('a', { class: 'btn', href: 'shop.html' }, 'Browse products'));
    }
    let products;
    try { products = await getProductsByIds(items.map(i => i.id)); }
    catch (e) { return showMessage(host, Z.MSG_LOAD_ERROR); }
    const map = new Map(products.map(p => [p.id, p]));
    // drop items that are no longer on sale
    const gone = items.filter(i => !map.has(i.id));
    if (gone.length) { gone.forEach(i => Cart.remove(i.id)); }
    const live = items.filter(i => map.has(i.id));
    if (!live.length) return draw();

    let total = 0;
    const lines = live.map(i => {
      const p = map.get(i.id);
      total += Number(p.price) * i.qty;
      return el('li', { class: 'line' },
        el('a', { href: 'product.html?id=' + encodeURIComponent(p.id), class: 'line-img' }, photo(p.image_url, p.name)),
        el('div', { class: 'line-main' },
          el('a', { href: 'product.html?id=' + encodeURIComponent(p.id), class: 'card-name' }, p.name),
          el('p', { class: 'price' }, money(p.price)),
          el('div', { class: 'qty small-qty', role: 'group', 'aria-label': 'Quantity for ' + p.name },
            el('button', { type: 'button', 'aria-label': 'Decrease quantity of ' + p.name, onclick: () => { Cart.setQty(p.id, i.qty - 1); draw(); } }, '−'),
            el('output', { class: 'qty-n' }, i.qty),
            el('button', { type: 'button', 'aria-label': 'Increase quantity of ' + p.name, onclick: () => { Cart.setQty(p.id, i.qty + 1); draw(); } }, '+')),
          el('button', { type: 'button', class: 'link-btn', onclick: () => { Cart.remove(p.id); draw(); } }, 'Remove')));
    });

    host.replaceChildren(
      gone.length ? el('p', { class: 'notice', role: 'status' }, 'Some items are no longer available and were removed.') : el('span'),
      el('ul', { class: 'lines' }, lines),
      el('div', { class: 'totals' },
        el('div', { class: 'tot-row' }, el('span', null, 'Subtotal'), el('span', null, money(total))),
        el('div', { class: 'tot-row' }, el('span', null, 'Delivery'), el('span', null, 'Confirmed when we contact you')),
        el('div', { class: 'tot-row grand' }, el('span', null, 'Total'), el('span', null, money(total))),
        el('p', { class: 'small' }, 'The final total is confirmed when your order is placed.')),
      el('a', { class: 'btn', href: 'checkout.html' }, 'Continue to checkout'),
      trustRow());
  }
  draw();
}

/* ===== SECTION 4: CART PAGE · END ===== */

/* ===== SECTION 5: START · START ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  const pages = { shop: initShop, product: initProduct, cart: initCart };
  const run = pages[document.body.dataset.page];
  if (run) run();
});

/* ===== SECTION 5: START · END ===== */
