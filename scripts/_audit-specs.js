const path = require("path");
const ROOT = "/mnt/3EEA50CCEA508257/Downloads/autoviindu-car (2)";
const { PrismaClient } = require(path.join(ROOT, "node_modules/@prisma/client"));
const { PrismaLibSql } = require(path.join(ROOT, "node_modules/@prisma/adapter-libsql"));

const dbUrl = `file:${path.join(ROOT, "dev.db")}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const SAFETY_FIELDS = ["Total Airbag Count", "Airbag Positions", "ABS", "EBD", "High Speed Alert System", "Central Locking", "Remote Central Locking", "Speed Sensing Auto Door Lock", "Child Safety Rear Door Lock", "Seat Belt Reminder", "Adjustable Headrests", "ISOFIX Child Seat Mounts", "Rear Occupant Alert", "Auto Headlamps", "Rain-Sensing Wipers", "Auto-Dimming IRVM", "Cruise Control", "Front/Rear Parking Sensors", "Acoustic/Laminated Windshield", "SOS Emergency Call System", "Crash Notification System", "Pedestrian Protection (Pop-up Hood)", "Night Vision Assist", "Safety Rating"];
const ADAS_FIELDS = ["Lane Departure Warning", "Forward Collision Warning", "Blind Spot Warning", "Rear Cross Traffic Warning", "Traffic Sign Recognition", "Driver Attention Monitoring", "High Beam Assist", "Adaptive Cruise Control (ACC)", "Lane Keep Assist", "Auto Emergency Braking (AEB)", "Blind Spot Collision Avoidance", "Autonomous Parking Assist", "Traffic Jam Assist", "Highway Driving Assist", "Auto Lane Change", "Remote Smart Parking", "Proactive Safety System", "360° Surround View Camera", "Front/Rear Cameras", "Parking Sensors", "Radar Sensors", "Head-Up Display (HUD)"];

(async () => {
  const cars = await prisma.car.findMany({ select: { id: true, slug: true, brand: true, model: true, specs: true, isBestSeller: true, isFeatured: true } });
  console.log(`Total cars: ${cars.length}`);
  const rows = cars.map(c => {
    const specs = c.specs || {};
    const keys = Object.keys(specs);
    const safetyCount = SAFETY_FIELDS.filter(f => keys.includes(f)).length;
    const adasCount = ADAS_FIELDS.filter(f => keys.includes(f)).length;
    return { id: c.id, slug: c.slug, brand: c.brand, model: c.model, totalSpecs: keys.length, safetyCount, adasCount, bestSeller: c.isBestSeller, featured: c.isFeatured };
  });
  rows.sort((a, b) => a.safetyCount - b.safetyCount);
  console.log("\n--- Safety field counts (sorted ascending) ---");
  for (const r of rows) {
    console.log(`${r.safetyCount}\t${r.adasCount}\t${r.totalSpecs}\t${r.slug}\t${r.brand} ${r.model}${r.bestSeller ? ' [BESTSELLER]' : ''}${r.featured ? ' [FEATURED]' : ''}`);
  }
  const avgSafety = rows.reduce((a, r) => a + r.safetyCount, 0) / rows.length;
  const avgTotal = rows.reduce((a, r) => a + r.totalSpecs, 0) / rows.length;
  console.log(`\nAvg safety fields filled: ${avgSafety.toFixed(1)} / ${SAFETY_FIELDS.length}`);
  console.log(`Avg total specs fields: ${avgTotal.toFixed(1)}`);
  await prisma.$disconnect();
})();
