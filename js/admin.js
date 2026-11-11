/* =====================================================
   ZINAN · OWNER DASHBOARD (admin.html)
   Login is real Supabase Auth. Only users listed in the
   `admins` table can read or change orders (enforced by
   the database, not by this page).
   ===================================================== */

/* ===== SECTION 1: SETTINGS · START ===== */
const ADMIN = {
  PAGE_SIZE: 200, // newest orders loaded at once
  STATUSES: [
    { key: 'all',       label: 'All' },
    { key: 'new',       label: 'New' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped',   label: 'Shipped' },
    { key: 'done',      label: 'Done' },
    { key: 'cancelled', label: 'Cancelled' }
  ],
  // which buttons each status shows: [label, next status]
  ACTIONS: {
    new:       [['Mark confirmed', 'confirmed'], ['Cancel order', 'cancelled']],
    confirmed: [['Mark shipped', 'shipped'],     ['Cancel order', 'cancelled']],
    shipped:   [['Mark done', 'done']],
    done:      [],
    cancelled: []
  },
  MSG_LOGIN_FAIL: 'Email or password is incorrect.',
  MSG_NOT_OWNER: 'This account does not have owner access.',
  MSG_LOAD_FAIL: 'Could not load orders. Check your connection and refresh.'
};
/* ===== SECTION 1: SETTINGS · END ===== */

/* ===== SECTION 2: STATE · START ===== */
const app = document.getElementById('admin-app');
let allOrders = [];
let activeStatus = 'all';
let searchText = '';
/* ===== SECTION 2: STATE · END ===== */

/* ===== SECTION 3: LOGIN + SESSION · START ===== */
function loginField(id, label, type, autocomplete) {
  return el('div', { class: 'field' },
    el('label', { for: id }, label),
    el('input', { id, name: id, type, class: 'input', autocomplete, required: true, maxlength: 200 }));
}

function showLogin(message) {
  const status = el('p', { class: 'form-status', role: 'alert' }, message || '');
  const btn = el('button', { class: 'btn', type: 'submit' }, 'Sign in');
  const form = el('form', { class: 'login', novalidate: true },
    el('h1', null, 'Owner login'),
    loginField('email', 'Email', 'email', 'username'),
    loginField('password', 'Password', 'password', 'current-password'),
    status, btn);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = '';
    btn.disabled = true; btn.textContent = 'Signing in\u2026';
    const { error } = await sb.auth.signInWithPassword({
      email: form.elements.email.value.trim(),
      password: form.elements.password.value
    });
    btn.disabled = false; btn.textContent = 'Sign in';
    if (error) { status.textContent = ADMIN.MSG_LOGIN_FAIL; return; }
    startAdmin();
  });
  app.replaceChildren(form);
}

async function isOwner() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null; // not signed in
  const { data, error } = await sb.from('admins').select('user_id')
    .eq('user_id', session.user.id).maybeSingle();
  return !error && !!data;
}

async function signOut() {
  await sb.auth.signOut();
  allOrders = [];
  showLogin('');
}
/* ===== SECTION 3: LOGIN + SESSION · END ===== */

/* ===== SECTION 4: ORDER DATA · START ===== */
async function loadOrders() {
  const { data, error } = await sb.from('orders')
    .select('id,order_number,customer_name,contact,address,notes,status,total,created_at,order_items(name_snapshot,unit_price_snapshot,quantity)')
    .order('created_at', { ascending: false })
    .limit(ADMIN.PAGE_SIZE);
  if (error) throw error;
  allOrders = data || [];
}

async function setStatus(order, next) {
  const { error } = await sb.from('orders').update({ status: next }).eq('id', order.id);
  if (error) throw error;
  order.status = next;
}
/* ===== SECTION 4: ORDER DATA · END ===== */

/* ===== SECTION 5: ORDER CARD · START ===== */
function statusLabel(key) {
  const s = ADMIN.STATUSES.find(x => x.key === key);
  return s ? s.label : key;
}

function orderCard(o) {
  const msg = el('p', { class: 'form-status', role: 'alert' });
  const items = (o.order_items || []).map(i =>
    el('li', null, i.name_snapshot + ' \u00d7 ' + i.quantity + ' \u00b7 ' + money(Number(i.unit_price_snapshot) * i.quantity)));

  const buttons = (ADMIN.ACTIONS[o.status] || []).map(([label, next]) => {
    const b = el('button', { type: 'button', class: next === 'cancelled' ? 'btn btn-ghost' : 'btn' }, label);
    b.addEventListener('click', async () => {
      if (next === 'cancelled' && !confirm('Cancel order ' + o.order_number + '?')) return;
      b.disabled = true; msg.textContent = '';
      try { await setStatus(o, next); renderList(); }
      catch (e) { msg.textContent = 'Could not update. Please try again.'; b.disabled = false; }
    });
    return b;
  });

  return el('article', { class: 'order-card' },
    el('div', { class: 'order-head' },
      el('strong', { class: 'order-num' }, o.order_number),
      el('span', { class: 'pill st-' + o.status }, statusLabel(o.status))),
    el('p', { class: 'small' }, new Date(o.created_at).toLocaleString('en-GB')),
    el('p', { class: 'order-name' }, o.customer_name),
    el('p', null, o.contact),
    el('p', { class: 'pre' }, o.address),
    o.notes ? el('p', { class: 'pre small' }, 'Notes: ' + o.notes) : null,
    el('ul', { class: 'order-items' }, items),
    el('p', { class: 'order-total' }, 'Total ' + money(o.total)),
    msg,
    buttons.length ? el('div', { class: 'order-actions' }, buttons) : null);
}
/* ===== SECTION 5: ORDER CARD · END ===== */

/* ===== SECTION 6: DASHBOARD + FILTERS · START ===== */
function visibleOrders() {
  const q = searchText.trim().toLowerCase();
  return allOrders.filter(o =>
    (activeStatus === 'all' || o.status === activeStatus) &&
    (!q || [o.order_number, o.customer_name, o.contact].some(v => String(v).toLowerCase().includes(q))));
}

function renderChips() {
  const host = document.getElementById('chips');
  host.replaceChildren(...ADMIN.STATUSES.map(s => {
    const n = s.key === 'all' ? allOrders.length : allOrders.filter(o => o.status === s.key).length;
    const b = el('button', { type: 'button', class: 'chip', 'aria-pressed': s.key === activeStatus }, s.label + ' (' + n + ')');
    b.addEventListener('click', () => { activeStatus = s.key; renderList(); });
    return b;
  }));
}

function renderList() {
  renderChips();
  const host = document.getElementById('order-list');
  const list = visibleOrders();
  host.replaceChildren(...(list.length
    ? list.map(orderCard)
    : [el('p', { class: 'notice' }, allOrders.length ? 'No orders match.' : 'No orders yet.')]));
}

async function refresh() {
  try { await loadOrders(); renderList(); }
  catch (e) { document.getElementById('order-list').replaceChildren(el('p', { class: 'notice' }, ADMIN.MSG_LOAD_FAIL)); }
}

function showDashboard() {
  const search = el('input', { id: 'search', type: 'search', class: 'input', maxlength: 80, placeholder: 'Order number, name or contact' });
  search.addEventListener('input', () => { searchText = search.value; renderList(); });
  const out = el('button', { type: 'button', class: 'btn btn-ghost', onclick: signOut }, 'Sign out');
  const reload = el('button', { type: 'button', class: 'btn btn-ghost', onclick: refresh }, 'Refresh');
  app.replaceChildren(
    el('div', { class: 'admin-top' }, el('h1', null, 'Orders'), el('div', { class: 'admin-top-btns' }, reload, out)),
    el('div', { class: 'field' }, el('label', { for: 'search' }, 'Search'), search),
    el('div', { id: 'chips', class: 'chips', role: 'group', 'aria-label': 'Filter by status' }),
    el('div', { id: 'order-list' }, el('p', { class: 'notice' }, 'Loading\u2026')));
  refresh();
}
/* ===== SECTION 6: DASHBOARD + FILTERS · END ===== */

/* ===== SECTION 7: START · START ===== */
async function startAdmin() {
  const owner = await isOwner();
  if (owner === null) return showLogin('');
  if (!owner) { await sb.auth.signOut(); return showLogin(ADMIN.MSG_NOT_OWNER); }
  showDashboard();
}
document.addEventListener('DOMContentLoaded', startAdmin);
/* ===== SECTION 7: START · END ===== */
