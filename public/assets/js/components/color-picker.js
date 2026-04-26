/* ═══════════════════════════════════════════════
   AUTOVIINDU — COLOR PICKER COMPONENT
   Renders color swatches and manages active state.
═══════════════════════════════════════════════ */
window.ColorPicker = {
  /* Render color swatches HTML */
  html: function (colors, activeIndex) {
    activeIndex = activeIndex || 0;
    return colors.map(function (c, i) {
      return '<span class="color-swatch' + (i === activeIndex ? ' active' : '') + '" ' +
        'style="background:' + c.hex + ';width:26px;height:26px;border-radius:50%;cursor:pointer;display:inline-block;border:2px solid transparent;transition:all .2s;flex-shrink:0" ' +
        'title="' + c.name + '" ' +
        'onclick="ColorPicker.select(this,\'' + c.name.replace(/'/g, "\\'") + '\')">' +
      '</span>';
    }).join('');
  },

  /* Handle swatch click */
  select: function (el, name) {
    var container = el.parentElement;
    if (container) {
      container.querySelectorAll('.color-swatch').forEach(function (s) {
        s.classList.remove('active');
        s.style.borderColor = 'transparent';
        s.style.transform = '';
      });
    }
    el.classList.add('active');
    el.style.borderColor = 'var(--ink)';
    el.style.transform = 'scale(1.2)';

    /* Update name display */
    var display = document.getElementById('color-name-display');
    if (display) display.textContent = name;

    /* Notify AV if it has a handler */
    if (window.AV && window.AV.selectColor) window.AV.selectColor(el, name);
  },

  /* Render full color section with label */
  section: function (colors, activeIndex) {
    var first = colors[activeIndex || 0];
    return '<div>' +
      '<div style="font-size:11px;font-weight:700;color:var(--ink-4);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Available Colors</div>' +
      '<div class="color-selector" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
        this.html(colors, activeIndex) +
      '</div>' +
      '<div class="color-name-display" id="color-name-display" style="font-size:12.5px;color:var(--ink-3);margin-top:8px">' +
        (first ? first.name : '') +
      '</div>' +
    '</div>';
  },
};