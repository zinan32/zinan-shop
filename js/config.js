/* =====================================================
   ZINAN · CONFIG & EDITABLE TEXT
   Only PUBLIC values live here. Never paste a secret or
   service_role key in this file.
   ===================================================== */

/* ---------- SECTION 1: SUPABASE (public values) ---------- */
window.ZINAN = {
  SUPABASE_URL: 'https://rcvsnkyphcddcydgklur.supabase.co',
  SUPABASE_KEY: 'sb_publishable_4o3cMyTKSmuMoXfuIGEuUw_aAQd-k0M',

  /* ---------- SECTION 2: BRAND ---------- */
  BRAND: 'ZINAN',
  TAGLINE: 'Quality You Can Trust',
  EMAIL: 'contactatzinan@gmail.com',
  INSTAGRAM: 'zinan.bd',
  PHONE: '[PHONE / WHATSAPP]',
  BUSINESS_NAME: '[BUSINESS NAME]',
  LOGO_URL: '', // later: put your logo file path here, e.g. 'img/logo.svg'

  /* ---------- SECTION 3: MONEY ---------- */
  CURRENCY: '৳',
  PRICE_PLACEHOLDER: '[PRICE]',

  /* ---------- SECTION 4: ANNOUNCEMENT BAR ---------- */
  ANNOUNCEMENT: 'Cash on delivery, bKash and Nagad accepted',

  /* ---------- SECTION 5: HOME TEXT ---------- */
  HERO_EYEBROW: 'Handbags · Gadgets · Home',
  HERO_TITLE: 'Quality you can trust.',
  HERO_SUB: 'Carefully sourced handbags, gadgets and home essentials.',
  HERO_CTA: 'Shop the collection',
  HERO_PHOTO_NOTE: '[HERO PHOTO]',

  WHY_TITLE: 'Why Zinan',
  WHY_INTRO: 'Online shops can be trustworthy. We are here to prove it.',
  WHY_VALUES: [
    { title: 'Trust',        text: 'You get the quality you paid for.' },
    { title: 'Quality',      text: 'Every product is chosen with care.' },
    { title: 'Good gesture', text: 'We confirm every order personally.' }
  ],

  REVIEWS_TITLE: 'Community reviews',
  REVIEWS_NOTE: '[REAL CUSTOMER REVIEWS WILL APPEAR HERE]',

  TAGUS_TITLE: 'Tag us @zinan.bd',
  TAGUS_NOTE: '[CUSTOMER PHOTO]',

  FOLLOW_TITLE: 'Follow along',
  FOLLOW_TEXT: 'New arrivals and updates on Instagram.',

  /* ---------- SECTION 6: TRUST ROW (shown near buy buttons) ---------- */
  TRUST: [
    'We confirm every order by email or phone',
    'Pay by cash on delivery, bKash or Nagad',
    '[DELIVERY AND RETURNS POLICY]'
  ],

  /* ---------- SECTION 7: PRODUCT TABS ---------- */
  TABS: {
    'Details':     null, // null = uses the product description
    'Materials':   '[MATERIALS]',
    'Size & Fit':  '[SIZE & FIT]',
    'Shipping':    '[SHIPPING INFO]'
  },

  /* ---------- SECTION 8: MESSAGES ---------- */
  MSG_EMPTY_SHOP: 'Our products are being added. Please check back soon.',
  MSG_LOAD_ERROR: 'Could not load products. Please refresh the page.',
  MSG_EMPTY_CART: 'Your cart is empty.',
  MSG_NOT_FOUND: 'We could not find that product.'
};
