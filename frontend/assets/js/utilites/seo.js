/* ═══════════════════════════════════════════════
   AUTOVIINDU — SEO UTILITY
   Updates <title>, meta description, og:* and
   injects JSON-LD schema for each page.
═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var BASE_URL = 'https://www.autoviindu.com';
  var DEFAULT_OG_IMG = BASE_URL + '/assets/images/og/home.jpg';

  function setMeta(name, content) {
    var el = document.querySelector('meta[name="' + name + '"]') ||
             document.querySelector('meta[property="' + name + '"]');
    if (el) el.setAttribute('content', content);
  }

  function setSchema(data) {
    var el = document.getElementById('av-schema') || document.createElement('script');
    el.id = 'av-schema';
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(data);
    if (!el.parentNode) document.head.appendChild(el);
  }

  /* ── Update head for any page ── */
  window.AVSeo = {
    home: function () {
      document.title = 'AutoViindu – Find Your Perfect Car in Nepal | 500+ Cars, Prices & EMI';
      setMeta('description', 'AutoViindu – Nepal\'s most trusted automotive platform. Compare 500+ cars, find the best price, calculate EMI, and book services in Kathmandu.');
      setMeta('og:title', 'AutoViindu – Nepal\'s Most Trusted Car Platform');
      setMeta('og:url', BASE_URL + '/');
      setMeta('og:image', DEFAULT_OG_IMG);
      setMeta('twitter:title', 'AutoViindu – Nepal\'s Most Trusted Car Platform');
      setSchema({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'AutoViindu', url: BASE_URL,
        potentialAction: { '@type': 'SearchAction', target: BASE_URL + '/#cars?q={search_term_string}', 'query-input': 'required name=search_term_string' } });
    },

    carDetail: function (car) {
      if (!car) return;
      var title = car.brand + ' ' + car.model + ' ' + car.year + ' Price in Nepal – Specs, Variants & EMI | AutoViindu';
      document.title = title;
      var desc = car.brand + ' ' + car.model + ' ' + car.year + ' Nepal price starts at ' + car.variants[0].label +
        '. ' + car.variants.length + ' variants, full specs, EMI calculator.';
      setMeta('description', desc);
      setMeta('og:title', car.brand + ' ' + car.model + ' ' + car.year + ' – AutoViindu Nepal');
      setMeta('og:url', BASE_URL + '/#car/' + car.slug);
      setMeta('og:image', car.images[0] || DEFAULT_OG_IMG);
      setMeta('twitter:title', car.brand + ' ' + car.model + ' ' + car.year);
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: car.brand + ' ' + car.model + ' ' + car.year,
        image: car.images,
        description: car.overview,
        brand: { '@type': 'Brand', name: car.brand },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: car.variants[0].price,
          highPrice: car.variants[car.variants.length - 1].price,
          priceCurrency: 'NPR',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: car.rating,
          reviewCount: car.reviews,
          bestRating: 5,
        },
      });
    },

    listing: function (filter, count) {
      var label = { electric: 'Electric Cars', hybrid: 'Hybrid Cars', petrol: 'Petrol Cars', diesel: 'Diesel Cars', suv: 'SUVs', sedan: 'Sedans', hatchback: 'Hatchbacks' }[filter] || 'New Cars';
      document.title = label + ' in Nepal 2024-25 – Price, Specs & EMI | AutoViindu';
      setMeta('description', 'Browse ' + (count || '') + ' ' + label + ' in Nepal with real ex-showroom prices, variant breakdowns, and EMI calculator. AutoViindu.');
      setMeta('og:title', label + ' in Nepal – AutoViindu');
      setMeta('og:url', BASE_URL + '/#cars');
    },

    brand: function (brand) {
      if (!brand) return;
      document.title = brand.name + ' Cars Price in Nepal 2024 – All Models & EMI | AutoViindu';
      setMeta('description', 'All ' + brand.name + ' cars available in Nepal with price, specs, variants & EMI. Authorised dealer: ' + brand.nepalDealer + '.');
      setMeta('og:title', brand.name + ' Cars Nepal – AutoViindu');
      setMeta('og:url', BASE_URL + '/#brand/' + brand.slug);
      setMeta('og:image', brand.heroImage || DEFAULT_OG_IMG);
    },

    budget: function (tier) {
      if (!tier) { document.title = 'Cars by Budget Nepal – AutoViindu'; return; }
      document.title = 'Best Cars Under ' + tier.label + ' in Nepal 2024 | AutoViindu';
      setMeta('description', 'Find the best cars in the ' + tier.label + ' budget range in Nepal. Full specs, variant details, and EMI calculator.');
      setMeta('og:title', 'Best Cars ' + tier.label + ' – AutoViindu Nepal');
    },

    compare: function () {
      document.title = 'Compare Cars Side by Side Nepal – Specs & Price | AutoViindu';
      setMeta('description', 'Compare up to 3 cars side by side with full specs, price, variants, and winner highlights. AutoViindu Nepal.');
    },

    services: function () {
      document.title = 'Car Services Kathmandu – Workshop, GPS & Cosmetic Care | AutoViindu';
      setMeta('description', 'Complete automotive services in Kathmandu – cosmetic care, workshop repairs, GPS/telematics, and roadside assistance. Call +977-9701076240.');
      setSchema({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'AutoViindu',
        telephone: '+977-9701076240',
        address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP', streetAddress: 'Nayabazar' },
        geo: { '@type': 'GeoCoordinates', latitude: 27.7172, longitude: 85.324 },
      });
    },

    used: function () {
      document.title = 'Certified Used Cars Nepal – Pre-owned Vehicles Kathmandu | AutoViindu';
      setMeta('description', 'Buy verified pre-owned cars in Nepal. 140-point inspection, full service history, fair market price. AutoViindu Kathmandu.');
    },

    videos: function () {
      document.title = 'Car Reviews & Comparisons Nepal – AutoViindu Videos';
      setMeta('description', 'Watch expert car reviews, side-by-side comparisons and Nepal road tests on AutoViindu. EV reviews, SUV vs SUV and more.');
    },

    maintenance: function () {
      document.title = 'Car Maintenance & Repairs Kathmandu | AutoViindu Workshop';
      setMeta('description', 'Expert vehicle maintenance in Kathmandu – engine service, brakes, suspension, AC, electrical diagnostics. Call AutoViindu now.');
    },
  };

})();