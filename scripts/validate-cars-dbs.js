const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const files = [
  path.join(root, "backend", "data", "cars.json"),
  path.join(root, "backend", "data", "used-cars.json"),
];

const conflictRe = /^<<<<<<<|^=======|^>>>>>>>/m;
let failed = false;

for (const filePath of files) {
  const label = path.relative(root, filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${label}: file not found`);
    failed = true;
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  if (conflictRe.test(raw)) {
    console.error(`❌ ${label}: unresolved git merge conflict markers found`);
    failed = true;
    continue;
  }

  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error("root value is not an array");
    console.log(`✅ ${label}: ${data.length} entries`);
  } catch (e) {
    console.error(`❌ ${label}: invalid JSON (${e.message})`);
    failed = true;
  }
}

if (failed) process.exit(1);
