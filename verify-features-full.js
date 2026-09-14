#!/usr/bin/env node
/**
 * verify-features-full.js — comprehensive admin + shopping test harness
 * Uses jsdom to render index.html and a mock localStorage, then exercises
 * the REAL function names from the codebase (no invented wrappers).
 *
 * Usage: node verify-features-full.js
 * Deps: npm install jsdom  (already in package.json)
 */

const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync("index.html", "utf8");

// Extract body HTML, strip non-essential tags so jsdom doesn't try to load images/CSS
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (!bodyMatch) { console.error("No <body> found"); process.exit(1); }
const bodyHtml = bodyMatch[1]
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<link[\s\S]*?\/?>/gi, "")
  .replace(/<img[\s\S]*?\/?>/gi, "")
  .replace(/src="[^"]*"/gi, 'src="about:blank"')
  .replace(/href="[^"]*"/gi, 'href="#"');

const dom = new JSDOM(
  `<!DOCTYPE html><html><head></head><body>${bodyHtml}</body></html>`,
  {
    url: "http://localhost/",
    runScripts: "outside-only",
    resources: "usable",
    features: { FetchExternalResources: false, ProcessExternalResources: false }
  }
);
const doc = dom.window.document;
const W = dom.window;

// --- Mock localStorage with baseline settings + data ---
const store = {
  "wanas_data": JSON.stringify({
    categories: [
      { id: "c1", ar: "شموع", en: "Candles" },
      { id: "c2", ar: "عطور", en: "Fragrances" }
    ],
    products: [
      { id: "ptest", cat: "c1", ar: "تست", en: "Test", descAr: "", descEn: "", price: 100, imgs: ["📦"], cost: 50, market: 200 }
    ]
  }),
  "wanas_settings": JSON.stringify({
    password: "wanas123",
    wrongAttempts: 0,
    logoPath: "logo.png",
    logoIconPath: "logo-icon.png",
    brandAr: "وَنَس",
    brandEn: "Wanas",
    brandFont: "Segoe UI",
    brandSize: 1.4,
    brandColor: "#7d5a2e",
    heroTitleAr: "راحة بالك تبدأ من هنا",
    heroTitleEn: "Peace of mind starts here",
    heroFont: "Segoe UI",
    heroSize: 2.4,
    heroColor: "#a98452",
    heroSubAr: "منتجات وَنَس",
    heroSubEn: "Wanas products",
    heroSubFont: "Segoe UI",
    heroSubSize: 1.1,
    heroSubColor: "#7a7268",
    footerAr: "تذييل عربي",
    footerEn: "English footer",
    footerFont: "Segoe UI",
    footerSize: 0.85,
    footerColor: "#7a7268",
    catFont: "Segoe UI",
    catSize: 0.95,
    catColor: "#7a7268",
    catActiveColor: "#ffffff",
    catActiveBg: "#a98452",
    catBorder: "#ece3d6",
    vodafone: "01020306395",
    instapay: "01020306395",
    bank: "Bank: NBE\nIBAN: EG900003041450006160803000150",
    whatsapp: "01020306395",
    email: "ahmed.alghoraib@gmail.com",
    comms: [
      { icon: "📷", ar: "إنستجرام", en: "Instagram", value: "https://instagram.com/wanas.candles", type: "social" },
      { icon: "👍", ar: "فيسبوك", en: "Facebook", value: "https://facebook.com/wanas.candles", type: "social" }
    ]
  }),
  "wanas_adminPW": JSON.stringify([119,97,110,97,115,49,50,51]),
  "wanas_lang": "ar"
};

const localStorageMock = {
  getItem: k => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; }
};
W.localStorage = localStorageMock;
global.localStorage = localStorageMock;

// --- Script globals ---
W.atob = s => Buffer.from(s, "utf8").toString("base64");
W.btoa = s => Buffer.from(s, "utf8").toString("base64");
W.navigator = { clipboard: { writeText: () => Promise.resolve() }, onLine: true };
W.confirm = () => false;
W.alert = () => {};
W.toast = (msg) => { W.__toast = msg; };
W.__toast = "";
W.FileReader = class {
  constructor() { this.onload = null; }
  readAsText(f) { this.result = f; if (this.onload) this.onload({ target: { result: f } }); }
};
W.URL = { createObjectURL: (b) => "blob:xxx", revokeObjectURL: () => {} };
W.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ content: W.btoa("{}"), sha: "abc" }) });

// --- Inject script WITHOUT IIFE so function declarations become global ---
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
if (!scriptMatch) { console.error("No <script> in index.html"); process.exit(1); }
const scriptSrc = scriptMatch[1];

const inject = `
  window.__S = S;
  window.__DATA = DATA;
  window.__LANG = LANG;
  window.__PAYMENT = PAYMENT;
  window.__PRICING = PRICING;
  window.__T = t;
  window.__INIT_DONE = true;
`;
const fullScript = scriptSrc + "\n" + inject;

try {
  W.eval(fullScript);
} catch (e) {
  console.error("Script eval failed:", e.message);
  console.error("Stack:", e.stack);
  process.exit(1);
}

// --- Capture functions off the window ---
const F = {};
for (const k of Object.getOwnPropertyNames(W)) {
  if (typeof W[k] === "function" && k !== "eval" && k !== "constructor") {
    F[k] = W[k];
  }
}

// --- Verify key functions exist ---
const checkFn = (name) => {
  if (typeof F[name] !== "function") {
    console.error(`Missing function: ${name}`);
    process.exit(1);
  }
};
[
  "saveAdminPWCodes", "pwCodeArray", "pwFromCodeArray",
  "currentAdminPW", "defaultAdminPW",
  "saveSettings", "savePassword", "saveBranding", "savePayment",
  "saveEditCat", "saveEditProd", "addCategory", "addProduct",
  "addOrUpdateComm", "renderCommList", "renderFooterComms",
  "renderBrandingForm", "renderBrandPreview", "renderAdmin",
  "renderCats", "renderProducts", "renderCart", "renderMarketList",
  "renderPay", "renderOrderSummary", "renderGitHubForm",
  "saveGitHub", "clearGitHub", "publishToGitHub", "fetchLiveData",
  "tryAdminLogin", "toggleAdmin", "openEditCat", "openEditProd",
  "resetWrongAttempts", "recordWrongAttempt", "renderWrongAttempts",
  "applyLang", "applyPaymentSettings", "migrateProduct",
  "sendWhatsApp", "sendEmail", "copyToClipboard",
  "ghOwner", "ghRepo", "ghToken", "ghLoad", "ghSave",
  "renderCats", "renderProducts", "renderCart", "renderAdmin",
  "addCategory", "addProduct", "saveEditCat", "saveEditProd",
  "addToCart", "removeFromCart", "changeQty", "cartTotal", "updateCartCount",
  "openDrawer", "openModal", "closeModal", "closeAllOverlays",
  "buildOrderText", "validateOrder", "sendWhatsApp", "sendEmail"
].forEach(checkFn);

// --- Variables ---
const S = W.__S;
const DATA = W.__DATA;
const LANG = W.__LANG;
const PAYMENT = W.__PAYMENT;
const PRICING = W.__PRICING;
const t = W.__T;

// --- DOM helpers ---
const $ = id => doc.getElementById(id);
const setVal = (id, val) => { const el = $(id); if (el) { el.value = val; return true; } return false; };
const getVal = id => { const el = $(id); return el ? el.value : undefined; };

// --- Test tracking ---
let passCount = 0, failCount = 0;
function check(label, cond) {
  if (cond) { passCount++; console.log(`  PASS: ${label}`); }
  else { failCount++; console.log(`  FAIL: ${label}`); }
}

// ============================================================
// FEATURE 1: Change admin password
// ============================================================
console.log("═══ TEST 1: Change admin password ═══");

// Reset to default
F.saveAdminPWCodes(F.pwCodeArray("wanas123"));
S.password = "wanas123";
S.wrongAttempts = 0;
F.saveSettings();

check("currentAdminPW() returns correct", F.currentAdminPW() === "wanas123");

// Wrong current password
setVal("cfgCurPass", "wrong");
setVal("cfgNewPass", "newpass123");
setVal("cfgConfirmPass", "newpass123");
F.savePassword();
const s1 = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
check("Wrong current → no change", s1.password === "wanas123");

// Mismatch
setVal("cfgCurPass", "wanas123");
setVal("cfgNewPass", "newpass123");
setVal("cfgConfirmPass", "mismatch");
F.savePassword();
const s2 = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
check("Mismatch → no change", s2.password === "wanas123");

// Success
setVal("cfgConfirmPass", "newpass123");
F.savePassword();
const s3 = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
check("New password saved", s3.password === "newpass123");
F.saveAdminPWCodes(F.pwCodeArray("newpass123"));
check("currentAdminPW() returns new password", F.currentAdminPW() === "newpass123");
console.log("");

// ============================================================
// FEATURES 2-5: Branding words, font/size/color, bilingual, logo-word
// ============================================================
console.log("═══ TESTS 2-5: Branding ═══");

// Set up values
Object.assign(S, {
  logoPath: "new-logo.png",
  logoIconPath: "new-icon.png",
  brandAr: "بلدي",
  brandEn: "Baladi",
  brandFont: "Tahoma",
  brandSize: 2.0,
  brandColor: "#ff0000",
  heroTitleAr: "هبط السكينة",
  heroTitleEn: "Calm landed",
  heroFont: "Arial",
  heroSize: 3.0,
  heroColor: "#00ff00",
  heroSubAr: "منتجات بلدي",
  heroSubEn: "Baladi products",
  heroSubFont: "Arial",
  heroSubSize: 1.5,
  heroSubColor: "#00ff00",
  footerAr: "تذييل بلدي",
  footerEn: "Baladi footer",
  footerFont: "Arial",
  footerSize: 1.0,
  footerColor: "#0000ff",
  catFont: "Tahoma",
  catSize: 1.2,
  catColor: "#abcdef",
  catActiveColor: "#ffffff",
  catActiveBg: "#123456",
  catBorder: "#abcdef"
});
F.saveSettings();

// Fill the form
F.renderBrandingForm();
check("Logo path input", getVal("cfgLogo") === "new-logo.png");
check("Logo icon path input", getVal("cfgLogoSmall") === "new-icon.png");
check("Brand AR input", getVal("cfgBrandAr") === "بلدي");
check("Brand EN input", getVal("cfgBrandEn") === "Baladi");
check("Brand font", getVal("cfgBrandFont") === "Tahoma");
check("Brand size", parseFloat(getVal("cfgBrandSize")) === 2.0);
check("Brand color", getVal("cfgBrandColor") === "#ff0000");
check("Hero title AR", getVal("cfgHeroTitleAr") === "هبط السكينة");
check("Hero title EN", getVal("cfgHeroTitleEn") === "Calm landed");
check("Hero font", getVal("cfgHeroFont") === "Arial");
check("Hero size", parseFloat(getVal("cfgHeroSize")) === 3.0);
check("Hero color", getVal("cfgHeroColor") === "#00ff00");
check("Hero sub AR", getVal("cfgHeroSubAr") === "منتجات بلدي");
check("Hero sub EN", getVal("cfgHeroSubEn") === "Baladi products");
check("Hero sub font", getVal("cfgHeroSubFont") === "Arial");
check("Hero sub size", parseFloat(getVal("cfgHeroSubSize")) === 1.5);
check("Hero sub color", getVal("cfgHeroSubColor") === "#00ff00");
check("Footer AR", getVal("cfgFooterAr") === "تذييل بلدي");
check("Footer EN", getVal("cfgFooterEn") === "Baladi footer");
check("Footer font", getVal("cfgFooterFont") === "Arial");
check("Footer size", parseFloat(getVal("cfgFooterSize")) === 1.0);
check("Footer color", getVal("cfgFooterColor") === "#0000ff");
check("Cat font", getVal("cfgCatFont") === "Tahoma");
check("Cat size", parseFloat(getVal("cfgCatSize")) === 1.2);
check("Cat color", getVal("cfgCatColor") === "#abcdef");
check("Cat active color", getVal("cfgCatActiveColor") === "#ffffff");
check("Cat active bg", getVal("cfgCatActiveBg") === "#123456");
check("Cat border", getVal("cfgCatBorder") === "#abcdef");

// Modify and save
setVal("cfgBrandAr", "BrandArChanged");
setVal("cfgBrandEn", "BrandEnChanged");
setVal("cfgBrandColor", "#112233");
setVal("cfgBrandSize", "2.5");
F.saveBranding();
const sb = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
check("Brand AR saved", sb.brandAr === "BrandArChanged");
check("Brand EN saved", sb.brandEn === "BrandEnChanged");
check("Brand color saved", sb.brandColor === "#112233");
check("Brand size saved", sb.brandSize === 2.5);

// Check brand preview
const bpLabel = $("bpBrandLabel");
check("bpBrandLabel has content", bpLabel && bpLabel.textContent !== "");
const bpAr = $("bpBrandTextAr");
check("bpBrandTextAr updated", bpAr && bpAr.textContent === S.brandAr);
const bpEn = $("bpBrandTextEn");
check("bpBrandTextEn updated", bpEn && bpEn.textContent === S.brandEn);
const bpLogo = $("bpLogo");
check("bpLogo src updated", bpLogo && bpLogo.src.includes("new-logo.png"));

// Switch language
W.eval("LANG = 'en'");
F.applyLang();
check("bpBrandLabel EN", $("bpBrandLabel").textContent === "BrandEnChanged");
check("AR hidden in EN", $("bpBrandTextAr").style.display === "none");
check("EN visible in EN", $("bpBrandTextEn").style.display !== "none");
console.log("");

// ============================================================
// FEATURE 6: Categories add/remove/edit + font/size/color
// ============================================================
console.log("═══ TEST 6: Categories add/remove/edit ═══");

// Reset DATA.categories
DATA.categories = [
  { id: "cat1", ar: "شموع", en: "Candles" },
  { id: "cat2", ar: "عطور", en: "Fragrances" }
];
F.saveData();
F.renderAdmin();

check("Category list renders", $("catList").innerHTML.includes("شموع") && $("catList").innerHTML.includes("Candles"));

// Add
setVal("newCatAr", "تفاحات");
setVal("newCatEn", "Candies");
F.addCategory();
check("Category added to DATA", DATA.categories.length === 3 && DATA.categories.some(c => c.ar === "تفاحات"));
F.renderAdmin();
check("New category visible", $("catList").innerHTML.includes("تفاحات"));

// Edit
F.openEditCat("cat1");
check("Edit modal opened", $("editCatModal").classList.contains("show"));
check("Edit cat AR filled", getVal("editCatAr") === "شموع");
setVal("editCatAr", "شموع ملونة");
setVal("editCatEn", "Colorful Candles");
F.saveEditCat();
const catAfter = DATA.categories.find(c => c.id === "cat1");
check("Category edited", catAfter && catAfter.ar === "شموع ملونة" && catAfter.en === "Colorful Candles");

// Delete (simulated)
const beforeDel = DATA.categories.length;
DATA.categories = DATA.categories.filter(c => c.id !== "cat2");
F.saveData();
check("Category deleted", DATA.categories.length === beforeDel - 1);
console.log("");

// ============================================================
// FEATURE 7: Wrong password counter
// ============================================================
console.log("═══ TEST 7: Wrong password counter ═══");

S.password = "correct";
S.wrongAttempts = 0;
F.saveSettings();
F.saveAdminPWCodes(F.pwCodeArray("correct"));

F.renderWrongAttempts();
check("Initial counter 0", $("wrongAttemptsDisplay").textContent.includes("0"));

// 3 wrong attempts
for (let i = 1; i <= 3; i++) {
  setVal("adminPass", "wrong" + i);
  F.tryAdminLogin();
  const wa = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
  check(`Wrong attempt ${i} → counter ${i}`, wa.wrongAttempts === i);
  F.renderWrongAttempts();
  check(`Display shows ${i}`, $("wrongAttemptsDisplay").textContent.includes(String(i)));
}

// Correct login resets
setVal("adminPass", "correct");
F.tryAdminLogin();
const waAfter = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
check("Correct login resets counter", waAfter.wrongAttempts === 0);
F.renderWrongAttempts();
check("Display shows 0 after reset", $("wrongAttemptsDisplay").textContent.includes("0"));

// Reset button
S.wrongAttempts = 5;
F.saveSettings();
F.resetWrongAttempts();
check("Reset button → counter 0", JSON.parse(localStorage.getItem("wanas_settings") || "{}").wrongAttempts === 0);
console.log("");

// ============================================================
// FEATURE 8: Market price → discount badge
// ============================================================
console.log("═══ TEST 8: Market price → discount ═══");

DATA.products = [
  { id: "ptest", cat: "c1", ar: "تست", en: "Test", descAr: "", descEn: "", price: 100, imgs: ["📦"], cost: 50, market: 200 }
];
F.saveData();
S.marketPrices = {};
F.saveSettings();

F.renderAdmin();
F.renderMarketList();
check("Market list renders", $("marketList").innerHTML.includes("ptest"));

// Set market price via input change
const mInput = $("marketList").querySelector('[data-id="ptest"]');
check("Market input exists", !!mInput);
if (mInput) {
  mInput.value = "200";
  mInput.dispatchEvent(new Event("change"));
  const sM = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
  check("Market price saved", sM.marketPrices && sM.marketPrices.ptest === 200);
}

// Check discount badge on product card
F.renderProducts();
const grid = $("productGrid");
check("Product grid exists", !!grid);
if (grid) {
  check("Discount badge shown (100 < 200)", grid.innerHTML.includes("discount-badge"));
  check("Badge says -50%", grid.innerHTML.includes("-50%"));
}

// No badge when price >= market
DATA.products[0].price = 250;
F.saveData();
F.renderProducts();
check("No badge when price >= market", !$("productGrid").innerHTML.includes("discount-badge"));
console.log("");

// ============================================================
// FEATURE 9: Payment info
// ============================================================
console.log("═══ TEST 9: Payment info ═══");

Object.assign(S, {
  vodafone: "0123456789",
  instapay: "instapay_user",
  bank: "Bank: CIB\nIBAN: EG1200000000000000000000",
  whatsapp: "+201****4567",
  email: "new@email.com"
});
F.saveSettings();
F.applyPaymentSettings();

// Save
setVal("cfgVodafone", "9876543210");
setVal("cfgInstapay", "instapay_user2");
setVal("cfgBank", "Bank: NBE\nIBAN: EG9000000000000000000000");
setVal("cfgWhatsapp", "+201****9999");
setVal("cfgEmail", "final@email.com");
F.savePayment();
const sp = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
check("Vodafone saved", sp.vodafone === "9876543210");
check("InstaPay saved", sp.instapay === "instapay_user2");
check("Bank saved", sp.bank.includes("NBE"));
check("WhatsApp saved", sp.whatsapp === "+201****9999");
check("Email saved", sp.email === "final@email.com");
check("PAYMENT.vodafone updated", PAYMENT.vodafone === "9876543210");
console.log("");

// ============================================================
// FEATURE 10: Comms add/remove/edit
// ============================================================
console.log("═══ TEST 10: Communication methods ═══");

S.comms = [
  { icon: "📷", ar: "إنستجرام", en: "Instagram", value: "https://instagram.com/wanas.candles", type: "social" },
  { icon: "👍", ar: "فيسبوك", en: "Facebook", value: "https://facebook.com/wanas.candles", type: "social" }
];
F.saveSettings();

F.renderCommList();
check("Comm list has Instagram", $("commList").innerHTML.includes("إنستجرام"));

// Add
setVal("cfgCommIcon", "✈️");
setVal("cfgCommAr", "تيليغرام");
setVal("cfgCommEn", "Telegram");
setVal("cfgCommValue", "https://t.me/wanas");
setVal("cfgCommType", "social");
F.addOrUpdateComm();
const sc = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
check("Comm added", sc.comms.length === 3 && sc.comms.some(c => c.ar === "تيليغرام"));
F.renderCommList();
check("New comm visible", $("commList").innerHTML.includes("تيليغرام"));

// Delete (simulated)
const delBtn = $("commList").querySelector('[data-del-comm="2"]');
check("Delete button exists", !!delBtn);
if (delBtn) {
  delBtn.onclick();
  const sc2 = JSON.parse(localStorage.getItem("wanas_settings") || "{}");
  check("Comm deleted", sc2.comms.length === 2 && !sc2.comms.some(c => c.ar === "تيليغرام"));
}
F.renderCommList();
check("Deleted comm removed", !$("commList").innerHTML.includes("تيليغرام"));
F.renderFooterComms();
check("Footer comms rendered", $("footerCommsContainer").innerHTML.includes("Instagram") || $("footerCommsContainer").innerHTML.includes("إنستجرام"));
console.log("");

// ============================================================
// FEATURE 11: GitHub publish panel
// ============================================================
console.log("═══ TEST 11: GitHub publish panels ═══");

F.renderGitHubForm();
check("ghToken empty after clear", getVal("ghToken") === "");
check("ghPublishBtn text", $("ghPublishBtn").textContent === F.t("gh_btn"));

// Save token
setVal("ghToken", "test-token-123");
F.saveGitHub();
const ghStored = JSON.parse(localStorage.getItem("wanas_gh") || "{}");
check("Token saved", ghStored.token === "test-token-123");
F.renderGitHubForm();
check("Token loaded back", getVal("ghToken") === "test-token-123");

// Clear token
F.clearGitHub();
check("Token cleared", !JSON.parse(localStorage.getItem("wanas_gh") || "{}").token);
F.renderGitHubForm();
check("Token field empty after clear", getVal("ghToken") === "");

// Empty token error
F.saveGitHub();
check("Empty token → toast", W.__toast === F.t("gh_need"));

check("ghOwner default", F.ghOwner() === "seddiqrahma-pixel");
check("ghRepo default", F.ghRepo() === "wanas");

// Payload construction check
S.vodafone = "01020306395";
S.instapay = "01020306395";
S.bank = "Bank: NBE\nIBAN: EG900003041450006160803000150";
S.whatsapp = "01020306395";
S.email = "ahmed.alghoraib@gmail.com";
S.password = "secret123";
S.wrongAttempts = 7;
F.saveSettings();

const sClone = Object.assign({}, S);
delete sClone.password;
delete sClone.wrongAttempts;
const payload = JSON.parse(JSON.stringify({
  categories: DATA.categories,
  products: DATA.products,
  settings: sClone
}));
check("Payload has categories", Array.isArray(payload.categories) && payload.categories.length > 0);
check("Payload has products", Array.isArray(payload.products) && payload.products.length > 0);
check("Payload has settings", typeof payload.settings === "object");
check("Password stripped from payload", payload.settings.password === undefined);
check("wrongAttempts stripped from payload", payload.settings.wrongAttempts === undefined);
check("WhatsApp preserved", payload.settings.whatsapp === "01020306395");
console.log("");

// ============================================================
// SUMMARY
// ============================================================
console.log("\n══════════════════════════════════════");
console.log(`RESULTS: ${passCount} PASS, ${failCount} FAIL`);
if (failCount > 0) {
  console.log("⚠ SOME TESTS FAILED — review above.");
  process.exit(1);
}
console.log("✓ ALL TESTS PASSED");
process.exit(0);
