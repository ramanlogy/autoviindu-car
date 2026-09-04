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

  /* ── Brand car icon ───────────────────────────────────────────────────────
   * Replace Lucide's generic "car" / "car-front" glyph with AutoViindu's
   * hand-drawn hatchback everywhere it's used (book-service, enquiry forms,
   * sell-your-car, services, etc.). We wrap lucide.createIcons() so every
   * call — including the many inline ones scattered across pages — picks up
   * the override without touching each markup site.
   */
  (function brandCarIcon() {
    var INNER =
      '<path d="M2.6 13q-.5-1.8.4-2.8Q4.2 8.9 7 8.6l3.4-2.5q.6-.4 1.6-.4h3q1.6 0 2.6 1.1l2 2.3q1.8.4 1.8 2.2V13"/>' +
      '<path d="M6.8 8.7q6.7-.4 13.9 .8"/>' +
      '<path d="M8.8 8.6l1.9-2.6q.5-.5 1.4-.5h2.9q1.6 0 2.6 1.1L19 8.7"/>' +
      '<path d="M13.2 8.6l-.1-3"/>' +
      '<path d="M9.7 16h4.6"/>' +
      '<circle cx="7" cy="16" r="2.4"/>' +
      '<circle cx="17" cy="16" r="2.4"/>';

    function swap(root) {
      var svgs = (root || document).querySelectorAll('svg.lucide-car, svg.lucide-car-front');
      for (var i = 0; i < svgs.length; i++) {
        var s = svgs[i];
        if (s.getAttribute('data-av-car') === '1') continue;
        s.innerHTML = INNER;
        s.setAttribute('data-av-car', '1');
        s.classList.add('lucide-car');
      }
    }

    // Wrap createIcons so every call (including the many inline ones) re-skins
    // any car glyphs it just rendered.
    function patch() {
      var L = window.lucide;
      if (!L || typeof L.createIcons !== 'function') return false;
      if (!L.__avCarPatched) {
        var orig = L.createIcons.bind(L);
        L.createIcons = function () {
          var r = orig.apply(null, arguments);
          try { swap(document); } catch (e) {}
          return r;
        };
        L.__avCarPatched = true;
      }
      try { swap(document); } catch (e) {}
      return true;
    }
    if (!patch()) {
      var tries = 0;
      var timer = setInterval(function () {
        if (patch() || ++tries > 150) clearInterval(timer);
      }, 40);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { try { swap(document); } catch (e) {} });
    }
  })();

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


/*!
 * AutoViindu — form success celebration
 * ─────────────────────────────────────
 * One shared behaviour for every form on the site: when a "thank you" /
 * success panel appears, we
 *   1. draw an animated checkmark (the ring + tick "draw-on" effect), and
 *   2. play a short, pleasant reward chime (synthesised — no audio file).
 *
 * Nothing to wire up per-form: a MutationObserver watches the page and
 * fires automatically whenever a known success panel becomes visible.
 */
(function () {
  'use strict';
  if (window.__avCelebrateInit) return;
  window.__avCelebrateInit = true;

  var AV = (window.AV = window.AV || {});
  var reduceMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ── 1. Reward chime ──────────────────────────────────────────────────────
  // A bright C-major arpeggio (C6–E6–G6) with a soft bell sparkle on top.
  // Uses the Web Audio API so there's no asset to download or host.
  var _actx = null;
  function audioCtx() {
    if (_actx) return _actx;
    try { _actx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { _actx = null; }
    return _actx;
  }

  AV.playSuccessChime = function () {
    var c = audioCtx();
    if (!c) return;
    // Browsers keep the context suspended until a user gesture; a form submit
    // is a gesture, so this resume() call succeeds in that context.
    if (c.state === 'suspended') { try { c.resume(); } catch (e) {} }

    var now = c.currentTime;
    var master = c.createGain();
    master.gain.setValueAtTime(0.16, now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
    master.connect(c.destination);

    // soften transients so nothing clicks or clips
    var comp = c.createDynamicsCompressor();
    comp.threshold.value = -6;
    comp.ratio.value = 12;
    comp.connect(master);

    var notes = [
      { f: 1046.50, t: 0.00 }, // C6
      { f: 1318.51, t: 0.085 }, // E6
      { f: 1567.98, t: 0.17 }  // G6
    ];
    notes.forEach(function (n) {
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = n.f;
      var st = now + n.t;
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.9, st + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.5);
      o.connect(g); g.connect(comp);
      o.start(st); o.stop(st + 0.55);
    });

    // high sparkle bell landing with the final note
    var b = c.createOscillator();
    var bg = c.createGain();
    b.type = 'sine';
    b.frequency.value = 2093.00; // C7
    var bt = now + 0.17;
    bg.gain.setValueAtTime(0.0001, bt);
    bg.gain.exponentialRampToValueAtTime(0.3, bt + 0.03);
    bg.gain.exponentialRampToValueAtTime(0.0001, bt + 0.95);
    b.connect(bg); bg.connect(comp);
    b.start(bt); b.stop(bt + 1);
  };

  // ── 2. Animated checkmark ────────────────────────────────────────────────
  var TICK_SVG =
    '<svg class="av-tick" viewBox="0 0 52 52" aria-hidden="true">' +
      '<circle class="av-tick-ring" cx="26" cy="26" r="24"/>' +
      '<path class="av-tick-check" d="M14 27l8 8 16-16"/>' +
    '</svg>';

  function injectStyles() {
    if (document.getElementById('av-celebrate-css')) return;
    var s = document.createElement('style');
    s.id = 'av-celebrate-css';
    s.textContent = [
      '.av-tick{width:100%;height:100%;display:block;overflow:visible}',
      '.av-tick-ring{fill:none;stroke:currentColor;stroke-width:2;opacity:.35;',
        'stroke-dasharray:151;stroke-dashoffset:151;',
        'animation:av-tick-ring .5s ease forwards}',
      '.av-tick-check{fill:none;stroke:currentColor;stroke-width:4;',
        'stroke-linecap:round;stroke-linejoin:round;',
        'stroke-dasharray:40;stroke-dashoffset:40;',
        'animation:av-tick-check .34s cubic-bezier(.65,0,.45,1) .34s forwards}',
      '.av-celebrate-pop{animation:av-celebrate-pop .45s cubic-bezier(.34,1.56,.64,1)}',
      '@keyframes av-tick-ring{to{stroke-dashoffset:0}}',
      '@keyframes av-tick-check{to{stroke-dashoffset:0}}',
      '@keyframes av-celebrate-pop{0%{transform:scale(.4);opacity:.4}',
        '60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}',
      '@media (prefers-reduced-motion: reduce){',
        '.av-tick-ring,.av-tick-check{animation:none;stroke-dashoffset:0}',
        '.av-celebrate-pop{animation:none}}'
    ].join('');
    document.head.appendChild(s);
  }

  function parseRGB(str) {
    var m = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/.exec(str || '');
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  }
  function luminance(c) { return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255; }
  function isSaturated(c) {
    var mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b);
    return (mx - mn) > 24 && mx < 245; // has a hue, and isn't near-white
  }
  function brandGreen() {
    var root = getComputedStyle(document.documentElement);
    return (root.getPropertyValue('--green') || root.getPropertyValue('--g3') ||
      '#1a6b2a').trim() || '#1a6b2a';
  }

  // The circle-wrapped checkmarks on the standalone /form/ pages already have
  // their own draw-on animation — leave those alone; only replace plain icons.
  function paintCheck(panel) {
    var holder = panel.querySelector(
      '.success-icon-pop,.success-ring,.success-icon,.success-icon-wrap,.av-success-icon'
    );
    if (!holder) return;
    // The standalone /form/ pages hand-roll an <svg> with a <circle> + <path>
    // that already draws itself on. Keep those; replace everything else
    // (Lucide icons, plain polylines) with our animated tick.
    var svg = holder.querySelector('svg');
    var isLucide = svg && /lucide/i.test(svg.getAttribute('class') || '');
    var isHandDrawn = svg && !isLucide &&
      svg.querySelector('circle') && svg.querySelector('path');
    if (!isHandDrawn) {
      holder.innerHTML = TICK_SVG;
    }
    // The tick draws with currentColor. Pick a colour that reads on the
    // holder's background, unless the page already set an intentional hue.
    var cs = getComputedStyle(holder);
    var ownColor = parseRGB(cs.color);
    if (!holder.style.color && !(ownColor && isSaturated(ownColor))) {
      var bg = parseRGB(cs.backgroundColor);
      var darkBg = /gradient/.test(cs.backgroundImage) ||
        (bg && bg.a > 0.3 && luminance(bg) < 0.55);
      holder.style.color = darkBg ? '#ffffff' : brandGreen();
    }
    holder.classList.remove('av-celebrate-pop');
    // force reflow so the class re-adds cleanly on a repeat open
    void holder.offsetWidth;
    if (!reduceMotion) holder.classList.add('av-celebrate-pop');
  }

  // ── 3. Fire it ───────────────────────────────────────────────────────────
  AV.celebrateForm = function (panel) {
    if (!panel || panel.__avCelebrated) return;
    panel.__avCelebrated = true;
    injectStyles();
    paintCheck(panel);
    AV.playSuccessChime();
    if (navigator.vibrate) { try { navigator.vibrate([12, 40, 18]); } catch (e) {} }
  };

  // ── 4. Auto-detect success panels becoming visible ───────────────────────
  var PANEL_SELECTOR = [
    '.av-modal-success', '.cute-success', '.success-state', '.success-screen',
    '.success-card', '[id^="form-ok-"]', '[id$="-success"]', '[id$="-success-wrap"]',
    '#success-state', '#success-screen', '#success-card'
  ].join(',');

  function isVisible(el) {
    // Note: opacity is deliberately NOT checked — success panels are hidden
    // with display:none, and several fade in from opacity:0, which would
    // otherwise make us miss the reveal on the very first mutation.
    if (!el || !el.getClientRects().length) return false;
    var cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  function check(el) {
    if (!el || el.nodeType !== 1) return;
    if (!el.matches || !el.matches(PANEL_SELECTOR)) return;
    if (isVisible(el)) {
      AV.celebrateForm(el);
    } else {
      // reset so re-opening the same form celebrates again
      el.__avCelebrated = false;
    }
  }

  function scanAll() {
    var list = document.querySelectorAll(PANEL_SELECTOR);
    for (var i = 0; i < list.length; i++) check(list[i]);
  }

  function start() {
    scanAll();
    var obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'attributes') {
          check(m.target);
        } else if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var n = m.addedNodes[j];
            if (n.nodeType !== 1) continue;
            check(n);
            if (n.querySelectorAll) {
              var inner = n.querySelectorAll(PANEL_SELECTOR);
              for (var k = 0; k < inner.length; k++) check(inner[k]);
            }
          }
        }
      }
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden'],
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();


/* ═══════════════════════════════════════════════════════════════════════════
 * AutoViindu — universal submit-button spinner
 *
 * Every form on the site disables its submit button (and usually swaps the
 * label to "Sending…" / "Submitting…") while the request is in flight. This
 * decorates that button with a spinning ring automatically — no per-form
 * wiring. The cue is the button becoming `disabled`, which each form only
 * does *after* its client-side validation passes, so a rejected submit never
 * spins. The ring is removed when the button is re-enabled, when a success
 * panel appears, or after a 20s safety timeout.
 * ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  if (/\/admin\//.test(location.pathname)) return;

  var AV = (window.AV = window.AV || {});

  var BTN_SELECTOR = [
    'button[type="submit"]',
    '.pill-submit', '.cute-submit', '.btn-submit', '.submit-btn', '.form-submit',
    '#submit-btn', '[id$="-submit-btn"]'
  ].join(',');

  function injectStyles() {
    if (document.getElementById('av-btnspin-css')) return;
    var s = document.createElement('style');
    s.id = 'av-btnspin-css';
    s.textContent = [
      '.av-btn-spinner{',
        'display:inline-block;box-sizing:border-box;width:1em;height:1em;',
        'flex:none;vertical-align:-0.15em;margin-right:.55em;',
        'border:2px solid currentColor;border-right-color:transparent;',
        'border-radius:50%;opacity:.85;animation:av-btn-spin .6s linear infinite}',
      '@keyframes av-btn-spin{to{transform:rotate(360deg)}}',
      '@media (prefers-reduced-motion:reduce){',
        '.av-btn-spinner{animation-duration:1.6s}}'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }

  function isSubmitButton(el) {
    if (!el || el.nodeType !== 1 || !el.matches || el.nodeName === 'INPUT') return false;
    if (!el.matches(BTN_SELECTOR)) return false;
    if (el.dataset && el.dataset.noSpinner != null) return false;
    var t = (el.textContent || '').trim().toLowerCase();
    if (/^(next|back|previous|continue|skip|add |remove)\b/.test(t)) return false;
    return true;
  }

  function addSpinner(btn) {
    if (!btn || btn.querySelector('.av-btn-spinner')) return;
    var sp = document.createElement('span');
    sp.className = 'av-btn-spinner';
    sp.setAttribute('aria-hidden', 'true');
    btn.insertBefore(sp, btn.firstChild);
  }

  function removeSpinner(btn) {
    if (!btn) return;
    btn.__avSpinWanted = false;
    if (btn.__avSpinTimer) { clearTimeout(btn.__avSpinTimer); btn.__avSpinTimer = null; }
    var list = btn.querySelectorAll('.av-btn-spinner');
    for (var i = 0; i < list.length; i++) list[i].parentNode.removeChild(list[i]);
  }

  function wantSpinner(btn) {
    btn.__avSpinWanted = true;
    addSpinner(btn);
    if (btn.__avSpinTimer) clearTimeout(btn.__avSpinTimer);
    btn.__avSpinTimer = setTimeout(function () { removeSpinner(btn); }, 20000);
  }

  function handleDisabled(btn) {
    if (!isSubmitButton(btn)) return;
    if (btn.disabled && !btn.__avSpinWanted) wantSpinner(btn);
    else if (!btn.disabled && btn.__avSpinWanted) removeSpinner(btn);
  }

  function clearAll() {
    var list = document.querySelectorAll('.av-btn-spinner');
    for (var i = 0; i < list.length; i++) {
      var b = list[i].closest ? list[i].closest(BTN_SELECTOR) : null;
      if (b) removeSpinner(b); else if (list[i].parentNode) list[i].parentNode.removeChild(list[i]);
    }
  }

  function start() {
    injectStyles();

    var obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'attributes' && m.attributeName === 'disabled') {
          handleDisabled(m.target);
        } else if (m.type === 'childList' && m.target && m.target.closest) {
          // A form handler that rewrites the label via textContent/innerHTML
          // after disabling wipes our span — put it back.
          var host = m.target.closest(BTN_SELECTOR);
          if (host && host.__avSpinWanted && host.disabled) addSpinner(host);
        }
      }
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ['disabled'],
      childList: true,
      subtree: true
    });

    // Clear spinners the moment a success panel is celebrated.
    if (typeof AV.celebrateForm === 'function') {
      var orig = AV.celebrateForm;
      AV.celebrateForm = function () {
        clearAll();
        return orig.apply(this, arguments);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
