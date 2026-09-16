import json, sys, time
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

OUT = open('/Users/ahmed.alghoraib/Desktop/Wanas/qa/comm_results.jsonl', 'w', encoding='ascii', errors='backslashreplace')
def P(o):
    OUT.write(json.dumps(o, ensure_ascii=True, default=str)+'\n'); OUT.flush()

W = '/Users/ahmed.alghoraib/Desktop/Wanas'
srv, port = launch_server(W, 8451)
env, cdp = launch_browser(8452)
w = Wanas(cdp, f'http://127.0.0.1:{port}/index.html')
w.open()
w.evp("localStorage.clear(); true")
w.open()

def chips():
    return w.ev("""Array.from(document.querySelectorAll('#footerCommsContainer .wanas-comm')).map(a=>({
      label:(a.textContent||''), href:a.getAttribute('href')}) )""")

P({'t':'fresh_chips','v':chips()})
P({'t':'S_comms_len','v':w.ev("S.comms?S.comms.length:-1")})

# login
w.ev("document.getElementById('adminBtn').style.display='';")
w.ev("document.getElementById('adminBtn').click();")
w.ev("var ap=document.getElementById('adminPass'); if(ap){ap.value='wanas123'};")
w.ev("var b=document.getElementById('adminLoginBtn'); if(b){b.click()}")
time.sleep(0.5)
P({'t':'admin_unlocked','v':w.ev("!document.getElementById('adminPanel').classList.contains('hidden')")})

# fill comm fields via cfgComm*
w.ev("document.getElementById('cfgCommIcon').value='@';")
w.ev("document.getElementById('cfgCommAr').value='<b>Bold</b>';")
w.ev("document.getElementById('cfgCommEn').value='<b>XSSB</b>';")
w.ev("document.getElementById('cfgCommValue').value='https://example.com\" onmouseover=\"alert(1)';")
w.ev("document.getElementById('cfgCommType').value='social';")
w.ev("document.getElementById('addCommBtn').click();")
time.sleep(0.3)
P({'t':'after_xss_add_chips','v':chips()})
P({'t':'imginjected','v':w.ev("!!document.querySelector('#footerCommsContainer img')")})
P({'t':'anchors_count','v':w.ev("document.querySelectorAll('#footerCommsContainer a').length")})

# wa.me conversion: add a contact number type
w.ev("document.getElementById('cfgCommIcon').value='W';")
w.ev("document.getElementById('cfgCommAr').value='واتس';")
w.ev("document.getElementById('cfgCommEn').value='WhatsApp01';")
w.ev("document.getElementById('cfgCommValue').value='01221203954';")
w.ev("document.getElementById('cfgCommType').value='contact';")
w.ev("document.getElementById('addCommBtn').click();")
time.sleep(0.3)
P({'t':'after_contact_chips','v':chips()})

# edit flow: editCommIdx
w.ev("window.__editTest = true;")
r = w.ev("(function(){ var btns=Array.from(document.querySelectorAll('#commList [data-edit-comm]')); btns[0].click(); return {idx:editCommIdx, icon:document.getElementById('cfgCommIcon').value, ar:document.getElementById('cfgCommAr').value, value:document.getElementById('cfgCommValue').value, btn:document.getElementById('addCommBtn').textContent}; })()")
P({'t':'editComm_state','v':r})

# save the edit (change EN)
w.ev("document.getElementById('cfgCommEn').value='EDITED-EN';")
w.ev("document.getElementById('addCommBtn').click();")
time.sleep(0.3)
P({'t':'after_edit_S_comms_0_en','v':w.ev("S.comms[0].en")})
P({'t':'editCommIdx_after','v':w.ev("editCommIdx")})
w.ev("document.getElementById('addCommBtn').click();")
time.sleep(0.3)
P({'t':'after_edit_S_comms_0_en_v2','v':w.ev("S.comms[0].en")})
P({'t':'editCommIdx_after2','v':w.ev("editCommIdx")})

# dedupe: add identical again
w.ev("(function(){document.getElementById('cfgCommIcon').value='D';document.getElementById('cfgCommAr').value='دوب';document.getElementById('cfgCommEn').value='Dup';document.getElementById('cfgCommValue').value='01000000000';document.getElementById('cfgCommType').value='contact';document.getElementById('addCommBtn').click();})()")
time.sleep(0.2)
n1 = w.ev("S.comms.length")
w.ev("(function(){document.getElementById('cfgCommIcon').value='D';document.getElementById('cfgCommAr').value='دوب';document.getElementById('cfgCommEn').value='Dup';document.getElementById('cfgCommValue').value='01000000000';document.getElementById('cfgCommType').value='contact';document.getElementById('addCommBtn').click();})()")
time.sleep(0.2)
P({'t':'dedupe','v':{'len1':n1,'len2':w.ev('S.comms.length')}})

# delete
cnt_before = w.ev("S.comms.length")
w.ev("""(function(){var b=document.querySelector('#commList [data-del-comm]'); b.click();})()""")
time.sleep(0.3)
P({'t':'delete','v':{'before':cnt_before,'after':w.ev('S.comms.length')}})

# language switch re-renders footer
P({'t':'footer_before_switch_ar','v':w.ev("document.getElementById('footerCommsContainer').textContent")})
w.ev("document.getElementById('langBtn').click();")
time.sleep(0.4)
P({'t':'footer_after_switch_en','v':w.ev("document.getElementById('footerCommsContainer').textContent")})
w.ev("document.getElementById('langBtn').click();")
time.sleep(0.4)
P({'t':'footer_back_ar','v':w.ev("document.getElementById('footerCommsContainer').textContent")})

# persistence across reload
w.evp("location.reload(); true")
time.sleep(2.0)
P({'t':'after_reload_S_comms','v':w.ev("window.S?(window.S.comms||[]).length:-1")})
P({'t':'after_reload_footer','v':w.ev("document.getElementById('footerCommsContainer').textContent")})

# reset: defaults return
w.ev("document.getElementById('adminBtn').style.display='';")
w.ev("document.getElementById('adminBtn').click();")
w.ev("var ap=document.getElementById('adminPass'); if(ap){ap.value='wanas123'};")
w.ev("var b=document.getElementById('adminLoginBtn'); if(b){b.click()}")
time.sleep(0.5)
r = w.evp("""(function(){return new Promise(res=>{ window.confirm=()=>true; document.getElementById('resetBtn').click(); setTimeout(()=>res({comms:S.comms, footerText:document.getElementById('footerCommsContainer').textContent}), 700); });})()""")
P({'t':'after_reset','v':r})

# mock publish: simulate published block. We emulate by checking what pubData would include
pd = w.ev("(function(){const s=Object.assign({},S); delete s.password; delete s.wrongAttempts; return s;})()")
P({'t':'pubData_settings_comms','v': (pd.get('comms') if isinstance(pd, dict) else None)})

# Simulate PUBLISHED_DEFAULTS inside published block: reload page with injected PUBLISHED_DEFAULTS override
w.evp("""(function(){localStorage.clear(); localStorage.setItem('wanas_settings', JSON.stringify({})); return true;})()""")
w.evp("location.reload(); true")
time.sleep(2)
P({'t':'published_block_default_footer','v':w.ev("document.getElementById('footerCommsContainer').textContent")})

P({'t':'console_errors','v':w.console_errors()})
stop_all(srv, env)
OUT.close()
print('done')
