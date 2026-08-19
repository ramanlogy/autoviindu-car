/* ═══════════════════════════════════════════════
   AUTOVIINDU — HELPER UTILITIES
   Shared formatting & DOM helpers.
═══════════════════════════════════════════════ */

window.Rs = window.Rs || function (n) {
  if (!n && n !== 0) return '—';
  return n >= 100000 ? 'Rs. ' + (n / 100000).toFixed(2) + 'L' : 'Rs. ' + Number(n).toLocaleString();
};
window.calcEMI = window.calcEMI || function (principal, annualRate, months) {
  var r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};
window.fmtRating = function (r) { return Number(r).toFixed(1); };
window.slugify = function (str) { return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); };
window.debounce = function (fn, delay) {
  var timer;
  return function () { var a = arguments; clearTimeout(timer); timer = setTimeout(function () { fn.apply(null, a); }, delay || 300); };
};
window.truncate = function (str, len) { return (!str) ? '' : str.length > (len || 80) ? str.slice(0, len || 80) + '…' : str; };
window.scrollToId = function (id, offset) {
  var el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - (offset || 80), behavior: 'smooth' });
};
window.setHTML = function (id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; };
window.badgeClass = function (b) { return ({ ev: 'badge-ev', hybrid: 'badge-hybrid', popular: 'badge-pop', new: 'badge-new' })[b] || 'badge-pop'; };
window.badgeLabel = function (b) { return ({ ev: 'Electric', hybrid: 'Hybrid', popular: 'Popular', new: 'New' })[b] || ''; };
window.minPrice = function (car) { return (!car || !car.variants || !car.variants.length) ? 0 : Math.min.apply(null, car.variants.map(function (v) { return v.price; })); };
window.plural = function (n, s, p) { return n === 1 ? n + ' ' + s : n + ' ' + (p || s + 's'); };
window.todayISO = function () { return new Date().toISOString().split('T')[0]; };
window.sharePage = function (title, text) {
  if (navigator.share) {
    navigator.share({ title: title || document.title, text: text || '', url: location.href });
  } else {
    if (navigator.clipboard) navigator.clipboard.writeText(location.href);
    if (window.AV && window.AV.toast) window.AV.toast('Link copied!', 'success');
  }
};