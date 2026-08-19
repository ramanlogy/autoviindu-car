/*!
 * AutoViindu — Shared Footer (matches index.html)
 * Usage: <script src="assets/js/components/av-footer.js"></script> before </body>
 */
(function () {
  'use strict';

  if (document.getElementById('site-footer') || document.getElementById('av-footer-root')) return;

  function inject(html) {
    var wrap = document.createElement('div');
    wrap.id = 'av-footer-root';
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
  }

  function boot(core) {
    core.ensureChromeCss();
    core.ensureAvGoTo();
    core.loadPartial('site-footer').then(inject).catch(function (err) {
      console.error('[av-footer]', err);
    });
  }

  var core = window.AVChrome;
  if (core) {
    boot(core);
    return;
  }

  var s = document.createElement('script');
  s.src = (location.pathname.indexOf('/form/') >= 0 || location.pathname.indexOf('/admin/') >= 0)
    ? '../assets/js/components/av-chrome-core.js'
    : 'assets/js/components/av-chrome-core.js';
  s.onload = function () { boot(window.AVChrome); };
  document.head.appendChild(s);
})();
