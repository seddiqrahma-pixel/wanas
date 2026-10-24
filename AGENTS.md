# Wanas — Project Instructions

Brand: **وَنَس** (Arabic) / **Wanas** (English). Modern Vite + TypeScript static storefront (AR/EN, RTL/LTR).
Repo: `github.com/seddiqrahma-pixel/wanas`. Live: `https://seddiqrahma-pixel.github.io/wanas/`.

---

## 🏗 Architecture Overview

```
src/
├── scripts/main.ts          # Buyer app entry
├── scripts/admin.ts         # Admin panel entry (separate bundle)
├── scripts/i18n.ts          # AR/EN + RTL/LTR
├── scripts/cart.ts          # Cart (IndexedDB via idb)
├── scripts/data.ts          # Data loader (products.json)
├── components/              # Reusable UI components
├── styles/main.css          # Design tokens + components
├── data/products.json       # SINGLE SOURCE OF TRUTH
├── index.html               # Buyer shell
└── admin.html               # Admin shell
tools/                       # Build-time scripts (not shipped)
tests/                       # Vitest + Playwright
```

---

## 📋 Language & Branding

- Brand word follows site language: **وَنَس** (AR), **Wanas** (EN) — never hardcode one form.
- Product names & copy are bilingual. Prices in **EGP**.
- Payments: Vodafone Cash, InstaPay, Bank Transfer (NBE), WhatsApp COD — **no online cards**.

---

## 🎯 Data Truth (Sources of Truth)

| Layer | File | Purpose |
|-------|------|---------|
| **Source** | `sheet_data/wanas_calculator.xlsx` (or JSON/CSV) | Authoritative pricing, names, descriptions |
| **Sync** | `npm run sync:products` | Reads sheet → writes `src/data/products.json` |
| **Runtime** | `src/data/products.json` | Single source for buyer + admin apps |
| **Build** | Embedded in `dist/` | Served to users |

**Rule:** Any mismatch between sheet, JSON, and live site = **bug**. Verify with evidence.

---

## ✅ Verification Discipline

- **Verify, don't assert.** Check real files, live DOM, console before reporting success.
- Local build must be byte-identical to live before claiming deploy succeeded.
- Test full buyer flow: add to cart → badge → localStorage → WhatsApp link → price tampering check.
- Test admin panel: CRUD, sync, export, settings.

---

## 🔀 Git & Deployment

- **Never merge, push, or deploy unless explicitly told.** Deploy only on explicit command.
- **Before any push:** `git fetch && git log --oneline main..origin.main`. If output exists, someone else published — pull/reset onto origin, reapply local changes. **Force push forbidden without approval.**
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`.
- Delete feature branches after merge (`git branch --merged` / GitHub auto-delete).
- Show commit diff URL + per-change "how to find it" map when reporting changes.

---

## 🗂 Files & Assets

- Source images: `src/assets/products/<product-id>/main.jpg` (optimized at build → `public/products/`)
- Legacy raw images in `products/` — keep for reference, don't edit directly.
- Spreadsheet intact — never delete rows.
- Project working files (reports, scripts, JSON) in Wanas folder.

---

## 🛠 Development Commands

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Type-check + production build
npm run lint             # ESLint (strict)
npm run format           # Prettier
npm run test             # Vitest unit tests
npm run test:e2e         # Playwright E2E
npm run sync:products    # Sheet → products.json
npm run optimize:images  # Sharp: WebP/AVIF/responsive
npm run validate:data    # Schema validation
```

---

## ♿ Accessibility (Non-negotiable)

- Semantic HTML5 (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`)
- ARIA labels on all interactive elements
- Focus-visible outlines
- Skip link
- RTL/LTR aware
- Color contrast ≥ 4.5:1
- Lazy-loaded images

---

## 🔐 Admin Panel Access

- **Keys:** `Ctrl+Shift+A` or triple-click logo
- **Features:** Product CRUD, sync from sheet, export JSON, settings, order viewing

---

## 🌍 Communication

- Reply in Arabic when user writes Arabic, English when English.
- Keep product copy warm and simple.
- Lead with answer, explain second. No filler.

---

## 🤖 Specialist Roles (Kanban-Compatible)

This project uses **Hermes Kanban** for multi-agent work. Specialists are created as Kanban tasks with specific assignee profiles. See `specialists/` folder for role definitions.

**Current specialists:**
1. **frontend-engineer** — Architecture, build, components, buyer flow, i18n
2. **data-specialist** — Sheet sync, pricing formulas, validation, market research
3. **qa-engineer** — Vitest + Playwright setup, CI integration
4. **devops-light** — GitHub Actions workflow, Pages deploy config

**To spawn a specialist:**
```bash
# Via Hermes Kanban (orchestrator creates task with assignee=specialist-name)
```

Each specialist receives: task-specific context, constraints, permitted actions, required evidence, output format.

---

## 📝 Change Log

- **2026-10-23:** Migrated from monolithic `index.html` to Vite + TypeScript + component architecture. Added CI/CD, data pipeline, image optimization, testing, admin separation.