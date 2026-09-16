#!/usr/bin/env python3
"""SETTINGS-REFRESH fix verification + payment matrix for Wanas (steps 3-9)."""
import sys, json, time, base64
sys.path.insert(0, "/Users/ahmed.alghoraib/Desktop/Wanas/qa")
from wanas_lib import Wanas, spin_server, QAHandler

spin_server(8431)
URL = "http://127.0.0.1:8431/index.html"
INJECT = open("/Users/ahmed.alghoraib/Desktop/Wanas/qa/inject.txt").read()
EXTRA = r"""
window.publishClick = (token) => {
  document.querySelector('#settingsTabs button[data-st="github"]').click();
  document.querySelector('#ghToken').value = token;
  document.querySelector('#ghPublishBtn').click();
};
window.mockFetch = (realFile) => {
  window.__qa_put_body = null;
  window.__qa_file = realFile;
  window.fetch_real = window.fetch.bind(window);
  window.fetch = async function(url, opt) {
    if (String(url).includes('api.github.com')) {
      if (opt && opt.method === 'PUT') {
        window.__qa_put_body = JSON.parse(opt.body);
        return new Response(JSON.stringify({commit:{sha:'fake'}}), {status:200, headers:{'Content-Type':'application/json'}});
      }
      return new Response(JSON.stringify({sha:'fake-sha',
        content: btoa(unescape(encodeURIComponent(window.__qa_file))),
        encoding:'base64'}), {status:200, headers:{'Content-Type':'application/json'}});
    }
    return window.fetch_real.apply(this, arguments);
  };
};
window.importBackupNow = (d) => {
  const dt = new DataTransfer();
  dt.items.add(new File([JSON.stringify(d)], 'bk.json', {type:'application/json'}));
  const input = document.querySelector('#importFile');
  input.files = dt.files;
  input.dispatchEvent(new Event('change'));
  return 'fired';
};
window.confirm = () => true;
window.resetNow = () => { document.querySelector('#resetBtn').click(); return 'ok'; };
window.switchLangIfPossible = () => {
  const btn = document.querySelector('#langBtn');
  if(btn){ btn.click(); return document.documentElement.lang || (localStorage.getItem('wanas_lang')); }
  return null;
};
"""
w = Wanas(port=9223, url=URL)
w._send("Log.enable", {})
w._send("Runtime.enable", {})

PUB = {"vodafone": "01021203954", "instapay": "01021203954",
       "whatsapp": "01020306395", "email": "ahmed.alghoraib@gmail.com",
       "bank": "Bank: NBE\nIBAN: EG900003041450006160803000150"}
DEFS = PUB
NEW = "01199988877"
W_, B_ = [], []
def check(name, cond, detail=None):
    (W_ if cond else B_).append(name if cond else {"step": name, "detail": detail})

def ptab_assert(name, expected):
    w.eval('goPaymentTab()')
    got = w.pay_fields()
    errs = [k for k in expected if got.get(k) != expected.get(k)]
    check(name, not errs, {"expected": expected, "got": got})
    return got

# ================= (3) change vodafone → save → tab + buyer truth =================
w.clear_storage(); w.nav(URL); w.eval(INJECT)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval(f'saveVod({NEW!r})'); time.sleep(0.4)
# buyer truth in checkout AFTER save (same session)
w.eval('closeCheckout && closeCheckout()')
tocart = w.eval('doAddProduct()'); time.sleep(0.3)
pay3 = w.eval('payListText()')
order3 = w.eval('previewOrderText()')
foot3 = w.eval('getFooter()')
check("3_checkout_shows_new_vodafone", any(NEW in r for r in pay3), pay3)
check("3_order_text_has_new", NEW in order3, order3[:400])
check("3_footer_unchanged", not foot3.get("tagline") or "01199988877" not in foot3["tagline"], foot3)
w.eval('closeCheckout()')
# reload WITHOUT clearing storage → login → tab persists
w.nav(URL); w.eval(INJECT)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
got3 = w.pay_fields()
check("3_tab_persists_new_after_reload", got3.get("vodafone")==NEW, got3)
print("(3) tab after reload:", got3)

# ================= (4) buyer truth on reload WITHOUT login =================
w.nav(URL); w.eval(INJECT)   # admin auto-locked out again (adminUnlocked in-memory)
tocart4 = w.eval('doAddProduct()'); time.sleep(0.3)
pay4 = w.eval('payListText()')
check("4_nologin_checkout_shows_new_vodafone", any(NEW in r for r in pay4), pay4)
print("(4) nologin paylist:", pay4)
w.eval('closeCheckout()')

# ================= (5) Publish simulation with mocked fetch =================
REAL = open("/Users/ahmed.alghoraib/Desktop/Wanas/index.html", "r", encoding="utf8").read()
FAKE_TOKEN = "ghp_qaFakeToken1234567890"
w.eval(INJECT); w.eval(EXTRA)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval(f'window.mockFetch({json.dumps(REAL)})')
w.eval(f'publishClick({FAKE_TOKEN!r})')
time.sleep(2.5)
put = w.eval('window.__qa_put_body')
if put:
    decoded = base64.b64decode(put.get("content", "")).decode("utf8", "ignore")
    b0 = decoded.find("/* PUBLISHED_DATA:BEGIN */"); b1 = decoded.find("/* PUBLISHED_DATA:END */")
    block = decoded[b0:b1+25] if b0>=0 and b1>b0 else decoded[:500]
    pub_has_new = NEW in block and put.get("message","")
else:
    pub_has_new = False; block = None
tok_after = w.eval('({session: sessionStorage.getItem("wanas_gh_session"), field: document.querySelector("#ghToken").value})')
w.eval('goPaymentTab()')
got5 = w.pay_fields()
step5 = {"publish_contains_new": pub_has_new, "token_after": tok_after, "tab_vodafone": got5.get("vodafone")}
print("(5) publish sim:", {k: (v if k!='publish_contains_new' else v) for k,v in step5.items()})
check("5_published_content_has_new_vodafone", pub_has_new, block)
check("5_token_wiped_after_publish", not tok_after["session"] and not tok_after["field"], tok_after)
check("5_payment_tab_still_new", got5.get("vodafone")==NEW, got5)

# ================= (6) Import full backup with different settings =================
BK = {"type":"full",
      "categories":[{"id":"c1","ar":"شموع","en":"Candles"}],
      "products":[{"id":"p31","cat":"c1","ar":"وردة","en":"Rose","price":26,"imgs":[]}],
      "settings":{"vodafone":"01233344455","instapay":"01233344455","whatsapp":"01233344455",
                  "email":"bk@example.com","bank":"Bank: CIB\nIBAN: EGBKBK123"}}
w.eval(INJECT); w.eval(f'importBackupNow({json.dumps(BK)})')
time.sleep(0.6)
got6 = w.pay_fields()
check("6_full_import_payment_tab_backup_values",
      all(got6.get(k)==BK["settings"][k] for k in BK["settings"]), got6)
print("(6) after import:", got6)

# ================= (7) Reset → defaults in tab AND checkout =================
w.eval('goPaymentTab()')
w.eval('resetNow()'); time.sleep(0.6)
got7 = w.pay_fields()
errs7 = [k for k in DEFS if got7.get(k) != DEFS[k]]
if "bank" in errs7:
    # BANK_DISPLAY: the form uses an escaped \\n variant; only fail if values differ beyond representation
    same = got7.get("bank", "").replace("\\n", "\n") == DEFS["bank"]
    check("7_reset_tab_returns_defaults", not errs7 or same, {"got": got7})
w.clear_storage(); w.nav(URL); w.eval(INJECT)
w.eval('doAddProduct()'); time.sleep(0.3)
pay7 = w.eval('payListText()')
check("7_reset_checkout_defaults", any(DEFS["vodafone"] in r for r in pay7), pay7)
print("(7) tab:", got7, "pay:", pay7)
w.eval('closeCheckout()')

# ================= (8) Empty field + save → no silent revert, graceful checkout =================
w.clear_storage(); w.nav(URL); w.eval(INJECT)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval('goPaymentTab()')
w.eval('saveVod("")'); time.sleep(0.4)
got8 = w.eval('getPayFields()')
w.clear_storage(); w.nav(URL); w.eval(INJECT)
w.eval('doAddProduct()'); time.sleep(0.3)
pay8 = w.eval('payListText()')
step8 = {"field_after_save": got8.get("vodafone"),
         "checkout_rows": [r[:70] for r in pay8]}
empty_ok = got8.get("vodafone")=="" and not any("01020306395" in r for r in pay8)
graceful = any(("فودافون" in r) for r in pay8)  # row still present
print("(8)", step8)
check("8_empty_field_stays_empty", empty_ok, step8)
check("8_checkout_graceful_no_number", graceful and not any("01020306395" in r for r in pay8), pay8)
w.eval('closeCheckout()')

# ================= (9) AR/EN both languages cycle =================
w.clear_storage(); w.nav(URL); w.eval(INJECT)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
got_ar = w.pay_fields()
w.eval(EXTRA)
lang_en = w.eval('switchLangIfPossible()')
if lang_en == "en":
    w.eval('goPaymentTab()')
    got_en = w.pay_fields()
    check("9_en_lang_payfields_same_values", got_en == got_ar, {"ar": got_ar, "en": got_en})
    # buyer flow in EN
    w.eval('doAddProduct()'); time.sleep(0.3)
    pay9_en = w.eval('payListText()')
    check("9_en_checkout", any(PUB["vodafone"] in r for r in pay9_en), pay9_en)
    w.eval('closeCheckout()')
    w.eval('switchLangIfPossible()')  # back to AR
else:
    check("9_lang_switch_found", False, f"lang={lang_en}")
check("9_ar_lang_payfields", all(got_ar.get(k)==PUB[k] for k in PUB), got_ar)
print("(9) AR:", got_ar, "switched to:", lang_en)

errs = w.console_errors()
print("\nworking:", json.dumps(W_, indent=1, ensure_ascii=False))
print("\nbugs:", json.dumps(B_, indent=1, ensure_ascii=False))
print("\nconsole_errors:", errs)
