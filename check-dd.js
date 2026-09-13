const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/i);
if (!m) { console.log("NO SCRIPT"); process.exit(0); }
const js = m[1];
const lines = js.split("\n");
let found = false;

for (let i = 0; i < lines.length; i++) {
  const idx = lines[i].indexOf("...");
  if (idx >= 0) {
    const before = lines[i].substring(0, idx);
    let qSingle = 0, qDouble = 0;
    for (let k = 0; k < before.length; k++) {
      const ch = before[k];
      if (ch === "\\") { k++; continue; }
      if (ch === "'") qSingle++;
      if (ch === '"') qDouble++;
    }
    const inStr = (qSingle % 2 === 1) || (qDouble % 2 === 1);
    const isSpread = /\[\.\...[truncated]