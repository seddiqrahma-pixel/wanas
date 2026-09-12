# Wanas — Project Instructions

Brand: **وَنَس** (Arabic) / **Wanas** (English). Single-file HTML candle
storefront (AR/EN, RTL when Arabic, LTR when English). Repo:
`github.com/seddiqrahma-pixel/wanas`. Live site:
`https://seddiqrahma-pixel.github.io/wanas/`.

These rules were distilled from past Wanas sessions. Follow them automatically.

## Language & branding
- The brand word follows the site language: **وَنَس** when the site is Arabic,
  **Wanas** when English. Never hardcode one form across both.
- Product names and copy are bilingual. Prices are in **EGP**.
- Payment methods (no online card processor): Vodafone Cash, InstaPay, bank
  transfer, and WhatsApp order (no online payment).

## Data truth (sources of truth)
- The product spreadsheet (`PRODUCTS_PROPOSAL.md` / the Google/Excel sheet) is the
  authoritative source for product names, prices, and descriptions.
- The website's product data (in JS / `index.html`) must match the sheet. Treat
  any mismatch as a bug.
- When checking sheets, examine **formulas** too, not just displayed values, for
  deeper understanding (e.g. cost/weight logic).

## Verification discipline (critical)
- **Verify, don't assert.** Before reporting that website products match the
  sheet, Facebook images match their descriptions, or a fix is live, actually
  check the real files / live page / DOM. Count explicit vs implicit confirmations.
- Local must be byte-identical to live before claiming a deploy succeeded.
- Test the full buyer flow (cart, badge, localStorage, WhatsApp link, price
  tampering into merchant order) and admin panel with evidence (DOM values,
  console errors, URLs). Clean test state afterward.

## Git & deployment
- **Never merge, push, or deploy unless explicitly told.** Your standing rule:
  deploy only on explicit command.
- Use conventional commits (e.g. `docs:`, `fix:`).
- Delete feature branches after they are merged (use `git branch --merged` /
  GitHub auto-delete). Don't leave stale branches like `feat/admin-multi-image`.
- When showing changes, give the commit diff URL and a per-change "how to find
  it" map. Clear old cached builds so the review link shows the new version.

## Files & assets
- Product images live in `products/` subfolders (e.g. `wnas_amber_*`,
  `p_*` per product). Watch for macOS resource-fork folders and orphan `p_*`
  leftovers; clean them.
- Keep the inventory/spreadsheet intact — do not delete rows.
- Project working files (reports, scan scripts, security JSON) live in this
  Wanas folder.

## Communication
- Ahmed speaks Arabic and English; reply in the language he uses.
- Keep product copy warm and simple.
