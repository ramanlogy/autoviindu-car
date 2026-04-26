/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — COMPARE PAGE
   window.renderCompare() → renders #compare
═══════════════════════════════════════════════════════ */
window.renderCompare = function () {
  document.title = 'Compare Cars Side-by-Side — AutoViindu';
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('compare');

  var db = window.CARS_DB || [];
  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';
  var compareList = window.AV && window.AV.getCompareList ? window.AV.getCompareList() : [];
  var cols = compareList.slice(0, 3);

  function carBySlug(s) { return db.find(function (c) { return c.slug === s; }); }

  function getVal(car, spec) {
    if (spec === 'price') return car.variants[0].label;
    if (spec === 'rating') return car.rating.toFixed(1) + '★';
    if (spec === 'expertScore') return (car.expertScore || '—') + '/10';
    var keys = spec.split('||');
    for (var i = 0; i < keys.length; i++) {
      var v = car.specs && car.specs[keys[i].trim()];
      if (v) return v;
    }
    return '—';
  }

  var specRows = [
    { label: 'Base Price',      key: 'price' },
    { label: 'Rating',         key: 'rating' },
    { label: 'Expert Score',   key: 'expertScore' },
    { label: 'Power',          key: 'Power||Motor Power||Combined Power' },
    { label: 'Torque',         key: 'Torque' },
    { label: 'Fuel / Range',   key: 'Fuel Efficiency||Range (WLTP)' },
    { label: '0–100 km/h',     key: '0–100 km/h' },
    { label: 'Boot Space',     key: 'Boot Space' },
    { label: 'Ground Clearance',key: 'Ground Clearance' },
    { label: 'Seating',        key: 'Seating' },
    { label: 'Transmission',   key: 'Transmission' },
    { label: 'Drive',          key: 'Drive' },
  ];

  function renderTable(slugs) {
    var carData = slugs.map(carBySlug).filter(Boolean);
    var thead = '<tr>' +
      '<th style="background:rgba(13,17,23,.95);padding:14px;color:rgba(255,255,255,.45);font-size:11px;font-weight:700;text-align:left;border:none">Specification</th>' +
      carData.map(function (c) {
        return '<th style="background:var(--ink-2);padding:14px;text-align:center;vertical-align:top;border:none">' +
          '<img src="' + c.images[0] + '" style="width:100%;height:80px;object-fit:cover;border-radius:var(--r10);margin-bottom:8px;display:block">' +
          '<div style="font-size:11px;color:rgba(255,255,255,.4);font-weight:600">' + c.brand + '</div>' +
          '<div style="font-size:15px;font-weight:800;color:#fff">' + c.model + '</div>' +
          '<div style="font-size:13px;font-weight:800;color:var(--gold-text);margin-top:5px">' + c.variants[0].label + '</div>' +
          '<div style="display:flex;gap:6px;justify-content:center;margin-top:9px">' +
          '<button onclick="AV.openDetail(\'' + c.slug + '\')" style="padding:5px 10px;background:rgba(255,255,255,.1);color:rgba(255,255,255,.8);border:none;border-radius:var(--r6);font-family:var(--font-body);font-size:10.5px;font-weight:700;cursor:pointer">Details</button>' +
          '<button onclick="AV.toggleCompare(\'' + c.slug + '\')" style="padding:5px 10px;background:rgba(220,38,38,.2);color:#FCA5A5;border:none;border-radius:var(--r6);font-family:var(--font-body);font-size:10.5px;font-weight:700;cursor:pointer">Remove</button>' +
          '</div></th>';
      }).join('') +
      '</tr>';

    var tbody = specRows.map(function (row, i) {
      var vals = carData.map(function (c) { return getVal(c, row.key); });
      return '<tr style="' + (i % 2 === 0 ? '' : 'background:var(--bg)') + '">' +
        '<td style="padding:10px 14px;font-weight:700;color:var(--ink-3);font-size:12.5px;border-bottom:1px solid var(--border)">' + row.label + '</td>' +
        vals.map(function (v) { return '<td style="padding:10px 14px;text-align:center;font-size:13px;color:var(--ink-2);border-bottom:1px solid var(--border)">' + v + '</td>'; }).join('') +
        '</tr>';
    }).join('');

    return '<div style="overflow-x:auto;border-radius:var(--r20);box-shadow:var(--shadow-md);margin-top:32px">' +
      '<table style="width:100%;border-collapse:collapse;min-width:380px">' +
      '<thead>' + thead + '</thead><tbody>' + tbody + '</tbody>' +
      '</table></div>';
  }

  /* Car picker grid */
  var pickerGrid = db.map(function (car) {
    var inCmp = compareList.includes(car.slug);
    return '<div onclick="AV.toggleCompare(\'' + car.slug + '\')" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid ' + (inCmp ? 'var(--green)' : 'var(--border)') + ';background:' + (inCmp ? 'var(--green-ll)' : 'var(--white)') + ';border-radius:var(--r10);cursor:pointer;transition:all var(--ease)">' +
      '<img src="' + car.images[0] + '" style="width:46px;height:30px;object-fit:cover;border-radius:var(--r6);flex-shrink:0">' +
      '<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:800;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + car.brand + ' ' + car.model + '</div><div style="font-size:11px;color:var(--ink-4)">' + car.variants[0].label + '</div></div>' +
      '<span style="font-size:16px;color:' + (inCmp ? 'var(--green)' : 'var(--ink-5)') + '">' + (inCmp ? '✓' : '+') + '</span>' +
      '</div>';
  }).join('');

  var root = document.getElementById('app-root');
  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><span style="color:rgba(255,255,255,.7)">Compare Cars</span></div>' +
    '<h1 class="page-title">Compare Cars Side-by-Side</h1>' +
    '<div class="page-sub">' + cols.length + ' of 3 cars selected · Add cars below to compare</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:28px;padding-bottom:64px">' +

    '<div style="margin-bottom:28px">' +
    '<div style="font-size:13px;font-weight:800;color:var(--ink);margin-bottom:12px">Pick cars to compare (up to 3):</div>' +
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px" id="compare-picker">' + pickerGrid + '</div>' +
    '</div>' +

    (cols.length >= 2 ? renderTable(cols) :
      '<div style="text-align:center;padding:60px 20px;background:var(--bg);border:2px dashed var(--border-2);border-radius:var(--r20)">' +
      '<div style="font-size:40px;margin-bottom:12px">🚗</div>' +
      '<div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px">Select 2 or more cars above to compare</div>' +
      '<div style="color:var(--ink-4)">Click the + buttons to add cars to your comparison</div>' +
      '</div>') +

    '</div>';

  if (window.AV) window.AV.updateCompareTray && window.AV.updateCompareTray();
};