require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
// libsql, not better-sqlite3: the cPanel host (AlmaLinux 8, glibc 2.28) has no
// C compiler and better-sqlite3's prebuilt binary needs glibc 2.29+.
// Resolve the SQLite file relative to this file, not the process CWD — under
// Passenger/cPanel the CWD isn't guaranteed to be the app root.
const _dbUrl = process.env.DATABASE_URL || `file:${path.join(__dirname, 'dev.db')}`;
const _prismaAdapter = new PrismaLibSql({ url: _dbUrl });
const prisma = new PrismaClient({ adapter: _prismaAdapter });

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security Headers ────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,   // disable CSP so inline scripts/styles work
  crossOriginEmbedderPolicy: false
}));

// ── Body Parsers ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ── Admin Authentication Middleware ─────────────────────────────────────────────
const ADMIN_TOKEN = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

const apiAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// ── Rate-limited login endpoint ─────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // max 10 attempts per IP
  message: { success: false, message: 'Too many login attempts. Try again later.' }
});

app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (username === adminUser && password === adminPass) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});


// Redirect .html requests to clean URLs
app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    let cleanPath = req.path.slice(0, -5);
    if (cleanPath === "/index") {
      cleanPath = "/";
    }
    const query = req.url.slice(req.path.length);
    return res.redirect(301, cleanPath + query);
  }
  next();
});

// Nav/footer partials + per-page injected HTML used to be re-read and
// re-processed from disk with *synchronous* fs calls on every single GET
// request (every page nav, not just the first load). Node is single-threaded,
// so that blocking I/O + regex work stalled the whole server under any
// concurrent load — the "navigating freezes the site" symptom. These files
// only change on deploy (the cPanel flow restarts the process on every git
// pull), so it's safe to build them once and cache in memory.
const NAV_PATH = path.join(__dirname, 'public', 'assets', 'partials', 'site-nav.html');
const FOOTER_PATH = path.join(__dirname, 'public', 'assets', 'partials', 'site-footer.html');

function nestedizePaths(html) {
  return html
    .replace(/src="assets\//g, 'src="../assets/')
    .replace(/src="\/assets\//g, 'src="../assets/')
    .replace(/href="assets\//g, 'href="../assets/')
    .replace(/href="\/assets\//g, 'href="../assets/');
}

const _chromeVariants = {};
function getChromeVariant(nested) {
  const key = nested ? 'nested' : 'top';
  if (_chromeVariants[key]) return _chromeVariants[key];
  let navHtml = fs.readFileSync(NAV_PATH, 'utf-8');
  let footerHtml = fs.readFileSync(FOOTER_PATH, 'utf-8');
  if (nested) {
    navHtml = nestedizePaths(navHtml);
    footerHtml = nestedizePaths(footerHtml);
  }
  _chromeVariants[key] = { navHtml, footerHtml };
  return _chromeVariants[key];
}

// Inject the shared site-nav / site-footer partials into a page's HTML string.
// Used both by the static-page middleware below and by the dynamic /news/:slug route.
function injectChrome(html, pathname) {
  try {
    const isNested = pathname.startsWith('/form/') || pathname.startsWith('/admin/');
    const { navHtml, footerHtml } = getChromeVariant(isNested);

    // Inject navbar right after <body>
    const bodyTag = '<body>';
    const bodyIndex = html.indexOf(bodyTag);
    if (bodyIndex !== -1) {
      const insertPos = bodyIndex + bodyTag.length;
      html = html.slice(0, insertPos) + '\n' + navHtml + html.slice(insertPos);
    }

    // Inject footer right before </body>
    const closeBodyTag = '</body>';
    const closeBodyIndex = html.lastIndexOf(closeBodyTag);
    if (closeBodyIndex !== -1) {
      html = html.slice(0, closeBodyIndex) + '\n' + footerHtml + '\n' + html.slice(closeBodyIndex);
    }
  } catch (e) {
    console.error('[server] injectChrome error:', e);
  }
  return html;
}

// Rendered pages don't change at runtime (content lives in the DB / JSON
// data files, not these HTML shells), and the cPanel deploy flow restarts the
// process on every git pull — so it's safe to cache each page's fully
// injected HTML in memory after the first request instead of re-reading +
// re-injecting from disk (synchronously!) on every single page view.
const _pageHtmlCache = new Map();

// Middleware to inject site-nav and site-footer server-side into non-index HTML pages
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  const pathname = req.path;
  if (pathname.startsWith('/api/') || pathname.startsWith('/assets/') || pathname.includes('.')) {
    if (!pathname.endsWith('.html')) {
      return next();
    }
  }

  let target = pathname === '/' ? '/index.html' : pathname;
  if (!target.endsWith('.html')) {
    target += '.html';
  }

  const cached = _pageHtmlCache.get(target);
  if (cached !== undefined) {
    res.type('html').send(cached);
    return;
  }

  const fullPath = path.join(__dirname, 'public', target);

  // If the file exists, inject the shared nav/footer partials server-side and cache the result
  try {
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const out = injectChrome(raw, pathname);
    _pageHtmlCache.set(target, out);
    res.type('html').send(out);
    return;
  } catch (e) {
    if (e.code !== 'ENOENT') console.error('[server] injection error:', e);
  }
  next();
});

// ── Serve static assets (car images cached at the edge) ─────────────────────
app.use("/assets/images/cars", express.static(
  path.join(__dirname, "public", "assets", "images", "cars"),
  { maxAge: "365d", immutable: true }
));
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));
app.use("/images", express.static(path.join(__dirname, "backend", "uploads")));

// Missing static assets (images/css/js/fonts) must 404, not fall through to the SPA HTML page
const STATIC_ASSET_EXT = /\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|css|js|mjs|json|woff2?|ttf|eot|map)$/i;
app.use((req, res, next) => {
  if (req.method === "GET" && STATIC_ASSET_EXT.test(req.path)) {
    return res.status(404).end();
  }
  next();
});

// Convenient routes for admin
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/login.html'));
});

app.get('/dashboard', (req, res) => {
  // Legacy admin panel — superseded by /cms (single source of truth for inventory & content).
  // Kept as a redirect so old bookmarks land in the right place instead of a second,
  // out-of-sync admin surface.
  res.redirect('/cms');
});

app.get('/cms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/cms.html'));
});

// Helper
function slugify(text) {
  return String(text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Per-article SEO pages: /news/:slug and /reviews/:slug ─────────────────────
// One template (public/news-article.html), one handler. The post is looked up in
// the DB and its title/description/OG tags/JSON-LD are injected server-side so
// crawlers and social scrapers see real content before any JS runs.
const SITE_ORIGIN = 'https://www.autoviindu.com';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildArticleHead(post, urlPath) {
  const title = `${post.title} – AutoViindu`;
  const desc = (post.excerpt || String(post.content || '').replace(/\s+/g, ' ').trim().slice(0, 160)).slice(0, 200);
  const url = SITE_ORIGIN + urlPath;
  const img = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : SITE_ORIGIN + post.coverImage)
    : SITE_ORIGIN + '/assets/images/og/home.jpg';
  const published = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString();
  const modified = post.updatedAt ? new Date(post.updatedAt).toISOString() : published;
  const ld = {
    '@context': 'https://schema.org',
    '@type': post.kind === 'review' ? 'Review' : 'NewsArticle',
    headline: post.title,
    description: desc,
    image: [img],
    datePublished: published,
    dateModified: modified,
    author: { '@type': 'Organization', name: post.author || 'AutoViindu' },
    publisher: {
      '@type': 'Organization',
      name: 'AutoViindu',
      logo: { '@type': 'ImageObject', url: SITE_ORIGIN + '/assets/images/cars/brands/logo.png' }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };
  if (post.kind === 'review' && post.rating != null) {
    ld.reviewRating = { '@type': 'Rating', ratingValue: post.rating, bestRating: 5 };
  }
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${esc(post.title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(img)}">`,
    `<meta property="og:site_name" content="AutoViindu">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(post.title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${esc(img)}">`,
    `<meta property="article:published_time" content="${esc(published)}">`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
  ].join('\n  ');
}

async function serveArticle(req, res, kind) {
  try {
    const slug = String(req.params.slug || '');
    const post = await prisma.newsPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished || post.kind !== kind) {
      res.status(404).type('html').send(
        injectChrome(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Not found – AutoViindu</title>' +
          '<link rel="stylesheet" href="/assets/css/site-chrome.css"></head><body>' +
          '<main style="max-width:640px;margin:80px auto;padding:0 20px;text-align:center;font-family:system-ui,sans-serif">' +
          '<h1 style="font-size:28px">Story not found</h1>' +
          '<p style="color:#666">This article may have been unpublished or moved.</p>' +
          '<p><a href="/hub" style="color:#0a58ca">← Back to the News &amp; Reviews hub</a></p>' +
          '</main></body></html>',
          req.path
        )
      );
      return;
    }
    const tplPath = path.join(__dirname, 'public', 'news-article.html');
    let html = fs.readFileSync(tplPath, 'utf-8');
    html = html.replace('<!--SEO-->', buildArticleHead(post, req.path));
    res.type('html').send(injectChrome(html, req.path));
  } catch (e) {
    console.error('[server] serveArticle error:', e);
    res.status(500).send('Server error');
  }
}

app.get('/news/:slug', (req, res) => serveArticle(req, res, 'news'));
app.get('/reviews/:slug', (req, res) => serveArticle(req, res, 'review'));

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", site: "AutoViindu" });
});

// ── API: Form submissions ─────────────────────────────────────────────────────

// Map raw form identifiers → clean CMS category labels
// NOTE: `serviceType` is intentionally excluded from this lookup — several forms
// (sellyourcar.html, book-service.html) use that key for an unrelated dropdown
// value (e.g. "Authorized Service Center"), not a form/category identifier.
function normalizeFormType(data) {
  const raw = (data.formType || data.formId || data.type || data.req_type || '').toLowerCase().trim();
  if (!raw || raw === 'general' || raw === 'unknown') return 'general';

  // Maintenance / Car Repair / Service Booking
  if (['booking-form', 'maintenance', 'repair', 'book service', 'bookservice'].some(k => raw.includes(k))) return 'maintenance';
  // DOTM
  if (raw.includes('dotm')) return 'dotm';
  // Insurance / Finance
  if (['ins-form', 'fin-form', 'insurance', 'finance', 'insure'].some(k => raw.includes(k))) return 'insurance';
  // Parts & Accessories
  if (['partform', 'partsandacc', 'parts', 'accessories'].some(k => raw.includes(k))) return 'parts';
  // Report unlock (ACS accident/service check) — treat as an info request lead
  if (raw.includes('acs') || raw.includes('unlock')) return 'requestInfo';
  // Sell Your Car
  if (['sellcar', 'sell'].some(k => raw.includes(k))) return 'sellCar';
  // Test Drive Booking
  if (raw.includes('testdrive')) return 'testDrive';
  // Brochure / PDF Price Request
  if (raw.includes('brochure') || raw.includes('pdf') || raw.includes('pricerequest')) return 'brochure';
  // Used Car Inquiry
  if (raw.includes('usedcar') || raw === 'used') return 'usedCarInquiry';
  // Request Info / Car Detail Request
  if (raw.includes('requestinfo') || raw.includes('cardetail') || raw.includes('pricedetail')) return 'requestInfo';
  // Other Services (detailing, tinting, bodywork, workshop, roadside, telematics, cosmetic care)
  if (['requestform', 'otherservice', 'other', 'workshop', 'roadside', 'telematics', 'cosmetic'].some(k => raw.includes(k))) return 'otherService';

  return 'general';
}

app.post("/api/forms/submit", async (req, res) => {
  try {
    const data = req.body;
    data.id = data.id || crypto.randomUUID();
    data.timestamp = new Date().toISOString();

    const filePath = path.join(__dirname, "backend", "form-submissions.json");
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf-8");
    let submissions = [];
    try { submissions = JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) {}
    submissions.push(data);
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf-8");

    // Normalize to clean category label
    const inquiryType = normalizeFormType(data);

    const name = data.fullName || data.full_name || data.name || data.ind_full_name || data.corp_contact_name || data.corp_name
      || data['Your full name'] || data['Legal registered name'] || 'Unknown';
    const email = data.email || data.ind_email || data.corp_email || data['you@example.com'] || data['office@company.com'] || '';
    const phone = data.phone || data.mobile || data.ind_mobile || data.corp_official_number || data.corp_alt_number
      || data['+977 98XXXXXXXX'] || data['whatsapp'] || '';
    const message = data.message || data.notes || data.query || data.description || data.issue
      || data.service_description || data.item_description || '';
    const carInterest = data.carModel || data.car || data.interest
      || (data.brand && data.model ? `${data.brand} ${data.model}` : '') || '';

    // Respond right away — the submission is already persisted to disk above.
    // The DB write can finish in the background so the visitor isn't left
    // watching a spinner while libsql commits.
    res.json({ success: true, message: "Form submitted successfully" });

    prisma.lead.create({
      data: { name, email, phone, inquiryType, message, carInterest, rawData: data, status: "NEW" }
    }).catch((e) => console.error("lead.create failed:", e.message));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const dataDir = path.join(__dirname, "backend", "data");
const carsJsonPath = path.join(dataDir, "cars.json");
const usedJsonPath = path.join(dataDir, "used-cars.json");
const legacyCarsJsPath = path.join(__dirname, "public", "assets", "js", "data", "cars-db.js");
const legacyUsedJsPath = path.join(__dirname, "public", "assets", "js", "data", "used-cars-db.js");
const adminMetaPath = path.join(__dirname, "backend", "admin-meta.json");
const carsImageRoot = path.join(__dirname, "public", "assets", "images", "cars");

// Legacy JSON functions removed, now using Prisma

function toCardView(car) {
  const thumb = car.thumb || (car.images && car.images[0]) || "";
  return {
    id: car.id,
    slug: car.slug,
    brand: car.brand,
    brandSlug: car.brandSlug,
    model: car.model,
    year: car.year,
    type: car.type,
    body: car.body,
    bodyType: car.bodyType,
    tagline: car.tagline,
    badge: car.badge,
    budgetTier: car.budgetTier,
    isEV: car.isEV,
    isFeatured: car.isFeatured,
    isBestSeller: car.isBestSeller,
    rating: car.rating,
    reviews: car.reviews,
    expertScore: car.expertScore,
    baseEMI: car.baseEMI,
    thumb,
    images: thumb ? [thumb] : [],
    variants: Array.isArray(car.variants)
      ? car.variants.map((v) => ({ name: v.name, slug: v.slug, price: v.price }))
      : [],
  };
}

function sendJsonCached(req, res, payload) {
  const body = JSON.stringify(payload);
  const etag = '"' + crypto.createHash("md5").update(body).digest("hex") + '"';
  res.set("Cache-Control", "public, max-age=300");
  res.set("ETag", etag);
  if (req.headers["if-none-match"] === etag) return res.status(304).end();
  res.type("application/json").send(body);
}

function mapCarsResponse(req, cars) {
  if (req.query.view === "card") return cars.map(toCardView);
  return cars;
}

// ── Public car inventory API ──────────────────────────────────────────────────
app.get("/api/cars/used", async (req, res) => {
  try {
    const usedCars = await prisma.usedCar.findMany();
    const mapped = usedCars.map(car => {
      let priceNum = 0;
      if (car.price) {
        const matched = car.price.match(/([0-9.]+)\s*L/i);
        if (matched) {
          priceNum = parseFloat(matched[1]) * 100000;
        } else {
          priceNum = parseFloat(car.price.replace(/[^0-9.]/g, "")) || 0;
          if (priceNum < 100) priceNum = priceNum * 100000;
        }
      }
      const features = Array.isArray(car.features) ? car.features : [];
      const images = Array.isArray(car.images) ? car.images : [];
      return {
        id: car.slug,
        brand: car.brand,
        model: car.model,
        year: car.year,
        km: car.mileage || "0",
        type: car.fuelType || "Unknown",
        body: "Sedan",
        priceNum: priceNum,
        price: car.price || "Price on Request",
        variant: features[0] || "",
        transmission: car.transmission || "Manual",
        owners: car.ownerCount || 1,
        color: "Standard",
        location: car.location || "",
        rating: 4.2,
        reviews: 5,
        emiEst: Math.round(priceNum / 60) || 0,
        certified: car.condition === "Excellent" || car.condition === "Certified",
        video: "",
        img: images[0] || "",
        images: images,
        overview: `${car.brand} ${car.model} ${car.year} in excellent condition, located in ${car.location || "Nepal"}.`,
        highlights: features.slice(0, 4),
        specs: {
          "Efficiency": car.mileage ? `${car.mileage} km/l` : "N/A",
          "Drive": "FWD",
          "Engine": car.fuelType,
          "Transmission": car.transmission
        },
        tags: features
      };
    });
    sendJsonCached(req, res, mapped);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/cars", async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    sendJsonCached(req, res, mapCarsResponse(req, cars));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/cars/:slug", async (req, res) => {
  try {
    const car = await prisma.car.findUnique({ where: { slug: req.params.slug } });
    if (!car) return res.status(404).json({ error: "Car not found" });
    sendJsonCached(req, res, car);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

function readAdminMeta() {
  if (!fs.existsSync(adminMetaPath)) {
    const empty = { leadStatuses: {}, leadFlags: {}, leadNotes: {}, carAvail: {} };
    fs.writeFileSync(adminMetaPath, JSON.stringify(empty, null, 2));
    return empty;
  }
  try {
    const meta = JSON.parse(fs.readFileSync(adminMetaPath, "utf-8"));
    meta.leadNotes = meta.leadNotes || {};
    return meta;
  }
  catch { return { leadStatuses: {}, leadFlags: {}, leadNotes: {}, carAvail: {} }; }
}

function leadKey(submission, index) {
  return submission.id || String(index);
}

app.get("/api/admin/inventory", apiAuth, async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/inventory/used", apiAuth, async (req, res) => {
  try {
    const used = await prisma.usedCar.findMany();
    res.json(used);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/meta", apiAuth, (req, res) => {
  res.json(readAdminMeta());
});

app.post("/api/admin/meta", apiAuth, (req, res) => {
  try {
    fs.writeFileSync(adminMetaPath, JSON.stringify(req.body, null, 2), "utf-8");
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Site content (DB-backed) ──
const SITE_KEYS = ['settings','homepage','videos','services','charging-stations','brands','budget-tiers','news','reviews','events','blogs','curated-sections'];

async function readSiteDb(key) {
  // Special case: brands come from Brand table, settings from SiteSetting, homepage from HeroSlide
  if (key === 'brands') {
    const items = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    return { items };
  }
  if (key === 'settings') {
    const rec = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    return rec ? rec.data : null;
  }
  if (key === 'homepage') {
    const slides = await prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
    const base = await prisma.siteContent.findUnique({ where: { key: 'homepage' } });
    const extra = base ? base.data : {};
    return { heroSlides: slides, popularSearches: extra.popularSearches || [], events: extra.events || [] };
  }
  const rec = await prisma.siteContent.findUnique({ where: { key } });
  return rec ? rec.data : null;
}

async function writeSiteDb(key, data) {
  if (key === 'brands') {
    // Expect { items: [...] }
    const items = data.items || [];
    for (const b of items) {
      if (!b.slug) continue;
      await prisma.brand.upsert({
        where: { slug: b.slug },
        update: { name: b.name, fullName: b.fullName, tagline: b.tagline, country: b.country,
          founded: b.founded, enteredNepal: b.enteredNepal, nepalDealer: b.nepalDealer, dealerPhone: b.dealerPhone,
          warranty: b.warranty, serviceNetwork: b.serviceNetwork, overview: b.overview,
          color: b.color, bgColor: b.bgColor, heroImage: b.heroImage, logo: b.logo,
          strengths: b.strengths || [] },
        create: { slug: b.slug, name: b.name, fullName: b.fullName, tagline: b.tagline,
          country: b.country, founded: b.founded, enteredNepal: b.enteredNepal, nepalDealer: b.nepalDealer,
          dealerPhone: b.dealerPhone, warranty: b.warranty, serviceNetwork: b.serviceNetwork,
          overview: b.overview, color: b.color, bgColor: b.bgColor, heroImage: b.heroImage,
          logo: b.logo, strengths: b.strengths || [] }
      });
    }
    return;
  }
  if (key === 'settings') {
    await prisma.siteSetting.upsert({ where: { id: 1 }, update: { data }, create: { id: 1, data } });
    return;
  }
  if (key === 'homepage') {
    // Save slides separately
    if (data.heroSlides) {
      await prisma.heroSlide.deleteMany({});
      for (let i = 0; i < data.heroSlides.length; i++) {
        const s = data.heroSlides[i];
        await prisma.heroSlide.create({ data: {
          title: s.title || '', badge: s.badge, slug: s.slug, bg: s.bg, sub: s.sub,
          offerLabel: s.offerLabel, offerVal: s.offerVal,
          originalPrice: s.originalPrice, currentPrice: s.currentPrice,
          exteriorColorName: s.exteriorColorName, exteriorColorHex: s.exteriorColorHex,
          interiorColorName: s.interiorColorName, interiorColorHex: s.interiorColorHex,
          spec1Label: s.spec1Label, spec1Value: s.spec1Value,
          spec2Label: s.spec2Label, spec2Value: s.spec2Value,
          spec3Label: s.spec3Label, spec3Value: s.spec3Value,
          sortOrder: i, isActive: true
        } });
      }
    }
    const extra = { popularSearches: data.popularSearches || [], events: data.events || [] };
    await prisma.siteContent.upsert({ where: { key: 'homepage' }, update: { data: extra }, create: { key: 'homepage', data: extra } });
    return;
  }
  await prisma.siteContent.upsert({ where: { key }, update: { data }, create: { key, data } });
}

app.get("/api/site/:key", async (req, res) => {
  try {
    const data = await readSiteDb(req.params.key);
    if (data === null) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/site/:key", apiAuth, async (req, res) => {
  try {
    const data = await readSiteDb(req.params.key);
    if (data === null) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/site/:key", apiAuth, async (req, res) => {
  try {
    if (!SITE_KEYS.includes(req.params.key)) return res.status(400).json({ error: "Unknown key" });
    await writeSiteDb(req.params.key, req.body);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// ── Media library ──
const uploadsDir = path.join(__dirname, "backend", "uploads");

app.get("/api/admin/media", apiAuth, (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) return res.json([]);
    const files = fs.readdirSync(uploadsDir)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map((f) => {
        const stat = fs.statSync(path.join(uploadsDir, f));
        return { name: f, url: "/images/" + f, size: stat.size, modified: stat.mtime.toISOString() };
      })
      .sort((a, b) => new Date(b.modified) - new Date(a.modified));
    res.json(files);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/media/:name", apiAuth, (req, res) => {
  try {
    const safe = path.basename(req.params.name);
    const fp = path.join(uploadsDir, safe);
    if (!fs.existsSync(fp)) return res.status(404).json({ error: "Not found" });
    fs.unlinkSync(fp);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/media/upload", apiAuth, (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64 || !filename) return res.status(400).json({ error: "Missing data" });
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const ext = (filename.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const finalName = "media-" + Date.now() + "-" + Math.floor(Math.random() * 1000) + "." + ext;
    fs.writeFileSync(path.join(uploadsDir, finalName), base64Data, "base64");
    res.json({ success: true, url: "/images/" + finalName, name: finalName });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Lead management (DB-backed) ──
app.get("/api/admin/leads", apiAuth, async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(leads);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/admin/leads/:id", apiAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const lead = await prisma.lead.update({ where: { id }, data: req.body });
    res.json(lead);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/leads/:id", apiAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.lead.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/forms/responses/:idOrIndex", apiAuth, (req, res) => {
  try {
    const filePath = path.join(__dirname, "backend", "form-submissions.json");
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "No submissions" });
    let submissions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const param = req.params.idOrIndex;
    let idx = submissions.findIndex((s) => s.id === param);
    if (idx === -1) {
      const n = parseInt(param, 10);
      if (!isNaN(n) && n >= 0 && n < submissions.length) idx = n;
    }
    if (idx < 0) return res.status(400).json({ error: "Not found" });
    const removed = submissions.splice(idx, 1)[0];
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf-8");

    const meta = readAdminMeta();
    const key = leadKey(removed, idx);
    ["leadStatuses", "leadFlags", "leadNotes"].forEach((field) => {
      if (meta[field] && meta[field][key] !== undefined) delete meta[field][key];
    });
    fs.writeFileSync(adminMetaPath, JSON.stringify(meta, null, 2), "utf-8");

    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Analytics snapshot (DB-backed) ──
app.get("/api/admin/analytics", apiAuth, async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    const used = await prisma.usedCar.findMany();
    const submissions = await prisma.lead.findMany();
    const byBrand = {};
    const byFuel = {};
    const byBody = {};
    cars.forEach((c) => {
      byBrand[c.brand] = (byBrand[c.brand] || 0) + 1;
      byFuel[c.type || "Unknown"] = (byFuel[c.type || "Unknown"] || 0) + 1;
      const body = c.body || c.bodyType || "Other";
      byBody[body] = (byBody[body] || 0) + 1;
    });
    const topBrands = Object.entries(byBrand).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const last7 = submissions.filter((s) => {
      if (!s.timestamp) return false;
      return Date.now() - new Date(s.timestamp).getTime() < 7 * 864e5;
    }).length;
    res.json({
      totalNew: cars.length,
      totalUsed: used.length,
      totalEV: cars.filter((c) => c.isEV || (c.type || "").toLowerCase().includes("electric")).length,
      totalFeatured: cars.filter((c) => c.isFeatured).length,
      topBrands,
      byFuel,
      byBody,
      leadsLast7Days: last7,
      totalLeads: submissions.length,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Sitemap regeneration ──
app.post("/api/admin/publish-budget-tiers", apiAuth, (req, res) => {
  try {
    const tiers = req.body;
    if (!Array.isArray(tiers)) return res.status(400).json({ error: "Invalid data" });
    const filePath = path.join(__dirname, "public", "assets", "js", "data", "budget-config.js");
    const content = "/* AutoViindu Budget Tiers */\nwindow.BUDGET_TIERS = " + JSON.stringify(tiers, null, 2) + ";\n";
    fs.writeFileSync(filePath, content, "utf-8");
    writeSiteFile("budget-tiers", { items: tiers });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/sitemap/regenerate", apiAuth, async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    const base = "https://autoviindu.com";
    const staticPages = ["/", "/#cars", "/#electric", "/#compare", "/#used", "/#services", "/caremi.html", "/chargingstation.html", "/videos.html"];
    let urls = staticPages.map((p) => "  <url><loc>" + base + p + "</loc><changefreq>weekly</changefreq></url>");
    cars.forEach((c) => {
      if (c.slug) urls.push("  <url><loc>" + base + "/#car/" + encodeURIComponent(c.slug) + "</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>");
    });
    // News & review articles — each is a real indexable page
    const posts = await prisma.newsPost.findMany({ where: { isPublished: true } });
    posts.forEach((p) => {
      if (!p.slug) return;
      const seg = p.kind === "review" ? "/reviews/" : "/news/";
      const lastmod = (p.updatedAt || p.publishedAt || p.createdAt);
      urls.push(
        "  <url><loc>" + base + seg + encodeURIComponent(p.slug) + "</loc>" +
        (lastmod ? "<lastmod>" + new Date(lastmod).toISOString().slice(0, 10) + "</lastmod>" : "") +
        "<changefreq>weekly</changefreq><priority>0.7</priority></url>"
      );
    });
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join("\n") + "\n</urlset>\n";
    fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), xml, "utf-8");
    res.json({ success: true, urlCount: urls.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/forms/responses", apiAuth, (req, res) => {
  const filePath = path.join(__dirname, "backend", "form-submissions.json");
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(fileData));
  } catch (e) {
    res.json([]);
  }
});

app.post("/api/admin/inventory", apiAuth, async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) return res.status(400).json({ error: "Invalid data format" });
    
    // Bulk overwrite (matching legacy behavior)
    await prisma.$transaction([
      prisma.car.deleteMany({}),
      prisma.car.createMany({ data: newData.map(car => ({
        ...car,
        brandSlug: car.brandSlug || car.brand.toLowerCase(),
        year: car.year || 2024,
        type: car.type || 'Unknown',
        bodyType: car.bodyType || 'Unknown',
      })) })
    ]);
    
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/inventory/used", apiAuth, async (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) return res.status(400).json({ error: "Invalid data format" });
    
    // Bulk overwrite (matching legacy behavior)
    await prisma.$transaction([
      prisma.usedCar.deleteMany({}),
      prisma.usedCar.createMany({ data: newData.map(car => ({
        ...car,
        brand: car.brand || 'Unknown',
        model: car.model || 'Unknown',
        year: car.year || 2020,
        price: String(car.price || '0'),
        mileage: String(car.mileage || '0'),
        fuelType: car.fuelType || 'Unknown',
        transmission: car.transmission || 'Manual'
      })) })
    ]);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/upload-image", apiAuth, (req, res) => {
  try {
    const { imageBase64, filename, brandSlug, modelSlug, carSlug, category } = req.body;
    if (!imageBase64 || !filename) return res.status(400).json({ error: "Missing data" });

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const ext = (filename.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const brand = slugify(brandSlug || "misc");
    const model = slugify(modelSlug || carSlug || "general");
    const cat = slugify(category || "exterior");
    const uploadDir = path.join(carsImageRoot, brand, model, cat === "interior" ? "interior" : "exterior");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const prefix = cat === "interior" ? "interior" : "exterior";
    const finalName = prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000) + "." + ext;
    const uploadPath = path.join(uploadDir, finalName);
    fs.writeFileSync(uploadPath, base64Data, "base64");

    const publicUrl = "/assets/images/cars/" + brand + "/" + model + "/" + (cat === "interior" ? "interior/" : "exterior/") + finalName;
    res.json({ success: true, url: publicUrl, category: cat === "interior" ? "interior" : "exterior" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const teamDataPath = path.join(__dirname, "backend", "team-data.json");

app.get("/api/admin/team", apiAuth, (req, res) => {
  try {
    if (!fs.existsSync(teamDataPath)) {
      fs.writeFileSync(teamDataPath, JSON.stringify({ notices: [], todos: [] }));
    }
    const data = JSON.parse(fs.readFileSync(teamDataPath, "utf-8"));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/team", apiAuth, (req, res) => {
  try {
    fs.writeFileSync(teamDataPath, JSON.stringify(req.body, null, 2), "utf-8");
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Individual Car CRUD ───────────────────────────────────────────────────────
app.post('/api/admin/cars', apiAuth, async (req, res) => {
  try {
    const body = req.body;
    const car = await prisma.car.create({
      data: {
        slug: body.slug || slugify(body.brand + '-' + body.model + '-' + (body.year || 2024)) + '-' + Date.now(),
        brand: body.brand || 'Unknown',
        brandSlug: body.brandSlug || slugify(body.brand || 'unknown'),
        model: body.model || 'Unknown',
        year: parseInt(body.year) || 2024,
        type: body.type || 'Petrol',
        bodyType: body.bodyType || 'Sedan',
        body: body.body || null,
        badge: body.badge || null,
        budgetTier: body.budgetTier || null,
        isEV: !!body.isEV,
        isNew: body.isNew !== undefined ? !!body.isNew : true,
        isFeatured: !!body.isFeatured,
        isBestSeller: !!body.isBestSeller,
        tagline: body.tagline || null,
        rating: body.rating ? parseFloat(body.rating) : null,
        expertScore: body.expertScore ? parseFloat(body.expertScore) : null,
        baseEMI: body.baseEMI ? parseInt(body.baseEMI) : null,
        overview: body.overview || null,
        thumb: body.thumb || null,
        brochureUrl: body.brochureUrl || null,
        images: body.images || [],
        colors: body.colors || [],
        variants: body.variants || [],
        specs: body.specs || {},
        pros: body.pros || [],
        cons: body.cons || [],
        highlights: body.highlights || [],
      }
    });
    res.json(car);
    regenerateCarsDbJs().catch((e) => console.warn('[cars-db] regenerate failed:', e.message));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/cars/:id', apiAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const car = await prisma.car.update({
      where: { id },
      data: {
        ...(body.brand && { brand: body.brand }),
        ...(body.brandSlug && { brandSlug: body.brandSlug }),
        ...(body.model && { model: body.model }),
        ...(body.year && { year: parseInt(body.year) }),
        ...(body.type && { type: body.type }),
        ...(body.bodyType && { bodyType: body.bodyType }),
        ...(body.badge !== undefined && { badge: body.badge }),
        ...(body.budgetTier !== undefined && { budgetTier: body.budgetTier }),
        ...(body.isEV !== undefined && { isEV: !!body.isEV }),
        ...(body.isNew !== undefined && { isNew: !!body.isNew }),
        ...(body.isFeatured !== undefined && { isFeatured: !!body.isFeatured }),
        ...(body.isBestSeller !== undefined && { isBestSeller: !!body.isBestSeller }),
        ...(body.tagline !== undefined && { tagline: body.tagline }),
        ...(body.rating !== undefined && { rating: body.rating ? parseFloat(body.rating) : null }),
        ...(body.expertScore !== undefined && { expertScore: body.expertScore ? parseFloat(body.expertScore) : null }),
        ...(body.baseEMI !== undefined && { baseEMI: body.baseEMI ? parseInt(body.baseEMI) : null }),
        ...(body.overview !== undefined && { overview: body.overview }),
        ...(body.thumb !== undefined && { thumb: body.thumb }),
        ...(body.brochureUrl !== undefined && { brochureUrl: body.brochureUrl || null }),
        ...(body.images && { images: body.images }),
        ...(body.colors && { colors: body.colors }),
        ...(body.variants && { variants: body.variants }),
        ...(body.specs !== undefined && { specs: body.specs }),
        ...(body.pros !== undefined && { pros: body.pros }),
        ...(body.cons !== undefined && { cons: body.cons }),
        ...(body.highlights !== undefined && { highlights: body.highlights }),
      }
    });
    res.json(car);
    regenerateCarsDbJs().catch((e) => console.warn('[cars-db] regenerate failed:', e.message));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/cars/:id', apiAuth, async (req, res) => {
  try {
    await prisma.car.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
    regenerateCarsDbJs().catch((e) => console.warn('[cars-db] regenerate failed:', e.message));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Individual Used Car CRUD ──────────────────────────────────────────────────
app.post('/api/admin/used-cars', apiAuth, async (req, res) => {
  try {
    const body = req.body;
    const car = await prisma.usedCar.create({
      data: {
        slug: body.slug || slugify(body.brand + '-' + body.model + '-' + (body.year || 2020)) + '-' + Date.now(),
        brand: body.brand || 'Unknown',
        model: body.model || 'Unknown',
        year: parseInt(body.year) || 2020,
        price: String(body.price || '0'),
        mileage: body.mileage ? String(body.mileage) : null,
        fuelType: body.fuelType || 'Petrol',
        transmission: body.transmission || 'Manual',
        condition: body.condition || null,
        location: body.location || null,
        ownerCount: body.ownerCount ? parseInt(body.ownerCount) : null,
        images: body.images || [],
        features: body.features || [],
      }
    });
    res.json(car);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/used-cars/:id', apiAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const car = await prisma.usedCar.update({
      where: { id },
      data: {
        ...(body.brand && { brand: body.brand }),
        ...(body.model && { model: body.model }),
        ...(body.year && { year: parseInt(body.year) }),
        ...(body.price !== undefined && { price: String(body.price) }),
        ...(body.mileage !== undefined && { mileage: body.mileage ? String(body.mileage) : null }),
        ...(body.fuelType && { fuelType: body.fuelType }),
        ...(body.transmission && { transmission: body.transmission }),
        ...(body.condition !== undefined && { condition: body.condition }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.images && { images: body.images }),
        ...(body.features && { features: body.features }),
      }
    });
    res.json(car);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/used-cars/:id', apiAuth, async (req, res) => {
  try {
    await prisma.usedCar.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Blog CRUD ─────────────────────────────────────────────────────────────────
app.get('/api/admin/blogs', apiAuth, async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(blogs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/blogs', apiAuth, async (req, res) => {
  try {
    const body = req.body;
    const blog = await prisma.blogPost.create({
      data: {
        slug: body.slug || slugify(body.title || 'post') + '-' + Date.now(),
        title: body.title || 'Untitled',
        excerpt: body.excerpt || null,
        content: body.content || '',
        category: body.category || 'guide',
        author: body.author || null,
        coverImage: body.coverImage || null,
        tags: body.tags || [],
        isPublished: !!body.isPublished,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      }
    });
    res.json(blog);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/blogs/:id', apiAuth, async (req, res) => {
  try {
    const body = req.body;
    const blog = await prisma.blogPost.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.category && { category: body.category }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.tags && { tags: body.tags }),
        ...(body.isPublished !== undefined && { isPublished: !!body.isPublished }),
        ...(body.publishedAt !== undefined && { publishedAt: body.publishedAt ? new Date(body.publishedAt) : null }),
      }
    });
    res.json(blog);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/blogs/:id', apiAuth, async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public blog API
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' } });
    res.json(blogs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── News + Reviews CRUD (one table, `kind` = "news" | "review") ───────────────
app.get('/api/admin/news', apiAuth, async (req, res) => {
  try {
    const where = {};
    if (req.query.kind) where.kind = String(req.query.kind);
    const news = await prisma.newsPost.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(news);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Ensure a slug is unique, appending -2, -3, … if needed (ignoring one id).
async function uniqueNewsSlug(base, ignoreId) {
  let slug = slugify(base) || 'post';
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const hit = await prisma.newsPost.findUnique({ where: { slug } });
    if (!hit || hit.id === ignoreId) return slug;
    n += 1;
    slug = `${slugify(base) || 'post'}-${n}`;
  }
}

app.post('/api/admin/news', apiAuth, async (req, res) => {
  try {
    const body = req.body;
    const slug = await uniqueNewsSlug(body.slug || body.title || 'news');
    const publishing = !!body.isPublished;
    const post = await prisma.newsPost.create({
      data: {
        slug,
        title: body.title || 'Untitled',
        excerpt: body.excerpt || null,
        content: body.content || '',
        category: body.category || 'launch',
        kind: body.kind === 'review' ? 'review' : 'news',
        author: body.author || null,
        coverImage: body.coverImage || null,
        photos: Array.isArray(body.photos) ? body.photos : [],
        readTime: body.readTime || null,
        displayDate: body.displayDate || null,
        rating: body.rating != null && body.rating !== '' ? parseFloat(body.rating) : null,
        isPublished: publishing,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : (publishing ? new Date() : null),
      }
    });
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/news/:id', apiAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const body = req.body;
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const data = {
      ...(body.title && { title: body.title }),
      ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.category && { category: body.category }),
      ...(body.kind && { kind: body.kind === 'review' ? 'review' : 'news' }),
      ...(body.author !== undefined && { author: body.author }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      ...(body.photos !== undefined && { photos: Array.isArray(body.photos) ? body.photos : [] }),
      ...(body.readTime !== undefined && { readTime: body.readTime || null }),
      ...(body.displayDate !== undefined && { displayDate: body.displayDate || null }),
      ...(body.rating !== undefined && { rating: body.rating != null && body.rating !== '' ? parseFloat(body.rating) : null }),
    };
    if (body.slug !== undefined && body.slug && slugify(body.slug) !== existing.slug) {
      data.slug = await uniqueNewsSlug(body.slug, id);
    }
    if (body.isPublished !== undefined) {
      data.isPublished = !!body.isPublished;
      if (data.isPublished && !existing.publishedAt && body.publishedAt === undefined) {
        data.publishedAt = new Date();
      }
    }
    if (body.publishedAt !== undefined) {
      data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    }

    const post = await prisma.newsPost.update({ where: { id }, data });
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/news/:id', apiAuth, async (req, res) => {
  try {
    await prisma.newsPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public news/reviews API — list (optional ?kind=news|review)
app.get('/api/news', async (req, res) => {
  try {
    const where = { isPublished: true };
    if (req.query.kind) where.kind = String(req.query.kind);
    const news = await prisma.newsPost.findMany({ where, orderBy: { publishedAt: 'desc' } });
    res.json(news);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public single post by slug (published only)
app.get('/api/news/:slug', async (req, res) => {
  try {
    const post = await prisma.newsPost.findUnique({ where: { slug: String(req.params.slug) } });
    if (!post || !post.isPublished) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Catch-all: SPA fallback (serves index.html for any unknown route) ─────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Boot-time DB upkeep ──────────────────────────────────────────────────────
// Production (cPanel) has its own SQLite file and the deploy has no migration
// step, so the server brings the schema + data up to date itself on startup.

async function ensureNewsSchema() {
  // Add the columns introduced for the News/Reviews hub. SQLite throws
  // "duplicate column name" on re-run — that's expected, so we swallow it.
  const stmts = [
    `ALTER TABLE "NewsPost" ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'news'`,
    `ALTER TABLE "NewsPost" ADD COLUMN "photos" JSONB`,
    `ALTER TABLE "NewsPost" ADD COLUMN "readTime" TEXT`,
    `ALTER TABLE "NewsPost" ADD COLUMN "displayDate" TEXT`,
    `ALTER TABLE "NewsPost" ADD COLUMN "rating" REAL`,
    // Official manufacturer brochure PDF link per car (News/Reviews-era addition).
    `ALTER TABLE "Car" ADD COLUMN "brochureUrl" TEXT`,
    // Year a brand's cars first went on sale in Nepal (Brand profile page).
    `ALTER TABLE "Brand" ADD COLUMN "enteredNepal" INTEGER`,
  ];
  for (const sql of stmts) {
    try { await prisma.$executeRawUnsafe(sql); }
    catch (e) { if (!/duplicate column/i.test(e.message)) console.warn('[schema]', e.message); }
  }
}

// Seed official brochure links from scripts/brochure-urls.json. Production's
// dev.db is server-owned and never receives our local data via git, so the
// server fills in any car that still has no brochureUrl on boot. Admin edits
// win — an existing value is left alone unless BROCHURE_RESYNC=1 forces it.
async function syncBrochureUrls() {
  const mapPath = path.join(__dirname, 'scripts', 'brochure-urls.json');
  if (!fs.existsSync(mapPath)) return;
  let map;
  try { map = JSON.parse(fs.readFileSync(mapPath, 'utf-8')); }
  catch (e) { console.warn('[brochure] bad json:', e.message); return; }

  const force = process.env.BROCHURE_RESYNC === '1';
  const entries = Object.entries(map).filter(([k, v]) => !k.startsWith('_') && /^https?:\/\//i.test(v));
  const cars = await prisma.car.findMany({ select: { id: true, slug: true, brochureUrl: true } });
  const bySlug = new Map(cars.map((c) => [c.slug, c]));

  let set = 0;
  for (const [slug, url] of entries) {
    const car = bySlug.get(slug);
    if (!car) continue;
    if (car.brochureUrl === url) continue;
    if (car.brochureUrl && !force) continue; // keep manual/admin value
    try { await prisma.car.update({ where: { id: car.id }, data: { brochureUrl: url } }); set++; }
    catch (e) { console.warn('[brochure] update failed for', slug, e.message); }
  }
  if (set) console.log(`[brochure] linked ${set} car${set === 1 ? '' : 's'} to official brochure pages`);
}

// Seed researched "entered Nepal" year / Nepal dealer from scripts/brand-nepal-data.json.
// Same pattern as syncBrochureUrls: production's dev.db is server-owned, so the
// server fills in any brand still missing this data on boot. Admin edits win —
// an existing value is left alone.
async function syncBrandNepalData() {
  const mapPath = path.join(__dirname, 'scripts', 'brand-nepal-data.json');
  if (!fs.existsSync(mapPath)) return;
  let map;
  try { map = JSON.parse(fs.readFileSync(mapPath, 'utf-8')); }
  catch (e) { console.warn('[brand-nepal] bad json:', e.message); return; }

  const brands = await prisma.brand.findMany({ select: { id: true, slug: true, enteredNepal: true, nepalDealer: true } });
  const bySlug = new Map(brands.map((b) => [b.slug, b]));

  let set = 0;
  for (const [slug, info] of Object.entries(map)) {
    if (slug.startsWith('_')) continue;
    const brand = bySlug.get(slug);
    if (!brand) continue;
    const data = {};
    if (info.enteredNepal && !brand.enteredNepal) data.enteredNepal = info.enteredNepal;
    if (info.nepalDealer && !brand.nepalDealer) data.nepalDealer = info.nepalDealer;
    if (!Object.keys(data).length) continue;
    try { await prisma.brand.update({ where: { id: brand.id }, data }); set++; }
    catch (e) { console.warn('[brand-nepal] update failed for', slug, e.message); }
  }
  if (set) console.log(`[brand-nepal] filled Nepal market data for ${set} brand${set === 1 ? '' : 's'}`);
}

// The homepage (index.html) loads car data from this static snapshot instead
// of hitting /api/cars, so it goes stale — and its thumbs break — whenever a
// car is added/edited/deleted in the DB without this file being rewritten.
// Regenerate it straight from dev.db (the source of truth) so thumbs always
// match what's actually on disk.
const CARS_DB_FIELDS = {
  id: true, slug: true, brand: true, brandSlug: true, model: true, year: true,
  type: true, bodyType: true, body: true, badge: true, budgetTier: true,
  isEV: true, isNew: true, isFeatured: true, isBestSeller: true, tagline: true,
  rating: true, reviews: true, expertScore: true, baseEMI: true, overview: true,
  images: true, colors: true, variants: true, specs: true, pros: true, cons: true,
  highlights: true, thumb: true,
};

async function regenerateCarsDbJs() {
  const cars = await prisma.car.findMany({ select: CARS_DB_FIELDS, orderBy: { id: 'asc' } });
  const body = `/* AutoViindu Auto-Generated Cars DB — regenerated from dev.db, do not hand-edit */\nwindow.CARS_DB = ${JSON.stringify(cars, null, 2)};\n`;
  fs.writeFileSync(legacyCarsJsPath, body, 'utf-8');
  return cars.length;
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

async function migrateLegacyNewsOnce() {
  const flagRow = await prisma.siteContent.findUnique({ where: { key: '_migrations' } });
  const flags = (flagRow && flagRow.data) || {};
  if (flags.newsToDb) return;

  let migrated = 0;
  for (const [key, kind] of [['news', 'news'], ['reviews', 'review']]) {
    const rec = await prisma.siteContent.findUnique({ where: { key } });
    const items = (rec && rec.data && rec.data.items) || [];
    for (const item of items) {
      const post = legacyItemToPost(item, kind);
      try {
        await prisma.newsPost.upsert({
          where: { slug: post.slug },
          update: {},               // don't clobber anything already edited in the CMS
          create: post,
        });
        migrated += 1;
      } catch (e) { console.warn('[migrate] skip', post.slug, e.message); }
    }
  }
  await prisma.siteContent.upsert({
    where: { key: '_migrations' },
    update: { data: { ...flags, newsToDb: true } },
    create: { key: '_migrations', data: { newsToDb: true } },
  });
  console.log(`[migrate] news/reviews → NewsPost table (${migrated} rows processed)`);
}

async function seedCuratedSections() {
  const existing = await prisma.siteContent.findUnique({ where: { key: 'curated-sections' } });
  if (existing) return;
  let defaults;
  try {
    defaults = JSON.parse(fs.readFileSync(path.join(__dirname, 'scripts', 'curated-defaults.json'), 'utf-8'));
  } catch (e) {
    console.warn('[curated] defaults file missing/invalid, skipping seed:', e.message);
    return;
  }
  await prisma.siteContent.create({ data: { key: 'curated-sections', data: defaults } });
  console.log('[curated] seeded curated-sections from scripts/curated-defaults.json');
}

(async () => {
  try {
    await ensureNewsSchema();
    await migrateLegacyNewsOnce();
    await seedCuratedSections();
    await syncBrochureUrls();
    await syncBrandNepalData();
    const n = await regenerateCarsDbJs();
    console.log(`[cars-db] regenerated cars-db.js from dev.db (${n} cars)`);
  } catch (e) {
    console.error('[boot] DB upkeep failed:', e);
  }
  app.listen(PORT, () => {
    console.log(`✅ AutoViindu server running → http://localhost:${PORT}`);
  });
})();