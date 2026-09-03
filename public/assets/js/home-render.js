/**
 * Premium homepage layout — included from app.js renderHome()
 * Returns HTML string for #app-root
 */
window.AV = window.AV || {};

/**
 * Canonical price formatter (Nepali numbering).
 *   >= 1 Crore   -> "Rs. 1.4 Cr"   (max 2 decimals, trailing zeros trimmed)
 *   1L - 99.99L  -> "Rs. 45L"      (max 2 decimals, trailing zeros trimmed)
 *   < 1 Lakh     -> "Rs. 90,000"   (grouped)
 * Defined here because home-render.js is the first deferred script; app.js reuses it.
 */
window.Rs = function (n) {
  if (n === null || n === undefined || n === '' || isNaN(n)) return 'Price on Request';
  n = Number(n);
  if (n >= 100000) {
    var cr = parseFloat((n / 10000000).toFixed(2));
    if (cr >= 1) return 'Rs. ' + cr + ' Cr';
    return 'Rs. ' + parseFloat((n / 100000).toFixed(2)) + 'L';
  }
  return 'Rs. ' + n.toLocaleString('en-IN');
};
/** Same, but the input is already expressed in Lakhs (used by the price-range sliders). */
window.RsLakh = function (lakhs) { return window.Rs((Number(lakhs) || 0) * 100000); };

const eventMiniCard = ev => `<div class="event-mini-card" onclick="window.location.href='/events.html?article=${ev.id}'">
    <div class="emc-top">
      ${ev.img ? `<img src="${ev.img}" alt="${ev.title}" loading="lazy">` : `<div class="emc-icon"><i data-lucide="${ev.icon}"></i></div>`}
      <div class="emc-date"><span class="emc-dnum">${ev.dnum}</span><span class="emc-dmon">${ev.dmon}</span></div>
    </div>
    <div class="emc-body">
      <span class="emc-cat">${ev.cat}</span>
      <div class="emc-title">${ev.title}</div>
      <div class="emc-venue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${ev.venue}</div>
    </div>
  </div>`;

window.AV.scrollCarousel = function (id, direction) {
  const container = document.getElementById(id);
  if (container) {
    const scrollAmount = container.clientWidth * 0.75 * direction;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};
window.AV.calcHomeBudgetPrice = function () {
  var monthlyEl = document.getElementById('bcalcMonthly');
  var downEl = document.getElementById('bcalcDown');
  var termEl = document.getElementById('bcalcTerm');
  var rateEl = document.getElementById('bcalcRate');
  if (!monthlyEl || !downEl || !termEl || !rateEl) return;

  var monthly = parseFloat(monthlyEl.value) || 0;
  var down = parseFloat(downEl.value) || 0;
  var months = parseInt(termEl.value, 10) || 60;
  var ratePct = parseFloat(rateEl.value) || 0;
  var r = ratePct / 12 / 100;
  var loan = r > 0 ? monthly * (1 - Math.pow(1 + r, -months)) / r : monthly * months;
  var price = down + loan;

  var headlineAmt = document.getElementById('bcalcHeadlineAmt');
  if (headlineAmt) headlineAmt.textContent = 'Rs. ' + Math.round(monthly).toLocaleString('en-IN');

  var priceEl = document.getElementById('bcalcPrice');
  if (priceEl) {
    priceEl.textContent = window.Rs(price);
  }

  var cars = (window.CARS_DB || []).filter(function (c) {
    return Math.min.apply(null, c.variants.map(function (v) { return v.price; })) <= price;
  });
  var countEl = document.getElementById('bcalcCount');
  if (countEl) countEl.textContent = cars.length;

  window._bcalcPrice = price;
};
window.AV.goHomeBudgetCars = function () {
  var price = window._bcalcPrice || 0;
  window.AV.goTo('cars', { maxPrice: Math.max(price, 100000) });
};
window.AV.toggleAllBrands = function () {
  const grid = document.getElementById('brands-grid-container');
  const btn = document.getElementById('toggle-brands-btn');
  if (grid && btn && window.AV.ALL_BRANDS && window.AV.brandCardTemplate) {
    const isExpanded = grid.classList.contains('expanded');
    if (!isExpanded) {
      grid.classList.add('expanded');
      grid.innerHTML = window.AV.ALL_BRANDS.map(window.AV.brandCardTemplate).join('');
      btn.innerHTML = `Show less`;
    } else {
      grid.classList.remove('expanded');
      grid.innerHTML = window.AV.ALL_BRANDS.slice(0, 12).map(window.AV.brandCardTemplate).join('');
      btn.innerHTML = `All brands`;
    }
  }
};
window.buildHomePageHTML = function buildHomePageHTML(ctx) {
  const { db, evCars, carCard, BRANDS, BUDGETS, HERO_SLIDES, IC, UPCOMING_DATA, upcomingCard } = ctx;
  // Filter for featured, best sellers, or specific priority brands like Deepal and BYD
  let featured = [...db].filter(c => c.isFeatured || c.isBestSeller || c.brand === 'Deepal' || c.brand === 'BYD');

  // Randomize the featured cars
  featured = featured.sort(() => 0.5 - Math.random());

  // Take up to 8 random featured cars, or just 8 random cars if not enough featured
  const gridCars = featured.length >= 4 ? featured.slice(0, 8) : [...db].sort(() => 0.5 - Math.random()).slice(0, 8);

  const trending = [...db].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 10);
  const brands = BRANDS.slice(0, 12);

  // Budget calculator — default figures (Rs. 40,000/mo, Rs. 5L down, 60mo, 11.5% p.a.)
  const bcalcDefaults = { monthly: 40000, down: 500000, months: 60, rate: 11.5 };
  const bcalcR = bcalcDefaults.rate / 12 / 100;
  const bcalcLoan = bcalcR > 0
    ? bcalcDefaults.monthly * (1 - Math.pow(1 + bcalcR, -bcalcDefaults.months)) / bcalcR
    : bcalcDefaults.monthly * bcalcDefaults.months;
  const bcalcPrice = bcalcDefaults.down + bcalcLoan;
  const bcalcFmtPrice = window.Rs(bcalcPrice);
  const bcalcCarCount = db.filter(c => Math.min(...c.variants.map(v => v.price)) <= bcalcPrice).length;

  const categories = [
    {
      label: 'SUV',
      filter: 'suv',
      image: '/assets/js/bodytypeimages/suv.png',
    },
    {
      label: 'Crossover',
      filter: 'crossover',
      image: '/assets/js/bodytypeimages/crossover.png',
    },
    {
      label: 'Sedan',
      filter: 'sedan',
      image: '/assets/js/bodytypeimages/sedan.png',
    },
    
    {
      label: 'Hatchback',
      filter: 'hatchback',
      image: '/assets/js/bodytypeimages/hatchback.png',
    },
    {
      label: 'Coupe',
      filter: 'coupe',
      image: '/assets/js/bodytypeimages/coupe.png',
    },
    {
      label: 'MPV',
      filter: 'mpv',
      image: '/assets/js/bodytypeimages/mpv.png',
    },
    {
      label: 'Off-road',
      filter: 'offroad',
      image: '/assets/js/bodytypeimages/offroad.png',
    },
    {
      label: 'Pickup',
      filter: 'pickup',
      image: '/assets/js/bodytypeimages/pickup.png',
    },
    {
      label: 'Microcar',
      filter: 'microcar',
      image: '/assets/js/bodytypeimages/microcar.png',
    },
   
    {
      label: 'Wagon',
      filter: 'wagon',
      image: '/assets/js/bodytypeimages/wagon.png',
    },
    {
      label: 'Van',
      filter: 'van',
      image: '/assets/js/bodytypeimages/van.png',
    },
    
  ];
  const pill = c => `<button type="button" class="home-pill" onclick="AV.goTo('cars',{filter:'${c.filter}'})"><img src="${c.image}" alt="${c.label}" />${c.label}</button>`;
  const brandCard = b => `<div class="brand-card" onclick="AV.goTo('cars',{brand:'${b.name}'})"><div class="brand-logo" style="background:#f8faf9;padding:4px"><img src="${b.logo}" alt="${b.name}" loading="lazy" style="width:100%;height:100%;object-fit:contain" onerror="this.style.display='none'"></div><span class="brand-name">${b.name}</span></div>`;
  window.AV.brandCardTemplate = brandCard;
  window.AV.ALL_BRANDS = BRANDS;

  const budgetCard = b => `<div class="budget-card" onclick="AV.goTo('cars', {budget:'${b.filter}'})"><div class="budget-bg" style="background-image:url('${b.bg}')"></div><div class="budget-overlay" style="background:${b.overlay}"></div><div class="budget-content"><div class="budget-label">${b.label}</div><div class="budget-count">${b.count}</div></div></div>`;

  // Duotone icon: a muted line-icon base + a small solid-colour badge overlapping
  // its bottom-right corner (badge carries its own tiny glyph, e.g. a check).
  // Reused everywhere a "feature icon" is needed — see also home-tool-card__icon.
  const dicon = (basePaths, badgeColor, badgePaths) => `<span class="av-dicon">
      <svg class="av-dicon-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${basePaths}</svg>
      <span class="av-dicon-badge" style="background:${badgeColor}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${badgePaths}</svg></span>
    </span>`;

  const svc = (href, title, desc, iconHTML, ctaLabel) => `<div class="svc-card" onclick="window.location.href='${href}'"><div class="svc-icon">${iconHTML}</div><div class="svc-name">${title}</div><div class="svc-desc">${desc}</div><span class="svc-learn">${ctaLabel || 'Learn more'} →</span></div>`;

  // "3D" sticker-style icons for the services grid: layered shapes with a
  // gradient fill + drop-shadow (instead of a flat single-colour stroke),
  // plus the same small badge used by dicon(). One-off per card — richer
  // than dicon() allows, so these are hand-built rather than generic.
  const svc3dBadge = (badgeColor, badgePaths) => `<span class="av-dicon-badge" style="background:${badgeColor}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">${badgePaths}</svg></span>`;

  const svc3dDoc = () => `<span class="av-dicon av-dicon--lg">
      <svg class="av-dicon-base" viewBox="0 0 48 48" width="34" height="34">
        <defs>
          <linearGradient id="svc3dDocG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#e5e8e4"/>
          </linearGradient>
          <filter id="svc3dDocS" x="-60%" y="-30%" width="220%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#0d140f" flood-opacity=".22"/>
          </filter>
        </defs>
        <g filter="url(#svc3dDocS)">
          <path d="M12 4h16l8 8v32a2 2 0 01-2 2H12a2 2 0 01-2-2V6a2 2 0 012-2z" fill="url(#svc3dDocG)"/>
          <path d="M28 4v8h8z" fill="#cfd4cf"/>
        </g>
        <rect x="15" y="23" width="18" height="2.4" rx="1.2" fill="#b6bdb7"/>
        <rect x="15" y="29" width="18" height="2.4" rx="1.2" fill="#b6bdb7"/>
        <rect x="15" y="35" width="11" height="2.4" rx="1.2" fill="#b6bdb7"/>
      </svg>
      ${svc3dBadge('var(--g3)', '<polyline points="20 6 9 17 4 12"/>')}
    </span>`;

  const svc3dWrench = () => `<span class="av-dicon av-dicon--lg">
      <svg class="av-dicon-base" viewBox="0 0 48 48" width="34" height="34">
        <defs>
          <linearGradient id="svc3dWrG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fbfbfa"/>
            <stop offset="100%" stop-color="#c3c9c4"/>
          </linearGradient>
          <filter id="svc3dWrS" x="-60%" y="-30%" width="220%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#0d140f" flood-opacity=".22"/>
          </filter>
        </defs>
        <g filter="url(#svc3dWrS)">
          <path d="M33 8.9a10 10 0 00-13.6 12L6.6 33.6a3.6 3.6 0 005 5L24.4 25.8a10 10 0 0012.4-13l-6 6a4 4 0 01-5.6-5.7l6-6z" fill="url(#svc3dWrG)"/>
        </g>
        <path d="M20.6 15.6a10 10 0 003.8 8.6l-1.7 1.7a10 10 0 01-3.8-8.6z" fill="#fff" opacity=".35"/>
      </svg>
      ${svc3dBadge('var(--gold)', '<circle cx="12" cy="12" r="3.5" fill="#fff" stroke="none"/>')}
    </span>`;

  const svc3dBox = () => `<span class="av-dicon av-dicon--lg">
      <svg class="av-dicon-base" viewBox="0 0 48 48" width="34" height="34">
        <defs>
          <linearGradient id="svc3dBoxTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f2ebdd"/>
            <stop offset="100%" stop-color="#e2d3b6"/>
          </linearGradient>
          <linearGradient id="svc3dBoxL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#cfbc98"/>
            <stop offset="100%" stop-color="#c2ac84"/>
          </linearGradient>
          <linearGradient id="svc3dBoxR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#e6d8bb"/>
            <stop offset="100%" stop-color="#d7c19c"/>
          </linearGradient>
          <filter id="svc3dBoxS" x="-60%" y="-30%" width="220%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#0d140f" flood-opacity=".22"/>
          </filter>
        </defs>
        <g filter="url(#svc3dBoxS)">
          <path d="M24 4l18 8.5v7L24 28 6 19.5v-7z" fill="url(#svc3dBoxTop)"/>
          <path d="M6 19.5l18 8.5v16L6 35.5z" fill="url(#svc3dBoxL)"/>
          <path d="M42 19.5l-18 8.5v16l18-8.5z" fill="url(#svc3dBoxR)"/>
        </g>
        <path d="M24 4l18 8.5-4 1.9L20 6z" fill="#fff" opacity=".3"/>
      </svg>
      ${svc3dBadge('var(--blue)', '<circle cx="12" cy="12" r="3.5" fill="#fff" stroke="none"/>')}
    </span>`;

  const svc3dShield = () => `<span class="av-dicon av-dicon--lg">
      <svg class="av-dicon-base" viewBox="0 0 48 48" width="34" height="34">
        <defs>
          <linearGradient id="svc3dShG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3d9256"/>
            <stop offset="100%" stop-color="#155423"/>
          </linearGradient>
          <filter id="svc3dShS" x="-60%" y="-30%" width="220%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#0d140f" flood-opacity=".24"/>
          </filter>
        </defs>
        <g filter="url(#svc3dShS)">
          <path d="M24 4l16 6v12c0 12.5-8 18.5-16 22-8-3.5-16-9.5-16-22V10z" fill="url(#svc3dShG)"/>
        </g>
        <path d="M24 4l16 6v3.5L24 8.5 8 13.5V10z" fill="#fff" opacity=".22"/>
      </svg>
      ${svc3dBadge('var(--g3)', '<polyline points="20 6 9 17 4 12"/>')}
    </span>`;

  const tool = (href, title, desc, iconHTML, onclick) => {
    const click = onclick ? ` onclick="${onclick};return false;"` : '';
    return `<a class="home-tool-card" href="${href}"${click}><div class="home-tool-card__icon">${iconHTML}</div><div class="home-tool-card__title">${title}</div><div class="home-tool-card__desc">${desc}</div></a>`;
  };

  const EVENTS_DATA = [
    { id: 'e1', cat: 'Auto Expo', icon: 'calendar-days', dnum: '25', dmon: 'AUG', title: "18th NADA Auto Show 2026 — Golden Jubilee Edition", venue: 'Bhrikutimandap, Kathmandu', img: '/assets/images/events/nadashow.jpg' },
    { id: 'e2', cat: 'EV Expo', icon: 'zap', dnum: '26', dmon: 'NOV', title: "EVTECH Nepal Expo 2026", venue: 'Bhrikutimandap, Kathmandu' },
  ];

  // Refresh the teaser with live data from the admin-managed events CMS once it's loaded,
  // keeping EVENTS_DATA above only as the fallback when the API is empty/unreachable.
  setTimeout(async function () {
    if (!window.AVContent) return;
    const grid = document.getElementById('events-grid');
    if (!grid) return;
    const data = await window.AVContent.load('events');
    const upcoming = window.AVContent.published(data && data.upcoming).slice(0, 6);
    if (upcoming.length) {
      grid.innerHTML = upcoming.map(eventMiniCard).join('');
      if (window.lucide) window.lucide.createIcons();
    }
  }, 0);

  return `
<style>
.hero { position: relative; overflow: hidden; background: #ffffff; }
.hero-slides { display: flex; transition: transform 1s cubic-bezier(.77, 0, .175, 1); }
.hero-slide { min-width: 100%; position: relative; height: 480px; display: flex; align-items: stretch; background: #ffffff; }
.slide-left-bg { position: absolute; top: 0; left: 0; width: 40vw; height: 100%; background: #ffffff; z-index: 1; }
.slide-bg { position: absolute; top: 0; right: 0; width: 64vw; height: 100%; background-size: cover; background-position: center; z-index: 2; clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%); }
.hero-slide .wrap { position: relative; z-index: 3; width: 100%; display: flex; align-items: center; justify-content: flex-start; pointer-events: none; }
.slide-content { max-width: 440px; text-align: left; color: #f1f1f1ff; pointer-events: auto; display: flex; flex-direction: column; justify-content: center; }
.slide-badge { display: inline-block; font-size: 11px; font-weight: 800; color: #1a6b2a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.slide-title { font-family: var(--font-d); font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; color: #e4dedeff; line-height: 1.1; margin-bottom: 12px; text-transform: uppercase; }
.slide-price { font-size: 16px; font-weight: 700; color: #d5a215ff; margin-bottom: 16px; display: flex; align-items: center; }
.slide-price-current { color: #1a6b2a; font-weight: 800; font-size: 22px; margin-left: 10px; }
.slide-sub { font-size: 13.5px; color: #c9c9c9ff; line-height: 1.6; margin-bottom: 20px; }

/* specs & color flairs */
.slide-color-indicator { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; font-size: 10px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
.slide-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; border: 1px solid #ddd; vertical-align: middle; margin-right: 4px; }
.slide-specs-grid { display: flex; gap: 24px; margin-bottom: 12px; border-top: 1px solid #eee; padding-top: 16px; }
.slide-spec-item { display: flex; flex-direction: column; gap: 2px; }
.slide-spec-label { font-size: 9px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
.slide-spec-value { font-size: 13px; font-weight: 700; color: #d5a215ff; }

/* navigation override */
.hero-prev, .hero-next { position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #111; transition: all 0.2s ease; z-index: 10; }
.hero-prev { left: 24px; }
.hero-next { right: 24px; }
.hero-prev:hover, .hero-next:hover { background: rgba(0, 0, 0, 0.1); }
.hero-dots { position: absolute; bottom: 20px; left: 24px; display: flex; gap: 8px; z-index: 10; }
.hero-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(0, 0, 0, 0.15); cursor: pointer; transition: all 0.2s ease; }
.hero-dot.active { background: #1a6b2a; width: 24px; border-radius: 99px; }
.hero-progress { position: absolute; bottom: 0; left: 0; height: 3px; background: #1a6b2a; transition: width 0s linear; z-index: 10; }

/* premium "view this car" CTA sitting on the slide image */
.slide-hero-cta { position: absolute; left: 24px; bottom: 22px; z-index: 4; display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 8px; font-size: 12.5px; font-weight: 800; letter-spacing: .4px; text-transform: uppercase; color: #fff; background: linear-gradient(135deg, #1f7d33, #0f4d1c); border: 1px solid rgba(255,255,255,.28); box-shadow: 0 10px 26px rgba(15,77,28,.38); cursor: pointer; transition: transform .18s ease, box-shadow .18s ease; }
.slide-hero-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(15,77,28,.48); }
.slide-hero-cta svg { width: 16px; height: 16px; }
.slide-img-mini { background: rgba(255,255,255,.92); color: #111; border: none; padding: 10px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.12); }

/* wider hero image / less side whitespace on large desktops */
@media (min-width: 1440px) {
  .hero-slide { height: 540px; }
  .slide-bg { width: 70vw; }
  .slide-left-bg { width: 34vw; }
}
@media (min-width: 1920px) {
  .hero-slide { height: 600px; }
  .slide-bg { width: 75vw; }
  .slide-left-bg { width: 28vw; }
}

.hero-search-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 20;
  padding: 0 32px;
}

.hero-glass-search {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 18px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.hero-glass-search .sw-tabs {
  background: rgba(0, 0, 0, 0.04);
  padding: 4px;
  border-radius: 99px;
  margin-bottom: 14px;
  display: inline-flex;
  gap: 4px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}
.hero-glass-search .sw-tab {
  color: #555555;
  padding: 8px 18px;
  border-radius: 99px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12.5px;
  border: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.hero-glass-search .sw-tab.active {
  color: #fff;
  background: var(--brand, #1a6b2a);
  box-shadow: 0 4px 12px rgba(26, 107, 42, 0.25);
}

.hero-glass-search .sw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}


.hero-glass-search label {
  color: #475569;
  font-size: 9.5px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-bottom: 5px;
  display: block;
}
.hero-glass-search .sw-select {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  padding: 9px 10px;
  width: 100%;
  font-weight: 600;
  font-size: 9.5px;
  color: #1e293b;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 24px;
}

.hero-glass-search .sw-btn {
  grid-column: 1 / -1;
  background: var(--brand, #1a6b2a);
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 11px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.hero-glass-search .sw-btn:hover { background: #145522; transform: translateY(-1px); }

.hero-glass-search .sw-popular {
  margin-top: 13px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 10px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
  gap: 6px;
  scrollbar-width: none;
}
.hero-glass-search .sw-popular::-webkit-scrollbar { display: none; }
.hero-glass-search .sw-popular-label {
  color: #64748b;
  font-size: 10.5px;
  font-weight: 600;
  flex-shrink: 0;
}
.hero-glass-search .sw-pop-tag {
  color: #334155;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 10.5px;
  padding: 3px 9px;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s;
}
.hero-glass-search .sw-pop-tag:hover { background: rgba(0, 0, 0, 0.08); }

.mobile-search-trigger { display: none; }
.sheet-backdrop { display: none; }
.sheet-header { display: none; }

@media (max-width: 900px) {
  .hero-slide { height: auto; flex-direction: column; align-items: stretch; background: #ffffff; }
  .slide-left-bg { display: none; }
  .slide-bg { position: relative; width: 100%; height: 260px; clip-path: none; order: 1; }
  .hero-slide .wrap { order: 2; padding: 24px 20px 80px; }
  .slide-content { max-width: 100%; text-align: left; }
  .slide-title { font-size: 1.8rem; }
  .slide-price-current { font-size: 20px; }
  .hero-prev, .hero-next { display: none; }
  .hero-dots { left: 50%; transform: translateX(-50%); bottom: 15px; }
  .hero .wrap { flex-direction: column; }
  
  .hero-search-overlay {
    position: absolute;
    inset: auto 0 0 0;
    padding: 0 16px 16px;
    justify-content: center;
    z-index: 10;
  }
  
  .mobile-search-trigger {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 14px 16px;
    width: 100%;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    cursor: pointer;
    gap: 14px;
    pointer-events: auto;
  }
  .trigger-icon { color: var(--brand, #1a6b2a); display: flex; }
  .trigger-text { display: flex; flex-direction: column; flex: 1; }
  .tt-main { font-weight: 700; font-size: 15px; color: #111; }
  .tt-sub { font-size: 12px; color: #666; margin-top: 2px; }
  .trigger-chevron { color: #666; display: flex; }

  .hero-glass-search {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    max-width: 100%;
    background: #fff;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-radius: 20px 20px 0 0;
    padding: 24px 20px 32px;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.15);
    transform: translateY(100%);
    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    border: none;
  }
  
  #mobile-search-toggle:checked ~ .hero-glass-search {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  
  .sheet-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    opacity: 0;
    pointer-events: none;
    transition: opacity 250ms ease;
  }
  #mobile-search-toggle:checked ~ .sheet-backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  .sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 800;
    color: #111;
  }
  .sheet-close {
    cursor: pointer;
    color: #555;
    padding: 4px;
    display: flex;
  }

  .hero-glass-search .sw-select, .hero-glass-search .sw-btn {
    min-height: 48px;
    font-size: 15px;
  }
  .hero-glass-search label { font-size: 11px; margin-bottom: 8px; color: #555; }
  .hero-glass-search .sw-grid { gap: 16px; grid-template-columns: 1fr; }
  .hero-glass-search .sw-field:nth-child(3) { grid-column: auto; }
  .hero-glass-search .sw-tab { font-size: 14px; padding-bottom: 12px; color: #666; }
  .hero-glass-search .sw-tab.active { color: var(--brand, #1a6b2a); border-bottom-color: var(--brand, #1a6b2a); }
  .hero-glass-search .sw-popular-label { color: #666; }
  .hero-glass-search .sw-pop-tag { color: #111; background: #f3f4f6; border-color: #e5e7eb; }
  .hero-glass-search .sw-select { border: 1px solid #d1d5db; background: #fff; }
}

/* Upcoming Events — compact carousel cards */
.event-mini-card {
  flex: 0 0 240px;
  scroll-snap-align: start;
  background: #fff;
  border: 1px solid var(--border, #E2EAE4);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
@media (min-width: 768px) {
  .event-mini-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    transform: translateY(-2px);
    border-color: var(--g2, #0E5E26);
  }
}
.emc-top {
  position: relative;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #f0f4f1, #e0ebe2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.emc-icon { color: rgba(14, 94, 38, .35); }
.emc-icon i { width: 26px; height: 26px; }
.emc-top img { width: 100%; height: 100%; object-fit: cover; display: block; }
.emc-date {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #fff;
  border-radius: 8px;
  padding: 4px 8px;
  text-align: center;
  min-width: 36px;
  box-shadow: 0 1px 3px rgba(17,22,18,.12);
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.emc-dnum { font-size: 13px; font-weight: 800; color: var(--ink, #111612); }
.emc-dmon { font-size: 8px; font-weight: 800; color: var(--g2, #0E5E26); text-transform: uppercase; letter-spacing: .3px; }
.emc-body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 5px; }
.emc-cat { font-size: 10px; font-weight: 800; color: var(--g2, #0E5E26); text-transform: uppercase; letter-spacing: .4px; }
.emc-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink2, #1f2721);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em;
}
.emc-venue {
  font-size: 11px;
  color: var(--ink4, #6d7d72);
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Promo cards — "Know your car's true worth" / "Find your perfect car" */
.promo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .promo-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
.promo-card {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #fff;
  border: 1px solid var(--border, #E2EAE4);
  border-radius: 20px;
  padding: 18px;
  cursor: pointer;
  transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
}
@media (min-width: 768px) {
  .promo-card:hover {
    box-shadow: 0 10px 28px rgba(17,22,18,.07);
    transform: translateY(-2px);
    border-color: var(--border2, #ccd7cf);
  }
}
.promo-card-img {
  flex: 0 0 116px;
  width: 116px;
  height: 96px;
  border-radius: 14px;
  overflow: hidden;
  background: var(--g-ll, #eef6f1);
}
.promo-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.promo-card-body {
  flex: 1;
  min-width: 0;
}
.promo-card-title {
  font-family: var(--font-d);
  font-size: 19px;
  font-weight: 800;
  color: var(--ink, #111612);
  margin: 0 0 4px;
  line-height: 1.2;
}
.promo-card-sub {
  font-size: 13px;
  color: var(--ink4, #6d7d72);
  margin: 0 0 14px;
  line-height: 1.4;
}
.promo-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1.5px solid var(--g2, #0E5E26);
  background: #fff;
  color: var(--g2, #0E5E26);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s ease;
  font-family: var(--font-b);
}
.promo-card-btn:hover {
  background: var(--g2, #0E5E26);
  color: #fff;
}
@media (max-width: 480px) {
  .promo-card {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  .promo-card-img {
    width: 100%;
    height: 140px;
  }
}
</style>
<div class="home-page">

  <!-- Hero -->
  <div class="hero" id="hero">
    <div class="hero-slides" id="hero-slides">
      ${(HERO_SLIDES || []).map((s, idx) => {
        const hasPrice = s.currentPrice || s.originalPrice;
        const hasColors = s.exteriorColorName || s.interiorColorName;
        const specs = [
          [s.spec1Label, s.spec1Value],
          [s.spec2Label, s.spec2Value],
          [s.spec3Label, s.spec3Value],
        ].filter(([label, value]) => label && value);
        return `
      <div class="hero-slide" data-idx="${idx}">
        <div class="slide-left-bg"></div>
        <div class="slide-bg" style="background-image:url('${s.bg || ''}');">
          <button class="slide-hero-cta" onclick="${s.slug ? `AV.openDetail('${s.slug}')` : `AV.goTo('cars')`}">
            ${s.slug ? 'View This Car' : 'Browse Cars'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
          <div style="position:absolute; bottom:22px; right:24px; display:flex; gap:10px; z-index:4;">
            <button class="slide-img-mini" onclick="window.location.href='/book-service'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Book Service</button>
          </div>
        </div>
        <div class="wrap">
          <div class="slide-content">
          <h2 class="slide-title">${s.title || ''}</h2>
          ${hasPrice ? `
            <div class="slide-price">${s.originalPrice ? `<del>${s.originalPrice}</del>` : ''}<span class="slide-price-current">${s.currentPrice || ''}</span></div>
          ` : ''}
          ${hasColors ? `
            <div class="slide-color-indicator">
              ${s.exteriorColorName ? `<span style="display:flex; align-items:center;"><span class="slide-dot" style="background:${s.exteriorColorHex || '#ffffff'};"></span> ${s.exteriorColorName}</span>` : ''}
              ${s.interiorColorName ? `<span style="display:flex; align-items:center;"><span class="slide-dot" style="background:${s.interiorColorHex || '#222222'};"></span> ${s.interiorColorName}</span>` : ''}
            </div>
          ` : ''}
          ${specs.length ? `
            <div class="slide-specs-grid">
              ${specs.map(([label, value]) => `<div class="slide-spec-item"><span class="slide-spec-label">${label}</span><span class="slide-spec-value">${value}</span></div>`).join('')}
            </div>
          ` : ''}
          </div>
        </div>
      </div>`;
      }).join('')}
    </div>

    <!-- Navigation Buttons -->
    <button class="hero-prev" onclick="AV.heroNav(-1)" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></button>
    <button class="hero-next" onclick="AV.heroNav(1)" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg></button>
    <div class="hero-dots" id="hero-dots">
      ${(HERO_SLIDES || []).map((s, idx) => `<div class="hero-dot${idx === 0 ? ' active' : ''}" onclick="AV.heroGo(${idx})"></div>`).join('')}
    </div>
    <div class="hero-progress" id="hero-progress"></div>
    
    <!-- Transparent Square Search Overlay -->
    <div class="hero-search-overlay wrap">
      <input type="checkbox" id="mobile-search-toggle" hidden>
      <label for="mobile-search-toggle" class="mobile-search-trigger">
        <div class="trigger-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <div class="trigger-text">
          <span class="tt-main">Find your car</span>
          <span class="tt-sub">Brand, budget & fuel type</span>
        </div>
        <div class="trigger-chevron"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
      </label>

      <label for="mobile-search-toggle" class="sheet-backdrop"></label>

      <div class="hero-glass-search">
        <div class="sheet-header">
           <span>Search Cars</span>
           <label for="mobile-search-toggle" class="sheet-close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></label>
        </div>
        <div class="sw-tabs">
          <div class="sw-tab active" onclick="AV.setHomeSearchTab('new', this)">New Cars</div>
          <div class="sw-tab" onclick="AV.setHomeSearchTab('used', this)">Used Cars</div>
        </div>
        <div class="sw-body">
          <div class="sw-grid">
            <div class="sw-field"><label>Brand</label><select class="sw-select" id="sw-brand"><option value="">All Brands</option>${[...new Set(db.map(c => c.brand))].map(b => `<option>${b}</option>`).join('')}</select></div>
            <div class="sw-field"><label>Budget</label><select class="sw-select" id="sw-budget"><option value="">Any Budget</option><option value="15">Under Rs. 15L</option><option value="25">Rs. 15L – 25L</option><option value="40">Rs. 25L – 40L</option><option value="60">Rs. 40L – 60L</option><option value="100">Rs. 60L – 1Cr</option><option value="999">Above Rs. 1Cr</option></select></div>
            <div class="sw-field"><label>Fuel</label><select class="sw-select" id="sw-fuel"><option value="">All Types</option><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
            <div class="sw-field"><label id="sw-fourth-label">Body Type</label><select class="sw-select" id="sw-fourth"><option value="">All Body Types</option><option value="suv">SUV</option><option value="crossover">Crossover</option><option value="sedan">Sedan</option><option value="hatchback">Hatchback</option><option value="coupe">Coupe</option><option value="mpv">MPV</option><option value="offroad">Off-road</option><option value="pickup">Pickup</option><option value="microcar">Microcar</option><option value="wagon">Wagon</option><option value="van">Van</option></select></div>
            <button class="sw-btn" onclick="AV.swSearch()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Search Cars</button>
          </div>
        </div>
        <div class="sw-popular"><span class="sw-popular-label">Popular:</span>${['Creta', 'Swift', 'Seltos', 'Fortuner', 'Atto 3', 'Grand Vitara'].map(t => `<span class="sw-pop-tag" onclick="AV.goTo('cars',{q:'${t}'})">${t}</span>`).join('')}</div>
      </div>
    </div>
  </div>
  <div class="home-discover">
    <div class="wrap">
      <div class="home-cat-header">
        <span class="home-cat-eyebrow">Browse by body type</span>
        <h2 class="home-cat-title">What Car you  <em>Want to Own?</em></h2>
      </div>
      <div class="home-discover__scroll">${categories.map(pill).join('')}</div>
    </div>
  </div>

  <!-- New Cars -->
  <section class="home-section home-section--white" id="home-new-cars">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          
          <h2 class="home-title">You might like</h2>
         
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <button type="button" class="home-link" onclick="AV.goTo('cars')">Show more ${IC.chevR || '→'}</button>
          <div class="carousel-nav-arrows">
            <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('home-grid', -1)" aria-label="Scroll left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('home-grid', 1)" aria-label="Scroll right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>
      <div class="home-chips filter-chips" id="home-chips">${['All', 'Electric', 'Hybrid', 'Petrol', 'Diesel'].map((t, i) => `<span class="chip ${i === 0 ? 'active' : ''}" onclick="AV.homeFilter('${t}',this)">${t}</span>`).join('')}</div>
      <div class="home-carousel car-carousel" id="home-grid">${gridCars.map(carCard).join('')}</div>
    </div>
  </section>

  <!-- Trending Cars -->
  ${trending.length ? `
  <section class="home-section home-section--white" id="home-trending-cars">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">READY IN KATHMANDU</span>
          <h2 class="home-title">New cars people are buying</h2>
         
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <button type="button" class="home-link" onclick="AV.goTo('cars')">Show more ${IC.chevR || '→'}</button>
          <div class="carousel-nav-arrows">
            <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('trending-grid', -1)" aria-label="Scroll left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('trending-grid', 1)" aria-label="Scroll right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>
      <div class="home-carousel car-carousel" id="trending-grid">${trending.map(carCard).join('')}</div>
    </div>
  </section>` : ''}

  <!-- Upcoming Cars -->
  ${(UPCOMING_DATA && UPCOMING_DATA.length) ? `
  <section class="home-section home-section--white" id="home-upcoming-cars">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Coming soon</span>
          <h2 class="home-title">Upcoming Cars</h2>
          
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <button type="button" class="home-link" onclick="AV.goTo('upcoming')">Show all ${IC.chevR || '→'}</button>
          <div class="carousel-nav-arrows">
            <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('upcoming-grid', -1)" aria-label="Scroll left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('upcoming-grid', 1)" aria-label="Scroll right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>
      <div class="home-carousel car-carousel" id="upcoming-grid">${UPCOMING_DATA.slice(0, 12).map(upcomingCard).join('')}</div>
    </div>
  </section>` : ''}

  

  <!-- Brands -->
  <section class="home-section home-section--white" id="home-brands">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Manufacturers</span>
          <h2 class="home-title">Shop by Brand</h2>
        </div>
        <button type="button" class="home-link" id="toggle-brands-btn" onclick="window.location.href='/brands'">All brands</button>
      </div>
      <div class="home-brands brands-grid" id="brands-grid-container">${brands.map(brandCard).join('')}</div>
    </div>
  </section>

  <!-- Smart tools -->
  <section class="home-section">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Plan your purchase</span>
          <h2 class="home-title">Work out the money first</h2>
         
        </div>
      </div>
      <div class="home-tools">
        ${tool('/whatcarcanyouaffoard', 'What can you afford?', 'Tell us your budget, we\'ll show what is actually available here.', dicon('<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>', 'var(--g3)', '<polyline points="20 6 9 17 4 12"/>'))}
        ${tool('/caremi', 'EMI Calculator', 'See your monthly payment before you go to the bank.', dicon('<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/>', 'var(--gold)', '<circle cx="12" cy="12" r="3.5" fill="#fff" stroke="none"/>'))}
        ${tool('#', 'Compare Cars', 'Two cars, side by side. Price, mileage, variants.', dicon('<path d="M18 20V10M12 20V4M6 20v-6"/>', 'var(--blue)', '<circle cx="12" cy="12" r="3.5" fill="#fff" stroke="none"/>'), 'AV.goTo(\'compare\')')}
        ${tool('/chargingstation', 'EV Charging Map', 'Find charging stations across Nepal.', dicon('<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>', 'var(--teal)', '<circle cx="12" cy="12" r="3.5" fill="#fff" stroke="none"/>'))}
      </div>
    </div>
  </section>

  <!-- Budget -->
  <section class="home-section home-section--white">
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

  <!-- Budget calculator -->
  <section class="home-section home-section--white bcalc-section">
    <div class="wrap">
      <div class="bcalc-card">
        <span class="home-eyebrow">Finance</span>
        <h2 class="bcalc-title">How much car can <span id="bcalcHeadlineAmt">Rs. ${bcalcDefaults.monthly.toLocaleString('en-IN')}</span> a month buy?</h2>

        <div class="bcalc-grid">
          <div class="bcalc-field">
            <label for="bcalcMonthly">Monthly payment</label>
            <div class="bcalc-input-wrap">
              <span class="bcalc-prefix">Rs.</span>
              <input type="number" id="bcalcMonthly" min="5000" max="500000" step="1000" value="${bcalcDefaults.monthly}" oninput="AV.calcHomeBudgetPrice()">
            </div>
          </div>
          <div class="bcalc-field">
            <label for="bcalcDown">Down payment</label>
            <div class="bcalc-input-wrap">
              <span class="bcalc-prefix">Rs.</span>
              <input type="number" id="bcalcDown" min="0" max="20000000" step="50000" value="${bcalcDefaults.down}" oninput="AV.calcHomeBudgetPrice()">
            </div>
          </div>
          <div class="bcalc-field">
            <label for="bcalcTerm">Term</label>
            <div class="bcalc-input-wrap">
              <select id="bcalcTerm" onchange="AV.calcHomeBudgetPrice()">
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60" selected>60 months</option>
                <option value="72">72 months</option>
                <option value="84">84 months</option>
              </select>
            </div>
          </div>
          <div class="bcalc-field">
            <label for="bcalcRate">Interest</label>
            <div class="bcalc-input-wrap">
              <input type="number" id="bcalcRate" min="5" max="20" step="0.1" value="${bcalcDefaults.rate}" oninput="AV.calcHomeBudgetPrice()">
              <span class="bcalc-suffix">% p.a.</span>
            </div>
          </div>
        </div>

        <div class="bcalc-result">
          <div class="bcalc-result-left">
            <div class="bcalc-result-label">You can look at cars around</div>
            <div class="bcalc-result-price"><span id="bcalcPrice">${bcalcFmtPrice}</span> <span class="unit">est. price</span></div>
            <div class="bcalc-result-count"><span id="bcalcCount">${bcalcCarCount}</span> cars in this range</div>
          </div>
          <button type="button" class="bcalc-cta" onclick="AV.goHomeBudgetCars()">Show me these cars →</button>
        </div>

        <p class="bcalc-disclaimer">This is only an estimate. No credit check, and nothing goes on your record.</p>
      </div>
    </div>
  </section>

  <!-- Events -->
  <section class="home-section home-section--white" id="home-events">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Auto culture</span>
          <h2 class="home-title">Upcoming Events</h2>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <button type="button" class="home-link" onclick="window.location.href='/events.html'">All events ${IC.chevR || '→'}</button>
          <div class="carousel-nav-arrows">
            <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('events-grid', -1)" aria-label="Scroll left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('events-grid', 1)" aria-label="Scroll right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>
      <div class="home-carousel car-carousel" id="events-grid">${EVENTS_DATA.map(eventMiniCard).join('')}</div>
    </div>
  </section>

  <!-- Services -->
  <section class="home-section home-services home-section--white">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">We don't disappear after the sale</span>
          <h2 class="home-title">Things we do for your car</h2>

        </div>
        <a href="/services" class="home-link">See all services</a>
      </div>
      <div class="svc-grid">
        ${svc('/dotm-services', 'Bluebook & DOTM work', 'Renewal, name transfer, all the paperwork. We stand in the line so you don\'t have to.', svc3dDoc(), 'See what it costs')}
        ${svc('/maintenance-repairs', 'Servicing & repairs', 'Oil change to engine work. We tell you the price first, then we touch the car.', svc3dWrench(), 'Book a slot')}
        ${svc('/parts-accessories', 'Parts & accessories', 'Genuine parts, or good aftermarket if you want to save. Fitted the same day.', svc3dBox(), 'Find your part')}
        ${svc('/insurance-finance', 'Insurance & loan', 'Insurance and a bank loan sorted in one visit. No running between offices.', svc3dShield(), 'Get a quote')}
      </div>
    </div>
  </section>

  <!-- Promo cards -->
  <section class="home-section home-section--white">
    <div class="wrap home-section__inner">
      <div class="promo-grid">
        <div class="promo-card" onclick="window.location.href='/sellyourcar'">
          <div class="promo-card-img"><img src="/assets/images/hero_images/fortuner.jpg" alt="Know your car's true worth" loading="lazy"></div>
          <div class="promo-card-body">
            <h3 class="promo-card-title">Wanna sell your car?</h3>
            <p class="promo-card-sub">Get a free valuation of your car</p>
            <button type="button" class="promo-card-btn" onclick="event.stopPropagation();window.location.href='/sellyourcar'">Get my offer ${IC.chevR || '→'}</button>
          </div>
        </div>
        <div class="promo-card" onclick="AV.goTo('cars')">
          <div class="promo-card-img"><img src="/assets/images/hero_images/Tata-Motors-Nexon-EV.jpg" alt="Find your perfect car in Nepal" loading="lazy"></div>
          <div class="promo-card-body">
            <h3 class="promo-card-title">Buy a new car</h3>
            <p class="promo-card-sub">Find car you love at the best price</p>
            <button type="button" class="promo-card-btn" onclick="event.stopPropagation();AV.goTo('cars')">Browse all cars ${IC.chevR || '→'}</button>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>`;
};
