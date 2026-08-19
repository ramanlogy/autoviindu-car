/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — USED CARS PAGE
   window.renderUsed(opts) → renders #used
═══════════════════════════════════════════════════════ */
window.renderUsed = function (opts) {
  opts = opts || {};
  document.title = 'Used Cars Nepal — Certified Pre-Owned | AutoViindu';
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('used');

  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';

  var ALL_USED = window.USED_CARS_DB || [
    { id: 'u1', brand: 'Toyota', model: 'Fortuner', year: 2021, km: 38450, type: 'Diesel', body: 'SUV', price: 6800000, priceLabel: 'Rs. 68L', transmission: 'Automatic', owners: 1, color: 'Pearl White', location: 'Kathmandu', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop', tags: ['1 Owner', 'Full Service History', 'Under Warranty'], features: ['Leather Seats', 'Sunroof', '4WD', '7 Seats', 'Reverse Camera'], description: 'Single owner Fortuner in pristine condition. Full Toyota service history. All original parts. No accidents.' },
    { id: 'u2', brand: 'Honda', model: 'Civic', year: 2020, km: 44200, type: 'Petrol', body: 'Sedan', price: 2800000, priceLabel: 'Rs. 28L', transmission: 'CVT', owners: 1, color: 'Lunar Silver', location: 'Lalitpur', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop', tags: ['Well Maintained', 'Low Insurance'], features: ['Apple CarPlay', 'Honda Sensing', 'LED Headlights', 'Sunroof'], description: 'Well-maintained Civic 10th gen. Full service at Honda dealer. Non-smoker car.' },
    { id: 'u3', brand: 'Hyundai', model: 'Tucson', year: 2022, km: 22100, type: 'Petrol', body: 'SUV', price: 4200000, priceLabel: 'Rs. 42L', transmission: 'Automatic', owners: 1, color: 'Amazon Gray', location: 'Kathmandu', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=300&fit=crop', tags: ['Low KM', '1 Owner', 'Like New'], features: ['Panoramic Sunroof', 'Blind Spot Monitor', 'BOSE Audio', '360° Camera'], description: 'Barely used Tucson NX4 2022. Only 22,100 km. All accessories intact.' },
    { id: 'u4', brand: 'Toyota', model: 'Prius', year: 2020, km: 41300, type: 'Hybrid', body: 'Sedan', price: 3000000, priceLabel: 'Rs. 30L', transmission: 'Automatic', owners: 2, color: 'Black', location: 'Bhaktapur', img: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&h=300&fit=crop', tags: ['Fuel Saver', 'Hybrid', 'Toyota Certified'], features: ['Hybrid Powertrain', 'Toyota Safety Sense', 'Wireless Charging', 'JBL Audio'], description: 'Reliable Prius hybrid. Perfect for Kathmandu traffic.' },
    { id: 'u5', brand: 'Kia', model: 'Sportage', year: 2022, km: 18200, type: 'Diesel', body: 'SUV', price: 3600000, priceLabel: 'Rs. 36L', transmission: 'Automatic', owners: 1, color: 'Snow White Pearl', location: 'Kathmandu', img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop', tags: ['Low KM', 'Diesel', 'Single Owner'], features: ['Kia Drive Wise', 'Panoramic Sunroof', 'Ventilated Seats', '360° Camera'], description: 'Near-new Sportage diesel with low mileage. Selling due to upgrade.' },
    { id: 'u6', brand: 'BMW', model: 'X3', year: 2021, km: 29400, type: 'Petrol', body: 'SUV', price: 7200000, priceLabel: 'Rs. 72L', transmission: 'Automatic', owners: 1, color: 'Alpine White', location: 'Kathmandu', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop', tags: ['Premium', 'Loaded', 'BMW Certified'], features: ['M Sport Package', 'Panoramic Sunroof', 'Harman Kardon', 'Head-Up Display'], description: 'Immaculate BMW X3 M Sport. All service at authorized BMW Nepal center.' },
    { id: 'u7', brand: 'Suzuki', model: 'Swift', year: 2021, km: 51000, type: 'Petrol', body: 'Hatchback', price: 1250000, priceLabel: 'Rs. 12.5L', transmission: 'MT', owners: 2, color: 'Magma Gray', location: 'Lalitpur', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop', tags: ['Fuel Efficient', 'City Car'], features: ['Infotainment System', 'Rear Camera', 'Push Start', 'ABS+EBD'], description: 'Practical city hatchback. Very fuel efficient. Good for Kathmandu commute.' },
    { id: 'u8', brand: 'Mahindra', model: 'XUV700', year: 2022, km: 24500, type: 'Diesel', body: 'SUV', price: 3900000, priceLabel: 'Rs. 39L', transmission: 'Automatic', owners: 1, color: 'Dazzling Silver', location: 'Kathmandu', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop', tags: ['7 Seater', 'ADAS', 'Low KM'], features: ['AdrenoX System', 'ADAS Level 2', 'Panoramic Sunroof', '6 Airbags'], description: 'Feature-packed XUV700 AX7L. All original parts. Selling due to relocation.' },
  ];

  var cars = ALL_USED.slice();

  if (opts.filter) {
    var f = opts.filter;
    if (['suv', 'crossover', 'sedan', 'hatchback', 'coupe', 'mpv', 'offroad', 'pickup', 'microcar', 'wagon', 'van'].indexOf(f) > -1) {
      cars = cars.filter(function (c) { return c.body && c.body.toLowerCase() === f; });
    }
    else if (f === 'hybrid' || f === 'diesel' || f === 'petrol' || f === 'electric') {
      cars = cars.filter(function (c) { return c.type && c.type.toLowerCase() === f; });
    }
    else if (['toyota', 'honda', 'hyundai', 'kia', 'suzuki', 'bmw', 'mahindra'].includes(f)) {
      cars = cars.filter(function (c) { return c.brand && c.brand.toLowerCase() === f; });
    }
    else if (f === 'lowest_km') cars.sort(function (a, b) { return a.km - b.km; });
    else if (f === 'year') cars.sort(function (a, b) { return b.year - a.year; });
    else if (f === 'price') cars.sort(function (a, b) { return a.price - b.price; });
    else if (f === 'certified') cars = cars.filter(function (c) { return c.tags && c.tags.join(' ').toLowerCase().indexOf('certified') > -1; });
    else if (f === 'brand') cars.sort(function (a, b) { return a.brand.localeCompare(b.brand); });
  }

  if (opts.budget) {
    if (opts.budget === 'under20') cars = cars.filter(function (c) { return c.price < 2000000; });
    else if (opts.budget === '20to40') cars = cars.filter(function (c) { return c.price >= 2000000 && c.price <= 4000000; });
    else if (opts.budget === '40to70') cars = cars.filter(function (c) { return c.price >= 4000000 && c.price <= 7000000; });
    else if (opts.budget === '70to1cr') cars = cars.filter(function (c) { return c.price >= 7000000 && c.price <= 10000000; });
    else if (opts.budget === 'above1cr') cars = cars.filter(function (c) { return c.price > 10000000; });
  }

  if (opts.q) {
    var q = opts.q.toLowerCase();
    cars = cars.filter(function (c) { return (c.brand + ' ' + c.model + ' ' + c.type + ' ' + c.body).toLowerCase().includes(q); });
  }

  var trustBadges = [
    '140-Point Inspection',
    'Verified Ownership',
    'Fair Market Price',
    'Full Service History',
  ].map(function (b) {
    return '<div style="display:flex;align-items:center;gap:6px;">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="3" width="14" height="14" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>' +
      '<span style="font-size:13px;font-weight:600;color:var(--ink2)">' + b + '</span>' +
      '</div>';
  }).join('<span style="color:var(--border2);font-size:14px;user-select:none">|</span>');

  function makeChips(defs, type) {
    return defs.map(function (fd) {
      var isActive = false;
      if (type === 'filter' && opts.filter === fd[1]) isActive = true;
      if (type === 'budget' && opts.budget === fd[1]) isActive = true;
      if (!opts.filter && !opts.budget && !opts.q && fd[1] === 'all') isActive = true;
      var clickFn = fd[1] === 'all' ? 'AV.goTo(\'used\',{})' :
        (type === 'budget' ? 'AV.goTo(\'used\',{budget:\'' + fd[1] + '\'})' : 'AV.goTo(\'used\',{filter:\'' + fd[1] + '\'})');
      return '<span onclick="' + clickFn + '" style="cursor:pointer; display:block; padding:8px 12px; border-radius:var(--r8); font-size:13px; font-weight:600; transition:all var(--ease); ' +
        (isActive ? 'background:var(--green-ll); color:var(--green); border:1px solid rgba(14,94,38,.2);' : 'color:var(--ink3); background:var(--white); border:1px solid var(--border);') +
        '" onmouseover="this.style.background=\'var(--green-ll)\';this.style.color=\'var(--green)\';this.style.borderColor=\'rgba(14,94,38,.2)\'" onmouseout="if(!' + isActive + ') {this.style.background=\'var(--white)\';this.style.color=\'var(--ink3)\';this.style.borderColor=\'var(--border)\'}">' + fd[0] + '</span>';
    }).join('');
  }

  var sortDefs = [['All Cars', 'all'], ['Lowest KM Run', 'lowest_km'], ['Newest Year', 'year'], ['Lowest Price', 'price'], ['Certified', 'certified']];
  var bodyDefs = [['SUV', 'suv'], ['Crossover', 'crossover'], ['Sedan', 'sedan'], ['Hatchback', 'hatchback'], ['Coupe', 'coupe'], ['MPV', 'mpv'], ['Off-road', 'offroad'], ['Pickup', 'pickup'], ['Microcar', 'microcar'], ['Wagon', 'wagon'], ['Van', 'van']];
  var brandDefs = [['Toyota', 'toyota'], ['Honda', 'honda'], ['Hyundai', 'hyundai'], ['Kia', 'kia'], ['Suzuki', 'suzuki'], ['BMW', 'bmw'], ['Mahindra', 'mahindra']];
  var fuelDefs = [['Petrol', 'petrol'], ['Diesel', 'diesel'], ['Hybrid', 'hybrid'], ['Electric (EV)', 'electric']];
  var budgetDefs = [['Under Rs. 20L', 'under20'], ['Rs. 20–40L', '20to40'], ['Rs. 40–70L', '40to70'], ['Rs. 70L–1Cr', '70to1cr'], ['Rs. 1Cr+', 'above1cr']];

  var filterChipsOther = makeChips(sortDefs, 'filter');
  var filterChipsBody = makeChips(bodyDefs, 'filter');
  var filterChipsBrand = makeChips(brandDefs, 'filter');
  var filterChipsFuel = makeChips(fuelDefs, 'filter');
  var filterChipsBudget = makeChips(budgetDefs, 'budget');

  var fuelBg = { Diesel: 'var(--blue-l)', Petrol: 'var(--blue-l)', Hybrid: 'var(--teal-l)', Electric: 'var(--teal-l)' };
  var fuelTextColor = { Diesel: 'var(--blue)', Petrol: 'var(--blue)', Hybrid: 'var(--green)', Electric: 'var(--green)' };

  var carsHtml = cars.length ? cars.map(function (c) {
    var tags = (c.tags || []).map(function (t) {
      return '<span style="font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:99px;background:var(--green-l);color:var(--green)">' + t + '</span>';
    }).join('');
    return '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r14);overflow:hidden;cursor:pointer;transition:all var(--ease)" ' +
      'onclick="alert(\'Enquire: +977-9828364940\')" ' +
      'onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" ' +
      'onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
      '<div style="height:148px;overflow:hidden;background:var(--bg-2);position:relative">' +
      '<img src="' + c.img + '" style="width:100%;height:100%;object-fit:cover" loading="lazy">' +
      '<span style="position:absolute;top:8px;left:8px;font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:99px;background:' + (fuelBg[c.type] || 'var(--blue-l)') + ';color:' + (fuelTextColor[c.type] || 'var(--blue)') + '">' + c.type + '</span>' +
      '<span style="position:absolute;top:8px;right:8px;font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:99px;background:rgba(0,0,0,.55);color:#fff">' + c.owners + ' Owner' + (c.owners > 1 ? 's' : '') + '</span>' +
      '</div>' +
      '<div style="padding:14px">' +
      '<div style="font-size:14.5px;font-weight:800;color:var(--ink);margin-bottom:4px">' + c.brand + ' ' + c.model + '</div>' +
      '<div style="display:flex;gap:9px;font-size:11.5px;color:var(--ink-4);margin-bottom:8px">' +
      '<span>' + c.year + '</span><span>·</span><span>' + (typeof c.km === 'number' ? c.km.toLocaleString() : c.km) + ' km +</span><span>·</span><span>' + (c.color || '') + '</span>' +
      '</div>' +
      '<div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px">' + c.priceLabel + '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">' + tags + '</div>' +
      '<p style="font-size:12px;color:var(--ink-4);line-height:1.5;margin-bottom:12px">' + (c.description || '') + '</p>' +
      '<button onclick="event.stopPropagation();alert(\'+977-9828364940\')" style="width:100%;padding:9px;background:var(--green);color:#fff;border:none;border-radius:var(--r8);font-family:var(--font-body);font-size:13px;font-weight:700;cursor:pointer"><i data-lucide="phone"></i> Contact Seller</button>' +
      '</div></div>';
  }).join('') :
    '<div style="grid-column:1/-1;text-align:center;padding:60px;background:var(--bg);border-radius:var(--r20)">' +
    '<div style="font-size:18px;font-weight:700;color:var(--ink-3)">No cars found for this filter</div>' +
    '<button onclick="AV.goTo(\'used\',{})" class="btn btn-primary" style="margin-top:14px">Clear Filters</button>' +
    '</div>';

  var root = document.getElementById('app-root');
  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><span style="color:var(--ink-3)">Used Cars</span></div>' +
    '<h1 class="page-title" style="color:var(--ink)">Certified Used Cars</h1>' +
    '<div class="page-sub" style="color:var(--ink-3)">' + ALL_USED.length + ' verified pre-owned vehicles in Nepal</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:24px;padding-bottom:64px">' +

    '<div style="background:var(--white); border-radius:var(--r20); padding:32px; box-shadow:var(--sh1); margin-bottom:32px; border:1px solid var(--border)">' +
    '<h2 style="font-family:var(--font-display); font-size:24px; font-weight:700; color:var(--ink); margin-bottom:16px;">Autoviindu Inspection & Vehicle History</h2>' +
    '<p style="font-size:14px; line-height:1.6; color:var(--ink-3); margin-bottom:12px;">' +
    'Every used car listed on Autoviindu goes through our comprehensive in-house inspection process before it ever appears on our platform. Our trained inspectors conduct a detailed physical examination of each vehicle, evaluating it across six critical areas — Exterior, Interior, Engine Health, Suspension, Braking, and Electrical systems. Beyond the static inspection, every car also undergoes a real-world test drive assessing Driving Experience, Noise Level, and Comfort — all scored on a 1 to 5 scale.' +
    '</p>' +
    '<p style="font-size:14px; line-height:1.6; color:var(--ink-3); margin-bottom:12px;">' +
    'Once the full inspection is complete, all scores are combined into our exclusive Autoviindu Condition Score (ACS) — a final weighted rating from 1 to 5 — paired with a clear Condition Grade of A, B, C, or D. Each vehicle also carries one of three trust badges: Standard, Verified, or Premium Verified, so you know exactly what level of confidence to place in your purchase before stepping into a showroom. What you see on our listing is just the summary — behind every ACS score sits a thorough, detailed inspection report covering every aspect of the vehicle in depth.' +
    '</p>' +
    '<h3 style="font-size:18px; font-weight:700; color:var(--ink); margin-top:24px; margin-bottom:12px;">Vehicle History Report</h3>' +
    '<p style="font-size:14px; line-height:1.6; color:var(--ink-3); margin-bottom:12px;">' +
    'Knowing a used car\'s past is just as important as knowing its present condition. Autoviindu provides a Vehicle History Report covering accident records, number of previous owners, and ownership transfer history — giving you a transparent picture of the car before you commit.' +
    '</p>' +
    '<p style="font-size:14px; line-height:1.6; color:var(--ink-3); margin-bottom:12px;">' +
    'However, it is important to understand one reality of the Nepali market: service history can only be verified for vehicles that have been regularly serviced at authorized service centers in Nepal. In most cases, this applies to cars that are still within their manufacturer warranty period, as Nepali buyers typically service their vehicles at authorized centers during the warranty and then shift to independent garages once the warranty expires. For such vehicles, we are able to pull verified service records directly from authorized centers across Nepal, adding another layer of confidence to your purchase.' +
    '</p>' +
    '<p style="font-size:14px; line-height:1.6; color:var(--ink-3);">' +
    'For older vehicles or those outside their warranty period, our detailed physical inspection and ACS rating remain your strongest guide to understanding the true condition of the car.' +
    '</p>' +
    '</div>' +

    '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:16px;margin-bottom:32px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)">' + trustBadges + '</div>' +

    '<div style="display:flex; gap:24px; align-items:flex-start; flex-wrap:wrap; margin-bottom:14px;">' +

    '<div style="width:100%; max-width:240px; display:flex; flex-direction:column; gap:24px;">' +
    '<div style="position:relative">' +
    '<span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink-4)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
    '<input type="text" placeholder="Search brand, model…"' +
    ' style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--border);border-radius:var(--pill);font-size:13.5px;outline:none;font-family:var(--font-body);box-sizing:border-box"' +
    ' oninput="AV.goTo(\'used\',{q:this.value})">' +
    '</div>' +

    '<div>' +
    '<div style="font-size:12px; font-weight:700; color:var(--ink-3); margin-bottom:10px; text-transform:uppercase;">Sort & Quick Find</div>' +
    '<div style="display:flex; flex-direction:column; gap:6px;">' + filterChipsOther + '</div>' +
    '</div>' +

    '<div>' +
    '<div style="font-size:12px; font-weight:700; color:var(--ink-3); margin-bottom:10px; text-transform:uppercase;">By Brand</div>' +
    '<div style="display:flex; flex-direction:column; gap:6px;">' + filterChipsBrand + '</div>' +
    '</div>' +

    '<div>' +
    '<div style="font-size:12px; font-weight:700; color:var(--ink-3); margin-bottom:10px; text-transform:uppercase;">By Body Type</div>' +
    '<div style="display:flex; flex-direction:column; gap:6px;">' + filterChipsBody + '</div>' +
    '</div>' +

    '<div>' +
    '<div style="font-size:12px; font-weight:700; color:var(--ink-3); margin-bottom:10px; text-transform:uppercase;">By Fuel Type</div>' +
    '<div style="display:flex; flex-direction:column; gap:6px;">' + filterChipsFuel + '</div>' +
    '</div>' +

    '<div>' +
    '<div style="font-size:12px; font-weight:700; color:var(--ink-3); margin-bottom:10px; text-transform:uppercase;">By Budget</div>' +
    '<div style="display:flex; flex-direction:column; gap:6px;">' + filterChipsBudget + '</div>' +
    '</div>' +
    '</div>' +

    '<div style="flex:1; min-width:300px;">' +
    '<div class="cars-grid">' + carsHtml + '</div>' +
    '</div>' +

    '</div>' +

    '<div style="margin-top:32px;background:var(--green-ll);border:1.5px solid rgba(26,107,42,.14);border-radius:var(--r20);padding:28px">' +
    '<div style="font-size:10.5px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px">Sell Your Car</div>' +
    '<div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--ink);margin-bottom:6px">Get the Best Price for Your Car</div>' +
    '<p style="font-size:13px;color:var(--ink-3);margin-bottom:18px">List free. Reach thousands of buyers in Nepal.</p>' +
    '<button onclick="alert(\'List your car: +977-9828364940\')" class="btn btn-primary">List Your Car Free</button>' +
    '</div>' +

    '</div>';
};