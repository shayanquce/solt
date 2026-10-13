// SOLT demand-test configuration.
// Fill these in before you send traffic. Everything works with them blank (events are just logged locally).
window.SOLT_CONFIG = {
  // Meta (Facebook/Instagram) Pixel ID, e.g. "1234567890". Fires PageView, ViewContent, AddToCart, InitiateCheckout, Lead.
  META_PIXEL_ID: "",
  // Google Analytics 4 measurement ID, e.g. "G-XXXXXXX".
  GA4_ID: "",
  // TikTok Pixel ID (optional).
  TIKTOK_PIXEL_ID: "",
  // Where every event + email is POSTed as JSON (Google Apps Script web app, Zapier/Make webhook, Formspree, etc.).
  // See README.md for a 2-minute Google Sheets setup.
  WEBHOOK_URL: "",

  FREE_SHIPPING_THRESHOLD: 60,
  SUBSCRIBE_DISCOUNT: 0.15,
  POPUP_DISCOUNT_CODE: "SOLT30",
  POPUP_DELAY_MS: 6000,
  CURRENCY: "USD",
};
