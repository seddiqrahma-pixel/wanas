"""Local override of QAHandler for branding cross-test: after a mocked
publish (PUT), the server serves the NEW index.html (decoded from the PUT
body) so a later reload really reads the 'published' file — like GitHub
Pages would."""
import base64, threading
import wanas_lib

_state = {"current_html": None}
_lock = threading.Lock()

_MockHandler = type("MockHandler", (wanas_lib.QAHandler,), {})
#_MockHandler.serve_file = {}  # unused

_orig_do_GET = wanas_lib.QAHandler.do_GET

def do_GET(self):
    with _lock:
        cur = _state["current_html"]
    if cur is not None and (self.path.split("?")[0] in ("/index.html", "/")):
        self._serve(cur.encode("utf8"), 200, "text/html")
        return
    return _orig_do_GET(self)

wanas_lib.QAHandler.do_GET = do_GET

_orig_do_PUT = wanas_lib.QAHandler.do_PUT

def do_PUT(self):
    ln = int(self.headers.get("Content-Length", 0))
    body = self.rfile.read(ln)
    wanas_lib.QAHandler.captured[self.path] = body
    try:
        import json as _json
        parsed = _json.loads(body)
        decoded = base64.b64decode(parsed.get("content", "")).decode("utf8", "ignore")
        with _lock:
            _state["current_html"] = decoded
    except Exception as e:
        print("MOCK-PUT decode failed:", e)
    self._serve(b'{"commit":{"sha":"fake"}}', wanas_lib.QAHandler.put_status[0])

wanas_lib.QAHandler.do_PUT = do_PUT

def reset_to_original():
    with _lock:
        _state["current_html"] = None

def set_published(html_text):
    """Serve an explicit 'published' index.html to later reloads."""
    with _lock:
        _state["current_html"] = html_text
