/* ═══════════════════════════════════════════════
   AUTOVIINDU — RELATED CARS COMPONENT
   Shows similar cars based on body/type/price.
═══════════════════════════════════════════════ */
window.RelatedCars = {
  /* Get related cars array */
  getCars: function (slug, limit) {
    if (window.getRelatedCars) return window.getRelatedCars(slug, limit || 4);
    var car = window.carBySlug ? window.carBySlug(slug) : null;
    if (!car) return [];
    var base = car.variants[0].price;
    return (window.CARS_DB || [])
      .filter(function (c) {
        return c.slug !== slug && c.bodyType === car.bodyType &&
          c.variants[0].price >= base * 0.7 && c.variants[0].price <= base * 1.3;
      })
      .slice(0, limit || 4);
  },

  /* Full section HTML */
  section: function (slug, title) {
    var cars = this.getCars(slug, 4);
    if (!cars.length) return '';

    var cardFn = window.CarCard && window.CarCard.html
      ? function (c) { return window.CarCard.html(c); }
      : function (c) { return '<div onclick="AV.openDetail(\'' + c.slug + '\')" style="cursor:pointer;padding:12px;border:1px solid var(--border);border-radius:var(--r10)">' + c.brand + ' ' + c.model + ' · ' + c.variants[0].label + '</div>'; };

    return '<div class="related-cars-section">' +
      '<div style="font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--ink);margin-bottom:16px">' +
        (title || 'Similar Cars') +
      '</div>' +
      '<div class="cars-grid" style="grid-template-columns:repeat(2,1fr)">' +
        cars.map(cardFn).join('') +
      '</div>' +
    '</div>';
  },

  /* Horizontal scroll strip (mobile-friendly) */
  strip: function (slug) {
    var cars = this.getCars(slug, 6);
    if (!cars.length) return '';

    return '<div style="overflow-x:auto;padding-bottom:8px;scrollbar-width:none">' +
      '<div style="display:flex;gap:12px;width:max-content">' +
        cars.map(function (c) {
          return '<div onclick="AV.openDetail(\'' + c.slug + '\')" style="width:200px;flex-shrink:0;background:var(--white);border:1px solid var(--border);border-radius:var(--r12);overflow:hidden;cursor:pointer;transition:all .2s" ' +
            'onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
            '<img src="' + c.images[0] + '" style="width:100%;height:100px;object-fit:cover">' +
            '<div style="padding:10px">' +
              '<div style="font-size:13px;font-weight:800;color:var(--ink);margin-bottom:3px">' + c.brand + ' ' + c.model + '</div>' +
              '<div style="font-size:12px;color:var(--green);font-weight:700">' + c.variants[0].label + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  },
};