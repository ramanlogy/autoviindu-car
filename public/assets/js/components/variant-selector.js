/* ═══════════════════════════════════════════════
   AUTOVIINDU — VARIANT SELECTOR COMPONENT
   Renders variant tabs and handles switching.
═══════════════════════════════════════════════ */
window.VariantSelector = {
  _check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>',

  /* Render tab-style variant picker */
  tabs: function (car, activeIdx) {
    activeIdx = activeIdx || 0;
    var self = this;
    return '<div class="variant-tabs-row">' +
      car.variants.map(function (v, i) {
        return '<div class="variant-tab' + (i === activeIdx ? ' active' : '') + '" onclick="AV.selectVariant(\'' + car.slug + '\',' + i + ')">' +
          (v.popular ? '<div class="popular-tag">Best Value</div>' : '') +
          '<div class="vt-name">' + v.name + '</div>' +
          '<div class="vt-price">' + v.label + '</div>' +
          '<div class="vt-features">' +
            v.features.slice(0, 3).map(function (f) {
              return '<div class="vt-feature"><span class="tick">' + self._check + '</span>' + f + '</div>';
            }).join('') +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  },

  /* Render dropdown variant picker (sidebar) */
  dropdown: function (car, activeIdx) {
    activeIdx = activeIdx || 0;
    return '<select id="variant-dropdown" onchange="AV.selectVariant(\'' + car.slug + '\',+this.value)" ' +
      'style="width:100%;padding:11px 36px 11px 12px;border:1.5px solid var(--border);border-radius:var(--r10);' +
      'font-family:var(--font-body);font-size:13.5px;font-weight:700;color:var(--ink);background:var(--white);' +
      'appearance:none;outline:none;cursor:pointer">' +
      car.variants.map(function (v, i) {
        return '<option value="' + i + '"' + (i === activeIdx ? ' selected' : '') + '>' +
          v.name + ' — ' + v.label + (v.popular ? ' (Best Value)' : '') +
        '</option>';
      }).join('') +
    '</select>';
  },

  /* Render variant specs grid */
  specsGrid: function (vr) {
    if (!vr || !vr.specs) return '';
    return '<div class="variant-detail-panel" id="variant-detail-panel">' +
      Object.entries(vr.specs).map(function (entry) {
        return '<div class="vdp-item"><div class="vdp-value">' + entry[1] + '</div><div class="vdp-label">' + entry[0] + '</div></div>';
      }).join('') +
    '</div>';
  },

  /* Render price-compare-variant list (compact) */
  priceList: function (car) {
    return '<div class="pcv-list">' +
      car.variants.map(function (v, i) {
        return '<div class="pcv-item' + (i === 0 ? ' active' : '') + '" onclick="AV.selectVariant(\'' + car.slug + '\',' + i + ')">' +
          '<div class="pcv-name">' + v.name + (v.popular ? ' <span class="popular-tag" style="font-size:9px;padding:1px 6px">Best Value</span>' : '') + '</div>' +
          '<div class="pcv-price">' + v.label + '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  },
};