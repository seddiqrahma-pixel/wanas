// Reconcile index.html product data (factory defaultData + PRICING) vs effective prices sheet & proposal sheet
const fs = require('fs');
const W = '/Users/ahmed.alghoraib/Desktop/Wanas';
const html = fs.readFileSync(W + '/index.html', 'utf8');

function matchBrace(s, start) {
  let d = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (esc) esc=false; else if (c==='\\') esc=true; else if (c==='"') inStr=false; continue; }
    if (c === '"') inStr = true;
    else if (c === '{') d++;
    else if (c === '}') { d--; if (!d) return s.slice(start, i+1); }
  }
}
// factory products
const facIdx = html.indexOf('{\n    categories:[', html.indexOf('function defaultData'));
const factory = eval('(' + matchBrace(html, facIdx) + ')');
const pubIdx = html.indexOf('const PUBLISHED_DEFAULTS = {') + 'const PUBLISHED_DEFAULTS = '.length;
const published = JSON.parse(matchBrace(html, pubIdx).trim());

// PRICING
const pricing = {};
for (const m of html.slice(html.indexOf('const PRICING = {'), html.indexOf('};', html.indexOf('const PRICING = {'))).matchAll(/\s(p\d+):\{cost:([\d.]+), market:([\d.]+)\}/g))
  pricing[m[1]] = { cost: Number(m[2]), market: Number(m[3]) };

// factory products verbatim dump
console.log('factory products:');
for (const p of factory.products) {
  const pr = pricing[p.id] || {};
  console.log(`${p.id} | AR:"${p.ar}" | EN:"${p.en||''}" | price:${p.price} | descAr:"${(p.descAr||'').slice(0,60)}" | descEn:"${(p.descEn||'').slice(0,60)}" | imgs:${p.imgs? p.imgs.length : 0} | cost:${pr.cost} market:${pr.market}`);
}
console.log('\npublished products:');
for (const p of published.products)
  console.log(`${p.id} | AR:"${p.ar}" EN:"${p.en}" | price:${p.price} | imgs:${p.imgs.length}`);
console.log('\ntotal factory:', factory.products.length, 'total published:', published.products.length, 'pricing ids:', Object.keys(pricing).length);
