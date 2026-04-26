/* ═══════════════════════════════════════════════
   AUTOVIINDU — FILTERS UTILITY
   All pages use these shared helpers.
   No duplicate filter logic anywhere.
═══════════════════════════════════════════════ */

/* Filter cars from CARS_DB by any combination of criteria */
window.filterCars = function (opts) {
  opts = opts || {};
  return (window.CARS_DB || []).filter(function (car) {
    if (opts.brandSlug && car.brandSlug !== opts.brandSlug) return false;
    if (opts.budgetTier && car.budgetTier !== opts.budgetTier) return false;
    if (opts.bodyType && car.bodyType !== opts.bodyType) return false;
    if (opts.type) {
      var t = opts.type.toLowerCase();
      if (t === 'electric' && car.type !== 'Electric') return false;
      if (t === 'hybrid' && car.type !== 'Hybrid') return false;
      if (t === 'petrol' && car.type !== 'Petrol') return false;
      if (t === 'diesel' && car.type !== 'Diesel') return false;
      if (t === 'ev' && !car.isEV) return false;
      if (t === 'suv' && car.body !== 'SUV') return false;
      if (t === 'sedan' && car.body !== 'Sedan') return false;
      if (t === 'hatchback' && car.body !== 'Hatchback') return false;
    }
    if (opts.isEV !== undefined && car.isEV !== opts.isEV) return false;
    if (opts.minPrice !== undefined) {
      var minV = Math.min.apply(null, car.variants.map(function (v) { return v.price; }));
      if (minV < opts.minPrice) return false;
    }
    if (opts.maxPrice !== undefined) {
      var minV2 = Math.min.apply(null, car.variants.map(function (v) { return v.price; }));
      if (minV2 > opts.maxPrice) return false;
    }
    return true;
  });
};

/* Sort cars list */
window.sortCars = function (list, by) {
  by = by || 'rating';
  var copy = list.slice();
  copy.sort(function (a, b) {
    if (by === 'price-low') return a.variants[0].price - b.variants[0].price;
    if (by === 'price-high') return b.variants[0].price - a.variants[0].price;
    if (by === 'rating') return b.rating - a.rating;
    if (by === 'expert') return b.expertScore - a.expertScore;
    if (by === 'newest') return b.year - a.year;
    if (by === 'reviews') return b.reviews - a.reviews;
    return 0;
  });
  return copy;
};

/* Fuzzy search */
window.searchCars = function (query) {
  if (!query) return window.CARS_DB || [];
  var q = query.toLowerCase().trim();
  return (window.CARS_DB || []).filter(function (car) {
    return car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      car.bodyType.includes(q) ||
      car.type.toLowerCase().includes(q) ||
      car.tagline.toLowerCase().includes(q) ||
      car.overview.toLowerCase().includes(q) ||
      car.variants.some(function (v) { return v.name.toLowerCase().includes(q); });
  });
};

/* Get related cars: same body type, ±30% price */
window.getRelatedCars = function (slug, limit) {
  limit = limit || 3;
  var car = (window.CARS_DB || []).find(function (c) { return c.slug === slug; });
  if (!car) return [];
  var basePrice = car.variants[0].price;
  return (window.CARS_DB || [])
    .filter(function (c) {
      return c.slug !== slug &&
        c.bodyType === car.bodyType &&
        c.variants[0].price >= basePrice * 0.7 &&
        c.variants[0].price <= basePrice * 1.3;
    })
    .slice(0, limit);
};

/* Get cars by brand slug */
window.getCarsByBrand = function (brandSlug) {
  return (window.CARS_DB || []).filter(function (c) { return c.brandSlug === brandSlug; });
};

/* Get cars by budget tier */
window.getCarsByBudget = function (tierSlug) {
  var tier = window.getBudgetTier ? window.getBudgetTier(tierSlug) : null;
  if (!tier) return [];
  return (window.CARS_DB || []).filter(function (c) {
    var minPrice = Math.min.apply(null, c.variants.map(function (v) { return v.price; }));
    return minPrice >= tier.min && minPrice < tier.max;
  });
};

/* Get brand by slug */
window.getBrandBySlug = function (slug) {
  return (window.BRANDS_DB || []).find(function (b) { return b.slug === slug; }) || null;
};

/* Get car by slug */
window.carBySlug = function (slug) {
  return (window.CARS_DB || []).find(function (c) { return c.slug === slug; }) || null;
};

/* Format price */
window.Rs = function (n) {
  return n >= 100000 ? 'Rs. ' + (n / 100000).toFixed(2) + 'L' : 'Rs. ' + n.toLocaleString();
};

/* Calculate EMI */
window.calcEMI = function (principal, annualRate, months) {
  var r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};