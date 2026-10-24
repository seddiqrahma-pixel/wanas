// ==========================================================================
// Wanas — Main Entry Point (Buyer App)
// ==========================================================================

import { initI18n, t, getLocale } from './i18n';
import { loadSiteData, getProducts } from './data';
import { renderProductsGrid } from '../components/ProductCard';
import { initCartDrawer } from '../components/CartDrawer';
import { initLanguageSwitcher } from '../components/LanguageSwitcher';

async function initApp(): Promise<void> {
  initI18n();

  try {
    await loadSiteData();
    initLayout();
    initCategoryFilters();
    await renderInitialProducts();
    initLanguageSwitcher();
    initCartDrawer();
    initMobileMenu();
    initSmoothScroll();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showErrorState();
  }
}

function initLayout(): void {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
}

function initCategoryFilters(): void {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productsGrid = document.getElementById('products-grid');

  if (!productsGrid) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = (btn as HTMLElement).dataset.category;
      if (category === 'all') {
        renderProductsGrid(getProducts(), productsGrid);
      } else {
        const filtered = getProducts().filter(p => p.category === category);
        renderProductsGrid(filtered, productsGrid);
      }
    });
  });
}

async function renderInitialProducts(): Promise<void> {
  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    renderProductsGrid(getProducts(), productsGrid);
  }
}

function initMobileMenu(): void {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
}

function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('.site-header') as HTMLElement;
        const headerHeight = header?.offsetHeight ?? 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

function showErrorState(): void {
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: var(--space-12); color: var(--color-error);">
        <p>${t('product.add_to_cart')}</p>
        <button class="btn btn-primary" onclick="location.reload()">${getLocale() === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { initApp };