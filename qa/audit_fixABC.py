import json, time, sys
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas

w = Wanas(9321, 'http://localhost:8103/index.html?v=6')
w.open()
w.ev("localStorage.clear()")
w.send('Page.navigate', {'url':'http://localhost:8103/index.html?v=7'})
time.sleep(1.6)

# ---- Bug A: brand word in header honors settings ----
resA = w.ev("""(function(){
  var before = document.querySelector('span[data-i18n="brand"]').textContent;
  // set settings directly (as saveBranding would) and re-apply lang
  S.brandAr = 'StrongTEST-ar'; S.brandEn = 'StrongTEST-en';
  applyLang();
  var header = document.querySelector('.logo span[data-i18n="brand"]').textContent;
  var footer = document.querySelector('footer span[data-i18n="brand"]').textContent;
  return JSON.stringify({before:before, header:header, footer:footer});
})()""")
print("BUG A brand word:", resA)

# ---- Bug B: renderBrandingForm reflects settings after login + import ----
resB = w.ev("""(function(){
  // login
  document.getElementById('adminBtn').style.display='';
  document.getElementById('adminBtn').click();
  document.getElementById('adminPass').value='wanas123';
  document.getElementById('adminLoginBtn').click();
  // set S (simulating an import) then renderAdmin should refresh the form
  S.brandAr='IMPORTED_AR'; S.brandEn='IMPORTED_EN';
  renderAdmin();
  var fieldAr = document.getElementById('cfgBrandAr').value;
  return JSON.stringify({unlocked: !document.getElementById('adminPanel').classList.contains('hidden'),
                         fieldAr: fieldAr});
})()""")
print("BUG B form refresh:", resB)

# ---- Bug C: tooltips on langBtn/adminBtn ----
resC = w.ev("""(function(){
  var lang = document.getElementById('langBtn').title;
  var admin = document.getElementById('adminBtn').title;
  // flip to english and check again
  document.getElementById('langBtn').click();
  var langEn = document.getElementById('langBtn').title;
  var adminEn = document.getElementById('adminBtn').title;
  return JSON.stringify({langAr:lang, adminAr:admin, langEn:langEn, adminEn:adminEn});
})()""")
print("BUG C tooltips:", resC)

# ---- verify bug A actually persisted through saveBranding (real path) ----
resA2 = w.ev("""(function(){
  // simulate a real save via the form then check header
  document.getElementById('cfgBrandAr').value = 'وَنَس عربي';
  document.getElementById('cfgBrandEn').value = 'Wanas EN';
  saveBranding();
  applyLang();
  var header = document.querySelector('.logo span[data-i18n="brand"]').textContent;
  // english now
  document.getElementById('langBtn').click(); // -> en? check
  var headerEn = document.querySelector('.logo span[data-i18n="brand"]').textContent;
  return JSON.stringify({headerArAfter: header, headerEnAfter: headerEn});
})()""")
print("BUG A save path:", resA2)

print("CONSOLE:", w.console_errors())