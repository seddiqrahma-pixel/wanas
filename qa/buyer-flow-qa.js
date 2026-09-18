/* Wanas buyer-flow QA harness (jsdom, headless). Each test builds a FRESH JSDOM. */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require(path.join(__dirname, "..", "node_modules", "jsdom"));

const HTML = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function mkDom({ seedCart = null, seedSettings = null } = {}) {
  const errors = [];
  const opened = [];
  const store = new Map();
  if (seedCart) store.set("wanas_cart", JSON.stringify(seedCart));
  if (seedSettings) store.set("wanas_settings", JSON.stringify(seedSettings));

  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => {
    const m = String(e && e.message || e);
    if (/Not implemented: navigation/.test(m)) return; // legitimate mailto:/wa.me
    errors.push("jsdomError: " + m);
  });
  vc.on("error", (m) => errors.push("console.error: " + m));
  const dom = new JSDOM(HTML, {
    runScripts: "dangerously",
    resources: "usable",
    url: "https://wanas.test/",
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      const ls = {
        getItem: (k) => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: (k) => store.delete(k),
        clear: () => store.clear(),
        key: (i) => [...store.keys()][i] ?? null,
        get length() { return store.size; },
      };
      Object.defineProperty(window, "localStorage", { value: ls, configurable: true });
      Object.defineProperty(window, "sessionStorage", { value: { ...ls }, configurable: true });
      window.open = (url) => { opened.push(url); return null; };
      window.confirm = () => true;
      window.alert = () => {};
      window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
      if (window.navigator && window.navigator.clipboard) {
        window.navigator.clipboard.writeText = () => Promise.resolve();
      }
      window.onerror = (msg) => { errors.push("window.onerror: " + msg); };
    },
  });
  const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

  return { dom, window: dom.window, doc: dom.window.document, errors, opened, store, wait };
}

let pass = 0, fail = 0;
const results = [];
function check(name, cond, detail = "") {
  if (cond) { pass++; results.push(`PASS  ${name}${detail ? " — " + detail : ""}`); }
  else { fail++; results.push(`FAIL  ${name}${detail ? " — " + detail : ""}`); }
}

(async () => {
  /* ---------- 1) page loads with zero JS errors ---------- */
  {
    const { errors } = mkDom();
    await new Promise((r) => setTimeout(r, 500));
    check("1. page loads, zero JS errors", errors.length === 0, errors.length ? errors[0] : "no onerror/console.error/jsdomError");
  }

  /* ---------- 2) product grid renders all cards ---------- */
  {
    const { window, doc, errors } = mkDom();
    await new Promise((r) => setTimeout(r, 400));
    check("2. product grid renders all cards", doc.querySelectorAll("#productGrid .card").length === window.eval("DATA.products.length"),
      `embedded=${window.eval("DATA.products.length")}, rendered=${doc.querySelectorAll("#productGrid .card").length}`);

  }

  /* ---------- 3) add-to-cart updates badge + localStorage ---------- */
  {
    const { doc, store, errors } = mkDom();
    await new Promise((r) => setTimeout(r, 400));
    const addBtn = doc.querySelector("#productGrid .card .add-btn");
    addBtn.click();
    const badge = doc.querySelector("#cartCount");
    check("3a. badge shows 1 + not hidden", badge.textContent === "1" && !badge.classList.contains("hidden"),
      `badge=${badge.textContent}, hidden=${badge.classList.contains("hidden")}`);
    const cart = JSON.parse(store.get("wanas_cart"));
    check("3b. localStorage cart persisted", Array.isArray(cart) && cart.length === 1 && cart[0].qty === 1,
      `cart=${JSON.stringify(cart)}`);
    addBtn.click();
    const cart2 = JSON.parse(store.get("wanas_cart"));
    check("3c. second add increments qty", cart2[0] && cart2[0].qty === 2 && doc.querySelector("#cartCount").textContent === "2",
      `cart=${JSON.stringify(cart2)}, badge=${doc.querySelector("#cartCount").textContent}`);
    check("3d. no errors during add", errors.length === 0, errors[0] || "");
  }

  /* ---------- 4) qty +/-, remove, total math ---------- */
  {
    const { doc, store, errors } = mkDom({ seedCart: [{ id: "p31", qty: 3 }, { id: "p33", qty: 1 }] });
    await new Promise((r) => setTimeout(r, 400)); // p31=26 EGP, p33=26 EGP => 78+26=104
    const rowByName = (name, docRef = doc) => [...docRef.querySelectorAll("#cartItems .ci")].find(r => r.querySelector("b").textContent === name);
    const rowP31 = rowByName("وردة اقحوان") || rowByName("Clove Rose Candle");
    const rowP33 = rowByName("وردة مقفولة") || rowByName("Closed Rose Candle");
    check("4a. seeded cart total = 104", doc.querySelector("#cartTotal").textContent === "104 جنيه",
      `total=${doc.querySelector("#cartTotal").textContent}, badge=${doc.querySelector("#cartCount").textContent}, rows=${doc.querySelectorAll("#cartItems .ci").length}`);
    // decrement p31 by 1
    rowP31.querySelector(".dec").click();
    check("4b. decrement updates total 3*26+26=104 -> 2*26+26=78", doc.querySelector("#cartTotal").textContent === "78 جنيه",
      `total=${doc.querySelector("#cartTotal").textContent}`);
    // increment p33 twice -> 3 => 52 + 78 = 130
    rowP33.querySelector(".inc").click();
    rowP33.querySelector(".inc").click();
    check("4c. increments update total 52+78=130", doc.querySelector("#cartTotal").textContent === "130 جنيه",
      `total=${doc.querySelector("#cartTotal").textContent}`);
    // decrement p33 to 0 -> item removed
    rowP33.querySelector(".dec").click(); rowP33.querySelector(".dec").click(); rowP33.querySelector(".dec").click();
    const cart = JSON.parse(store.get("wanas_cart"));
    check("4d. qty<=0 removes item from cart + storage", cart.length === 1 && cart[0].id === "p31",
      `cart=${JSON.stringify(cart)}, total=${doc.querySelector("#cartTotal").textContent}`);
    // remove button on the remaining p31 row
    (rowByName("وردة اقحوان") || rowByName("Clove Rose Candle")).querySelector(".rm").click();
    const cartAfter = JSON.parse(store.get("wanas_cart"));
    check("4e. remove button empties cart", Array.isArray(cartAfter) && cartAfter.length === 0 && cartTotalText(doc) === "0 جنيه",
      `cart=${JSON.stringify(cartAfter)}, total=${cartTotalText(doc)}`);

    check("4f. no errors in cart ops", errors.length === 0, errors[0] || "");
  }

  /* ---------- 5) checkout: window.open URL + decoded text ---------- */
  {
    const { doc, opened, errors } = mkDom({ seedCart: [{ id: "p31", qty: 2 }, { id: "p33", qty: 1 }] }); // 52 + 26 = 78
    await new Promise((r) => setTimeout(r, 400));
    doc.querySelector("#cartBtn").click(); // open drawer (may be needed)
    doc.querySelector("#checkoutBtn").click();
    check("5a. checkout modal opens", doc.querySelector("#checkoutModal").classList.contains("show"), `opened=${opened.slice(0,1)}`);

    doc.querySelector("#custName").value = "أحمد تيست";
    doc.querySelector("#custPhone").value = "01012345678";
    doc.querySelector("#custAddr").value = "القاهرة - مصر الجديدة";
    // pick a payment method
    doc.querySelector('#payList .pay[data-k="vodafone"]').click();
    doc.querySelector("#sendOrderBtn").click();
    check("5b. window.open captured once", opened.length === 1, opened.join(" | "));
    const url = opened[0] || "";
    const decoded = decodeURIComponent((url.match(/[?&]text=([^&]+)/) || [])[1] || "").replace(/\u00A0/g, " ");
    check("5c. decoded order text contains name", decoded.includes("أحمد تيست"), snippet(decoded, "الاسم"));
    check("5d. decoded text contains phone", decoded.includes("01012345678"), snippet(decoded, "التليفون"));
    check("5e. decoded text contains address", decoded.includes("القاهرة - مصر الجديدة"), snippet(decoded, "العنوان"));
    check("5f. unit price line for p31 (26 EGP x2 = 52)", /السعر: 26 جنيه\s*×\s*الكمية: 2\s*=\s*الإجمالي: 52 جنيه/.test(decoded),
      (decoded.match(/السعر: [^\n]*/g) || ["(unit lines not found)"]).join(" | "));
    check("5g. grand total 78 in order text", decoded.includes("78 جنيه") && /الإجمالي الكلي.*78 جنيه/.test(decoded),
      (decoded.match(/الإجمالي الكلي[^\n]*/) || ["(grand total not found)"])[0]);
    check("5h. wa.me intl number = 201020306395", url.includes("wa.me/201020306395"), url.split("?")[0]);
    check("5i. no '-' placeholder bug in customer lines", !/• (الاسم|التليفون|العنوان): -/.test(decoded), customerLines(decoded));
    check("5j. no errors during checkout", errors.length === 0, errors[0] || "");
  }

  /* ---------- 6) price tampering in localStorage cart ---------- */
  {
    // cart items in this site store only {id, qty} — price is ALWAYS looked up from DATA via cartTotal()/buildOrderText().
    // Simulate the strongest feasible tamper: inject a cart entry whose id is UNKNOWN to DATA, and a doctored cart JSON that includes a price field.
    const { dom, doc, store, opened, errors } = mkDom();
    await new Promise((r) => setTimeout(r, 400)); // page built DATA from clean defaults
    // Overwrite localStorage cart with tampered entries: qty lines carrying extra fields + wrong ids
    store.set("wanas_cart", JSON.stringify([
      { id: "p31", qty: 2, price: 0.01, name: "FAKE" },   // legit id, injected price field (site ignores it)
      { id: "HACKED1", qty: 5, price: 999999, name: "INJECTED" }, // unknown id — loadCart filters it
    ]));
    // Re-render from the doctored storage WITHOUT reloading the page: mimic a buyer editing storage then re-triggering render
    dom.window.eval(`CART = ${store.get("wanas_cart")}; saveCart(); renderCart(); renderOrderSummary();`);
    injectedState = dom.window.eval("CART.map(i=>i.id+':'+i.qty).join(',')");
    doc.querySelector("#cartBtn").click();
    doc.querySelector("#checkoutBtn").click();
    doc.querySelector("#custName").value = "تامبر";
    doc.querySelector("#custPhone").value = "01098765432";
    doc.querySelector("#custAddr").value = "عنوان تامبر";
    const voda = doc.querySelector('#payList .pay[data-k="vodafone"]'); if (voda) voda.click();
    doc.querySelector("#sendOrderBtn").click();
    const url = opened[0] || "";
    const decoded = decodeURIComponent((url.match(/[?&]text=([^&]+)/) || [])[1] || "");
    const merchantVisible = {
      contains999999: decoded.includes("999999"),
      containsINJECTED: decoded.includes("INJECTED"),
      containsHACKED: decoded.includes("HACKED"),
      p31_total_52: decoded.includes("52 جنيه"),
      grandTotal78: decoded.includes("78 جنيه"),
    };
    check("6. tampered price CANNOT reach merchant order (canonical recompute)", !merchantVisible.contains999999 && !merchantVisible.containsINJECTED && !merchantVisible.containsHACKED,
      JSON.stringify(merchantVisible) + ` | decoded grand total line: ${(decoded.match(/الإجمالي الكلي: [^\n]*/) || ["none"])[0]}`);
  }

  /* ---------- 7) inline image thumbs click ---------- */
  {
    const { doc, errors } = mkDom();
    await new Promise((r) => setTimeout(r, 400));
    // find a card with thumbs: p33 (وردة مقفولة) has 5 images
    const card = [...doc.querySelectorAll("#productGrid .card")].find(c => c.querySelectorAll(".thumb").length > 1);
    if (!card) { check("7. thumb switching", false, "no card with thumbs rendered"); }
    else {
      const ph = card.querySelector(".ph");
      const src0 = ph.querySelector("img").getAttribute("src");
      const thumb2 = card.querySelectorAll(".thumb")[2];
      const thumb2img = thumb2.querySelector("img").getAttribute("src");
      thumb2.click();
      const srcAfter = ph.querySelector("img").getAttribute("src");
      const activeIdx = [...card.querySelectorAll(".thumb")].findIndex(t => t.classList.contains("active"));
      check("7a. thumb click switches main .ph img src", srcAfter === thumb2img && srcAfter !== src0,
        `before=${src0.slice(0, 60)} | after=${srcAfter.slice(0, 60)}`);
      check("7b. clicked thumb gains .active, others lose it", activeIdx === 2,
        `activeIdx=${activeIdx}`);
      check("7c. no errors in thumb switch", errors.length === 0, errors[0] || "");
    }
  }

  console.log(results.join("\n"));
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("HARNESS CRASH:", e); process.exit(2); });

function cartTotalText(doc) { const el = doc.querySelector("#cartTotal"); return el ? el.textContent : ""; }
function snippet(txt, anchor) {
  const i = txt.indexOf(anchor);
  if (i < 0) return `(anchor "${anchor}" not found)`;
  return txt.slice(i, i + 90).replace(/\n/g, " ");
}
function customerLines(txt) {
  return txt.split("\n").filter(l => /•\s*(الاسم|التليفون|العنوان|Name|Phone|Address)/.test(l)).join(" || ") || "(none)";
}
function firstMatch(txt, re) {
  const m = txt.match(/     [^\n]*/);
  return m ? m[0].trim() : "(unit line not found)";
}
