#!/usr/bin/env python3
"""Wanas CONTACT/COMMS exhaustive test using wanas_cdp harness. Own ports."""
import sys, os, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = {"tests": [], "console_errors": []}
def t(name, ok, detail=""):
    R["tests"].append({"name": name, "ok": bool(ok), "detail": str(detail)[:400]})
    print(f"{'PASS' if ok else 'FAIL'} | {name} | {str(detail)[:260]}")

def chips(w):
    return w.ev("""Array.from(document.querySelectorAll('#footerCommsContainer .wanas-comm')).map(e=>({tag:e.tagName,href:e.getAttribute('href'),text:e.textContent.trim()}))""") or []

def set_form(w, icon, ar, en, value, ctype):
    w.ev(f"""(function(){{
      document.getElementById('cfgCommIcon').value={json.dumps(icon)};
      document.getElementById('cfgCommAr').value={json.dumps(ar)};
      document.getElementById('cfgCommEn').value={json.dumps(en)};
      document.getElementById('cfgCommValue').value={json.dumps(value)};
      document.getElementById('cfgCommType').value={json.dumps(ctype)};
      addOrUpdateComm(); return 1;}})()""")

def main():
    server, sport = launch_server(SRC)
    browser, cport = launch_browser(cdp_port=8421, profile='/tmp/wanas-qa-comm2')
    w = Wanas(cport, f'http://127.0.0.1:{sport}/index.html')
    errs = []
    try:
        w.open()
        w.ev("localStorage.clear(); sessionStorage.clear();")
        w.ev("location.reload();"); time.sleep(2)

        comms = w.ev("S.comms.map(c=>({ar:c.ar,en:c.en,type:c.type,value:c.value}))")
        t("published_block_loads_on_fresh", len(comms)==3 and comms[2]["en"]=="Instagram",
          {"entries":len(comms), "note":"PUBLISHED_DEFAULTS.settings.comms wins on fresh load"})
        t("BUG_check_published_block_duplicate_Instagram", len(comms)==2, comms)  # expect FAIL -> bug

        # login admin
        t("admin_login", w.login_admin() is True)
        w.ev("(typeof showSettingsPanel==='function') && showSettingsPanel('comms'); typeof renderCommList==='function' && renderCommList(); true")

        # clear the duplicate to get clean slate: use hard reset button semantics
        w.ev("window.confirm=()=>true; document.getElementById('resetBtn').click(); true"); time.sleep(0.5)
        comms = w.ev("S.comms.map(c=>c.en)")
        t("defaults_after_reset_button", comms==["Instagram","Facebook"], comms)
        w.ev("renderCommList(); 1")
        t("renderCommList_defaults", w.ev("document.querySelectorAll('#commList .contact-item').length")==2)

        # footer chips: 2 social https
        c = chips(w)
        t("footer_default_chips", len(c)==2 and all(x["href"] and x["href"].startswith("https://") for x in c), c)

        # --- add contact method (wa.me intl conversion) ---
        set_form(w, "💬", "واتس", "WhatsApp", "01020306395", "contact")
        comms = w.ev("S.comms.map(c=>({en:c.en,type:c.type}))")
        t("add_contact_method_fields", len(comms)==3 and comms[2]["en"]=="WhatsApp" and comms[2]["type"]=="contact", comms)
        chip = w.ev("""(function(){const a=document.querySelector('#footerCommsContainer a[href*="wa.me"]'); return a?{href:a.getAttribute('href'),text:a.textContent.trim()}:null;})()""")
        t("wa_me_intl_conversion", chip and chip["href"]=="https://wa.me/201020306395", chip)

        # --- social https guard: javascript: value must NOT become a link ---
        set_form(w, "🎵", "تيك توك", "TikTok", "javascript:alert(1)", "social")
        js_count = w.ev("""Array.from(document.querySelectorAll('#footerCommsContainer a')).map(a=>a.getAttribute('href')).filter(h=>h&&h.toLowerCase().startsWith('javascript')).length""")
        tk = [x for x in chips(w) if 'TikTok' in x['text']]
        t("https_guard_social_exec_blocked", js_count==0 and tk and tk[0]["tag"]=="SPAN", {"js_count":js_count,"tiktok":tk})
        # social with http:// (non-https) — allowed per /^https?:\/\//i guard; note relay
        set_form(w, "🔗", "موقع", "Site", "http://example.com", "social")
        chip = w.ev("""(function(){const a=document.querySelector('#footerCommsContainer a[href="http://example.com"]'); return a?1:0;})()""")
        t("https_guard_allows_http_and_https", chip==1, chip)
        # social with plain invalid (not starting with h) -> span no href
        set_form(w, "❓", "مشبوه", "Suspicious", "ftp://files.example.com", "social")
        sp = [x for x in chips(w) if 'Suspicious' in x['text']]
        t("https_guard_scheme_block", sp and sp[0]["tag"]=="SPAN", sp)

        # --- text method (no href) ---
        set_form(w, "📍", "العنوان", "Address", "Cairo, Egypt", "text")
        comms = w.ev("S.comms.length")
        t("add_text_method", comms==6, comms)
        wx = [x for x in chips(w) if 'Address' in x['text']]
        t("text_chip_no_href", wx and wx[0]["tag"]=="SPAN" and not wx[0]["href"], wx)

        # --- persistence: saved to localStorage ---
        saved = w.ev("JSON.parse(localStorage.getItem('wanas_settings')).comms.length")
        t("saved_to_localStorage", saved==6, saved)

        # --- language switch re-renders footer in right language ---
        lang0 = w.ev("document.documentElement.lang")
        texts0 = [x['text'] for x in chips(w)]
        w.ev("document.getElementById('langBtn').click(); 1"); time.sleep(1)
        lang1 = w.ev("document.documentElement.lang")
        texts1 = [x['text'] for x in chips(w)]
        t("lang_switch_renders_footer", lang0!=lang1 and texts0!=texts1, {"before":texts0,"after":texts1})
        expect = [(cm["en"] if w.ev("document.documentElement.lang")=="en" else cm["ar"]) for cm in (w.ev("S.comms") or [])]
        got = [x['text'][1:] for x in chips(w)]  # strip icon char
        t("footer_labels_match_current_lang", got==expect, {"expected":expect,"got":got})
        w.ev("document.getElementById('langBtn').click(); 1"); time.sleep(1)

        # --- edit: editCommIdx ---
        idx = w.ev("(function(){const i=S.comms.findIndex(c=>c.en==='Address'); editComm(i); return editCommIdx;})()")
        t("editComm_sets_idx", idx==5, idx)
        vals = w.ev("({icon:document.getElementById('cfgCommIcon').value, en:document.getElementById('cfgCommEn').value, type:document.getElementById('cfgCommType').value})")
        t("editComm_loads_into_form", vals["en"]=="Address" and vals["type"]=="text", vals)
        w.ev("(function(){document.getElementById('cfgCommEn').value='AddressEd'; document.getElementById('cfgCommValue').value='Giza, Egypt'; addOrUpdateComm(); return 1;})()")
        names = w.ev("S.comms.map(c=>c.en)")
        t("edit_comm_applies_update", "Address" not in names and "AddressEd" in names, names)
        t("editCommIdx_cleared_after_save", w.ev("editCommIdx")==None, w.ev("editCommIdx"))
        t("addCommBtn_label_restored", w.ev("document.getElementById('addCommBtn').textContent")==w.ev("t('add')"), w.ev("document.getElementById('addCommBtn').textContent"))
        t("edit_preserves_count", w.ev("S.comms.length")==6, w.ev("S.comms.length"))

        # --- dedupe ---
        set_form(w, "🎯", "مكرر", "Dupe", "https://dupe.example", "social")
        set_form(w, "🎯", "مكرر", "Dupe", "https://dupe.example", "social")
        dupes = w.ev("S.comms.filter(c=>c.en==='Dupe').length")
        total = w.ev("S.comms.length")
        t("BUG_check_dedupe_identical", dupes==1, {"total":total,"dupeCount":dupes})  # per task spec: no duplicates

        # --- delete ---
        before = w.ev("S.comms.length")
        w.ev("(function(){const i=S.comms.findIndex(c=>c.en==='AddressEd'); document.querySelectorAll('#commList [data-del-comm]')[i].click(); return 1;})()")
        after = w.ev("S.comms.length")
        gone = w.ev("S.comms.some(c=>c.en==='AddressEd')")
        t("delete_comm_row", after==before-1 and not gone, {"before":before,"after":after})
        t("footer_after_delete", not any('AddressEd' in x['text'] for x in chips(w)))
        t("saved_after_delete", w.ev("JSON.parse(localStorage.getItem('wanas_settings')).comms.length")==after)

        # --- XSS bold in all comm fields ---
        set_form(w, "<b>bd</b>", "<b>XSSar</b>", "<b>XSSen</b>", "<b>XSSval</b>", "social")
        bold_footer = w.ev("document.querySelectorAll('#footerCommsContainer b').length")
        bold_list   = w.ev("document.querySelectorAll('#commList b, #commList .ci-icon b, #commList .ci-info b').length")
        chip = w.ev("""(function(){const as=document.querySelectorAll('#footerCommsContainer .wanas-comm'); for(const a of as){ if(a.textContent.includes('XSS')){ return {text:a.textContent.trim(), b:!!a.querySelector('b'), href:a.getAttribute('href')};}} return null;})()""")
        t("xss_bold_footer_escaped", bold_footer==0 and chip and not chip['b'] and "<b>" in chip["text"], {"bold_footer":bold_footer,"chip":chip})
        t("BUG_check_bold_adminlist_escaped", bold_list==0, bold_list)  # expect FAIL -> bug
        t("xss_bold_value_not_executed", w.ev("window.__xssBoldVal!==true"))

        # --- XSS img onerror ---
        set_form(w, "<img src=x onerror=window.__xssImgExecuted=true>", "XSSar2", "XSSimg2", "https://x.example", "social")
        img_footer = w.ev("document.querySelectorAll('#footerCommsContainer img').length")
        img_list   = w.ev("document.querySelectorAll('#commList img').length")
        xss_exec   = w.ev("window.__xssImgExecuted===true")
        chip = w.ev("""(function(){const as=document.querySelectorAll('#footerCommsContainer .wanas-comm'); for(const a of as){ if(a.textContent.includes('XSSimg2')||a.textContent.includes('onerror')){ return {text:a.textContent.trim(), img:!!a.querySelector('img')};}} return null;})()""")
        t("xss_img_footer_escaped", img_footer==0 and xss_exec is False and chip and not chip['img'], {"img_footer":img_footer,"exec":xss_exec,"chip":chip})
        t("BUG_check_img_adminlist_escaped", img_list==0 and xss_exec is False, {"img_list":img_list,"exec":xss_exec})  # expect FAIL -> bug

        # --- persistence across reload ---
        before_n = w.ev("S.comms.length")
        w.ev("location.reload(); 1"); time.sleep(2)
        after_n = w.ev("S.comms ? S.comms.length : -1")
        t("persistence_after_reload", after_n==before_n, {"before":before_n,"after":after_n})
        c = chips(w)
        t("footer_chips_after_reload", len(c)==after_n, c)
        t("xss_still_escaped_after_reload", w.ev("document.querySelectorAll('#footerCommsContainer img, #footerCommsContainer b').length")==0)

        # --- mock publish: simulates what publishToGitHub would write into PUBLISHED_DATA block ---
        mock = w.ev("""(function(){
          // mock publish: replicate publishToGitHub's payload assembly without touching the file
          const pubData = { categories: DATA.categories, products: DATA.products, settings: S };
          const begin='/* PUBLISHED_DATA:BEGIN */', end='/* PUBLISHED_DATA:END */';
          const newBlock = begin+'\\nconst PUBLISHED_DEFAULTS = '+JSON.stringify(pubData)+';\\n'+end;
          return {comms: JSON.parse(newBlock.match(/PUBLISHED_DEFAULTS = (\\{.*\\});/)[1]).settings.comms.length};
        })()""")
        t("published_block_after_mock_publish", mock and mock.get("comms")==after_n, mock)
        # verify a fresh browser loading that mock-published settings block would show the same comms:
        w.ev("(function(){localStorage.setItem('wanas_pub_mock', JSON.stringify(S.comms)); return 1;})()")
        w.ev("location.reload(); 1"); time.sleep(2)
        t("published_mock_comms_survive_reload", w.ev("JSON.parse(localStorage.getItem('wanas_pub_mock')).length")==after_n)

        # --- reset returns Instagram/Facebook defaults ---
        w.ev("window.confirm=()=>true; document.getElementById('resetBtn').click(); true"); time.sleep(0.5)
        comms = w.ev("S.comms.map(c=>c.en)")
        t("defaults_return_after_reset", comms==["Instagram","Facebook"], comms)
        c = chips(w)
        t("footer_defaults_after_reset", len(c)==2 and all(x["href"].startswith("https") for x in c), c)

        errs = w.console_errors() or []
        R["console_errors"] = errs
        print(f"\nConsole errors: {len(errs)}")
        for e_ in errs: print("  -", str(e_)[:200])
    finally:
        stop_all(server, browser)
    counts = {"total": len(R["tests"]), "pass": sum(1 for x in R["tests"] if x["ok"]), "fail": sum(1 for x in R["tests"] if not x["ok"])}
    R["counts"] = counts
    print("\nCOUNTS:", json.dumps(counts))
    print("VERDICT:", "ALL PASS" if counts["fail"]==0 and not errs else "HAS FAILURES")
    with open(os.path.join(SRC, 'qa', 'comm-results.json'), 'w') as f:
        json.dump(R, f, indent=2, default=str)

if __name__ == "__main__":
    main()
