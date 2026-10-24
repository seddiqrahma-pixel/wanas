// ==========================================================================
// Wanas — Type Definitions
// ==========================================================================

export interface ProductVariant {
  id: string;
  price_egp: number;
  sku: string;
  weight_g?: number;
  volume_ml?: number;
}

export interface ProductImage {
  src: string;
  alt?: string;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price_egp: number;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
  active: boolean;
}

export interface Category {
  id: string;
  name: { ar: string; en: string };
  order: number;
}

export interface Brand {
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  location: { ar: string; en: string };
  service: { ar: string; en: string };
}

export interface PaymentMethod {
  id: string;
  name: { ar: string; en: string };
  number?: string;
  email?: string;
  details?: { bank: string; iban: string; name: string };
  type: 'mobile_wallet' | 'instant_transfer' | 'bank_transfer' | 'whatsapp';
}

export interface PaymentsConfig {
  methods: PaymentMethod[];
  currency: string;
  note: { ar: string; en: string };
}

export interface SiteData {
  products: Product[];
  categories: Category[];
  brand: Brand;
  payments: PaymentsConfig;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface Order {
  id: string;
  timestamp: number;
  customer: { name: string; phone: string; address?: string; note?: string };
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
}

// ==========================================================================
// Utility Types
// ==========================================================================

export type Locale = 'ar' | 'en';

export interface TranslationMap {
  [key: string]: string | TranslationMap;
}