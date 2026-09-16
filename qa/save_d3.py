import sys, json, time
sys.path.insert(0, "/Users/ahmed.alghoraib/Desktop/Wanas/qa")
from wanas_lib import Wanas, spin_server
spin_server(8431)
URL = "http://127.0.0.1:8431/index.html"
INJECT = open("/Users/ahmed.alghoraib/Desktop/Wanas/qa/inject.txt").read()
w = Wanas(port=9223, url=URL)
w.clear_storage(); w.nav(URL); w.eval(INJECT)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval('saveVod("01199988877")'); time.sleep(0.4)
nav = w.nav(URL)
w.eval(INJECT)
res = w.eval("""
(() => {
  const st = JSON.parse(localStorage.getItem('wanas_settings')||'{}');
  return {stored_vod: st.vodafone, S_vod: (typeof S!=='undefined'&&S)?S.vodafone:null,
          S_type: typeof S, DATA_vod: (typeof S==='undefined') ? 'S_undef' : 'ok'};
})()
""")
print(res)
