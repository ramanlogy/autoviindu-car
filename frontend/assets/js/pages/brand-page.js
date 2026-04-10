/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — BRAND PAGE
   renderBrandPage(slug) → renders #brand/:slug
   One template, infinite brands.
═══════════════════════════════════════════════════════ */
window.renderBrandPage = function (slug) {
  var brand = window.getBrandBySlug(slug);
  var root = document.getElementById('app-root');
  if (!brand) {
    root.innerHTML = '<div class="wrap" style="padding:80px 20px;text-align:center"><h2>Brand not found</h2><button class="btn btn-primary" onclick="AV.goTo(\'cars\')" style="margin-top:16px">Browse All Cars</button></div>';
    return;
  }

  var cars = window.getCarsByBrand(slug);
  document.title = brand.name + ' Cars in Nepal — Price, Specs & EMI | AutoViindu';

  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';
  var star = IC.star || '★';

  var badgeMap = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' };
  var badgeLabelMap = { ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' };

  function carCardHTML(car) {
    var popularVariant = car.variants.find(function (v) { return v.popular; }) || car.variants[0];
    var inWishlist = window.AV && window.AV.wishlistIncludes ? window.AV.wishlistIncludes(car.slug) : false;
    return '<div class="car-card" onclick="AV.openDetail(\'' + car.slug + '\')">' +
      '<div class="car-card-img-wrap">' +
      '<img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" loading="lazy">' +
      (car.badge ? '<span class="badge ' + (badgeMap[car.badge] || 'badge-pop') + '">' + (badgeLabelMap[car.badge] || '') + '</span>' : '') +
      '<button class="wish-btn' + (inWishlist ? ' wishlisted' : '') + '" onclick="event.stopPropagation();AV.toggleWish(\'' + car.slug + '\',this)">' +
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
      '<span>' + car.type + '</span>' +
      '<span>' + car.body + '</span>' +
      '</div>' +
      '<div class="car-card-actions">' +
      '<button onclick="event.stopPropagation();AV.toggleCompare(\'' + car.slug + '\')" data-cmp-slug="' + car.slug + '" class="btn-cmp">+ Compare</button>' +
      '<button onclick="event.stopPropagation();AV.openDetail(\'' + car.slug + '\')" class="btn btn-primary btn-sm">View Details</button>' +
      '</div>' +
      '</div></div>';
  }

  root.innerHTML =
    /* HERO */
    '<div class="page-hero" style="background:linear-gradient(135deg,' + brand.color + ' 0%,rgba(11,15,20,.97) 100%)">' +
    '<div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><a onclick="AV.goTo(\'cars\')">Cars</a><span class="sep">' + chevR + '</span><span style="color:rgba(255,255,255,.7)">' + brand.name + '</span></div>' +
    '<div style="display:flex;align-items:center;gap:18px;margin:18px 0 10px">' +
    '<div style="width:56px;height:56px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
    '<span style="font-size:16px;font-weight:900;color:' + brand.color + '">' + brand.name.substring(0, 3).toUpperCase() + '</span></div>' +
    '<div><h1 class="page-title" style="margin:0">' + brand.name + ' Cars in Nepal</h1>' +
    '<div class="page-sub">' + brand.fullName + ' · ' + brand.tagline + '</div></div>' +
    '</div>' +
    '</div></div>' +

    /* BRAND STATS STRIP */
    '<div style="background:var(--bg);border-bottom:1px solid var(--border)">' +
    '<div class="wrap" style="display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--border)">' +
    [
      ['Cars Available', cars.length],
      ['Founded', brand.founded],
      ['Warranty', brand.warranty.split('/')[0].trim()],
      ['Service Centers', brand.serviceNetwork.split(' ').slice(0, 2).join(' ')],
    ].map(function (item) {
      return '<div style="background:var(--white);padding:14px 16px;text-align:center">' +
        '<div style="font-size:18px;font-weight:800;color:var(--ink)">' + item[1] + '</div>' +
        '<div style="font-size:11px;color:var(--ink-4);font-weight:600;margin-top:2px">' + item[0] + '</div>' +
        '</div>';
    }).join('') +
    '</div></div>' +

    /* OVERVIEW */
    '<div class="wrap" style="padding-top:32px;padding-bottom:0">' +
    '<div style="background:' + brand.bgColor + ';border:1.5px solid ' + brand.color + '22;border-radius:var(--r16);padding:20px 24px;margin-bottom:32px">' +
    '<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:' + brand.color + ';margin-bottom:8px">About ' + brand.name + ' in Nepal</div>' +
    '<p style="font-size:14px;line-height:1.7;color:var(--ink-2);margin:0 0 14px">' + brand.overview + '</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
    brand.strengths.map(function (s) {
      return '<span style="font-size:11.5px;font-weight:700;padding:4px 10px;background:#fff;border:1px solid ' + brand.color + '33;border-radius:var(--pill);color:' + brand.color + '">✓ ' + s + '</span>';
    }).join('') +
    '</div></div>' +

    /* DEALER INFO */
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:32px">' +
    '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r12);padding:14px 16px">' +
    '<div style="font-size:10px;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Nepal Dealer</div>' +
    '<div style="font-size:13px;font-weight:800;color:var(--ink)">' + brand.nepalDealer + '</div>' +
    '</div>' +
    '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r12);padding:14px 16px">' +
    '<div style="font-size:10px;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Contact</div>' +
    '<a href="tel:' + brand.dealerPhone + '" style="font-size:13px;font-weight:800;color:' + brand.color + ';text-decoration:none">' + brand.dealerPhone + '</a>' +
    '</div>' +
    '</div>' +

    /* CARS GRID */
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
    '<div style="font-size:18px;font-weight:800;color:var(--ink)">' + brand.name + ' Models in Nepal <span style="font-size:14px;font-weight:600;color:var(--ink-4)">(' + cars.length + ')</span></div>' +
    '</div>' +

    /* FILTER CHIPS */
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px" id="brand-filter-chips">' +
    ['All', 'SUV', 'Sedan', 'Hatchback', 'Electric', 'Hybrid', 'Petrol', 'Diesel'].map(function (f, i) {
      return '<span class="chip' + (i === 0 ? ' active' : '') + '" onclick="AV.filterBrandCars(\'' + slug + '\',\'' + f + '\',this)">' + f + '</span>';
    }).join('') +
    '</div>' +

    '<div class="cars-grid" id="brand-cars-grid">' +
    (cars.length ? cars.map(carCardHTML).join('') :
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--bg);border-radius:var(--r20)">' +
      '<div style="font-size:18px;font-weight:700;color:var(--ink-3)">No ' + brand.name + ' cars listed yet</div>' +
      '<button onclick="AV.goTo(\'cars\')" class="btn btn-primary" style="margin-top:14px">Browse All Cars</button></div>'
    ) +
    '</div></div>' +

    /* BOTTOM PADDING */
    '<div style="height:64px"></div>';

  if (window.AV && window.AV.updateCompareButtons) window.AV.updateCompareButtons();
};

/* Filter handler for brand page */
if (!window.AV) window.AV = {};
window.AV.filterBrandCars = function (brandSlug, filter, btn) {
  document.querySelectorAll('#brand-filter-chips .chip').forEach(function (c) { c.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var cars = window.getCarsByBrand(brandSlug);
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
  var grid = document.getElementById('brand-cars-grid');
  if (!grid) return;
  if (!cars.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px 20px;background:var(--bg);border-radius:var(--r16)"><div style="font-size:15px;font-weight:700;color:var(--ink-3)">No ' + filter + ' models available</div></div>';
    return;
  }
  // Re-use carCardHTML from renderBrandPage scope — rebuild inline
  var badgeMap = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' };
  var badgeLabelMap = { ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' };
  var IC = window.AV_ICONS || {};
  var star = IC.star || '★';
  grid.innerHTML = cars.map(function (car) {
    return '<div class="car-card" onclick="AV.openDetail(\'' + car.slug + '\')">' +
      '<div class="car-card-img-wrap">' +
      '<img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" loading="lazy">' +
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
};