/*!
 * AutoViindu — Shared Navigation (matches index.html)
 * Usage: <script src="assets/js/components/av-nav.js"></script> right after <body>
 */
(function () {
  'use strict';

  if (document.getElementById('site-header') || document.getElementById('av-nav-root')) return;

  var core = window.AVChrome;
  if (!core) {
    var s = document.createElement('script');
    s.src = (location.pathname.indexOf('/form/') >= 0 || location.pathname.indexOf('/admin/') >= 0)
      ? '../assets/js/components/av-chrome-core.js'
      : 'assets/js/components/av-chrome-core.js';
    s.onload = boot;
    document.head.appendChild(s);
    return;
  }

  boot();

  function boot() {
    core = window.AVChrome;
    core.ensureChromeCss();
    core.ensureChromeFonts();
    core.ensureAvGoTo();

    core.loadPartial('site-nav').then(function (html) {
      var wrap = document.createElement('div');
      wrap.id = 'av-nav-root';
      wrap.innerHTML = html;
      document.body.insertBefore(wrap, document.body.firstChild);
      core.initChromeBehaviors();
      document.dispatchEvent(new CustomEvent('av-chrome-ready', { detail: { part: 'nav' } }));
    }).catch(function (err) {
      console.error('[av-nav]', err);
    });
  }
})();
