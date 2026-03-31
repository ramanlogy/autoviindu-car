/* ═══════════════════════════════════════════════
   AUTOVIINDU — CAR CARD COMPONENT v2
   Photo-style editorial cards with full-bleed images
═══════════════════════════════════════════════ */
window.CarCard = {
  _star: '<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" style="color:#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  _heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  _check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>',

  html: function (car, opts) {
    opts = opts || {};
    var IC = window.AV_ICONS || {};
    var heart = IC.heart || this._heart;
    var star  = IC.star  || this._star;
    var check = IC.check || this._check;

    var bcClass = { ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' };
    var bcLabel = { ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' };

    var inCmp  = window.AV && window.AV.compareList ? window.AV.compareList.includes(car.slug) : false;
    var inWish = window.AV && window.AV.wishlistIncludes ? window.AV.wishlistIncludes(car.slug) : false;

    var specPill1 = car.type;
    var specPill2 = car.specs['Fuel Efficiency'] || car.specs['Range (WLTP)'] || car.specs['Range'] || '';

    return (
      '<div class="car-card" onclick="AV.openDetail(\'' + car.slug + '\')">' +

        /* FULL-BLEED IMAGE AREA */
        '<div class="car-card-img">' +
          '<img src="' + car.images[0] + '" alt="' + car.brand + ' ' + car.model + '" loading="lazy">' +

          /* Brand + model name overlay (bottom) */
          '<div class="card-photo-content">' +
            '<div class="card-photo-brand">' + car.brand + ' &middot; ' + car.year + '</div>' +
            '<div class="card-photo-name">' + car.model + '</div>' +
          '</div>' +

          /* Badge */
          '<div class="card-badges">' +
            (car.badge ? '<span class="badge ' + (bcClass[car.badge] || 'badge-pop') + '">' + (bcLabel[car.badge] || car.badge) + '</span>' : '') +
          '</div>' +

          /* Wishlist */
          '<button class="card-wishlist' + (inWish ? ' wishlisted' : '') + '" onclick="event.stopPropagation();AV.toggleWish(\'' + car.slug + '\',this)">' + heart + '</button>' +

          /* Expert score */
          '<div class="card-score">' + star + ' ' + car.expertScore + '/10</div>' +

          /* Compare */
          '<button class="card-compare-btn' + (inCmp ? ' added' : '') + '" data-cmp-slug="' + car.slug + '" onclick="event.stopPropagation();AV.toggleCompare(\'' + car.slug + '\')">' +
            (inCmp ? '&#10003; Added' : '+ Compare') +
          '</button>' +

        '</div>' +

        /* CARD BODY */
        '<div class="car-card-body">' +

          '<div class="car-card-meta">' +
            '<span class="rating-badge">' + star + ' ' + Number(car.rating).toFixed(1) + '</span>' +
            '<span style="font-size:11px;color:var(--ink-5)">' + car.reviews + ' reviews</span>' +
          '</div>' +

          (specPill1 || specPill2 ?
            '<div class="car-card-specs">' +
              (specPill1 ? '<span class="spec-pill">' + specPill1 + '</span>' : '') +
              (specPill2 ? '<span class="spec-pill">' + specPill2 + '</span>' : '') +
            '</div>' : ''
          ) +

          '<div class="car-card-colors">' +
            car.colors.slice(0, 5).map(function (c) {
              return '<span class="color-dot" style="background:' + c.hex + '" title="' + c.name + '"></span>';
            }).join('') +
            '<span class="colors-count">' + car.colors.length + ' colours &middot; ' + car.variants.length + ' variants</span>' +
          '</div>' +

          '<div class="car-card-price-row">' +
            '<div class="car-card-price-from">Starting from</div>' +
            '<div class="car-card-price">' + car.variants[0].label + '</div>' +
            '<div class="car-card-emi">EMI from <strong>Rs. ' + car.baseEMI.toLocaleString() + '/mo</strong></div>' +
            '<div class="car-card-actions">' +
              '<button class="cc-btn-outline" onclick="event.stopPropagation();alert(\'Call: +977-9701076240\')">Get Quote</button>' +
              '<button class="cc-btn-fill" onclick="event.stopPropagation();AV.openDetail(\'' + car.slug + '\')">View Details</button>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>'
    );
  },

  compact: function (car) {
    return '<div class="car-card-compact" onclick="AV.openDetail(\'' + car.slug + '\')" style="display:flex;gap:12px;padding:12px;border:1.5px solid var(--border);border-radius:14px;cursor:pointer;transition:all .2s ease" onmouseenter="this.style.background=\'var(--bg)\';this.style.borderColor=\'var(--green)\'" onmouseleave="this.style.background=\'var(--white)\';this.style.borderColor=\'var(--border)\'">' +
      '<img src="' + car.images[0] + '" style="width:72px;height:50px;object-fit:cover;border-radius:10px;flex-shrink:0">' +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:13px;font-weight:800;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + car.brand + ' ' + car.model + '</div>' +
        '<div style="font-size:11px;color:var(--ink-4);margin-top:1px">' + car.type + ' &middot; ' + car.body + '</div>' +
        '<div style="font-size:14px;font-weight:800;color:var(--green);margin-top:4px">' + car.variants[0].label + '</div>' +
      '</div>' +
    '</div>';
  },
};