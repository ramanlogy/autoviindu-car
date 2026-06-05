const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// ── Admin Authentication Middleware ─────────────────────────────────────────────
const ADMIN_TOKEN = "autoviindu_super_secret_token_123";

const apiAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});


// ── Serve all frontend static files ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'backend/uploads')));

// Convenient routes for admin
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/dashboard.html'));
});

// ── API: Get all new cars ─────────────────────────────────────────────────────
// The cars data lives in cars-db.js on the frontend.
// This endpoint is a lightweight health-check / meta endpoint.
// Your actual car data is loaded from cars-db.js on the client side.
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", site: "AutoViindu" });
});

// ── API: Form submissions ─────────────────────────────────────────────────────
app.post("/api/forms/submit", (req, res) => {
  const data = req.body;
  data.timestamp = new Date().toISOString();
  
  const filePath = path.join(__dirname, "backend", "form-submissions.json");
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
  
  let submissions = [];
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    submissions = JSON.parse(fileData);
  } catch(e) {}
  
  submissions.push(data);
  fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf-8");
  
  res.json({ success: true, message: "Form submitted successfully" });
});

const carsDbPath = path.join(__dirname, "public", "assets", "js", "data", "cars-db.js");
const usedDbPath = path.join(__dirname, "public", "assets", "js", "data", "used-cars-db.js");
const adminMetaPath = path.join(__dirname, "backend", "admin-meta.json");

function readJsArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1) return [];
  const slice = raw.slice(start, end + 1);
  try { return JSON.parse(slice); }
  catch { return Function("return " + slice)(); }
}

function writeCarsDb(filePath, globalName, data) {
  const header = globalName === "CARS_DB"
    ? "/* AutoViindu Auto-Generated Cars DB */\n"
    : "/* AutoViindu Auto-Generated Used Cars DB */\n";
  fs.writeFileSync(filePath, header + "window." + globalName + " = " + JSON.stringify(data, null, 2) + ";\n", "utf-8");
}

function readAdminMeta() {
  if (!fs.existsSync(adminMetaPath)) {
    const empty = { leadStatuses: {}, leadFlags: {}, carAvail: {} };
    fs.writeFileSync(adminMetaPath, JSON.stringify(empty, null, 2));
    return empty;
  }
  try { return JSON.parse(fs.readFileSync(adminMetaPath, "utf-8")); }
  catch { return { leadStatuses: {}, leadFlags: {}, carAvail: {} }; }
}

app.get("/api/admin/inventory", apiAuth, (req, res) => {
  try { res.json(readJsArray(carsDbPath)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/inventory/used", apiAuth, (req, res) => {
  try { res.json(readJsArray(usedDbPath)); }
  catch (e) { res.status(500).json({ error: e.message }); }
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

// ── Site content (settings, homepage, videos, services, etc.) ──
const siteContentDir = path.join(__dirname, "backend", "site-content");
const SITE_KEYS = {
  settings: "settings.json",
  homepage: "homepage.json",
  videos: "videos.json",
  services: "services.json",
  "charging-stations": "charging-stations.json",
  brands: "brands.json",
  "budget-tiers": "budget-tiers.json",
};

function ensureSiteContentDir() {
  if (!fs.existsSync(siteContentDir)) fs.mkdirSync(siteContentDir, { recursive: true });
}

function readSiteFile(key) {
  ensureSiteContentDir();
  const file = SITE_KEYS[key];
  if (!file) return null;
  const fp = path.join(siteContentDir, file);
  if (!fs.existsSync(fp)) return null;
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); }
  catch { return null; }
}

function writeSiteFile(key, data) {
  ensureSiteContentDir();
  const file = SITE_KEYS[key];
  if (!file) throw new Error("Unknown content key");
  fs.writeFileSync(path.join(siteContentDir, file), JSON.stringify(data, null, 2), "utf-8");
}

function importChargingSeedIfEmpty() {
  const data = readSiteFile("charging-stations");
  if (data && data.stations && data.stations.length) return;
  try {
    const html = fs.readFileSync(path.join(__dirname, "public", "chargingstation.html"), "utf-8");
    const match = html.match(/const STATIONS = (\[[\s\S]*?\n\]);/);
    if (!match) return;
    const stations = Function("return " + match[1])();
    if (stations.length) writeSiteFile("charging-stations", { stations });
  } catch (_) {}
}

function seedSiteContentIfMissing() {
  ensureSiteContentDir();
  const defaults = {
    settings: {
      businessName: "AutoViindu",
      phone: "+977-9701076240",
      email: "info@autoviindu.com",
      address: "Nayabazar, Kathmandu, Nepal",
      hours: "Mon–Sat · 9am–6pm",
      whatsapp: "+9779701076240",
      tagline: "Nepal's trusted car marketplace",
      social: { facebook: "", instagram: "", youtube: "https://youtube.com/@autoviindu" },
      emi: { defaultRate: 9.5, defaultTenure: 60 },
      seo: {
        defaultTitle: "AutoViindu — Buy & Compare Cars in Nepal",
        defaultDescription: "Browse new and used cars, compare specs, calculate EMI, and book services at AutoViindu Kathmandu.",
      },
    },
    homepage: {
      heroSlides: [
        { bg: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=1400&h=700&fit=crop", badge: "Electric", title: "Hyundai IONIQ 5", sub: "481 km range, ultra-fast charging, built for Nepal roads.", offerLabel: "EV Offer", offerVal: "Zero road tax + home charger", slug: "hyundai-ioniq-5" },
        { bg: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1400&h=700&fit=crop", badge: "Best Seller", title: "Hyundai Creta", sub: "Nepal's favourite mid-size SUV with ADAS and dual screens.", offerLabel: "Festival Offer", offerVal: "Rs. 2L cashback + accessories", slug: "hyundai-creta" },
      ],
      popularSearches: ["MG Hector", "IONIQ 5", "Toyota Fortuner", "Kia Seltos", "BYD Atto 3", "Swift 2024", "Electric Cars"],
      events: [],
    },
    videos: {
      items: [
        { id: "dQw4w9WgXcQ", title: "MG Hector 2024 Full Review", sub: "Is it worth Rs. 26L in Nepal?", brand: "MG", duration: "14:32", views: "48K", category: "Reviews", thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=360&fit=crop", featured: true },
        { id: "dQw4w9WgXcQ", title: "Hyundai IONIQ 5 — Range Test Nepal", sub: "Real-world EV testing in Kathmandu", brand: "Hyundai", duration: "22:10", views: "32K", category: "EV Special", thumb: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=640&h=360&fit=crop", featured: false },
      ],
    },
    services: {
      categories: [
        { id: "cosmetic", name: "Cosmetic Car Care", color: "#1a6b2a", bg: "#eef7f0", icon: "✨", items: ["Basic Washing & Cleaning", "Ceramic Coating (9H)", "Paint Protection Film (PPF)", "Full Body Detailing"] },
        { id: "workshop", name: "Workshop Services", color: "#b8900e", bg: "#fdf6e0", icon: "🔧", items: ["Hybrid / EV Electrical Work", "Transmission Repair", "Pre-purchase Inspection", "Brake Inspection & Service"] },
        { id: "telematics", name: "Telematics & GPS", color: "#1a4db8", bg: "#eef3fc", icon: "📡", items: ["GPS Tracking Units", "Dashcam & Security Kits", "Fleet Management Solutions"] },
        { id: "roadside", name: "Roadside Assistance", color: "#d63031", bg: "#fff0ef", icon: "🚨", items: ["Emergency Towing", "Battery Jumpstart", "24/7 SOS Support"] },
      ],
    },
    "charging-stations": { stations: [] },
    brands: { items: [] },
    "budget-tiers": { items: [] },
  };
  Object.keys(defaults).forEach((key) => {
    const fp = path.join(siteContentDir, SITE_KEYS[key]);
    if (!fs.existsSync(fp)) writeSiteFile(key, defaults[key]);
  });
  importChargingSeedIfEmpty();
  // Seed brands/budget from JS if empty
  const brands = readSiteFile("brands");
  if (brands && (!brands.items || !brands.items.length)) {
    try {
      const b = readJsArray(path.join(__dirname, "public", "assets", "js", "data", "brands-db.js"));
      if (b.length) writeSiteFile("brands", { items: b });
    } catch (_) {}
  }
  const tiers = readSiteFile("budget-tiers");
  if (tiers && (!tiers.items || !tiers.items.length)) {
    try {
      const raw = fs.readFileSync(path.join(__dirname, "public", "assets", "js", "data", "budget-config.js"), "utf-8");
      const start = raw.indexOf("[");
      const end = raw.lastIndexOf("]");
      const t = JSON.parse(raw.slice(start, end + 1));
      if (t.length) writeSiteFile("budget-tiers", { items: t });
    } catch (_) {}
  }
}

seedSiteContentIfMissing();

app.get("/api/site/:key", (req, res) => {
  const data = readSiteFile(req.params.key);
  if (data === null) return res.status(404).json({ error: "Not found" });
  res.json(data);
});

app.get("/api/admin/site/:key", apiAuth, (req, res) => {
  const data = readSiteFile(req.params.key);
  if (data === null) return res.status(404).json({ error: "Not found" });
  res.json(data);
});

app.post("/api/admin/site/:key", apiAuth, (req, res) => {
  try {
    if (!SITE_KEYS[req.params.key]) return res.status(400).json({ error: "Unknown key" });
    writeSiteFile(req.params.key, req.body);
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

// ── Lead management ──
app.delete("/api/forms/responses/:index", apiAuth, (req, res) => {
  try {
    const filePath = path.join(__dirname, "backend", "form-submissions.json");
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "No submissions" });
    let submissions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const idx = parseInt(req.params.index, 10);
    if (isNaN(idx) || idx < 0 || idx >= submissions.length) return res.status(400).json({ error: "Invalid index" });
    submissions.splice(idx, 1);
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf-8");
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Analytics snapshot ──
app.get("/api/admin/analytics", apiAuth, (req, res) => {
  try {
    const cars = readJsArray(carsDbPath);
    const used = readJsArray(usedDbPath);
    const formsPath = path.join(__dirname, "backend", "form-submissions.json");
    let submissions = [];
    if (fs.existsSync(formsPath)) submissions = JSON.parse(fs.readFileSync(formsPath, "utf-8"));
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

app.post("/api/admin/sitemap/regenerate", apiAuth, (req, res) => {
  try {
    const cars = readJsArray(carsDbPath);
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
  } catch(e) {
    res.json([]);
  }
});

app.post("/api/admin/inventory", apiAuth, (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) return res.status(400).json({ error: "Invalid data format" });
    writeCarsDb(carsDbPath, "CARS_DB", newData);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/inventory/used", apiAuth, (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) return res.status(400).json({ error: "Invalid data format" });
    writeCarsDb(usedDbPath, "USED_CARS_DB", newData);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/upload-image", apiAuth, (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64 || !filename) return res.status(400).json({ error: "Missing data" });
    
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const ext = filename.split('.').pop() || 'jpg';
    const finalName = "img_" + Date.now() + "_" + Math.floor(Math.random()*1000) + "." + ext;
    const uploadDir = path.join(__dirname, "backend", "uploads");
    const uploadPath = path.join(uploadDir, finalName);
    
    if(!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(uploadPath, base64Data, 'base64');
    
    res.json({ success: true, url: "/images/" + finalName });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const teamDataPath = path.join(__dirname, "backend", "team-data.json");

app.get("/api/admin/team", apiAuth, (req, res) => {
  try {
    if(!fs.existsSync(teamDataPath)) {
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

// ── Catch-all: SPA fallback (serves index.html for any unknown route) ─────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ AutoViindu server running → http://localhost:${PORT}`);
});