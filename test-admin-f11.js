// test-admin-f11.js — Feature 11: GitHub publish panel test
const fs = require("fs");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync("index.html","utf8");

const dom = new JSDOM(html, { runScripts:"dangerously", resources:"usable", url:"http://localhost/" });
const w = dom.window;
w.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
const script = scriptMatch[1];
const wrapped = "(function(){\n" + script + "\n})();";
w.eval(wrapped);

setTimeout(() => {
  const doc = w.document;
  console.log("=== FEATURE 11: GitHub Publish Panel ===");
  
  doc.getElementById("adminBtn").click();
  doc.getElementById("adminPass").value = "wanas123";
  doc.getElementById("adminLoginBtn").click();
  
  setTimeout(() => {
    console.log("Admin unlocked:", doc.getElementById("adminPanel").classList.contains("open"));
    
    doc.querySelector('button[data-st="github"]').click();
    setTimeout(() => {
      const panel = doc.querySelector('.settings-panel[data-sp="github"]');
      console.log("GitHub panel exists:", !!panel);
      
      if (panel) {
        console.log("Panel title:", doc.querySelector('[data-i18n="gh_title"]').textContent);
        console.log("Hint text:", doc.querySelector('[data-i18n="gh_hint"]').textContent);
        console.log("Token placeholder:", doc.getElementById("ghToken").placeholder);
        console.log("Save btn (AR):", doc.getElementById("ghSaveBtn").textContent);
        console.log("Clear btn (AR):", doc.getElementById("ghClearBtn").textContent);
        console.log("Publish btn (AR):", doc.getElementById("ghPublishBtn").textContent);
        console.log("Warning (AR):", doc.querySelector('[data-i18n="gh_warning"]').textContent);
        console.log("Status el exists:", !!doc.getElementById("ghStatus"));
        console.log("Save onclick:", doc.getElementById("ghSaveBtn").onclick !== null);
        console.log("Clear onclick:", doc.getElementById("ghClearBtn").onclick !== null);
        console.log("Publish onclick:", doc.getElementById("ghPublishBtn").onclick !== null);
        
        doc.getElementById("ghToken").value = "ghp_testtoken123";
        doc.getElementById("ghSaveBtn").click();
        console.log("After save - token:", doc.getElementById("ghToken").value);
        console.log("After save - LS:", w.localStorage.getItem("wanas_gh"));
        
        doc.getElementById("ghClearBtn").click();
        console.log("After clear - token:", doc.getElementById("ghToken").value);
        console.log("After clear - LS:", w.localStorage.getItem("wanas_gh"));
        
        doc.getElementById("langBtn").click();
        console.log("\nEN mode:");
        console.log("Publish btn:", doc.getElementById("ghPublishBtn").textContent);
        console.log("Hint:", doc.querySelector('[data-i18n="gh_hint"]').textContent);
        console.log("Warning:", doc.querySelector('[data-i18n="gh_warning"]').textContent);
        console.log("Save btn:", doc.getElementById("ghSaveBtn").textContent);
        console.log("Clear btn:", doc.getElementById("ghClearBtn").textContent);
        
        doc.getElementById("langBtn").click();
        console.log("\nBack to AR:");
        console.log("Publish btn:", doc.getElementById("ghPublishBtn").textContent);
        
        console.log("\n=== F11 CHECKS ===");
        const checks = {
          "Panel renders": !!panel,
          "Bilingual titles": doc.querySelector('[data-i18n="gh_title"]').textContent.length > 0,
          "Token field": !!doc.getElementById("ghToken"),
          "Save wired": doc.getElementById("ghSaveBtn").onclick !== null,
          "Clear wired": doc.getElementById("ghClearBtn").onclick !== null,
          "Publish wired": doc.getElementById("ghPublishBtn").onclick !== null,
          "Warning visible": !!doc.querySelector('[data-i18n="gh_warning"]'),
          "Save->LS": w.localStorage.getItem("wanas_gh") !== null,
          "Clear->LS empty": w.localStorage.getItem("wanas_gh") === "",
          "EN translation": doc.getElementById("ghPublishBtn").textContent === "Publish",
        };
        let ok = true;
        for (const [k,v] of Object.entries(checks)) {
          console.log((v ? "PASS" : "FAIL") + ": " + k);
          if (!v) ok = false;
        }
        console.log("\nOverall:", ok ? "ALL PASS" : "SOME FAILED");
      }
      process.exit(0);
    }, 500);
  }, 500);
}, 500);
