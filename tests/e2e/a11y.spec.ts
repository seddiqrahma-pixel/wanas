import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('cart drawer has no accessibility violations', async ({ page }) => {
    // Open cart drawer
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    await page.locator('.btn-add-cart, [data-add-to-cart]').first().click();
    await expect(page.locator('#cart-drawer')).toBeVisible();
    
    // Run axe scan on cart drawer
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#cart-drawer')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('product grid has no accessibility violations', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    
    // Run axe scan on product grid
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#products-grid')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('home page has no critical accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();
    
    // Filter for critical violations only
    const criticalViolations = accessibilityScanResults.violations.filter((v) => v.impact === 'critical');
    expect(criticalViolations).toEqual([]);
  });

  test('checkout flow has no accessibility violations', async ({ page }) => {
    // Open cart and go to checkout
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    await page.locator('.btn-add-cart, [data-add-to-cart]').first().click();
    await expect(page.locator('#cart-drawer')).toBeVisible();
    await page.click('#checkout-btn');
    
    // Wait for checkout modal or WhatsApp link
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});