# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile.spec.ts >> Mobile Viewport (375px) >> cart drawer works on mobile
- Location: tests/e2e/mobile.spec.ts:11:3

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  locator('#cart-drawer')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" locator('#cart-drawer') with timeout 5000ms
  - waiting for locator('#cart-drawer')
    13 × locator resolved to <aside role="dialog" id="cart-drawer" aria-hidden="true" class="cart-drawer" aria-label="سلة التسوق">…</aside>
       - unexpected value "visible"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "الانتقال للمحتوى الرئيسي" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - button "قائمة التنقل" [ref=e5] [cursor=pointer]
      - link "وَنَس - الصفحة الرئيسية" [ref=e9] [cursor=pointer]:
        - /url: /
        - generic [ref=e10]: Wanas
      - navigation "القائمة الرئيسية" [ref=e11]:
        - list [ref=e12]:
          - listitem [ref=e13]:
            - link "Products" [ref=e14] [cursor=pointer]:
              - /url: "#products"
          - listitem [ref=e15]:
            - link "About Wanas" [ref=e16] [cursor=pointer]:
              - /url: "#about"
          - listitem [ref=e17]:
            - link "Contact" [ref=e18] [cursor=pointer]:
              - /url: "#contact"
      - generic [ref=e19]:
        - button "التحول للعربية" [ref=e20] [cursor=pointer]:
          - generic [ref=e21]: EN
        - button "السلة" [ref=e22] [cursor=pointer]:
          - generic [ref=e27]: "1"
  - main [ref=e28]:
    - region [ref=e29]:
      - generic [ref=e30]:
        - heading "Candles that give you the warmth of the sun" [level=1] [ref=e31]
        - paragraph [ref=e32]: Handmade candles & home fragrances from Sohag, Upper Egypt
        - link "Discover Products" [ref=e33] [cursor=pointer]:
          - /url: "#products"
    - region [ref=e34]:
      - generic [ref=e35]:
        - generic [ref=e36]:
          - heading "Our Products" [level=2] [ref=e37]
          - paragraph [ref=e38]: Handmade with love in Sohag
        - tablist "تصنيف المنتجات" [ref=e39]:
          - tab "All" [selected] [ref=e40] [cursor=pointer]
          - tab "Candles" [ref=e41] [cursor=pointer]
          - tab "Gifts & Flowers" [ref=e42] [cursor=pointer]
          - tab "Home Fragrance" [ref=e43] [cursor=pointer]
        - list "قائمة المنتجات" [ref=e44]:
          - listitem [ref=e45]:
            - region "Wanas Amber image gallery" [ref=e47]:
              - img "Main image of Wanas Amber" [ref=e48]:
                - img "Wanas Amber - Image 1 of 4" [ref=e49]
                - button "Previous image" [ref=e50] [cursor=pointer]
                - button "Next image" [ref=e53] [cursor=pointer]
              - tablist "Image thumbnails" [ref=e56]:
                - tab "Image 1 of 4" [selected] [ref=e57] [cursor=pointer]
                - tab "Image 2 of 4" [ref=e58] [cursor=pointer]
                - tab "Image 3 of 4" [ref=e59] [cursor=pointer]
                - tab "Image 4 of 4" [ref=e60] [cursor=pointer]
              - generic: 1 / 4
            - generic [ref=e61]: Featured
            - generic [ref=e62]:
              - text: categories.candles
              - heading "Wanas Amber" [level=3] [ref=e63]
              - paragraph [ref=e64]: Glass jar soy candle with dried orange — warm premium amber fragrance
              - generic [ref=e65]:
                - generic [ref=e66]: EGP 216
                - 'button "Add to Cart: Wanas Amber" [ref=e67] [cursor=pointer]': Add to Cart
          - listitem [ref=e68]:
            - region "Wanas Rose image gallery" [ref=e70]:
              - img "Main image of Wanas Rose" [ref=e71]:
                - img "Wanas Rose - Image 1 of 4" [ref=e72]
                - button "Previous image" [ref=e73] [cursor=pointer]
                - button "Next image" [ref=e76] [cursor=pointer]
              - tablist "Image thumbnails" [ref=e79]:
                - tab "Image 1 of 4" [selected] [ref=e80] [cursor=pointer]
                - tab "Image 2 of 4" [ref=e81] [cursor=pointer]
                - tab "Image 3 of 4" [ref=e82] [cursor=pointer]
                - tab "Image 4 of 4" [ref=e83] [cursor=pointer]
              - generic: 1 / 4
            - generic [ref=e84]: Featured
            - generic [ref=e85]:
              - text: categories.candles
              - heading "Wanas Rose" [level=3] [ref=e86]
              - paragraph [ref=e87]: Hand-carved red rose candle — decorative luxury fragrance piece
              - generic [ref=e88]:
                - generic [ref=e89]: EGP 220
                - 'button "Add to Cart: Wanas Rose" [ref=e90] [cursor=pointer]': Add to Cart
          - listitem [ref=e91]:
            - img "Wanas Cloud - Image 1 of 1" [ref=e94]
            - generic [ref=e95]:
              - text: categories.candles
              - heading "Wanas Cloud" [level=3] [ref=e96]
              - paragraph [ref=e97]: Cloud-shaped candle with cute design — perfect for aesthetic decor lovers
              - generic [ref=e98]:
                - generic [ref=e99]: EGP 200
                - 'button "Add to Cart: Wanas Cloud" [ref=e100] [cursor=pointer]': Add to Cart
          - listitem [ref=e101]:
            - img "Wanas Perfume (4-Wick) - Image 1 of 1" [ref=e104]
            - generic [ref=e105]: Featured
            - generic [ref=e106]:
              - text: categories.candles
              - heading "Wanas Perfume (4-Wick)" [level=3] [ref=e107]
              - paragraph [ref=e108]: Large 4-wick glass jar candle — strong scent throw for spacious rooms, Wanas Perfume label
              - generic [ref=e109]:
                - generic [ref=e110]: EGP 400
                - 'button "Add to Cart: Wanas Perfume (4-Wick)" [ref=e111] [cursor=pointer]': Add to Cart
          - listitem [ref=e112]:
            - region "Wanas Pink Bouquet image gallery" [ref=e114]:
              - img "Main image of Wanas Pink Bouquet" [ref=e115]:
                - img "Wanas Pink Bouquet - Image 1 of 3" [ref=e116]
                - button "Previous image" [ref=e117] [cursor=pointer]
                - button "Next image" [ref=e120] [cursor=pointer]
              - tablist "Image thumbnails" [ref=e123]:
                - tab "Image 1 of 3" [selected] [ref=e124] [cursor=pointer]
                - tab "Image 2 of 3" [ref=e125] [cursor=pointer]
                - tab "Image 3 of 3" [ref=e126] [cursor=pointer]
              - generic: 1 / 3
            - generic [ref=e127]: Featured
            - generic [ref=e128]:
              - text: categories.gifts
              - heading "Wanas Pink Bouquet" [level=3] [ref=e129]
              - paragraph [ref=e130]: Bouquet of 7 roses (soap/wax) wrapped in pink paper with ribbon — luxury floral gift for occasions
              - generic [ref=e131]:
                - generic [ref=e132]: EGP 338
                - 'button "Add to Cart: Wanas Pink Bouquet" [ref=e133] [cursor=pointer]': Add to Cart
          - listitem [ref=e134]:
            - img "Wanas Gift Box - Image 1 of 1" [ref=e137]
            - generic [ref=e138]: Featured
            - generic [ref=e139]:
              - text: categories.gifts
              - heading "Wanas Gift Box" [level=3] [ref=e140]
              - paragraph [ref=e141]: Complete gift box wrapped in champagne ribbon — curated selection for special occasions
              - generic [ref=e142]:
                - generic [ref=e143]: EGP 475
                - 'button "Add to Cart: Wanas Gift Box" [ref=e144] [cursor=pointer]': Add to Cart
          - listitem [ref=e145]:
            - img "Soap Rose - Image 1 of 1" [ref=e148]
            - generic [ref=e149]:
              - text: categories.gifts
              - heading "Soap Rose" [level=3] [ref=e150]
              - paragraph [ref=e151]: Red rose-shaped soaps with herbs — practical gift combining beauty and daily use
              - generic [ref=e152]:
                - generic [ref=e153]: EGP 113
                - 'button "Add to Cart: Soap Rose" [ref=e154] [cursor=pointer]': Add to Cart
          - listitem [ref=e155]:
            - img "Wanas Fragrance Oil - Image 1 of 1" [ref=e158]
            - generic [ref=e159]: Featured
            - generic [ref=e160]:
              - text: categories.fragrance
              - heading "Wanas Fragrance Oil" [level=3] [ref=e161]
              - paragraph [ref=e162]: Premium 30ml home fragrance oil — concentrated long-lasting scents for home and office
              - generic [ref=e163]:
                - generic [ref=e164]: EGP 207
                - 'button "Add to Cart: Wanas Fragrance Oil" [ref=e165] [cursor=pointer]': Add to Cart
          - listitem [ref=e166]:
            - img "Wanas Bakhoor - Image 1 of 1" [ref=e169]
            - generic [ref=e170]:
              - text: categories.fragrance
              - heading "Wanas Bakhoor" [level=3] [ref=e171]
              - paragraph [ref=e172]: Traditional home bakhoor blend — authentic oriental scents for hospitality and relaxation
              - generic [ref=e173]:
                - generic [ref=e174]: EGP 162
                - 'button "Add to Cart: Wanas Bakhoor" [ref=e175] [cursor=pointer]': Add to Cart
    - region [ref=e176]:
      - generic [ref=e177]:
        - heading "About Wanas" [level=2] [ref=e178]
        - generic [ref=e179]:
          - article [ref=e180]:
            - heading "Handmade" [level=3] [ref=e181]
            - paragraph [ref=e182]: Every piece is handcrafted in our Sohag workshop using natural soy wax and premium fragrance oils.
          - article [ref=e183]:
            - heading "100% Natural" [level=3] [ref=e184]
            - paragraph [ref=e185]: No parabens, no toxins, eco-friendly and safe for your family.
          - article [ref=e186]:
            - heading "Gift Service" [level=3] [ref=e187]
            - paragraph [ref=e188]: Free "Anas Mink" service — we handwrite gift notes with every order.
    - region [ref=e189]:
      - generic [ref=e190]:
        - heading "Contact Us" [level=2] [ref=e191]
        - generic [ref=e192]:
          - generic [ref=e193]:
            - heading "WhatsApp for Orders" [level=3] [ref=e194]
            - link "01020306395" [ref=e195] [cursor=pointer]:
              - /url: https://wa.me/201020306395
            - paragraph [ref=e199]: Available daily 10am–10pm
          - generic [ref=e200]:
            - heading "Email" [level=3] [ref=e201]
            - link "ahmed.alghoraib@gmail.com" [ref=e202] [cursor=pointer]:
              - /url: mailto:ahmed.alghoraib@gmail.com
          - generic [ref=e207]:
            - heading "Location" [level=3] [ref=e208]
            - paragraph [ref=e209]: Sohag, Upper Egypt
  - contentinfo [ref=e210]:
    - generic [ref=e211]:
      - generic [ref=e212]:
        - generic [ref=e213]:
          - link "وَنَس" [ref=e214] [cursor=pointer]:
            - /url: /
            - generic [ref=e215]: Wanas
          - paragraph [ref=e216]: Candles that give you the warmth of the sun 🕯️🧡
        - navigation "روابط سريعة" [ref=e217]:
          - heading "Quick Links" [level=4] [ref=e218]
          - list [ref=e219]:
            - listitem [ref=e220]:
              - link "Products" [ref=e221] [cursor=pointer]:
                - /url: "#products"
            - listitem [ref=e222]:
              - link "About Wanas" [ref=e223] [cursor=pointer]:
                - /url: "#about"
            - listitem [ref=e224]:
              - link "Contact" [ref=e225] [cursor=pointer]:
                - /url: "#contact"
        - generic [ref=e226]:
          - heading "Payment Methods" [level=4] [ref=e227]
          - list [ref=e228]:
            - listitem [ref=e229]:
              - generic [ref=e230]: Vodafone Cash
            - listitem [ref=e231]:
              - generic [ref=e232]: InstaPay
            - listitem [ref=e233]:
              - generic [ref=e234]: Bank Transfer (NBE)
            - listitem [ref=e235]:
              - generic [ref=e236]: WhatsApp Order
      - generic [ref=e237]:
        - paragraph [ref=e238]: © 2026 Wanas. All rights reserved.
        - paragraph [ref=e239]: Sohag, Upper Egypt
  - dialog [aria-hidden] [ref=e240]:
    - generic [ref=e241]:
      - banner [ref=e242]:
        - heading [level=2] [ref=e243]: Shopping Cart
        - button [ref=e244] [cursor=pointer]: ×
      - list [ref=e245]:
        - generic [ref=e249]:
          - generic [ref=e250]: Wanas Amber
          - generic [ref=e251]: EGP 216 × 1
          - generic [ref=e252]:
            - button [ref=e253] [cursor=pointer]: −
            - generic [ref=e254]: "1"
            - button [ref=e255] [cursor=pointer]: +
          - button [ref=e256] [cursor=pointer]: Remove
      - contentinfo [ref=e257]:
        - generic [ref=e258]:
          - generic [ref=e259]: Subtotal
          - generic [ref=e260]: EGP 216
        - button [ref=e261] [cursor=pointer]: Checkout via WhatsApp
        - paragraph [ref=e262]: You'll be redirected to WhatsApp to confirm order & payment
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Mobile Viewport (375px)', () => {
  4   |   test.use({ viewport: { width: 375, height: 667 } });
  5   | 
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await page.goto('/');
  8   |     await page.waitForLoadState('networkidle');
  9   |   });
  10  | 
  11  |   test('cart drawer works on mobile', async ({ page }) => {
  12  |     // Wait for products
  13  |     await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
  14  |     
  15  |     // Add product to cart
  16  |     await page.locator('.btn-add-cart, [data-add-to-cart]').first().click();
  17  |     
  18  |     // Verify cart drawer opens full width on mobile (is visible)
  19  |     const cartDrawer = page.locator('#cart-drawer');
  20  |     await expect(cartDrawer).toBeVisible({ timeout: 5000 });
  21  |     
  22  |     // Verify cart items visible
  23  |     await expect(page.locator('#cart-items .cart-item, .cart-item')).toBeVisible({ timeout: 5000 });
  24  |     
  25  |     // Verify checkout button accessible
  26  |     await expect(page.locator('#checkout-btn')).toBeVisible();
  27  |     
  28  |     // Close cart drawer by removing open class directly (matches closeCart implementation)
  29  |     await page.evaluate(() => {
  30  |       const cartDrawer = document.getElementById('cart-drawer');
  31  |       const cartOverlay = document.getElementById('cart-overlay');
  32  |       if (cartDrawer) cartDrawer.classList.remove('open');
  33  |       if (cartOverlay) cartOverlay.classList.remove('open');
  34  |       document.body.style.overflow = '';
  35  |     });
  36  |     
  37  |     // Verify cart drawer is no longer visible
> 38  |     await expect(cartDrawer).not.toBeVisible({ timeout: 5000 });
      |                                  ^ Error: expect(locator).not.toBeVisible() failed
  39  |   });
  40  | 
  41  |   test('product grid responsive on mobile', async ({ page }) => {
  42  |     // Wait for products
  43  |     await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
  44  |     
  45  |     // Verify product grid displays
  46  |     const productCards = page.locator('.product-card');
  47  |     await expect(productCards.first()).toBeVisible();
  48  |     
  49  |     // Verify images load
  50  |     const firstImage = page.locator('.product-card img').first();
  51  |     await expect(firstImage).toBeVisible();
  52  |   });
  53  | 
  54  |   test('navigation works on mobile', async ({ page }) => {
  55  |     // Open mobile menu
  56  |     await page.click('.hamburger');
  57  |     
  58  |     // Verify nav opens
  59  |     await expect(page.locator('#nav-menu')).toBeVisible({ timeout: 5000 });
  60  |     
  61  |     // Click a nav link - scroll into view first
  62  |     const productsLink = page.locator('#nav-menu a[href="#products"]');
  63  |     await productsLink.scrollIntoViewIfNeeded();
  64  |     await productsLink.click({ force: true });
  65  |     
  66  |     // Verify smooth scroll or navigation
  67  |     await page.waitForTimeout(500);
  68  |   });
  69  | 
  70  |   test('language switcher accessible on mobile', async ({ page }) => {
  71  |     // Find language switcher
  72  |     const langSwitcher = page.locator('#lang-toggle');
  73  |     await expect(langSwitcher).toBeVisible();
  74  |     
  75  |     // Get initial locale
  76  |     const initialLocale = await page.getAttribute('html', 'lang');
  77  |     
  78  |     // Click and verify it works
  79  |     await langSwitcher.click();
  80  |     await page.waitForTimeout(500);
  81  |     
  82  |     // Verify locale changed
  83  |     const newLocale = await page.getAttribute('html', 'lang');
  84  |     expect(newLocale).not.toBe(initialLocale);
  85  |   });
  86  | 
  87  |   test('image gallery swipe on mobile', async ({ page }) => {
  88  |     // Wait for products
  89  |     await page.waitForSelector('#products-grid .product-card', { timeout: 10000 });
  90  |     
  91  |     // Find a product with multiple images - click on product card image using force
  92  |     const productCard = page.locator('.product-card').first();
  93  |     await productCard.locator('img').first().click({ force: true });
  94  |     
  95  |     // If lightbox opens, test navigation
  96  |     const lightbox = page.locator('.lightbox, [data-lightbox], .image-gallery-lightbox');
  97  |     if (await lightbox.isVisible({ timeout: 1000 })) {
  98  |       // Test keyboard navigation instead of touch (more reliable in headless)
  99  |       await page.keyboard.press('ArrowRight');
  100 |       await page.waitForTimeout(200);
  101 |       await page.keyboard.press('ArrowLeft');
  102 |       await page.waitForTimeout(200);
  103 |       
  104 |       // Close lightbox
  105 |       await page.keyboard.press('Escape');
  106 |     }
  107 |   });
  108 | });
```