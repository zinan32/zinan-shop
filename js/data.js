/* =====================================================
   ZINAN · DATA (Supabase reads) + CART (localStorage)
   ===================================================== */

/* ---------- SECTION 1: SUPABASE CLIENT ---------- */
const Z = window.ZINAN;
const sb = window.supabase.createClient(Z.SUPABASE_URL, Z.SUPABASE_KEY);

/* ---------- SECTION 2: PRODUCT QUERIES ---------- */
const PRODUCT_COLS = 'id,name,description,price,image_url,category';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getProducts() {
  const { data, error } = await sb.from('products').select(PRODUCT_COLS)
    .eq('active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function getProduct(id) {
  if (!UUID_RE.test(id)) return null;
  const { data, error } = await sb.from('products').select(PRODUCT_COLS)
    .eq('id', id).eq('active', true).maybeSingle();
  if (error) throw error;
  return data;
}

async function getProductsByIds(ids) {
  if (!ids.length) return [];
  const { data, error } = await sb.from('products').select(PRODUCT_COLS)
    .in('id', ids).eq('active', true);
  if (error) throw error;
  return data || [];
}

/* ---------- SECTION 3: CART (stores only id + quantity) ----------
   Names and prices are always re-read from the database, and the
   server recalculates the total again when the order is placed. */
const CART_KEY = 'zinan_cart_v1';
const MAX_QTY = 20;

const Cart = {
  read() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      return raw.filter(i => i && UUID_RE.test(i.id) &&
        Number.isInteger(i.qty) && i.qty >= 1 && i.qty <= MAX_QTY);
    } catch (e) { return []; }
  },
  write(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
    document.dispatchEvent(new CustomEvent('cart:changed'));
  },
  add(id, qty = 1) {
    const items = this.read();
    const found = items.find(i => i.id === id);
    if (found) found.qty = Math.min(MAX_QTY, found.qty + qty);
    else items.push({ id, qty: Math.min(MAX_QTY, qty) });
    this.write(items);
  },
  setQty(id, qty) {
    const items = this.read();
    const found = items.find(i => i.id === id);
    if (!found) return;
    if (qty < 1) return this.remove(id);
    found.qty = Math.min(MAX_QTY, qty);
    this.write(items);
  },
  remove(id) { this.write(this.read().filter(i => i.id !== id)); },
  clear() { this.write([]); },
  count() { return this.read().reduce((n, i) => n + i.qty, 0); }
};
