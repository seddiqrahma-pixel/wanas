// ==========================================================================
// Wanas — Image Gallery Component
// ==========================================================================

import { t, onLocaleChange } from '../scripts/i18n';

interface ImageGalleryOptions {
  images: string[];
  altTexts: string[];
  productId: string;
  productName: string;
  container: HTMLElement;
}

let unsubscribeLocale: (() => void) | null = null;
let lightboxInstance: LightboxController | null = null;

export function createImageGallery(options: ImageGalleryOptions): HTMLElement {
  const { images, altTexts, productId, productName, container } = options;

  if (images.length <= 1) {
    return createSingleImage(images[0], altTexts[0] || productName);
  }

  const gallery = document.createElement('div');
  gallery.className = 'image-gallery';
  gallery.dataset.productId = productId;
  gallery.setAttribute('role', 'region');
  gallery.setAttribute('aria-label', t('product.gallery_label', { product: productName }) || `${productName} image gallery`);

  // Main image area
  const mainImageContainer = document.createElement('div');
  mainImageContainer.className = 'gallery-main';
  mainImageContainer.setAttribute('role', 'img');
  mainImageContainer.setAttribute('aria-roledescription', 'image gallery');
  mainImageContainer.setAttribute('aria-label', t('product.gallery_main_label', { product: productName }) || `Main image of ${productName}`);

  const mainImage = document.createElement('img');
  mainImage.src = `/products/${images[0]}`;
  mainImage.alt = altTexts[0] || productName;
  mainImage.loading = 'lazy';
  mainImage.width = 400;
  mainImage.height = 400;
  mainImage.dataset.index = '0';
  mainImage.className = 'gallery-main-image';
  mainImageContainer.appendChild(mainImage);

  // Navigation arrows (desktop)
  const prevBtn = createNavButton('prev', t('product.gallery_prev') || 'Previous image');
  const nextBtn = createNavButton('next', t('product.gallery_next') || 'Next image');
  mainImageContainer.appendChild(prevBtn);
  mainImageContainer.appendChild(nextBtn);

  gallery.appendChild(mainImageContainer);

  // Thumbnail strip
  const thumbnailsContainer = document.createElement('div');
  thumbnailsContainer.className = 'gallery-thumbnails';
  thumbnailsContainer.setAttribute('role', 'tablist');
  thumbnailsContainer.setAttribute('aria-label', t('product.gallery_thumbs_label') || 'Image thumbnails');

  images.forEach((imageSrc, index) => {
    const thumb = document.createElement('button');
    thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
    thumb.type = 'button';
    thumb.setAttribute('role', 'tab');
    thumb.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    thumb.setAttribute('aria-label', t('product.gallery_thumb_label', { index: index + 1, total: images.length }) || `View image ${index + 1} of ${images.length}`);
    thumb.dataset.index = String(index);
    thumb.tabIndex = index === 0 ? 0 : -1;

    const thumbImg = document.createElement('img');
    thumbImg.src = `/products/${imageSrc}`;
    thumbImg.alt = '';
    thumbImg.loading = 'lazy';
    thumbImg.width = 80;
    thumbImg.height = 80;
    thumb.appendChild(thumbImg);

    thumb.addEventListener('click', () => switchImage(gallery, index));
    thumb.addEventListener('keydown', (e) => handleThumbKeydown(e, gallery, index, images.length));

    thumbnailsContainer.appendChild(thumb);
  });

  gallery.appendChild(thumbnailsContainer);

  // Counter (mobile)
  const counter = document.createElement('div');
  counter.className = 'gallery-counter';
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');
  counter.textContent = `${1} / ${images.length}`;
  gallery.appendChild(counter);

  // Touch swipe handling
  let touchStartX = 0;
  let touchEndX = 0;

  mainImageContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  mainImageContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(gallery, touchStartX, touchEndX, images.length);
  }, { passive: true });

  // Keyboard navigation
  mainImageContainer.addEventListener('keydown', (e) => handleMainKeydown(e, gallery, images.length));

  // Click to open lightbox
  mainImageContainer.addEventListener('click', (e) => {
    if (e.target === mainImageContainer || e.target === mainImage) {
      openLightbox(images, altTexts, productName, 0);
    }
  });

  // Cleanup locale listener on gallery removal
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.removedNodes) {
          if (node === gallery) {
            cleanup();
            break;
          }
        }
      }
    }
  });
  observer.observe(container, { childList: true, subtree: true });

  function cleanup() {
    unsubscribeLocale?.();
    observer.disconnect();
  }

  // Update counter when locale changes
  unsubscribeLocale = onLocaleChange(() => {
    updateGalleryTexts(gallery, images, productName);
  });

  return gallery;
}

function createSingleImage(src: string, alt: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'image-gallery single-image';

  const img = document.createElement('img');
  img.src = `/products/${src}`;
  img.alt = alt;
  img.loading = 'lazy';
  img.width = 400;
  img.height = 400;
  img.className = 'gallery-main-image';

  wrapper.appendChild(img);

  // Click to open lightbox even for single image
  wrapper.addEventListener('click', () => openLightbox([src], [alt], alt, 0));

  return wrapper;
}

function createNavButton(direction: 'prev' | 'next', ariaLabel: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `gallery-nav gallery-nav-${direction}`;
  btn.setAttribute('aria-label', ariaLabel);
  btn.innerHTML = direction === 'prev'
    ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>'
    : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';
  return btn;
}

function switchImage(gallery: HTMLElement, index: number): void {
  const mainImage = gallery.querySelector('.gallery-main-image') as HTMLImageElement;
  const thumbs = gallery.querySelectorAll('.gallery-thumb');
  const counter = gallery.querySelector('.gallery-counter') as HTMLElement;

  if (!mainImage) return;

  const images = Array.from(thumbs).map(t => (t.querySelector('img') as HTMLImageElement)?.src.replace('/products/', '') || '');
  const altTexts = Array.from(thumbs).map(t => (t.querySelector('img') as HTMLImageElement)?.alt || '');

  mainImage.src = `/products/${images[index]}`;
  mainImage.alt = altTexts[index] || '';
  mainImage.dataset.index = String(index);

  thumbs.forEach((thumb, i) => {
    const thumbEl = thumb as HTMLElement;
    thumbEl.classList.toggle('active', i === index);
    thumbEl.setAttribute('aria-selected', i === index ? 'true' : 'false');
    thumbEl.tabIndex = i === index ? 0 : -1;
  });

  if (counter) {
    counter.textContent = `${index + 1} / ${images.length}`;
  }
}

function handleSwipe(gallery: HTMLElement, startX: number, endX: number, totalImages: number): void {
  const diff = startX - endX;
  const threshold = 50;
  const mainImage = gallery.querySelector('.gallery-main-image') as HTMLImageElement;
  const currentIndex = parseInt(mainImage?.dataset.index || '0', 10);

  if (Math.abs(diff) > threshold) {
    const newIndex = diff > 0
      ? Math.min(currentIndex + 1, totalImages - 1)
      : Math.max(currentIndex - 1, 0);
    switchImage(gallery, newIndex);
  }
}

function handleMainKeydown(e: KeyboardEvent, gallery: HTMLElement, totalImages: number): void {
  const mainImage = gallery.querySelector('.gallery-main-image') as HTMLImageElement;
  const currentIndex = parseInt(mainImage?.dataset.index || '0', 10);
  let newIndex = currentIndex;

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      newIndex = Math.min(currentIndex + 1, totalImages - 1);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = totalImages - 1;
      break;
    case 'Enter':
    case ' ':
      {
        e.preventDefault();
        const images = Array.from(gallery.querySelectorAll('.gallery-thumb img')).map(img => (img as HTMLImageElement).src.replace('/products/', ''));
        const altTexts = Array.from(gallery.querySelectorAll('.gallery-thumb img')).map(img => (img as HTMLImageElement).alt);
        const productName = mainImage?.alt || '';
        openLightbox(images, altTexts, productName, currentIndex);
        return;
      }
    default:
      return;
  }

  if (newIndex !== currentIndex) {
    switchImage(gallery, newIndex);
  }
}

function handleThumbKeydown(e: KeyboardEvent, gallery: HTMLElement, index: number, total: number): void {
  let newIndex = index;
  const mainImage = gallery.querySelector('.gallery-main-image') as HTMLImageElement;

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault();
      newIndex = Math.min(index + 1, total - 1);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      newIndex = Math.max(index - 1, 0);
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = total - 1;
      break;
    case 'Enter':
    case ' ':
      {
        e.preventDefault();
        const currentIndex = parseInt(mainImage?.dataset.index || '0', 10);
        const images = Array.from(gallery.querySelectorAll('.gallery-thumb img')).map(img => (img as HTMLImageElement).src.replace('/products/', ''));
        const altTexts = Array.from(gallery.querySelectorAll('.gallery-thumb img')).map(img => (img as HTMLImageElement).alt);
        const productName = mainImage?.alt || '';
        openLightbox(images, altTexts, productName, currentIndex);
        return;
      }
    default:
      return;
  }

  if (newIndex !== index) {
    const newThumb = gallery.querySelector(`.gallery-thumb[data-index="${newIndex}"]`) as HTMLElement;
    newThumb?.focus();
    switchImage(gallery, newIndex);
  }
}

// Lightbox controller
class LightboxController {
  private overlay: HTMLElement;
  private content: HTMLElement;
  private mainImage: HTMLImageElement;
  private thumbnailsContainer: HTMLElement;
  private closeBtn: HTMLButtonElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private images: string[];
  private altTexts: string[];
  private productName: string;
  private currentIndex: number;
  private focusableElements: HTMLElement[] = [];
  private previouslyFocusedElement: HTMLElement | null = null;
  private trapFocusHandler: (e: KeyboardEvent) => void;
  private keydownHandler: (e: KeyboardEvent) => void;
  private touchStartX = 0;
  private touchEndX = 0;

  constructor(images: string[], altTexts: string[], productName: string, startIndex: number) {
    this.images = images;
    this.altTexts = altTexts;
    this.productName = productName;
    this.currentIndex = startIndex;

    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-label', t('product.lightbox_label', { product: productName }) || `Image zoom: ${productName}`);

    this.content = document.createElement('div');
    this.content.className = 'lightbox-content';

    this.mainImage = document.createElement('img');
    this.mainImage.className = 'lightbox-main-image';
    this.mainImage.loading = 'eager';

    this.content.appendChild(this.mainImage);

    // Close button
    this.closeBtn = document.createElement('button');
    this.closeBtn.type = 'button';
    this.closeBtn.className = 'lightbox-close';
    this.closeBtn.setAttribute('aria-label', t('product.lightbox_close') || 'Close zoom');
    this.closeBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    this.closeBtn.addEventListener('click', () => this.close());
    this.content.appendChild(this.closeBtn);

    // Navigation
    this.prevBtn = document.createElement('button');
    this.prevBtn.type = 'button';
    this.prevBtn.className = 'lightbox-nav lightbox-nav-prev';
    this.prevBtn.setAttribute('aria-label', t('product.gallery_prev') || 'Previous image');
    this.prevBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
    this.prevBtn.addEventListener('click', () => this.navigate(-1));
    this.content.appendChild(this.prevBtn);

    this.nextBtn = document.createElement('button');
    this.nextBtn.type = 'button';
    this.nextBtn.className = 'lightbox-nav lightbox-nav-next';
    this.nextBtn.setAttribute('aria-label', t('product.gallery_next') || 'Next image');
    this.nextBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';
    this.nextBtn.addEventListener('click', () => this.navigate(1));
    this.content.appendChild(this.nextBtn);

    // Thumbnails
    this.thumbnailsContainer = document.createElement('div');
    this.thumbnailsContainer.className = 'lightbox-thumbnails';
    this.thumbnailsContainer.setAttribute('role', 'tablist');
    this.thumbnailsContainer.setAttribute('aria-label', t('product.gallery_thumbs_label') || 'Image thumbnails');
    this.content.appendChild(this.thumbnailsContainer);

    this.overlay.appendChild(this.content);
    document.body.appendChild(this.overlay);

    this.trapFocusHandler = this.handleTrapFocus.bind(this);
    this.keydownHandler = this.handleKeydown.bind(this);

    this.renderThumbnails();
    this.updateImage();
    this.bindEvents();
    this.trapFocus();
  }

  private renderThumbnails(): void {
    this.thumbnailsContainer.innerHTML = '';
    this.images.forEach((src, index) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = `lightbox-thumb ${index === this.currentIndex ? 'active' : ''}`;
      thumb.setAttribute('role', 'tab');
      thumb.setAttribute('aria-selected', index === this.currentIndex ? 'true' : 'false');
      thumb.setAttribute('aria-label', t('product.gallery_thumb_label', { index: index + 1, total: this.images.length }) || `View image ${index + 1} of ${this.images.length}`);
      thumb.dataset.index = String(index);

      const img = document.createElement('img');
      img.src = `/products/${src}`;
      img.alt = '';
      img.loading = 'lazy';
      img.width = 100;
      img.height = 100;
      thumb.appendChild(img);

      thumb.addEventListener('click', () => this.goTo(index));
      this.thumbnailsContainer.appendChild(thumb);
    });
  }

  private updateImage(): void {
    this.mainImage.src = `/products/${this.images[this.currentIndex]}`;
    this.mainImage.alt = this.altTexts[this.currentIndex] || this.productName;

    // Update thumbnail active state
    this.thumbnailsContainer.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === this.currentIndex);
      thumb.setAttribute('aria-selected', i === this.currentIndex ? 'true' : 'false');
    });

    // Update nav button states
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.images.length - 1;
  }

  private navigate(direction: -1 | 1): void {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.images.length) {
      this.goTo(newIndex);
    }
  }

  private goTo(index: number): void {
    this.currentIndex = index;
    this.updateImage();
    // Focus the active thumbnail
    const activeThumb = this.thumbnailsContainer.querySelector('.lightbox-thumb.active') as HTMLElement;
    activeThumb?.focus();
  }

  private bindEvents(): void {
    // Touch swipe
    this.content.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.content.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      const diff = this.touchStartX - this.touchEndX;
      if (Math.abs(diff) > 50) {
        this.navigate(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  private trapFocus(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();
    this.overlay.addEventListener('keydown', this.trapFocusHandler);
    this.overlay.addEventListener('keydown', this.keydownHandler);

    // Focus first focusable element
    setTimeout(() => this.focusableElements[0]?.focus(), 0);
  }

  private updateFocusableElements(): void {
    this.focusableElements = Array.from(this.overlay.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  private handleTrapFocus(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    this.updateFocusableElements();
    const first = this.focusableElements[0];
    const last = this.focusableElements[this.focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.navigate(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.navigate(1);
        break;
    }
  }

  close(): void {
    this.overlay.removeEventListener('keydown', this.trapFocusHandler);
    this.overlay.removeEventListener('keydown', this.keydownHandler);
    this.overlay.remove();
    this.previouslyFocusedElement?.focus();
    lightboxInstance = null;
  }
}

function openLightbox(images: string[], altTexts: string[], productName: string, startIndex: number): void {
  if (lightboxInstance) {
    lightboxInstance.close();
  }
  lightboxInstance = new LightboxController(images, altTexts, productName, startIndex);
}

function updateGalleryTexts(gallery: HTMLElement, images: string[], productName: string): void {
  // Update main image aria-label
  const mainContainer = gallery.querySelector('.gallery-main');
  if (mainContainer) {
    mainContainer.setAttribute('aria-label', t('product.gallery_main_label', { product: productName }) || `Main image of ${productName}`);
  }

  // Update nav buttons
  const prevBtn = gallery.querySelector('.gallery-nav-prev') as HTMLButtonElement;
  const nextBtn = gallery.querySelector('.gallery-nav-next') as HTMLButtonElement;
  if (prevBtn) prevBtn.setAttribute('aria-label', t('product.gallery_prev') || 'Previous image');
  if (nextBtn) nextBtn.setAttribute('aria-label', t('product.gallery_next') || 'Next image');

  // Update thumbnails
  gallery.querySelectorAll('.gallery-thumb').forEach((thumb, index) => {
    thumb.setAttribute('aria-label', t('product.gallery_thumb_label', { index: index + 1, total: images.length }) || `View image ${index + 1} of ${images.length}`);
  });

  // Update counter
  const counter = gallery.querySelector('.gallery-counter') as HTMLElement;
  const mainImage = gallery.querySelector('.gallery-main-image') as HTMLImageElement;
  const currentIndex = parseInt(mainImage?.dataset.index || '0', 10);
  if (counter) {
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }
}

// Export for testing
export { LightboxController, switchImage, handleSwipe, handleMainKeydown, handleThumbKeydown };