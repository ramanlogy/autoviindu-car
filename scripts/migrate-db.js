const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const fs = require('fs');
const path = require('path');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting data migration...");

  // 1. Migrate Cars
  const carsPath = path.join(__dirname, '../backend/data/cars.json');
  if (fs.existsSync(carsPath)) {
    const carsData = JSON.parse(fs.readFileSync(carsPath, 'utf-8'));
    console.log(`Migrating ${carsData.length} new cars...`);
    
    for (const car of carsData) {
      await prisma.car.upsert({
        where: { slug: car.slug },
        update: {},
        create: {
          slug: car.slug,
          brand: car.brand,
          brandSlug: car.brandSlug || car.brand.toLowerCase(),
          model: car.model,
          year: car.year || 2024,
          type: car.type || 'Unknown',
          bodyType: car.bodyType || 'Unknown',
          body: car.body,
          badge: car.badge,
          budgetTier: car.budgetTier,
          isEV: car.isEV || false,
          isNew: car.isNew !== false,
          isFeatured: car.isFeatured || false,
          isBestSeller: car.isBestSeller || false,
          tagline: car.tagline,
          rating: car.rating,
          reviews: car.reviews,
          expertScore: car.expertScore,
          baseEMI: car.baseEMI,
          overview: car.overview,
          images: car.images || [],
          colors: car.colors || [],
          variants: car.variants || [],
        },
      });
    }
    console.log("Cars migrated successfully!");
  }

  // 2. Migrate Used Cars
  const usedCarsPath = path.join(__dirname, '../backend/data/used-cars.json');
  if (fs.existsSync(usedCarsPath)) {
    const usedCarsData = JSON.parse(fs.readFileSync(usedCarsPath, 'utf-8'));
    console.log(`Migrating ${usedCarsData.length} used cars...`);
    
    for (const car of usedCarsData) {
      await prisma.usedCar.upsert({
        where: { slug: car.slug },
        update: {},
        create: {
          slug: car.slug,
          brand: car.brand || 'Unknown',
          model: car.model || 'Unknown',
          year: car.year || 2020,
          price: String(car.price || '0'),
          mileage: String(car.mileage || '0'),
          fuelType: car.fuelType || 'Unknown',
          transmission: car.transmission || 'Manual',
          condition: car.condition,
          location: car.location,
          ownerCount: car.ownerCount,
          images: car.images || [],
          features: car.features || [],
        },
      });
    }
    console.log("Used Cars migrated successfully!");
  }

  // You can easily add sections for Blogs, Brands, etc. following this pattern.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
