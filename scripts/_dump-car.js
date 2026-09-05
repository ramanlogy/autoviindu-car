const path = require("path");
const ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)";
const { PrismaClient } = require(path.join(ROOT, "node_modules/@prisma/client"));
const { PrismaLibSql } = require(path.join(ROOT, "node_modules/@prisma/adapter-libsql"));
const adapter = new PrismaLibSql({ url: `file:${path.join(ROOT, "dev.db")}` });
const prisma = new PrismaClient({ adapter });
(async () => {
  const slug = process.argv[2];
  const c = await prisma.car.findUnique({ where: { slug } });
  console.log(JSON.stringify(c, null, 2));
  await prisma.$disconnect();
})();
