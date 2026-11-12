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
  BUSINESS_NAME: 'Zinan',
  LOGO_URL: 'img/logo-black.svg', // later: put your logo file path here, e.g. 'img/logo.svg'

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

/* ===== SECTION 9: CATEGORIES · START =====
   key must match the category saved in the database */
window.ZINAN.CATEGORIES = [
  { key: 'handbags', label: 'Handbags', img: 'img/handbag.webp' },
  { key: 'gadgets',  label: 'Gadgets',  img: 'img/fan.webp' },
  { key: 'home',     label: 'Home',     img: 'img/nightlight.webp' }
];
/* ===== SECTION 9: CATEGORIES · END ===== */

/* ===== SECTION 10: OFFER BANNER · START =====
   Set ENABLED to true and fill in a REAL offer to show the banner on the home page. */
window.ZINAN.OFFER = {
  ENABLED: false,
  EYEBROW: 'Offer',
  TITLE: '[OFFER TITLE]',
  TEXT: '[OFFER DETAILS]',
  CTA: 'Shop now',
  LINK: 'shop.html'
};
/* ===== SECTION 10: OFFER BANNER · END ===== */

/* ===== SECTION 11: TRUST CARD + SPOTLIGHT · START ===== */
window.ZINAN.TRUST_CARD = [
  { icon: '\u2713', title: 'Confirmed personally', text: 'We contact you to confirm every order.' },
  { icon: '\u09F3', title: 'Pay your way',         text: 'Cash on delivery, bKash or Nagad.' },
  { icon: '\u2709\uFE0E', title: 'Open 24/7',      text: 'Reach us anytime by email.' }
];
window.ZINAN.SPOTLIGHT = {
  ENABLED: true,
  PRODUCT_NAME: 'Mini Portable Rechargeable Fan', // must match a product name exactly
  EYEBROW: 'Spotlight',
  CTA: 'View product'
};
/* ===== SECTION 11: TRUST CARD + SPOTLIGHT · END ===== */

/* ===== SECTION 12: SOCIAL LINKS · START =====
   Paste at the very bottom of js/config.js (after Section 11).
   Add or remove lines to change the buttons on the site. */
window.ZINAN.SOCIALS = [
  { name: 'Instagram', url: 'https://instagram.com/zinan.bd' },
  { name: 'Facebook',  url: 'https://www.facebook.com/share/19TRYBdney/' },
  { name: 'TikTok',    url: 'https://www.tiktok.com/@zinan.bd' }
];
/* ===== SECTION 12: SOCIAL LINKS · END ===== */

/* ===== SECTION 13: THE ZINAN EXPERIENCE (replaces "Why Zinan") · START =====
   Paste at the very bottom of js/config.js (after Section 12). */
window.ZINAN.EXPERIENCE = {
  EYEBROW: 'The Zinan experience',
  TITLE: 'More than just a purchase.',
  INTRO: 'We believe good shopping is about finding the right things, knowing what to expect, and feeling good about every order.',
  ITEMS: [
    { title: 'Thoughtfully Selected', text: 'Every product is selected with an eye for style, usefulness and everyday value.' },
    { title: 'Clear & Honest',        text: 'Prices are shown openly. No unnecessary surprises.' },
    { title: 'A Personal Touch',      text: 'Every order is personally confirmed. We\u2019re here to help make your shopping easier.' }
  ]
};
/* ===== SECTION 13: THE ZINAN EXPERIENCE · END ===== */
