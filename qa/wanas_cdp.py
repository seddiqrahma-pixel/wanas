"""Reusable CDP test helper for Wanas control-panel QA.
Each agent runs its OWN local server + headless browser on ITS OWN ports to avoid contention.

Usage:
    from wanas_cdp import Wanas, launch_server, launch_browser, stop_all
    server = launch_server()          # python http.server on a free port
    env = launch_browser(port=PORT)   # headless Brave
    w = Wanas(port=PORT)
    w.open()                          # navigate to localhost page
    w.ev('...expression...')          # Runtime.evaluate (sync)
    w.evp('...async...')              # Runtime.evaluate awaitPromise
    print(w.console_errors())         # gathered Runtime.exceptions
    stop_all(server, env)
"""
import json, time, urllib.request, websocket, socket, subprocess, os

def free_port():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p

def launch_server(root, port=None):
    port = port or free_port()
    p = subprocess.Popen(['python3','-m','http.server', str(port), '--directory', root],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(20):
        try:
            urllib.request.urlopen(f'http://127.0.0.1:{port}/index.html', timeout=2); return p, port
        except Exception: time.sleep(0.5)
    raise RuntimeError('server did not start')

BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

def launch_browser(cdp_port=None, profile=None):
    cdp_port = cdp_port or free_port(); profile = profile or f'/tmp/wanas-qa-{time.time()}'
    p = subprocess.Popen([BRAVE,
        f'--user-data-dir={profile}', f'--remote-debugging-port={cdp_port}',
        '--remote-allow-origins=*', '--headless', '--no-first-run', '--window-size=1440,900'],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(25):
        try:
            urllib.request.urlopen(f'http://127.0.0.1:{cdp_port}/json', timeout=2); return p, cdp_port
        except Exception: time.sleep(0.5)
    raise RuntimeError('browser did not start')

class Wanas:
    def __init__(self, cdp_port, url):
        self.url = url
        req = urllib.request.Request(f'http://127.0.0.1:{cdp_port}/json/new?about%3Ablank', method='PUT')
        page = json.loads(urllib.request.urlopen(req, timeout=5).read())
        self.ws = websocket.create_connection(page['webSocketDebuggerUrl'], timeout=15)
        self.i = 0
        self.tab_ws = page['webSocketDebuggerUrl']
        self.exceptions = []
    def send(self, method, params=None):
        self.i += 1
        self.ws.send(json.dumps({'id': self.i, 'method': method, 'params': params or {}}))
        self.ws.settimeout(20)
        while True:
            m = json.loads(self.ws.recv())
            if m.get('id') == self.i:
                if m.get('method') == 'Runtime.exceptionThrown':
                    self.exceptions.append(m['params']['exceptionDetails'].get('text'))
                return m.get('result')
    def open(self):
        self.send('Page.enable')
        self.send('Runtime.enable')
        self.send('Page.navigate', {'url': self.url})
        time.sleep(1.8)
        return self
    def ev(self, expr):
        r = self.send('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
        return r.get('result', {}).get('value')
    def evp(self, expr):
        r = self.send('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': True})
        return r.get('result', {}).get('value')
    def console_errors(self):
        return list(self.exceptions)
    def login_admin(self, pw='wanas123'):
        # reveal admin button, open modal, login
        self.ev("document.getElementById('adminBtn').style.display='';")
        self.ev("document.getElementById('adminBtn').click();")
        self.ev(f"document.getElementById('adminPass').value='{pw}';")
        self.ev("document.getElementById('adminLoginBtn').click();")
        time.sleep(0.3)
        return self.ev("!document.getElementById('adminPanel').classList.contains('hidden')")

def stop_all(server, browser):
    for p in (server, browser):
        try: p.terminate()
        except Exception: pass