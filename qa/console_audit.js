// Console audit: jsdom https-origin load, capture window.onerror/console.error, click EN toggle -> add-to-cart -> admin open
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const W = '/Users/ahmed.alghoraib/Desktop/Wanas';
const html = fs.readFileSync(W + '/index.html', 'utf8');

const vc = new VirtualConsole();
const errors = [], warns = [];
// capture jsdom's own console.error (Not implemented etc.) verbatim
vc.on('error', (...a) => { /* page console.error */ });
const origConsoleError = console.error;

const dom = new JSDOM(html, {
  url: 'https://seddiqrahma-pixel.github.io/wanas/',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
    window.addEventListener('error', e => {
      const m = e.message || (e.error && e.error.message) || String(e);
      errors.push('window.onerror: ' + m + (e.filename ? ` (${e.filename}:${e.lineno}:${e.colno})` : ''));
    });
    window.console.error = (...a) => {
      const s = a.map(x => (x && x.stack) || (x && x.message) || String(x)).join(' ');
      if (s.includes('Not implemented: navigation')) return; // jsdom noise filter
      errors.push(s);
    };
    window.console.warn = (...a) => {
      const s = a.map(x => (x && x.stack) || (x && x.message) || String(x)).join(' ');
      if (s.includes('Not implemented: navigation')) return;
      warns.push(s);
    };
  }
});
const { window } = dom;
const doc = window.document;

setTimeout(() => {
  console.log('loaded. title:', doc.title);
  // 1) EN toggle
  const langBtn = doc.querySelector('#langBtn');
  console.log('langBtn:', !!langBtn, '| text:', langBtn && langBtn.textContent);
  langBtn && langBtn.click();
  setTimeout(() => {
    console.log('after toggle: html lang=', doc.documentElement.getAttribute('lang'), 'dir=', doc.documentElement.getAttribute('dir'));
    // 2) add-to-cart (click first .add-btn)
    const add = doc.querySelector('.add-btn');
    console.log('add-btn found:', !!add);
    if (add) add.click();
    setTimeout(() => {
      try {
        const cart = window.CART;
        console.log('window.CART after add:', Array.isArray(cart) ? JSON.stringify(cart) : String(cart));
      } catch(e) { console.log('CART not exposed:', e.message); }
      const badge = doc.querySelector('.badge, .cart-count, #cartCount, .cart-badge');
      console.log('badge text:', badge && badge.textContent);
      // 3) admin open
      const adminBtn = doc.querySelector('#adminBtn');
      console.log('adminBtn found:', !!adminBtn);
      adminBtn && adminBtn.click();
      setTimeout(() => {
        const adminPanel = doc.querySelector('#admin, .admin, #adminPanel, #adminModal');
        console.log('admin panel visible after click:', adminPanel && (adminPanel.classList.contains('open') || adminPanel.style.display !== 'none'));
        console.log('\n=== window.onerror / console.error (real, navigation noise filtered) ===');
        console.log(errors.length ? errors.map(e=>'--\n'+e).join('\n') : 'NONE');
        console.log('\n=== console.warn ===');
        console.log(warns.length ? warns.map(w=>'--\n'+w).join('\n') : 'NONE');
      }, 800);
    }, 800);
  }, 800);
}, 1500);
