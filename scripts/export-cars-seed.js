#!/usr/bin/env node
/**
 * Exports every row of the Car table to scripts/cars-seed.json.
 *
 * Why: production's dev.db is server-owned and never deployed (deploy = git pull),
 * so new cars added to the local dev.db don't reach the live site on their own.
 * server.js runs syncMissingCars() on boot and inserts any car in this seed file
 * whose slug isn't already in the live DB. Existing cars are left untouched, so
 * admin edits on the server always win.
 *
 * Re-run this whenever you add cars locally and want them to ship:
 *   node scripts/export-cars-seed.js
 */
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const dbUrl = process.env.DATABASE_URL || `file:${path.join(__dirname, '..', 'dev.db')}`;
const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: dbUrl }) });

const OUT_PATH = path.join(__dirname, 'cars-seed.json');

(async () => {
  const cars = await prisma.car.findMany({ orderBy: { id: 'asc' } });
  // Drop DB-managed columns — the live DB assigns its own id/timestamps.
  const seed = cars.map(({ id, createdAt, updatedAt, ...rest }) => rest);
  fs.writeFileSync(OUT_PATH, JSON.stringify(seed, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${seed.length} cars → ${path.relative(process.cwd(), OUT_PATH)}`);
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
