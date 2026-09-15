import json, urllib.request, time, websocket

PORT = 9223
URL = "https://seddiqrahma-pixel.github.io/wanas/"

def ws_send(ws, msg_id, method, params=None):
    msg = {"id": msg_id, "method": method}
    if params:
        msg["params"] = params
    ws.send(json.dumps(msg))

def ws_recv(ws):
    return json.loads(ws.recv())

# Get page list
with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json") as r:
    pages = json.loads(r.read())

page_id = None
for p in pages:
    if p.get("type") == "page":
        page_id = p["id"]
        break

if not page_id:
    print("ERROR: No page found")
    exit(1)

ws = websocket.create_connection(f"ws://127.0.0.1:{PORT}/devtools/page/{page_id}")
print(f"Connected to page: {page_id}")

# Check if page is already on Wanas, if not navigate
ws_send(ws, 1, "Runtime.evaluate", {"expression": "document.url"})
resp = ws_recv(ws)
current_url = resp['result']['result']['value']
print(f"Current URL: {current_url}")

if "seddiqrahma-pixel.github.io/wanas" not in current_url:
    ws_send(ws, 2, "Page.navigate", {"url": URL})
    ws_recv(ws)
    time.sleep(5)

# Test 1: Page title
ws_send(ws, 3, "Runtime.evaluate", {"expression": "document.title"})
resp = ws_recv(ws)
print(f"\n=== PAGE TITLE ===\n{resp['result']['result']['value']}")

# Test 2: Document dir
ws_send(ws, 4, "Runtime.evaluate", {"expression": "document.documentElement.dir"})
resp = ws_recv(ws)
print(f"\n=== DOCUMENT DIR ===\n{resp['result']['result']['value']}")

# Test 3: Language
ws_send(ws, 5, "Runtime.evaluate", {"expression": "document.documentElement.lang"})
resp = ws_recv(ws)
print(f"\n=== LANGUAGE ===\n{resp['result']['result']['value']}")

# Test 4: DATA.categories
ws_send(ws, 6, "Runtime.evaluate", {
    "expression": "(() => { try { return window.DATA?.categories || []; } catch(e) { return []; } })()"
})
resp = ws_recv(ws)
cats = resp['result']['result']['value']
print(f"\n=== DATA.categories ===\n{json.dumps(cats, indent=2, ensure_ascii=False)}")

# Test 5: Category tabs in DOM
ws_send(ws, 7, "Runtime.evaluate", {
    "expression": """(() => {
        const tabs = document.querySelectorAll('[data-category], .category-tab, .tab, [role="tab"], .filter-btn, button[data-category]');
        return Array.from(tabs).map(t => ({
            text: t.textContent.trim(),
            dataCategory: t.getAttribute('data-category') || null,
            role: t.getAttribute('role') || null,
            className: t.className,
            disabled: t.disabled,
            tagName: t.tagName
        }));
    })()"""
})
resp = ws_recv(ws)
tabs = resp['result']['result']['value']
print(f"\n=== CATEGORY TABS ({len(tabs)} found) ===")
for t in tabs:
    print(f"  [{t['tagName']}] text='{t['text']}' data-category={t['dataCategory']} role={t['role']} class={t['className']} disabled={t['disabled']}")

# Test 6: Product cards count
ws_send(ws, 8, "Runtime.evaluate", {
    "expression": """(() => {
        const sel = '.product-card, .card, [class*="product"]';
        const items = document.querySelectorAll(sel);
        return {
            count: items.length,
            items: Array.from(items).map(i => i.textContent.trim().substring(0, 80))
        };
    })()"""
})
resp = ws_recv(ws)
result = resp['result']['result']['value']
print(f"\n=== PRODUCT CARDS ===\nCount: {result['count']}")
for item in result['items'][:10]:
    print(f"  - {item}")

# Test 7: Get category container HTML
ws_send(ws, 9, "Runtime.evaluate", {
    "expression": """(() => {
        const container = document.querySelector('.category-tabs, .tabs, .filters, [class*="category"], [class*="filter"]');
        if (container) {
            return container.outerHTML.substring(0, 3000);
        }
        return null;
    })()"""
})
resp = ws_recv(ws)
container_html = resp['result']['result']['value']
print(f"\n=== CATEGORY CONTAINER ===")
if container_html:
    print(container_html[:2000])

# Test 8: Get full page HTML snippet around products
ws_send(ws, 10, "Runtime.evaluate", {
    "expression": """(() => {
        const products = document.querySelector('.products, .products-grid, .product-list, main, #product-grid');
        if (products) {
            return products.outerHTML.substring(0, 4000);
        }
        return document.body.innerHTML.substring(0, 4000);
    })()"""
})
resp = ws_recv(ws)
print(f"\n=== PRODUCTS SECTION ===")
print(resp['result']['result']['value'][:3000])

ws.close()
print("\n=== STEP 1 COMPLETE ===")
