/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — HOME PAGE
   window.renderHome() is called by app.js init / goTo('home')
   This external file overrides the app.js stub so all home
   logic lives here and app.js stays clean.
═══════════════════════════════════════════════════════ */
window.renderHome = function () {
  document.title = 'AutoViindu — Find Your Perfect Car in Nepal';
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('home');

  var db   = window.CARS_DB     || [];
  var bDb  = window.BRANDS_DB   || [];
  var tDb  = window.BUDGET_TIERS|| [];
  var IC   = window.AV_ICONS    || {};
  var chevR = IC.chevR || '›';

  /* ── shared card renderer ── */
  function card(c) {
    if (window.AV && window.AV._carCardHTML) return window.AV._carCardHTML(c);
    return '<div class="car-card" onclick="AV.openDetail(\'' + c.slug + '\')">' +
      '<div class="car-card-img-wrap"><img src="' + c.images[0] + '" alt="' + c.brand + ' ' + c.model + '" loading="lazy"></div>' +
      '<div class="car-card-body">' +
      '<div class="car-card-brand">' + c.brand + ' &middot; ' + c.year + '</div>' +
      '<div class="car-card-name">' + c.model + '</div>' +
      '<div class="car-card-tagline">' + c.tagline + '</div>' +
      '<div class="car-card-price-row"><span class="car-card-price">' + c.variants[0].label + '</span>' +
      (c.variants.length > 1 ? '<span class="car-card-variants">' + c.variants.length + ' variants</span>' : '') + '</div>' +
      '<div class="car-card-meta"><span>&#9733; ' + c.rating.toFixed(1) + '</span><span>' + c.type + '</span><span>' + c.body + '</span></div>' +
      '<div class="car-card-actions">' +
      '<button onclick="event.stopPropagation();AV.toggleCompare(\'' + c.slug + '\')" data-cmp-slug="' + c.slug + '" class="btn-cmp">+ Compare</button>' +
      '<button onclick="event.stopPropagation();AV.openDetail(\'' + c.slug + '\')" class="btn btn-primary btn-sm">View Details</button>' +
      '</div></div></div>';
  }

  /* ── brand tile ── */
  var brandsHtml = bDb.map(function (b) {
    var cnt = db.filter(function (c) { return c.brandSlug === b.slug; }).length;
    return '<div onclick="AV.goTo(\'brand\',{slug:\'' + b.slug + '\'})" ' +
      'style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--r12);cursor:pointer;transition:all var(--ease)" ' +
      'onmouseenter="this.style.borderColor=\'' + b.color + '\';this.style.background=\'' + b.bgColor + '\'" ' +
      'onmouseleave="this.style.borderColor=\'var(--border)\';this.style.background=\'var(--white)\'">' +
      '<div style="width:40px;height:40px;background:' + b.bgColor + ';border-radius:var(--r8);display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
      '<span style="font-size:11px;font-weight:800;color:' + b.color + '">' + b.name.substring(0, 3).toUpperCase() + '</span></div>' +
      '<div style="flex:1"><div style="font-size:13px;font-weight:800;color:var(--ink)">' + b.name + '</div>' +
      '<div style="font-size:11px;color:var(--ink-4)">' + cnt + ' model' + (cnt !== 1 ? 's' : '') + '</div></div>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</div>';
  }).join('');

  /* ── budget tile ── */
  var budgetHtml = tDb.map(function (t) {
    var cnt = window.getCarsByBudget ? window.getCarsByBudget(t.slug).length : 0;
    return '<div onclick="AV.goTo(\'budget\',{tier:\'' + t.slug + '\'})" ' +
      'style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--r12);cursor:pointer;transition:all var(--ease)" ' +
      'onmouseenter="this.style.borderColor=\'' + t.color + '\';this.style.background=\'' + t.bgColor + '\'" ' +
      'onmouseleave="this.style.borderColor=\'var(--border)\';this.style.background=\'var(--white)\'">' +
      '<span style="font-size:22px;flex-shrink:0">' + t.emoji + '</span>' +
      '<div style="flex:1"><div style="font-size:13px;font-weight:800;color:var(--ink)">' + t.shortLabel + '</div>' +
      '<div style="font-size:11px;color:var(--ink-4)">' + t.heroText + '</div></div>' +
      '<span style="font-size:11px;font-weight:700;color:' + t.color + ';background:' + t.bgColor + ';padding:3px 8px;border-radius:99px">' + cnt + ' cars</span>' +
      '</div>';
  }).join('');

  /* ── brand options for search box ── */
  var brandOpts = bDb.map(function (b) { return '<option>' + b.name + '</option>'; }).join('');
  var budgetOpts = tDb.map(function (t) { return '<option>' + t.shortLabel + '</option>'; }).join('');

  /* ── ev models list ── */
  var evModels = db.filter(function (c) { return c.type === 'Electric'; })
    .map(function (c) { return '<span onclick="AV.openDetail(\'' + c.slug + '\')">' + c.brand + ' ' + c.model + '</span>'; }).join('');

  /* ── category pills ── */
  var cats = [
    { label: 'All Cars', filter: '' },
    { label: 'Electric', filter: 'electric' },
    { label: 'Hybrid', filter: 'hybrid' },
    { label: 'SUV', filter: 'suv' },
    { label: 'Sedan', filter: 'sedan' },
    { label: 'Under Rs. 30L', filter: 'budget30' },
  ];
  var catPills = cats.map(function (c, i) {
    return '<button class="hero-cat-pill ' + (i === 0 ? 'active' : '') + '" onclick="AV.heroFilter(\'' + c.filter + '\',this)">' + c.label + '</button>';
  }).join('');

  /* ── filter chips ── */
  var filterChips = ['All', 'Electric', 'Hybrid', 'Petrol', 'SUV', 'Sedan', 'Hatchback'].map(function (t, i) {
    return '<span class="chip ' + (i === 0 ? 'active' : '') + '" onclick="AV.homeFilter(\'' + t + '\',this)">' + t + '</span>';
  }).join('');

  /* ── why-us cards — cohesive SVG icon system ── */
  var whyCards = [
    {
      c: '#1A6B2A', bg: '#EEF7F0', glow: 'rgba(26,107,42,.22)',
      t: 'Full Variant Brochure',
      d: "Every trim level laid out clearly — specs, features, and prices with zero guesswork.",
      icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>' +
            '<polyline points="14 2 14 8 20 8"/>' +
            '<line x1="16" y1="13" x2="8" y2="13"/>' +
            '<line x1="16" y1="17" x2="8" y2="17"/>' +
            '<polyline points="10 9 9 9 8 9"/>' +
            '</svg>'
    },
    {
      c: '#1A4DB8', bg: '#EEF3FC', glow: 'rgba(26,77,184,.22)',
      t: 'Live EMI Calculator',
      d: 'Adjust down payment, tenure and interest rate — your monthly cost updates instantly.',
      icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="2" width="16" height="20" rx="2"/>' +
            '<line x1="8" y1="6" x2="16" y2="6"/>' +
            '<line x1="8" y1="10" x2="10" y2="10"/>' +
            '<line x1="14" y1="10" x2="16" y2="10"/>' +
            '<line x1="8" y1="14" x2="10" y2="14"/>' +
            '<line x1="14" y1="14" x2="16" y2="14"/>' +
            '<line x1="8" y1="18" x2="16" y2="18"/>' +
            '</svg>'
    },
    {
      c: '#B8600A', bg: '#FDF3E0', glow: 'rgba(184,96,10,.22)',
      t: 'Side-by-Side Compare',
      d: 'Compare up to 3 cars simultaneously with automatic winner highlighting per spec.',
      icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="2" y="3" width="9" height="18" rx="2"/>' +
            '<rect x="13" y="3" width="9" height="18" rx="2"/>' +
            '<line x1="12" y1="3" x2="12" y2="21"/>' +
            '<polyline points="6 8 5 9 6 10"/>' +
            '<polyline points="18 8 19 9 18 10"/>' +
            '</svg>'
    },
    {
      c: '#C8271E', bg: '#FFF0EF', glow: 'rgba(200,39,30,.22)',
      t: 'Nepal Verified Prices',
      d: 'Accurate Nepali ex-showroom prices updated regularly — not estimates from India or global markets.',
      icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>' +
            '<circle cx="12" cy="9" r="2.5"/>' +
            '</svg>'
    },
  ].map(function (w) {
    return '<div class="why-card" style="--why-color:' + w.c + ';--why-glow:' + w.glow + '">' +
      '<div class="why-icon" style="background:' + w.bg + ';color:' + w.c + '">' + w.icon + '</div>' +
      '<div class="why-title">' + w.t + '</div>' +
      '<div class="why-desc">' + w.d + '</div>' +
    '</div>';
  }).join('');

  document.getElementById('app-root').innerHTML = [

    /* HERO */
    '<section class="hero-section">',
    '<div class="hero-deal-banner"><div class="wrap hero-deal-inner">',
    '<div class="hero-deal-pulse"></div>',
    '<span class="hero-deal-text">Latest Deal &mdash; <strong>Toyota Fortuner 2025</strong> at Rs. 1.12 Cr &middot; Zero registration until June 30</span>',
    '<button onclick="AV.goTo(\'cars\')" class="hero-deal-cta">View Deal</button>',
    '</div></div>',
    '<div class="hero-bg"><img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=900&fit=crop&q=90" alt="Hero car" class="hero-bg-img" loading="eager"><div class="hero-bg-overlay"></div></div>',
    '<div class="wrap hero-content"><div class="hero-left">',
    '<p class="hero-label">Nepal\'s Trusted Car Platform</p>',
    '<h1 class="hero-title">Find Your Perfect<br>Car in Nepal</h1>',
    '<p class="hero-sub">500+ cars, 50+ brands. Real Nepal prices, variant breakdowns, EMI calculator — all in one place.</p>',
    '<div class="hero-categories">' + catPills + '</div>',
    '<div class="hero-actions">',
    '<button onclick="AV.goTo(\'cars\')" class="btn btn-primary btn-lg">Browse All Cars</button>',
    '<button onclick="AV.goTo(\'compare\')" class="btn hero-compare-btn">Compare Cars</button>',
    '</div>',
    '<div class="hero-stats">',
    '<div class="hero-stat"><div class="hero-stat-num">500+</div><div class="hero-stat-label">Cars Listed</div></div>',
    '<div class="hero-stat-divider"></div>',
    '<div class="hero-stat"><div class="hero-stat-num">50+</div><div class="hero-stat-label">Brands</div></div>',
    '<div class="hero-stat-divider"></div>',
    '<div class="hero-stat"><div class="hero-stat-num">10K+</div><div class="hero-stat-label">Buyers Helped</div></div>',
    '<div class="hero-stat-divider"></div>',
    '<div class="hero-stat"><div class="hero-stat-num">24/7</div><div class="hero-stat-label">Support</div></div>',
    '</div>',
    '</div></div></section>',

    /* SEARCH BOX */
    '<div class="hero-search-wrap"><div class="hero-search-box">',
    '<div class="hero-search-tabs">',
    '<button class="hero-stab active" onclick="AV.goTo(\'cars\')">New Cars</button>',
    '<button class="hero-stab" onclick="AV.goTo(\'used\')">Used Cars</button>',
    '<button class="hero-stab" onclick="AV.goTo(\'cars\',{filter:\'electric\'})">Electric</button>',
    '<button class="hero-stab" onclick="AV.goTo(\'cars\',{filter:\'hybrid\'})">Hybrid</button>',
    '</div>',
    '<div class="hero-search-fields">',
    '<div class="hero-search-field"><label>Brand</label><select class="form-select"><option>All Brands</option>' + brandOpts + '</select></div>',
    '<div class="hero-search-field"><label>Budget</label><select class="form-select"><option>Any Budget</option>' + budgetOpts + '</select></div>',
    '<div class="hero-search-field"><label>Fuel Type</label><select class="form-select"><option>All Types</option><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select></div>',
    '<button class="btn btn-primary" onclick="AV.goTo(\'cars\')" style="height:42px;font-size:14px;padding:0 22px">&#128269; Search</button>',
    '</div>',
    '<div class="hero-search-popular"><span>Popular:</span>',
    ['MG Hector', 'IONIQ 5', 'Toyota Prius', 'Honda City', 'Kia Seltos', 'BYD Atto 3'].map(function (t) {
      return '<span class="hero-popular-chip" onclick="AV.goTo(\'cars\')">' + t + '</span>';
    }).join(''),
    '</div></div></div>',

    /* FEATURED CARS */
    '<section class="section" style="padding-top:72px"><div class="wrap">',
    '<div class="sec-header"><div class="left">',
    '<div class="eyebrow">Handpicked for Nepal</div>',
    '<h2 class="sec-title">Featured New Cars</h2>',
    '<div class="sec-sub">' + db.length + ' cars with full specs &amp; EMI calculator</div>',
    '</div><button class="view-all-btn" onclick="AV.goTo(\'cars\')">All Cars ' + chevR + '</button></div>',
    '<div class="filter-chips" id="home-filter-chips">' + filterChips + '</div>',
    '<div class="cars-grid" id="home-cars-grid">' + db.slice(0, 8).map(card).join('') + '</div>',
    '<div style="text-align:center;margin-top:24px" id="load-more-wrap">',
    '<button onclick="AV.showMoreHome()" class="btn btn-outline" style="font-size:14px">Show All ' + db.length + ' Cars</button>',
    '</div></div></section>',

    /* SHOP BY BRAND */
    '<section class="section section-alt"><div class="wrap">',
    '<div class="sec-header"><div class="left"><div class="eyebrow">Official Dealers in Nepal</div><h2 class="sec-title">Shop by Brand</h2></div>',
    '<button class="view-all-btn" onclick="AV.goTo(\'cars\')">All Cars ' + chevR + '</button></div>',
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">' + brandsHtml + '</div>',
    '</div></section>',

    /* FIND BY BUDGET */
    '<section class="section"><div class="wrap">',
    '<div class="sec-header"><div class="left"><div class="eyebrow">Every Pocket Covered</div><h2 class="sec-title">Find Cars by Budget</h2></div>',
    '<button class="view-all-btn" onclick="AV.goTo(\'budget\')">All Budgets ' + chevR + '</button></div>',
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">' + budgetHtml + '</div>',
    '</div></section>',

    /* EV BANNER */
    '<section class="section section-alt"><div class="wrap"><div class="ev-banner">',
    '<img src="https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&h=500&fit=crop&q=85" alt="Electric Car" class="ev-banner-img">',
    '<div class="ev-banner-content">',
    '<div class="eyebrow" style="color:#3ECBA5">Going Green?</div>',
    '<h2 class="ev-banner-title">Electric Cars in Nepal</h2>',
    '<p class="ev-banner-sub">Best EVs for Nepal\'s roads — range, V2L for load-shedding, and real-world performance tested locally.</p>',
    '<div class="ev-banner-models">' + evModels + '</div>',
    '<button onclick="AV.goTo(\'cars\',{filter:\'electric\'})" class="btn btn-primary">&#9889; View All EVs</button>',
    '</div></div></div></section>',

    /* WHY US */
    '<section class="section"><div class="wrap">',
    '<div class="sec-header"><div class="left"><div class="eyebrow">Why Choose Us</div><h2 class="sec-title">Built for Nepal\'s Car Buyers</h2></div></div>',
    '<div class="why-grid">' + whyCards + '</div>',
    '</div></section>',

    /* CTA */
    '<section class="section section-alt"><div class="wrap"><div class="cta-banner"><div class="cta-banner-inner">',
    '<div class="cta-banner-label">Start your journey</div>',
    '<h2 class="cta-banner-title">Find Your Perfect Car Today</h2>',
    '<p class="cta-banner-sub">Complete specs, variant breakdowns, EMI calculator, and side-by-side comparisons.</p>',
    '<div class="cta-banner-btns">',
    '<button onclick="AV.goTo(\'cars\')" class="btn btn-primary btn-lg">&#128269; Browse All Cars</button>',
    '<button onclick="AV.goTo(\'services\')" class="btn" style="background:rgba(255,255,255,.09);color:rgba(255,255,255,.85);border:1.5px solid rgba(255,255,255,.14);padding:14px 28px;font-size:15px;font-weight:700;border-radius:var(--r12)">Our Services</button>',
    '</div></div></div></div></section>',

  ].join('');

  if (window.AV) {
    if (window.AV.updateCompareTray) window.AV.updateCompareTray();
    if (window.AV.updateCompareButtons) window.AV.updateCompareButtons();
  }
};