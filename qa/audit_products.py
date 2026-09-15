import sys, json, base64, time
sys.path.insert(0, '/Users/ahmed.alghoraib/Desktop/Wanas/qa')
from wanas_cdp import Wanas, launch_server, launch_browser, stop_all

ROOT='/Users/ahmed.alghoraib/Desktop/Wanas'
server, sport = launch_server(ROOT)
browser, cport = launch_browser()
w = Wanas(cport, f'http://127.0.0.1:{sport}/index.html')
w.open()

# install global error capture
w.ev("window.__errs=[];window.addEventListener('error',e=>window.__errs.push(e.message));")
# intercept localStorage persistence marker
w.ev("window.__persisted=0;window.addEventListener('storage',()=>{});")

# create a real PNG on disk
png = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABhJREFUeJxjYMBAD4wQYBABMSDABQyYAAAhqgIGuVYtPQAAAABJRU5ErkJggg==")
PNG='/tmp/wanas_test_img.png'
open(PNG,'wb').write(png)

def ev(expr): return w.ev(expr)

def set_file(path, selector):
    # get document + node id for the selector
    doc = w.send('DOM.getDocument')['root']['nodeId']
    q = w.send('DOM.querySelector', {'nodeId': doc, 'selector': selector})
    nid = q['nodeId']
    w.send('DOM.setFileInputFiles', {'nodeId': nid, 'files': [path]})
    # dispatch change
    ev(f"document.querySelector('{selector}').dispatchEvent(new Event('change',{{bubbles:true}}))")
    time.sleep(1.0)

results=[]
def R(x): results.append(x)

print("=== Login ===")
print("login_ok:", w.login_admin())

print("\n=== 1. ADD CATEGORY ===")
ev("document.getElementById('newCatAr').value='صنف اختبار';")
ev("document.getElementById('newCatEn').value='TestCat';")
ev("document.getElementById('addCatBtn').click();")
time.sleep(0.4)
catlist = ev("Array.from(document.querySelectorAll('#catList .list-item')).map(r=>r.querySelector('.nm')?.textContent)")
tabs = ev("Array.from(document.querySelectorAll('#catTabs .cat-tab')).map(e=>e.textContent)")
R(f"catList rows after add: {catlist}")
R(f"catTabs after add: {tabs}")
newid = ev("(DATA.categories.find(c=>c.en==='TestCat')||{}).id")
R(f"new category id: {newid}")

print("\n=== 2. EDIT CATEGORY ===")
if newid:
    ev(f"document.querySelectorAll('#catList .list-item .ed-cat')[{len(catlist)-1}].click()")
    time.sleep(0.3)
    modal_ok = ev("document.getElementById('editCatModal').classList.contains('show')")
    R(f"editCatModal opened: {modal_ok}")
    ev("document.getElementById('editCatAr').value='صنف معدل';")
    ev("document.getElementById('editCatEn').value='EditCat2';")
    ev("document.getElementById('editCatSave').click();")
    time.sleep(0.4)
    R("category after edit: "+str(ev("DATA.categories.find(c=>c.id===%s)"%json.dumps(newid))))
    R("catList rows after edit: "+str(ev("Array.from(document.querySelectorAll('#catList .list-item')).map(r=>r.querySelector('.nm')?.textContent)")))

print("\n=== 3. DELETE CATEGORY (with product) ===")
# create a product under the edited cat first (via URL add) so we can test cascade delete
ev(f"document.getElementById('prodCat').value={json.dumps(newid)};")
ev("document.getElementById('prodAr').value='منتج تحذيف';")
ev("document.getElementById('prodEn').value='DelProd';")
ev("document.getElementById('prodDescAr').value='وصف';")
ev("document.getElementById('prodDescEn').value='desc';")
ev("document.getElementById('prodPrice').value='99';")
# add image by URL
ev("document.getElementById('prodAddLinkBtn').click();")
ev("document.getElementById('prodLinkInput').value='products/logo-icon.png';")
ev("var k=new KeyboardEvent('keydown',{key:'Enter',bubbles:true});document.getElementById('prodLinkInput').dispatchEvent(k);")
time.sleep(0.4)
R("prodImgs after URL add: "+str(ev("document.getElementById('prodImgs').value")))
R("prodPicker ip-thumb count after URL: "+str(ev("document.querySelectorAll('#prodPicker .ip-thumb').length")))
ev("document.getElementById('addProdBtn').click();")
time.sleep(0.4)
R("DelProd in DATA.products: "+str(ev("DATA.products.some(p=>p.en==='DelProd')")))
R("DelProd in prodList: "+str(ev("document.getElementById('prodList').textContent.includes('DelProd')")))
R("DelProd in productGrid: "+str(ev("document.getElementById('productGrid').textContent.includes('DelProd')")))
prod_count = ev("DATA.products.length")
# now delete the category (last in list = the edited one, first row)
ev(f"document.querySelector('#catList .list-item .del-cat').click();")  # del-cat on first catList row
time.sleep(0.4)
R("catList rows after del-cat: "+str(ev("Array.from(document.querySelectorAll('#catList .list-item')).map(r=>r.querySelector('.nm')?.textContent)")))
R("DelProd still in DATA.products after cat delete: "+str(ev("DATA.products.some(p=>p.en==='DelProd')")))
R("DelProd in productGrid after cat delete: "+str(ev("document.getElementById('productGrid').textContent.includes('DelProd')")))

print("\n=== 4. ADD PRODUCT WITH FILE UPLOAD ===")
ev("document.getElementById('prodCat').value && null;")  # ensure cat select has options
# pick a real category (first option)
first_cat = ev("document.querySelector('#prodCat option').value")
R(f"first prodCat option: {first_cat}")
ev("document.getElementById('prodCat').value=''+(%r);"%first_cat)
ev("document.getElementById('prodAr').value='منتج ملف';")
ev("document.getElementById('prodEn').value='FileProd';")
ev("document.getElementById('prodDescAr').value='وصف';")
ev("document.getElementById('prodDescEn').value='desc';")
ev("document.getElementById('prodPrice').value='150';")
set_file(PNG, '#prodFile')
thumb_count = ev("document.querySelectorAll('#prodPicker .ip-thumb').length")
picker_has_img = ev("document.querySelector('#prodPicker .ip-thumb img, #prodPicker .ip-thumb .img-fallback') ? (document.querySelector('#prodPicker .ip-thumb img')?'img':'fallback') : 'none'")
imgs_val = ev("document.getElementById('prodImgs').value")
R(f"prodPicker .ip-thumb count after FILE upload: {thumb_count}")
R(f"prodPicker thumb content: {picker_has_img}")
R(f"prodImgs value after FILE upload starts with data:image: {imgs_val.startswith('data:image')}  len={len(imgs_val)}")
ev("document.getElementById('addProdBtn').click();")
time.sleep(0.4)
R("FileProd in DATA.products: "+str(ev("DATA.products.some(p=>p.en==='FileProd')")))
R("FileProd in prodList: "+str(ev("document.getElementById('prodList').textContent.includes('FileProd')")))
R("FileProd in productGrid: "+str(ev("document.getElementById('productGrid').textContent.includes('FileProd')")))
fileprod = ev("DATA.products.find(p=>p.en==='FileProd')")
R("stored FileProd imgs[0] is data:image: "+str(fileprod and str(fileprod['imgs'][0]).startswith('data:image')))

print("\n=== 5. EDIT PRODUCT ===")
fid = ev("(DATA.products.find(p=>p.en==='FileProd')||{}).id")
# find the row in prodList corresponding to FileProd
ev(f"var rows=Array.from(document.querySelectorAll('#prodList .list-item')); var r=rows.find(r=>r.textContent.includes('FileProd')); if(r) r.querySelector('.ed-prod').click();")
time.sleep(0.3)
R("editProdModal opened: "+str(ev("document.getElementById('editProdModal').classList.contains('show')")))
ev("document.getElementById('editProdAr').value='منتج معدل';")
ev("document.getElementById('editProdEn').value='EditedProd';")
ev("document.getElementById('editProdPrice').value='200';")
ev("document.getElementById('editProdSave').click();")
time.sleep(0.4)
R("EditedProd in DATA: "+str(ev("DATA.products.some(p=>p.en==='EditedProd')")))
R("EditedProd in productGrid: "+str(ev("document.getElementById('productGrid').textContent.includes('EditedProd')")))
R("FileProd gone after edit: "+str(ev("!DATA.products.some(p=>p.en==='FileProd')")))

print("\n=== 6. DELETE PRODUCT ===")
ev("var rows=Array.from(document.querySelectorAll('#prodList .list-item')); var r=rows.find(r=>r.textContent.includes('EditedProd')); if(r) r.querySelector('.del-prod').click();")
time.sleep(0.4)
R("EditedProd still in DATA after del-prod: "+str(ev("DATA.products.some(p=>p.en==='EditedProd')")))
R("EditedProd in productGrid after del-prod: "+str(ev("document.getElementById('productGrid').textContent.includes('EditedProd')")))

print("\n=== 7. PRODUCT LIST ROW LAYOUT ===")
lay = ev("""(()=>{const rows=Array.from(document.querySelectorAll('#prodList .list-item')); if(!rows.length) return 'no rows';
 const r=rows[0]; return {html: r.innerHTML.replace(/\\s+/g,' ').slice(0,300), hasNm: !!r.querySelector('.nm'), hasEd: !!r.querySelector('.ed-prod'), hasDel: !!r.querySelector('.del-prod'), meta: r.querySelector('.nm .meta') ? r.querySelector('.nm .meta').textContent:null};})()""")
R(f"prodList row layout sample: {json.dumps(lay, ensure_ascii=False)}")

print("\n=== ERRORS ===")
R("window errors: "+str(ev("JSON.stringify(window.__errs)")))
print(json.dumps(results, ensure_ascii=False, indent=1))
w.ev("localStorage.clear();")
stop_all(server, browser)