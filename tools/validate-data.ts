// ==========================================================================
// Wanas — Data Validation
// ==========================================================================
// Usage: npm run validate:data
// Validates src/data/products.json against schema

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'products.json');

interface Product {
  id: string;
  slug: string;
  category: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price_egp: number;
  images: string[];
  variants: Array<{
    id: string;
    price_egp: number;
    sku: string;
    weight_g?: number;
    volume_ml?: number;
  }>;
  tags: string[];
  featured: boolean;
  active: boolean;
}

interface SiteData {
  products: Product[];
  categories: Array<{ id: string; name: { ar: string; en: string }; order: number }>;
  brand: { name: { ar: string; en: string }; tagline: { ar: string; en: string }; location: { ar: string; en: string }; service: { ar: string; en: string } };
  payments: { methods: any[]; currency: string; note: { ar: string; en: string } };
}

function validate(): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(DATA_PATH)) {
    errors.push(`Data file not found: ${DATA_PATH}`);
    return { errors, warnings };
  }

  let data: SiteData;
  try {
    data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch (err) {
    errors.push(`Invalid JSON: ${err}`);
    return { errors, warnings };
  }

  // Validate structure
  if (!data.products || !Array.isArray(data.products)) {
    errors.push('Missing or invalid products array');
    return { errors, warnings };
  }

  if (!data.categories || !Array.isArray(data.categories)) {
    errors.push('Missing or invalid categories array');
  }

  if (!data.brand) errors.push('Missing brand');
  if (!data.payments) errors.push('Missing payments');

  // Validate products
  const seenIds = new Set<string>();
  const seenSkus = new Set<string>();
  const seenSlugs = new Set<string>();
  const validCategories = new Set(data.categories?.map(c => c.id) || ['candles', 'gifts', 'fragrance']);

  data.products.forEach((product, index) => {
    const prefix = `Product ${index} (${product.id || 'no-id'})`;

    if (!product.id) errors.push(`${prefix}: missing id`);
    else if (seenIds.has(product.id)) errors.push(`${prefix}: duplicate id`);
    else seenIds.add(product.id);

    if (!product.slug) errors.push(`${prefix}: missing slug`);
    else if (seenSlugs.has(product.slug)) warnings.push(`${prefix}: duplicate slug`);
    else seenSlugs.add(product.slug);

    if (!product.name?.ar) errors.push(`${prefix}: missing Arabic name`);
    if (!product.name?.en) warnings.push(`${prefix}: missing English name`);

    if (!product.description?.ar) warnings.push(`${prefix}: missing Arabic description`);
    if (!product.description?.en) warnings.push(`${prefix}: missing English description`);

    if (typeof product.price_egp !== 'number' || product.price_egp <= 0) {
      errors.push(`${prefix}: invalid price (${product.price_egp})`);
    }

    if (!product.category || !validCategories.has(product.category)) {
      errors.push(`${prefix}: invalid category "${product.category}"`);
    }

    if (!Array.isArray(product.images) || product.images.length === 0) {
      warnings.push(`${prefix}: no images`);
    } else {
      product.images.forEach((img, i) => {
        if (!img || typeof img !== 'string') {
          warnings.push(`${prefix}: image ${i} is empty or invalid`);
        }
      });
    }

    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      errors.push(`${prefix}: no variants`);
    } else {
      product.variants.forEach((variant, vIndex) => {
        const vPrefix = `${prefix} variant ${vIndex} (${variant.id})`;
        if (!variant.id) errors.push(`${vPrefix}: missing id`);
        if (typeof variant.price_egp !== 'number' || variant.price_egp <= 0) {
          errors.push(`${vPrefix}: invalid price`);
        }
        if (!variant.sku) errors.push(`${vPrefix}: missing SKU`);
        else if (seenSkus.has(variant.sku)) errors.push(`${vPrefix}: duplicate SKU`);
        else seenSkus.add(variant.sku);

        if (variant.weight_g !== undefined && (typeof variant.weight_g !== 'number' || variant.weight_g <= 0)) {
          warnings.push(`${vPrefix}: invalid weight_g`);
        }
        if (variant.volume_ml !== undefined && (typeof variant.volume_ml !== 'number' || variant.volume_ml <= 0)) {
          warnings.push(`${vPrefix}: invalid volume_ml`);
        }
      });

      // Base price should match first variant
      if (product.price_egp !== product.variants[0]?.price_egp) {
        warnings.push(`${prefix}: base price (${product.price_egp}) doesn't match first variant (${product.variants[0]?.price_egp})`);
      }
    }

    if (typeof product.featured !== 'boolean') warnings.push(`${prefix}: featured should be boolean`);
    if (typeof product.active !== 'boolean') warnings.push(`${prefix}: active should be boolean`);
  });

  // Check for orphan categories
  const usedCategories = new Set(data.products.map(p => p.category));
  data.categories?.forEach(cat => {
    if (!usedCategories.has(cat.id)) {
      warnings.push(`Category "${cat.id}" has no products`);
    }
  });

  return { errors, warnings };
}

function main(): void {
  console.log('🔍 Validating product data...');

  const { errors, warnings } = validate();

  if (errors.length > 0) {
    console.error('\n❌ Errors:');
    errors.forEach(e => console.error(`  - ${e}`));
  } else {
    console.log('\n✅ No errors found');
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Warnings:');
    warnings.forEach(w => console.warn(`  - ${w}`));
  } else {
    console.log('✅ No warnings');
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

main();