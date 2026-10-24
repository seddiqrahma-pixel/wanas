import { test, expect } from '@playwright/test';

test.describe('Happy Path Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Home → Product grid → Filter category → Add to cart → Cart drawer', async ({ page }) => {
    // Verify home page loads (accept either locale)
    await expect(page.locator('.logo-text').first()).toBeVisible();
    
    // Wait for products to load
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    
    // Filter by category
    const categoryBtn = page.locator('.filter-btn[data-category="candles"]');
    if (await categoryBtn.count() > 0) {
      await categoryBtn.click();
      await page.waitForTimeout(500);
    }
    
    // Add first product to cart
    const firstAddBtn = page.locator('.btn-add-cart, [data-add-to-cart]').first();
    await expect(firstAddBtn).toBeVisible({ timeout: 10000 });
    await firstAddBtn.click();
    
    // Wait for cart drawer to open
    await expect(page.locator('#cart-drawer')).toBeVisible({ timeout: 5000 });
    
    // Verify item in cart
    await expect(page.locator('#cart-items .cart-item, .cart-item')).toBeVisible({ timeout: 5000 });
    
    // Verify checkout button is visible
    await expect(page.locator('#checkout-btn')).toBeVisible();
  });

  test('Add multiple items to cart', async ({ page }) => {
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    
    // Add first product
    await page.locator('.btn-add-cart, [data-add-to-cart]').first().click();
    await expect(page.locator('#cart-drawer')).toBeVisible();
    
    // Add second product (cart drawer stays open)
    await page.locator('.btn-add-cart, [data-add-to-cart]').nth(1).click();
    
    // Verify cart has 2 items
    const cartItems = page.locator('#cart-items .cart-item, .cart-item');
    await expect(cartItems).toHaveCount(2);
  });
});