/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — BUDGET PAGE
   renderBudgetPage(tierSlug) → renders #budget/:slug
   One template, infinite budget tiers.
═══════════════════════════════════════════════════════ */
window.renderBudgetPage = function (tierSlug) {
  var tier = window.getBudgetTier ? window.getBudgetTier(tierSlug) : null;
  var root = document.getElementById('app-root');

  if (!tier) {
    /* Show all tiers as a landing page */
    document.title = 'Cars by Budget in Nepal — AutoViindu';
    root.innerHTML =
      '<div class="page-hero"><div class="wrap">' +
      '<h1 class="page-title">Find Cars by Budget</h1>' +
      '<div class="page-sub">Every budget, every need — we have the right car for you</div>' +
      '</div></div>' +
      '<div class="wrap" style="padding:32px 0 64px">' +
      '<div style="display:grid;grid-template-columns:1fr;gap:12px">' +
      (window.BUDGET_TIERS || []).map(function (t) {
        var cnt = window.getCarsByBudget ? window.getCarsByBudget(t.slug).length : 0;
        return '<div onclick="AV.goTo(\'budget\',{tier:\'' + t.slug + '\'})" style="display:flex;align-items:center;gap:16px;padding:18px 20px;background:var(--white);border:1.5px solid var(--border);border-radius:var(--r14);cursor:pointer;transition:all var(--ease)" onmouseenter="this.style.borderColor=\'' + t.color + '\';this.style.background=\'' + t.bgColor + '\'" onmouseleave="this.style.borderColor=\'var(--border)\';this.style.background=\'var(--white)\'">' +
          '<div style="font-size:28px;flex-shrink:0">' + t.emoji + '</div>' +
          '<div styl/home/raman/Downloads/car_image_downloader/car_imagese="flex:1">' +
          '<div style="font-size:16px;font-weight:800;color:var(--ink)">' + t.label + '</div>' +
          '<div style="font-size:12.5px;color:var(--ink-4);margin-top:3px">' + t.heroText + ' · ' + cnt + ' cars</div>' +
          '</div>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>' +
          '</div>';
      }).join('') +
      '</div></div>';
    return;
  }

  var cars = window.getCarsByBudget ? window.getCarsByBudget(tierSlug) : [];
  var sortedCars = window.sortCars ? window.sortCars(cars, 'expert') : cars;

  document.title = 'Best Cars in ' + tier.label + ' in Nepal 2024 | AutoViindu';

  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';
  var star = IC.star || '★';
  var badgeMap = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' };
  var badgeLabelMap = { ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' };

  var bestPick = sortedCars[0] || null;

  function carCardHTML(car, isBest) {
    return '<div class="car-card' + (isBest ? ' car-card-featured' : '') + '" onclick="AV.openDetail(\'' + car.slug + '\')" style="' + (isBest ? 'border-color:' + tier.color + ';box-shadow:0 0 0 2px ' + tier.color + '22' : '') + '">' +
      (isBest ? '<div style="background:' + tier.color + ';color:#fff;font-size:10.5px;font-weight:800;text-align:center;padding:5px;letter-spacing:.5px">⭐ BEST PICK IN ' + tier.shortLabel + '</div>' : '') +
      '<div class="car-card-img-wrap">' +
      '<img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" loading="lazy">' +
      (car.badge ? '<span class="badge ' + (badgeMap[car.badge] || 'badge-pop') + '">' + (badgeLabelMap[car.badge] || '') + '</span>' : '') +
      '<button class="wish-btn" onclick="event.stopPropagation();AV.toggleWish(\'' + car.slug + '\',this)">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' +
      '</button></div>' +
      '<div class="car-card-body">' +
      '<div class="car-card-brand">' + car.brand + ' · ' + car.year + '</div>' +
      '<div class="car-card-name">' + car.model + '</div>' +
      '<div class="car-card-tagline">' + car.tagline + '</div>' +
      '<div class="car-card-price-row">' +
      '<span class="car-card-price">' + car.variants[0].label + '</span>' +
      (car.variants.length > 1 ? '<span class="car-card-variants">' + car.variants.length + ' variants</span>' : '') +
      '</div>' +
      '<div class="car-card-meta">' +
      '<span>' + star + ' ' + car.rating.toFixed(1) + '</span>' +
      '<span>' + car.type + '</span><span>' + car.body + '</span>' +
      '<span style="color:' + tier.color + ';font-weight:700">' + car.expertScore + '/10</span>' +
      '</div>' +
      '<div class="car-card-actions">' +
      '<button onclick="event.stopPropagation();AV.toggleCompare(\'' + car.slug + '\')" data-cmp-slug="' + car.slug + '" class="btn-cmp">+ Compare</button>' +
      '<button onclick="event.stopPropagation();AV.openDetail(\'' + car.slug + '\')" class="btn btn-primary btn-sm">View Details</button>' +
      '</div></div></div>';
  }

  /* EMI quick calc for mid-tier */
  var midPrice = (tier.max === Infinity ? tier.min * 1.5 : (tier.min + tier.max) / 2);
  var emiEst = window.calcEMI ? Math.round(window.calcEMI(midPrice * 0.8, 10, 60)) : 0;

  /* Other tiers for bottom nav */
  var otherTiers = (window.BUDGET_TIERS || []).filter(function (t) { return t.slug !== tierSlug; });

  root.innerHTML =
    /* HERO */
    '<div class="page-hero" style="background:linear-gradient(135deg,rgba(11,15,20,.97) 0%,' + tier.color + '80 100%)">' +
    '<div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><a onclick="AV.goTo(\'budget\')">Budget Guide</a><span class="sep">' + chevR + '</span><span style="color:rgba(255,255,255,.7)">' + tier.label + '</span></div>' +
    '<div style="font-size:32px;margin:16px 0 8px">' + tier.emoji + '</div>' +
    '<h1 class="page-title">Cars in ' + tier.label + '</h1>' +
    '<div class="page-sub">' + tier.heroText + ' · ' + sortedCars.length + ' models</div>' +
    '</div></div>' +

    /* STATS STRIP */
    '<div style="background:var(--bg);border-bottom:1px solid var(--border)">' +
    '<div class="wrap" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border)">' +
    [
      ['Models', sortedCars.length],
      ['Starting from', sortedCars.length ? sortedCars.slice().sort(function (a, b) { return a.variants[0].price - b.variants[0].price; })[0].variants[0].label : '—'],
      ['Est. EMI/mo', emiEst ? 'Rs. ' + emiEst.toLocaleString() : '—'],
    ].map(function (item) {
      return '<div style="background:var(--white);padding:14px 16px;text-align:center">' +
        '<div style="font-size:16px;font-weight:800;color:var(--ink)">' + item[1] + '</div>' +
        '<div style="font-size:11px;color:var(--ink-4);font-weight:600;margin-top:2px">' + item[0] + '</div>' +
        '</div>';
    }).join('') +
    '</div></div>' +

    '<div class="wrap" style="padding-top:28px;padding-bottom:64px">' +

    /* TARGET BUYER */
    '<div style="background:' + tier.bgColor + ';border:1.5px solid ' + tier.color + '33;border-radius:var(--r14);padding:14px 18px;margin-bottom:28px;display:flex;align-items:center;gap:12px">' +
    '<div style="font-size:22px">' + tier.emoji + '</div>' +
    '<div>' +
    '<div style="font-size:11px;font-weight:800;color:' + tier.color + ';text-transform:uppercase;letter-spacing:.5px">Who is this for?</div>' +
    '<div style="font-size:13.5px;font-weight:700;color:var(--ink);margin-top:2px">' + tier.targetBuyer + '</div>' +
    '</div></div>' +

    /* SORT + FILTER */
    '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:18px">' +
    '<div style="font-size:15px;font-weight:800;color:var(--ink)">' + sortedCars.length + ' Cars Found</div>' +
    '<select id="budget-sort" onchange="AV.sortBudgetCars(\'' + tierSlug + '\',this.value)" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-body);font-size:13px;background:var(--white);color:var(--ink)">' +
    '<option value="expert">Expert Score</option>' +
    '<option value="rating">User Rating</option>' +
    '<option value="price-low">Price: Low to High</option>' +
    '<option value="price-high">Price: High to Low</option>' +
    '</select>' +
    '</div>' +

    /* FILTER CHIPS */
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px" id="budget-filter-chips">' +
    ['All', 'SUV', 'Sedan', 'Hatchback', 'Electric', 'Petrol', 'Diesel', 'Hybrid'].map(function (f, i) {
      return '<span class="chip' + (i === 0 ? ' active' : '') + '" onclick="AV.filterBudgetCars(\'' + tierSlug + '\',\'' + f + '\',this)">' + f + '</span>';
    }).join('') +
    '</div>' +

    /* CARS GRID */
    '<div class="cars-grid" id="budget-cars-grid">' +
    (sortedCars.length ?
      sortedCars.map(function (car, i) { return carCardHTML(car, i === 0); }).join('') :
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--bg);border-radius:var(--r20)">' +
      '<div style="font-size:40px;margin-bottom:12px">' + tier.emoji + '</div>' +
      '<div style="font-size:18px;font-weight:700;color:var(--ink-3)">No cars in this budget range yet</div>' +
      '<button onclick="AV.goTo(\'cars\')" class="btn btn-primary" style="margin-top:14px">Browse All Cars</button></div>'
    ) +
    '</div>' +

    /* EMI QUICK CALC */
    '<div style="background:var(--green-ll);border:1.5px solid rgba(26,107,42,.16);border-radius:var(--r16);padding:22px 24px;margin-top:40px">' +
    '<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:var(--green);margin-bottom:8px">EMI Calculator</div>' +
    '<div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:16px">Calculate Your Monthly Payment</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">' +
    '<div><label style="font-size:12px;font-weight:700;color:var(--ink-3);display:block;margin-bottom:5px">Car Price (Rs. L)</label>' +
    '<input id="bgt-price" type="number" value="' + Math.round(midPrice / 100000) + '" min="5" max="200" style="width:100%;padding:9px 11px;border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-body);font-size:14px;font-weight:700" oninput="AV.calcBudgetEMI()"></div>' +
    '<div><label style="font-size:12px;font-weight:700;color:var(--ink-3);display:block;margin-bottom:5px">Down Payment (Rs. L)</label>' +
    '<input id="bgt-down" type="number" value="' + Math.round(midPrice * 0.2 / 100000) + '" min="0" style="width:100%;padding:9px 11px;border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-body);font-size:14px;font-weight:700" oninput="AV.calcBudgetEMI()"></div>' +
    '<div><label style="font-size:12px;font-weight:700;color:var(--ink-3);display:block;margin-bottom:5px">Interest Rate (%/yr)</label>' +
    '<input id="bgt-rate" type="number" value="10" min="1" max="20" step="0.1" style="width:100%;padding:9px 11px;border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-body);font-size:14px;font-weight:700" oninput="AV.calcBudgetEMI()"></div>' +
    '<div><label style="font-size:12px;font-weight:700;color:var(--ink-3);display:block;margin-bottom:5px">Tenure (years)</label>' +
    '<select id="bgt-tenure" onchange="AV.calcBudgetEMI()" style="width:100%;padding:9px 11px;border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-body);font-size:14px;font-weight:700;background:var(--white)">' +
    '<option value="36">3 years</option><option value="48">4 years</option><option value="60" selected>5 years</option><option value="72">6 years</option><option value="84">7 years</option>' +
    '</select></div>' +
    '</div>' +
    '<div id="bgt-emi-result" style="background:var(--green);color:#fff;border-radius:var(--r10);padding:14px 18px;text-align:center">' +
    '<div style="font-size:11px;font-weight:700;opacity:.7">Estimated Monthly EMI</div>' +
    '<div style="font-size:26px;font-weight:800" id="bgt-emi-val">Rs. ' + (emiEst ? emiEst.toLocaleString() : '—') + '</div>' +
    '</div></div>' +

    /* OTHER TIERS */
    '<div style="margin-top:48px">' +
    '<div style="font-size:16px;font-weight:800;color:var(--ink);margin-bottom:16px">Explore Other Budget Ranges</div>' +
    '<div style="display:grid;grid-template-columns:1fr;gap:8px">' +
    otherTiers.map(function (t) {
      var cnt = window.getCarsByBudget ? window.getCarsByBudget(t.slug).length : 0;
      return '<div onclick="AV.goTo(\'budget\',{tier:\'' + t.slug + '\'})" style="display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--white);border:1px solid var(--border);border-radius:var(--r12);cursor:pointer;transition:all var(--ease)" onmouseenter="this.style.background=\'' + t.bgColor + '\'" onmouseleave="this.style.background=\'var(--white)\'">' +
        '<span style="font-size:22px">' + t.emoji + '</span>' +
        '<div style="flex:1"><div style="font-size:13.5px;font-weight:800;color:var(--ink)">' + t.label + '</div>' +
        '<div style="font-size:11.5px;color:var(--ink-4)">' + t.heroText + ' · ' + cnt + ' cars</div></div>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</div>';
    }).join('') +
    '</div></div>' +

    '</div>';

  if (window.AV && window.AV.updateCompareButtons) window.AV.updateCompareButtons();
};

/* Sort handler */
if (!window.AV) window.AV = {};

window.AV.sortBudgetCars = function (tierSlug, sortBy) {
  var cars = window.getCarsByBudget ? window.getCarsByBudget(tierSlug) : [];
  var sorted = window.sortCars ? window.sortCars(cars, sortBy) : cars;
  _rebuildBudgetGrid(sorted, tierSlug);
};

window.AV.filterBudgetCars = function (tierSlug, filter, btn) {
  document.querySelectorAll('#budget-filter-chips .chip').forEach(function (c) { c.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var cars = window.getCarsByBudget ? window.getCarsByBudget(tierSlug) : [];
  if (filter !== 'All') {
    cars = cars.filter(function (c) {
      if (filter === 'Electric') return c.type === 'Electric';
      if (filter === 'Hybrid') return c.type === 'Hybrid';
      if (filter === 'Petrol') return c.type === 'Petrol';
      if (filter === 'Diesel') return c.type === 'Diesel';
      if (filter === 'SUV') return c.body === 'SUV';
      if (filter === 'Sedan') return c.body === 'Sedan';
      if (filter === 'Hatchback') return c.body === 'Hatchback';
      return true;
    });
  }
  _rebuildBudgetGrid(cars, tierSlug);
};

window.AV.calcBudgetEMI = function () {
  var price = parseFloat(document.getElementById('bgt-price').value || 0) * 100000;
  var down = parseFloat(document.getElementById('bgt-down').value || 0) * 100000;
  var rate = parseFloat(document.getElementById('bgt-rate').value || 10);
  var months = parseInt(document.getElementById('bgt-tenure').value || 60);
  var principal = Math.max(0, price - down);
  var emi = window.calcEMI ? Math.round(window.calcEMI(principal, rate, months)) : 0;
  var el = document.getElementById('bgt-emi-val');
  if (el) el.textContent = 'Rs. ' + (emi ? emi.toLocaleString() : '—');
};

function _rebuildBudgetGrid(cars, tierSlug) {
  var grid = document.getElementById('budget-cars-grid');
  if (!grid) return;
  var tier = window.getBudgetTier ? window.getBudgetTier(tierSlug) : {};
  var badgeMap = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' };
  var badgeLabelMap = { ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' };
  var IC = window.AV_ICONS || {};
  var star = IC.star || '★';
  if (!cars.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;background:var(--bg);border-radius:var(--r16)"><div style="font-size:15px;font-weight:700;color:var(--ink-3)">No cars match this filter</div><button onclick="AV.filterBudgetCars(\'' + tierSlug + '\',\'All\')" class="btn btn-primary" style="margin-top:12px">Show All</button></div>';
    return;
  }
  grid.innerHTML = cars.map(function (car, i) {
    var isBest = i === 0;
    return '<div class="car-card" onclick="AV.openDetail(\'' + car.slug + '\')" style="' + (isBest && tier.color ? 'border-color:' + tier.color + '' : '') + '">' +
      (isBest && tier ? '<div style="background:' + tier.color + ';color:#fff;font-size:10px;font-weight:800;text-align:center;padding:4px;letter-spacing:.5px">⭐ BEST PICK</div>' : '') +
      '<div class="car-card-img-wrap"><img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" loading="lazy">' +
      (car.badge ? '<span class="badge ' + (badgeMap[car.badge] || 'badge-pop') + '">' + (badgeLabelMap[car.badge] || '') + '</span>' : '') +
      '</div><div class="car-card-body">' +
      '<div class="car-card-brand">' + car.brand + ' · ' + car.year + '</div>' +
      '<div class="car-card-name">' + car.model + '</div>' +
      '<div class="car-card-price-row"><span class="car-card-price">' + car.variants[0].label + '</span>' +
      (car.variants.length > 1 ? '<span class="car-card-variants">' + car.variants.length + ' variants</span>' : '') + '</div>' +
      '<div class="car-card-meta"><span>' + star + ' ' + car.rating.toFixed(1) + '</span><span>' + car.type + '</span><span>' + car.body + '</span></div>' +
      '<div class="car-card-actions">' +
      '<button onclick="event.stopPropagation();AV.toggleCompare(\'' + car.slug + '\')" data-cmp-slug="' + car.slug + '" class="btn-cmp">+ Compare</button>' +
      '<button onclick="event.stopPropagation();AV.openDetail(\'' + car.slug + '\')" class="btn btn-primary btn-sm">View Details</button>' +
      '</div></div></div>';
  }).join('');
  if (window.AV && window.AV.updateCompareButtons) window.AV.updateCompareButtons();
}