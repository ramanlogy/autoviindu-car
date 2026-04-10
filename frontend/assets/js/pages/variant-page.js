/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — VARIANT DETAIL PAGE
   window.renderVariantPage(carSlug, variantSlug)
   Renders a deep-link variant spec page.
═══════════════════════════════════════════════════════ */
window.renderVariantPage = function (carSlug, variantSlug) {
  'use strict';

  var carBySlug = function (slug) { return (window.CARS_DB || []).find(function (c) { return c.slug === slug; }); };
  var car = carBySlug(carSlug);
  if (!car) { if (window.AV) window.AV.goTo('cars'); return; }

  var varIdx = 0;
  if (variantSlug) {
    var found = car.variants.findIndex(function (v) { return v.slug === variantSlug; });
    if (found > -1) varIdx = found;
  }
  var vr = car.variants[varIdx];

  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';
  var Rs = function (n) { return n >= 100000 ? 'Rs. ' + (n / 100000).toFixed(2) + 'L' : 'Rs. ' + n.toLocaleString(); };

  document.title = car.brand + ' ' + car.model + ' ' + vr.name + ' ' + car.year + ' — AutoViindu';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('');

  var root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
      '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span>' +
        '<a onclick="AV.goTo(\'cars\')">Cars</a><span class="sep">' + chevR + '</span>' +
        '<a onclick="AV.openDetail(\'' + car.slug + '\')">' + car.brand + ' ' + car.model + '</a><span class="sep">' + chevR + '</span>' +
        '<span style="color:rgba(255,255,255,.7)">' + vr.name + ' Variant</span></div>' +
      '<h1 class="page-title">' + car.brand + ' ' + car.model + ' <span style="color:var(--gold-text)">' + vr.name + '</span></h1>' +
      '<div class="page-sub">' + car.year + ' &middot; ' + car.type + ' &middot; ' + (vr.transmission||'Auto') + '</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:28px;padding-bottom:72px">' +

      '<div style="display:grid;grid-template-columns:1fr;gap:24px">' +

        /* Top: image + price + CTA */
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">' +
          '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);overflow:hidden">' +
            '<img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" style="width:100%;height:220px;object-fit:cover">' +
          '</div>' +
          '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:22px">' +
            '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-4);margin-bottom:4px">' + car.brand + ' ' + car.model + '</div>' +
            '<div style="font-size:22px;font-weight:900;color:var(--ink);margin-bottom:4px">' + vr.name + ' Variant</div>' +
            '<div style="font-size:30px;font-weight:900;color:var(--green);margin-bottom:4px">' + vr.label + '</div>' +
            '<div style="font-size:12px;color:var(--ink-4);margin-bottom:20px">Ex-Showroom &middot; Nepal</div>' +
            '<div style="display:flex;flex-direction:column;gap:9px">' +
              '<button class="btn btn-primary btn-full" onclick="alert(\'Best price: +977-9701076240\')">Get Best Price</button>' +
              '<button class="btn btn-gold btn-full" onclick="alert(\'Book Test Drive: +977-9701076240\')">Book Test Drive</button>' +
              '<button class="btn btn-ghost btn-full" onclick="AV.openDetail(\'' + car.slug + '\')">&#8592; View All ' + car.variants.length + ' Variants</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* Variant nav */
        '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:18px">' +
          '<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--ink-4);margin-bottom:12px">Compare with Other Variants</div>' +
          '<div class="variant-tabs-row">' +
            car.variants.map(function(v,i){
              return '<div class="variant-tab ' + (i===varIdx?'active':'') + '" onclick="window.renderVariantPage(\'' + car.slug + '\',\'' + v.slug + '\');history.pushState({},'','#variant/' + car.slug + '/' + v.slug + '\')">' +
                (v.popular ? '<div class="popular-tag">Best Value</div>' : '') +
                '<div class="vt-name">' + v.name + '</div>' +
                '<div class="vt-price">' + v.label + '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +

        /* Features & Specs */
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +
          '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:20px">' +
            '<div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:14px">Key Features</div>' +
            '<div style="display:flex;flex-direction:column;gap:8px">' +
              (vr.features||[]).map(function(f){
                return '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-2)">' +
                  '<span style="color:var(--green);font-weight:800;flex-shrink:0">✓</span>' + f + '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:20px">' +
            '<div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:14px">Key Specifications</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
              Object.entries(vr.specs||{}).map(function(e){
                return '<div style="padding:10px;background:var(--bg);border-radius:var(--r8);text-align:center">' +
                  '<div style="font-size:14px;font-weight:800;color:var(--ink)">' + e[1] + '</div>' +
                  '<div style="font-size:10.5px;color:var(--ink-4);margin-top:2px">' + e[0] + '</div>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +

        /* Full car specs table */
        '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:20px">' +
          '<div style="font-size:14px;font-weight:800;color:var(--ink);margin-bottom:14px">Full Specifications — ' + car.brand + ' ' + car.model + ' ' + vr.name + '</div>' +
          '<table class="spec-table">' +
            Object.entries(car.specs||{}).map(function(e){ return '<tr><td>' + e[0] + '</td><td>' + e[1] + '</td></tr>'; }).join('') +
          '</table>' +
        '</div>' +

      '</div>' +
    '</div>';
};