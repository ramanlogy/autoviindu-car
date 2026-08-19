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

  var norm = function (s) { return String(s || '').toLowerCase().replace(/[\s-_]+/g, ''); };
  var filterMap = {
    electric: function (c) { return c.type === 'Electric'; },
    hybrid: function (c) { return c.type === 'Hybrid'; },
    petrol: function (c) { return c.type === 'Petrol'; },
    diesel: function (c) { return c.type === 'Diesel'; },
    suv: function (c) { return norm(c.body || c.bodyType).includes('suv'); },
    crossover: function (c) { return norm(c.body || c.bodyType).includes('crossover'); },
    sedan: function (c) { return norm(c.body || c.bodyType).includes('sedan'); },
    hatchback: function (c) { return norm(c.body || c.bodyType).includes('hatchback'); },
    coupe: function (c) { return norm(c.body || c.bodyType).includes('coupe'); },
    mpv: function (c) { return norm(c.body || c.bodyType).includes('mpv') || norm(c.body || c.bodyType).includes('muv'); },
    offroad: function (c) { return norm(c.body || c.bodyType).includes('offroad') || norm(c.body || c.bodyType).includes('sav'); },
    'off-road': function (c) { return norm(c.body || c.bodyType).includes('offroad') || norm(c.body || c.bodyType).includes('sav'); },
    pickup: function (c) { return norm(c.body || c.bodyType).includes('pickup'); },
    microcar: function (c) { return norm(c.body || c.bodyType).includes('micro'); },
    micro: function (c) { return norm(c.body || c.bodyType).includes('micro'); },
    wagon: function (c) { return norm(c.body || c.bodyType).includes('wagon'); },
    van: function (c) { return norm(c.body || c.bodyType).includes('van'); },
  };

  var cars = db.slice();
  if (filter && filterMap[filter]) cars = cars.filter(filterMap[filter]);
  if (options.q) {
    var q = options.q.toLowerCase();
    cars = cars.filter(function (c) {
      return (c.brand + ' ' + c.model + ' ' + c.type + ' ' + (c.body || c.bodyType || '')).toLowerCase().includes(q);
    });
  }

  var filterLabels = {
    electric: 'Electric Cars', hybrid: 'Hybrid Cars', petrol: 'Petrol Cars',
    diesel: 'Diesel Cars', suv: 'SUVs', crossover: 'Crossovers', sedan: 'Sedans',
    hatchback: 'Hatchbacks', coupe: 'Coupes', mpv: 'MPVs', offroad: 'Off-road Vehicles',
    pickup: 'Pickup Trucks', microcar: 'Microcars', wagon: 'Wagons', van: 'Vans & Microvans'
  };
  var title = filter ? (filterLabels[filter] || filter) : 'New Cars in Nepal 2024–25';

  var filterTabs = ['All', 'Electric', 'Hybrid', 'Petrol', 'Diesel', 'SUV', 'Crossover', 'Sedan', 'Hatchback', 'Coupe', 'MPV', 'Off-road', 'Pickup', 'Microcar', 'Wagon', 'Van'];
  var filterChips = filterTabs.map(function (t) {
    var f = t.toLowerCase() === 'all' ? '' : (t.toLowerCase() === 'off-road' ? 'offroad' : t.toLowerCase());
    var isActive = (!filter && t === 'All') || (filter && (filter === f || filter === t.toLowerCase()));
    return '<span class="chip ' + (isActive ? 'active' : '') + '" onclick="AV.goTo(\'cars\',{filter:\'' + f + '\'})">' + t + '</span>';
  }).join('');
  
  // Pagination State
  var pageSize = 16;
  var currentPage = 1;
  var initialCars = cars.slice(0, pageSize);
  window._listingCars = cars;
  window._listingFilter = filter || null;

  window.AV.loadMoreCars = function() {
    var grid = document.getElementById('listing-grid');
    var start = currentPage * pageSize;
    var end = start + pageSize;
    var nextCars = window._listingCars.slice(start, end);
    if (!nextCars.length) return;
    
    var temp = document.createElement('div');
    temp.innerHTML = nextCars.map(window.AV.carCard).join('');
    while(temp.firstChild) {
      grid.appendChild(temp.firstChild);
    }
    
    currentPage++;
    if (currentPage * pageSize >= window._listingCars.length) {
      document.getElementById('load-more-btn-wrap').style.display = 'none';
    }
  };

  // Section Data
  var trendingCars = db.filter(c => c.badge === 'Trending' || c.badge === 'popular').slice(0, 5);
  if (trendingCars.length < 5) trendingCars = db.slice(5, 10); // fallback
  var upcomingCars = db.filter(c => c.isUpcoming).slice(0, 5);
  if (upcomingCars.length < 4) upcomingCars = db.filter(c => c.type === 'Electric').slice(0, 5); // fallback

  var sectionHTML = function(title, carsArr, scrollId) {
    return '<div class="home-section" style="margin-top: 60px;">' +
      '<div class="hs-head" style="margin-bottom: 20px; display:flex; align-items:center; justify-content:space-between;">' +
      '<h2 class="hs-title" style="font-size: 24px; margin:0;">' + title + '</h2>' +
      '<div class="carousel-nav-arrows" style="display:flex; align-items:center; gap:8px;">' +
      '<button class="nav-arrow-btn prev" onclick="AV.scrollCarousel(\'' + scrollId + '\', -1)" aria-label="Scroll left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg></button>' +
      '<button class="nav-arrow-btn next" onclick="AV.scrollCarousel(\'' + scrollId + '\', 1)" aria-label="Scroll right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></button>' +
      '</div></div>' +
      '<div class="home-carousel car-carousel" id="' + scrollId + '">' +
      carsArr.map(window.AV.carCard).join('') +
      '</div></div>';
  };

  var newsHTML = '<div class="home-section" style="margin-top: 60px;">' +
    '<h2 class="hs-title" style="font-size: 24px; margin-bottom: 20px;">Latest News & Reviews</h2>' +
    '<div class="news-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">' +
    '<div class="news-card" style="background:#fff; border-radius:12px; overflow:hidden; border:1px solid var(--border); cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: transform 0.2s;">' +
    '<img src="assets/images/car_images/byd/atto-3/exterior/byd-atto-3-exterior-right-front-three-quarter.avif" style="width:100%; height:180px; object-fit:cover;" alt="News 1">' +
    '<div style="padding:20px;">' +
    '<div style="font-size:11px; color:var(--green); font-weight:700; margin-bottom:8px; text-transform:uppercase;">Review</div>' +
    '<h3 style="font-size:16px; font-weight:800; color:var(--ink); line-height:1.4; margin:0 0 8px 0;">BYD Atto 3 Long Range Review: Still the best EV?</h3>' +
    '<p style="font-size:13.5px; color:var(--ink-3); line-height:1.5; margin:0;">An in-depth look at how the 2024 BYD Atto 3 handles Nepalese roads and its true real-world range.</p>' +
    '</div></div>' +
    '<div class="news-card" style="background:#fff; border-radius:12px; overflow:hidden; border:1px solid var(--border); cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: transform 0.2s;">' +
    '<img src="assets/images/car_images/hyundai/creta/exterior/hyundai-creta-exterior-right-front-three-quarter.jpeg" style="width:100%; height:180px; object-fit:cover;" alt="News 2">' +
    '<div style="padding:20px;">' +
    '<div style="font-size:11px; color:#007bff; font-weight:700; margin-bottom:8px; text-transform:uppercase;">News</div>' +
    '<h3 style="font-size:16px; font-weight:800; color:var(--ink); line-height:1.4; margin:0 0 8px 0;">Hyundai Launches the All New Creta Facelift</h3>' +
    '<p style="font-size:13.5px; color:var(--ink-3); line-height:1.5; margin:0;">The much-awaited 2024 Hyundai Creta Facelift is finally here with Level 2 ADAS and panoramic sunroof.</p>' +
    '</div></div>' +
    '<div class="news-card" style="background:#fff; border-radius:12px; overflow:hidden; border:1px solid var(--border); cursor:pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: transform 0.2s;">' +
    '<img src="assets/images/car_images/tata/nexon-ev/exterior/tata-nexon-ev-exterior-right-front-three-quarter.avif" style="width:100%; height:180px; object-fit:cover;" alt="News 3">' +
    '<div style="padding:20px;">' +
    '<div style="font-size:11px; color:#dc3545; font-weight:700; margin-bottom:8px; text-transform:uppercase;">Comparison</div>' +
    '<h3 style="font-size:16px; font-weight:800; color:var(--ink); line-height:1.4; margin:0 0 8px 0;">Nexon EV vs XUV400: Which electric SUV makes sense?</h3>' +
    '<p style="font-size:13.5px; color:var(--ink-3); line-height:1.5; margin:0;">We pit the two most popular compact electric SUVs against each other to help you decide.</p>' +
    '</div></div></div></div>';

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

    '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r10);margin-bottom:24px">' +
    '<div style="font-size:13px;font-weight:700;color:var(--ink)">Showing <span style="color:var(--green)" id="listing-count">' + cars.length + '</span> cars</div>' +
    '<div style="font-size:12px;color:var(--ink-4)">' + db.length + ' total in database</div>' +
    '</div>' +

    '<div class="cars-grid" id="listing-grid">' +
    (initialCars.length ? initialCars.map(window.AV.carCard).join('') :
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--bg);border-radius:var(--r20)">' +
      '<div style="font-size:40px;margin-bottom:12px"><i data-lucide="search"></i></div>' +
      '<div style="font-size:18px;font-weight:800;margin-bottom:8px">No cars found</div>' +
      '<button onclick="AV.goTo(\'cars\')" class="btn btn-primary" style="margin-top:8px">Browse all cars</button>' +
      '</div>') +
    '</div>' +
    
    (cars.length > pageSize ? 
      '<div id="load-more-btn-wrap" style="text-align:center; margin-top:32px;">' +
      '<button class="btn btn-outline" style="padding:12px 32px; font-weight:600;" onclick="AV.loadMoreCars()">Load More Vehicles</button>' +
      '</div>' : '') +

    '<div style="margin-top:60px;padding:28px;background:var(--green-ll);border:1.5px solid rgba(26,107,42,.14);border-radius:var(--r20);text-align:center">' +
    '<div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--ink);margin-bottom:6px">Can\'t find the right car?</div>' +
    '<p style="font-size:13px;color:var(--ink-3);margin-bottom:16px">Our experts help you choose the best car for Nepal\'s roads and your budget.</p>' +
    '<a href="tel:+9779828364940" class="btn btn-primary"><i data-lucide="phone"></i> Call +977-9828364940</a>' +
    '</div>' + 
    
    sectionHTML('Trending Now', trendingCars, 'list-trend-carousel') +
    sectionHTML('Upcoming Arrivals', upcomingCars, 'list-up-carousel') +
    newsHTML +
    
    '</div>';

  if (window.AV) {
    window.AV.updateCompareTray && window.AV.updateCompareTray();
    window.AV.updateCompareButtons && window.AV.updateCompareButtons();
  }
};