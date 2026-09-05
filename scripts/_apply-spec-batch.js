// Applies researched spec/pros/cons/highlights updates from an agent OUTPUT.json
// (array of {slug, specs, pros?, cons?, highlights?, sources?, notes?}) into dev.db,
// merging with existing specs (new keys win on conflict), then regenerates cars-db.js.
// Usage: node scripts/_apply-spec-batch.js <path-to-OUTPUT.json> [...more paths]
const path = require("path");
const fs = require("fs");
const ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)";
const { PrismaClient } = require(path.join(ROOT, "node_modules/@prisma/client"));
const { PrismaLibSql } = require(path.join(ROOT, "node_modules/@prisma/adapter-libsql"));
const adapter = new PrismaLibSql({ url: `file:${path.join(ROOT, "dev.db")}` });
const prisma = new PrismaClient({ adapter });

const CARS_DB_FIELDS = {
  id: true, slug: true, brand: true, brandSlug: true, model: true, year: true,
  type: true, bodyType: true, body: true, badge: true, budgetTier: true,
  isEV: true, isNew: true, isFeatured: true, isBestSeller: true, tagline: true,
  rating: true, reviews: true, expertScore: true, baseEMI: true, overview: true,
  images: true, colors: true, variants: true, specs: true, pros: true, cons: true,
  highlights: true, thumb: true,
};

async function regenerateCarsDbJs() {
  const cars = await prisma.car.findMany({ select: CARS_DB_FIELDS, orderBy: { id: 'asc' } });
  const body = `/* AutoViindu Auto-Generated Cars DB — regenerated from dev.db, do not hand-edit */\nwindow.CARS_DB = ${JSON.stringify(cars, null, 2)};\n`;
  fs.writeFileSync(path.join(ROOT, "public/assets/js/data/cars-db.js"), body, 'utf-8');
  return cars.length;
}

(async () => {
  const files = process.argv.slice(2);
  if (!files.length) { console.error("usage: node _apply-spec-batch.js <file.json> ..."); process.exit(1); }
  let totalUpdated = 0;
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf-8');
    let entries;
    try { entries = JSON.parse(raw); } catch (e) { console.error(`BAD JSON in ${f}:`, e.message); continue; }
    if (!Array.isArray(entries)) entries = [entries];
    for (const entry of entries) {
      const { slug, specs, pros, cons, highlights, notes, sources } = entry;
      if (!slug) { console.warn("skip entry with no slug", entry); continue; }
      const existing = await prisma.car.findUnique({ where: { slug } });
      if (!existing) { console.warn(`NOT FOUND in DB: ${slug}`); continue; }
      const mergedSpecs = { ...(existing.specs || {}), ...(specs || {}) };
      const data = { specs: mergedSpecs };
      if (Array.isArray(pros) && pros.length) data.pros = pros;
      if (Array.isArray(cons) && cons.length) data.cons = cons;
      if (Array.isArray(highlights) && highlights.length) data.highlights = highlights;
      await prisma.car.update({ where: { slug }, data });
      totalUpdated++;
      console.log(`updated ${slug}: ${Object.keys(mergedSpecs).length} spec fields (was ${Object.keys(existing.specs||{}).length})${notes ? ' | notes: ' + notes.slice(0,120) : ''}`);
    }
  }
  const n = await regenerateCarsDbJs();
  console.log(`\nRegenerated cars-db.js with ${n} cars. Total car records updated: ${totalUpdated}`);
  await prisma.$disconnect();
})();
