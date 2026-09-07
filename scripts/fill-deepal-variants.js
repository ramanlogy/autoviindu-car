#!/usr/bin/env node
/**
 * One-off: normalise the Deepal lineup (S07, S07 L / "S07L", L07, S05) into the
 * shape the new variant-aware detail page expects, so it can serve as the
 * reference example for per-variant specs & features.
 *
 *   - drops internal "Note" annotations and legacy lowercase dup keys
 *     (power/torque/…) from spec objects
 *   - removes shared-sheet keys that EVERY variant already overrides, so the
 *     "by variant" flagging on the car page is accurate
 *   - fixes isEV (L07 & S05 are pure EVs but were flagged false)
 *   - fills the L07's missing highlights / pros / cons
 *
 * Idempotent — safe to re-run. After running, refresh the ship seed:
 *   node scripts/export-cars-seed.js
 */
const path = require('path');
const { createClient } = require('@libsql/client');

const db = createClient({ url: process.env.DATABASE_URL || `file:${path.join(__dirname, '..', 'dev.db')}` });

/* legacy lowercase shortcuts the renderer no longer needs */
const LOWERCASE_DROP = new Set([
  'power', 'torque', 'efficiency', 'transmission', 'battery', 'chargingdc',
  'chargingac', 'frontsuspension', 'rearsuspension', 'steering', 'seating', 'range',
]);
/* bare key -> canonical key that, if present, makes the bare one redundant */
const REDUNDANT = [
  ['Power', /^Max (Motor|Engine) Power$/i],
  ['Torque', /^Max (Motor|Engine) Torque$/i],
  ['Boot Space', /^Boot Space \(litres\)$/i],
  ['Ground Clearance', /^Ground Clearance \(mm\)$/i],
  ['Seating', /^Seating Capacity$/i],
  ['Battery', /^Battery Capacity \(kWh\)$/i],
  ['Kerb Weight', /^Kerb Weight \(kg\)$/i],
  ['Transmission', /^Transmission Type$/i],
  ['Warranty', /^Standard Vehicle Warranty$/i],
];

function cleanSpecs(specs) {
  const out = {};
  const keys = Object.keys(specs || {});
  for (const k of keys) {
    if (k === 'Note') continue;
    if (LOWERCASE_DROP.has(k.toLowerCase()) && k === k.toLowerCase()) continue;
    const red = REDUNDANT.find(([bare]) => bare.toLowerCase() === k.toLowerCase());
    if (red && keys.some(other => red[1].test(other))) continue;
    out[k] = specs[k];
  }
  return out;
}

/* delete keys from the shared sheet that every variant already defines */
function trimShared(shared, variants) {
  const out = {};
  for (const [k, val] of Object.entries(shared)) {
    const lk = k.toLowerCase();
    const allOverride = variants.length > 0 && variants.every(v =>
      Object.keys(v.specs || {}).some(vk => vk.toLowerCase() === lk));
    if (!allOverride) out[k] = val;
  }
  return out;
}

const L07_CONTENT = {
  highlights: [
    '540km NEDC range (~400km real-world) from a 66.8kWh NMC pack',
    "15.6\" rotating 'Sunflower' touchscreen with Augmented-Reality HUD",
    'Frameless doors & flush electric handles on a sub-Rs.70L electric liftback',
    'Deepal ADAS 2.5 — adaptive cruise, lane keep, blind-spot & AEB',
  ],
  pros: [
    'Sleek liftback body hides a large rear boot (473–475L) plus a 70L frunk',
    'Premium tech for the money: AR-HUD, 14-speaker audio, 40W wireless charging, panoramic glass roof',
    'RWD with H-Arm multi-link rear suspension for a planted highway feel',
    'Crash-notification system auto-unlocks the doors after an impact',
  ],
  cons: [
    'Only one variant — no cheaper entry point or long-range option',
    'DC fast-charging peak rate not officially published by Deepal',
    '160mm ground clearance is low for rough Nepal roads',
    "Deepal's sales & service network in Nepal is still young",
  ],
};

(async () => {
  const r = await db.execute(
    "SELECT id,slug,brand,model,isEV,type,specs,variants,highlights,pros,cons FROM Car WHERE lower(brand) LIKE '%deepal%' OR lower(slug) LIKE '%deepal%'");
  console.log(`Found ${r.rows.length} Deepal rows`);

  for (const row of r.rows) {
    const variantsIn = JSON.parse(row.variants || '[]');
    const variants = variantsIn.map(v => ({ ...v, specs: cleanSpecs(v.specs) }));
    let shared = cleanSpecs(JSON.parse(row.specs || '{}'));
    shared = trimShared(shared, variants);

    const isElectric = /electric/i.test(row.type || '');
    const isEV = row.isEV ? 1 : (isElectric ? 1 : 0);

    const patch = {
      specs: JSON.stringify(shared),
      variants: JSON.stringify(variants),
      isEV,
    };

    if (/l07/i.test(row.slug)) {
      if (!JSON.parse(row.highlights || 'null')) patch.highlights = JSON.stringify(L07_CONTENT.highlights);
      if (!JSON.parse(row.pros || 'null')) patch.pros = JSON.stringify(L07_CONTENT.pros);
      if (!JSON.parse(row.cons || 'null')) patch.cons = JSON.stringify(L07_CONTENT.cons);
    }

    const sets = Object.keys(patch).map(k => `${k} = ?`).join(', ');
    await db.execute({
      sql: `UPDATE Car SET ${sets}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [...Object.values(patch), row.id],
    });
    console.log(`  ✓ ${row.slug}: ${variants.length} variant(s), ${Object.keys(shared).length} shared specs, isEV=${isEV}` +
      (patch.highlights ? ', +highlights/pros/cons' : ''));
  }
  console.log('\nDone. Now run:  node scripts/export-cars-seed.js');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
