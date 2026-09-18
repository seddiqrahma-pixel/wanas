// Reconcile PRODUCTS_PROPOSAL.md (authoritative sheet) vs index.html product data
const fs = require('fs');
const W = '/Users/ahmed.alghoraib/Desktop/Wanas';
const html = fs.readFileSync(W + '/index.html', 'utf8');
const out = [];

// --- extract PUBLISHED_DEFAULTS products (line 895) ---
const mPub = html.match(/const PUBLISHED_DEFAULTS = (\{.*?\});\n/);
let published = null, publishedProdCount = 0;
if (mPub) {
  published = JSON.parse(mPub[1]);
  publishedProdCount = published.products.length;
}

// --- extract factory defaultData() products (lines 910-956) ---
const facStart = html.indexOf('function defaultData()');
const facEnd = html.indexOf('\nlet DATA', facStart);
const facText = html.slice(facStart, facEnd);
const mFactory = facText.match(/return \{[\s\S]*?\n  \};\n\}/);
const factorySrc = facText.slice(facText.indexOf('return {'));
// brace-match the return object
function matchBrace(s, start) { // start at '{'
  let d = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (esc) esc=false; else if (c==='\\') esc=true; else if (c==='"'||c==="'") inStr=false; continue; }
    if (c === '"') inStr = true;
    else if (c === '{') d++;
    else if (c === '}') { d--; if (!d) return s.slice(start, i+1); }
  }
  return null;
}
const facObj = matchBrace(html, html.indexOf('{\n    categories:[', facStart));
const factory = eval('(' + facObj + ')');

// --- parse PRODUCTS_PROPOSAL.md items (authoritative sheet) ---
const md = fs.readFileSync(W + '/PRODUCTS_PROPOSAL.md', 'utf8');
const proposal = [];
const re = /^\d+\.\s\*\*(.+?)\*\*\s+—\s+(.+?)\s+→\s+([\d.]+)\s*ج/m;
let pm;
for (const line of md.split('\n')) {
  pm = line.match(re);
  if (pm) proposal.push({ nameAr: pm[1], descAr: pm[2], price: Number(pm[3]) });
}

// --- matching by normalized Arabic name ---
const strip = s => String(s).replace(/[\u064B-\u0652\u0640]/g,'').replace(/\s+/g,' ').trim();
function findMatch(name, pool) {
  const n = strip(name);
  // exact name or containment both ways
  for (const p of pool) {
    const pn = strip(p.ar);
    if (pn === n || pn.includes(n) || n.includes(pn)) return p;
  }
  return null;
}

console.log('=== COUNTS ===');
console.log('Proposal (PRODUCTS_PROPOSAL.md):', proposal.length, 'products');
console.log('Site factory defaultData():', factory.products.length, 'products');
console.log('Site PUBLISHED_DEFAULTS (runtime-effective):', publishedProdCount, 'products');
console.log('Factory ids:', factory.products.map(p=>p.id).join(','));

console.log('\n=== PER-ITEM DIFF (proposal vs factory FALLBACK; runtime uses PUBLISHED_DEFAULTS) ===');
for (const item of proposal) {
  const key = item.nameAr.replace(/ونس/g,'').trim();
  // try keyword matching
  const kwmap = {
    'العنبر':['ونس العنبر','amber'],
    'وردة ونس':['وردة','jori','بلدي'],
    'سحابة ونس':['سحابة'],
    'عطور (٤ فتائل)':['فاتيل','عطور'],
    'باقة الونس الوردية':['بوكية','بوكيه'],
    'صندوق الونس':['صندوق','sandouq','bonbonniere','بونبونيره'],
    'وردة الصابون':['صابون'],
    'عطر الونس':['قطارة','عطر','سمع'],
    'بخور الونس':['بخور']
  };
  let hit = [];
  for (const p of factory.products) {
    const hay = [p.ar,p.en,p.descAr,p.descEn].join(' ').toLowerCase();
    if (kwmap[key] && kwmap[key].some(k => hay.includes(k.toLowerCase()))) hit.push(p);
  }
  const best = hit[0];
  if (!best) {
    out.push(`MISSING ON SITE: proposal "${item.nameAr}" (${item.descAr}, ${item.price} EGP) — no site product matches`);
  } else {
    out.push(`MATCHED proposal "${item.nameAr}" -> site ${best.id} "${best.ar}" / "${best.en}" price ${best.price} EGP`
      + (best.price !== item.price ? `  << PRICE MISMATCH (sheet ${item.price} vs site ${best.price})` : ''));
  }
}

console.log(out.join('\n'));

console.log('\n=== PUBLISHED_DEFAULTS detail (runtime catalog) ===');
for (const p of published.products) {
  console.log(`${p.id} | AR:"${p.ar}" EN:"${p.en}" | price ${p.price} | imgs ${p.imgs.length}`);
}

console.log('\n=== PRICING table product ids with no factory product (orphans) ===');
const pricMatch = html.match(/const PRICING = \{([\s\S]*?)\};/);
const facIds = new Set(factory.products.map(p=>p.id));
const pubIds = new Set(published.products.map(p=>p.id));
for (const m of pricMatch[1].matchAll(/\s(p\d+):/g)) {
  if (!facIds.has(m[1])) console.log('PRICING orphan id:', m[1]);
}
const facOnly = factory.products.filter(p=>!pubIds.has(p.id));
console.log('\nFactory products NOT in published defaults (dropped at runtime):', facOnly.map(p=>p.id+':'+p.ar).join(', '));
