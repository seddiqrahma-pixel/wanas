// ==========================================================================
// Wanas — Cart System (IndexedDB + LocalStorage sync)
// ==========================================================================

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { CartItem, Product, ProductVariant, Order } from './types';
import { formatPrice } from './i18n';

interface CartDBSchema extends DBSchema {
  cart: {
    key: string;
    value: CartItem & { id: string };
    indexes: { 'by-product': string };
  };
  orders: {
    key: string;
    value: {
      id: string;
      timestamp: number;
      data: unknown;
    };
    indexes: { 'by-timestamp': number };
  };
  settings: {
    key: string;
    value: { key: string; value: unknown };
  };
}

let dbPromise: Promise<IDBPDatabase<CartDBSchema>> | null = null;

function getDB(): Promise<IDBPDatabase<CartDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<CartDBSchema>('wanas-cart', 1, {
      upgrade(db) {
        const cartStore = db.createObjectStore('cart', { keyPath: 'id' });
        cartStore.createIndex('by-product', 'productId');
        const ordersStore = db.createObjectStore('orders', { keyPath: 'id' });
        ordersStore.createIndex('by-timestamp', 'timestamp');
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    });
  }
  return dbPromise;
}

function generateCartItemId(productId: string, variantId: string): string {
  return `${productId}:${variantId}`;
}

export async function getCart(): Promise<(CartItem & { id: string })[]> {
  const db = await getDB();
  return db.getAll('cart');
}

export async function getCartCount(): Promise<number> {
  const db = await getDB();
  const items = await db.getAll('cart');
  return items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
}

export async function getCartTotal(): Promise<number> {
  const db = await getDB();
  const items = await db.getAll('cart');
  return items.reduce((sum: number, item: { variant: { price_egp: number }; quantity: number }) => sum + item.variant.price_egp * item.quantity, 0);
}

export async function addToCart(product: Product, variant: ProductVariant, quantity = 1): Promise<void> {
  const db = await getDB();
  const id = generateCartItemId(product.id, variant.id);
  const existing = await db.get('cart', id);

  if (existing) {
    existing.quantity += quantity;
    await db.put('cart', existing);
  } else {
    const item: CartItem & { id: string } = {
      id,
      productId: product.id,
      variantId: variant.id,
      quantity,
      product,
      variant
    };
    await db.put('cart', item);
  }
  dispatchCartEvent();
}

export async function updateCartQuantity(productId: string, variantId: string, quantity: number): Promise<void> {
  const db = await getDB();
  const id = generateCartItemId(productId, variantId);
  if (quantity <= 0) {
    await db.delete('cart', id);
  } else {
    const item = await db.get('cart', id);
    if (item) {
      item.quantity = quantity;
      await db.put('cart', item);
    }
  }
  dispatchCartEvent();
}

export async function removeFromCart(productId: string, variantId: string): Promise<void> {
  const db = await getDB();
  const id = generateCartItemId(productId, variantId);
  await db.delete('cart', id);
  dispatchCartEvent();
}

export async function clearCart(): Promise<void> {
  const db = await getDB();
  await db.clear('cart');
  dispatchCartEvent();
}

export async function saveOrder(orderData: Omit<Order, 'id' | 'timestamp'> & { id?: string }): Promise<string> {
  const db = await getDB();
  const id = orderData.id || `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const order = {
    id,
    timestamp: Date.now(),
    data: orderData
  };
  await db.put('orders', order);
  return id;
}

export async function getOrders(): Promise<Array<{ id: string; timestamp: number; data: Order }>> {
  const db = await getDB();
  const orders = await db.getAllFromIndex('orders', 'by-timestamp');
  return orders as Array<{ id: string; timestamp: number; data: Order }>;
}

function dispatchCartEvent(): void {
  window.dispatchEvent(new CustomEvent('wanas:cart-change'));
}

export function onCartChange(fn: () => void): () => void {
  window.addEventListener('wanas:cart-change', fn);
  return () => window.removeEventListener('wanas:cart-change', fn);
}

export function generateWhatsAppOrderLink(order: Order): string {
  const itemsText = order.items.map(item =>
    `• ${item.product.name.ar} (${item.variant.id}) × ${item.quantity} = ${formatPrice(item.variant.price_egp * item.quantity)}`
  ).join('\n');

  const message = `طلب جديد من ونس 🕯️\n\n${itemsText}\n\nالمجموع: ${formatPrice(order.total)}\n\nالعميل: ${order.customer.name}\nالهاتف: ${order.customer.phone}\n${order.customer.address ? `العنوان: ${order.customer.address}\n` : ''}${order.customer.note ? `ملاحظة: ${order.customer.note}\n` : ''}\nطريقة الدفع: ${order.paymentMethod}`;

  return `https://wa.me/201020306395?text=${encodeURIComponent(message)}`;
}