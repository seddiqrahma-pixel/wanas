#!/usr/bin/env python3
"""Debug: inspect what's actually on the Wanas page."""
import json, urllib.request, time, sys

PORT = 9223
URL = "https://seddiqrahma-pixel.github.io/wanas/"

def ws_send(ws, mid, method, params=None):
    msg = {"id": mid, "method": method}
    if params: msg["params"] = params
    ws.send(json.dumps(msg))

def ws_recv(ws):
    ws.settimeout(3)
    try: return json.loads(ws.recv())
    except: return None

def ws_eval(ws, expr, msg_id=None):
    mid = msg_id or int(time.time()*1000000) % 100000000
    ws_send(ws, mid, "Runtime.evaluate", {"expression": expr})
    deadline = time.time() + 10
    while time.time() < deadline:
        msg = ws_recv(ws)
        if not msg: continue
        if isinstance(msg, dict) and msg.get("id") == mid:
            if msg.get("error"): raise RuntimeError(f"JS: {msg['error']}")
            return msg.get("result",{}).get("result",{}).get("value")
        if isinstance(msg, dict) and msg.get("method") == "Runtime.exceptionThrown":
            print(f"  [EXC] {msg.get('params',{}).get('exceptionDetails',{})}")
    raise RuntimeError(f"Timeout id={mid}")

def main():
    with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json") as r:
        pages = json.loads(r.read())
    pid = next((p["id"] for p in pages if p.get("type")=="page"), None)
    if not pid: print("No page"); sys.exit(1)
    
    import websocket
    ws = websocket.create_connection(f"ws://127.0.0.1:{PORT}/devtools/page/{pid}", timeout=10)
    print(f"Connected: {pid}")
    
    ws_send(ws, 1, "Page.navigate", {"url": URL})
    ws_recv(ws)
    time.sleep(5)
    
    print(f"URL: {ws_eval(ws, 'location.href', msg_id=10)}")
    print(f"Title: {ws_eval(ws, 'document.title', msg_id=11)}")
    print(f"dir: {ws_eval(ws, 'document.documentElement.dir', msg_id=12)}")
    print(f"lang: {ws_eval(ws, 'document.documentElement.lang', msg_id=13)}")
    ll = ws_eval(ws, "localStorage.getItem('wanas_lang')", msg_id=14)
    print(f"localStorage.wanas_lang: {ll}")
    
    # Check DOM structure
    print("\n=== DOM Structure ===")
    html = ws_eval(ws, "document.documentElement.outerHTML[:5000]", msg_id=15)
    print(html[:3000])
    
    print("\n=== Key elements ===")
    for sel in ['#productGrid', '#catTabs', '.cat-tab', '.card', '#langBtn', 'header']:
        count = ws_eval(ws, f"document.querySelectorAll('{sel}').length", msg_id=16+list(['#productGrid','#catTabs','.cat-tab','.card','#langBtn','header']).index(sel))
        print(f"  {sel}: {count} elements")
    
    # Check DATA
    print("\n=== DATA state ===")
    data_info = ws_eval(ws, """(() => {
        const d = typeof DATA !== 'undefined' ? DATA : undefined;
        if (!d) return {status: 'undefined'};
        if (d.categories) return {status: 'has_categories', count: d.categories.length};
        if (typeof d.then === 'function') return {status: 'promise'};
        return {status: 'other'};
    })()""", msg_id=20)
    print(f"  {data_info}")
    
    # Check if defaultData exists
    has_dd = ws_eval(ws, "typeof defaultData === 'function'", msg_id=21)
    print(f"  defaultData function: {has_dd}")
    
    if has_dd:
        dd = ws_eval(ws, "defaultData()", msg_id=22)
        if dd:
            print(f"  defaultData().categories: {len(dd.get('categories',[]))}")
            for c in dd.get('categories',[]):
                print(f"    - {c}")
    
    # Check for JS errors on page
    print("\n=== Check if init ran ===")
    init_ran = ws_eval(ws, "window._initRan === true", msg_id=23)
    print(f"  window._initRan: {init_ran}")
    
    # Try to manually trigger data loading
    print("\n=== Manual DATA check ===")
    manual = ws_eval(ws, """(() => {
        // Try to see if we can get DATA by waiting a bit
        const d = window.DATA;
        if (d && typeof d.then === 'function') {
            return 'promise_not_resolved_yet';
        }
        if (d && d.categories) {
            return 'resolved: ' + d.categories.length + ' categories';
        }
        return 'no_data_or_not_resolved';
    })()""", msg_id=24)
    print(f"  {manual}")
    
    ws.close()

if __name__ == "__main__":
    main()
