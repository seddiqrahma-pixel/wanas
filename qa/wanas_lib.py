#!/usr/bin/env python3
"""Reusable Wanas QA harness over CDP (websocket to a debug-port Brave)."""
import json, urllib.request, time, http.server, socketserver, threading
import websocket

class Wanas:
    def __init__(self, port=9223, url="http://127.0.0.1:8431/index.html"):
        pages = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{port}/json").read())
        pid = next((p["id"] for p in pages if p.get("type")=="page"), None)
        if not pid: raise RuntimeError("no page target")
        self.ws = websocket.create_connection(f"ws://127.0.0.1:{port}/devtools/page/{pid}", timeout=15)
        self.mid = 1000
        self.nav(url)

    def _send(self, method, params=None):
        self.mid += 1
        mid = self.mid
        self.ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
        deadline = time.time() + 20
        self.ws.settimeout(2)
        while time.time() < deadline:
            try:
                msg = json.loads(self.ws.recv())
            except Exception:
                continue
            self.ws.settimeout(15)
            if isinstance(msg, dict) and msg.get("id") == mid:
                if msg.get("error"): raise RuntimeError(f"CDP {method}: {msg['error']}")
                return msg.get("result", {})
            self.ws.settimeout(2)
        raise RuntimeError(f"CDP timeout {method}")

    def eval(self, expr, await_promise=False, timeout=15):
        self.mid += 1
        mid = self.mid
        self.ws.send(json.dumps({"id": mid, "method": "Runtime.evaluate",
            "params": {"expression": expr, "awaitPromise": await_promise, "returnByValue": True, "userGesture": True}}))
        deadline = time.time() + timeout
        self.ws.settimeout(2)
        while time.time() < deadline:
            try:
                msg = json.loads(self.ws.recv())
            except Exception:
                continue
            if isinstance(msg, dict) and msg.get("id") == mid:
                self.ws.settimeout(15)
                r = msg.get("result", {})
                if r.get("exceptionDetails"):
                    raise RuntimeError("JS: " + json.dumps(r["exceptionDetails"])[:400])
                return r.get("result", {}).get("value")
        raise RuntimeError("eval timeout")

    def nav(self, url, wait_ms=800):
        self._send("Page.navigate", {"url": url})
        time.sleep(wait_ms / 1000)

    def clear_storage(self):
        return self.eval("localStorage.clear(); sessionStorage.clear(); 'cleared'")

    def pay_fields(self):
        return self.eval('getPayFields()')

    def assert_ptab(self, name, expected):
        self.eval('goPaymentTab()')
        got = self.pay_fields()
        errs = []
        for k, v in expected.items():
            if got.get(k) != v: errs.append(f"{k}: want {v!r} got {got.get(k)!r}")
        print(f"[{name}] payfields -> {'OK' if not errs else errs}")
        return (not errs), got

    def console_errors(self):
        errs = []
        try:
            self.ws.settimeout(2)
            while True:
                msg = self.ws.recv()
                try: m = json.loads(msg)
                except Exception: continue
                if m.get("method") == "Runtime.exceptionThrown":
                    e = m["params"].get("exceptionDetails", {})
                    errs.append(e.get("text", str(e)))
                if m.get("method") == "Log.entryAdded" and m["params"]["entry"].get("level") == "error":
                    errs.append(str(m["params"]["entry"].get("text"))[:200])
        except Exception:
            pass
        self.ws.settimeout(15)
        return errs


class QAHandler(http.server.BaseHTTPRequestHandler):
    """GET /index.html -> file. Any other GET /api.github.com/* -> 200 JSON body
       {"content": "<base64 of file>", "sha": "fake-sha"} for mocked publish.
       PUT /api.github.com/repos/*/contents/index.html -> capture body, return 200 {}."""
    forest = {}          # path -> bytes
    captured = {}        # recorded PUT body
    put_status = [200]

    def log_message(self, *a): pass

    def _serve(self, body, code=200, ct="application/json"):
        self.send_response(code)
        self.send_header("Content-Type", ct)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self): self._serve(b"{}", 200)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/index.html" or path == "/":
            try:
                body = open("/Users/ahmed.alghoraib/Desktop/Wanas/index.html", "rb").read()
                self._serve(body, 200, "text/html")
            except Exception as e:
                self._serve(str(e).encode(), 500, "text/plain")
        else:
            self._serve(b'{"not_found": true}', 404)

    def do_PUT(self):
        ln = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(ln)
        QAHandler.captured[self.path] = body
        self._serve(b'{"commit":{"sha":"fake"}}', QAHandler.put_status[0])


def spin_server(port=8431):
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", port), QAHandler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv
