const path = require("path");
const ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)";
const { PrismaClient } = require(path.join(ROOT, "node_modules/@prisma/client"));
const { PrismaLibSql } = require(path.join(ROOT, "node_modules/@prisma/adapter-libsql"));
const adapter = new PrismaLibSql({ url: `file:${path.join(ROOT, "dev.db")}` });
const prisma = new PrismaClient({ adapter });
(async () => {
  const slugs = process.argv.slice(2);
  const cars = await prisma.car.findMany({
    where: { slug: { in: slugs } },
    select: { slug:true, brand:true, model:true, year:true, type:true, bodyType:true, body:true, isEV:true, specs:true, pros:true, cons:true, highlights:true, variants:true, overview:true }
  });
  console.log(JSON.stringify(cars, null, 2));
  await prisma.$disconnect();
})();
