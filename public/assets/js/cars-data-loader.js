/**
 * Loads car inventory from the public API (replaces cars-db.js script tags).
 * Card view loads first for fast listing; full catalog hydrates in background.
 */
(function () {
  'use strict';

  window.CARS_DB = [];
  window.USED_CARS_DB = [];

  function fetchJson(url) {
    return fetch(url, { headers: { Accept: 'application/json' } }).then(function (r) {
      if (!r.ok) throw new Error(url + ' returned ' + r.status);
      return r.json();
    });
  }

  window.AV_fetchCar = function (slug) {
    return fetchJson('/api/cars/' + encodeURIComponent(slug)).then(function (car) {
      var list = window.CARS_DB || [];
      var idx = list.findIndex(function (c) { return c.slug === slug; });
      if (idx >= 0) list[idx] = car;
      else list.push(car);
      window.CARS_DB = list;
      return car;
    });
  };

  function needsFullCar(car) {
    return car && !car.overview && !car.specs;
  }

  window.AV_ensureCar = function (slug) {
    var car = (window.CARS_DB || []).find(function (c) { return c.slug === slug; });
    if (!car) return Promise.resolve(null);
    if (!needsFullCar(car)) return Promise.resolve(car);
    return window.AV_fetchCar(slug);
  };

  window.HERO_SLIDES_LIVE = [];

  window.AV_DATA_READY = Promise.all([
    fetchJson('/api/cars?view=card'),
    fetchJson('/api/cars/used'),
    fetchJson('/api/site/homepage').catch(function (err) {
      console.warn('[AutoViindu] Hero slide prefetch failed:', err);
      return null;
    }),
  ]).then(function (results) {
    window.CARS_DB = results[0];
    // Only set from API if no static data loaded yet
    if (!window.USED_CARS_DB || window.USED_CARS_DB.length === 0) {
      window.USED_CARS_DB = results[1];
    }
    window.HERO_SLIDES_LIVE = (results[2] && results[2].heroSlides) || [];

    Promise.all([
      fetchJson('/api/cars'),
      fetchJson('/api/cars/used'),
    ]).then(function (full) {
      window.CARS_DB = full[0];
      // Merge API used cars with existing static data instead of overwriting
      var existing = window.USED_CARS_DB || [];
      var apiCars = full[1] || [];
      if (existing.length > 0) {
        // Merge: update existing entries with API data but keep static-only fields
        var merged = existing.map(function (staticCar) {
          var apiCar = apiCars.find(function (a) { return String(a.id) === String(staticCar.id); });
          if (apiCar) {
            // Keep static-only fields (seller, inspection, meta, features, etc.)
            var result = Object.assign({}, apiCar);
            var staticOnlyFields = ['seller', 'inspection', 'meta', 'features', 'video',
              'overview', 'highlights', 'specs', 'tags', 'images', 'img',
              'km', 'color', 'body', 'variant', 'rating', 'reviews', 'emiEst'];
            staticOnlyFields.forEach(function (f) {
              if (staticCar[f] !== undefined && staticCar[f] !== null && staticCar[f] !== '') {
                result[f] = staticCar[f];
              }
            });
            return result;
          }
          return staticCar;
        });
        // Add any new cars from API that don't exist in static data
        apiCars.forEach(function (apiCar) {
          var exists = merged.some(function (m) { return String(m.id) === String(apiCar.id); });
          if (!exists) {
            // Add fallback seller/inspection for API-only cars
            apiCar.seller = apiCar.seller || { name: 'AutoViindu', verified: true, sold: 0, rating: 4.2, phone: ['9828364940'] };
            apiCar.inspection = apiCar.inspection || [];
            apiCar.features = apiCar.features || apiCar.tags || [];
            merged.push(apiCar);
          }
        });
        window.USED_CARS_DB = merged;
      } else {
        window.USED_CARS_DB = apiCars;
      }
      document.dispatchEvent(new CustomEvent('av:cars-updated'));
    }).catch(function (err) {
      console.warn('[AutoViindu] Full catalog prefetch failed:', err);
    });

    return { newCars: results[0], usedCars: results[1] };
  });
})();
