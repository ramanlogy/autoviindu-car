// split-to-json.js
// Run from project ROOT: node split-to-json.js
// Reads frontend/assets/js/data/cars-db.js and splits into brand JSON files

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ── 1. Read the cars-db.js file as text ──────────────────────────────────────
const dbPath = path.join(__dirname, 'frontend', 'assets', 'js', 'data', 'cars-db.js');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Cannot find:', dbPath);
  console.error('   Make sure you run this from the autoviindu/ root folder.');
  process.exit(1);
}

const raw = fs.readFileSync(dbPath, 'utf8');

// ── 2. Execute the file in a sandbox with a fake window object ────────────────
const sandbox = { window: {} };
vm.createContext(sandbox);
try {
  vm.runInContext(raw, sandbox);
} catch (e) {
  console.error('❌ Failed to parse cars-db.js:', e.message);
  process.exit(1);
}

const CARS_DB = sandbox.window.CARS_DB;
if (!CARS_DB || !Array.isArray(CARS_DB)) {
  console.error('❌ window.CARS_DB not found or not an array in cars-db.js');
  process.exit(1);
}

console.log(`✅ Loaded ${CARS_DB.length} cars from cars-db.js\n`);

// ── 3. Group cars by brand ────────────────────────────────────────────────────
const byBrand = {};
CARS_DB.forEach(car => {
  const brand = (car.brand || 'unknown').toLowerCase().replace(/\s+/g, '-');
  if (!byBrand[brand]) byBrand[brand] = [];
  byBrand[brand].push(car);
});

// ── 4. Write one JSON file per brand ─────────────────────────────────────────
const outDir = path.join(__dirname, 'frontend', 'data', 'cars');
fs.mkdirSync(outDir, { recursive: true });

Object.entries(byBrand).forEach(([brand, cars]) => {
  const outPath = path.join(outDir, `${brand}.json`);
  fs.writeFileSync(outPath, JSON.stringify(cars, null, 2), 'utf8');
  console.log(`✅ ${brand}.json  →  ${cars.length} car(s)  [${outPath}]`);
});

console.log(`\n🎉 Done! Upload the folder  frontend/data/cars/  to your server.`);
console.log(`   Path on server: public_html/autoviindu/data/cars/`);