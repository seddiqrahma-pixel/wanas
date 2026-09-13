const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/i);
const js = m[1];
const lines = js.split("\n");
let found = false;
for (let i = 0; i < lines.length; i++) {
  const idx = lines[i].indexOf("...");
  if (idx >= 0) {
    const before = lines[i].substring(Math.max(0, idx - 40), idx);
    const after = lines[i].substring(idx + 3, Math.min(lines[i].length, idx + 40));
    // count unescaped double quotes in the before portion
    const qBefore = (before.match(/"(?:[^"\\]|\\.)*$/g) || []).length;
    // simpler: count total unescaped quotes before ...
    let dq = 0, sq = 0, esc = false;
    for (let j = 0; j < idx; j++) {
      const ch = lines[i][j];
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === '"') dq++;
      if (ch === "'") sq++;
    }
    const inDqStr = dq % 2 === 1;
    const inSqStr = sq % 2 === 1;
    const inStr = inDqStr || inSqStr;
    if (!inStr) {
      console.log("OUTSIDE STRING at line " + (i + 1) + " (col " + (idx + 1) + "):");
      console.log("  before: ...\"" + before + "\"");
      console.log("  after:  \"" + after + "...\"");
      console.log("  full line: " + lines[i].trim().substring(0, 160));
      found = true;
    }
  }
}
if (!found) {
  console.log("All '...' occurrences are inside string literals => valid JS.");
  // but new Function still fails, so let's also check for other suspicious tokens
  // try new Function with a small wrapper to get the real error location
  try {
    new Function(js);
    console.log("new Function(js) succeeded");
  } catch (e) {
    console.log("new Function(js) failed:", e.message);
    // try to get stack
    if (e.stack) console.log("Stack:", e.stack.split("\n").slice(0, 3).join("\n"));
  }
}
