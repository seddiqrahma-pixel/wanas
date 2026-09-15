import sys, json, time
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

root='/Users/ahmed.alghoraib/Desktop/Wanas'
server, port = launch_server(root)
browser, cdp = launch_browser()
w = Wanas(cdp, f'http://127.0.0.1:{port}/index.html')
w.open()
time.sleep(0.4)
out={"findings":[],"bugs":[]}
F=out["findings"]; B=out["bugs"]
try:
    # reset attempts + ensure EN for readability
    w.ev("S.wrongAttempts=0; saveSettings();")
    w.ev("document.getElementById('langBtn').click()")  # -> EN
    time.sleep(0.1)

    # ==== 6. Wrong admin password counter ====
    w.ev("document.getElementById('adminBtn').style.display='';")
    cnt_seq=[]
    for i in range(3):
        w.ev("document.getElementById('adminBtn').click()")  # open modal (toggleAdmin)
        w.ev("document.getElementById('adminPass').value='wrongpw';")
        w.ev("document.getElementById('adminLoginBtn').click()")
        time.sleep(0.15)
        state = w.ev("({err:getComputedStyle(document.getElementById('adminLoginErr')).display, hint:document.getElementById('adminLoginAttempts').textContent.trim(), n:S.wrongAttempts||0, modalOpen:document.getElementById('adminLoginModal').classList.contains('show'), panelOpen:!document.getElementById('adminPanel').classList.contains('hidden')})")
        cnt_seq.append(state)
        # close modal between attempts
        w.ev("document.getElementById('adminLoginClose').click()")
        time.sleep(0.1)
    F.append("wrong_pw_seq="+json.dumps(cnt_seq))
    err_shown = all(s["err"]=="block" for s in cnt_seq)
    seq_ok = [s["n"] for s in cnt_seq] == [1,2,3]
    hint_ok = all(s["hint"]!="" for s in cnt_seq)
    if not (err_shown and seq_ok and hint_ok):
        B.append(f"wrong-password counter/error: shown={err_shown} seq=[{seq_ok}] hint_nonempty={hint_ok} data={cnt_seq}")
    if any(s["panelOpen"] for s in cnt_seq):
        B.append("wrong password unlocked admin panel!")

    # ==== 7. Keyboard hint (Arabic vs English key) ====
    w.ev("document.getElementById('adminBtn').click()")  # reopen modal
    time.sleep(0.1)
    kb = w.ev("""(()=>{const inp=document.getElementById('adminPass');const h=document.getElementById('adminKbHint');
        h.textContent='';
        inp.dispatchEvent(new KeyboardEvent('keydown',{key:'a',bubbles:true})); const en=h.textContent;
        h.textContent='';
        inp.dispatchEvent(new KeyboardEvent('keydown',{key:'\u0645',bubbles:true})); const ar=h.textContent;
        h.textContent='';
        inp.dispatchEvent(new KeyboardEvent('keydown',{key:'.',bubbles:true})); const dot=h.textContent;
        return {en,ar,dot};})()""")
    F.append("kb_hint="+json.dumps(kb))
    if not (kb["en"] and kb["ar"] and kb["en"]!=kb["ar"]):
        B.append(f"keyboard hint did not react to Arabic vs English key: {kb}")
    if kb["dot"]!="":
        # punctuation clears hint — acceptable, note only
        pass
    w.ev("document.getElementById('adminLoginClose').click()")

    # login correct, then tooltips EN vs AR
    w.ev("document.getElementById('adminBtn').click()")
    w.ev("document.getElementById('adminPass').value='wanas123';document.getElementById('adminLoginBtn').click();")
    time.sleep(0.3)
    tips_en = w.ev("({exp:document.getElementById('exportBtn').title, add:document.getElementById('addCatBtn').title, res:document.getElementById('resetBtn').title})")
    # toggle to AR
    w.ev("document.getElementById('langBtn').click()")
    time.sleep(0.1)
    tips_ar = w.ev("({exp:document.getElementById('exportBtn').title, add:document.getElementById('addCatBtn').title, res:document.getElementById('resetBtn').title})")
    F.append("tooltips="+json.dumps({"en":tips_en,"ar":tips_ar}))
    changed = 0
    for k in tips_en:
        if tips_en[k] and tips_ar[k] and tips_en[k]!=tips_ar[k]: changed+=1
    F.append(f"tooltip_keys_changed={changed} of 3")
    if changed==0:
        B.append(f"admin tooltips did not change language: en={tips_en} ar={tips_ar}")

except Exception as e:
    B.append("SCRIPT_ERROR: "+repr(e))
finally:
    stop_all(server, browser)
print(json.dumps(out, ensure_ascii=False, indent=1))