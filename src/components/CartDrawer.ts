// ==========================================================================
// Wanas — Cart Drawer Component
// ==========================================================================

import { getCart, getCartTotal, updateCartQuantity, removeFromCart, clearCart, onCartChange, generateWhatsAppOrderLink } from '../scripts/cart';
import { t, formatPrice, getLocale, onLocaleChange } from '../scripts/i18n';
import type { CartItem, Order } from '../scripts/types';

let cartDrawer: HTMLElement | null = null;
let cartOverlay: HTMLElement | null = null;
let cartItemsContainer: HTMLElement | null = null;
let cartTotalEl: HTMLElement | null = null;
let checkoutBtn: HTMLButtonElement | null = null;
let unsubscribeCart: (() => void) | null = null;
let unsubscribeLocale: (() => void) | null = null;

export function initCartDrawer(): void {
  cartDrawer = document.getElementById('cart-drawer');
  cartOverlay = document.getElementById('cart-overlay');
  cartItemsContainer = document.getElementById('cart-items');
  cartTotalEl = document.getElementById('cart-total');
  checkoutBtn = document.getElementById('checkout-btn') as HTMLButtonElement;

  if (!cartDrawer || !cartOverlay || !cartItemsContainer || !cartTotalEl || !checkoutBtn) {
    console.warn('Cart drawer elements not found');
    return;
  }

  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');

  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  checkoutBtn?.addEventListener('click', handleCheckout);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer?.classList.contains('open')) {
      closeCart();
    }
  });

  unsubscribeCart = onCartChange(renderCart);
  unsubscribeLocale = onLocaleChange(renderCart);

  renderCart();
  updateCartCountBadge();
}

function openCart(): void {
  cartDrawer?.classList.add('open');
  cartOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart(): void {
  cartDrawer?.classList.remove('open');
  cartOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

async function renderCart(): Promise<void> {
  if (!cartItemsContainer || !cartTotalEl) return;

  const items = await getCart();
  const total = await getCartTotal();

  if (items.length === 0) {
    cartItemsContainer.innerHTML = `<p class="cart-empty" style="text-align: center; padding: var(--space-8); color: var(--color-text-muted);">${t('cart.empty')}</p>`;
    checkoutBtn?.setAttribute('disabled', 'true');
  } else {
    checkoutBtn?.removeAttribute('disabled');
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      fragment.appendChild(createCartItemElement(item));
    });
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.appendChild(fragment);
  }

  cartTotalEl.textContent = formatPrice(total);
  updateCartCountBadge();
}

function createCartItemElement(item: CartItem & { id: string }): HTMLElement {
  const locale = getLocale();
  const imageSrc = item.product.images[0] ? `/products/${item.product.images[0]}` : '/placeholder.svg';

  const div = document.createElement('div');
  div.className = 'cart-item';
  div.dataset.cartItemId = item.id;
  div.innerHTML = `
    <div class="cart-item-image">
      <img src="${imageSrc}" alt="${item.product.name[locale]}" width="60" height="60" loading="lazy">
    </div>
    <div class="cart-item-details">
      <div class="cart-item-name">${item.product.name[locale]}</div>
      <div class="cart-item-price">${formatPrice(item.variant.price_egp)} × ${item.quantity}</div>
      <div class="cart-item-qty">
        <button class="qty-btn qty-decrease" data-action="decrease" aria-label="${locale === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}">−</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn qty-increase" data-action="increase" aria-label="${locale === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}">+</button>
      </div>
      <button class="cart-item-remove" data-action="remove" aria-label="${t('cart.remove')}: ${item.product.name[locale]}">${t('cart.remove')}</button>
    </div>
  `;

  div.querySelector('[data-action="decrease"]')?.addEventListener('click', () =>
    updateCartQuantity(item.productId, item.variantId, item.quantity - 1)
  );
  div.querySelector('[data-action="increase"]')?.addEventListener('click', () =>
    updateCartQuantity(item.productId, item.variantId, item.quantity + 1)
  );
  div.querySelector('[data-action="remove"]')?.addEventListener('click', () =>
    removeFromCart(item.productId, item.variantId)
  );

  return div;
}

async function handleCheckout(): Promise<void> {
  const items = await getCart();
  if (items.length === 0) return;

  const total = await getCartTotal();
  const locale = getLocale();

  const customerName = prompt(locale === 'ar' ? 'اسمك:' : 'Your name:') || '';
  const customerPhone = prompt(locale === 'ar' ? 'رقم هاتفك:' : 'Your phone:') || '';
  const customerAddress = prompt(locale === 'ar' ? 'عنوان التوصيل (اختياري):' : 'Delivery address (optional):') || '';
  const customerNote = prompt(locale === 'ar' ? 'ملاحظة للطلب (اختياري):' : 'Order note (optional):') || '';

  if (!customerName || !customerPhone) {
    alert(locale === 'ar' ? 'الاسم ورقم الهاتف مطلوبان' : 'Name and phone are required');
    return;
  }

  const paymentMethod = prompt(
    locale === 'ar'
      ? 'طريقة الدفع:\n1. فودافون كاش\n2. إنستاباي\n3. تحويل بنكي\n4. دفع عند الاستلام'
      : 'Payment method:\n1. Vodafone Cash\n2. InstaPay\n3. Bank Transfer\n4. Cash on Delivery'
  ) || '1';

  const paymentLabels: Record<string, { ar: string; en: string }> = {
    '1': { ar: 'فودافون كاش', en: 'Vodafone Cash' },
    '2': { ar: 'إنستاباي', en: 'InstaPay' },
    '3': { ar: 'تحويل بنكي', en: 'Bank Transfer' },
    '4': { ar: 'دفع عند الاستلام', en: 'Cash on Delivery' }
  };

  const order: Order = {
    id: '',
    timestamp: Date.now(),
    customer: { name: customerName, phone: customerPhone, address: customerAddress, note: customerNote },
    items: items.map(i => ({
      productId: i.productId,
      variantId: i.variantId,
      quantity: i.quantity,
      product: i.product,
      variant: i.variant
    })),
    total,
    status: 'pending',
    paymentMethod: paymentLabels[paymentMethod]?.[locale] || paymentLabels['1'][locale]
  };

  const whatsappLink = generateWhatsAppOrderLink(order);
  window.open(whatsappLink, '_blank');

  await clearCart();
  closeCart();
}

function updateCartCountBadge(): void {
  getCartCount().then(count => {
    const badge = document.querySelector('.cart-count') as HTMLElement;
    if (badge) {
      badge.textContent = String(count);
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}

async function getCartCount(): Promise<number> {
  const items = await getCart();
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function destroyCartDrawer(): void {
  unsubscribeCart?.();
  unsubscribeLocale?.();
}