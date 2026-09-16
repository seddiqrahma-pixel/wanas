import sys, json, time
sys.path.insert(0, "/Users/ahmed.alghoraib/Desktop/Wanas/qa")
from wanas_lib import Wanas, spin_server
spin_server(8431)
URL = "http://127.0.0.1:8431/index.html"
INJECT = open("/Users/ahmed.alghoraib/Desktop/Wanas/qa/inject.txt").read()
PUB = {"vodafone": "01021203954", "instapay": "01021203954",
       "whatsapp": "01020306395", "email": "ahmed.alghoraib@gmail.com",
       "bank": "Bank: NBE\nIBAN: EG900003041450006160803000150"}
w = Wanas(port=9223, url=URL)
# (1) fresh
w.clear_storage(); w.nav(URL); w.eval(INJECT)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval('goPaymentTab()')
g1 = w.pay_fields()
print("(1)", [k for k in PUB if g1.get(k)!=PUB[k]] or "ALL OK")
# (2) logout -> refresh -> login
w.eval("document.querySelector('#adminBtn').click()")
w.nav(URL); w.eval(INJECT)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval('goPaymentTab()')
g2 = w.pay_fields()
print("(2)", [k for k in PUB if g2.get(k)!=PUB[k]] or "ALL OK")
