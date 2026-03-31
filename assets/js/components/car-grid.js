/* ═══════════════════════════════════════════════
   AUTOVIINDU — CAR GRID COMPONENT
   Renders a responsive grid of car cards into
   a target element and keeps it live-filterable.
═══════════════════════════════════════════════ */
window.CarGrid = {
  /* Render cars array into element with id `targetId` */
  render: function (targetId, cars, opts) {
    opts = opts || {};
    var el = document.getElementById(targetId);
    if (!el) return;

    if (!cars || !cars.length) {
      el.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--bg);border-radius:var(--r20)">' +
        '<div style="font-size:40px;margin-bottom:12px">🔍</div>' +
        '<div style="font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px">' + (opts.emptyMsg || 'No cars found') + '</div>' +
        (opts.emptyAction || '<button onclick="AV.goTo(\'cars\')" class="btn btn-primary" style="margin-top:10px">Browse all cars</button>') +
      '</div>';
      return;
    }

    var cardFn = (window.CarCard && window.CarCard.html)
      ? function (c) { return window.CarCard.html(c, opts); }
      : function (c) { return window.AV && window.AV._carCardHTML ? window.AV._carCardHTML(c) : ''; };

    el.innerHTML = cars.map(cardFn).join('');

    if (window.AV && window.AV.updateCompareButtons) window.AV.updateCompareButtons();
  },

  /* Show a skeleton loading state */
  showSkeleton: function (targetId, count) {
    var el = document.getElementById(targetId);
    if (!el) return;
    var skeleton = '';
    for (var i = 0; i < (count || 6); i++) {
      skeleton += '<div style="background:var(--bg);border-radius:var(--r14);overflow:hidden;animation:pulse 1.5s ease infinite">' +
        '<div style="height:180px;background:var(--bg-2)"></div>' +
        '<div style="padding:14px">' +
          '<div style="height:12px;background:var(--bg-2);border-radius:4px;margin-bottom:8px;width:60%"></div>' +
          '<div style="height:18px;background:var(--bg-2);border-radius:4px;margin-bottom:8px"></div>' +
          '<div style="height:12px;background:var(--bg-2);border-radius:4px;width:80%"></div>' +
        '</div>' +
      '</div>';
    }
    el.innerHTML = skeleton;
  },

  /* Filter & re-render in-place */
  filter: function (targetId, query, baseList) {
    var cars = baseList || window.CARS_DB || [];
    if (query) {
      var q = query.toLowerCase();
      cars = cars.filter(function (c) {
        return (c.brand + ' ' + c.model + ' ' + c.type + ' ' + c.body + ' ' + c.year).toLowerCase().includes(q) ||
          c.variants.some(function (v) { return v.name.toLowerCase().includes(q); });
      });
    }
    this.render(targetId, cars);
    return cars.length;
  },
};