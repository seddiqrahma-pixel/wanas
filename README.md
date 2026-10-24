# وَنَس (Wanas) — Candle Storefront

> **بilingual static storefront** (AR/EN, RTL/LTR) for handmade candles & home fragrances from Sohag, Egypt.

**Live:** https://seddiqrahma-pixel.github.io/wanas/
**Repo:** https://github.com/seddiqrahma-pixel/wanas

---

## 🚀 Quick Start

```bash
# Install dependencies
npm ci

# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Project Structure

```
wanas/
├── .github/workflows/deploy.yml   # CI/CD: lint → test → build → deploy to Pages
├── public/                        # Static assets served as-is
│   ├── favicon.svg
│   ├── logo.png
│   ├── logo-icon.png
│   └── manifest.json
├── src/
│   ├── assets/products/           # Source images (optimized at build)
│   ├── data/
│   │   └── products.json          # SINGLE SOURCE OF TRUTH (synced from sheet)
│   ├── scripts/
│   │   ├── main.ts                # Buyer app entry
│   │   ├── admin.ts               # Admin panel entry (separate bundle)
│   │   ├── i18n.ts                # AR/EN + RTL/LTR
│   │   ├── cart.ts                # Cart (IndexedDB)
│   │   ├── data.ts                # Data loader
│   │   └── types.ts               # TypeScript interfaces
│   ├── components/
│   │   ├── ProductCard.ts         # Product display
│   │   ├── CartDrawer.ts          # Slide-out cart
│   │   └── LanguageSwitcher.ts    # Lang toggle
│   ├── styles/main.css            # Design tokens + components
│   ├── index.html                 # Buyer shell
│   └── admin.html                 # Admin shell
├── tools/                         # Build-time scripts (not shipped)
│   ├── sync-products.ts           # Sheet → products.json
│   ├── optimize-images.ts         # Sharp: WebP/AVIF/responsive
│   └── validate-data.ts           # Schema validation
├── tests/
│   ├── unit/                      # Vitest
│   └── e2e/                       # Playwright
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

## 🛠 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:3000` |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview `dist/` locally |
| `npm run lint` | ESLint (strict) |
| `npm run format` | Prettier format |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright e2e tests |
| `npm run sync:products` | Sync `sheet_data/` → `src/data/products.json` |
| `npm run optimize:images` | Optimize `src/assets/products/` → `public/products/` |
| `npm run validate:data` | Validate `products.json` schema |

---

## 🔄 Data Pipeline

**Source of truth:** Spreadsheet in `sheet_data/wanas_calculator.xlsx` (or JSON/CSV)

```
sheet_data/*.xlsx|.json|.csv
    │
    ▼ npm run sync:products
src/data/products.json  (validated, typed)
    │
    ▼ npm run build
dist/data/products.json (embedded in build)
```

**To update products:**
1. Edit the spreadsheet in `sheet_data/`
2. Run `npm run sync:products`
3. Review changes in `src/data/products.json`
4. Commit & push → CI builds & deploys

---

## 🖼 Image Pipeline

```
src/assets/products/wnas_amber/main.jpg
    │
    ▼ npm run optimize:images
public/products/wnas_amber/
  ├── main-400w.webp
  ├── main-400w.avif
  ├── main-800w.webp
  ├── main-800w.avif
  ├── main-1200w.webp
  ├── main-1200w.avif
  ├── main.jpeg (fallback)
  └── main-thumb.webp
```

Images are auto-optimized at build via `vite-plugin-image-optimizer` (Sharp).

---

## 🌐 Internationalization

- **Locales:** `ar` (RTL), `en` (LTR)
- **Switcher:** Top-right button, persists in `localStorage`
- **Translations:** Defined in `src/scripts/i18n.ts` (nested objects, flattened at runtime)
- **Usage:** `<span data-i18n="hero.title"></span>` or `t('hero.title')` in JS

---

## 🛒 Cart & Checkout

- **Storage:** IndexedDB (`idb` library) — persists across sessions
- **Checkout:** Generates WhatsApp deep link with full order details
- **Payment methods:** Vodafone Cash, InstaPay, Bank Transfer (NBE), WhatsApp COD
- **No online cards** — per business requirement

---

## 🔐 Admin Panel

**Access:** `Ctrl+Shift+A` or triple-click logo (on live site)

Features:
- Product CRUD (inline modal)
- Sync from spreadsheet
- Export JSON
- Settings (brand, tagline, WhatsApp number)
- Order viewing (from LocalStorage)

---

## 🧪 Testing

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run test:e2e
```

**Test strategy:**
- **Unit:** Pure functions (cart math, i18n, formatters)
- **E2E:** Critical flows (add to cart → checkout → WhatsApp link)

---

## 🚀 Deployment

**Automatic:** Push to `main` → GitHub Actions → GitHub Pages

**Workflow:** `.github/workflows/deploy.yml`
1. Lint + TypeScript check
2. Unit tests + data validation
3. Sync products (if sheet_data changed)
4. Optimize images
5. Build with Vite
6. Deploy to `gh-pages` branch

**Manual deploy:** Trigger workflow_dispatch in Actions tab.

---

## 📋 Git Rules

- **Main branch only** — short-lived feature branches, delete after merge
- **Conventional commits:** `feat:`, `fix:`, `docs:`, `chore:`
- **Never force-push** — run `git fetch && git log --oneline main..origin/main` first
- **Deploy only on explicit command** (or push to main)

---

## 🎨 Design Tokens (CSS Variables)

```css
:root {
  --color-primary: #D4A574;      /* Brand gold */
  --color-primary-dark: #C49564;
  --color-secondary: #2D2D2D;    /* Dark text */
  --color-background: #FAF8F5;   /* Warm off-white */
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #6B6B6B;
  --color-border: #E8E0D8;

  --font-arabic: 'Cairo', 'Noto Sans Arabic', system-ui, sans-serif;
  --font-arabic-heading: 'Amiri', 'Cairo', serif;
  --font-latin: 'Cairo', system-ui, sans-serif;

  --space-1: 0.25rem;  --space-4: 1rem;  --space-8: 2rem;
  --radius-md: 8px;    --radius-lg: 12px;
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
}
```

---

## ♿ Accessibility

- Semantic HTML5 (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`)
- ARIA labels on all interactive elements
- Focus-visible outlines
- Skip link
- RTL/LTR aware
- Color contrast ≥ 4.5:1
- Lazy-loaded images with `loading="lazy"`

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| `npm run dev` fails | `rm -rf node_modules package-lock.json && npm ci` |
| Types out of sync | `npx tsc --noEmit` |
| Images not optimizing | Check `src/assets/products/` exists |
| Products not showing | Run `npm run sync:products` then `npm run dev` |
| Admin panel not opening | Clear localStorage, try `Ctrl+Shift+A` |

---

## 📚 References

- [Vite Static Deploy](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages with Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Sharp Image Optimization](https://sharp.pixelplumbing.com/)
- [idb (IndexedDB wrapper)](https://github.com/jakearchibald/idb)