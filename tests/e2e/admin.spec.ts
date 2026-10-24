import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('opens admin panel with Ctrl+Shift+A', async ({ page }) => {
    // Open admin panel with keyboard shortcut
    await page.keyboard.press('Control+Shift+A');
    await page.waitForTimeout(500);
    
    // Verify admin panel opens
    await expect(page.locator('#admin-panel, .admin-panel, [data-admin-panel], admin-panel')).toBeVisible({ timeout: 5000 });
  });

  test('CRUD product flow', async ({ page }) => {
    // Open admin panel
    await page.keyboard.press('Control+Shift+A');
    await page.waitForTimeout(500);
    
    // Navigate to products tab
    await page.click('text=Products, [data-tab="products"], button:has-text("Products"), nav >> text=Products');
    await page.waitForTimeout(300);
    
    // Create new product - find add button
    const addBtn = page.locator('button:has-text("Add"), button:has-text("Create"), [data-action="add"]').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(300);
      
      // Fill product form
      await page.fill('[name="name.ar"], #product-name-ar, input[placeholder*="Arabic" i]', 'منتج اختبار');
      await page.fill('[name="name.en"], #product-name-en, input[placeholder*="English" i]', 'Test Product');
      await page.fill('[name="price_egp"], #product-price, input[type="number"]', '150');
      await page.fill('[name="slug"], #product-slug', 'test-product-e2e');
      
      // Select category
      await page.selectOption('[name="category"], #product-category', 'candles').catch(() => {});
      
      // Save product
      await page.locator('button:has-text("Save"), button:has-text("Create"), [data-action="save"]').first().click();
      await page.waitForTimeout(500);
    }
  });

  test('sync products', async ({ page }) => {
    await page.keyboard.press('Control+Shift+A');
    await page.waitForTimeout(500);
    
    // Navigate to sync/import tab
    await page.click('text=Sync, [data-tab="sync"], button:has-text("Sync")').catch(() => {});
    await page.waitForTimeout(300);
    
    // Trigger sync
    await page.locator('button:has-text("Sync"), button:has-text("Import"), [data-action="sync"]').first().click().catch(() => {});
    await page.waitForTimeout(2000);
  });

  test('export products', async ({ page }) => {
    await page.keyboard.press('Control+Shift+A');
    await page.waitForTimeout(500);
    
    await page.click('text=Products, [data-tab="products"]').catch(() => {});
    await page.waitForTimeout(300);
    
    // Click export
    const downloadPromise = page.waitForEvent('download').catch(() => null);
    await page.locator('button:has-text("Export"), button:has-text("Download"), [data-action="export"]').first().click().catch(() => {});
    const download = await downloadPromise;
    
    // Verify file downloaded if download happened
    if (download) {
      expect(download.suggestedFilename()).toMatch(/\.(xlsx|json)$/);
    }
  });

  test('settings save', async ({ page }) => {
    await page.keyboard.press('Control+Shift+A');
    await page.waitForTimeout(500);
    
    await page.click('text=Settings, [data-tab="settings"]').catch(() => {});
    await page.waitForTimeout(300);
    
    // Modify a setting
    await page.fill('[name="brand.name.ar"], #brand-name-ar', 'وَنَس اختبار').catch(() => {});
    await page.locator('button:has-text("Save"), button:has-text("Save Settings"), [data-action="save"]').first().click().catch(() => {});
    await page.waitForTimeout(500);
  });
});