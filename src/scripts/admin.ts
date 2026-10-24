// ==========================================================================
// Wanas — Admin Entry Point
// ==========================================================================

import '../styles/main.css';
import { initI18n, t, getLocale, onLocaleChange, translatePage } from './i18n';
import { loadSiteData, getSiteData, invalidateCache } from './data';
import type { Product, Order } from './types';
import { getOrders } from './cart';

let currentProducts: Product[] = [];

// Image upload state
interface UploadedImage {
  file: File;
  preview: string;
  productId: string;
}

let pendingImages: UploadedImage[] = [];

async function initAdmin(): Promise<void> {
  initI18n();
  translatePage();

  try {
    await loadSiteData();
    currentProducts = getSiteData()?.products ?? [];
    renderProductsTable();
    renderOrdersTable();
    initEventListeners();
    initLocaleListener();
  } catch (error) {
    console.error('Failed to initialize admin:', error);
  }
}

function initLocaleListener(): void {
  onLocaleChange(() => {
    translatePage();
    renderProductsTable();
    renderOrdersTable();
  });
}

function initEventListeners(): void {
  const exitBtn = document.getElementById('exit-admin');
  exitBtn?.addEventListener('click', () => window.location.href = '/');

  const addProductBtn = document.getElementById('add-product-btn');
  addProductBtn?.addEventListener('click', () => openProductModal());

  const syncBtn = document.getElementById('sync-products-btn');
  syncBtn?.addEventListener('click', async () => {
    invalidateCache();
    await loadSiteData();
    currentProducts = getSiteData()?.products ?? [];
    renderProductsTable();
    alert(t('admin.products') + ' ' + (getLocale() === 'ar' ? 'تمت المزامنة' : 'synced'));
  });

  const exportBtn = document.getElementById('export-json-btn');
  exportBtn?.addEventListener('click', exportProductsJson);

  const settingsForm = document.getElementById('settings-form') as HTMLFormElement;
  settingsForm?.addEventListener('submit', handleSettingsSave);
}

function renderProductsTable(): void {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  const locale = getLocale();
  tbody.innerHTML = currentProducts.map((product, index) => {
    const variant = product.variants[0];
    return `
      <tr data-product-id="${product.id}">
        <td>${index + 1}</td>
        <td>${product.name.ar}</td>
        <td>${product.name.en}</td>
        <td>${t(`categories.${product.category}`)}</td>
        <td>${variant.price_egp} ج.م</td>
        <td><span class="status-badge ${product.active ? 'active' : 'inactive'}">${product.active ? (locale === 'ar' ? 'نشط' : 'Active') : (locale === 'ar' ? 'غير نشط' : 'Inactive')}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary edit-btn" data-action="edit" data-id="${product.id}">${locale === 'ar' ? 'تعديل' : 'Edit'}</button>
          <button class="btn btn-sm btn-secondary images-btn" data-action="images" data-id="${product.id}" title="${t('admin.images')}">🖼️</button>
          <button class="btn btn-sm btn-outline delete-btn" data-action="delete" data-id="${product.id}">${locale === 'ar' ? 'حذف' : 'Delete'}</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.edit-btn').forEach(btn => {
    const id = btn.getAttribute('data-id');
    if (id) btn.addEventListener('click', () => openProductModal(id));
  });
  tbody.querySelectorAll('.images-btn').forEach(btn => {
    const id = btn.getAttribute('data-id');
    if (id) btn.addEventListener('click', () => openImageUploadModal(id));
  });
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    const id = btn.getAttribute('data-id');
    if (id) btn.addEventListener('click', () => deleteProduct(id));
  });
}

function openProductModal(productId?: string): void {
  const product = productId ? currentProducts.find(p => p.id === productId) : null;
  const locale = getLocale();
  const isEdit = !!product;

  const modalHtml = `
    <div class="modal-overlay" id="product-modal">
      <div class="modal">
        <header class="modal-header">
          <h3>${isEdit ? (locale === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (locale === 'ar' ? 'إضافة منتج' : 'Add Product')}</h3>
          <button class="modal-close" aria-label="${locale === 'ar' ? 'إغلاق' : 'Close'}">&times;</button>
        </header>
        <form class="modal-form" id="product-form">
          <input type="hidden" name="id" value="${product?.id || ''}">
          <div class="form-row">
            <div class="form-group">
              <label>${locale === 'ar' ? 'المعرف' : 'ID'}</label>
              <input type="text" name="id" value="${product?.id || ''}" ${isEdit ? 'readonly' : ''} required>
            </div>
            <div class="form-group">
              <label>${locale === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
              <input type="text" name="name_ar" value="${product?.name.ar || ''}" required>
            </div>
            <div class="form-group">
              <label>${locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</label>
              <input type="text" name="name_en" value="${product?.name.en || ''}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>${locale === 'ar' ? 'الوصف (عربي)' : 'Description (AR)'}</label>
              <textarea name="desc_ar" required>${product?.description.ar || ''}</textarea>
            </div>
            <div class="form-group">
              <label>${locale === 'ar' ? 'الوصف (إنجليزي)' : 'Description (EN)'}</label>
              <textarea name="desc_en" required>${product?.description.en || ''}</textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>${locale === 'ar' ? 'الصنف' : 'Category'}</label>
              <select name="category" required>
                <option value="candles" ${product?.category === 'candles' ? 'selected' : ''}>${t('categories.candles')}</option>
                <option value="gifts" ${product?.category === 'gifts' ? 'selected' : ''}>${t('categories.gifts')}</option>
                <option value="fragrance" ${product?.category === 'fragrance' ? 'selected' : ''}>${t('categories.fragrance')}</option>
              </select>
            </div>
            <div class="form-group">
              <label>${locale === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)'}</label>
              <input type="number" name="price" value="${product?.variants[0]?.price_egp || ''}" required min="0">
            </div>
            <div class="form-group">
              <label>${locale === 'ar' ? 'الحالة' : 'Status'}</label>
              <select name="active">
                <option value="true" ${product?.active !== false ? 'selected' : ''}>${locale === 'ar' ? 'نشط' : 'Active'}</option>
                <option value="false" ${product?.active === false ? 'selected' : ''}>${locale === 'ar' ? 'غير نشط' : 'Inactive'}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>${locale === 'ar' ? 'الصور (مسارات مفصولة بفواصل)' : 'Images (comma-separated paths)'}</label>
            <input type="text" name="images" value="${product?.images.join(', ') || ''}" placeholder="wnas_amber_100/main.jpg, wnas_amber_150/main.jpg">
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary modal-cancel">${locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" class="btn btn-primary">${isEdit ? (locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes') : (locale === 'ar' ? 'إضافة المنتج' : 'Add Product')}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('product-modal')!;
  const form = document.getElementById('product-form') as HTMLFormElement;
  const closeBtn = modal.querySelector('.modal-close')!;
  const cancelBtn = modal.querySelector('.modal-cancel')!;

  const closeModal = () => modal.remove();

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newProduct: Partial<Product> = {
      id: formData.get('id') as string || `prod-${Date.now()}`,
      slug: (formData.get('id') as string || `prod-${Date.now()}`).toLowerCase().replace(/\s+/g, '-'),
      name: {
        ar: formData.get('name_ar') as string,
        en: formData.get('name_en') as string
      },
      description: {
        ar: formData.get('desc_ar') as string,
        en: formData.get('desc_en') as string
      },
      category: formData.get('category') as string,
      price_egp: parseInt(formData.get('price') as string) || 0,
      images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(Boolean),
      variants: [{
        id: 'default',
        price_egp: parseInt(formData.get('price') as string) || 0,
        sku: (formData.get('id') as string || `prod-${Date.now()}`).toUpperCase().replace(/-/g, '')
      }],
      tags: [],
      featured: false,
      active: formData.get('active') === 'true'
    };

    if (isEdit) {
      const index = currentProducts.findIndex(p => p.id === productId);
      if (index !== -1) currentProducts[index] = { ...currentProducts[index], ...newProduct } as Product;
    } else {
      currentProducts.push(newProduct as Product);
    }

    await saveProductsToJson();
    renderProductsTable();
    closeModal();
  });

  requestAnimationFrame(() => modal.classList.add('open'));
}

function openImageUploadModal(productId: string): void {
  const product = currentProducts.find(p => p.id === productId);
  const locale = getLocale();
  
  if (!product) return;

  // Filter pending images for this product
  const productImages = pendingImages.filter(img => img.productId === productId);
  
  const modalHtml = `
    <div class="modal-overlay" id="image-modal">
      <div class="modal modal-lg">
        <header class="modal-header">
          <h3>${t('admin.images')}: ${product.name[locale]}</h3>
          <button class="modal-close" aria-label="${locale === 'ar' ? 'إغلاق' : 'Close' }">&times;</button>
        </header>
        <div class="modal-body">
          <div class="image-upload-zone" id="image-upload-zone">
            <input type="file" id="image-file-input" accept="image/*" multiple style="display: none;">
            <div class="upload-zone-content">
              <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p class="upload-text">${t('admin.drag_drop')}</p>
              <button type="button" class="btn btn-primary" id="browse-files-btn">${locale === 'ar' ? 'اختر ملفات' : 'Browse Files'}</button>
            </div>
          </div>
          <p class="images-dir-hint">${t('admin.product_images_dir').replace('{id}', product.id)}</p>
          
          <div class="image-preview-grid" id="image-preview-grid">
            ${productImages.length > 0 ? productImages.map((img, index) => `
              <div class="image-preview-item" data-index="${index}">
                <img src="${img.preview}" alt="${t('admin.preview')}">
                <button type="button" class="remove-image-btn" aria-label="${t('admin.remove')}" data-index="${index}">&times;</button>
              </div>
            `).join('') : `<p class="no-images">${t('admin.no_images')}</p>`}
          </div>
          
          <div class="existing-images-section">
            <h4>${locale === 'ar' ? 'الصور الحالية' : 'Current Images'}</h4>
            <div class="existing-images-grid" id="existing-images-grid">
              ${product.images.length > 0 ? product.images.map((imgSrc, index) => `
                <div class="existing-image-item">
                  <img src="${imgSrc}" alt="${product.name[locale]} ${index + 1}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                  <div class="image-missing" style="display: none;">${locale === 'ar' ? 'ملف غير موجود' : 'File not found'}</div>
                  <span class="image-path">${imgSrc}</span>
                </div>
              `).join('') : `<p class="no-images">${t('admin.no_images')}</p>`}
            </div>
          </div>
          
          <div class="image-actions">
            <button type="button" class="btn btn-secondary" id="validate-paths-btn">${t('admin.validate_paths')}</button>
            <button type="button" class="btn btn-primary" id="save-images-btn">${t('admin.upload_images')}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('image-modal')!;
  const uploadZone = document.getElementById('image-upload-zone')!;
  const fileInput = document.getElementById('image-file-input') as HTMLInputElement;
  const browseBtn = document.getElementById('browse-files-btn')!;
  const previewGrid = document.getElementById('image-preview-grid')!;
  const saveBtn = document.getElementById('save-images-btn')!;
  const validateBtn = document.getElementById('validate-paths-btn')!;
  const closeBtn = modal.querySelector('.modal-close')!;

  const closeModal = () => modal.remove();

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Drag and drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', (e) => {
    if (!uploadZone.contains(e.relatedTarget as Node)) {
      uploadZone.classList.remove('drag-over');
    }
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer?.files || []);
    handleFiles(files, productId);
  });

  browseBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    handleFiles(Array.from(fileInput.files || []), productId);
    fileInput.value = '';
  });

  // Save images
  saveBtn.addEventListener('click', async () => {
    (saveBtn as HTMLButtonElement).disabled = true;
    saveBtn.textContent = t('admin.saving');
    
    try {
      await saveProductImages(productId);
      saveBtn.textContent = t('admin.save_success');
      setTimeout(() => {
        closeModal();
        renderProductsTable();
      }, 1000);
    } catch (err) {
      console.error('Failed to save images:', err);
      saveBtn.textContent = t('admin.save_error');
      (saveBtn as HTMLButtonElement).disabled = false;
      setTimeout(() => {
        saveBtn.textContent = t('admin.upload_images');
      }, 2000);
    }
  });

  // Validate paths
  validateBtn.addEventListener('click', async () => {
    const isValid = await validateImagePaths(productId);
    alert(isValid ? t('admin.paths_valid') : t('admin.paths_invalid'));
  });

  // Handle remove image buttons (delegated)
  previewGrid.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.remove-image-btn');
    if (btn) {
      const index = parseInt(btn.getAttribute('data-index') || '0', 10);
      removePendingImage(productId, index);
      renderImagePreviewGrid(productId);
    }
  });

  requestAnimationFrame(() => modal.classList.add('open'));
}

function handleFiles(files: File[], productId: string): void {
  const imageFiles = files.filter(f => f.type.startsWith('image/'));
  
  for (const file of imageFiles) {
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name}: ${getLocale() === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)' : 'File too large (max 5MB)'}`);
      continue;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      pendingImages.push({
        file,
        preview: e.target?.result as string,
        productId
      });
      renderImagePreviewGrid(productId);
    };
    reader.readAsDataURL(file);
  }
}

function removePendingImage(productId: string, index: number): void {
  const productImages = pendingImages.filter(img => img.productId === productId);
  if (index < productImages.length) {
    const globalIndex = pendingImages.findIndex(img => img === productImages[index]);
    if (globalIndex !== -1) pendingImages.splice(globalIndex, 1);
  }
}

function renderImagePreviewGrid(productId: string): void {
  const previewGrid = document.getElementById('image-preview-grid');
  if (!previewGrid) return;
  
  const productImages = pendingImages.filter(img => img.productId === productId);
  
  if (productImages.length === 0) {
    previewGrid.innerHTML = `<p class="no-images">${t('admin.no_images')}</p>`;
    return;
  }
  
  previewGrid.innerHTML = productImages.map((img, index) => `
    <div class="image-preview-item" data-index="${index}">
      <img src="${img.preview}" alt="${t('admin.preview')}">
      <button type="button" class="remove-image-btn" aria-label="${t('admin.remove')}" data-index="${index}">&times;</button>
    </div>
  `).join('');
}

async function saveProductImages(productId: string): Promise<void> {
  const productImages = pendingImages.filter(img => img.productId === productId);
  
  if (productImages.length === 0) return;
  
  const product = currentProducts.find(p => p.id === productId);
  if (!product) throw new Error('Product not found');
  
  // In a real app, this would save to the filesystem
  // For now, we update the products.json with relative paths
  // The actual files need to be manually placed in src/assets/products/{id}/
  
  const newImagePaths: string[] = [];
  
  for (const img of productImages) {
    // Generate a filename based on the original file name
    const ext = img.file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const filename = `${product.id}_${timestamp}.${ext}`;
    const relativePath = `products/${product.id}/${filename}`;
    newImagePaths.push(relativePath);
  }
  
  // Update product images - append new images to existing ones
  product.images = [...product.images, ...newImagePaths];
  
  // Clear pending images for this product
  pendingImages = pendingImages.filter(img => img.productId !== productId);
  
  // Save to JSON
  await saveProductsToJson();
}

async function validateImagePaths(productId: string): Promise<boolean> {
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return false;
  
  let allValid = true;
  
  for (const imgSrc of product.images) {
    try {
      const response = await fetch(imgSrc, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(`Image not found: ${imgSrc}`);
        allValid = false;
      }
    } catch {
      console.warn(`Image not accessible: ${imgSrc}`);
      allValid = false;
    }
  }
  
  return allValid;
}

function deleteProduct(id: string): void {
  const locale = getLocale();
  if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
    currentProducts = currentProducts.filter(p => p.id !== id);
    saveProductsToJson();
    renderProductsTable();
  }
}

async function saveProductsToJson(): Promise<void> {
  const data = getSiteData();
  if (data) {
    data.products = currentProducts;
    try {
      await fetch('/data/products.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data, null, 2)
      });
      invalidateCache();
      await loadSiteData();
      currentProducts = getSiteData()?.products ?? [];
    } catch (err) {
      console.error('Failed to save products:', err);
      alert('Failed to save. Check console.');
    }
  }
}

function exportProductsJson(): void {
  const data = getSiteData();
  if (!data) return;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wanas-products.json';
  a.click();
  URL.revokeObjectURL(url);
}

function handleSettingsSave(e: Event): void {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const settings = Object.fromEntries(formData.entries());
  localStorage.setItem('wanas_admin_settings', JSON.stringify(settings));
  alert(getLocale() === 'ar' ? 'تم الحفظ' : 'Saved');
}

function renderOrdersTable(): void {
  getOrders().then(orders => {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;

    const locale = getLocale();
    tbody.innerHTML = orders.map((order, index) => {
      const o = order.data as Order;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${new Date(order.timestamp).toLocaleDateString(locale)}</td>
          <td>${o.customer?.name || '-'}</td>
          <td>${o.total || 0} ج.م</td>
          <td><span class="status-badge pending">${o.status || 'pending'}</span></td>
          <td><button class="btn btn-sm btn-secondary view-order" data-id="${order.id}">${locale === 'ar' ? 'عرض' : 'View'}</button></td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.view-order').forEach(btn => {
      btn.addEventListener('click', () => viewOrder(btn.getAttribute('data-id')!));
    });
  });
}

function viewOrder(id: string): void {
  getOrders().then(orders => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const o = order.data as Order;
    const locale = getLocale();
    const itemsHtml = o.items?.map((item: Order['items'][0]) =>
      `• ${item.product?.name?.[locale] || item.productId} × ${item.quantity} = ${item.variant?.price_egp * item.quantity || 0} ج.م`
    ).join('\n') || 'No items';

    alert(`${locale === 'ar' ? 'طلب رقم' : 'Order'} ${id}\n${new Date(order.timestamp).toLocaleString(locale)}\n\n${itemsHtml}\n\n${locale === 'ar' ? 'المجموع' : 'Total'}: ${o.total} ج.م\n${locale === 'ar' ? 'العميل' : 'Customer'}: ${o.customer?.name}\n${locale === 'ar' ? 'الهاتف' : 'Phone'}: ${o.customer?.phone}\n${locale === 'ar' ? 'الدفع' : 'Payment'}: ${o.paymentMethod}`);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}

export { initAdmin };