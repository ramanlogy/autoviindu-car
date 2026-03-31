/* ══════════════════════════════════════
   AUTOVIINDU — MAIN APP
   SPA Router + Page Renderers
   All pages render into #app-root
══════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── ICONS ─── */
  const IC = {
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    chevR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>`,
    chevD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
    car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
    cmp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
    calc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="9.5" y2="11"/><line x1="12" y1="11" x2="13.5" y2="11"/><line x1="16" y1="11" x2="16" y2="11" stroke-width="2.5" stroke-linecap="round"/><line x1="8" y1="15" x2="9.5" y2="15"/><line x1="12" y1="15" x2="13.5" y2="15"/><line x1="15.25" y1="13.75" x2="16.75" y2="15.25"/><line x1="16.75" y1="13.75" x2="15.25" y2="15.25"/><line x1="8" y1="19" x2="9.5" y2="19"/><line x1="12" y1="19" x2="16" y2="19"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  };

  /* ─── STATE ─── */
  let compareList = [];
  let wishlist = [];
  let galleryIdx = 0;
  let activeVariant = {};

  /* ─── UTILS ─── */
  const Rs = n => n >= 100000 ? `Rs. ${(n / 100000).toFixed(2)}L` : `Rs. ${n.toLocaleString()}`;
  const calcEMI = (p, ar, m) => { const r = ar / 12 / 100; return r === 0 ? p / m : p * (r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1); };
  const badgeClass = b => ({ ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' }[b] || 'badge-pop');
  const badgeLabel = b => ({ ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' }[b] || '');
  const carBySlug = slug => (window.CARS_DB || []).find(c => c.slug === slug);
  const fmtRating = r => r.toFixed(1);

  /* ─── TOAST ─── */
  function toast(msg, type = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> ${msg}`;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  /* ─── COMPARE ─── */
  function toggleCompare(slug) {
    const car = carBySlug(slug);
    if (!car) return;
    const idx = compareList.indexOf(slug);
    if (idx > -1) {
      compareList.splice(idx, 1);
      toast(`${car.brand} ${car.model} removed from compare`);
    } else {
      if (compareList.length >= 3) { toast('Max 3 cars can be compared', 'error'); return; }
      compareList.push(slug);
      toast(`${car.brand} ${car.model} added to compare`, 'success');
    }
    updateCompareTray();
    updateCompareButtons();
  }

  function updateCompareTray() {
    const tray = document.getElementById('compare-tray');
    const slots = document.getElementById('cmp-slots');
    if (!tray || !slots) return;
    if (!compareList.length) { tray.classList.remove('visible'); return; }
    tray.classList.add('visible');
    let html = compareList.map(slug => {
      const c = carBySlug(slug);
      if (!c) return '';
      return `<div class="cmp-slot">
        <img src="${c.images[0]}" alt="${c.brand}">
        <span>${c.brand} ${c.model}</span>
        <span class="rm" onclick="AV.toggleCompare('${slug}')">✕</span>
      </div>`;
    }).join('');
    if (compareList.length < 3) html += `<div class="cmp-add">${IC.plus} Add car</div>`;
    slots.innerHTML = html;
  }

  function updateCompareButtons() {
    document.querySelectorAll('[data-cmp-slug]').forEach(btn => {
      const slug = btn.dataset.cmpSlug;
      const inList = compareList.includes(slug);
      btn.textContent = inList ? '✓ Added' : '+ Compare';
      btn.classList.toggle('added', inList);
    });
  }

  /* ─── WISHLIST ─── */
  function toggleWish(slug, btn) {
    const idx = wishlist.indexOf(slug);
    if (idx > -1) wishlist.splice(idx, 1); else wishlist.push(slug);
    if (btn) btn.classList.toggle('wishlisted', wishlist.includes(slug));
  }

  /* ─── GALLERY ─── */
  function buildGallery(car, containerId) {
    galleryIdx = 0;
    const el = document.getElementById(containerId);
    if (!el) return;
    const imgs = car.images;
    el.innerHTML = `
      <div class="gallery-main" id="gal-main">
        <img id="gal-main-img" src="${imgs[0]}" alt="${car.brand} ${car.model}">
        ${imgs.length > 1 ? `
          <button class="g-nav-btn prev" onclick="AV.galNav(-1,'${car.slug}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="g-nav-btn next" onclick="AV.galNav(1,'${car.slug}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
          </button>` : ''}
        <div class="g-count-badge" id="gal-count">${galleryIdx + 1}/${imgs.length}</div>
      </div>
      <div class="gallery-thumbs">
        ${imgs.map((img, i) => `<div class="g-thumb ${i === 0 ? 'active' : ''}" onclick="AV.galSet(${i},'${car.slug}')"><img src="${img}" loading="lazy"></div>`).join('')}
      </div>`;
  }

  function galNav(dir, slug) {
    const car = carBySlug(slug);
    if (!car) return;
    galleryIdx = (galleryIdx + dir + car.images.length) % car.images.length;
    const img = document.getElementById('gal-main-img');
    if (img) { img.classList.add('fade'); setTimeout(() => { img.src = car.images[galleryIdx]; img.classList.remove('fade'); }, 200); }
    document.querySelectorAll('.g-thumb').forEach((t, i) => t.classList.toggle('active', i === galleryIdx));
    const cnt = document.getElementById('gal-count');
    if (cnt) cnt.textContent = `${galleryIdx + 1}/${car.images.length}`;
  }

  function galSet(idx, slug) {
    const car = carBySlug(slug);
    if (!car) return;
    galleryIdx = idx;
    const img = document.getElementById('gal-main-img');
    if (img) { img.classList.add('fade'); setTimeout(() => { img.src = car.images[galleryIdx]; img.classList.remove('fade'); }, 200); }
    document.querySelectorAll('.g-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
    const cnt = document.getElementById('gal-count');
    if (cnt) cnt.textContent = `${galleryIdx + 1}/${car.images.length}`;
  }

  /* ─── VARIANT SELECTION ─── */
  function selectVariant(slug, varIdx) {
    activeVariant[slug] = varIdx;
    const car = carBySlug(slug);
    if (!car) return;
    const vr = car.variants[varIdx];

    // Update tab active state
    document.querySelectorAll('.variant-tab').forEach((t, i) => t.classList.toggle('active', i === varIdx));
    document.querySelectorAll('.pcv-item').forEach((t, i) => t.classList.toggle('active', i === varIdx));

    // Update displayed price
    const priceEls = document.querySelectorAll('[data-price-display]');
    priceEls.forEach(el => el.textContent = vr.label);

    // Update variant detail panel
    const panel = document.getElementById('variant-detail-panel');
    if (panel && vr.specs) {
      panel.innerHTML = Object.entries(vr.specs).map(([k, v]) => `
        <div class="vdp-item"><div class="vdp-value">${v}</div><div class="vdp-label">${k}</div></div>`).join('');
    }

    // Update EMI
    const downEl = document.getElementById('emi-down');
    const tenureEl = document.getElementById('emi-tenure-val');
    const rateEl = document.getElementById('emi-rate');
    if (downEl && tenureEl && rateEl) updateEMI(slug, varIdx, +downEl.value, +tenureEl.textContent, +rateEl.value);
  }

  /* ─── EMI ─── */
  function renderEMICard(car, varIdx) {
    const vr = car.variants[varIdx];
    const dp = 20, dt = 60, dr = 10.5;
    const loan = vr.price * (1 - dp / 100);
    const emi = calcEMI(loan, dr, dt);
    return `<div class="emi-card">
      <div class="emi-card-title">${IC.calc} EMI Calculator</div>
      <div class="emi-field">
        <label>Down Payment <span class="val" id="emi-down-val">${dp}%</span></label>
        <input type="range" id="emi-down" min="10" max="60" value="${dp}" step="5"
          oninput="document.getElementById('emi-down-val').textContent=this.value+'%';AV.updateEMI('${car.slug}',AV.getActiveVariant('${car.slug}'),+this.value,+document.getElementById('emi-tenure-val').textContent,+document.getElementById('emi-rate').value)">
      </div>
      <div class="emi-field">
        <label>Tenure <span class="val"><span id="emi-tenure-val">${dt}</span> months</span></label>
        <div class="tenure-buttons">
          ${[12,24,36,48,60,72,84].map(m => `<button class="tenure-btn ${m === dt ? 'active' : ''}" onclick="AV.setTenure(${m},'${car.slug}')">${m}m</button>`).join('')}
        </div>
      </div>
      <div class="emi-field">
        <label>Interest Rate <span class="val" id="emi-rate-val">${dr}%</span></label>
        <input type="range" id="emi-rate" min="7" max="18" value="${dr}" step="0.5"
          oninput="document.getElementById('emi-rate-val').textContent=this.value+'%';AV.updateEMI('${car.slug}',AV.getActiveVariant('${car.slug}'),+document.getElementById('emi-down').value,+document.getElementById('emi-tenure-val').textContent,+this.value)">
      </div>
      <div class="emi-result" id="emi-result">
        <div class="emi-monthly-label">Monthly EMI</div>
        <div style="display:flex;align-items:baseline;gap:5px">
          <span class="emi-monthly-amount" id="emi-amount">Rs. ${Math.round(emi).toLocaleString()}</span>
          <span class="emi-monthly-period">/month</span>
        </div>
        <div class="emi-breakdown-grid" id="emi-breakdown">
          ${buildEMIBreakdown(vr.price, loan, emi, dt)}
        </div>
        <div class="emi-pbar-wrap">
          <div class="emi-pbar-track"><div class="emi-pbar-fill" id="emi-pbar" style="width:${Math.round((loan/(emi*dt))*100)}%"></div></div>
          <div class="emi-pbar-labels"><span id="emi-pl">Principal</span><span id="emi-il">Interest</span></div>
        </div>
      </div>
      <button onclick="alert('Apply for Finance — Call +977-9701076240')" class="btn btn-ghost btn-full" style="margin-top:10px;font-size:13px">${IC.phone} Apply for Finance</button>
    </div>`;
  }

  function buildEMIBreakdown(vehiclePrice, loan, emi, months) {
    const total = emi * months;
    const interest = total - loan;
    return [
      [Rs(Math.round(loan)), 'Loan Amount'],
      [Rs(Math.round(interest)), 'Total Interest'],
      [Rs(Math.round(total)), 'Total Amount'],
      [Rs(vehiclePrice), 'Vehicle Price'],
    ].map(([v, l]) => `<div class="emi-bd-item"><div class="emi-bd-value">${v}</div><div class="emi-bd-label">${l}</div></div>`).join('');
  }

  function updateEMI(slug, varIdx, dp, tenure, rate) {
    const car = carBySlug(slug);
    if (!car) return;
    const vr = car.variants[varIdx];
    const loan = vr.price * (1 - dp / 100);
    const emi = calcEMI(loan, rate, tenure);
    const total = emi * tenure;
    const pp = Math.round((loan / total) * 100);
    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const amtEl = document.getElementById('emi-amount');
    if (amtEl) amtEl.textContent = `Rs. ${Math.round(emi).toLocaleString()}`;
    const bdEl = document.getElementById('emi-breakdown');
    if (bdEl) bdEl.innerHTML = buildEMIBreakdown(vr.price, loan, emi, tenure);
    const pbar = document.getElementById('emi-pbar');
    if (pbar) pbar.style.width = pp + '%';
    s('emi-pl', `Principal ${pp}%`);
    s('emi-il', `Interest ${100 - pp}%`);
  }

  function setTenure(months, slug) {
    document.getElementById('emi-tenure-val').textContent = months;
    document.querySelectorAll('.tenure-btn').forEach(b => b.classList.toggle('active', parseInt(b.textContent) === months));
    const varIdx = activeVariant[slug] || 0;
    updateEMI(slug, varIdx, +document.getElementById('emi-down').value, months, +document.getElementById('emi-rate').value);
  }

  function getActiveVariant(slug) { return activeVariant[slug] || 0; }

  /* ─── COLOR SELECTOR ─── */
  function selectColor(el, name) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    const d = document.getElementById('color-name-display');
    if (d) d.textContent = name;
  }

  /* ─── DETAIL TABS ─── */
  function switchDetailTab(btn, paneId) {
    document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.detail-tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(paneId)?.classList.add('active');
  }

  /* ─── CAR CARD HTML ─── */
  function carCardHTML(car) {
    const vi = activeVariant[car.slug] || 0;
    const vr = car.variants[vi];
    const inCmp = compareList.includes(car.slug);
    return `<div class="car-card" onclick="AV.openDetail('${car.slug}')">
      <div class="car-card-img">
        <img src="${car.images[0]}" alt="${car.brand} ${car.model}" loading="lazy">
        <div class="card-badges"><span class="badge ${badgeClass(car.badge)}">${badgeLabel(car.badge)}</span></div>
        <button class="card-wishlist ${wishlist.includes(car.slug) ? 'wishlisted' : ''}" onclick="event.stopPropagation();AV.toggleWish('${car.slug}',this)">${IC.heart}</button>
        <div class="card-score">${IC.star} ${car.expertScore}/10</div>
        <button class="card-compare-btn ${inCmp ? 'added' : ''}" data-cmp-slug="${car.slug}" onclick="event.stopPropagation();AV.toggleCompare('${car.slug}')">${inCmp ? '✓ Added' : '+ Compare'}</button>
      </div>
      <div class="car-card-body">
        <div class="car-card-meta">
          <span class="rating-badge">${IC.star} ${fmtRating(car.rating)}</span>
          <span class="car-card-reviews">${car.reviews} reviews</span>
        </div>
        <div class="car-card-name">${car.brand} ${car.model}</div>
        <div class="car-card-sub">${car.year} · ${car.body}</div>
        <div class="car-card-specs">
          <span class="spec-pill">${car.type}</span>
          <span class="spec-pill">${car.specs['Fuel Efficiency'] || car.specs['Range (WLTP)'] || ''}</span>
        </div>
        <div class="car-card-colors">
          ${car.colors.slice(0, 4).map(c => `<span class="color-dot" style="background:${c.hex}" title="${c.name}"></span>`).join('')}
          <span class="colors-count">${car.colors.length} colors · ${car.variants.length} variants</span>
        </div>
        <div class="car-card-price-row">
          <div class="car-card-price-from">Starting from</div>
          <div class="car-card-price">${car.variants[0].label}</div>
          <div class="car-card-emi">EMI from <strong>Rs. ${car.baseEMI.toLocaleString()}/mo</strong></div>
          <div class="car-card-actions">
            <button class="cc-btn-outline" onclick="event.stopPropagation();alert('Call: +977-9701076240')">Get Price</button>
            <button class="cc-btn-fill" onclick="event.stopPropagation();AV.openDetail('${car.slug}')">Details</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ─── DETAIL PAGE ─── */
  function renderDetail(slug) {
    const car = carBySlug(slug);
    if (!car) { goTo('cars'); return; }
    const vi = activeVariant[slug] || 0;
    const vr = car.variants[vi];
    const inCmp = compareList.includes(slug);
    document.title = `${car.brand} ${car.model} ${car.year} — AutoViindu`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveNav('');

    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb">
          <a onclick="AV.goTo('home')">Home</a>
          <span class="sep">${IC.chevR}</span>
          <a onclick="AV.goTo('cars')">Cars</a>
          <span class="sep">${IC.chevR}</span>
          <span style="color:rgba(255,255,255,.7)">${car.brand} ${car.model}</span>
        </div>
        <h1 class="page-title">${car.brand} ${car.model} <span style="color:var(--gold-text)">${car.year}</span></h1>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:6px">
          <div class="page-sub">${car.type} · ${car.body} · ${car.variants.length} Variants</div>
          <span class="rating-badge">${IC.star} ${fmtRating(car.rating)}</span>
          <span style="font-size:12px;color:rgba(255,255,255,.3)">${car.reviews} reviews</span>
        </div>
      </div>
    </div>

    <div class="wrap detail-layout">
      <!-- MAIN COLUMN -->
      <div>
        <div id="gallery-container"></div>

        <!-- VARIANT SELECTOR -->
        <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:18px;margin-bottom:20px">
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--ink-4);margin-bottom:12px">
            Choose Variant — <strong style="color:var(--ink)">${car.variants.length} options</strong>
          </div>
          <div class="variant-tabs-row">
            ${car.variants.map((v, i) => `
              <div class="variant-tab ${i === vi ? 'active' : ''}" onclick="AV.selectVariant('${slug}',${i})">
                ${v.popular ? `<div class="popular-tag">Best Value</div>` : ''}
                <div class="vt-name">${v.name}</div>
                <div class="vt-price">${v.label}</div>
                <div class="vt-features">
                  ${v.features.slice(0, 3).map(f => `<div class="vt-feature"><span class="tick">${IC.check}</span>${f}</div>`).join('')}
                </div>
              </div>`).join('')}
          </div>
          <div class="variant-detail-panel" id="variant-detail-panel">
            ${vr.specs ? Object.entries(vr.specs).map(([k, v]) => `
              <div class="vdp-item"><div class="vdp-value">${v}</div><div class="vdp-label">${k}</div></div>`).join('') : ''}
          </div>
          <div style="margin-top:14px">
            <div style="font-size:11px;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Available Colors</div>
            <div class="color-selector">
              ${car.colors.map((c, i) => `<span class="color-swatch ${i === 0 ? 'active' : ''}" style="background:${c.hex}" title="${c.name}" onclick="AV.selectColor(this,'${c.name}')"></span>`).join('')}
            </div>
            <div class="color-name-display" id="color-name-display">${car.colors[0].name}</div>
          </div>
        </div>

        <!-- TABS -->
        <div style="border-radius:var(--r16);overflow:hidden;border:1px solid var(--border);margin-bottom:24px">
          <div class="detail-tabs-nav">
            <button class="detail-tab-btn active" onclick="AV.switchDetailTab(this,'tab-overview')">Overview</button>
            <button class="detail-tab-btn" onclick="AV.switchDetailTab(this,'tab-specs')">Specifications</button>
            <button class="detail-tab-btn" onclick="AV.switchDetailTab(this,'tab-compare-vars')">Variant Matrix</button>
            
          </div>

          <div id="tab-overview" class="detail-tab-pane active">
            <div style="font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--ink);margin-bottom:8px">${car.tagline}</div>
            <p style="font-size:13.5px;color:var(--ink-3);line-height:1.8;margin-bottom:22px">${car.overview}</p>
            <div class="quick-specs-grid">
              ${[
                ['Power', car.specs['Power'] || car.specs['Motor Power'] || car.specs['Combined Power']],
                ['Torque', car.specs['Torque']],
                ['Efficiency', car.specs['Fuel Efficiency'] || car.specs['Range (WLTP)']],
                ['0–100', car.specs['0–100 km/h']],
                ['Seating', car.specs['Seating']],
                ['Boot', car.specs['Boot Space']],
              ].filter(([, v]) => v).map(([l, v]) => `<div class="quick-spec-card"><div class="qs-value">${v}</div><div class="qs-label">${l}</div></div>`).join('')}
            </div>
            <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--ink-4);margin-bottom:10px">Key Highlights</div>
            <div style="display:flex;flex-wrap:wrap;gap:7px">
              ${(car.highlights || []).map(h => `<span class="badge badge-outline-green" style="font-size:12px;padding:5px 12px">${IC.check} ${h}</span>`).join('')}
            </div>
          </div>

          <div id="tab-specs" class="detail-tab-pane">
            <table class="spec-table">
              ${Object.entries(car.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
            </table>
          </div>

          <div id="tab-compare-vars" class="detail-tab-pane">
            <div style="font-size:13px;color:var(--ink-3);margin-bottom:16px">${car.brand} ${car.model} comes in <strong>${car.variants.length} variants</strong>. Compare what's included:</div>
            <div style="overflow-x:auto;border-radius:var(--r12);box-shadow:var(--shadow-xs)">
              <table class="var-matrix">
                <thead><tr>
                  <th style="text-align:left">Feature</th>
                  ${car.variants.map(v => `<th>${v.name}<br><span style="color:var(--gold-text);font-size:11px">${v.label}</span></th>`).join('')}
                </tr></thead>
                <tbody>
                  ${generateVariantMatrix(car)}
                </tbody>
              </table>
            </div>
          </div>

          <div id="tab-proscons" class="detail-tab-pane">
            <div class="pros-cons-grid">
              <div class="pros-box">
                <div class="pc-title" style="color:#16A34A">${IC.check} What We Love</div>
                ${car.pros.map(p => `<div class="pc-item"><span class="icon" style="color:#16A34A">${IC.check}</span>${p}</div>`).join('')}
              </div>
              <div class="cons-box">
                <div class="pc-title" style="color:#DC2626">${IC.x} Could Be Better</div>
                ${car.cons.map(c => `<div class="pc-item"><span class="icon" style="color:#DC2626">${IC.x}</span>${c}</div>`).join('')}
              </div>
            </div>
            <div class="expert-score-card">
              <div>
                <div class="expert-number">${car.expertScore}</div>
                <div class="score-out-of">Expert Score / 10</div>
              </div>
              <div class="score-bar-wrap">
                <div style="font-size:12.5px;font-weight:700;color:var(--ink)">AutoViindu Expert Rating</div>
                <div class="score-bar-track"><div class="score-bar-fill" style="width:${car.expertScore * 10}%"></div></div>
                <div class="score-labels"><span>Poor</span><span>Good</span><span>Excellent</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- SIMILAR CARS -->
        <div>
          <div style="font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--ink);margin-bottom:16px">Similar Cars</div>
          <div class="cars-grid" style="grid-template-columns:repeat(2,1fr)">
            ${(window.CARS_DB || []).filter(c => c.slug !== slug && (c.body === car.body || c.type === car.type)).slice(0, 4).map(c => carCardHTML(c)).join('')}
          </div>
        </div>
      </div>

      <!-- SIDEBAR -->
      <div class="detail-sidebar">
        <div class="price-card">
          <div class="price-card-from">Ex-Showroom Price</div>
          <div class="price-card-amount" data-price-display>${vr.label}</div>
          <div class="price-card-note">*Contact for final on-road price</div>
          <!-- VARIANT DROPDOWN -->
          <div style="margin:14px 0 0">
            <label style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--ink-4);display:block;margin-bottom:6px">Select Variant</label>
            <div style="position:relative">
              <select id="variant-dropdown" onchange="AV.selectVariant('${slug}',+this.value)" style="width:100%;padding:11px 36px 11px 12px;border:1.5px solid var(--border);border-radius:var(--r10);font-family:var(--font-body);font-size:13.5px;font-weight:700;color:var(--ink);background:var(--white);appearance:none;outline:none;cursor:pointer;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237A8BA0%22 stroke-width=%222.5%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 12px center;transition:border-color var(--ease)">
                ${car.variants.map((v, i) => `<option value="${i}" ${i === vi ? 'selected' : ''}>${v.name} — ${v.label}${v.popular ? ' (Best Value)' : ''}</option>`).join('')}
              </select>
            </div>
          </div>
          <!-- Selected Variant Key Specs -->
          <div id="variant-quick-specs" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:12px 0">
            ${vr.specs ? Object.entries(vr.specs).slice(0,4).map(([k,v]) => `<div style="padding:8px 10px;background:var(--bg);border-radius:var(--r8)"><div style="font-size:13px;font-weight:800;color:var(--ink)">${v}</div><div style="font-size:10px;color:var(--ink-4);margin-top:1px">${k}</div></div>`).join('') : ''}
          </div>
          <!-- Variant Features -->
          <div id="variant-features-list" style="margin-bottom:12px">
            ${vr.features.slice(0,4).map(f => `<div style="display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid var(--bg-2)"><span style="color:var(--green);flex-shrink:0">${IC.check}</span><span style="font-size:12.5px;color:var(--ink-2)">${f}</span></div>`).join('')}
          </div>
          <div class="price-card-actions">
            <button class="btn btn-primary btn-full" onclick="alert('Best price: +977-9701076240')">${IC.phone} Get Best Price</button>
            <button class="btn btn-gold btn-full" onclick="alert('Book Test Drive: +977-9701076240')">${IC.car} Book Test Drive</button>
            <button class="btn btn-ghost btn-full ${inCmp ? 'added' : ''}" data-cmp-slug="${slug}" onclick="AV.toggleCompare('${slug}')" style="font-size:13px">${IC.cmp} ${inCmp ? '✓ In Compare' : 'Add to Compare'}</button>
          </div>
        </div>
        ${renderEMICard(car, vi)}
        <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:16px;margin-top:12px">
          <div style="font-size:13.5px;font-weight:800;color:var(--ink);margin-bottom:10px">Get in Touch</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <a href="tel:+9779701076240" style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--green);font-weight:700">${IC.phone} +977-9701076240</a>
            <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-3)">${IC.pin} Nayabazar, Kathmandu</div>
          </div>
        </div>
        <button onclick="AV.goTo('cars')" class="btn btn-ghost btn-full" style="margin-top:10px;font-size:13px">← Back to All Cars</button>
      </div>
    </div>`;

    buildGallery(car, 'gallery-container');
    updateCompareTray();
    updateCompareButtons();
  }

  function generateVariantMatrix(car) {
    // Build feature set from all variants
    const allFeatures = new Set();
    car.variants.forEach(v => v.features.forEach(f => {
      const clean = f.replace(/^(Style|Super|Smart|Sharp|Savvy|E|G|Z|S|V|VX|HTX|HTX\+|GTX\+|Standard|Extended|Std|VXi|ZXi)\s+features\+?$/i, '');
      if (clean) allFeatures.add(f);
    }));

    // Simple matrix: for each feature, mark which variant has it
    const featureList = Array.from(allFeatures).filter(f => !f.match(/features\+/i)).slice(0, 10);
    return featureList.map(feat => {
      const cells = car.variants.map(v => {
        const has = v.features.some(f => f.toLowerCase().includes(feat.toLowerCase().split(' ')[0]));
        return `<td class="${has ? 'vm-yes' : 'vm-no'}">${has ? '✓' : '—'}</td>`;
      });
      return `<tr><td>${feat}</td>${cells.join('')}</tr>`;
    }).join('');
  }

  /* ─── CARS LISTING ─── */
  function renderCars(filter, options = {}) {
    document.title = 'New Cars Nepal — AutoViindu';
    let cars = window.CARS_DB || [];
    const filterMap = {
      electric: c => c.type === 'Electric',
      hybrid: c => c.type === 'Hybrid',
      petrol: c => c.type === 'Petrol',
      diesel: c => c.type === 'Diesel',
      suv: c => c.body === 'SUV',
      sedan: c => c.body === 'Sedan',
      hatchback: c => c.body === 'Hatchback',
    };
    if (filter && filterMap[filter]) cars = cars.filter(filterMap[filter]);
    if (options.q) {
      const q = options.q.toLowerCase();
      cars = cars.filter(c => `${c.brand} ${c.model} ${c.type} ${c.body}`.toLowerCase().includes(q));
    }

    const filterLabels = { electric: 'Electric Cars', hybrid: 'Hybrid Cars', petrol: 'Petrol Cars', diesel: 'Diesel Cars', suv: 'SUVs', sedan: 'Sedans', hatchback: 'Hatchbacks' };
    const title = filter ? (filterLabels[filter] || filter) : 'New Cars in Nepal 2024–25';
    setActiveNav(filter === 'electric' ? 'electric' : 'cars');

    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb">
          <a onclick="AV.goTo('home')">Home</a>
          <span class="sep">${IC.chevR}</span>
          <span style="color:rgba(255,255,255,.7)">${title}</span>
        </div>
        <h1 class="page-title">${title}</h1>
        <div class="page-sub">${cars.length} cars · Full specs, variants & EMI calculator</div>
      </div>
    </div>
    <div class="wrap" style="padding-top:24px;padding-bottom:64px">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:20px">
        <div style="flex:1;min-width:220px;position:relative">
          <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink-4)">${IC.search}</span>
          <input type="text" placeholder="Search brand, model…" id="listing-search"
            style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--border);border-radius:var(--pill);font-size:13.5px;outline:none;font-family:var(--font-body);transition:all var(--ease)"
            oninput="AV.filterListing(this.value)"
            onfocus="this.style.borderColor='var(--green)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <select id="listing-sort" onchange="AV.sortListing(this.value)"
          style="padding:10px 32px 10px 12px;border:1.5px solid var(--border);border-radius:var(--pill);font-family:var(--font-body);font-size:13px;outline:none;background:var(--white);appearance:none;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237A8BA0%22 stroke-width=%222.5%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 10px center;cursor:pointer">
          <option value="">Sort: Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
          <option value="efficiency">Best Efficiency</option>
        </select>
      </div>
      <div class="filter-chips">
        ${['All', 'Electric', 'Hybrid', 'Petrol', 'Diesel', 'SUV', 'Sedan', 'Hatchback'].map(t => `<span class="chip ${(!filter && t === 'All') || (filter && filter === t.toLowerCase()) ? 'active' : ''}" onclick="AV.goTo('cars',{filter:'${t.toLowerCase() === 'all' ? '' : t.toLowerCase()}'})"> ${t}</span>`).join('')}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r10);margin-bottom:18px">
        <div style="font-size:13px;font-weight:700;color:var(--ink)">Showing <span style="color:var(--green)" id="listing-count">${cars.length}</span> cars</div>
        <div style="font-size:12px;color:var(--ink-4)">${cars.length} results for Nepal</div>
      </div>
      <div class="cars-grid" id="listing-grid">
        ${cars.map(c => carCardHTML(c)).join('') || `
          <div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--bg);border-radius:var(--r20)">
            <div style="font-size:40px;margin-bottom:12px">🔍</div>
            <div style="font-size:18px;font-weight:800;margin-bottom:8px">No cars found</div>
            <button onclick="AV.goTo('cars')" class="btn btn-primary" style="margin-top:8px">Browse all cars</button>
          </div>`}
      </div>
    </div>`;
    updateCompareTray();
    updateCompareButtons();

    // Store for live filtering
    window._listingCars = cars;
    window._listingFilter = filter;
  }

  window._listingCars = [];
  window._listingFilter = null;

  function filterListing(q) {
    let cars = window.CARS_DB || [];
    if (window._listingFilter && window._listingFilter !== 'all') {
      const filterMap = { electric: c => c.type === 'Electric', hybrid: c => c.type === 'Hybrid', petrol: c => c.type === 'Petrol', diesel: c => c.type === 'Diesel', suv: c => c.body === 'SUV', sedan: c => c.body === 'Sedan', hatchback: c => c.body === 'Hatchback' };
      if (filterMap[window._listingFilter]) cars = cars.filter(filterMap[window._listingFilter]);
    }
    if (q) {
      const query = q.toLowerCase();
      cars = cars.filter(c => `${c.brand} ${c.model} ${c.type} ${c.body} ${c.year}`.toLowerCase().includes(query) || c.variants.some(v => v.name.toLowerCase().includes(query)));
    }
    const grid = document.getElementById('listing-grid');
    const cnt = document.getElementById('listing-count');
    if (grid) grid.innerHTML = cars.map(c => carCardHTML(c)).join('') || `<div style="grid-column:1/-1;text-align:center;padding:40px;background:var(--bg);border-radius:var(--r16)"><div style="font-size:18px;font-weight:800;margin-bottom:8px">No results</div><div style="color:var(--ink-4)">Try a different search term</div></div>`;
    if (cnt) cnt.textContent = cars.length;
    updateCompareButtons();
  }

  function sortListing(val) {
    let cars = [...(window._listingCars || window.CARS_DB || [])];
    if (val === 'price-asc') cars.sort((a, b) => a.variants[0].price - b.variants[0].price);
    else if (val === 'price-desc') cars.sort((a, b) => b.variants[0].price - a.variants[0].price);
    else if (val === 'rating') cars.sort((a, b) => b.rating - a.rating);
    const grid = document.getElementById('listing-grid');
    if (grid) grid.innerHTML = cars.map(c => carCardHTML(c)).join('');
    updateCompareButtons();
  }

  /* ─── HOME PAGE ─── */
  function renderHome() {
    document.title = 'AutoViindu — Find Your Perfect Car in Nepal';
    setActiveNav('home');
    const db = window.CARS_DB || [];
    document.getElementById('app-root').innerHTML = `

    <!-- HERO -->
    <section class="hero-section">
      <!-- Deal Banner -->
      <div class="hero-deal-banner">
        <div class="wrap hero-deal-inner">
          <div class="hero-deal-pulse"></div>
          <span class="hero-deal-text">Latest Deal &mdash; <strong>Toyota Fortuner 2025</strong> at Rs. 1.12 Cr · Zero registration until June 30</span>
          <button onclick="AV.goTo('cars')" class="hero-deal-cta">View Deal</button>
        </div>
      </div>

      <div class="hero-bg">
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=900&fit=crop&q=90" alt="Hero car" class="hero-bg-img" loading="eager">
        <div class="hero-bg-overlay"></div>
      </div>

      <div class="wrap hero-content">
        <div class="hero-left">
          <p class="hero-label">Nepal's Trusted Car Platform</p>
          <h1 class="hero-title">Find Your Perfect<br>Car in Nepal</h1>
          <p class="hero-sub">500+ cars, 50+ brands. Real Nepal prices, variant breakdowns, EMI calculator — all in one place.</p>

          <!-- Category Sort Pills -->
          <div class="hero-categories">
            ${[
              { label:'All Cars', filter:'', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>' },
              { label:'Electric', filter:'electric', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
              { label:'Hybrid', filter:'hybrid', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>' },
              { label:'SUV', filter:'suv', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2l2-4h10l2 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>' },
              { label:'Sedan', filter:'sedan', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2l2-4h10l2 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>' },
              { label:'Under Rs. 30L', filter:'budget30', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>' },
            ].map((c, i) => `<button class="hero-cat-pill ${i === 0 ? 'active' : ''}" onclick="AV.heroFilter('${c.filter}',this)">${c.icon}${c.label}</button>`).join('')}
          </div>

          <div class="hero-actions">
            <button onclick="AV.goTo('cars')" class="btn btn-primary btn-lg">Browse All Cars</button>
            <button onclick="AV.goTo('compare')" class="btn hero-compare-btn">Compare Cars</button>
          </div>

          <div class="hero-stats">
            ${[['500+','Cars Listed'],['50+','Brands'],['10K+','Buyers Helped'],['24/7','Support']].map(([n,l]) => `
              <div class="hero-stat">
                <div class="hero-stat-num">${n}</div>
                <div class="hero-stat-label">${l}</div>
              </div>`).join('<div class="hero-stat-divider"></div>')}
          </div>
        </div>
      </div>
    </section>

    <!-- SEARCH BOX -->
    <div class="hero-search-wrap">
      <div class="hero-search-box">
        <div class="hero-search-tabs">
          ${['New Cars','Used Cars','Electric','Hybrid'].map((t, i) => `<button class="hero-stab ${i===0?'active':''}" onclick="AV.goTo('${t.toLowerCase().replace(/ /g,'-')}')">${t}</button>`).join('')}
        </div>
        <div class="hero-search-fields">
          <div class="hero-search-field">
            <label>Brand</label>
            <select class="form-select">
              <option>All Brands</option>
              ${['Toyota','Honda','Hyundai','Kia','Suzuki','MG','BYD','BMW','Mercedes','Audi'].map(b => `<option>${b}</option>`).join('')}
            </select>
          </div>
          <div class="hero-search-field">
            <label>Budget</label>
            <select class="form-select">
              <option>Any Budget</option>
              <option>Under Rs. 20L</option>
              <option>Rs. 20–40L</option>
              <option>Rs. 40–60L</option>
              <option>Rs. 60L+</option>
            </select>
          </div>
          <div class="hero-search-field">
            <label>Fuel Type</label>
            <select class="form-select">
              <option>All Types</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>
          <button class="btn btn-primary" onclick="AV.goTo('cars')" style="height:42px;font-size:14px;padding:0 22px">${IC.search} Search</button>
        </div>
        <div class="hero-search-popular">
          <span>Popular:</span>
          ${['MG Hector','IONIQ 5','Toyota Prius','Honda City','Kia Seltos'].map(t => `<span class="hero-popular-chip" onclick="AV.goTo('cars')">${t}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- FEATURED CARS -->
    <section class="section" style="padding-top:72px">
      <div class="wrap">
        <div class="sec-header">
          <div class="left">
            <div class="eyebrow">Handpicked for Nepal</div>
            <h2 class="sec-title">Featured New Cars</h2>
            <div class="sec-sub">${db.length} cars with full specs &amp; EMI calculator</div>
          </div>
          <button class="view-all-btn" onclick="AV.goTo('cars')">All Cars ${IC.chevR}</button>
        </div>
        <div class="filter-chips" id="home-filter-chips">
          ${['All','Electric','Hybrid','Petrol','SUV','Sedan','Hatchback'].map((t,i) => `<span class="chip ${i===0?'active':''}" onclick="AV.homeFilter('${t}',this)">${t}</span>`).join('')}
        </div>
        <div class="cars-grid" id="home-cars-grid">${db.slice(0,8).map(c => carCardHTML(c)).join('')}</div>
        <div style="text-align:center;margin-top:24px" id="load-more-wrap">
          <button onclick="AV.showMoreHome()" class="btn btn-outline" style="font-size:14px">Show All ${db.length} Cars</button>
        </div>
      </div>
    </section>

    <!-- EV BANNER -->
    <section class="section section-alt">
      <div class="wrap">
        <div class="ev-banner">
          <img src="https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&h=500&fit=crop&q=85" alt="Electric Car" class="ev-banner-img">
          <div class="ev-banner-content">
            <div class="eyebrow" style="color:#3ECBA5">Going Green?</div>
            <h2 class="ev-banner-title">Electric Cars in Nepal</h2>
            <p class="ev-banner-sub">Best EVs for Nepal's roads — range, V2L for load-shedding, and real-world performance tested locally.</p>
            <div class="ev-banner-models">
              ${db.filter(c => c.type === 'Electric').map(c => `<span onclick="AV.openDetail('${c.slug}')">${c.brand} ${c.model}</span>`).join('')}
            </div>
            <button onclick="AV.goTo('cars',{filter:'electric'})" class="btn btn-primary">${IC.bolt} View All EVs</button>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY US -->
    <section class="section">
      <div class="wrap">
        <div class="sec-header">
          <div class="left">
            <div class="eyebrow">Why Choose Us</div>
            <h2 class="sec-title">Built for Nepal's Car Buyers</h2>
          </div>
        </div>
        <div class="why-grid">
          ${[
            { c:'#1A6B2A',bg:'#EEF7F0',t:'Variant Brochure',d:"See exactly what's in each trim — no guesswork",svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`},
            { c:'#1A4DB8',bg:'#EEF3FC',t:'Live EMI Calculator',d:'Adjust down payment, tenure & rate in real time',svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="9.5" y2="11"/><line x1="12" y1="11" x2="13.5" y2="11"/><line x1="8" y1="15" x2="9.5" y2="15"/><line x1="12" y1="15" x2="13.5" y2="15"/><line x1="8" y1="19" x2="16" y2="19"/></svg>`},
            { c:'#B8900E',bg:'#FDF6E0',t:'Side-by-Side Compare',d:'Compare up to 3 cars with winner highlighting',svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="3" width="8" height="18" rx="1.5"/><rect x="14" y="3" width="8" height="18" rx="1.5"/><line x1="11" y1="12" x2="13" y2="12"/></svg>`},
            { c:'#C8271E',bg:'#FFF0EF',t:'Nepal Verified Prices',d:'Accurate Nepal ex-showroom prices, not estimates',svg:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`},
          ].map(w => `<div class="why-card">
            <div class="why-icon" style="background:${w.bg};color:${w.c}">${w.svg}</div>
            <div class="why-title">${w.t}</div>
            <div class="why-desc">${w.d}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section-alt">
      <div class="wrap">
        <div class="cta-banner">
          <div class="cta-banner-inner">
            <div class="cta-banner-label">Start your journey</div>
            <h2 class="cta-banner-title">Find Your Perfect Car Today</h2>
            <p class="cta-banner-sub">Complete specs, variant breakdowns, EMI calculator, and side-by-side comparisons.</p>
            <div class="cta-banner-btns">
              <button onclick="AV.goTo('cars')" class="btn btn-primary btn-lg">${IC.search} Browse All Cars</button>
              <button onclick="AV.goTo('services')" class="btn" style="background:rgba(255,255,255,.09);color:rgba(255,255,255,.85);border:1.5px solid rgba(255,255,255,.14);padding:14px 28px;font-size:15px;font-weight:700;border-radius:var(--r12)">Our Services</button>
            </div>
          </div>
        </div>
      </div>
    </section>`;

    updateCompareTray();
    updateCompareButtons();
  }

  function heroFilter(type, btn) {
    document.querySelectorAll('.hero-cat-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    if (type === 'budget30') {
      AV.goTo('cars');
    } else {
      AV.goTo('cars', { filter: type || null });
    }
  }

  function homeFilter(type, btn) {
    document.querySelectorAll('#home-filter-chips .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const db = window.CARS_DB || [];
    const filtered = type === 'All' ? db : db.filter(c => {
      if (type === 'Electric') return c.type === 'Electric';
      if (type === 'Hybrid') return c.type === 'Hybrid';
      if (type === 'Petrol') return c.type === 'Petrol';
      if (type === 'SUV') return c.body === 'SUV';
      if (type === 'Sedan') return c.body === 'Sedan';
      if (type === 'Hatchback') return c.body === 'Hatchback';
      return true;
    });
    const grid = document.getElementById('home-cars-grid');
    if (grid) grid.innerHTML = filtered.map(c => carCardHTML(c)).join('');
    const wrap = document.getElementById('load-more-wrap');
    if (wrap) wrap.style.display = 'none';
    updateCompareButtons();
  }

  function showMoreHome() {
    const grid = document.getElementById('home-cars-grid');
    if (grid) grid.innerHTML = (window.CARS_DB || []).map(c => carCardHTML(c)).join('');
    const wrap = document.getElementById('load-more-wrap');
    if (wrap) wrap.innerHTML = `<p style="font-size:13px;color:var(--ink-4)">All ${(window.CARS_DB||[]).length} cars loaded · <a onclick="AV.goTo('cars')" style="color:var(--green);cursor:pointer;font-weight:700">View full listing →</a></p>`;
    updateCompareButtons();
  }

  /* ─── COMPARE PAGE ─── */
  function renderCompare() {
    document.title = 'Compare Cars — AutoViindu';
    setActiveNav('compare');
    const db = window.CARS_DB || [];
    const cols = compareList.slice(0, 3);
    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="sep">${IC.chevR}</span><span style="color:rgba(255,255,255,.7)">Compare Cars</span></div>
        <h1 class="page-title">Compare Cars Side-by-Side</h1>
        <div class="page-sub">${cols.length} of 3 cars selected</div>
      </div>
    </div>
    <div class="wrap" style="padding-top:28px;padding-bottom:64px">
      <div style="margin-bottom:32px">
        <div style="font-size:13px;font-weight:800;color:var(--ink);margin-bottom:12px">Pick cars to compare (up to 3):</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
          @media(min-width:640px){grid-template-columns:repeat(3,1fr)}
          ${db.map(car => {
      const inCmp = compareList.includes(car.slug);
      return `<div onclick="AV.toggleCompare('${car.slug}')" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid ${inCmp ? 'var(--green)' : 'var(--border)'};background:${inCmp ? 'var(--green-ll)' : 'var(--white)'};border-radius:var(--r10);cursor:pointer;transition:all var(--ease)">
          <img src="${car.images[0]}" style="width:46px;height:30px;object-fit:cover;border-radius:var(--r6);flex-shrink:0">
          <div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:800;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${car.brand} ${car.model}</div><div style="font-size:11px;color:var(--ink-4)">${car.variants[0].label}</div></div>
          <span style="font-size:16px;color:${inCmp ? 'var(--green)' : 'var(--ink-5)'}">${inCmp ? '✓' : '+'}</span>
        </div>`;
    }).join('')}
        </div>
      </div>
      ${cols.length >= 2 ? renderCompareTable(cols) : `
        <div style="text-align:center;padding:60px 20px;background:var(--bg);border:2px dashed var(--border-2);border-radius:var(--r20)">
          <div style="font-size:40px;margin-bottom:12px">🚗</div>
          <div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px">Select 2 or more cars above to compare</div>
          <div style="color:var(--ink-4)">Click the + buttons to add cars</div>
        </div>`}
    </div>`;
    updateCompareTray();
  }

  function renderCompareTable(cols) {
    const carData = cols.map(s => carBySlug(s)).filter(Boolean);
    const specs = ['variants[0].price','rating','expertScore','specs.Power||specs.Motor Power||specs.Combined Power','specs.Torque','specs.Fuel Efficiency||specs.Range (WLTP)','specs.0–100 km/h','specs.Boot Space','specs.Ground Clearance','specs.Seating'];
    const specLabels = ['Base Price','Rating','Expert Score','Power','Torque','Fuel/Range','0–100 km/h','Boot Space','Ground Clearance','Seating'];
    const getVal = (car, spec) => {
      if (spec === 'variants[0].price') return car.variants[0].label;
      if (spec === 'rating') return fmtRating(car.rating) + '★';
      if (spec === 'expertScore') return car.expertScore + '/10';
      const parts = spec.replace('specs.', '').split('||');
      for (const p of parts) { const v = car.specs[p.trim()]; if (v) return v; }
      return '—';
    };
    return `<div style="overflow-x:auto;border-radius:var(--r20);box-shadow:var(--shadow-md)">
      <table style="width:100%;border-collapse:collapse;min-width:380px">
        <thead>
          <tr>
            <th style="background:rgba(13,17,23,.95);padding:14px;color:rgba(255,255,255,.45);font-size:11px;font-weight:700;text-align:left;border:none">Specification</th>
            ${carData.map(c => `<th style="background:var(--ink-2);padding:14px;text-align:center;vertical-align:top;border:none">
              <img src="${c.images[0]}" style="width:100%;height:80px;object-fit:cover;border-radius:var(--r10);margin-bottom:8px;display:block">
              <div style="font-size:11px;color:rgba(255,255,255,.4);font-weight:600">${c.brand}</div>
              <div style="font-size:15px;font-weight:800;color:#fff">${c.model}</div>
              <div style="font-size:13px;font-weight:800;color:var(--gold-text);margin-top:5px">${c.variants[0].label}</div>
              <div style="display:flex;gap:6px;justify-content:center;margin-top:9px">
                <button onclick="AV.openDetail('${c.slug}')" style="padding:5px 10px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border:none;border-radius:var(--r6);font-family:var(--font-body);font-size:10.5px;font-weight:700;cursor:pointer">Details</button>
                <button onclick="AV.toggleCompare('${c.slug}')" style="padding:5px 10px;background:rgba(220,38,38,.2);color:#FCA5A5;border:none;border-radius:var(--r6);font-family:var(--font-body);font-size:10.5px;font-weight:700;cursor:pointer">Remove</button>
              </div>
            </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${specLabels.map((label, i) => {
      const vals = carData.map(c => getVal(c, specs[i]));
      return `<tr style="${i % 2 === 0 ? '' : 'background:var(--bg)'}">
              <td style="padding:10px 14px;font-weight:700;color:var(--ink-3);font-size:12.5px;border-bottom:1px solid var(--border)">${label}</td>
              ${vals.map(v => `<td style="padding:10px 14px;text-align:center;font-size:13px;color:var(--ink-2);border-bottom:1px solid var(--border)">${v}</td>`).join('')}
            </tr>`;
    }).join('')}
        </tbody>
      </table>
    </div>`;
  }

  /* ─── SERVICES PAGE ─── */
  function renderServices() {
    document.title = 'Car Services Nepal — AutoViindu';
    setActiveNav('services');
    const svcs = [
      { id: 'cosmetic', name: 'Cosmetic Car Care', color: '#1A6B2A', bg: '#EEF7F0', items: ['Basic Washing & Cleaning', 'Interior Vacuum & Polish', 'Paint Protection Film', 'Scratch & Dent Correction', 'Headlight Restoration', 'Underbody Anti-Rust Coating', 'Alloy & Tyre Shine', 'Engine Bay Cleaning', 'Ceramic Coating (9H)', 'Odour & Sanitization', 'Nano-coating Application', 'Full Body Detailing'] },
      { id: 'workshop', name: 'Workshop Services', color: '#B8900E', bg: '#FDF6E0', items: ['Wiring & Electrical Diagnosis', 'Hybrid / EV Electrical Work', 'Sensor / ECU Troubleshooting', 'Transmission Repair', 'Air Conditioning Overhaul', 'Body Work & Panel Repair', 'Wheel Alignment', 'Wheel Balancing', 'Suspension Inspection', 'Software Updates & Calibration', 'Brake Inspection & Service', 'Engine Tune-up'] },
      { id: 'telematics', name: 'Telematics & GPS', color: '#1A4DB8', bg: '#EEF3FC', items: ['GPS Tracking Units', 'Remote Immobilizer Systems', 'Geo-fencing & Alerts', 'OBD Plug Diagnostics', 'Dashcam & Security Kits', 'Fuel Monitoring Sensors', 'TPMS Installation', 'Fleet Management Solutions'] },
      { id: 'roadside', name: 'Roadside Assistance', color: '#C8271E', bg: '#FFF0EF', items: ['Emergency Towing', 'Battery Jumpstart', 'Flat Tyre Change', 'Emergency Fuel Delivery', 'Lock-Out Service', 'Minor Mechanical Help', '24/7 SOS Support'] },
    ];
    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="sep">${IC.chevR}</span><span style="color:rgba(255,255,255,.7)">Services</span></div>
        <h1 class="page-title">Our Services</h1>
        <div class="page-sub">Complete automotive care across Nepal</div>
      </div>
    </div>

    <!-- STICKY NAV -->
    <div style="background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:var(--nav-h);z-index:40;overflow-x:auto;scrollbar-width:none">
      <div class="wrap" style="display:flex;gap:7px;padding-top:10px;padding-bottom:10px;white-space:nowrap">
        ${svcs.map(s => `<a href="#svc-${s.id}" style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border:1.5px solid ${s.color}22;border-radius:var(--pill);font-size:12.5px;font-weight:700;color:${s.color};background:${s.bg};flex-shrink:0">${s.name}</a>`).join('')}
      </div>
    </div>

    <div class="wrap" style="padding-top:32px;padding-bottom:64px">
      <div style="display:grid;grid-template-columns:1fr;gap:48px">
        ${svcs.map(s => `
          <section id="svc-${s.id}" style="scroll-margin-top:calc(var(--nav-h) + 52px)">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap">
              <div>
                <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:${s.color};margin-bottom:6px">${s.items.length} services available</div>
                <h2 style="font-family:var(--font-display);font-size:24px;font-weight:800;color:var(--ink);margin-bottom:6px">${s.name}</h2>
              </div>
              <button onclick="document.getElementById('service-form-${s.id}').scrollIntoView({behavior:'smooth'})" style="display:inline-flex;align-items:center;gap:6px;padding:10px 18px;background:${s.color};color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-body);font-size:13px;font-weight:700;cursor:pointer;flex-shrink:0">${IC.phone} Book Now</button>
            </div>
            <div class="service-items-grid">
              ${s.items.map(item => `
                <div style="display:flex;align-items:flex-start;gap:9px;padding:12px 14px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--r10);cursor:pointer;transition:all var(--ease)"
                  onmouseenter="this.style.borderColor='${s.color}';this.style.background='${s.bg}'"
                  onmouseleave="this.style.borderColor='var(--border)';this.style.background='var(--white)'">
                  <div style="width:7px;height:7px;background:${s.color};border-radius:50%;flex-shrink:0;margin-top:4px"></div>
                  <span style="font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.4">${item}</span>
                </div>`).join('')}
            </div>

            <!-- SERVICE FORM -->
            <div id="service-form-${s.id}" style="margin-top:24px">
              <div class="service-form-panel" style="border-left:3px solid ${s.color}">
                <div class="service-form-title" style="color:${s.color}">Book ${s.name}</div>
                <div class="service-form-sub">Fill this quick form and we'll confirm your appointment within 2 hours.</div>
                <div id="form-success-${s.id}" class="form-success">
                  <div class="form-success-icon">✅</div>
                  <div class="form-success-title">Booking Request Received!</div>
                  <div class="form-success-sub">We'll call you within 2 hours to confirm your appointment.</div>
                </div>
                <form onsubmit="AV.submitServiceForm(event,'${s.id}')" id="form-${s.id}">
                  <div class="form-grid-2">
                    <div class="form-group">
                      <label class="form-label">Your Name *</label>
                      <input class="form-input" type="text" placeholder="Full name" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Phone Number *</label>
                      <input class="form-input" type="tel" placeholder="+977 98XXXXXXXX" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Vehicle Brand</label>
                      <select class="form-select">
                        <option value="">Select brand</option>
                        ${['Toyota','Honda','Hyundai','Kia','Suzuki','MG','BYD','BMW','Mercedes','Other'].map(b => `<option>${b}</option>`).join('')}
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Vehicle Model / Year</label>
                      <input class="form-input" type="text" placeholder="e.g. Prius 2022">
                    </div>
                    <div class="form-group form-grid-full">
                      <label class="form-label">Preferred Service</label>
                      <select class="form-select">
                        <option value="">Select service</option>
                        ${s.items.map(i => `<option>${i}</option>`).join('')}
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Preferred Date</label>
                      <input class="form-input" type="date" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Preferred Time</label>
                      <select class="form-select">
                        <option>9:00 AM – 11:00 AM</option>
                        <option>11:00 AM – 1:00 PM</option>
                        <option>1:00 PM – 3:00 PM</option>
                        <option>3:00 PM – 5:00 PM</option>
                      </select>
                    </div>
                    <div class="form-group form-grid-full">
                      <label class="form-label">Additional Notes</label>
                      <textarea class="form-textarea" placeholder="Describe the issue or any specific requirements…" style="min-height:80px"></textarea>
                    </div>
                  </div>
                  <div class="form-submit-row" style="margin-top:16px">
                    <div class="form-privacy">${IC.shield} Your information is private & secure</div>
                    <button type="submit" class="btn" style="background:${s.color};color:#fff;padding:11px 26px;font-size:14px">${IC.phone} Book Appointment</button>
                  </div>
                </form>
              </div>
            </div>
            <div style="height:1px;background:var(--border);margin-top:48px"></div>
          </section>`).join('')}
      </div>
    </div>`;
  }

  function submitServiceForm(e, id) {
    e.preventDefault();
    const form = document.getElementById(`form-${id}`);
    const success = document.getElementById(`form-success-${id}`);
    if (form) form.style.display = 'none';
    if (success) success.classList.add('visible');
    toast('Booking request submitted!', 'success');
  }

  /* ─── USED CARS ─── */
  function renderUsed(opts = {}) {
    document.title = 'Used Cars Nepal — AutoViindu';
    setActiveNav('used');
    const ALL_USED = [
      { brand: 'Toyota', model: 'Fortuner', year: 2021, km: '38,450', type: 'Diesel', body: 'SUV', price: 6800000, priceLabel: 'Rs. 68L', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop', tags: ['1 Owner', 'Full Service History'] },
      { brand: 'Honda', model: 'Civic', year: 2020, km: '44,200', type: 'Petrol', body: 'Sedan', price: 2800000, priceLabel: 'Rs. 28L', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop', tags: ['Well Maintained'] },
      { brand: 'Hyundai', model: 'Tucson', year: 2022, km: '22,100', type: 'Petrol', body: 'SUV', price: 4200000, priceLabel: 'Rs. 42L', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=300&fit=crop', tags: ['Low KM', '1 Owner'] },
      { brand: 'Toyota', model: 'Prius', year: 2020, km: '41,300', type: 'Hybrid', body: 'Sedan', price: 3000000, priceLabel: 'Rs. 30L', img: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&h=300&fit=crop', tags: ['Fuel Saver'] },
      { brand: 'Kia', model: 'Sportage', year: 2022, km: '18,200', type: 'Diesel', body: 'SUV', price: 3600000, priceLabel: 'Rs. 36L', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=300&fit=crop', tags: ['Low KM'] },
      { brand: 'BMW', model: 'X3', year: 2021, km: '29,400', type: 'Petrol', body: 'SUV', price: 7200000, priceLabel: 'Rs. 72L', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop', tags: ['Premium', 'Loaded'] },
    ];

    let cars = [...ALL_USED];
    if (opts.filter === 'suv') cars = cars.filter(c => c.body === 'SUV');
    else if (opts.filter === 'sedan') cars = cars.filter(c => c.body === 'Sedan');
    else if (opts.filter === 'hybrid') cars = cars.filter(c => c.type === 'Hybrid');
    if (opts.budget === 'under20') cars = cars.filter(c => c.price < 2000000);
    else if (opts.budget === '20to40') cars = cars.filter(c => c.price >= 2000000 && c.price <= 4000000);
    else if (opts.budget === 'above40') cars = cars.filter(c => c.price > 4000000);

    const filterLabel = opts.filter ? opts.filter.toUpperCase() + 's' : opts.budget ? 'Budget Range' : 'All';

    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="sep">${IC.chevR}</span><span style="color:rgba(255,255,255,.7)">Used Cars</span></div>
        <h1 class="page-title">Certified Used Cars</h1>
        <div class="page-sub">${ALL_USED.length} verified pre-owned vehicles in Nepal</div>
      </div>
    </div>
    <div class="wrap" style="padding-top:24px;padding-bottom:64px">
      <!-- Trust Badges -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:24px">
        ${[['#1A6B2A','#EEF7F0','140-Point Inspection'],['#1A4DB8','#EEF3FC','Verified Ownership'],['#B8900E','#FDF6E0','Fair Market Price'],['#C8271E','#FFF0EF','Full Service History']].map(([c,bg,t]) => `<div style="display:flex;align-items:center;gap:8px;padding:11px 13px;background:${bg};border:1px solid ${c}22;border-radius:var(--r10)"><div style="width:7px;height:7px;background:${c};border-radius:50%;flex-shrink:0"></div><span style="font-size:12px;font-weight:700;color:var(--ink-2)">${t}</span></div>`).join('')}
      </div>
      <!-- Filters -->
      <div class="filter-chips" style="margin-bottom:20px">
        ${[
          ['All', ''],
          ['SUV', 'suv'],
          ['Sedan', 'sedan'],
          ['Hybrid', 'hybrid'],
          ['Under Rs. 20L', 'under20'],
          ['Rs. 20–40L', '20to40'],
          ['Rs. 40L+', 'above40'],
        ].map(([label, f]) => {
          const isActive = (f && (opts.filter === f || opts.budget === f)) || (!f && !opts.filter && !opts.budget);
          const isBody = ['suv','sedan','hybrid'].includes(f);
          const isBudget = ['under20','20to40','above40'].includes(f);
          const clickFn = isBudget ? `AV.goTo('used',{budget:'${f}'})` : `AV.goTo('used',${f ? `{filter:'${f}'}` : '{}'})`;
          return `<span class="chip ${isActive ? 'active' : ''}" onclick="${clickFn}">${label}</span>`;
        }).join('')}
      </div>
      <div class="cars-grid">
        ${(cars.length ? cars : [{ brand:'No cars', model:'found', year:'', km:'', type:'', priceLabel:'', img:'', tags:[] }]).map(c => c.brand === 'No cars' ? `<div style="grid-column:1/-1;text-align:center;padding:60px;background:var(--bg);border-radius:var(--r20)"><div style="font-size:18px;font-weight:700;color:var(--ink-3)">No cars found for this filter</div><button onclick="AV.goTo('used',{})" class="btn btn-primary" style="margin-top:14px">Clear Filters</button></div>` :
        `<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r14);overflow:hidden;cursor:pointer;transition:all var(--ease)" onclick="alert('Enquire: +977-9701076240')" onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='var(--shadow-md)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
          <div style="height:148px;overflow:hidden;background:var(--bg-2);position:relative"><img src="${c.img}" style="width:100%;height:100%;object-fit:cover" loading="lazy"><span style="position:absolute;top:8px;left:8px;font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:99px;background:${c.type==='Diesel'?'rgba(29,78,216,.9)':c.type==='Hybrid'?'rgba(107,53,199,.9)':'rgba(26,107,42,.9)'};color:#fff">${c.type}</span></div>
          <div style="padding:14px"><div style="font-size:14.5px;font-weight:800;color:var(--ink);margin-bottom:4px">${c.brand} ${c.model}</div><div style="display:flex;gap:9px;font-size:11.5px;color:var(--ink-4);margin-bottom:8px"><span>${c.year}</span><span>·</span><span>${c.km} km</span></div><div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px">${c.priceLabel}</div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">${c.tags.map(t => `<span style="font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:99px;background:var(--green-l);color:var(--green)">${t}</span>`).join('')}</div><button onclick="event.stopPropagation();alert('+977-9701076240')" style="width:100%;padding:9px;background:var(--green);color:#fff;border:none;border-radius:var(--r8);font-family:var(--font-body);font-size:13px;font-weight:700;cursor:pointer">Contact Seller</button></div>
        </div>`).join('')}
      </div>
      <div style="margin-top:32px;background:var(--green-ll);border:1.5px solid rgba(26,107,42,.14);border-radius:var(--r20);padding:28px">
        <div style="font-size:10.5px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px">Sell Your Car</div>
        <div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--ink);margin-bottom:6px">Get the Best Price for Your Car</div>
        <p style="font-size:13px;color:var(--ink-3);margin-bottom:18px">List free. Reach thousands of buyers in Nepal.</p>
        <button onclick="alert('List your car: +977-9701076240')" class="btn btn-primary">List Your Car Free</button>
      </div>
    </div>`;
  }

  /* ─── VIDEOS PAGE ─── */
  function renderVideos() {
    document.title = 'Car Videos Nepal — AutoViindu';
    setActiveNav('videos');
    const VIDEOS = [
      { id: 'dQw4w9WgXcQ', title: 'MG Hector 2024 Full Review', sub: 'Is it worth Rs. 26L in Nepal?', brand: 'MG', duration: '14:32', views: '48K', thumb: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=360&fit=crop' },
      { id: 'dQw4w9WgXcQ', title: 'Hyundai IONIQ 5 — Real World Range Test Nepal', sub: 'Charging, load-shedding survival & V2L tested', brand: 'Hyundai', duration: '22:10', views: '32K', thumb: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=640&h=360&fit=crop' },
      { id: 'dQw4w9WgXcQ', title: 'Kia Seltos vs Hyundai Creta 2024 Comparison', sub: 'Which compact SUV wins in Nepal?', brand: 'Kia', duration: '18:44', views: '61K', thumb: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&h=360&fit=crop' },
      { id: 'dQw4w9WgXcQ', title: 'Toyota Fortuner 2024 — Mountain Drive Review', sub: 'Tested on Kathmandu to Pokhara highway', brand: 'Toyota', duration: '25:08', views: '87K', thumb: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=640&h=360&fit=crop' },
      { id: 'dQw4w9WgXcQ', title: 'BYD Atto 3 vs IONIQ 5 — EV Comparison Nepal', sub: 'Best electric SUV under Rs. 55L?', brand: 'BYD', duration: '20:15', views: '29K', thumb: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=640&h=360&fit=crop' },
      { id: 'dQw4w9WgXcQ', title: 'Honda City 2024 — Best Value Sedan in Nepal', sub: 'Full review with EMI breakdown', brand: 'Honda', duration: '16:50', views: '53K', thumb: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=640&h=360&fit=crop' },
    ];
    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="sep">${IC.chevR}</span><span style="color:rgba(255,255,255,.7)">Videos</span></div>
        <h1 class="page-title">Car Videos</h1>
        <div class="page-sub">Expert reviews, comparisons &amp; road tests from Nepal</div>
      </div>
    </div>
    <div class="wrap" style="padding-top:32px;padding-bottom:64px">
      <div class="filter-chips" style="margin-bottom:28px">
        ${['All','Reviews','Comparisons','EV Special','Road Tests'].map((t,i) => `<span class="chip ${i===0?'active':''}">${t}</span>`).join('')}
      </div>
      <!-- Featured Video -->
      <div class="video-featured" style="margin-bottom:32px">
        <div class="video-thumb-wrap" onclick="window.open('https://youtube.com/watch?v=${VIDEOS[0].id}','_blank')">
          <img src="${VIDEOS[0].thumb}" alt="${VIDEOS[0].title}" class="video-thumb-img">
          <div class="video-play-overlay">
            <div class="video-play-btn">${IC.play}</div>
          </div>
          <span class="video-duration">${VIDEOS[0].duration}</span>
        </div>
        <div class="video-featured-info">
          <span class="video-brand-tag">${VIDEOS[0].brand}</span>
          <h2 class="video-featured-title">${VIDEOS[0].title}</h2>
          <p class="video-featured-sub">${VIDEOS[0].sub}</p>
          <div style="display:flex;align-items:center;gap:14px;font-size:12.5px;color:var(--ink-4);margin-top:14px">
            <span>${VIDEOS[0].views} views</span>
            <span>${VIDEOS[0].duration}</span>
          </div>
          <button onclick="window.open('https://youtube.com/watch?v=${VIDEOS[0].id}','_blank')" class="btn btn-primary" style="margin-top:16px">${IC.play} Watch Now</button>
        </div>
      </div>
      <!-- Video Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
        ${VIDEOS.slice(1).map(v => `
        <div class="video-card" onclick="window.open('https://youtube.com/watch?v=${v.id}','_blank')">
          <div class="video-thumb-wrap" style="border-radius:var(--r12) var(--r12) 0 0">
            <img src="${v.thumb}" alt="${v.title}" class="video-thumb-img">
            <div class="video-play-overlay"><div class="video-play-btn" style="width:44px;height:44px">${IC.play}</div></div>
            <span class="video-duration">${v.duration}</span>
          </div>
          <div style="padding:14px">
            <span class="video-brand-tag">${v.brand}</span>
            <div class="video-card-title">${v.title}</div>
            <div class="video-card-sub">${v.sub}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
              <span style="font-size:11.5px;color:var(--ink-4)">${v.views} views</span>
              <span style="font-size:11.5px;color:var(--ink-4)">${v.duration}</span>
            </div>
          </div>
        </div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:36px;padding:28px;background:var(--bg);border-radius:var(--r20)">
        <div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--ink);margin-bottom:6px">More videos on our YouTube</div>
        <p style="font-size:13px;color:var(--ink-4);margin-bottom:16px">Subscribe for weekly car reviews, comparisons and Nepal road tests</p>
        <button onclick="window.open('https://youtube.com/@autoviindu','_blank')" class="btn btn-primary">Subscribe on YouTube</button>
      </div>
    </div>`;
  }

  /* ─── MAINTENANCE PAGE ─── */
  function renderMaintenance() {
    document.title = 'Car Maintenance Nepal — AutoViindu';
    setActiveNav('maintenance');
    const SERVICES = [
      { name: 'Engine Service', desc: 'Full engine tune-up, oil change, filter replacement', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="22" height="22"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`, color: '#1A6B2A', bg: '#EEF7F0', items: ['Oil & Filter Change', 'Air Filter Replacement', 'Spark Plug Service', 'Timing Belt Check', 'Engine Flush', 'Coolant Top-up'] },
      { name: 'Brake Service', desc: 'Complete brake system inspection and repair', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="22" height="22"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`, color: '#C8271E', bg: '#FFF0EF', items: ['Brake Pad Replacement', 'Rotor Resurfacing', 'Brake Fluid Flush', 'Caliper Inspection', 'Brake Hose Check', 'ABS System Scan'] },
      { name: 'Suspension & Steering', desc: 'Smooth ride and precise handling', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="22" height="22"><path d="M12 2a3 3 0 110 6 3 3 0 010-6zM6.9 8a3 3 0 100 6 3 3 0 000-6zm10.2 0a3 3 0 100 6 3 3 0 000-6zM3 18a3 3 0 106 0 3 3 0 00-6 0zm12 0a3 3 0 106 0 3 3 0 00-6 0z"/></svg>`, color: '#1A4DB8', bg: '#EEF3FC', items: ['Shock Absorber Check', 'Wheel Alignment', 'Wheel Balancing', 'Tie Rod Inspection', 'Ball Joint Service', 'Power Steering Fluid'] },
      { name: 'Electrical & Diagnostics', desc: 'ECU scans and electrical fault repairs', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="22" height="22"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, color: '#B8900E', bg: '#FDF6E0', items: ['ECU Diagnostic Scan', 'Battery Test & Replace', 'Alternator Check', 'Sensor Replacement', 'Wiring Inspection', 'EV System Diagnostics'] },
      { name: 'AC & Cooling', desc: 'Keep your car cool in any weather', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="22" height="22"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>`, color: '#0E7F73', bg: '#E6F5F4', items: ['AC Gas Refill', 'Compressor Service', 'Condenser Cleaning', 'Cabin Filter Change', 'Radiator Flush', 'Thermostat Check'] },
      { name: 'Transmission Service', desc: 'Manual and automatic gearbox care', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="22" height="22"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M12 8v3M12 11l-5.5 5M12 11l5.5 5"/></svg>`, color: '#6B35C7', bg: '#F0EBFA', items: ['Transmission Fluid Change', 'CVT Service', 'Gear Adjustment', 'Clutch Inspection', 'Differential Oil', 'Transfer Case Service'] },
    ];
    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="sep">${IC.chevR}</span><a onclick="AV.goTo('services')">Services</a><span class="sep">${IC.chevR}</span><span style="color:rgba(255,255,255,.7)">Maintenance &amp; Repairs</span></div>
        <h1 class="page-title">Maintenance &amp; Repairs</h1>
        <div class="page-sub">Expert vehicle maintenance for all makes and models in Kathmandu</div>
      </div>
    </div>
    <!-- STICKY NAV -->
    <div style="background:var(--white);border-bottom:1px solid var(--border);position:sticky;top:var(--nav-h);z-index:40;overflow-x:auto;scrollbar-width:none">
      <div class="wrap" style="display:flex;gap:6px;padding-top:10px;padding-bottom:10px;white-space:nowrap">
        ${SERVICES.map(s => `<a href="#maint-${s.name.toLowerCase().replace(/ /g,'-')}" style="display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border:1.5px solid ${s.color}20;border-radius:var(--pill);font-size:12px;font-weight:700;color:${s.color};background:${s.bg};flex-shrink:0">${s.name}</a>`).join('')}
      </div>
    </div>
    <div class="wrap" style="padding-top:36px;padding-bottom:64px">
      <!-- Key Stats -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:40px">
        ${[['500+','Services Done Monthly'],['4.9/5','Average Rating'],['2hr','Average Turnaround'],['15+','Expert Technicians']].map(([n,l]) => `
        <div style="padding:20px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r16);text-align:center">
          <div style="font-family:var(--font-display);font-size:26px;font-weight:700;color:var(--green)">${n}</div>
          <div style="font-size:12px;color:var(--ink-4);margin-top:3px">${l}</div>
        </div>`).join('')}
      </div>
      <!-- Service Sections -->
      ${SERVICES.map(s => `
      <div id="maint-${s.name.toLowerCase().replace(/ /g,'-')}" style="margin-bottom:48px;scroll-margin-top:calc(var(--nav-h) + 56px)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:46px;height:46px;background:${s.bg};border-radius:var(--r12);display:flex;align-items:center;justify-content:center;color:${s.color};flex-shrink:0">${s.icon}</div>
          <div>
            <h2 style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--ink)">${s.name}</h2>
            <div style="font-size:13px;color:var(--ink-4)">${s.desc}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px">
          ${s.items.map(item => `<div style="display:flex;align-items:center;gap:9px;padding:11px 13px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--r10);transition:all var(--ease);cursor:pointer" onmouseenter="this.style.borderColor='${s.color}';this.style.background='${s.bg}'" onmouseleave="this.style.borderColor='var(--border)';this.style.background='var(--white)'"><div style="width:6px;height:6px;background:${s.color};border-radius:50%;flex-shrink:0"></div><span style="font-size:13px;font-weight:600;color:var(--ink)">${item}</span></div>`).join('')}
        </div>
        <button onclick="alert('Book: +977-9701076240')" style="display:inline-flex;align-items:center;gap:6px;padding:10px 18px;background:${s.color};color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-body);font-size:13px;font-weight:700;cursor:pointer">${IC.phone} Book ${s.name}</button>
        <div style="height:1px;background:var(--border);margin-top:40px"></div>
      </div>`).join('')}
      <!-- CTA -->
      <div style="background:var(--ink-2);border-radius:var(--r20);padding:32px;text-align:center">
        <div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:#fff;margin-bottom:8px">Not sure what your car needs?</div>
        <p style="font-size:13px;color:rgba(255,255,255,.45);margin-bottom:18px">Call our expert technicians for a free consultation</p>
        <a href="tel:+9779701076240" class="btn btn-primary">${IC.phone} Call +977-9701076240</a>
      </div>
    </div>`;
  }

  /* ─── NAVIGATION ─── */
  function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    const map = { cars: 'nav-cars', electric: 'nav-electric', compare: 'nav-compare', services: 'nav-services', used: 'nav-used', videos: 'nav-videos', maintenance: 'nav-services' };
    if (map[page]) document.getElementById(map[page])?.classList.add('active');
  }

  function goTo(page, opts = {}) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.closeMobileMenu) window.closeMobileMenu();
    const p = page || 'home';
    if (p === 'home')        { if (window.renderHome)        window.renderHome();                  else renderHome(); }
    else if (p === 'cars')   { if (window.renderCars)        window.renderCars(opts.filter||null,opts); else renderCars(opts.filter||null,opts); }
    else if (p === 'electric') { if (window.renderCars)      window.renderCars('electric');          else renderCars('electric'); }
    else if (p === 'hybrid')   { if (window.renderCars)      window.renderCars('hybrid');            else renderCars('hybrid'); }
    else if (p === 'used')     { if (window.renderUsed)      window.renderUsed(opts);               else renderUsed(opts); }
    else if (p === 'compare')  { if (window.renderCompare)   window.renderCompare();                else renderCompare(); }
    else if (p === 'services') { if (window.renderServices)  window.renderServices();               else renderServices(); }
    else if (p === 'maintenance') { if (window.renderMaintenance) window.renderMaintenance();       else renderMaintenance(); }
    else if (p === 'videos')   { if (window.renderVideos)    window.renderVideos();                 else renderVideos(); }
    else if (p === 'brand' && opts.slug) {
      if (window.renderBrandPage) window.renderBrandPage(opts.slug);
      history.pushState({ page: 'brand', slug: opts.slug }, '', `#brand/${opts.slug}`);
      return;
    }
    else if (p === 'budget') {
      if (window.renderBudgetPage) window.renderBudgetPage(opts.tier || null);
      history.pushState({ page: 'budget', tier: opts.tier || '' }, '', opts.tier ? `#budget/${opts.tier}` : '#budget');
      return;
    }
    else { if (window.renderHome) window.renderHome(); else renderHome(); }
    history.pushState({ page: p, opts }, '', `#${p}`);
  }

  function openDetail(slug) {
    if (window.renderDetail) window.renderDetail(slug);
    else renderDetail(slug);
    history.pushState({ page: 'detail', slug }, '', `#car/${slug}`);
  }

  function openVariant(carSlug, variantSlug) {
    if (window.renderVariantPage) window.renderVariantPage(carSlug, variantSlug);
    history.pushState({ page: 'variant', carSlug, variantSlug }, '', `#variant/${carSlug}/${variantSlug}`);
  }

  /* ─── USED CARS ─── */
  function renderUsed() {
    document.title = 'Used Cars Nepal — AutoViindu';
    setActiveNav('used');
    const USED = [
      { brand: 'Toyota', model: 'Fortuner', year: 2021, km: '38,450', type: 'Diesel', price: 'Rs. 68L', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop', tags: ['1 Owner', 'Full Service History'] },
      { brand: 'Honda', model: 'Civic', year: 2020, km: '44,200', type: 'Petrol', price: 'Rs. 28L', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop', tags: ['Well Maintained'] },
      { brand: 'Hyundai', model: 'Tucson', year: 2022, km: '22,100', type: 'Petrol', price: 'Rs. 42L', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=300&fit=crop', tags: ['Low KM', '1 Owner'] },
      { brand: 'Toyota', model: 'Prius', year: 2020, km: '41,300', type: 'Hybrid', price: 'Rs. 30L', img: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&h=300&fit=crop', tags: ['Fuel Saver'] },
      { brand: 'Kia', model: 'Sportage', year: 2022, km: '18,200', type: 'Diesel', price: 'Rs. 36L', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=300&fit=crop', tags: ['Low KM'] },
      { brand: 'BMW', model: 'X3', year: 2021, km: '29,400', type: 'Petrol', price: 'Rs. 72L', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop', tags: ['Premium', 'Loaded'] },
    ];
    document.getElementById('app-root').innerHTML = `
    <div class="page-hero">
      <div class="wrap">
        <div class="breadcrumb"><a onclick="AV.goTo('home')">Home</a><span class="sep">${IC.chevR}</span><span style="color:rgba(255,255,255,.7)">Used Cars</span></div>
        <h1 class="page-title">Certified Used Cars</h1>
        <div class="page-sub">${USED.length} verified pre-owned vehicles</div>
      </div>
    </div>
    <div class="wrap" style="padding-top:24px;padding-bottom:64px">
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:24px">
        ${[['#1A6B2A','#EEF7F0','140-Point Inspection'],['#1A4DB8','#EEF3FC','Verified Ownership'],['#B8900E','#FDF6E0','Fair Market Price'],['#C8271E','#FFF0EF','Full Service History']].map(([c,bg,t]) => `<div style="display:flex;align-items:center;gap:8px;padding:11px 13px;background:${bg};border:1px solid ${c}22;border-radius:var(--r10)"><div style="width:7px;height:7px;background:${c};border-radius:50%;flex-shrink:0"></div><span style="font-size:12px;font-weight:700;color:var(--ink-2)">${t}</span></div>`).join('')}
      </div>
      <div class="cars-grid">
        ${USED.map(c => `<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r14);overflow:hidden;cursor:pointer;transition:all var(--ease)" onclick="alert('Enquire: +977-9701076240')" onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='var(--shadow-md)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
          <div style="height:148px;overflow:hidden;background:var(--bg-2);position:relative"><img src="${c.img}" style="width:100%;height:100%;object-fit:cover" loading="lazy"><span style="position:absolute;top:8px;left:8px;font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:99px;background:${c.type === 'Diesel' ? 'rgba(29,78,216,.9)' : c.type === 'Hybrid' ? 'rgba(107,53,199,.9)' : 'rgba(26,107,42,.9)'};color:#fff">${c.type}</span></div>
          <div style="padding:12px"><div style="font-size:14.5px;font-weight:800;color:var(--ink);margin-bottom:4px">${c.brand} ${c.model}</div><div style="display:flex;gap:9px;font-size:11.5px;color:var(--ink-4);margin-bottom:8px"><span>${c.year}</span><span>·</span><span>${c.km} km</span></div><div style="font-size:17px;font-weight:800;color:var(--ink);margin-bottom:8px">${c.price}</div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">${c.tags.map(t => `<span style="font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:99px;background:var(--green-ll);color:var(--green)">${t}</span>`).join('')}</div><button onclick="event.stopPropagation();alert('+977-9701076240')" style="width:100%;padding:9px;background:var(--green);color:#fff;border:none;border-radius:var(--r8);font-family:var(--font-body);font-size:13px;font-weight:700;cursor:pointer">Contact Seller</button></div>
        </div>`).join('')}
      </div>
      <div style="margin-top:32px;background:var(--green-ll);border:1.5px solid rgba(26,107,42,.16);border-radius:var(--r20);padding:28px">
        <div style="font-size:11px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.7px;margin-bottom:8px">Sell Your Car</div>
        <div style="font-family:var(--font-display);font-size:24px;font-weight:800;color:var(--ink);margin-bottom:6px">Get the Best Price for Your Car</div>
        <p style="font-size:13px;color:var(--ink-3);margin-bottom:18px">List free. Reach thousands of buyers in Nepal.</p>
        <button onclick="alert('List your car: +977-9701076240')" class="btn btn-primary">List Your Car Free</button>
      </div>
    </div>`;
  }

  /* ─── ROUTER ─── */
  window.addEventListener('popstate', e => {
    const hash = location.hash;
    if (!hash || hash === '#home') { (window.renderHome || renderHome)(); }
    else if (hash.startsWith('#car/')) { const s = hash.replace('#car/',''); (window.renderDetail||renderDetail)(s); }
    else if (hash.startsWith('#variant/')) { const parts=hash.replace('#variant/','').split('/'); if(window.renderVariantPage) window.renderVariantPage(parts[0],parts[1]); }
    else if (hash.startsWith('#brand/')) { if (window.renderBrandPage) window.renderBrandPage(hash.replace('#brand/', '')); }
    else if (hash.startsWith('#budget/')) { if (window.renderBudgetPage) window.renderBudgetPage(hash.replace('#budget/', '')); }
    else if (hash === '#budget') { if (window.renderBudgetPage) window.renderBudgetPage(null); }
    else if (hash === '#cars') { (window.renderCars||renderCars)(); }
    else if (hash === '#electric') { (window.renderCars||renderCars)('electric'); }
    else if (hash === '#compare') { (window.renderCompare||renderCompare)(); }
    else if (hash === '#services') { (window.renderServices||renderServices)(); }
    else if (hash === '#maintenance') { (window.renderMaintenance||renderMaintenance)(); }
    else if (hash === '#videos') { (window.renderVideos||renderVideos)(); }
    else if (hash === '#used') { (window.renderUsed||renderUsed)({}); }
    else (window.renderHome||renderHome)();
  });

  /* ─── PUBLIC API ─── */
  window.AV_ICONS = IC;  // expose icons for brand-page.js + budget-page.js

  window.AV = Object.assign(window.AV || {}, {
    goTo, openDetail, toggleCompare, toggleWish,
    galNav, galSet, selectVariant, selectColor,
    switchDetailTab, updateEMI, setTenure, getActiveVariant,
    homeFilter, heroFilter, showMoreHome, filterListing, sortListing,
    submitServiceForm, updateCompareTray,
    get compareList() { return compareList; },
    wishlistIncludes(slug) { return wishlist.includes(slug); },
    /* brand & budget page delegates */
    filterBrandCars(slug, bodyType) {
      if (window.renderBrandPage) window.renderBrandPage(slug, bodyType);
    },
    sortBudgetCars(tierSlug, by) {
      if (window.renderBudgetPage) window.renderBudgetPage(tierSlug, by);
    },
    calcBudgetEMI(principal, rate, months) {
      return window.calcEMI ? window.calcEMI(principal, rate, months) : 0;
    },
  });

  window.compareList = compareList;

  /* ─── INIT ─── */
  function init() {
    const hash = location.hash;
    if (hash.startsWith('#car/')) renderDetail(hash.replace('#car/', ''));
    else if (hash.startsWith('#brand/')) { if (window.renderBrandPage) window.renderBrandPage(hash.replace('#brand/', '')); }
    else if (hash.startsWith('#budget/')) { if (window.renderBudgetPage) window.renderBudgetPage(hash.replace('#budget/', '')); }
    else if (hash === '#budget') { if (window.renderBudgetPage) window.renderBudgetPage(null); }
    else if (hash === '#cars') renderCars();
    else if (hash === '#electric') renderCars('electric');
    else if (hash === '#compare') renderCompare();
    else if (hash === '#services') renderServices();
    else if (hash === '#maintenance') renderMaintenance();
    else if (hash === '#videos') renderVideos();
    else if (hash === '#used') renderUsed({});
    else renderHome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ══════════════════════════════════════════════════════
   AUTOVIINDU — HOME PAGE HERO PATCH
   Drop-in replacement for renderHome() in app.js
   Paste this entire block into app.js replacing
   the existing renderHome() function
══════════════════════════════════════════════════════ */

/* ── ICON SYSTEM: consistent 20x20 Lucide-style SVGs ──
   All stroked, 1.75px, round caps, round joins          */
const ICONS = {
  /* Navigation & UI */
  search:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  chevR:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevD:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  arrowR:   `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  close:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  plus:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  menu:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,

  /* Cars & Transport */
  car:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2Z"/><path d="m4 9 2-4h12l2 4"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>`,
  suv:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-4h10l2 4h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
  bolt:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  leaf:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  fuel:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V3h10v10l2 2V22H3z"/><path d="M15 7h2a2 2 0 0 1 2 2v7a1 1 0 0 0 2 0v-9l-2-2"/></svg>`,
  gauge:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,

  /* Features */
  star:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  heart:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  check:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x:        `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  eye:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  info:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,

  /* Contact & Services */
  phone:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  pin:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  shield:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  wrench:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  calc:     `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="9.5" y2="11"/><line x1="12" y1="11" x2="13.5" y2="11"/><line x1="16" y1="11" x2="16" y2="11" stroke-width="2"/><line x1="8" y1="15" x2="9.5" y2="15"/><line x1="12" y1="15" x2="13.5" y2="15"/><line x1="8" y1="19" x2="16" y2="19"/></svg>`,
  compare:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><rect x="2" y="3" width="8" height="18" rx="1.5"/><rect x="14" y="3" width="8" height="18" rx="1.5"/><line x1="11" y1="12" x2="13" y2="12"/></svg>`,
  dollar:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  doc:      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  play:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
};

/* ── UPDATED renderHome ── */
function renderHome() {
  document.title = 'AutoViindu — Find Your Perfect Car in Nepal';
  setActiveNav('home');
  const db = window.CARS_DB || [];

  document.getElementById('app-root').innerHTML = `

  <!-- ══ HERO ══ -->
  <section class="hero-section">

    <!-- Slim deal banner -->
    <div class="hero-deal-banner">
      <div class="wrap hero-deal-inner">
        <div class="hero-deal-pulse"></div>
        <span class="hero-deal-text">
          Limited Offer &mdash; <strong>Toyota Fortuner 2025</strong> at Rs.&nbsp;1.12 Cr &middot; Zero registration till June 30
        </span>
        <button onclick="AV.goTo('cars')" class="hero-deal-cta">View Deal</button>
      </div>
    </div>

    <!-- Background -->
    <div class="hero-bg">
      <img
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=900&fit=crop&q=90"
        alt=""
        class="hero-bg-img"
        loading="eager"
        fetchpriority="high"
      >
      <div class="hero-bg-overlay"></div>
    </div>

    <!-- Content -->
    <div class="wrap hero-content">
      <div class="hero-left">

        <!-- Eyebrow -->
        <p class="hero-label">Nepal's Trusted Car Platform</p>

        <!-- Headline: Fraunces, editorial weight -->
        <h1 class="hero-title">
          Find Your Perfect<br>
          <em class="accent">Car in Nepal</em>
        </h1>

        <p class="hero-sub">
          500+ cars, 50+ brands. Real Nepal prices, complete variant breakdowns, live EMI calculator — everything in one place.
        </p>

        <!-- Category filter pills -->
        <div class="hero-categories">
          <button class="hero-cat-pill active" onclick="AV.heroFilter('',this)">
            ${ICONS.car} All Cars
          </button>
          <button class="hero-cat-pill" onclick="AV.heroFilter('electric',this)">
            ${ICONS.bolt} Electric
          </button>
          <button class="hero-cat-pill" onclick="AV.heroFilter('hybrid',this)">
            ${ICONS.leaf} Hybrid
          </button>
          <button class="hero-cat-pill" onclick="AV.heroFilter('suv',this)">
            ${ICONS.suv} SUV
          </button>
          <button class="hero-cat-pill" onclick="AV.heroFilter('sedan',this)">
            ${ICONS.car} Sedan
          </button>
          <button class="hero-cat-pill" onclick="AV.goTo('cars')">
            ${ICONS.dollar} Under Rs.&nbsp;30L
          </button>
        </div>

        <!-- CTAs -->
        <div class="hero-actions">
          <button onclick="AV.goTo('cars')" class="btn-primary-hero">
            ${ICONS.search} Browse All Cars
          </button>
          <button onclick="AV.goTo('compare')" class="hero-compare-btn">
            ${ICONS.compare} Compare Cars
          </button>
        </div>

        <!-- Social proof stats -->
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-num">500+</div>
            <div class="hero-stat-label">Cars Listed</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">50+</div>
            <div class="hero-stat-label">Brands</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">10K+</div>
            <div class="hero-stat-label">Buyers Helped</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">4.9★</div>
            <div class="hero-stat-label">Avg Rating</div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ══ SEARCH BOX ══ -->
  <div class="hero-search-wrap">
    <div class="wrap">
      <div class="hero-search-box">
        <div class="hero-search-tabs">
          ${['New Cars','Used Cars','Electric','Hybrid'].map((t,i) => `<button class="hero-stab ${i===0?'active':''}" onclick="AV.goTo('${t==='New Cars'?'cars':t==='Used Cars'?'used':t.toLowerCase()}')">${t}</button>`).join('')}
        </div>
        <div class="hero-search-fields">
          <div class="hero-search-field">
            <label>Brand</label>
            <select class="form-select">
              <option>All Brands</option>
              ${['Toyota','Honda','Hyundai','Kia','Suzuki','MG','BYD','BMW','Mercedes','Audi'].map(b => `<option>${b}</option>`).join('')}
            </select>
          </div>
          <div class="hero-search-field">
            <label>Budget</label>
            <select class="form-select">
              <option>Any Budget</option>
              <option>Under Rs. 20L</option>
              <option>Rs. 20–40L</option>
              <option>Rs. 40–60L</option>
              <option>Rs. 60L+</option>
            </select>
          </div>
          <div class="hero-search-field">
            <label>Fuel Type</label>
            <select class="form-select">
              <option>All Types</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>
          <button class="btn btn-primary" onclick="AV.goTo('cars')" style="height:44px;padding:0 24px">
            ${ICONS.search} Search
          </button>
        </div>
        <div class="hero-search-popular">
          <span>Trending:</span>
          ${['MG Hector','IONIQ 5','Toyota Prius','Honda City','Kia Seltos','BYD Atto 3'].map(t => `<span class="hero-popular-chip" onclick="AV.goTo('cars')">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- ══ FEATURED CARS ══ -->
  <section class="section" style="padding-top:80px">
    <div class="wrap">
      <div class="sec-header">
        <div class="left">
          <div class="eyebrow">Handpicked for Nepal</div>
          <h2 class="sec-title">Featured New Cars</h2>
          <div class="sec-sub">${db.length} cars with full specs &amp; EMI calculator</div>
        </div>
        <button class="view-all-btn" onclick="AV.goTo('cars')">
          All Cars ${ICONS.arrowR}
        </button>
      </div>

      <div class="filter-chips" id="home-filter-chips">
        ${['All','Electric','Hybrid','Petrol','SUV','Sedan','Hatchback'].map((t,i) => `<span class="chip ${i===0?'active':''}" onclick="AV.homeFilter('${t}',this)">${t}</span>`).join('')}
      </div>

      <div class="cars-grid" id="home-cars-grid">
        ${db.slice(0,8).map(c => carCardHTML(c)).join('')}
      </div>

      <div style="text-align:center;margin-top:32px" id="load-more-wrap">
        <button onclick="AV.showMoreHome()" class="btn btn-outline" style="font-size:14px;padding:13px 32px">
          Show All ${db.length} Cars ${ICONS.chevD}
        </button>
      </div>
    </div>
  </section>

  <!-- ══ EV BANNER ══ -->
  <section class="section section-alt">
    <div class="wrap">
      <div class="ev-banner">
        <img
          src="https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&h=500&fit=crop&q=85"
          alt="Electric Cars Nepal"
          class="ev-banner-img"
          loading="lazy"
        >
        <div class="ev-banner-content">
          <div class="eyebrow" style="color:#3ECBA5">Going Green?</div>
          <h2 class="ev-banner-title">Electric Cars<br>in Nepal</h2>
          <p class="ev-banner-sub">
            Best EVs for Nepal's roads — V2L for load-shedding, real-world range tested locally, honest specs.
          </p>
          <div class="ev-banner-models">
            ${db.filter(c => c.type === 'Electric').map(c => `<span onclick="AV.openDetail('${c.slug}')">${c.brand} ${c.model}</span>`).join('')}
          </div>
          <button onclick="AV.goTo('cars',{filter:'electric'})" class="btn btn-primary" style="margin-top:4px;align-self:flex-start">
            ${ICONS.bolt} View All EVs
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ══ WHY US ══ -->
  <section class="section">
    <div class="wrap">
      <div class="sec-header">
        <div class="left">
          <div class="eyebrow">Why Choose AutoViindu</div>
          <h2 class="sec-title">Built for Nepal's Car Buyers</h2>
        </div>
      </div>
      <div class="why-grid">
        ${[
          {
            c:'#1A6B2A', bg:'#EEF7F0',
            icon: ICONS.doc,
            t: 'Variant Brochure',
            d: "See exactly what's in each trim — no guesswork, no dealer spin."
          },
          {
            c:'#1A4DB8', bg:'#EEF3FC',
            icon: ICONS.calc,
            t: 'Live EMI Calculator',
            d: 'Adjust down payment, tenure & interest rate in real time.'
          },
          {
            c:'#B8900E', bg:'#FDF6E0',
            icon: ICONS.compare,
            t: 'Side-by-Side Compare',
            d: 'Compare up to 3 cars across 20+ specs with winner highlighting.'
          },
          {
            c:'#C8271E', bg:'#FFF0EF',
            icon: ICONS.shield,
            t: 'Nepal-Verified Prices',
            d: 'Accurate Nepal ex-showroom prices — updated monthly, not estimates.'
          },
        ].map(w => `
        <div class="why-card">
          <div class="why-icon" style="background:${w.bg};color:${w.c}">${w.icon}</div>
          <div class="why-title">${w.t}</div>
          <div class="why-desc">${w.d}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ══ CTA BANNER ══ -->
  <section class="section section-alt">
    <div class="wrap">
      <div class="cta-banner">
        <div class="cta-banner-inner">
          <div class="cta-banner-label">Start your journey</div>
          <h2 class="cta-banner-title">Find Your Perfect Car Today</h2>
          <p class="cta-banner-sub">
            Complete specs, variant breakdowns, EMI calculator, and side-by-side comparisons — all built for Nepal.
          </p>
          <div class="cta-banner-btns">
            <button onclick="AV.goTo('cars')" class="btn btn-primary btn-lg">
              ${ICONS.search} Browse All Cars
            </button>
            <button onclick="AV.goTo('services')" class="btn" style="background:rgba(255,255,255,.09);color:rgba(255,255,255,.85);border:1.5px solid rgba(255,255,255,.14);padding:15px 28px;font-size:15px;font-weight:700;border-radius:12px">
              ${ICONS.wrench} Our Services
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>`;

  updateCompareTray();
  updateCompareButtons();
}