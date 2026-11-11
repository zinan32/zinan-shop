/* =====================================================
   ZINAN · CHECKOUT + CONFIRMATION
   Orders are saved only through the place_order()
   database function. It looks up prices itself, so
   nothing sent from the browser can change the total.
   ===================================================== */

/* ---------- SECTION 1: CHECKOUT SETTINGS (edit text here) ---------- */
const CHECKOUT = {
  NO_PAYMENT_NOTE: 'No payment is taken now. We\u2019ll contact you to confirm your order.',
  PRIVACY_NOTE: 'We use your details only to confirm and deliver your order.',
  BUTTON: 'Place order',
  ERR_GENERIC: 'We could not place your order. Please check your details and try again.',
  ERR_RATE: 'Too many orders from this connection. Please try again later.',
  LIMITS: { name: [2, 80], contact: [5, 120], address: [5, 300], notes: [0, 500] }
};

/* ---------- SECTION 2: VALIDATION ---------- */
function validateOrder(v) {
  const L = CHECKOUT.LIMITS, errs = {};
  const inRange = (s, [min, max]) => s.length >= min && s.length <= max;
  if (!inRange(v.name, L.name)) errs.name = 'Enter your full name (2 to 80 characters).';
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.contact);
  const isPhone = /^\+?[0-9\s-]{10,15}$/.test(v.contact);
  if (!(isEmail || isPhone) || !inRange(v.contact, L.contact)) errs.contact = 'Enter a valid phone number or email.';
  if (!inRange(v.address, L.address)) errs.address = 'Enter your full delivery address (5 to 300 characters).';
  if (!inRange(v.notes, L.notes)) errs.notes = 'Notes can be up to 500 characters.';
  return errs;
}

/* ---------- SECTION 3: CHECKOUT PAGE ---------- */
function field(id, label, tag, attrs) {
  const input = el(tag, Object.assign({ id, name: id, class: 'input' }, attrs));
  return el('div', { class: 'field' },
    el('label', { for: id }, label),
    input,
    el('p', { class: 'field-err', id: id + '-err', role: 'alert' }));
}

async function initCheckout() {
  const host = document.getElementById('checkout');
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
  const live = items.filter(i => map.has(i.id));
  if (live.length !== items.length) { items.filter(i => !map.has(i.id)).forEach(i => Cart.remove(i.id)); }
  if (!live.length) return initCheckout();

  let total = 0;
  const summary = live.map(i => {
    const p = map.get(i.id); total += Number(p.price) * i.qty;
    return el('li', { class: 'tot-row' }, el('span', null, p.name + ' \u00d7 ' + i.qty), el('span', null, money(Number(p.price) * i.qty)));
  });

  const L = CHECKOUT.LIMITS;
  const status = el('p', { class: 'form-status', role: 'alert' });
  const submit = el('button', { class: 'btn', type: 'submit' }, CHECKOUT.BUTTON);

  const form = el('form', { novalidate: true, autocomplete: 'on' },
    field('name', 'Full name', 'input', { type: 'text', maxlength: L.name[1], autocomplete: 'name', required: true }),
    field('contact', 'Phone or email', 'input', { type: 'text', inputmode: 'text', maxlength: L.contact[1], autocomplete: 'tel', required: true }),
    field('address', 'Delivery address', 'textarea', { rows: 3, maxlength: L.address[1], autocomplete: 'street-address', required: true }),
    field('notes', 'Notes (optional)', 'textarea', { rows: 2, maxlength: L.notes[1] }),
    // honeypot: real people never see or fill this. Bots do.
    el('div', { class: 'hp', 'aria-hidden': 'true' },
      el('label', { for: 'website' }, 'Leave this field empty'),
      el('input', { id: 'website', name: 'website', type: 'text', tabindex: '-1', autocomplete: 'off' })),
    el('p', { class: 'note-box' }, CHECKOUT.NO_PAYMENT_NOTE),
    status,
    submit,
    el('p', { class: 'small' }, CHECKOUT.PRIVACY_NOTE),
    trustRow());

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = '';
    const v = {
      name: form.elements.name.value.trim(), contact: form.elements.contact.value.trim(),
      address: form.elements.address.value.trim(), notes: form.elements.notes.value.trim()
    };
    const errs = validateOrder(v);
    ['name', 'contact', 'address', 'notes'].forEach(k => {
      document.getElementById(k + '-err').textContent = errs[k] || '';
      form.elements[k].setAttribute('aria-invalid', errs[k] ? 'true' : 'false');
    });
    if (Object.keys(errs).length) { form.elements[Object.keys(errs)[0]].focus(); return; }

    submit.disabled = true; submit.textContent = 'Placing order\u2026';
    try {
      const { data, error } = await sb.rpc('place_order', {
        p_name: v.name, p_contact: v.contact, p_address: v.address,
        p_notes: v.notes || null,
        p_items: Cart.read().map(i => ({ product_id: i.id, quantity: i.qty })),
        p_honeypot: form.elements.website.value
      });
      if (error) throw error;
      Cart.clear();
      location.href = 'order.html?n=' + encodeURIComponent(data);
    } catch (err) {
      status.textContent = /too many orders/i.test(err && err.message) ? CHECKOUT.ERR_RATE : CHECKOUT.ERR_GENERIC;
      submit.disabled = false; submit.textContent = CHECKOUT.BUTTON;
    }
  });

  host.replaceChildren(
    el('div', { class: 'checkout-grid' },
      el('div', null, el('h2', null, 'Delivery details'), form),
      el('aside', { class: 'totals' },
        el('h2', null, 'Your order'),
        el('ul', { class: 'lines' }, summary),
        el('div', { class: 'tot-row grand' }, el('span', null, 'Total'), el('span', null, money(total))),
        el('p', { class: 'small' }, 'The final total is confirmed when your order is placed.'),
        el('a', { href: 'cart.html', class: 'link-btn' }, 'Edit cart'))));
}

/* ---------- SECTION 4: CONFIRMATION PAGE ---------- */
function initConfirmation() {
  const host = document.getElementById('confirmation');
  const n = new URLSearchParams(location.search).get('n') || '';
  if (!/^ZN-\d{3,8}$/.test(n)) {
    return host.replaceChildren(
      el('p', { class: 'notice' }, 'We could not find an order number.'),
      el('a', { class: 'btn', href: 'shop.html' }, 'Back to shop'));
  }
  host.replaceChildren(
    el('h1', null, 'Thank you. Your order is placed.'),
    el('p', { class: 'eyebrow' }, 'Order number'),
    el('p', { class: 'order-no' }, n),
    el('p', null, 'We\u2019ll contact you to confirm your order. No payment has been taken.'),
    el('p', { class: 'small' }, 'Please keep this order number. Questions? Email ' + Z.EMAIL + '.'),
    el('a', { class: 'btn', href: 'shop.html' }, 'Continue shopping'));
}

/* ---------- SECTION 5: START ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'checkout') initCheckout();
  if (page === 'confirmation') initConfirmation();
});
