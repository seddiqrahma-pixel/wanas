import sys, json, time
sys.path.insert(0, "/Users/ahmed.alghoraib/Desktop/Wanas/qa")
from wanas_lib import Wanas, spin_server
spin_server(8431)
URL = "http://127.0.0.1:8431/index.html"
INJECT = open("/Users/ahmed.alghoraib/Desktop/Wanas/qa/inject.txt").read()
I2 = r"""
window.saveVod = (v) => {
  document.querySelector('#cfgVodafone').value = v;
  document.querySelector('#savePaymentBtn').click();
};
"""
w = Wanas(port=9223, url=URL)
w.clear_storage(); w.nav(URL); w.eval(INJECT); w.eval(I2)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
before = w.eval("JSON.parse(localStorage.getItem('wanas_settings')||'{}').vodafone")
res = w.eval('saveVod("01199988877"); "clicked"')
time.sleep(0.4)
after_live = w.eval("S.vodafone")
after_store = w.eval("JSON.parse(localStorage.getItem('wanas_settings')||'{}').vodafone")
field = w.eval("document.querySelector('#cfgVodafone').value")
toast = w.eval("document.querySelector('#toast').textContent")
print({"before_store": before, "after_live": after_live, "after_store": after_store, "field": field, "toast": toast})
