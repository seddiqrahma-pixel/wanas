// ==========================================================================
// Wanas — Internationalization (i18n)
// ==========================================================================

import type { Locale, TranslationMap } from './types';

const translations: Record<Locale, TranslationMap> = {
  ar: {
    brand: {
      name: 'وَنَس',
      tagline: 'شُمُوعٌ تَمنَحُكَ دِفءَ الشَمس 🕯️🧡',
      location: 'سوهاج، صعيد مصر',
      service: 'خدمة "أنسٌ منك" لكتابة بطاقات الهدايا مجاناً'
    },
    nav: {
      products: 'المنتجات',
      about: 'عن ونس',
      contact: 'تواصل'
    },
    hero: {
      title: 'شُمُوعٌ تَمنَحُكَ دِفءَ الشَمس',
      subtitle: 'شموع وعطور منزلية يدوية من سوهاج، صعيد مصر',
      cta: 'اكتشف المنتجات'
    },
    sections: {
      products: 'منتجاتنا',
      products_subtitle: 'مصنوعة يدوياً بحب في سوهاج',
      about: 'عن ونس',
      contact: 'تواصل معنا'
    },
    filters: {
      all: 'الكل',
      candles: 'شموع',
      gifts: 'هدايا وورود',
      fragrance: 'عطور منزلية'
    },
    about: {
      handmade: { title: 'صنع يدوي', desc: 'كل قطعة تُصنع يدوياً في ورشتنا بسوهاج، باستخدام شمع الصويا الطبيعي والزيوت العطرية الفاخرة.' },
      natural: { title: 'طبيعي 100%', desc: 'بدون بارابين، بدون سموم، صديقة للبيئة وآمنة لعائلتك.' },
      gift: { title: 'خدمة الهدايا', desc: 'خدمة "أنسٌ منك" — نكتب بطاقة هدايا بخط اليد مجاناً مع كل طلبية.' }
    },
    contact: {
      whatsapp: 'واتساب للطلبات',
      email: 'البريد الإلكتروني',
      location: 'الموقع',
      location_text: 'سوهاج، صعيد مصر',
      note: 'متاح يومياً ١٠ص–١٠م'
    },
    footer: {
      quick_links: 'روابط سريعة',
      payment_methods: 'طرق الدفع',
      copyright: '© 2026 ونس. جميع الحقوق محفوظة.'
    },
    payments: {
      vodafone_cash: 'فودافون كاش',
      insta_pay: 'إنستاباي',
      bank_transfer: 'تحويل بنكي (NBE)',
      whatsapp: 'طلب واتساب'
    },
    cart: {
      title: 'سلة التسوق',
      subtotal: 'المجموع الفرعي',
      checkout: 'إتمام الطلب عبر واتساب',
      note: 'سيتم توجيهك لواتساب لتأكيد الطلب والدفع',
      empty: 'السلة فارغة',
      remove: 'إزالة'
    },
    product: {
      add_to_cart: 'أضف للسلة',
      featured: 'مميز',
      out_of_stock: 'غير متوفر',
      gallery_label: 'معرض صور {product}',
      gallery_main_label: 'الصورة الرئيسية لـ {product}',
      gallery_thumbs_label: 'صور مصغرة',
      gallery_thumb_label: 'الصورة {index} من {total}',
      gallery_prev: 'الصورة السابقة',
      gallery_next: 'الصورة التالية',
      lightbox_label: 'تكبير صورة {product}',
      lightbox_close: 'إغلاق التكبير'
    },
    admin: {
      title: 'لوحة تحكم ونس',
      exit: 'مغادرة لوحة التحكم',
      products: 'إدارة المنتجات',
      add_product: 'إضافة منتج',
      sync_products: 'مزامنة من الجدول',
      export_json: 'تصدير JSON',
      settings: 'إعدادات الموقع',
      orders: 'الطلبات',
      save: 'حفظ الإعدادات',
      images: 'صور المنتج',
      drag_drop: 'اسحب وأفلت الصور هنا، أو انقر للاختيار',
      preview: 'معاينة',
      remove: 'إزالة',
      upload_images: 'رفع الصور',
      saving: 'جاري الحفظ...',
      save_success: 'تم حفظ الصور بنجاح',
      save_error: 'خطأ في حفظ الصور',
      no_images: 'لا توجد صور',
      validate_paths: 'التحقق من المسارات',
      paths_valid: 'جميع المسارات صحيحة',
      paths_invalid: 'بعض المسارات غير موجودة',
      product_images_dir: 'سيتم حفظ الصور في: src/assets/products/{id}/'
    }
  },
  en: {
    brand: {
      name: 'Wanas',
      tagline: 'Candles that give you the warmth of the sun 🕯️🧡',
      location: 'Sohag, Upper Egypt',
      service: 'Free handwritten gift-note service "Anas Mink"'
    },
    nav: {
      products: 'Products',
      about: 'About Wanas',
      contact: 'Contact'
    },
    hero: {
      title: 'Candles that give you the warmth of the sun',
      subtitle: 'Handmade candles & home fragrances from Sohag, Upper Egypt',
      cta: 'Discover Products'
    },
    sections: {
      products: 'Our Products',
      products_subtitle: 'Handmade with love in Sohag',
      about: 'About Wanas',
      contact: 'Contact Us'
    },
    filters: {
      all: 'All',
      candles: 'Candles',
      gifts: 'Gifts & Flowers',
      fragrance: 'Home Fragrance'
    },
    about: {
      handmade: { title: 'Handmade', desc: 'Every piece is handcrafted in our Sohag workshop using natural soy wax and premium fragrance oils.' },
      natural: { title: '100% Natural', desc: 'No parabens, no toxins, eco-friendly and safe for your family.' },
      gift: { title: 'Gift Service', desc: 'Free "Anas Mink" service — we handwrite gift notes with every order.' }
    },
    contact: {
      whatsapp: 'WhatsApp for Orders',
      email: 'Email',
      location: 'Location',
      location_text: 'Sohag, Upper Egypt',
      note: 'Available daily 10am–10pm'
    },
    footer: {
      quick_links: 'Quick Links',
      payment_methods: 'Payment Methods',
      copyright: '© 2026 Wanas. All rights reserved.'
    },
    payments: {
      vodafone_cash: 'Vodafone Cash',
      insta_pay: 'InstaPay',
      bank_transfer: 'Bank Transfer (NBE)',
      whatsapp: 'WhatsApp Order'
    },
    cart: {
      title: 'Shopping Cart',
      subtotal: 'Subtotal',
      checkout: 'Checkout via WhatsApp',
      note: 'You\'ll be redirected to WhatsApp to confirm order & payment',
      empty: 'Cart is empty',
      remove: 'Remove'
    },
    product: {
      add_to_cart: 'Add to Cart',
      featured: 'Featured',
      out_of_stock: 'Out of Stock',
      gallery_label: '{product} image gallery',
      gallery_main_label: 'Main image of {product}',
      gallery_thumbs_label: 'Image thumbnails',
      gallery_thumb_label: 'Image {index} of {total}',
      gallery_prev: 'Previous image',
      gallery_next: 'Next image',
      lightbox_label: 'Image zoom: {product}',
      lightbox_close: 'Close zoom'
    },
    admin: {
      title: 'Wanas Admin',
      exit: 'Exit Admin',
      products: 'Manage Products',
      add_product: 'Add Product',
      sync_products: 'Sync from Sheet',
      export_json: 'Export JSON',
      settings: 'Site Settings',
      orders: 'Orders',
      save: 'Save Settings',
      images: 'Product Images',
      drag_drop: 'Drag and drop images here, or click to select',
      preview: 'Preview',
      remove: 'Remove',
      upload_images: 'Upload Images',
      saving: 'Saving...',
      save_success: 'Images saved successfully',
      save_error: 'Error saving images',
      no_images: 'No images',
      validate_paths: 'Validate Paths',
      paths_valid: 'All paths are valid',
      paths_invalid: 'Some paths do not exist',
      product_images_dir: 'Images will be saved to: src/assets/products/{id}/'
    }
  }
};

let currentLocale: Locale = 'ar';
const listeners: Set<() => void> = new Set();

function flattenTranslations(obj: TranslationMap, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[newKey] = value;
    } else {
      Object.assign(result, flattenTranslations(value as TranslationMap, newKey));
    }
  }
  return result;
}

const flatTranslations: Record<Locale, Record<string, string>> = {
  ar: flattenTranslations(translations.ar),
  en: flattenTranslations(translations.en)
};

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (currentLocale !== locale) {
    currentLocale = locale;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('wanas_locale', locale);
    notifyListeners();
  }
}

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = flatTranslations[currentLocale];
  let translation = dict[key] || key;

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
    });
  }

  return translation;
}

export function translatePage(): void {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translation = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        (el as HTMLInputElement).placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attrKey = el.getAttribute('data-i18n-attr');
    if (attrKey) {
      const [attr, key] = attrKey.split(':');
      const translation = t(key);
      el.setAttribute(attr, translation);
    }
  });
}

function notifyListeners(): void {
  listeners.forEach(fn => fn());
}

export function onLocaleChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n(): void {
  const saved = localStorage.getItem('wanas_locale') as Locale | null;
  if (saved && (saved === 'ar' || saved === 'en')) {
    currentLocale = saved;
  } else {
    const browserLang = navigator.language.slice(0, 2);
    currentLocale = browserLang === 'en' ? 'en' : 'ar';
  }
  document.documentElement.lang = currentLocale;
  document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';
}

export function formatPrice(amount: number, locale: Locale = currentLocale): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}