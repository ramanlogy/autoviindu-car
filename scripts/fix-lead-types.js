// scripts/fix-lead-types.js — run once to normalize all lead inquiryTypes
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

function normalizeFormType(data) {
  const raw = (data.formType || data.serviceType || data.formId || data.type || data.req_type || '').toLowerCase().trim();
  if (!raw || raw === 'general') return 'general';
  if (['booking-form', 'maintenance', 'repair', 'book service', 'bookservice'].some(k => raw.includes(k))) return 'maintenance';
  if (['dotm', 'dotm-form', 'dotmform', 'individual', 'corporate'].some(k => raw === k || raw.includes('dotm'))) return 'dotm';
  if (['ins-form', 'fin-form', 'insurance', 'finance', 'insure'].some(k => raw.includes(k))) return 'insurance';
  if (['partform', 'partsandacc', 'parts', 'accessories'].some(k => raw.includes(k))) return 'parts';
  if (['requestform', 'otherservice', 'other'].some(k => raw.includes(k))) return 'otherService';
  if (['sellcar', 'sell'].some(k => raw.includes(k))) return 'sellCar';
  if (raw.includes('testdrive')) return 'testDrive';
  if (raw.includes('brochure') || raw.includes('pdf') || raw.includes('pricerequest')) return 'brochure';
  if (raw.includes('usedcar') || raw === 'used') return 'usedCarInquiry';
  if (raw.includes('requestinfo') || raw.includes('cardetail') || raw.includes('pricedetail')) return 'requestInfo';
  return raw || 'general';
}

async function main() {
  const leads = await prisma.lead.findMany();
  console.log(`Found ${leads.length} leads to check...`);
  let fixed = 0;
  for (const lead of leads) {
    const rawData = lead.rawData || {};
    const normalized = normalizeFormType(rawData);
    if (normalized !== lead.inquiryType) {
      await prisma.lead.update({ where: { id: lead.id }, data: { inquiryType: normalized } });
      console.log(`  [${lead.id}] "${lead.inquiryType}" -> "${normalized}" (${lead.name})`);
      fixed++;
    }
  }
  console.log(`Done! Fixed ${fixed} / ${leads.length} records.`);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
