const path = require("path");
const ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)";
const { PrismaClient } = require(path.join(ROOT, "node_modules/@prisma/client"));
const { PrismaLibSql } = require(path.join(ROOT, "node_modules/@prisma/adapter-libsql"));
const adapter = new PrismaLibSql({ url: `file:${path.join(ROOT, "dev.db")}` });
const prisma = new PrismaClient({ adapter });
(async () => {
  const cars = await prisma.car.findMany({
    where: { OR: [{ isBestSeller: true }, { isFeatured: true }] },
    select: { id: true, slug: true, brand: true, model: true, year: true, bodyType: true, type: true, isEV: true, specs: true, variants: true }
  });
  console.log(`Count: ${cars.length}`);
  for (const c of cars) {
    console.log(`${c.id}\t${c.slug}\t${c.brand} ${c.model} ${c.year}\t${c.bodyType}/${c.type}${c.isEV?'/EV':''}\tspecsKeys=${Object.keys(c.specs||{}).length}\tvariants=${(c.variants||[]).length}`);
  }
  await prisma.$disconnect();
})();
