# SOLT: demand-test storefront

A static site for a fictional electrolyte brand (SOLT). It uses the same page structure and selling approach as a modern Shopify supplement store. It's built to test **whether people would buy** before you make any product.

Visitors browse, pick a flavor, add to cart and hit **Checkout**. Checkout opens a "first batch isn't shipping yet" screen that collects their email. No payment is taken. Every step is tracked, so you can measure real purchase intent.

## Files
- `index.html`: home page. Hero slider, ticker, product carousel with quick view, "first cold brew electrolyte" banner, sea-salt blobs, 1000mg stat, neon-vs-salt drag slider, expert block, reviews, UGC strip.
- `product.html?id=yuzu|watermelon|coldbrew|night|endure`: product page. Draggable 3D pouch gallery, pack size, subscribe & save, comparison table, science section, FAQ, sticky add-to-cart bar.
- `assets/data.js`: **all products, prices, flavors and colors.** Edit this to change the offer.
- `config.js`: pixel IDs, webhook URL, free-shipping threshold, discount code.
- `assets/app.js`, `assets/styles.css`: the engine (no build step, no dependencies).

## Before you send traffic
1. **Replace the placeholders.** The reviews are tagged "sample review", and the expert block says `[EXPERT NAME]`. Swap in real reviews and a real expert who has agreed to be quoted, or delete those sections. Fake reviews or endorsements in ads break FTC rules.
2. **Fill in `config.js`**: `META_PIXEL_ID`, `GA4_ID`, `TIKTOK_PIXEL_ID`, `WEBHOOK_URL`.
3. Add a simple privacy policy, since you're collecting emails.

## Capture emails + events in Google Sheets (2 minutes)
1. Create a Google Sheet, then go to **Extensions → Apps Script** and paste in:
   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     const sh = SpreadsheetApp.getActive().getSheets()[0];
     if (sh.getLastRow() === 0) sh.appendRow(["ts","event","email","product","value","items","goal","source","utm_source","utm_campaign","utm_content","session","page"]);
     sh.appendRow([d.ts,d.event,d.email||"",d.product||"",d.value||"",d.items||"",d.goal||"",d.source||"",d.utm_source||"",d.utm_campaign||"",d.utm_content||"",d.session,d.page]);
     return ContentService.createTextOutput("ok");
   }
   ```
2. **Deploy → New deployment → Web app.** Set "Execute as" to *Me* and "Who has access" to *Anyone*. Copy the URL into `WEBHOOK_URL`.

## Events you'll see
| event | meaning | Meta event |
|---|---|---|
| `page_view`, `view_item` | visited site / product page | PageView / ViewContent |
| `quick_view`, `hero_cta`, `banner_cta` | engaged with a product | (none) |
| `add_to_cart` | added to cart (pack, subscribe, value) | AddToCart |
| `begin_checkout` | **clicked Checkout with $ value**: your main signal | InitiateCheckout |
| `generate_lead` | left an email (source: checkout / popup / footer) | Lead |
| `popup_goal` | picked a goal in the discount popup | (none) |
| `dead_click` | clicked something not built yet (search, account, socials) | (none) |

UTM tags (`?utm_source=meta&utm_campaign=...`) are saved on the first visit and attached to every event, so you can compare ad angles.

**Reading the results:** compare checkout rate (begin_checkout ÷ unique visitors) and emails left at checkout across ad sets. Also look at which flavor gets the most checkouts and whether people pick the 30-pack or subscribe.

## Run locally
```bash
python -m http.server 5180 --directory C:/Users/Shayan/solt-demand-test
```
Then open http://localhost:5180. Add `#debug` to the URL to log events in the console.

## Deploy (free)
Drag the folder into https://app.netlify.com/drop, or push it to GitHub and connect Vercel or Cloudflare Pages. Then point a domain at it.
