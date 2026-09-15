import json, time, sys
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas

w = Wanas(9331, 'http://localhost:8105/index.html?v=t1')
w.open()
w.ev("localStorage.clear()")
w.send('Page.navigate', {'url':'http://localhost:8105/index.html?v=t2'})
time.sleep(1.6)
print("boot:", w.ev("JSON.stringify({prods:DATA.products.length, cats:DATA.categories.length})"), "| err:", w.console_errors())

# The full mocked publish round-trip: GET index.html -> swap block -> PUT; then verify
# the "repo" html (captured PUT body) produces a page whose DATA equals what was published.
JS = r'''(async function(){
  let repoHtml = null, putBody = null;
  const b64 = s => btoa(unescape(encodeURIComponent(s)));
  window.fetch = async (url, opts) => {
    if(String(url).includes('api.github.com') && url.endsWith('/contents/index.html')){
      if(!opts || opts.method === 'GET' || !opts.method){
        return { ok:true, status:200, json: async () => ({ sha:'sha_page_1', content: btoa(unescape(encodeURIComponent(repoHtml))) }) };
      }
      if(opts.method === 'PUT'){
        putBody = JSON.parse(opts.body);
        repoHtml = decodeURIComponent(escape(atob(putBody.content)));   // simulate the repo updating
        return { ok:true, status:200, json: async () => ({ commit:{sha:'sha_new'} }) };
      }
    }
    return window.__realFetch ? window.__realFetch(url, opts) : fetch(url, opts);
  };
  window.__realFetch = null; // all fetch is mocked in this test

  // login and modify the store
  document.getElementById('adminBtn').style.display='';
  document.getElementById('adminBtn').click();
  document.getElementById('adminPass').value='wanas123';
  document.getElementById('adminLoginBtn').click();
  DATA.products[0].price = 999;
  const exactCats = JSON.parse(JSON.stringify(DATA.categories));
  const exactProds = JSON.parse(JSON.stringify(DATA.products));

  await publishToGitHub();
  const toast = document.getElementById('toast').textContent;

  // Now run the PUBLISHED html's data through the same loader logic the site uses
  const m = repoHtml.match(/PUBLISHED_DATA:BEGIN([\s\S]*?)PUBLISHED_DATA:END/);
  const block = m[1];
  const fnPayload = block.replace('const PUBLISHED_DEFAULTS =', 'return') + ';';
  const parsed = new Function(fnPayload)();
  const sameProds = JSON.stringify(parsed.products) === JSON.stringify(exactProds);
  const sameCats  = JSON.stringify(parsed.categories) === JSON.stringify(exactCats);
  // settings present and password-free?
  const s = parsed.settings || {};
  const cleanSettings = !('password' in s) && !('wrongAttempts' in s) && s.vodafone !== undefined;
  return JSON.stringify({toast, prods: parsed.products.length, prodPrice0: parsed.products[0].price,
                         sameProds, sameCats, hasSettings: !!parsed.settings, settingsClean: cleanSettings,
                         blockFirst80: block.trim().slice(0,80)});
})()'''
r = w.evp(JS)
print("publish round-trip:", r)
