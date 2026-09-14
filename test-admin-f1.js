// test-admin-f1.js — Feature 1: admin password change
// Run: node test-admin-f1.js
const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync("index.html", "utf8");
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
if (!scriptMatch) { console.error("No script found"); process.exit(1); }
const script = scriptMatch[1];

// Build JSDOM with body HTML (strip scripts, imgs, links for offline)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
let bodyHtml = "";
if (bodyMatch) {
  bodyHtml = bodyMatch[1]
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<link[\s\S]*?\/?>/gi, "")
    .replace(/<img[\s\S]*?\/?>/gi, "")
    .replace(/src="[^"]*"/gi, 'src="about:blank"')
    .replace(/href="[^"]*"/gi, 'href="#'));
}
const dom = new JSDOM(
  `<!DOCTYPE html><html><head></head><body>${bodyHtml}</body></html>`,
  { url: "http://localhost/", runScripts: "dangerously", resources: "usable" }
);
const doc = dom.window.document;
const W = dom.window;

// Seed localStorage with baseline settings BEFORE running script
W.localStorage.setItem("wanas_settings", JSON.stringify({
  password: null, wrongAttempts: 0,
  logoPath: "logo.png", logoIconPath: "logo-icon.png",
  brandAr: "وَنَس", brandEn: "Wanas",
  brandFont: "Segoe UI,Tahoma,system-ui,sans-serif",
  brandSize: 1.4, brandColor: "#7d5a2e",
  heroTitleAr: "راحة بالك تبدأ من هنا", heroTitleEn: "Peace of mind starts here",
  heroFont: "Segoe UI,system-ui,sans-serif", heroSize: 2.4, heroColor: "#a98452",
  heroSubAr: "منتجات وَنَس — جودة تهدي بالك", heroSubEn: "Wanas products — quality that soothes your soul",
  heroSubFont: "Segoe UI,system-ui,sans-serif", heroSubSize: 1.1, heroSubColor: "#7a7268",
  footerAr: "شُمُوعٌ تَمْنَحُكَ دَفْءَ الشَّمْسِ 🕯️", footerEn: "Candles that give you the comfort of the sun 🕯️",
  footerFont: "Segoe UI,system-ui,sans-serif", footerSize: 0.85, footerColor: "#7a7268",
  catFont: "Segoe UI,Tahoma,system-ui,sans-serif", catSize: 0.95, catColor: "#7a7268",
  catActiveColor: "#ffffff", catActiveBg: "#a98452", catBorder: "#ece3d6",
  catColor: "#7a7268",
  vodafone: "01020306395", instapay: "01020306395",
  bank: "Bank: NBE\\nIBAN: EG900003041450006160803000150",
  whatsapp: "01020306395", email: "ahmed.alghoraib@gmail.com",
  comms: [
    {icon:"📷", ar:"إنستجرام", en:"Instagram", value:"https://instagram.com/wanas.candles", type:"social"}
  ]
}));
W.localStorage.setItem("wanas_data", JSON.stringify({
  categories: [
    {id:"c1", ar:"شموع", en:"Candles"},
    {id:"c2", ar:"عطور", en:"Fragrances"},
    {id:"c3", ar:"هدايا", en:"Gifts"}
  ],
  products: [
    {id:"p1", cat:"c1", ar:"شمعة بلدي", en:"Baladi Candle", descAr:"شمعة طبيعية", descEn:"Natural wax candle", price:80, imgs:["products/p_baladi_rose/main.jpg"]}
  ]
}));
W.localStorage.setItem("wanas_adminPW", JSON.stringify([119,97,110,97,115,49,50,51]));

// Mock helpers the script expects
W.toast = (msg) => { W.__toast = msg; };
W.__toast = "";
W.confirm = () => false;
W.alert = () => {};
W.atob = s => Buffer.from(s, "utf8").toString("base64");
W.btoa = s => Buffer.from(s, "utf8").toString("base64");
W.navigator = { clipboard: { writeText: () => Promise.resolve() }, onLine: true };
W.confirm = () => false;

// Inject script
const fullScript = "(function(){\n" + script + "\n  window.__INIT_DONE = true;\n})();";
try {
  W.eval(fullScript);
} catch (e) {
  console.error("Script eval failed:", e.message);
  console.error("At:", e.stack ? e.stack.split("\n")[1] : "?");
  process.exit(1);
}

// Give init() time to run
const checkInterval = setInterval(() => {
  if (W.__INIT_DONE) {
    clearInterval(checkInterval);
    runTests();
  }
}, 50);

function $(id){ return doc.getElementById(id); }
function setVal(id, val){ const el = $(id); if(el) el.value = val; }
function getVal(id){ const el = $(id); return el ? el.value : null; }

function runTests() {
  const F = W;
  console.log("═══ FEATURE 1: Change admin password ═══");
  
  // Set current password, then change it
  setVal("cfgCurPass", "wanas123");
  setVal("cfgNewPass", "newpass123");
  setVal("cfgConfirmPass", "newpass123");
  F.savePassword();
  console.log("  Save toast:", W.__toast);
  const stored = JSON.parse(W.localStorage.getItem("wanas_settings"));
  console.log("  Password saved:", stored.password === "newpass123" ? "PASS" : "FAIL");
  console.log("  currentAdminPW() returns new:", F.currentAdminPW() === "newpass123" ? "PASS" : "FAIL");
  
  // Wrong current password
  setVal("cfgCurPass", "wrong");
  setVal("cfgNewPass", "newpass456");
  setVal("cfgConfirmPass", "newpass456");
  F.savePassword();
  const stored2 = JSON.parse(W.localStorage.getItem("wanas_settings"));
  console.log("  Wrong current → no change:", stored2.password === "newpass123" ? "PASS" : "FAIL");
  
  // Mismatch
  setVal("cfgCurPass", "newpass123");
  setVal("cfgNewPass", "newpass789");
  setVal("cfgConfirmPass", "mismatch");
  F.savePassword();
  const stored3 = JSON.parse(W.localStorage.getItem("wanas_settings"));
  console.log("  Mismatch → no change:", stored3.password === "newpass123" ? "PASS" : "FAIL");
  
  // Short password
  setVal("cfgCurPass", "newpass123");
  setVal("cfgNewPass", "ab");
  setVal("cfgConfirmPass", "ab");
  F.savePassword();
  const stored4 = JSON.parse(W.localStorage.getItem("wanas_settings"));
  console.log("  Short → no change:", stored4.password === "newpass123" ? "PASS" : "FAIL");
  
  console.log("\n═══ FEATURE 1 COMPLETE ═══");
}
