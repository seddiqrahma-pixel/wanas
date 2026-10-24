import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

describe('data', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadSiteData', () => {
    it('fetches and caches site data', async () => {
      const mockData = {
        products: [{ id: 'p1', active: true }],
        categories: [{ id: 'c1', order: 1 }],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData } = await import('../../src/scripts/data');
      const data = await loadSiteData();
      expect(data).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('/data/products.json', { cache: 'no-cache' });
    });

    it('returns cached data on subsequent calls', async () => {
      const mockData = {
        products: [{ id: 'p1', active: true }],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData } = await import('../../src/scripts/data');
      await loadSiteData();
      await loadSiteData();
      // fetch should only be called once due to caching
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('throws on fetch error', async () => {
      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      const { loadSiteData } = await import('../../src/scripts/data');
      await expect(loadSiteData()).rejects.toThrow('Failed to load products: 404');
    });

    it('throws on network error', async () => {
      (global.fetch as Mock).mockRejectedValue(new Error('Network error'));

      const { loadSiteData } = await import('../../src/scripts/data');
      await expect(loadSiteData()).rejects.toThrow('Network error');
    });
  });

  describe('getSiteData', () => {
    it('returns null before data is loaded', async () => {
      const { getSiteData } = await import('../../src/scripts/data');
      expect(getSiteData()).toBeNull();
    });

    it('returns cached data after load', async () => {
      const mockData = {
        products: [{ id: 'p1', active: true }],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getSiteData } = await import('../../src/scripts/data');
      await loadSiteData();
      expect(getSiteData()).toEqual(mockData);
    });
  });

  describe('getProducts', () => {
    it('returns empty array when no data loaded', async () => {
      const { getProducts } = await import('../../src/scripts/data');
      expect(getProducts()).toEqual([]);
    });

    it('returns only active products', async () => {
      const mockData = {
        products: [
          { id: 'p1', active: true },
          { id: 'p2', active: false },
          { id: 'p3', active: true },
        ],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getProducts } = await import('../../src/scripts/data');
      await loadSiteData();
      const products = getProducts();
      expect(products).toHaveLength(2);
      expect(products.every(p => p.active)).toBe(true);
    });
  });

  describe('getProductById', () => {
    it('returns undefined when no data loaded', async () => {
      const { getProductById } = await import('../../src/scripts/data');
      expect(getProductById('p1')).toBeUndefined();
    });

    it('finds product by id', async () => {
      const mockData = {
        products: [
          { id: 'p1', active: true },
          { id: 'p2', active: true },
        ],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getProductById } = await import('../../src/scripts/data');
      await loadSiteData();
      const product = getProductById('p2');
      expect(product).toEqual({ id: 'p2', active: true });
    });
  });

  describe('getProductBySlug', () => {
    it('returns undefined when no data loaded', async () => {
      const { getProductBySlug } = await import('../../src/scripts/data');
      expect(getProductBySlug('test')).toBeUndefined();
    });

    it('finds product by slug', async () => {
      const mockData = {
        products: [
          { id: 'p1', slug: 'test-product', active: true },
        ],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getProductBySlug } = await import('../../src/scripts/data');
      await loadSiteData();
      const product = getProductBySlug('test-product');
      expect(product).toEqual({ id: 'p1', slug: 'test-product', active: true });
    });
  });

  describe('getCategories', () => {
    it('returns empty array when no data loaded', async () => {
      const { getCategories } = await import('../../src/scripts/data');
      expect(getCategories()).toEqual([]);
    });

    it('returns categories sorted by order', async () => {
      const mockData = {
        products: [],
        categories: [
          { id: 'c2', order: 2 },
          { id: 'c1', order: 1 },
          { id: 'c3', order: 3 },
        ],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getCategories } = await import('../../src/scripts/data');
      await loadSiteData();
      const categories = getCategories();
      expect(categories.map(c => c.id)).toEqual(['c1', 'c2', 'c3']);
    });
  });

  describe('getCategoryById', () => {
    it('returns undefined when no data loaded', async () => {
      const { getCategoryById } = await import('../../src/scripts/data');
      expect(getCategoryById('c1')).toBeUndefined();
    });

    it('finds category by id', async () => {
      const mockData = {
        products: [],
        categories: [{ id: 'c1', order: 1 }, { id: 'c2', order: 2 }],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getCategoryById } = await import('../../src/scripts/data');
      await loadSiteData();
      const category = getCategoryById('c2');
      expect(category).toEqual({ id: 'c2', order: 2 });
    });
  });

  describe('getProductsByCategory', () => {
    it('returns empty array when no data loaded', async () => {
      const { getProductsByCategory } = await import('../../src/scripts/data');
      expect(getProductsByCategory('candles')).toEqual([]);
    });

    it('filters products by category', async () => {
      const mockData = {
        products: [
          { id: 'p1', category: 'candles', active: true },
          { id: 'p2', category: 'gifts', active: true },
          { id: 'p3', category: 'candles', active: true },
        ],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getProductsByCategory } = await import('../../src/scripts/data');
      await loadSiteData();
      const candles = getProductsByCategory('candles');
      expect(candles).toHaveLength(2);
      expect(candles.every(p => p.category === 'candles')).toBe(true);
    });

    it('only returns active products', async () => {
      const mockData = {
        products: [
          { id: 'p1', category: 'candles', active: true },
          { id: 'p2', category: 'candles', active: false },
        ],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getProductsByCategory } = await import('../../src/scripts/data');
      await loadSiteData();
      const candles = getProductsByCategory('candles');
      expect(candles).toHaveLength(1);
    });
  });

  describe('getFeaturedProducts', () => {
    it('returns empty array when no data loaded', async () => {
      const { getFeaturedProducts } = await import('../../src/scripts/data');
      expect(getFeaturedProducts()).toEqual([]);
    });

    it('returns only featured products', async () => {
      const mockData = {
        products: [
          { id: 'p1', featured: true, active: true },
          { id: 'p2', featured: false, active: true },
          { id: 'p3', featured: true, active: true },
        ],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getFeaturedProducts } = await import('../../src/scripts/data');
      await loadSiteData();
      const featured = getFeaturedProducts();
      expect(featured).toHaveLength(2);
      expect(featured.every(p => p.featured)).toBe(true);
    });
  });

  describe('getBrand', () => {
    it('returns undefined when no data loaded', async () => {
      const { getBrand } = await import('../../src/scripts/data');
      expect(getBrand()).toBeUndefined();
    });

    it('returns brand data', async () => {
      const mockData = {
        products: [],
        categories: [],
        brand: { name: { ar: 'وَنَس', en: 'Wanas' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getBrand } = await import('../../src/scripts/data');
      await loadSiteData();
      expect(getBrand()).toEqual({ name: { ar: 'وَنَس', en: 'Wanas' } });
    });
  });

  describe('getPayments', () => {
    it('returns undefined when no data loaded', async () => {
      const { getPayments } = await import('../../src/scripts/data');
      expect(getPayments()).toBeUndefined();
    });

    it('returns payments config', async () => {
      const mockData = {
        products: [],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [{ id: 'cash' }], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getPayments } = await import('../../src/scripts/data');
      await loadSiteData();
      expect(getPayments()).toEqual({ methods: [{ id: 'cash' }], currency: 'EGP', note: { ar: '', en: '' } });
    });
  });

  describe('invalidateCache', () => {
    it('clears cache and allows reload', async () => {
      const mockData = {
        products: [{ id: 'p1', active: true }],
        categories: [],
        brand: { name: { ar: 'Test', en: 'Test' } },
        payments: { methods: [], currency: 'EGP', note: { ar: '', en: '' } },
      };
      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { loadSiteData, getSiteData, invalidateCache } = await import('../../src/scripts/data');
      await loadSiteData();
      expect(getSiteData()).not.toBeNull();

      invalidateCache();
      expect(getSiteData()).toBeNull();

      // Should be able to load again
      await loadSiteData();
      expect(getSiteData()).not.toBeNull();
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});