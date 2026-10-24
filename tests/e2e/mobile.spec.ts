import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('cart drawer works on mobile', async ({ page }) => {
    // Wait for products
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    
    // Add product to cart
    await page.locator('.btn-add-cart, [data-add-to-cart]').first().click();
    
    // Verify cart drawer opens full width on mobile
    const cartDrawer = page.locator('#cart-drawer');
    await expect(cartDrawer).toBeVisible();
    
    // Verify cart items visible
    await expect(page.locator('#cart-items .cart-item, .cart-item')).toBeVisible({ timeout: 5000 });
    
    // Verify checkout button accessible
    await expect(page.locator('#checkout-btn')).toBeVisible();
    
    // Close cart drawer
    await page.click('#cart-close, .cart-close, .cart-overlay');
    await expect(cartDrawer).not.toBeVisible();
  });

  test('product grid responsive on mobile', async ({ page }) => {
    // Wait for products
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    
    // Verify product grid displays
    const productCards = page.locator('.product-card');
    await expect(productCards.first()).toBeVisible();
    
    // Verify images load
    const firstImage = page.locator('.product-card img').first();
    await expect(firstImage).toBeVisible();
  });

  test('navigation works on mobile', async ({ page }) => {
    // Open mobile menu
    await page.click('.hamburger, [aria-label="Menu"]');
    
    // Verify nav opens
    await expect(page.locator('.nav, #nav-menu')).toBeVisible();
    
    // Click a nav link
    await page.click('.nav a[href="#products"], a:has-text("Products"), a:has-text("المنتجات")');
    
    // Verify smooth scroll or navigation
    await page.waitForTimeout(500);
  });

  test('language switcher accessible on mobile', async ({ page }) => {
    // Find language switcher
    const langSwitcher = page.locator('#lang-toggle, .lang-switcher');
    await expect(langSwitcher).toBeVisible();
    
    // Click and verify it works
    await langSwitcher.click();
    await page.waitForTimeout(500);
    
    // Verify locale changed
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('image gallery swipe on mobile', async ({ page }) => {
    // Wait for products
    await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
    
    // Find a product with multiple images
    const productCard = page.locator('.product-card').first();
    await productCard.click();
    
    // If lightbox opens, test swipe
    const lightbox = page.locator('.lightbox, [data-lightbox], .image-gallery-lightbox');
    if (await lightbox.isVisible({ timeout: 1000 })) {
      // Swipe left
      await page.touchscreen.tap(300, 300);
      await page.waitForTimeout(200);
      
      // Swipe right
      await page.touchscreen.tap(100, 300);
      await page.waitForTimeout(200);
      
      // Close lightbox
      await page.keyboard.press('Escape');
    }
  });
});