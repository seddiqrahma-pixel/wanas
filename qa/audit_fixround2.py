import json, time, sys
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas

w = Wanas(9351, f'http://localhost:8109/index.html?cb={int(time.time())}')
w.open()
w.ev("localStorage.clear()")
w.send('Page.navigate', {'url': f'http://localhost:8109/index.html?cb2={int(time.time())}'})
time.sleep(1.6)
out = {}

# ---- 1) XSS: inject a payload into a product name, render storefront, alert must NOT fire
w.ev("window.__xss=false; window.alert=()=>{window.__xss=true;}")
payload = 'ولد<img src=x onerror="window.__xss=true">'
r = w.evp(f'''(async function(){{
  const p=DATA.products[0]; p.ar='{payload}'; saveData(); renderProducts();
  await new Promise(r=>setTimeout(r,300));
  const card=document.querySelector('#productGrid .card h3');
  return JSON.stringify({{alertFired:window.__xss, renderedAsText:card.textContent.includes('<img'), hasImgEl:!!card.querySelector('img'), text:card.textContent.slice(0,40)}});
}})()''')
out['xss'] = json.loads(r)

# ---- 2) negative price rejected
out['negprice'] = json.loads(w.evp('''(async function(){
  // reset to defaults first, then try adding a product with -5
  DATA=defaultData(); applyPricing(); saveData();
  document.getElementById('prodCat').value = DATA.categories[0].id;
  document.getElementById('prodAr').value='سعر سلبي';
  document.getElementById('prodEn').value='NegPrice';
  document.getElementById('prodPrice').value='-5';
  addProduct();
  const rejected1 = !DATA.products.some(p=>p.en==='NegPrice');
  document.getElementById('prodPrice').value='abc';
  addProduct();
  const rejected2 = !DATA.products.some(p=>p.en==='NegPrice');
  return JSON.stringify({negRejected: rejected1, abcRejected: !DATA.products.some(p=>p.en==='NegPrice')});
})()'''))

# ---- 3) footer comms re-render on language switch (page navigates, then re-query)
w.ev("localStorage.setItem('wanas_lang','ar')")
w.send('Page.navigate', {'url': f'http://localhost:8109/index.html?cb3={int(time.time())}'})
time.sleep(1.8)
lang_before = w.ev('document.documentElement.lang')
names_ar = w.ev('[...document.querySelectorAll("#footerCommsContainer a")].map(a=>a.textContent.trim())')
w.ev("document.getElementById('langBtn').click()")
time.sleep(0.5)
names_en = w.ev('[...document.querySelectorAll("#footerCommsContainer a")].map(a=>a.textContent)')
out['footcomms'] = {'langBefore': lang_before, 'ar': names_ar, 'en': names_en}

# ---- 4) reset restores settings too
r = json.loads(w.evp('''(async function(){
  // dirty settings first
  S.vodafone='01111111111'; S.brandAr='براند مزخرف'; saveSettings(); applyLangText();
  window.confirm=()=>true;
  document.getElementById('langBtn').click(); // back to AR if EN
  document.getElementById('resetBtn').click();
  await new Promise(r=>setTimeout(r,400));
  const lsSettings = JSON.parse(localStorage.getItem('wanas_settings'));
  return JSON.stringify({vodafoneAfter: lsSettings.vodafone, brandAfter: lsSettings.brandAr, prods: DATA.products.length});
})()'''))
out['reset'] = r

# ---- 5) hero size clamp: try 99 -> clamped to 6
r = json.loads(w.evp('''(async function(){
  document.getElementById('cfgHeroSize').value='99';
  document.getElementById('cfgBrandSize').value='99';
  saveBranding();
  return JSON.stringify({heroSize:S.heroSize, brandSize:S.brandSize});
})()'''))
out['clamp'] = r

# ---- 6) saveEditProd keeps p.market
r = json.loads(w.evp('''(async function(){
  DATA=defaultData(); applyPricing(); saveData();
  const p=DATA.products.find(x=>x.id==='p3');
  openEditProd('p3');
  document.getElementById('editProdPrice').value='80';
  saveEditProd();
  const after=DATA.products.find(x=>x.id==='p3');
  return JSON.stringify({marketKept: after.market===78, price: after.price});
})()'''))
out['market_kept'] = r

# ---- 7) link paste rejects non-image with a toast now
r = json.loads(w.evp('''(async function(){
  DATA=defaultData(); applyPricing(); saveData();
  document.getElementById('prodAddLinkBtn').click();
  const inp=document.getElementById('prodLinkInput');
  inp.style.display='block'; inp.value='https://example.com/file.txt';
  inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
  await new Promise(r=>setTimeout(r,300));
  return JSON.stringify({toastShown: document.getElementById('toast').textContent.length>0,
    toastText: document.getElementById('toast').textContent.slice(0,50)});
})()'''))
out['link_reject'] = r

print(json.dumps(out, ensure_ascii=False, indent=1))
print('CONSOLE:', w.console_errors())
