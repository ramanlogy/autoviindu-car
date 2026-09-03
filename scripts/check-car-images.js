#!/usr/bin/env node
/*
 * Checks every image path referenced by a Car row in dev.db against the actual
 * files in public/. Case-sensitive (matches the Linux server), so it catches
 * the "works on my Mac, 404s in production" class of bug.
 *
 *   node scripts/check-car-images.js            # summary + first 60 broken refs
 *   node scripts/check-car-images.js --all      # every broken ref
 *   node scripts/check-car-images.js --fix-case # rewrite DB paths to match a
 *                                               # real file that differs only
 *                                               # in capitalisation
 */
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const DB = process.env.DEV_DB || path.join(ROOT, 'dev.db');
const ALL = process.argv.includes('--all');
const FIX_CASE = process.argv.includes('--fix-case');

const db = new Database(DB);

// Build a lowercase -> real-relative-path index of everything under public/
const realByLower = new Map();
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs);
    else {
      const rel = '/' + path.relative(PUBLIC, abs).split(path.sep).join('/');
      realByLower.set(rel.toLowerCase(), rel);
    }
  }
})(PUBLIC);

const IMG_COLS = ['images', 'colors', 'variants']; // JSON columns that may hold URLs
const cars = db.prepare('SELECT id, slug, images FROM Car').all();

let total = 0;
let broken = 0;
let caseFixable = 0;
const report = [];
const patches = [];

for (const car of cars) {
  let imgs = [];
  try { imgs = JSON.parse(car.images || '[]'); } catch { /* skip */ }
  if (!Array.isArray(imgs)) continue;

  const fixed = [];
  let changed = false;

  for (const url of imgs) {
    if (typeof url !== 'string' || !url.startsWith('/assets/')) { fixed.push(url); continue; }
    total++;
    const abs = path.join(PUBLIC, url.replace(/^\//, ''));
    if (fs.existsSync(abs)) { fixed.push(url); continue; }

    broken++;
    const real = realByLower.get(url.toLowerCase());
    if (real) {
      caseFixable++;
      report.push(`${car.slug}\n   BAD : ${url}\n   REAL: ${real}  (case only)`);
      fixed.push(real);
      changed = true;
    } else {
      report.push(`${car.slug}\n   BAD : ${url}\n   REAL: (no file, even case-insensitive)`);
      fixed.push(url);
    }
  }

  if (changed) patches.push({ id: car.id, slug: car.slug, images: JSON.stringify(fixed) });
}

console.log(`\nCars: ${cars.length}   image refs: ${total}   broken: ${broken}   (${caseFixable} are case-only, auto-fixable)\n`);
console.log((ALL ? report : report.slice(0, 60)).join('\n'));
if (!ALL && report.length > 60) console.log(`\n… ${report.length - 60} more (run with --all)`);

if (FIX_CASE) {
  const upd = db.prepare('UPDATE Car SET images = ? WHERE id = ?');
  const tx = db.transaction((rows) => rows.forEach((r) => upd.run(r.images, r.id)));
  tx(patches);
  console.log(`\n✔ Rewrote images JSON for ${patches.length} cars (case fixes only).`);
  console.log('  Review with `git diff`, commit dev.db, push, then pull + restart on the server.');
}
