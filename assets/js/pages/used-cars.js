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
    { id:'u1', brand:'Toyota', model:'Fortuner', year:2021, km:38450, type:'Diesel', body:'SUV', price:6800000, priceLabel:'Rs. 68L', transmission:'Automatic', owners:1, color:'Pearl White', location:'Kathmandu', img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop', tags:['1 Owner','Full Service History','Under Warranty'], features:['Leather Seats','Sunroof','4WD','7 Seats','Reverse Camera'], description:'Single owner Fortuner in pristine condition. Full Toyota service history. All original parts. No accidents.' },
    { id:'u2', brand:'Honda', model:'Civic', year:2020, km:44200, type:'Petrol', body:'Sedan', price:2800000, priceLabel:'Rs. 28L', transmission:'CVT', owners:1, color:'Lunar Silver', location:'Lalitpur', img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop', tags:['Well Maintained','Low Insurance'], features:['Apple CarPlay','Honda Sensing','LED Headlights','Sunroof'], description:'Well-maintained Civic 10th gen. Full service at Honda dealer. Non-smoker car.' },
    { id:'u3', brand:'Hyundai', model:'Tucson', year:2022, km:22100, type:'Petrol', body:'SUV', price:4200000, priceLabel:'Rs. 42L', transmission:'Automatic', owners:1, color:'Amazon Gray', location:'Kathmandu', img:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=300&fit=crop', tags:['Low KM','1 Owner','Like New'], features:['Panoramic Sunroof','Blind Spot Monitor','BOSE Audio','360° Camera'], description:'Barely used Tucson NX4 2022. Only 22,100 km. All accessories intact.' },
    { id:'u4', brand:'Toyota', model:'Prius', year:2020, km:41300, type:'Hybrid', body:'Sedan', price:3000000, priceLabel:'Rs. 30L', transmission:'Automatic', owners:2, color:'Black', location:'Bhaktapur', img:'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=500&h=300&fit=crop', tags:['Fuel Saver','Hybrid','Toyota Certified'], features:['Hybrid Powertrain','Toyota Safety Sense','Wireless Charging','JBL Audio'], description:'Reliable Prius hybrid. Perfect for Kathmandu traffic.' },
    { id:'u5', brand:'Kia', model:'Sportage', year:2022, km:18200, type:'Diesel', body:'SUV', price:3600000, priceLabel:'Rs. 36L', transmission:'Automatic', owners:1, color:'Snow White Pearl', location:'Kathmandu', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop', tags:['Low KM','Diesel','Single Owner'], features:['Kia Drive Wise','Panoramic Sunroof','Ventilated Seats','360° Camera'], description:'Near-new Sportage diesel with low mileage. Selling due to upgrade.' },
    { id:'u6', brand:'BMW', model:'X3', year:2021, km:29400, type:'Petrol', body:'SUV', price:7200000, priceLabel:'Rs. 72L', transmission:'Automatic', owners:1, color:'Alpine White', location:'Kathmandu', img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop', tags:['Premium','Loaded','BMW Certified'], features:['M Sport Package','Panoramic Sunroof','Harman Kardon','Head-Up Display'], description:'Immaculate BMW X3 M Sport. All service at authorized BMW Nepal center.' },
    { id:'u7', brand:'Suzuki', model:'Swift', year:2021, km:51000, type:'Petrol', body:'Hatchback', price:1250000, priceLabel:'Rs. 12.5L', transmission:'MT', owners:2, color:'Magma Gray', location:'Lalitpur', img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop', tags:['Fuel Efficient','City Car'], features:['Infotainment System','Rear Camera','Push Start','ABS+EBD'], description:'Practical city hatchback. Very fuel efficient. Good for Kathmandu commute.' },
    { id:'u8', brand:'Mahindra', model:'XUV700', year:2022, km:24500, type:'Diesel', body:'SUV', price:3900000, priceLabel:'Rs. 39L', transmission:'Automatic', owners:1, color:'Dazzling Silver', location:'Kathmandu', img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop', tags:['7 Seater','ADAS','Low KM'], features:['AdrenoX System','ADAS Level 2','Panoramic Sunroof','6 Airbags'], description:'Feature-packed XUV700 AX7L. All original parts. Selling due to relocation.' },
  ];

  var cars = ALL_USED.slice();

  if (opts.filter === 'suv') cars = cars.filter(function (c) { return c.body === 'SUV'; });
  else if (opts.filter === 'sedan') cars = cars.filter(function (c) { return c.body === 'Sedan'; });
  else if (opts.filter === 'hatchback') cars = cars.filter(function (c) { return c.body === 'Hatchback'; });
  else if (opts.filter === 'hybrid') cars = cars.filter(function (c) { return c.type === 'Hybrid'; });
  else if (opts.filter === 'diesel') cars = cars.filter(function (c) { return c.type === 'Diesel'; });

  if (opts.budget === 'under20') cars = cars.filter(function (c) { return c.price < 2000000; });
  else if (opts.budget === '20to40') cars = cars.filter(function (c) { return c.price >= 2000000 && c.price <= 4000000; });
  else if (opts.budget === 'above40') cars = cars.filter(function (c) { return c.price > 4000000; });

  if (opts.q) {
    var q = opts.q.toLowerCase();
    cars = cars.filter(function (c) { return (c.brand + ' ' + c.model + ' ' + c.type + ' ' + c.body).toLowerCase().includes(q); });
  }

  var trustBadges = [
    ['#1A6B2A','#EEF7F0','140-Point Inspection'],
    ['#1A4DB8','#EEF3FC','Verified Ownership'],
    ['#B8900E','#FDF6E0','Fair Market Price'],
    ['#C8271E','#FFF0EF','Full Service History'],
  ].map(function (b) {
    return '<div style="display:flex;align-items:center;gap:8px;padding:11px 13px;background:' + b[1] + ';border:1px solid ' + b[0] + '22;border-radius:var(--r10)">' +
      '<div style="width:7px;height:7px;background:' + b[0] + ';border-radius:50%;flex-shrink:0"></div>' +
      '<span style="font-size:12px;font-weight:700;color:var(--ink-2)">' + b[2] + '</span>' +
      '</div>';
  }).join('');

  var filterDefs = [
    ['All', '',''],['SUV','suv','filter'],['Sedan','sedan','filter'],
    ['Hatchback','hatchback','filter'],['Hybrid','hybrid','filter'],['Diesel','diesel','filter'],
    ['Under Rs. 20L','under20','budget'],['Rs. 20–40L','20to40','budget'],['Rs. 40L+','above40','budget'],
  ];
  var filterChips = filterDefs.map(function (fd) {
    var isActive = (!fd[1] && !opts.filter && !opts.budget) ||
      (fd[2] === 'filter' && opts.filter === fd[1]) ||
      (fd[2] === 'budget' && opts.budget === fd[1]);
    var clickFn = !fd[1] ? 'AV.goTo(\'used\',{})' :
      fd[2] === 'budget' ? 'AV.goTo(\'used\',{budget:\'' + fd[1] + '\'})' :
        'AV.goTo(\'used\',{filter:\'' + fd[1] + '\'})';
    return '<span class="chip ' + (isActive ? 'active' : '') + '" onclick="' + clickFn + '">' + fd[0] + '</span>';
  }).join('');

  var typeColor = { Diesel:'rgba(29,78,216,.9)', Hybrid:'rgba(107,53,199,.9)', Petrol:'rgba(26,107,42,.9)', Electric:'rgba(14,127,115,.9)' };

  var carsHtml = cars.length ? cars.map(function (c) {
    var tags = (c.tags || []).map(function (t) {
      return '<span style="font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:99px;background:var(--green-l);color:var(--green)">' + t + '</span>';
    }).join('');
    return '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r14);overflow:hidden;cursor:pointer;transition:all var(--ease)" ' +
      'onclick="alert(\'Enquire: +977-9701076240\')" ' +
      'onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" ' +
      'onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
      '<div style="height:148px;overflow:hidden;background:var(--bg-2);position:relative">' +
      '<img src="' + c.img + '" style="width:100%;height:100%;object-fit:cover" loading="lazy">' +
      '<span style="position:absolute;top:8px;left:8px;font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:99px;background:' + (typeColor[c.type] || 'rgba(26,107,42,.9)') + ';color:#fff">' + c.type + '</span>' +
      '<span style="position:absolute;top:8px;right:8px;font-size:9.5px;font-weight:800;padding:3px 8px;border-radius:99px;background:rgba(0,0,0,.55);color:#fff">' + c.owners + ' Owner' + (c.owners > 1 ? 's' : '') + '</span>' +
      '</div>' +
      '<div style="padding:14px">' +
      '<div style="font-size:14.5px;font-weight:800;color:var(--ink);margin-bottom:4px">' + c.brand + ' ' + c.model + '</div>' +
      '<div style="display:flex;gap:9px;font-size:11.5px;color:var(--ink-4);margin-bottom:8px">' +
      '<span>' + c.year + '</span><span>·</span><span>' + (typeof c.km === 'number' ? c.km.toLocaleString() : c.km) + ' km</span><span>·</span><span>' + (c.color || '') + '</span>' +
      '</div>' +
      '<div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px">' + c.priceLabel + '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">' + tags + '</div>' +
      '<p style="font-size:12px;color:var(--ink-4);line-height:1.5;margin-bottom:12px">' + (c.description || '') + '</p>' +
      '<button onclick="event.stopPropagation();alert(\'+977-9701076240\')" style="width:100%;padding:9px;background:var(--green);color:#fff;border:none;border-radius:var(--r8);font-family:var(--font-body);font-size:13px;font-weight:700;cursor:pointer">📞 Contact Seller</button>' +
      '</div></div>';
  }).join('') :
    '<div style="grid-column:1/-1;text-align:center;padding:60px;background:var(--bg);border-radius:var(--r20)">' +
    '<div style="font-size:18px;font-weight:700;color:var(--ink-3)">No cars found for this filter</div>' +
    '<button onclick="AV.goTo(\'used\',{})" class="btn btn-primary" style="margin-top:14px">Clear Filters</button>' +
    '</div>';

  var root = document.getElementById('app-root');
  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><span style="color:rgba(255,255,255,.7)">Used Cars</span></div>' +
    '<h1 class="page-title">Certified Used Cars</h1>' +
    '<div class="page-sub">' + ALL_USED.length + ' verified pre-owned vehicles in Nepal</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:24px;padding-bottom:64px">' +

    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:24px">' + trustBadges + '</div>' +

    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:14px">' +
    '<div style="flex:1;min-width:200px;position:relative">' +
    '<span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink-4)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>' +
    '<input type="text" placeholder="Search brand, model…"' +
    ' style="width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--border);border-radius:var(--pill);font-size:13.5px;outline:none;font-family:var(--font-body);box-sizing:border-box"' +
    ' oninput="AV.goTo(\'used\',{q:this.value})">' +
    '</div></div>' +

    '<div class="filter-chips" style="margin-bottom:20px">' + filterChips + '</div>' +

    '<div class="cars-grid">' + carsHtml + '</div>' +

    '<div style="margin-top:32px;background:var(--green-ll);border:1.5px solid rgba(26,107,42,.14);border-radius:var(--r20);padding:28px">' +
    '<div style="font-size:10.5px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px">Sell Your Car</div>' +
    '<div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--ink);margin-bottom:6px">Get the Best Price for Your Car</div>' +
    '<p style="font-size:13px;color:var(--ink-3);margin-bottom:18px">List free. Reach thousands of buyers in Nepal.</p>' +
    '<button onclick="alert(\'List your car: +977-9701076240\')" class="btn btn-primary">List Your Car Free</button>' +
    '</div>' +

    '</div>';
};