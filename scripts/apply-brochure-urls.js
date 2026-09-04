#!/usr/bin/env node
/**
 * Applies official manufacturer brochure PDF links to the Car table.
 *
 * Source of truth: scripts/brochure-urls.json  — a { "<car-slug>": "<url>" } map.
 * Only slugs present in the map are touched; everything else keeps its current
 * value (so the site falls back to the generated spec-sheet for those cars).
 *
 *   node scripts/apply-brochure-urls.js          # apply
 *   node scripts/apply-brochure-urls.js --dry    # show what would change
 *   node scripts/apply-brochure-urls.js --clear  # wipe every brochureUrl first
 */
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const dbUrl = process.env.DATABASE_URL || `file:${path.join(__dirname, '..', 'dev.db')}`;
const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: dbUrl }) });

const MAP_PATH = path.join(__dirname, 'brochure-urls.json');
const DRY = process.argv.includes('--dry');
const CLEAR = process.argv.includes('--clear');

(async () => {
  const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf-8'));
  const slugs = Object.keys(map).filter((s) => !s.startsWith('_'));

  if (CLEAR && !DRY) {
    await prisma.car.updateMany({ data: { brochureUrl: null } });
    console.log('cleared all brochureUrl values');
  }

  const cars = await prisma.car.findMany({ select: { id: true, slug: true, brand: true, model: true, brochureUrl: true } });
  const bySlug = new Map(cars.map((c) => [c.slug, c]));

  let changed = 0, unchanged = 0, missing = 0;
  for (const slug of slugs) {
    const url = String(map[slug] || '').trim();
    const car = bySlug.get(slug);
    if (!car) { console.warn(`  ?  no car for slug "${slug}"`); missing++; continue; }
    if (!/^https?:\/\//i.test(url)) { console.warn(`  !  bad url for "${slug}": ${url}`); continue; }
    if (car.brochureUrl === url) { unchanged++; continue; }
    console.log(`  ${DRY ? 'would set' : 'set'}  ${car.brand} ${car.model}  ->  ${url}`);
    if (!DRY) await prisma.car.update({ where: { id: car.id }, data: { brochureUrl: url } });
    changed++;
  }

  const withUrl = await prisma.car.count({ where: { NOT: { brochureUrl: null } } });
  const total = await prisma.car.count();
  console.log(`\n${DRY ? '[dry] ' : ''}${changed} changed, ${unchanged} already current, ${missing} unmatched slugs`);
  console.log(`coverage: ${withUrl}/${total} cars now have an official brochure link`);
})().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
