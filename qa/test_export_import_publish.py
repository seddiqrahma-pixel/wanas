#!/usr/bin/env python3
"""E1-E10 exhaustive export / import / publish tests for Wanas index.html."""
import json, time, sys
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

WORKING, BUGS, CNT = [], [], {}
AGR = {}

def A(name, ok, extra=""):
    AGR[name] = {"ok": bool(ok), "extra": extra}
    return ok

def block(name, checks):
    """checks: list of (label, bool, extra)"""
    for label, ok, extra in checks:
        A(f"{name}:{label}", ok, extra)
    if all(ok for _, ok, _ in checks):
        WORKING.append(name)
    else:
        fails = [l for l, ok, _ in checks if not ok]
        extras = [e for _, ok, e in checks if not ok and e]
        BUGS.append(f"{name} FAILED: {'; '.join(fails)} {extras}")
    CNT[name] = sum(1 for _, ok, _ in checks if ok)

def shot(name):
    pass  # console errors collected at end

server = browser = w = None
def start():
    global server, browser, w
    server = launch_server('/Users/ahmed.alghoraib/Desktop/Wanas')
    browser = launch_browser()
    w = Wanas(browser[1], f'http://127.0.0.1:{server[1]}/index.html')
    w.open()

def fresh(stub=True):
    w.send('Page.navigate', {'url': f'http://127.0.0.1:{server[1]}/index.html'})
    time.sleep(1.6)
    w.ev("try{localStorage.clear();sessionStorage.clear();}catch(e){}")
    w.send('Page.navigate', {'url': f'http://127.0.0.1:{server[1]}/index.html'})
    time.sleep(1.6)
    if stub:
        w.ev("""
(function(){
  window.__texts=[]; window.__n=0; window.__blobMap={};
  URL.createObjectURL = function(b){ var u='blob:m-'+(++window.__n); window.__blobMap[u]=b; return u; };
  URL.revokeObjectURL = function(){};
  HTMLAnchorElement.prototype.click = function(){
    var e=window.__blobMap[this.href];
    if(e && e.text) e.text().then(function(t){ window.__texts.push(t); });
    window.__clicks=(window.__clicks||0)+1;
  };
})();
""")

def click_export(btn="exportBtn"):
    w.ev(f"document.getElementById('{btn}').click();")

def snap_export():
    time.sleep(0.35)
    return w.evp("(async()=>{ await new Promise(r=>setTimeout(r,600)); return (window.__texts||[]).length ? window.__texts[window.__texts.length-1] : ''; })()")

def do_import(json_str, name="imp.json"):
    s = ("(new Promise((res)=>{const dt=new DataTransfer();"
         f"dt.items.add(new File([{json.dumps(json_str)}], {json.dumps(name)}, {{type:'application/json'}}));"
         "const inp=document.getElementById('importFile');inp.files=dt.files;"
         "inp.dispatchEvent(new Event('change'));"
         "setTimeout(()=>res(JSON.stringify({toast:document.getElementById('toast').textContent,"
         "alert:window.__lastAlert!==undefined?window.__lastAlert:null})),650);}))")
    return w.evp(s)

def snap():
    return w.ev("""JSON.stringify({
      catIds:DATA.categories.map(c=>c.id),
      prodIds:DATA.products.map(p=>p.id),
      prod0:DATA.products[0]?DATA.products[0].ar:null,
      grid:document.querySelectorAll('#productGrid .card').length,
      gridHTML:(document.getElementById('productGrid').textContent||'').trim().slice(0,150),
      toast:document.getElementById('toast').textContent,
      brandAr:document.getElementById('cfgBrandAr')?document.getElementById('cfgBrandAr').value:null,
      spw:S.password===undefined?'unset':S.password,
      swa:S.wrongAttempts===undefined?'unset':S.wrongAttempts,
      lspw:localStorage.getItem('wanas_adminPW'),
      vod:S.vodafone})""")

IMP_P = json.dumps({"type":"products","exportedAt":"2026-01-01T00:00:00Z",
    "categories":[{"id":"c1","ar":"شموع","en":"Candles"}],
    "products":[{"id":"p1","cat":"c1","ar":"منتج الاستيراد","en":"Imported product",
                 "descAr":"وصف","descEn":"desc","price":50,"imgs":[]}]}, ensure_ascii=False)

IMP_FULL = json.dumps({"type":"full","exportedAt":"2026-01-01T00:00:00Z",
    "categories":[{"id":"c9","ar":"أصناف كاملة","en":"Full cats"}],
    "products":[{"id":"p2","cat":"c9","ar":"كامل","en":"Full import","descAr":"وصف","descEn":"desc","price":99,"imgs":[]}],
    "settings":{"brandAr":"وَنَس QA","brandEn":"Wanas QA","brandColor":"#ff0000",
                "password":"hacked-pass","wrongAttempts":9,
                "vodafone":"01555555555","email":"qa@test.com"}}, ensure_ascii=False)

# ---------- E1 ----------
def E1():
    fresh()
    click_export("exportBtn")
    txt = snap_export()
    try:
        d = json.loads(txt)
    except Exception as e:
        block("E1", [("parse", False, str(e))]); return
    block("E1", [
        ("type==products", d.get('type') == 'products', f"type={d.get('type')}"),
        ("exportedAt", bool(d.get('exportedAt')), ""),
        ("categories array", isinstance(d.get('categories'), list), ""),
        ("products len 30", len(d.get('products', [])) == 30, f"len={len(d.get('products',[]))}"),
        ("no settings key", 'settings' not in d, str(list(d.keys()))),
        ("no password anywhere", 'password' not in txt, ""),
    ])

# ---------- E2 ----------
def E2():
    click_export("exportFullBtn")
    txt = snap_export()
    try:
        d = json.loads(txt)
    except Exception as e:
        block("E2", [("parse", False, str(e))]); return
    s = d.get('settings') or {}
    block("E2", [
        ("type==full", d.get('type') == 'full', f"type={d.get('type')}"),
        ("has settings obj", isinstance(s, dict) and len(s) > 0, str(list(d.keys()))),
        ("no password", 'password' not in s, ""),
        ("no wrongAttempts", 'wrongAttempts' not in s, ""),
    ])

# ---------- E3 ----------
def E3():
    fresh()
    do_import(IMP_P)
    d = json.loads(snap())
    block("E3", [
        ("DATA updated", d['prodIds'] == ['p1'] and d['catIds'] == ['c1'], str(d['prodIds'])),
        ("storefront grid 1 card", d['grid'] == 1, f"grid={d['grid']}"),
        ("toast exact", d['toast'] == 'تم استيراد المنتجات والأصناف ✅', repr(d['toast'])),
    ])

# ---------- E4 ----------
def E4():
    fresh()
    do_import(IMP_FULL)
    d = json.loads(snap())
    block("E4", [
        ("brandAr reflected in branding form", d['brandAr'] == 'وَنَس QA', repr(d['brandAr'])),
        ("password NOT imported", d['spw'] == 'unset', str(d['spw'])),
        ("wrongAttempts NOT imported", d['swa'] == 'unset', str(d['swa'])),
        ("other settings applied", d['vod'] == '01555555555', str(d['vod'])),
        ("toast exact", d['toast'] == 'تم استيراد النسخة الكاملة (منتجات + إعدادات) ✅', repr(d['toast'])),
    ])

# ---------- E5 ----------
def E5():
    fresh()
    do_import(IMP_P)
    before = snap()
    w.ev("window.__lastAlert=undefined; window.__alerts=[]; window.alert=function(m){window.__alerts.push(String(m)); window.__lastAlert=String(m);};")
    r1 = do_import("this is not json {{{", "bad.json")
    r2 = do_import(json.dumps({"foo":"bar","x":1}), "noarr.json")
    after = snap()
    a = json.loads(w.ev("JSON.stringify(window.__alerts)") or "[]")
    block("E5", [
        ("non-JSON invalid alert", a.count('ملف غير صالح') >= 1, str(a)),
        ("no-arrays invalid alert", a.count('ملف غير صالح') >= 2, str(a)),
        ("data unchanged", before == after, f"before!={after}" if before != after else ""),
    ])

# ---------- E6 ----------
def E6():
    fresh()
    do_import(json.dumps({"type":"products","categories":[],"products":[]}))
    d = json.loads(snap())
    empty_ui = ('فارغ' in d['gridHTML'] or 'empty' in d['gridHTML'].lower() or 'لا توجد' in d['gridHTML'] or d['grid']==0)
    block("E6", [
        ("empty arrays accepted", d['prodIds'] == [] and d['catIds'] == [], str(d)),
        ("empty storefront UI docs", empty_ui, repr(d['gridHTML'])),
    ])
    CNT['E6:empty_ui_text'] = d['gridHTML']

# ---------- E7 ----------
def E7():
    fresh()
    legacy = json.dumps({"categories":[{"id":"c1","ar":"قديم","en":"Legacy"}],
        "products":[{"id":"p7","cat":"c1","ar":"قديم","en":"LegacyP","descAr":"x","descEn":"y","price":15,"imgs":[]}]}, ensure_ascii=False)
    do_import(legacy)
    d = json.loads(snap())
    block("E7", [
        ("legacy imports fine", d['prodIds'] == ['p7'], str(d['prodIds'])),
        ("legacy toast products", d['toast'] == 'تم استيراد المنتجات والأصناف ✅', repr(d['toast'])),
    ])

# ---------- E8 ----------
def E8():
    fresh()
    do_import(IMP_P)
    before_ids = json.loads(snap())['prodIds']
    click_export("exportBtn")
    txt = snap_export()
    try:
        d = json.loads(txt)
        src = json.loads(IMP_P)
        block("E8", [
            ("roundtrip prod ids equal", d['products'] == src['products'], str(d['products'])),
            ("roundtrip cats equal", d['categories'] == src['categories'], str(d['categories'])),
            ("DATA ids stable", before_ids == ['p1'], str(before_ids)),
        ])
    except Exception as e:
        block("E8", [("roundtrip", False, str(e))])

# ---------- E9 ----------
def E9():
    fresh()
    res = w.evp("""(async()=>{
      document.getElementById('exportBtn').click();
      document.getElementById('exportBtn').click();
      await new Promise(r=>setTimeout(r,600));
      let v=0; for(const t of (window.__texts||[])){ try{ const d=JSON.parse(t); if(d.type==='products'&&Array.isArray(d.products)&&Array.isArray(d.categories)) v++; }catch(e){} }
      return JSON.stringify({n:(window.__texts||[]).length, v, clicks:window.__clicks||0});
    })()""")
    d = json.loads(res) if res else {}
    block("E9", [
        ("2 clicks fired", d['clicks'] == 2, str(d)),
        ("2 valid outputs", d['v'] == 2 and d['n'] == 2, str(d)),
    ])

# ---------- E10 ----------
def E10():
    fresh()
    do_import(IMP_FULL)
    res = w.evp("""
(async()=>{
  const page = (function(){
    const cls=[...document.querySelectorAll('script')];
    for(const s of cls){ const t=s.textContent||'';
      if(t.includes('PUBLISHED_DATA:BEGIN')) return '<!DOCTYPE html><html><head></head><body><script>'+t+'</'+'script></body></html>';
    }
    return '';
  })();
  window.__page=page;
  window.__puts=[]; window.__shaSeq=0;
  window.__mockSha=()=> 'sha-'+(++window.__shaSeq)+'-'+Math.random().toString(36).slice(2,7);
  window.fetch=function(url,opts){
    const u=String(url);
    if(u.includes('api.github.com') && u.includes('/contents/index.html')){
      if(opts && opts.method==='PUT'){
        const body=JSON.parse(opts.body);
        window.__puts.push(body);
        const nextSha=window.__mockSha();
        return Promise.resolve({ok:true,json:async()=>({content:'mock',sha:nextSha})});
      }
      return Promise.resolve({ok:true,
        json:async()=>({content:btoa(unescape(encodeURIComponent(window.__page))),sha:window.__mockSha()})});
    }
    return Promise.reject(new Error('unexpected fetch '+u));
  };
  return 'ok';
})()""")
    if res != 'ok':
        block("E10", [("mock setup", False, str(res))]); return
    put = w.evp("""
(async()=>{
  try{
    document.getElementById('ghToken').value='qa-mock-token';
    document.getElementById('ghPublishBtn').click();
    await new Promise(r=>setTimeout(r,700));
    const last=window.__puts[window.__puts.length-1];
    if(!last) return JSON.stringify({err:'no PUT'});
    const decoded=(new Function('return atob')) ? decodeURIComponent(escape(atob(last.content))) : null;
    const m = decoded.match(/const PUBLISHED_DEFAULTS = (\\{[\\s\\S]*?\\});\\s*\\/\\* PUBLISHED_DATA:END/);
    let pub = m ? JSON.parse(m[1]) : null;
    return JSON.stringify({sha:last.sha, msg:last.message,
      decOK:!!decoded, pubOK:!!pub,
      catLen:pub?pub.categories.length:null, prodLen:pub?pub.products.length:null,
      prod0:pub&&pub.products[0]?pub.products[0].ar:null,
      settings:pub?pub.settings:null});
  }catch(e){ return JSON.stringify({err:String(e), stack:String(e&&e.stack).slice(0,300)}); }
})()""")
    try:
        r = json.loads(put)
    except Exception as e:
        block("E10", [("cycle1", False, f"bad PUT {put} | {e}")]); return
    s = r.get('settings') or {}
    block("E10:cycle1", [
        ("PUT captured", 'err' not in r, str(r.get('err'))),
        ("PUBLISHED block decoded", r.get('pubOK'), str(r.get('err'))),
        ("block has imported cats+prods", r.get('catLen') == 1 and r.get('prodLen') == 1, f"{r.get('catLen')},{r.get('prodLen')}"),
        ("block prod title", r.get('prod0') == 'كامل', str(r.get('prod0'))),
        ("no password in block settings", 'password' not in s, str(list(s.keys()))),
        ("no wrongAttempts in block settings", 'wrongAttempts' not in s, str(list(s.keys()))),
        ("block settings brandAr", s.get('brandAr') == 'وَنَس QA', repr(s.get('brandAr'))),
    ])
    # E10:2nd-3rd cycles - sha advances each PUT, status text correct
    cyc = w.evp("""
(async()=>{
  const out=[]; let last=null;
  for(let i=0;i<3;i++){
    window.__puts=[]; last=null;
    try{
      document.getElementById('ghToken').value='qa-tok-'+i;
      document.getElementById('ghPublishBtn').click();
      await new Promise(r=>setTimeout(r,1000));
      last=window.__puts[window.__puts.length-1]||null;
    }catch(e){}
    out.push({
      put:!!(last),
      sha:last?last.sha:null,
      msg:last?last.message:null,
      st:document.getElementById('ghStatus').textContent,
      btnDisabled:document.getElementById('ghPublishBtn').disabled
    });
  }
  return JSON.stringify(out);
})()""")
    try:
        cyc = json.loads(cyc)
    except Exception as e:
        block("E10:cycles", [("cycles", False, str(cyc))]); return
    shas = [c['sha'] for c in cyc]
    block("E10:3cycles", [
        ("each cycle has PUT", all(c['put'] for c in cyc), str(cyc)),
        ("sha advances each PUT", len(set(shas)) == 3 and all(shas), str(shas)),
        ("commit msg correct", all(c['msg'] == 'Wanas update (admin panel)' for c in cyc), str([c['msg'] for c in cyc])),
        ("status text correct", all(('نشر' in c['st'] or 'تم' in c['st'] or 'Published' in c['st'] or 'GitHub' in c['st']) for c in cyc), str([c['st'] for c in cyc])),
        ("button re-enabled", all(not c['btnDisabled'] for c in cyc), str([c['btnDisabled'] for c in cyc])),
    ])
    CNT['E10:cycle1_sha'] = r.get('sha')

def run():
    start()
    E1(); E2(); E3(); E4(); E5(); E6(); E7(); E8(); E9(); E10()
    console = w.console_errors() if w else []
    for name, v in AGR.items():
        if not v['ok']:
            console_note = ""
    res = {"summary": '', "working": WORKING, "bugs": BUGS, "counts": CNT, "console_errors": console}
    res["counts"]["checks_passed"] = sum(1 for v in AGR.values() if v['ok'])
    res["counts"]["checks_total"] = len(AGR)
    res["counts"]["console_errors_per_page"] = len(console)
    stop_all(server, browser)
    print(json.dumps(res, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    run()
