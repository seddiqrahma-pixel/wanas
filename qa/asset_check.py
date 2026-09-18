#!/usr/bin/env python3
# Asset check: every local asset path referenced in index.html exists on disk
import re, os, json
W = '/Users/ahmed.alghoraib/Desktop/Wanas'
html = open(W+'/index.html', encoding='utf8').read()
paths = set()
for m in re.finditer(r'["\']((?:products/|logo\.png|logo-icon\.png|favicon\.svg|assets/|images/|\.\/|\.\.\/)[^"\']*?\.(?:png|jpg|jpeg|svg|webp|gif|ico))["\']', html):
    paths.add(m.group(1))
# also src/href attrs
for m in re.finditer(r'(?:src|href)=["\']([^"\']+)["\']', html):
    v = m.group(1)
    if not v.startswith(('http','data:','#','mailto:','javascript:','whatsapp','tel:')) and re.search(r'\.(png|jpe?g|svg|webp|gif|ico|css|js)$', v, re.I):
        paths.add(v.lstrip('./'))
missing, found = [], []
for p in sorted(paths):
    # skip data-before html strings already excluded
    fp = os.path.join(W, p)
    ok = os.path.exists(fp)
    (found if ok else missing).append(p)
    print(('OK      ' if ok else 'MISSING ') + p)
print('\ntotal referenced:', len(paths), '| found:', len(found), '| missing:', len(missing))
# also check dirs on disk not referenced (orphans)
pub = json.loads(re.search(r'const PUBLISHED_DEFAULTS = (\{.*?\});\n', html, re.S).group(1))
refd = set()
for pr in pub['products']:
    for i in pr.get('imgs', []):
        refd.add(i.split('/')[1] if i.startswith('products/') else None)
disk = set(os.listdir(W+'/products'))
print('\nproducts/ dirs on disk:', sorted(disk))
print('first-level dirs referenced in PUBLISHED_DEFAULTS:', sorted(x for x in refd if x))
