import json, sys, time
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all
OUT = open('/Users/ahmed.alghoraib/Desktop/Wanas/qa/comm_results2.jsonl', 'w', encoding='ascii', errors='backslashreplace')
def P(o):
    OUT.write(json.dumps(o, ensure_ascii=True, default=str)+'\n'); OUT.flush()
W='/Users/ahmed.alghoraib/Desktop/Wanas'
srv,port=launch_server(W,8453)
env,cdp=launch_browser(8454)
w=Wanas(cdp,f'http://127.0.0.1:{port}/index.html')
w.open(); w.evp("localStorage.clear(); true"); w.open()
time.sleep(0.5)
w.ev("document.getElementById('adminBtn').style.display='';")
w.ev("document.getElementById('adminBtn').click();")
w.ev("document.getElementById('adminPass').value='wanas123';")
w.ev("document.getElementById('adminLoginBtn').click();")
time.sleep(0.4)
def add(icon,ar,en,val,typ):
    w.ev(f"document.getElementById('cfgCommIcon').value={json.dumps(icon)};")
    w.ev(f"document.getElementById('cfgCommAr').value={json.dumps(ar)};")
    w.ev(f"document.getElementById('cfgCommEn').value={json.dumps(en)};")
    w.ev(f"document.getElementById('cfgCommValue').value={json.dumps(val)};")
    w.ev(f"document.getElementById('cfgCommType').value={json.dumps(typ)};")
    w.ev("document.getElementById('addCommBtn').click();")
add('X','صورة','imgpes','"><img src=x onerror=window.__pwned=1>','social')
time.sleep(0.3)
P({'t':'img_onerror','pwned_set':w.ev("!!window.__pwned"),
   'img_tags':w.ev("document.querySelectorAll('#footerCommsContainer img').length"),
   'html_snip':w.ev("document.getElementById('footerCommsContainer').innerHTML.slice(-260)")})
add('J','جاva','jslink','javascript:alert(1)','social')
add('P','بروتوكولون','protocol97','javascript:alert(2)','contact')
time.sleep(0.3)
P({'t':'js_guard_chips_href','v':w.ev("Array.from(document.querySelectorAll('#footerCommsContainer a')).map(a=>a.getAttribute('href'))")})
P({'t':'pwned2','v':w.ev("!!window.__pwned")})
# alert triggered? monitor via hook
P({'t':'console_errors','v':w.console_errors()})
stop_all(srv,env); OUT.close(); print('done')
