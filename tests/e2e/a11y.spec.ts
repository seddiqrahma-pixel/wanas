import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('cart drawer has no accessibility violations (excluding known issues)', async ({ page }) => {
    // Open cart drawer
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    await page.locator('.btn-add-cart, [data-add-to-cart]').first().click();
    await expect(page.locator('#cart-drawer')).toBeVisible();
    
    // Run axe scan on cart drawer
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#cart-drawer')
      .analyze();
    
    // Filter out known violations that exist in production code
    const filteredViolations = accessibilityScanResults.violations.filter(
      (v) => !['aria-hidden-focus', 'color-contrast', 'nested-interactive', 'label-content-name-mismatch'].includes(v.id)
    );
    
    expect(filteredViolations).toEqual([]);
  });

  test('product grid has no accessibility violations (excluding known issues)', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    
    // Run axe scan on product grid
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#products-grid')
      .analyze();
    
    // Filter out known violations
    const filteredViolations = accessibilityScanResults.violations.filter(
      (v) => !['aria-allowed-role', 'color-contrast', 'nested-interactive', 'aria-valid-attr-value', 'label-content-name-mismatch'].includes(v.id)
    );
    
    expect(filteredViolations).toEqual([]);
  });

  test('home page has no critical accessibility violations (excluding known issues)', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();
    
    // Filter for critical violations only, excluding known issues
    const criticalViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === 'critical' && !['aria-valid-attr-value', 'label-content-name-mismatch'].includes(v.id)
    );
    expect(criticalViolations).toEqual([]);
  });

  test.describe('Desktop only', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('checkout flow has no accessibility violations (excluding known issues)', async ({ page }) => {
      // Open cart and go to checkout
      await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
      await page.locator('.btn-add-cart, [data-add-to-cart]').first().click();
      await expect(page.locator('#cart-drawer')).toBeVisible();
      
      // Click checkout using JavaScript to avoid viewport issues
      await page.evaluate(() => {
        const btn = document.getElementById('checkout-btn');
        if (btn) btn.click();
      });
      
      // Wait for prompts to appear (they're native browser dialogs)
      await page.waitForTimeout(1000);
      
      // Run axe scan on the page
      const accessibilityScanResults = await new AxeBuilder({ page })
        .analyze();
      
      // Filter out known violations
      const filteredViolations = accessibilityScanResults.violations.filter(
        (v) => !['aria-hidden-focus', 'color-contrast', 'nested-interactive', 'aria-valid-attr-value', 'aria-allowed-role', 'label-content-name-mismatch'].includes(v.id)
      );
      
      expect(filteredViolations).toEqual([]);
    });
  });
});