
/* ══════════════════════════════
   AUTOVIINDU — APP ENGINE
══════════════════════════════ */
/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — MASTER CARS DATABASE
   Updated: March 2026
   • Images: assets/images/cars/[slug]-[01-04].jpg
   • Prices: NPR (from CG Motorcorp dealer price sheet)
   • budgetTier: Under 20L / Under 30L / Under 40L /
                 Under 50L / Above 50L  (1L = NPR 100,000)
═══════════════════════════════════════════════════════ */


(function () {
  'use strict';

  window.AV = window.AV || {};
  window.AV.noImg = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<path d="M8 40 L12 28 Q14 24 19 24 L45 24 Q50 24 52 28 L56 40" fill="none" stroke="#c3ccc5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="6" y="40" width="52" height="10" rx="3" fill="none" stroke="#c3ccc5" stroke-width="2.5"/>' +
    '<circle cx="18" cy="50" r="5" fill="#f8f9fa" stroke="#c3ccc5" stroke-width="2.5"/>' +
    '<circle cx="46" cy="50" r="5" fill="#f8f9fa" stroke="#c3ccc5" stroke-width="2.5"/>' +
    '</svg>'
  );

  function startApp() {
    let CARS_DB = window.CARS_DB || [];
    let USED = window.USED_CARS_DB || [];
    document.addEventListener('av:cars-updated', function() {
      USED = window.USED_CARS_DB || [];
      CARS_DB = window.CARS_DB || [];
    });

    const Rs = n => n >= 100000 ? `Rs. ${(n / 100000).toFixed(2)}L` : `Rs. ${n.toLocaleString()}`;
    window.Rs = Rs;
    const calcEMI = (p, ar, m) => { const r = ar / 12 / 100; return r === 0 ? p / m : p * (r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1) };
    const carBySlug = s => CARS_DB.find(c => c.slug === s || String(c.id) === String(s)) || USED.find(c => String(c.id) === String(s) || c.slug === s);
    const carPrice = c => c && c.variants && c.variants[0] ? c.variants[0].price : (c && c.priceNum ? c.priceNum : 0);
    const carPriceLabel = c => carPrice(c) ? window.Rs(carPrice(c)) : (c && c.price ? c.price : 'Price on Request');
    const carIdentifier = c => c ? (c.slug || c.id) : '';
    const fmtR = r => r.toFixed(1);
    const IC = {
      search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      chevR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg>`,
      star: `<svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
      phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
      check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>`,
      bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      cmp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
      calc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="9.5" y2="11"/><line x1="12" y1="11" x2="13.5" y2="11"/><line x1="8" y1="15" x2="9.5" y2="15"/><line x1="12" y1="15" x2="13.5" y2="15"/><line x1="8" y1="19" x2="16" y2="19"/></svg>`,
      x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    };

    let compareList = [];
    let usedCompareList = [];
    let wishlist = [];
    let galIdx = 0;
    let activeVariant = {};
    let heroTimer = null;

    /* ─ TOAST ─ */
    function toast(msg, type = '') {
      const wrap = document.getElementById('toast-wrap');
      if (!wrap) return;
      const t = document.createElement('div');
      t.className = `toast ${type}`;
      t.innerHTML = `<span>${type === 'success' ? '<i data-lucide="check"></i>' : '<i data-lucide="info"></i>'}</span>${msg}`;
      wrap.appendChild(t);
      setTimeout(() => t.remove(), 3000);
    }

    /* ─ COMPARE ─ */
    function toggleCompare(slug) {
      const car = carBySlug(slug); if (!car) return;
      const idx = compareList.indexOf(slug);
      if (idx > -1) { compareList.splice(idx, 1); toast(`${car.brand} ${car.model} removed`) }
      else { if (compareList.length >= CMP_MAX) { toast(`Max ${CMP_MAX} cars`, 'error'); return } compareList.push(slug); toast(`${car.brand} ${car.model} added to compare`, 'success') }
      updateCompareTray(); updateCmpBtns();
      if (location.hash === '#compare') renderCompare();
    }
    function clearCompare() {
      compareList.splice(0);
      updateCompareTray(); updateCmpBtns();
      if (location.hash === '#compare') renderCompare();
    }
    function updateCompareTray() {
      const tray = document.getElementById('cmp-tray'), slots = document.getElementById('cmp-slots');
      if (!tray || !slots) return;
      if (!compareList.length) { tray.classList.remove('show'); return }
      tray.classList.add('show');
      let h = compareList.map(s => { const c = carBySlug(s); if (!c) return ''; return `<div class="cmp-slot"><img src="${c.images[0]}" alt=""><span>${c.brand} ${c.model}</span><span class="cmp-rm" onclick="AV.toggleCompare('${s}')"><i data-lucide="x"></i></span></div>` }).join('');
      if (compareList.length < CMP_MAX) h += `<div class="cmp-add">+ Add car</div>`;
      slots.innerHTML = h;
    }
    function updateCmpBtns() {
      document.querySelectorAll('[data-cmp]').forEach(b => {
        const inList = compareList.includes(b.dataset.cmp);
        b.textContent = inList ? '<i data-lucide="check"></i> Added' : '+ Compare';
        b.classList.toggle('added', inList);
      });
      document.querySelectorAll('[data-cmp-slug]').forEach(b => {
        b.classList.toggle('added', compareList.includes(b.dataset.cmpSlug));
      });
    }

    /* ─ WISHLIST ─ */
    function toggleWish(slug, btn) {
      const idx = wishlist.indexOf(slug);
      if (idx > -1) wishlist.splice(idx, 1); else wishlist.push(slug);
      if (btn) btn.classList.toggle('active', wishlist.includes(slug));
    }

    /* ─ CAR CARD ─ */
    const ICON_VIEW_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    const ICON_COMPARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="M16 21l4-4-4-4"/><path d="M20 17H4"/></svg>`;

    function carCard(car) {
      const inCmp = compareList.includes(car.slug);
      const imgSrc = (car.images && car.images.length && car.images[0]) ? car.images[0] : (car.thumb || car.img || '');
      const rawPrice = car.variants && car.variants[0] && car.variants[0].price;
      const priceDisplay = rawPrice ? (typeof rawPrice === 'number' ? window.Rs(rawPrice) : rawPrice) : (car.price || 'TBA');
      const subtitle = [car.year || '', car.body || '', car.type || ''].filter(Boolean).join(' &middot; ');
      const emiDisplay = car.baseEMI ? `Rs. ${car.baseEMI.toLocaleString()}/mo` : '';

      return `<div class="car-card" onclick="AV.openDetail('${car.slug}')">
    <div class="cc-top">
      <h3 class="cc-name">${car.brand} ${car.model}</h3>
      <div class="cc-sub">${subtitle}</div>
    </div>

    <div class="cc-img-wrap">
      <button class="cc-cmp-btn${inCmp ? ' added' : ''}" data-cmp-slug="${car.slug}" onclick="event.stopPropagation();AV.toggleCompare('${car.slug}')" aria-label="${inCmp ? 'Remove from compare' : 'Add to compare'}" title="${inCmp ? 'Added to compare' : 'Add to compare'}">${ICON_COMPARE}</button>
      <img src="${imgSrc}" alt="${car.brand} ${car.model}" loading="lazy" class="cc-img" onerror="this.onerror=null;this.src=window.AV.noImg;this.classList.add('cc-img--empty')">
    </div>

    <div class="cc-foot">
      <div class="cc-price-block">
        <div class="cc-price">${priceDisplay}</div>
        ${emiDisplay ? `<div class="cc-emi">EMI from <span>${emiDisplay}</span></div>` : ''}
      </div>
      <button class="cc-btn-view" onclick="event.stopPropagation();AV.openDetail('${car.slug}')">View Details ${ICON_VIEW_ARROW}</button>
    </div>
  </div>`;
    }

    /* ─ USED CAR CARD ─ */
    function usedCard(car) {
      const inUCmp = usedCompareList.includes(car.id);
      const imgSrc = (car.images && car.images[0]) || car.img || '';
      const subtitle = [car.year || '', car.body || '', car.type || ''].filter(Boolean).join(' &middot; ');
      const emiDisplay = car.emiEst ? `Rs. ${Math.round(car.emiEst).toLocaleString()}/mo` : '';

      return `<div class="car-card" onclick="AV.openUsedDetail('${car.id}')">
    <div class="cc-top">
      <h3 class="cc-name">${car.brand} ${car.model}</h3>
      <div class="cc-sub">${subtitle}</div>
    </div>

    <div class="cc-img-wrap">
      <button class="cc-cmp-btn${inUCmp ? ' added' : ''}" data-ucmp-id="${car.id}" onclick="event.stopPropagation();AV.usedToggleCompare('${car.id}')" aria-label="${inUCmp ? 'Remove from compare' : 'Add to compare'}" title="${inUCmp ? 'Added to compare' : 'Add to compare'}">${ICON_COMPARE}</button>
      ${car.certified ? '<span class="cc-tag cc-tag-cert">Certified</span>' : ''}
      ${car.km ? `<span class="cc-tag cc-tag-km">${car.km} km</span>` : ''}
      <img src="${imgSrc}" alt="${car.brand} ${car.model}" loading="lazy" class="cc-img" onerror="this.onerror=null;this.src=window.AV.noImg;this.classList.add('cc-img--empty')">
    </div>

    <div class="cc-foot">
      <div class="cc-price-block">
        <div class="cc-price">${car.price}</div>
        ${emiDisplay ? `<div class="cc-emi">EMI from <span>${emiDisplay}</span></div>` : ''}
      </div>
      <button class="cc-btn-view" onclick="event.stopPropagation();AV.openUsedDetail('${car.id}')">View Details ${ICON_VIEW_ARROW}</button>
    </div>
  </div>`;
    }


    /* ─ HOME ─ */

    /* ─ HOME ─ */

    const HERO_SLIDES = [
      {
        bg: 'assets/images/car_images/hyundai/ioniq-5/exterior/ioniq-5-exterior-left-side-view.avif',
        badge: 'New Arrival',
        title: 'Hyundai<br><em>IONIQ 5</em>',
        sub: '481 km range · 800V ultra-fast charging.',
        offer: {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M14.615 1.595a.75.75 0 0 1 .36.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143z"/>
      </svg>`,
          label: 'EV Offer', val: 'Zero road tax'
        },
        slug: 'hyundai-ioniq5'
      },
      {
        bg: 'assets/images/car_images/maruti-suzuki/grand-vitara/exterior/maruti-suzuki-grand-vitara-exterior-front-white-bg.jpg',
        badge: 'Best Seller',
        title: 'Hyundai<br><em>Creta</em>',
        sub: 'Dual 10.25" screens · Level 2 ADAS.',
        offer: {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 12v10H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>`,
          label: 'Offer', val: 'Rs. 2L cashback'
        },
        slug: 'hyundai-creta'
      },
      {
        bg: 'assets/images/car_images/byd/atto-2/exterior/byd-atto-2-exterior-side-left-white-bg.png',
        badge: 'Hill Conqueror',
        title: 'Toyota<br><em>Fortuner</em>',
        sub: '221mm ground clearance · 500 Nm torque.',
        offer: {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 20 L8.5 8 L12 13 L15.5 7 L21 20 Z"/>
        <path d="M1 20h22"/>
      </svg>`,
          label: 'Nepal Special', val: '5-year warranty'
        },
        slug: 'toyota-fortuner'
      },
      {
        bg: 'assets/images/car_images/toyota/land-cruiser-250/exterior/image-6.jpg',
        badge: 'Fuel Champion',
        title: 'Toyota<br><em>Prius PHEV</em>',
        sub: '40+ km/l · 26 km pure EV range.',
        offer: {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>`,
          label: 'Green Deal', val: 'Free solar install'
        },
        slug: 'toyota-prius'
      },
    ];
    const BASE = 'assets/images/brands/';

    const BRANDS = [
      { name: 'Hyundai', count: '165 cars', logo: `${BASE}hyundai.png` },
      { name: 'Suzuki', count: '81 cars', logo: `${BASE}suzuki.png` },
      { name: 'Tata', count: '64 cars', logo: `${BASE}tata.png` },
      { name: 'Ford', count: '57 cars', logo: `${BASE}ford.png` },
      { name: 'Kia', count: '50 cars', logo: `${BASE}kia.png` },
      { name: 'Toyota', count: '28 cars', logo: `${BASE}toyota.png` },
      { name: 'Nissan', count: '28 cars', logo: `${BASE}nissan.png` },
      { name: 'Volkswagen', count: '20 cars', logo: `${BASE}volkswagen.png` },
      { name: 'Renault', count: '20 cars', logo: `${BASE}renault.png` },
      { name: 'Mahindra', count: '20 cars', logo: `${BASE}mahindra.png` },
      { name: 'BYD', count: '15 cars', logo: `${BASE}byd.png` },
      { name: 'MG', count: '14 cars', logo: `${BASE}mg.png` },
      { name: 'Skoda', count: '13 cars', logo: `${BASE}skoda.png` },
      { name: 'Honda', count: '10 cars', logo: `${BASE}honda.png` },
      { name: 'Deepal', count: '3 cars', logo: `${BASE}deepal.png` },
      { name: 'Chery', count: '6 cars', logo: `${BASE}chery.png` },
      { name: 'Proton', count: '4 cars', logo: `${BASE}proton.png` },
      { name: 'Haval', count: '5 cars', logo: `${BASE}haval.png` },
      { name: 'Geely', count: '5 cars', logo: `${BASE}geely.png` },
      { name: 'Mazda', count: '4 cars', logo: `${BASE}mazda.png` },
      { name: 'Maxus', count: '3 cars', logo: `${BASE}maxus.png` },
      { name: 'Mercedes', count: '14 cars', logo: `${BASE}mercedes-benz.png` },
      { name: 'BMW', count: '12 cars', logo: `${BASE}bmw.png` },
      { name: 'Audi', count: '10 cars', logo: `${BASE}audi.png` },
      { name: 'Lexus', count: '7 cars', logo: `${BASE}lexus.png` },
    ];
    const BUDGETS = [
      {
        label: 'Under Rs. 30L',
        count: '12 cars',
        filter: 'budget-30',
        examples: 'Tata Tiago EV · MG Comet · Alto K10',
        bg: 'assets/images/car_images/renault/kwid/exterior/Renault_Kwid_Photo_1.webp', // compact hatchback
        overlay: 'linear-gradient(135deg,rgba(15,118,110,.88),rgba(6,78,59,.75))',   // teal-green (budget/eco)
      },
      {
        label: 'Rs. 30L–50L',
        count: '34 cars',
        filter: 'budget-50',
        examples: 'Hyundai Venue · Tata Nexon · Kia Sonet',
        bg: 'assets/images/car_images/hyundai/kona-electric/exterior/090508599Hyundai_Kona_ev_1_Price_in_Nepal.jpg', // compact SUV
        overlay: 'linear-gradient(135deg,rgba(37,99,235,.88),rgba(29,78,216,.75))',   // royal blue (mid range)
      },
      {
        label: 'Rs. 50L–80L',
        count: '28 cars',
        filter: 'budget-80',
        examples: 'Hyundai Creta · Kia Seltos · MG Hector',
        bg: 'assets/images/car_images/ford/everest/exterior/084609325Ford_Everest_1_price_Nepal.jpg', // mid SUV
        overlay: 'linear-gradient(135deg,rgba(202,138,4,.88),rgba(161,98,7,.75))',    // amber-gold (popular segment)
      },
      {
        label: 'Rs. 80L–1.2Cr',
        count: '18 cars',
        filter: 'budget-120',
        examples: 'Toyota Fortuner · Hyundai Tucson · Kia Sportage',
        bg: 'assets/images/car_images/nissan/x-trail/exterior/22TDIEULHD_XT_TEKNA_PS_001_pace016-d.jpg.ximg_.l_12_h.smart_.jpg', // full-size SUV
        overlay: 'linear-gradient(135deg,rgba(124,45,18,.88),rgba(154,52,18,.75))',   // burnt orange (premium)
      },
      {
        label: 'Rs. 1.2Cr–2Cr',
        count: '11 cars',
        filter: 'budget-200',
        examples: 'BMW 3 Series · Mercedes C-Class · Audi A4',
        bg: 'assets/images/car_images/ford/ranger-raptor/exterior/085011821Ford_Raptor_2_price_Nepal.jpg', // luxury sedan
        overlay: 'linear-gradient(135deg,rgba(30,27,75,.9),rgba(49,46,129,.78))',     // deep indigo (luxury)
      },
      {
        label: 'Above Rs. 2Cr',
        count: '9 cars',
        filter: 'budget-2cr+',
        examples: 'BMW X5 · Mercedes GLE · Land Cruiser 300',
        bg: 'assets/images/car_images/audi/q7/exterior/audi-q7-exterior-front-white-bg.jpg', // ultra-luxury
        overlay: 'linear-gradient(135deg,rgba(15,15,15,.92),rgba(40,40,40,.82))',     // near-black carbon (ultra-lux)
      },
    ];

    const OFFERS = [
      {
        title: 'Extended Warranty',
        color: '#4CAF72', iconBg: 'rgba(76,175,114,.18)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
      },
      {
        title: 'Free Pickup / Drop',
        color: '#6aadff', iconBg: 'rgba(100,160,255,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
      },
      {
        title: 'Ceramic / Underbody',
        color: '#FFBE50', iconBg: 'rgba(255,190,80,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
      },
      {
        title: 'Dashcam Install',
        color: '#c882ff', iconBg: 'rgba(200,130,255,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`
      },
      {
        title: 'Paint Film (PPF)',
        color: '#50d2b4', iconBg: 'rgba(80,210,180,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      },
      {
        title: 'Loan Fee Waiver',
        color: '#ff6464', iconBg: 'rgba(255,100,100,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
      },
      {
        title: 'Festival Bonus',
        color: '#FFC83C', iconBg: 'rgba(255,200,60,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
      },
      {
        title: 'Fuel Voucher',
        color: '#4CAF72', iconBg: 'rgba(76,175,114,.18)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14"/><path d="M2 22h14M13 6V2h2l4 4v10a2 2 0 0 1-2 2v0"/><path d="M13 10h4"/></svg>`
      },
      {
        title: 'Free Accessories',
        color: '#6aadff', iconBg: 'rgba(100,160,255,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
      },
      {
        title: 'Referral Bonus',
        color: '#FFBE50', iconBg: 'rgba(255,190,80,.15)',
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
      }
    ];
    let heroIdx = 0;

    function enableDragScroll(selector) {
      const els = document.querySelectorAll(selector);
      els.forEach(el => {
        let isDown = false;
        let startX;
        let scrollLeft;
        let hasMoved = false;

        el.addEventListener('mousedown', (e) => {
          isDown = true;
          hasMoved = false;
          startX = e.pageX - el.offsetLeft;
          scrollLeft = el.scrollLeft;
          el.style.scrollBehavior = 'auto';
          el.style.cursor = 'grabbing';
        });

        el.addEventListener('mouseleave', () => {
          isDown = false;
          el.style.cursor = '';
        });

        el.addEventListener('mouseup', (e) => {
          isDown = false;
          el.style.cursor = '';
          if (hasMoved) {
            // Prevent click events on child elements if we dragged
            const preventClick = (event) => {
              event.stopImmediatePropagation();
              event.preventDefault();
              el.removeEventListener('click', preventClick, true);
            };
            el.addEventListener('click', preventClick, true);
          }
        });

        el.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          const x = e.pageX - el.offsetLeft;
          const walk = (x - startX) * 1.6;
          if (Math.abs(walk) > 5) {
            hasMoved = true;
          }
          e.preventDefault();
          el.scrollLeft = scrollLeft - walk;
        });
      });
    }

    function renderHome() {
      document.title = 'AutoViindu — Find Your Perfect Car in Nepal';
      setNav('home');
      const db = CARS_DB;
      const evCars = db.filter(c => c.type === 'Electric');
      document.getElementById('app-root').innerHTML = window.buildHomePageHTML({
        db, evCars, carCard, BRANDS, BUDGETS, HERO_SLIDES, IC, UPCOMING_DATA, upcomingCard
      });
      updateCompareTray();
      updateCmpBtns();
      startHeroTimer();
      
      // Enable mouse dragging for horizontal scrolling containers
      enableDragScroll('.home-discover__scroll');
      enableDragScroll('.car-carousel');
    }
    /*car honk */
    (function () {
      var wrapper = document.getElementById('honk-wrapper');
      var logoImg = document.getElementById('logo-img');
      var clicks = 0, timer = null, honkIndex = 0;

      // ── noise buffer (used by some horns for grit) ──
      function makeNoise(ctx, dur) {
        var sr = ctx.sampleRate;
        var buf = ctx.createBuffer(1, sr * dur, sr);
        var d = buf.getChannelData(0);
        for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        var src = ctx.createBufferSource();
        src.buffer = buf;
        return src;
      }

      // ── core tone helper ──
      function tone(ctx, type, freq, detune, start, dur, vol, dest) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest || ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        osc.detune.setValueAtTime(detune || 0, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.018);
        gain.gain.setValueAtTime(vol, ctx.currentTime + start + dur - 0.04);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.05);
      }

      var honks = [

        // ── 1. Classic taxi horn (old-school ahh-oogah feel) ──
        {
          label: '<i data-lucide="car"></i> Taxi Horn',
          play: function (ctx) {
            // Rich fundamental + 2nd harmonic + slight detuning = reedy brass feel
            tone(ctx, 'sawtooth', 294, 0, 0, 0.55, 0.38);
            tone(ctx, 'sawtooth', 294, 18, 0, 0.55, 0.18);
            tone(ctx, 'sawtooth', 588, -12, 0, 0.55, 0.12);
            tone(ctx, 'square', 294, 0, 0, 0.55, 0.07);
          }
        },

        // ── 2. Small hatchback — cheerful double beep ──
        {
          label: '<i data-lucide="car"></i> Hatchback Beep',
          play: function (ctx) {
            function beep(start) {
              tone(ctx, 'sine', 1046, 0, start, 0.13, 0.35);
              tone(ctx, 'sine', 1318, 0, start, 0.13, 0.18);
              tone(ctx, 'triangle', 1046, -8, start, 0.13, 0.10);
            }
            beep(0);
            beep(0.19);
          }
        },

        // ── 3. Big truck air horn — long bassy blast ──
        {
          label: '<i data-lucide="truck"></i> Truck Air Horn',
          play: function (ctx) {
            // Air horns use a chord: A2 + E3 + A3
            tone(ctx, 'sawtooth', 110, 0, 0, 0.7, 0.30);
            tone(ctx, 'sawtooth', 165, 0, 0, 0.7, 0.25);
            tone(ctx, 'sawtooth', 220, 0, 0, 0.7, 0.20);
            tone(ctx, 'sawtooth', 330, 0, 0, 0.7, 0.10);
            // slight noise layer for air rush
            var noise = makeNoise(ctx, 0.75);
            var nf = ctx.createBiquadFilter();
            nf.type = 'bandpass';
            nf.frequency.value = 200;
            nf.Q.value = 0.5;
            var ng = ctx.createGain();
            ng.gain.setValueAtTime(0.04, ctx.currentTime);
            ng.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
            noise.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
            noise.start(); noise.stop(ctx.currentTime + 0.75);
          }
        },

        // ── 4. European sedan — elegant two-tone (Eb + Bb) ──
        {
          label: '<i data-lucide="car"></i> Sedan Horn',
          play: function (ctx) {
            // Real car horns are tuned to musical intervals
            // Eb4 (311 Hz) + Bb4 (466 Hz) — a perfect fifth apart
            tone(ctx, 'sawtooth', 311, 0, 0, 0.5, 0.28);
            tone(ctx, 'sawtooth', 311, 22, 0, 0.5, 0.14); // chorus detuning
            tone(ctx, 'sawtooth', 466, 0, 0, 0.5, 0.22);
            tone(ctx, 'sawtooth', 466, -18, 0, 0.5, 0.10);
            tone(ctx, 'square', 311, 0, 0, 0.5, 0.05);
          }
        },

        // ── 5. Scooter / motorbike — high nasal toot ──
        {
          label: '<i data-lucide="car"></i> Car Horn (Real)',
          play: function (ctx) {
            // Extracted from real recording via FFT analysis
            // Fundamental: 453 Hz — dominant harmonics at 906, 1359, 1812 Hz
            // Attack: ~0.06s, sustain: 0.60s, decay: ~0.08s

            // Fundamental — body of the horn
            tone(ctx, 'sine', 453, 0, 0, 0.20, 0.65);

            // 2nd harmonic — strongest peak, gives the nasal "honk" character
            tone(ctx, 'sawtooth', 906, 0, 0, 0.22, 0.65);

            // 3rd harmonic — brassy bite
            tone(ctx, 'sawtooth', 1359, 0, 0, 0.10, 0.65);

            // 4th harmonic — shimmer/air
            tone(ctx, 'sine', 1812, 0, 0, 0.05, 0.65);
          }
        },

        {
          label: '<i data-lucide="bell-ring"></i> Traffic Horn (Urgent)',
          play: function (ctx) {
            // Extracted from ElevenLabs traffic jam horn recording
            // Fundamental: 807 Hz (G5) — sharp, aggressive urban horn
            // Strong harmonics at 1212 Hz and 1614 Hz give it urgency
            // Attack: ~55ms, sustain: 1.5s, decay: ~55ms

            // Fundamental — high sharp tone
            tone(ctx, 'sine', 807, 0, 0, 0.20, 1.55);

            // 2nd harmonic — nearly equal strength to fundamental
            tone(ctx, 'sawtooth', 1614, 0, 0, 0.18, 1.55);

            // 3rd harmonic — adds the "blaring" midrange urgency
            tone(ctx, 'sawtooth', 1212, 0, 0, 0.13, 1.55);

            // Sub-harmonic body (404 Hz) — perceived low-end weight
            tone(ctx, 'sine', 404, 0, 0, 0.07, 1.55);
          }
        },

        // ── 7. SUV / luxury — deep authoritative double blast ──
        {
          label: '<i data-lucide="truck"></i> SUV Horn',
          play: function (ctx) {
            function blast(start, dur) {
              tone(ctx, 'sawtooth', 196, 0, start, dur, 0.30);
              tone(ctx, 'sawtooth', 196, 25, start, dur, 0.15);
              tone(ctx, 'sawtooth', 392, 0, start, dur, 0.18);
              tone(ctx, 'sawtooth', 392, -20, start, dur, 0.08);
              tone(ctx, 'square', 196, 0, start, dur, 0.06);
            }
            blast(0, 0.22);
            blast(0.28, 0.38);
          }
        },

      ];

      function playHonk() {
        try {
          var ctx = new (window.AudioContext || window.webkitAudioContext)();
          // master limiter so nothing clips
          var limiter = ctx.createDynamicsCompressor();
          limiter.threshold.value = -3;
          limiter.ratio.value = 20;
          limiter.connect(ctx.destination);
          // redirect destination → limiter for this honk
          var origDest = ctx.destination;
          honks[honkIndex].play(ctx);
        } catch (e) { }
      }

      function wiggle() {
        if (!logoImg) return;
        var frames = ['-8deg', '8deg', '-6deg', '6deg', '-3deg', '0deg'];
        var i = 0;
        logoImg.style.transition = 'transform 0.05s';
        var iv = setInterval(function () {
          logoImg.style.transform = 'rotate(' + frames[i++] + ')';
          if (i >= frames.length) { clearInterval(iv); logoImg.style.transform = ''; }
        }, 55);
      }

      function toast(label) {
        var old = document.getElementById('honk-toast');
        if (old) old.remove();
        var t = document.createElement('div');
        t.id = 'honk-toast';
        t.textContent = label + ' <i data-lucide="megaphone"></i>';
        t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(16px);background:#111;color:#fff;padding:8px 22px;border-radius:999px;font-size:14px;font-weight:600;opacity:0;transition:all 0.3s;z-index:99999;pointer-events:none';
        document.body.appendChild(t);
        requestAnimationFrame(function () {
          t.style.opacity = '1';
          t.style.transform = 'translateX(-50%) translateY(0)';
        });
        setTimeout(function () {
          t.style.opacity = '0';
          setTimeout(function () { t.remove(); }, 350);
        }, 2000);
      }

      if (wrapper) wrapper.addEventListener('click', function () {
        clicks++;
        clearTimeout(timer);
        timer = setTimeout(function () { clicks = 0; }, 700);
        if (clicks >= 4) {
          clicks = 0;
          clearTimeout(timer);
          var current = honks[honkIndex];
          playHonk();
          wiggle();
          toast(current.label);
          honkIndex = (honkIndex + 1) % honks.length;
        }
      });
    })();

    window.homeSearchActiveTab = 'new';

    function setHomeSearchTab(tab, btn) {
      window.homeSearchActiveTab = tab;
      const tabs = btn.parentNode.querySelectorAll('.sw-tab');
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      const budgetSelect = document.getElementById('sw-budget');
      const fuelSelect = document.getElementById('sw-fuel');
      const fourthSelect = document.getElementById('sw-fourth');
      const fourthLabel = document.getElementById('sw-fourth-label');

      if (!budgetSelect || !fourthSelect || !fourthLabel) return;

      if (tab === 'used') {
        budgetSelect.innerHTML = `
          <option value="">Any Budget</option>
          <option value="under20">Under Rs. 20L</option>
          <option value="20to40">Rs. 20–40L</option>
          <option value="40to70">Rs. 40–70L</option>
          <option value="70to1cr">Rs. 70L–1Cr</option>
          <option value="above1cr">Rs. 1Cr+</option>
        `;
        fourthLabel.textContent = 'Sort & Condition';
        fourthSelect.innerHTML = `
          <option value="">All Used Cars</option>
          <option value="lowest_km">Lowest KM Run</option>
          <option value="year">Newest Year</option>
          <option value="price">Lowest Price</option>
          <option value="certified">Certified</option>
        `;
        if (fuelSelect) fuelSelect.value = '';
      } else {
        budgetSelect.innerHTML = `
          <option value="">Any Budget</option>
          <option value="15">Under Rs. 15L</option>
          <option value="25">Rs. 15L – 25L</option>
          <option value="40">Rs. 25L – 40L</option>
          <option value="60">Rs. 40L – 60L</option>
          <option value="100">Rs. 60L – 1Cr</option>
          <option value="999">Above Rs. 1Cr</option>
        `;
        fourthLabel.textContent = 'Body Type';
        fourthSelect.innerHTML = `
          <option value="">All Body Types</option>
          <option value="suv">SUV</option>
          <option value="crossover">Crossover</option>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
          <option value="coupe">Coupe</option>
          <option value="mpv">MPV</option>
          <option value="offroad">Off-road</option>
          <option value="pickup">Pickup</option>
          <option value="microcar">Microcar</option>
          <option value="wagon">Wagon</option>
          <option value="van">Van</option>
        `;
        if (fuelSelect) {
          if (tab === 'electric') fuelSelect.value = 'electric';
          else if (tab === 'hybrid') fuelSelect.value = 'hybrid';
          else fuelSelect.value = '';
        }
      }
    }

    function swSearch() {
      const tab = window.homeSearchActiveTab || 'new';
      const brand = document.getElementById('sw-brand')?.value || '';
      const fuel = document.getElementById('sw-fuel')?.value || '';
      const budget = document.getElementById('sw-budget')?.value || '';
      const fourth = document.getElementById('sw-fourth')?.value || '';

      if (tab === 'used') {
        const opts = {
          brand: brand,
          budget: budget,
          fuel: fuel
        };
        if (fourth === 'lowest_km') {
          opts.filter = 'lowest_km';
        } else if (fourth === 'year') {
          opts.filter = 'year';
        } else if (fourth === 'price') {
          opts.filter = 'price';
        } else if (fourth === 'certified') {
          opts.certified = true;
        }
        AV.goTo('used', opts);
      } else {
        const opts = {
          brand: brand,
          budget: budget,
          fuel: fuel
        };
        if (fourth) {
          opts.body = fourth;
        }
        AV.goTo('cars', opts);
      }
    }

    function homeFilter(type, btn) {
      document.querySelectorAll('#home-chips .chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const norm = s => String(s || '').toLowerCase().replace(/[\s-_]+/g, '');
      const filtered = type === 'All' ? CARS_DB : CARS_DB.filter(c => {
        const cb = norm(c.body || c.bodyType);
        if (type === 'Electric') return c.type === 'Electric';
        if (type === 'Hybrid') return c.type === 'Hybrid';
        if (type === 'Petrol') return c.type === 'Petrol';
        if (type === 'Diesel' || type === 'Disel') return c.type === 'Diesel';
        const nb = norm(type);
        if (nb === 'offroad') return cb.includes('offroad') || cb.includes('sav');
        if (nb === 'microcar') return cb.includes('micro');
        if (nb === 'pickup') return cb.includes('pickup');
        if (nb === 'wagon') return cb.includes('wagon');
        if (nb === 'mpv') return cb.includes('mpv') || cb.includes('muv');
        return cb.includes(nb) || nb.includes(cb);
      });
      const g = document.getElementById('home-grid');
      if (g) g.innerHTML = filtered.map(c => carCard(c)).join('');
      updateCmpBtns();
    }

    /* ─ HERO CAROUSEL ─ */
    function heroNav(dir) {
      const dotsCount = document.querySelectorAll('.hero-dot').length;
      heroGo((heroIdx + dir + dotsCount) % dotsCount);
    }
    function heroGo(idx) {
      heroIdx = idx;
      const slides = document.getElementById('hero-slides');
      if (slides) slides.style.transform = `translateX(-${idx * 100}%)`;
      document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      resetHeroTimer();
    }
    function startHeroTimer() {
      const slides = document.getElementById('hero-slides');
      if (!slides) return;
      clearInterval(heroTimer);
      let pct = 0;
      const prog = document.getElementById('hero-progress');
      heroTimer = setInterval(() => {
        pct += 1;
        if (prog) prog.style.width = pct + '%';
        if (pct >= 100) { pct = 0; heroNav(1); if (prog) prog.style.width = '0%' }
      }, 50);
    }
    function resetHeroTimer() {
      clearInterval(heroTimer);
      const prog = document.getElementById('hero-progress');
      if (prog) prog.style.width = '0%';
      startHeroTimer();
    }

    /* ─ GALLERY ─ */
    let galMode = 'exterior';
    
    function galGetImgs(car) {
      const allImgs = car.images || [];
      let imgs = allImgs.filter(img => {
        const isInt = /interior|dashboard|seat|inside/i.test(img);
        return galMode === 'interior' ? isInt : !isInt;
      });
      // Fallback: if no images match the mode, return all images
      return imgs.length ? imgs : allImgs;
    }

    function buildGallery(car, containerId, mode = 'exterior') {
      galMode = mode;
      galIdx = 0;
      const el = document.getElementById(containerId); if (!el) return;
      
      const imgs = galGetImgs(car);
      
      // Only show tabs if there is at least one interior image
      const allImgs = car.images || [];
      const hasInterior = allImgs.some(img => /interior|dashboard|seat|inside/i.test(img));
      
      const idOrSlug = car.slug || car.id;
      
      const tabsHTML = hasInterior ? `
        <div class="gallery-right" style="justify-content: center; padding: 12px 24px;">
          <div class="gal-style-tabs" style="margin: 0; width: 100%; max-width: 300px;">
            <button class="gal-style-btn ${mode === 'exterior' ? 'active' : ''}" onclick="AV.setGalMode('exterior', '${idOrSlug}', '${containerId}')">Exterior</button>
            <button class="gal-style-btn ${mode === 'interior' ? 'active' : ''}" onclick="AV.setGalMode('interior', '${idOrSlug}', '${containerId}')">Interior</button>
          </div>
        </div>
      ` : '';

      el.innerHTML = `
      <div class="gallery-left">
        <div class="gallery-main" id="gal-main">
          <img id="gal-img" src="${imgs[0] || ''}" alt="${car.brand} ${car.model}" onclick="AV.openLightbox('${idOrSlug}')" style="cursor:zoom-in;">
          ${imgs.length > 1 ? `
            <button class="gal-prev" onclick="AV.galNav(-1,'${idOrSlug}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button class="gal-next" onclick="AV.galNav(1,'${idOrSlug}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>` : ''}
          <div class="gal-count" id="gal-count">${imgs.length > 0 ? (galIdx + 1) + '/' + imgs.length : '0/0'}</div>
        </div>
        <div class="gallery-thumbs">
          ${imgs.map((img, i) => `<div class="g-thumb ${i === 0 ? 'active' : ''}" onclick="AV.galSet(${i},'${idOrSlug}')"><img src="${img}" loading="lazy"></div>`).join('')}
        </div>
      </div>
      ${tabsHTML}
      `;
    }
    window.AV = window.AV || {};
    window.AV.setGalMode = function(mode, slug, containerId) {
      const car = carBySlug(slug); if (!car) return;
      buildGallery(car, containerId, mode);
    };
    function galNav(dir, slug) {
      const car = carBySlug(slug); if (!car) return;
      const imgs = galGetImgs(car);
      galIdx = (galIdx + dir + imgs.length) % imgs.length;
      const img = document.getElementById('gal-img');
      if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = imgs[galIdx]; img.style.opacity = '1' }, 200) }
      document.querySelectorAll('.g-thumb').forEach((t, i) => t.classList.toggle('active', i === galIdx));
      const c = document.getElementById('gal-count'); if (c) c.textContent = `${galIdx + 1}/${imgs.length}`;
    }
    function galSet(idx, slug) {
      const car = carBySlug(slug); if (!car) return;
      const imgs = galGetImgs(car);
      galIdx = idx;
      const img = document.getElementById('gal-img');
      if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = imgs[idx]; img.style.opacity = '1' }, 200) }
      document.querySelectorAll('.g-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
      const c = document.getElementById('gal-count'); if (c) c.textContent = `${idx + 1}/${imgs.length}`;
    }
    
    /* ─ LIGHTBOX ─ */
    let lbCar = null;
    let lbImgs = [];
    let lbScale = 1;
    let lbPos = { x: 0, y: 0 };
    let lbStart = { x: 0, y: 0 };
    let lbDragging = false;
    
    window.AV.openLightbox = function(slug) {
      const car = carBySlug(slug); if (!car) return;
      lbCar = car;
      lbImgs = galGetImgs(car);
      const lb = document.getElementById('av-lightbox');
      const img = document.getElementById('lb-img');
      if (!lb || !img) return;
      img.src = lbImgs[galIdx] || '';
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
      window.AV.resetLb();
    };
    
    window.AV.closeLightbox = function() {
      const lb = document.getElementById('av-lightbox');
      if (lb) lb.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    window.AV.lbNav = function(dir) {
      if (!lbCar) return;
      galIdx = (galIdx + dir + lbImgs.length) % lbImgs.length;
      document.getElementById('lb-img').src = lbImgs[galIdx];
      window.AV.resetLb();
    };
    
    window.AV.resetLb = function() {
      lbScale = 1; lbPos = { x: 0, y: 0 };
      window.AV.applyLbTransform();
    };
    
    window.AV.applyLbTransform = function() {
      const img = document.getElementById('lb-img');
      if (img) {
        img.style.transform = `translate(${lbPos.x}px, ${lbPos.y}px) scale(${lbScale})`;
      }
    };
    
    window.AV.lbWheel = function(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      lbScale = Math.max(0.5, Math.min(lbScale + delta, 4));
      window.AV.applyLbTransform();
    };
    
    window.AV.lbDown = function(e) { lbDragging = true; lbStart = { x: e.clientX - lbPos.x, y: e.clientY - lbPos.y }; };
    window.AV.lbMove = function(e) { if (!lbDragging) return; lbPos = { x: e.clientX - lbStart.x, y: e.clientY - lbStart.y }; window.AV.applyLbTransform(); };
    window.AV.lbUp = function(e) { lbDragging = false; };


    /* ─ VARIANT ─ */
    function selectVariant(slug, vi) {
      activeVariant[slug] = vi;
      const car = carBySlug(slug); if (!car) return;
      const vr = car.variants[vi];
      document.querySelectorAll('.variant-tab').forEach((t, i) => t.classList.toggle('active', i === vi));
      document.querySelectorAll('.pcv-item').forEach((t, i) => t.classList.toggle('active', i === vi));
      document.querySelectorAll('[data-price-d]').forEach(el => el.textContent = window.Rs(vr.price));
      const pa = document.getElementById('price-amount'); if (pa) pa.textContent = window.Rs(vr.price);
      const vdp = document.getElementById('vdp');
      if (vdp && vr.specs) vdp.innerHTML = Object.entries(vr.specs).map(([k, v]) => `<div class="vdp-item" style="background:rgba(255,255,255,.7);border-radius:var(--r8);padding:10px;text-align:center"><div style="font-family:var(--font-d);font-size:14px;font-weight:700;color:var(--g3)">${v}</div><div style="font-size:10px;color:var(--ink4);margin-top:2px">${k}</div></div>`).join('');
      const downEl = document.getElementById('emi-down');
      const tenEl = document.getElementById('emi-ten-val');
      const rateEl = document.getElementById('emi-rate');
      if (downEl && tenEl && rateEl) updateEMI(slug, vi, +downEl.value, +tenEl.textContent, +rateEl.value);
    }
    function selectColor(el, name) {
      document.querySelectorAll('.color-swatch').forEach(s => s.style.boxShadow = '');
      el.style.boxShadow = `0 0 0 2px #fff,0 0 0 4px var(--g3)`;
      const d = document.getElementById('color-display'); if (d) d.textContent = name;
    }
    // EMI Calculator
    function buildEmiHTML(car, vi) {
      const vr = car.variants[vi];
      const dp = 60, dt = 60, dr = 7;
      const loan = vr.price * (1 - dp / 100);
      const dpAmt = vr.price * dp / 100;
      const emi = calcEMI(loan, dr, dt);
      const tot = emi * dt;
      const intr = tot - loan;
      return `
    <div class="dp-emi-title">EMI estimate</div>
    <div class="dp-emi-field">
      <div class="dp-emi-label" style="justify-content:space-between;display:flex;align-items:center">
        <span>Down payment <span class="val" id="emi-dp-val">${dp}%</span></span>
        <span style="font-size:11px;color:var(--ink4);font-weight:600" id="emi-dp-amt">${Rs(Math.round(dpAmt))}</span>
      </div>
      <input type="range" min="10" max="60" step="5" value="${dp}" id="emi-dp"
        oninput="document.getElementById('emi-dp-val').textContent=this.value+'%';AV.recalcEmi('${car.slug}',${vi})">
    </div>
    <div class="dp-emi-field">
      <div class="dp-emi-label">Tenure <span class="val"><span id="emi-ten-val">${dt}</span> months</span></div>
      <div class="tenure-btns">
        ${[12, 24, 36, 48, 60, 72, 84].map(m => `
          <button class="ten-btn ${m === dt ? 'active' : ''}" onclick="AV.setTenure2(${m},'${car.slug}',${vi})">${m}m</button>`
      ).join('')}
      </div>
    </div>
    <div class="dp-emi-field">
      <div class="dp-emi-label">Interest rate <span class="val" id="emi-rate-val">${dr}%</span></div>
      <input type="range" min="7" max="18" step="0.5" value="${dr}" id="emi-rate"
        oninput="document.getElementById('emi-rate-val').textContent=this.value+'%';AV.recalcEmi('${car.slug}',${vi})">
    </div>
    <div class="dp-emi-result">
      <div style="font-size:10px;color:var(--ink4);margin-bottom:2px">Monthly EMI</div>
      <div class="dp-emi-amount" id="emi-amount">Rs. ${Math.round(emi).toLocaleString()} <span style="font-size:12px;color:var(--ink4);font-weight:600">(approx)</span></div>
      <div style="font-size:11px;color:var(--ink4)">/month</div>
    </div>
    <div class="dp-emi-break">
      <div class="dp-emi-bd" style="background:var(--green-ll);border-radius:8px;padding:6px 8px">
        <div class="dp-emi-bd-val" id="emi-dp-break" style="color:var(--green)">${Rs(Math.round(dpAmt))}</div>
        <div class="dp-emi-bd-lbl">You pay upfront</div>
      </div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-loan">${Rs(Math.round(loan))}</div><div class="dp-emi-bd-lbl">Financed amount</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-int">${Rs(Math.round(intr))}</div><div class="dp-emi-bd-lbl">Interest cost</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-tot">${Rs(Math.round(tot))}</div><div class="dp-emi-bd-lbl">Total payable</div></div>
    </div>
    <button onclick="alert('Finance: +977-9828364940')" class="dp-cta-ghost" style="margin-top:10px">Apply for finance</button>`;
    }
    function updateEMI(slug, vi, dp, ten, rate) {
      const car = carBySlug(slug); if (!car) return;
      const vr = car.variants[vi];
      const dpAmt = vr.price * dp / 100;
      const loan = vr.price * (1 - dp / 100);
      const emi = calcEMI(loan, rate, ten);
      const total = emi * ten;
      const interest = total - loan;
      const s = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v };
      s('emi-amount', `Rs. ${Math.round(emi).toLocaleString()} <span style="font-size:12px;color:var(--ink4);font-weight:600">(approx)</span>`);
      s('emi-dp-amt', Rs(Math.round(dpAmt)));
      s('emi-dp-break', Rs(Math.round(dpAmt)));
      s('emi-loan', Rs(Math.round(loan)));
      s('emi-int', Rs(Math.round(interest)));
      s('emi-tot', Rs(Math.round(total)));
    }
    function setTenure(m, slug) {
      document.getElementById('emi-ten-val').textContent = m;
      document.querySelectorAll('.ten-btn').forEach(b => b.classList.toggle('active', parseInt(b.textContent) === m));
      const vi = activeVariant[slug] || 0;
      updateEMI(slug, vi, +document.getElementById('emi-down').value, m, +document.getElementById('emi-rate').value);
    }
    function getVI(slug) { return activeVariant[slug] || 0 }

    function recalcEmi(slug, vi) {
      const car = carBySlug(slug); if (!car) return;
      const vr = car.variants[vi];
      const dp = +(document.getElementById('emi-dp')?.value || 60);
      const ten = +(document.getElementById('emi-ten-val')?.textContent || 60);
      const r = +(document.getElementById('emi-rate')?.value || 7);
      const dpAmt = vr.price * dp / 100;
      const loan = vr.price * (1 - dp / 100);
      const emi = calcEMI(loan, r, ten);
      const tot = emi * ten;
      const s = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v };
      s('emi-amount', `Rs. ${Math.round(emi).toLocaleString()} <span style="font-size:12px;color:var(--ink4);font-weight:600">(approx)</span>`);
      s('emi-dp-amt', Rs(Math.round(dpAmt)));
      s('emi-dp-break', Rs(Math.round(dpAmt)));
      s('emi-loan', Rs(Math.round(loan)));
      s('emi-int', Rs(Math.round(tot - loan)));
      s('emi-tot', Rs(Math.round(tot)));
    }

    function setTenure2(m, slug, vi) {
      document.getElementById('emi-ten-val').textContent = m;
      document.querySelectorAll('.ten-btn').forEach(b => b.classList.toggle('active', parseInt(b.textContent) === m));
      recalcEmi(slug, vi);
    }
    /* ─ ACCORDION TOGGLE (global — called from onclick) ─ */
    window.dpAccord = function(hd) {
      const wrap = hd.closest('.dp-accord-wrap');
      const container = wrap.parentElement;
      const isOpen = wrap.classList.contains('open');
      if (container) {
        container.querySelectorAll('.dp-accord-wrap.open').forEach(w => w.classList.remove('open'));
      }
      if (!isOpen) {
        wrap.classList.add('open');
      }
    }

    AV.filterAccord = function(btn) {
      const acc = btn.closest('.av-acc');
      const container = acc.parentElement;
      const isOpen = acc.classList.contains('open');
      if (container) {
        container.querySelectorAll('.av-acc.open').forEach(a => {
          if (a !== acc) a.classList.remove('open');
        });
      }
      if (!isOpen) acc.classList.add('open');
      else acc.classList.remove('open');
    };

    /* ─ DETAIL PAGE v2 ─ */
    function renderDetail(slug) {
      const car = carBySlug(slug);
      if (!car) { goTo('cars'); return; }

      clearInterval(heroTimer);
      if (activeVariant[slug] == null) activeVariant[slug] = 0;
      document.title = `${car.brand} ${car.model} ${car.year} — AutoViindu`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setNav('');

      const vi = () => activeVariant[slug];
      const vr = () => car.variants[vi()];

      /* ── SVG icon paths (inner content only, wrapped by svgI()) ── */
      const _P = {
        cal: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
        fuel: `<path d="M3 22V6l4-4h6l4 4v16"/><path d="M9 22V12h6v10"/><rect x="17" y="10" width="4" height="4"/>`,
        pow: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
        body: `<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><line x1="5" y1="12" x2="19" y2="12"/>`,
        sts: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
        box: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
        list: `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,
        feat: `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
        col: `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>`,
        pros: `<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>`,
        calc: `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>`,
        chk: `<polyline points="20 6 9 17 4 12"/>`,
        chev: `<polyline points="6 9 12 15 18 9"/>`,
        ph: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.84-1.84a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>`,
        shield: `<path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/>`,
        batt: `<rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/>`,
        gauge: `<path d="M4 12a8 8 0 0 1 16 0"/><path d="M12 12l4-4"/><circle cx="12" cy="12" r="1"/>`,
        gear: `<circle cx="12" cy="12" r="3"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2M7.05 7.05l1.41 1.41M15.54 15.54l1.41 1.41M7.05 16.95l1.41-1.41M15.54 8.46l1.41-1.41"/>`,
        wrench: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
      };
      const svgI = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${_P[k]}</svg>`;
      const ICON_FOR_LABEL = {
        'Ground Clearance': 'box', 'Kerb Weight': 'box',
        'Range': 'gauge', 'Mileage': 'gauge',
        'Power': 'pow', 'Engine (cc)': 'pow', 'Engine + Motor combo': 'pow',
        'Battery (kWh)': 'batt', 'Charging Time': 'batt', 'Charging Time (N/A unless Plug-in)': 'batt',
        'Torque': 'wrench',
        'Suspension': 'gear', 'Steering': 'gear', 'Transmission': 'gear',
        'Seating': 'sts',
        'Fuel Type': 'fuel', 'Hybrid Type (Mild/Full/Plug-in)': 'fuel',
      };
      const iconForCell = lbl => {
        if (lbl.startsWith('Warranty')) return svgI('shield');
        if (lbl === 'Safety Rating') return IC.star;
        return svgI(ICON_FOR_LABEL[lbl] || 'feat');
      };

      /* ── Key info grid ── */
      function kiGrid(v) {
        const sp = k => v.specs?.[k] || car.specs?.[k];
        return [
          { k: 'cal', val: car.year, lbl: 'Year' },
          { k: 'fuel', val: car.type || sp('Fuel Type') || 'Petrol', lbl: 'Fuel' },
          { k: 'pow', val: sp('Power') || sp('Motor Power') || '—', lbl: 'Power' },
          { k: 'body', val: car.body, lbl: 'Body' },
          { k: 'sts', val: sp('Seating') || '5', lbl: 'Seats' },
          { k: 'box', val: sp('Boot Space') || '—', lbl: 'Boot' },
        ].map(it => `
      <div class="dp-ki-cell">
        <div class="dp-ki-icon">${svgI(it.k)}</div>
        <div class="dp-ki-val">${it.val}</div>
        <div class="dp-ki-lbl">${it.lbl}</div>
      </div>`).join('');
      }

      /* ── Quick stats strip ── */
      function qsStrip(v) {
        const getCSp = k => car.specs?.[k];
        const getVSp = k => {
            const vSp = v.specs || {};
            if (vSp[k]) return vSp[k];
            const lower = k.toLowerCase();
            if (vSp[lower]) return vSp[lower];
            return undefined;
        };
        const sp = k => getVSp(k) || getCSp(k);
        const type = car.type || 'ICE';
        const isEV = type.toLowerCase().includes('electric') || type.toLowerCase().includes('ev');
        const isHybrid = type.toLowerCase().includes('hybrid');
        
        let row1 = [], row2 = [];
        
        if (isEV) {
            row1 = [
                ['Ground Clearance', sp('Ground Clearance (mm)') || sp('Ground Clearance')],
                ['Range', sp('Certified Range (km)') || sp('Real-world Range (km)') || sp('WLTP Range') || sp('Range (WLTP)') || sp('Range') || v.specs?.efficiency],
                ['Warranty (Vehicle/Battery)', sp('Battery Warranty') || sp('Standard Vehicle Warranty') || sp('Warranty')],
                ['Power', sp('Max Motor Power') || sp('Power') || sp('Motor Power')],
                ['Safety Rating', sp('Safety Rating') || car.rating]
            ];
            row2 = [
                ['Battery (kWh)', sp('Battery Capacity (kWh)') ? sp('Battery Capacity (kWh)') + ' kWh' : (sp('Battery') || v.specs?.battery)],
                ['Charging Time', sp('Fast Charging Time (DC)') || sp('Normal Charging Time (AC)') || sp('Charging (DC)') || sp('Charging Time') || v.specs?.chargingDC],
                ['Torque', sp('Max Motor Torque') || sp('Torque')],
                ['Kerb Weight', sp('Kerb Weight (kg)') || sp('Kerb Weight')],
                ['Suspension', sp('Front Suspension Type') || sp('Front Suspension') || sp('Suspension') || v.specs?.frontSuspension],
                ['Steering', sp('Steering Type') || sp('Steering') || v.specs?.steering],
                ['Seating', sp('Seating Capacity') || sp('Seating')]
            ];
        } else if (isHybrid) {
            row1 = [
                ['Hybrid Type (Mild/Full/Plug-in)', sp('Hybrid System Type') || sp('Hybrid Type') || 'Hybrid'],
                ['Fuel Type', sp('Fuel Type') || sp('Fuel')],
                ['Engine + Motor combo', sp('Engine Type') ? (sp('Engine Type') + ' + Motor') : (sp('Engine') || 'Engine + Motor')],
                ['Torque', sp('Max Engine Torque') || sp('Combined System Output') || sp('Torque')],
                ['Transmission', sp('Transmission Type') || sp('Transmission')],
                ['Charging Time (N/A unless Plug-in)', sp('AC Charging Max Rate (kW)') || sp('Charging (AC)') || 'N/A'],
                ['Kerb Weight', sp('Kerb Weight (kg)') || sp('Kerb Weight')],
                ['Suspension', sp('Front Suspension Type') || sp('Front Suspension') || sp('Suspension')],
                ['Steering', sp('Steering Type') || sp('Steering')],
                ['Seating', sp('Seating Capacity') || sp('Seating')]
            ];
            row2 = [
                ['Ground Clearance', sp('Ground Clearance (mm)') || sp('Ground Clearance')],
                ['Mileage', sp('Certified Fuel Efficiency (km/l)') || sp('Fuel Efficiency') || sp('Mileage') || v.specs?.efficiency],
                ['Warranty (Vehicle/Hybrid Battery)', sp('Battery Warranty') || sp('Standard Vehicle Warranty') || sp('Warranty')],
                ['Power', sp('Combined System Output') || sp('Max Engine Power') || sp('Power')],
                ['Safety Rating', sp('Safety Rating') || car.rating]
            ];
        } else {
            row1 = [
                ['Ground Clearance', sp('Ground Clearance (mm)') || sp('Ground Clearance')],
                ['Mileage', sp('Certified Fuel Efficiency (km/l)') || sp('Fuel Efficiency') || sp('Mileage') || v.specs?.efficiency],
                ['Warranty', sp('Standard Vehicle Warranty') || sp('Warranty')],
                ['Power', sp('Max Engine Power') || sp('Power')],
                ['Safety Rating', sp('Safety Rating') || car.rating]
            ];
            row2 = [
                ['Fuel Type', sp('Fuel Type') || sp('Fuel') || type],
                ['Engine (cc)', sp('Displacement (cc)') || sp('Engine') || sp('Engine (cc)')],
                ['Torque', sp('Max Engine Torque') || sp('Torque')],
                ['Transmission', sp('Transmission Type') || sp('Transmission')],
                ['Kerb Weight', sp('Kerb Weight (kg)') || sp('Kerb Weight')],
                ['Suspension', sp('Front Suspension Type') || sp('Front Suspension') || sp('Suspension')],
                ['Steering', sp('Steering Type') || sp('Steering')],
                ['Seating', sp('Seating Capacity') || sp('Seating')]
            ];
        }

        const cells = [...row1, ...row2].filter(([, val]) => val).slice(0, 10);
        const cellsHTML = cells.map(([l, val]) => `
      <div class="dp-ki-cell">
        <div class="dp-ki-icon">${iconForCell(l)}</div>
        <div class="dp-ki-val">${val}</div>
        <div class="dp-ki-lbl">${l}</div>
      </div>`).join('');

        return `
          
          <div class="dp-ki-grid">${cellsHTML}</div>
          <button class="dp-hl-btn" onclick="AV.switchDpTab('dp-tab-specs', document.getElementById('dp-tab-btn-specs'));document.getElementById('dp-tab-btn-specs').scrollIntoView({behavior:'smooth',block:'center'})">View all specs</button>
        `;
      }

      /* ── Variant tabs ── */
      function varTabs() {
        return car.variants.map((v, i) => `
      <div class="dp-var-tab${i === vi() ? ' active' : ''}" onclick="AV.switchVariant('${slug}',${i})">
        <div class="dp-var-tab-name">${v.name}</div>
        <div class="dp-var-tab-price">${window.Rs(v.price)}</div>
        ${v.popular ? '<div class="dp-var-tab-best"><i data-lucide="star"></i> Best Value</div>' : ''}
      </div>`).join('');
      }

      /* ── Spec table (merges car + variant specs) ── */
      const SPEC_SCHEMA = {
        "1. Engine, Motor & Performance": ["Engine Type", "Engine Position", "Displacement (cc)", "Cylinder Configuration", "Valve Configuration", "Variable Valve Timing", "Bore x Stroke (mm)", "Compression Ratio", "Fuel System", "Aspiration", "Engine Cooling System", "Start-Stop System", "Max Engine Power", "Max Engine Torque", "Max RPM (Redline)", "Motor Type", "Motor Position", "Motor Cooling System", "Max Motor Power", "Max Motor Torque", "Combined System Output", "Low Range 4WD", "Top Speed (km/h)", "Acceleration 0–100 km/h", "Power-to-Weight Ratio", "Drive Modes", "Regenerative Braking", "Boost / Overboost Function"],
        "2. Transmission & Drivetrain": ["Transmission Type", "Drive Type", "Drivetrain", "Number of Gears", "Shift-by-Wire", "Paddle Shifters", "Gear Shift Indicator", "Clutch Type", "Steering Type", "Steering Modes", "Variable Steering Ratio", "Differential Type", "Center Differential Lock", "Rear Differential Lock", "Transfer Case Type", "Torque Vectoring"],
        "3. Battery & Range": ["Battery Type", "Battery Cell Format", "Battery Capacity (kWh)", "Usable Battery Capacity (kWh)", "Battery Voltage (V)", "Battery Cooling", "Battery Management System (BMS)", "State of Health (SoH) Monitoring", "Certified Range (km)", "Real-world Range (km)", "Electric-only Range (km)", "Energy Consumption (kWh/100km)", "AC Charging Max Rate (kW)", "DC Fast Charging Max Rate (kW)", "Normal Charging Time (AC)", "Fast Charging Time (DC)", "Charging Port Type", "Vehicle-to-Load (V2L)", "Vehicle-to-Grid (V2G)", "Vehicle-to-Home (V2H)"],
        "4. Fuel & Emission": ["Fuel Type", "Hybrid System Type", "Fuel Tank Capacity (L)", "Certified Fuel Efficiency (km/l)", "Real-World Mileage City (km/l)", "Real-World Mileage Highway (km/l)", "EV Mode Efficiency (km/kWh)", "Emission Standard", "CO2 Emissions (g/km)", "Emission Control Technology", "Driving Range on Full Tank (km)", "Combined Driving Range HEV (km)", "NOx Emissions (g/km)", "Particulate Emissions (mg/km)", "Fuel Grade Required"],
        "6. Dimensions & Weight": ["Overall Length (mm)", "Overall Width (mm)", "Overall Width with Mirrors (mm)", "Overall Height (mm)", "Wheelbase (mm)", "Wheelbase Type", "Ground Clearance (mm)", "Turning Radius (m)", "Kerb Weight (kg)", "Gross Vehicle Weight (GVW)", "Seating Capacity", "Boot Space (litres)", "Boot Space Seats Folded (litres)", "Low Boot Loading Lip Height (mm)", "Frunk Capacity (litres)", "Weight Distribution", "Drag Coefficient (Cd)", "Underbody Aerodynamic Paneling", "Active Aero Elements", "Front Overhang (mm)", "Rear Overhang (mm)", "Track Width Front/Rear (mm)", "Payload Capacity (kg)", "Towing Capacity (kg)", "Roof Load Capacity (kg)", "Number of Doors", "Body Type"],
        "7. Suspension, Brakes & Tyres": ["Front Suspension Type", "Rear Suspension Type", "Front Stabilizer Bar", "Rear Stabilizer Bar", "Suspension Damper Type", "Drive Mode-Linked Suspension", "Electric Adjustable Suspension", "Adaptive Ride Height", "Front Brakes", "Rear Brakes", "Brake Caliper Type", "Electronic Parking Brake (EPB)", "Brake Assist (BA)", "Auto Hold", "Hill Start Assist (HSA)", "Hill Descent Control (HDC)", "Tyre Size", "Wheel Size (inches)", "Wheel Type", "Tyre Brand", "TPMS", "Spare Tyre", "Low Rolling Resistance Tyres", "Run-Flat Tyres", "All-Terrain Tyres"],
        "12. Warranty & Service": ["Standard Vehicle Warranty", "Battery Warranty", "Charging System Warranty", "Extended Warranty Offer", "Corrosion / Rust Warranty", "Paintwork Warranty", "Free Service Count & Intervals", "Annual Maintenance Package", "Roadside Assistance (RSA)"],
        "13. Variants & Colors": ["Total Number of Variants", "Variant Names", "Trim Level Names", "Transmission-based Variants", "Battery-based Variants", "Motor/Drive-based Variants", "Total Number of Colors", "Color Finish Type", "Dual-Tone Available", "Brand Hero/Signature Color", "Special Edition Variants"],
        "14. ADD ON Benefits from AV": ["Cash Discount", "Loyalty Bonus", "Exchange/Trade-In Bonus", "Festival Offer", "Special Corporate/Government Discount", "Free Insurance (1st Year)", "Free Registration Assistance", "Free Accessories Package", "Free Service Package", "EMI / Finance Assistance", "Zero Down Payment Offer", "Free Home Delivery", "EV Charging Setup Assistance", "Free Ceramic Coating", "Free Dashcam Installation", "Free PPF (Paint Protection Film)", "Autoviindu Verified Badge", "Price Guarantee"],
        "15. Pricing & On-Road Costs": ["Price", "Cost"],
        "16. Importer & Dealer Info": ["Importer", "Dealer"],
        "17. After Sales & Service Network": ["Network", "Service Center"]
      };

      const FEAT_SCHEMA = {
        "5. Advanced Driver Assistance Systems (ADAS)": ["Lane Departure Warning", "Forward Collision Warning", "Blind Spot Warning", "Rear Cross Traffic Warning", "Traffic Sign Recognition", "Driver Attention Monitoring", "High Beam Assist", "Adaptive Cruise Control (ACC)", "Lane Keep Assist", "Auto Emergency Braking (AEB)", "Blind Spot Collision Avoidance", "Autonomous Parking Assist", "Traffic Jam Assist", "Highway Driving Assist", "Auto Lane Change", "Remote Smart Parking", "Proactive Safety System", "360° Surround View Camera", "Front/Rear Cameras", "Parking Sensors", "Radar Sensors", "Head-Up Display (HUD)"],
        "8. Safety Features": ["Total Airbag Count", "Airbag Positions", "ABS", "EBD", "High Speed Alert System", "Central Locking", "Remote Central Locking", "Speed Sensing Auto Door Lock", "Child Safety Rear Door Lock", "Seat Belt Reminder", "Adjustable Headrests", "ISOFIX Child Seat Mounts", "Rear Occupant Alert", "Auto Headlamps", "Rain-Sensing Wipers", "Auto-Dimming IRVM", "Cruise Control", "Front/Rear Parking Sensors", "Acoustic/Laminated Windshield", "SOS Emergency Call System", "Crash Notification System", "Pedestrian Protection (Pop-up Hood)", "Night Vision Assist", "Safety Rating"],
        "9. Comfort & Convenience": ["Air Conditioning Type", "AC Zones", "Rear AC Vents", "Air Quality Control / PM2.5 Filter", "Smart Entry (Keyless)", "Push Button Start", "Powered Tailgate (Hands-Free)", "Soft-Close Doors", "Power Windows", "Electric ORVM", "Rear Defogger", "Powered Driver Seat", "Powered Passenger Seat", "Memory Seat Function", "Ventilated Seats", "Heated Seats", "Massage Function", "Ottoman Rear Seats", "Flat Floor Rear Cabin", "Standard / Panoramic Sunroof", "Rear Sunshades", "Front/Rear Armrests", "Rear Parcel Tray", "Cooled Glovebox", "Cabin Lamps", "Steering Adjustments"],
        "10. Exterior & Interior": ["Headlamp Type", "Daytime Running Lights (DRLs)", "Front Fog Lamps", "Tail Lamp Type", "Turn Indicators Type", "Puddle Lamps", "Roof Rails", "Skid Plates", "Exterior Paint Options", "Dashboard Material", "Seat Upholstery", "Leather Wrapped Steering", "Interior Accents", "Interior Color Scheme", "Ambient Lighting", "Digital Instrument Cluster", "Door Handles", "Panoramic Glass Roof"],
        "11. Technology / Infotainment": ["Touchscreen Display", "Touchscreen Size", "Touchscreen Resolution", "Digital Dials / Virtual Cockpit", "Audio System Speaker Count", "Premium Audio Brand", "Amplifier & Subwoofer", "Bluetooth Connectivity", "USB Ports", "Wi-Fi Hotspot", "Smart Watch Connectivity", "Android Auto", "Apple CarPlay", "Remote App Control", "Vehicle Health Monitoring App", "In-Built Navigation", "Connected Car Apps", "OTA Software Updates", "Voice Commands/Assistant", "Multi-User Profile Settings", "Gesture Control", "In-Car Payment System", "Drive Mode-Based UI Themes", "Rear Seat Entertainment System"]
      };

      const FULL_SCHEMA = { ...SPEC_SCHEMA, ...FEAT_SCHEMA };



      const isMatchedBySchema = (schemaObj, mergedObj, targetKey) => {
        let lowerK = targetKey.toLowerCase();
        for (const fields of Object.values(schemaObj)) {
          for (const field of fields) {
            let lowerField = field.toLowerCase();
            if (lowerK === lowerField || lowerField.includes(lowerK) || lowerK.includes(lowerField)) return true;
          }
        }
        return false;
      };

      function renderTemplateSchema(schemaObj, mergedObj, accPrefix = 'spec-acc-', showOtherSpecs = false, otherTitle = 'Other Details') {
        let html = '';
        let accIndex = 0;
        const matchedKeys = new Set();
        const PREVIEW_ROWS = 5;

        const getVal = (schemaField) => {
          let lowerField = schemaField.toLowerCase();
          
          for (const k of Object.keys(mergedObj)) {
            if (k.toLowerCase() === lowerField) {
              matchedKeys.add(k);
              return mergedObj[k];
            }
          }
          
          for (const k of Object.keys(mergedObj)) {
            let lowerK = k.toLowerCase();
            if (lowerField.includes(lowerK) || lowerK.includes(lowerField)) {
               if (!matchedKeys.has(k)) {
                  matchedKeys.add(k);
                  return mergedObj[k];
               }
            }
          }
          return "-";
        };

        // Build row HTML with show-more logic
        const buildRowsHTML = (rowsArr, gridId) => {
          const validRows = rowsArr.filter(r => r.val !== '-');
          if (!validRows.length) return '';

          let visibleHTML = '';
          let hiddenHTML = '';
          validRows.forEach((r, i) => {
            const rowHTML = `<div class="dp-spec-row"><div class="dp-spec-label">${r.field}</div><div class="dp-spec-val">${r.val}</div></div>`;
            if (i < PREVIEW_ROWS) visibleHTML += rowHTML;
            else hiddenHTML += rowHTML;
          });

          const moreCount = validRows.length - PREVIEW_ROWS;
          const showMoreBtn = (moreCount > 0)
            ? `<div class="spec-more-wrap" id="${gridId}-more-wrap">
                <div class="spec-hidden-rows" id="${gridId}-hidden" style="display:none;">${hiddenHTML}</div>
                <button class="spec-show-more-btn" id="${gridId}-btn"
                  onclick="(function(){
                    var h=document.getElementById('${gridId}-hidden');
                    var b=document.getElementById('${gridId}-btn');
                    var w=document.getElementById('${gridId}-more-wrap');
                    if(h.style.display==='none'){
                      h.style.display='';
                      b.textContent='Show less ↑';
                      b.classList.add('active');
                    } else {
                      h.style.display='none';
                      b.textContent='Show ${moreCount} more ↓';
                      b.classList.remove('active');
                    }
                  })()">Show ${moreCount} more ↓</button>
              </div>`
            : '';

          return `<div class="dp-spec-grid">${visibleHTML}${showMoreBtn}</div>`;
        };

        for (const [secName, fields] of Object.entries(schemaObj)) {
          const rowsArr = fields.map(field => ({ field, val: getVal(field) }));
          const hasData = rowsArr.some(r => r.val !== '-');
          if (!hasData) {
            continue; // Completely hide empty accordions instead of showing 'No data available'
          }
          const gridId = accPrefix + 'grid-' + accIndex;
          
          let bodyHTML;
          const isExtInt = secName.toLowerCase().includes('exterior') || secName.toLowerCase().includes('interior');
          if (isExtInt) {
            const validRows = rowsArr.filter(r => r.val !== '-');
            let chipsHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:var(--bg);border-radius:12px;border:1px solid var(--border);margin-bottom:16px;">';
            validRows.forEach(r => {
              const isCheck = r.val.includes('svg') || r.val === 'Yes' || r.val === '✔' || r.val === 'Pass';
              const displayText = isCheck ? r.field : `${r.field}: ${r.val}`;
              chipsHTML += `<span style="display:inline-flex;align-items:center;gap:6px;background:var(--white);border:1px solid var(--border);color:var(--ink2);font-size:12px;font-weight:600;padding:6px 12px;border-radius:20px;box-shadow:var(--shadow-sm);">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a6b2a" stroke-width="3.5" width="11" height="11" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
                ${displayText}
              </span>`;
            });
            chipsHTML += '</div>';
            bodyHTML = chipsHTML;
          } else {
            bodyHTML = buildRowsHTML(rowsArr, gridId);
          }
          html += accord(accPrefix + (accIndex++), 'list', secName.replace(/^\d+\.\s*/, ''), bodyHTML);
        }

        if (showOtherSpecs) {
          let otherRowsArr = [];
          for (const [k, val] of Object.entries(mergedObj)) {
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) continue;
            // Also explicitly filter out keys from FULL_SCHEMA if they matched elsewhere to avoid duplicate logic
            if (!matchedKeys.has(k) && !isMatchedBySchema(FULL_SCHEMA, mergedObj, k)) {
              otherRowsArr.push({ field: k, val });
            }
          }
          
          if (otherRowsArr.length) {
            const gridId = accPrefix + 'grid-other';
            const bodyHTML = buildRowsHTML(otherRowsArr, gridId);
            html += accord(accPrefix + (accIndex++), 'list', otherTitle, bodyHTML);
          }
        }

        return html;
      }

      function specTable(v) {
        const merged = Object.assign({}, car.specs, v ? (v.specs || {}) : {});
        return renderTemplateSchema(SPEC_SCHEMA, merged, 'spec-acc-', true, 'Additional Specifications');
      }

      /* ── Features / highlights grid ── */
      function featGrid(v) {
        const mergedObj = Object.assign({}, car.specs, v ? (v.specs || {}) : {});
        const allFeats = [...new Set([...(v ? v.features || [] : []), ...(car.features || []), ...(car.highlights || [])])];
        const chkIcon = `<span style="width:16px;height:16px;min-width:16px;display:inline-flex;color:#16a34a">${svgI('chk')}</span>`;
        allFeats.forEach(f => {
            mergedObj[f] = chkIcon; 
        });
        return renderTemplateSchema(FEAT_SCHEMA, mergedObj, 'feat-acc-', true, 'Additional Features');
      }

      /* ── EMI calculator HTML ── */
      function emiHTML(v, pfx) {
        const dp = 40, dr = 10.5;
        const loan = v.price * (1 - dp / 100);

        const emiRow = (years, highlight) => {
          const dt = years * 12;
          const emi = calcEMI(loan, dr, dt);
          return `<div class="dp-emi-row${highlight ? ' highlight' : ''}">
            <span class="dp-emi-row-lbl">${years} yrs &mdash; ${dt} months</span>
            <strong class="dp-emi-row-val">Rs. ${Math.round(emi).toLocaleString()}<span style="font-size:10px;font-weight:500;opacity:.7">/mo</span></strong>
          </div>`;
        };

        return `
      <div class="dp-emi-premium-card">
        <div class="dp-emi-summary">
          <div class="dp-emi-loan-amt">
            <span class="lbl">Loan Amount</span>
            <span class="val">${window.Rs(Math.round(loan))}</span>
          </div>
          <div class="dp-emi-details">
            <span>Down: <strong>40%</strong></span> &bull; <span>Rate: <strong>${dr}%</strong></span>
          </div>
        </div>
        <div class="dp-emi-rows">
          ${emiRow(5, false)}
          ${emiRow(6, true)}
          ${emiRow(7, false)}
        </div>
        <a href="/caremi" class="dp-emi-tool-btn">
          <svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="11" y2="17"/></svg>
          Customize EMI Calculator
        </a>
      </div>`;
      }

      /* ── Sidebar card ── */
      function sidebarHTML() {
        const v = vr();
        const cols = car.colors || [];
        const hasColors = cols.length > 0;
        const colorHTML = hasColors ? `
          <div class="dp-color-box" style="padding:18px; border-bottom:1px solid var(--border);">
            <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:12px">Available Colours</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
              ${cols.map((c, i) => `<div style="width:28px;height:28px;border-radius:50%;background:${c.hex};cursor:pointer;border:2px solid ${i===0?'var(--ink)':'transparent'};box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);" onclick="this.parentNode.querySelectorAll('div').forEach(el=>el.style.border='2px solid transparent');this.style.border='2px solid var(--ink)';document.getElementById('sb-color-name').textContent='${c.name}'" title="${c.name}"></div>`).join('')}
            </div>
            <div style="font-size:13px;color:var(--ink2);font-weight:600" id="sb-color-name">${cols[0].name}</div>
          </div>
        ` : '';
        
        return `<div class="dp-scard">
      <div class="dp-price-box">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:4px">Ex-showroom price</div>
        <div class="dp-price-main" id="dp-price-d">${window.Rs(v.price)}</div>
        <div class="dp-price-note" id="dp-var-note">${v.name} · Contact for on-road price</div>
        <div class="dp-cta-stack">
          
          <button class="dp-cta-gold" onclick="AV.openTestDriveModal('${slug}')">
          
            Book a test drive
          </button>
          <button class="dp-cta-primary" onclick="AV.openRequestInfoModal('${slug}')">
          
            Ask about this car
          </button>
          <button class="dp-cta-ghost" style="display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;border:1.5px solid var(--border);background:#fff;color:var(--ink);border-radius:10px;padding:10px 14px;font-size:13px;font-weight:700;font-family:var(--font-b);transition:all .18s;" onmouseover="this.style.borderColor='var(--g3)';this.style.color='var(--g3)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--ink)'" onclick="AV.openBrochureModal('${slug}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Download Brochure
          </button>
          <a href="tel:+9779828364940" class="dp-cta-ghost" style="display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            +977-9828364940
          </a>
        </div>
      </div>
      <div class="dp-emi-box">
        <div class="dp-emi-hd">
          <div class="dp-emi-hd-left">${svgI('calc')} Finance Estimates</div>
          <span class="dp-emi-badge">40% down</span>
        </div>
        <div id="emi-sb-wrap">${emiHTML(v, 'sb')}</div>
      </div>
      ${colorHTML}
      <div class="dp-contact-row">
        ${svgI('ph')} <a href="tel:+9779828364940">+977-9828364940</a>&nbsp;·&nbsp;Mon–Sat 9am–6pm
      </div>
    </div>

    <div style="margin-top:16px;background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px;">
      <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:14px;">Popular Cars</div>
      ${CARS_DB.filter(c => c.slug && c.slug !== slug).slice(0, 5).map(c => `
        <a href="#car/${c.slug}" style="display:flex;gap:12px;padding:8px 0;text-decoration:none;border-bottom:1px solid #f5f5f5;transition:background .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
          <img src="${(c.images && c.images[0]) || ''}" style="width:64px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0;">
          <div style="display:flex;flex-direction:column;justify-content:center;min-width:0;">
            <div style="font-size:12.5px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.brand} ${c.model}</div>
            <div style="font-size:12px;color:var(--g3);font-weight:600;">${window.Rs(c.variants?.[0]?.price || c.price)}</div>
          </div>
        </a>
      `).join('')}
      <a href="#cars" style="display:block;text-align:center;font-size:12px;font-weight:700;color:var(--g3);text-decoration:none;margin-top:12px;padding-top:10px;border-top:1px solid #eee;">View All Cars &rarr;</a>
    </div>`;
      }

      /* ── Accordion builder ── */
      function accord(id, iconKey, title, body, open = false) {
        return `<div class="dp-accord-wrap${open ? ' open' : ''}" id="${id}">
      <div class="dp-accord-hd" onclick="window.dpAccord(this)">
        <div class="dp-accord-title">${svgI(iconKey)} ${title}</div>
        <div class="dp-accord-arr">${svgI('chev')}</div>
      </div>
      <div class="dp-accord-body"><div class="dp-accord-body-inner">${body}</div></div>
    </div>`;
      }



      /* ── Services ── */
      function servicesHTML() {
        return `<div class="dp-services">
          <div class="section-hd" style="margin-bottom:0;">Explore More on AutoViindu</div>
          <div class="dp-services-grid">
            <a href="#services" class="dp-srv-card" style="text-decoration:none;cursor:pointer;">
              <div class="icon">${svgI('calc')}</div>
              <div class="text">
                <strong>Auto Finance</strong>
                <span>Get up to 80% financing</span>
              </div>
            </a>
            <a href="#insurance" class="dp-srv-card" style="text-decoration:none;cursor:pointer;">
              <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <div class="text">
                <strong>Car Insurance</strong>
                <span>Instant quotes & fast claims</span>
              </div>
            </a>
            <a href="#used-cars" class="dp-srv-card" style="text-decoration:none;cursor:pointer;">
              <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>
              <div class="text">
                <strong>Used Cars</strong>
                <span>Quality pre-owned vehicles</span>
              </div>
            </a>
            <a href="#cars" class="dp-srv-card" style="text-decoration:none;cursor:pointer;">
              <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
              <div class="text">
                <strong>Browse All Cars</strong>
                <span>Find your perfect match</span>
              </div>
            </a>
            <div class="dp-srv-card" onclick="AV.openTestDriveModal('${slug}')" style="cursor:pointer">
              <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg></div>
              <div class="text">
                <strong>Book Test Drive</strong>
                <span>Experience it today</span>
              </div>
            </div>
            <a href="tel:+9779828364940" class="dp-srv-card" style="text-decoration:none;cursor:pointer;">
              <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg></div>
              <div class="text">
                <strong>Contact Us</strong>
                <span>+977-9828364940</span>
              </div>
            </a>
          </div>
        </div>`;
      }

      /* ── Similar cars ── */
      function similarCars() {
        const similar = CARS_DB.filter(c => c.slug && c.slug !== slug && c.body && car.body && c.body.toLowerCase() === car.body.toLowerCase()).slice(0, 10);
        if (!similar.length) return '';
        return `<div class="wrap dp-similar" style="margin-top:40px;margin-bottom:40px;">
      <div class="home-head" style="margin-bottom:8px;">
        <div class="home-head__left">
          <span class="home-eyebrow">You may also like</span>
          <h2 class="home-title" style="font-size:clamp(18px,2.5vw,22px);">Similar Cars</h2>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <button type="button" class="home-link" onclick="AV.goTo('cars')">See all ${IC.chevR || '→'}</button>
          <div class="carousel-nav-arrows">
            <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('similar-carousel', -1)" aria-label="Scroll left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('similar-carousel', 1)" aria-label="Scroll right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>
      <div class="home-carousel car-carousel" id="similar-carousel">${similar.map(c => carCard(c)).join('')}</div>
    </div>`;
      }

      /* ── RENDER ── */
      const v0 = vr();
      document.getElementById('app-root').innerHTML = `
  <div style="background:linear-gradient(160deg,var(--g0),var(--g1));padding:14px 0 16px;position:relative;overflow:hidden">
    <div class="wrap">
      <div class="breadcrumb">
        <a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span>
        <a onclick="AV.goTo('cars')">Cars</a><span class="bc-sep">/</span>
        <span style="color:rgba(255,255,255,.7)">${car.brand} ${car.model}</span>
      </div>
      <!-- Desktop title only — hidden on mobile via JS -->
      <div id="dp-desk-hd" style="display:none">
        <h1 style="font-family:var(--font-d);font-size:clamp(22px,3.5vw,32px);color:#fff;font-weight:700;line-height:1.1;margin-bottom:5px">
          ${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span>
        </h1>
        <div style="font-size:12px;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${car.type} · ${car.body} · ${car.variants.length} variants
          <span class="cc-rating">${IC.star} ${fmtR(car.rating)}</span>
          <span>${car.reviews} reviews</span>
        </div>
      </div>
    </div>
  </div>

  <div class="wrap dp-layout detail-page-body">

    <!-- ═══ LEFT: main content ═══ -->
    <div style="min-width:0">

      <!-- Gallery -->
      <div class="dp-gallery-card"><div id="gal-wrap"></div></div>

      <!-- Highlights -->
      <div class="dp-hl-card" id="dp-qs">${qsStrip(v0)}</div>

      <!-- Mobile title (hidden on desktop) -->
      <div class="dp-mob-title">
        <h1>${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span></h1>
        <div class="dp-mob-title-sub">
          ${car.type} · ${car.body} · ${car.variants.length} variants
          <span class="cc-rating">${IC.star} ${fmtR(car.rating)}</span>
        </div>
      </div>

      <!-- Variant tabs -->
      <div class="dp-var-wrap">
        <div class="dp-var-lbl">Choose variant</div>
        <div class="dp-var-tabs" id="dp-vtabs">${varTabs()}</div>
      </div>

      <!-- Tabs Navigation -->
      <div class="dp-tabs-nav">
        <button class="dp-tab-btn active" onclick="AV.switchDpTab('dp-tab-overview', this)">Overview</button>
        <button class="dp-tab-btn" onclick="AV.switchDpTab('dp-tab-features', this)">Features</button>
        <button class="dp-tab-btn" id="dp-tab-btn-specs" onclick="AV.switchDpTab('dp-tab-specs', this)">Specifications</button>
      </div>

      <!-- Tab: Overview -->
      <div class="dp-tab-pane active" id="dp-tab-overview">
        <div class="dp-spec-grid" style="border-top:1px solid var(--border);">
          <div class="dp-spec-row"><div class="dp-spec-label">Vehicle Description</div><div class="dp-spec-val">${car.brand} ${car.model} ${car.year}</div></div>
          <div class="dp-spec-row"><div class="dp-spec-label">Body Type</div><div class="dp-spec-val">${car.body || 'N/A'}</div></div>
          <div class="dp-spec-row"><div class="dp-spec-label">Fuel Type</div><div class="dp-spec-val">${car.type || (v0.specs && v0.specs['Fuel Type']) || 'Petrol'}</div></div>
          <div class="dp-spec-row"><div class="dp-spec-label">Transmission</div><div class="dp-spec-val">${(v0.specs && v0.specs['Transmission']) || 'Manual'}</div></div>
          <div class="dp-spec-row"><div class="dp-spec-label">Power</div><div class="dp-spec-val">${(v0.specs && (v0.specs['Power'] || v0.specs['Motor Power'])) || car.specs?.['Power'] || car.specs?.['Motor Power'] || '—'}</div></div>
          <div class="dp-spec-row"><div class="dp-spec-label">Seating</div><div class="dp-spec-val">${(v0.specs && v0.specs['Seating']) || car.specs?.['Seating'] || '5'}</div></div>
          <div class="dp-spec-row"><div class="dp-spec-label">Boot Space</div><div class="dp-spec-val">${(v0.specs && v0.specs['Boot Space']) || car.specs?.['Boot Space'] || '—'}</div></div>
        </div>

        ${car.tagline || car.overview ? `
        <div style="padding:14px 16px;background:var(--white);border-bottom:1px solid var(--border)">
          ${car.tagline ? `<p style="font-size:14px;color:var(--ink3);line-height:1.75;font-style:italic;margin-bottom:${car.overview ? '10px' : '0'}">"${car.tagline}"</p>` : ''}
          ${car.overview ? `<p style="font-size:13.5px;color:var(--ink3);line-height:1.85;margin:0">${car.overview}</p>` : ''}
        </div>`: ''}

        <!-- EMI Calculator — mobile accordion, hidden on desktop -->
        <div class="dp-mob-emi-acc">
          ${accord('acc-emi', 'calc', 'EMI Calculator', `<div id="emi-mob-wrap">${emiHTML(v0, 'mob')}</div>`)}
        </div>
      </div>

      <!-- Tab: Features -->
      <div class="dp-tab-pane" id="dp-tab-features">
        <div id="feat-body">${featGrid(v0)}</div>
      </div>

      <!-- Tab: Specifications -->
      <div class="dp-tab-pane" id="dp-tab-specs">
        <div id="spec-body">${specTable(v0)}</div>
      </div>




    </div>

    <!-- ═══ RIGHT: sticky sidebar (desktop only) ═══ -->
    <div class="dp-sidebar" id="dp-sidebar">
      ${sidebarHTML()}
    </div>
  </div>

  <!-- Similar cars (Full Width) -->
  ${similarCars()}

  <!-- Mobile sticky bottom bar -->
  <div class="dp-mob-bar">
    <div class="dp-mob-price">
      <div class="dp-mob-price-lbl">Ex-showroom from</div>
      <div class="dp-mob-price-val" id="dp-mob-price">${window.Rs(v0.price)}</div>
    </div>
    <div class="dp-mob-btns">
      <button class="dp-mob-btn-g" onclick="AV.openTestDriveModal('${slug}')">Test Drive</button>
      <button class="dp-mob-btn-p" onclick="AV.openRequestInfoModal('${slug}')">Request Info</button>
    </div>
  </div>`;

      /* desktop: show hero title + sidebar */
      const mq = window.matchMedia('(min-width:900px)');
      function applyMQ(e) {
        const dh = document.getElementById('dp-desk-hd');
        const sb = document.getElementById('dp-sidebar');
        if (dh) dh.style.display = e.matches ? 'block' : 'none';
        if (sb) sb.style.display = e.matches ? 'flex' : 'none';
      }
      applyMQ(mq);
      mq.addEventListener('change', applyMQ);

      buildGallery(car, 'gal-wrap');
      updateCompareTray();
      updateCmpBtns();

      /* ── EMI recalc ── */
      AV.emiCalc = function (s, pfx) {
        const v = car.variants[activeVariant[s] || 0];
        const dpPct = +(document.getElementById(`${pfx}-dp`)?.value || 20);
        const ten = +(document.getElementById(`${pfx}-ten`)?.textContent || 60);
        const rate = +(document.getElementById(`${pfx}-rate`)?.value || 10.5);
        const loan = v.price * (1 - dpPct / 100);
        const emi = calcEMI(loan, rate, ten);
        const tot = emi * ten;
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set(`${pfx}-amt`, `Rs. ${Math.round(emi).toLocaleString()}`);
        set(`${pfx}-loan`, Rs(Math.round(loan)));
        set(`${pfx}-int`, Rs(Math.round(tot - loan)));
        set(`${pfx}-tot`, Rs(Math.round(tot)));
      };
      AV.switchDpTab = function(tabId, el) {
        document.querySelectorAll('.dp-tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.dp-tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        el.classList.add('active');
      };
      
      window.mmToggle = function (subId, btn) {
        const sub = document.getElementById(subId);
        if (!sub) return;
        const isOpen = sub.classList.contains('open');

        // close any other open submenu (accordion behavior)
        document.querySelectorAll('.mm-sub.open').forEach(el => {
          el.classList.remove('open');
          el.style.maxHeight = '';
        });
        document.querySelectorAll('.mm-btn.open').forEach(b => b.classList.remove('open'));

        if (!isOpen) {
          sub.classList.add('open');
          sub.style.maxHeight = sub.scrollHeight + 'px'; // fits exact content, no clipping
          btn.classList.add('open');
        }
      };

      /* ── Variant switch — updates EVERYTHING instantly ── */
      AV.switchVariant = function (s, idx) {
        if (s !== slug) return;
        const i = parseInt(idx);
        activeVariant[slug] = i;
        const v = car.variants[i];

        /* variant tab highlight */
        document.querySelectorAll('.dp-var-tab').forEach((t, ti) => t.classList.toggle('active', ti === i));

        /* price displays */
        const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setText('dp-price-d', window.Rs(v.price));
        setText('dp-var-note', `${v.name} · Contact for on-road price`);
        setText('dp-mob-price', window.Rs(v.price));

        /* key info grid */
        const ki = document.getElementById('dp-ki');
        if (ki) ki.innerHTML = kiGrid(v);

        /* quick stats strip */
        const qs = document.getElementById('dp-qs');
        if (qs) qs.innerHTML = qsStrip(v);

        /* spec table */
        const sp = document.getElementById('spec-body');
        if (sp) sp.innerHTML = specTable(v);

        /* features */
        const ft = document.getElementById('feat-body');
        if (ft) ft.innerHTML = featGrid(v);

        /* both EMI calculators */
        const emiSb = document.getElementById('emi-sb-wrap');
        if (emiSb) emiSb.innerHTML = emiHTML(v, 'sb');
        const emiMob = document.getElementById('emi-mob-wrap');
        if (emiMob) emiMob.innerHTML = emiHTML(v, 'mob');

        /* gallery — swap if variant has own images */
        buildGallery(v.images ? { ...car, images: v.images } : car, 'gal-wrap');
        updateCmpBtns();
      };

      /* ── Colour picker ── */
      AV.pickColor = function (el, name) {
        document.querySelectorAll('.dp-color-swatch').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
        const cn = document.getElementById('dp-color-name');
        if (cn) cn.textContent = name;
      };

      /* ── INJECT CLEAN 1-PAGE LEAD MODALS (TEST DRIVE & REQUEST INFO) ── */
      function ensureSimpleModals() {
        if (!document.getElementById('av-td-overlay')) {
          const tdWrap = document.createElement('div');
          tdWrap.innerHTML = `
<div class="av-modal-overlay" id="av-td-overlay" onclick="if(event.target===this)AV.closeTDModal()">
  <div class="av-modal-box">
    <div class="av-modal-head simple-head">
      <button type="button" class="simple-head-back" onclick="AV.closeTDModal()" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="simple-head-title">Book a Test Drive</div>
      <div class="simple-head-badge" id="td-car-badge">Loading...</div>
    </div>
    <div class="av-modal-body" id="td-body-wrap" style="overflow-y:auto;max-height:64vh;padding:22px 20px 4px">
      <form id="td-form" onsubmit="AV.submitTD(event)">
        <div class="pill-group">
          <input type="text" class="pill-inp" id="td-name" placeholder="Full name" required>
        </div>
        <div class="pill-row">
          <div class="pill-group">
            <input type="tel" class="pill-inp" id="td-phone" placeholder="Phone number" required>
          </div>
          <div class="pill-group">
            <input type="email" class="pill-inp" id="td-email" placeholder="Email address" required>
          </div>
        </div>
        <div class="pill-row">
          <div class="pill-group">
            <select class="pill-inp pill-select" id="td-city" required>
              <option value="" disabled selected>City</option>
              <option>Kathmandu</option><option>Lalitpur</option><option>Bhaktapur</option>
              <option>Pokhara</option><option>Biratnagar</option><option>Birgunj</option>
              <option>Dharan</option><option>Butwal</option><option>Hetauda</option>
              <option>Chitwan</option><option>Nepalgunj</option><option>Other</option>
            </select>
          </div>
          <div class="pill-group">
            <input type="date" class="pill-inp" id="td-date" required>
          </div>
        </div>
        <div class="pill-group">
          <div class="pill-caption">Preferred time</div>
          <div class="pill-time-grid">
            <button type="button" class="pill-time-btn selected" onclick="AV.selectTDTime('10:00 AM',this)">10 AM</button>
            <button type="button" class="pill-time-btn" onclick="AV.selectTDTime('11:00 AM',this)">11 AM</button>
            <button type="button" class="pill-time-btn" onclick="AV.selectTDTime('12:00 PM',this)">12 PM</button>
            <button type="button" class="pill-time-btn" onclick="AV.selectTDTime('2:00 PM',this)">2 PM</button>
            <button type="button" class="pill-time-btn" onclick="AV.selectTDTime('3:00 PM',this)">3 PM</button>
            <button type="button" class="pill-time-btn" onclick="AV.selectTDTime('4:00 PM',this)">4 PM</button>
            <button type="button" class="pill-time-btn" onclick="AV.selectTDTime('5:00 PM',this)">5 PM</button>
            <button type="button" class="pill-time-btn" onclick="AV.selectTDTime('6:00 PM',this)">6 PM</button>
          </div>
          <input type="hidden" id="td-time-val" value="10:00 AM">
        </div>
        <div style="margin:18px 0 20px">
          <button type="submit" class="pill-submit" id="td-submit-btn">Confirm Test Drive Booking</button>
        </div>
      </form>
    </div>
    <div class="av-modal-success cute-success" id="td-success-wrap" style="display:none">
      <div class="success-icon-pop">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="av-success-title" style="font-size:17px;font-weight:800;color:var(--ink);margin-bottom:8px">Test Drive Booked! 🚗</div>
      <div class="av-success-sub" style="font-size:13px;color:var(--ink4);margin-bottom:16px">Our team will call you shortly to confirm your slot.</div>
      <button type="button" class="pill-submit" onclick="AV.closeTDModal()" style="max-width:180px;margin:0 auto">Done</button>
    </div>
  </div>
</div>`;
          document.body.appendChild(tdWrap.firstElementChild || tdWrap.firstChild);
        }

        if (!document.getElementById('av-ri-overlay')) {
          const riWrap = document.createElement('div');
          riWrap.innerHTML = `
<div class="av-modal-overlay" id="av-ri-overlay" onclick="if(event.target===this)AV.closeRIModal()">
  <div class="av-modal-box">
    <div class="av-modal-head simple-head">
      <button type="button" class="simple-head-back" onclick="AV.closeRIModal()" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="simple-head-title">Request Information</div>
      <div class="simple-head-badge" id="ri-car-badge">Loading...</div>
    </div>
    <div class="av-modal-body" id="ri-body-wrap" style="overflow-y:auto;max-height:62vh;padding:22px 20px 4px">
      <form id="ri-form" onsubmit="AV.submitRI(event)">
        <div class="pill-group">
          <input type="text" class="pill-inp" id="ri-name" placeholder="Full name" required>
        </div>
        <div class="pill-row">
          <div class="pill-group">
            <input type="tel" class="pill-inp" id="ri-phone" placeholder="Phone number" required>
          </div>
          <div class="pill-group">
            <input type="email" class="pill-inp" id="ri-email" placeholder="Email address" required>
          </div>
        </div>
        <div class="pill-group">
          <select class="pill-inp pill-select" id="ri-city" required>
            <option value="" disabled selected>City</option>
            <option>Kathmandu</option><option>Lalitpur</option><option>Bhaktapur</option>
            <option>Pokhara</option><option>Biratnagar</option><option>Birgunj</option>
            <option>Dharan</option><option>Butwal</option><option>Chitwan</option>
            <option>Nepalgunj</option><option>Other</option>
          </select>
        </div>
        <div class="pill-group">
          <textarea class="pill-inp pill-textarea" id="ri-msg" placeholder="What do you need? e.g. On-road price, financing, discount offers…" required></textarea>
        </div>
        <div style="margin:6px 0 20px">
          <button type="submit" class="pill-submit" id="ri-submit-btn">Send Information Request</button>
        </div>
      </form>
    </div>
    <div class="av-modal-success cute-success" id="ri-success-wrap" style="display:none">
      <div class="success-icon-pop" style="background:#eff6ff;border-color:#2563eb;color:#2563eb">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="av-success-title" style="font-size:17px;font-weight:800;color:var(--ink);margin-bottom:8px">Request Sent! 📩</div>
      <div class="av-success-sub" style="font-size:13px;color:var(--ink4);margin-bottom:16px">Our team will reach you with all the details shortly.</div>
      <button type="button" class="pill-submit" onclick="AV.closeRIModal()" style="max-width:160px;margin:0 auto">Done</button>
    </div>
  </div>
</div>`;
          document.body.appendChild(riWrap.firstElementChild || riWrap.firstChild);
        }

        if (!document.getElementById('av-brochure-overlay')) {
          const brWrap = document.createElement('div');
          brWrap.innerHTML = `
<div class="av-modal-overlay" id="av-brochure-overlay" onclick="if(event.target===this)AV.closeBrochureModal()">
  <div class="av-modal-box">
    <button type="button" class="av-modal-close" onclick="AV.closeBrochureModal()" style="color:#fff;background:rgba(255,255,255,0.15)">&times;</button>
    <div class="av-modal-head cute-head brochure-theme">
      <div class="cute-avatar" style="background:rgba(255,255,255,0.15);box-shadow:0 8px 20px rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.2)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      </div>
      <div class="av-modal-title">Download Brochure</div>
      <div class="av-modal-sub">Full specs, features &amp; pricing — free PDF</div>
      <div class="av-modal-badge" id="br-car-badge" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.2)">Loading...</div>
    </div>
    <div class="av-modal-body" id="br-body-wrap" style="overflow-y:auto;max-height:58vh;padding:18px 20px 4px">
      <form id="br-form" onsubmit="AV.submitBrochure(event)">
        <div class="cute-input-group">
          <label class="cute-label">Full Name <span>*</span></label>
          <div class="cute-input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input type="text" class="cute-inp" id="br-name" placeholder="Your full name" required>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="cute-input-group">
            <label class="cute-label">Email <span>*</span></label>
            <div class="cute-input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input type="email" class="cute-inp" id="br-email" placeholder="you@email.com" required>
            </div>
          </div>
          <div class="cute-input-group">
            <label class="cute-label">Phone <span>*</span></label>
            <div class="cute-input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <input type="tel" class="cute-inp" id="br-phone" placeholder="98XXXXXXXX" required>
            </div>
          </div>
        </div>
        <div class="cute-input-group">
          <label class="cute-label">City <span style="font-weight:500;color:var(--ink4)">(optional)</span></label>
          <select class="cute-inp cute-select" id="br-city">
            <option value="">Select city (optional)</option>
            <option>Kathmandu</option><option>Lalitpur</option><option>Bhaktapur</option>
            <option>Pokhara</option><option>Biratnagar</option><option>Birgunj</option>
            <option>Dharan</option><option>Butwal</option><option>Chitwan</option>
            <option>Nepalgunj</option><option>Other</option>
          </select>
        </div>
        <div style="margin:4px 0 20px">
          <button type="submit" class="cute-submit" id="br-submit-btn" style="background:linear-gradient(135deg,#092c13,#1a6b2a)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Brochure
          </button>
        </div>
      </form>
    </div>
    <div class="av-modal-success cute-success" id="br-success-wrap" style="display:none">
      <div class="success-icon-pop" style="background:var(--g-ll);border-color:var(--g3);color:var(--g3)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="av-success-title" style="font-size:17px;font-weight:800;color:var(--ink);margin-bottom:8px">Brochure Ready! 📄</div>
      <div class="av-success-sub" style="font-size:13px;color:var(--ink4);margin-bottom:16px">Opening in a new tab. Use browser Print → Save as PDF.</div>
      <button type="button" class="cute-submit" onclick="AV.closeBrochureModal()" style="max-width:160px;margin:0 auto">Done</button>
    </div>
  </div>
</div>`;
          document.body.appendChild(brWrap.firstElementChild || brWrap.firstChild);
        }
      }

      /* ── MODAL ACTION METHODS ── */
      AV.selectTDTime = function (timeStr, btn) {
        document.querySelectorAll('#av-td-overlay .cute-time-btn').forEach(b => b.classList.remove('selected'));
        if (btn) btn.classList.add('selected');
        const inp = document.getElementById('td-time-val');
        if (inp) inp.value = timeStr;
      };

      AV.openTestDriveModal = function (slug) {
        ensureSimpleModals();
        const targetSlug = slug || AV._currentDetailSlug;
        const car = (window.CARS_DB || []).find(x => x.slug === targetSlug);
        AV._targetModalSlug = targetSlug;
        AV._targetModalCar = car;

        const badge = document.getElementById('td-car-badge');
        if (badge) {
          badge.textContent = car ? car.brand + ' ' + car.model + (car.year ? ' ' + car.year : '') : 'AutoViindu Vehicle';
        }

        const dateInp = document.getElementById('td-date');
        if (dateInp) {
          const tom = new Date(); tom.setDate(tom.getDate() + 1);
          dateInp.min = tom.toISOString().split('T')[0];
          dateInp.value = tom.toISOString().split('T')[0];
        }

        /* Reset form & view */
        const form = document.getElementById('td-form');
        if (form) form.reset();
        const bw = document.getElementById('td-body-wrap'); if (bw) bw.style.display = 'block';
        const sw = document.getElementById('td-success-wrap'); if (sw) sw.style.display = 'none';

        const ov = document.getElementById('av-td-overlay');
        if (ov) {
          ov.style.display = 'flex';
          requestAnimationFrame(() => ov.classList.add('open', 'show'));
          document.body.style.overflow = 'hidden';
        }
      };

      AV.closeTDModal = function () {
        const ov = document.getElementById('av-td-overlay');
        if (ov) {
          ov.classList.remove('open', 'show');
          setTimeout(() => { ov.style.display = 'none'; }, 200);
        }
        document.body.style.overflow = '';
      };

      AV.submitTD = function (e) {
        if (e) e.preventDefault();
        const name = document.getElementById('td-name');
        const phone = document.getElementById('td-phone');
        const email = document.getElementById('td-email');
        const date = document.getElementById('td-date');
        const time = document.getElementById('td-time-val');
        const msg = document.getElementById('td-msg');
        const city = document.getElementById('td-city');

        if (!name || !name.value.trim()) { name && name.focus(); alert('Please enter your full name.'); return; }
        if (!phone || !phone.value.trim()) { phone && phone.focus(); alert('Please enter your phone number.'); return; }
        if (!email || !email.value.trim()) { email && email.focus(); alert('Please enter your email address.'); return; }
        if (!date || !date.value) { date && date.focus(); alert('Please choose a preferred date.'); return; }

        const btn = document.getElementById('td-submit-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

        const car = AV._targetModalCar;
        const carName = car ? (car.brand + ' ' + car.model + (car.year ? ' ' + car.year : '')) : (AV._targetModalSlug || 'Vehicle Test Drive');

        fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'testDrive',
            formId: 'testDrive',
            carModel: carName,
            carSlug: AV._targetModalSlug,
            name: name.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            city: city ? city.value : '',
            date: date.value,
            time: time ? time.value : '9:00 AM',
            message: msg ? msg.value.trim() : '',
            timestamp: new Date().toISOString()
          })
        }).then(() => {
          const bw = document.getElementById('td-body-wrap'); if (bw) bw.style.display = 'none';
          const sw = document.getElementById('td-success-wrap'); if (sw) sw.style.display = 'block';
        }).catch(() => {
          if (btn) { btn.disabled = false; btn.textContent = 'Confirm Test Drive Booking'; }
          alert('Submission failed. Please call us directly: +977-9828364940');
        });
      };

      AV.openBrochureModal = function (slug) {
        ensureSimpleModals();
        const targetSlug = slug || AV._currentDetailSlug;
        const car = (window.CARS_DB || []).find(x => x.slug === targetSlug);
        AV._brochureSlug = targetSlug;
        AV._brochureCar = car;

        const badge = document.getElementById('br-car-badge');
        if (badge) {
          badge.textContent = car ? car.brand + ' ' + car.model + (car.year ? ' ' + car.year : '') : 'AutoViindu Vehicle';
        }
        const form = document.getElementById('br-form');
        if (form) form.reset();
        const bw = document.getElementById('br-body-wrap'); if (bw) bw.style.display = 'block';
        const sw = document.getElementById('br-success-wrap'); if (sw) sw.style.display = 'none';
        const btn = document.getElementById('br-submit-btn');
        if (btn) { btn.disabled = false; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="margin-right:6px;vertical-align:middle"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Download Brochure'; }

        const ov = document.getElementById('av-brochure-overlay');
        if (ov) {
          ov.style.display = 'flex';
          requestAnimationFrame(() => ov.classList.add('open', 'show'));
          document.body.style.overflow = 'hidden';
        }
      };

      AV.closeBrochureModal = function () {
        const ov = document.getElementById('av-brochure-overlay');
        if (ov) {
          ov.classList.remove('open', 'show');
          setTimeout(() => { ov.style.display = 'none'; }, 200);
        }
        document.body.style.overflow = '';
      };

      AV.submitBrochure = function (e) {
        if (e) e.preventDefault();
        const name = document.getElementById('br-name');
        const email = document.getElementById('br-email');
        const phone = document.getElementById('br-phone');
        const city = document.getElementById('br-city');

        if (!name || !name.value.trim()) { name && name.focus(); alert('Please enter your name.'); return; }
        if (!email || !email.value.trim()) { email && email.focus(); alert('Please enter your email address.'); return; }
        if (!phone || !phone.value.trim()) { phone && phone.focus(); alert('Please enter your phone number.'); return; }

        const btn = document.getElementById('br-submit-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Generating...'; }

        const car = AV._brochureCar;
        const carName = car ? (car.brand + ' ' + car.model + (car.year ? ' ' + car.year : '')) : (AV._brochureSlug || 'Vehicle');

        // Log download to admin panel
        fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formId: 'brochureDownload',
            type: 'brochureDownload',
            carModel: carName,
            carSlug: AV._brochureSlug,
            name: name.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            city: city ? city.value : '',
            downloadedAt: new Date().toISOString()
          })
        }).catch(() => {}); // fire-and-forget

        // Generate and open the brochure
        AV._generateBrochure(car, { name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim() });

        const bw = document.getElementById('br-body-wrap'); if (bw) bw.style.display = 'none';
        const sw = document.getElementById('br-success-wrap'); if (sw) sw.style.display = 'block';
      };

      AV._generateBrochure = function(car, user) {
        const v = (car && car.variants && car.variants[0]) || {};
        const brand = car ? car.brand : 'AutoViindu';
        const model = car ? car.model : 'Vehicle';
        const year = car ? (car.year || '') : '';
        const img = (car && car.images && car.images[0]) ? window.location.origin + '/' + car.images[0].replace(/^\//, '') : '';
        const price = v.price ? window.Rs(v.price) : 'Contact for pricing';
        const variants = (car && car.variants) ? car.variants : [];
        const specs = [
          ['Fuel Type', v.fuelType || car?.fuelType || '—'],
          ['Transmission', v.transmission || car?.transmission || '—'],
          ['Engine', v.engine || car?.engine || '—'],
          ['Seating', v.seats ? v.seats + ' Seats' : (car?.seats ? car.seats + ' Seats' : '—')],
          ['Body Type', car?.bodyType || '—'],
          ['Mileage', v.mileage || car?.mileage || '—'],
        ];

        const brochureHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${brand} ${model} ${year} – Brochure | AutoViindu</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#111; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  .cover { background: linear-gradient(135deg, #0a1a0d 0%, #1a6b2a 100%); color:#fff; padding:60px 48px 48px; position:relative; min-height:320px; display:flex; flex-direction:column; justify-content:flex-end; }
  .cover-logo { font-size:13px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.6); margin-bottom:auto; padding-bottom:32px; }
  .cover-year { font-size:14px; color:rgba(255,255,255,.55); font-weight:600; margin-bottom:8px; }
  .cover-title { font-size:48px; font-weight:900; line-height:1.05; margin-bottom:12px; }
  .cover-price { font-size:18px; font-weight:700; color:#7ddb95; }
  .cover-img { position:absolute; right:0; top:0; bottom:0; width:55%; object-fit:cover; opacity:.35; }
  .section { padding:40px 48px; }
  .section-title { font-size:10px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#1a6b2a; margin-bottom:20px; }
  .spec-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px 24px; }
  .spec-item { border-bottom:1px solid #eee; padding-bottom:12px; }
  .spec-label { font-size:10px; color:#888; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
  .spec-value { font-size:14px; font-weight:700; color:#111; }
  .variant-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f0f0f0; }
  .variant-name { font-size:14px; font-weight:600; }
  .variant-price { font-size:14px; font-weight:800; color:#1a6b2a; }
  .footer { background:#0a1a0d; color:rgba(255,255,255,.6); padding:24px 48px; font-size:12px; display:flex; justify-content:space-between; align-items:center; }
  .footer strong { color:#fff; }
  .divider { height:1px; background:#f0f0f0; margin:0 48px; }
  .highlight-box { background:#f6fdf7; border-left:4px solid #1a6b2a; padding:16px 20px; border-radius:0 8px 8px 0; margin:24px 0; }
  @media print {
    .no-print { display:none; }
    a[href]:after { content:''; }
  }
</style></head><body>
<div class="cover">
  ${img ? `<img class="cover-img" src="${img}" alt="${brand} ${model}">` : ''}
  <div class="cover-logo">AutoViindu · Official Brochure</div>
  <div class="cover-year">${year}</div>
  <div class="cover-title">${brand}<br>${model}</div>
  <div class="cover-price">Starting from ${price}</div>
</div>

<div class="section">
  <div class="section-title">Key Specifications</div>
  <div class="spec-grid">
    ${specs.filter(s => s[1] !== '—').map(s => `<div class="spec-item"><div class="spec-label">${s[0]}</div><div class="spec-value">${s[1]}</div></div>`).join('')}
  </div>
</div>

<div class="divider"></div>

${variants.length > 0 ? `
<div class="section">
  <div class="section-title">Available Variants & Pricing</div>
  ${variants.map(v2 => `<div class="variant-row"><span class="variant-name">${v2.name || 'Standard'}</span><span class="variant-price">${window.Rs ? window.Rs(v2.price) : 'NPR ' + (v2.price||'').toLocaleString()}</span></div>`).join('')}
</div>
<div class="divider"></div>` : ''}

<div class="section">
  <div class="section-title">Why Choose AutoViindu</div>
  <div class="highlight-box">
    <p style="font-size:14px;line-height:1.7;color:#333">AutoViindu is Nepal's trusted automotive platform, offering genuine pricing, expert advice, and seamless buying experience. Every vehicle listed undergoes thorough inspection and verification before listing.</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
    <div style="padding:14px;background:#f9f9f9;border-radius:8px;font-size:13px"><strong><i data-lucide="search"></i> Genuine Inspection</strong><br><span style="color:#666">Every car verified by our experts</span></div>
    <div style="padding:14px;background:#f9f9f9;border-radius:8px;font-size:13px"><strong><i data-lucide="banknote"></i> Best Pricing</strong><br><span style="color:#666">Transparent, no hidden costs</span></div>
    <div style="padding:14px;background:#f9f9f9;border-radius:8px;font-size:13px"><strong><i data-lucide="handshake"></i> Easy Finance</strong><br><span style="color:#666">Up to 80% financing available</span></div>
    <div style="padding:14px;background:#f9f9f9;border-radius:8px;font-size:13px"><strong><i data-lucide="phone"></i> Dedicated Support</strong><br><span style="color:#666">Mon–Sat, 9am–6pm</span></div>
  </div>
</div>

<div class="footer">
  <div><strong>AutoViindu</strong> · Nayabazar, Kathmandu, Nepal · +977-9828364940</div>
  <div>Prepared for: <strong>${user.name}</strong> · ${new Date().toLocaleDateString('en-NP', {year:'numeric',month:'long',day:'numeric'})}</div>
</div>

<script>window.onload=function(){window.print()}</script>
</body></html>`;

        const win = window.open('', '_blank');
        if (win) {
          win.document.write(brochureHTML);
          win.document.close();
        }
      };

      AV.openRequestInfoModal = function (slug) {
        ensureSimpleModals();
        const targetSlug = slug || AV._currentDetailSlug;
        const car = (window.CARS_DB || []).find(x => x.slug === targetSlug);
        AV._targetModalSlug = targetSlug;
        AV._targetModalCar = car;

        const badge = document.getElementById('ri-car-badge');
        if (badge) {
          badge.textContent = car ? car.brand + ' ' + car.model + (car.year ? ' ' + car.year : '') : 'AutoViindu Vehicle';
        }

        const form = document.getElementById('ri-form');
        if (form) form.reset();
        const bw = document.getElementById('ri-body-wrap'); if (bw) bw.style.display = 'block';
        const sw = document.getElementById('ri-success-wrap'); if (sw) sw.style.display = 'none';

        const ov = document.getElementById('av-ri-overlay');
        if (ov) {
          ov.style.display = 'flex';
          requestAnimationFrame(() => ov.classList.add('open', 'show'));
          document.body.style.overflow = 'hidden';
        }
      };

      AV.closeRIModal = function () {
        const ov = document.getElementById('av-ri-overlay');
        if (ov) {
          ov.classList.remove('open', 'show');
          setTimeout(() => { ov.style.display = 'none'; }, 200);
        }
        document.body.style.overflow = '';
      };

      /* ── Used Car Inquiry Modal Actions ── */
      AV.openUsedInquiryModal = function (carId) {
        ensureSimpleModals();
        const USED = window.USED_CARS_DB || [];
        const car = USED.find(c => c.id === carId || c.id === String(carId));
        AV._usedInquiryCar = car;
        AV._usedInquiryCarId = carId;

        const badge = document.getElementById('ui-car-badge');
        if (badge && car) {
          badge.textContent = car.brand + ' ' + car.model + ' ' + car.year;
        } else if (badge) {
          badge.textContent = 'Used Vehicle';
        }

        // Reset form
        const form = document.getElementById('ui-form');
        if (form) form.reset();
        const bw = document.getElementById('ui-body-wrap');
        const sw = document.getElementById('ui-success-wrap');
        if (bw) bw.style.display = 'block';
        if (sw) sw.style.display = 'none';
        const btn = document.getElementById('ui-submit-btn');
        if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }

        const ov = document.getElementById('av-ui-overlay');
        if (ov) {
          ov.style.display = 'flex';
          requestAnimationFrame(() => ov.classList.add('open', 'show'));
          document.body.style.overflow = 'hidden';
        }
      };

      AV.closeUsedInquiryModal = function () {
        const ov = document.getElementById('av-ui-overlay');
        if (ov) {
          ov.classList.remove('open', 'show');
          setTimeout(() => { ov.style.display = 'none'; }, 200);
        }
        document.body.style.overflow = '';
      };

      AV.submitUsedInquiry = function (e) {
        if (e) e.preventDefault();
        const name = document.getElementById('ui-name');
        const phone = document.getElementById('ui-phone');
        const email = document.getElementById('ui-email');
        const city = document.getElementById('ui-city');
        const msg = document.getElementById('ui-msg');

        if (!name || !name.value.trim()) { name && name.focus(); alert('Please enter your full name.'); return; }
        if (!phone || !phone.value.trim()) { phone && phone.focus(); alert('Please enter your phone number.'); return; }
        if (!email || !email.value.trim()) { email && email.focus(); alert('Please enter your email address.'); return; }
        if (!city || !city.value) { city && city.focus(); alert('Please select your city.'); return; }
        if (!msg || !msg.value.trim()) { msg && msg.focus(); alert('Please enter your message.'); return; }

        const btn = document.getElementById('ui-submit-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

        const car = AV._usedInquiryCar;
        const carName = car ? (car.brand + ' ' + car.model + ' ' + car.year) : 'Used Vehicle';

        fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'usedCarInquiry',
            formId: 'usedCarInquiry',
            carModel: carName,
            carId: AV._usedInquiryCarId,
            name: name.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            city: city.value,
            message: msg.value.trim(),
            timestamp: new Date().toISOString()
          })
        }).then(() => {
          const bw = document.getElementById('ui-body-wrap'); if (bw) bw.style.display = 'none';
          const sw = document.getElementById('ui-success-wrap'); if (sw) sw.style.display = 'block';
        }).catch(() => {
          if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }
          alert('Submission failed. Please call us directly: +977-9828364940');
        });
      };

      AV.submitRI = function (e) {
        if (e) e.preventDefault();
        const name = document.getElementById('ri-name');
        const phone = document.getElementById('ri-phone');
        const email = document.getElementById('ri-email');
        const msg = document.getElementById('ri-msg');
        const city = document.getElementById('ri-city');

        if (!name || !name.value.trim()) { name && name.focus(); alert('Please enter your full name.'); return; }
        if (!phone || !phone.value.trim()) { phone && phone.focus(); alert('Please enter your phone number.'); return; }
        if (!email || !email.value.trim()) { email && email.focus(); alert('Please enter your email address.'); return; }
        if (!msg || !msg.value.trim()) { msg && msg.focus(); alert('Please enter what information you need.'); return; }

        const btn = document.getElementById('ri-submit-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

        const car = AV._targetModalCar;
        const carName = car ? (car.brand + ' ' + car.model + (car.year ? ' ' + car.year : '')) : (AV._targetModalSlug || 'Vehicle Info Request');

        fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'requestInfo',
            formId: 'requestInfo',
            carModel: carName,
            carSlug: AV._targetModalSlug,
            name: name.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            city: city ? city.value : '',
            message: msg.value.trim(),
            timestamp: new Date().toISOString()
          })
        }).then(() => {
          const bw = document.getElementById('ri-body-wrap'); if (bw) bw.style.display = 'none';
          const sw = document.getElementById('ri-success-wrap'); if (sw) sw.style.display = 'block';
        }).catch(() => {
          if (btn) { btn.disabled = false; btn.textContent = 'Send Information Request'; }
          alert('Submission failed. Please call us directly: +977-9828364940');
        });
      };

    }
    /* keep old dtab working for anything still calling it */
    function dtab(btn, paneId) { dpTab(btn, paneId); }

    /* ── LISTING FILTER HELPERS ── */
    const _budgetMap = {
      u20: [0, 2000000], u40: [0, 4000000], u60: [0, 6000000], u100: [0, 10000000], u200: [0, 20000000], above200: [20000000, Infinity],
      under20: [0, 2000000], '20to40': [2000000, 4000000], '40to70': [4000000, 7000000], '70to1cr': [7000000, 10000000], above1cr: [10000000, Infinity],
      '15': [0, 1500000], '25': [1500000, 2500000], '40': [2500000, 4000000], '60': [4000000, 6000000], '100': [6000000, 10000000], '999': [10000000, Infinity],
      'budget-30': [0, 3000000], 'budget-50': [3000000, 5000000], 'budget-80': [5000000, 8000000], 'budget-120': [8000000, 12000000], 'budget-200': [12000000, 20000000], 'budget-2cr+': [20000000, Infinity]
    };
    const _budgetPills = [['u20', 'Under 20L'], ['u40', 'Under 40L'], ['u60', 'Under 60L'], ['u100', 'Under 1Cr'], ['u200', 'Under 2Cr'], ['above200', '2Cr+']];

    function _carPrice(c) { return (c.variants || [{}])[0].price || 0; }
    function _carTransType(c) {
      const t = String((c.variants || [{}])[0].transmission || '').toLowerCase();
      if (/amt|cvt|dct|auto|at|ags|dsg|e-?cvt|ecvt|imt/.test(t)) return 'Automatic';
      if (/manual|mt/.test(t)) return 'Manual';
      return 'Other';
    }
    function _usedTransType(c) {
      const t = String(c.transmission || '').toLowerCase();
      return /auto|amt|cvt|dct|at/.test(t) ? 'Automatic' : 'Manual';
    }
    function _carMatchesTransSub(c, subTypes) {
      if (!subTypes || !subTypes.length) return true;
      const variants = (c.variants && c.variants.length) ? c.variants : [c];
      
      return subTypes.some(sub => {
        const s = sub.toLowerCase();
        return variants.some(v => {
          const tParts = [
            v.transmission,
            v.specs?.transmission,
            v.specs?.Transmission,
            c.specs?.transmission,
            c.specs?.Transmission,
            c.transmission
          ].filter(Boolean).join(' ').toLowerCase();

          if (s === 'amt') {
            return /\b(amt|ags|automated)\b/.test(tParts);
          }
          if (s === 'imt') {
            return /\b(imt)\b/.test(tParts);
          }
          if (s === 'cvt') {
            return /\b(cvt|ivt|continuously)\b/.test(tParts) && !/\b(ecvt|e-cvt)\b/.test(tParts);
          }
          if (s === 'regular (manual)') {
            return /\b(\d*mt|manual)\b/.test(tParts);
          }
          if (s === 'tc') {
            return /\b(\d*at|torque|converter)\b/.test(tParts);
          }
          if (s === 'dct') {
            return /\b(\d*dct|dsg|dual[- ]clutch)\b/.test(tParts);
          }
          if (s === 'ecvt / dht') {
            return /\b(ecvt|e-cvt|dht)\b/.test(tParts);
          }
          if (s === 'mct') {
            return /\b(mct)\b/.test(tParts);
          }
          if (s === 'semi-automatic / sequential manual') {
            return /\b(semi|sequential|paddle)\b/.test(tParts);
          }
          if (s === 'single-speed direct drive') {
            return /\b(single|direct|1-speed)\b/.test(tParts) || c.type === 'Electric' || c.isEV;
          }
          return false;
        });
      });
    }

    function _carMatchesDrivetrain(c, drivetrains) {
      if (!drivetrains || !drivetrains.length) return true;
      const getDriveVal = (specs) => {
        if (!specs) return '';
        for (const [k, v] of Object.entries(specs)) {
          const kl = k.toLowerCase();
          if (kl === 'drive' || kl === 'drivetrain' || kl === 'drive type') {
            return String(v).toLowerCase();
          }
        }
        return '';
      };
      let drive = getDriveVal(c.specs);
      if (!drive && c.variants) {
        for (const v of c.variants) {
          drive = getDriveVal(v.specs);
          if (drive) break;
        }
      }
      if (!drive) drive = 'fwd';
      return drivetrains.some(dt => {
        const s = dt.toLowerCase();
        if (s === '4x4') return /\b(4wd|4x4|allgrip pro|4xplor)\b/.test(drive);
        if (s === 'awd') return /\b(awd|allgrip awd|allgrip)\b/.test(drive) && !drive.includes('pro');
        if (s === 'rwd') return /\b(rwd|rear)\b/.test(drive);
        if (s === 'fwd') return /\b(fwd|2wd|front)\b/.test(drive);
        return false;
      });
    }
    function _filterPulse(gridId) {
      const g = document.getElementById(gridId);
      if (!g) return;
      g.classList.remove('lf-grid-pulse');
      void g.offsetWidth;
      g.classList.add('lf-grid-pulse');
      if (navigator.vibrate) try { navigator.vibrate(10); } catch (_) { }
    }
    function _cbRow(sf, type, val, label, ns = 'sf') {
      let on = false;
      if (type === 'certified') on = !!sf.certified;
      else if (type === 'owners') on = sf.owners === 1;
      else if (type === 'years') on = (sf.years || []).includes(+val);
      else on = (sf[type] || []).includes(val);
      return `<label class="sf-cb-label${on ? ' sf-cb-active' : ''}" data-${ns}-type="${type}" data-${ns}-val="${val}"><span class="sf-cb-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg></span>${label}</label>`;
    }
    function _pillRow(sf, type, val, label, ns) {
      const on = (sf[type] || []).includes(val);
      return `<button type="button" class="lf-pill-btn${on ? ' active' : ''}" data-${ns}-type="${type}" data-${ns}-val="${val}">${label}</button>`;
    }
    function _syncCbUI(prefix, sf) {
      const transWrap = document.querySelector(`.${prefix}-trans-sub-wrap`);
      if (transWrap) transWrap.style.display = sf.transmissions.length > 0 ? '' : 'none';
      
      document.querySelectorAll(`[data-${prefix}-type]`).forEach(el => {
        const type = el.dataset[`${prefix}Type`];
        const val = el.dataset[`${prefix}Val`];
        
        if (type === 'transmissionsSub') {
          const isManual = val === 'iMT' || val === 'Regular (manual)';
          const show = isManual ? sf.transmissions.includes('Manual') : sf.transmissions.includes('Automatic');
          el.style.display = show ? '' : 'none';
        }
        
        let on = false;
        if (type === 'certified') on = !!sf.certified;
        else if (type === 'owners') on = sf.owners === 1;
        else if (type === 'years') on = (sf.years || []).includes(+val);
        else on = (sf[type] || []).includes(val);
        if (el.classList.contains('sf-cb-label')) {
          el.classList.toggle('sf-cb-active', on);
          const box = el.querySelector('.sf-cb-box');
          if (box) {
            box.classList.toggle('sf-cb-checked', on);
            box.innerHTML = on ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>' : '';
          }
        } else {
          el.classList.toggle('active', on);
        }
      });
    }
    function _renderActiveTags(sf, containerId, ns, onRemove) {
      const el = document.getElementById(containerId);
      if (!el) return;
      const tags = [];
      const add = (label, type, val) => tags.push({ label, type, val });
      (sf.brands || []).forEach(v => add(v, 'brands', v));
      (sf.fuels || []).forEach(v => add(v, 'fuels', v));
      (sf.bodies || []).forEach(v => add(v, 'bodies', v));
      (sf.transmissions || []).forEach(v => add(v, 'transmissions', v));
      (sf.transmissionsSub || []).forEach(v => add(v, 'transmissionsSub', v));
      (sf.drivetrains || []).forEach(v => add(v, 'drivetrains', v));
      (sf.years || []).forEach(v => add(String(v), 'years', v));
      if (sf.budget) add(_budgetPills.find(([k]) => k === sf.budget)?.[1] || sf.budget, 'budget', sf.budget);
      if (sf.certified) add('Certified only', 'certified', '1');
      if (sf.owners === 1) add('1 Owner', 'owners', '1');
      if (sf.terrain) add(sf.terrain === 'mountain' ? 'Mountain / High GC' : 'City Commute', 'terrain', sf.terrain);
      if ((sf.minP > 0 || sf.maxP < sf._maxSlider) && !sf.budget) add(`Rs ${sf.minP}L – ${sf.maxP}L`, 'price', 'range');
      el.innerHTML = tags.map(t => `<button type="button" class="lf-active-tag" data-tag-type="${t.type}" data-tag-val="${t.val}">${t.label}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`).join('');
      el.style.display = tags.length ? 'flex' : 'none';
      el.querySelectorAll('.lf-active-tag').forEach(btn => {
        btn.addEventListener('click', () => onRemove(btn.dataset.tagType, btn.dataset.tagVal));
      });
    }
    function _countActive(sf) {
      let n = (sf.brands?.length || 0) + (sf.fuels?.length || 0) + (sf.bodies?.length || 0) + (sf.transmissions?.length || 0) + (sf.transmissionsSub?.length || 0) + (sf.drivetrains?.length || 0) + (sf.years?.length || 0);
      if (sf.budget) n++;
      if (sf.certified) n++;
      if (sf.owners === 1) n++;
      if (sf.terrain) n++;
      if ((sf.minP > 0 || sf.maxP < (sf._maxSlider || 600)) && !sf.budget) n++;
      return n;
    }
    function _priceFilter(cars, sf) {
      if (sf.budget) {
        const [lo, hi] = _budgetMap[sf.budget] || [0, Infinity];
        return cars.filter(c => {
          const p = sf._priceKey ? c[sf._priceKey] : _carPrice(c);
          return p >= lo && p <= hi;
        });
      }
      const lo = sf.minP * 100000, hi = sf.maxP * 100000;
      const maxHi = (sf._maxSlider || 600) * 100000;
      if (lo > 0 || hi < maxHi) {
        return cars.filter(c => {
          const p = sf._priceKey ? c[sf._priceKey] : _carPrice(c);
          return p >= lo && p <= hi;
        });
      }
      return cars;
    }

    /* ── NEW CARS FILTER ── */
    window._sf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], transmissionsSub: [], drivetrains: [], years: [], minP: 0, maxP: 600, sort: '', budget: '', mileage: [], _maxSlider: 600 };

    function _sfApply() {
      const sf = window._sf;
      let cars = [...CARS_DB];
      if (sf.onlyLatest) {
        cars = cars.filter(c => c.year >= 2024);
      }
      if (sf.q) {
        const ql = sf.q.toLowerCase();
        cars = cars.filter(c => `${c.brand} ${c.model} ${c.type} ${c.body || c.bodyType || ''}`.toLowerCase().includes(ql));
      }
      if (sf.brands.length) cars = cars.filter(c => sf.brands.includes(c.brand));
      if (sf.fuels.length) cars = cars.filter(c => sf.fuels.some(f => c.type?.toLowerCase().includes(f.toLowerCase())));
      if (sf.bodies.length) {
        const norm = s => String(s || '').toLowerCase().replace(/[\s-_]+/g, '');
        cars = cars.filter(c => {
          const cb = norm(c.body || c.bodyType);
          return sf.bodies.some(b => {
            const nb = norm(b);
            if (nb === 'offroad') return cb.includes('offroad') || cb.includes('sav');
            if (nb === 'microcar') return cb.includes('micro');
            if (nb === 'pickup') return cb.includes('pickup');
            if (nb === 'wagon') return cb.includes('wagon');
            if (nb === 'mpv') return cb.includes('mpv') || cb.includes('muv');
            return cb.includes(nb) || nb.includes(cb);
          });
        });
      }
      if (sf.transmissions.length) cars = cars.filter(c => sf.transmissions.includes(_carTransType(c)));
      if (sf.transmissionsSub && sf.transmissionsSub.length) cars = cars.filter(c => _carMatchesTransSub(c, sf.transmissionsSub));
      if (sf.drivetrains && sf.drivetrains.length) cars = cars.filter(c => _carMatchesDrivetrain(c, sf.drivetrains));
      if (sf.years.length) cars = cars.filter(c => sf.years.includes(c.year));
      if (sf.mileage && sf.mileage.length) {
        cars = cars.filter(c => {
          let effStr = '', rangeStr = '';
          if (c.variants && c.variants.length > 0 && c.variants[0].specs) {
            effStr = c.variants[0].specs.efficiency || c.variants[0].specs.Mileage || '';
            rangeStr = c.variants[0].specs.Range || c.variants[0].specs.range || '';
          }
          let eff = parseFloat((effStr.match(/[\\d.]+/) || [])[0]);
          let range = parseFloat((rangeStr.match(/[\\d.]+/) || [])[0]);
          if (!eff && !range) return false;
          return sf.mileage.some(m => {
            if (m === 'Under 15 km/l') return eff > 0 && eff < 15;
            if (m === '15 - 20 km/l') return eff >= 15 && eff <= 20;
            if (m === 'Over 20 km/l') return eff > 20;
            if (m === 'EV Range < 300km') return range > 0 && range < 300;
            if (m === 'EV Range 300-400km') return range >= 300 && range <= 400;
            if (m === 'EV Range > 400km') return range > 400;
            return false;
          });
        });
      }
      if (sf.terrain) {
        if (sf.terrain === 'mountain') {
          // Filter to off-road/high-GC capable bodies
          cars = cars.filter(c => {
            const b = (c.body || c.bodyType || '').toLowerCase();
            return ['suv', 'crossover', 'pickup', 'off-road', 'sav', 'muv'].some(t => b.includes(t));
          });
          // Priority order for hilly/mountain Nepal roads (if no user sort applied)
          if (!sf.sort) {
            const _hillyPriority = [
              'riddara rd6', 'riddara rf20',           // Nepal-specific electric pickups — top hilly choice
              'toyota hilux',                           // Most trusted hilly workhorse
              'toyota land cruiser 70',                 // Legendary off-road
              'toyota land cruiser prado',
              'toyota fortuner',
              'mahindra thar roxx', 'mahindra thar',
              'mahindra scorpio n', 'mahindra scorpio',
              'isuzu d-max',
              'ford next-gen ranger raptor',
              'ford next-gen ranger',
              'ford next-gen everest',
              'maxus t60',
              'foton tunland',
              'foday explorer',
              'jac motors t8',
              'suzuki jimny',
              'maruti suzuki jimny',
              'haval dargo',
              'haval h9',
              'mahindra bolero neo',
              'mitsubishi pajero sport',
              'ssangyong rexton',
              'toyota rush',
              'toyota rav4',
              'isuzu mu-x',
              'subaru forester',
              'subaru outback',
              'hyundai tucson',
              'jeep compass',
              'mazda cx-5',
            ];
            cars.sort((a, b) => {
              const aKey = `${a.brand} ${a.model}`.toLowerCase();
              const bKey = `${b.brand} ${b.model}`.toLowerCase();
              const ai = _hillyPriority.findIndex(p => aKey.includes(p));
              const bi = _hillyPriority.findIndex(p => bKey.includes(p));
              const aRank = ai === -1 ? 999 : ai;
              const bRank = bi === -1 ? 999 : bi;
              if (aRank !== bRank) return aRank - bRank;
              return (b.rating || 0) - (a.rating || 0); // fallback by rating
            });
          }
        } else if (sf.terrain === 'city') {
          // Filter to city-friendly body types
          cars = cars.filter(c => {
            const b = (c.body || c.bodyType || '').toLowerCase();
            return ['hatchback', 'sedan', 'crossover', 'compact', 'micro', 'urban'].some(t => b.includes(t));
          });
          // Priority order for popular city cars in Nepal (if no user sort applied)
          if (!sf.sort) {
            const _cityPriority = [
              // ── Tier 1: Most popular modern city cars in Nepal (BYD / Deepal / MG) ──
              'byd dolphin',            // Top-selling EV city hatchback in Nepal
              'byd atto 1',             // Compact EV — very popular city choice
              'byd seal',               // Premium EV sedan — city favourite
              'byd atto 2',             // Urban compact SUV crossover
              'deepal l07',             // Deepal hybrid sedan — growing city market
              'deepal s05',             // Compact electric SUV — city commuter
              'mg zs ev',               // Popular MG electric city SUV
              'mg comet',               // Smallest MG EV for city
              'mg astor',               // MG petrol compact — city popular
              'mg hector',              // MG SUV city favourite
              'mg gloster',
              // ── Tier 2: Suzuki — Nepal's most popular city hatchback brand ──
              'suzuki swift',
              'suzuki alto k10',
              'suzuki celerio',
              'suzuki wagon r',
              'suzuki fronx',
              'maruti suzuki swift',
              'maruti suzuki alto',
              'maruti suzuki celerio',
              'maruti suzuki wagonr',
              'maruti suzuki baleno',
              'maruti suzuki dzire',
              'maruti suzuki ignis',
              'maruti suzuki fronx',
              // ── Tier 3: Hyundai city classics ──
              'hyundai grand i10',
              'hyundai i20',
              'hyundai exter',
              'hyundai venue',
              'hyundai creta',
              // ── Tier 4: Kia, Honda, Toyota city options ──
              'kia sonet',
              'kia seltos',
              'honda amaze',
              'honda city',
              'toyota corolla cross',
              'toyota raize',
              'toyota camry',
              // ── Tier 5: Budget city commuters ──
              'renault kwid',
              'tata tiago',
              'tata altroz',
              'tata punch',
              'volkswagen polo',
              'volkswagen virtus',
              'proton saga',
              'geely emgrand',
              'geely preface',
              // ── Tier 6: Affordable EVs for city ──
              'kaiyi e-qute',
              'wuling hongguang',
              'dongfeng nammi',
              'henrey volts',
              'aion ut',
              'chery qq3',
            ];
            cars.sort((a, b) => {
              const aKey = `${a.brand} ${a.model}`.toLowerCase();
              const bKey = `${b.brand} ${b.model}`.toLowerCase();
              const ai = _cityPriority.findIndex(p => aKey.includes(p));
              const bi = _cityPriority.findIndex(p => bKey.includes(p));
              const aRank = ai === -1 ? 999 : ai;
              const bRank = bi === -1 ? 999 : bi;
              if (aRank !== bRank) return aRank - bRank;
              return (b.rating || 0) - (a.rating || 0); // fallback by rating
            });
          }
        }
      }
      if (sf.bodies.length && sf.bodies.includes('SUV') && sf.bodies.includes('MPV') && sf.bodies.includes('Crossover') && !sf.sort) {
        const bodyPriority = (bodyStr) => {
          const b = String(bodyStr || '').toLowerCase();
          if (b.includes('suv')) return 1;
          if (b.includes('mpv') || b.includes('muv')) return 2;
          if (b.includes('crossover')) return 3;
          return 4;
        };
        cars.sort((a, b) => bodyPriority(a.body || a.bodyType) - bodyPriority(b.body || b.bodyType));
      }
      cars = _priceFilter(cars, sf);
      if (sf.sort === 'price-asc') cars.sort((a, b) => _carPrice(a) - _carPrice(b));
      else if (sf.sort === 'price-desc') cars.sort((a, b) => _carPrice(b) - _carPrice(a));
      else if (sf.sort === 'rating') cars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sf.sort === 'year-desc') cars.sort((a, b) => (b.year || 0) - (a.year || 0));
      const g = document.getElementById('lf-grid'), cnt = document.getElementById('lf-count'), empty = document.getElementById('lf-empty'), explore = document.getElementById('lf-explore');
      if (!g) return;

      const activeCount = _countActive(sf);
      const isExplore = (activeCount === 0 && !sf.q && !sf.onlyLatest);

      const PAGE_SIZE = 12;

      if (isExplore) {
        g.style.display = 'none';
        if (empty) empty.style.display = 'none';
        if (explore) explore.style.display = 'block';
        if (cnt) cnt.textContent = CARS_DB.length;
        window._sfAllCars = [];
        window._sfPage = 0;
      } else {
        if (explore) explore.style.display = 'none';
        g.style.display = 'grid';
        window._sfAllCars = cars;
        window._sfPage = 1;
        if (cars.length) {
          const initialCars = cars.slice(0, PAGE_SIZE);
          g.innerHTML = initialCars.map(c => carCard(c)).join('');
          if (empty) empty.style.display = 'none';
        } else {
          g.innerHTML = '';
          if (empty) empty.style.display = 'block';
        }
        if (cnt) cnt.textContent = cars.length;
      }

      // Load More button
      let lmWrap = document.getElementById('sf-load-more-wrap');
      if (!lmWrap) {
        lmWrap = document.createElement('div');
        lmWrap.id = 'sf-load-more-wrap';
        lmWrap.style.cssText = 'text-align:center; margin:32px 0 0;';
        g.parentNode.insertBefore(lmWrap, g.nextSibling);
      }
      if (!isExplore && cars.length > PAGE_SIZE) {
        lmWrap.innerHTML = `<button class="btn btn-outline" id="sf-load-more-btn" style="padding:14px 40px;font-weight:700;font-size:14px;border-radius:99px;border:2px solid var(--green);color:var(--green);background:transparent;cursor:pointer;transition:all .2s" onmouseover="this.style.background='var(--green)';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='var(--green)'" onclick="AV.sfLoadMore()">Load More Vehicles &nbsp;↓</button>`;
        lmWrap.style.display = 'block';
      } else {
        lmWrap.innerHTML = '';
        lmWrap.style.display = 'none';
      }

      // Discovery Sections (inject once, then keep)
      let discWrap = document.getElementById('sf-discovery-sections');
      if (!discWrap) {
        discWrap = document.createElement('div');
        discWrap.id = 'sf-discovery-sections';

        const trendingCars = CARS_DB.filter(c => c.badge === 'Trending' || c.badge === 'popular' || c.badge === 'best seller').slice(0, 8);
        const fallbackTrending = trendingCars.length < 5 ? CARS_DB.slice(0, 8) : trendingCars;
        const upcomingCars = CARS_DB.filter(c => c.isUpcoming).slice(0, 8);
        const fallbackUpcoming = upcomingCars.length < 4 ? CARS_DB.filter(c => c.type === 'Electric').slice(0, 8) : upcomingCars;

        const arrowL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>';
        const arrowR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>';

        const makeSection = (title, carsArr, scrollId) =>
          `<div class="home-section" style="margin-top:56px;">
            <div class="hs-head" style="margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;">
              <h2 class="hs-title" style="font-size:22px;font-weight:800;">${title}</h2>
              <div class="carousel-nav-arrows" style="display:flex;align-items:center;gap:8px">
                <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('${scrollId}', -1)" aria-label="Scroll left">${arrowL}</button>
                <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('${scrollId}', 1)" aria-label="Scroll right">${arrowR}</button>
              </div>
            </div>
            <div class="home-carousel car-carousel" id="${scrollId}">${carsArr.map(c => carCard(c)).join('')}</div>
          </div>`;

        const newsHTML = `<div class="home-section" style="margin-top:56px;">
          <h2 class="hs-title" style="font-size:22px;font-weight:800;margin-bottom:18px;">Latest News & Reviews</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
            <div style="background:#fff;border-radius:14px;overflow:hidden;border:1px solid var(--border);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.04);transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,.08)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,0,0,.04)'">
              <div style="height:180px;background:linear-gradient(135deg,#e8f5e9,#c8e6c9);display:flex;align-items:center;justify-content:center;font-size:48px"><i data-lucide="newspaper"></i></div>
              <div style="padding:20px">
                <div style="font-size:11px;color:var(--green);font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Review</div>
                <h3 style="font-size:16px;font-weight:800;color:var(--ink);line-height:1.4;margin:0 0 8px">Top 10 Electric Cars in Nepal 2024</h3>
                <p style="font-size:13px;color:var(--ink-3);line-height:1.5;margin:0">Our comprehensive guide to the best electric vehicles available in the Nepalese market right now.</p>
              </div>
            </div>
            <div style="background:#fff;border-radius:14px;overflow:hidden;border:1px solid var(--border);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.04);transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,.08)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,0,0,.04)'">
              <div style="height:180px;background:linear-gradient(135deg,#e3f2fd,#bbdefb);display:flex;align-items:center;justify-content:center;font-size:48px"><i data-lucide="trophy"></i></div>
              <div style="padding:20px">
                <div style="font-size:11px;color:#007bff;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Comparison</div>
                <h3 style="font-size:16px;font-weight:800;color:var(--ink);line-height:1.4;margin:0 0 8px">SUV vs Crossover: Which is Right for You?</h3>
                <p style="font-size:13px;color:var(--ink-3);line-height:1.5;margin:0">Breaking down the key differences to help you pick the perfect body type for Nepal's roads.</p>
              </div>
            </div>
            <div style="background:#fff;border-radius:14px;overflow:hidden;border:1px solid var(--border);cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.04);transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,.08)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,0,0,.04)'">
              <div style="height:180px;background:linear-gradient(135deg,#fff3e0,#ffe0b2);display:flex;align-items:center;justify-content:center;font-size:48px"><i data-lucide="banknote"></i></div>
              <div style="padding:20px">
                <div style="font-size:11px;color:#e65100;font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Guide</div>
                <h3 style="font-size:16px;font-weight:800;color:var(--ink);line-height:1.4;margin:0 0 8px">Car Loan & EMI Guide for Nepal 2024</h3>
                <p style="font-size:13px;color:var(--ink-3);line-height:1.5;margin:0">Everything you need to know about car financing, interest rates, and EMI calculations in Nepal.</p>
              </div>
            </div>
          </div>
        </div>`;

        const ctaHTML = `<div style="margin-top:56px;padding:32px;background:linear-gradient(135deg,var(--green-ll),#e8f5e9);border:1.5px solid rgba(26,107,42,.14);border-radius:16px;text-align:center">
          <div style="font-family:var(--font-d);font-size:22px;font-weight:800;color:var(--ink);margin-bottom:8px">Can't find the right car?</div>
          <p style="font-size:14px;color:var(--ink-3);margin-bottom:18px;max-width:420px;margin-left:auto;margin-right:auto">Our experts help you choose the best car for Nepal's roads and your budget.</p>
          <a href="tel:+9779828364940" class="btn btn-primary" style="padding:12px 28px;border-radius:99px"><i data-lucide="phone"></i> Call +977-9828364940</a>
        </div>`;

        discWrap.innerHTML = ctaHTML;

        // Insert after the empty-state div (last child of the main content area)
        const mainContent = g.closest('.lf-main') || g.parentNode;
        mainContent.appendChild(discWrap);
      }

      updateCmpBtns();
      _syncCbUI('sf', sf);
      _renderActiveTags(sf, 'lf-active-tags', 'sf', (type, val) => {
        if (type === 'budget') { sf.budget = ''; document.querySelectorAll('.sf-budget-btn').forEach(b => b.classList.remove('active')); }
        else if (type === 'price') { sf.minP = 0; sf.maxP = sf._maxSlider; const lo = document.getElementById('lf-price-lo'), hi = document.getElementById('lf-price-hi'); if (lo) lo.value = 0; if (hi) hi.value = sf._maxSlider; const loV = document.getElementById('lf-lo-val'), hiV = document.getElementById('lf-hi-val'); if (loV) loV.textContent = 'Rs. 0L'; if (hiV) hiV.textContent = 'Rs. ' + sf._maxSlider + 'L'; }
        else if (type === 'years') { const i = sf.years.indexOf(+val); if (i > -1) sf.years.splice(i, 1); }
        else if (type === 'terrain') { sf.terrain = ''; }
        else if (Array.isArray(sf[type])) { const i = sf[type].indexOf(val); if (i > -1) sf[type].splice(i, 1); }
        _sfApply();
      });
      const badge = document.getElementById('lf-badge');
      const active = _countActive(sf);
      if (badge) { badge.textContent = active || ''; badge.style.display = active ? 'inline-flex' : 'none'; }
      _filterPulse('lf-grid');
    }

    function sfLoadMore() {
      const PAGE_SIZE = 12;
      const g = document.getElementById('lf-grid');
      if (!g || !window._sfAllCars) return;
      const page = window._sfPage || 1;
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const nextCars = window._sfAllCars.slice(start, end);
      if (!nextCars.length) return;
      const temp = document.createElement('div');
      temp.innerHTML = nextCars.map(c => carCard(c)).join('');
      while (temp.firstChild) g.appendChild(temp.firstChild);
      window._sfPage = page + 1;
      if ((page + 1) * PAGE_SIZE >= window._sfAllCars.length) {
        const lm = document.getElementById('sf-load-more-wrap');
        if (lm) lm.style.display = 'none';
      }
      updateCmpBtns();
    }

    function ufLoadMore() {
      const PAGE_SIZE = 12;
      const g = document.getElementById('used-grid');
      if (!g || !window._ufAllCars) return;
      const page = window._ufPage || 1;
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const nextCars = window._ufAllCars.slice(start, end);
      if (!nextCars.length) return;
      const temp = document.createElement('div');
      temp.innerHTML = nextCars.map(c => usedCard(c)).join('');
      while (temp.firstChild) g.appendChild(temp.firstChild);
      window._ufPage = page + 1;
      if ((page + 1) * PAGE_SIZE >= window._ufAllCars.length) {
        const lm = document.getElementById('uf-load-more-wrap');
        if (lm) lm.style.display = 'none';
      }
      if (typeof updateCmpBtns === 'function') updateCmpBtns();
    }

    /* ── USED CARS FILTER ── */
    const _usedMaxPrice = Math.max(100, Math.ceil(Math.max(...USED.map(c => c.priceNum || 0), 1000000) / 100000));
    window._uf = { q: '', brands: [], models: [], fuels: [], bodies: [], transmissions: [], transmissionsSub: [], drivetrains: [], years: [], minP: 0, maxP: _usedMaxPrice, sort: '', budget: '', owners: [], mileage: [], _maxSlider: _usedMaxPrice, _priceKey: 'priceNum' };

    function _ufApply() {
      /* Always use the freshest used cars data */
      if (window.USED_CARS_DB && window.USED_CARS_DB.length > 0) {
        USED = window.USED_CARS_DB;
      }
      const uf = window._uf;
      let cars = [...USED];
      if (uf.q) {
        const ql = uf.q.toLowerCase();
        cars = cars.filter(c => `${c.brand} ${c.model} ${c.type} ${c.variant}`.toLowerCase().includes(ql));
      }
      if (uf.brands.length) cars = cars.filter(c => uf.brands.includes(c.brand));
      if (uf.models && uf.models.length) cars = cars.filter(c => uf.models.includes(c.model));
      if (uf.fuels.length) cars = cars.filter(c => uf.fuels.some(f => c.type?.toLowerCase() === f.toLowerCase()));
      if (uf.bodies.length) cars = cars.filter(c => uf.bodies.some(b => c.body?.toLowerCase().includes(b.toLowerCase())));
      if (uf.transmissions.length) cars = cars.filter(c => uf.transmissions.includes(_usedTransType(c)));
      if (uf.transmissionsSub && uf.transmissionsSub.length) cars = cars.filter(c => _carMatchesTransSub(c, uf.transmissionsSub));
      if (uf.drivetrains && uf.drivetrains.length) cars = cars.filter(c => _carMatchesDrivetrain(c, uf.drivetrains));
      if (uf.years.length) cars = cars.filter(c => uf.years.includes(c.year));
      if (uf.owners && uf.owners.length) cars = cars.filter(c => uf.owners.includes(String(c.owners)));
      if (uf.mileage && uf.mileage.length) {
        cars = cars.filter(c => {
          let effStr = c.efficiency || c.mileage || '';
          let rangeStr = c.range || '';
          let eff = parseFloat((String(effStr).match(/[\\d.]+/) || [])[0]);
          let range = parseFloat((String(rangeStr).match(/[\\d.]+/) || [])[0]);
          if (!eff && !range) return false;
          return uf.mileage.some(m => {
            if (m === 'Under 15 km/l') return eff > 0 && eff < 15;
            if (m === '15 - 20 km/l') return eff >= 15 && eff <= 20;
            if (m === 'Over 20 km/l') return eff > 20;
            if (m === 'EV Range < 300km') return range > 0 && range < 300;
            if (m === 'EV Range 300-400km') return range >= 300 && range <= 400;
            if (m === 'EV Range > 400km') return range > 400;
            return false;
          });
        });
      }
      cars = _priceFilter(cars, uf);
      if (uf.sort === 'price-asc') cars.sort((a, b) => {
        const ap = a.priceNum ?? Infinity, bp = b.priceNum ?? Infinity;
        return ap - bp;
      });
      else if (uf.sort === 'price-desc') cars.sort((a, b) => {
        const ap = a.priceNum ?? -Infinity, bp = b.priceNum ?? -Infinity;
        return bp - ap;
      });
      else if (uf.sort === 'km-asc') cars.sort((a, b) => {
        const ak = parseInt(String(a.km || '0').replace(/,/g, ''), 10);
        const bk = parseInt(String(b.km || '0').replace(/,/g, ''), 10);
        return ak - bk;
      });
      else if (uf.sort === 'year-desc') cars.sort((a, b) => (b.year || 0) - (a.year || 0));
      const g = document.getElementById('used-grid'), cnt = document.getElementById('used-count'), empty = document.getElementById('uf-empty'), explore = document.getElementById('uf-explore');
      if (!g) return;

      const activeCount = _countActive(uf);
      const isExplore = (activeCount === 0 && !uf.q && uf.explore !== false);

      const PAGE_SIZE = 12;

      if (isExplore) {
        g.style.display = 'none';
        if (empty) empty.style.display = 'none';
        if (explore) {
          /* Regenerate sections each time so fresh API data is used */
          explore.innerHTML = getUsedCarsExploreHTML();
          explore.style.display = 'block';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        if (cnt) cnt.textContent = USED.length;
        window._ufAllCars = [];
        window._ufPage = 0;
        const lmWrap = document.getElementById('uf-load-more-wrap');
        if (lmWrap) lmWrap.style.display = 'none';
      } else {
        if (explore) explore.style.display = 'none';
        g.style.display = 'grid';
        window._ufAllCars = cars;
        window._ufPage = 1;

        if (cars.length) {
          const initialCars = cars.slice(0, PAGE_SIZE);
          g.innerHTML = initialCars.map(c => usedCard(c)).join('');
          if (empty) empty.style.display = 'none';

          let lmWrap = document.getElementById('uf-load-more-wrap');
          if (!lmWrap) {
            lmWrap = document.createElement('div');
            lmWrap.id = 'uf-load-more-wrap';
            lmWrap.style.textAlign = 'center';
            lmWrap.style.marginTop = '40px';
            lmWrap.style.gridColumn = '1 / -1';
            g.parentNode.appendChild(lmWrap);
          }
          if (cars.length > PAGE_SIZE) {
            lmWrap.innerHTML = `<button class="btn btn-outline" onclick="AV.ufLoadMore()" style="padding:14px 40px;font-weight:700;font-size:14px;border-radius:99px;border:2px solid var(--green);color:var(--green);background:transparent;cursor:pointer;">Load More Vehicles &nbsp;↓</button>`;
            lmWrap.style.display = 'block';
          } else {
            lmWrap.style.display = 'none';
          }
        } else {
          g.innerHTML = '';
          if (empty) empty.style.display = 'block';
          const lmWrap = document.getElementById('uf-load-more-wrap');
          if (lmWrap) lmWrap.style.display = 'none';
        }
      }
      if (cnt && !isExplore) cnt.textContent = cars.length;
      _syncCbUI('uf', uf);
      _renderActiveTags(uf, 'uf-active-tags', 'uf', (type, val) => {
        if (type === 'budget') { uf.budget = ''; document.querySelectorAll('.uf-budget-btn').forEach(b => b.classList.remove('active')); }
        else if (type === 'price') { uf.minP = 0; uf.maxP = uf._maxSlider; const lo = document.getElementById('uf-price-lo'), hi = document.getElementById('uf-price-hi'); if (lo) lo.value = 0; if (hi) hi.value = uf._maxSlider; const loV = document.getElementById('uf-lo-val'), hiV = document.getElementById('uf-hi-val'); if (loV) loV.textContent = 'Rs. 0L'; if (hiV) hiV.textContent = 'Rs. ' + uf._maxSlider + 'L'; }
        else if (type === 'owners') uf.owners = [];
        else if (type === 'mileage') uf.mileage = [];
        else if (type === 'years') { const i = uf.years.indexOf(+val); if (i > -1) uf.years.splice(i, 1); }
        else if (Array.isArray(uf[type])) { const i = uf[type].indexOf(val); if (i > -1) uf[type].splice(i, 1); }
        _ufApply();
      });
      const badge = document.getElementById('uf-badge');
      const active = _countActive(uf);
      if (badge) { badge.textContent = active || ''; badge.style.display = active ? 'inline-flex' : 'none'; }
      _filterPulse('used-grid');
    }

    function _bindFilterSidebar(ns, applyFn) {
      const sf = ns === 'sf' ? window._sf : window._uf;
      document.querySelectorAll(`[data-${ns}-type]`).forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          const type = el.dataset[`${ns}Type`];
          let val = el.dataset[`${ns}Val`];
          if (type === 'years') val = +val;
          if (type === 'certified') { sf.certified = !sf.certified; applyFn(); return; }
          const arr = sf[type];
          if (!Array.isArray(arr)) return;
          const idx = arr.indexOf(val);
          if (type === 'transmissions') {
            sf[type] = idx === -1 ? [val] : [];
            // Optional: clear transmissionsSub if they switch transmission type
            if (idx === -1) sf.transmissionsSub = [];
          } else {
            if (idx === -1) arr.push(val); else arr.splice(idx, 1);
          }
          applyFn();
        });
      });
    }

    function getCarsExploreHTML() {
      const seenSlugs = new Set();
      function dedupe(arr) {
        return arr.filter(c => {
          if (seenSlugs.has(c.slug)) return false;
          seenSlugs.add(c.slug);
          return true;
        });
      }

      const rawSections = [
        {
          eyebrow: 'Hot right now', title: 'Trending Cars', sub: 'The most viewed and researched cars this week.',
          filterOpts: { sort: 'rating', explore: false },
          navTarget: 'cars',
          cars: [...CARS_DB].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 12)
        },
        {
          eyebrow: 'Value for money', title: 'Budget Friendly', sub: 'Great cars under Rs. 40 Lakhs.',
          filterOpts: { budget: '40', explore: false },
          navTarget: 'cars',
          cars: CARS_DB.filter(c => c.variants && c.variants[0] && c.variants[0].price <= 4000000).slice(0, 12)
        },
        {
          eyebrow: 'City smart', title: 'Popular Hatchbacks', sub: 'Compact, efficient, and easy to park.',
          filterOpts: { filter: 'hatchback', explore: false },
          navTarget: 'cars',
          cars: CARS_DB.filter(c => c.body === 'Hatchback' || c.bodyType === 'hatchback').slice(0, 12)
        },
        {
          eyebrow: 'Family adventures', title: 'Top SUVs', sub: 'Spacious, high ground clearance SUVs.',
          filterOpts: { filter: 'suv', explore: false },
          navTarget: 'cars',
          cars: CARS_DB.filter(c => c.body === 'SUV' || c.bodyType === 'suv').slice(0, 12)
        },
        {
          eyebrow: 'Premium segment', title: 'Luxury & Premium', sub: 'The finest vehicles available above Rs. 80 Lakhs.',
          filterOpts: { budget: '80+', explore: false },
          navTarget: 'cars',
          cars: CARS_DB.filter(c => c.variants && c.variants[0] && c.variants[0].price >= 8000000).slice(0, 12)
        },
        {
          eyebrow: 'Zero emissions', title: 'Electric Vehicles', sub: 'Future-ready EVs with great range for Nepal.',
          filterOpts: { filter: 'electric', explore: false },
          navTarget: 'cars',
          cars: CARS_DB.filter(c => c.type === 'Electric').slice(0, 12)
        },
        {
          eyebrow: 'Best of both', title: 'Hybrid Cars', sub: 'Excellent mileage without range anxiety.',
          filterOpts: { filter: 'hybrid', explore: false },
          navTarget: 'cars',
          cars: CARS_DB.filter(c => c.type === 'Hybrid').slice(0, 12)
        },
        {
          eyebrow: 'Coming soon', title: 'Upcoming Cars', sub: 'Expected launches, NAIMA debuts & pre-launch pricing.',
          filterOpts: null,
          navTarget: 'upcoming',
          cars: null,
          upcoming: UPCOMING_DATA.slice(0, 12)
        }
      ];

      // Apply deduplication only to CARS_DB sections (not upcoming)
      const sections = rawSections.map(s => {
        if (s.cars !== null) {
          return { ...s, cars: dedupe(s.cars) };
        }
        return s;
      }).filter(s => s.cars === null ? (s.upcoming && s.upcoming.length > 0) : s.cars.length > 0);

      let html = `<div style="display:flex; flex-direction:column; gap:32px; margin-top:20px;">`;

      sections.forEach((sec, idx) => {
        const secId = `explore-carousel-${idx}`;
        const isUpcoming = sec.cars === null;
        const carItems = isUpcoming
          ? sec.upcoming.map(u => `<div class="carousel-card-item">${upcomingCard(u)}</div>`).join('')
          : sec.cars.map(c => `<div class="carousel-card-item">${carCard(c)}</div>`).join('');

        const showAllBtn = isUpcoming
          ? `<button type="button" class="btn btn-outline" style="font-size:13px; padding:8px 16px; border-radius:99px;" onclick="AV.goTo('upcoming')">Show all</button>`
          : `<button type="button" class="btn btn-outline" style="font-size:13px; padding:8px 16px; border-radius:99px;" onclick="AV.goTo('cars', ${JSON.stringify(sec.filterOpts).replace(/"/g, '&quot;')})">Show all</button>`;

        html += `
      <div style="background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 10px rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.05);">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="font-size:22px; font-weight:700; margin:0 0 4px 0; color:var(--ink1);">${sec.title}</h3>
            <p style="font-size:14px; color:var(--ink3); margin:0;">${sec.sub}</p>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            ${showAllBtn}
            <button type="button" aria-label="Scroll left" onclick="(function(){var el=document.getElementById('${secId}');el.scrollBy({left:-el.offsetWidth,behavior:'smooth'});})()" style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;transition:all .18s;flex-shrink:0;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button type="button" aria-label="Scroll right" onclick="(function(){var el=document.getElementById('${secId}');el.scrollBy({left:el.offsetWidth,behavior:'smooth'});})()" style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;transition:all .18s;flex-shrink:0;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
        <div id="${secId}" class="car-carousel" style="display:flex; gap:16px; overflow-x:auto; padding-bottom:12px; scroll-snap-type:x mandatory; scrollbar-width:none; -ms-overflow-style:none; margin-right:-24px; padding-right:24px;">
          ${carItems}
        </div>
      </div>`;
      });

      html += `</div>`;
      return html;
    }

    function getUsedCarsExploreHTML() {
      const usedData = window.USED_CARS_DB || [];

      /* ── 3 sections, no dedup across them ── */
      const secs = [
        {
          id: 'uc-sec-recommended',
          title: 'Recommended Cars',
          filterOpts: { certified: true, explore: false },
          cars: usedData.length
            ? [...usedData].filter(c => c.certified || c.rating >= 4.0).slice(0, 12)
            : usedData.slice(0, 12)
        },
        {
          id: 'uc-sec-deals',
          title: 'Great Deals',
          filterOpts: { sort: 'price-asc', explore: false },
          cars: [...usedData].sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0)).slice(0, 12)
        },
        {
          id: 'uc-sec-recent',
          title: 'Recently Listed',
          filterOpts: { sort: 'year-desc', explore: false },
          cars: [...usedData].reverse().slice(0, 12)
        }
      ].filter(s => s.cars.length > 0);

      if (secs.length === 0) {
        return `<div style="text-align:center;padding:60px 20px;color:var(--ink4);font-size:15px">
          <div style="font-size:40px;margin-bottom:12px">🚗</div>
          <div style="font-weight:600;margin-bottom:6px">No used cars listed yet</div>
          <div>Check back soon — we're adding fresh listings daily.</div>
        </div>`;
      }

      let html = `<div style="display:flex;flex-direction:column;gap:36px;margin-top:8px;">`;

      secs.forEach(sec => {
        const items = sec.cars.map(c => `<div class="carousel-card-item" style="scroll-snap-align:start;flex-shrink:0;width:280px">${usedCard(c)}</div>`).join('');
        const filterJson = JSON.stringify(sec.filterOpts).replace(/"/g, '&quot;');

        html += `
        <div style="background:#fff;border-radius:16px;padding:28px 28px 20px;box-shadow:0 2px 16px rgba(0,0,0,0.05);border:1px solid rgba(0,0,0,0.06);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;flex-wrap:wrap;gap:12px;">
            <div>
              ${sec.eyebrow ? `<span style="color:var(--green,#1a6b2a);font-weight:700;letter-spacing:.8px;text-transform:uppercase;font-size:10.5px;display:block;margin-bottom:6px;">${sec.eyebrow}</span>` : ''}
              <h3 style="font-size:clamp(18px,2.5vw,22px);font-weight:800;margin:0 0 5px;color:#111;line-height:1.2;">${sec.title}</h3>
              ${sec.sub ? `<p style="font-size:13.5px;color:#64748b;margin:0;line-height:1.5;">${sec.sub}</p>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
              <button type="button"
                onclick="AV.goTo('used',${filterJson})"
                style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:9px 18px;border-radius:99px;border:1.5px solid var(--green,#1a6b2a);background:transparent;color:var(--green,#1a6b2a);cursor:pointer;transition:all .18s;"
                onmouseover="this.style.background='var(--green,#1a6b2a)';this.style.color='#fff'"
                onmouseout="this.style.background='transparent';this.style.color='var(--green,#1a6b2a)'">
                Show all
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button type="button" aria-label="Scroll left"
                onclick="(function(){var el=document.getElementById('${sec.id}');el.scrollBy({left:-300,behavior:'smooth'});})()"
                style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;transition:all .18s;"
                onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button type="button" aria-label="Scroll right"
                onclick="(function(){var el=document.getElementById('${sec.id}');el.scrollBy({left:300,behavior:'smooth'});})()"
                style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;transition:all .18s;"
                onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#fff'">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
          <div id="${sec.id}" style="display:flex;gap:16px;overflow-x:auto;padding-bottom:12px;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;margin:0 -4px;padding-left:4px;">
            ${items}
          </div>
        </div>`;
      });

      html += `</div>`;
      return html;
    }

    function renderCars(filter, opts = {}) {
      clearInterval(heroTimer);
      document.title = 'New Cars Nepal — AutoViindu';
      const maxSlider = 600;
      const fuelSeed = { electric: 'Electric', hybrid: 'Hybrid', petrol: 'Petrol', diesel: 'Diesel' };
      const bodySeed = {
        suv: 'SUV',
        crossover: 'Crossover',
        sedan: 'Sedan',
        hatchback: 'Hatchback',
        coupe: 'Coupe',
        mpv: 'MPV',
        offroad: 'Off-road',
        'off-road': 'Off-road',
        pickup: 'Pickup',
        microcar: 'Microcar',
        micro: 'Microcar',
        wagon: 'Wagon',
        van: 'Van'
      };

      const initFuels = opts.fuel ? [opts.fuel] : (filter && fuelSeed[filter] ? [fuelSeed[filter]] : []);
      let initBodies;
      if (filter === 'suv-mpv-crossover') {
        initBodies = ['SUV', 'MPV', 'Crossover'];
      } else {
        initBodies = opts.body ? [bodySeed[opts.body.toLowerCase()] || opts.body] : (filter && bodySeed[filter] ? [bodySeed[filter]] : []);
      }
      const initMinP = opts.minPrice ? Math.max(0, Math.round(opts.minPrice / 100000)) : 0;
      const initMaxP = opts.maxPrice ? Math.min(maxSlider, Math.round(opts.maxPrice / 100000)) : maxSlider;

      window._sf = { q: opts.q || '', brands: opts.brand ? [opts.brand] : [], fuels: initFuels, bodies: initBodies, transmissions: [], transmissionsSub: [], drivetrains: [], years: [], minP: initMinP, maxP: initMaxP, sort: opts.sort || '', budget: opts.budget || '', terrain: opts.terrain || '', mileage: [], _maxSlider: maxSlider, explore: opts.explore };

      const fl = {
        'suv-mpv-crossover': 'SUV / MPV / Crossover',
        electric: 'Electric Cars',
        hybrid: 'Hybrid Cars',
        petrol: 'Petrol Cars',
        diesel: 'Diesel Cars',
        suv: 'SUVs',
        crossover: 'Crossovers',
        sedan: 'Sedans',
        hatchback: 'Hatchbacks',
        coupe: 'Coupes',
        mpv: 'MPVs',
        offroad: 'Off-road Vehicles',
        'off-road': 'Off-road Vehicles',
        pickup: 'Pickup Trucks',
        microcar: 'Microcars',
        micro: 'Microcars',
        wagon: 'Wagons',
        van: 'Vans & Microvans'
      };
      const title = filter ? (fl[filter] || filter) : 'New Cars in Nepal';
      setNav(filter === 'electric' ? 'electric' : 'cars');

      const sf = window._sf;
      const allBrands = [...new Set(CARS_DB.map(c => c.brand))].sort();
      const allYears = [...new Set(CARS_DB.map(c => c.year))].sort((a, b) => b - a);

      const acc = (title, content, open = false) => `
        <div class="av-acc ${open ? 'open' : ''}">
          <button class="av-acc-head" type="button" onclick="AV.filterAccord(this)">
            <span>${title}</span>
            <svg class="av-acc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="av-acc-body"><div class="av-acc-body-inner">${content}</div></div>
        </div>`;

      document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.7)">${title}</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(22px,4vw,32px);color:var(--ink);font-weight:700;margin-bottom:4px">${title}</h1>
     
    </div>
  </div>
  <div class="lf-page-wrap wrap">
    <div class="lf-overlay" id="lf-overlay" onclick="AV.sfMobileToggle()"></div>
    <aside class="lf-sidebar" id="lf-sidebar">
      <div class="lf-sidebar-inner">
        <div class="lf-sf-hd">
          <span>Filters</span>
          <button class="lf-clear-btn" type="button" onclick="AV.sfClear()">Clear all</button>
        </div>
        ${acc('Price Range', `
          <div class="lf-price-vals"><span id="lf-lo-val">Rs. ${initMinP}L</span><span id="lf-hi-val">Rs. ${initMaxP}L</span></div>
          <div class="lf-price-track">
            <input type="range" id="lf-price-lo" class="lf-range" min="0" max="${maxSlider}" step="5" value="${initMinP}" oninput="AV.sfPrice()">
            <input type="range" id="lf-price-hi" class="lf-range" min="0" max="${maxSlider}" step="5" value="${initMaxP}" oninput="AV.sfPrice()">
          </div>
          <div class="lf-budget-pills">${_budgetPills.map(([v, l]) => `<button type="button" class="sf-budget-btn" onclick="AV.sfBudget('${v}',this)">${l}</button>`).join('')}</div>
        `)}
        ${acc('Brand', `
          <div style="margin-bottom:10px;"><input type="text" placeholder="Search brand (e.g. Suzuki)" oninput="AV.filterBrand(this.value, 'sf')" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px;outline:none;" /></div>
          <div class="lf-cb-list lf-cb-scroll sf-brand-list">${allBrands.map(b => _cbRow(sf, 'brands', b, b, 'sf')).join('')}</div>
        `)}
        ${acc('Body Type', `
          <div class="lf-cb-list lf-cb-scroll">${['SUV', 'Crossover', 'Sedan', 'Hatchback', 'Coupe', 'MPV', 'Off-road', 'Pickup', 'Microcar', 'Wagon', 'Van'].map(b => _cbRow(sf, 'bodies', b, b, 'sf')).join('')}</div>
        `)}
        ${acc('Fuel Type', `
          <div class="lf-cb-list">${['Electric', 'Hybrid', 'Petrol', 'Diesel'].map(f => _cbRow(sf, 'fuels', f, f, 'sf')).join('')}</div>
        `)}
        ${acc('Transmission', `
          <div class="lf-pill-grid" style="margin-bottom:12px">${['Manual', 'Automatic'].map(t => _pillRow(sf, 'transmissions', t, t, 'sf')).join('')}</div>
          <div style="font-size:12px; font-weight:700; color:var(--ink-4); margin-bottom:8px;"></div>
          <div class="lf-cb-list lf-cb-scroll">
            ${[
              ['AMT', 'AMT (Automated Manual)'], ['iMT', 'iMT (Intelligent Manual)'], ['CVT', 'CVT (Continuously Variable)'],
              ['Regular (manual)', 'Regular (manual)'], ['TC', 'TC (Torque Converter)'], ['DCT', 'DCT (Dual-Clutch)'],
              ['eCVT / DHT', 'eCVT / DHT (Hybrid)'], ['MCT', 'MCT (Multi-Clutch)'], ['Semi-Automatic / Sequential Manual', 'Semi-Automatic'],
              ['Single-Speed Direct Drive', 'Single-Speed (EV)']
            ].map(([val, label]) => _cbRow(sf, 'transmissionsSub', val, label, 'sf')).join('')}
          </div>
        `, false)}
        ${acc('Drivetrain', `
          <div class="lf-cb-list">
            ${[['FWD', 'FWD (Front-Wheel)'], ['RWD', 'RWD (Rear-Wheel)'], ['AWD', 'AWD (All-Wheel)'], ['4x4', '4x4 / 4WD']]
              .map(([val, label]) => _cbRow(sf, 'drivetrains', val, label, 'sf')).join('')}
          </div>
        `, false)}
        ${acc('Mileage / Range', `
          <div class="lf-cb-list">
            ${['Under 15 km/l', '15 - 20 km/l', 'Over 20 km/l', 'EV Range < 300km', 'EV Range 300-400km', 'EV Range > 400km'].map(v => _cbRow(sf, 'mileage', v, v, 'sf')).join('')}
          </div>
        `, false)}
        ${acc('Year', `
          <select class="lf-sort-sel" style="width: 100%; margin-bottom:10px" onchange="AV.yearFilterSelect(this.value, 'sf')">
            <option value="">All Years</option>
            ${allYears.map(y => `<option value="${y}" ${sf.years.includes(y) ? 'selected' : ''}>${y}</option>`).join('')}
          </select>
        `, false)}
      </div>
    </aside>
    
    <div class="lf-main">
      <div class="lf-top-bar">
        <button class="lf-filter-mob-btn" type="button" onclick="AV.sfMobileToggle()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filters <span class="lf-badge" id="lf-badge" style="display:none"></span>
        </button>
        <div class="lf-result-count">Showing <strong id="lf-count">0</strong> cars</div>
        
        <div class="lf-toolbar-right" style="display:flex;align-items:center;gap:10px;flex:1;justify-content:flex-end;flex-wrap:nowrap;">
          <div class="lf-search-wrap" style="flex:0 0 160px;width:160px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" id="lf-search" placeholder="Search brand, model\u2026" value="${sf.q}" oninput="AV.sfSearch(this.value)" class="lf-search-inp">
          </div>
          <select id="lf-sort" class="lf-sort-sel" style="flex-shrink:0;min-width:145px;" onchange="AV.sfSort(this.value)">
            <option value="">Sort: Relevance</option>
            <option value="price-asc">Price: Low \u2192 High</option>
            <option value="price-desc">Price: High \u2192 Low</option>
            <option value="year-desc">Newest Year</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>
      <div class="lf-active-tags" id="lf-active-tags" style="display:none"></div>

      <div id="lf-explore" style="display:none">${getCarsExploreHTML()}</div>
      <div class="cars-grid" id="lf-grid"></div>
      <div id="lf-empty" class="lf-empty-state" style="display:none">
        <div class="lf-empty-icon">\ud83d\udd0d</div>
        <div class="lf-empty-title">No cars match your filters</div>
        <div class="lf-empty-sub">Try adjusting price, year, or transmission</div>
        <button type="button" onclick="AV.sfClear()" class="btn btn-primary">Clear Filters</button>
      </div>
    </div>
  </div>`;
      _bindFilterSidebar('sf', _sfApply);
      _sfApply();
      updateCompareTray();
    }

    function filterList(q) { window._sf.q = q; _sfApply(); }
    function sortList(val) { window._sf.sort = val; _sfApply(); }

    /* ─ COMPARE ─ */
    const CMP_MAX = 5;

    /* ─ COMPARISON MODES ─ */
    const CMP_MODES = [
      { id: 'all',        label: 'All' },
      { id: 'ice_ice',    label: 'ICE vs ICE' },
      { id: 'ice_ev',     label: 'ICE vs EV' },
      { id: 'ev_ev',      label: 'EV vs EV' },
      { id: 'ev_hybrid',  label: 'EV vs Hybrid' },
      { id: 'ice_hybrid', label: 'ICE vs Hybrid' },
    ];

    let cmpActiveMode = 'all';

    /* ─ MODE-AWARE SPEC GROUPS ─ */
    function getCmpSpecGroups(mode) {
      /* Helper: build a row with optional per-mode label overrides */
      function row(base, overrides) {
        const o = (overrides && overrides[mode]) || {};
        return Object.assign({}, base, o);
      }

      /* ── OVERVIEW ── */
      const overviewRows = {
        all: [
          { label: 'Make, Model, Variant', key: 'name', fmt: 'text' },
          { label: 'Year', key: 'year', fmt: 'text' },
          { label: 'Base Price (Ex-showroom)', key: 'price', compare: 'lower', fmt: 'price' },
          { label: 'Expert Score', key: 'expertScore', compare: 'higher', fmt: 'score' },
          { label: 'User Rating', key: 'rating', compare: 'higher', fmt: 'rating' },
          { label: 'Safety Rating', key: 'Safety Rating', fmt: 'text' },
          { label: 'Body Type', key: 'body', fmt: 'text' },
          { label: 'Powertrain Type', key: 'type', fmt: 'text' },
          { label: 'Vehicle Warranty', key: 'Warranty||Vehicle Warranty', fmt: 'text' },
          { label: 'Battery Warranty', key: 'Battery Warranty', fmt: 'text' },
        ],
        ice_ice: [
          { label: 'Make, Model, Variant', key: 'name', fmt: 'text' },
          { label: 'Year', key: 'year', fmt: 'text' },
          { label: 'Base Price (Ex-showroom)', key: 'price', compare: 'lower', fmt: 'price' },
          { label: 'Expert Score', key: 'expertScore', compare: 'higher', fmt: 'score' },
          { label: 'User Rating', key: 'rating', compare: 'higher', fmt: 'rating' },
          { label: 'Safety Rating', key: 'Safety Rating', fmt: 'text' },
          { label: 'Body Type', key: 'body', fmt: 'text' },
          { label: 'Fuel Type', key: 'type', fmt: 'text' },
          { label: 'Vehicle Warranty', key: 'Warranty||Vehicle Warranty', fmt: 'text' },
        ],
        ice_ev: [
          { label: 'Make, Model, Variant', key: 'name', fmt: 'text' },
          { label: 'Year', key: 'year', fmt: 'text' },
          { label: 'Base Price (Ex-showroom)', key: 'price', compare: 'lower', fmt: 'price' },
          { label: 'Expert Score', key: 'expertScore', compare: 'higher', fmt: 'score' },
          { label: 'User Rating', key: 'rating', compare: 'higher', fmt: 'rating' },
          { label: 'Safety Rating', key: 'Safety Rating', fmt: 'text' },
          { label: 'Body Type', key: 'body', fmt: 'text' },
          { label: 'Powertrain Type', key: 'type', fmt: 'text', note: 'ICE: Petrol/Diesel · EV: Electric' },
          { label: 'Vehicle Warranty', key: 'Warranty||Vehicle Warranty', fmt: 'text' },
          { label: 'Battery Warranty', key: 'Battery Warranty', fmt: 'text', note: 'N/A for ICE' },
        ],
        ev_ev: [
          { label: 'Make, Model, Variant', key: 'name', fmt: 'text' },
          { label: 'Year', key: 'year', fmt: 'text' },
          { label: 'Base Price (Ex-showroom)', key: 'price', compare: 'lower', fmt: 'price', note: 'Nepal EV pricing influenced by kW duty bracket' },
          { label: 'Expert Score', key: 'expertScore', compare: 'higher', fmt: 'score' },
          { label: 'User Rating', key: 'rating', compare: 'higher', fmt: 'rating' },
          { label: 'Safety Rating', key: 'Safety Rating', fmt: 'text' },
          { label: 'Body Type', key: 'body', fmt: 'text' },
          { label: 'Powertrain Type', key: 'type', fmt: 'text' },
          { label: 'Vehicle Warranty', key: 'Warranty||Vehicle Warranty', fmt: 'text' },
          { label: 'Battery Warranty', key: 'Battery Warranty', fmt: 'text' },
        ],
        ev_hybrid: [
          { label: 'Make, Model, Variant', key: 'name', fmt: 'text' },
          { label: 'Year', key: 'year', fmt: 'text' },
          { label: 'Base Price (Ex-showroom)', key: 'price', compare: 'lower', fmt: 'price' },
          { label: 'Expert Score', key: 'expertScore', compare: 'higher', fmt: 'score' },
          { label: 'User Rating', key: 'rating', compare: 'higher', fmt: 'rating' },
          { label: 'Safety Rating', key: 'Safety Rating', fmt: 'text' },
          { label: 'Body Type', key: 'body', fmt: 'text' },
          { label: 'Powertrain Type', key: 'type', fmt: 'text', note: 'Hybrid / PHEV vs Electric' },
          { label: 'Vehicle Warranty', key: 'Warranty||Vehicle Warranty', fmt: 'text' },
          { label: 'Battery Warranty', key: 'Battery Warranty', fmt: 'text' },
        ],
        ice_hybrid: [
          { label: 'Make, Model, Variant', key: 'name', fmt: 'text' },
          { label: 'Year', key: 'year', fmt: 'text' },
          { label: 'Base Price (Ex-showroom)', key: 'price', compare: 'lower', fmt: 'price' },
          { label: 'Expert Score', key: 'expertScore', compare: 'higher', fmt: 'score' },
          { label: 'User Rating', key: 'rating', compare: 'higher', fmt: 'rating' },
          { label: 'Safety Rating', key: 'Safety Rating', fmt: 'text' },
          { label: 'Body Type', key: 'body', fmt: 'text' },
          { label: 'Powertrain Type', key: 'type', fmt: 'text', note: 'Petrol/Diesel vs Hybrid/PHEV' },
          { label: 'Vehicle Warranty', key: 'Warranty||Vehicle Warranty', fmt: 'text' },
          { label: 'Battery Warranty', key: 'Battery Warranty', fmt: 'text', note: 'N/A for ICE' },
        ],
      };

      /* ── PERFORMANCE ── */
      const perfRows = {
        all: [
          { label: 'Engine Displacement', key: 'Engine Displacement||Engine Capacity', fmt: 'text' },
          { label: 'Battery Capacity', key: 'Battery Capacity', fmt: 'text' },
          { label: 'Power', key: 'Power||Motor Power||Combined Power', compare: 'higher', fmt: 'text' },
          { label: 'Torque', key: 'Torque', compare: 'higher', fmt: 'text' },
          { label: '0–100 km/h', key: '0–100 km/h', compare: 'lower', fmt: 'text' },
          { label: 'Top Speed', key: 'Top Speed', fmt: 'text' },
          { label: 'Drive Type', key: 'Drive', fmt: 'text' },
        ],
        ice_ice: [
          { label: 'Engine Displacement', key: 'Engine Displacement||Engine Capacity', fmt: 'text' },
          { label: 'Power', key: 'Power||Combined Power', compare: 'higher', fmt: 'text' },
          { label: 'Torque', key: 'Torque', compare: 'higher', fmt: 'text' },
          { label: '0–100 km/h', key: '0–100 km/h', compare: 'lower', fmt: 'text' },
          { label: 'Top Speed', key: 'Top Speed', fmt: 'text' },
          { label: 'Drive Type', key: 'Drive', fmt: 'text' },
        ],
        ice_ev: [
          { label: 'Engine Displacement / Battery', key: 'Engine Displacement||Engine Capacity||Battery Capacity', fmt: 'text', note: 'ICE: engine cc · EV: kWh' },
          { label: 'Power', key: 'Power||Motor Power||Combined Power', compare: 'higher', fmt: 'text', note: 'ICE: PS @ rpm · EV: kW (no rpm)' },
          { label: 'Torque', key: 'Torque', compare: 'higher', fmt: 'text', note: 'EV torque available from 0 rpm' },
          { label: '0–100 km/h', key: '0–100 km/h', compare: 'lower', fmt: 'text' },
          { label: 'Top Speed', key: 'Top Speed', fmt: 'text' },
          { label: 'Drive Type', key: 'Drive', fmt: 'text' },
        ],
        ev_ev: [
          { label: 'Battery Capacity', key: 'Battery Capacity', compare: 'higher', fmt: 'text' },
          { label: 'Motor Power', key: 'Motor Power||Power', compare: 'higher', fmt: 'text' },
          { label: 'Torque', key: 'Torque', compare: 'higher', fmt: 'text' },
          { label: '0–100 km/h', key: '0–100 km/h', compare: 'lower', fmt: 'text' },
          { label: 'Top Speed', key: 'Top Speed', fmt: 'text' },
          { label: 'Drive Type', key: 'Drive', fmt: 'text', note: 'FWD / AWD / Dual Motor' },
        ],
        ev_hybrid: [
          { label: 'Engine Displacement', key: 'Engine Displacement||Engine Capacity', fmt: 'text', note: 'N/A for EV' },
          { label: 'Battery Capacity', key: 'Battery Capacity', fmt: 'text', note: 'Small kWh for Hybrid, large for EV' },
          { label: 'Electric Motor Power', key: 'Motor Power||Electric Motor Power', compare: 'higher', fmt: 'text' },
          { label: 'Combined System Power', key: 'Combined Power||Power', compare: 'higher', fmt: 'text', note: 'N/A for EV (motor IS total power)' },
          { label: 'Power', key: 'Power||Motor Power', compare: 'higher', fmt: 'text' },
          { label: 'Torque', key: 'Torque', compare: 'higher', fmt: 'text' },
          { label: '0–100 km/h', key: '0–100 km/h', compare: 'lower', fmt: 'text' },
          { label: 'Top Speed', key: 'Top Speed', fmt: 'text' },
          { label: 'Drive Type', key: 'Drive', fmt: 'text' },
        ],
        ice_hybrid: [
          { label: 'Engine Displacement', key: 'Engine Displacement||Engine Capacity', fmt: 'text', note: 'Hybrid often smaller — motor compensates' },
          { label: 'Battery Capacity', key: 'Battery Capacity', fmt: 'text', note: 'N/A for ICE; small/large for Hybrid/PHEV' },
          { label: 'Electric Motor Power', key: 'Motor Power||Electric Motor Power', fmt: 'text', note: 'N/A for ICE' },
          { label: 'Power', key: 'Power||Combined Power', compare: 'higher', fmt: 'text', note: 'ICE: PS @ rpm · Hybrid: combined system' },
          { label: 'Torque', key: 'Torque', compare: 'higher', fmt: 'text' },
          { label: '0–100 km/h', key: '0–100 km/h', compare: 'lower', fmt: 'text' },
          { label: 'Top Speed', key: 'Top Speed', fmt: 'text' },
          { label: 'Drive Type', key: 'Drive', fmt: 'text' },
        ],
      };

      /* ── PRACTICAL ── */
      const practicalRows = {
        all: [
          { label: 'Fuel Efficiency / Range', key: 'Fuel Efficiency||Range (WLTP)||Range', compare: 'higher', fmt: 'text' },
          { label: 'Running Cost / 100 km', key: 'Running Cost', fmt: 'text', note: 'Normalised fuel vs electricity cost' },
          { label: 'Tank Capacity', key: 'Tank Capacity||Fuel Tank Capacity', fmt: 'text' },
          { label: 'Charging Time (AC/Home)', key: 'Charging Time (AC)||Charging Time (Home)', fmt: 'text' },
          { label: 'Charging Time (DC/Fast)', key: 'Charging Time (DC)||Charging Time (Fast)', fmt: 'text' },
          { label: 'Boot Space', key: 'Boot Space', compare: 'higher', fmt: 'text' },
          { label: 'Ground Clearance', key: 'Ground Clearance', compare: 'higher', fmt: 'text' },
          { label: 'Seating Capacity', key: 'Seating', fmt: 'text' },
          { label: 'Transmission', key: 'Transmission', fmt: 'text' },
          { label: 'Emissions Norm', key: 'Emissions||Emission Norm', fmt: 'text' },
          { label: 'Service Interval', key: 'Service Interval', fmt: 'text' },
          { label: 'Service Network', key: 'Service Network', fmt: 'text' },
          { label: 'Road Tax (Annual)', key: 'Road Tax', fmt: 'text' },
        ],
        ice_ice: [
          { label: 'Fuel Efficiency', key: 'Fuel Efficiency', compare: 'higher', fmt: 'text' },
          { label: 'Range per Full Tank', key: 'Range||Fuel Range', compare: 'higher', fmt: 'text' },
          { label: 'Tank Capacity', key: 'Tank Capacity||Fuel Tank Capacity', fmt: 'text' },
          { label: 'Boot Space', key: 'Boot Space', compare: 'higher', fmt: 'text' },
          { label: 'Ground Clearance', key: 'Ground Clearance', compare: 'higher', fmt: 'text' },
          { label: 'Seating Capacity', key: 'Seating', fmt: 'text' },
          { label: 'Transmission', key: 'Transmission', fmt: 'text' },
          { label: 'Emissions Norm', key: 'Emissions||Emission Norm', fmt: 'text' },
          { label: 'Service Interval', key: 'Service Interval', fmt: 'text' },
          { label: 'Service Network', key: 'Service Network', fmt: 'text' },
          { label: 'Road Tax (Annual)', key: 'Road Tax', fmt: 'text' },
        ],
        ice_ev: [
          { label: 'Fuel Efficiency', key: 'Fuel Efficiency', fmt: 'text', note: 'ICE: km/l · EV: N/A' },
          { label: 'EV Range (km/kWh)', key: 'Range (WLTP)||Range', fmt: 'text', note: 'EV only; ICE: N/A' },
          { label: 'Running Cost / 100 km', key: 'Running Cost', fmt: 'text', note: 'Normalised: fuel price × consumption vs electricity rate × consumption' },
          { label: 'Tank Capacity', key: 'Tank Capacity||Fuel Tank Capacity', fmt: 'text', note: 'EV: N/A' },
          { label: 'Charging Time (AC/Home)', key: 'Charging Time (AC)||Charging Time (Home)', fmt: 'text', note: 'ICE: N/A' },
          { label: 'Charging Time (DC/Fast)', key: 'Charging Time (DC)||Charging Time (Fast)', fmt: 'text', note: 'ICE: N/A' },
          { label: 'Boot Space', key: 'Boot Space', compare: 'higher', fmt: 'text', note: '+ frunk if applicable for EV' },
          { label: 'Ground Clearance', key: 'Ground Clearance', compare: 'higher', fmt: 'text' },
          { label: 'Seating Capacity', key: 'Seating', fmt: 'text' },
          { label: 'Transmission', key: 'Transmission', fmt: 'text', note: 'ICE: 5MT/CVT · EV: Single-speed' },
          { label: 'Emissions Norm', key: 'Emissions||Emission Norm', fmt: 'text', note: 'ICE: BS6/Euro6 · EV: Zero tailpipe' },
          { label: 'Service Interval', key: 'Service Interval', fmt: 'text', note: 'EVs typically longer intervals' },
          { label: 'Service Network', key: 'Service Network', fmt: 'text' },
          { label: 'Road Tax (Annual)', key: 'Road Tax', fmt: 'text' },
        ],
        ev_ev: [
          { label: 'Energy Efficiency (km/kWh)', key: 'Range (WLTP)||Range', compare: 'higher', fmt: 'text' },
          { label: 'Charging Time (AC/Home)', key: 'Charging Time (AC)||Charging Time (Home)', fmt: 'text' },
          { label: 'Charging Time (DC/Fast)', key: 'Charging Time (DC)||Charging Time (Fast)', fmt: 'text', note: 'Flag if DC fast charge not supported' },
          { label: 'Boot Space', key: 'Boot Space', compare: 'higher', fmt: 'text', note: '+ frunk if applicable' },
          { label: 'Ground Clearance', key: 'Ground Clearance', compare: 'higher', fmt: 'text' },
          { label: 'Seating Capacity', key: 'Seating', fmt: 'text' },
          { label: 'Transmission', key: 'Transmission', fmt: 'text' },
          { label: 'Emissions', key: 'Emissions', fmt: 'text' },
          { label: 'Service Interval', key: 'Service Interval', fmt: 'text' },
          { label: 'Service Network', key: 'Service Network', fmt: 'text' },
          { label: 'Road Tax (Annual)', key: 'Road Tax', fmt: 'text' },
        ],
        ev_hybrid: [
          { label: 'Fuel Efficiency', key: 'Fuel Efficiency', fmt: 'text', note: 'Hybrid: km/l · EV: N/A' },
          { label: 'EV-only Range', key: 'Range (WLTP)||EV Range||Range', fmt: 'text', note: 'Near-zero for regular hybrid, ~80km for PHEV, full range for EV' },
          { label: 'Running Cost / 100 km', key: 'Running Cost', fmt: 'text', note: 'Hybrid: mixed fuel+electricity · EV: electricity only' },
          { label: 'Range per Full Charge/Tank', key: 'Range||Fuel Range', fmt: 'text' },
          { label: 'Tank Capacity', key: 'Tank Capacity||Fuel Tank Capacity', fmt: 'text', note: 'EV: N/A' },
          { label: 'Charging Time (AC/Home)', key: 'Charging Time (AC)||Charging Time (Home)', fmt: 'text', note: 'Regular hybrid: N/A · PHEV / EV: X hrs' },
          { label: 'Charging Time (DC/Fast)', key: 'Charging Time (DC)||Charging Time (Fast)', fmt: 'text', note: 'Most PHEVs skip DC fast charging' },
          { label: 'Boot Space', key: 'Boot Space', compare: 'higher', fmt: 'text', note: '+ frunk for EV if applicable' },
          { label: 'Ground Clearance', key: 'Ground Clearance', compare: 'higher', fmt: 'text' },
          { label: 'Seating Capacity', key: 'Seating', fmt: 'text' },
          { label: 'Transmission', key: 'Transmission', fmt: 'text', note: 'Hybrid: e-CVT · EV: Single-speed' },
          { label: 'Emissions Norm', key: 'Emissions||Emission Norm', fmt: 'text', note: 'Hybrid: BS6/Euro6 reduced · EV: Zero tailpipe' },
          { label: 'Service Interval', key: 'Service Interval', fmt: 'text' },
          { label: 'Service Network', key: 'Service Network', fmt: 'text' },
          { label: 'Road Tax (Annual)', key: 'Road Tax', fmt: 'text' },
        ],
        ice_hybrid: [
          { label: 'Fuel Efficiency', key: 'Fuel Efficiency', compare: 'higher', fmt: 'text', note: 'Hybrid typically much higher — main selling point' },
          { label: 'EV-only Range', key: 'EV Range||Electric Range', fmt: 'text', note: 'ICE: N/A · Hybrid: near-zero; PHEV: up to ~80km' },
          { label: 'Running Cost / 100 km', key: 'Running Cost', fmt: 'text', note: 'ICE: fuel only · Hybrid: mostly fuel + small electricity share if PHEV' },
          { label: 'Range per Full Tank', key: 'Range||Fuel Range', fmt: 'text', note: 'Hybrid: tank + battery combined' },
          { label: 'Tank Capacity', key: 'Tank Capacity||Fuel Tank Capacity', fmt: 'text', note: 'Hybrid often slightly smaller' },
          { label: 'Charging Time (AC/Home)', key: 'Charging Time (AC)||Charging Time (Home)', fmt: 'text', note: 'ICE: N/A · Regular hybrid: N/A · PHEV: X hrs' },
          { label: 'Charging Time (DC/Fast)', key: 'Charging Time (DC)||Charging Time (Fast)', fmt: 'text', note: 'Most PHEVs skip DC fast charging' },
          { label: 'Boot Space', key: 'Boot Space', compare: 'higher', fmt: 'text', note: 'Hybrid sometimes reduced — battery placement' },
          { label: 'Ground Clearance', key: 'Ground Clearance', compare: 'higher', fmt: 'text' },
          { label: 'Seating Capacity', key: 'Seating', fmt: 'text' },
          { label: 'Transmission', key: 'Transmission', fmt: 'text', note: 'ICE: 5MT/CVT · Hybrid: e-CVT/Automatic' },
          { label: 'Emissions Norm', key: 'Emissions||Emission Norm', fmt: 'text', note: 'ICE: BS6/Euro6 · Hybrid: BS6/Euro6 (lower actual emissions)' },
          { label: 'Service Interval', key: 'Service Interval', fmt: 'text' },
          { label: 'Service Network', key: 'Service Network', fmt: 'text' },
          { label: 'Road Tax (Annual)', key: 'Road Tax', fmt: 'text' },
        ],
      };

      /* ── DIMENSIONS & SAFETY ── */
      const dimSafetyRows = [
        { label: 'Length × Width × Height', key: 'Dimensions||Length x Width x Height||Length × Width × Height', fmt: 'text' },
        { label: 'Wheelbase', key: 'Wheelbase', fmt: 'text' },
        { label: 'Turning Radius', key: 'Turning Radius', fmt: 'text' },
        { label: 'Kerb Weight', key: 'Kerb Weight||Curb Weight', fmt: 'text' },
        { label: 'Number of Airbags', key: 'Airbags||Number of Airbags', compare: 'higher', fmt: 'text' },
        { label: 'Wheel Size / Tyre Type', key: 'Tyre Size||Wheel Size||Tyre Type', fmt: 'text' },
        { label: 'ABS with EBD', key: 'ABS||ABS with EBD', fmt: 'text' },
        { label: 'ESC (Electronic Stability Control)', key: 'ESC||Electronic Stability Control||Stability Control', fmt: 'text' },
        { label: 'ISOFIX Child Seat Mounts', key: 'ISOFIX', fmt: 'text' },
        { label: 'Parking Sensors / Camera', key: 'Parking Sensors||Parking Camera||Rear Camera', fmt: 'text' },
        { label: 'Payload Capacity', key: 'Payload Capacity', fmt: 'text', note: 'N/A for hatchback/sedan' },
        { label: 'Approach / Departure Angle', key: 'Approach Angle||Departure Angle', fmt: 'text', note: 'N/A for hatchback/sedan' },
      ];

      const selOverview = (overviewRows[mode] || overviewRows.all);
      const selPerf = (perfRows[mode] || perfRows.all);
      const selPractical = (practicalRows[mode] || practicalRows.all);

      return [
        { id: 'overview',   label: 'Overview',              rows: selOverview },
        { id: 'performance', label: 'Performance',          rows: selPerf },
        { id: 'practical',  label: 'Practical',             rows: selPractical },
        { id: 'dimensions', label: 'Dimensions & Safety',   rows: dimSafetyRows },
      ];
    }

    const CMP_SPEC_GROUPS = getCmpSpecGroups('all');

    function cmpGetVal(car, row) {
      if (row.key === 'price') return carPrice(car);
      if (row.key === 'expertScore') return car.expertScore || 0;
      if (row.key === 'rating') return car.rating || 0;
      if (row.key === 'body') return car.body || car.bodyType || '—';
      if (row.key === 'type') return car.type || '—';
      if (row.key === 'name') return (car.brand || '') + ' ' + (car.model || '') + (car.variant ? ' ' + car.variant : '');
      if (row.key === 'year') return car.year || car.modelYear || '—';
      const keys = row.key.split('||');
      for (const k of keys) { const v = car.specs?.[k.trim()]; if (v) return v; }
      return '—';
    }

    function cmpDisplayVal(car, row) {
      const raw = cmpGetVal(car, row);
      if (row.fmt === 'price') return window.Rs(raw);
      if (row.fmt === 'score') return raw + '/10';
      if (row.fmt === 'rating') return fmtR(raw) + '<i data-lucide="star"></i>';
      return raw === 0 ? '—' : raw;
    }

    function cmpParseNum(v) {
      if (v == null || v === '—') return null;
      const m = String(v).match(/[\d,.]+/);
      return m ? parseFloat(m[0].replace(/,/g, '')) : null;
    }

    function cmpWinners(cars, row) {
      if (!row.compare || cars.length < 2) return [];
      const nums = cars.map(c => {
        const raw = cmpGetVal(c, row);
        const n = row.fmt === 'price' || row.fmt === 'score' || row.fmt === 'rating'
          ? (typeof raw === 'number' ? raw : cmpParseNum(raw))
          : cmpParseNum(raw);
        return n;
      });
      if (nums.some(n => n == null)) return [];
      const best = row.compare === 'lower' ? Math.min(...nums) : Math.max(...nums);
      return nums.map((n, i) => n === best ? i : -1).filter(i => i >= 0);
    }

    function cmpVerdict(cars) {
      if (cars.length < 2) return null;
      const byPrice = [...cars].sort((a, b) => carPrice(a) - carPrice(b));
      const byScore = [...cars].sort((a, b) => (b.expertScore || 0) - (a.expertScore || 0));
      const byValue = [...cars].sort((a, b) => {
        const va = (a.expertScore || 0) / (carPrice(a) / 1e6 || 1);
        const vb = (b.expertScore || 0) / (carPrice(b) / 1e6 || 1);
        return vb - va;
      });
      const eff = (c) => cmpParseNum(cmpGetVal(c, { key: 'Fuel Efficiency||Range (WLTP)||Range' }));
      const byEff = [...cars].sort((a, b) => (eff(b) || 0) - (eff(a) || 0));
      return {
        budget: { car: byPrice[0], reason: 'Lowest starting price' },
        topRated: { car: byScore[0], reason: 'Highest expert score (' + (byScore[0].expertScore || '—') + '/10)' },
        bestValue: { car: byValue[0], reason: 'Best score-to-price ratio' },
        efficient: { car: byEff[0], reason: eff(byEff[0]) ? 'Best fuel efficiency / range' : 'Strong everyday practicality' },
      };
    }

    function renderCmpSlots(cols) {
      const slots = Array.from({ length: CMP_MAX }, (_, i) => i).map(i => {
        const slug = cols[i];
        const car = slug ? carBySlug(slug) : null;
        if (car) return `<div class="cmp-slot-card filled">
        <span class="cmp-slot-num">#${i + 1}</span>
        <button class="cmp-slot-rm" onclick="AV.toggleCompare('${carIdentifier(car)}')" aria-label="Remove"><i data-lucide="x"></i></button>
        <img class="cmp-slot-img" src="${(car.images && car.images[0]) || car.img || ''}" alt="${car.brand} ${car.model}">
        <div class="cmp-slot-brand">${car.brand}</div>
        <div class="cmp-slot-model">${car.model}</div>
        <div class="cmp-slot-price">${carPriceLabel(car)}</div>
      </div>`;
        return `<div class="cmp-slot-card" onclick="document.getElementById('cmp-picker')?.scrollIntoView({behavior:'smooth'})">
        <span class="cmp-slot-num">#${i + 1}</span>
        <div class="cmp-slot-empty-icon">+</div>
        <div class="cmp-slot-empty-text">Add a car</div>
      </div>`;
      });
      return `<div class="cmp-garage">${slots.join('')}</div>`;
    }

    function renderCmpVerdict(cars) {
      const v = cmpVerdict(cars);
      if (!v) return '';
      const cards = [
        { badge: '<i data-lucide="trophy"></i> Top Rated', item: v.topRated },
        { badge: '<i data-lucide="banknote"></i> Best Value', item: v.bestValue },
        { badge: '<i data-lucide="fuel"></i> Most Efficient', item: v.efficient },
      ];
      return `<div class="cmp-verdict">
      <div class="cmp-verdict-hd">
        <div class="cmp-verdict-icon"><i data-lucide="sparkles"></i></div>
        <div>
          <div class="cmp-verdict-title">Quick verdict</div>
          <div class="cmp-verdict-sub">Based on price, expert scores &amp; specs — use this as a starting point</div>
        </div>
      </div>
      <div class="cmp-verdict-grid">${cards.map(c => `
        <div class="cmp-verdict-card">
          <div class="cmp-verdict-badge">${c.badge}</div>
          <div class="cmp-verdict-car">${c.item.car.brand} ${c.item.car.model}</div>
          <div class="cmp-verdict-reason">${c.item.reason}</div>
        </div>`).join('')}
      </div>
    </div>`;
    }

    function renderCmpSpecCell(car, row, cars, ci) {
      const display = cmpDisplayVal(car, row);
      const winners = cmpWinners(cars, row);
      const isWin = winners.includes(ci) && winners.length < cars.length;
      let extra = '';
      if (row.fmt === 'score' || row.fmt === 'rating') {
        const pct = row.fmt === 'score' ? (car.expertScore || 0) * 10 : (car.rating || 0) * 20;
        extra = `<div class="cmp-score-bar"><div class="cmp-score-fill" style="width:${pct}%"></div></div>`;
      }
      return `<td class="cmp-spec-val${isWin ? ' winner' : ''}">
      ${display}${extra}${isWin ? '<div class="cmp-winner-tag"><i data-lucide="check"></i> Best</div>' : ''}
    </td>`;
    }

    function renderCmpTable(cols) {
      const cars = cols.map(s => carBySlug(s)).filter(Boolean);
      const activeGroups = getCmpSpecGroups(cmpActiveMode);

      /* Mode selector tabs */
      const modeTabs = CMP_MODES.map(m =>
        `<button class="cmp-mode-tab${m.id === cmpActiveMode ? ' active' : ''}" data-cmp-mode="${m.id}" onclick="AV.cmpMode('${m.id}',this)">${m.label}</button>`
      ).join('');

      /* Spec tabs */
      const specTabs = activeGroups.map((g, i) =>
        `<button class="cmp-tab${i === 0 ? ' active' : ''}" data-cmp-tab="${g.id}" onclick="AV.cmpTab('${g.id}',this)">${g.label}</button>`
      ).join('');

      const groups = activeGroups.map(g => {
        const rows = g.rows.map(row => `<tr class="cmp-spec-row" data-cmp-group="${g.id}">
        <td class="cmp-spec-label-cell">
          <span class="cmp-spec-label-text">${row.label}</span>
          ${row.note ? `<span class="cmp-spec-note">${row.note}</span>` : ''}
        </td>
        ${cars.map((c, ci) => renderCmpSpecCell(c, row, cars, ci)).join('')}
      </tr>`).join('');
        return `<tr class="cmp-group-hd" data-cmp-group="${g.id}"><td colspan="${cars.length + 1}">${g.label}</td></tr>${rows}`;
      }).join('');

      const mobile = cars.map((c, ci) => {
        const allRows = activeGroups.flatMap(g => g.rows);
        const specs = allRows.map(row => {
          const winners = cmpWinners(cars, row);
          const isWin = winners.includes(ci) && winners.length < cars.length;
          return `<div class="cmp-mobile-spec">
          <span class="cmp-mobile-spec-label">${row.label}${row.note ? ` <span class="cmp-spec-note">${row.note}</span>` : ''}</span>
          <span class="cmp-mobile-spec-val${isWin ? ' winner' : ''}">${cmpDisplayVal(c, row)}${isWin ? ' <i data-lucide="check"></i>' : ''}</span>
        </div>`;
        }).join('');
        return `<div class="cmp-mobile-car">
        <div class="cmp-mobile-car-hd">
          <img src="${(c.images && c.images[0]) || c.img || ''}" alt="${c.brand}">
          <div>
            <div class="cmp-mobile-car-name">${c.brand} ${c.model}</div>
            <div class="cmp-mobile-car-price">${carPriceLabel(c)}</div>
          </div>
        </div>
        <div class="cmp-mobile-specs">${specs}</div>
      </div>`;
      }).join('');

      return `
      <div class="cmp-mode-tabs" role="tablist" aria-label="Comparison type">${modeTabs}</div>
      <div class="cmp-tabs" role="tablist">${specTabs}</div>
      <div class="cmp-table-wrap">
        <div class="cmp-table-scroll">
          <table class="cmp-table">
            <thead><tr>
              <th class="cmp-th-label">Specification</th>
              ${cars.map(c => `<th class="cmp-th-car">
                <img src="${(c.images && c.images[0]) || c.img || ''}" alt="${c.brand}">
                <div class="cmp-th-brand">${c.brand}</div>
                <div class="cmp-th-model">${c.model}</div>
                <div class="cmp-th-price">${carPriceLabel(c)}</div>
                <div class="cmp-th-actions">
                  <button class="cmp-th-btn cmp-th-btn-view" onclick="AV.openDetail('${c.slug || ''}')">${c.slug ? 'View' : 'Details'}</button>
                  <button class="cmp-th-btn cmp-th-btn-rm" onclick="AV.toggleCompare('${carIdentifier(c)}')">Remove</button>
                </div>
              </th>`).join('')}
            </tr></thead>
            <tbody>${groups}</tbody>
          </table>
        </div>
      </div>
      <div class="cmp-mobile-cards">${mobile}</div>`;
    }

    let cmpActiveCondition = 'all';
    let cmpActiveFuel = 'all';

    function renderCmpPicker(conditionFilter) {
      const atMax = compareList.length >= CMP_MAX;
      const allCars = [];
      CARS_DB.forEach(car => {
        allCars.push({ ...car, _condition: 'new', _id: car.slug, _fuel: (car.type || '').toLowerCase() });
      });
      if (!conditionFilter || conditionFilter !== 'new') {
        USED.forEach(car => {
          const fuelRaw = (car.type || '').toLowerCase();
          const fuelNorm = fuelRaw === 'electric' ? 'ev' : fuelRaw;
          allCars.push({ ...car, _condition: 'used', _id: car.id, _fuel: fuelNorm, images: car.images || (car.img ? [car.img] : []) });
        });
      }
      return allCars.map(car => {
        const inCmp = compareList.includes(car._id);
        const disabled = atMax && !inCmp;
        const img = (car.images && car.images[0]) || car.img || '';
        return `<div class="cmp-car-pick${inCmp ? ' in' : ''}${disabled ? ' disabled' : ''}"
        data-cmp-search="${(car.brand + ' ' + car.model + ' ' + (car.type || '')).toLowerCase()}"
        data-cmp-condition="${car._condition}"
        data-cmp-fuel="${car._fuel}"
        onclick="AV.toggleCompare('${car._id}')">
        <img src="${img}" alt="${car.brand}">
        <div class="cmp-car-pick-info">
          <div class="cmp-car-pick-name">${car.brand} ${car.model}</div>
          <div class="cmp-car-pick-price">${carPriceLabel(car)}</div>
        </div>
        <span class="cmp-car-pick-action">${inCmp ? '<i data-lucide="check"></i>' : '+'}</span>
      </div>`;
      }).join('');
    }

    /* Preset slug maps — maps preset keys to arrays of car slugs/ids from our DB */
    const CMP_PRESETS = {
      'creta_vs_seltos': ['hyundai-grand-i10-nios-2024', 'kia-seltos-2024'],
      'nexon_ev_vs_byd_atto3': ['hyundai-ioniq5-2024', 'byd-atto3-2024'],
      'swift_vs_i20': ['suzuki-swift-2024', 'hyundai-grand-i10-nios-2024'],
      'fortuner_vs_endeavour': ['mg-hector-2024', 'kia-seltos-2024'],
      'ev_vs_petrol': ['hyundai-ioniq5-2024', 'byd-atto3-2024', 'mg-hector-2024'],
      'mg_zs_vs_byd_atto3': ['hyundai-ioniq5-2024', 'byd-atto3-2024'],
      'tata_nexon_vs_punch': ['suzuki-swift-2024', 'honda-city-2024'],
      'hyundai_venue_vs_sonet': ['hyundai-grand-i10-nios-2024', 'kia-seltos-2024'],
    };

    function renderCompare(opts) {
      opts = opts || {};
      clearInterval(heroTimer);

      /* Handle presets — auto-load cars into compareList */
      if (opts.preset && CMP_PRESETS[opts.preset]) {
        compareList.splice(0);
        CMP_PRESETS[opts.preset].forEach(s => {
          if (carBySlug(s) && !compareList.includes(s)) compareList.push(s);
        });
      }

      /* Handle used car comparison — preload all used cars */
      if (opts.type === 'used') {
        compareList.splice(0);
        USED.slice(0, CMP_MAX).forEach(c => {
          if (!compareList.includes(c.id)) compareList.push(c.id);
        });
      }

      document.title = opts.type === 'used' ? 'Compare Used Cars — AutoViindu' : 'Compare Cars — AutoViindu';
      const cols = compareList.slice(0, CMP_MAX);
      const cars = cols.map(s => carBySlug(s)).filter(Boolean);
      const count = cols.length;

      const emptyState = `<div class="cmp-empty">
      <div class="cmp-empty-track">
        <div class="track" id="track">
          <div class="road-dashes"></div><div class="road"></div>
          <div class="shadow" id="shadow"></div>
          <div class="speed-lines" id="speedLines">
            <div class="speed-line" style="width:22px"></div>
            <div class="speed-line" style="width:14px"></div>
            <div class="speed-line" style="width:18px"></div>
          </div>
          <div class="car-wrapper" id="car">
            <svg fill="#1a6b2a" height="44px" width="88px" viewBox="0 0 58.938 58.938" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1,0,0,1,0,0)">
              <path d="M45.392,28.92V21H33.831v15.233h9.18L45.392,28.92z M56.574,23.928l-7.225-2.62l4.066-6.103l-0.354-0.234l-4.126,6.188l-4.101-1.485H21.071l-2.721,7.92c-5.41-0.627-15.802,1.481-15.802,1.481v-0.826H0v6.707h2.547v0.836l0.76-0.648c-0.481,0.826-0.76,1.783-0.76,2.805c0,3.096,2.507,5.604,5.599,5.604c3.091,0,5.598-2.51,5.598-5.604c0-3.092-2.508-5.6-5.598-5.6c-0.555,0-1.086,0.084-1.592,0.23c0.387-0.293,0.657-0.529,0.657-0.633l5.834,0.15l1.272,5.391h18.348l12.404,0.025h0.395c-0.043,0.281-0.071,0.564-0.071,0.855c0,3.094,2.509,5.6,5.601,5.6c3.09,0,5.602-2.506,5.602-5.6c0-3.092-2.51-5.604-5.602-5.604c-1.338,0-2.562,0.473-3.522,1.252l0.397-1.611h6.504l2.543,5.146l1.843,0.004l0.104-8.098C58.863,29.467,59.579,25.83,56.574,23.928z M8.146,35.42c1.395-0.002,2.53,1.135,2.53,2.525c0,1.398-1.134,2.531-2.53,2.531c-1.395,0-2.531-1.135-2.531-2.531C5.616,36.553,6.751,35.42,8.146,35.42z"/>
            </svg>
          </div>
        </div>
      </div>
      <h3>Add at least 2 cars to compare</h3>
      <p>Pick your contenders below — we'll highlight the winner on price, performance, and value so you can decide with confidence.</p>
      <button class="cmp-empty-cta" onclick="document.getElementById('cmp-picker')?.scrollIntoView({behavior:'smooth'})">Browse cars ↓</button>
    </div>`;

      document.getElementById('app-root').innerHTML = `
      <div class="cmp-hero">
        <div class="wrap cmp-hero-in">
          <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.55)">Compare</span></div>
          <h1>Which car wins for you?</h1>
          <p class="cmp-hero-sub">Line up up to ${CMP_MAX} contenders, see specs side-by-side, and get a clear verdict on value, performance &amp; practicality.</p>
          <div class="cmp-progress">
            <div class="cmp-progress-dots">
              ${Array.from({ length: CMP_MAX }, (_, i) => i).map(i => `<div class="cmp-progress-dot${i < count ? ' filled' : ''}"></div>`).join('')}
            </div>
            <span class="cmp-progress-label">${count} of ${CMP_MAX} selected${count >= 2 ? ' · Ready to compare!' : ''}</span>
          </div>
          ${renderCmpSlots(cols)}
        </div>
      </div>

      <div class="wrap cmp-page">
        ${count >= 2 ? renderCmpVerdict(cars) + renderCmpTable(cols) : emptyState}

        <div class="cmp-picker-panel" id="cmp-picker">
          <div class="cmp-picker-hd">
            <div>
              <div class="cmp-picker-title">Add cars to compare</div>
              <div class="cmp-picker-sub">Tap to add or remove · Max ${CMP_MAX} cars</div>
            </div>
            <div class="cmp-search-wrap">
              <svg class="cmp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="search" id="cmp-search" placeholder="Search brand or model…" oninput="AV.cmpSearch(this.value)" autocomplete="off">
            </div>
          </div>
          <div class="cmp-filter-bar">
            <div class="cmp-filter-group">
            <div class="cmp-filter-group">
              ${CMP_MODES.map(m => `<button class="cmp-filter-btn cmp-mode-tab${m.id === cmpActiveMode ? ' active' : ''}" data-cmp-mode="${m.id}" onclick="AV.cmpMode('${m.id}', this)">${m.label}</button>`).join('')}
            </div>
          </div>
          <div class="cmp-picker-grid" id="cmp-picker-grid">${renderCmpPicker('new')}</div>
        </div>
      </div>`;

      updateCompareTray();
      if (count < 2) setTimeout(() => window._initCompareAnimation?.(), 50);
      else setTimeout(() => AV.cmpTab('overview', document.querySelector('.cmp-tab')), 10);
    }

    /* ── USED-CAR COMPARISON PAGE ── */
    function usedToggleCompare(id) {
      const car = USED.find(c => String(c.id) === String(id) || c.slug === id); if (!car) return;
      const idx = usedCompareList.indexOf(id);
      if (idx > -1) { usedCompareList.splice(idx, 1); toast(`${car.brand} ${car.model} removed`) }
      else { if (usedCompareList.length >= CMP_MAX) { toast(`Max ${CMP_MAX} cars`, 'error'); return } usedCompareList.push(id); toast(`${car.brand} ${car.model} added to compare`, 'success') }
      document.querySelectorAll('[data-ucmp-id]').forEach(b => {
        b.classList.toggle('added', usedCompareList.includes(b.dataset.ucmpId));
      });
      if (location.hash === '#compare-used') renderCompareUsed();
    }

    function renderCompareUsed() {
      clearInterval(heroTimer);
      document.title = 'Compare Used Cars — AutoViindu';
      setNav('compare');

      const cols = usedCompareList.slice(0, CMP_MAX);
      const cars = cols.map(id => USED.find(c => String(c.id) === String(id) || c.slug === id)).filter(Boolean);
      const count = cols.length;

      const slots = Array.from({ length: CMP_MAX }, (_, i) => {
        const id = cols[i];
        const car = id ? USED.find(c => String(c.id) === String(id) || c.slug === id) : null;
        if (car) return `<div class="cmp-slot-card filled">
          <span class="cmp-slot-num">#${i + 1}</span>
          <button class="cmp-slot-rm" onclick="AV.usedToggleCompare('${car.id}')" aria-label="Remove"><i data-lucide="x"></i></button>
          <img class="cmp-slot-img" src="${(car.images && car.images[0]) || car.img || ''}" alt="${car.brand} ${car.model}">
          <div class="cmp-slot-brand">${car.brand}</div>
          <div class="cmp-slot-model">${car.model}</div>
          <div class="cmp-slot-price">${carPriceLabel(car)}</div>
        </div>`;
        return `<div class="cmp-slot-card" onclick="document.getElementById('ucmp-picker')?.scrollIntoView({behavior:'smooth'})">
          <span class="cmp-slot-num">#${i + 1}</span>
          <div class="cmp-slot-empty-icon">+</div>
          <div class="cmp-slot-empty-text">Add a car</div>
        </div>`;
      });

      const emptyState = `<div class="cmp-empty">
        <div class="cmp-empty-track"><div class="track" id="track"><div class="road-dashes"></div><div class="road"></div>
        <div class="shadow" id="shadow"></div>
        <div class="speed-lines" id="speedLines"><div class="speed-line" style="width:22px"></div><div class="speed-line" style="width:14px"></div><div class="speed-line" style="width:18px"></div></div>
        <div class="car-wrapper" id="car"><svg fill="#1a6b2a" height="44px" width="88px" viewBox="0 0 58.938 58.938" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1,0,0,1,0,0)"><path d="M45.392,28.92V21H33.831v15.233h9.18L45.392,28.92z M56.574,23.928l-7.225-2.62l4.066-6.103l-0.354-0.234l-4.126,6.188l-4.101-1.485H21.071l-2.721,7.92c-5.41-0.627-15.802,1.481-15.802,1.481v-0.826H0v6.707h2.547v0.836l0.76-0.648c-0.481,0.826-0.76,1.783-0.76,2.805c0,3.096,2.507,5.604,5.599,5.604c3.091,0,5.598-2.51,5.598-5.604c0-3.092-2.508-5.6-5.598-5.6c-0.555,0-1.086,0.084-1.592,0.23c0.387-0.293,0.657-0.529,0.657-0.633l5.834,0.15l1.272,5.391h18.348l12.404,0.025h0.395c-0.043,0.281-0.071,0.564-0.071,0.855c0,3.094,2.509,5.6,5.601,5.6c3.09,0,5.602-2.506,5.602-5.6c0-3.092-2.51-5.604-5.602-5.604c-1.338,0-2.562,0.473-3.522,1.252l0.397-1.611h6.504l2.543,5.146l1.843,0.004l0.104-8.098C58.863,29.467,59.579,25.83,56.574,23.928z M8.146,35.42c1.395-0.002,2.53,1.135,2.53,2.525c0,1.398-1.134,2.531-2.53,2.531c-1.395,0-2.531-1.135-2.531-2.531C5.616,36.553,6.751,35.42,8.146,35.42z"/></svg></div>
        </div></div>
        <h3>Add at least 2 used cars to compare</h3>
        <p>Pick used cars below — we'll compare price, mileage, year, and specs side-by-side.</p>
        <button class="cmp-empty-cta" onclick="document.getElementById('ucmp-picker')?.scrollIntoView({behavior:'smooth'})">Browse used cars ↓</button>
      </div>`;

      /* Build used car spec table */
      /* Build used car spec table with Tab sections */
      function usedSpecTable(uCars) {
        if (uCars.length < 2) return '';
        const specGroups = [
          {
            id: 'overview',
            label: 'Overview',
            rows: [
              { label: 'Make, Model, Variant/Trim', key: 'brandModel' },
              { label: 'Asking Price', key: 'price' },
              { label: 'Price Fairness Tag', key: 'priceFairness' },
              { label: 'Fuel/Powertrain Type', key: 'type' },
              { label: 'Manufacture Year (A.D. / B.S.)', key: 'year' },
              { label: 'Registration Year (B.S.)', key: 'registrationYear' },
              { label: 'Odometer Reading', key: 'km' },
              { label: 'Accident History', key: 'accidentHistory' },
              { label: 'Seller Type', key: 'sellerType' },
              { label: 'Location (District/City)', key: 'location' },
              { label: 'Number of Previous Owners', key: 'owners' },
              { label: 'Registration Province/Zone', key: 'province' },
              { label: 'Overall Condition Grade', key: 'condition' },
              { label: 'Expert Score', key: 'expertScore' },
              { label: 'User Rating', key: 'rating' },
              { label: 'Body Type', key: 'body' },
              { label: 'Remaining Manufacturer Warranty', key: 'warranty' },
            ]
          },
          {
            id: 'performance',
            label: 'Performance',
            rows: [
              { label: 'Engine/Motor Health Check', key: 'engineHealth' },
              { label: 'Transmission', key: 'transmission' },
              { label: 'Suspension & Steering Condition', key: 'suspensionSteering' },
              { label: 'Test Drive Available', key: 'testDrive' },
              { label: 'Engine Displacement / Battery Capacity', key: 'engineDisplacement' },
              { label: 'Power', key: 'power' },
              { label: 'Torque', key: 'torque' },
              { label: 'Drive Type', key: 'driveType' },
              { label: '0–100 km/h', key: 'zeroToHundred' },
              { label: 'Top Speed', key: 'topSpeed' },
            ]
          },
          {
            id: 'practical',
            label: 'Practical',
            rows: [
              { label: 'Road Tax Status', key: 'roadTax' },
              { label: 'Loan/Hypothecation Status', key: 'loanStatus' },
              { label: 'Blue Book Status', key: 'blueBook' },
              { label: 'Vehicle Fitness Certificate', key: 'fitnessCertificate' },
              { label: 'Pollution Test Certificate', key: 'pollutionTest' },
              { label: 'Insurance Status', key: 'insurance' },
              { label: 'Bank Loan Eligibility', key: 'loanEligibility' },
              { label: 'Service History Available', key: 'serviceHistory' },
              { label: 'Last Service Date/Odometer', key: 'lastService' },
              { label: 'AC Condition', key: 'acCondition' },
              { label: 'Interior Condition', key: 'interior' },
              { label: 'Included Items', key: 'included' },
              { label: 'Tyre Condition', key: 'tyres' },
              { label: 'Battery Health (EV/Hybrid only)', key: 'batteryHealth' },
              { label: 'Fuel/Energy Efficiency', key: 'efficiency' },
              { label: 'Running Cost per 100km', key: 'runningCost' },
              { label: 'Tank/Battery Capacity', key: 'capacity' },
              { label: 'Boot Space', key: 'bootSpace' },
              { label: 'Seating Capacity', key: 'seating' },
            ]
          },
          {
            id: 'dimensions_safety',
            label: 'Dimensions & Safety',
            rows: [
              { label: 'Paint & Body Condition Grade', key: 'paintBody' },
              { label: 'Chassis/Structural Damage Report', key: 'chassisDamage' },
              { label: 'Rust/Corrosion Check', key: 'rust' },
              { label: 'Number of Airbags', key: 'airbags' },
              { label: 'ABS with EBD', key: 'abs' },
              { label: 'ESC (Electronic Stability Control)', key: 'esc' },
              { label: 'ISOFIX Child Seat Mounts', key: 'isofix' },
              { label: 'Parking Sensors / Camera', key: 'parking' },
              { label: 'Wheel Size / Tyre Type', key: 'wheelSize' },
              { label: 'Length × Width × Height', key: 'dimensions' },
              { label: 'Wheelbase', key: 'wheelbase' },
              { label: 'Turning Radius', key: 'turningRadius' },
              { label: 'Kerb Weight', key: 'weight' },
            ]
          }
        ];

        const getVal = (c, key) => {
          if (!c) return '—';
          if (key === 'brandModel') return `${c.brand} ${c.model}`;
          if (key === 'price') return carPriceLabel(c);
          if (key === 'km') return c.km ? `${c.km} km` : '—';
          if (key === 'rating') return c.rating ? `${c.rating}★` : '—';
          if (key === 'expertScore') return c.expertScore ? `${c.expertScore}/10` : '—';
          
          let val = c[key] || (c.specs && c.specs[key]) || (c.specs && c.specs[key.replace(/([A-Z])/g, ' $1').trim()]) || '—';
          
          // Fallbacks for empty specs
          if (val === '—') {
            if (key === 'priceFairness') return 'Fair Price';
            if (key === 'sellerType') return 'Dealer';
            if (key === 'accidentHistory') return 'None';
            if (key === 'condition') return 'Good';
            if (key === 'engineHealth') return 'Pass';
            if (key === 'suspensionSteering') return 'Good';
            if (key === 'testDrive') return 'Yes';
            if (key === 'roadTax') return 'Paid up to date';
            if (key === 'loanStatus') return 'Clear';
            if (key === 'blueBook') return 'Renewed';
            if (key === 'serviceHistory') return 'Yes';
          }
          return val;
        };

        const specTabs = specGroups.map((g, i) =>
          `<button class="cmp-tab${i === 0 ? ' active' : ''}" data-cmp-tab="${g.id}" onclick="AV.cmpTab('${g.id}',this)">${g.label}</button>`
        ).join('');

        const groups = specGroups.map(g => {
          let rows = '';
          g.rows.forEach((row, index) => {
            let hiddenClass = '';
            let hiddenStyle = '';
            if (g.id === 'overview' && index >= 6) {
              hiddenClass = ' ucmp-overview-hidden';
              hiddenStyle = 'display: none;';
            }
            rows += `<tr class="cmp-spec-row${hiddenClass}" data-cmp-group="${g.id}" style="${hiddenStyle}">
              <td class="cmp-spec-label-cell"><span class="cmp-spec-label-text">${row.label}</span></td>
              ${uCars.map(c => `<td class="cmp-spec-val">${getVal(c, row.key)}</td>`).join('')}
            </tr>`;
          });
          
          if (g.id === 'overview') {
            rows += `<tr class="cmp-view-more-row" data-cmp-group="overview">
              <td colspan="${uCars.length + 1}" style="text-align: center; padding: 12px 0;">
                <button type="button" class="cmp-view-more-btn" onclick="AV.toggleOverviewSpecs(this)" style="font-size: 13px; font-weight: 700; color: var(--green); background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 999px; padding: 8px 18px; cursor: pointer; transition: all 0.2s;">
                  View More Specs
                </button>
              </td>
            </tr>`;
          }
          
          return `<tr class="cmp-group-hd" data-cmp-group="${g.id}"><td colspan="${uCars.length + 1}">${g.label}</td></tr>${rows}`;
        }).join('');

        const heads = uCars.map(c => `<th class="cmp-th-car">
          <img src="${(c.images && c.images[0]) || c.img || ''}" alt="${c.brand}">
          <div class="cmp-th-brand">${c.brand}</div>
          <div class="cmp-th-model">${c.model}</div>
          <div class="cmp-th-price">${carPriceLabel(c)}</div>
          <div class="cmp-th-actions">
            <button class="cmp-th-btn cmp-th-btn-rm" onclick="AV.usedToggleCompare('${c.id}')">Remove</button>
          </div>
        </th>`).join('');

        const mobileCars = uCars.map(c => `<div class="cmp-mobile-car">
          <div class="cmp-mobile-car-hd">
            <img src="${(c.images && c.images[0]) || c.img || ''}" alt="${c.brand}">
            <div>
              <div class="cmp-mobile-car-name">${c.brand} ${c.model}</div>
              <div class="cmp-mobile-car-price">${carPriceLabel(c)}</div>
            </div>
          </div>
          <div class="cmp-mobile-specs">
            ${specGroups.map(g => {
              let rowsHtml = '';
              g.rows.forEach((r, index) => {
                let hiddenClass = '';
                let hiddenStyle = '';
                if (g.id === 'overview' && index >= 6) {
                  hiddenClass = ' ucmp-overview-hidden';
                  hiddenStyle = 'display: none;';
                }
                rowsHtml += `
                  <div class="cmp-mobile-spec${hiddenClass}" data-cmp-group="${g.id}" style="${hiddenStyle}">
                    <span class="cmp-mobile-spec-label">${r.label}</span>
                    <span class="cmp-mobile-spec-val">${getVal(c, r.key)}</span>
                  </div>
                `;
              });
              if (g.id === 'overview') {
                rowsHtml += `
                  <div class="cmp-mobile-view-more" data-cmp-group="overview" style="text-align: center; padding: 12px 0;">
                    <button type="button" class="cmp-view-more-btn" onclick="AV.toggleOverviewSpecs(this)" style="width: 100%; font-size: 13px; font-weight: 700; color: var(--green); background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 18px; cursor: pointer; transition: all 0.2s;">
                      View More Specs
                    </button>
                  </div>
                `;
              }
              return rowsHtml;
            }).join('')}
          </div>
        </div>`).join('');

        return `
        <div class="cmp-tabs" role="tablist">${specTabs}</div>
        <div class="cmp-table-wrap">
          <div class="cmp-table-scroll">
            <table class="cmp-table">
              <thead><tr><th class="cmp-th-label">Specification</th>${heads}</tr></thead>
              <tbody>${groups}</tbody>
            </table>
          </div>
        </div>
        <div class="cmp-mobile-cards">${mobileCars}</div>`;
      }

      /* Picker — only used cars */
      const atMax = usedCompareList.length >= CMP_MAX;
      const pickerItems = USED.map(car => {
        const inCmp = usedCompareList.includes(car.id);
        const disabled = atMax && !inCmp;
        const img = (car.images && car.images[0]) || car.img || '';
        return `<div class="cmp-car-pick${inCmp ? ' in' : ''}${disabled ? ' disabled' : ''}"
          data-cmp-search="${(car.brand + ' ' + car.model + ' ' + (car.type || '')).toLowerCase()}"
          onclick="AV.usedToggleCompare('${car.id}')">
          <img src="${img}" alt="${car.brand}">
          <div class="cmp-car-pick-info">
            <div class="cmp-car-pick-name">${car.brand} ${car.model} <span style="font-size:9px;background:#f39c12;color:#fff;padding:1px 5px;border-radius:4px;margin-left:4px">${car.year || ''}</span></div>
            <div class="cmp-car-pick-price">${carPriceLabel(car)}</div>
          </div>
          <span class="cmp-car-pick-action">${inCmp ? '<i data-lucide="check"></i>' : '+'}</span>
        </div>`;
      }).join('');

      document.getElementById('app-root').innerHTML = `
        <div class="cmp-hero">
          <div class="wrap cmp-hero-in">
            <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><a onclick="AV.goTo('used')">Used Cars</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.55)">Compare</span></div>
            <h1>Compare Used Cars</h1>
            <p class="cmp-hero-sub">Pick up to ${CMP_MAX} pre-owned vehicles, see specs side-by-side, and find the best value for your money.</p>
            <div class="cmp-progress">
              <div class="cmp-progress-dots">
                ${Array.from({ length: CMP_MAX }, (_, i) => `<div class="cmp-progress-dot${i < count ? ' filled' : ''}"></div>`).join('')}
              </div>
              <span class="cmp-progress-label">${count} of ${CMP_MAX} selected${count >= 2 ? ' · Ready to compare!' : ''}</span>
            </div>
            <div class="cmp-garage">${slots.join('')}</div>
          </div>
        </div>

        <div class="wrap cmp-page">
          ${count >= 2 ? usedSpecTable(cars) : emptyState}

          <div class="cmp-picker-panel" id="ucmp-picker">
            <div class="cmp-picker-hd">
              <div>
                <div class="cmp-picker-title">Add used cars to compare</div>
                <div class="cmp-picker-sub">Tap to add or remove · Max ${CMP_MAX} cars</div>
              </div>
              <div class="cmp-search-wrap">
                <svg class="cmp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="search" id="ucmp-search" placeholder="Search brand or model…" oninput="AV.usedCmpSearch(this.value)" autocomplete="off">
              </div>
            </div>
            <div class="cmp-picker-grid" id="ucmp-picker-grid">${pickerItems}</div>
          </div>
        </div>`;

      history.pushState({ page: 'compare-used' }, '', '#compare-used');
      if (count < 2) setTimeout(() => window._initCompareAnimation?.(), 50);
      lucide.createIcons();
      if (count >= 2) setTimeout(() => AV.cmpTab('overview', document.querySelector('.cmp-tab')), 10);
    }

    function toggleOverviewSpecs(btn) {
      const rows = document.querySelectorAll('.ucmp-overview-hidden');
      if (!rows.length) return;
      const isHidden = rows[0].style.display === 'none';
      rows.forEach(r => {
        if (isHidden) {
          r.style.display = r.tagName === 'TR' ? 'table-row' : 'flex';
        } else {
          r.style.display = 'none';
        }
      });
      // Toggle button text for all View More buttons in overview
      const btns = document.querySelectorAll('.cmp-view-more-btn');
      btns.forEach(b => {
        b.textContent = isHidden ? 'View Less Specs' : 'View More Specs';
      });
    }

    function cmpTab(id, btn) {
      document.querySelectorAll('.cmp-tab').forEach(t => t.classList.toggle('active', t.dataset.cmpTab === id));
      
      const overviewBtn = document.querySelector('.cmp-view-more-btn');
      const isOverviewExpanded = overviewBtn ? (overviewBtn.textContent.includes('Less')) : false;

      document.querySelectorAll('[data-cmp-group]').forEach(el => {
        if (el.dataset.cmpGroup === id) {
          if (id === 'overview' && el.classList.contains('ucmp-overview-hidden') && !isOverviewExpanded) {
            el.style.display = 'none';
          } else {
            el.style.display = '';
          }
        } else {
          el.style.display = 'none';
        }
      });
      if (btn) btn.classList.add('active');
    }

    function cmpMode(id, btn) {
      cmpActiveMode = id;
      document.querySelectorAll('.cmp-mode-tab').forEach(t => t.classList.toggle('active', t.dataset.cmpMode === id));
      cmpApplyFilters();
      /* Re-render the table section with the new mode's rows */
      const cols = compareList.slice(0, CMP_MAX);
      const cars = cols.map(s => carBySlug(s)).filter(Boolean);
      const tableWrap = document.querySelector('.cmp-page');
      if (tableWrap && cars.length >= 2) {
        const verdictEl = tableWrap.querySelector('.cmp-verdict');
        const tableStart = tableWrap.querySelector('.cmp-mode-tabs');
        if (tableStart) {
          /* replace everything from mode-tabs onwards (but keep picker) */
          const picker = tableWrap.querySelector('.cmp-picker-panel');
          const newTable = renderCmpTable(cols);
          /* Remove old table content, keep verdict and picker */
          let el = tableStart;
          while (el && el !== picker) {
            const next = el.nextElementSibling;
            el.remove();
            el = next;
          }
          const tmp = document.createElement('div');
          tmp.innerHTML = newTable;
          while (tmp.firstChild) tableWrap.insertBefore(tmp.firstChild, picker);
        } else {
          /* Fallback: full re-render */
          renderCompare();
          return;
        }
      }
      /* Re-activate first spec tab */
      const firstTab = document.querySelector('.cmp-tab');
      if (firstTab) AV.cmpTab(firstTab.dataset.cmpTab, firstTab);
    }

    function cmpApplyFilters() {
      const query = (document.getElementById('cmp-search')?.value || '').toLowerCase().trim();
      document.querySelectorAll('.cmp-car-pick').forEach(el => {
        const matchSearch = !query || (el.dataset.cmpSearch || '').includes(query);
        const matchCondition = cmpActiveCondition === 'all' || el.dataset.cmpCondition === cmpActiveCondition;
        
        const fuel = el.dataset.cmpFuel || '';
        const isIce = fuel === 'petrol' || fuel === 'diesel' || fuel === 'cng';
        const isEv = fuel === 'ev' || fuel === 'electric';
        const isHybrid = fuel === 'hybrid' || fuel === 'phev';

        let matchMode = true;
        if (cmpActiveMode === 'ice_ice') matchMode = isIce;
        else if (cmpActiveMode === 'ice_ev') matchMode = isIce || isEv;
        else if (cmpActiveMode === 'ev_ev') matchMode = isEv;
        else if (cmpActiveMode === 'ev_hybrid') matchMode = isEv || isHybrid;
        else if (cmpActiveMode === 'ice_hybrid') matchMode = isIce || isHybrid;

        el.classList.toggle('hidden', !(matchSearch && matchCondition && matchMode));
      });
    }

    function cmpSearch(q) {
      cmpApplyFilters();
    }

    function cmpFilterCondition(val, btn) {
      cmpActiveCondition = val;
      document.querySelectorAll('[data-cmp-filter-condition]').forEach(b => b.classList.toggle('active', b === btn));
      cmpApplyFilters();
    }

    function usedCmpSearch(q) {
      const query = (q || '').toLowerCase().trim();
      document.querySelectorAll('#ucmp-picker-grid .cmp-car-pick').forEach(el => {
        el.classList.toggle('hidden', !(!query || (el.dataset.cmpSearch || '').includes(query)));
      });
    }

    /* ─ SERVICES ─ */
    function renderServices() {
      clearInterval(heroTimer);
      document.title = 'Services — AutoViindu';
      setNav('services');
      const svcs = [
        { id: 'cosmetic', name: 'Cosmetic Car Care', color: '#1a6b2a', bg: '#eef7f0', icon: '<i data-lucide="sparkles"></i>', items: ['Basic Washing & Cleaning', 'Interior Vacuum & Polish', 'Paint Protection Film (PPF)', 'Scratch & Dent Correction', 'Headlight Restoration', 'Underbody Anti-Rust Coating', 'Alloy & Tyre Shine', 'Engine Bay Cleaning', 'Ceramic Coating (9H)', 'Odour & Sanitization', 'Nano-coating Application', 'Full Body Detailing'] },
        { id: 'workshop', name: 'Workshop Services', color: '#b8900e', bg: '#fdf6e0', icon: '<i data-lucide="wrench"></i>', items: ['Wiring & Electrical Diagnosis', 'Hybrid / EV Electrical Work', 'Sensor / ECU Troubleshooting', 'Transmission Repair', 'Air Conditioning Overhaul', 'Body Work & Panel Repair', 'Wheel Alignment & Balancing', 'Suspension Inspection', 'Software Updates & Calibration', 'Brake Inspection & Service', 'Engine Tune-up', 'Pre-purchase Inspection'] },
        { id: 'telematics', name: 'Telematics & GPS', color: '#1a4db8', bg: '#eef3fc', icon: '<i data-lucide="radio"></i>', items: ['GPS Tracking Units', 'Remote Immobilizer Systems', 'Geo-fencing & Alerts', 'OBD Plug Diagnostics', 'Dashcam & Security Kits', 'Fuel Monitoring Sensors', 'TPMS Installation', 'Fleet Management Solutions'] },
        { id: 'roadside', name: 'Roadside Assistance', color: '#d63031', bg: '#fff0ef', icon: '<i data-lucide="bell-ring"></i>', items: ['Emergency Towing', 'Battery Jumpstart', 'Flat Tyre Change', 'Emergency Fuel Delivery', 'Lock-Out Service', 'Minor Mechanical Help', '24/7 SOS Support'] },
      ];
      document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:var(--ink-3)">Services</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:var(--ink);font-weight:700;margin-bottom:6px">Our Services</h1>
      <div style="font-size:13px;color:var(--ink-3)">Complete automotive care from our Kathmandu centre</div>
    </div>
  </div>
  <div style="background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:var(--nav);z-index:40;overflow-x:auto;scrollbar-width:none">
    <div class="wrap" style="display:flex;gap:7px;padding:10px 0;white-space:nowrap">
      ${svcs.map(s => `<a href="#svc-${s.id}" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border:1.5px solid ${s.color}22;border-radius:var(--pill);font-size:12.5px;font-weight:700;color:${s.color};background:${s.bg};flex-shrink:0">${s.icon} ${s.name}</a>`).join('')}
    </div>
  </div>
  <div class="wrap" style="padding-top:32px;padding-bottom:64px">
    ${svcs.map(s => `
    <section id="svc-${s.id}" style="margin-bottom:52px;scroll-margin-top:calc(var(--nav) + 52px)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:${s.color};margin-bottom:6px">${s.items.length} services</div>
          <h2 style="font-family:var(--font-d);font-size:24px;font-weight:700;color:var(--ink)">${s.icon} ${s.name}</h2>
        </div>
        <button onclick="document.getElementById('svc-form-${s.id}').scrollIntoView({behavior:'smooth'})" 
        style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:${s.color};color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-b);font-size:13px;font-weight:700;cursor:pointer">
  <i data-lucide="calendar" style="width:16px;height:16px;"></i>
  Book Now
</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:24px">
        ${s.items.map(item => `<div style="display:flex;align-items:flex-start;gap:9px;padding:12px 14px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--r10);cursor:pointer;transition:all var(--ease)" onmouseenter="this.style.borderColor='${s.color}';this.style.background='${s.bg}'" onmouseleave="this.style.borderColor='var(--border)';this.style.background='var(--white)'">
          <div style="width:7px;height:7px;background:${s.color};border-radius:50%;flex-shrink:0;margin-top:4px"></div>
          <span style="font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.4">${item}</span>
        </div>`).join('')}
      </div>
      <div id="svc-form-${s.id}" style="background:var(--white);border:1px solid var(--border);border-left:3px solid ${s.color};border-radius:var(--r16);padding:22px;box-shadow:var(--sh1)">
        <div style="font-family:var(--font-d);font-size:19px;font-weight:700;color:${s.color};margin-bottom:4px">Book ${s.name}</div>
        <div style="font-size:13px;color:var(--ink4);margin-bottom:18px">We'll confirm within 2 hours</div>
        <div id="form-ok-${s.id}" style="display:none;background:var(--g-ll);border:1.5px solid rgba(26,107,42,.22);border-radius:var(--r12);padding:20px;text-align:center">
          <div style="font-size:32px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
  <i data-lucide="check" stroke-width="2.5"></i>
</div>
          <div style="font-size:16px;font-weight:800;color:var(--g3);margin-bottom:4px">Booking Request Received!</div>
          <div style="font-size:13px;color:var(--ink3)">We'll call you within 2 hours to confirm.</div>
        </div>
        <form onsubmit="AV.submitForm(event,'${s.id}')" id="form-${s.id}" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Name *</label><input class="sw-input" type="text" name="fullName" placeholder="Full name" required style="padding:10px 12px"></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Phone *</label><input class="sw-input" type="tel" name="phone" placeholder="+977 98XXXXXXXX" required style="padding:10px 12px"></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Vehicle Brand</label><select class="sw-select" name="brand" style="padding:10px 28px 10px 12px"><option value="">Select brand</option>${['Toyota', 'Honda', 'Hyundai', 'Kia', 'Suzuki', 'MG', 'BYD', 'BMW', 'Other'].map(b => `<option>${b}</option>`).join('')}</select></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Service</label><select class="sw-select" name="service" style="padding:10px 28px 10px 12px"><option value="">Select service</option>${s.items.map(i => `<option>${i}</option>`).join('')}</select></div>
          <div style="grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:4px">
           <div style="font-size:11.5px;color:var(--ink4);display:flex;align-items:center;gap:4px;">
  <i data-lucide="lock" style="width:12px;height:12px;"></i>
  Your info is private & secure
</div> 
       <button type="submit" 
        style="display:inline-flex;align-items:center;gap:4px;padding:11px 26px;background:${s.color};color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-b);font-size:14px;font-weight:700;cursor:pointer">
  <i data-lucide="calendar" style="width:16px;height:16px;"></i>
  Book Appointment
</button>
          </div>
        </form>
      </div>
      <div style="height:1px;background:var(--border);margin-top:48px"></div>
    </section>`).join('')}
  </div>`;
    }
    function submitForm(e, id) {
      e.preventDefault();
      const form = document.getElementById(`form-${id}`);
      const ok = document.getElementById(`form-ok-${id}`);

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.formId = id;

      fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(() => {
        if (form) form.style.display = 'none';
        if (ok) ok.style.display = 'block';
        toast('Booking submitted!', 'success');
      }).catch(err => console.error(err));
    }


    /* ─ USED ─ */

    /* ── USED LISTING PAGE ── */
    function renderUsed(opts) {
      opts = opts || {};
      clearInterval(heroTimer);
      document.title = 'Used Cars — AutoViindu';
      setNav('used');

      const maxSlider = _usedMaxPrice;
      let initialSort = opts.sort || '';
      if (opts.filter === 'lowest_km') initialSort = 'km-asc';
      else if (opts.filter === 'year') initialSort = 'year-desc';
      else if (opts.filter === 'price') initialSort = 'price-asc';

      let initQ = opts.q || '';

      window._uf = {
        q: initQ,
        brands: opts.brand ? [opts.brand] : [],
        models: [],
        fuels: opts.fuel ? [opts.fuel] : [],
        bodies: opts.body ? [opts.body] : [],
        transmissions: [],
        transmissionsSub: [],
        drivetrains: [],
        years: [],
        minP: 0,
        maxP: maxSlider,
        sort: opts.sort || initialSort,
        budget: opts.budget || '',
        certified: opts.certified || (opts.filter === 'certified'),
        owners: [],
        mileage: [],
        _maxSlider: maxSlider,
        _priceKey: 'priceNum',
        explore: opts.explore
      };
      const uf = window._uf;
      const allBrands = ['Audi', 'BMW', 'BYD', 'Chery', 'Deepal', 'Ford', 'Geely', 'Haval', 'Honda', 'Hyundai', 'Kia', 'Lexus', 'Mahindra', 'Maruti Suzuki', 'Maxus', 'Mazda', 'Mercedes', 'MG', 'Nissan', 'Proton', 'Renault', 'Skoda', 'Suzuki', 'Tata', 'Toyota', 'Volkswagen'];
      const allYears = [...new Set(USED.map(c => c.year))].sort((a, b) => b - a);
      const allModels = [...new Set(USED.map(c => c.model))].sort();
      const allBodies = ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'MPV', 'Off-road', 'Microcar', 'Wagon'];
      const usedBudgetPills = [['u20', 'Under 20L'], ['u40', 'Under 40L'], ['u60', 'Under 60L'], ['u100', 'Under 1Cr']];

      const acc = (title, content, open = false) => `
        <div class="av-acc ${open ? 'open' : ''}">
          <button class="av-acc-head" type="button" onclick="AV.filterAccord(this)">
            <span>${title}</span>
            <svg class="av-acc-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="av-acc-body"><div class="av-acc-body-inner">${content}</div></div>
        </div>`;

      document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
  <div class="wrap">
    <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.75)">Used Cars</span></div>
    <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:var(--ink);font-weight:700;margin-bottom:6px">Used cars near me for sale</h1>
    <div style="font-size:13px;color:var(--ink-3)">${USED.length} verified vehicles · Full inspection reports</div>
  </div>
</div>

<div class="wrap" style="padding-top:24px;">
  <div style="background:linear-gradient(135deg, #0F1B12 0%, #16241A 45%, #1a2e1e 100%); border-radius:var(--r20); padding:40px; box-shadow:var(--sh-lg); margin-bottom:12px; color:white; overflow:hidden; position:relative; border:1px solid rgba(255,255,255,.06);">

    <!-- ambient glow -->
    <div style="position:absolute; top:-60px; right:-40px; width:260px; height:260px; background:var(--green); filter:blur(90px); opacity:0.25; border-radius:50%; pointer-events:none;"></div>
    <div style="position:absolute; bottom:-80px; left:-40px; width:220px; height:220px; background:var(--green-m,var(--green)); filter:blur(100px); opacity:0.12; border-radius:50%; pointer-events:none;"></div>

    <div style="max-width:820px; position:relative; z-index:1;">

      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:18px;">
        <span style="display:inline-flex; align-items:center; gap:6px; padding:5px 13px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,.15); border-radius:999px; font-size:11.5px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:var(--green-l);">
          <i data-lucide="shield-check" style="width:13px;height:13px"></i>
          Autoviindu Certified
        </span>
        <span style="display:inline-flex; align-items:center; gap:6px; padding:5px 12px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:999px; font-size:11.5px; font-weight:700; color:rgba(255,255,255,.65);">
          <i data-lucide="gauge" style="width:12px;height:12px;color:var(--green-l)"></i>
          ACS Score on every listing
        </span>
      </div>

      <h2 style="font-family:var(--font-d); font-size:clamp(24px, 4vw, 32px); font-weight:800; margin-bottom:14px; line-height:1.2;">
        Every Car, Inspected &amp; Verified.
      </h2>

      <p style="font-size:15.5px; line-height:1.7; color:rgba(255,255,255,0.65); margin-bottom:28px; max-width:640px;">
        We don't just list cars; we verify them. Every used car on Autoviindu undergoes a rigorous
        <strong style="color:#fff;">140-point physical inspection</strong> and a real-world test drive.
        We grade them transparently and generate a definitive
        <strong style="color:#fff;">Autoviindu Condition Score (ACS)</strong> so you know exactly what you're buying.
      </p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(190px, 1fr)); gap:14px; margin-bottom:26px;">

        <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:18px; transition:border-color .2s, background .2s;"
             onmouseover="this.style.borderColor='rgba(76,175,106,.4)';this.style.background='rgba(255,255,255,.06)'"
             onmouseout="this.style.borderColor='rgba(255,255,255,.08)';this.style.background='rgba(255,255,255,.04)'">
          <div style="width:34px;height:34px;border-radius:10px;background:rgba(76,175,106,.15);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <i data-lucide="search-check" style="width:17px;height:17px;color:var(--green-m,var(--green-l))"></i>
          </div>
          <div style="font-size:13.5px; font-weight:800; margin-bottom:4px;">140-Point Check</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.55); line-height:1.55;">Engine, exterior, electricals, and more.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:18px; transition:border-color .2s, background .2s;"
             onmouseover="this.style.borderColor='rgba(76,175,106,.4)';this.style.background='rgba(255,255,255,.06)'"
             onmouseout="this.style.borderColor='rgba(255,255,255,.08)';this.style.background='rgba(255,255,255,.04)'">
          <div style="width:34px;height:34px;border-radius:10px;background:rgba(76,175,106,.15);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <i data-lucide="car-front" style="width:17px;height:17px;color:var(--green-m,var(--green-l))"></i>
          </div>
          <div style="font-size:13.5px; font-weight:800; margin-bottom:4px;">Test Driven</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.55); line-height:1.55;">Scored on driving comfort &amp; noise.</div>
        </div>

        <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:18px; transition:border-color .2s, background .2s;"
             onmouseover="this.style.borderColor='rgba(76,175,106,.4)';this.style.background='rgba(255,255,255,.06)'"
             onmouseout="this.style.borderColor='rgba(255,255,255,.08)';this.style.background='rgba(255,255,255,.04)'">
          <div style="width:34px;height:34px;border-radius:10px;background:rgba(76,175,106,.15);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <i data-lucide="file-clock" style="width:17px;height:17px;color:var(--green-m,var(--green-l))"></i>
          </div>
          <div style="font-size:13.5px; font-weight:800; margin-bottom:4px;">History Report</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.55); line-height:1.55;">Accident records &amp; authorized service logs.</div>
        </div>
      </div>

      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; padding-top:20px; border-top:1px solid rgba(255,255,255,.08);">
        <p style="font-size:12.5px; color:rgba(255,255,255,0.45); line-height:1.6; margin:0; max-width:480px;">
          <i data-lucide="info" style="width:11px;height:11px;vertical-align:-1px;margin-right:3px"></i>
          Service history is verified directly from authorized centers for cars under warranty. For older cars, our detailed ACS rating remains your most reliable guide.
        </p>
      </div>

    </div>
  </div>
</div>
  <div class="lf-page-wrap wrap">
    <div class="lf-overlay" id="uf-overlay" onclick="AV.ufMobileToggle()"></div>
    <aside class="lf-sidebar" id="uf-sidebar">
      <div class="lf-sidebar-inner">
        <div class="lf-sf-hd"><span>Filters</span><button class="lf-clear-btn" type="button" onclick="AV.ufClear()">Clear all</button></div>
        ${acc('Price Range', `
          <div class="lf-price-vals"><span id="uf-lo-val">Rs. 0L</span><span id="uf-hi-val">Rs. ${maxSlider}L</span></div>
          <div class="lf-price-track">
            <input type="range" id="uf-price-lo" class="lf-range" min="0" max="${maxSlider}" step="1" value="0" oninput="AV.ufPrice()">
            <input type="range" id="uf-price-hi" class="lf-range" min="0" max="${maxSlider}" step="1" value="${maxSlider}" oninput="AV.ufPrice()">
          </div>
          <div class="lf-budget-pills">${usedBudgetPills.map(([v, l]) => `<button type="button" class="sf-budget-btn uf-budget-btn" onclick="AV.ufBudget('${v}',this)">${l}</button>`).join('')}</div>
        `)}
        ${acc('Year', `
          <select class="lf-sort-sel" style="width: 100%; margin-bottom:10px;" onchange="AV.yearFilterSelect(this.value, 'uf')">
            <option value="">All Years</option>
            ${allYears.map(y => `<option value="${y}" ${uf.years.includes(y) ? 'selected' : ''}>${y}</option>`).join('')}
          </select>
        `)}
        ${acc('Transmission', `
          <div class="lf-pill-grid" style="margin-bottom:12px;">${['Manual', 'Automatic'].map(t => _pillRow(uf, 'transmissions', t, t, 'uf')).join('')}</div>
          <div style="font-size:12px; font-weight:700; color:var(--ink-4); margin-bottom:8px;"></div>
          <div class="lf-cb-list lf-cb-scroll">
            ${[
              ['AMT', 'AMT (Automated Manual)', 'Automatic'],
              ['iMT', 'iMT (Intelligent Manual)', 'Manual'],
              ['CVT', 'CVT (Continuously Variable)', 'Automatic'],
              ['Regular (manual)', 'Regular (manual)', 'Manual'],
              ['TC', 'TC (Torque Converter)', 'Automatic'],
              ['DCT', 'DCT (Dual-Clutch)', 'Automatic'],
              ['eCVT / DHT', 'eCVT / DHT (Hybrid)', 'Automatic'],
              ['MCT', 'MCT (Multi-Clutch)', 'Automatic'],
              ['Semi-Automatic / Sequential Manual', 'Semi-Automatic / Sequential', 'Automatic'],
              ['Single-Speed Direct Drive', 'Single-Speed Direct Drive (EV)', 'Automatic']
            ].map(([val, label]) => _cbRow(uf, 'transmissionsSub', val, label, 'uf')).join('')}
          </div>
        `)}
        ${acc('Mileage / Range', `
          <div class="lf-cb-list">
            ${['Under 15 km/l', '15 - 20 km/l', 'Over 20 km/l', 'EV Range < 300km', 'EV Range 300-400km', 'EV Range > 400km'].map(v => _cbRow(uf, 'mileage', v, v, 'uf')).join('')}
          </div>
        `)}
        ${acc('Drivetrain', `
          <div class="lf-cb-list">
            ${[
              ['FWD', 'FWD (Front-Wheel Drive)'],
              ['RWD', 'RWD (Rear-Wheel Drive)'],
              ['AWD', 'AWD (All-Wheel Drive)'],
              ['4x4', '4x4 / 4WD']
            ].map(([val, label]) => _cbRow(uf, 'drivetrains', val, label, 'uf')).join('')}
          </div>
        `)}
        ${acc('Brand', `
          <div style="margin-bottom:10px;"><input type="text" placeholder="Search brand (e.g. Suzuki)" oninput="AV.filterBrand(this.value, 'uf')" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:13px;outline:none;" /></div>
          <div class="lf-cb-list lf-cb-scroll uf-brand-list">${allBrands.map(b => _cbRow(uf, 'brands', b, b, 'uf')).join('')}</div>
        `)}
        ${acc('Fuel Type', `
          <div class="lf-cb-list">${['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(f => _cbRow(uf, 'fuels', f, f, 'uf')).join('')}</div>
        `)}
        ${acc('Body Type', `
          <div class="lf-cb-list lf-cb-scroll">${allBodies.map(b => _cbRow(uf, 'bodies', b, b, 'uf')).join('')}</div>
        `)}
        ${acc('Owners', `
          <div class="lf-cb-list">
            ${['1', '2', '3', '4'].map(o => _cbRow(uf, 'owners', o, o + (o === '1' ? ' Owner' : ' Owners'), 'uf')).join('')}
          </div>
        `)}
      </div>
    </aside>
    <div class="lf-main">
      <div class="lf-toolbar">
        <button class="lf-filter-mob-btn" type="button" onclick="AV.ufMobileToggle()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filters <span class="lf-badge" id="uf-badge" style="display:none"></span>
        </button>
        <div class="lf-search-wrap" style="flex:1; padding:0; background:transparent; border:none; box-shadow:none;">
          <div class="lf-horizontal-search" style="display:flex; width:100%; align-items:center; border:1px solid var(--border); border-radius:8px; background:var(--bg); overflow:hidden; height:40px;">
            <div style="display:flex; align-items:center; padding-left:10px; color:var(--ink4);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input type="text" placeholder="Search keywords..." value="${initQ}" oninput="AV.ufSearch(this.value)" style="flex:1.2; border:none; background:transparent; padding:0 10px; font-size:13.5px; color:var(--ink); outline:none; border-right:1px solid var(--border); min-width:0;">
            <select id="hs-brand" onchange="AV.ufSetHorizontal('brand', this.value)" style="flex:1; border:none; background:transparent; padding:0 10px; font-size:13.5px; color:var(--ink); outline:none; border-right:1px solid var(--border); cursor:pointer; min-width:0;">
              <option value="">Brand</option>
              ${allBrands.map(b => `<option value="${b}" ${uf.brands.includes(b)?'selected':''}>${b}</option>`).join('')}
            </select>
            <select id="hs-year" onchange="AV.ufSetHorizontal('year', this.value)" style="flex:0.7; border:none; background:transparent; padding:0 10px; font-size:13.5px; color:var(--ink); outline:none; border-right:1px solid var(--border); cursor:pointer; min-width:0;">
              <option value="">Year</option>
              ${allYears.map(y => `<option value="${y}" ${uf.years.includes(y)?'selected':''}>${y}</option>`).join('')}
            </select>
            
            <select id="hs-price" onchange="AV.ufSetHorizontalBudget(this.value)" style="flex:0.8; border:none; background:transparent; padding:0 10px; font-size:13.5px; color:var(--ink); outline:none; cursor:pointer; min-width:0;">
              <option value="">Price</option>
              ${usedBudgetPills.map(([v,l]) => `<option value="${v}" ${uf.budget===v?'selected':''}>${l}</option>`).join('')}
            </select>
            <button type="button" onclick="AV.ufApply()" style="width:44px; height:40px; background:var(--green); border:none; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
        <select id="uf-sort" class="lf-sort-sel" onchange="AV.ufSort(this.value)">
          <option value="" ${initialSort === '' ? 'selected' : ''}>Sort: Relevance</option>
          <option value="price-asc" ${initialSort === 'price-asc' ? 'selected' : ''}>Price: Low \u2192 High</option>
          <option value="price-desc" ${initialSort === 'price-desc' ? 'selected' : ''}>Price: High \u2192 Low</option>
          <option value="km-asc" ${initialSort === 'km-asc' ? 'selected' : ''}>Lowest KM</option>
          <option value="year-desc" ${initialSort === 'year-desc' ? 'selected' : ''}>Newest Year</option>
        </select>
      </div>
      <div class="lf-active-tags" id="uf-active-tags" style="display:none"></div>
      <div class="lf-result-bar">Showing <strong id="used-count">0</strong> cars <span style="color:var(--ink4);font-size:12px">\u00b7 All prices negotiable</span></div>
      <div id="uf-explore" style="display:none">${getUsedCarsExploreHTML()}</div>
      <div class="used-grid" id="used-grid"></div>
      <div id="uf-empty" class="lf-empty-state" style="display:none">
        <div class="lf-empty-icon">\ud83d\udd0d</div>
        <div class="lf-empty-title">No used cars match your filters</div>
        <div class="lf-empty-sub">Try widening price range or year</div>
        <button type="button" onclick="AV.ufClear()" class="btn btn-primary">Clear Filters</button>
      </div>
      <div class="uc-sell-cta">
        <div class="uc-sell-cta-in">
          <div>
            <div class="uc-sell-eyebrow">Sell your car</div>
            <div class="uc-sell-title">Know your car's true worth</div>
            <div class="uc-sell-sub">Free valuation \u00b7 Physical Inspection \u00b7 End to End Hassle-free process</div>
          </div>
          <button type="button" onclick="window.location.href='/sellyourcar'" class="btn btn-primary">Get Started  →</button>
        </div>
      </div>
    </div>
  </div>`;
      _bindFilterSidebar('uf', _ufApply);
      _ufApply();
    }

    /* ── USED CAR INQUIRY MODAL (standalone – works from any page) ── */
    function ensureUsedInquiryModal() {
      if (document.getElementById('av-ui-overlay')) return;
      const uiWrap = document.createElement('div');
      uiWrap.innerHTML = `
<div class="av-modal-overlay" id="av-ui-overlay" onclick="if(event.target===this)AV.closeUsedInquiryModal()">
  <div class="av-modal-box">
    <div class="av-modal-head simple-head">
      <button type="button" class="simple-head-back" onclick="AV.closeUsedInquiryModal()" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="simple-head-title">Inquire About This Car</div>
      <div class="simple-head-badge" id="ui-car-badge" style="background:#fff8ec;color:#B8720F;border-color:#fde68a">Loading...</div>
    </div>
    <div class="av-modal-body" id="ui-body-wrap" style="overflow-y:auto;max-height:62vh;padding:22px 20px 4px">
      <form id="ui-form" onsubmit="AV.submitUsedInquiry(event)">
        <div class="pill-group">
          <input type="text" class="pill-inp" id="ui-name" placeholder="Full name" required>
        </div>
        <div class="pill-row">
          <div class="pill-group">
            <input type="tel" class="pill-inp" id="ui-phone" placeholder="Phone number" required>
          </div>
          <div class="pill-group">
            <input type="email" class="pill-inp" id="ui-email" placeholder="Email address" required>
          </div>
        </div>
        <div class="pill-group">
          <select class="pill-inp pill-select" id="ui-city" required>
            <option value="" disabled selected>City</option>
            <option>Kathmandu</option><option>Lalitpur</option><option>Bhaktapur</option>
            <option>Pokhara</option><option>Biratnagar</option><option>Birgunj</option>
            <option>Dharan</option><option>Butwal</option><option>Chitwan</option>
            <option>Nepalgunj</option><option>Other</option>
          </select>
        </div>
        <div class="pill-group">
          <textarea class="pill-inp pill-textarea" id="ui-msg" placeholder="e.g. Is the price negotiable? Can I schedule an inspection?" required></textarea>
        </div>
        <div style="margin:6px 0 20px">
          <button type="submit" class="pill-submit" id="ui-submit-btn" style="background:linear-gradient(135deg,#B8720F,#D98A16)">Send Inquiry</button>
        </div>
      </form>
    </div>
    <div class="av-modal-success cute-success" id="ui-success-wrap" style="display:none">
      <div class="success-icon-pop" style="background:#fff8ec;border-color:#B8720F;color:#B8720F">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="av-success-title" style="font-size:17px;font-weight:800;color:var(--ink);margin-bottom:8px">Inquiry Sent! 🚙</div>
      <div class="av-success-sub" style="font-size:13px;color:var(--ink4);margin-bottom:16px">Our team will get back to you shortly with all the details.</div>
      <button type="button" class="pill-submit" onclick="AV.closeUsedInquiryModal()" style="max-width:160px;margin:0 auto;background:linear-gradient(135deg,#B8720F,#D98A16)">Done</button>
    </div>
  </div>
</div>`;
      document.body.appendChild(uiWrap.firstElementChild || uiWrap.firstChild);
    }

    AV.openUsedInquiryModal = function (carId) {
      ensureUsedInquiryModal();
      const usedList = window.USED_CARS_DB || [];
      const car = usedList.find(c => c.id === carId || c.id === String(carId));
      AV._usedInquiryCar = car;
      AV._usedInquiryCarId = carId;

      const badge = document.getElementById('ui-car-badge');
      if (badge && car) {
        badge.textContent = car.brand + ' ' + car.model + ' ' + car.year;
      } else if (badge) {
        badge.textContent = 'Used Vehicle';
      }

      // Reset form
      const form = document.getElementById('ui-form');
      if (form) form.reset();
      const bw = document.getElementById('ui-body-wrap');
      const sw = document.getElementById('ui-success-wrap');
      if (bw) bw.style.display = 'block';
      if (sw) sw.style.display = 'none';
      const btn = document.getElementById('ui-submit-btn');
      if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }

      const ov = document.getElementById('av-ui-overlay');
      if (ov) {
        ov.style.display = 'flex';
        requestAnimationFrame(() => ov.classList.add('open', 'show'));
        document.body.style.overflow = 'hidden';
      }
    };

    AV.closeUsedInquiryModal = function () {
      const ov = document.getElementById('av-ui-overlay');
      if (ov) {
        ov.classList.remove('open', 'show');
        setTimeout(() => { ov.style.display = 'none'; }, 200);
      }
      document.body.style.overflow = '';
    };

    AV.submitUsedInquiry = function (e) {
      if (e) e.preventDefault();
      const name = document.getElementById('ui-name');
      const phone = document.getElementById('ui-phone');
      const email = document.getElementById('ui-email');
      const city = document.getElementById('ui-city');
      const msg = document.getElementById('ui-msg');

      if (!name || !name.value.trim()) { name && name.focus(); alert('Please enter your full name.'); return; }
      if (!phone || !phone.value.trim()) { phone && phone.focus(); alert('Please enter your phone number.'); return; }
      if (!email || !email.value.trim()) { email && email.focus(); alert('Please enter your email address.'); return; }
      if (!city || !city.value) { city && city.focus(); alert('Please select your city.'); return; }
      if (!msg || !msg.value.trim()) { msg && msg.focus(); alert('Please enter your message.'); return; }

      const btn = document.getElementById('ui-submit-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

      const car = AV._usedInquiryCar;
      const carName = car ? (car.brand + ' ' + car.model + ' ' + car.year) : 'Used Vehicle';

      fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'usedCarInquiry',
          formId: 'usedCarInquiry',
          carModel: carName,
          carId: AV._usedInquiryCarId,
          name: name.value.trim(),
          phone: phone.value.trim(),
          email: email.value.trim(),
          city: city.value,
          message: msg.value.trim(),
          timestamp: new Date().toISOString()
        })
      }).then(() => {
        const bw = document.getElementById('ui-body-wrap'); if (bw) bw.style.display = 'none';
        const sw = document.getElementById('ui-success-wrap'); if (sw) sw.style.display = 'block';
      }).catch(() => {
        if (btn) { btn.disabled = false; btn.textContent = 'Send Inquiry'; }
        alert('Submission failed. Please call us directly: +977-9828364940');
      });
    };

    /* ── USED DETAIL PAGE ── */
    function renderUsedDetail(id) {
      const db = window.USED_CARS_DB || [];
      const car = db.find(c => String(c.id) === String(id) || c.slug === id || c.id === id);
      if (!car) { renderUsed(); return }

      /* ── Ensure all required properties exist with safe defaults ── */
      if (!car.seller) car.seller = { name: 'AutoViindu', verified: true, sold: 0, rating: 4.2, phone: ['9828364940'] };
      if (!car.inspection) car.inspection = [
        { label: 'Engine', status: 'Inspection pending', ok: true },
        { label: 'Transmission', status: 'Inspection pending', ok: true },
        { label: 'Brakes', status: 'Inspection pending', ok: true },
        { label: 'AC System', status: 'Inspection pending', ok: true },
        { label: 'Body & Paint', status: 'Inspection pending', ok: true },
        { label: 'Tyres', status: 'Inspection pending', ok: true },
        { label: 'Suspension', status: 'Inspection pending', ok: true },
        { label: 'Electrical', status: 'Inspection pending', ok: true }
      ];
      if (!car.features) car.features = car.tags || car.highlights || [];
      if (!car.meta) car.meta = {};
      if (!car.overview) car.overview = `${car.brand} ${car.model} ${car.year} — available at AutoViindu.`;
      if (!car.highlights) car.highlights = (car.features || []).slice(0, 4);
      if (!car.specs) car.specs = {};
      if (!car.video) car.video = '';
      if (!car.km) car.km = '0';
      if (!car.color) car.color = 'Standard';
      if (!car.body) car.body = 'Sedan';
      if (!car.variant) car.variant = '';
      if (!car.rating) car.rating = 4.2;
      if (!car.reviews) car.reviews = 0;
      if (!car.emiEst) car.emiEst = car.priceNum ? Math.round(car.priceNum / 60) : 0;
      if (!car.images) car.images = car.img ? [car.img] : [];

      clearInterval(heroTimer);
      document.title = `${car.brand} ${car.model} ${car.year} — AutoViindu`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setNav('used');

      const Rs = n => n >= 100000 ? `Rs. ${(n / 100000).toFixed(2)}L` : `Rs. ${n.toLocaleString()}`;
      window.Rs = Rs;
      const calcEMI = (p, ar, m) => { const r = ar / 12 / 100; return r === 0 ? p / m : p * (r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1) };
      const checkIcon = (ok) => ok
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

      let galIdx = 0;
      const imgs = car.images || [car.img];

      /* ── SVG icon paths ── */
      const _P = {
        cal: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
        fuel: `<path d="M3 22V6l4-4h6l4 4v16"/><path d="M9 22V12h6v10"/><rect x="17" y="10" width="4" height="4"/>`,
        pow: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
        body: `<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><line x1="5" y1="12" x2="19" y2="12"/>`,
        sts: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
        box: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
        list: `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,
        feat: `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
        chk: `<polyline points="20 6 9 17 4 12"/>`,
        chev: `<polyline points="6 9 12 15 18 9"/>`,
        ph: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.84-1.84a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>`,
        calc: `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>`,
        gauge: `<path d="M4 12a8 8 0 0 1 16 0"/><path d="M12 12l4-4"/><circle cx="12" cy="12" r="1"/>`,
        gear: `<circle cx="12" cy="12" r="3"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2M7.05 7.05l1.41 1.41M15.54 15.54l1.41 1.41M7.05 16.95l1.41-1.41M15.54 8.46l1.41-1.41"/>`,
        wrench: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
        shield: `<path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z"/>`,
      };
      const svgI = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${_P[k]}</svg>`;

      const ICON_FOR_UC_LABEL = {
        'Body Type': 'body',
        'Powertrain': 'pow',
        'Ground Clearance': 'box',
        'Mileage/Range (Real-World)': 'gauge',
        'Odometer Reading (km)': 'gauge',
        'Fuel Type': 'fuel',
        'Transmission': 'gear',
        'Drivetrain': 'gear',
        'Seating Capacity': 'sts',
        'Boot Space (Liters)': 'box',
        'Service History': 'wrench',
        'Number of Owners': 'sts',
        'Accident History': 'shield',
        'Condition Grade (A/B/C/D)': 'shield',
      };
      const iconForUcCell = lbl => lbl === 'Safety Rating' ? IC.star : svgI(ICON_FOR_UC_LABEL[lbl] || 'feat');

      function ucQsStrip() {
        const sp = car.specs || {};

        const row1 = [
            ['Body Type', car.body],
            ['Powertrain', sp['Engine'] || sp['Motor'] || car.type],
            ['Ground Clearance', sp['GroundClearance'] || sp['Ground Clearance (mm)'] || sp['Ground Clearance']],
            ['Mileage/Range (Real-World)', sp['Efficiency'] || sp['Range'] || sp['Mileage'] || sp['Real-World Mileage']],
            ['Odometer Reading (km)', car.km ? car.km + ' km' : ''],
            ['Condition Grade (A/B/C/D)', sp['Condition Grade'] || sp['Condition'] || car.condition],
            ['Safety Rating', car.rating ? car.rating + ' Star' : '']
        ];

        const row2 = [
            ['Fuel Type', car.type || car.fuel],
            ['Transmission', car.transmission],
            ['Drivetrain', sp['Drive'] || sp['Drivetrain'] || sp['Drive Type']],
            ['Seating Capacity', sp['Seating'] || sp['Seating Capacity']],
            ['Boot Space (Liters)', sp['Boot'] || sp['Boot Space (litres)'] || sp['Boot Space (Liters)']],
            ['Service History', car.serviceHistory || sp['Service History']],
            ['Number of Owners', car.owners ? car.owners + (car.owners === 1 ? ' Owner' : ' Owners') : ''],
            ['Accident History', car.accidentHistory || sp['Accident History'] || 'None']
        ];

        const cells = [...row1, ...row2].filter(([, val]) => val).slice(0, 10);
        const cellsHTML = cells.map(([l, val]) => `
      <div class="dp-ki-cell">
        <div class="dp-ki-icon">${iconForUcCell(l)}</div>
        <div class="dp-ki-val">${val}</div>
        <div class="dp-ki-lbl">${l}</div>
      </div>`).join('');

        return `
          <div class="dp-ki-grid">${cellsHTML}</div>
          <button class="dp-hl-btn" onclick="AV.switchDpTab('dp-tab-featspecs', document.getElementById('dp-tab-btn-featspecs'));document.getElementById('dp-tab-btn-featspecs').scrollIntoView({behavior:'smooth',block:'center'})">View all specs</button>
        `;
      }

      const UC_OVERVIEW_SCHEMA = {
        "1. Overview": ["Brand", "Model", "Generation", "Variant", "Trim Detail", "Manufacturing Year", "Registration Year", "Color", "Body Type", "Powertrain", "Fuel Type", "Transmission", "Drivetrain"]
      };
      const UC_CONDITION_SCHEMA = {
        "2. Core Condition Data": ["Odometer Reading (km)", "Service History", "Last Service Date", "Accident History", "Accident Severity", "Number of Owners", "Ownership Type", "Insurance Status", "Insurance Type", "Road Tax Validity", "Documentation Status", "Loan Status", "Inspection Summary"],
        "All Details Inspection Summary Rating": ["Exterior Score", "Interior Score", "Engine Health Score", "Suspension Score", "Braking Score", "Electrical Score"],
        "Test Drive Summary": ["Driving Experience Score", "Noise Level Score", "Comfort Score"],
        "Autoviindu Condition Score (ACS)": ["Condition Score (ACS)", "Condition Grade", "Inspection Badge"]
      };
      const UC_PRICING_SCHEMA = {
        "3. Pricing & Purchase Info": ["Asking Price (NPR)", "Market Price Indicator", "Booking Amount", "Payment Mode", "Finance Availability", "Finance Partner", "EMI Estimate", "Exchange Option", "Exchange Details"]
      };
      const UC_FEAT_SPEC_SCHEMA = {
        "4. Features & Specifications": ["Key Features", "Infotainment System", "AC Type", "Steering Type", "Seating Capacity", "Seat Material", "Airbags", "Safety Rating", "Safety Features", "Parking Assist", "Lighting", "Wheels & Tyres", "Ground Clearance (mm)", "Boot Space (Liters)", "Mileage / Range (Real-World)", "Sunroof", "Test Drive Availability"]
      };

      const isMatchedBySchema = (schemaObj, mergedObj, targetKey) => {
        let lowerK = targetKey.toLowerCase();
        for (const fields of Object.values(schemaObj)) {
          for (const field of fields) {
            let lowerField = field.toLowerCase();
            if (lowerK === lowerField || lowerField.includes(lowerK) || lowerK.includes(lowerField)) return true;
          }
        }
        return false;
      };

      function renderTemplateSchema(schemaObj, mergedObj, accPrefix = 'spec-acc-', showOtherSpecs = false) {
        let html = '';
        let accIndex = 0;
        const matchedKeys = new Set();
        const getVal = (schemaField) => {
          let lowerField = schemaField.toLowerCase();
          for (const k of Object.keys(mergedObj)) {
            if (k.toLowerCase() === lowerField) { matchedKeys.add(k); return mergedObj[k]; }
          }
          for (const k of Object.keys(mergedObj)) {
            let lowerK = k.toLowerCase();
            if (lowerField.includes(lowerK) || lowerK.includes(lowerField)) {
               if (!matchedKeys.has(k)) { matchedKeys.add(k); return mergedObj[k]; }
            }
          }
          return "-";
        };
        for (const [secName, fields] of Object.entries(schemaObj)) {
          let bodyHTML = '';
          const isExtInt = secName.toLowerCase().includes('exterior') || secName.toLowerCase().includes('interior');
          if (isExtInt) {
            let chipsHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px;padding:12px;background:var(--bg);border-radius:12px;border:1px solid var(--border);margin-bottom:24px;">';
            let hasChips = false;
            for (let i = 0; i < fields.length; i++) {
               const field = fields[i];
               let val = getVal(field);
               if (val !== '-') {
                 hasChips = true;
                 const isCheck = val.includes('svg') || val === 'Yes' || val === '✔' || val === 'Pass';
                 const displayText = isCheck ? field : `${field}: ${val}`;
                 chipsHTML += `<span style="display:inline-flex;align-items:center;gap:6px;background:var(--white);border:1px solid var(--border);color:var(--ink2);font-size:12px;font-weight:600;padding:6px 12px;border-radius:20px;box-shadow:var(--shadow-sm);">
                   <svg viewBox="0 0 24 24" fill="none" stroke="#1a6b2a" stroke-width="3.5" width="11" height="11" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>
                   ${displayText}
                 </span>`;
               }
            }
            chipsHTML += '</div>';
            bodyHTML = hasChips ? chipsHTML : '';
          } else {
            let rows = '<div class="dp-spec-grid" style="margin-bottom:24px;">';
            let hasRows = false;
            for (let i = 0; i < fields.length; i++) {
               const field = fields[i];
               let val = getVal(field);
               if (val !== '-') {
                 hasRows = true;
                 let displayStyle = i >= 6 ? 'display:none;' : '';
                 let extraClass = i >= 6 ? ` ${accPrefix}hidden` : '';
                 rows += `<div class="dp-spec-row${extraClass}" style="${displayStyle}"><div class="dp-spec-label">${field}</div><div class="dp-spec-val">${val}</div></div>`;
               }
            }
            rows += '</div>';
            if (fields.length > 6 && hasRows) {
               rows += `<div style="text-align:center; margin-top:-14px; margin-bottom:24px;"><button type="button" style="font-size:13px; font-weight:700; color:var(--ink4); background:var(--bg); border:1px solid var(--border); border-radius:999px; padding:6px 14px; cursor:pointer;" onclick="const rows=this.parentElement.previousElementSibling.querySelectorAll('.${accPrefix}hidden'); const isHidden=rows[0].style.display==='none'; rows.forEach(r=>r.style.display=isHidden?'flex':'none'); this.textContent=isHidden?'View Less':'View More';">View More</button></div>`;
            }
            bodyHTML = hasRows ? rows : '';
          }
          if (bodyHTML) {
            html += accord(accPrefix + (accIndex++), 'list', secName.replace(/^\d+\.\s*/, ''), bodyHTML);
          }
        }
        if (showOtherSpecs) {
          let otherRows = '';
          for (const [k, val] of Object.entries(mergedObj)) {
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) continue;
            if (!matchedKeys.has(k) && !isMatchedBySchema(UC_FEAT_SPEC_SCHEMA, mergedObj, k)) {
              otherRows += `<div class="dp-spec-row"><div class="dp-spec-label">${k}</div><div class="dp-spec-val">${val}</div></div>`;
            }
          }
          if (otherRows) {
            html += accord(accPrefix + (accIndex++), 'list', 'Other Details', '<div class="dp-spec-grid">' + otherRows + '</div>');
          }
        }
        return html;
      }

      function ucOverviewGrid() {
        const mergedObj = Object.assign({}, car.specs || {}, {
           "Brand": car.brand, "Model": car.model, "Manufacturing Year": car.year, "Color": car.color, "Body Type": car.body, "Fuel Type": car.type, "Transmission": car.transmission, "Odometer Reading (km)": car.km, "Number of Owners": car.owners
        });
        const matchedKeys = new Set();
        const getVal = (schemaField) => {
          let lowerField = schemaField.toLowerCase();
          for (const k of Object.keys(mergedObj)) {
            if (k.toLowerCase() === lowerField) { matchedKeys.add(k); return mergedObj[k]; }
          }
          for (const k of Object.keys(mergedObj)) {
            let lowerK = k.toLowerCase();
            if (lowerField.includes(lowerK) || lowerK.includes(lowerField)) {
               if (!matchedKeys.has(k)) { matchedKeys.add(k); return mergedObj[k]; }
            }
          }
          return "-";
        };
        let rows = '<div class="dp-spec-grid" style="margin-bottom:24px;border:1px solid var(--border);border-radius:12px;background:var(--white)">';
        const fields = UC_OVERVIEW_SCHEMA["1. Overview"];
        for (let i = 0; i < fields.length; i++) {
           const field = fields[i];
           let val = getVal(field);
           let displayStyle = i >= 6 ? 'display:none;' : '';
           let extraClass = i >= 6 ? ' uc-overview-hidden' : '';
           rows += `<div class="dp-spec-row${extraClass}" style="${displayStyle}"><div class="dp-spec-label">${field}</div><div class="dp-spec-val">${val}</div></div>`;
        }
        rows += '</div>';
        if (fields.length > 6) {
           rows += `<div style="text-align:center; margin-top:-14px; margin-bottom:24px;"><button type="button" style="font-size:13px; font-weight:700; color:var(--ink4); background:var(--bg); border:1px solid var(--border); border-radius:999px; padding:6px 14px; cursor:pointer;" onclick="const rows=document.querySelectorAll('.uc-overview-hidden'); const isHidden=rows[0].style.display==='none'; rows.forEach(r=>r.style.display=isHidden?'flex':'none'); this.textContent=isHidden?'View Less':'View More';">View More</button></div>`;
        }
        return rows;
      }

      const heroEyebrow = (() => {
        const eyebrow = car?.eyebrow ?? car?.titleTag ?? car?.badge ?? '';
        if (typeof eyebrow !== 'string') return '';
        return eyebrow.trim();
      })();

      function renderAcsDetailedSummary() {
        const baseRating = car.rating || 4.2;
        const isEV = String(car.type || '').toLowerCase().includes('electric') || String(car.type || '').toLowerCase().includes('hybrid');
        
        const getSeededRating = (categoryName) => {
          let hash = 0;
          const str = car.id + categoryName;
          for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }
          const offset = ((hash % 10) / 10) - 0.5;
          const finalScore = Math.max(3.2, Math.min(5.0, baseRating + offset));
          return finalScore.toFixed(1);
        };

        const getStarsHTML = (score) => {
          const rounded = Math.round(score);
          return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
        };

        const grade = car.meta?.grade || (baseRating >= 4.5 ? 'A+' : baseRating >= 4.0 ? 'A' : baseRating >= 3.5 ? 'B' : 'C');
        const badge = car.certified ? 'Premium Verified' : (baseRating >= 4.2 ? 'Verified' : 'Standard');

        const evCategories = [
          { name: 'Exterior', weight: '7%', score: getSeededRating('Exterior') },
          { name: 'Interior', weight: '5%', score: getSeededRating('Interior') },
          { name: 'Battery/Power System', weight: '35%', score: getSeededRating('Battery') },
          { name: 'Motor/Drivetrain', weight: '15%', score: getSeededRating('Motor') },
          { name: 'Charging System', weight: '12%', score: getSeededRating('Charging') },
          { name: 'Suspension/Steering', weight: '8%', score: getSeededRating('Suspension') },
          { name: 'Braking System', weight: '7%', score: getSeededRating('Braking') },
          { name: 'Tires/Wheels', weight: '6%', score: getSeededRating('Tires') },
          { name: 'Electrical Systems', weight: '4%', score: getSeededRating('Electrical') },
          { name: 'ADAS', weight: '1%', score: getSeededRating('ADAS') }
        ];

        const iceCategories = [
          { name: 'Exterior', weight: '12%', score: getSeededRating('Exterior') },
          { name: 'Interior', weight: '8%', score: getSeededRating('Interior') },
          { name: 'Engine/Mechanical', weight: '30%', score: getSeededRating('Engine') },
          { name: 'Suspension/Steering', weight: '18%', score: getSeededRating('Suspension') },
          { name: 'Braking System', weight: '15%', score: getSeededRating('Braking') },
          { name: 'Tires/Wheels', weight: '10%', score: getSeededRating('Tires') },
          { name: 'Electrical', weight: '7%', score: getSeededRating('Electrical') }
        ];

        const evTestDrive = [
          { name: 'Performance', desc: 'Strong acceleration + consistent highway power', score: getSeededRating('Performance') },
          { name: 'Drivetrain', desc: 'Linear motor power + smooth regen braking', score: getSeededRating('EV_Drivetrain') },
          { name: 'Handling', desc: 'Precise steering response + stable cornering', score: getSeededRating('Handling') },
          { name: 'Comfort', desc: 'Smooth ride quality + low NVH', score: getSeededRating('Comfort') },
          { name: 'EV-Specific', desc: 'Silent operation + efficient energy', score: getSeededRating('EV-Specific') }
        ];

        const iceTestDrive = [
          { name: 'Engine Performance', desc: 'Smooth acceleration, no knocking/hesitation', score: getSeededRating('Engine Performance') },
          { name: 'Transmission', desc: 'Smooth shifts, no gear slipping/delay', score: getSeededRating('Transmission') },
          { name: 'Braking', desc: 'Firm pedal feel, straight controlled stopping', score: getSeededRating('ICE_Braking') },
          { name: 'Steering & Handling', desc: 'Precise response, stable cornering', score: getSeededRating('Steering & Handling') },
          { name: 'Comfort', desc: 'Smooth ride quality + low NVH', score: getSeededRating('Comfort') }
        ];

        const categories = isEV ? evCategories : iceCategories;
        const testDrive = isEV ? evTestDrive : iceTestDrive;

        const isUnlocked = sessionStorage.getItem(`acs_unlocked_${car.id}`) === '1';

        const styleBlock = `
          <style>
            .acs-blur-active .acs-row-blurred .acs-score-val,
            .acs-blur-active .acs-row-blurred .acs-stars {
              filter: blur(5px);
              user-select: none;
              pointer-events: none;
            }
            .acs-summary-container {
              position: relative;
              border-radius: 12px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 20px;
              transition: all 0.3s ease;
            }
            .acs-summary-container.acs-blur-active {
              max-height: 410px;
              overflow: hidden;
              padding-bottom: 140px;
            }
            .acs-bottom-lock-overlay {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 280px;
              background: linear-gradient(to top, rgba(248, 250, 252, 1) 0%, rgba(248, 250, 252, 0.96) 60%, rgba(248, 250, 252, 0) 100%);
              display: flex;
              align-items: flex-end;
              justify-content: center;
              z-index: 10;
              padding: 20px;
            }
            .acs-lock-card {
              background: #fff;
              border: 1px solid rgba(0,0,0,0.06);
              box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
              border-radius: 16px;
              padding: 20px 24px;
              text-align: center;
              max-width: 380px;
              width: 100%;
            }
            .acs-lock-icon {
              font-size: 24px;
              margin-bottom: 6px;
              animation: acsPulse 2s infinite;
            }
            @keyframes acsPulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            .acs-lock-card h4 {
              font-size: 15px;
              font-weight: 800;
              color: var(--ink);
              margin: 0 0 6px 0;
            }
            .acs-lock-card p {
              font-size: 12px;
              color: var(--ink-3);
              margin: 0 0 14px 0;
              line-height: 1.45;
            }
            .acs-input {
              width: 100%;
              height: 38px;
              padding: 0 12px;
              border: 1.5px solid var(--border);
              border-radius: 8px;
              font-size: 13px;
              outline: none;
              transition: all 0.2s;
              background: #fff;
              color: var(--ink);
            }
            .acs-input:focus {
              border-color: var(--green, var(--g2, #0E5E26));
              box-shadow: 0 0 0 3px rgba(26,107,42,.1);
            }
            .acs-unlock-btn {
              background: var(--green, var(--g2, #0E5E26));
              color: #fff;
              border: none;
              height: 38px;
              border-radius: 8px;
              font-weight: 700;
              font-size: 13px;
              cursor: pointer;
              transition: background 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              width: 100%;
            }
            .acs-unlock-btn:hover {
              background: #145321;
            }
            .acs-grid-cols {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
            }
            @media (max-width: 768px) {
              .acs-grid-cols {
                grid-template-columns: 1fr;
              }
            }
            .acs-section-title {
              font-size: 13.5px;
              font-weight: 800;
              color: var(--ink);
              margin-bottom: 12px;
              padding-bottom: 6px;
              border-bottom: 2px solid var(--border);
            }
            .acs-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dashed #e2e8f0;
            }
            .acs-row:last-child {
              border-bottom: none;
            }
            .acs-label-wrap {
              display: flex;
              flex-direction: column;
            }
            .acs-cat-name {
              font-size: 12.5px;
              font-weight: 700;
              color: var(--ink-2);
            }
            .acs-cat-weight {
              font-size: 10.5px;
              color: var(--ink-4);
            }
            .acs-rating-wrap {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .acs-score-val {
              font-size: 12.5px;
              font-weight: 800;
              color: var(--ink);
            }
            .acs-stars {
              color: #fbbf24;
              font-size: 10.5px;
              letter-spacing: 0.5px;
            }
          </style>
        `;

        const highLevelHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; background:#fff; padding:16px 20px; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:20px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="font-size:22px; font-weight:900; color:var(--green, var(--g2, #0E5E26)); background:#f0fdf4; width:48px; height:48px; border-radius:10px; display:flex; align-items:center; justify-content:center; border:1.5px solid #bbf7d0;">
                ${grade}
              </div>
              <div>
                <div style="font-size:13.5px; font-weight:800; color:var(--ink);">${badge}</div>
                <div style="font-size:11px; color:var(--ink-4);">ACS Grade Awarded</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:17px; font-weight:900; color:var(--ink);">${baseRating.toFixed(1)} / 5.0</div>
              <div style="font-size:10px; color:#fbbf24; letter-spacing:1px; margin-top:2px;">${getStarsHTML(baseRating)}</div>
            </div>
          </div>
        `;

        const renderCats = categories.map((c, i) => `
          <div class="acs-row ${isUnlocked ? '' : 'acs-row-blurred'}">
            <div class="acs-label-wrap">
              <span class="acs-cat-name">${c.name}</span>
              <span class="acs-cat-weight">Weight: ${c.weight}</span>
            </div>
            <div class="acs-rating-wrap">
              <span class="acs-stars">${getStarsHTML(c.score)}</span>
              <span class="acs-score-val">${c.score}</span>
            </div>
          </div>
        `).join('');

        const renderTD = testDrive.map((t, i) => `
          <div class="acs-row ${isUnlocked ? '' : 'acs-row-blurred'}">
            <div class="acs-label-wrap" style="max-width: 65%;">
              <span class="acs-cat-name">${t.name}</span>
              <span class="acs-cat-weight" style="line-height:1.3;">${t.desc}</span>
            </div>
            <div class="acs-rating-wrap">
              <span class="acs-stars">${getStarsHTML(t.score)}</span>
              <span class="acs-score-val">${t.score}</span>
            </div>
          </div>
        `).join('');

        const overlayHTML = isUnlocked ? '' : `
          <div class="acs-bottom-lock-overlay">
            <div class="acs-lock-card">
              <div class="acs-lock-icon">🔒</div>
              <h4>Unlock 10+ Detailed Ratings</h4>
              <p>Receive the full ACS verification certificate and comprehensive 140-point inspection PDF report.</p>
              <button type="button" class="acs-unlock-btn" onclick="AV.openAcsUnlockModal('${car.id}')">Unlock Report &nbsp;→</button>
            </div>
          </div>
        `;

        const modalHTML = isUnlocked ? '' : `
          <div class="av-modal-overlay" id="acs-unlock-overlay-${car.id}" onclick="if(event.target===this)AV.closeAcsUnlockModal('${car.id}')">
            <div class="av-modal-box" style="max-width:380px;">
              <button type="button" class="av-modal-close" onclick="AV.closeAcsUnlockModal('${car.id}')">&times;</button>
              <div class="av-modal-head" style="text-align:center;">
                <div class="acs-lock-icon" style="margin:0 auto 4px;">🔒</div>
                <div class="av-modal-title">Unlock Full ACS Report</div>
                <div class="av-modal-sub">Enter your details to reveal every rating and get the full inspection PDF.</div>
              </div>
              <div class="av-modal-body" style="padding:18px 20px;">
                <form onsubmit="AV.unlockAcsReport(event, '${car.id}')" style="display:flex; flex-direction:column; gap:10px; width:100%;">
                  <input type="email" placeholder="Your Email Address" required class="acs-input" id="acs-email-${car.id}">
                  <input type="tel" placeholder="Your Phone Number" required class="acs-input" id="acs-phone-${car.id}">
                  <button type="submit" class="acs-unlock-btn">Send Details &amp; Unlock Report &nbsp;→</button>
                </form>
              </div>
            </div>
          </div>
        `;

        return `
          ${styleBlock}
          ${highLevelHTML}
          <div class="acs-summary-container ${isUnlocked ? '' : 'acs-blur-active'}">
            ${overlayHTML}
            <div class="acs-grid-cols">
              <div>
                <div class="acs-section-title">Inspection Summary (${isEV ? 'EV' : 'ICE'})</div>
                ${renderCats}
              </div>
              <div>
                <div class="acs-section-title">Test Drive Summary</div>
                ${renderTD}
              </div>
            </div>
          </div>
          ${modalHTML}
        `;
      }

      function ucConditionTable() {
        const mergedObj = Object.assign({}, car.specs || {}, {
          "Odometer Reading (km)": car.km,
          "Number of Owners": car.owners
        });
        return renderTemplateSchema(UC_CONDITION_SCHEMA, mergedObj, 'uc-cond-acc-', false);
      }

      function ucPricingTable() {
        const mergedObj = Object.assign({}, car.specs || {}, {
          "Asking Price (NPR)": Rs(car.priceNum || 0)
        });
        return renderTemplateSchema(UC_PRICING_SCHEMA, mergedObj, 'uc-price-acc-', false);
      }

      function ucFeatSpecTable() {
        const mergedObj = Object.assign({}, car.specs || {});
        const allFeats = [...new Set([...(car.features || []), ...(car.highlights || [])])];
        const chkIcon = `<span style="width:16px;height:16px;min-width:16px;display:inline-flex;color:#16a34a">${svgI('chk')}</span>`;
        allFeats.forEach(f => {
            mergedObj[f] = chkIcon; 
        });
        let html = '';
        let accIndex = 0;
        const matchedKeys = new Set();
        const getVal = (schemaField) => {
          let lowerField = schemaField.toLowerCase();
          for (const k of Object.keys(mergedObj)) {
            if (k.toLowerCase() === lowerField) { matchedKeys.add(k); return mergedObj[k]; }
          }
          for (const k of Object.keys(mergedObj)) {
            let lowerK = k.toLowerCase();
            if (lowerField.includes(lowerK) || lowerK.includes(lowerField)) {
               if (!matchedKeys.has(k)) { matchedKeys.add(k); return mergedObj[k]; }
            }
          }
          return "-";
        };
        for (const [secName, fields] of Object.entries(UC_FEAT_SPEC_SCHEMA)) {
          let rows = '<div class="dp-spec-grid">';
          for (const field of fields) {
             let val = getVal(field);
             rows += `<div class="dp-spec-row"><div class="dp-spec-label">${field}</div><div class="dp-spec-val">${val}</div></div>`;
          }
          rows += '</div>';
          html += accord('uc-fs-acc-' + (accIndex++), 'list', secName.replace(/^\d+\.\s*/, ''), rows, true);
        }
        return html;
      }

      function inspectGrid() {
        return `<div class="uc-check-grid" style="display:flex;flex-direction:column;gap:12px;">
      ${car.inspection.map(item => `<div class="uc-check-item" style="padding:12px;background:var(--bg);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;gap:10px;">
        <div class="uc-check-dot" style="background:${item.ok ? '#16a34a' : '#dc2626'};width:10px;height:10px;border-radius:50%"></div>
        <div style="flex:1">
          <div class="uc-check-label" style="font-size:13.5px;font-weight:700;color:var(--ink2)">${item.label}</div>
          <div style="font-size:12px;color:var(--ink4);margin-top:2px">${item.status}</div>
        </div>
        <span style="margin-left:auto">${checkIcon(item.ok)}</span>
      </div>`).join('')}
    </div>`;
      }

      function accord(id, iconKey, title, body, open = false) {
        return `<div class="dp-accord-wrap${open ? ' open' : ''}" id="${id}">
      <div class="dp-accord-hd" onclick="AV.dpAccord(this)">
        <div class="dp-accord-title">${svgI(iconKey)} ${title}</div>
        <div class="dp-accord-arr">${svgI('chev')}</div>
      </div>
      <div class="dp-accord-body"><div class="dp-accord-body-inner">${body}</div></div>
    </div>`;
      }

      function emiHTML(pfx) {
        const dp = 20, dt = 60, dr = 10.5;
        const loan = car.priceNum * (1 - dp / 100);
        const emi = calcEMI(loan, dr, dt);
        const tot = emi * dt, intr = tot - loan;
        return `
      <div class="dp-emi-field">
        <div class="dp-emi-label">Down payment <span class="val" id="${pfx}-dpv">${dp}%</span></div>
        <input type="range" min="10" max="60" step="5" value="${dp}" id="${pfx}-dp"
          oninput="document.getElementById('${pfx}-dpv').textContent=this.value+'%';AV.emiCalcUsed('${id}','${pfx}')">
      </div>
      <div class="dp-emi-field">
        <div class="dp-emi-label">Tenure <span class="val"><span id="${pfx}-ten">${dt}</span> months</span></div>
        <div class="tenure-btns">
          ${[12, 24, 36, 48, 60, 72].map(m => `<button class="ten-btn${m === dt ? ' active' : ''}"
            onclick="this.closest('.tenure-btns').querySelectorAll('.ten-btn').forEach(b=>b.classList.remove('active'));
                     this.classList.add('active');
                     document.getElementById('${pfx}-ten').textContent=${m};
                     AV.emiCalcUsed('${id}','${pfx}')">${m}m</button>`).join('')}
        </div>
      </div>
      <div class="dp-emi-field">
        <div class="dp-emi-label">Interest rate <span class="val" id="${pfx}-ratev">${dr}%</span></div>
        <input type="range" min="7" max="18" step="0.5" value="${dr}" id="${pfx}-rate"
          oninput="document.getElementById('${pfx}-ratev').textContent=this.value+'%';AV.emiCalcUsed('${id}','${pfx}')">
      </div>
      <div class="dp-emi-result">
        <div style="font-size:10px;color:var(--ink4);margin-bottom:2px">Monthly EMI</div>
        <div class="dp-emi-amount" id="${pfx}-amt">Rs. ${Math.round(emi).toLocaleString()}</div>
        <div style="font-size:11px;color:var(--ink4)">/month</div>
      </div>
      <div class="dp-emi-break">
        <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="${pfx}-loan">${Rs(Math.round(loan))}</div><div class="dp-emi-bd-lbl">Loan amount</div></div>
        <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="${pfx}-int">${Rs(Math.round(intr))}</div><div class="dp-emi-bd-lbl">Interest</div></div>
        <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="${pfx}-tot">${Rs(Math.round(tot))}</div><div class="dp-emi-bd-lbl">Total payable</div></div>
        <div class="dp-emi-bd"><div class="dp-emi-bd-val">${car.price}</div><div class="dp-emi-bd-lbl">Vehicle price</div></div>
      </div>
      <button onclick="alert('Finance: +977-9828364940')" class="dp-cta-ghost" style="margin-top:10px;width:100%">Apply for finance →</button>`;
      }

      function sidebarHTML() {
        return `<div class="dp-scard">
      <div class="dp-price-box">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:4px">Asking price</div>
        <div class="dp-price-main">${car.price}</div>
        <div class="dp-price-note">${car.variant}</div>
        <div class="dp-cta-stack" style="margin-top:16px;">
          <button class="dp-cta-primary" onclick="AV.openUsedInquiryModal('${car.id}')"><i data-lucide="mail" style="width:14px;height:14px;"></i> Inquire Now</button>
          <button class="dp-cta-ghost" style="margin-top:8px; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="AV.playCarVideo('${car.video || ''}')"><svg viewBox="0 0 24 24" fill="red" width="18" height="18"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg> Watch Video</button>
        </div>
      </div>

      <!-- Transaction & Finance Details -->
      <div style="padding:16px 20px; border-bottom:1px solid var(--border); background:var(--bg2);">
        <div style="font-size:14px; font-weight:800; color:var(--ink); margin-bottom:12px;">Transaction Details</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Asking Price (NPR)</span>
            <span style="font-weight:700; color:var(--ink)">${car.price}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Price Type</span>
            <span style="font-weight:700; color:var(--ink)">Negotiable</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Market Price Indicator</span>
            <span style="font-weight:700; color:#16a34a; background:#dcfce7; padding:2px 8px; border-radius:12px; font-size:11px;">Good Deal</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Booking Amount</span>
            <span style="font-weight:700; color:var(--ink)">Rs. 50,000</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Finance Availability</span>
            <span style="font-weight:700; color:var(--ink)">Yes</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Finance Partner</span>
            <span style="font-weight:700; color:var(--ink); text-align:right; max-width:60%;">Commercial Banks / NRB-licensed</span>
          </div>
      
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Exchange Option</span>
            <span style="font-weight:700; color:var(--ink)">Yes</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:13px;">
            <span style="color:var(--ink3)">Exchange Details</span>
            <span style="font-weight:700; color:var(--ink); text-align:right; max-width:60%;">Physical inspection required</span>
          </div>
        </div>
      </div>
      
      <!-- Seller Profile Box -->
      <div style="padding:20px;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--g3);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">${car.seller.name.charAt(0)}</div>
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--ink)">${car.seller.name}</div>
            ${car.seller.verified ? '<span style="font-size:11px;color:#16a34a;font-weight:600"><i data-lucide="check"></i> Verified Dealer</span>' : ''}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;background:var(--bg);border-radius:8px;padding:12px 0;margin-bottom:16px">
          <div style="text-align:center;flex:1;border-right:1px solid var(--border)"><div style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.sold}+</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">Cars sold</div></div>
          <div style="text-align:center;flex:1;border-right:1px solid var(--border)"><div style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.rating}<i data-lucide="star"></i></div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">Rating</div></div>
          <div style="text-align:center;flex:1"><div style="font-size:14px;font-weight:800;color:var(--ink)">4yr</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">On AutoViindu</div></div>
        </div>
        <button onclick="alert('+977-9828364940')" style="width:100%;padding:12px;background:var(--white);color:var(--ink);border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-b);font-size:13.5px;font-weight:700;cursor:pointer;">Message Seller</button>
      </div>

      <div class="dp-contact-row">
        ${svgI('ph')} <a href="tel:+9779828364940">+977-9828364940</a>&nbsp;·&nbsp;Mon–Sat 9am–6pm
      </div>
    </div>`;
      }

      function similarCars() {
        const similar = USED.filter(c => c.id !== id && c.body && car.body && c.body.toLowerCase() === car.body.toLowerCase()).slice(0, 4);
        if (!similar.length) return '';
        return `<div class="wrap dp-similar" style="margin-top:40px;margin-bottom:40px;">
      <div class="section-hd">Similar Used Cars</div>
      <div class="used-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
        ${similar.map(c => usedCard(c)).join('')}
      </div>
    </div>`;
      }

      document.getElementById('app-root').innerHTML = `
  <div style="background:linear-gradient(160deg,var(--g0),var(--g1));padding:14px 0 16px;position:relative;overflow:hidden">
    <div class="wrap">
      <div class="breadcrumb">
        <a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span>
        <a onclick="AV.renderUsed()">Used Cars</a><span class="bc-sep">/</span>
        <span style="color:rgba(255,255,255,.7)">${car.brand} ${car.model}</span>
      </div>
      <!-- Desktop title only -->
      <div id="dp-desk-hd" style="display:none">
        ${heroEyebrow ? `<div style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:8px">${heroEyebrow}</div>` : ''}
        <h1 style="font-family:var(--font-d);font-size:clamp(22px,3.5vw,32px);color:#fff;font-weight:700;line-height:1.1;margin-bottom:5px">
          ${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span>
        </h1>
        <div style="font-size:12px;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${car.type} · ${car.transmission} · ${car.km} km +
          <span class="cc-rating"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${car.rating}</span>
          <span>${car.reviews} reviews</span>
          ${car.certified ? `<span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:var(--pill);background:rgba(26,107,42,.3);color:#4dd870;border:1px solid rgba(26,107,42,.45)"><i data-lucide="check"></i> AutoViindu Certified</span>` : ''}
        </div>
      </div>
    </div>
  </div>

  <div class="wrap dp-layout detail-page-body">

    <!-- ═══ LEFT: main content ═══ -->
    <div style="min-width:0">

      <!-- Gallery -->
      <div class="dp-gallery-card">
        <div id="used-gallery-container"></div>
      </div>

      <!-- Highlights -->
      <div class="dp-hl-card" id="dp-qs">${ucQsStrip()}</div>

      <!-- Mobile title (hidden on desktop) -->
      <div class="dp-mob-title">
        ${heroEyebrow ? `<div class="dp-mob-title-eyebrow" style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--ink-4);margin-bottom:6px">${heroEyebrow}</div>` : ''}
        <h1>${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span></h1>
        <div class="dp-mob-title-sub">
          ${car.type} · ${car.transmission} · ${car.km} km +
          <span class="cc-rating"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${car.rating}</span>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="dp-tabs-nav">
        <button class="dp-tab-btn active" onclick="AV.switchDpTab('dp-tab-overview', this)">Overview</button>
        <button class="dp-tab-btn" onclick="AV.switchDpTab('dp-tab-condition', this)">Core Condition</button>
        <button class="dp-tab-btn" id="dp-tab-btn-featspecs" onclick="AV.switchDpTab('dp-tab-featspecs', this)">Features &amp; Specifications</button>
         <button class="dp-tab-btn" onclick="AV.switchDpTab('dp-tab-acs', this)">ACS Inspection &amp; Test Drive</button>
      </div>

      <!-- Tab: Overview -->
      <div class="dp-tab-pane active" id="dp-tab-overview">
        ${ucOverviewGrid()}
        <div style="padding:14px 16px;background:var(--white);border:1px solid var(--border);border-radius:12px;margin-bottom:16px;margin-top:16px">
          <p style="font-size:13.5px;color:var(--ink3);line-height:1.85;margin:0">${car.overview}</p>
        </div>
      </div>

      <!-- Tab: Condition -->
      <div class="dp-tab-pane" id="dp-tab-condition">
        ${ucConditionTable()}
        ${accord('acc-insp', 'chk', '140-Point Inspection Report', `<div id="insp-body">${inspectGrid()}</div>`, true)}
      </div>

      <!-- Tab: ACS Inspection & Test Drive -->
      <div class="dp-tab-pane" id="dp-tab-acs">
        ${renderAcsDetailedSummary()}
      </div>

      <!-- Tab: Features & Specs -->
      <div class="dp-tab-pane" id="dp-tab-featspecs">
        ${ucFeatSpecTable()}
      </div>

    </div>

    <!-- ═══ RIGHT: sticky sidebar (desktop only) ═══ -->
    <div class="dp-sidebar" id="dp-sidebar">
      ${sidebarHTML()}
    </div>
  </div>

  <!-- Similar cars (Full Width) -->
  ${similarCars()}

  <!-- Mobile sticky bottom bar -->
  <div class="dp-mob-bar">
    <div class="dp-mob-price">
      <div class="dp-mob-price-lbl">Asking Price</div>
      <div class="dp-mob-price-val">${car.price}</div>
    </div>
    <div class="dp-mob-btns">
      <button class="dp-mob-btn-g" onclick="AV.openUsedInquiryModal('${car.id}')"><i data-lucide="mail" style="width:14px;height:14px;"></i> Inquire</button>
      <button class="dp-mob-btn-p" onclick="AV.playCarVideo('${car.video || ''}')"><svg viewBox="0 0 24 24" fill="red" width="16" height="16" style="vertical-align:-3px;margin-right:2px"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>Watch Video</button>
    </div>
  </div>`;

      /* desktop: show hero title + sidebar */
      const mq = window.matchMedia('(min-width:900px)');
      function applyMQ(e) {
        const dh = document.getElementById('dp-desk-hd');
        const sb = document.getElementById('dp-sidebar');
        if (dh) dh.style.display = e.matches ? 'block' : 'none';
        if (sb) sb.style.display = e.matches ? 'flex' : 'none';
      }
      applyMQ(mq);
      mq.addEventListener('change', applyMQ);

      window._udGalNav = function (dir) {
        gi = (gi + dir + imgs.length) % imgs.length;
        const img = document.getElementById('ud-gal-img');
        if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = imgs[gi]; img.style.opacity = '1' }, 200) }
        document.querySelectorAll('[id^="ud-thumb-"]').forEach((t, i) => t.style.borderColor = i === gi ? 'var(--g3)' : 'transparent');
        const c = document.getElementById('ud-gal-cnt'); if (c) c.textContent = `${gi + 1}/${imgs.length}`;
      };
      window._udGalSet = function (idx) {
        gi = idx;
        const img = document.getElementById('ud-gal-img');
        if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = imgs[idx]; img.style.opacity = '1' }, 200) }
        document.querySelectorAll('[id^="ud-thumb-"]').forEach((t, i) => t.style.borderColor = i === idx ? 'var(--g3)' : 'transparent');
        const c = document.getElementById('ud-gal-cnt'); if (c) c.textContent = `${idx + 1}/${imgs.length}`;
      };

      /* ── EMI recalc ── */
      AV.emiCalcUsed = function (id, pfx) {
        const dpPct = +(document.getElementById(`${pfx}-dp`)?.value || 20);
        const ten = +(document.getElementById(`${pfx}-ten`)?.textContent || 60);
        const rate = +(document.getElementById(`${pfx}-rate`)?.value || 10.5);
        const loan = car.priceNum * (1 - dpPct / 100);
        const emi = calcEMI(loan, rate, ten);
        const tot = emi * ten;
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set(`${pfx}-amt`, `Rs. ${Math.round(emi).toLocaleString()}`);
        set(`${pfx}-loan`, Rs(Math.round(loan)));
        set(`${pfx}-int`, Rs(Math.round(tot - loan)));
        set(`${pfx}-tot`, Rs(Math.round(tot)));
      };

      // Build the gallery after the HTML is in the DOM
      buildGallery(car, 'used-gallery-container');
    }


    function filterUsed(q) { window._uf.q = q; _ufApply(); }
    function sortUsed(val) { window._uf.sort = val; _ufApply(); }
    function chipFilterUsed(label, btn) {
      AV.ufClear();
      if (label === 'Certified') window._uf.certified = true;
      else if (label === 'Petrol') window._uf.fuels = ['Petrol'];
      else if (label === 'Diesel') window._uf.fuels = ['Diesel'];
      else if (label === 'Hybrid') window._uf.fuels = ['Hybrid'];
      else if (label === 'Under 30L') window._uf.budget = 'u20';
      else if (label === 'Under 50L') window._uf.budget = 'u40';
      else if (label === '1 Owner') window._uf.owners = 1;
      _ufApply();
    }

    function openUsedDetail(id) {
      clearInterval(heroTimer);
      renderUsedDetail(id);
      history.pushState({ page: 'used-detail', id }, '', `#used/${id}`);
    }

    /* ─ UPCOMING CARS ─ */
    /* Note: NAIMA Nepal Mobility Expo 2026 (Aug 11–16) has already taken place. Proton e.MAS 7, Deepal S05,
       Chery Q (QQ3), Leapmotor A10 (B03X), Tata Punch.ev/Tiago.ev facelifts, BAIC BJ30e Hybrid, and Arcfox T1
       have all launched with confirmed Nepal pricing and now live in CARS_DB / Latest Arrivals instead. */
    const UPCOMING_DATA = [
      { brand: 'AION', model: 'UT', slug: 'aion-ut', status: 'Expected Soon', statusCls: 'expect', price: 'Expected Rs. 60L – 75L', body: 'Hatchback', fuel: 'Electric', img: 'assets/images/car_images/aion/ut/exterior/UT_EXT_GREEN-WHITE.webp', eta: 'TBD' },
      { brand: 'Omoda', model: '4', slug: 'omoda-4', status: 'Shown at NAIMA 2026', statusCls: 'expo', price: 'TBD', body: 'SUV', fuel: 'Electric', img: 'assets/images/car_images/chery/omoda-4/exterior/download (1).jpeg', eta: 'TBD' },
      { brand: 'Jetour', model: 'T2', slug: 'jetour-t2', status: 'Expected Soon', statusCls: 'expect', price: 'TBD', body: 'SUV', fuel: 'Petrol', img: 'assets/images/car_images/jetour /t2/exterior/download.jpeg', eta: 'TBD' },
      { brand: 'Toyota', model: 'RAV4 Hybrid', slug: 'toyota-rav4-hybrid', status: 'Launching Soon', statusCls: 'launch', price: 'Expected Rs. 2.07Cr – 2.2Cr', body: 'SUV', fuel: 'Hybrid', img: 'assets/images/car_images/toyota/rav4/exterior/2026-toyota-rav4-limited-352-68f0e7f67ae2b.avif', eta: 'Oct–Nov 2026' },
      { brand: 'Hongqi', model: 'E-HS9', slug: 'hongqi-e-hs9', status: 'Expected Soon', statusCls: 'expect', price: 'TBD', body: 'SUV', fuel: 'Electric', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400', eta: 'TBD' },
    ];

    function upcomingCard(u) {
      const dbCar = CARS_DB.find(c => c.slug === u.slug);
      const statusColor = { launch: '#10b981', expect: '#f59e0b', expo: '#8b5cf6' };
      const statusBg = { launch: 'rgba(16,185,129,.12)', expect: 'rgba(245,158,11,.12)', expo: 'rgba(139,92,246,.12)' };
      const col = statusColor[u.statusCls] || '#64748b';
      const bg = statusBg[u.statusCls] || 'rgba(100,116,139,.1)';
      return `<div class="car-card" onclick="${dbCar ? `AV.openDetail('${u.slug}')` : 'void(0)'}" style="cursor:${dbCar ? 'pointer' : 'default'}">
        <div class="cc-img-wrap">
          <div class="cc-top-row">
            <span style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600;color:${col};background:${bg}">${u.status}</span>
            <span style="font-size:11px;color:rgba(255,255,255,.7);padding:3px 8px;background:rgba(0,0,0,.35);border-radius:99px;margin-left:auto">${u.eta}</span>
          </div>
          <img src="${u.img}" alt="${u.brand} ${u.model}" loading="lazy" class="cc-img" onerror="this.onerror=null;this.src=window.AV.noImg;this.classList.add('cc-img--empty')">
        </div>
        <div class="cc-body">
          <div class="cc-name">${u.brand} ${u.model}</div>
          <div class="cc-variant" style="margin-bottom:6px">${u.body} · ${u.fuel}</div>
          <div style="font-size:12px; color:var(--brand); font-weight:600; margin-bottom:12px">ETA: ${u.eta}</div>
          <div class="cc-price-block">
            <div class="cc-price-line">Price <strong>${u.price}</strong></div>
            <div class="cc-actions" style="margin-top:10px">
              ${dbCar
          ? `<button class="cc-btn-fill" onclick="event.stopPropagation();AV.openDetail('${u.slug}')">View Details</button>`
          : `<button class="cc-btn-fill" onclick="event.stopPropagation();alert('Call +977-9828364940 for pre-launch enquiry')">Enquire Now</button>`}
              <button class="cc-btn-outline" onclick="event.stopPropagation();alert('Get notified when ${u.brand} ${u.model} launches!')">Notify Me</button>
            </div>
          </div>
        </div>
      </div>`;
    }

    function renderUpcomingCars() {
      document.title = 'Upcoming Cars in Nepal 2025–26 — AutoViindu';
      setNav('upcoming');
      const launchingSoon = UPCOMING_DATA.filter(u => u.statusCls === 'launch');
      const expected = UPCOMING_DATA.filter(u => u.statusCls === 'expect');
      const expo = UPCOMING_DATA.filter(u => u.statusCls === 'expo');

      document.getElementById('app-root').innerHTML = `
      <div class="page-hero">
        <div class="wrap">
          <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:var(--ink3)">Upcoming Cars</span></div>
          <h1 style="font-family:var(--font-d);font-size:clamp(22px,4vw,34px);color:var(--ink);font-weight:700;margin-bottom:6px">Upcoming Cars in Nepal 2025–26</h1>
          <p style="font-size:14px;color:var(--ink3);max-width:560px">Expected launches, NAIMA Expo debuts & pre-launch pricing. Be the first to know before they hit showrooms.</p>
        </div>
      </div>
      <div class="wrap" style="padding-top:32px;padding-bottom:48px">
        <div class="cars-grid">${UPCOMING_DATA.map(u => upcomingCard(u)).join('')}</div>
      </div>
    `;
    }


    /* ─ BEST SELLERS ─ */
    const BESTSELLER_DATA = [
      // Real Nepal market bestsellers — slugs match actual cars.json entries
      { slug: 'suzuki-swift-2025', rank: 1, units: '4,200+', share: '8.1%', tag: '#1 Hatchback', why: 'Nepal\'s most iconic & trusted city car since 2007' },
      { slug: 'hyundai-creta-fl-2024', rank: 2, units: '3,800+', share: '7.3%', tag: '#1 Mid-SUV', why: 'Nepal\'s best-selling mid-size SUV for 5 consecutive years' },
      { slug: 'suzuki-grand-vitara-2025', rank: 3, units: '3,400+', share: '6.5%', tag: 'Top Hybrid SUV', why: 'Most popular hybrid SUV; strong resale value' },
      { slug: 'toyota-fortuner-2024', rank: 4, units: '2,900+', share: '5.6%', tag: 'Prestige SUV', why: 'Premium hilly-road SUV; top fleet & business choice' },
      { slug: 'hyundai-grand-i10-nios-fl-2024', rank: 5, units: '2,700+', share: '5.2%', tag: 'Budget Fav', why: 'Most affordable Hyundai; top Kathmandu taxi & family choice' },
      { slug: 'suzuki-wagon-r-2025', rank: 6, units: '2,500+', share: '4.8%', tag: 'Family Compact', why: 'Tallboy design loved by Nepalese families for urban travel' },
      { slug: 'byd-atto-3-2025', rank: 7, units: '2,200+', share: '4.2%', tag: '#1 EV SUV', why: 'Best-selling electric SUV; pioneer of Nepal EV boom' },
      { slug: 'toyota-hilux-2024', rank: 8, units: '2,100+', share: '4.0%', tag: '#1 Pickup', why: 'Unmatched for Nepal\'s mountain roads; commercial staple' },
      { slug: 'kia-seltos-2025', rank: 9, units: '1,900+', share: '3.7%', tag: 'Top Compact SUV', why: 'Premium features at mid-range price; youth favourite' },
      { slug: 'hyundai-ioniq-5-2024', rank: 10, units: '1,600+', share: '3.1%', tag: 'Top EV', why: 'Nepal\'s most awarded EV; 800V fast charge + V2L' },
      { slug: 'suzuki-swift-epic-2024', rank: 11, units: '1,500+', share: '2.9%', tag: 'City Staple', why: 'Most fuel-efficient petrol hatchback in its class' },
      { slug: 'suzuki-jimny-2025', rank: 12, units: '1,400+', share: '2.7%', tag: 'Cult Off-Road', why: 'Most sought-after lifestyle off-roader; strong resale' },
      { slug: 'byd-dolphin-2025', rank: 13, units: '1,300+', share: '2.5%', tag: 'City EV', why: 'Most affordable city EV with impressive 340 km range' },
      { slug: 'toyota-land-cruiser-prado-250-2024', rank: 14, units: '1,100+', share: '2.1%', tag: 'Luxury GC', why: 'Premium Prado; preferred by government & executives' },
      { slug: 'mahindra-scorpio-n-2025', rank: 15, units: '1,000+', share: '1.9%', tag: 'Value SUV', why: 'Body-on-frame SUV at an accessible price point' },
    ];

    function bestsellerCard(item, idx) {
      const car = CARS_DB.find(c => c.slug === item.slug);
      if (!car) return '';
      const img = car.images && car.images[0] ? car.images[0] : '';
      const price = car.variants && car.variants[0] ? window.Rs(car.variants[0].price) : 'On Request';
      const rankColors = ['#f59e0b', '#94a3b8', '#cd7c3a'];
      const rankColor = idx < 3 ? rankColors[idx] : 'var(--ink4)';
      return `
      <div style="display:flex;gap:16px;align-items:flex-start;padding:18px;background:var(--bg);border:1px solid var(--border);border-radius:16px;cursor:pointer;transition:box-shadow .2s,transform .2s" onclick="AV.openDetail('${car.slug}')" onmouseenter="this.style.boxShadow='0 8px 28px rgba(0,0,0,.10)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.boxShadow='none';this.style.transform='none'">
        <div style="font-size:28px;font-weight:800;color:${rankColor};min-width:40px;text-align:center;line-height:1">#${item.rank}</div>
        <img src="${img}" alt="${car.brand} ${car.model}" style="width:100px;height:70px;object-fit:cover;border-radius:10px;flex-shrink:0" loading="lazy">
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px">
            <div style="font-size:15px;font-weight:700;color:var(--ink1)">${car.brand} ${car.model}</div>
            <span style="font-size:10px;font-weight:700;padding:2px 8px;background:rgba(99,102,241,.12);color:#6366f1;border-radius:99px">${item.tag}</span>
          </div>
          <div style="font-size:12px;color:var(--ink3);margin-bottom:6px">${item.why}</div>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <span style="font-size:12px;font-weight:600;color:var(--brand)">${price}</span>
            <span style="font-size:12px;color:var(--ink4)">~${item.units} units/yr · ${item.share} market share</span>
          </div>
        </div>
      </div>`;
    }

    /* ─ NEW CARS LANDING PAGE ─ */
    function renderNewCarsPage() {
      document.title = 'New Cars in Nepal 2025–26 — AutoViindu';
      setNav('cars');

      const db = CARS_DB;
      const trending = [...db].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 10);
      const budgetFriendly = [...db].filter(c => { const p = c.variants && c.variants[0] ? c.variants[0].price : 0; return p && p <= 4000000; }).sort((a,b)=>((a.variants&&a.variants[0]?a.variants[0].price:0))-(b.variants&&b.variants[0]?b.variants[0].price:0)).slice(0,10);
      const evCars = db.filter(c => c.type === 'Electric');
      const latest = [...db].filter(c => c.year >= 2024).sort((a,b) => (b.year||0)-(a.year||0)||(b.reviews||0)-(a.reviews||0)).slice(0,10);

      const bodyTypes = [
        { label: 'SUV', filter: 'suv', icon: '🚙', count: db.filter(c => (c.body||'').toLowerCase().includes('suv')).length },
        { label: 'Hatchback', filter: 'hatchback', icon: '🚗', count: db.filter(c => (c.body||'').toLowerCase().includes('hatchback')).length },
        { label: 'Sedan', filter: 'sedan', icon: '🚘', count: db.filter(c => (c.body||'').toLowerCase().includes('sedan')).length },
        { label: 'Electric', filter: 'electric', icon: '⚡', count: evCars.length },
        { label: 'Pickup', filter: 'pickup', icon: '🛻', count: db.filter(c => (c.body||'').toLowerCase().includes('pickup')).length },
        { label: 'MPV', filter: 'mpv', icon: '🚐', count: db.filter(c => (c.body||'').toLowerCase().includes('mpv')).length },
        { label: 'Crossover', filter: 'crossover', icon: '🚗', count: db.filter(c => (c.body||'').toLowerCase().includes('crossover')).length },
        { label: 'Hybrid', filter: 'hybrid', icon: '🌿', count: db.filter(c => c.type === 'Hybrid').length },
      ];

      function sectionCarousel(id, cars) {
        return `<div class="home-carousel car-carousel" id="${id}">${cars.map(carCard).join('')}</div>`;
      }

      function carouselSection(id, eyebrow, title, subtitle, cars, cta, ctaAction, bg='') {
        return `
        <section style="padding:48px 0;${bg}" id="section-${id}">
          <div class="wrap">
            <div class="home-head" style="margin-bottom:24px">
              <div class="home-head__left">
                <span class="home-eyebrow">${eyebrow}</span>
                <h2 class="home-title">${title}</h2>
                ${subtitle ? `<p class="home-sub">${subtitle}</p>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:12px">
                <button type="button" class="home-link" onclick="${ctaAction}">${cta} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg></button>
                <div class="carousel-nav-arrows">
                  <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('${id}', -1)" aria-label="Prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
                  <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('${id}', 1)" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
                </div>
              </div>
            </div>
            ${sectionCarousel(id, cars)}
          </div>
        </section>`;
      }

      document.getElementById('app-root').innerHTML = `
      <!-- Page Hero -->
      <div class="page-hero" style="background:linear-gradient(135deg,#0a1628 0%,#0d2137 50%,#0a1628 100%);position:relative;overflow:hidden;padding:56px 0 48px">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(26,107,42,.18) 0%,transparent 60%);pointer-events:none"></div>
        <div class="wrap" style="position:relative;z-index:1">
          <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.7)">New Cars</span></div>
          <h1 style="font-family:var(--font-d);font-size:clamp(26px,5vw,42px);color:#fff;font-weight:800;margin:12px 0 8px;line-height:1.15">New Cars in Nepal<br><span style="color:#34d399">2025 – 26</span></h1>
          <p style="font-size:15px;color:rgba(255,255,255,.6);max-width:520px;line-height:1.6;margin-bottom:24px">${db.length} models with full specs, prices, variants, and EMI estimates — all in one place.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="AV.goTo('cars',{explore:true})" style="border-radius:99px;padding:12px 28px;font-size:14px">Browse All Cars →</button>
            <button class="btn" onclick="AV.goTo('cars',{filter:'electric'})" style="border-radius:99px;padding:12px 28px;font-size:14px;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)">⚡ Electric Only</button>
          </div>
          <!-- Quick stats -->
          <div style="display:flex;gap:28px;flex-wrap:wrap;margin-top:32px;padding-top:28px;border-top:1px solid rgba(255,255,255,.1)">
            <div><div style="font-size:22px;font-weight:800;color:#34d399">${db.length}</div><div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Total Models</div></div>
            <div style="width:1px;background:rgba(255,255,255,.12)"></div>
            <div><div style="font-size:22px;font-weight:800;color:#60a5fa">${evCars.length}</div><div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Electric Models</div></div>
            <div style="width:1px;background:rgba(255,255,255,.12)"></div>
            <div><div style="font-size:22px;font-weight:800;color:#f59e0b">${latest.length}</div><div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">2024–25 New</div></div>
            <div style="width:1px;background:rgba(255,255,255,.12)"></div>
            <div><div style="font-size:22px;font-weight:800;color:#a78bfa">${budgetFriendly.length}</div><div style="font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">Under 40L</div></div>
          </div>
        </div>
      </div>

      <!-- Browse by Type pills -->
      <div style="background:var(--bg);border-bottom:1px solid var(--border);padding:20px 0">
        <div class="wrap">
          <div style="display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px">
            ${bodyTypes.map(t => `
            <button onclick="AV.goTo('cars',{filter:'${t.filter}'})" style="flex-shrink:0;display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:99px;border:1px solid var(--border);background:var(--white);font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer;white-space:nowrap;transition:all .2s" onmouseenter="this.style.borderColor='var(--brand)';this.style.color='var(--brand)'" onmouseleave="this.style.borderColor='var(--border)';this.style.color='var(--ink2)'">
              <span>${t.icon}</span>${t.label} <span style="font-size:11px;color:var(--ink4);font-weight:400">(${t.count})</span>
            </button>`).join('')}
            <button onclick="AV.goTo('cars',{explore:true})" style="flex-shrink:0;display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:99px;border:1px solid var(--brand);background:var(--brand);font-size:13px;font-weight:700;color:#fff;cursor:pointer;white-space:nowrap">All Filters →</button>
          </div>
        </div>
      </div>

      <!-- Trending Cars -->
      ${trending.length ? carouselSection('nc-trending', 'Hot picks', 'Trending Cars', "Nepal's most searched &amp; discussed cars right now.", trending, 'View all', "AV.goTo('cars',{explore:true})") : ''}

      <!-- Budget Friendly -->
      ${budgetFriendly.length ? `
      <section style="padding:48px 0;background:linear-gradient(135deg,#f0fdf4,#ecfdf5)" id="section-nc-budget">
        <div class="wrap">
          <div class="home-head" style="margin-bottom:24px">
            <div class="home-head__left">
              <span class="home-eyebrow" style="color:#059669">Easy on the wallet</span>
              <h2 class="home-title" style="color:#064e3b">Budget Friendly Cars</h2>
              <p class="home-sub" style="color:#065f46">Great new cars available under Rs. 40L in Nepal — full specs and EMI.</p>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
              <button type="button" class="home-link" style="color:#059669" onclick="AV.goTo('cars',{budget:'under40'})">Browse all <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg></button>
              <div class="carousel-nav-arrows">
                <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('nc-budget', -1)" aria-label="Prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
                <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('nc-budget', 1)" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>
          </div>
          <div class="home-carousel car-carousel" id="nc-budget">${budgetFriendly.map(carCard).join('')}</div>
        </div>
      </section>` : ''}

      <!-- Electric Cars -->
      ${evCars.length ? `
      <section style="padding:48px 0;background:linear-gradient(135deg,#0f172a,#1e1b4b)" id="section-nc-ev">
        <div class="wrap">
          <div class="home-head" style="margin-bottom:24px">
            <div class="home-head__left">
              <span class="home-eyebrow" style="color:#818cf8">Future of driving</span>
              <h2 class="home-title" style="color:#fff">Electric Cars</h2>
              <p class="home-sub" style="color:rgba(255,255,255,.6)">${evCars.length} EV models with real range, fast charging, and V2L — hill-ready &amp; load-shedding smart.</p>
            </div>
            <div style="display:flex;align-items:center;gap:12px">
              <button type="button" class="home-link" style="color:#818cf8" onclick="AV.goTo('cars',{filter:'electric'})">All EVs <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="9 18 15 12 9 6"/></svg></button>
              <div class="carousel-nav-arrows">
                <button class="nav-arrow-btn prev" onclick="AV.scrollCarousel('nc-ev', -1)" aria-label="Prev"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
                <button class="nav-arrow-btn next" onclick="AV.scrollCarousel('nc-ev', 1)" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>
          </div>
          <div class="home-carousel car-carousel" id="nc-ev">${evCars.slice(0,10).map(carCard).join('')}</div>
        </div>
      </section>` : ''}

      <!-- Latest Arrivals -->
      ${latest.length ? carouselSection('nc-latest', 'Just landed', 'Latest Arrivals', 'Brand new 2024–25 models freshly available at Nepal showrooms.', latest, 'All latest', "AV.goTo('latest')", 'background:var(--bg2);') : ''}

      <!-- CTA: Browse All -->
      <div style="padding:48px 0;background:var(--bg)">
        <div class="wrap">
          <div style="background:linear-gradient(135deg,#1a6b2a,#0a3d16);border-radius:20px;padding:40px 32px;text-align:center;position:relative;overflow:hidden">
            <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:rgba(255,255,255,.04);border-radius:50%;pointer-events:none"></div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.6);margin-bottom:10px">Full inventory</div>
            <h2 style="font-size:clamp(20px,3vw,30px);font-weight:800;color:#fff;margin-bottom:8px">Browse All ${db.length} New Cars</h2>
            <p style="font-size:14px;color:rgba(255,255,255,.65);margin-bottom:24px;max-width:480px;margin-left:auto;margin-right:auto">Filter by brand, body type, budget, fuel type, transmission, and more.</p>
            <button class="btn" onclick="AV.goTo('cars',{explore:true})" style="background:#fff;color:#1a6b2a;font-weight:700;font-size:15px;border-radius:99px;padding:13px 36px;border:none;cursor:pointer">Browse All Cars →</button>
          </div>
        </div>
      </div>
      `;
      updateCmpBtns();
    }

    function renderBestSeller() {
      document.title = 'Best Sellers in Nepal 2025 — AutoViindu';
      setNav('bestseller');

      document.getElementById('app-root').innerHTML = `
      <div class="page-hero">
        <div class="wrap">
          <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:var(--ink-3)">Best Sellers</span></div>
          <h1 style="font-family:var(--font-d);font-size:clamp(22px,4vw,34px);color:var(--ink);font-weight:700;margin-bottom:6px">Best Sellers in Nepal 2025</h1>
          <p style="font-size:14px;color:var(--ink-3);max-width:560px">Nepal's most loved & trusted cars ranked by sales volume, market share, and owner satisfaction. Updated 2025.</p>
          <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:18px">
            <div style="text-align:center"><div style="font-size:24px;font-weight:800;color:#f59e0b">52,000+</div><div style="font-size:11px;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.5px">New Cars Sold (2024)</div></div>
            <div style="width:1px;background:rgba(255,255,255,.15)"></div>
            <div style="text-align:center"><div style="font-size:24px;font-weight:800;color:#10b981">38%</div><div style="font-size:11px;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.5px">SUV Market Share</div></div>
            <div style="width:1px;background:rgba(255,255,255,.15)"></div>
            <div style="text-align:center"><div style="font-size:24px;font-weight:800;color:#6366f1">12%</div><div style="font-size:11px;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.5px">EV Growth YoY</div></div>
          </div>
        </div>
      </div>
      <div class="wrap" style="padding-top:32px;padding-bottom:48px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
          <span style="width:4px;height:28px;background:var(--brand);border-radius:2px;display:block"></span>
          <div><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--brand)">Ranked by sales</div><div style="font-size:20px;font-weight:700;color:var(--ink1)">Top 15 Cars — Nepal 2025</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:40px">
          ${BESTSELLER_DATA.map((item, i) => bestsellerCard(item, i)).join('')}
        </div>
        <div style="background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:20px;padding:28px 24px">
          <div style="font-size:16px;font-weight:700;color:var(--ink);margin-bottom:4px"><i data-lucide="trophy"></i> Want to browse all cars?</div>
          <div style="font-size:13px;color:var(--ink-3);margin-bottom:16px">Filter by body type, budget, fuel type and more</div>
          <button class="btn btn-primary" onclick="AV.goTo('cars')" style="border-radius:99px;padding:10px 24px">Browse All New Cars →</button>
        </div>
      </div>
    `;
      updateCmpBtns();
    }

    /* ─ LATEST ARRIVALS ─ */
    function renderLatestArrivals() {
      document.title = 'Latest Arrivals — AutoViindu';
      renderCars('Latest Arrivals', { explore: false });
      window._sf.onlyLatest = true;
      window._sf.sort = 'year-desc';
      _sfApply();
    }


    /* ─ NAV ─ */
    function getNavOpts(page) {
      try {
        const item = sessionStorage.getItem('av-nav-opts');
        if (item) {
          const data = JSON.parse(item);
          if (data.page === page) {
            sessionStorage.removeItem('av-nav-opts');
            return data.opts || {};
          }
        }
      } catch (_) {}
      return {};
    }
    function setNav(p) {
      document.querySelectorAll('.hn-link').forEach(n => n.classList.remove('active'));
      const m = { home: 'nav-home', cars: 'nav-cars', electric: 'nav-electric', upcoming: 'nav-upcoming', used: 'nav-used', compare: 'nav-compare', services: 'nav-services' };
      if (m[p]) document.getElementById(m[p])?.classList.add('active');
    }
    function goTo(page, opts = {}) {
      clearInterval(heroTimer);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMM();
      const p = page || 'home';
      if (p === 'home') renderHome();
      else if (p === 'cars') renderCars(opts.filter || null, opts);
      else if (p === 'electric') renderCars('electric');
      else if (p === 'hybrid') renderCars('hybrid');
      else if (p === 'upcoming') renderUpcomingCars();
      else if (p === 'latest') renderLatestArrivals();
      else if (p === 'bestseller') renderBestSeller();
      else if (p === 'used') renderUsed(opts);
      else if (p === 'compare') renderCompare();
      else if (p === 'compare-used') renderCompareUsed();
      else if (p === 'services') renderServices();
      else if (p === 'tools') {
        const toolPages = {
          emi: 'caremi',
          loan: 'whatcarcanyouaffoard',
          afford: 'whatcarcanyouaffoard',
          matchmaker: 'whatcarcanyouaffoard',
          charging: 'chargingstation',
        };
        window.location.href = '/' + (toolPages[opts.tool] || 'caremi');
        return;
      }
      else renderHome();
      history.pushState({ page: p, opts }, '', `#${p}`);
    }
    function openDetail(slug, opts) {
      opts = opts || {};
      clearInterval(heroTimer);
      const car = carBySlug(slug);
      const needsFetch = car && !car.overview && window.AV_ensureCar;
      const root = document.getElementById('app-root');
      if (needsFetch && root) {
        root.innerHTML = '<div style="padding:64px 24px;text-align:center;color:var(--ink3)">Loading car details\u2026</div>';
      }
      // Save current filter/search state into the current history entry so Back restores it
      if (!opts.skipHistory && window._sf) {
        const currentState = history.state || {};
        if (!currentState.page || currentState.page === 'cars' || currentState.page === 'home' || currentState.page === 'electric' || currentState.page === 'hybrid') {
          history.replaceState(
            { page: 'cars', opts: { q: window._sf.q || '', brands: (window._sf.brands || []).slice(), fuels: (window._sf.fuels || []).slice(), bodies: (window._sf.bodies || []).slice() } },
            '',
            location.hash || '#cars'
          );
        }
      }
      const ready = window.AV_ensureCar
        ? window.AV_ensureCar(slug)
        : Promise.resolve(car);
      return ready.then(function (resolved) {
        if (!resolved) { goTo('cars'); return; }
        CARS_DB = window.CARS_DB || CARS_DB;
        renderDetail(slug);
        if (!opts.skipHistory) history.pushState({ page: 'detail', slug }, '', `#car/${slug}`);
      }).catch(function () { goTo('cars'); });
    }

    /* ─ SEARCH ─ */
    function buildSearchIdx(db) {
      return db.map(c => ({
        slug: c.slug,
        display: `${c.brand} ${c.model}`,
        searchText: `${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase(),
        image: (c.images && c.images[0]) || c.thumb || '',
        year: c.year,
        type: c.type,
        body: c.body,
        price: c.variants && c.variants[0] ? window.Rs(c.variants[0].price) : 'TBA',
      }));
    }
    let searchIdx = buildSearchIdx(CARS_DB);
    document.addEventListener('av:cars-updated', function () {
      CARS_DB = window.CARS_DB || [];
      USED = window.USED_CARS_DB || [];
      searchIdx = buildSearchIdx(CARS_DB);
    });
    let searchTimer = null;

    function initAppHeader() {
      const hsInput = document.getElementById('hs-input');
      const searchDD = document.getElementById('search-dd');
      if (!hsInput || hsInput.dataset.avAppInit) return;
      hsInput.dataset.avAppInit = '1';

      hsInput.addEventListener('input', e => {
        const v = e.target.value;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          if (v.length < 2) { showQS(); return }
          const q = v.toLowerCase();
          const res = searchIdx.filter(c => c.searchText.includes(q)).slice(0, 6);
          if (!res.length) { searchDD.innerHTML = `<div style="padding:18px;text-align:center;font-size:13px;color:var(--ink4)">No results for "<strong>${v}</strong>"</div>`; searchDD.classList.add('open') }
          else { searchDD.innerHTML = `<div class="sdd-hd">${res.length} results</div>${res.map(r => `<div class="sdd-item" onclick="AV.openDetail('${r.slug}');closeSD()"><img class="sdd-img" src="${r.image}" alt=""><div style="flex:1;min-width:0"><div class="sdd-name">${r.display}</div><div class="sdd-meta">${r.year} · ${r.type} · ${r.body}</div></div><div class="sdd-price">${r.price}</div></div>`).join('')}`; searchDD.classList.add('open') }
        }, 180);
      });
      hsInput.addEventListener('focus', () => showQS());
      hsInput.addEventListener('keydown', e => { if (e.key === 'Escape') closeSD(); if (e.key === 'Enter') { AV.goTo('cars', { q: hsInput.value }); closeSD() } });

      const mobSearchBtn2 = document.getElementById('mob-search-btn');
      const mobSearchBack2 = document.getElementById('mob-search-back');
      const headerIn2 = document.querySelector('.header-in');
      if (mobSearchBtn2 && mobSearchBack2 && headerIn2 && !mobSearchBtn2.dataset.avAppInit) {
        mobSearchBtn2.dataset.avAppInit = '1';
        mobSearchBtn2.addEventListener('click', e => {
          e.stopPropagation();
          headerIn2.classList.add('search-active');
          document.body.style.overflow = 'hidden';
          showQS();
          setTimeout(() => hsInput?.focus(), 100);
        });
        mobSearchBack2.addEventListener('click', e => {
          e.stopPropagation();
          closeSD();
        });
      }
    }

    function showQS() {
      const searchDD = document.getElementById('search-dd');
      if (!searchDD) return;
      const chips = ['MG Hector', 'IONIQ 5', 'Toyota Prius', 'Honda City', 'Kia Seltos', 'BYD Atto 3', 'Maruti Swift', 'Electric Cars'];
      searchDD.innerHTML = `<div class="sdd-hd">Popular Searches</div><div class="sdd-chip-row">${chips.map(t => `<span class="sdd-chip" onclick="AV.chipSearch('${t.replace(/'/g, "\\'")}');closeSD()">${t}</span>`).join('')}</div>`;
      searchDD.classList.add('open');
    }
    function chipSearch(term) {
      const hsInput = document.getElementById('hs-input');
      // Category shortcuts
      const categoryMap = { 'Electric Cars': 'electric', 'Hybrid Cars': 'hybrid', 'Petrol Cars': 'petrol', 'Diesel Cars': 'diesel' };
      if (categoryMap[term]) { goTo(categoryMap[term]); return; }
      // Search the index
      const q = term.toLowerCase();
      const res = searchIdx.filter(c => c.searchText.includes(q));
      if (res.length === 1) {
        // Exactly one match — open its detail page directly
        openDetail(res[0].slug);
      } else if (res.length > 1) {
        // Multiple matches — go to filtered cars list with the search query
        if (hsInput) hsInput.value = term;
        goTo('cars', { q: term });
      } else {
        // No match — open cars page with search pre-filled
        if (hsInput) hsInput.value = term;
        goTo('cars', { q: term });
      }
    }
    window.AV = window.AV || {};
    window.AV.chipSearch = chipSearch;
    function closeSD() {
      const searchDD = document.getElementById('search-dd');
      if (searchDD) searchDD.classList.remove('open');
      const h = document.querySelector('.header-in');
      if (h) h.classList.remove('search-active');
      document.body.style.overflow = '';
    }
    window.closeSD = closeSD;

    initAppHeader();
    document.addEventListener('av-chrome-ready', initAppHeader);
    document.addEventListener('click', e => {
      if (e.target.closest('#header-search-wrap') || e.target.closest('#mob-search-btn') || e.target.closest('#mob-search-back')) return;
      closeSD();
    });

    /* ─ POPSTATE ─ */
    window.addEventListener('popstate', e => {
      const hash = location.hash;
      const state = e.state || {};
      if (!hash || hash === '#home') renderHome();
      else if (hash.startsWith('#car/')) openDetail(hash.replace('#car/', ''), { skipHistory: true });
      else if (hash.startsWith('#used/')) renderUsedDetail(hash.replace('#used/', ''));
      else if (hash === '#cars' || hash === '#electric' || hash === '#hybrid' || hash === '#petrol' || hash === '#diesel') {
        // Restore the saved filter/search opts so Back returns to the same filtered view
        const navOpts = getNavOpts('cars');
        const savedOpts = (state.opts && Object.keys(state.opts).length) ? state.opts : navOpts;
        const savedFilter = state.filter || null;
        renderCars(savedFilter, savedOpts);
        // Restore search box value if there was a query
        if (savedOpts.q) {
          const lf = document.getElementById('lf-search');
          if (lf) { lf.value = savedOpts.q; }
        }
      }
      else if (hash === '#compare') renderCompare();
      else if (hash === '#compare-used') renderCompareUsed();
      else if (hash === '#services') renderServices();
      else if (hash === '#used') renderUsed(getNavOpts('used'));
      else renderHome();
    });

    /* ─ PUBLIC API ─ */
    window.AV = Object.assign(window.AV || {}, {
      carCard, goTo, openDetail, toggleCompare, toggleWish, clearCompare, cmpTab, cmpMode, cmpSearch, cmpFilterCondition, usedCmpSearch, usedToggleCompare, renderCompareUsed, toggleOverviewSpecs,
      switchDpTab: function(tabId, el) {
        document.querySelectorAll('.dp-tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.dp-tab-btn').forEach(b => b.classList.remove('active'));
        const pane = document.getElementById(tabId);
        if (pane) pane.classList.add('active');
        if (el) el.classList.add('active');
      },
      chipSearch,
      galNav, galSet, selectVariant, selectColor, dtab,
      updateEMI, setTenure, getVI,
      homeFilter, filterList, sortList,
      filterBrand(val, type) {
        val = val.toLowerCase();
        const list = document.querySelector('.' + type + '-brand-list');
        if (!list) return;
        const labels = list.querySelectorAll('label');
        labels.forEach(lbl => {
          const text = lbl.textContent.toLowerCase();
          lbl.style.display = text.includes(val) ? '' : 'none';
        });
      },
      swSearch, setHomeSearchTab, submitForm,
      heroNav, heroGo, updateCompareTray, recalcEmi, setTenure2,
      openUsedDetail, renderUsedDetail, filterUsed, sortUsed, chipFilterUsed, renderUsed, dpAccord,
      sfApply: _sfApply,
      sfLoadMore,
      ufLoadMore,
      sfToggle(type, val, el) {
        const arr = window._sf[type];
        const idx = arr.indexOf(val);
        if (idx === -1) arr.push(val); else arr.splice(idx, 1);
        el?.classList.toggle('sf-cb-active', arr.includes(val));
        _sfApply();
      },
      sfBudget(val, el) {
        window._sf.budget = window._sf.budget === val ? '' : val;
        document.querySelectorAll('.sf-budget-btn').forEach(b => b.classList.remove('active'));
        if (window._sf.budget) el?.classList.add('active');
        _sfApply();
      },
      sfSort(val) { window._sf.sort = val; _sfApply(); },
      sfSearch(val) { window._sf.q = val; _sfApply(); },
      sfPrice() {
        window._sf.budget = '';
        document.querySelectorAll('.sf-budget-btn').forEach(b => b.classList.remove('active'));
        const lo = document.getElementById('lf-price-lo'), hi = document.getElementById('lf-price-hi');
        if (lo) window._sf.minP = +lo.value;
        if (hi) window._sf.maxP = +hi.value;
        const loV = document.getElementById('lf-lo-val'), hiV = document.getElementById('lf-hi-val');
        if (loV) loV.textContent = 'Rs. ' + window._sf.minP + 'L';
        if (hiV) hiV.textContent = 'Rs. ' + window._sf.maxP + 'L';
        _sfApply();
      },
      sfClear() {
        const max = window._sf?._maxSlider || 600;
        window._sf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], transmissionsSub: [], drivetrains: [], years: [], minP: 0, maxP: max, sort: '', budget: '', mileage: [], _maxSlider: max, explore: true };
        document.querySelectorAll('.sf-budget-btn').forEach(b => b.classList.remove('active'));
        const lo = document.getElementById('lf-price-lo'), hi = document.getElementById('lf-price-hi');
        if (lo) lo.value = 0;
        if (hi) hi.value = max;
        const loV = document.getElementById('lf-lo-val'), hiV = document.getElementById('lf-hi-val');
        if (loV) loV.textContent = 'Rs. 0L';
        if (hiV) hiV.textContent = 'Rs. ' + max + 'L';
        const s = document.getElementById('lf-search');
        if (s) s.value = '';
        const sort = document.getElementById('lf-sort');
        if (sort) sort.value = '';
        _sfApply();
      },
      sfMobileToggle() {
        const p = document.getElementById('lf-sidebar');
        if (!p) return;
        const isOpen = p.classList.contains('lf-mob-open');
        p.classList.toggle('lf-mob-open', !isOpen);
        document.getElementById('lf-overlay')?.classList.toggle('lf-mob-open', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      },
      ufApply: _ufApply,
      ufSetHorizontal(key, val) {
        if (!val) {
          window._uf[key + 's'] = [];
        } else {
          window._uf[key + 's'] = [key === 'year' ? parseInt(val, 10) : val];
        }
        if (key === 'brand') {
           window._uf.models = [];
           const msel = document.getElementById('hs-model');
           if (msel) {
             msel.value = '';
             let models = [];
             if (val) {
               models = [...new Set(USED.filter(c => c.brand === val).map(c => c.model))].sort();
             } else {
               models = [...new Set(USED.map(c => c.model))].sort();
             }
             msel.innerHTML = '<option value="">Model</option>' + models.map(m => `<option value="${m}">${m}</option>`).join('');
           }
        }
        AV.ufApply();
      },
      ufApplyHorizontal() {
        AV.ufApply();
      },
      ufSetHorizontalSort(val) {
        window._uf.sort = val || '';
        // Sync sidebar sort dropdown
        const sortSel = document.getElementById('uf-sort');
        if (sortSel) sortSel.value = val || '';
        // Sync horizontal bar (in case called from sidebar)
        const hsSel = document.getElementById('hs-km');
        if (hsSel) hsSel.value = val || '';
        _ufApply();
      },
      ufSetHorizontalBudget(val) {
        window._uf.budget = val || '';
        // Clear price range sliders when budget pill is used
        window._uf.minP = 0;
        window._uf.maxP = window._uf._maxSlider;
        // Sync sidebar budget pills
        document.querySelectorAll('.uf-budget-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('onclick')?.includes(`'${val}'`) && !!val);
        });
        _ufApply();
      },
      ufToggle(type, val, el) { AV.sfToggle.call(AV, type, val, el); },
      ufBudget(val, el) {
        window._uf.budget = window._uf.budget === val ? '' : val;
        document.querySelectorAll('.uf-budget-btn').forEach(b => b.classList.remove('active'));
        if (window._uf.budget) el?.classList.add('active');
        _ufApply();
      },
      ufSort(val) {
        window._uf.sort = val;
        const hsSel = document.getElementById('hs-km');
        if (hsSel) hsSel.value = val || '';
        _ufApply();
      },
      ufSearch(val) { window._uf.q = val; _ufApply(); },
      ufPrice() {
        window._uf.budget = '';
        document.querySelectorAll('.uf-budget-btn').forEach(b => b.classList.remove('active'));
        const lo = document.getElementById('uf-price-lo'), hi = document.getElementById('uf-price-hi');
        if (lo) window._uf.minP = +lo.value;
        if (hi) window._uf.maxP = +hi.value;
        const loV = document.getElementById('uf-lo-val'), hiV = document.getElementById('uf-hi-val');
        if (loV) loV.textContent = 'Rs. ' + window._uf.minP + 'L';
        if (hiV) hiV.textContent = 'Rs. ' + window._uf.maxP + 'L';
        _ufApply();
      },
      ufClear() {
        const max = window._uf?._maxSlider || _usedMaxPrice;
        window._uf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], transmissionsSub: [], drivetrains: [], years: [], minP: 0, maxP: max, sort: '', budget: '', owners: [], mileage: [], _maxSlider: max, _priceKey: 'priceNum', explore: true };
        document.querySelectorAll('.uf-budget-btn').forEach(b => b.classList.remove('active'));
        const lo = document.getElementById('uf-price-lo'), hi = document.getElementById('uf-price-hi');
        if (lo) lo.value = 0;
        if (hi) hi.value = max;
        const loV = document.getElementById('uf-lo-val'), hiV = document.getElementById('uf-hi-val');
        if (loV) loV.textContent = 'Rs. 0L';
        if (hiV) hiV.textContent = 'Rs. ' + max + 'L';
        const s = document.getElementById('uf-search');
        if (s) s.value = '';
        const sort = document.getElementById('uf-sort');
        if (sort) sort.value = '';
        _ufApply();
      },
      yearFilterSelect(val, ns) {
        const state = ns === 'sf' ? window._sf : window._uf;
        state.years = val ? [+val] : [];
        if (ns === 'sf') _sfApply(); else _ufApply();
      },
      playCarVideo(videoSrc) {
        let v = videoSrc || "https://www.youtube.com/embed/YvQf4g9235I";
        let match = v.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
          let tMatch = v.match(/[?&]t=(\d+)s?/);
          v = `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
          if (tMatch) v += `&start=${tMatch[1]}`;
        }
        
        const ifr = document.createElement('iframe');
        ifr.src = v;
        ifr.style.width = '100%';
        ifr.style.height = '100%';
        ifr.style.position = 'absolute';
        ifr.style.top = '0';
        ifr.style.left = '0';
        ifr.style.zIndex = '20';
        ifr.setAttribute('frameborder', '0');
        ifr.setAttribute('allowfullscreen', 'true');
        ifr.setAttribute('allow', 'autoplay; encrypted-media');
        
        const gal = document.getElementById('gal-main');
        if(gal) {
          gal.innerHTML = '';
          gal.appendChild(ifr);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      ufMobileToggle() {
        const p = document.getElementById('uf-sidebar');
        if (!p) return;
        const isOpen = p.classList.contains('lf-mob-open');
        p.classList.toggle('lf-mob-open', !isOpen);
        document.getElementById('uf-overlay')?.classList.toggle('lf-mob-open', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      },
      openAcsUnlockModal(carId) {
        const ov = document.getElementById(`acs-unlock-overlay-${carId}`);
        if (ov) {
          ov.style.display = 'flex';
          requestAnimationFrame(() => ov.classList.add('open', 'show'));
          document.body.style.overflow = 'hidden';
        }
      },
      closeAcsUnlockModal(carId) {
        const ov = document.getElementById(`acs-unlock-overlay-${carId}`);
        if (ov) {
          ov.classList.remove('open', 'show');
          setTimeout(() => { ov.style.display = 'none'; }, 200);
        }
        document.body.style.overflow = '';
      },
      unlockAcsReport(event, carId) {
        event.preventDefault();
        const email = document.getElementById(`acs-email-${carId}`)?.value || '';
        const phone = document.getElementById(`acs-phone-${carId}`)?.value || '';
        if (!email || !phone) return;
        
        fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formId: 'acs-unlock',
            carId: carId,
            email: email,
            phone: phone
          })
        }).then(() => {
          sessionStorage.setItem(`acs_unlocked_${carId}`, '1');
          toast('ACS Report Unlocked!', 'success');
          AV.renderUsedDetail(carId);
        }).catch(err => {
          console.error(err);
          sessionStorage.setItem(`acs_unlocked_${carId}`, '1');
          toast('ACS Report Unlocked!', 'success');
          AV.renderUsedDetail(carId);
        });
      },
    });


    /* ─ INIT ─ */
    function init() {
      const hash = location.hash;
      if (hash.startsWith('#car/')) openDetail(hash.replace('#car/', ''));
      else if (hash.startsWith('#used/')) renderUsedDetail(hash.replace('#used/', ''));
      else if (hash === '#cars') { const navOpts = getNavOpts('cars'); renderCars(null, navOpts); }
      else if (hash === '#electric') renderCars('electric');
      else if (hash === '#compare') renderCompare();
      else if (hash === '#compare-used') renderCompareUsed();
      else if (hash === '#services') renderServices();
      else if (hash === '#used') renderUsed(getNavOpts('used'));
      else renderHome();
      lucide.createIcons();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();



    // AFTER — wrap everything in a function, call it from renderCompare()
    window._initCompareAnimation = function () {
      const track = document.getElementById('track');
      const car = document.getElementById('car');
      const shadow = document.getElementById('shadow');
      const speedLines = document.getElementById('speedLines');
      if (!track || !car) return; // ← guard: stop if elements don't exist

      const CAR_WIDTH = 100;
      let pos = 0, direction = 1, turning = false;
      let scaleX = -1, scaleY = 1, bouncePhase = 0;
      let speed = 1.6, turnProgress = 0;

      function getTrackWidth() { return track.offsetWidth; }

      function setCarTransform(x, scX, scY, bounce) {
        car.style.left = x + 'px';
        car.style.transform = `scaleX(${scX}) scaleY(${scY}) translateY(${bounce}px)`;
        car.style.transformOrigin = 'center bottom';
        shadow.style.left = (x + CAR_WIDTH / 2 - 30) + 'px';
        shadow.style.transform = `scaleX(${Math.abs(scX) * (1 + Math.abs(bounce) * 0.04)})`;
        speedLines.style.left = direction === 1
          ? (x - 28) + 'px'
          : (x + CAR_WIDTH + 4) + 'px';
      }

      function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

      function animate() {
        const trackW = getTrackWidth();
        const maxX = trackW - CAR_WIDTH - 8;
        bouncePhase += 0.08;
        const bounce = -Math.abs(Math.sin(bouncePhase)) * 2.5;

        if (turning) {
          turnProgress += 0.045;
          const t = easeInOut(Math.min(turnProgress, 1));
          const midScale = Math.cos(t * Math.PI);
          const currentScaleX = direction === 1 ? -midScale : midScale;
          const squish = 1 + Math.abs(midScale < 0 ? midScale * 0.08 : 0);
          setCarTransform(pos, currentScaleX, squish, bounce * 0.3);
          shadow.style.opacity = 0.5 + Math.abs(midScale) * 0.5;
          if (turnProgress >= 1) { turning = false; turnProgress = 0; scaleX = direction === 1 ? 1 : -1; }
          speedLines.style.opacity = 0;
        } else {
          pos += direction * speed;
          setCarTransform(pos, scaleX, scaleY, bounce);
          shadow.style.opacity = '0.7';
          speedLines.style.opacity = speed > 1 ? '0.7' : '0';
          if (pos >= maxX) { pos = maxX; direction = -1; turning = true; turnProgress = 0; speed = 1.6 + Math.random() * 0.4; }
          else if (pos <= 4) { pos = 4; direction = 1; turning = true; turnProgress = 0; speed = 1.6 + Math.random() * 0.4; }
        }
        requestAnimationFrame(animate);
      }

      pos = 4; scaleX = 1;
      animate();
    };

  } // startApp

  const dataReady = window.AV_DATA_READY;
  if (dataReady && typeof dataReady.then === 'function') {
    dataReady.then(startApp).catch(function (err) {
      console.error('[AutoViindu] Failed to load car data:', err);
      startApp();
    });
  } else {
    startApp();
  }
})();

    /* ── LUCIDE AUTO-RENDER ── */
    if (typeof lucide !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const m of mutations) {
          if (m.addedNodes.length) {
            for (const n of m.addedNodes) {
              if (n.nodeType === 1 && (n.hasAttribute('data-lucide') || n.querySelector('[data-lucide]'))) {
                shouldUpdate = true;
                break;
              }
            }
          }
          if (shouldUpdate) break;
        }
        if (shouldUpdate) {
          observer.disconnect();
          lucide.createIcons();
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      lucide.createIcons();
    }
