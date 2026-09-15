"""Exhaustive PRODUCTS + PAYMENT admin QA for Wanas index.html."""
import json, base64, time, sys
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

R = {'tests': []}
def log(name, ok, detail=''):
    R['tests'].append({'n': name, 'ok': bool(ok), 'd': str(detail)[:300]})
    print(('PASS ' if ok else 'FAIL ') + name + ' :: ' + str(detail)[:200])

server, PORT = launch_server('/Users/ahmed.alghoraib/Desktop/Wanas')
bproc, CDP = launch_browser()
w = Wanas(CDP, f'http://127.0.0.1:{PORT}/index.html')
w.open()
time.sleep(1)
# clean state
w.ev("localStorage.clear();location.reload();")
time.sleep(2)
ok = w.login_admin()
log('admin login', ok, w.ev("!document.getElementById('adminPanel').classList.contains('hidden')"))

# state snapshot helper
def snap():
    return json.loads(w.evp("""(async()=>{
 if(typeof DATA==='undefined')return {err:'no DATA'};
 const tabs=[...document.querySelectorAll('#catTabs .tab,[data-cat]')].map(e=>e.textContent.trim()).filter(x=>x);
 return {db:DATA.products.length, cats:(DATA.categories||[]).length,
   catList:(typeof catList!=='undefined'&&catList)?catList.length:null,
   tabEls:tabs.length, tabNames:tabs,
   storefrontCards:document.querySelectorAll('.p-card,.card,[class*=product]').length};
})()"""))
s0 = snap()
print('SNAP0', s0)

# tiny real PNG on disk -> data URL ready
png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0BFwMgwakChAABnOwMd/1BXAAAAAElFTkSuQmCC')
open('/tmp/wanas_tiny.png','wb').write(png)
PNG64 = base64.b64encode(png).decode()

def data():
    return json.loads(w.ev("JSON.stringify(DATA)"))

# ============ P1: CATEGORIES CRUD ============
w.ev("document.querySelector('[data-tab=\"data\"],#tabData,.tabBtn[data-target=],') && 1")
# discover admin tab buttons
print('TABBTNS', w.ev("[...document.querySelectorAll('#adminPanel button,[role=tab],.adminTab,.tabBtn')].map(b=>b.textContent.trim()).slice(0,20)"))

json.dump({'port':PORT,'cdp':CDP}, open('/tmp/wanas_run.json','w'))
print('INIT DONE')
