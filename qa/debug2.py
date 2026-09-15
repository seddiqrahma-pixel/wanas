#!/usr/bin/env python3
"""Debug the WebSocket eval issue."""
import json, urllib.request, time, sys, websocket

PORT = 9223

def wsend(ws, mid, method, params=None):
    msg = {"id": mid, "method": method}
    if params: msg["params"] = params
    ws.send(json.dumps(msg))

def wrecv(ws):
    ws.settimeout(5)
    raw = ws.recv()
    return json.loads(raw)

def weval_debug(ws, expr, mid=None):
    """Eval with full debug output."""
    mid = mid or int(time.time()*1e6) % 1e7
    print(f"  [EVAL] mid={mid} expr={expr[:80]}...")
    wsend(ws, mid, "Runtime.evaluate", {"expression": expr})
    
    deadline = time.time() + 15
    count = 0
    while time.time() < deadline:
        count += 1
        msg = wrecv(ws)
        if not msg:
            print(f"  [RECV#{count}] empty")
            continue
        print(f"  [RECV#{count}] type={type(msg).__name__} keys={list(msg.keys()) if isinstance(msg,dict) else 'N/A'}")
        if isinstance(msg, dict):
            if "id" in msg:
                print(f"    -> id={msg['id']} (looking for {mid})")
                if msg["id"] == mid:
                    err = msg.get("error")
                    if err: raise RuntimeError(f"JS: {err}")
                    res = msg.get("result",{})
                    print(f"    -> RESULT: {res}")
                    return res.get("result",{}).get("value")
            if msg.get("method") == "Runtime.exceptionThrown":
                print(f"    -> EXCEPTION: {msg.get('params',{})}")
    print(f"  [TIMEOUT] no response for mid={mid} after {count} recv attempts")
    return None

def main():
    with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json") as r:
        pages = json.loads(r.read())
    pid = next((p["id"] for p in pages if p.get("type")=="page"), None)
    if not pid: sys.exit("No page")
    
    ws = websocket.create_connection(f"ws://127.0.0.1:{PORT}/devtools/page/{pid}", timeout=10)
    print(f"Connected: {pid}")
    
    wsend(ws, 1, "Page.navigate", {"url": "https://seddiqrahma-pixel.github.io/wanas/"})
    resp = wrecv(ws)
    print(f"Navigate response: {resp}")
    time.sleep(4)
    
    # Test simple eval
    r = weval_debug(ws, "42", 100)
    print(f"\nSimple eval result: {r}")
    
    # Test document.title
    r = weval_debug(ws, "document.title", 101)
    print(f"\ndocument.title: {r}")
    
    # Test the actual page query
    r = weval_debug(ws, """(() => {
        const tabs = document.querySelectorAll('.cat-tab');
        return tabs.length;
    })()""", 102)
    print(f"\n.cat-tab count: {r}")
    
    ws.close()

if __name__ == "__main__":
    main()
