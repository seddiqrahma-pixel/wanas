import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Product, ProductVariant, Order } from '../../src/scripts/types';

// Mock IndexedDB
const mockDB = {
  getAll: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
  getAllFromIndex: vi.fn(),
};

const mockOpenDB = vi.fn().mockResolvedValue(mockDB);

// Hoisted mock for idb
vi.mock('idb', () => ({
  openDB: mockOpenDB,
}));

// Hoisted mock for i18n formatPrice
const mockFormatPrice = vi.fn((price: number) => `${price} EGP`);
vi.mock('../../src/scripts/i18n', () => ({
  formatPrice: mockFormatPrice,
}));

describe('cart', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // Reset the mock implementations
    mockOpenDB.mockResolvedValue(mockDB);
    mockFormatPrice.mockImplementation((price: number) => `${price} EGP`);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getCart', () => {
    it('returns empty array when cart is empty', async () => {
      mockDB.getAll.mockResolvedValue([]);
      const { getCart } = await import('../../src/scripts/cart');
      const cart = await getCart();
      expect(cart).toEqual([]);
    });

    it('returns cart items when they exist', async () => {
      const mockItems = [
        { id: 'prod1:var1', productId: 'prod1', variantId: 'var1', quantity: 2, product: {}, variant: { price_egp: 100 } },
        { id: 'prod2:var2', productId: 'prod2', variantId: 'var2', quantity: 1, product: {}, variant: { price_egp: 200 } },
      ];
      mockDB.getAll.mockResolvedValue(mockItems);
      const { getCart } = await import('../../src/scripts/cart');
      const cart = await getCart();
      expect(cart).toEqual(mockItems);
    });
  });

  describe('getCartCount', () => {
    it('returns 0 for empty cart', async () => {
      mockDB.getAll.mockResolvedValue([]);
      const { getCartCount } = await import('../../src/scripts/cart');
      const count = await getCartCount();
      expect(count).toBe(0);
    });

    it('returns sum of quantities', async () => {
      mockDB.getAll.mockResolvedValue([
        { quantity: 2 },
        { quantity: 3 },
        { quantity: 1 },
      ]);
      const { getCartCount } = await import('../../src/scripts/cart');
      const count = await getCartCount();
      expect(count).toBe(6);
    });
  });

  describe('getCartTotal', () => {
    it('returns 0 for empty cart', async () => {
      mockDB.getAll.mockResolvedValue([]);
      const { getCartTotal } = await import('../../src/scripts/cart');
      const total = await getCartTotal();
      expect(total).toBe(0);
    });

    it('calculates total correctly', async () => {
      mockDB.getAll.mockResolvedValue([
        { variant: { price_egp: 100 }, quantity: 2 },
        { variant: { price_egp: 200 }, quantity: 1 },
      ]);
      const { getCartTotal } = await import('../../src/scripts/cart');
      const total = await getCartTotal();
      expect(total).toBe(400); // 100*2 + 200*1
    });
  });

  describe('addToCart', () => {
    it('adds new item to empty cart', async () => {
      mockDB.get.mockResolvedValue(undefined);
      mockDB.put.mockResolvedValue(undefined);
      const { addToCart } = await import('../../src/scripts/cart');
      const product: Product = { id: 'prod1', slug: 'test', category: 'candles', name: { ar: 'Test', en: 'Test' }, description: { ar: '', en: '' }, price_egp: 100, images: [], variants: [], tags: [], featured: false, active: true };
      const variant: ProductVariant = { id: 'var1', price_egp: 100, sku: 'TEST-001' };
      await addToCart(product, variant, 1);
      expect(mockDB.put).toHaveBeenCalledWith('cart', expect.objectContaining({
        id: 'prod1:var1',
        productId: 'prod1',
        variantId: 'var1',
        quantity: 1,
      }));
    });

    it('merges quantities when adding existing product+variant', async () => {
      const existingItem = { id: 'prod1:var1', productId: 'prod1', variantId: 'var1', quantity: 2, product: {}, variant: { price_egp: 100 } };
      mockDB.get.mockResolvedValue(existingItem);
      mockDB.put.mockResolvedValue(undefined);
      const { addToCart } = await import('../../src/scripts/cart');
      const product: Product = { id: 'prod1', slug: 'test', category: 'candles', name: { ar: 'Test', en: 'Test' }, description: { ar: '', en: '' }, price_egp: 100, images: [], variants: [], tags: [], featured: false, active: true };
      const variant: ProductVariant = { id: 'var1', price_egp: 100, sku: 'TEST-001' };
      await addToCart(product, variant, 3);
      expect(mockDB.put).toHaveBeenCalledWith('cart', expect.objectContaining({
        quantity: 5, // 2 + 3
      }));
    });

    it('dispatches cart change event', async () => {
      mockDB.get.mockResolvedValue(undefined);
      mockDB.put.mockResolvedValue(undefined);
      const { addToCart } = await import('../../src/scripts/cart');
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
      const product: Product = { id: 'prod1', slug: 'test', category: 'candles', name: { ar: 'Test', en: 'Test' }, description: { ar: '', en: '' }, price_egp: 100, images: [], variants: [], tags: [], featured: false, active: true };
      const variant: ProductVariant = { id: 'var1', price_egp: 100, sku: 'TEST-001' };
      await addToCart(product, variant, 1);
      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'wanas:cart-change' }));
      dispatchSpy.mockRestore();
    });
  });

  describe('updateCartQuantity', () => {
    it('deletes item when quantity <= 0', async () => {
      mockDB.delete.mockResolvedValue(undefined);
      const { updateCartQuantity } = await import('../../src/scripts/cart');
      await updateCartQuantity('prod1', 'var1', 0);
      expect(mockDB.delete).toHaveBeenCalledWith('cart', 'prod1:var1');
    });

    it('updates quantity when item exists', async () => {
      const existingItem = { id: 'prod1:var1', quantity: 2 };
      mockDB.get.mockResolvedValue(existingItem);
      mockDB.put.mockResolvedValue(undefined);
      const { updateCartQuantity } = await import('../../src/scripts/cart');
      await updateCartQuantity('prod1', 'var1', 5);
      expect(mockDB.put).toHaveBeenCalledWith('cart', expect.objectContaining({ quantity: 5 }));
    });

    it('does nothing when item does not exist', async () => {
      mockDB.get.mockResolvedValue(undefined);
      const { updateCartQuantity } = await import('../../src/scripts/cart');
      await updateCartQuantity('prod1', 'var1', 5);
      expect(mockDB.put).not.toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    it('deletes item from cart', async () => {
      mockDB.delete.mockResolvedValue(undefined);
      const { removeFromCart } = await import('../../src/scripts/cart');
      await removeFromCart('prod1', 'var1');
      expect(mockDB.delete).toHaveBeenCalledWith('cart', 'prod1:var1');
    });
  });

  describe('clearCart', () => {
    it('clears all cart items', async () => {
      mockDB.clear.mockResolvedValue(undefined);
      const { clearCart } = await import('../../src/scripts/cart');
      await clearCart();
      expect(mockDB.clear).toHaveBeenCalledWith('cart');
    });
  });

  describe('saveOrder', () => {
    it('saves order with generated ID', async () => {
      mockDB.put.mockResolvedValue(undefined);
      const { saveOrder } = await import('../../src/scripts/cart');
      const orderData = { customer: { name: 'Test', phone: '123' }, items: [], total: 100, status: 'pending' as const, paymentMethod: 'Cash' };
      const id = await saveOrder(orderData);
      expect(id).toMatch(/^ORD-\d+-[A-Z0-9]+$/);
      expect(mockDB.put).toHaveBeenCalledWith('orders', expect.objectContaining({
        id,
        data: orderData,
      }));
    });

    it('uses provided ID when given', async () => {
      mockDB.put.mockResolvedValue(undefined);
      const { saveOrder } = await import('../../src/scripts/cart');
      const orderData = { id: 'CUSTOM-123', customer: { name: 'Test', phone: '123' }, items: [], total: 100, status: 'pending' as const, paymentMethod: 'Cash' };
      const id = await saveOrder(orderData);
      expect(id).toBe('CUSTOM-123');
    });
  });

  describe('getOrders', () => {
    it('returns orders sorted by timestamp', async () => {
      const mockOrders = [
        { id: '2', timestamp: 2000, data: {} },
        { id: '1', timestamp: 1000, data: {} },
      ];
      mockDB.getAllFromIndex.mockResolvedValue(mockOrders);
      const { getOrders } = await import('../../src/scripts/cart');
      const orders = await getOrders();
      expect(orders).toEqual(mockOrders);
    });
  });

  describe('onCartChange', () => {
    it('registers and unregisters listener', async () => {
      mockDB.getAll.mockResolvedValue([]);
      const { onCartChange } = await import('../../src/scripts/cart');
      const fn = vi.fn();
      const unsubscribe = onCartChange(fn);
      // Trigger event
      window.dispatchEvent(new CustomEvent('wanas:cart-change'));
      expect(fn).toHaveBeenCalledTimes(1);
      unsubscribe();
      window.dispatchEvent(new CustomEvent('wanas:cart-change'));
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateWhatsAppOrderLink', () => {
    it('generates correct WhatsApp link with order details', async () => {
      // Reset formatPrice mock for this test
      mockFormatPrice.mockImplementation((price: number) => `${price} ج.م`);
      const { generateWhatsAppOrderLink } = await import('../../src/scripts/cart');
             const mockProduct1: Product = {
              id: 'prod1',
              slug: 'prod-1',
              category: 'cat1',
              name: { ar: 'منتج 1', en: 'Product 1' },
              description: { ar: 'وصف 1', en: 'Description 1' },
              price_egp: 100,
              images: [],
              variants: [],
              tags: [],
              featured: false,
              active: true,
            };
            const mockProduct2: Product = {
              id: 'prod2',
              slug: 'prod-2',
              category: 'cat1',
              name: { ar: 'منتج 2', en: 'Product 2' },
              description: { ar: 'وصف 2', en: 'Description 2' },
              price_egp: 200,
              images: [],
              variants: [],
              tags: [],
              featured: false,
              active: true,
            };
            const mockVariant1: ProductVariant = { price_egp: 100, id: 'var1', sku: 'TEST-001' };
            const mockVariant2: ProductVariant = { price_egp: 200, id: 'var2', sku: 'TEST-002' };

            const order: Order = {
              id: 'ORD-TEST-123',
              timestamp: Date.now(),
              status: 'pending' as const,
              items: [
                { 
                  productId: 'prod1', 
                  variantId: 'var1', 
                  quantity: 2, 
                  product: mockProduct1,
                  variant: mockVariant1
                },
                { 
                  productId: 'prod2', 
                  variantId: 'var2', 
                  quantity: 1, 
                  product: mockProduct2,
                  variant: mockVariant2
                },
              ],
              total: 400,
              customer: { name: 'أحمد', phone: '01020306395', address: 'القاهرة', note: 'رجاء التوصيل صباحاً' },
              paymentMethod: 'فودافون كاش',
            };
      const link = generateWhatsAppOrderLink(order);
      expect(link).toContain('wa.me/201020306395');
      // Check for encoded Arabic text in URL
      expect(decodeURIComponent(link)).toContain('منتج 1');
      expect(decodeURIComponent(link)).toContain('منتج 2');
      expect(decodeURIComponent(link)).toContain('400 ج.م');
      expect(decodeURIComponent(link)).toContain('أحمد');
      expect(link).toContain('01020306395');
      expect(decodeURIComponent(link)).toContain('القاهرة');
      expect(decodeURIComponent(link)).toContain('رجاء التوصيل صباحاً');
      expect(decodeURIComponent(link)).toContain('فودافون كاش');
    });
  });
});