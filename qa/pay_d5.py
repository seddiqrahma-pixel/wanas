import sys, json, time
sys.path.insert(0, "/Users/ahmed.alghoraib/Desktop/Wanas/qa")
from wanas_lib import Wanas, spin_server
spin_server(8431)
URL = "http://127.0.0.1:8431/index.html"
INJECT = open("/Users/ahmed.alghoraib/Desktop/Wanas/qa/inject.txt").read()
w = Wanas(port=9223, url=URL)
# pre-seed localStorage with saved new vodafone to simulate "saved in prior session"
w._send("Page.navigate", {"url": URL}); time.sleep(1)
w.eval("localStorage.setItem('wanas_settings', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('wanas_settings')||'{}'), {vodafone:'01199988877'})))")
w.nav(URL)
w.eval(INJECT)
r = w.eval("""
(() => ({S_vod: (typeof S!=='undefined'&&S)?S.vodafone:null}))()
""")
print("after reload with stored value:", r)
toc = w.eval('doAddProduct()'); time.sleep(0.3)
pay = w.eval('payListText()')
print("paylist:", pay)
