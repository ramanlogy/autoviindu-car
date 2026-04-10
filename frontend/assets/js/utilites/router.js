/* ═══════════════════════════════════════════════
   AUTOVIINDU — SPA ROUTER
   Lightweight hash-based router.
   Reads #route and delegates to AV.goTo().
═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Route table: hash prefix → handler */
  var ROUTES = [
    { test: /^#car\/(.+)$/,    fn: function (m) { if (window.AV) window.AV.openDetail(m[1]); } },
    { test: /^#brand\/(.+)$/,  fn: function (m) { if (window.AV) window.AV.goTo('brand', { slug: m[1] }); } },
    { test: /^#budget\/(.+)$/, fn: function (m) { if (window.AV) window.AV.goTo('budget', { tier: m[1] }); } },
    { test: /^#budget$/,       fn: function ()  { if (window.AV) window.AV.goTo('budget'); } },
    { test: /^#cars$/,         fn: function ()  { if (window.AV) window.AV.goTo('cars'); } },
    { test: /^#electric$/,     fn: function ()  { if (window.AV) window.AV.goTo('electric'); } },
    { test: /^#hybrid$/,       fn: function ()  { if (window.AV) window.AV.goTo('hybrid'); } },
    { test: /^#compare$/,      fn: function ()  { if (window.AV) window.AV.goTo('compare'); } },
    { test: /^#services$/,     fn: function ()  { if (window.AV) window.AV.goTo('services'); } },
    { test: /^#maintenance$/,  fn: function ()  { if (window.AV) window.AV.goTo('maintenance'); } },
    { test: /^#videos$/,       fn: function ()  { if (window.AV) window.AV.goTo('videos'); } },
    { test: /^#used$/,         fn: function ()  { if (window.AV) window.AV.goTo('used', {}); } },
    { test: /^(#home)?$/,      fn: function ()  { if (window.AV) window.AV.goTo('home'); } },
  ];

  function dispatch(hash) {
    hash = hash || location.hash || '';
    for (var i = 0; i < ROUTES.length; i++) {
      var m = hash.match(ROUTES[i].test);
      if (m) { ROUTES[i].fn(m); return; }
    }
    /* Fallback */
    if (window.AV) window.AV.goTo('home');
  }

  /* Expose for manual navigation */
  window.AVRouter = {
    dispatch: dispatch,
    navigate: function (hash) {
      history.pushState(null, '', hash);
      dispatch(hash);
    },
  };

  /* Listen to browser back/forward */
  window.addEventListener('popstate', function () { dispatch(location.hash); });

})();