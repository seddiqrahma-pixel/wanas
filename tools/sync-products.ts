// ==========================================================================
// Wanas — Sync Products from Spreadsheet (CSV/JSON/XLSX)
// ==========================================================================
// Usage: npm run sync:products
// Reads from sheet_data/wanas_calculator.xlsx
// Outputs to src/data/products.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SHEET_DATA_DIR = path.join(PROJECT_ROOT, 'sheet_data');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'products.json');

interface SpreadsheetRow {
  id: string;
  slug: string;
  category: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  price_egp: number;
  images: string;
  variant_id: string;
  variant_price: number;
  variant_sku: string;
  weight_g?: number;
  volume_ml?: number;
  featured: boolean | string | number;
  active: boolean | string | number;
  tags: string;
}

function parseCSV(csvPath: string): SpreadsheetRow[] {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => row[h] = values[i] || '');
    return row as unknown as SpreadsheetRow;
  });
}

async function parseXLSX(xlsxPath: string): Promise<SpreadsheetRow[]> {
  try {
    const XLSX = await import('xlsx');
    const workbook = XLSX.default.readFile(xlsxPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.default.utils.sheet_to_json(sheet) as SpreadsheetRow[];
  } catch (err) {
    console.error('Failed to parse XLSX:', err);
    return [];
  }
}

function parseJSON(jsonPath: string): SpreadsheetRow[] {
  const content = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(content);
}

function findSourceFile(): { path: string; type: 'csv' | 'xlsx' | 'json' } | null {
  const candidates = [
    { path: path.join(SHEET_DATA_DIR, 'wanas_calculator.xlsx'), type: 'xlsx' as const },
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate.path)) return candidate;
  }
  return null;
}

function rowsToProducts(rows: SpreadsheetRow[]) {
  const productMap = new Map<string, any>();

  for (const row of rows) {
    if (!row.id || !row.name_ar) continue;

    if (!productMap.has(row.id)) {
      productMap.set(row.id, {
        id: row.id,
        slug: row.slug || row.id.toLowerCase().replace(/\s+/g, '-'),
        category: row.category || 'candles',
        name: { ar: row.name_ar, en: row.name_en || row.name_ar },
        description: { ar: row.desc_ar, en: row.desc_en || row.desc_ar },
        price_egp: Number(row.price_egp) || 0,
        images: row.images ? row.images.split(',').map(s => s.trim()) : [],
        variants: [],
        tags: row.tags ? row.tags.split(',').map(s => s.trim()) : [],
        featured: row.featured === true || row.featured === 'true' || row.featured === 1,
        active: row.active !== false && row.active !== 'false' && row.active !== 0
      });
    }

    const product = productMap.get(row.id);
    if (row.variant_id) {
      product.variants.push({
        id: row.variant_id,
        price_egp: Number(row.variant_price) || product.price_egp,
        sku: row.variant_sku || row.id.toUpperCase().replace(/-/g, ''),
        weight_g: row.weight_g ? Number(row.weight_g) : undefined,
        volume_ml: row.volume_ml ? Number(row.volume_ml) : undefined
      });
    }
  }

  // If no variants were parsed, create default from main price
  productMap.forEach(product => {
    if (product.variants.length === 0) {
      product.variants = [{
        id: 'default',
        price_egp: product.price_egp,
        sku: product.id.toUpperCase().replace(/-/g, '')
      }];
    }
    // Ensure base price matches first variant
    product.price_egp = product.variants[0]?.price_egp || product.price_egp;
  });

  return Array.from(productMap.values());
}

function getCategories(products: any[]) {
  const catMap = new Map<string, { id: string; name: { ar: string; en: string }; order: number }>();
  const categoryOrder = ['candles', 'gifts', 'fragrance'];
  const categoryNames: Record<string, { ar: string; en: string }> = {
    candles: { ar: 'شموع', en: 'Candles' },
    gifts: { ar: 'هدايا وورود', en: 'Gifts & Flowers' },
    fragrance: { ar: 'عطور منزلية', en: 'Home Fragrance' }
  };

  products.forEach(p => {
    if (!catMap.has(p.category)) {
      catMap.set(p.category, {
        id: p.category,
        name: categoryNames[p.category] || { ar: p.category, en: p.category },
        order: categoryOrder.indexOf(p.category) + 1 || 99
      });
    }
  });

  return Array.from(catMap.values()).sort((a, b) => a.order - b.order);
}

function getBrand() {
  return {
    name: { ar: 'وَنَس', en: 'Wanas' },
    tagline: { ar: 'شُمُوعٌ تَمنَحُكَ دِفءَ الشَمس 🕯️🧡', en: 'Candles that give you the warmth of the sun 🕯️🧡' },
    location: { ar: 'سوهاج، صعيد مصر', en: 'Sohag, Upper Egypt' },
    service: { ar: 'خدمة "أنسٌ منك" لكتابة بطاقات الهدايا مجاناً', en: 'Free handwritten gift-note service "Anas Mink"' }
  };
}

function getPayments() {
  return {
    methods: [
      { id: 'vodafone_cash', name: { ar: 'فودافون كاش', en: 'Vodafone Cash' }, number: '01020306395', type: 'mobile_wallet' },
      { id: 'insta_pay', name: { ar: 'إنستاباي', en: 'InstaPay' }, number: '01020306395', type: 'instant_transfer' },
      { id: 'bank_transfer', name: { ar: 'تحويل بنكي', en: 'Bank Transfer' }, details: { bank: 'NBE', iban: 'EG900003041450006160803000150', name: 'Ahmed Alghoraib' }, type: 'bank_transfer' },
      { id: 'whatsapp', name: { ar: 'طلب واتساب', en: 'WhatsApp Order' }, number: '01020306395', email: 'ahmed.alghoraib@gmail.com', type: 'whatsapp' }
    ],
    currency: 'EGP',
    note: { ar: 'لا يوجد دفع أونلاين بالبطاقات — الدفع عند الاستلام أو بالتحويل', en: 'No online card payment — cash on delivery or bank transfer only' }
  };
}

async function main(): Promise<void> {
  console.log('🔄 Syncing products from spreadsheet...');

  const source = findSourceFile();
  if (!source) {
    console.error('❌ No source file found in sheet_data/');
    console.log('Expected: wanas_calculator.xlsx');
    process.exit(1);
  }

  console.log(`📁 Reading from: ${source.path} (${source.type})`);

  let rows: SpreadsheetRow[] = [];
  switch (source.type) {
    case 'csv': rows = parseCSV(source.path); break;
    case 'xlsx': rows = await parseXLSX(source.path); break;
    case 'json': rows = parseJSON(source.path); break;
  }

  if (rows.length === 0) {
    console.error('❌ No valid rows found in source file');
    process.exit(1);
  }

  console.log(`📊 Parsed ${rows.length} rows`);

  const products = rowsToProducts(rows);
  const categories = getCategories(products);

  console.log(`✨ Generated ${products.length} products across ${categories.length} categories`);

  const output = {
    products,
    categories,
    brand: getBrand(),
    payments: getPayments()
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`✅ Written to ${OUTPUT_PATH}`);

  // Validate
  const errors = validateProducts(products);
  if (errors.length > 0) {
    console.warn('⚠️ Validation warnings:');
    errors.forEach(e => console.warn(`  - ${e}`));
  } else {
    console.log('✅ All products validated successfully');
  }
}

function validateProducts(products: any[]): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenSkus = new Set<string>();

  products.forEach((p, i) => {
    if (!p.id) errors.push(`Product ${i}: missing id`);
    if (seenIds.has(p.id)) errors.push(`Product ${p.id}: duplicate id`);
    seenIds.add(p.id);

    if (!p.name?.ar) errors.push(`Product ${p.id}: missing Arabic name`);
    if (!p.name?.en) errors.push(`Product ${p.id}: missing English name`);
    if (p.price_egp <= 0) errors.push(`Product ${p.id}: invalid price`);
    if (!p.variants?.length) errors.push(`Product ${p.id}: no variants`);

    p.variants?.forEach((v: any) => {
      if (!v.sku) errors.push(`Product ${p.id} variant ${v.id}: missing SKU`);
      if (seenSkus.has(v.sku)) errors.push(`Product ${p.id} variant ${v.id}: duplicate SKU ${v.sku}`);
      seenSkus.add(v.sku);
    });

    // Check images exist
    p.images?.forEach((img: string) => {
      const imgPath = path.join(PROJECT_ROOT, 'public', 'products', img);
      if (!fs.existsSync(imgPath)) {
        // Check in source assets
        const srcPath = path.join(PROJECT_ROOT, 'src', 'assets', 'products', img);
        if (!fs.existsSync(srcPath)) {
          errors.push(`Product ${p.id}: image not found - ${img}`);
        }
      }
    });
  });

  return errors;
}

main().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});