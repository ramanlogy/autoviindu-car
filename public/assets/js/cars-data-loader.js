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

  window.AV_DATA_READY = Promise.all([
    fetchJson('/api/cars?view=card'),
    fetchJson('/api/cars/used'),
  ]).then(function (results) {
    window.CARS_DB = results[0];
    window.USED_CARS_DB = results[1];

    Promise.all([
      fetchJson('/api/cars'),
      fetchJson('/api/cars/used'),
    ]).then(function (full) {
      window.CARS_DB = full[0];
      window.USED_CARS_DB = full[1];
      document.dispatchEvent(new CustomEvent('av:cars-updated'));
    }).catch(function (err) {
      console.warn('[AutoViindu] Full catalog prefetch failed:', err);
    });

    return { newCars: results[0], usedCars: results[1] };
  });
})();
