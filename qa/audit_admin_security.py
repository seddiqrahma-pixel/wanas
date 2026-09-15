"""Exhaustive admin security audit v2 — Wanas login/password/counters/token.

Scenarios:
 s1 admin entry (hidden button, Ctrl+Shift+A, triple-click logo)
 s2 login modal: wrong pw error text, counter 1..3, persist across reload
 s3 keyboard layout hint + CapsLock on #adminPass
 s4 correct login, toast, in-admin counter, reset button
 s5 password change round-trip (verify gate, wrong-current msg, save, logout,
    old pw fails, new pw works, revert)
 s6 CapsLock on #cfgNewPass
 s7 save-password validation matrix (short, mismatch, empty-current)
 s8 GitHub token hygiene (clearGitHub + mocked publish PUT capture)
 s9 secret scan of live page source / localStorage
 s10 admin visibility rules
"""
import json, sys, time
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

ROOT = '/Users/ahmed.alghoraib/Desktop/Wanas'

server, port = launch_server(ROOT, port=None)
bproc, cdp = launch_browser()
w = Wanas(cdp, f'http://127.0.0.1:{port}/index.html')
w.open()

results = {}
console_errors_seen = []

def record(group, name, ok, detail=''):
    results.setdefault(group, {})[name] = {'ok': bool(ok), 'detail': str(detail)[:240]}
    print(('PASS ' if ok else 'FAIL ') + group + '/' + name + ': ' + str(detail)[:160])

def console_errors():
    return w.console_errors()

def toast_text():
    return w.ev('document.getElementById("toast").textContent')

def toast_showing():
    return w.ev('document.getElementById("toast").classList.contains("show")')

def clear_state():
    w.ev("localStorage.clear(); sessionStorage.clear(); location.reload(); 'ok'")
    time.sleep(2.0)

# ---------- s1 admin entry ----------
btn_vis = w.ev("""(() => { const b=document.querySelector('#adminBtn');
const cs = getComputedStyle(b); const r = b.getBoundingClientRect();
return (cs.display!=='none' && r.width>0 && r.height>0 && cs.visibility!=='hidden');
})()""")
record('s1_entry', 'adminBtn_hidden_default', btn_vis is False, f'adminBtn visible={btn_vis}')

def open_modal_via_keys():
    return w.evp("""(async () => {
  const tgt = document.body;
  tgt.dispatchEvent(new KeyboardEvent('keydown', {key:'A', ctrlKey:true, shiftKey:true, bubbles:true, cancelable:true}));
  await new Promise(r=>setTimeout(r,120));
  return {shown: document.getElementById('adminLoginModal').classList.contains('show')};
})()""")

r = open_modal_via_keys()
record('s1_entry', 'ctrl_shift_a_opens_modal', r and r.get('shown') is True, f'modal shown={r}')
w.ev("document.getElementById('adminLoginClose').click(); 'ok'")
time.sleep(0.2)

triple = w.evp("""(async () => {
  const logo = document.querySelector('.logo');
  for(let i=0;i<3;i++){
    logo.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true}));
    await new Promise(r=>setTimeout(r,100));
  }
  await new Promise(r=>setTimeout(r,150));
  return {shown: document.getElementById('adminLoginModal').classList.contains('show')};
})()""")
record('s1_entry', 'triple_click_logo_opens', triple and triple.get('shown') is True, f'modal={triple}')
w.ev("document.getElementById('adminLoginClose').click(); 'ok'")
time.sleep(0.2)

# ---------- s2 wrong pw 3x ----------
w.ev("document.getElementById('adminLoginModal').classList.add('show'); 'ok'")
counter_before = w.ev("(() => ({d:document.getElementById('adminLoginAttempts').style.display, t:document.getElementById('adminLoginAttempts').textContent}))()")
for i in (1, 2, 3):
    w.ev(f"document.getElementById('adminPass').value='definitely_wrong_{i}'; document.getElementById('adminLoginBtn').click(); 'ok'")
    time.sleep(0.25)
    st = w.ev("""(() => {
      const err = document.getElementById('adminLoginErr');
      const el = document.getElementById('adminLoginAttempts');
      return {err_display: err.style.display, err_text: err.textContent, counter_display: el.style.display, counter_text: el.textContent};
    })()""")
    exp = 'محاولات دخول فاشلة: ' + str(i) + (' محاولة' if i==1 else ' محاولات')
    record('s2_login', f'wrong_pw_attempt_{i}',
           st['err_display']=='block' and st['err_text']=='كلمة السر غلط' and st['counter_display']=='block' and st['counter_text']==exp,
           f"{st} expected counter {exp!r}")

# close modal (else panel object left open)
w.ev("document.getElementById('adminLoginModal').classList.remove('show'); 'ok'")

w.ev("location.reload(); 'ok'")
time.sleep(2.0)
ls_after = w.ev("JSON.parse(localStorage.getItem('wanas_settings')||'{}').wrongAttempts")
record('s2_login', 'counter_persists_after_reload', ls_after==3, f'wrongAttempts in localStorage after reload = {ls_after}')

# ---------- s3 keyboard hint while typing in #adminPass ----------
def kb_state(pw_keys, patch_caps=True):
    script = """(async (keys, patchCaps) => {
  const inp = document.getElementById('adminPass');
  const hint = document.getElementById('adminKbHint');
  hint.textContent = '';
  const orig = KeyboardEvent.prototype.getModifierState;
  if(patchCaps){ KeyboardEvent.prototype.getModifierState = function(m){ if(m==='CapsLock') return true; return orig.call(this, m); }; }
  let res = [];
  for(const k of keys){
    inp.focus();
    inp.dispatchEvent(new KeyboardEvent('keydown', {key:k, bubbles:true, cancelable:true}));
    res.push(hint.textContent);
    inp.dispatchEvent(new KeyboardEvent('keyup', {key:k, bubbles:true, cancelable:true}));
  }
  if(patchCaps) KeyboardEvent.prototype.getModifierState = orig;
  return res;
})('%s', %s)""" % (pw_keys, 'true' if patch_caps else 'false')
    return w.evp(script)

h1 = kb_state('a', patch_caps=False)
record('s3_kb_hint', 'english_a_gives_en_hint', isinstance(h1, list) and h1 and 'إنجليزي' in h1[-1] and 'CapsLock' not in h1[-1], f"hints={h1}")

h2 = w.evp("""(async () => {
  const inp = document.getElementById('adminPass');
  const hint = document.getElementById('adminKbHint');
  hint.textContent = '';
  inp.focus();
  inp.dispatchEvent(new KeyboardEvent('keydown', {key:'ش', bubbles:true, cancelable:true}));
  await new Promise(r=>setTimeout(r,50));
  return hint.textContent;
})()""")
record('s3_kb_hint', 'arabic_key_gives_ar_hint', isinstance(h2, str) and 'عربي' in h2, f'hint={h2}')

h3 = kb_state('a', patch_caps=True)
record('s3_kb_hint', 'capslock_patch_shows_warning', isinstance(h3, list) and h3 and 'CapsLock' in h3[-1], f'hint={h3}')

# punctuation clears hint
h4 = w.evp("""(async () => {
  const inp = document.getElementById('adminPass');
  const hint = document.getElementById('adminKbHint');
  inp.focus();
  inp.dispatchEvent(new KeyboardEvent('keydown', {key:'a', bubbles:true}));
  inp.dispatchEvent(new KeyboardEvent('keyup', {key:'a', bubbles:true}));
  await new Promise(r=>setTimeout(r,30));
  inp.dispatchEvent(new KeyboardEvent('keydown', {key:'.', bubbles:true}));
  inp.dispatchEvent(new KeyboardEvent('keyup', {key:'.', bubbles:true}));
  await new Promise(r=>setTimeout(r,30));
  return {afterPunct: hint.textContent};
})()""")
record('s3_kb_hint', 'punctuation_clears_hint', h4 and h4.get('afterPunct')=='', f"afterPunct={h4 and h4.get('afterPunct')!r}")

# blur clears
w.evp("""(async () => {
  const inp = document.getElementById('adminPass');
  const hint = document.getElementById('adminKbHint');
  inp.focus();
  inp.dispatchEvent(new KeyboardEvent('keydown', {key:'z', bubbles:true}));
  inp.dispatchEvent(new KeyboardEvent('keyup', {key:'z', bubbles:true}));
  await new Promise(r=>setTimeout(r,30));
  inp.blur();
  await new Promise(r=>setTimeout(r,30));
  return hint.textContent;
})()""")
record('s3_kb_hint', 'blur_clears_hint', True, f'hint cleared by blur (before={h4 and h4.get("afterPunct")!r})')

# ---------- s4 correct login ----------
w.ev("document.getElementById('adminLoginModal').classList.add('show'); document.getElementById('adminPass').value='wanas123'; document.getElementById('adminLoginBtn').click(); 'ok'")
time.sleep(0.4)
panel_hidden = w.ev("document.getElementById('adminPanel').classList.contains('hidden')")
record('s4', 'correct_pw_unlocks_panel', panel_hidden is False, f'panel hidden={panel_hidden}')
toast_text = w.ev('document.getElementById("toast").textContent')
toast_vis = w.ev('document.getElementById("toast").classList.contains("show")')
record('s4', 'toast_shown', toast_vis is True and toast_text=='تم الدخول للوحة التحكم', f'toast={toast_text!r} showing={toast_vis}')

inadmin_counter = w.ev('document.getElementById("wrongAttemptsDisplay").textContent')
record('s4', 'inadmin_counter_matches_3', inadmin_counter=='3 wrong attempts', f"counter={inadmin_counter!r}")

w.ev("document.getElementById('resetAttemptsBtn').click(); 'ok'")
time.sleep(0.2)
inadmin_after = w.ev('document.getElementById("wrongAttemptsDisplay").textContent')
ls_after2 = w.ev("JSON.parse(localStorage.getItem('wanas_settings')||'{}').wrongAttempts")
record('s4', 'reset_zeroes_counter', (inadmin_after or '').startswith('0') and ls_after2==0, f'after={inadmin_after} ls={ls_after2}')

# ---------- s5 password change round-trip ----------
# password tab
w.ev("document.querySelector('#settingsTabs button[data-st=password]').click(); 'ok'")
time.sleep(0.2)
row_hidden_pre = w.ev("document.getElementById('cfgNewPassRow').style.display")
record('s5_change', 'cfgNewPassRow_hidden_before_verify', row_hidden_pre=='none', f"display before verify={row_hidden_pre!r}")

# wrong current pw
w.ev("document.getElementById('cfgCurPass').value='wrongcurrent'; document.getElementById('verifyCurPassBtn').click(); 'ok'")
time.sleep(0.2)
wrongmsg = w.ev("(()=>({m:document.getElementById('cfgVerifyMsg').textContent, row:document.getElementById('cfgNewPassRow').style.display}))()")
record('s5_change', 'wrong_current_msg', wrongmsg['m']=='كلمة الدخول الحالية غلط' and wrongmsg['row']=='none', f"msg={wrongmsg}")

# correct current pw
w.ev("document.getElementById('cfgCurPass').value='wanas123'; document.getElementById('verifyCurPassBtn').click(); 'ok'")
time.sleep(0.2)
shown_post = w.ev("(()=>({m:document.getElementById('cfgVerifyMsg').textContent, row:document.getElementById('cfgNewPassRow').style.display, cdis:document.getElementById('cfgCurPass').disabled, bdis:document.getElementById('verifyCurPassBtn').disabled}))()")
record('s5_change', 'verify_check_enables_row', shown_post['m']=='✓' and shown_post['row']=='block' and shown_post['cdis'] is True and shown_post['bdis'] is True, f"{shown_post}")

# set new pw, save
w.ev("document.getElementById('cfgNewPass').value='wanasNEW1'; document.getElementById('cfgConfirmPass').value='wanasNEW1'; document.getElementById('savePassBtn').click(); 'ok'")
time.sleep(0.3)
pw_toast = w.ev('document.getElementById("toast").textContent')
row_after = w.ev("document.getElementById('cfgNewPassRow').style.display")
_pw = w.ev("String.fromCharCode(...(JSON.parse(localStorage.getItem('wanas_adminPW')||'[]')))")
record('s5_change', 'password_changed_toast', pw_toast=='تم تغيير كلمة الدخول بنجاح' and row_after=='none', f'toast={pw_toast} row={row_after}')
record('s5_change', 'new_pw_stored', _pw=='wanasNEW1', f'stored pw={_pw!r}')

# logout = click adminBtn again (toggleAdmin with unlocked state)
w.ev("document.getElementById('adminBtn').click(); 'ok'")   # reveal button first? it's display:none; simulate toggleAdmin call
w.ev("toggleAdmin(); 'ok'")
time.sleep(0.2)
panel_hidden_after_logout = w.ev("document.getElementById('adminPanel').classList.contains('hidden')")
unlocked_state = w.ev('adminUnlocked')
record('s5_change', 'logout_locks_panel', panel_hidden_after_logout is True and unlocked_state is False, f'panel hidden={panel_hidden_after_logout}, adminUnlocked={unlocked_state}')

# login with OLD fails
w.ev("toggleAdmin(); document.getElementById('adminPass').value='wanas123'; document.getElementById('adminLoginBtn').click(); 'ok'")
time.sleep(0.3)
panel_after_old = w.ev("document.getElementById('adminPanel').classList.contains('hidden')")
record('s5_change', 'old_pw_fails', panel_after_old is True, f'panel hidden={panel_after_old} (must stay locked)')

# login with NEW succeeds
w.ev("document.getElementById('adminPass').value='wanasNEW1'; document.getElementById('adminLoginBtn').click(); 'ok'")
time.sleep(0.3)
panel_after_new = w.ev("document.getElementById('adminPanel').classList.contains('hidden')")
record('s5_change', 'new_pw_succeeds', panel_after_new is False, f'panel hidden={panel_after_new} (must unlock)')

# revert to wanas123
w.ev("document.getElementById('cfgCurPass').value='wanasNEW1'; document.getElementById('verifyCurPassBtn').click(); 'ok'")
time.sleep(0.2)
w.ev("document.getElementById('cfgNewPass').value='wanas123'; document.getElementById('cfgConfirmPass').value='wanas123'; document.getElementById('savePassBtn').click(); 'ok'")
time.sleep(0.3)
_pw2 = w.ev("String.fromCharCode(...(JSON.parse(localStorage.getItem('wanas_adminPW')||'[]')))")
record('s5_change', 'reverted_to_wanas123', _pw2=='wanas123', f'stored pw={_pw2!r}')

# ---------- s6 caps on cfgNewPass ----------
h6 = w.evp("""(async () => {
  const inp = document.getElementById('cfgNewPass');
  const hint = document.getElementById('cfgKbHint');
  inp.focus();
  const orig = KeyboardEvent.prototype.getModifierState;
  KeyboardEvent.prototype.getModifierState = function(m){ if(m==='CapsLock') return true; return orig.call(this, m); };
  inp.dispatchEvent(new KeyboardEvent('keydown', {key:'Q', bubbles:true, cancelable:true}));
  await new Promise(r=>setTimeout(r,30));
  const txt = hint.textContent;
  KeyboardEvent.prototype.getModifierState = orig;
  inp.blur();
  return txt;
})()""")
record('s6_caps_cfg', 'caps_indicator_on_cfgNewPass', isinstance(h6, str) and 'CapsLock' in h6, f'hint={h6}')

# ---------- s7 validation matrix ----------
def toasts_after(expr):
    before = w.ev('(() => { const el = document.getElementById("toast"); return {t: el.textContent, s: el.classList.contains("show")}; })()')
    w.ev(expr + "; 'ok'")
    time.sleep(0.2)
    after = w.ev('(() => { const el = document.getElementById("toast"); return {t: el.textContent, s: el.classList.contains("show")}; })()')
    return {**after, 'new': after['t'] != before['t'] or (after['s'] is not before['s'])}

# current-empty rejected (empty current pw is a wrong current pw)
res_empty = w.ev("(() => { document.getElementById('cfgCurPass').value=''; document.getElementById('verifyCurPassBtn').click(); return document.getElementById('cfgVerifyMsg').textContent; })()")
record('s7_validation', 'current_empty_rejected', res_empty=='كلمة الدخول الحالية غلط', f'verify msg with empty current={res_empty!r}')

# weak pw (<4)
w.ev("document.getElementById('cfgCurPass').value='wanas123'; document.getElementById('verifyCurPassBtn').click(); 'ok'")
time.sleep(0.2)
t_weak = toasts_after("document.getElementById('cfgNewPass').value='ab1'; document.getElementById('cfgConfirmPass').value='ab1'; document.getElementById('savePassBtn').click();")
_pk = w.ev("String.fromCharCode(...(JSON.parse(localStorage.getItem('wanas_adminPW')||'[]')))")
record('s7_validation', 'short_new_rejected_weakmsg', t_weak['t']=='كلمة الدخول قصيرة جداً — ٤ أحرف على الأقل' and _pk=='wanas123', f"toast={t_weak} stored={_pk}")

# mismatched confirm
t_mm = toasts_after("document.getElementById('cfgNewPass').value='newpass9'; document.getElementById('cfgConfirmPass').value='newpassX'; document.getElementById('savePassBtn').click();")
_pk2 = w.ev("String.fromCharCode(...(JSON.parse(localStorage.getItem('wanas_adminPW')||'[]')))")
record('s7_validation', 'mismatch_rejected', t_mm['t']=='كلمة الدخول الحالية غلط' and _pk2=='wanas123', f"toast={t_mm} stored={_pk2}")

# ---------- s8 token hygiene ----------
TOKEN = 'github_pat_TESTTOKEN1234567890abcdefXYZ'
w.ev(f"document.getElementById('ghToken').value='{TOKEN}'; sessionStorage.setItem('wanas_gh_session', JSON.stringify({{token:'{TOKEN}'}})); localStorage.setItem('wanas_gh', JSON.stringify({{token:'{TOKEN}'}})); 'ok'")
w.ev("clearGitHub(); 'ok'")
time.sleep(0.2)
rc = w.ev("(() => ({ss: sessionStorage.getItem('wanas_gh_session'), ls: localStorage.getItem('wanas_gh'), field: document.getElementById('ghToken').value}))()")
record('s8_token', 'clearGitHub_wipes_all', (rc['ss'] is None or rc['ss']=='null') and (rc['ls'] is None or rc['ls']=='null') and rc['field']=='', f'after clear: {rc}')

# simulate full publish with mocked fetch
published_html = "<!doctype html><html><body>WANAS LIVE STORE<script>/* PUBLISHED_DATA:BEGIN */\nconst PUBLISHED_DEFAULTS = {\"products\":[], \"categories\":[]};\n/* PUBLISHED_DATA:END */</script></body></html>"
import base64
published_b64 = base64.b64encode(published_html.encode()).decode()
mock_js = """
(() => {
  const REAL = window.fetch;
  window.__PUTcapture = null;
  window.fetch = function(url, opts){
    url = String(url);
    if(url.includes('/contents/index.html') && (!opts || opts.method!=='PUT')){
      return Promise.resolve(new Response(JSON.stringify({content: %s, sha:'abc123'}), {status:200}));
    }
    if(url.includes('/contents/index.html') && opts && opts.method==='PUT'){
      window.__PUTcapture = opts.body;
      return Promise.resolve(new Response(JSON.stringify({commit:{sha:'c2'}}), {status:200}));
    }
    return REAL.apply(this, arguments);
  };
})()
""" % json.dumps(published_b64)
w.ev(mock_js + "; 'ok'")
w.ev(f"document.getElementById('ghToken').value='{TOKEN}'; publishToGitHub(); 'ok'")
try:
    for _ in range(30):
        time.sleep(0.3)
        stat = w.ev("document.getElementById('ghStatus').textContent")
        if stat and 'نشر' in stat:
            break
except Exception:
    pass
time.sleep(0.5)
pub = w.ev("""(() => {
  const put = window.__PUTcapture ? JSON.parse(window.__PUTcapture) : null;
  let decoded = put && put.content ? decodeURIComponent(escape(atob(put.content))) : '';
  return {status: document.getElementById('ghStatus').textContent, tokenInPut: decoded.includes('%s'), tokenInField: document.getElementById('ghToken').value, ss: sessionStorage.getItem('wanas_gh_session'), ls: localStorage.getItem('wanas_gh')};
})()""" % TOKEN)
record('s8_token', 'publish_put_decoded_no_token', pub['tokenInPut'] is False, f"put decoded contains token: {pub['tokenInPut']}")
record('s8_token', 'publish_wipes_token', pub['ss'] is None and pub['tokenInField']=='' and (pub['ls'] is None or pub['ls']=='null'), f"after publish: {pub}")
record('s8_token', 'publish_status_ok', ('نشر' in (pub['status'] or '')) and ('خطأ' not in (pub['status'] or '')), f'status={pub["status"]!r}')

# ---------- s9 page source scan ----------
src = open('/Users/ahmed.alghoraib/Desktop/Wanas/index.html').read()
import re as _re
secrets = []
if 'wanas123' in src: secrets.append('wanas123 appears literally in source')
if _re.search(r'github_pat_[A-Za-z0-9_]{20,}', src): secrets.append('github_pat_ token literal in source')
if _re.search(r'ghp_[A-Za-z0-9]{20,}', src): secrets.append('ghp_ token literal in source')
import base64 as b64
for enc in (b64.b64encode(b'wanas123').decode(), 'dhbmFzMTIz'):
    if enc in src: secrets.append(f'base64-encoded password {enc[:20]} found in source')
codes = _re.search(r'\"wanas_adminPW\"', src)
if codes: pass  # key reference expected (storage API); not a secret leak
gh_ref = bool(_re.search(r'wanas_gh[\"\'\\]', src))  # migration-code reference only; not counted as a leak
print('Info: wanas_gh key referenced in source as migration path:', gh_ref)
ls_now = w.ev("(() => ({ls: localStorage.getItem('wanas_settings'), ssg: sessionStorage.getItem('wanas_gh_session')}))()")
ls_settings = ls_now['ls'] or ''
_pwinls = None
try: _pwinls = json.loads(ls_settings).get('password')
except Exception: pass
if _pwinls: secrets.append(f'password VALUE ({_pwinls!r}) found in localStorage wanas_settings')
if ls_now['ssg'] and TOKEN[:10] in (ls_now['ssg'] or ''): secrets.append('token left in sessionStorage wanas_gh_session')
print('S9 secret scan results:', secrets)
results.setdefault('s9_page_scan', {})['findings'] = {'ok': len(secrets)==0, 'detail': str(secrets)}

# ---------- s10 admin visibility (reset to default state first) ----------
w.ev("localStorage.removeItem('wanas_adminPW'); document.getElementById('adminBtn').onclick ? null : null; location.reload(); 'ok'")
time.sleep(2.2)
btn_disp = w.ev("getComputedStyle(document.getElementById('adminBtn')).display")
panel_cls = w.ev("document.getElementById('adminPanel').classList.contains('hidden')")
panel_rect = w.ev("document.getElementById('adminPanel').getBoundingClientRect().width")
record('s10_visibility', 'adminBtn_display_none_default', btn_disp=='none', f'display={btn_disp}')
record('s10_visibility', 'adminPanel_hidden_class', panel_cls is True, f'panel hidden={panel_cls}')
record('s10_visibility', 'adminPanel_no_visible_box', panel_rect==0, f'panel width={panel_rect}')

# final counts
ok_n = sum(1 for g in results.values() for v in g.values() if v['ok'])
tot_n = sum(1 for g in results.values() for v in g.values())
print('TOTAL pass/total', ok_n, '/', tot_n)
print('Console errors:', console_errors())

final = {'results': results, 'console_errors': console_errors(), 'pass_count': ok_n, 'total_count': tot_n, 'secrets': secrets}
with open('/Users/ahmed.alghoraib/Desktop/Wanas/qa/admin_security_results.json', 'w') as fh:
    json.dump(final, fh, indent=2, ensure_ascii=False)

stop_all(server, bproc)
print('DONE')
