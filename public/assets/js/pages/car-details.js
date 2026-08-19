/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — CAR DETAIL PAGE
   window.renderDetail(slug) → renders full car detail
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var calcEMI = function (p, ar, m) {
    var r = ar / 12 / 100;
    return r === 0 ? p / m : p * (r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
  };

  var Rs = function (n) {
    return n >= 10000000 ? 'Rs. ' + (n / 10000000).toFixed(2) + 'Cr'
      : n >= 100000 ? 'Rs. ' + (n / 100000).toFixed(2) + 'L'
        : 'Rs. ' + n.toLocaleString();
  };

  var carBySlug = function (slug) {
    return (window.CARS_DB || []).find(function (c) { return c.slug === slug; });
  };

  var _galleryIdx = {};
  var _activeVariant = {};

  /* Variant feature matrix */
  function buildVariantMatrix(car) {
    var allFeatures = [];
    car.variants.forEach(function (v) {
      (v.features || []).forEach(function (f) {
        if (!/features\+/i.test(f) && allFeatures.indexOf(f) === -1) allFeatures.push(f);
      });
    });
    return allFeatures.slice(0, 12).map(function (feat) {
      var kw = feat.toLowerCase().split(' ')[0];
      var cells = car.variants.map(function (v) {
        var has = (v.features || []).some(function (f) { return f.toLowerCase().includes(kw); });
        return '<td class="' + (has ? 'vm-yes' : 'vm-no') + '">' + (has ? '&#10003;' : '&mdash;') + '</td>';
      });
      return '<tr><td>' + feat + '</td>' + cells.join('') + '</tr>';
    }).join('');
  }

  /* EMI card */
  function renderEMICard(car, varIdx) {
    var vr = car.variants[varIdx];
    var IC = window.AV_ICONS || {};
    var dp = 20, dt = 60, dr = 10.5;
    var loan = vr.price * (1 - dp / 100);
    var emi = calcEMI(loan, dr, dt);
    return '<div class="emi-card">' +
      '<div class="emi-card-title">' + (IC.calc || '') + ' EMI Calculator</div>' +
      '<div class="emi-field"><label>Down Payment <span class="val" id="emi-down-val">' + dp + '%</span></label>' +
      '<input type="range" id="emi-down" min="10" max="60" value="' + dp + '" step="5"' +
      ' oninput="document.getElementById(\'emi-down-val\').textContent=this.value+\'%\';AV.updateEMI(\'' + car.slug + '\',AV.getActiveVariant(\'' + car.slug + '\'),+this.value,+document.getElementById(\'emi-tenure-val\').textContent,+document.getElementById(\'emi-rate\').value)"></div>' +
      '<div class="emi-field"><label>Tenure <span class="val"><span id="emi-tenure-val">' + dt + '</span> months</span></label>' +
      '<div class="tenure-buttons">' +
      [12, 24, 36, 48, 60, 72, 84].map(function (m) { return '<button class="tenure-btn ' + (m === dt ? 'active' : '') + '" onclick="AV.setTenure(' + m + ',\'' + car.slug + '\')">' + m + 'm</button>'; }).join('') +
      '</div></div>' +
      '<div class="emi-field"><label>Interest Rate <span class="val" id="emi-rate-val">' + dr + '%</span></label>' +
      '<input type="range" id="emi-rate" min="8" max="18" value="' + dr + '" step="0.5"' +
      ' oninput="document.getElementById(\'emi-rate-val\').textContent=this.value+\'%\';AV.updateEMI(\'' + car.slug + '\',AV.getActiveVariant(\'' + car.slug + '\'),+document.getElementById(\'emi-down\').value,+document.getElementById(\'emi-tenure-val\').textContent,+this.value)"></div>' +
      '<div class="emi-result">' +
      '<div class="emi-result-label">Monthly EMI</div>' +
      '<div class="emi-result-amt" id="emi-result">' + Rs(Math.round(emi)) + '</div>' +
      '<div class="emi-result-note">Loan: ' + Rs(Math.round(loan)) + ' &middot; Rate: ' + dr + '% p.a.</div>' +
      '</div></div>';
  }

  /* Car card (for similar cars) */
  function carCardHTML(car) {
    var IC = window.AV_ICONS || {};
    var bm = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' };
    var bl = { ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' };
    return '<div class="car-card" onclick="AV.openDetail(\'' + car.slug + '\')">' +
      '<div class="car-card-img-wrap"><img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" loading="lazy">' +
      (car.badge ? '<span class="badge ' + (bm[car.badge] || 'badge-pop') + '">' + (bl[car.badge] || '') + '</span>' : '') +
      '<button class="wish-btn" onclick="event.stopPropagation();AV.toggleWish(\'' + car.slug + '\',this)">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' +
      '</button></div>' +
      '<div class="car-card-body">' +
      '<div class="car-card-brand">' + car.brand + ' &middot; ' + car.year + '</div>' +
      '<div class="car-card-name">' + car.model + '</div>' +
      '<div class="car-card-tagline">' + (car.tagline || '') + '</div>' +
      '<div class="car-card-price-row"><span class="car-card-price">' + window.Rs(car.variants[0].price) + '</span>' +
      (car.variants.length > 1 ? '<span class="car-card-variants">' + car.variants.length + ' variants</span>' : '') + '</div>' +
      '<div class="car-card-meta"><span>&#9733; ' + car.rating.toFixed(1) + '</span><span>' + car.type + '</span><span>' + car.body + '</span></div>' +
      '<div class="car-card-actions">' +
      '<button onclick="event.stopPropagation();AV.toggleCompare(\'' + car.slug + '\')" data-cmp-slug="' + car.slug + '" class="btn-cmp">+ Compare</button>' +
      '<button onclick="event.stopPropagation();AV.openDetail(\'' + car.slug + '\')" class="btn-det">Details ' + (IC.chevR || '›') + '</button>' +
      '</div>' +
      '</div></div>';
  }

  /* ══ MAIN RENDER ══ */
  window.renderDetail = function (slug) {
    var car = carBySlug(slug);
    if (!car) { if (window.AV) window.AV.goTo('cars'); return; }

    var vi = _activeVariant[slug] || 0;
    var vr = car.variants[vi];
    var IC = window.AV_ICONS || {};
    var compareList = (window.AV && window.AV.compareList) || [];
    var inCmp = Array.isArray(compareList) && compareList.indexOf(slug) > -1;

    document.title = car.brand + ' ' + car.model + ' ' + car.year + ' Price Nepal — AutoViindu';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('');

    var qsKeys = [
      ['Power', car.specs['Power'] || car.specs['Motor Power'] || car.specs['Combined Power']],
      ['Torque', car.specs['Torque']],
      ['Efficiency', car.specs['Fuel Efficiency'] || car.specs['Range (WLTP)'] || car.specs['Range']],
      ['0–100', car.specs['0–100 km/h']],
      ['Seating', car.specs['Seating']],
      ['Boot', car.specs['Boot Space']],
    ].filter(function (x) { return x[1]; });

    var root = document.getElementById('app-root');
    if (!root) return;

    root.innerHTML =
      /* ── CINEMATIC HERO ── */
      '<div class="det-hero" style="background-image:url(' + JSON.stringify(car.images[0]) + ')">' +
      '  <div class="det-hero-overlay"></div>' +
      '  <div class="wrap det-hero-body">' +
      '    <div class="det-hero-breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span>›</span><a onclick="AV.goTo(\'cars\')">Cars</a><span>›</span><span>' + car.brand + ' ' + car.model + '</span></div>' +
      '    <div class="det-hero-sub">' + car.type + ' · ' + car.body + ' · ' + car.variants.length + ' Variants · <span class="det-hero-rating">★ ' + car.rating.toFixed(1) + '</span> (' + car.reviews + ' reviews)</div>' +
      '    <h1 class="det-hero-title">' + car.brand + ' <em>' + car.model + '</em></h1>' +
      '    <div class="det-hero-price">Starting from <strong>' + window.Rs(car.variants[0].price) + '</strong></div>' +
      '    <div class="det-hero-quick-stats">' +
      qsKeys.slice(0, 4).map(function(s) {
        return '<div class="det-qs-chip"><span class="det-qs-val">' + s[1] + '</span><span class="det-qs-lbl">' + s[0] + '</span></div>';
      }).join('') +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<style>' +
      '.det-hero { position:relative; width:100%; height:420px; background-size:cover; background-position:center; display:flex; align-items:flex-end; overflow:hidden; }' +
      '@media(min-width:768px){ .det-hero { height:500px; } }' +
      '.det-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(8,14,20,0.96) 0%, rgba(8,14,20,0.7) 50%, rgba(8,14,20,0.2) 100%); }' +
      '.det-hero-body { position:relative; z-index:2; padding-bottom:36px; }' +
      '.det-hero-breadcrumb { display:flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; color:rgba(255,255,255,0.5); margin-bottom:12px; }' +
      '.det-hero-breadcrumb a { color:rgba(255,255,255,0.5); cursor:pointer; transition:color 0.2s; }' +
      '.det-hero-breadcrumb a:hover { color:#fff; }' +
      '.det-hero-sub { font-size:12px; color:rgba(255,255,255,0.55); font-weight:500; margin-bottom:10px; letter-spacing:0.3px; }' +
      '.det-hero-rating { color:#f59e0b; font-weight:700; }' +
      '.det-hero-title { font-family:var(--font-display); font-size:clamp(2rem,5vw,3.5rem); font-weight:900; color:#fff; line-height:1.05; margin:0 0 10px; }' +
      '.det-hero-title em { color:#4ade80; font-style:normal; }' +
      '.det-hero-price { font-size:14px; color:rgba(255,255,255,0.65); font-weight:600; margin-bottom:18px; }' +
      '.det-hero-price strong { color:#fff; font-size:18px; margin-left:4px; }' +
      '.det-hero-quick-stats { display:flex; gap:10px; flex-wrap:wrap; }' +
      '.det-qs-chip { background:rgba(255,255,255,0.1); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 16px; display:flex; flex-direction:column; gap:2px; min-width:80px; }' +
      '.det-qs-val { font-size:14px; font-weight:800; color:#fff; }' +
      '.det-qs-lbl { font-size:9.5px; font-weight:700; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:0.5px; }' +
      '</style>',

      root.innerHTML +=
      '<div class="wrap detail-layout"><div>' +

      /* Gallery */
      '<div id="gallery-container" style="border-radius:var(--r16);overflow:hidden;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.10);"></div>' +

      /* Variant Selector */
      '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:20px;margin-bottom:20px;">' +
      '<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--ink-4);margin-bottom:14px;">Choose Variant &mdash; <strong style="color:var(--ink)">' + car.variants.length + ' options</strong></div>' +
      '<div class="variant-tabs-row">' +
      car.variants.map(function (v, i) {
        return '<div class="variant-tab ' + (i === vi ? 'active' : '') + '" onclick="AV.selectVariant(\'' + slug + '\',' + i + ')">' +
          (v.popular ? '<div class="popular-tag">Best Value</div>' : '') +
          '<div class="vt-name">' + v.name + '</div>' +
          '<div class="vt-price">' + window.Rs(v.price) + '</div>' +
          '<div class="vt-features">' + v.features.slice(0, 3).map(function (f) { return '<div class="vt-feature"><span class="tick">' + (IC.check || '<i data-lucide="check"></i>') + '</span>' + f + '</div>'; }).join('') + '</div>' +
          '</div>';
      }).join('') +
      '</div>' +
      '<div class="variant-detail-panel" id="variant-detail-panel">' +
      (vr.specs ? Object.entries(vr.specs).map(function (e) { return '<div class="vdp-item"><div class="vdp-value">' + e[1] + '</div><div class="vdp-label">' + e[0] + '</div></div>'; }).join('') : '') +
      '</div>' +
      '<div style="margin-top:14px"><div style="font-size:11px;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Available Colors</div>' +
      '<div class="color-selector">' + car.colors.map(function (c, i) { return '<span class="color-swatch ' + (i === 0 ? 'active' : '') + '" style="background:' + c.hex + '" title="' + c.name + '" onclick="AV.selectColor(this,\'' + c.name + '\')"></span>'; }).join('') + '</div>' +
      '<div class="color-name-display" id="color-name-display">' + car.colors[0].name + '</div>' +
      '</div>' +
      '</div>' +

      /* Tabs */
      '<div style="border-radius:var(--r16);overflow:hidden;border:1px solid var(--border);margin-bottom:24px">' +
      '<div class="detail-tabs-nav">' +
      '<button class="detail-tab-btn active" onclick="AV.switchDetailTab(this,\'tab-overview\')">Overview</button>' +
      '<button class="detail-tab-btn" onclick="AV.switchDetailTab(this,\'tab-specs\')">Specifications</button>' +
      '<button class="detail-tab-btn" onclick="AV.switchDetailTab(this,\'tab-compare-vars\')">Variant Matrix</button>' +
      '<button class="detail-tab-btn" onclick="AV.switchDetailTab(this,\'tab-proscons\')">Pros &amp; Cons</button>' +
      '</div>' +

      '<div id="tab-overview" class="detail-tab-pane active">' +
      '<p style="font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px;">' + car.tagline + '</p>' +
      '<p style="font-size:13.5px;color:var(--ink-3);line-height:1.8;margin-bottom:22px">' + (car.overview || '') + '</p>' +
      '<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--ink-4);margin-bottom:12px;">Quick Specs</div>' +
      '<div class="quick-specs-grid">' + qsKeys.map(function (e) { return '<div class="quick-spec-card"><div class="qs-value">' + e[1] + '</div><div class="qs-label">' + e[0] + '</div></div>'; }).join('') + '</div>' +
      '<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--ink-4);margin-bottom:10px;margin-top:20px;">Key Highlights</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:7px">' + (car.highlights || []).map(function (h) { return '<span class="badge badge-outline-green" style="font-size:12px;padding:5px 12px">' + (IC.check || '<i data-lucide="check"></i>') + ' ' + h + '</span>'; }).join('') + '</div>' +
      '</div>' +

      '<div id="tab-specs" class="detail-tab-pane">' +
      '<table class="spec-table">' + Object.entries(car.specs).map(function (e) { return '<tr><td>' + e[0] + '</td><td>' + e[1] + '</td></tr>'; }).join('') + '</table>' +
      '</div>' +

      '<div id="tab-compare-vars" class="detail-tab-pane">' +
      '<div style="font-size:13px;color:var(--ink-3);margin-bottom:16px">' + car.brand + ' ' + car.model + ' comes in <strong>' + car.variants.length + ' variants</strong>:</div>' +
      '<div style="overflow-x:auto;border-radius:var(--r12);box-shadow:var(--shadow-xs)">' +
      '<table class="var-matrix"><thead><tr><th style="text-align:left">Feature</th>' +
      car.variants.map(function (v) { return '<th>' + v.name + '<br><span style="color:var(--gold-text);font-size:11px">' + window.Rs(v.price) + '</span></th>'; }).join('') +
      '</tr></thead><tbody>' + buildVariantMatrix(car) + '</tbody></table></div>' +
      '</div>' +

      '<div id="tab-proscons" class="detail-tab-pane">' +
      '<div class="pros-cons-grid">' +
      '<div class="pros-box"><div class="pc-title" style="color:#16A34A">' + (IC.check || '<i data-lucide="check"></i>') + ' What We Love</div>' +
      (car.pros || []).map(function (p) { return '<div class="pc-item"><span class="icon" style="color:#16A34A">' + (IC.check || '<i data-lucide="check"></i>') + '</span>' + p + '</div>'; }).join('') +
      '</div><div class="cons-box"><div class="pc-title" style="color:#DC2626">' + (IC.x || '<i data-lucide="x"></i>') + ' Could Be Better</div>' +
      (car.cons || []).map(function (c) { return '<div class="pc-item"><span class="icon" style="color:#DC2626">' + (IC.x || '<i data-lucide="x"></i>') + '</span>' + c + '</div>'; }).join('') +
      '</div></div>' +
      '<div class="expert-score-card"><div><div class="expert-number">' + car.expertScore + '</div><div class="score-out-of">Expert Score / 10</div></div>' +
      '<div class="score-bar-wrap"><div style="font-size:12.5px;font-weight:700;color:var(--ink)">AutoViindu Expert Rating</div>' +
      '<div class="score-bar-track"><div class="score-bar-fill" style="width:' + (car.expertScore * 10) + '%"></div></div>' +
      '<div class="score-labels"><span>Poor</span><span>Good</span><span>Excellent</span></div></div></div>' +
      '</div>' +
      '</div>' +

      /* Similar Cars */
      '<div><div style="font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--ink);margin-bottom:16px">Similar Cars</div>' +
      '<div class="cars-grid" style="grid-template-columns:repeat(2,1fr)">' +
      (window.CARS_DB || []).filter(function (c) { return c.slug !== slug && (c.body === car.body || c.type === car.type); }).slice(0, 4).map(carCardHTML).join('') +
      '</div>' +
      '</div>' +
      '</div>' +

      /* Sidebar */
      '<div class="detail-sidebar">' +
      '<div class="price-card">' +
      '<div class="price-card-from">Ex-Showroom Price</div>' +
      '<div class="price-card-amount" data-price-display>' + window.Rs(vr.price) + '</div>' +
      '<div class="price-card-note">*Contact for final on-road price</div>' +
      '<div style="margin:14px 0 0"><label style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--ink-4);display:block;margin-bottom:6px">Select Variant</label>' +
      '<div style="position:relative"><select id="variant-dropdown" onchange="AV.selectVariant(\'' + slug + '\',+this.value)" style="width:100%;padding:11px 36px 11px 12px;border:1.5px solid var(--border);border-radius:var(--r10);font-family:var(--font-body);font-size:13.5px;font-weight:700;color:var(--ink);background:var(--white);appearance:none;outline:none;cursor:pointer">' +
      car.variants.map(function (v, i) { return '<option value="' + i + '"' + (i === vi ? ' selected' : '') + '>' + v.name + ' — ' + window.Rs(v.price) + (v.popular ? ' (Best Value)' : '') + '</option>'; }).join('') +
      '</select></div>' +
      '</div>' +
      '<div id="variant-quick-specs" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:12px 0">' +
      (vr.specs ? Object.entries(vr.specs).slice(0, 4).map(function (e) { return '<div style="padding:8px 10px;background:var(--bg);border-radius:var(--r8)"><div style="font-size:13px;font-weight:800;color:var(--ink)">' + e[1] + '</div><div style="font-size:10px;color:var(--ink-4);margin-top:1px">' + e[0] + '</div></div>'; }).join('') : '') +
      '</div>' +
      '<div id="variant-features-list" style="margin-bottom:12px">' +
      vr.features.slice(0, 4).map(function (f) { return '<div style="display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid var(--bg-2)"><span style="color:var(--green);flex-shrink:0">' + (IC.check || '<i data-lucide="check"></i>') + '</span><span style="font-size:12.5px;color:var(--ink-2)">' + f + '</span></div>'; }).join('') +
      '</div>' +
      '<div class="price-card-actions">' +
      '<a href="tel:+9779828364940" class="btn btn-primary btn-full btn-phone-cta" id="detail-phone-btn">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>' +
      ' +977-9828364940</a>' +
      '<button class="btn btn-gold btn-full" id="detail-testdrive-btn" onclick="AV.openTestDriveModal(\'' + slug + '\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="margin-right:4px"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> Book Test Drive</button>' +
      '<button class="btn btn-ghost btn-full" id="detail-reqinfo-btn" onclick="AV.openRequestInfoModal(\'' + slug + '\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="margin-right:4px"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> Request Info</button>' +
      '</div>' +
      '</div>' +

      renderEMICard(car, vi) +

      '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:16px;margin-top:12px">' +
      '<div style="font-size:13.5px;font-weight:800;color:var(--ink);margin-bottom:10px">Get in Touch</div>' +
      '<div style="display:flex;flex-direction:column;gap:8px">' +
      '<a href="tel:+9779828364940" style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--green);font-weight:700">' + (IC.phone || '') + ' +977-9828364940</a>' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-3)">' + (IC.pin || '') + ' Nayabazar, Kathmandu</div>' +
      '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-3)">&#128336; Mon–Sat, 9 AM – 6 PM</div>' +
      '</div>' +
      '</div>' +
      '</div></div>';

    /* Build gallery */
    _galleryIdx[slug] = 0;
    var gc = document.getElementById('gallery-container');
    if (gc) {
      var imgs = car.images;
      gc.innerHTML =
        '<div class="gallery-main" id="gal-main">' +
        '<img id="gal-main-img" src="' + imgs[0] + '" alt="' + car.brand + '">' +
        (imgs.length > 1 ?
          '<button class="g-nav-btn prev" onclick="window._galNav(\'' + slug + '\',-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>' +
          '<button class="g-nav-btn next" onclick="window._galNav(\'' + slug + '\',1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>' : '') +
        '<div class="g-count-badge" id="gal-count">1/' + imgs.length + '</div>' +
        '</div>' +
        '<div class="gallery-thumbs">' + imgs.map(function (img, i) { return '<div class="g-thumb ' + (i === 0 ? 'active' : '') + '" onclick="window._galSet(\'' + slug + '\',' + i + ')"><img src="' + img + '" loading="lazy"></div>'; }).join('') + '</div>';
    }

    window._galNav = function (s, dir) {
      var c = carBySlug(s); if (!c) return;
      _galleryIdx[s] = (_galleryIdx[s] + dir + c.images.length) % c.images.length;
      var img = document.getElementById('gal-main-img');
      if (img) { img.classList.add('fade'); setTimeout(function () { img.src = c.images[_galleryIdx[s]]; img.classList.remove('fade'); }, 200); }
      document.querySelectorAll('.g-thumb').forEach(function (t, i) { t.classList.toggle('active', i === _galleryIdx[s]); });
      var cnt = document.getElementById('gal-count'); if (cnt) cnt.textContent = (_galleryIdx[s] + 1) + '/' + c.images.length;
    };
    window._galSet = function (s, idx) {
      var c = carBySlug(s); if (!c) return;
      _galleryIdx[s] = idx;
      var img = document.getElementById('gal-main-img');
      if (img) { img.classList.add('fade'); setTimeout(function () { img.src = c.images[idx]; img.classList.remove('fade'); }, 200); }
      document.querySelectorAll('.g-thumb').forEach(function (t, i) { t.classList.toggle('active', i === idx); });
      var cnt = document.getElementById('gal-count'); if (cnt) cnt.textContent = (idx + 1) + '/' + c.images.length;
    };

    /* ── DELEGATE TO GLOBAL CLEAN LEAD MODALS ── */
    if (window.AV) {
      window.AV._currentDetailSlug = slug;
    }

    /* Patch remaining AV methods for this page */
    if (window.AV) {
      window.AV.galNav = function (dir, s) { window._galNav(s, dir); };
      window.AV.galSet = function (idx, s) { window._galSet(s, idx); };
      window.AV.getActiveVariant = function (s) { return _activeVariant[s] || 0; };
      window.AV.selectVariant = function (s, idx) {
        _activeVariant[s] = idx;
        var c = carBySlug(s); if (!c) return;
        var v = c.variants[idx];
        document.querySelectorAll('.variant-tab').forEach(function (t, i) { t.classList.toggle('active', i === idx); });
        document.querySelectorAll('[data-price-display]').forEach(function (el) { el.textContent = window.Rs(v.price); });
        var panel = document.getElementById('variant-detail-panel');
        if (panel && v.specs) panel.innerHTML = Object.entries(v.specs).map(function (e) { return '<div class="vdp-item"><div class="vdp-value">' + e[1] + '</div><div class="vdp-label">' + e[0] + '</div></div>'; }).join('');
        var qsp = document.getElementById('variant-quick-specs');
        if (qsp && v.specs) qsp.innerHTML = Object.entries(v.specs).slice(0, 4).map(function (e) { return '<div style="padding:8px 10px;background:var(--bg);border-radius:var(--r8)"><div style="font-size:13px;font-weight:800;color:var(--ink)">' + e[1] + '</div><div style="font-size:10px;color:var(--ink-4);margin-top:1px">' + e[0] + '</div></div>'; }).join('');
        var fl = document.getElementById('variant-features-list');
        var IC2 = window.AV_ICONS || {};
        if (fl) fl.innerHTML = v.features.slice(0, 4).map(function (f) { return '<div style="display:flex;align-items:center;gap:7px;padding:6px 0;border-bottom:1px solid var(--bg-2)"><span style="color:var(--green);flex-shrink:0">' + (IC2.check || '<i data-lucide="check"></i>') + '</span><span style="font-size:12.5px;color:var(--ink-2)">' + f + '</span></div>'; }).join('');
        var dd = document.getElementById('variant-dropdown'); if (dd) dd.value = idx;
        var dEl = document.getElementById('emi-down'), tEl = document.getElementById('emi-tenure-val'), rEl = document.getElementById('emi-rate');
        if (dEl && tEl && rEl && window.AV.updateEMI) window.AV.updateEMI(s, idx, +dEl.value, +tEl.textContent, +rEl.value);
      };
    }

    if (window.AV && window.AV.updateCompareTray) window.AV.updateCompareTray();
    if (window.AV && window.AV.updateCompareButtons) window.AV.updateCompareButtons();
  };

})();