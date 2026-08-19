/*!
 * AutoViindu — Shared site chrome loader (nav + footer)
 *
 * When served via Express, the server already injects nav + footer HTML
 * into the page. In that case this script only loads av-chrome-core.js
 * to initialise interactive behaviours (dropdowns, mobile menu, etc.)
 * and skips the two extra network round-trips to fetch the partials.
 *
 * Fallback: if nav/footer are NOT already in the DOM (e.g. opened as a
 * local file), the original dynamic-loading path runs as before.
 */
(function () {
  'use strict';

  var nested = /\/form\//.test(location.pathname) || /\/admin\//.test(location.pathname);
  var base = nested ? '../assets/js/components/' : 'assets/js/components/';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = base + src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  var navAlreadyInDOM   = !!document.getElementById('site-header');
  var footerAlreadyInDOM = !!document.getElementById('site-footer');

  if (navAlreadyInDOM) {
    // ── Fast path: server already injected nav + footer ──────────────────────
    // Just load the core utilities so interactive behaviours are initialised.
    loadScript('av-chrome-core.js').then(function () {
      if (window.AVChrome) {
        window.AVChrome.ensureChromeCss();
        window.AVChrome.ensureChromeFonts();
        window.AVChrome.ensureAvGoTo();
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () {
            window.AVChrome.initChromeBehaviors();
          });
        } else {
          window.AVChrome.initChromeBehaviors();
        }
      }
    }).catch(function (err) { console.error('[site-chrome] core', err); });

  } else {
    // ── Fallback path: fetch and inject nav/footer dynamically ───────────────
    loadScript('av-chrome-core.js')
      .then(function () { return loadScript('av-nav.js'); })
      .catch(function (err) { console.error('[site-chrome] nav', err); });

    function loadFooter() {
      loadScript('av-footer.js').catch(function (err) { console.error('[site-chrome] footer', err); });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
      loadFooter();
    }
  }
})();
