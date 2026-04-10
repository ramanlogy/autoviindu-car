/* ═══════════════════════════════════════════════
   AUTOVIINDU — BREADCRUMB COMPONENT
   window.Breadcrumb.render(items) → HTML string
   items = [{ label, page, opts }] (last item = current, no link)
═══════════════════════════════════════════════ */
window.Breadcrumb = {
  chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><polyline points="9 18 15 12 9 6"/></svg>',

  render: function (items) {
    var self = this;
    return items.map(function (item, i) {
      var isLast = i === items.length - 1;
      var sep = i > 0 ? '<span class="sep">' + self.chevR + '</span>' : '';
      if (isLast) {
        return sep + '<span style="color:rgba(255,255,255,.6)">' + item.label + '</span>';
      }
      var click = item.page
        ? 'AV.goTo(\'' + item.page + '\'' + (item.opts ? ',' + JSON.stringify(item.opts) : '') + ')'
        : '';
      return sep + '<a' + (click ? ' onclick="' + click + '"' : '') + '>' + item.label + '</a>';
    }).join('');
  },

  home: function (label) {
    return this.render([{ label: 'Home', page: 'home' }, { label: label }]);
  },

  carDetail: function (brand, model) {
    return this.render([
      { label: 'Home', page: 'home' },
      { label: 'Cars', page: 'cars' },
      { label: brand + ' ' + model },
    ]);
  },

  brandPage: function (brandName) {
    return this.render([
      { label: 'Home', page: 'home' },
      { label: 'Brands' },
      { label: brandName },
    ]);
  },
};