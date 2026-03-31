/* ═══════════════════════════════════════════════
   AUTOVIINDU — EMI CALCULATOR COMPONENT
   Self-contained. Call EmiCalc.render(car, varIdx).
   Works standalone or inside car detail pages.
═══════════════════════════════════════════════ */
window.EmiCalc = {
  _calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="9.5" y2="11"/><line x1="12" y1="11" x2="13.5" y2="11"/><line x1="8" y1="15" x2="9.5" y2="15"/><line x1="12" y1="15" x2="13.5" y2="15"/><line x1="8" y1="19" x2="16" y2="19"/></svg>',
  _phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',

  _Rs: function (n) { return window.Rs ? window.Rs(n) : 'Rs. ' + Math.round(n).toLocaleString(); },
  _emi: function (p, ar, m) {
    var r = ar / 12 / 100;
    return r === 0 ? p / m : p * (r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
  },

  _breakdown: function (price, loan, emi, months) {
    var total = emi * months;
    var interest = total - loan;
    return [
      [this._Rs(Math.round(loan)), 'Loan Amount'],
      [this._Rs(Math.round(interest)), 'Total Interest'],
      [this._Rs(Math.round(total)), 'Total Amount'],
      [this._Rs(price), 'Vehicle Price'],
    ].map(function (row) {
      return '<div class="emi-bd-item"><div class="emi-bd-value">' + row[0] + '</div><div class="emi-bd-label">' + row[1] + '</div></div>';
    }).join('');
  },

  render: function (car, varIdx) {
    varIdx = varIdx || 0;
    var vr = car.variants[varIdx];
    var dp = 20, tenure = 60, rate = 10.5;
    var loan = vr.price * (1 - dp / 100);
    var emi = this._emi(loan, rate, tenure);
    var pp = Math.round((loan / (emi * tenure)) * 100);
    var self = this;

    return '<div class="emi-card">' +
      '<div class="emi-card-title">' + this._calc + ' EMI Calculator</div>' +
      '<div class="emi-field">' +
        '<label>Down Payment <span class="val" id="emi-down-val">' + dp + '%</span></label>' +
        '<input type="range" id="emi-down" min="10" max="60" value="' + dp + '" step="5"' +
        ' oninput="document.getElementById(\'emi-down-val\').textContent=this.value+\'%\';EmiCalc.update(\'' + car.slug + '\',' + varIdx + ')">' +
      '</div>' +
      '<div class="emi-field">' +
        '<label>Tenure <span class="val"><span id="emi-tenure-val">' + tenure + '</span> months</span></label>' +
        '<div class="tenure-buttons">' +
          [12, 24, 36, 48, 60, 72, 84].map(function (m) {
            return '<button class="tenure-btn' + (m === tenure ? ' active' : '') + '" onclick="EmiCalc.setTenure(' + m + ',\'' + car.slug + '\',' + varIdx + ')">' + m + 'm</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="emi-field">' +
        '<label>Interest Rate <span class="val" id="emi-rate-val">' + rate + '%</span></label>' +
        '<input type="range" id="emi-rate" min="7" max="18" value="' + rate + '" step="0.5"' +
        ' oninput="document.getElementById(\'emi-rate-val\').textContent=this.value+\'%\';EmiCalc.update(\'' + car.slug + '\',' + varIdx + ')">' +
      '</div>' +
      '<div class="emi-result" id="emi-result">' +
        '<div class="emi-monthly-label">Monthly EMI</div>' +
        '<div style="display:flex;align-items:baseline;gap:5px">' +
          '<span class="emi-monthly-amount" id="emi-amount">Rs. ' + Math.round(emi).toLocaleString() + '</span>' +
          '<span class="emi-monthly-period">/month</span>' +
        '</div>' +
        '<div class="emi-breakdown-grid" id="emi-breakdown">' + this._breakdown(vr.price, loan, emi, tenure) + '</div>' +
        '<div class="emi-pbar-wrap">' +
          '<div class="emi-pbar-track"><div class="emi-pbar-fill" id="emi-pbar" style="width:' + pp + '%"></div></div>' +
          '<div class="emi-pbar-labels"><span id="emi-pl">Principal ' + pp + '%</span><span id="emi-il">Interest ' + (100 - pp) + '%</span></div>' +
        '</div>' +
      '</div>' +
      '<button onclick="alert(\'Apply for Finance — Call +977-9701076240\')" class="btn btn-ghost btn-full" style="margin-top:10px;font-size:13px">' +
        this._phone + ' Apply for Finance' +
      '</button>' +
    '</div>';
  },

  update: function (slug, varIdx) {
    var car = window.carBySlug ? window.carBySlug(slug) : null;
    if (!car) return;
    var vr = car.variants[varIdx || 0];
    var dp = +(document.getElementById('emi-down') || {}).value || 20;
    var tenure = +(document.getElementById('emi-tenure-val') || {}).textContent || 60;
    var rate = +(document.getElementById('emi-rate') || {}).value || 10.5;
    var loan = vr.price * (1 - dp / 100);
    var emi = this._emi(loan, rate, tenure);
    var total = emi * tenure;
    var pp = Math.round((loan / total) * 100);
    var amtEl = document.getElementById('emi-amount');
    if (amtEl) amtEl.textContent = 'Rs. ' + Math.round(emi).toLocaleString();
    var bdEl = document.getElementById('emi-breakdown');
    if (bdEl) bdEl.innerHTML = this._breakdown(vr.price, loan, emi, tenure);
    var pbar = document.getElementById('emi-pbar');
    if (pbar) pbar.style.width = pp + '%';
    var pl = document.getElementById('emi-pl'); if (pl) pl.textContent = 'Principal ' + pp + '%';
    var il = document.getElementById('emi-il'); if (il) il.textContent = 'Interest ' + (100 - pp) + '%';
  },

  setTenure: function (months, slug, varIdx) {
    var tv = document.getElementById('emi-tenure-val');
    if (tv) tv.textContent = months;
    document.querySelectorAll('.tenure-btn').forEach(function (b) {
      b.classList.toggle('active', parseInt(b.textContent) === months);
    });
    this.update(slug, varIdx || 0);
  },
};