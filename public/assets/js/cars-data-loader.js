/**
 * Loads car inventory from the public API (replaces cars-db.js script tags).
 * Card view loads first for fast listing; full catalog hydrates in background.
 */
(function () {
  'use strict';

  window.CARS_DB = [];
  window.USED_CARS_DB = [];

  /**
   * YouTube-style skeleton for a car detail page (new or used). Mirrors the
   * real .dp-layout structure — gallery, thumbnail strip, highlights row,
   * title, variant tabs, spec accordions and the price sidebar — so a viewer
   * on a slow connection can see the shape of what's coming before it loads.
   */
  window.AV_detailSkeleton = function () {
    var b = '<div class="skel-block"></div>';
    return '' +
      '<div class="dp-skel av-page-in">' +
        '<div class="dp-skel-hero"><div class="wrap">' +
          '<div class="skel-line skel-block dp-skel-bc"></div>' +
          '<div class="skel-line skel-block dp-skel-htitle"></div>' +
        '</div></div>' +
        '<div class="wrap dp-layout dp-skel-body">' +
          '<div style="min-width:0">' +
            '<div class="dp-skel-gallery skel-block"></div>' +
            '<div class="dp-skel-thumbs">' + b + b + b + b + '</div>' +
            '<div class="dp-skel-hl">' + b + b + b + b + '</div>' +
            '<div class="dp-skel-title">' +
              '<div class="skel-line skel-block w-60"></div>' +
              '<div class="skel-line skel-block w-40"></div>' +
            '</div>' +
            '<div class="dp-skel-tabs">' + b + b + b + '</div>' +
            '<div class="dp-skel-accord">' + b + b + b + '</div>' +
          '</div>' +
          '<div class="dp-skel-side">' +
            '<div class="dp-skel-card">' +
              '<div class="skel-line skel-block w-40"></div>' +
              '<div class="skel-line skel-block dp-skel-price"></div>' +
              '<div class="skel-line skel-block w-85"></div>' +
              '<div class="skel-block dp-skel-btn"></div>' +
              '<div class="skel-block dp-skel-btn"></div>' +
              '<div class="skel-block dp-skel-btn"></div>' +
            '</div>' +
            '<div class="dp-skel-card">' +
              '<div class="skel-line skel-block w-50"></div>' +
              '<div class="skel-line skel-block w-85"></div>' +
              '<div class="skel-line skel-block w-60"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  /**
   * Homepage skeleton. Instead of a generic grid of card boxes, this mirrors
   * the real homepage shape — full-bleed hero with left-aligned title/spec
   * block and a search bar near the bottom, the white "browse by body type"
   * pill strip, then two white sections each with a header (eyebrow + title +
   * "show more" link) and a horizontal car carousel. Reuses the actual layout
   * classes (.hero, .home-discover, .home-section, .home-carousel) so the
   * placeholders land exactly where the content will.
   */
  window.AV_homeSkeleton = function () {
    var b = '<div class="skel-block"></div>';
    var pill = '<div class="skh-pill skel-block"></div>';

    function card() {
      return '<div class="skel-car-card skh-card">' +
        '<div class="skel-img skel-block"></div>' +
        '<div class="skel-body">' +
          '<div class="skel-line skel-block w-85"></div>' +
          '<div class="skel-line skel-block w-60"></div>' +
          '<div class="skel-line skel-block w-40"></div>' +
          '<div class="skel-btn skel-block"></div>' +
        '</div></div>';
    }
    var cards = card() + card() + card() + card() + card();

    function chip() { return '<div class="skh-chip skel-block"></div>'; }

    function section(withChips) {
      return '<section class="home-section home-section--white">' +
        '<div class="wrap home-section__inner">' +
          '<div class="home-head">' +
            '<div class="home-head__left">' +
              '<div class="skel-line skel-block skh-eyebrow"></div>' +
              '<div class="skel-line skel-block skh-title"></div>' +
            '</div>' +
            '<div class="skel-block skh-link"></div>' +
          '</div>' +
          (withChips ? '<div class="skh-chips">' + chip() + chip() + chip() + chip() + chip() + '</div>' : '') +
          '<div class="home-carousel">' + cards + '</div>' +
        '</div></section>';
    }

    return '' +
      '<div class="home-page skh av-page-in">' +
        '<div class="hero skh-hero">' +
          '<div class="wrap skh-hero-inner">' +
            '<div class="skel-block skh-hero-eyebrow"></div>' +
            '<div class="skel-block skh-hero-title"></div>' +
            '<div class="skel-block skh-hero-title skh-w70"></div>' +
            '<div class="skh-hero-specs">' + b + b + b + '</div>' +
          '</div>' +
          '<div class="wrap skh-search"><div class="skel-block skh-search-bar"></div></div>' +
        '</div>' +
        '<div class="home-discover skh-discover"><div class="wrap"><div class="home-discover__scroll">' +
          pill + pill + pill + pill + pill + pill + pill + pill +
        '</div></div></div>' +
        section(true) +
        section(false) +
      '</div>';
  };

  function fetchJson(url, opts) {
    return fetch(url, Object.assign({ headers: { Accept: 'application/json' } }, opts || {})).then(function (r) {
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
  window.CURATED = null;

  window.AV_DATA_READY = Promise.all([
    fetchJson('/api/cars?view=card'),
    fetchJson('/api/cars/used'),
    fetchJson('/api/site/homepage').catch(function (err) {
      console.warn('[AutoViindu] Hero slide prefetch failed:', err);
      return null;
    }),
    fetchJson('/api/site/curated-sections', { cache: 'no-store' }).catch(function (err) {
      console.warn('[AutoViindu] Curated sections prefetch failed:', err);
      return null;
    }),
  ]).then(function (results) {
    window.CARS_DB = results[0];
    // Only set from API if no static data loaded yet
    if (!window.USED_CARS_DB || window.USED_CARS_DB.length === 0) {
      window.USED_CARS_DB = results[1];
    }
    window.HERO_SLIDES_LIVE = (results[2] && results[2].heroSlides) || [];
    window.CURATED = results[3] || null;

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
