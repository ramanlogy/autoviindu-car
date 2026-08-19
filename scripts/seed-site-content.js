/**
 * scripts/seed-site-content.js
 * Seeds all site-content JSON files into the database
 */
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const fs = require('fs');
const path = require('path');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

function readJson(file) {
  const fp = path.join(__dirname, '../backend/site-content', file);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

function slugify(text) {
  return String(text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('Starting site-content seeding...');

  // 1. Brands
  const brandsData = readJson('brands.json');
  if (brandsData && brandsData.items) {
    console.log(`Seeding ${brandsData.items.length} brands...`);
    for (const b of brandsData.items) {
      await prisma.brand.upsert({
        where: { slug: b.slug },
        update: {
          name: b.name, fullName: b.fullName, tagline: b.tagline,
          country: b.country, founded: b.founded, nepalDealer: b.nepalDealer,
          dealerPhone: b.dealerPhone, warranty: b.warranty, serviceNetwork: b.serviceNetwork,
          overview: b.overview, color: b.color, bgColor: b.bgColor, heroImage: b.heroImage,
          strengths: b.strengths || [],
        },
        create: {
          slug: b.slug, name: b.name, fullName: b.fullName, tagline: b.tagline,
          country: b.country, founded: b.founded, nepalDealer: b.nepalDealer,
          dealerPhone: b.dealerPhone, warranty: b.warranty, serviceNetwork: b.serviceNetwork,
          overview: b.overview, color: b.color, bgColor: b.bgColor, heroImage: b.heroImage,
          strengths: b.strengths || [],
        }
      });
    }
    console.log('Brands done!');
  }

  // 2. Homepage Hero Slides
  const homepageData = readJson('homepage.json');
  if (homepageData && homepageData.heroSlides) {
    console.log(`Seeding ${homepageData.heroSlides.length} hero slides...`);
    await prisma.heroSlide.deleteMany({});
    for (let i = 0; i < homepageData.heroSlides.length; i++) {
      const s = homepageData.heroSlides[i];
      await prisma.heroSlide.create({
        data: {
          title: s.title, badge: s.badge, slug: s.slug,
          bg: s.bg, sub: s.sub, offerLabel: s.offerLabel, offerVal: s.offerVal,
          sortOrder: i, isActive: true,
        }
      });
    }
    console.log('Hero slides done!');
  }

  // 3. Site Settings
  const settingsData = readJson('settings.json');
  if (settingsData) {
    console.log('Seeding site settings...');
    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: { data: settingsData },
      create: { id: 1, data: settingsData }
    });
    console.log('Settings done!');
  }

  // 4. All other site content (services, news, videos, events, reviews, charging-stations, budget-tiers, blogs)
  const contentKeys = ['services', 'news', 'videos', 'events', 'reviews', 'charging-stations', 'budget-tiers', 'blogs'];
  for (const key of contentKeys) {
    const data = readJson(key + '.json');
    if (data) {
      console.log(`Seeding site content: ${key}...`);
      await prisma.siteContent.upsert({
        where: { key },
        update: { data },
        create: { key, data }
      });
    }
  }
  console.log('All site content seeded!');

  // 5. Migrate form submissions to Leads
  const formsPath = path.join(__dirname, '../backend/form-submissions.json');
  if (fs.existsSync(formsPath)) {
    const submissions = JSON.parse(fs.readFileSync(formsPath, 'utf-8'));
    console.log(`Migrating ${submissions.length} form submissions to Leads...`);
    await prisma.lead.deleteMany({}); // Clear existing to prevent duplicates and ensure rawData is populated
    for (const s of submissions) {
      await prisma.lead.create({
        data: {
          name: s.name || s.fullName || s['Your full name'] || s['Legal registered name'] || 'Unknown',
          email: s.email || s['you@example.com'] || s['office@company.com'] || '',
          phone: s.phone || s.mobile || s['+977 98XXXXXXXX'] || s.whatsapp || '',
          inquiryType: s.formType || s.serviceType || s.formId || s.req_type || 'general',
          message: s.message || s.notes || s.query || s.description || 
                  s["e.g. Bluebook renewal for my private vehicle, driving license upgrade from two-wheeler to four-wheeler, duplicate bluebook for lost certificate…"] || 
                  s["e.g. Brake pad set for rear axle, alloy wheel 16 inch, EV charging cable Type-2…"] || '',
          carInterest: s.car || s.carModel || s.interest || (s.brand && s.model ? (s.brand + ' ' + s.model) : '') || '',
          status: 'NEW',
          rawData: s,
          createdAt: s.timestamp ? new Date(s.timestamp) : new Date(),
        }
      });
    }
    console.log('Leads migrated!');
  }

  console.log('\n✅ All data seeded successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
