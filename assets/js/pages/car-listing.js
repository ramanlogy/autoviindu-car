/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — CAR LISTING PAGE
   window.renderCars(filter, options) → renders #cars
═══════════════════════════════════════════════════════ */
window.renderCars = function (filter, options) {
  options = options || {};
  document.title = 'New Cars Nepal 2024–25 — AutoViindu';
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav(filter === 'electric' ? 'electric' : 'cars');

  var db = window.CARS_DB || [];
  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';

  var filterMap = {
    electric: function (c) { return c.type === 'Electric'; },
    hybrid:   function (c) { return c.type === 'Hybrid'; },
    petrol:   function (c) { return c.type === 'Petrol'; },
    diesel:   function (c) { return c.type === 'Diesel'; },
    suv:      function (c) { return c.body === 'SUV'; },
    sedan:    function (c) { return c.body === 'Sedan'; },
    hatchback:function (c) { return c.body === 'Hatchback'; },
  };

  var cars = db.slice();
  if (filter && filterMap[filter]) cars = cars.filter(filterMap[filter]);
  if (options.q) {
    var q = options.q.toLowerCase();
    cars = cars.filter(function (c) {
      return (c.brand + ' ' + c.model + ' ' + c.type + ' ' + c.body).toLowerCase().includes(q);
    });
  }

  var filterLabels = {
    electric:'Electric Cars',hybrid:'Hybrid Cars',petrol:'Petrol Cars',
    diesel:'Diesel Cars',suv:'SUVs',sedan:'Sedans',hatchback:'Hatchbacks'
  };
  var title = filter ? (filterLabels[filter] || filter) : 'New Cars in Nepal 2024–25';

  var badgeMap = {ev:'badge-ev',hybrid:'badge-hybrid',popular:'badge-pop',new:'badge-new'};
  var badgeLabelMap = {ev:'Electric',hybrid:'Hybrid',popular:'Popular',new:'New'};

  function carCardHTML(car) {
    return '<div class="car-card" onclick="AV.openDetail(\'' + car.slug + '\')">' +
      '<div class="car-card-img-wrap">' +
      '<img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" loading="lazy">' +
      (car.badge ? '<span class="badge ' + (badgeMap[car.badge]||'badge-pop') + '">' + (badgeLabelMap[car.badge]||'') + '</span>' : '') +
      '<button class="wish-btn" onclick="event.stopPropagation();AV.toggleWish(\'' + car.slug + '\',this)">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' +
      '</button></div>' +
      '<div class="car-card-body">' +
      '<div class="car-card-brand">' + car.brand + ' · ' + car.year + '</div>' +
      '<div class="car-card-name">' + car.model + '</div>' +
      '<div class="car-card-tagline">' + car.tagline + '</div>' +
      '<div class="car-card-price-row"><span class="car-card-price">' + car.variants[0].label + '</span>' +
      (car.variants.length > 1 ? '<span class="car-card-variants">' + car.variants.length + ' variants</span>' : '') + '</div>' +
      '<div class="car-card-meta"><span>★ ' + car.rating.toFixed(1) + '</span><span>' + car.type + '</span><span>' + car.body + '</span></div>' +
      '<div class="car-card-actions">' +
      '<button onclick="event.stopPropagation();AV.toggleCompare(\'' + car.slug + '\')" data-cmp-slug="' + car.slug + '" class="btn-cmp">+ Compare</button>' +
      '<button onclick="event.stopPropagation();AV.openDetail(\'' + car.slug + '\')" class="btn btn-primary btn-sm">View Details</button>' +
      '</div></div></div>';
  }

  var filterTabs = ['All','Electric','Hybrid','Petrol','Diesel','SUV','Sedan','Hatchback'];
  var filterChips = filterTabs.map(function (t) {
    var f = t.toLowerCase() === 'all' ? '' : t.toLowerCase();
    var isActive = (!filter && t === 'All') || (filter && filter === t.toLowerCase());
    return '<span class="chip ' + (isActive ? 'active' : '') + '" onclick="AV.goTo(\'cars\',{filter:\'' + f + '\'})">' + t + '</span>';
  }).join('');

  var root = document.getElementById('app-root');
  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><span style="color:rgba(255,255,255,.7)">' + title + '</span></div>' +
    '<h1 class="page-title">' + title + '</h1>' +
    '<div class="page-sub">' + cars.length + ' cars · Full specs, variants & EMI calculator</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:24px;padding-bottom:64px">' +

    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px">' +
    '<div style="flex:1;min-width:220px;position:relative">' +
    '<span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink-4)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
    '<input type="text" placeholder="Search brand, model…" id="listing-search"' +
    ' style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--border);border-radius:var(--pill);font-size:13.5px;outline:none;font-family:var(--font-body);transition:all var(--ease);box-sizing:border-box"' +
    ' oninput="AV.filterListing(this.value)" onfocus="this.style.borderColor=\'var(--green)\'" onblur="this.style.borderColor=\'var(--border)\'">' +
    '</div>' +
    '<select id="listing-sort" onchange="AV.sortListing(this.value)"' +
    ' style="padding:10px 32px 10px 12px;border:1.5px solid var(--border);border-radius:var(--pill);font-family:var(--font-body);font-size:13px;outline:none;background:var(--white);appearance:none;cursor:pointer">' +
    '<option value="">Sort: Relevance</option>' +
    '<option value="price-asc">Price: Low to High</option>' +
    '<option value="price-desc">Price: High to Low</option>' +
    '<option value="rating">Best Rated</option>' +
    '</select></div>' +

    '<div class="filter-chips" style="margin-bottom:16px">' + filterChips + '</div>' +

    '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r10);margin-bottom:18px">' +
    '<div style="font-size:13px;font-weight:700;color:var(--ink)">Showing <span style="color:var(--green)" id="listing-count">' + cars.length + '</span> cars</div>' +
    '<div style="font-size:12px;color:var(--ink-4)">' + db.length + ' total in database</div>' +
    '</div>' +

    '<div class="cars-grid" id="listing-grid">' +
    (cars.length ? cars.map(carCardHTML).join('') :
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--bg);border-radius:var(--r20)">' +
      '<div style="font-size:40px;margin-bottom:12px">🔍</div>' +
      '<div style="font-size:18px;font-weight:800;margin-bottom:8px">No cars found</div>' +
      '<button onclick="AV.goTo(\'cars\')" class="btn btn-primary" style="margin-top:8px">Browse all cars</button>' +
      '</div>') +
    '</div>' +

    '<div style="margin-top:40px;padding:28px;background:var(--green-ll);border:1.5px solid rgba(26,107,42,.14);border-radius:var(--r20);text-align:center">' +
    '<div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--ink);margin-bottom:6px">Can\'t find the right car?</div>' +
    '<p style="font-size:13px;color:var(--ink-3);margin-bottom:16px">Our experts help you choose the best car for Nepal\'s roads and your budget.</p>' +
    '<a href="tel:+9779701076240" class="btn btn-primary">📞 Call +977-9701076240</a>' +
    '</div></div>';

  if (window.AV) {
    window.AV.updateCompareTray && window.AV.updateCompareTray();
    window.AV.updateCompareButtons && window.AV.updateCompareButtons();
  }
  window._listingCars = cars;
  window._listingFilter = filter || null;
};