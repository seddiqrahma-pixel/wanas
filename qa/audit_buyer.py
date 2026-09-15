import sys, json, time
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

root='/Users/ahmed.alghoraib/Desktop/Wanas'
server, port = launch_server(root)
browser, cdp = launch_browser()
w = Wanas(cdp, f'http://127.0.0.1:{port}/index.html')
w.open()
time.sleep(0.5)

out={"findings":[], "bugs":[]}
F=out["findings"]; B=out["bugs"]
def log(x): print(x)

try:
    # ---- 1. Grid render ----
    n_cards = w.ev("document.querySelectorAll('#productGrid .card').length")
    n_tabs = w.ev("document.querySelectorAll('#catTabs .cat-tab').length")
    n_total = w.ev("DATA.products.length")
    # category products counts
    cat_counts = w.ev("Object.fromEntries(DATA.categories.map(c=>[c.en,DATA.products.filter(p=>p.cat===c.id).length]))")
    F.append(f"grid_cards={n_cards} (DATA.products={n_total}) cat_tabs={n_tabs} per_cat={json.dumps(cat_counts)}")

    # scroll to load lazy images
    H = w.ev("document.body.scrollHeight") + 300
    y=0
    while y < H:
        w.ev(f"window.scrollTo(0,{y})"); time.sleep(0.12); y+=600
    w.ev("window.scrollTo(0,document.body.scrollHeight)"); time.sleep(0.5)
    # image audit
    img_audit = w.ev("(()=>{const cards=[...document.querySelectorAll('#productGrid .card')];const imgs=[...document.querySelectorAll('#productGrid .card img')];const noImg=cards.filter(c=>!c.querySelector('img')).length;const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src'));const loading=imgs.filter(i=>!i.complete).length;return {cards:cards.length,imgs:imgs.length,noImgCards:noImg,broken:[...new Set(broken)],stillLoading:loading};})()")
    F.append("img_audit="+json.dumps(img_audit))
    if img_audit["broken"]:
        B.append(f"BROKEN IMAGES naturalWidth=0: {img_audit['broken']}")
    if img_audit["noImgCards"]:
        F.append(f"NOTE: {img_audit['noImgCards']} cards render placeholder (no <img> in product data)")

    # prices EGP + money
    money_ar = w.ev("money(123)")
    price_samples = w.ev("[...document.querySelectorAll('#productGrid .card .price:not(.old)')].slice(0,3).map(e=>e.textContent)")
    F.append(f"money_ar_sample={money_ar} prices_sample={price_samples}")
    if "EGP" not in money_ar and "جنيه" not in money_ar:
        B.append("money() output is not EGP-formatted: "+money_ar)

    # discount badges: where market>price
    disc = w.ev("(()=>{const d=document.querySelectorAll('#productGrid .discount-badge').length;const r=[...document.querySelectorAll('#productGrid .discount-badge')].slice(0,4).map(e=>e.textContent);return {count:d,examples:r};})()")
    expected_disc = w.ev("DATA.products.filter(p=>{const m=(p.market!=null&&p.market>0)?p.market:(PRICING[p.id]&&PRICING[p.id].market);return typeof m==='number'&&p.price<m;}).length")
    F.append(f"discount_badges={disc} expected(market>price)={expected_disc}")
    if disc["count"] != expected_disc:
        B.append(f"discount badge count mismatch: shown {disc['count']} vs expected {expected_disc}")

    # ---- 2. Category filtering ----
    filter_res = {}
    for c in ["all"]+[c["id"] for c in w.ev("DATA.categories")]:
        w.ev(f"activeCat={json.dumps(c)};renderCats();renderProducts();")
        cnt = w.ev("document.querySelectorAll('#productGrid .card').length")
        exp = w.ev(f"activeCat==='all'?DATA.products.length:DATA.products.filter(p=>p.cat==='{c}').length")
        filter_res[c] = {"shown":cnt,"expected":exp}
        time.sleep(0.05)
    F.append("category_filter="+json.dumps(filter_res))
    bad_f = [k for k,v in filter_res.items() if v["shown"]!=v["expected"]]
    if bad_f: B.append(f"category filter card-count mismatch for: {bad_f}")
    w.ev("activeCat='all';renderProducts();")

    # ---- 3. Cart flow ----
    cart = w.ev("""(()=>{CART=[];saveCart();addToCart('p3');addToCart('p3');addToCart('p7');
        const badge=document.getElementById('cartCount').textContent;
        const drawerOpen=(()=>{openDrawer(true);return document.getElementById('cartDrawer').classList.contains('open');})();
        const rows=document.querySelectorAll('#cartItems .ci').length;
        const total=document.getElementById('cartTotal').textContent;
        const compute=cartTotal();
        const p3=DATA.products.find(x=>x.id==='p3').price,p7=DATA.products.find(x=>x.id==='p7').price;
        const expected=p3*2+p7;
        return {badge,drawerOpen,rows,total,compute,expected,ok:(badge==='3'&&compute===expected)};})()""")
    F.append("cart_add="+json.dumps(cart))
    if not cart["ok"]: B.append(f"cart add/total wrong: {cart}")

    # qty +/- 
    qty = w.ev("""(()=>{const el=[...document.querySelectorAll('#cartItems .ci')].find(r=>r.querySelector('b').textContent.includes('Wave')||true);
        const inc=[...document.querySelectorAll('#cartItems .ci')][0].querySelector('.inc');inc.click();
        const afterInc=cartTotal();
        const dec=[...document.querySelectorAll('#cartItems .ci')][0].querySelector('.dec');dec.click();
        const afterDec=cartTotal();
        const badge=document.getElementById('cartCount').textContent;
        return {afterInc,afterDec,badge};})()""")
    F.append("cart_qty="+json.dumps(qty))
    # verify badge reflects req count
    badge_check = w.ev("({badge:Number(document.getElementById('cartCount').textContent), req:CART.reduce((s,i)=>s+i.qty,0)})")
    F.append("cart_badge_final="+json.dumps(badge_check))
    if badge_check["badge"] != badge_check["req"]:
        B.append(f"cartCount badge mismatch: badge {badge_check['badge']} vs qty {badge_check['req']}")

    # ---- 4. Checkout + WhatsApp ----
    # reset cart to known
    w.ev("CART=[{id:'p3',qty:2},{id:'p7',qty:1}];saveCart();renderCart();updateCartCount();")
    w.ev("document.getElementById('checkoutBtn').click()")
    pay = w.ev("[...document.querySelectorAll('#payList .pay')].map(e=>e.dataset.k)")
    F.append("payment_methods="+json.dumps(pay))
    if set(pay) != {"vodafone","instapay","bank","whatsapp"}:
        B.append("checkout payment methods incorrect: "+json.dumps(pay))
    # intercept window.open
    w.ev("""window.__cap=null;window._origOpen=window.open;window.open=function(u,n){window.__cap=u;return null;};""")
    w.ev("document.getElementById('custName').value='Ahmed';document.getElementById('custPhone').value='01234567890';")
    # select whatsapp pay
    w.ev("[...document.querySelectorAll('#payList .pay')].find(e=>e.dataset.k==='whatsapp').click()")
    w.ev("document.getElementById('sendOrderBtn').click()")
    url = w.ev("window.__cap")
    wa_data = {"captured_wa_url": url}
    decode = None
    if url:
        import urllib.parse
        q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
        decode = urllib.parse.unquote(q.get("text",[""])[0])
        wa_data["decoded_text"] = decode
        wa_data["grand_total_line"] = [l for l in decode.split("\n") if "Grand Total" in l or "الإجمالي الكلي" in l]
    F.append("whatsapp="+json.dumps(wa_data, ensure_ascii=False)[:1500])
    if not url:
        B.append("window.open not intercepted/no wa.me URL captured")
    expected_total = w.ev("cartTotal()")
    if url:
        num_ok = str(expected_total) in (decode or "")
        if not num_ok:
            B.append(f"WhatsApp grand total missing/incorrect: expected {expected_total} in message")
    # restore
    w.ev("window.open=window._origOpen;")
    # Live calc for totals
    live_total = w.ev("cartTotal()")
    live_expected = w.ev("(DATA.products.find(x=>x.id==='p3').price*2)+DATA.products.find(x=>x.id==='p7').price")
    F.append(f"whatsapp_total_live=cartTotal:{live_total} expected:{live_expected}")
    if live_total != live_expected: B.append(f"cartTotal incorrect: {live_total} != {live_expected}")
    w.ev("closeModal();openDrawer(false);")

    # ---- 5. Language toggle ----
    lang_ar = w.ev("({lang:document.documentElement.lang,dir:document.documentElement.dir,btn:document.getElementById('langBtn').textContent,hero:document.getElementById('heroTitleText').textContent})")
    w.ev("document.getElementById('langBtn').click()")
    time.sleep(0.1)
    lang_en = w.ev("({lang:document.documentElement.lang,dir:document.documentElement.dir,btn:document.getElementById('langBtn').textContent,hero:document.getElementById('heroTitleText').textContent})")
    F.append("lang_toggle="+json.dumps({"ar":lang_ar,"en":lang_en}))
    if lang_en["dir"] != "ltr" or lang_ar["dir"] != "rtl":
        B.append(f"dir not flipped: ar={lang_ar['dir']} en={lang_en['dir']}")
    # hero text changed?
    if lang_ar["hero"] == lang_en["hero"]:
        B.append(f"hero text did not change between languages: {lang_en['hero']}")
    # tooltips on admin buttons - need admin panel. login
    w.ev("document.getElementById('adminBtn').style.display='';")
    w.ev("document.getElementById('adminBtn').click()")
    w.ev("document.getElementById('adminPass').value='wanas123';document.getElementById('adminLoginBtn').click();")
    time.sleep(0.3)
    unlocked = w.ev("!document.getElementById('adminPanel').classList.contains('hidden')")
    F.append("admin_login_correct="+str(unlocked))
    tips_en = w.ev("{btn:document.getElementById('adminBtn').title, exp:document.getElementById('exportBtn').title, res:document.getElementById('resetBtn').title}")
    # toggle to AR
    w.ev("document.getElementById('langBtn').click()")
    time.sleep(0.1)
    tips_ar = w.ev("{btn:document.getElementById('adminBtn').title, exp:document.getElementById('exportBtn').title, res:document.getElementById('resetBtn').title}")
    F.append("tooltips="+json.dumps({"en":tips_en,"ar":tips_ar}))
    changed = any(tips_en[k] != tips_ar[k] and tips_en[k]!="" for k in tips_en)
    if not changed:
        B.append(f"admin button tooltip titles did not change with lang: en={tips_en} ar={tips_ar}")
    if not tips_en["btn"] or not tips_en["exp"]:
        B.append(f"admin button titles empty in EN: {tips_en}")
    # back to EN? restore
    w.ev("document.getElementById('langBtn').click()")

except Exception as e:
    B.append("SCRIPT_ERROR: "+repr(e))
finally:
    stop_all(server, browser)

print("=====RESULT=====")
print(json.dumps({"findings":F,"bugs":B}, ensure_ascii=False, indent=1))