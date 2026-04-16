/* ═══════════════════════════════════════════════
   AutoViindu — Car Loader
   Fetches brand JSON files, caches in memory.
   All pages use window.CarLoader.* to get data.
═══════════════════════════════════════════════ */
window.CarLoader = (() => {

  // ── Config: add new brand here only ──────────
  const BRANDS = [
    'suzuki', 'toyota', 'hyundai',
    'kia', 'mg', 'byd', 'honda', 'riddara'
  ];

  const BASE = 'data/cars/';        // relative — works local + live
  const cache = {};                 // { brandName: [car, car, ...] }
  let allCars = null;               // merged flat array after loadAll()

  // ── Fetch one brand ───────────────────────────
  async function loadBrand(brand) {
    if (cache[brand]) return cache[brand];   // already loaded
    try {
      const res = await fetch(`${BASE}${brand}.json`);
      if (!res.ok) throw new Error(`${brand}.json not found`);
      const data = await res.json();
      cache[brand] = data;
      return data;
    } catch (e) {
      console.warn(`CarLoader: could not load ${brand}.json`, e);
      return [];
    }
  }

  // ── Fetch all brands in parallel ─────────────
  async function loadAll() {
    if (allCars) return allCars;    // already loaded
    const results = await Promise.all(BRANDS.map(loadBrand));
    allCars = results.flat();
    return allCars;
  }

  // ── Get single car by slug ────────────────────
  async function getCar(slug) {
    const cars = await loadAll();
    return cars.find(c => c.slug === slug) || null;
  }

  // ── Filter helpers ───────────────────────────
  async function getByBrand(brand) {
    return await loadBrand(brand.toLowerCase());
  }

  async function getByBody(body) {
    const cars = await loadAll();
    return cars.filter(c => c.body?.toLowerCase() === body.toLowerCase());
  }

  async function getByBudget(min, max) {
    const cars = await loadAll();
    return cars.filter(c => {
      const base = c.variants?.[0]?.price ?? 0;
      return base >= min && base <= max;
    });
  }

  async function search(query) {
    const cars = await loadAll();
    const q = query.toLowerCase();
    return cars.filter(c =>
      [c.brand, c.model, c.type, c.body, c.tagline]
        .join(' ').toLowerCase().includes(q)
    );
  }

  // ── Public API ───────────────────────────────
  return { loadAll, loadBrand, getCar, getByBrand, getByBody, getByBudget, search };

})();