import sys, json, time
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

root = '/Users/ahmed.alghoraib/Desktop/Wanas'
server, port = launch_server(root)
browser, cdp_port = launch_browser()
try:
    url = f'http://127.0.0.1:{port}/index.html'
    w = Wanas(cdp_port, url)
    w.open()
    logged = w.login_admin('wanas123')
    results = []
    results.append('logged_in=' + str(logged))

    # ---------- TEST 1: products-only export ----------
    w.ev("""(()=>{
      window.__blob=null; window.__download=null;
      URL.createObjectURL=(b)=>{window.__blob=b; return 'blob:mock';};
      HTMLAnchorElement.prototype.click=function(){window.__download=this.download; return this;};
      document.getElementById('exportBtn').click();
      return 'clicked';
    })()""")
    import json as _j
    txt1 = w.evp("window.__blob ? window.__blob.text() : 'NOBLOB'")
    _j = json.loads(txt1)
    results.append('T1_download=' + str(w.ev("window.__download||'NA'")))
    results.append('T1_type=' + str(_j.get('type')))
    results.append('T1_has_categories=' + str('categories' in _j and isinstance(_j.get('categories'), list)))
    results.append('T1_has_products=' + str('products' in _j and isinstance(_j.get('products'), list)))
    results.append('T1_has_settings_key=' + str('settings' in _j))
    results.append('T1_nprods_exported=' + str(len(_j.get('products', []))))
    results.append('T1_nprods_live=' + str(w.ev("DATA.products.length")))
    results.append('T1_exportedAt_set=' + str('exportedAt' in _j))

    # ---------- TEST 2: full export ----------
    w.ev("""(()=>{
      window.__blob=null; window.__download=null;
      URL.createObjectURL=(b)=>{window.__blob=b; return 'blob:mock';};
      HTMLAnchorElement.prototype.click=function(){window.__download=this.download; return this;};
      document.getElementById('exportFullBtn').click();
      return 'clicked';
    })()""")
    txt2 = w.evp("window.__blob ? window.__blob.text() : 'NOBLOB'")
    f2 = json.loads(txt2)
    results.append('T2_type=' + str(f2.get('type')))
    results.append('T2_has_settings=' + str('settings' in f2 and isinstance(f2.get('settings'), dict)))
    results.append('T2_settings_password_key=' + str('password' in f2.get('settings', {})))
    results.append('T2_settings_wrongAttempts_key=' + str('wrongAttempts' in f2.get('settings', {})))
    results.append('T2_live_S_password=' + str(w.ev("typeof S.password")))

    # ---------- TEST 3: import products-only file ----------
    w.ev("""(()=>{
      var data={type:'products',categories:[{id:'cX',ar:'CatX',en:'CatX'}],
        products:[{id:'pX',cat:'cX',ar:'ProdX',en:'ProdXP',price:11,imgs:[]}]};
      var file=new File([JSON.stringify(data)],'prod.json',{type:'application/json'});
      var input=document.getElementById('importFile');
      var dt=new DataTransfer(); dt.items.add(file); input.files=dt.files;
      input.dispatchEvent(new Event('change',{bubbles:true}));
      return 'dispatched';
    })()""")
    time.sleep(0.5)
    results.append('T3_DATA_products_len=' + str(w.ev("DATA.products.length")))
    results.append('T3_DATA_first_id=' + str(w.ev("DATA.categories[0] && DATA.categories[0].id") if False else w.ev("DATA.products[0]?DATA.products[0].id:'NONE'")))
    results.append('T3_grid_has_ProdX=' + str(w.ev("document.getElementById('productGrid').textContent.indexOf('ProdX')>=0")))
    results.append('T3_toast=' + str(w.ev("document.getElementById('toast').textContent")))

    # ---------- TEST 4: import full backup ----------
    w.ev("""(()=>{
      var data={type:'full',
        categories:[{id:'cY',ar:'CatY',en:'CatY'}],
        products:[{id:'pY',cat:'cY',ar:'ProdY',en:'ProdYP',price:22,imgs:[]}],
        settings:{brandAr:'NEWBRAND_X', password:'EVILPASS', wrongAttempts:99}};
      var file=new File([JSON.stringify(data)],'full.json',{type:'application/json'});
      var input=document.getElementById('importFile');
      var dt=new DataTransfer(); dt.items.add(file); input.files=dt.files;
      input.dispatchEvent(new Event('change',{bubbles:true}));
      return 'dispatched';
    })()""")
    time.sleep(0.5)
    results.append('T4_S_brandAr=' + str(w.ev("S.brandAr")))
    results.append('T4_S_password_after=' + str(w.ev("typeof S.password+'='+(S.password===undefined?'undef':JSON.stringify(S.password))")))
    results.append('T4_S_wrongAttempts_after=' + str(w.ev("JSON.stringify(S.wrongAttempts)")))
    results.append('T4_cfgBrandAr_value=' + str(w.ev("document.getElementById('cfgBrandAr').value")))
    results.append('T4_has_Password_from_file_absent=' + str(w.ev("S.password===undefined||S.password!=='EVILPASS'")))
    results.append('T4_toast=' + str(w.ev("document.getElementById('toast').textContent")))

    # ---------- TEST 5: invalid file ----------
    before = w.ev("JSON.stringify({p:DATA.products.length,c:DATA.categories.length,brand:S.brandAr})")
    w.ev("""(()=>{
      window.__alertMsg=null; window.alert=function(m){window.__alertMsg=m;};
      var file=new File(['{"foo":1}'],'bad.json',{type:'application/json'});
      var input=document.getElementById('importFile');
      var dt=new DataTransfer(); dt.items.add(file); input.files=dt.files;
      input.dispatchEvent(new Event('change',{bubbles:true}));
      return 'dispatched';
    })()""")
    time.sleep(0.4)
    after = w.ev("JSON.stringify({p:DATA.products.length,c:DATA.categories.length,brand:S.brandAr})")
    results.append('T5_alert_called=' + str(w.ev("window.__alertMsg!==null")))
    results.append('T5_alert_msg=' + str(w.ev("window.__alertMsg")))
    results.append('T5_before=' + str(before))
    results.append('T5_after=' + str(after))
    results.append('T5_unchanged=' + str(before == after))

    # ---------- TEST 6: GitHub publish with mocked fetch ----------
    w.ev("""(()=>{
      window.__calls=[];
      window.__sha='sha_mock';
      window.fetch=function(url,opts){
        var m=opts&&opts.method?opts.method:'GET';
        window.__calls.push({url:String(url),method:m,body:opts&&opts.body?String(opts.body):null});
        if(m==='GET'){
          return Promise.resolve({ok:true,status:200,json:function(){return Promise.resolve({sha:window.__sha});}});
        }
        if(m==='PUT'){
          window.__sha='sha_after_put_1';
          return Promise.resolve({ok:true,status:200,json:function(){return Promise.resolve({content:{sha:'sha_after_put_1'}});}});
        }
        return Promise.resolve({ok:false,status:500,json:function(){return Promise.resolve({message:'x'});}});
      };
      localStorage.setItem('wanas_gh', JSON.stringify({token:'tok123'}));
      return 'mocked';
    })()""")
    w.ev("document.getElementById('ghPublishBtn').click();")
    time.sleep(0.8)
    ncalls = w.ev("window.__calls.length")
    results.append('T6_ncalls_first=' + str(ncalls))
    m0 = w.ev("window.__calls[0]&&window.__calls[0].method")
    u0 = w.ev("window.__calls[0]&&(window.__calls[0].url)")
    results.append('T6_call0_method=' + str(m0))
    results.append('T6_call0_url=' + str(u0))
    m1 = w.ev("window.__calls[1]&&window.__calls[1].method")
    results.append('T6_call1_method=' + str(m1))
    body1 = w.ev("window.__calls[1]&&window.__calls[1].body")
    bj = json.loads(body1)
    results.append('T6_put1_sha=' + str(bj.get('sha')))
    results.append('T6_put1_has_message=' + str('message' in bj))
    results.append('T6_put1_has_branch=' + str(bj.get('branch')))
    content_bytes = __import__('base64').b64decode(bj['content']).decode('utf-8')
    content_json = json.loads(content_bytes)
    results.append('T6_content_decodes=' + str(isinstance(content_json, dict)))
    results.append('T6_content_has_categories=' + str('categories' in content_json))
    results.append('T6_content_has_products=' + str('products' in content_json))
    results.append('T6_content_products_len=' + str(len(content_json.get('products', []))))
    results.append('T6_content_settings_pw_absent=' + str('password' not in content_json.get('settings', {})))
    results.append('T6_status=' + str(w.ev("document.getElementById('ghStatus').textContent")))

    # ---------- Second publish (sha reuse bug check) ----------
    w.ev("""(()=>{ window.__calls=[]; return 'reset'; })()""")
    w.ev("document.getElementById('ghPublishBtn').click();")
    time.sleep(0.8)
    calls2 = w.ev("window.__calls.length")
    results.append('T7_ncalls_second=' + str(calls2))
    body2 = w.ev("window.__calls[1]?window.__calls[1].body:null")
    bj2 = json.loads(body2) if body2 else {}
    results.append('T7_put2_sha=' + str(bj2.get('sha')))
    results.append('T7_put2_sha_is_new=' + str(bj2.get('sha') == 'sha_after_put_1'))
    results.append('T7_put2_sha_stale_or_missing=' + str(bj2.get('sha') in (None, 'sha_mock')))
    results.append('T7_status=' + str(w.ev("document.getElementById('ghStatus').textContent")))

    for r in results:
        print(r)
finally:
    stop_all(server, browser)