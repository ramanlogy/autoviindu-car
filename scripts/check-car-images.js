#!/usr/bin/env node
/*
 * Checks every image path referenced by a Car row in dev.db against the actual
 * files in public/. Case-sensitive (matches the Linux server), so it catches
 * image paths that resolve on a case-insensitive dev machine but 404 in
 * production.
 *
 *   node scripts/check-car-images.js            # summary + first 60 broken refs
 *   node scripts/check-car-images.js --all      # every broken ref
 *   node scripts/check-car-images.js --fix-case # rewrite DB paths to match a
 *                                               # real file that differs only
 *                                               # in capitalisation
 *
 * Uses the `sqlite3` CLI (present on the server and most dev machines) so it
 * needs no native npm module.
 */
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const DB = process.env.DEV_DB || path.join(ROOT, 'dev.db');
const ALL = process.argv.includes('--all');
const FIX_CASE = process.argv.includes('--fix-case');

function sqlite(sql, extraArgs = []) {
  return execFileSync('sqlite3', [...extraArgs, DB, sql], { maxBuffer: 64 * 1024 * 1024 }).toString();
}

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

const cars = JSON.parse(sqlite('SELECT id, slug, images FROM Car', ['-json']) || '[]');

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

  if (changed) patches.push({ id: car.id, images: JSON.stringify(fixed) });
}

console.log(`\nCars: ${cars.length}   image refs: ${total}   broken: ${broken}   (${caseFixable} are case-only, auto-fixable)\n`);
console.log((ALL ? report : report.slice(0, 60)).join('\n'));
if (!ALL && report.length > 60) console.log(`\n… ${report.length - 60} more (run with --all)`);

if (FIX_CASE && patches.length) {
  const esc = (s) => s.replace(/'/g, "''");
  const sql = 'BEGIN;\n' +
    patches.map((p) => `UPDATE Car SET images='${esc(p.images)}' WHERE id=${p.id};`).join('\n') +
    '\nCOMMIT;\n';
  execFileSync('sqlite3', [DB], { input: sql });
  console.log(`\n✔ Rewrote images JSON for ${patches.length} cars (case fixes only).`);
  console.log('  Review with `git diff --stat`, commit dev.db, push, then pull + restart on the server.');
}
