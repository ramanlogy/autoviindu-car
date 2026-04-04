/*!
 * AutoViindu — Shared Navigation Component
 * Usage: <script src="components/av-nav.js"></script>
 * Place this BEFORE </body> or right after <body>
 *
 * Injects: topbar + site-header + mobile-menu
 * Works on ALL standalone pages (dotm-services, parts, etc.)
 */
(function () {
  'use strict';

  /* ── 1. Detect which nav item is active based on current filename ── */
  const path = location.pathname.split('/').pop() || 'index.html';
  function isActive(pages) {
    return pages.some(p => path === p || path.startsWith(p.replace('.html', ''))) ? 'active' : '';
  }

  /* ── 2. Inject shared CSS (only the nav-specific bits) ── */
  const style = document.createElement('style');
  style.textContent = `
    /* ── Nav tokens (mirrors index.html; skip if already loaded) ── */
    :root {
      --g0:#0a1a0d; --g1:#0f2414; --g2:#143018; --g3:#1a6b2a; --g4:#22883a; --g5:#2ea84a;
      --g-l:#e8f5ec; --g-ll:#f4fbf6; --g-lll:#f9fdfb;
      --gold:#c49a1e; --gold-t:#d4aa2e;
      --ink:#07100a; --ink2:#1a2b1f; --ink3:#3d5445; --ink4:#7a9483; --ink5:#b8cdbf;
      --white:#fff; --bg:#f6faf7; --bg2:#eff6f2; --bg3:#e4eee8;
      --border:#d6e6db; --border2:#c4daca;
      --r8:8px; --r10:10px; --r12:12px; --r16:16px; --pill:999px;
      --nav:64px;
      --sh1:0 1px 4px rgba(0,0,0,.06); --sh2:0 4px 16px rgba(0,0,0,.08); --sh3:0 12px 40px rgba(0,0,0,.12);
      --ease:.22s cubic-bezier(.4,0,.2,1); --spring:.4s cubic-bezier(.34,1.56,.64,1);
      --font-d:'Clash Display',sans-serif; --font-b:'Cabinet Grotesk',sans-serif;
    }

    /* Topbar */
    .av-topbar { background:var(--g0); padding:7px 0; display:none }
    @media(min-width:768px){ .av-topbar { display:block } }
    .av-topbar-in { display:flex; align-items:center; justify-content:space-between }
    .av-topbar-item {
      font-size:11.5px; color:rgba(255,255,255,.35);
      display:flex; align-items:center; gap:5px; transition:color var(--ease); cursor:pointer;
    }
    .av-topbar-item:hover { color:rgba(255,255,255,.7) }
    .av-topbar-item a { color:inherit; text-decoration:none }
    .av-topbar-sep { width:1px; height:10px; background:rgba(255,255,255,.08) }

    /* Header */
    .av-header {
      position:sticky; top:0; z-index:900;
      background:rgba(255,255,255,.97); backdrop-filter:blur(20px);
      border-bottom:1px solid var(--border); box-shadow:var(--sh1);
      transition:box-shadow var(--ease);
    }
    .av-header.scrolled { box-shadow:var(--sh2) }
    .av-header-in {
      display:flex; align-items:center; height:var(--nav); gap:10px;
      max-width:1260px; margin:0 auto; padding:0 20px;
    }
    @media(min-width:768px){ .av-header-in { padding:0 32px } }
    @media(min-width:1280px){ .av-header-in { padding:0 24px } }

    /* Logo */
    .av-logo { display:flex; align-items:center; cursor:pointer; flex-shrink:0; margin-left:-280px }
    .av-logo-img { height:170px; width:auto; display:block; object-fit:contain;
      animation:avSlideIn 0.6s cubic-bezier(.25,.46,.45,.94) forwards }
    @media(max-width:768px){ .av-logo-img { height:120px } .av-logo { margin-left:0 } }
    @keyframes avSlideIn { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:translateX(0) } }

    /* Desktop nav links */
    .av-header-nav {
      display:none; align-items:center; gap:2px; margin-left:auto; flex-shrink:0;
    }
    @media(min-width:960px){ .av-header-nav { display:flex } }

    .av-hn-link {
      padding:8px 12px; border-radius:var(--r8); font-size:13.5px; font-weight:600;
      color:var(--ink3); cursor:pointer; transition:all var(--ease); white-space:nowrap;
      display:flex; align-items:center; gap:4px; text-decoration:none;
    }
    .av-hn-link:hover, .av-hn-link.active { color:var(--g3); background:var(--g-ll) }

    /* Dropdown wrapper */
    .av-nav-dropdown { position:relative }
    .av-nav-dropdown::after { content:""; position:absolute; top:100%; left:0; width:100%; height:10px }
    .av-nav-dd {
      position:absolute; top:100%; left:50%;
      transform:translateX(-50%) translateY(6px);
      min-width:240px; background:#fff;
      border:1px solid #e8e8ed; border-radius:12px;
      box-shadow:0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.06);
      padding:6px 0; z-index:999;
      opacity:0; visibility:hidden; pointer-events:none;
      transition:all 0.18s ease;
    }
    .av-nav-dropdown:hover .av-nav-dd {
      opacity:1; visibility:visible; pointer-events:auto;
      transform:translateX(-50%) translateY(0);
    }
    .av-nav-dd-hd {
      font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase;
      color:#6e6e73; padding:8px 14px 6px;
    }
    .av-nav-dd-item {
      display:flex; flex-direction:column; padding:10px 14px;
      cursor:pointer; text-decoration:none; color:inherit; transition:background .15s ease;
    }
    .av-nav-dd-item:hover { background:#f5f5f7 }
    .av-nav-dd-item-title { font-size:14px; font-weight:500; color:#111 }
    .av-nav-dd-sub { font-size:12px; color:#6e6e73; margin-top:2px }
    .av-nav-dd-divider { height:1px; background:#e8e8ed; margin:6px 14px }

    /* CTAs */
    .av-header-ctas { display:none; align-items:center; gap:8px; flex-shrink:0 }
    @media(min-width:960px){ .av-header-ctas { display:flex } }
    .av-btn-book {
      padding:8px 16px; background:var(--g3); color:#fff; border-radius:var(--r8);
      font-size:13px; font-weight:700; text-decoration:none;
      box-shadow:0 2px 8px rgba(26,107,42,.25); transition:all var(--ease);
    }
    .av-btn-book:hover { background:var(--g4) }

    /* Mobile icons */
    .av-mob-icons { display:flex; align-items:center; gap:6px; margin-left:auto }
    @media(min-width:960px){ .av-mob-icons { display:none } }
    .av-icon-btn {
      width:38px; height:38px; border:1.5px solid var(--border); border-radius:var(--r8);
      background:var(--bg); display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:var(--ink3); transition:all var(--ease); text-decoration:none;
    }
    .av-icon-btn:hover { border-color:var(--g3); color:var(--g3); background:var(--g-ll) }

    /* Burger */
    .av-burger {
      display:flex; flex-direction:column; gap:5px;
      width:38px; height:38px; padding:10px 9px;
      border:1.5px solid var(--border); border-radius:var(--r8);
      background:var(--bg); cursor:pointer; border-style:solid;
    }
    @media(min-width:960px){ .av-burger { display:none } }
    .av-burger-line { display:block; width:100%; height:2px; background:var(--ink); border-radius:2px; transition:all .28s }
    .av-burger.open .av-burger-line:nth-child(1) { transform:translateY(7px) rotate(45deg) }
    .av-burger.open .av-burger-line:nth-child(2) { opacity:0; transform:scaleX(0) }
    .av-burger.open .av-burger-line:nth-child(3) { transform:translateY(-7px) rotate(-45deg) }

    /* Mobile menu */
    .av-mm { position:fixed; inset:0; top:var(--nav); z-index:850; display:none }
    .av-mm.open { display:block }
    .av-mm-backdrop { position:absolute; inset:0; background:rgba(7,16,10,.55); backdrop-filter:blur(8px) }
    .av-mm-panel {
      position:absolute; top:0; left:0; right:0;
      background:var(--white); border-bottom:1px solid var(--border);
      max-height:calc(100vh - var(--nav)); overflow-y:auto;
      animation:avSlideDown .22s ease;
    }
    @keyframes avSlideDown { from { transform:translateY(-10px); opacity:0 } to { transform:translateY(0); opacity:1 } }

    .av-mm-item { border-bottom:1px solid var(--bg2) }
    .av-mm-btn {
      width:100%; display:flex; align-items:center; justify-content:space-between;
      padding:14px 16px; font-size:15px; font-weight:700; color:var(--ink2);
      background:none; text-align:left; cursor:pointer; border:none;
      font-family:var(--font-b,'Cabinet Grotesk',sans-serif);
    }
    .av-mm-sub {
      max-height:0; overflow:hidden;
      transition:max-height .3s ease, padding .3s ease;
      background:var(--bg);
    }
    .av-mm-sub.open { max-height:600px; padding:4px 0 8px }
    .av-mm-btn svg.av-chevron { transition:transform .25s ease; flex-shrink:0 }
    .av-mm-btn.open svg.av-chevron { transform:rotate(90deg) }
    .av-mm-sub-link {
      display:flex; align-items:center; gap:9px;
      padding:10px 28px; cursor:pointer;
      transition:all var(--ease); font-size:13.5px; font-weight:600;
      color:var(--ink2); text-decoration:none;
    }
    .av-mm-sub-link:hover { background:var(--g-ll); color:var(--g3) }
    .av-mm-cta {
      padding:14px; display:grid; grid-template-columns:1fr 1fr;
      gap:8px; border-top:1px solid var(--bg2);
    }
    .av-mm-cta-btn {
      padding:11px; border-radius:var(--r10); font-size:13.5px; font-weight:700;
      cursor:pointer; text-align:center; text-decoration:none; display:block; border:none;
      font-family:var(--font-b,'Cabinet Grotesk',sans-serif);
    }
    .av-mm-cta-ghost {
      background:var(--bg2); color:var(--ink3); border:1.5px solid var(--border) !important;
      border-style:solid !important;
    }
    .av-mm-cta-primary { background:var(--g3); color:#fff }
    .av-wrap { max-width:1260px; margin:0 auto; padding:0 20px }
    @media(min-width:768px){ .av-wrap { padding:0 32px } }
  `;
  document.head.appendChild(style);

  /* ── 3. Build the HTML ── */
  const chevSVG = `<svg class="av-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>`;

  const topbarHTML = `
  <div class="av-topbar">
    <div class="av-wrap av-topbar-in">
      <div style="display:flex;align-items:center;gap:18px">
        <span class="av-topbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <a href="tel:+9779701076240">+977-9701076240</a>
        </span>
        <span class="av-topbar-sep"></span>
        <span class="av-topbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Mon–Sat · 9am–6pm
        </span>
        <span class="av-topbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Nayabazar, Kathmandu
        </span>
      </div>
    </div>
  </div>`;

  const headerHTML = `
  <header class="av-header" id="av-header">
    <div class="av-header-in">

      <a class="av-logo" href="index.html">
        <img src="assets/images/cars/logo.PNG" alt="AutoViindu" class="av-logo-img">
      </a>

      <nav class="av-header-nav">

        <a class="av-hn-link ${isActive(['index.html', ''])}" href="index.html">Home</a>

        <!-- New Cars ▾ -->
        <div class="av-nav-dropdown">
          <a class="av-hn-link ${isActive(['cars'])}" href="index.html#cars">New Cars ⌄</a>
          <div class="av-nav-dd">
            <div class="av-nav-dd-hd">Browse by Type</div>
            <a class="av-nav-dd-item" href="index.html#cars">
              <div class="av-nav-dd-item-title">All New Cars</div>
              <div class="av-nav-dd-sub">Full catalogue · all brands</div>
            </a>
            <a class="av-nav-dd-item" href="index.html#electric">
              <div class="av-nav-dd-item-title">Electric Cars</div>
              <div class="av-nav-dd-sub">Zero emissions · V2L ready</div>
            </a>
            <a class="av-nav-dd-item" href="index.html#hybrid">
              <div class="av-nav-dd-item-title">Hybrid Cars</div>
              <div class="av-nav-dd-sub">Best of both worlds</div>
            </a>
            <div class="av-nav-dd-divider"></div>
            <a class="av-nav-dd-item" href="index.html#cars">
              <div class="av-nav-dd-item-title">SUVs</div>
              <div class="av-nav-dd-sub">Capable · spacious · tough</div>
            </a>
            <a class="av-nav-dd-item" href="index.html#cars">
              <div class="av-nav-dd-item-title">Sedans &amp; Hatchbacks</div>
              <div class="av-nav-dd-sub">Comfort, style &amp; efficiency</div>
            </a>
          </div>
        </div>

        <!-- Used Cars ▾ -->
        <div class="av-nav-dropdown">
          <a class="av-hn-link ${isActive(['used'])}" href="index.html#used">Used Cars ⌄</a>
          <div class="av-nav-dd">
            <div class="av-nav-dd-hd">Pre-Owned</div>
            <a class="av-nav-dd-item" href="index.html#used">
              <div class="av-nav-dd-item-title">Browse Used Cars</div>
              <div class="av-nav-dd-sub">Verified · certified pre-owned</div>
            </a>
            <a class="av-nav-dd-item" href="tel:+9779701076240">
              <div class="av-nav-dd-item-title">Sell Your Car</div>
              <div class="av-nav-dd-sub">Get instant valuation</div>
            </a>
          </div>
        </div>

        <!-- Compare ▾ -->
        <div class="av-nav-dropdown">
          <a class="av-hn-link ${isActive(['compare'])}" href="index.html#compare">Compare ⌄</a>
          <div class="av-nav-dd">
            <div class="av-nav-dd-hd">Compare Cars</div>
            <a class="av-nav-dd-item" href="index.html#compare">
              <div class="av-nav-dd-item-title">Start Comparison</div>
              <div class="av-nav-dd-sub">Pick and compare side-by-side</div>
            </a>
            <a class="av-nav-dd-item" href="index.html#compare">
              <div class="av-nav-dd-item-title">MG ZS EV vs BYD Atto 3</div>
              <div class="av-nav-dd-sub">Popular EV comparison in Nepal</div>
            </a>
            <a class="av-nav-dd-item" href="index.html#compare">
              <div class="av-nav-dd-item-title">Venue vs Sonet</div>
              <div class="av-nav-dd-sub">Compact SUV rivals</div>
            </a>
          </div>
        </div>

        <!-- Services ▾ -->
        <div class="av-nav-dropdown">
          <a class="av-hn-link ${isActive(['services.html','dotm-services.html','parts-accessories.html','maintenance-repairs.html','insurance-services.html','other-services.html','book-service.html'])}" href="services.html">Our Services ⌄</a>
          <div class="av-nav-dd" style="min-width:246px">
            <div class="av-nav-dd-hd">All Services</div>
            <a class="av-nav-dd-item" href="dotm-services.html">
              <div class="av-nav-dd-item-title">DOTM Services</div>
              <div class="av-nav-dd-sub">Bluebook, fitness, transfers</div>
            </a>
            <a class="av-nav-dd-item" href="parts-accessories.html">
              <div class="av-nav-dd-item-title">Parts &amp; Accessories</div>
              <div class="av-nav-dd-sub">Genuine OEM &amp; accessories</div>
            </a>
            <a class="av-nav-dd-item" href="maintenance-repairs.html">
              <div class="av-nav-dd-item-title">Maintenance &amp; Repairs</div>
              <div class="av-nav-dd-sub">Servicing, AC, EV diagnostics</div>
            </a>
            <a class="av-nav-dd-item" href="insurance-services.html">
              <div class="av-nav-dd-item-title">Insurance &amp; Financing</div>
              <div class="av-nav-dd-sub">EMI plans, insurance, trade-in</div>
            </a>
            <a class="av-nav-dd-item" href="other-services.html">
              <div class="av-nav-dd-item-title">Other Services</div>
              <div class="av-nav-dd-sub">GPS, ceramic coat, roadside</div>
            </a>
          </div>
        </div>

        <!-- Videos ▾ -->
        <div class="av-nav-dropdown">
          <a class="av-hn-link ${isActive(['videos.html'])}" href="videos.html">Videos ⌄</a>
          <div class="av-nav-dd">
            <div class="av-nav-dd-hd">Watch &amp; Explore</div>
            <a class="av-nav-dd-item" href="videos.html">
              <div class="av-nav-dd-item-title">Latest Videos</div>
              <div class="av-nav-dd-sub">New uploads &amp; trending reels</div>
            </a>
            <a class="av-nav-dd-item" href="videos.html?type=reviews">
              <div class="av-nav-dd-item-title">Car Reviews</div>
              <div class="av-nav-dd-sub">Detailed walkarounds</div>
            </a>
            <a class="av-nav-dd-item" href="videos.html?type=ev">
              <div class="av-nav-dd-item-title">EV Videos</div>
              <div class="av-nav-dd-sub">Electric cars in Nepal</div>
            </a>
          </div>
        </div>

      </nav>

      <div class="av-header-ctas">
        <a href="book-service.html" class="av-btn-book">Book Service</a>
      </div>

      <div class="av-mob-icons">
        <a href="index.html#compare" class="av-icon-btn" title="Compare">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
        </a>
      </div>

      <button class="av-burger" id="av-burger" aria-label="Menu">
        <span class="av-burger-line"></span>
        <span class="av-burger-line"></span>
        <span class="av-burger-line"></span>
      </button>

    </div>
  </header>`;

  /* mobile menu accordion items */
  function mmItem(id, label, links) {
    return `
    <div class="av-mm-item">
      <button class="av-mm-btn" id="av-mm-${id}-btn" type="button">
        <span>${label}</span>${chevSVG}
      </button>
      <div class="av-mm-sub" id="av-mm-${id}-sub">
        ${links.map(([href, text]) => `<a class="av-mm-sub-link" href="${href}">${text}</a>`).join('')}
      </div>
    </div>`;
  }

  const mobileMenuHTML = `
  <div class="av-mm" id="av-mm">
    <div class="av-mm-backdrop" id="av-mm-backdrop"></div>
    <div class="av-mm-panel">

      <div class="av-mm-item">
        <a class="av-mm-btn" href="index.html" style="text-decoration:none">Home</a>
      </div>

      ${mmItem('cars', 'New Cars', [
        ['index.html#cars',     'All New Cars'],
        ['index.html#electric', 'Electric Cars'],
        ['index.html#hybrid',   'Hybrid Cars'],
        ['index.html#cars',     'SUVs'],
        ['index.html#cars',     'Sedans'],
        ['index.html#cars',     'Hatchbacks'],
      ])}

      ${mmItem('used', 'Used Cars', [
        ['index.html#used', 'Browse Used Cars'],
        ['tel:+9779701076240', 'Sell Your Car'],
        ['index.html#used', 'Certified Cars'],
      ])}

      ${mmItem('compare', 'Compare Cars', [
        ['index.html#compare', 'Start Comparison'],
        ['index.html#compare', 'MG ZS EV vs BYD Atto 3'],
        ['index.html#compare', 'Tata Nexon vs Punch'],
        ['index.html#compare', 'Venue vs Sonet'],
      ])}

      ${mmItem('services', 'Services', [
        ['dotm-services.html',       'DOTM Services'],
        ['parts-accessories.html',   'Parts & Accessories'],
        ['maintenance-repairs.html', 'Maintenance & Repairs'],
        ['insurance-services.html',  'Insurance & Financing'],
        ['other-services.html',      'Other Services'],
      ])}

      ${mmItem('videos', 'Videos', [
        ['videos.html',              'Latest Videos'],
        ['videos.html?type=reviews', 'Car Reviews'],
        ['videos.html?type=shorts',  'Short Reels'],
        ['videos.html?type=ev',      'EV Videos'],
      ])}

      <div class="av-mm-cta">
        <a href="tel:+9779701076240" class="av-mm-cta-btn av-mm-cta-ghost">Call Us</a>
        <a href="book-service.html"  class="av-mm-cta-btn av-mm-cta-primary">Book Service</a>
      </div>

      <div style="padding:14px 16px 20px;border-top:1px solid var(--bg2,#eff6f2)">
        <a href="tel:+9779701076240" style="display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--g3,#1a6b2a);text-decoration:none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          +977-9701076240
        </a>
        <div style="font-size:12px;color:var(--ink4,#7a9483);margin-top:3px;margin-left:24px">Mon–Sat · 9am–6pm</div>
      </div>

    </div>
  </div>`;

  /* ── 4. Inject into DOM ── */
  const container = document.createElement('div');
  container.id = 'av-nav-root';
  container.innerHTML = topbarHTML + headerHTML + mobileMenuHTML;
  document.body.insertBefore(container, document.body.firstChild);

  /* ── 5. Behaviour: scroll shadow ── */
  window.addEventListener('scroll', function () {
    document.getElementById('av-header')?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── 6. Behaviour: burger + mobile accordion ── */
  document.addEventListener('DOMContentLoaded', function () {
    const burger   = document.getElementById('av-burger');
    const mm       = document.getElementById('av-mm');
    const backdrop = document.getElementById('av-mm-backdrop');

    function closeMM() {
      mm?.classList.remove('open');
      burger?.classList.remove('open');
      document.body.style.overflow = '';
    }

    burger?.addEventListener('click', function () {
      const open = mm.classList.contains('open');
      if (open) { closeMM(); }
      else { mm.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });

    backdrop?.addEventListener('click', closeMM);

    /* accordion */
    ['cars', 'used', 'compare', 'services', 'videos'].forEach(function (id) {
      const btn = document.getElementById('av-mm-' + id + '-btn');
      const sub = document.getElementById('av-mm-' + id + '-sub');
      if (!btn || !sub) return;
      btn.addEventListener('click', function () {
        const isOpen = sub.classList.contains('open');
        /* close all */
        document.querySelectorAll('.av-mm-sub').forEach(s => s.classList.remove('open'));
        document.querySelectorAll('.av-mm-btn').forEach(b => b.classList.remove('open'));
        if (!isOpen) { sub.classList.add('open'); btn.classList.add('open'); }
      });
    });

    /* close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMM();
    });
  });

})();