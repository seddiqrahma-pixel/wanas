# Wanas QA Harness Guide

Reusable CDP-based test suite for the Wanas single-file storefront (`index.html`).
Isolated headless Brave + local http.server per run (never touches api.github.com
except the publish-roundtrip audit, which mocks fetch).

## Quick start

```python
import sys; sys.path.insert(0, 'qa')
from wanas_cdp import Wanas          # Wanas(cdp_port, url) -> .open() .ev() .evp() .console_errors() .login_admin()
from wanas_cdp import launch_server, launch_browser, stop_all
server, port = launch_server('.', 0)          # local http.server
proc, cdp  = launch_browser(cdp_port=0)       # headless Brave, own /tmp profile
w = Wanas(cdp_port if cdp else 9331, f'http://localhost:{port}/index.html')
w.open(); w.login_admin('wanas123')
... assertions via w.evp('[async JS]') ...
stop_all(server, proc)
```

CDP fact learned the hard way: `DOM.setFileInputFiles` against an input whose
handler consumes/clears files (`F.value=""`) reports `files.length: 0` in headless —
use synthetic `File` objects through the real `onchange` path instead.

Signed-off audit suites (18 files, ~200 checks, all PASS as of 2026-09-15):

| Script | Coverage |
|---|---|
| audit_fixround2.py | XSS escaping, price validation, footer comms lang switch, reset+settings, size clamps, market kept on edit, link-reject toast |
| audit_token_security.py | token lifecycle: field-only, sessionStorage, wipe-on-success, leak check |
| audit_publish_roundtrip.py | GET → marker block swap → PUT flow with mocked GitHub |
| audit_admin_security.py / admin_security_results.json | 37 checks: login, counters, password round-trip, secrets scan |
| test_export_import_publish.py | 42 checks: both backup types, import matrix, 3 publish sha cycles |
| exhaustive_prod_pay.py | full products/categories CRUD + payment persistence |
| qa_settings_exhaustive.py | branding/hero/footer/colors/market pricing |
| audit_buyer.py | storefront/cart/checkout (superseded by Task 6 coverage) |

Known-good baseline: main `1c3bfe5` (`PUBLISHED_DATA` populated by first panel publish).
