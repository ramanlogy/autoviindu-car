/* ═══════════════════════════════════════════════
   AUTOVIINDU — COMPARE TRAY COMPONENT
   Manages the sticky bottom compare bar.
   Works alongside AV.toggleCompare() in app.js.
═══════════════════════════════════════════════ */
window.CompareTray = {
  _plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  _cmp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',

  /* Render tray based on current compareList */
  update: function (compareList) {
    var tray = document.getElementById('compare-tray');
    var slots = document.getElementById('cmp-slots');
    if (!tray || !slots) return;

    if (!compareList || !compareList.length) {
      tray.classList.remove('visible');
      return;
    }

    tray.classList.add('visible');

    var html = compareList.map(function (slug) {
      var c = window.carBySlug ? window.carBySlug(slug) : null;
      if (!c) return '';
      return '<div class="cmp-slot">' +
        '<img src="' + c.images[0] + '" alt="' + c.brand + '">' +
        '<span>' + c.brand + ' ' + c.model + '</span>' +
        '<span class="rm" onclick="AV.toggleCompare(\'' + slug + '\')">✕</span>' +
      '</div>';
    }).join('');

    if (compareList.length < 3) {
      html += '<div class="cmp-add">' + this._plus + ' Add car</div>';
    }

    slots.innerHTML = html;
  },

  /* Build the compare tray HTML (inserted once in index.html) */
  getHTML: function () {
    return '<div id="compare-tray" class="compare-tray">' +
      '<div class="cmp-tray-inner">' +
        '<div class="cmp-tray-label">' + this._cmp + ' Compare</div>' +
        '<div id="cmp-slots" class="cmp-slots"></div>' +
        '<div class="cmp-tray-actions">' +
          '<button onclick="AV.goTo(\'compare\')" class="btn btn-primary btn-sm">Compare Now</button>' +
          '<button id="cmp-clear-btn" class="btn btn-ghost btn-sm" style="font-size:12px">Clear</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  },
};