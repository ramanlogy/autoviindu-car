#!/usr/bin/env node
/**
 * Regenerates scripts/brochure-urls.json from a set of rules.
 *
 * We deliberately link to each manufacturer's official *brochure page* (which
 * stays live for years and always serves the current brochure) rather than a
 * raw dated PDF path (which the manufacturers rename every few months).
 *
 * Cars whose brand isn't covered here keep brochureUrl = null, and the site
 * falls back to the auto-generated AutoViindu spec sheet for them.
 *
 *   node scripts/build-brochure-urls.js        # rewrite the json
 *   node scripts/apply-brochure-urls.js        # push it into dev.db
 */
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const dbUrl = process.env.DATABASE_URL || `file:${path.join(__dirname, '..', 'dev.db')}`;
const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: dbUrl }) });

// ── Official brochure hubs (one stable page per brand) ───────────────────────
const MARUTI_ARENA = 'https://www.marutisuzuki.com/arena/car-brochure';
const MARUTI_NEXA = 'https://www.nexaexperience.com/e-brochure';
const VW_HOME = 'https://www.volkswagen.co.in/en.html';
const VW_PDF = (name) =>
  `https://www.volkswagen.co.in/idhub/content/dam/onehub_pkw/importers/in/pdf/${name}-Brochure.pdf`;

const BRAND_HUB = {
  Hyundai: 'https://www.hyundai.com/in/en/click-to-buy/request-a-brochure',
  Toyota: 'https://www.toyota.com.np/en/price-and-model-tools/model-brochures.html',
  Kia: 'https://www.kia.com/in/buy/download-brochure.html',
  Tata: 'https://tata.cars/support/brochures.html',
  Honda: 'https://www.hondacarindia.com/download-brochure',
  Nissan: 'https://www.nissan.in/vehicles/brochures.html',
  Renault: 'https://www.renault.co.in/download-a-brochure.html',
  'Mercedes-Benz': 'https://www.mercedes-benz.co.in/passengercars/buy/brochures.html',
  Volvo: 'https://www.volvocars.com/in/l/brochures/',
  BMW: 'https://www.bmw.in/en/all-models.html',
  Audi: 'https://www.audi.in/en/',
  Jeep: 'https://www.jeep-india.com/shopping_tools/get-a-brochure.html',
  BYD: 'https://www.byd.com/np',
  Mahindra: 'https://auto.mahindra.com/',
  // Nepal distributor sites (each carries a "download brochure" section)
  Proton: 'https://www.proton.com/en/our-cars',
  Geely: 'https://www.lrrmotors.com/geely',
  Haval: 'https://gwm.com.np/',
  GWM: 'https://gwm.com.np/',
  Chery: 'https://www.chery.com.np/',
};

// Maruti / Suzuki: NEXA channel models (everything else on that brand = Arena)
const NEXA_MODELS = /baleno|fronx|jimny|grand vitara|ignis|invicto|ciaz|xl6|e-?vitara/i;

// Per-slug overrides win over brand rules.
const SLUG_OVERRIDE = {
  'volkswagen-taigun-2025': VW_PDF('Taigun'),
  'volkswagen-virtus-2025': VW_PDF('Virtus'),
  'volkswagen-polo-2025': VW_HOME,
  'volkswagen-tayron-2025': VW_HOME,
  'volkswagen-tiguan-allspace-2025': VW_HOME,
  'volkswagen-touareg-2025': VW_HOME,
  'skoda-kushaq-ts': 'https://www.skoda-auto.co.in/shopping/kushaq-download-a-brochure',
  'skoda-kylaq-2026': 'https://www.skoda-auto.co.in/shopping/kylaq-download-a-brochure',
  'skoda-slavia-2026': 'https://www.skoda-auto.co.in/shopping/slavia-download-a-brochure',
};

function urlFor(car) {
  if (SLUG_OVERRIDE[car.slug]) return SLUG_OVERRIDE[car.slug];
  const b = car.brand;
  if (b === 'Suzuki' || b === 'Maruti Suzuki') {
    return NEXA_MODELS.test(car.model) ? MARUTI_NEXA : MARUTI_ARENA;
  }
  return BRAND_HUB[b] || null;
}

(async () => {
  const cars = await prisma.car.findMany({ select: { slug: true, brand: true, model: true } });
  const out = {
    _comment:
      'slug -> official manufacturer brochure page. Regenerate with scripts/build-brochure-urls.js, apply with scripts/apply-brochure-urls.js. Cars not listed fall back to the generated spec sheet.',
  };
  const uncovered = {};
  for (const car of cars.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const url = urlFor(car);
    if (url) out[car.slug] = url;
    else uncovered[car.brand] = (uncovered[car.brand] || 0) + 1;
  }
  fs.writeFileSync(path.join(__dirname, 'brochure-urls.json'), JSON.stringify(out, null, 2) + '\n');

  const covered = Object.keys(out).filter((k) => !k.startsWith('_')).length;
  console.log(`wrote brochure-urls.json — ${covered}/${cars.length} cars covered`);
  console.log('\nnot covered (fall back to generated sheet):');
  Object.entries(uncovered)
    .sort((a, b) => b[1] - a[1])
    .forEach(([brand, n]) => console.log(`  ${String(n).padStart(3)}  ${brand}`));
})().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
