const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// ── Serve all frontend static files ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, "frontend")));
app.use('/images', express.static(path.join(__dirname, 'backend/uploads')));

// ── API: Get all new cars ─────────────────────────────────────────────────────
// The cars data lives in cars-db.js on the frontend.
// This endpoint is a lightweight health-check / meta endpoint.
// Your actual car data is loaded from cars-db.js on the client side.
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", site: "AutoViindu" });
});

// ── Catch-all: SPA fallback (serves index.html for any unknown route) ─────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ AutoViindu server running → http://localhost:${PORT}`);
});