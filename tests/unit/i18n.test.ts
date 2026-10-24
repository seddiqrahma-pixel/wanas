import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('i18n', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('formats price correctly for Arabic locale', async () => {
    const { formatPrice, initI18n, setLocale } = await import('../../src/scripts/i18n');
    initI18n();
    setLocale('ar');
    expect(formatPrice(180)).toContain('١٨٠');
    expect(formatPrice(180)).toContain('ج.م');
  });

  it('formats price correctly for English locale', async () => {
    const { formatPrice, initI18n, setLocale } = await import('../../src/scripts/i18n');
    initI18n();
    setLocale('en');
    expect(formatPrice(180)).toContain('EGP');
    expect(formatPrice(180)).toContain('180');
  });

  it('switches locale and updates document', async () => {
    const { initI18n, getLocale, setLocale } = await import('../../src/scripts/i18n');
    initI18n();
    setLocale('ar');
    expect(getLocale()).toBe('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');

    setLocale('en');
    expect(getLocale()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('translates keys correctly', async () => {
    const { initI18n, setLocale, t } = await import('../../src/scripts/i18n');
    initI18n();
    setLocale('ar');
    expect(t('hero.title')).toBe('شُمُوعٌ تَمنَحُكَ دِفءَ الشَمس');

    setLocale('en');
    expect(t('hero.title')).toBe('Candles that give you the warmth of the sun');
  });

  it('persists locale in localStorage', async () => {
    const { initI18n, setLocale } = await import('../../src/scripts/i18n');
    initI18n();
    setLocale('en');
    expect(localStorage.getItem('wanas_locale')).toBe('en');
  });

  it('notifies listeners on locale change', async () => {
    const { initI18n, setLocale, onLocaleChange, getLocale } = await import('../../src/scripts/i18n');
    initI18n();
    // Ensure we start from a known state
    if (getLocale() !== 'ar') {
      setLocale('ar');
    }
    const listener = vi.fn();
    const unsubscribe = onLocaleChange(listener);

    setLocale('en');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setLocale('ar');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});