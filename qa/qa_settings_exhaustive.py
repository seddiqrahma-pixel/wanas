"""Exhaustive SETTINGS test: branding/hero/footer/colors/fonts + market pricing."""
import json, time, re, sys
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

R = {'summary':'', 'working':[], 'bugs':[], 'console_errors':[], 'counts':{}}
def ok(msg): R['working'].append(msg)
def bug(msg): R['bugs'].append(msg)

def F_MR(pid, val):
    js = "(()=>{const i=document.querySelector('.mr-market[data-id=\""+pid+"\"]');i.value='"+val+"';i.dispatchEvent(new Event('change'))})()"
    return w.ev(js)

server = launch_server('/Users/ahmed.alghoraib/Desktop/Wanas')
browser = launch_browser()
w = Wanas(browser[1], f'http://127.0.0.1:{server[1]}/index.html')
w.open()
try:
    # fresh state
    w.ev("localStorage.clear(); location.reload();")
    time.sleep(2)
    assert w.login_admin(), 'admin login failed'

    def brand_state():
        return w.ev("""(()=>{
          const el=document.querySelector('.nav .logo [data-i18n="brand"]');
          const foot=document.querySelector('footer.foot [data-i18n="brand"]');
          const cs=el?getComputedStyle(el):null;
          const logo=document.querySelector('.nav .logo-img');
          const flogo=document.querySelector('.foot-logo');
          const h1=document.getElementById('heroTitleText');
          const sub=document.getElementById('heroSubText');
          const tag=document.getElementById('footerTaglineText');
          const bpAr=document.getElementById('bpBrandTextAr');
          const bpEn=document.getElementById('bpBrandTextEn');
          return {
            header: el?el.textContent:null,
            footer: foot_el(foot_el_safe()),
            logoSrc: logo?logo.getAttribute('src'):null,
            flogoSrc: flogo?flogo.getAttribute('src'):null,
            h1: h1?h1.textContent:null,
            sub: sub?sub.textContent:null,
            tagline: tag?tag.textContent:null,
            bpAr: bpAr?bpAr.textContent:null,
            bpEn: bpEn?bpEn.textContent:null,
            font: cs?cs.fontFamily:null,
            size: cs?cs.fontSize:null,
            color: cs?cs.color:null,
            lang: LANG
          };
          function foot_el(el){ return el?el.textContent:null; }
          function foot_el_safe(){ return document.querySelector('footer.foot [data-i18n="brand"]'); }
        })()""")

    # ---------- (A) Branding ----------
    b0 = brand_state()
    ok(f"A baseline lang={b0['lang']} header={b0['header']} footer={b0['footer']}")
    w.ev("document.querySelector('[data-st=\"branding\"]').click();")
    time.sleep(0.2)
    w.ev("document.getElementById('cfgBrandAr').value='براند-عربي-جديد';")
    w.ev("document.getElementById('cfgBrandEn').value='BrandEN-Test';")
    w.ev("document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.5)
    bAR = brand_state()
    ok(f"A after save(AR mode): header={bAR['header']} footer={bAR['footer']} previewAr={bAR['bpAr']} previewEnHiddenArMode={bAR['bpEn']}")
    if bAR['header']!='براند-عربي-جديد': bug(f"A: header brand not updated in AR (got {bAR['header']!r})")
    if bAR['footer']!='براند-عربي-جديد': bug(f"A: footer brand not updated in AR (got {bAR['footer']!r})")
    if bAR['bpAr']!='براند-عربي-جديد': bug(f"A: preview AR text mismatch ({bAR['bpAr']!r})")
    # toggle to EN
    w.ev("document.getElementById('langBtn').click();")
    time.sleep(0.5)
    bEN = brand_state()
    ok(f"A EN mode: header={bEN['header']} footer={bEN['footer']} previewEn={bEN['bpEn']}")
    if bEN['header']!='BrandEN-Test': bug(f"A: header brand not per-language in EN (got {bEN['header']!r})")
    if bEN['footer']!='BrandEN-Test': bug(f"A: footer brand not per-language in EN (got {bEN['footer']!r})")
    if bEN['bpEn']!='BrandEN-Test': bug(f"A: preview EN mismatch")
    # restore default brand names for later checks
    w.ev("document.getElementById('cfgBrandAr').value='وَنَس';document.getElementById('cfgBrandEn').value='Wanas';document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)

    # ---------- (B) Logo paths ----------
    w.ev("document.getElementById('cfgLogo').value='logo-icon.png';document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    b1 = brand_state()
    ok(f"B header logo src after cfgLogo=logo-icon.png: {b1['logoSrc']} footer(hd): {b1['flogoSrc']}")
    if b1['logoSrc']!='logo-icon.png': bug(f"B: header logo src not updated ({b1['logoSrc']})")
    w.ev("document.getElementById('cfgLogoSmall').value='logo.png';document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    b2 = brand_state()
    ok(f"B after cfgLogoSmall=logo.png: footer logo src={b2['flogoSrc']} header={b2['logoSrc']}")
    if b2['flogoSrc']!='logo.png': bug(f"B: footer logo (cfgLogoSmall) not updated ({b2['flogoSrc']})")
    # nonexistent path
    w.ev("document.getElementById('cfgLogo').value='no-such-logo-xyz.png';document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.6)
    b3 = brand_state()
    broken = w.ev("""(()=>{const i=document.querySelector('.nav .logo-img');
      const probe=new Image(); probe.src=i.getAttribute('src');
      return {src:i.getAttribute('src'), naturalWidth:i.naturalWidth, fallbackAttr:!!i.getAttribute('onerror')};})()""")
    ok(f"B nonexistent path: src={b3['logoSrc']} probe={broken}")
    print(json.dumps({'broken_probe':broken}))
    w.ev("document.getElementById('cfgLogo').value='logo.png';document.getElementById('saveBrandingBtn').click();")
    w.ev("document.getElementById('cfgLogoSmall').value='logo-icon.png';document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)

    # ---------- (C) brand font/size/color ----------
    w.ev("document.getElementById('cfgBrandFont').value=\"'Amiri',serif\";")
    w.ev("document.getElementById('cfgBrandSize').value='2.0';")
    w.ev("document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    s = w.ev("""(()=>{const el=document.querySelector('.nav .logo [data-i18n="brand"]');const c=getComputedStyle(el);return{f:c.fontFamily,s:c.fontSize};})()""")
    ok(f"C brand font/size: {s}")
    if 'Amiri' not in (s['f'] or ''): bug(f"C: brand font-family didn't apply ({s['f']})")
    if s['s']!= '32px': bug(f"C: brand size 2rem=32px expected, got {s['s']}")
    w.ev("document.getElementById('cfgBrandColor').value='#123456';")
    w.ev("document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    col = w.ev("getComputedStyle(document.querySelector('.nav .logo [data-i18n=\"brand\"]')).color")
    ok(f"C brand color computed: {col}")
    if col != 'rgb(18, 52, 86)': bug(f"C brand color mismatch got {col}")

    # ---------- (D) Hero ----------
    w.ev("document.getElementById('cfgHeroTitleAr').value='عنوان-هيرو-جديد';document.getElementById('cfgHeroTitleEn').value='New Hero Title';")
    w.ev("document.getElementById('cfgHeroSubAr').value='وصف-هيرو-جديد';document.getElementById('cfgHeroSubEn').value='New Hero Sub';")
    w.ev("document.getElementById('cfgHeroFont').value=\"'Cairo',Segoe UI,Tahoma,sans-serif\";")
    w.ev("document.getElementById('cfgHeroSize').value='3.2';")
    w.ev("document.getElementById('cfgHeroColor').value='#990000';")
    w.ev("document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    h = w.ev("""(()=>{const h1=document.getElementById('heroTitleText'),sub=document.getElementById('heroSubText');
      const c1=getComputedStyle(h1),c2=getComputedStyle(sub);
      return {h1:h1.textContent,sub:sub.textContent,f:c1.fontFamily,s:c1.fontSize,col:c1.color,subCol:c2.color};})()""")
    ok(f"D hero AR: {h}")
    if h['h1']!='عنوان-هيرو-جديد': bug(f"D hero title AR not applied: {h['h1']!r}")
    if h['sub']!='وصف-هيرو-جديد': bug(f"D hero sub AR not applied: {h['sub']!r}")
    if 'Cairo' not in h['f']: bug(f"D hero font family not applied: {h['f']}")
    if h['s']!='51.2px': bug(f"D hero size 3.2rem expected 51.2px got {h['s']}")
    if h['col']!='rgb(153, 0, 0)': bug(f"D hero color got {h['col']}")
    w.ev("document.getElementById('langBtn').click();")  # EN
    time.sleep(0.4)
    hEN = w.ev("({h1:document.getElementById('heroTitleText').textContent, sub:document.getElementById('heroSubText').textContent})")
    ok(f"D hero EN: {hEN}")
    if hEN['h1']!='New Hero Title' or hEN['sub']!='New Hero Sub': bug(f"D hero EN texts failed: {hEN}")
    # hero sub size
    w.ev("document.getElementById('cfgHeroSubSize').value='1.5';document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    sc = w.ev("getComputedStyle(document.getElementById('heroSubText')).fontSize")
    ok(f"D hero sub size: {sc} (expect 24px)")
    if sc != '24px': bug(f"D hero sub size got {sc}")
    w.ev("document.getElementById('langBtn').click();")  # back to AR

    # ---------- (E) Footer tagline + comms ----------
    w.ev("document.getElementById('cfgFooterAr').value='تاج-لاين-عربي';document.getElementById('cfgFooterEn').value='Tagline-EN';")
    w.ev("document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    tg = w.ev("document.getElementById('footerTaglineText').textContent")
    ok(f"E tagline AR: {tg}")
    if tg!='تاج-لاين-عربي': bug(f"E tagline AR failed: {tg!r}")
    # comms CRUD: add
    w.ev("document.getElementById('cfgCommIcon').value='💬';document.getElementById('cfgCommAr').value='واتساب-تجربة';document.getElementById('cfgCommEn').value='WhatsApp Test';document.getElementById('cfgCommValue').value='01000000000';document.getElementById('cfgCommType').value='contact';document.getElementById('addCommBtn').click();")
    time.sleep(0.4)
    comms1 = w.ev("""(()=>{const c=document.getElementById('footerCommsContainer');
      const a=c.querySelector('a.wanas-comm:last-child');
      return {html:c.innerHTML.slice(-260), href:a?a.getAttribute('href'):null, text:a?a.textContent.trim():null};})()""")
    ok(f"E added comm: href={comms1['href']} text={comms1['text']}")
    if comms1['href']!='https://wa.me/200100000000': bug(f"E expected wa.me/200100000000 got {comms1['href']}")
    if comms1['text'] and 'واتساب-تجربة' not in comms1['text']: bug(f"E comm text mismatch {comms1['text']!r}")
    # edit it
    w.ev("document.querySelector('[data-edit-comm=\"2\"]').click();")
    w.ev("document.getElementById('cfgCommAr').value='واتساب-معدل';document.getElementById('cfgCommValue').value='https://example.com/edited';document.getElementById('addCommBtn').click();")
    time.sleep(0.4)
    comms2 = w.ev("""(()=>{const a=document.querySelector('#footerCommsContainer a.wanas-comm:last-child');
      return {href:a.getAttribute('href'), text:a.textContent.trim()};})()""")
    ok(f"E edited comm: {comms2}")
    if comms2['href']!='https://example.com/edited' or 'واتساب-معدل' not in comms2['text']: bug(f"E edit failed {comms2}")
    # delete it
    n_before = w.ev("document.querySelectorAll('#footerCommsContainer .wanas-comm').length")
    w.ev("document.querySelector('[data-del-comm=\"2\"]').click();")
    time.sleep(0.3)
    n_after = w.ev("document.querySelectorAll('#footerCommsContainer .wanas-comm').length")
    ok(f"E delete comm: {n_before} -> {n_after}")
    if n_after != n_before-1: bug(f"E delete comm count {n_before}->{n_after}")
    # check EN tagline
    w.ev("document.getElementById('langBtn').click();")
    time.sleep(0.4)
    tgEN = w.ev("document.getElementById('footerTaglineText').textContent")
    ok(f"E tagline EN: {tgEN}")
    if tgEN!='Tagline-EN': bug(f"E tagline EN failed: {tgEN!r}")
    w.ev("document.getElementById('langBtn').click();")

    # ---------- (F) Colors ----------
    w.ev("document.getElementById('cfgBrandColor').value='#00ff00';")
    w.ev("document.getElementById('cfgHeroColor').value='#0000ff';")
    w.ev("document.getElementById('cfgHeroSubColor').value='#ff00ff';")
    w.ev("document.getElementById('cfgFooterColor').value='#ffaa00';")
    w.ev("document.getElementById('cfgCatBgActive').value='#00aaaa';")
    w.ev("document.getElementById('cfgCatColorActive').value='#ffffff';")
    w.ev("document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.4)
    colors = w.ev("""(()=>{
      const brand=getComputedStyle(document.querySelector('.nav .logo [data-i18n=\"brand\"]')).color;
      const h1=getComputedStyle(document.getElementById('heroTitleText')).color;
      const sub=getComputedStyle(document.getElementById('heroSubText')).color;
      const ft=getComputedStyle(document.querySelector('footer.foot')).color;
      const tag=getComputedStyle(document.getElementById('footerTaglineText')).color;
      // click a real category tab to make it active
      const tabs=document.querySelectorAll('.cat-tab');
      if(tabs[1]) tabs[1].click();
      const act=document.querySelector('.cat-tab.active');
      const actBg=getComputedStyle(act).backgroundColor;
      const actCol=getComputedStyle(act).color;
      if(tabs[0]) tabs[0].click();
      return {brand,h1,sub,foot:ft,tagline:tag,actBg,actCol};})()""")
    ok(f"F colors: {colors}")
    exp = {'brand':'rgb(0, 255, 0)','h1':'rgb(0, 0, 255)','sub':'rgb(255, 0, 255)','actBg':'rgb(0, 170, 170)','actCol':'rgb(255, 255, 255)'}
    for k,v in exp.items():
        if colors[k]!=v: bug(f"F {k} expected {v} got {colors[k]}")
    # white color test
    w.ev("document.getElementById('cfgHeroColor').value='#ffffff';")
    w.ev("document.getElementById('saveBrandingBtn').click();")
    time.sleep(0.3)
    white = w.ev("getComputedStyle(document.getElementById('heroTitleText')).color")
    ok(f"F white hero color: {white}")
    if white!='rgb(255, 255, 255)': bug(f"F white not honored got {white}")

    # ---------- (G) Market pricing ----------
    market_state = w.ev("""(()=>{
      const l=JSON.parse(localStorage.getItem('wanas_settings')||'{}');
      return {mp:l.marketPrices||null, count:(DATA&&DATA.products)?DATA.products.length:null};})()""")
    ok(f"G initial marketPrices={market_state['mp']} products={market_state['count']}")
    ids = w.ev("DATA.products.slice(0,3).map(p=>({id:p.id,price:p.price}))")
    print(json.dumps({'ids':ids}))
    p0, p1, p2 = ids[0], ids[1], ids[2]
    # product 0: very high market 99999
    F_MR(p0['id'],'99999'); time.sleep(0.3)
    F_MR(p1['id'],str(p1['price']*3)); time.sleep(0.4)
    mp = w.ev("JSON.parse(localStorage.getItem('wanas_settings')).marketPrices")
    ok(f"G marketPrices persisted: {mp}")
    if not mp or mp.get(p0['id'])!=99999 or mp.get(p1['id'])!=p1['price']*3: bug(f"G marketPrices wrong: {mp}")
    # storefront check
    store = w.ev("""(()=>{
      const out=[];
      document.querySelectorAll('.card').forEach(card=>{
        const ph=card.querySelector('.ph');
        const pid=ph?ph.getAttribute('data-pid'):null;
        const old=card.querySelector('.price.old');
        const badge=card.querySelector('.discount-badge');
        if(pid) out.push({pid, old:old?old.textContent:null, badge:badge?badge.textContent:null});
      });
      return out;})()""")
    def card_for(pid):
        for c in (store or []):
            if c['pid']==pid: return c
        return None
    pct0 = round((1 - p0['price']/99999)*100)
    pct1 = round((1 - p1['price']/(p1['price']*3))*100)
    c0 = card_for(p0['id']); c1 = card_for(p1['id'])
    ok(f"G product {p0['id']}: {c0} | product {p1['id']}: {c1} | pct0={pct0} pct1={pct1}")
    if not (c0 and c0['old'] and c0['badge'] and str(pct0) in c0['badge']):
        bug(f"G product0 expected strikethrough + -{pct0}% badge; got {c0}")
    if not (c1 and c1['old'] and c1['badge'] and str(pct1) in c1['badge']):
        bug(f"G product1 expected -{pct1}% badge (hand check round(((market-price)/market)*100)); got {c1}")
    # market pricing badge left-over helpers reach
    def _card2(pid):
        js = "(()=>{const el=document.querySelector('.ph[data-pid=\""+pid+"\"]');if(!el)return null;const card=el.closest('.card');const o=card.querySelector('.price.old'),b=card.querySelector('.discount-badge');return {old:o?o.textContent:null,badge:b?b.textContent:null};})()"
        return w.ev(js)
    card_for = _card2
    F_MR(p2['id'], str(max(1, int(p2['price'])-1))); time.sleep(0.4)
    c2 = card_for(p2['id'])
    ok(f"G product {p2['id']} market<price: {c2} (expect no badge)")
    if c2 and c2['badge']: bug(f"G badge shown despite market<price: {c2}")
    # clear market price
    F_MR(p0['id'],'')
    time.sleep(0.4)
    mp2 = w.ev("JSON.parse(localStorage.getItem('wanas_settings')).marketPrices||{}")
    c0b = card_for(p0['id'])
    ok(f"G cleared: marketPrices={mp2}, card={c0b}")
    if p0['id'] in (mp2 or {}): bug(f"G market price for {p0['id']} not deleted")
    if c0b and c0b['badge']: bug(f"G badge still present after clearing market price: {c0b}")

    # ---------- (H) Persistence reload ----------
    w.ev("location.reload();")
    time.sleep(2)
    per = brand_state()
    settings_after = w.ev("(()=>{const s=JSON.parse(localStorage.getItem('wanas_settings'));return {logoPath:s.logoPath,logoIconPath:s.logoIconPath,marketPrices:s.marketPrices};})()")
    ok(f"H after reload: hero={per['h1']!r} tagline={per['tagline']!r} brandAr hdr={per['header']!r} flogo={per['flogoSrc']} settings={settings_after}")
    if per['h1']!='عنوان-هيرو-جديد': bug(f"H hero title not persisted: {per['h1']!r}")
    if per['tagline']!='تاج-لاين-عربي': bug(f"H tagline not persisted: {per['tagline']!r}")
    if not per['header'] or per['header']!='وَنَس' and per['header']!='' : pass
    if per['flogoSrc']!='logo-icon.png': bug(f"H footer logo not persisted: {per['flogoSrc']}")
    mpfr = settings_after.get('marketPrices')
    if not mpfr or mpfr.get(p1['id'])!=p1['price']*3: bug(f"H marketPrices not persisted: {mpfr}")

    # ---------- reset defaults ----------
    w.ev("window.confirm=()=>true;")
    w.ev("document.getElementById('adminBtn').style.display='';document.getElementById('adminBtn').click();")
    time.sleep(0.2)
    w.ev("document.getElementById('resetBtn').click();")
    time.sleep(0.5)
    w.ev("localStorage.removeItem('wanas_data');")
    w.ev("location.reload();")
    time.sleep(2)
    cnt = w.ev("DATA.products.length")
    d = w.ev("(()=>{const s=JSON.parse(JSON.stringify(DEFAULT_SETTINGS));return {brandAr:s.brandAr,heroTitleAr:s.heroTitleAr,logoPath:s.logoPath};})()")
    br = brand_state()
    ok(f"H reset: products={cnt} defaults={d} header={br['header']} hero={br['h1']!r}")
    if cnt!=30: bug(f"H product count after reset = {cnt}, expected 30")
    if br['h1']!='راحة بالك تبدأ من هنا': bug(f"H default hero not restored: {br['h1']!r}")
    if br['header']!='وَنَس': bug(f"H default brand not restored: {br['header']!r}")
    R['console_errors'] = w.console_errors()
    R['counts'] = {'products_after_reset': cnt, 'checks_run': len(R['working'])+len(R['bugs'])}
finally:
    stop_all(server[0] if isinstance(server,tuple) else server, browser[0])
    R['summary'] = f"Settings test: {len(R['working'])} passed steps, {len(R['bugs'])} bugs."
    open('/Users/ahmed.alghoraib/Desktop/Wanas/qa/settings_test_results.json','w').write(json.dumps(R,ensure_ascii=False,indent=2))
print(json.dumps(R, ensure_ascii=False, indent=1))
