import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ImageGallery', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates single image wrapper for single image', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp'],
      altTexts: ['Product image'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    expect(gallery.classList.contains('single-image')).toBe(true);
    expect(gallery.querySelector('.gallery-main-image')).not.toBeNull();
    expect(gallery.querySelector('.gallery-thumbnails')).toBeNull();
  });

  it('creates full gallery for multiple images', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp', 'image3.webp'],
      altTexts: ['Image 1', 'Image 2', 'Image 3'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    expect(gallery.classList.contains('image-gallery')).toBe(true);
    expect(gallery.querySelector('.gallery-main')).not.toBeNull();
    expect(gallery.querySelector('.gallery-thumbnails')).not.toBeNull();
    expect(gallery.querySelectorAll('.gallery-thumb').length).toBe(3);
    expect(gallery.querySelector('.gallery-counter')).not.toBeNull();
  });

  it('switches main image when thumbnail clicked', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp'],
      altTexts: ['Image 1', 'Image 2'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const mainImage = gallery.querySelector('.gallery-main-image') as HTMLImageElement;
    expect(mainImage.src).toContain('image1.webp');

    const secondThumb = gallery.querySelectorAll('.gallery-thumb')[1] as HTMLElement;
    secondThumb.click();

    expect(mainImage.src).toContain('image2.webp');
    expect(mainImage.dataset.index).toBe('1');
  });

  it('updates active thumbnail state on switch', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp', 'image3.webp'],
      altTexts: ['Image 1', 'Image 2', 'Image 3'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const thumbs = gallery.querySelectorAll('.gallery-thumb');
    expect(thumbs[0].classList.contains('active')).toBe(true);
    expect(thumbs[1].classList.contains('active')).toBe(false);

    (thumbs[2] as HTMLElement).click();

    expect(thumbs[0].classList.contains('active')).toBe(false);
    expect(thumbs[2].classList.contains('active')).toBe(true);
  });

  it('updates counter on image switch', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp'],
      altTexts: ['Image 1', 'Image 2'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const counter = gallery.querySelector('.gallery-counter') as HTMLElement;
    expect(counter.textContent).toBe('1 / 2');

    (gallery.querySelectorAll('.gallery-thumb')[1] as HTMLElement).click();

    expect(counter.textContent).toBe('2 / 2');
  });

  it('handles keyboard navigation on main image', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp', 'image3.webp'],
      altTexts: ['Image 1', 'Image 2', 'Image 3'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const mainContainer = gallery.querySelector('.gallery-main') as HTMLElement;

    // ArrowRight should advance
    mainContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect((gallery.querySelector('.gallery-main-image') as HTMLImageElement)?.dataset.index).toBe('1');

    // ArrowRight again
    mainContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect((gallery.querySelector('.gallery-main-image') as HTMLImageElement)?.dataset.index).toBe('2');

    // ArrowLeft should go back
    mainContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect((gallery.querySelector('.gallery-main-image') as HTMLImageElement)?.dataset.index).toBe('1');

    // Home should go to first
    mainContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect((gallery.querySelector('.gallery-main-image') as HTMLImageElement)?.dataset.index).toBe('0');

    // End should go to last
    mainContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect((gallery.querySelector('.gallery-main-image') as HTMLImageElement)?.dataset.index).toBe('2');
  });

  it('handles keyboard navigation on thumbnails', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp', 'image3.webp'],
      altTexts: ['Image 1', 'Image 2', 'Image 3'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const thumbs = gallery.querySelectorAll('.gallery-thumb');
    const secondThumb = thumbs[1] as HTMLElement;
    secondThumb.focus();

    // ArrowRight should advance
    secondThumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect((gallery.querySelector('.gallery-main-image') as HTMLImageElement)?.dataset.index).toBe('2');

    // ArrowLeft should go back
    secondThumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect((gallery.querySelector('.gallery-main-image') as HTMLImageElement)?.dataset.index).toBe('0');
  });

  it('opens lightbox on main image click', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp'],
      altTexts: ['Image 1', 'Image 2'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const mainContainer = gallery.querySelector('.gallery-main') as HTMLElement;
    mainContainer.click();

    const lightbox = document.querySelector('.lightbox-overlay');
    expect(lightbox).not.toBeNull();
    expect(lightbox?.getAttribute('aria-modal')).toBe('true');
  });

  it('opens lightbox on Enter key', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp'],
      altTexts: ['Image 1', 'Image 2'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const mainContainer = gallery.querySelector('.gallery-main') as HTMLElement;
    mainContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    const lightbox = document.querySelector('.lightbox-overlay');
    expect(lightbox).not.toBeNull();
  });

  it('closes lightbox on Escape key', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp'],
      altTexts: ['Image 1', 'Image 2'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const mainContainer = gallery.querySelector('.gallery-main') as HTMLElement;
    mainContainer.click();

    const lightbox = document.querySelector('.lightbox-overlay') as HTMLElement;
    lightbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(document.querySelector('.lightbox-overlay')).toBeNull();
  });

  it('navigates lightbox with arrow keys', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp', 'image3.webp'],
      altTexts: ['Image 1', 'Image 2', 'Image 3'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const mainContainer = gallery.querySelector('.gallery-main') as HTMLElement;
    mainContainer.click();

    const lightbox = document.querySelector('.lightbox-overlay') as HTMLElement;
    const mainImage = lightbox.querySelector('.lightbox-main-image') as HTMLImageElement;

    expect(mainImage.src).toContain('image1.webp');

    lightbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(mainImage.src).toContain('image2.webp');

    lightbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(mainImage.src).toContain('image3.webp');

    lightbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(mainImage.src).toContain('image2.webp');
  });

  it('has proper ARIA attributes', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp'],
      altTexts: ['Image 1', 'Image 2'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    expect(gallery.getAttribute('role')).toBe('region');
    expect(gallery.getAttribute('aria-label')).toContain('Test Product');

    const mainContainer = gallery.querySelector('.gallery-main');
    expect(mainContainer?.getAttribute('role')).toBe('img');
    expect(mainContainer?.getAttribute('aria-roledescription')).toBe('image gallery');

    const thumbsContainer = gallery.querySelector('.gallery-thumbnails');
    expect(thumbsContainer?.getAttribute('role')).toBe('tablist');

    const thumbs = gallery.querySelectorAll('.gallery-thumb');
    expect(thumbs[0].getAttribute('role')).toBe('tab');
    expect(thumbs[0].getAttribute('aria-selected')).toBe('true');
    expect(thumbs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('supports RTL direction', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    document.documentElement.dir = 'rtl';

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp'],
      altTexts: ['Image 1', 'Image 2'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    // Component should render without errors in RTL mode
    expect(gallery.querySelector('.gallery-nav-prev')).not.toBeNull();
    expect(gallery.querySelector('.gallery-nav-next')).not.toBeNull();

    document.documentElement.dir = 'ltr';
  });

  it('lazy loads thumbnail images', async () => {
    const { createImageGallery } = await import('../../src/components/ImageGallery');

    const container = document.createElement('div');
    const gallery = createImageGallery({
      images: ['image1.webp', 'image2.webp', 'image3.webp'],
      altTexts: ['Image 1', 'Image 2', 'Image 3'],
      productId: 'test-1',
      productName: 'Test Product',
      container
    });

    const thumbImages = gallery.querySelectorAll('.gallery-thumb img');
    thumbImages.forEach(img => {
      expect((img as HTMLImageElement).loading).toBe('lazy');
    });
  });
});