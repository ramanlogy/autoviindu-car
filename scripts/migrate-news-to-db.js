/**
 * One-time migration: move the legacy `news` and `reviews` blobs from the
 * SiteContent table into the NewsPost table (kind = "news" | "review").
 *
 * Safe to run more than once — it upserts on slug and never overwrites a row
 * that already exists (so anything edited in the CMS afterwards is preserved).
 * The original SiteContent rows are left untouched as a backup.
 *
 *   node scripts/migrate-news-to-db.js
 *
 * The server also runs this automatically on boot (see migrateLegacyNewsOnce in
 * server.js); this script is here for manual re-runs / verification.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

function slugify(text) {
  return String(text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function legacyItemToPost(item, kind) {
  const idTail = String(item.id || '').replace(/[^a-z0-9]/gi, '').slice(-6);
  const baseSlug = slugify(item.title || kind) || kind;
  const bodyArr = Array.isArray(item.body) ? item.body : (item.body ? [String(item.body)] : []);
  const published = item.published !== false;
  return {
    slug: idTail ? `${baseSlug}-${idTail}` : baseSlug,
    title: item.title || 'Untitled',
    excerpt: item.excerpt || null,
    content: bodyArr.join('\n\n'),
    category: item.catKey || item.cat || (kind === 'review' ? 'suv' : 'launch'),
    kind,
    coverImage: item.img || null,
    photos: Array.isArray(item.photos) ? item.photos : [],
    readTime: item.read || null,
    displayDate: item.date || null,
    rating: item.rating != null ? Number(item.rating) : null,
    isPublished: published,
    publishedAt: published ? new Date() : null,
  };
}

(async () => {
  let created = 0, skipped = 0;
  for (const [key, kind] of [['news', 'news'], ['reviews', 'review']]) {
    const rec = await prisma.siteContent.findUnique({ where: { key } });
    const items = (rec && rec.data && rec.data.items) || [];
    console.log(`\n${key}: ${items.length} legacy item(s)`);
    for (const item of items) {
      const post = legacyItemToPost(item, kind);
      const existing = await prisma.newsPost.findUnique({ where: { slug: post.slug } });
      if (existing) { skipped++; console.log(`  = ${post.slug} (already in DB)`); continue; }
      await prisma.newsPost.create({ data: post });
      created++;
      console.log(`  + ${post.slug}`);
    }
  }
  const flagRow = await prisma.siteContent.findUnique({ where: { key: '_migrations' } });
  const flags = (flagRow && flagRow.data) || {};
  await prisma.siteContent.upsert({
    where: { key: '_migrations' },
    update: { data: { ...flags, newsToDb: true } },
    create: { key: '_migrations', data: { newsToDb: true } },
  });
  console.log(`\nDone. ${created} created, ${skipped} skipped.`);
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
