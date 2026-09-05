/*!
 * AutoViindu — Shared chrome utilities (paths, AV.goTo shim, CSS loader)
 */
(function () {
  'use strict';

  function getRootPath() {
    var p = location.pathname;
    if (/\/form\//.test(p) || /\/admin\//.test(p)) return '../';
    return '';
  }

  function getAssetBase() {
    return getRootPath() + 'assets/';
  }

  function fixChromePaths(html) {
    var root = getRootPath();
    var assetBase = getAssetBase();
    return html
      .replace(/src="assets\//g, 'src="' + assetBase)
      .replace(/src="\/assets\//g, 'src="' + assetBase)
      .replace(/href="\/([^"]*)"/g, function (_, path) {
        return 'href="' + (path ? root + path : root || '/') + '"';
      })
      .replace(/href="(?!https?:|#|mailto:|tel:|javascript:|\.\.\/)([^"]+)"/g, function (_, path) {
        return 'href="' + root + path + '"';
      })
      .replace(/window\.location\.href='\/([^']*)'/g, function (_, path) {
        return "window.location.href='" + (path ? root + path : root || '/') + "'";
      })
      .replace(/window\.location\.href="\/([^"]*)"/g, function (_, path) {
        return 'window.location.href="' + (path ? root + path : root || '/') + '"';
      });
  }

  function ensureChromeCss() {
    if (document.getElementById('av-site-chrome-css')) return;
    var link = document.createElement('link');
    link.id = 'av-site-chrome-css';
    link.rel = 'stylesheet';
    link.href = getAssetBase() + 'css/site-chrome.css';
    document.head.appendChild(link);
  }

  function ensureChromeFonts() {
    if (document.getElementById('av-chrome-fonts')) return;
    var link = document.createElement('link');
    link.id = 'av-chrome-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap';
    document.head.appendChild(link);
  }

  function isSpaHome() {
    var p = location.pathname;
    return p === '/' || p.endsWith('/') || /\/index$/.test(p) || /\/index\.html$/.test(p);
  }

  function ensureAvGoTo() {
    window.AV = window.AV || {};
    if (AV._appLoaded || AV._chromeGoTo || isSpaHome()) return;

    AV._chromeGoTo = true;
    var root = getRootPath();

    AV.goTo = function (page, opts) {
      opts = opts || {};
      page = page || 'home';

      var toolPages = {
        emi: 'caremi',
        loan: 'whatcarcanyouaffoard',
        afford: 'whatcarcanyouaffoard',
        matchmaker: 'whatcarcanyouaffoard',
        charging: 'chargingstation'
      };

      if (page === 'tools') {
        location.href = root + (toolPages[opts.tool] || 'caremi');
        return;
      }

      if (page === 'quote') {
        alert('Get a quote: call +977-9828364940 or email info@autoviindu.com');
        return;
      }

      if (Object.keys(opts).length) {
        try { sessionStorage.setItem('av-nav-opts', JSON.stringify({ page: page, opts: opts })); } catch (_) { }
      }

      // root is '' on top-level pages (e.g. /about, /caremi) — that would just
      // change the hash on the CURRENT static page instead of navigating to the
      // SPA homepage, so the click would silently do nothing. Force '/' there.
      location.href = (root || '/') + '#' + page;
    };

    AV.clearCompare = AV.clearCompare || function () {
      try { localStorage.removeItem('av-compare'); } catch (_) { }
    };
  }

  function initDesktopNav() {
    var nav = document.querySelector('.header-nav');
    if (!nav || nav.dataset.avInit) return;
    nav.dataset.avInit = '1';

    var current = null;

    function setExpanded(item, open) {
      var btn = item && item.querySelector('.av-link[aria-haspopup]');
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function closeAll() {
      nav.querySelectorAll('.av-item.open').forEach(function (item) {
        item.classList.remove('open');
        setExpanded(item, false);
      });
      nav.querySelectorAll('.av-acc.open').forEach(function (a) { a.classList.remove('open'); });
      current = null;
      document.body.style.overflow = '';
    }

    nav.querySelectorAll('.av-item').forEach(function (item) {
      var btn = item.querySelector('.av-link');
      var dd = item.querySelector('.av-dd');
      if (!dd || !btn) return;

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        closeAll();
        if (!isOpen) {
          item.classList.add('open');
          setExpanded(item, true);
          current = item;
          document.body.style.overflow = 'hidden';
        }
      });
    });

    nav.querySelectorAll('.av-acc-hd').forEach(function (hd) {
      hd.addEventListener('click', function (e) {
        e.stopPropagation();
        var acc = hd.closest('.av-acc');
        var panel = acc && acc.parentElement;
        if (!acc || !panel) return;
        var wasOpen = acc.classList.contains('open');
        panel.querySelectorAll('.av-acc').forEach(function (a) { a.classList.remove('open'); });
        if (!wasOpen) acc.classList.add('open');
      });
    });

    nav.querySelectorAll('.av-menu-link, .av-menu-cta').forEach(function (link) {
      link.addEventListener('click', function () { closeAll(); });
    });

    document.addEventListener('click', function (e) {
      if (current && !current.contains(e.target)) closeAll();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && current) closeAll();
    });
  }

  function initMobileNav() {
    var mm = document.getElementById('mm');
    var burger = document.getElementById('burger');
    if (!mm || !burger || burger.dataset.avInit) return;
    burger.dataset.avInit = '1';

    // Overwrite the early stubs with proper closures bound to the actual elements
    window.closeMM = function () {
      mm.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
      document.querySelectorAll('.mm-sub.open').forEach(function (s) { s.classList.remove('open'); });
      document.querySelectorAll('.mm-btn.open').forEach(function (b) { b.classList.remove('open'); });
    };

    window.mmToggle = function (subId, btn) {
      var sub = document.getElementById(subId);
      if (!sub) return;
      var wasOpen = sub.classList.contains('open');
      document.querySelectorAll('.mm-sub').forEach(function (s) { s.classList.remove('open'); });
      document.querySelectorAll('.mm-btn').forEach(function (b) { b.classList.remove('open'); });
      if (!wasOpen) {
        sub.classList.add('open');
        if (btn) btn.classList.add('open');
      }
    };

    window.toggleMM = function () {
      if (mm.classList.contains('open')) {
        window.closeMM();
      } else {
        mm.classList.add('open');
        burger.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    };

    // NOTE: burger click is handled via inline onclick="toggleMM()" in site-nav.html
    // No extra addEventListener needed — avoids double-fire.

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') window.closeMM();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960) {
        if (mm.classList.contains('open')) window.closeMM();
        var headerIn = document.querySelector('.header-in');
        if (headerIn && headerIn.classList.contains('search-active')) {
          headerIn.classList.remove('search-active');
        }
      }
    }, { passive: true });
  }

  function initHeaderScroll() {
    window.addEventListener('scroll', function () {
      document.getElementById('site-header')?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  function initMobileSearch() {
    var mobSearchBtn = document.getElementById('mob-search-btn');
    var mobSearchBack = document.getElementById('mob-search-back');
    var headerIn = document.querySelector('.header-in');
    if (!mobSearchBtn || !mobSearchBack || !headerIn || mobSearchBtn.dataset.avInit) return;
    mobSearchBtn.dataset.avInit = '1';

    mobSearchBtn.addEventListener('click', function () {
      headerIn.classList.add('search-active');
      document.getElementById('hs-input')?.focus();
    });

    mobSearchBack.addEventListener('click', function () {
      headerIn.classList.remove('search-active');
    });
  }

  function initSearchShortcut() {
    var inp = document.getElementById('hs-input');
    if (!inp || inp.dataset.avInit) return;
    inp.dataset.avInit = '1';

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inp.focus();
        inp.select();
      }
    });

    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') AV.goTo('cars', { q: inp.value });
    });
  }

  function initChromeBehaviors() {
    initDesktopNav();
    initMobileNav();
    initHeaderScroll();
    initMobileSearch();
    initSearchShortcut();
  }

  /* ── Early stubs so inline onclick="closeMM()" / "mmToggle()" never throw
     before the nav partial has loaded and initMobileNav() has run. ── */
  function installEarlyStubs() {
    // Only install if not already defined by a real init
    if (!window.closeMM) {
      window.closeMM = function () {
        var mm = document.getElementById('mm');
        var burger = document.getElementById('burger');
        if (mm) mm.classList.remove('open');
        if (burger) burger.classList.remove('open');
        document.body.style.overflow = '';
        document.querySelectorAll('.mm-sub.open').forEach(function (s) { s.classList.remove('open'); });
        document.querySelectorAll('.mm-btn.open').forEach(function (b) { b.classList.remove('open'); });
      };
    }
    if (!window.mmToggle) {
      window.mmToggle = function (subId, btn) {
        var sub = document.getElementById(subId);
        if (!sub) return;
        var wasOpen = sub.classList.contains('open');
        document.querySelectorAll('.mm-sub').forEach(function (s) { s.classList.remove('open'); });
        document.querySelectorAll('.mm-btn').forEach(function (b) { b.classList.remove('open'); });
        if (!wasOpen) {
          sub.classList.add('open');
          if (btn) btn.classList.add('open');
        }
      };
    }
    if (!window.toggleMM) {
      window.toggleMM = function () {
        var mm = document.getElementById('mm');
        var burger = document.getElementById('burger');
        if (!mm || !burger) return;
        if (mm.classList.contains('open')) {
          window.closeMM();
        } else {
          mm.classList.add('open');
          burger.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      };
    }
  }

  window.AVChrome = {
    getRootPath: getRootPath,
    getAssetBase: getAssetBase,
    fixChromePaths: fixChromePaths,
    ensureChromeCss: ensureChromeCss,
    ensureChromeFonts: ensureChromeFonts,
    ensureAvGoTo: ensureAvGoTo,
    initChromeBehaviors: initChromeBehaviors,
    loadPartial: function (name) {
      return fetch(getAssetBase() + 'partials/' + name + '.html')
        .then(function (r) {
          if (!r.ok) throw new Error('Failed to load ' + name);
          return r.text();
        })
        .then(fixChromePaths);
    }
  };

  ensureChromeCss();
  ensureChromeFonts();
  ensureAvGoTo();
  installEarlyStubs();
})();
