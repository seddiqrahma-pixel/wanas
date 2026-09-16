#!/usr/bin/env python3
"""Branding/life-cycle cross-test for Wanas (CDP, own ports 9444/8441)."""
import sys, json, time, base64
sys.path.insert(0, "/Users/ahmed.alghoraib/Desktop/Wanas/qa")
from wanas_lib import Wanas, spin_server
from wanas_cdp import launch_browser

env, BPORT = launch_browser(cdp_port=9444)
spin_server(8441)
URL = "http://127.0.0.1:8441/index.html"
INJECT = open("/Users/ahmed.alghoraib/Desktop/Wanas/qa/inject.txt").read()
EXTRA1 = r"""
window.goBrandingTab = () => {
  const b = document.querySelector('#settingsTabs button[data-st="branding"]');
  if (!b) return 'no_tab_btn';
  b.click();
  return document.querySelector('.settings-panel[data-sp="branding"]').classList.contains('active');
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
"""
EXTRA2 = r"""
window.publishClick = (token) => {
  document.querySelector('#settingsTabs button[data-st="github"]').click();
  document.querySelector('#ghToken').value = token;
  document.querySelector('#ghPublishBtn').click();
};
window.resetNow = () => {
  window.confirm = () => true;
  document.querySelector('#resetBtn').click(); return 'ok';
};
"""
W_, B_ = [], []
def check(name, cond, detail=None):
    (W_ if cond else B_).append(name if cond else {"check": name, "detail": detail})

NEW_br = "براند منشور", "Wanas Published"
NEW_hero = ("هيرو بعد النشر", "Hero after publish", 99)

def snap_branding(w):
    return w.eval("""
(() => {
  const g = id => { const e = document.getElementById(id); return e ? e.value : null; };
  return { inputs: {cfgBrandAr: g('cfgBrandAr'), cfgBrandEn: g('cfgBrandEn'),
    cfgHeroTitleAr: g('cfgHeroTitleAr'), cfgHeroTitleEn: g('cfgHeroTitleEn'),
    cfgHeroSize: g('cfgHeroSize'), cfgFooterAr: g('cfgFooterAr'), cfgFooterEn: g('cfgFooterEn')},
    S: {brandAr: S.brandAr, brandEn: S.brandEn, heroTitleAr: S.heroTitleAr, heroTitleEn: S.heroTitleEn,
        heroSize: S.heroSize, footerAr: S.footerAr, footerEn: S.footerEn},
    headerBrand: (document.querySelector('header [data-i18n="brand"]')||{}).textContent || null,
    heroText: (document.getElementById('heroTitleText')||{}).textContent || null,
    footerText: (document.getElementById('footerTaglineText')||{}).textContent || null };
})()
""")

def find_stale(s):
    stale = []
    pairs = [("cfgBrandAr","brandAr"), ("cfgBrandEn","brandEn"),
             ("cfgHeroTitleAr","heroTitleAr"), ("cfgHeroTitleEn","heroTitleEn"),
             ("cfgFooterAr","footerAr"), ("cfgFooterEn","footerEn")]
    for iid, key in pairs:
        iv, sv = s["inputs"].get(iid), s["S"].get(key)
        if iv is not None and sv is not None and iv != sv:
            stale.append({"field": iid, "input": iv, "S": sv})
    return stale

w = Wanas(port=9444, url=URL)
w._send("Log.enable", {})
w._send("Runtime.enable", {})
# ================= (A) mock publish with brandAr changed =================
w.clear_storage(); w.nav(URL); w.eval(INJECT); w.eval(EXTRA1); w.eval(EXTRA2)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
# change brand + save
w.eval(f'document.querySelector("#cfgBrandAr").value = {NEW_br[0]!r};'
       f'document.querySelector("#cfgBrandEn").value = {NEW_br[1]!r};'
       f'window.saveBranding && saveBranding();')
time.sleep(0.5)
sA = snap_branding(w)
check("A_save_sets_brand", sA["S"]["brandAr"] == NEW_br[0] and sA["inputs"]["cfgBrandAr"] == NEW_br[0], sA)
REAL = open("/Users/ahmed.alghoraib/Desktop/Wanas/index.html", "r", encoding="utf8").read()
w.eval(f'window.mockFetch({json.dumps(REAL)})')
w.eval(f'publishClick("ghp_QA_DUMMY_TOKEN_NOT_REAL")')
time.sleep(2.5)
put = w.eval('window.__qa_put_body')
pub_has_brand = False
decoded = None
if put:
    decoded = base64.b64decode(put.get("content", "")).decode("utf8", "ignore")
    pub_has_brand = NEW_br[0] in decoded
check("A_published_content_has_new_brand", pub_has_brand, "put" if put else "put_missing")
# serve the 'published' file on later reloads (mimics GitHub Pages)
import bcx_mock
bcx_mock.set_published(decoded)

# ================= (B) fresh reload -> login -> published brand shows =================
w.clear_storage(); w.nav(URL); w.eval(INJECT); w.eval(EXTRA1)
sB = snap_branding(w)
check("B_fresh_uses_published_brand_S", sB["S"]["brandAr"] == NEW_br[0], sB["S"])
check("B_fresh_form_shows_published_brand_no_stale", not find_stale(sB), find_stale(sB))
check("B_header_brand_span", sB["headerBrand"] == NEW_br[0], sB["headerBrand"])
check("B_hero_default_still", sB["heroText"] == "راحة بالك تبدأ من هنا", sB["heroText"])
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
sB2 = snap_branding(w)
check("B_after_login_no_stale_inputs", not find_stale(sB2), find_stale(sB2))
# ================= (C) hero title AR/EN + hero size 99 -> save -> clamp + storefront =================
w.eval('goBrandingTab()'); time.sleep(0.3)
w.eval(f'document.querySelector("#cfgHeroTitleAr").value = {NEW_hero[0]!r};'
       f'document.querySelector("#cfgHeroTitleEn").value = {NEW_hero[1]!r};'
       f'document.querySelector("#cfgHeroSize").value = "99";'
       f'window.saveBranding && saveBranding();')
time.sleep(0.5)
sC = snap_branding(w)
check("C_heroSize_clamped", sC["S"]["heroSize"] <= 6, sC["S"]["heroSize"])
check("C_heroSize_input_clamped", sC["inputs"]["cfgHeroSize"] != "99", sC["inputs"]["cfgHeroSize"])
check("C_heroTitle_S_saved", sC["S"]["heroTitleAr"] == NEW_hero[0] and sC["S"]["heroTitleEn"] == NEW_hero[1], sC["S"])
check("C_hero_arabic_on_storefront_AR", sC["heroText"] == NEW_hero[0], sC["heroText"])

# reload (persisted settings) -> storefront hero EN after switching, login check too
w.nav(URL); w.eval(INJECT)
sC2 = snap_branding(w)
check("C_hero_persists_reload", sC2["S"]["heroTitleAr"] == NEW_hero[0], sC2["S"])
check("C_hero_storefront_after_reload", sC2["heroText"] == NEW_hero[0], sC2["heroText"])
check("C_after_reload_no_stale", not find_stale(sC2), find_stale(sC2))

# footer edits persist across reload (AR + EN)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval('document.querySelector("#cfgFooterAr").value = "فوتر معدّل";'
       'document.querySelector("#cfgFooterEn").value = "Footer edited";'
       'window.saveBranding && saveBranding();')
time.sleep(0.4)
sF1 = snap_branding(w)
check("D_footer_saved", sF1["S"]["footerAr"] == "فوتر معدّل", sF1["S"])
check("D_footer_storefront_AR", sF1["footerText"] == "فوتر معدّل", sF1["footerText"])
w.nav(URL); w.eval(INJECT)
sF2 = snap_branding(w)
check("D_footer_persists_reload", sF2["S"]["footerAr"] == "فوتر معدّل" and sF2["S"]["footerEn"] == "Footer edited", sF2["S"])
check("D_footer_storefront_after_reload", sF2["footerText"] == "فوتر معدّل", sF2["footerText"])
check("D_after_reload_no_stale", not find_stale(sF2), find_stale(sF2))
# ================= (F2) revert mock-publish to wanas123 + original index.html
# (fresh localStorage: published-value hydration comes from the file block)#
import bcx_mock
bcx_mock.reset_to_original()
w.clear_storage(); w.nav(URL); w.eval(INJECT)
sF2b = snap_branding(w)
check("F2_original_file_defaults_restored", sF2b["S"]["brandAr"] == "وَنَس", sF2b["S"])
w.clear_storage(); w.nav(URL)
# ================= (E) reset -> defaults; (F) password state restore =================
w.eval(INJECT); w.eval(EXTRA2)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval('resetNow()'); time.sleep(0.6)
sE = snap_branding(w)
DEFS = {"brandAr": "وَنَس", "brandEn": "Wanas", "heroTitleAr": "راحة بالك تبدأ من هنا",
        "heroTitleEn": "Peace of mind starts here", "heroSize": 2.4,
        "footerAr": "شُمُوعٌ تَمْنَحُكَ دَفْءَ الشَّمْسِ 🕯️",
        "footerEn": "Candles that give you the comfort of the sun 🕯️"}
PAIRS = [("brandAr", "cfgBrandAr"), ("brandEn", "cfgBrandEn"),
         ("heroTitleAr", "cfgHeroTitleAr"), ("heroTitleEn", "cfgHeroTitleEn"),
         ("heroSize", "cfgHeroSize"),
         ("footerAr", "cfgFooterAr"), ("footerEn", "cfgFooterEn")]
ok_def = all(sE["S"][k] == DEFS[k] for k in DEFS)
check("E_reset_defaults_S", ok_def, sE["S"])
ok_inputs = all(sE["inputs"][iid] == DEFS[k] for k, iid in PAIRS)
check("E_reset_emptyish_form_matches_defaults", ok_inputs, sE["inputs"])
check("E_storefront_hero_back_to_default", sE["heroText"] == DEFS["heroTitleAr"], sE["heroText"])
check("E_storefront_brand_back_to_default", sE["headerBrand"] == DEFS["brandAr"], sE["headerBrand"])

# reset must also wipe saved adminPW overrides -> default wanas123 works
w.nav(URL); w.eval(INJECT)
pw_check = w.eval("""
(() => {
  document.querySelector('#adminBtn').click();
  document.querySelector('#adminPass').value = 'wanas123';
  document.querySelector('#adminLoginBtn').click();
  return adminUnlocked === true;
})()
""")
check("F_password_still_wanas123_after_reset", pw_check == True, pw_check)
# ensure no lingering adminPW record from earlier suites
has_pw = w.eval('storedPWCodes() !== null && storedPWCodes() !== undefined && storedPWCodes() ? true : false')
if has_pw is True:
    w.eval('localStorage.removeItem("wanas_adminPW"); "wiped"')

# ================= (G) import backup -> form follows S (no stale) =================
BK = {"type": "full",
      "categories": [{"id": "c1", "ar": "شموع", "en": "Candles"}],
      "products": [{"id": "p31", "cat": "c1", "ar": "وردة", "en": "Rose", "price": 26, "imgs": []}],
      "settings": {"brandAr": "براند مستورد", "brandEn": "Imported Brand",
                   "heroTitleAr": "هيرو مستورد", "heroTitleEn": "Imported Hero",
                   "footerAr": "فوتر مستورد", "footerEn": "Imported footer"}}
w.eval(INJECT + f"""; (() => {{
  const dt = new DataTransfer();
  dt.items.add(new File([{json.dumps(json.dumps(BK))}], 'bk.json', {{type:'application/json'}}));
  const input = document.querySelector('#importFile');
  input.files = dt.files;
  input.dispatchEvent(new Event('change'));
  return 'fired';
}})()""")
time.sleep(0.8)
sG = snap_branding(w)
check("G_import_sets_S", sG["S"]["brandAr"] == "براند مستورد" and sG["S"]["heroTitleAr"] == "هيرو مستورد", sG["S"])
check("G_import_form_no_stale", not find_stale(sG), find_stale(sG))

# probe storefront hero after import WITHOUT a reload (is applyLang callable in-session?)
G_storefront = w.eval('(document.getElementById("heroTitleText")||{}).textContent || null')
sG["storefrontHeroAfterImportNoReload"] = G_storefront
check("G_storefront_imported", sG["heroText"] == "هيرو مستورد", sG["heroText"])

# ================= (H) reset with stale hero h1 — is storefront refreshed in-session? =================
w.eval(INJECT); w.eval(EXTRA2)
w.eval('doAdminLoginNPC()'); time.sleep(0.4)
w.eval('document.querySelector("#cfgHeroTitleAr").value = "هيرو قبل الريسِت";'
       'window.saveBranding && saveBranding();')
time.sleep(0.5)
hero_dirty = w.eval('(document.getElementById("heroTitleText")||{}).textContent')
w.eval('resetNow()'); time.sleep(0.6)
hero_after_reset = w.eval('(document.getElementById("heroTitleText")||{}).textContent')
S_hero_after = w.eval('S.heroTitleAr')
check("H_reset_refreshes_storefront_hero_in_session", hero_after_reset == "راحة بالك تبدأ من هنا" and S_hero_after == "راحة بالك تبدأ من هنا",
      {"hero_dirty": hero_dirty, "hero_after_reset": hero_after_reset, "S": S_hero_after})
pw_left = w.eval('storedPWCodes() ? true : false')
check("H_no_adminPW_override_left", pw_left == False, pw_left)

# ================= final: cleanup to defaults, report =================
w.clear_storage(); w.nav(URL)
errs = w.console_errors()
print("\nWORKING", json.dumps(W_, ensure_ascii=False))
print("\nBUGS", json.dumps(B_, ensure_ascii=False))
print("\nCONSOLE_ERRORS", json.dumps(errs))
print("\nCOUNTS", json.dumps({"working": len(W_), "bugs": len(B_), "total_checks": len(W_) + len(B_)}))

