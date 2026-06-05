
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
  const USED = window.USED_CARS_DB || [];

  const Rs = n => n >= 100000 ? `Rs. ${(n / 100000).toFixed(2)}L` : `Rs. ${n.toLocaleString()}`;
  window.Rs = Rs;
  const calcEMI = (p, ar, m) => { const r = ar / 12 / 100; return r === 0 ? p / m : p * (r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1) };
  const carBySlug = s => CARS_DB.find(c => c.slug === s);
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
    t.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span>${msg}`;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  /* ─ COMPARE ─ */
  function toggleCompare(slug) {
    const car = carBySlug(slug); if (!car) return;
    const idx = compareList.indexOf(slug);
    if (idx > -1) { compareList.splice(idx, 1); toast(`${car.brand} ${car.model} removed`) }
    else { if (compareList.length >= 3) { toast('Max 3 cars', 'error'); return } compareList.push(slug); toast(`${car.brand} ${car.model} added to compare`, 'success') }
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
    let h = compareList.map(s => { const c = carBySlug(s); if (!c) return ''; return `<div class="cmp-slot"><img src="${c.images[0]}" alt=""><span>${c.brand} ${c.model}</span><span class="cmp-rm" onclick="AV.toggleCompare('${s}')">✕</span></div>` }).join('');
    if (compareList.length < 3) h += `<div class="cmp-add">+ Add car</div>`;
    slots.innerHTML = h;
  }
  function updateCmpBtns() {
    document.querySelectorAll('[data-cmp]').forEach(b => {
      const inList = compareList.includes(b.dataset.cmp);
      b.textContent = inList ? '✓ Added' : '+ Compare';
      b.classList.toggle('added', inList);
    });
  }

  (function () {
    var menus = ['cars', 'used', 'compare', 'services', 'videos'];

    menus.forEach(function (id) {
      var btn = document.getElementById('mm-' + id + '-btn');
      var sub = document.getElementById('mm-' + id + '-sub');
      if (!btn || !sub) return;

      btn.addEventListener('click', function () {
        var isOpen = sub.classList.contains('open');

        // Close all open submenus
        menus.forEach(function (otherId) {
          var otherSub = document.getElementById('mm-' + otherId + '-sub');
          var otherBtn = document.getElementById('mm-' + otherId + '-btn');
          if (otherSub) otherSub.classList.remove('open');
          if (otherBtn) otherBtn.classList.remove('open');
        });

        // Open this one if it was closed
        if (!isOpen) {
          sub.classList.add('open');
          btn.classList.add('open');
        }
      });
    });
  })();
  /* ─ WISHLIST ─ */
  function toggleWish(slug, btn) {
    const idx = wishlist.indexOf(slug);
    if (idx > -1) wishlist.splice(idx, 1); else wishlist.push(slug);
    if (btn) btn.classList.toggle('active', wishlist.includes(slug));
  }

  /* ─ CAR CARD ─ */
  const badgeCls = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-popular', new: 'badge-new', trending: 'badge-trending' };
  const badgeLbl = { ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New', trending: 'Trending' };

  const carIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><path d="M5 12h14"/></svg>`;

  function carCard(car) {
    const inCmp = compareList.includes(car.slug);
    const badge = car.badge ? `<span class="cc-badge ${badgeCls[car.badge] || 'badge-popular'}">${badgeLbl[car.badge] || ''}</span>` : '';
    const isWished = wishlist.includes(car.slug);

    return `<div class="car-card" onclick="AV.openDetail('${car.slug}')">

    <div class="cc-img">
      <div class="cc-top-bar">
        <div class="cc-top-left">
          ${badge}
          <span class="cc-top-name">${car.brand} ${car.model}</span>
        </div>
        <button class="cc-wish ${isWished ? 'active' : ''}" onclick="event.stopPropagation();AV.toggleWish('${car.slug}',this)">${IC.heart}</button>
      </div>
      <img src="${car.images[0]}" alt="${car.brand} ${car.model}" loading="lazy">
    </div>

    <div class="cc-body">
      <div class="cc-name">${car.brand} ${car.model}</div>
      <div class="cc-variant">${car.year} · ${car.body}</div>

      <div class="cc-price-block">
        <div class="cc-price-line">Price <strong>${window.Rs(car.variants[0].price)}</strong></div>
        <div class="cc-emi">EMI From <strong>Rs. ${car.baseEMI.toLocaleString()}/mo</strong></div>
        <div class="cc-actions">
          <button class="cc-btn-f" onclick="event.stopPropagation();alert('Call: +977-9701076240')">Get Price</button>
          <button class="cc-btn-o ${inCmp ? 'added' : ''}" onclick="event.stopPropagation();AV.toggleCompare('${car.slug}')">
            ${carIcon} ${inCmp ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </div>

  </div>`;
  }


  /* ─ HOME ─ */

  const HERO_SLIDES = [
    {
      bg: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&h',
      badge: 'New Arrival 2024',
      title: 'Hyundai<br><em>IONIQ 5</em>',
      sub: 'Nepal\'s best EV. 481 km range, V2L for load-shedding, 800V ultra-fast charging.',
      offer: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M14.615 1.595a.75.75 0 0 1 .36.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143z"/>
      </svg>`,
        label: 'EV Offer', val: 'Zero road tax + Free home charger'
      },
      slug: 'hyundai-ioniq5'
    },
    {
      bg: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1400&h=700&fit=crop',
      badge: 'Best Seller',
      title: 'Hyundai<br><em>Creta</em>',
      sub: 'Nepal\'s #1 mid-size SUV. 160 bhp, dual 10.25" screens, Level 2 ADAS.',
      offer: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 12v10H4V12"/>
        <path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>`,
        label: 'Festival Offer', val: 'Rs. 2L cashback + Free accessories'
      },
      slug: 'hyundai-creta'
    },
    {
      bg: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&h=700&fit=crop',
      badge: 'Hill Conqueror',
      title: 'Toyota<br><em>Fortuner</em>',
      sub: '221mm ground clearance, 500 Nm diesel torque. No road is too rough.',
      offer: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 20 L8.5 8 L12 13 L15.5 7 L21 20 Z"/>
        <path d="M1 20h22"/>
      </svg>`,
        label: 'Nepal Special', val: '5-year extended warranty'
      },
      slug: 'toyota-fortuner'
    },
    {
      bg: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1400&h=700&fit=crop',
      badge: 'Fuel Champion',
      title: 'Toyota<br><em>Prius PHEV</em>',
      sub: '40+ km/l with solar roof. 26 km pure EV range for your daily commute.',
      offer: {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>`,
        label: 'Green Deal', val: 'Free solar charging installation'
      },
      slug: 'toyota-prius'
    },
  ];
  const BASE = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/';

  const BRANDS = [
    { name: 'Hyundai', count: '165 cars', logo: `${BASE}hyundai.png` },
    { name: 'Suzuki', count: '81 cars', logo: `${BASE}suzuki.png` },
    { name: 'Tata', count: '64 cars', logo: `${BASE}tata.png` },
    { name: 'Ford', count: '57 cars', logo: `${BASE}ford.png` },
    { name: 'Kia', count: '50 cars', logo: `${BASE}kia.png` },
    { name: 'Toyota', count: '28 cars', logo: `${BASE}toyota.png` },
    { name: 'Nissan', count: '28 cars', logo: `${BASE}nissan.png` },
    { name: 'Maruti Suzuki', count: '21 cars', logo: `${BASE}maruti-suzuki.png` },
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
      bg: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=220&fit=crop', // compact hatchback
      overlay: 'linear-gradient(135deg,rgba(15,118,110,.88),rgba(6,78,59,.75))',   // teal-green (budget/eco)
    },
    {
      label: 'Rs. 30L–50L',
      count: '34 cars',
      filter: 'budget-50',
      examples: 'Hyundai Venue · Tata Nexon · Kia Sonet',
      bg: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=400&h=220&fit=crop', // compact SUV
      overlay: 'linear-gradient(135deg,rgba(37,99,235,.88),rgba(29,78,216,.75))',   // royal blue (mid range)
    },
    {
      label: 'Rs. 50L–80L',
      count: '28 cars',
      filter: 'budget-80',
      examples: 'Hyundai Creta · Kia Seltos · MG Hector',
      bg: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=220&fit=crop', // mid SUV
      overlay: 'linear-gradient(135deg,rgba(202,138,4,.88),rgba(161,98,7,.75))',    // amber-gold (popular segment)
    },
    {
      label: 'Rs. 80L–1.2Cr',
      count: '18 cars',
      filter: 'budget-120',
      examples: 'Toyota Fortuner · Hyundai Tucson · Kia Sportage',
      bg: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=220&fit=crop', // full-size SUV
      overlay: 'linear-gradient(135deg,rgba(124,45,18,.88),rgba(154,52,18,.75))',   // burnt orange (premium)
    },
    {
      label: 'Rs. 1.2Cr–2Cr',
      count: '11 cars',
      filter: 'budget-200',
      examples: 'BMW 3 Series · Mercedes C-Class · Audi A4',
      bg: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=220&fit=crop', // luxury sedan
      overlay: 'linear-gradient(135deg,rgba(30,27,75,.9),rgba(49,46,129,.78))',     // deep indigo (luxury)
    },
    {
      label: 'Above Rs. 2Cr',
      count: '9 cars',
      filter: 'budget-2cr+',
      examples: 'BMW X5 · Mercedes GLE · Land Cruiser 300',
      bg: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=220&fit=crop', // ultra-luxury
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

  function renderHome() {
    document.title = 'AutoViindu — Find Your Perfect Car in Nepal';
    setNav('home');
    const db = CARS_DB;
    const evCars = db.filter(c => c.type === 'Electric');
    document.getElementById('app-root').innerHTML = window.buildHomePageHTML({
      db, evCars, carCard, BRANDS, BUDGETS, HERO_SLIDES, IC
    });
    updateCompareTray();
    updateCmpBtns();
    startHeroTimer();
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
        label: '🚕 Taxi Horn',
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
        label: '🚗 Hatchback Beep',
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
        label: '🚛 Truck Air Horn',
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
        label: '🚙 Sedan Horn',
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
        label: '🚗 Car Horn (Real)',
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
        label: '🚨 Traffic Horn (Urgent)',
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
        label: '🚐 SUV Horn',
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
      t.textContent = label + ' 📯';
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

  function swSearch() {
    const brand = document.getElementById('sw-brand')?.value;
    const fuel = document.getElementById('sw-fuel')?.value;
    const opts = {};
    if (fuel) opts.filter = fuel;
    if (brand) opts.brand = brand;
    AV.goTo('cars', opts);
  }

  function homeFilter(type, btn) {
    document.querySelectorAll('#home-chips .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const filtered = type === 'All' ? CARS_DB : CARS_DB.filter(c => {
      if (type === 'Electric') return c.type === 'Electric';
      if (type === 'Hybrid') return c.type === 'Hybrid';
      if (type === 'Petrol') return c.type === 'Petrol';
      if (type === 'Diesel') return c.type === 'Diesel';
      if (type === 'SUV') return c.body === 'SUV';
      if (type === 'Sedan') return c.body === 'Sedan';
      if (type === 'Hatchback') return c.body === 'Hatchback';
      return true;
    });
    const g = document.getElementById('home-grid');
    if (g) g.innerHTML = filtered.map(c => carCard(c)).join('');
    updateCmpBtns();
  }

  /* ─ HERO CAROUSEL ─ */
  function heroNav(dir) { heroGo((heroIdx + dir + HERO_SLIDES.length) % HERO_SLIDES.length) }
  function heroGo(idx) {
    heroIdx = idx;
    const slides = document.getElementById('hero-slides');
    if (slides) slides.style.transform = `translateX(-${idx * 100}%)`;
    document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    resetHeroTimer();
  }
  function startHeroTimer() {
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
  function buildGallery(car, containerId) {
    galIdx = 0;
    const el = document.getElementById(containerId); if (!el) return;
    const imgs = car.images;
    el.innerHTML = `
    <div class="gallery-main" id="gal-main">
      <img id="gal-img" src="${imgs[0]}" alt="${car.brand} ${car.model}">
      ${imgs.length > 1 ? `
        <button class="gal-prev" onclick="AV.galNav(-1,'${car.slug}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button class="gal-next" onclick="AV.galNav(1,'${car.slug}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>` : ''}
      <div class="gal-count" id="gal-count">${galIdx + 1}/${imgs.length}</div>
    </div>
    <div class="gallery-thumbs">
      ${imgs.map((img, i) => `<div class="g-thumb ${i === 0 ? 'active' : ''}" onclick="AV.galSet(${i},'${car.slug}')"><img src="${img}" loading="lazy"></div>`).join('')}
    </div>`;
  }
  function galNav(dir, slug) {
    const car = carBySlug(slug); if (!car) return;
    galIdx = (galIdx + dir + car.images.length) % car.images.length;
    const img = document.getElementById('gal-img');
    if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = car.images[galIdx]; img.style.opacity = '1' }, 200) }
    document.querySelectorAll('.g-thumb').forEach((t, i) => t.classList.toggle('active', i === galIdx));
    const c = document.getElementById('gal-count'); if (c) c.textContent = `${galIdx + 1}/${car.images.length}`;
  }
  function galSet(idx, slug) {
    const car = carBySlug(slug); if (!car) return;
    galIdx = idx;
    const img = document.getElementById('gal-img');
    if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = car.images[idx]; img.style.opacity = '1' }, 200) }
    document.querySelectorAll('.g-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
    const c = document.getElementById('gal-count'); if (c) c.textContent = `${idx + 1}/${car.images.length}`;
  }


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
    const dp = 20, dt = 60, dr = 10.5;
    const loan = vr.price * (1 - dp / 100);
    const emi = calcEMI(loan, dr, dt);
    const tot = emi * dt;
    const intr = tot - loan;
    return `
    <div class="dp-emi-title">EMI estimate</div>
    <div class="dp-emi-field">
      <div class="dp-emi-label">Down payment <span class="val" id="emi-dp-val">${dp}%</span></div>
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
      <div class="dp-emi-amount" id="emi-amount">Rs. ${Math.round(emi).toLocaleString()}</div>
      <div style="font-size:11px;color:var(--ink4)">/month</div>
    </div>
    <div class="dp-emi-break">
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-loan">${Rs(Math.round(loan))}</div><div class="dp-emi-bd-lbl">Loan amount</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-int">${Rs(Math.round(intr))}</div><div class="dp-emi-bd-lbl">Interest</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="emi-tot">${Rs(Math.round(tot))}</div><div class="dp-emi-bd-lbl">Total payable</div></div>
      <div class="dp-emi-bd"><div class="dp-emi-bd-val">${window.Rs(vr.price)}</div><div class="dp-emi-bd-lbl">Vehicle price</div></div>
    </div>
    <button onclick="alert('Finance: +977-9701076240')" class="dp-cta-ghost" style="margin-top:10px">Apply for finance</button>`;
  }
  function updateEMI(slug, vi, dp, ten, rate) {
    const car = carBySlug(slug); if (!car) return;
    const vr = car.variants[vi];
    const loan = vr.price * (1 - dp / 100);
    const emi = calcEMI(loan, rate, ten);
    const total = emi * ten;
    const interest = total - loan;
    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v };
    s('emi-amount', `Rs. ${Math.round(emi).toLocaleString()}`);
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
    const dp = +(document.getElementById('emi-dp')?.value || 20);
    const ten = +(document.getElementById('emi-ten-val')?.textContent || 60);
    const r = +(document.getElementById('emi-rate')?.value || 10.5);
    const loan = vr.price * (1 - dp / 100);
    const emi = calcEMI(loan, r, ten);
    const tot = emi * ten;
    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v };
    s('emi-amount', `Rs. ${Math.round(emi).toLocaleString()}`);
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
  function dpAccord(hd) {
    hd.closest('.dp-accord-wrap').classList.toggle('open');
  }

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
    };
    const svgI = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${_P[k]}</svg>`;

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
      const sp = k => v.specs?.[k] || car.specs?.[k];
      return [
        ['Power', sp('Power') || sp('Motor Power')],
        ['Torque', sp('Torque')],
        ['Efficiency', sp('Fuel Efficiency') || sp('Range (WLTP)')],
        ['0–100 km/h', sp('0–100 km/h')],
        ['Top Speed', sp('Top Speed')],
        ['Seating', sp('Seating')],
      ].filter(([, val]) => val).map(([l, val]) => `
      <div class="dp-qs-cell">
        <div class="dp-qs-val">${val}</div>
        <div class="dp-qs-lbl">${l}</div>
      </div>`).join('');
    }

    /* ── Variant tabs ── */
    function varTabs() {
      return car.variants.map((v, i) => `
      <div class="dp-var-tab${i === vi() ? ' active' : ''}" onclick="AV.switchVariant('${slug}',${i})">
        <div class="dp-var-tab-name">${v.name}</div>
        <div class="dp-var-tab-price">${window.Rs(v.price)}</div>
        ${v.popular ? '<div class="dp-var-tab-best">★ Best Value</div>' : ''}
      </div>`).join('');
    }

    /* ── Spec table (merges car + variant specs) ── */
    function specTable(v) {
      const merged = Object.assign({}, car.specs, v.specs || {});
      return `<table class="dp-spec-table">
      ${Object.entries(merged).map(([k, val]) => `<tr><td>${k}</td><td>${val}</td></tr>`).join('')}
    </table>`;
    }

    /* ── Features / highlights grid ── */
    function featGrid(v) {
      const all = [...new Set([...(v.features || []), ...(car.highlights || [])])];
      if (!all.length) return `<p style="font-size:13px;color:var(--ink4)">No feature data for this variant.</p>`;
      return `<div class="dp-feat-grid">
      ${all.map(f => `<div class="dp-feat-item"><div class="dp-feat-chk">${svgI('chk')}</div><span>${f}</span></div>`).join('')}
    </div>`;
    }

    /* ── Colour swatches ── */
    function colSection() {
      return `<div class="dp-colors" id="dp-cols">
      ${car.colors.map((c, i) => `
        <div class="dp-color-swatch${i === 0 ? ' active' : ''}" onclick="AV.pickColor(this,'${c.name}')">
          <div class="dp-color-dot" style="background:${c.hex}"></div>
          <div class="dp-color-name">${c.name}</div>
        </div>`).join('')}
    </div>
    <div style="font-size:13px;color:var(--ink3);margin-top:10px">
      Selected: <strong id="dp-color-name">${car.colors[0].name}</strong>
    </div>`;
    }

    /* ── EMI calculator HTML (prefix keeps desktop & mobile IDs unique) ── */
    function emiHTML(v, pfx) {
      const dp = 20, dt = 60, dr = 10.5;
      const loan = v.price * (1 - dp / 100);
      const emi = calcEMI(loan, dr, dt);
      const tot = emi * dt, intr = tot - loan;
      return `
      <div class="dp-emi-field">
        <div class="dp-emi-label">Down payment <span class="val" id="${pfx}-dpv">${dp}%</span></div>
        <input type="range" min="10" max="60" step="5" value="${dp}" id="${pfx}-dp"
          oninput="document.getElementById('${pfx}-dpv').textContent=this.value+'%';AV.emiCalc('${slug}','${pfx}')">
      </div>
      <div class="dp-emi-field">
        <div class="dp-emi-label">Tenure <span class="val"><span id="${pfx}-ten">${dt}</span> months</span></div>
        <div class="tenure-btns">
          ${[12, 24, 36, 48, 60, 72, 84].map(m => `<button class="ten-btn${m === dt ? ' active' : ''}"
            onclick="this.closest('.tenure-btns').querySelectorAll('.ten-btn').forEach(b=>b.classList.remove('active'));
                     this.classList.add('active');
                     document.getElementById('${pfx}-ten').textContent=${m};
                     AV.emiCalc('${slug}','${pfx}')">${m}m</button>`).join('')}
        </div>
      </div>
      <div class="dp-emi-field">
        <div class="dp-emi-label">Interest rate <span class="val" id="${pfx}-ratev">${dr}%</span></div>
        <input type="range" min="7" max="18" step="0.5" value="${dr}" id="${pfx}-rate"
          oninput="document.getElementById('${pfx}-ratev').textContent=this.value+'%';AV.emiCalc('${slug}','${pfx}')">
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
        <div class="dp-emi-bd"><div class="dp-emi-bd-val">${window.Rs(v.price)}</div><div class="dp-emi-bd-lbl">Vehicle price</div></div>
      </div>
      <button onclick="alert('Finance: +977-9701076240')" class="dp-cta-ghost" style="margin-top:10px;width:100%">Apply for finance →</button>`;
    }

    /* ── Sidebar card ── */
    function sidebarHTML() {
      const v = vr();
      return `<div class="dp-scard">
      <div class="dp-price-box">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:4px">Ex-showroom price</div>
        <div class="dp-price-main" id="dp-price-d">${window.Rs(v.price)}</div>
        <div class="dp-price-note" id="dp-var-note">${v.name} · Contact for on-road price</div>
        <div class="dp-cta-stack">
          <button class="dp-cta-primary" onclick="alert('+977-9701076240')">Get best price</button>
          <button class="dp-cta-gold" onclick="alert('Test drive: +977-9701076240')">Book test drive</button>
          <button class="dp-cta-ghost" id="cmp-sb" onclick="AV.toggleCompare('${slug}')">
            ${compareList.includes(slug) ? '✓ In compare' : '+ Add to compare'}
          </button>
        </div>
      </div>
      <div class="dp-emi-box">
        <div class="dp-emi-hd">${svgI('calc')} EMI Calculator</div>
        <div id="emi-sb-wrap">${emiHTML(v, 'sb')}</div>
      </div>
      <div class="dp-contact-row">
        ${svgI('ph')} <a href="tel:+9779701076240">+977-9701076240</a>&nbsp;·&nbsp;Mon–Sat 9am–6pm
      </div>
    </div>`;
    }

    /* ── Accordion builder ── */
    function accord(id, iconKey, title, body, open = false) {
      return `<div class="dp-accord-wrap${open ? ' open' : ''}" id="${id}">
      <div class="dp-accord-hd" onclick="dpAccord(this)">
        <div class="dp-accord-title">${svgI(iconKey)} ${title}</div>
        <div class="dp-accord-arr">${svgI('chev')}</div>
      </div>
      <div class="dp-accord-body">${body}</div>
    </div>`;
    }

    /* ── Pros & Cons body ── */
    function pcBody() {
      return `<div class="dp-pc-grid">
      ${car.pros ? `<div class="dp-pros"><div class="dp-pc-title" style="color:#16a34a">✓ Best features</div>
        ${car.pros.map(p => `<div class="dp-pc-item"><span style="color:#16a34a;flex-shrink:0">${IC.check}</span>${p}</div>`).join('')}
      </div>`: ''}
      ${car.cons ? `<div class="dp-cons"><div class="dp-pc-title" style="color:#dc2626">Considerations</div>
        ${car.cons.map(p => `<div class="dp-pc-item"><span style="color:#dc2626;flex-shrink:0">—&nbsp;</span>${p}</div>`).join('')}
      </div>`: ''}
    </div>
    <div class="dp-score-bar" style="margin-top:12px">
      <div class="dp-score-num">${car.expertScore}</div>
      <div style="flex:1">
        <div style="font-size:12.5px;font-weight:700;color:var(--ink);margin-bottom:6px">AutoViindu expert score</div>
        <div style="height:6px;background:var(--bg3);border-radius:var(--pill);overflow:hidden">
          <div style="height:100%;width:${car.expertScore * 10}%;background:var(--g3);border-radius:var(--pill)"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--ink5);margin-top:3px">
          <span>Poor</span><span>Good</span><span>Excellent</span>
        </div>
      </div>
    </div>`;
    }

    /* ── Similar cars ── */
    function similarCars() {
      const similar = CARS_DB.filter(c => c.slug !== slug && (c.body === car.body || c.type === car.type)).slice(0, 4);
      if (!similar.length) return '';
      return `<div class="dp-similar">
      <div class="section-hd">Similar cars</div>
      <div class="cars-grid" style="grid-template-columns:repeat(2,1fr)">
        ${similar.map(c => carCard(c)).join('')}
      </div>
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

      <!-- Quick stats horizontal strip -->
      <div class="dp-qs-strip" id="dp-qs">${qsStrip(v0)}</div>

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

      <!-- Key info grid with icons -->
      <div class="dp-ki-wrap"><div class="dp-ki-grid" id="dp-ki">${kiGrid(v0)}</div></div>

      ${car.tagline || car.overview ? `
      <div style="padding:14px 16px;background:var(--white);border-bottom:1px solid var(--border)">
        ${car.tagline ? `<p style="font-size:14px;color:var(--ink3);line-height:1.75;font-style:italic;margin-bottom:${car.overview ? '10px' : '0'}">"${car.tagline}"</p>` : ''}
        ${car.overview ? `<p style="font-size:13.5px;color:var(--ink3);line-height:1.85;margin:0">${car.overview}</p>` : ''}
      </div>`: ''}

      <!-- Specifications (open by default) -->
      ${accord('acc-spec', 'list', 'Specifications', `<div id="spec-body">${specTable(v0)}</div>`, true)}

      <!-- Features & Highlights -->
      ${(v0.features || car.highlights || []).length ? accord('acc-feat', 'feat', 'Features & Highlights', `<div id="feat-body">${featGrid(v0)}</div>`) : ''}

      <!-- Available Colours -->
      ${accord('acc-col', 'col', `Available Colours <span style="font-size:11px;color:var(--ink4);font-weight:600">(${car.colors.length})</span>`, colSection())}

      <!-- EMI Calculator — mobile accordion, hidden on desktop -->
      <div class="dp-mob-emi-acc">
        ${accord('acc-emi', 'calc', 'EMI Calculator', `<div id="emi-mob-wrap">${emiHTML(v0, 'mob')}</div>`)}
      </div>

      <!-- Pros & Cons / Expert score -->
      ${(car.pros || car.cons) ? accord('acc-pc', 'pros', 'Pros & Highlights', pcBody()) : ''}

      <!-- Similar cars -->
      ${similarCars()}
    </div>

    <!-- ═══ RIGHT: sticky sidebar (desktop only) ═══ -->
    <div class="dp-sidebar" id="dp-sidebar">
      ${sidebarHTML()}
    </div>
  </div>

  <!-- Mobile sticky bottom bar -->
  <div class="dp-mob-bar">
    <div class="dp-mob-price">
      <div class="dp-mob-price-lbl">Ex-showroom from</div>
      <div class="dp-mob-price-val" id="dp-mob-price">${window.Rs(v0.price)}</div>
    </div>
    <div class="dp-mob-btns">
      <button class="dp-mob-btn-g" onclick="alert('Test drive: +977-9701076240')">Test Drive</button>
      <button class="dp-mob-btn-p" onclick="alert('+977-9701076240')">Get Price</button>
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
  }
  /* keep old dtab working for anything still calling it */
  function dtab(btn, paneId) { dpTab(btn, paneId); }

  /* ── LISTING FILTER HELPERS ── */
  const _budgetMap = { u20: [0, 2000000], u40: [0, 4000000], u60: [0, 6000000], u100: [0, 10000000], u200: [0, 20000000], above200: [20000000, Infinity] };
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
    return `<label class="sf-cb-label${on ? ' sf-cb-active' : ''}" data-${ns}-type="${type}" data-${ns}-val="${val}"><span class="sf-cb-box${on ? ' sf-cb-checked' : ''}">${on ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>' : ''}</span>${label}</label>`;
  }
  function _pillRow(sf, type, val, label, ns) {
    const on = (sf[type] || []).includes(val);
    return `<button type="button" class="lf-pill-btn${on ? ' active' : ''}" data-${ns}-type="${type}" data-${ns}-val="${val}">${label}</button>`;
  }
  function _syncCbUI(prefix, sf) {
    document.querySelectorAll(`[data-${prefix}-type]`).forEach(el => {
      const type = el.dataset[`${prefix}Type`];
      const val = el.dataset[`${prefix}Val`];
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
    (sf.years || []).forEach(v => add(String(v), 'years', v));
    if (sf.budget) add(_budgetPills.find(([k]) => k === sf.budget)?.[1] || sf.budget, 'budget', sf.budget);
    if (sf.certified) add('Certified only', 'certified', '1');
    if (sf.owners === 1) add('1 Owner', 'owners', '1');
    if ((sf.minP > 0 || sf.maxP < sf._maxSlider) && !sf.budget) add(`Rs ${sf.minP}L – ${sf.maxP}L`, 'price', 'range');
    el.innerHTML = tags.map(t => `<button type="button" class="lf-active-tag" data-tag-type="${t.type}" data-tag-val="${t.val}">${t.label}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`).join('');
    el.style.display = tags.length ? 'flex' : 'none';
    el.querySelectorAll('.lf-active-tag').forEach(btn => {
      btn.addEventListener('click', () => onRemove(btn.dataset.tagType, btn.dataset.tagVal));
    });
  }
  function _countActive(sf) {
    let n = (sf.brands?.length || 0) + (sf.fuels?.length || 0) + (sf.bodies?.length || 0) + (sf.transmissions?.length || 0) + (sf.years?.length || 0);
    if (sf.budget) n++;
    if (sf.certified) n++;
    if (sf.owners === 1) n++;
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
  window._sf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], years: [], minP: 0, maxP: 600, sort: '', budget: '', _maxSlider: 600 };

  function _sfApply() {
    const sf = window._sf;
    let cars = CARS_DB;
    if (sf.q) {
      const ql = sf.q.toLowerCase();
      cars = cars.filter(c => `${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase().includes(ql));
    }
    if (sf.brands.length) cars = cars.filter(c => sf.brands.includes(c.brand));
    if (sf.fuels.length) cars = cars.filter(c => sf.fuels.some(f => c.type?.toLowerCase().includes(f.toLowerCase())));
    if (sf.bodies.length) cars = cars.filter(c => sf.bodies.some(b => c.body?.toLowerCase().includes(b.toLowerCase())));
    if (sf.transmissions.length) cars = cars.filter(c => sf.transmissions.includes(_carTransType(c)));
    if (sf.years.length) cars = cars.filter(c => sf.years.includes(c.year));
    cars = _priceFilter(cars, sf);
    if (sf.sort === 'price-asc') cars.sort((a, b) => _carPrice(a) - _carPrice(b));
    else if (sf.sort === 'price-desc') cars.sort((a, b) => _carPrice(b) - _carPrice(a));
    else if (sf.sort === 'rating') cars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sf.sort === 'year-desc') cars.sort((a, b) => (b.year || 0) - (a.year || 0));
    const g = document.getElementById('lf-grid'), cnt = document.getElementById('lf-count'), empty = document.getElementById('lf-empty');
    if (!g) return;
    if (cars.length) {
      g.innerHTML = cars.map(c => carCard(c)).join('');
      if (empty) empty.style.display = 'none';
    } else {
      g.innerHTML = '';
      if (empty) empty.style.display = 'block';
    }
    if (cnt) cnt.textContent = cars.length;
    updateCmpBtns();
    _syncCbUI('sf', sf);
    _renderActiveTags(sf, 'lf-active-tags', 'sf', (type, val) => {
      if (type === 'budget') { sf.budget = ''; document.querySelectorAll('.sf-budget-btn').forEach(b => b.classList.remove('active')); }
      else if (type === 'price') { sf.minP = 0; sf.maxP = sf._maxSlider; const lo = document.getElementById('lf-price-lo'), hi = document.getElementById('lf-price-hi'); if (lo) lo.value = 0; if (hi) hi.value = sf._maxSlider; const loV = document.getElementById('lf-lo-val'), hiV = document.getElementById('lf-hi-val'); if (loV) loV.textContent = 'Rs. 0L'; if (hiV) hiV.textContent = 'Rs. ' + sf._maxSlider + 'L'; }
      else if (type === 'years') { const i = sf.years.indexOf(+val); if (i > -1) sf.years.splice(i, 1); }
      else if (Array.isArray(sf[type])) { const i = sf[type].indexOf(val); if (i > -1) sf[type].splice(i, 1); }
      _sfApply();
    });
    const badge = document.getElementById('lf-badge');
    const active = _countActive(sf);
    if (badge) { badge.textContent = active || ''; badge.style.display = active ? 'inline-flex' : 'none'; }
    _filterPulse('lf-grid');
  }

  /* ── USED CARS FILTER ── */
  const _usedMaxPrice = Math.max(100, Math.ceil(Math.max(...USED.map(c => c.priceNum || 0), 1000000) / 100000));
  window._uf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], years: [], minP: 0, maxP: _usedMaxPrice, sort: '', budget: '', certified: false, owners: null, _maxSlider: _usedMaxPrice, _priceKey: 'priceNum' };

  function _ufApply() {
    const uf = window._uf;
    let cars = USED;
    if (uf.q) {
      const ql = uf.q.toLowerCase();
      cars = cars.filter(c => `${c.brand} ${c.model} ${c.type} ${c.variant}`.toLowerCase().includes(ql));
    }
    if (uf.brands.length) cars = cars.filter(c => uf.brands.includes(c.brand));
    if (uf.fuels.length) cars = cars.filter(c => uf.fuels.includes(c.type));
    if (uf.bodies.length) cars = cars.filter(c => uf.bodies.some(b => c.body?.toLowerCase().includes(b.toLowerCase())));
    if (uf.transmissions.length) cars = cars.filter(c => uf.transmissions.includes(_usedTransType(c)));
    if (uf.years.length) cars = cars.filter(c => uf.years.includes(c.year));
    if (uf.certified) cars = cars.filter(c => c.certified);
    if (uf.owners === 1) cars = cars.filter(c => c.owners === 1);
    cars = _priceFilter(cars, uf);
    if (uf.sort === 'price-asc') cars.sort((a, b) => a.priceNum - b.priceNum);
    else if (uf.sort === 'price-desc') cars.sort((a, b) => b.priceNum - a.priceNum);
    else if (uf.sort === 'km-asc') cars.sort((a, b) => parseInt(String(a.km).replace(/,/g, ''), 10) - parseInt(String(b.km).replace(/,/g, ''), 10));
    else if (uf.sort === 'year-desc') cars.sort((a, b) => b.year - a.year);
    const g = document.getElementById('used-grid'), cnt = document.getElementById('used-count'), empty = document.getElementById('uf-empty');
    if (!g) return;
    if (cars.length) {
      g.innerHTML = cars.map(c => usedCard(c)).join('');
      if (empty) empty.style.display = 'none';
    } else {
      g.innerHTML = '';
      if (empty) empty.style.display = 'block';
    }
    if (cnt) cnt.textContent = cars.length;
    _syncCbUI('uf', uf);
    _renderActiveTags(uf, 'uf-active-tags', 'uf', (type, val) => {
      if (type === 'budget') { uf.budget = ''; document.querySelectorAll('.uf-budget-btn').forEach(b => b.classList.remove('active')); }
      else if (type === 'price') { uf.minP = 0; uf.maxP = uf._maxSlider; const lo = document.getElementById('uf-price-lo'), hi = document.getElementById('uf-price-hi'); if (lo) lo.value = 0; if (hi) hi.value = uf._maxSlider; const loV = document.getElementById('uf-lo-val'), hiV = document.getElementById('uf-hi-val'); if (loV) loV.textContent = 'Rs. 0L'; if (hiV) hiV.textContent = 'Rs. ' + uf._maxSlider + 'L'; }
      else if (type === 'certified') uf.certified = false;
      else if (type === 'owners') uf.owners = null;
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
        if (type === 'owners') { sf.owners = sf.owners === 1 ? null : 1; applyFn(); return; }
        const arr = sf[type];
        if (!Array.isArray(arr)) return;
        const idx = arr.indexOf(val);
        if (idx === -1) arr.push(val); else arr.splice(idx, 1);
        applyFn();
      });
    });
  }

  function renderCars(filter, opts = {}) {
    clearInterval(heroTimer);
    document.title = 'New Cars Nepal — AutoViindu';
    const maxSlider = 600;
    window._sf = { q: opts.q || '', brands: opts.brand ? [opts.brand] : [], fuels: [], bodies: [], transmissions: [], years: [], minP: 0, maxP: maxSlider, sort: '', budget: '', _maxSlider: maxSlider };
    const fuelSeed = { electric: 'Electric', hybrid: 'Hybrid', petrol: 'Petrol', diesel: 'Diesel' };
    const bodySeed = { suv: 'SUV', sedan: 'Sedan', hatchback: 'Hatchback', crossover: 'Crossover', van: 'Van', pickup: 'Pickup' };
    if (filter && fuelSeed[filter]) window._sf.fuels = [fuelSeed[filter]];
    else if (filter && bodySeed[filter]) window._sf.bodies = [bodySeed[filter]];

    const fl = { electric: 'Electric Cars', hybrid: 'Hybrid Cars', petrol: 'Petrol Cars', diesel: 'Diesel Cars', suv: 'SUVs', sedan: 'Sedans', hatchback: 'Hatchbacks', crossover: 'Crossovers', van: 'Vans & Microvans', pickup: 'Pickup Trucks' };
    const title = filter ? (fl[filter] || filter) : 'New Cars in Nepal 2024\u201325';
    setNav(filter === 'electric' ? 'electric' : 'cars');

    const sf = window._sf;
    const allBrands = [...new Set(CARS_DB.map(c => c.brand))].sort();
    const allYears = [...new Set(CARS_DB.map(c => c.year))].sort((a, b) => b - a);

    document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.7)">${title}</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(22px,4vw,32px);color:#fff;font-weight:700;margin-bottom:4px">${title}</h1>
      <div style="font-size:13px;color:rgba(255,255,255,.4)">${CARS_DB.length} cars \u00b7 Full specs &amp; EMI</div>
    </div>
  </div>
  <div class="lf-page-wrap wrap">
    <div class="lf-overlay" id="lf-overlay" onclick="AV.sfMobileToggle()"></div>
    <aside class="lf-sidebar" id="lf-sidebar">
      <div class="lf-sidebar-inner">
        <div class="lf-sf-hd"><span>Filters</span><button class="lf-clear-btn" type="button" onclick="AV.sfClear()">Clear all</button></div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Price Range</div>
          <div class="lf-price-vals"><span id="lf-lo-val">Rs. 0L</span><span id="lf-hi-val">Rs. ${maxSlider}L</span></div>
          <div class="lf-price-track">
            <input type="range" id="lf-price-lo" class="lf-range" min="0" max="${maxSlider}" step="5" value="0" oninput="AV.sfPrice()">
            <input type="range" id="lf-price-hi" class="lf-range" min="0" max="${maxSlider}" step="5" value="${maxSlider}" oninput="AV.sfPrice()">
          </div>
          <div class="lf-budget-pills">${_budgetPills.map(([v, l]) => `<button type="button" class="sf-budget-btn" onclick="AV.sfBudget('${v}',this)">${l}</button>`).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Year</div>
          <div class="lf-pill-grid">${allYears.map(y => _pillRow(sf, 'years', y, y, 'sf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Transmission</div>
          <div class="lf-pill-grid">${['Manual', 'Automatic'].map(t => _pillRow(sf, 'transmissions', t, t, 'sf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Brand</div>
          <div class="lf-cb-list lf-cb-scroll">${allBrands.map(b => _cbRow(sf, 'brands', b, b, 'sf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Fuel Type</div>
          <div class="lf-cb-list">${['Electric', 'Hybrid', 'Petrol', 'Diesel'].map(f => _cbRow(sf, 'fuels', f, f, 'sf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Body Type</div>
          <div class="lf-cb-list">${['SUV', 'Sedan', 'Hatchback', 'Van', 'Pickup'].map(b => _cbRow(sf, 'bodies', b, b, 'sf')).join('')}</div>
        </div>
      </div>
    </aside>
    <div class="lf-main">
      <div class="lf-toolbar">
        <button class="lf-filter-mob-btn" type="button" onclick="AV.sfMobileToggle()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filters <span class="lf-badge" id="lf-badge" style="display:none"></span>
        </button>
        <div class="lf-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" id="lf-search" placeholder="Search brand, model\u2026" value="${sf.q}" oninput="AV.sfSearch(this.value)" class="lf-search-inp">
        </div>
        <select id="lf-sort" class="lf-sort-sel" onchange="AV.sfSort(this.value)">
          <option value="">Sort: Relevance</option>
          <option value="price-asc">Price: Low \u2192 High</option>
          <option value="price-desc">Price: High \u2192 Low</option>
          <option value="year-desc">Newest Year</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>
      <div class="lf-active-tags" id="lf-active-tags" style="display:none"></div>
      <div class="lf-result-bar">Showing <strong id="lf-count">0</strong> cars <span style="color:var(--ink4);font-size:12px">\u00b7 Updates instantly</span></div>
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
  const CMP_SPEC_GROUPS = [
    { id: 'overview', label: 'Overview', rows: [
      { label: 'Base Price', key: 'price', compare: 'lower', fmt: 'price' },
      { label: 'Expert Score', key: 'expertScore', compare: 'higher', fmt: 'score' },
      { label: 'User Rating', key: 'rating', compare: 'higher', fmt: 'rating' },
      { label: 'Body Type', key: 'body', fmt: 'text' },
      { label: 'Fuel Type', key: 'type', fmt: 'text' },
    ]},
    { id: 'performance', label: 'Performance', rows: [
      { label: 'Power', key: 'Power||Motor Power||Combined Power', compare: 'higher', fmt: 'text' },
      { label: 'Torque', key: 'Torque', compare: 'higher', fmt: 'text' },
      { label: '0–100 km/h', key: '0–100 km/h', compare: 'lower', fmt: 'text' },
      { label: 'Top Speed', key: 'Top Speed', fmt: 'text' },
      { label: 'Drive', key: 'Drive', fmt: 'text' },
    ]},
    { id: 'practical', label: 'Practical', rows: [
      { label: 'Fuel / Range', key: 'Fuel Efficiency||Range (WLTP)||Range', compare: 'higher', fmt: 'text' },
      { label: 'Boot Space', key: 'Boot Space', compare: 'higher', fmt: 'text' },
      { label: 'Ground Clearance', key: 'Ground Clearance', compare: 'higher', fmt: 'text' },
      { label: 'Seating', key: 'Seating', fmt: 'text' },
      { label: 'Transmission', key: 'Transmission', fmt: 'text' },
    ]},
  ];

  function cmpGetVal(car, row) {
    if (row.key === 'price') return car.variants[0].price;
    if (row.key === 'expertScore') return car.expertScore || 0;
    if (row.key === 'rating') return car.rating || 0;
    if (row.key === 'body') return car.body || car.bodyType || '—';
    if (row.key === 'type') return car.type || '—';
    const keys = row.key.split('||');
    for (const k of keys) { const v = car.specs?.[k.trim()]; if (v) return v; }
    return '—';
  }

  function cmpDisplayVal(car, row) {
    const raw = cmpGetVal(car, row);
    if (row.fmt === 'price') return window.Rs(raw);
    if (row.fmt === 'score') return raw + '/10';
    if (row.fmt === 'rating') return fmtR(raw) + '★';
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
    const byPrice = [...cars].sort((a, b) => a.variants[0].price - b.variants[0].price);
    const byScore = [...cars].sort((a, b) => (b.expertScore || 0) - (a.expertScore || 0));
    const byValue = [...cars].sort((a, b) => {
      const va = (a.expertScore || 0) / (a.variants[0].price / 1e6);
      const vb = (b.expertScore || 0) / (b.variants[0].price / 1e6);
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
    const slots = [0, 1, 2].map(i => {
      const slug = cols[i];
      const car = slug ? carBySlug(slug) : null;
      if (car) return `<div class="cmp-slot-card filled">
        <span class="cmp-slot-num">#${i + 1}</span>
        <button class="cmp-slot-rm" onclick="AV.toggleCompare('${car.slug}')" aria-label="Remove">✕</button>
        <img class="cmp-slot-img" src="${car.images[0]}" alt="${car.brand} ${car.model}">
        <div class="cmp-slot-brand">${car.brand}</div>
        <div class="cmp-slot-model">${car.model}</div>
        <div class="cmp-slot-price">${window.Rs(car.variants[0].price)}</div>
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
      { badge: '🏆 Top Rated', item: v.topRated },
      { badge: '💰 Best Value', item: v.bestValue },
      { badge: '⛽ Most Efficient', item: v.efficient },
    ];
    return `<div class="cmp-verdict">
      <div class="cmp-verdict-hd">
        <div class="cmp-verdict-icon">✨</div>
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
      ${display}${extra}${isWin ? '<div class="cmp-winner-tag">✓ Best</div>' : ''}
    </td>`;
  }

  function renderCmpTable(cols) {
    const cars = cols.map(s => carBySlug(s)).filter(Boolean);
    const tabs = CMP_SPEC_GROUPS.map((g, i) =>
      `<button class="cmp-tab${i === 0 ? ' active' : ''}" data-cmp-tab="${g.id}" onclick="AV.cmpTab('${g.id}',this)">${g.label}</button>`
    ).join('');

    const groups = CMP_SPEC_GROUPS.map(g => {
      const rows = g.rows.map(row => `<tr class="cmp-spec-row" data-cmp-group="${g.id}">
        <td>${row.label}</td>
        ${cars.map((c, ci) => renderCmpSpecCell(c, row, cars, ci)).join('')}
      </tr>`).join('');
      return `<tr class="cmp-group-hd" data-cmp-group="${g.id}"><td colspan="${cars.length + 1}">${g.label}</td></tr>${rows}`;
    }).join('');

    const mobile = cars.map((c, ci) => {
      const allRows = CMP_SPEC_GROUPS.flatMap(g => g.rows);
      const specs = allRows.map(row => {
        const winners = cmpWinners(cars, row);
        const isWin = winners.includes(ci) && winners.length < cars.length;
        return `<div class="cmp-mobile-spec">
          <span class="cmp-mobile-spec-label">${row.label}</span>
          <span class="cmp-mobile-spec-val${isWin ? ' winner' : ''}">${cmpDisplayVal(c, row)}${isWin ? ' ✓' : ''}</span>
        </div>`;
      }).join('');
      return `<div class="cmp-mobile-car">
        <div class="cmp-mobile-car-hd">
          <img src="${c.images[0]}" alt="${c.brand}">
          <div>
            <div class="cmp-mobile-car-name">${c.brand} ${c.model}</div>
            <div class="cmp-mobile-car-price">${window.Rs(c.variants[0].price)}</div>
          </div>
        </div>
        <div class="cmp-mobile-specs">${specs}</div>
      </div>`;
    }).join('');

    return `
      <div class="cmp-tabs" role="tablist">${tabs}</div>
      <div class="cmp-table-wrap">
        <div class="cmp-table-scroll">
          <table class="cmp-table">
            <thead><tr>
              <th class="cmp-th-label">Specification</th>
              ${cars.map(c => `<th class="cmp-th-car">
                <img src="${c.images[0]}" alt="${c.brand}">
                <div class="cmp-th-brand">${c.brand}</div>
                <div class="cmp-th-model">${c.model}</div>
                <div class="cmp-th-price">${window.Rs(c.variants[0].price)}</div>
                <div class="cmp-th-actions">
                  <button class="cmp-th-btn cmp-th-btn-view" onclick="AV.openDetail('${c.slug}')">View</button>
                  <button class="cmp-th-btn cmp-th-btn-rm" onclick="AV.toggleCompare('${c.slug}')">Remove</button>
                </div>
              </th>`).join('')}
            </tr></thead>
            <tbody>${groups}</tbody>
          </table>
        </div>
      </div>
      <div class="cmp-mobile-cards">${mobile}</div>`;
  }

  function renderCmpPicker() {
    const atMax = compareList.length >= 3;
    return CARS_DB.map(car => {
      const inCmp = compareList.includes(car.slug);
      const disabled = atMax && !inCmp;
      return `<div class="cmp-car-pick${inCmp ? ' in' : ''}${disabled ? ' disabled' : ''}"
        data-cmp-search="${(car.brand + ' ' + car.model + ' ' + car.type).toLowerCase()}"
        onclick="AV.toggleCompare('${car.slug}')">
        <img src="${car.images[0]}" alt="${car.brand}">
        <div class="cmp-car-pick-info">
          <div class="cmp-car-pick-name">${car.brand} ${car.model}</div>
          <div class="cmp-car-pick-price">${window.Rs(car.variants[0].price)}</div>
        </div>
        <span class="cmp-car-pick-action">${inCmp ? '✓' : '+'}</span>
      </div>`;
    }).join('');
  }

  function renderCompare() {
    clearInterval(heroTimer);
    document.title = 'Compare Cars — AutoViindu';
    setNav('compare');
    const cols = compareList.slice(0, 3);
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
          <p class="cmp-hero-sub">Line up 3 contenders, see specs side-by-side, and get a clear verdict on value, performance &amp; practicality.</p>
          <div class="cmp-progress">
            <div class="cmp-progress-dots">
              ${[0, 1, 2].map(i => `<div class="cmp-progress-dot${i < count ? ' filled' : ''}"></div>`).join('')}
            </div>
            <span class="cmp-progress-label">${count} of 3 selected${count >= 2 ? ' · Ready to compare!' : ''}</span>
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
              <div class="cmp-picker-sub">Tap to add or remove · Max 3 cars</div>
            </div>
            <div class="cmp-search-wrap">
              <svg class="cmp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="search" id="cmp-search" placeholder="Search brand or model…" oninput="AV.cmpSearch(this.value)" autocomplete="off">
            </div>
          </div>
          <div class="cmp-picker-grid" id="cmp-picker-grid">${renderCmpPicker()}</div>
        </div>
      </div>`;

    updateCompareTray();
    if (count < 2) setTimeout(() => window._initCompareAnimation?.(), 50);
    else AV.cmpTab('overview', document.querySelector('.cmp-tab'));
  }

  function cmpTab(id, btn) {
    document.querySelectorAll('.cmp-tab').forEach(t => t.classList.toggle('active', t.dataset.cmpTab === id));
    document.querySelectorAll('[data-cmp-group]').forEach(el => {
      el.style.display = el.dataset.cmpGroup === id ? '' : 'none';
    });
    if (btn) btn.classList.add('active');
  }

  function cmpSearch(q) {
    const query = (q || '').toLowerCase().trim();
    document.querySelectorAll('.cmp-car-pick').forEach(el => {
      const match = !query || (el.dataset.cmpSearch || '').includes(query);
      el.classList.toggle('hidden', !match);
    });
  }


  /* ─ SERVICES ─ */
  function renderServices() {
    clearInterval(heroTimer);
    document.title = 'Services — AutoViindu';
    setNav('services');
    const svcs = [
      { id: 'cosmetic', name: 'Cosmetic Car Care', color: '#1a6b2a', bg: '#eef7f0', icon: '✨', items: ['Basic Washing & Cleaning', 'Interior Vacuum & Polish', 'Paint Protection Film (PPF)', 'Scratch & Dent Correction', 'Headlight Restoration', 'Underbody Anti-Rust Coating', 'Alloy & Tyre Shine', 'Engine Bay Cleaning', 'Ceramic Coating (9H)', 'Odour & Sanitization', 'Nano-coating Application', 'Full Body Detailing'] },
      { id: 'workshop', name: 'Workshop Services', color: '#b8900e', bg: '#fdf6e0', icon: '🔧', items: ['Wiring & Electrical Diagnosis', 'Hybrid / EV Electrical Work', 'Sensor / ECU Troubleshooting', 'Transmission Repair', 'Air Conditioning Overhaul', 'Body Work & Panel Repair', 'Wheel Alignment & Balancing', 'Suspension Inspection', 'Software Updates & Calibration', 'Brake Inspection & Service', 'Engine Tune-up', 'Pre-purchase Inspection'] },
      { id: 'telematics', name: 'Telematics & GPS', color: '#1a4db8', bg: '#eef3fc', icon: '📡', items: ['GPS Tracking Units', 'Remote Immobilizer Systems', 'Geo-fencing & Alerts', 'OBD Plug Diagnostics', 'Dashcam & Security Kits', 'Fuel Monitoring Sensors', 'TPMS Installation', 'Fleet Management Solutions'] },
      { id: 'roadside', name: 'Roadside Assistance', color: '#d63031', bg: '#fff0ef', icon: '🚨', items: ['Emergency Towing', 'Battery Jumpstart', 'Flat Tyre Change', 'Emergency Fuel Delivery', 'Lock-Out Service', 'Minor Mechanical Help', '24/7 SOS Support'] },
    ];
    document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.7)">Services</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:#fff;font-weight:700;margin-bottom:6px">Our Services</h1>
      <div style="font-size:13px;color:rgba(255,255,255,.4)">Complete automotive care from our Kathmandu centre</div>
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
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Name *</label><input class="sw-input" type="text" placeholder="Full name" required style="padding:10px 12px"></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Phone *</label><input class="sw-input" type="tel" placeholder="+977 98XXXXXXXX" required style="padding:10px 12px"></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Vehicle Brand</label><select class="sw-select" style="padding:10px 28px 10px 12px"><option>Select brand</option>${['Toyota', 'Honda', 'Hyundai', 'Kia', 'Suzuki', 'MG', 'BYD', 'BMW', 'Other'].map(b => `<option>${b}</option>`).join('')}</select></div>
          <div style="display:flex;flex-direction:column;gap:5px"><label style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink4)">Service</label><select class="sw-select" style="padding:10px 28px 10px 12px"><option>Select service</option>${s.items.map(i => `<option>${i}</option>`).join('')}</select></div>
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




  /* ── USED CARD helper ── */
  function usedCard(car) {
    const badgeCls = { Petrol: 'badge-popular', Diesel: 'badge-new', Hybrid: 'badge-hybrid', Electric: 'badge-ev' };
    const fuelBadge = `<span class="cc-badge ${badgeCls[car.type] || 'badge-popular'}">${car.type}</span>`;
    const certBadge = car.certified ? `<span class="cc-badge badge-trending">Certified</span>` : '';
    const heartSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;

    return `<div class="car-card" onclick="AV.openUsedDetail('${car.id}')">
    <div class="cc-img">
      <div class="cc-top-bar">
        <div class="cc-top-left">
          ${certBadge} ${fuelBadge}
          <span class="cc-top-name">${car.brand} ${car.model}</span>
        </div>
        <button class="cc-wish" onclick="event.stopPropagation();this.classList.toggle('active')">${heartSVG}</button>
      </div>
      <img src="${car.img}" alt="${car.brand} ${car.model}" loading="lazy">
    </div>

    <div class="cc-body">
      <div class="cc-name">${car.brand} ${car.model}</div>
      <div class="cc-variant">${car.year} · ${car.km} km · ${car.transmission}</div>

      <div class="cc-price-block">
        <div class="cc-price-line">Asking <strong>${car.price}</strong></div>
        <div class="cc-emi">EMI From <strong>Rs. ${car.emiEst.toLocaleString()}/mo</strong></div>
        <div class="cc-actions">
          <button class="cc-btn-f" onclick="event.stopPropagation();AV.openUsedDetail('${car.id}')">Details</button>
          <button class="cc-btn-o" onclick="event.stopPropagation();alert('Call: +977-9701076240')">Get Price</button>
        </div>
      </div>
    </div>
  </div>`;
  }

  /* ── USED LISTING PAGE ── */
  function renderUsed() {
    clearInterval(heroTimer);
    document.title = 'Used Cars — AutoViindu';
    setNav('used');

    const maxSlider = _usedMaxPrice;
    window._uf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], years: [], minP: 0, maxP: maxSlider, sort: '', budget: '', certified: false, owners: null, _maxSlider: maxSlider, _priceKey: 'priceNum' };
    const uf = window._uf;
    const allBrands = [...new Set(USED.map(c => c.brand))].sort();
    const allYears = [...new Set(USED.map(c => c.year))].sort((a, b) => b - a);
    const usedBudgetPills = [['u20', 'Under 20L'], ['u40', 'Under 40L'], ['u60', 'Under 60L'], ['u100', 'Under 1Cr']];

    document.getElementById('app-root').innerHTML = `
  <div class="page-hero">
    <div class="wrap">
      <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span><span style="color:rgba(255,255,255,.75)">Used Cars</span></div>
      <h1 style="font-family:var(--font-d);font-size:clamp(24px,4vw,36px);color:#fff;font-weight:700;margin-bottom:6px">Certified Pre-Owned Cars</h1>
      <div style="font-size:13px;color:rgba(255,255,255,.4)">${USED.length} verified vehicles \u00b7 Full inspection reports</div>
    </div>
  </div>
  <div class="lf-page-wrap wrap">
    <div class="lf-overlay" id="uf-overlay" onclick="AV.ufMobileToggle()"></div>
    <aside class="lf-sidebar" id="uf-sidebar">
      <div class="lf-sidebar-inner">
        <div class="lf-sf-hd"><span>Filters</span><button class="lf-clear-btn" type="button" onclick="AV.ufClear()">Clear all</button></div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Price Range</div>
          <div class="lf-price-vals"><span id="uf-lo-val">Rs. 0L</span><span id="uf-hi-val">Rs. ${maxSlider}L</span></div>
          <div class="lf-price-track">
            <input type="range" id="uf-price-lo" class="lf-range" min="0" max="${maxSlider}" step="1" value="0" oninput="AV.ufPrice()">
            <input type="range" id="uf-price-hi" class="lf-range" min="0" max="${maxSlider}" step="1" value="${maxSlider}" oninput="AV.ufPrice()">
          </div>
          <div class="lf-budget-pills">${usedBudgetPills.map(([v, l]) => `<button type="button" class="sf-budget-btn uf-budget-btn" onclick="AV.ufBudget('${v}',this)">${l}</button>`).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Year</div>
          <div class="lf-pill-grid">${allYears.map(y => _pillRow(uf, 'years', y, y, 'uf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Transmission</div>
          <div class="lf-pill-grid">${['Manual', 'Automatic'].map(t => _pillRow(uf, 'transmissions', t, t, 'uf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Brand</div>
          <div class="lf-cb-list">${allBrands.map(b => _cbRow(uf, 'brands', b, b, 'uf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Fuel Type</div>
          <div class="lf-cb-list">${['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(f => _cbRow(uf, 'fuels', f, f, 'uf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Body Type</div>
          <div class="lf-cb-list">${['SUV', 'Sedan', 'Hatchback'].map(b => _cbRow(uf, 'bodies', b, b, 'uf')).join('')}</div>
        </div>
        <div class="lf-sf-section">
          <div class="lf-sf-title">Condition</div>
          <div class="lf-cb-list">
            ${_cbRow(uf, 'certified', '1', 'Certified only', 'uf')}
            ${_cbRow(uf, 'owners', '1', 'Single owner', 'uf')}
          </div>
        </div>
      </div>
    </aside>
    <div class="lf-main">
      <div class="lf-toolbar">
        <button class="lf-filter-mob-btn" type="button" onclick="AV.ufMobileToggle()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Filters <span class="lf-badge" id="uf-badge" style="display:none"></span>
        </button>
        <div class="lf-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" id="uf-search" placeholder="Search brand, model\u2026" oninput="AV.ufSearch(this.value)" class="lf-search-inp">
        </div>
        <select id="uf-sort" class="lf-sort-sel" onchange="AV.ufSort(this.value)">
          <option value="">Sort: Relevance</option>
          <option value="price-asc">Price: Low \u2192 High</option>
          <option value="price-desc">Price: High \u2192 Low</option>
          <option value="km-asc">Lowest KM</option>
          <option value="year-desc">Newest Year</option>
        </select>
      </div>
      <div class="lf-active-tags" id="uf-active-tags" style="display:none"></div>
      <div class="lf-result-bar">Showing <strong id="used-count">0</strong> cars <span style="color:var(--ink4);font-size:12px">\u00b7 All prices negotiable</span></div>
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
            <div class="uc-sell-title">Get the best price for your car</div>
            <div class="uc-sell-sub">Free valuation \u00b7 Instant offers \u00b7 We handle DOTM paperwork</div>
          </div>
          <button type="button" onclick="alert('+977-9701076240')" class="btn btn-primary">Get Free Valuation</button>
        </div>
      </div>
    </div>
  </div>`;
    _bindFilterSidebar('uf', _ufApply);
    _ufApply();
  }

  /* ── USED DETAIL PAGE ── */
  function renderUsedDetail(id) {
    const car = USED.find(c => c.id === id);
    if (!car) { renderUsed(); return }
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
    };
    const svgI = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${_P[k]}</svg>`;

    function kiGrid() {
      return [
        { k: 'cal', val: car.year, lbl: 'Year' },
        { k: 'fuel', val: car.type, lbl: 'Fuel' },
        { k: 'body', val: car.km + ' km', lbl: 'Odometer' },
        { k: 'sts', val: car.owners, lbl: 'Owners' },
        { k: 'list', val: car.transmission, lbl: 'Trans.' },
      ].map(it => `
      <div class="dp-ki-cell">
        <div class="dp-ki-icon">${svgI(it.k)}</div>
        <div class="dp-ki-val">${it.val}</div>
        <div class="dp-ki-lbl">${it.lbl}</div>
      </div>`).join('');
    }

    function qsStrip() {
      return [
        ['Brand', car.brand],
        ['Model', car.model],
        ['Color', car.color],
        ['Variant', car.variant],
      ].map(([l, val]) => `
      <div class="dp-qs-cell">
        <div class="dp-qs-val">${val}</div>
        <div class="dp-qs-lbl">${l}</div>
      </div>`).join('');
    }

    function specTable() {
      return `<table class="dp-spec-table">
      ${Object.entries(car.specs).map(([k, val]) => `<tr><td>${k}</td><td>${val}</td></tr>`).join('')}
    </table>`;
    }

    function featGrid() {
      const all = [...new Set([...(car.features || []), ...(car.highlights || [])])];
      if (!all.length) return `<p style="font-size:13px;color:var(--ink4)">No feature data available.</p>`;
      return `<div class="dp-feat-grid">
      ${all.map(f => `<div class="dp-feat-item"><div class="dp-feat-chk">${svgI('chk')}</div><span>${f}</span></div>`).join('')}
    </div>`;
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
      <div class="dp-accord-body">${body}</div>
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
      <button onclick="alert('Finance: +977-9701076240')" class="dp-cta-ghost" style="margin-top:10px;width:100%">Apply for finance →</button>`;
    }

    function sidebarHTML() {
      return `<div class="dp-scard">
      <div class="dp-price-box">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:4px">Asking price</div>
        <div class="dp-price-main">${car.price}</div>
        <div class="dp-price-note">${car.variant} · Negotiable</div>
        <div class="dp-cta-stack" style="margin-top:16px;">
          <button class="dp-cta-primary" onclick="alert('+977-9701076240')">Call / WhatsApp Seller</button>
          <button class="dp-cta-gold" onclick="alert('Test drive: +977-9701076240')">Book test drive</button>
        </div>
      </div>

      <div class="dp-emi-box">
        <div class="dp-emi-hd">${svgI('calc')} EMI Calculator</div>
        <div id="emi-sb-wrap">${emiHTML('sb')}</div>
      </div>
      
      <!-- Seller Profile Box -->
      <div style="padding:20px;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--g3);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">A</div>
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--ink)">${car.seller.name}</div>
            ${car.seller.verified ? '<span style="font-size:11px;color:#16a34a;font-weight:600">✓ Verified Dealer</span>' : ''}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;background:var(--bg);border-radius:8px;padding:12px 0;margin-bottom:16px">
          <div style="text-align:center;flex:1;border-right:1px solid var(--border)"><div style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.sold}+</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">Cars sold</div></div>
          <div style="text-align:center;flex:1;border-right:1px solid var(--border)"><div style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.rating}★</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">Rating</div></div>
          <div style="text-align:center;flex:1"><div style="font-size:14px;font-weight:800;color:var(--ink)">4yr</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">On AutoViindu</div></div>
        </div>
        <button onclick="alert('+977-9701076240')" style="width:100%;padding:12px;background:var(--white);color:var(--ink);border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-b);font-size:13.5px;font-weight:700;cursor:pointer;">Message Seller</button>
      </div>

      <div class="dp-contact-row">
        ${svgI('ph')} <a href="tel:+9779701076240">+977-9701076240</a>&nbsp;·&nbsp;Mon–Sat 9am–6pm
      </div>
    </div>`;
    }

    function similarCars() {
      const similar = USED.filter(c => c.id !== id).slice(0, 4);
      if (!similar.length) return '';
      return `<div class="dp-similar">
      <div class="section-hd">Similar Used Cars</div>
      <div class="used-grid" style="grid-template-columns:repeat(2,1fr)">
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
        <h1 style="font-family:var(--font-d);font-size:clamp(22px,3.5vw,32px);color:#fff;font-weight:700;line-height:1.1;margin-bottom:5px">
          ${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span>
        </h1>
        <div style="font-size:12px;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${car.type} · ${car.transmission} · ${car.km} km
          <span class="cc-rating"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${car.rating}</span>
          <span>${car.reviews} reviews</span>
          ${car.certified ? `<span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:var(--pill);background:rgba(26,107,42,.3);color:#4dd870;border:1px solid rgba(26,107,42,.45)">✓ AutoViindu Certified</span>` : ''}
        </div>
      </div>
    </div>
  </div>

  <div class="wrap dp-layout detail-page-body">

    <!-- ═══ LEFT: main content ═══ -->
    <div style="min-width:0">

      <!-- Gallery -->
      <div class="dp-gallery-card">
        <div id="gal-wrap">
          <div style="position:relative;height:320px;border-radius:12px;overflow:hidden;background:var(--bg2);box-shadow:var(--sh1)" id="ud-gal-main">
            <img id="ud-gal-img" src="${imgs[0]}" style="width:100%;height:100%;object-fit:cover;transition:opacity .2s" alt="${car.brand} ${car.model}">
            ${imgs.length > 1 ? `
            <button onclick="window._udGalNav(-1)" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button onclick="window._udGalNav(1)"  style="position:absolute;top:50%;right:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg></button>`: ''}
            <div style="position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:var(--pill);backdrop-filter:blur(4px)" id="ud-gal-cnt">1/${imgs.length}</div>
          </div>
          ${imgs.length > 1 ? `<div style="display:flex;gap:8px;padding:12px 0;overflow-x:auto">
            ${imgs.map((img, i) => `<div onclick="window._udGalSet(${i})" style="width:72px;height:48px;border-radius:8px;overflow:hidden;border:2px solid ${i === 0 ? 'var(--g3)' : 'transparent'};cursor:pointer;flex-shrink:0;background:var(--bg2);transition:all var(--ease)" id="ud-thumb-${i}"><img src="${img}" style="width:100%;height:100%;object-fit:cover"></div>`).join('')}
          </div>`: ''}
        </div>
      </div>

      <!-- Quick stats horizontal strip -->
      <div class="dp-qs-strip">${qsStrip()}</div>

      <!-- Mobile title (hidden on desktop) -->
      <div class="dp-mob-title">
        <h1>${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span></h1>
        <div class="dp-mob-title-sub">
          ${car.type} · ${car.transmission} · ${car.km} km
          <span class="cc-rating"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${car.rating}</span>
        </div>
      </div>

      <!-- Key info grid with icons -->
      <div class="dp-ki-wrap"><div class="dp-ki-grid">${kiGrid()}</div></div>

      <div style="padding:14px 16px;background:var(--white);border-bottom:1px solid var(--border)">
        <p style="font-size:13.5px;color:var(--ink3);line-height:1.85;margin:0">${car.overview}</p>
      </div>

      <!-- Inspection Report -->
      ${accord('acc-insp', 'chk', '140-Point Inspection Report', `<div id="insp-body">${inspectGrid()}</div>`, true)}

      <!-- Specifications -->
      ${accord('acc-spec', 'list', 'Specifications', `<div id="spec-body">${specTable()}</div>`)}

      <!-- Features & Highlights -->
      ${accord('acc-feat', 'feat', 'Features & Highlights', `<div id="feat-body">${featGrid()}</div>`)}

      <!-- EMI Calculator — mobile accordion, hidden on desktop -->
      <div class="dp-mob-emi-acc">
        ${accord('acc-emi', 'calc', 'EMI Calculator', `<div id="emi-mob-wrap">${emiHTML('mob')}</div>`)}
      </div>

      <!-- Similar cars -->
      ${similarCars()}
    </div>

    <!-- ═══ RIGHT: sticky sidebar (desktop only) ═══ -->
    <div class="dp-sidebar" id="dp-sidebar">
      ${sidebarHTML()}
    </div>
  </div>

  <!-- Mobile sticky bottom bar -->
  <div class="dp-mob-bar">
    <div class="dp-mob-price">
      <div class="dp-mob-price-lbl">Asking Price</div>
      <div class="dp-mob-price-val">${car.price}</div>
    </div>
    <div class="dp-mob-btns">
      <button class="dp-mob-btn-g" onclick="alert('Test drive: +977-9701076240')">Test Drive</button>
      <button class="dp-mob-btn-p" onclick="alert('+977-9701076240')">Contact Seller</button>
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



  /* ─ NAV ─ */
  function setNav(p) {
    document.querySelectorAll('.hn-link').forEach(n => n.classList.remove('active'));
    const m = { home: 'nav-home', cars: 'nav-cars', electric: 'nav-electric', used: 'nav-used', compare: 'nav-compare', services: 'nav-services' };
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
    else if (p === 'used') renderUsed();
    else if (p === 'compare') renderCompare();
    else if (p === 'services') renderServices();
    else if (p === 'tools') {
      const toolPages = {
        emi: 'caremi.html',
        loan: 'whatcarcanyouaffoard.html',
        afford: 'whatcarcanyouaffoard.html',
        matchmaker: 'whatcarcanyouaffoard.html',
        charging: 'chargingstation.html',
      };
      window.location.href = toolPages[opts.tool] || 'caremi.html';
      return;
    }
    else renderHome();
    history.pushState({ page: p, opts }, '', `#${p}`);
  }
  function openDetail(slug) {
    clearInterval(heroTimer);
    renderDetail(slug);
    history.pushState({ page: 'detail', slug }, '', `#car/${slug}`);
  }

  /* ─ SEARCH ─ */
  let searchIdx = CARS_DB.map(c => ({ slug: c.slug, display: `${c.brand} ${c.model}`, searchText: `${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase(), image: c.images[0], year: c.year, type: c.type, body: c.body, price: window.Rs(c.variants[0].price) }));
  let searchTimer = null;
  const hsInput = document.getElementById('hs-input');
  const searchDD = document.getElementById('search-dd');
  if (hsInput) {
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
    document.addEventListener('click', e => {
      if (e.target.closest('#header-search-wrap') || e.target.closest('#mob-search-btn') || e.target.closest('#mob-search-back')) return;
      closeSD();
    });
  }
  function showQS() { if (!searchDD) return; searchDD.innerHTML = `<div class="sdd-hd">Popular Searches</div><div class="sdd-chip-row">${['MG Hector', 'IONIQ 5', 'Toyota Prius', 'Honda City', 'Kia Seltos', 'BYD Atto 3', 'Swift 2024', 'Electric Cars'].map(t => `<span class="sdd-chip" onclick="AV.goTo('cars');closeSD()">${t}</span>`).join('')}</div>`; searchDD.classList.add('open') }
  function closeSD() { if (searchDD) searchDD.classList.remove('open'); const h = document.querySelector('.header-in'); if (h) h.classList.remove('search-active'); document.body.style.overflow = '' }
  window.closeSD = closeSD;

  /* ─ HEADER SCROLL ─ */
  window.addEventListener('scroll', () => { document.getElementById('site-header')?.classList.toggle('scrolled', window.scrollY > 20) }, { passive: true });

  /* ─ MOBILE ─ */
  const burger = document.getElementById('burger');
  const mm = document.getElementById('mm');
  function closeMM() { if (mm) mm.classList.remove('open'); if (burger) burger.classList.remove('open'); document.body.style.overflow = '' }
  if (burger) burger.addEventListener('click', () => { const open = mm.classList.contains('open'); if (open) closeMM(); else { mm.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden' } });
  const mmCarsBtn = document.getElementById('mm-cars-btn');
  const mmCarsSub = document.getElementById('mm-cars-sub');
  if (mmCarsBtn) mmCarsBtn.addEventListener('click', () => { const open = mmCarsSub.classList.contains('open'); mmCarsSub.classList.toggle('open', !open) });
  window.closeMM = closeMM;



  /* ─ MOBILE SEARCH TOGGLE ─ */
  const mobSearchBtn2 = document.getElementById('mob-search-btn');
  const mobSearchBack2 = document.getElementById('mob-search-back');
  const headerIn2 = document.querySelector('.header-in');

  if (mobSearchBtn2 && mobSearchBack2 && headerIn2) {
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

  /* ─ KEYBOARD ─ */
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !e.target.matches('input,textarea,select')) { e.preventDefault(); hsInput?.focus() }
    if (e.key === 'Escape') { closeSD(); closeMM() }
  });

  /* ─ POPSTATE ─ */
  window.addEventListener('popstate', e => {
    const hash = location.hash;
    if (!hash || hash === '#home') renderHome();
    else if (hash.startsWith('#car/')) renderDetail(hash.replace('#car/', ''));
    else if (hash.startsWith('#used/')) renderUsedDetail(hash.replace('#used/', ''));
    else if (hash === '#cars') renderCars();
    else if (hash === '#electric') renderCars('electric');
    else if (hash === '#compare') renderCompare();
    else if (hash === '#services') renderServices();
    else if (hash === '#used') renderUsed();
    else renderHome();
  });

  /* ─ PUBLIC API ─ */
  window.AV = {
    goTo, openDetail, toggleCompare, toggleWish, clearCompare, cmpTab, cmpSearch,
    galNav, galSet, selectVariant, selectColor, dtab,
    updateEMI, setTenure, getVI,
    homeFilter, filterList, sortList,
    swSearch, submitForm,
    heroNav, heroGo, updateCompareTray, recalcEmi, setTenure2,
    openUsedDetail, filterUsed, sortUsed, chipFilterUsed, renderUsed, dpAccord,
    sfApply: _sfApply,
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
      window._sf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], years: [], minP: 0, maxP: max, sort: '', budget: '', _maxSlider: max };
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
    ufToggle(type, val, el) { AV.sfToggle.call(AV, type, val, el); },
    ufBudget(val, el) {
      window._uf.budget = window._uf.budget === val ? '' : val;
      document.querySelectorAll('.uf-budget-btn').forEach(b => b.classList.remove('active'));
      if (window._uf.budget) el?.classList.add('active');
      _ufApply();
    },
    ufSort(val) { window._uf.sort = val; _ufApply(); },
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
      window._uf = { q: '', brands: [], fuels: [], bodies: [], transmissions: [], years: [], minP: 0, maxP: max, sort: '', budget: '', certified: false, owners: null, _maxSlider: max, _priceKey: 'priceNum' };
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
    ufMobileToggle() {
      const p = document.getElementById('uf-sidebar');
      if (!p) return;
      const isOpen = p.classList.contains('lf-mob-open');
      p.classList.toggle('lf-mob-open', !isOpen);
      document.getElementById('uf-overlay')?.classList.toggle('lf-mob-open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    },
  };


  /* ─ INIT ─ */
  function init() {
    const hash = location.hash;
    if (hash.startsWith('#car/')) renderDetail(hash.replace('#car/', ''));
    else if (hash === '#cars') renderCars();
    else if (hash === '#electric') renderCars('electric');
    else if (hash === '#compare') renderCompare();
    else if (hash === '#services') renderServices();
    else if (hash === '#used') renderUsed();
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


})();