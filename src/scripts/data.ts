// ==========================================================================
// Wanas — Data Loader
// ==========================================================================

import type { SiteData, Product, Category } from './types';

let siteDataCache: SiteData | null = null;
let dataLoadPromise: Promise<SiteData> | null = null;

export async function loadSiteData(): Promise<SiteData> {
  if (siteDataCache) return siteDataCache;
  if (dataLoadPromise) return dataLoadPromise;

  dataLoadPromise = (async () => {
    try {
      const response = await fetch('/data/products.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Failed to load products: ${response.status}`);
      const data = await response.json();
      siteDataCache = data as SiteData;
      return siteDataCache!;
    } catch (error) {
      console.error('Failed to load site data:', error);
      throw error;
    }
  })();

  return dataLoadPromise;
}

export function getSiteData(): SiteData | null {
  return siteDataCache;
}

export function getProducts(): Product[] {
  return siteDataCache?.products?.filter(p => p.active) ?? [];
}

export function getProductById(id: string): Product | undefined {
  return siteDataCache?.products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return siteDataCache?.products.find(p => p.slug === slug);
}

export function getCategories(): Category[] {
  return (siteDataCache?.categories ?? []).sort((a, b) => a.order - b.order);
}

export function getCategoryById(id: string): Category | undefined {
  return siteDataCache?.categories.find(c => c.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getProducts().filter(p => p.category === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter(p => p.featured);
}

export function getBrand() {
  return siteDataCache?.brand;
}

export function getPayments() {
  return siteDataCache?.payments;
}

export function invalidateCache(): void {
  siteDataCache = null;
  dataLoadPromise = null;
}