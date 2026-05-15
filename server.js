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
    const fileContent = "/* AutoViindu Auto-Generated Cars DB */\nwindow.CARS_DB = " + JSON.stringify(newData, null, 2) + ";\n";
    const filePath = path.join(__dirname, "public", "assets", "js", "data", "cars-db.js");
    fs.writeFileSync(filePath, fileContent, "utf-8");
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/admin/inventory/used", apiAuth, (req, res) => {
  try {
    const newData = req.body;
    if (!Array.isArray(newData)) return res.status(400).json({ error: "Invalid data format" });
    const fileContent = "/* AutoViindu Auto-Generated Used Cars DB */\nwindow.USED_CARS_DB = " + JSON.stringify(newData, null, 2) + ";\n";
    const filePath = path.join(__dirname, "public", "assets", "js", "data", "used-cars-db.js");
    fs.writeFileSync(filePath, fileContent, "utf-8");
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