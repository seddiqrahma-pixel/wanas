// ==========================================================================
// Wanas — Language Switcher Component
// ==========================================================================

import { getLocale, setLocale, onLocaleChange, translatePage } from '../scripts/i18n';

let langToggle: HTMLButtonElement | null = null;
let unsubscribeLocale: (() => void) | null = null;

export function initLanguageSwitcher(): void {
  langToggle = document.getElementById('lang-toggle') as HTMLButtonElement;
  if (!langToggle) return;

  updateToggleUI();

  langToggle.addEventListener('click', () => {
    const newLocale = getLocale() === 'ar' ? 'en' : 'ar';
    setLocale(newLocale);
  });

  unsubscribeLocale = onLocaleChange(() => {
    updateToggleUI();
    translatePage();
  });

  translatePage();
}

function updateToggleUI(): void {
  if (!langToggle) return;
  const locale = getLocale();
  langToggle.classList.toggle('active', locale === 'en');
  langToggle.setAttribute('aria-label', locale === 'ar' ? 'Switch to English' : 'التحول للعربية');
}

export function destroyLanguageSwitcher(): void {
  unsubscribeLocale?.();
}