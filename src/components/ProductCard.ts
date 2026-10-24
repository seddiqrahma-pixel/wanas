// ==========================================================================
// Wanas — Product Card Component
// ==========================================================================

import type { Product } from '../scripts/types';
import { t, formatPrice, getLocale } from '../scripts/i18n';
import { addToCart } from '../scripts/cart';
import { createImageGallery } from './ImageGallery';

export function createProductCard(product: Product): HTMLElement {
  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.productId = product.id;
  article.setAttribute('role', 'listitem');

  const locale = getLocale();
  const variant = product.variants[0];

  article.innerHTML = `
    <div class="product-image" data-gallery-container="true"></div>
    ${product.featured ? `<span class="product-badge" data-i18n="product.featured">${t('product.featured')}</span>` : ''}
    <div class="product-info">
      <span class="product-category" data-i18n="categories.${product.category}">${t(`categories.${product.category}`)}</span>
      <h3 class="product-name">${product.name[locale]}</h3>
      <p class="product-description">${product.description[locale]}</p>
      <div class="product-footer">
        <span class="product-price">${formatPrice(variant.price_egp)}</span>
        <button class="btn btn-primary btn-sm btn-add-cart" data-product-id="${product.id}" data-variant-id="${variant.id}" aria-label="${t('product.add_to_cart')}: ${product.name[locale]}">
          ${t('product.add_to_cart')}
        </button>
      </div>
    </div>
  `;

  // Initialize image gallery
  const galleryContainer = article.querySelector('[data-gallery-container]') as HTMLElement;
  if (galleryContainer) {
    const altTexts = product.images.map((_, i) => `${product.name[locale]} - ${t('product.gallery_thumb_label', { index: i + 1, total: product.images.length })}`);
    const gallery = createImageGallery({
      images: product.images,
      altTexts,
      productId: product.id,
      productName: product.name[locale],
      container: galleryContainer
    });
    galleryContainer.appendChild(gallery);
  }

  const addBtn = article.querySelector('.btn-add-cart') as HTMLButtonElement;
  addBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, variant, 1);
      showAddedFeedback(addBtn);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      addBtn.textContent = t('product.add_to_cart');
    }
  });

  return article;
}

function showAddedFeedback(btn: HTMLButtonElement): void {
  const originalText = btn.textContent || '';
  btn.textContent = '✓ ' + (getLocale() === 'ar' ? 'تم الإضافة' : 'Added');
  btn.classList.add('btn-secondary');
  btn.classList.remove('btn-primary');
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
    btn.disabled = false;
  }, 1500);
}

export function renderProductsGrid(products: Product[], container: HTMLElement): void {
  container.innerHTML = '';
  if (products.length === 0) {
    container.innerHTML = `<p class="no-products" style="grid-column: 1/-1; text-align: center; padding: var(--space-12); color: var(--color-text-muted);">${getLocale() === 'ar' ? 'لا توجد منتجات في هذا القسم' : 'No products in this category'}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach((product, index) => {
    const card = createProductCard(product);
    card.style.animationDelay = `${index * 50}ms`;
    card.classList.add('slide-up');
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
}