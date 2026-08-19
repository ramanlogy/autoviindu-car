require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const _prismaAdapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
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

  const fullPath = path.join(__dirname, 'public', target);

  // If file exists, inject the shared nav/footer partials server-side
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    try {
      let html = fs.readFileSync(fullPath, 'utf-8');
      const navPath = path.join(__dirname, 'public', 'assets', 'partials', 'site-nav.html');
      const footerPath = path.join(__dirname, 'public', 'assets', 'partials', 'site-footer.html');

      if (fs.existsSync(navPath) && fs.existsSync(footerPath)) {
        let navHtml = fs.readFileSync(navPath, 'utf-8');
        let footerHtml = fs.readFileSync(footerPath, 'utf-8');

        const isNested = pathname.startsWith('/form/') || pathname.startsWith('/admin/');
        if (isNested) {
          // Fix relative asset paths in nav and footer templates for nested pages
          navHtml = navHtml
            .replace(/src="assets\//g, 'src="../assets/')
            .replace(/src="\/assets\//g, 'src="../assets/')
            .replace(/href="assets\//g, 'href="../assets/')
            .replace(/href="\/assets\//g, 'href="../assets/');
          footerHtml = footerHtml
            .replace(/src="assets\//g, 'src="../assets/')
            .replace(/src="\/assets\//g, 'src="../assets/')
            .replace(/href="assets\//g, 'href="../assets/')
            .replace(/href="\/assets\//g, 'href="../assets/');
        }

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
      }

      res.type('html').send(html);
      return;
    } catch (e) {
      console.error('[server] injection error:', e);
    }
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

// Convenient routes for admin
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/dashboard.html'));
});

app.get('/cms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/cms.html'));
});

// Helper
function slugify(text) {
  return String(text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", site: "AutoViindu" });
});

// ── API: Form submissions ─────────────────────────────────────────────────────

// Map raw form identifiers → clean CMS category labels
function normalizeFormType(data) {
  const raw = (data.formType || data.serviceType || data.formId || data.type || data.req_type || '').toLowerCase().trim();
  if (!raw || raw === 'general') return 'general';

  // Maintenance / Car Repair / Service Booking
  if (['booking-form', 'maintenance', 'repair', 'book service', 'bookservice'].some(k => raw.includes(k))) return 'maintenance';
  // DOTM
  if (['dotm', 'dotm-form', 'dotmform', 'individual', 'corporate'].some(k => raw === k || raw.includes('dotm'))) return 'dotm';
  // Insurance / Finance
  if (['ins-form', 'fin-form', 'insurance', 'finance', 'insure'].some(k => raw.includes(k))) return 'insurance';
  // Parts & Accessories
  if (['partform', 'partsandacc', 'parts', 'accessories'].some(k => raw.includes(k))) return 'parts';
  // Other Services (detailing, tinting, bodywork)
  if (['requestform', 'otherservice', 'other'].some(k => raw.includes(k))) return 'otherService';
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

  return raw || 'general';
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

    const name = data.fullName || data.full_name || data.name || data['Your full name'] || data['Legal registered name'] || 'Unknown';
    const email = data.email || data['you@example.com'] || data['office@company.com'] || '';
    const phone = data.phone || data.mobile || data['+977 98XXXXXXXX'] || data['whatsapp'] || '';
    const message = data.message || data.notes || data.query || data.description || data.issue || '';
    const carInterest = data.carModel || data.car || data.interest || (data.brand && data.model ? `${data.brand} ${data.model}` : '') || '';

    await prisma.lead.create({
      data: { name, email, phone, inquiryType, message, carInterest, rawData: data, status: "NEW" }
    });

    res.json({ success: true, message: "Form submitted successfully" });
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
const SITE_KEYS = ['settings','homepage','videos','services','charging-stations','brands','budget-tiers','news','reviews','events','blogs'];

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
          founded: b.founded, nepalDealer: b.nepalDealer, dealerPhone: b.dealerPhone,
          warranty: b.warranty, serviceNetwork: b.serviceNetwork, overview: b.overview,
          color: b.color, bgColor: b.bgColor, heroImage: b.heroImage, logo: b.logo,
          strengths: b.strengths || [] },
        create: { slug: b.slug, name: b.name, fullName: b.fullName, tagline: b.tagline,
          country: b.country, founded: b.founded, nepalDealer: b.nepalDealer,
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
        await prisma.heroSlide.create({ data: { title: s.title || '', badge: s.badge, slug: s.slug, bg: s.bg, sub: s.sub, offerLabel: s.offerLabel, offerVal: s.offerVal, sortOrder: i, isActive: true } });
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
        isFeatured: !!body.isFeatured,
        isBestSeller: !!body.isBestSeller,
        tagline: body.tagline || null,
        rating: body.rating ? parseFloat(body.rating) : null,
        expertScore: body.expertScore ? parseFloat(body.expertScore) : null,
        baseEMI: body.baseEMI ? parseInt(body.baseEMI) : null,
        overview: body.overview || null,
        images: body.images || [],
        colors: body.colors || [],
        variants: body.variants || [],
      }
    });
    res.json(car);
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
        ...(body.isFeatured !== undefined && { isFeatured: !!body.isFeatured }),
        ...(body.isBestSeller !== undefined && { isBestSeller: !!body.isBestSeller }),
        ...(body.tagline !== undefined && { tagline: body.tagline }),
        ...(body.rating !== undefined && { rating: body.rating ? parseFloat(body.rating) : null }),
        ...(body.expertScore !== undefined && { expertScore: body.expertScore ? parseFloat(body.expertScore) : null }),
        ...(body.baseEMI !== undefined && { baseEMI: body.baseEMI ? parseInt(body.baseEMI) : null }),
        ...(body.overview !== undefined && { overview: body.overview }),
        ...(body.images && { images: body.images }),
        ...(body.colors && { colors: body.colors }),
        ...(body.variants && { variants: body.variants }),
      }
    });
    res.json(car);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/cars/:id', apiAuth, async (req, res) => {
  try {
    await prisma.car.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
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

// ── News CRUD ─────────────────────────────────────────────────────────────────
app.get('/api/admin/news', apiAuth, async (req, res) => {
  try {
    const news = await prisma.newsPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(news);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/news', apiAuth, async (req, res) => {
  try {
    const body = req.body;
    const post = await prisma.newsPost.create({
      data: {
        slug: body.slug || slugify(body.title || 'news') + '-' + Date.now(),
        title: body.title || 'Untitled',
        excerpt: body.excerpt || null,
        content: body.content || '',
        category: body.category || 'launch',
        author: body.author || null,
        coverImage: body.coverImage || null,
        isPublished: !!body.isPublished,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      }
    });
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/news/:id', apiAuth, async (req, res) => {
  try {
    const body = req.body;
    const post = await prisma.newsPost.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.category && { category: body.category }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.isPublished !== undefined && { isPublished: !!body.isPublished }),
        ...(body.publishedAt !== undefined && { publishedAt: body.publishedAt ? new Date(body.publishedAt) : null }),
      }
    });
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/news/:id', apiAuth, async (req, res) => {
  try {
    await prisma.newsPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public news API
app.get('/api/news', async (req, res) => {
  try {
    const news = await prisma.newsPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' } });
    res.json(news);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Catch-all: SPA fallback (serves index.html for any unknown route) ─────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`✅ AutoViindu server running → http://localhost:${PORT}`);
});