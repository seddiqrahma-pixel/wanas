import json, sys, time, base64
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all, free_port

ROOT='/Users/ahmed.alghoraib/Desktop/Wanas'
results=[]
def check(name,ok,detail):
    results.append((name,ok,detail)); print(('PASS' if ok else 'FAIL'),name,json.dumps(detail,ensure_ascii=False))

server=launch_server(ROOT); env,cdp=launch_browser()
w=Wanas(cdp,f'http://127.0.0.1:{server[1]}/index.html')
w.open(); w.ev("localStorage.setItem('wanas_lang','en'); LANG='en';")
print('login',w.login_admin())

# Fresh-input dispatch helper: uses the REAL #importFile.onchange handler on a fresh input so 'change' fires naturally every time.
DISPATCH = (
    "window.__dperr=null;try{"
    "const file=new File([window.__impJson], window.__impName||'x.json', {type:'application/json'});"
    "const tmp=document.createElement('input');tmp.type='file';"
    "tmp.onchange=document.getElementById('importFile').onchange;"
    "const dt=new DataTransfer();dt.items.add(file);tmp.files=dt.files;"
    "document.body.appendChild(tmp);tmp.dispatchEvent(new Event('change',{bubbles:true}));tmp.remove();"
    "}catch(e){window.__dperr=String(e&&e.stack||e);}"
)

DATA=f"""
window.__alertMsgs=[]; window.alert=function(m){{ window.__alertMsgs.push(String(m)); }};
"""

print('base products:', w.ev("DATA.products.length"))

# ---------- TEST 1: #exportBtn ----------
w.ev("window.__e1={}; URL.createObjectURL=function(b){window.__e1.p= b.text().then(t=>{window.__e1.d=t;});return 'blob:m'}; HTMLAnchorElement.prototype.click=function(){window.__e1.dl=this.download;};")
w.ev("document.getElementById('exportBtn').click();"); w.evp("window.__e1.p")
j=json.loads(w.ev("window.__e1.d"))
check('T1 exportBtn type=products', j.get('type')=='products', {'type':j.get('type')})
check('T1 exportBtn categories list', isinstance(j.get('categories'),list), {'catLen':len(j['categories'])})
check('T1 exportBtn products list', isinstance(j.get('products'),list), {'prodLen':len(j['products'])})
check('T1 exportBtn NO settings key', 'settings' not in j, {'hasSettings':'settings' in j})
check('T1 exportBtn download=wanas-products.json', w.ev("window.__e1.dl")=='wanas-products.json', {'dl':w.ev("window.__e1.dl")})

# ---------- TEST 2: #exportFullBtn ----------
w.ev("window.__e2={}; URL.createObjectURL=function(b){window.__e2.p= b.text().then(t=>{window.__e2.d=t;});return 'blob:m'}; HTMLAnchorElement.prototype.click=function(){window.__e2.dl=this.download;};")
w.ev("document.getElementById('exportFullBtn').click();"); w.evp("window.__e2.p")
j2=json.loads(w.ev("window.__e2.d"))
st=j2.get('settings',{})
check('T2 exportFullBtn type=full', j2.get('type')=='full', {'type':j2.get('type')})
check('T2 exportFullBtn settings dict', isinstance(st,dict), {})
check('T2 exportFullBtn settings NO password', 'password' not in st, {'hasPassword':'password' in st})
check('T2 exportFullBtn settings NO wrongAttempts', 'wrongAttempts' not in st, {'hasWA':'wrongAttempts' in st})
check('T2 exportFullBtn has categories/products', isinstance(j2.get('categories'),list) and isinstance(j2.get('products'),list), {'catLen':len(j2['categories']),'prodLen':len(j2['products'])})
check('T2 exportFullBtn download=wanas-backup-full.json', w.ev("window.__e2.dl")=='wanas-backup-full.json', {'dl':w.ev("window.__e2.dl")})

# ---------- TEST 3: import products-only ----------
w.ev("activeCat='all';"+DATA)
w.ev("window.__impJson="+json.dumps(json.dumps({'type':'products','exportedAt':'x','categories':[{'id':'c1','ar':'س','en':'C'}],'products':[{'id':'p1','cat':'c1','ar':'أ','en':'A','price':5,'descAr':'d','descEn':'d'},{'id':'p2','cat':'c1','ar':'ب','en':'B','price':6,'descAr':'d','descEn':'d'}]}))+"; window.__impName='wanas-products.json';")
w.ev(DISPATCH); time.sleep(0.6)
s3=w.ev("({prod:DATA.products.length, cards:document.querySelectorAll('#productGrid .card').length, toast:document.getElementById('toast').textContent, brandAr:S.brandAr})")
check('T3 products-only updates DATA', s3['prod']==2, s3)
check('T3 products-only updates grid', s3['cards']==2, {'cards':s3['cards']})
check('T3 products-only toast', s3['toast']=="Imported products & categories ✅", {'toast':s3['toast']})
check('T3 products-only does NOT touch settings', s3['brandAr']!="PO_BRAND", {'brandAr':s3['brandAr']})

# ---------- TEST 4: import full backup ----------
w.ev("activeCat='all';")
w.ev("window.__impJson="+json.dumps(json.dumps({'type':'full','exportedAt':'x','categories':[{'id':'c2','ar':'ك','en':'F'}],'products':[{'id':'q1','cat':'c2','ar':'ن','en':'N','price':9,'descAr':'d','descEn':'d'}],'settings':{'brandAr':'FULL_BRAND','brandEn':'FB','password':'EVIL','wrongAttempts':99}}))+"; window.__impName='wanas-backup-full.json';")
w.ev(DISPATCH); time.sleep(0.6)
s4=w.ev("({dperr:window.__dperr, onch:typeof document.getElementById('importFile').onchange==='function', prod:DATA.products.length, cards:document.querySelectorAll('#productGrid .card').length, toast:document.getElementById('toast').textContent, brandAr:S.brandAr, pwd:('password' in S), wa:('wrongAttempts' in S), waVal:S.wrongAttempts})")
print('T4 debug dperr=',s4['dperr'],'onch=',s4['onch'])
check('T4 full updates DATA', s4['prod']==1, s4)
check('T4 full updates grid', s4['cards']==1, {'cards':s4['cards']})
check('T4 full applies brandAr settings', s4['brandAr']=="FULL_BRAND", {'brandAr':s4['brandAr']})
check('T4 full does NOT import password', s4['pwd'] is False, {'pwd':s4['pwd']})
check('T4 full does NOT import wrongAttempts', s4['wa'] is False, {'wa':s4['wa']})
check('T4 full toast (full msg)', s4['toast']=="Imported full backup (products + settings) ✅", {'toast':s4['toast']})

# ---------- TEST 5: invalid file ----------
pre5=w.ev("DATA.products.length")
w.ev(DATA)
w.ev("window.__impJson='{ not valid json {{{'; window.__impName='bad.json';")
w.ev(DISPATCH); time.sleep(0.5)
b5=w.ev("({prod:DATA.products.length, alerts:window.__alertMsgs})")
check('T5 invalid non-JSON triggers alert', b5['alerts']==["Invalid file"], {'alerts':b5['alerts']})
check('T5 invalid non-JSON no data change', b5['prod']==pre5, {'pre':pre5,'now':b5['prod']})
# structurally invalid (valid JSON, missing arrays)
pre5b=w.ev("DATA.products.length")
w.ev(DATA)
w.ev("window.__impJson="+json.dumps(json.dumps({'type':'products','foo':1}))+"; window.__impName='bad2.json';")
w.ev(DISPATCH); time.sleep(0.5)
b5b=w.ev("({prod:DATA.products.length, alerts:window.__alertMsgs})")
check('T5 invalid-json-no-arrays triggers alert', b5b['alerts']==["Invalid file"], {'alerts':b5b['alerts']})
check('T5 invalid-json-no-arrays no data change', b5b['prod']==pre5b, {'pre':pre5b,'now':b5b['prod']})

# ---------- TEST 6: GitHub publish ----------
w.ev("ghSave({token:'tok_x'});")
w.ev("""
window.__gh={gets:0,puts:0,bodies:[],cur:null};
window.fetch=function(url,opts){opts=opts||{};var m=(opts.method||'GET').toUpperCase();
 if(String(url).includes('api.github.com')){
  if(m==='GET'){window.__gh.gets++;return Promise.resolve({ok:true,json:function(){return Promise.resolve(window.__gh.cur?{sha:window.__gh.cur}:{sha:'sha_mock'});}});}
  if(m==='PUT'){window.__gh.puts++;var b=JSON.parse(opts.body);window.__gh.bodies.push(b);window.__gh.cur='sha_after_put_'+window.__gh.puts;return Promise.resolve({ok:true,json:function(){return Promise.resolve({content:{sha:'sha_new'}});}});}
 }return Promise.resolve({ok:true,json:function(){return Promise.resolve({});}});};""")
w.ev("document.getElementById('ghPublishBtn').click();"); time.sleep(0.7)
g1=w.ev("({gets:window.__gh.gets,puts:window.__gh.puts,bodies:window.__gh.bodies,toast:document.getElementById('toast').textContent,status:document.getElementById('ghStatus').textContent,dis:document.getElementById('ghPublishBtn').disabled})")
check('T6p1 GET happened', g1['gets']==1, {'gets':g1['gets']})
check('T6p1 PUT happened', g1['puts']==1, {'puts':g1['puts']})
pb1=g1['bodies'][0] if g1['bodies'] else {}
check('T6p1 PUT body has sha=sha_mock', pb1.get('sha')=='sha_mock', {'sha':pb1.get('sha')})
dec=None
try: dec=json.loads(base64.b64decode(pb1['content']).decode('utf-8')); ok=True
except Exception as e: ok=False; dec={'err':str(e)}
check('T6p1 content decodes to JSON', ok, {'decoded':isinstance(dec,dict)})
cur=json.loads(json.dumps(w.ev("({c:DATA.categories,p:DATA.products,s:(function(){var x=Object.assign({},S);delete x.password;delete x.wrongAttempts;return x;})()})")))
if isinstance(dec,dict):
    check('T6p1 payload matches DATA categories', dec.get('categories')==cur['c'], {'m':dec.get('categories')==cur['c']})
    check('T6p1 payload matches DATA products', dec.get('products')==cur['p'], {'m':dec.get('products')==cur['p']})
    check('T6p1 payload settings == S sans pwd/wa', dec.get('settings')==cur['s'], {'m':dec.get('settings')==cur['s']})
    check('T6p1 payload settings NO password', 'password' not in (dec.get('settings') or {}), {'h':'password' in (dec.get('settings') or {})})
check('T6p1 toast success', g1['toast']=="✓ published", {'toast':g1['toast']})
check('T6p1 button re-enabled', g1['dis'] is False, {'dis':g1['dis']})

# ---------- SECOND publish (stateful GET new sha after each PUT) ----------
w.ev("""
window.__gh2={gets:0,puts:0,bodies:[]};window.__gh$cur='sha_mock';
window.fetch=function(url,opts){opts=opts||{};var m=(opts.method||'GET').toUpperCase();
 if(String(url).includes('api.github.com')){
  if(m==='GET'){window.__gh2.gets++;return Promise.resolve({ok:true,json:function(){return Promise.resolve({sha:window.__gh$cur});}});}
  if(m==='PUT'){window.__gh2.puts++;var b=JSON.parse(opts.body);window.__gh2.bodies.push(b);window.__gh$cur='sha_fresh_'+window.__gh2.puts;return Promise.resolve({ok:true,json:function(){return Promise.resolve({content:{sha:window.__gh$cur}});}});}
 }return Promise.resolve({ok:true,json:function(){return Promise.resolve({});}});};""")
w.ev("document.getElementById('ghPublishBtn').click();"); time.sleep(0.7)   # 1st pub on stateful mock
g2=w.ev("({gets:window.__gh2.gets,puts:window.__gh2.puts,bodies:window.__gh2.bodies})")
check('T6p2 GET1 happened', g2['gets']==1, {'gets':g2['gets']})
check('T6p2 PUT1 body sha=sha_mock', g2['bodies'][0].get('sha')=='sha_mock', {'sha':g2['bodies'][0].get('sha')})
w.ev("document.getElementById('ghPublishBtn').click();"); time.sleep(0.7)   # 2nd pub on stateful mock -> GET returns sha_fresh_1
g3=w.ev("({gets:window.__gh2.gets,puts:window.__gh2.puts,bodies:window.__gh2.bodies})")
check('T6p2 GET2 happened', g3['gets']==2, {'gets':g3['gets']})
check('T6p2 PUT2 body sha = NEWLY returned sha (sha_fresh_1)', g3['bodies'][1].get('sha')=='sha_fresh_1', {'sha':g3['bodies'][1].get('sha'),'allShas':[b.get('sha') for b in g3['bodies']]})

stop_all(server,env)
print('\n=== SUMMARY ===')
for n,o,_ in results: print(('PASS' if o else 'FAIL'),n)
findings=[f"{'WORKING' if o else 'BUG'}: {n} | {d}" for n,o,d in results]
bugs=[f"{n} | {d}" for n,o,d in results if not o]
out={"findings":findings,"bugs":bugs}
print('\nJSON_OUTPUT_BEGIN'); print(json.dumps(out,ensure_ascii=False)); print('JSON_OUTPUT_END')