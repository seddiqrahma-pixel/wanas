# Wanas QA Report — reconciliation / responsive / console / assets / live parity
Date: 2026-09-17 · Tools: node+jsdom, openpyxl, curl, shasum (headless only)

## 1) Data reconciliation
Three data layers exist in index.html:
- `defaultData()` (factory fallback): **30 products** (p2–p33)
- `PRICING` table: **31 ids** (p29 orphan — no matching product in defaultData, harmless but stale)
- `PUBLISHED_DEFAULTS` (line 895; **runtime-effective** catalog): **3 products**

### PRODUCTS_PROPOSAL.md vs site
The proposal markdown lists **9 items** (ونس العنبر 180, وردة ونس 220, سحابة ونس 200, ونس عطور ٤ فتائل 320,
باقة الونس الوردية 280, صندوق الونس 450, وردة الصابون 160, عطر الونس 150, بخور الونس 130).
**None of the 9 appear in index.html** — no name matches (AR keyword search across all 30
factory products found zero hits). The proposal is an early market-study proposal, not the live
catalog; the site catalog was built from `sheet_data/wanas_calculator.xlsx` (“final 1125” tab).

### Sheet (calculator.xlsx) vs site — the actual authoritative pairing
Checked all 27 sheet rows with products (فواحة استيك → وردة مقفولة) against `PRICING`:
**0 mismatches** — every sheet “بيع” price (cost×2, data_only formulas verified) and “تشغيل” cost
matches PRICING market/cost exactly (incl. fractional 46.5/93, exceptions قطارة 30ml 120/90 and
فواحة عربية 195/128.5). AR names in `defaultData()` match sheet item names.

### Bugs found
- **Junk test product in the runtime catalog**: `xuup9a7e | ar:"asd" | en:"شسيب" | price:1000 | 1 base64 img`
  — present in BOTH local and live PUBLISHED_DEFAULTS; visible to buyers.
- **Live-only test category** `xelcr87n | "new sanf"/صنف جديد` in live PUBLISHED_DEFAULTS (not local).
- Stale proposal file vs site = full divergence (9/9 unmatched) — if the proposal is still meant
  to be truth, the whole catalog diverges; recommend deleting/superseding the proposal doc.
- Factory fallback doesn't match proposal either — no dropped rows within itself (30/30 intact,
  p1, p29, p32 numbering gaps only).

## 2) Responsive audit (text analysis)
Media queries (3): `@media (max-width:400px)` line 31, `@media (max-width:560px)` lines 32–38 and 134.
- **Small-mobile breakpoint exists** (400px — covers 320px devices): nav compacts (gap/padding,
  logo 36px, hides logo small, smaller buttons), plus a 560px tier bumping tap targets to 40–44px
  (cart buttons, lang, qty buttons, add-btn, close, image picker).
- Nav: responsive rules present (400px block).
- Product grid: `.grid` is `grid-template-columns:repeat(auto-fill,minmax(230px,1fr))` → fluid,
  natural 1-column under ~320px viewport.
- Cart drawer: `.drawer{width:380px;max-width:92vw;...}` → responsive (max-width caps it on
  small screens); `[dir=ltr]` variant included.
- Hero heading has its own 560px font-size rule (1.8rem).
No missing breakpoint concerns found besides arguably larger `minmax(230px,1fr)` on ultra-tall grids — fine.

## 3) Console audit (jsdom, https origin)
Load with `url: https://seddiqrahma-pixel.github.io/wanas/`, `runScripts:'dangerously'`;
captured `window.addEventListener('error')` + overridden `console.error`/`console.warn`,
with the `Not implemented: navigation` jsdom noise filtered. Interactions clicked in order
(stateful, single jsdom):
1. `#langBtn` (EN toggle) → html becomes `lang="en" dir="ltr"` ✔
2. first `.add-btn` add-to-cart → cart badge renders **1** ✔
3. `#adminBtn` → admin panel opens ✔

### Real site errors: **NONE** (0 window.onerror, 0 console.error, 0 console.warn)

## 4) Assets
All 24 referenced local asset paths exist on disk: logo.png, logo-icon.png, favicon.svg,
and 20 files under products/p_baladi_rose, p_classic_long_2, p_lantern, p_wardrobe_diffuser,
p_wave (**0 missing**).
Note: 10 `wnas_*` dirs (amber/artr/sandouq/sebach/ward…) exist on disk but none is referenced
by any site product — leftovers from the proposal-era catalog (plus _.DS_Store to clean).

## 5) Live parity
- Local index.html sha256: `3be74b67828d7dc9be84a1e81acd0c2b232addb3883d38dc341471503bd4d178` (293,103 B)
- Live index.html sha256: `d87911b4f357d80c30baa123865aaffc026d4eff8dd314715f593fcaa0a57d4b` (293,160 B)
- **MISMATCH → local is NOT identical to live** (AGENTS.md rule: never claim deploy fresh).
- Sole divergence: inside `PUBLISHED_DEFAULTS`, live has an extra category
  `{id:"xelcr87n", ar:"new sanf", en:"صنف جديد"}` (~57 bytes) that local lacks. Everything before
  and after that object is byte-identical; products content matches.

**Verdict:** code/assets/console are clean and sheet↔site pricing is exact, but (a) live has a
stray “new sanf” category, (b) both catalogs carry a junk “asd/شسيب 1000 جزئية” test product,
and (c) PRODUCTS_PROPOSAL.md is superseded/stale relative to the site.

Scripts written: qa/reconcile.js, qa/dump_products.js, qa/console_audit.js, qa/asset_check.py,
qa/sheet_pricing_check.txt, qa/live_index.html (fetched copy).
