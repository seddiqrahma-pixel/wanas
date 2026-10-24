// ==========================================================================
// Wanas — Image Optimization (Sharp + WebP/AVIF + Responsive)
// ==========================================================================
// Usage: npm run optimize:images
// Reads from src/assets/products/**/*
// Outputs to public/products/**/* (WebP, AVIF, responsive widths)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'src', 'assets', 'products');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'products');

const RESPONSIVE_WIDTHS = [400, 800, 1200];
const QUALITY = { webp: 85, avif: 75, jpeg: 85, png: 90 };

async function optimizeImage(inputPath: string, relativePath: string): Promise<void> {
  const parsed = path.parse(relativePath);
  const outputBaseDir = path.join(OUTPUT_DIR, parsed.dir);

  await fs.promises.mkdir(outputBaseDir, { recursive: true });

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const isTransparent = metadata.hasAlpha || (metadata.format === 'png' && metadata.channels === 4);

  // Generate WebP (all widths)
  for (const width of RESPONSIVE_WIDTHS) {
    if (metadata.width && metadata.width <= width) continue;

    const webpPath = path.join(outputBaseDir, `${parsed.name}-${width}w.webp`);
    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY.webp })
      .toFile(webpPath);
  }

  // Generate AVIF (all widths)
  for (const width of RESPONSIVE_WIDTHS) {
    if (metadata.width && metadata.width <= width) continue;

    const avifPath = path.join(outputBaseDir, `${parsed.name}-${width}w.avif`);
    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: QUALITY.avif })
      .toFile(avifPath);
  }

  // Generate optimized original format (for fallback)
  const originalExt = isTransparent ? 'png' : 'jpeg';
  const originalPath = path.join(outputBaseDir, `${parsed.name}.${originalExt}`);
  await image
    .clone()
    .resize({ width: 1200, withoutEnlargement: true })
    [originalExt]({ quality: QUALITY[originalExt as keyof typeof QUALITY] })
    .toFile(originalPath);

  // Generate thumbnail (200w)
  const thumbPath = path.join(outputBaseDir, `${parsed.name}-thumb.webp`);
  await image
    .clone()
    .resize({ width: 200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  console.log(`  ✓ ${relativePath} (${metadata.width}x${metadata.height})`);
}

async function walkDir(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath, files);
    } else if (/\.(jpe?g|png|gif|webp|avif|tiff?)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main(): Promise<void> {
  console.log('🖼️  Optimizing product images...');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    console.log('Create src/assets/products/ and add your product images there.');
    process.exit(1);
  }

  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });

  const files = await walkDir(SOURCE_DIR);
  console.log(`📁 Found ${files.length} image(s) to optimize`);

  let processed = 0;
  let failed = 0;

  for (const file of files) {
    const relativePath = path.relative(SOURCE_DIR, file);
    try {
      await optimizeImage(file, relativePath);
      processed++;
    } catch (err) {
      console.error(`  ✗ Failed: ${relativePath}`, err);
      failed++;
    }
  }

  console.log(`\n✅ Optimized ${processed} image(s)`);
  if (failed > 0) console.log(`❌ Failed: ${failed}`);

  // Generate manifest
  const manifest = {
    generated: new Date().toISOString(),
    source: SOURCE_DIR,
    output: OUTPUT_DIR,
    widths: RESPONSIVE_WIDTHS,
    formats: ['webp', 'avif', 'jpeg', 'png'],
    files: files.map(f => path.relative(SOURCE_DIR, f))
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`📋 Manifest written to ${path.join(OUTPUT_DIR, 'manifest.json')}`);
}

main().catch(err => {
  console.error('❌ Image optimization failed:', err);
  process.exit(1);
});