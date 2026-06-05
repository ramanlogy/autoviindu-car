/**
 * Premium homepage layout — included from app.js renderHome()
 * Returns HTML string for #app-root
 */
window.buildHomePageHTML = function buildHomePageHTML(ctx) {
  const { db, evCars, carCard, BRANDS, BUDGETS, HERO_SLIDES, IC } = ctx;
  const featured = [...db].filter(c => c.isFeatured || c.isBestSeller).slice(0, 8);
  const gridCars = featured.length >= 4 ? featured : db.slice(0, 8);
  const trending = [...db].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 10);
  const brands = BRANDS.slice(0, 12);

  const categories = [
    { label: 'SUV', filter: 'suv', icon: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>' },
    { label: 'Sedan', filter: 'sedan', icon: '<path d="M5 17h14v-5l-2-4H7l-2 4v5z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>' },
    { label: 'Hatchback', filter: 'hatchback', icon: '<rect x="3" y="10" width="18" height="8" rx="2"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/>' },
    { label: 'Electric', filter: 'electric', icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>' },
    { label: 'Hybrid', filter: 'hybrid', icon: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/>' },
    { label: 'Pickup', filter: 'pickup', icon: '<path d="M3 13h13v5H3zM16 13h3l3 4v1h-6z"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/>' },
  ];

  const pill = c => `<button type="button" class="home-pill" onclick="AV.goTo('cars',{filter:'${c.filter}'})"><svg class="home-pill__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${c.icon}</svg>${c.label}</button>`;

  const brandCard = b => `<div class="brand-card" onclick="AV.goTo('cars',{brand:'${b.name}'})"><div class="brand-logo" style="background:#f8faf9;padding:6px"><img src="${b.logo}" alt="${b.name}" loading="lazy" style="width:100%;height:100%;object-fit:contain" onerror="this.style.display='none'"></div><span class="brand-name">${b.name}</span><span class="brand-count">${b.count}</span></div>`;

  const budgetCard = b => `<div class="budget-card" onclick="AV.goTo('cars')"><div class="budget-bg" style="background-image:url('${b.bg}')"></div><div class="budget-overlay" style="background:${b.overlay}"></div><div class="budget-content"><div class="budget-label">${b.label}</div><div class="budget-count">${b.count}</div></div></div>`;

  const svc = (href, title, desc, icon) => `<div class="svc-card" onclick="window.location.href='${href}'"><div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${icon}</svg></div><div class="svc-name">${title}</div><div class="svc-desc">${desc}</div><span class="svc-learn">Learn more →</span></div>`;

  const tool = (href, title, desc, icon, onclick) => {
    const click = onclick ? ` onclick="${onclick};return false;"` : '';
    return `<a class="home-tool-card" href="${href}"${click}><div class="home-tool-card__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${icon}</svg></div><div class="home-tool-card__title">${title}</div><div class="home-tool-card__desc">${desc}</div></a>`;
  };

  return `
<div class="home-page">

  <!-- Hero -->
  <div class="hero" id="hero">
    <div class="hero-slides" id="hero-slides">
      ${HERO_SLIDES.map((s, i) => `
      <div class="hero-slide" data-idx="${i}">
        <div class="slide-bg" style="background-image:url('${s.bg}')"></div>
        <div class="wrap slide-content">
          <div class="slide-badge"><span class="dot"></span>${s.badge}</div>
          <h1 class="slide-title">${s.title}</h1>
          <p class="slide-sub">${s.sub}</p>
          <div class="offer-pill" style="color:#fff">${s.offer.icon}<strong>${s.offer.label}</strong> — ${s.offer.val}</div>
          <div class="slide-actions">
            <button class="slide-action-primary" onclick="AV.openDetail('${s.slug}')">View Details</button>
            <button class="slide-action-ghost" onclick="AV.goTo('cars')">Browse All Cars</button>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <button class="hero-prev" onclick="AV.heroNav(-1)" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></button>
    <button class="hero-next" onclick="AV.heroNav(1)" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg></button>
    <div class="hero-dots" id="hero-dots">${HERO_SLIDES.map((_, i) => `<div class="hero-dot ${i === 0 ? 'active' : ''}" onclick="AV.heroGo(${i})"></div>`).join('')}</div>
    <div class="hero-progress" id="hero-progress"></div>
  </div>

  <!-- Category discover bar -->
  <div class="home-discover">
    <div class="wrap">
      <div class="home-discover__scroll">${categories.map(pill).join('')}</div>
    </div>
  </div>

  <!-- Search -->
  <section class="home-section home-search-section">
    <div class="wrap home-section__inner">
      <div class="search-widget">
        <div class="sw-tabs">
          <div class="sw-tab active">New Cars</div>
          <div class="sw-tab" onclick="AV.goTo('used')">Used Cars</div>
          <div class="sw-tab" onclick="AV.goTo('cars',{filter:'electric'})">Electric</div>
          <div class="sw-tab" onclick="AV.goTo('compare')">Compare</div>
        </div>
        <div class="sw-body">
          <div class="sw-grid">
            <div class="sw-field"><label>Brand</label><select class="sw-select" id="sw-brand"><option value="">All Brands</option>${[...new Set(db.map(c => c.brand))].map(b => `<option>${b}</option>`).join('')}</select></div>
            <div class="sw-field"><label>Budget</label><select class="sw-select" id="sw-budget"><option value="">Any Budget</option><option value="15">Under Rs. 15L</option><option value="25">Rs. 15L – 25L</option><option value="40">Rs. 25L – 40L</option><option value="60">Rs. 40L – 60L</option><option value="100">Rs. 60L – 1Cr</option><option value="999">Above Rs. 1Cr</option></select></div>
            <div class="sw-field"><label>Fuel</label><select class="sw-select" id="sw-fuel"><option value="">All Types</option><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
            <button class="sw-btn" onclick="AV.swSearch()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Search</button>
          </div>
        </div>
        <div class="sw-popular"><span class="sw-popular-label">Popular:</span>${['Creta', 'Swift', 'Seltos', 'Fortuner', 'Atto 3', 'Grand Vitara'].map(t => `<span class="sw-pop-tag" onclick="AV.goTo('cars',{q:'${t}'})">${t}</span>`).join('')}</div>
      </div>
    </div>
  </section>

  <!-- New Cars -->
  <section class="home-section home-section--white" id="home-new-cars">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">New in Nepal</span>
          <h2 class="home-title">Featured New Cars</h2>
          <p class="home-sub">${db.length} models with full specs, variants, and EMI estimates.</p>
        </div>
        <button type="button" class="home-link" onclick="AV.goTo('cars')">View all ${IC.chevR || '→'}</button>
      </div>
      <div class="home-chips filter-chips" id="home-chips">${['All', 'Electric', 'Hybrid', 'SUV', 'Sedan'].map((t, i) => `<span class="chip ${i === 0 ? 'active' : ''}" onclick="AV.homeFilter('${t}',this)">${t}</span>`).join('')}</div>
      <div class="home-grid cars-grid" id="home-grid">${gridCars.map(carCard).join('')}</div>
    </div>
  </section>

  <!-- Trending -->
  <section class="home-section home-section--muted">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Most viewed</span>
          <h2 class="home-title">Trending Now</h2>
          <p class="home-sub">What buyers in Nepal are researching this week.</p>
        </div>
        <button type="button" class="home-link" onclick="AV.goTo('cars')">See all ${IC.chevR || '→'}</button>
      </div>
      <div class="home-carousel car-carousel">${trending.map(carCard).join('')}</div>
    </div>
  </section>

  <!-- Brands -->
  <section class="home-section home-section--white">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Manufacturers</span>
          <h2 class="home-title">Shop by Brand</h2>
        </div>
        <button type="button" class="home-link" onclick="AV.goTo('cars')">All brands</button>
      </div>
      <div class="home-brands brands-grid">${brands.map(brandCard).join('')}</div>
    </div>
  </section>

  <!-- Smart tools -->
  <section class="home-section">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Plan your purchase</span>
          <h2 class="home-title">Tools &amp; Calculators</h2>
          <p class="home-sub">Make confident decisions before you visit a showroom.</p>
        </div>
      </div>
      <div class="home-tools">
        ${tool('whatcarcanyouaffoard.html', 'What can you afford?', 'Match your budget to the right cars in Nepal.', '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>')}
        ${tool('caremi.html', 'EMI Calculator', 'Estimate monthly payments with down payment and tenure.', '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/>')}
        ${tool('#', 'Compare Cars', 'Side-by-side specs, prices, and variants.', '<path d="M18 20V10M12 20V4M6 20v-6"/>', 'AV.goTo(\'compare\')')}
        ${tool('chargingstation.html', 'EV Charging Map', 'Find charging stations across Nepal.', '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>')}
      </div>
    </div>
  </section>

  <!-- Budget -->
  <section class="home-section home-section--muted">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">By price range</span>
          <h2 class="home-title">Browse by Budget</h2>
        </div>
      </div>
      <div class="home-budget-row budget-grid">${BUDGETS.slice(0, 5).map(budgetCard).join('')}</div>
    </div>
  </section>

  <!-- EV Spotlight -->
  ${evCars.length ? `
  <section class="home-section home-ev home-section--white">
    <div class="wrap">
      <div class="ev-hero">
        <div class="ev-hero-in">
          <div>
            <div class="ev-badge">Electric</div>
            <h2 class="ev-title">Built for Nepal's Roads</h2>
            <p class="ev-sub">${evCars.length} EV models with real range, V2L, and fast charging — hill-ready and load-shedding smart.</p>
            <div class="ev-stats">
              <div class="ev-stat"><div class="num">${evCars.length}</div><div class="lbl">Models</div></div>
              <div class="ev-stat"><div class="num">481km</div><div class="lbl">Max range</div></div>
            </div>
            <button type="button" onclick="AV.goTo('cars',{filter:'electric'})" class="btn btn-primary" style="margin-top:20px">Explore EVs →</button>
          </div>
          <div class="ev-cards">${evCars.slice(0, 4).map(c => `<div class="ev-mini" onclick="AV.openDetail('${c.slug}')"><img src="${c.images[0]}" class="ev-mini-img" alt="" loading="lazy"><div class="ev-mini-name">${c.brand} ${c.model}</div><div class="ev-mini-price">${window.Rs(c.variants[0].price)}</div></div>`).join('')}</div>
        </div>
      </div>
    </div>
  </section>` : ''}

  <!-- Events -->
  <section class="home-events events-section-modern">
    <div class="wrap">
      <div class="ev-header home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Auto culture</span>
          <h2 class="home-title ev-title">Upcoming Events</h2>
          <p class="home-sub ev-sub">Shows, test drives, and launches across Nepal.</p>
        </div>
        <button type="button" class="home-link ev-btn-outline">All events →</button>
      </div>
      <div class="ev-modern-grid">
        <div class="ev-modern-card featured">
          <div class="ev-card-bg" style="background-image:url('/assets/images/events/auto-expo.jpg');background-color:#1A1A1A"></div>
          <div class="ev-card-overlay"></div>
          <div class="ev-card-top"><span class="ev-badge live">Featured</span><span class="ev-badge free">Free</span></div>
          <div class="ev-card-content">
            <div class="ev-date-box"><div class="ev-day">18</div><div class="ev-month">APR</div></div>
            <div class="ev-info"><div class="ev-card-title">Nepal Auto Expo 2026</div><div class="ev-card-meta"><span>Bhrikutimandap, Kathmandu</span></div></div>
          </div>
        </div>
        <div class="ev-modern-card">
          <div class="ev-card-bg" style="background-image:url('/assets/images/events/test-drive.jpg');background-color:#2E4F8A"></div>
          <div class="ev-card-overlay"></div>
          <div class="ev-card-top"><span class="ev-badge">Test Drive</span></div>
          <div class="ev-card-content">
            <div class="ev-date-box"><div class="ev-day">22</div><div class="ev-month">APR</div></div>
            <div class="ev-info"><div class="ev-card-title">EV Test Drive Day</div><div class="ev-card-meta"><span>Naxal, Kathmandu</span></div></div>
          </div>
        </div>
        <div class="ev-modern-card">
          <div class="ev-card-bg" style="background-image:url('/assets/images/events/launch.jpg');background-color:#1C1C1C"></div>
          <div class="ev-card-overlay"></div>
          <div class="ev-card-top"><span class="ev-badge">Launch</span></div>
          <div class="ev-card-content">
            <div class="ev-date-box"><div class="ev-day">05</div><div class="ev-month">MAY</div></div>
            <div class="ev-info"><div class="ev-card-title">Exclusive SUV Reveal</div><div class="ev-card-meta"><span>Hotel Yak &amp; Yeti</span></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="home-section home-services home-section--muted">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">After you buy</span>
          <h2 class="home-title">Our Services</h2>
          <p class="home-sub">Paperwork, parts, maintenance, and financing — all in one place.</p>
        </div>
        <a href="services.html" class="home-link">All services</a>
      </div>
      <div class="svc-grid">
        ${svc('dotm-services.html', 'DOTM Services', 'Bluebook, renewal, and ownership transfer.', '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>')}
        ${svc('maintenance-repairs.html', 'Maintenance', 'Servicing, diagnostics, and repairs.', '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>')}
        ${svc('parts-accessories.html', 'Parts & Accessories', 'Genuine OEM and quality aftermarket.', '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>')}
        ${svc('insurance-finance.html', 'Insurance & Finance', 'Coverage and EMI from partner banks.', '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>')}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="home-section home-cta">
    <div class="wrap">
      <div class="cta-banner">
        <div class="cta-in">
          <div class="cta-label">Start your journey</div>
          <h2 class="cta-title">Find your perfect car in Nepal</h2>
          <p class="cta-sub">Compare models, calculate EMI, and explore every brand — all in one place.</p>
          <div class="cta-btns">
            <button type="button" onclick="AV.goTo('cars')" class="btn btn-primary" style="color:#fff">Browse all cars</button>
            <button type="button" onclick="window.location.href='book-service.html'" class="btn" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)">Book a service</button>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>`;
};
