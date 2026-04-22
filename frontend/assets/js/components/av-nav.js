/*!
 * AutoViindu — Shared Navigation Component  v2.0
 * Usage: <script src="components/av-nav.js"></script>
 * Place this BEFORE </body> or right after <body>
 *
 * Injects: topbar + site-header (multi-column dropdowns) + mobile-menu
 * Works on ALL standalone pages (dotm-services, parts, etc.)
 */
(function () {
  'use strict';

  /* ── 1. Active-page detection ── */
  const path = location.pathname.split('/').pop() || 'index.html';
  function isActive(pages) {
    return pages.some(p => path === p || path.startsWith(p.replace('.html', ''))) ? 'active' : '';
  }

  /* ── 2. Shared CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* ── Tokens ── */
    :root {
      --g0:#0a1a0d;--g1:#0f2414;--g2:#143018;--g3:#1a6b2a;--g4:#22883a;--g5:#2ea84a;
      --g-l:#e8f5ec;--g-ll:#f4fbf6;--g-lll:#f9fdfb;
      --gold:#c49a1e;--gold-t:#d4aa2e;
      --ink:#07100a;--ink2:#1a2b1f;--ink3:#3d5445;--ink4:#7a9483;--ink5:#b8cdbf;
      --white:#fff;--bg:#f6faf7;--bg2:#eff6f2;--bg3:#e4eee8;
      --border:#d6e6db;--border2:#c4daca;
      --r4:4px;--r8:8px;--r10:10px;--r12:12px;--r16:16px;--r20:20px;--r24:24px;--pill:999px;
      --nav:64px;
      --sh1:0 1px 4px rgba(0,0,0,.06);--sh2:0 4px 16px rgba(0,0,0,.08);--sh3:0 12px 40px rgba(0,0,0,.12);
      --ease:.22s cubic-bezier(.4,0,.2,1);--spring:.4s cubic-bezier(.34,1.56,.64,1);
      --font-d:'Clash Display',sans-serif;--font-b:'Cabinet Grotesk',sans-serif;
    }

    /* ── Topbar ── */
    .av-topbar{background:var(--g0);padding:7px 0;display:none}
    @media(min-width:768px){.av-topbar{display:block}}
    .av-topbar-in{display:flex;align-items:center;justify-content:space-between}
    .av-topbar-left{display:flex;align-items:center;gap:18px}
    .av-topbar-item{font-size:11.5px;color:rgba(255,255,255,.35);display:flex;align-items:center;gap:5px;transition:color var(--ease);cursor:pointer}
    .av-topbar-item:hover{color:rgba(255,255,255,.7)}
    .av-topbar-item a{color:inherit;text-decoration:none}
    .av-topbar-sep{width:1px;height:10px;background:rgba(255,255,255,.08)}

    /* ── Header shell ── */
    .av-header{
      position:sticky;top:0;z-index:900;
      background:rgba(255,255,255,.97);backdrop-filter:blur(20px);
      border-bottom:1px solid var(--border);box-shadow:var(--sh1);
      transition:box-shadow var(--ease);
    }
    .av-header.scrolled{box-shadow:var(--sh2)}
    .av-header-in{
      display:flex;align-items:center;height:var(--nav);gap:10px;
      max-width:1260px;margin:0 auto;padding:0 20px;
    }
    @media(min-width:768px){.av-header-in{padding:0 32px}}
    @media(min-width:1280px){.av-header-in{padding:0 24px}}

    /* ── Logo ── */
    .av-logo{display:flex;align-items:center;cursor:pointer;flex-shrink:0;text-decoration:none}
    .av-logo-img{
      height:38px;width:auto;display:block;object-fit:contain;
      animation:avLogoIn .6s cubic-bezier(.25,.46,.45,.94) forwards;
    }
    @keyframes avLogoIn{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}

    /* ── Desktop nav ── */
    .av-header-nav{display:none;align-items:center;gap:2px;margin-left:auto;flex-shrink:0}
    @media(min-width:960px){.av-header-nav{display:flex}}

    /* ── Nav items & top links ── */
    .av-item{position:relative}
    /* bridge so mouse crossing gap doesn't close menu */
    .av-item::after{content:"";position:absolute;top:100%;left:0;right:0;height:8px}

    .av-link{
      display:flex;align-items:center;gap:4px;
      height:var(--nav);padding:0 13px;
      font-size:13.5px;font-weight:600;color:var(--ink3);
      cursor:pointer;white-space:nowrap;
      background:none;border:none;border-bottom:2px solid transparent;
      font-family:var(--font-b);text-decoration:none;
      transition:color .15s,border-color .15s;user-select:none;
    }
    .av-link:hover,.av-link.active,.av-item.open>.av-link{
      color:var(--g3);border-bottom-color:var(--g3);
    }

    /* chevron */
    .av-chev{width:10px;height:6px;opacity:.5;transition:transform var(--ease);flex-shrink:0}
    .av-item.open>.av-link .av-chev{transform:rotate(180deg)}

    /* ── Dropdown panel ── */
    .av-dd{
      position:absolute;top:calc(100% + 2px);left:0;
      display:flex;
      background:var(--white);
      border:.5px solid rgba(0,0,0,.14);border-radius:var(--r12);
      box-shadow:0 8px 32px rgba(0,0,0,.10),0 2px 8px rgba(0,0,0,.06);
      z-index:999;overflow:hidden;
      /* hidden state */
      opacity:0;visibility:hidden;
      transform:translateY(6px);pointer-events:none;
      transition:opacity var(--ease),transform var(--ease),visibility var(--ease);
    }
    .av-dd.av-dd--r{left:auto;right:0}
    .av-item.open>.av-dd{
      opacity:1;visibility:visible;
      transform:translateY(0);pointer-events:auto;
    }

    /* ── Column ── */
    .av-col{min-width:185px;padding:8px 0}
    .av-col+.av-col{border-left:.5px solid rgba(0,0,0,.08)}

    /* ── Section label ── */
    .av-lbl{
      display:block;font-size:10.5px;font-weight:600;
      letter-spacing:.07em;text-transform:uppercase;
      color:#6e6e73;padding:12px 14px 5px;
      font-family:var(--font-b);
    }

    /* ── Row (dropdown link) ── */
    .av-row{
      display:flex;align-items:center;justify-content:space-between;gap:8px;
      padding:7px 14px;cursor:pointer;text-decoration:none;
      color:var(--ink);font-size:13.5px;transition:background .12s;
      font-family:var(--font-b);
    }
    .av-row:hover{background:var(--bg2)}
    .av-ri{display:flex;flex-direction:column}
    .av-rt{font-size:13.5px;color:var(--ink);line-height:1.3}
    .av-rs{font-size:11.5px;color:#6e6e73;margin-top:1px}

    /* ── Separator ── */
    .av-sep{height:.5px;background:rgba(0,0,0,.08);margin:5px 14px}

    /* ── Badges ── */
    .av-b{
      font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;
      flex-shrink:0;letter-spacing:.02em;white-space:nowrap;
    }
    .av-b--g{background:#d6f2e7;color:#0d6b4f}
    .av-b--o{background:#fde8d0;color:#7d4310}
    .av-b--b{background:#daeaf9;color:#1458a0}

    /* ── CTAs ── */
    .av-header-ctas{display:none;align-items:center;gap:8px;flex-shrink:0}
    @media(min-width:960px){.av-header-ctas{display:flex}}
    .av-btn-sell{
      padding:8px 14px;background:var(--bg);border:1.5px solid var(--border);
      border-radius:var(--r8);font-size:13px;font-weight:700;color:var(--ink2);
      cursor:pointer;transition:all var(--ease);text-decoration:none;
      font-family:var(--font-b);
    }
    .av-btn-sell:hover{border-color:var(--g3);color:var(--g3);background:var(--g-ll)}
    .av-btn-book{
      padding:8px 16px;background:var(--g3);color:#fff;border-radius:var(--r8);
      font-size:13px;font-weight:700;box-shadow:0 2px 8px rgba(26,107,42,.25);
      cursor:pointer;transition:all var(--ease);text-decoration:none;
      font-family:var(--font-b);
    }
    .av-btn-book:hover{background:var(--g4)}

    /* ── Mobile icons ── */
    .av-mob-icons{display:flex;align-items:center;gap:6px;margin-left:auto}
    @media(min-width:960px){.av-mob-icons{display:none}}
    .av-icon-btn{
      width:38px;height:38px;border:1.5px solid var(--border);border-radius:var(--r8);
      background:var(--bg);display:flex;align-items:center;justify-content:center;
      cursor:pointer;color:var(--ink3);transition:all var(--ease);text-decoration:none;
    }
    .av-icon-btn:hover{border-color:var(--g3);color:var(--g3);background:var(--g-ll)}

    /* ── Burger ── */
    .av-burger{
      display:flex;flex-direction:column;gap:5px;
      width:38px;height:38px;padding:10px 9px;
      border:1.5px solid var(--border);border-radius:var(--r8);
      background:var(--bg);cursor:pointer;
    }
    @media(min-width:960px){.av-burger{display:none}}
    .av-burger-line{display:block;width:100%;height:2px;background:var(--ink);border-radius:2px;transition:all .28s}
    .av-burger.open .av-burger-line:nth-child(1){transform:translateY(7px) rotate(45deg)}
    .av-burger.open .av-burger-line:nth-child(2){opacity:0;transform:scaleX(0)}
    .av-burger.open .av-burger-line:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

    /* ── Mobile menu ── */
    .av-mm{position:fixed;inset:0;top:var(--nav);z-index:850;display:none}
    .av-mm.open{display:block}
    .av-mm-backdrop{position:absolute;inset:0;background:rgba(7,16,10,.55);backdrop-filter:blur(8px)}
    .av-mm-panel{
      position:absolute;top:0;left:0;right:0;
      background:var(--white);border-bottom:1px solid var(--border);
      max-height:calc(100vh - var(--nav));overflow-y:auto;
      animation:avMmIn .22s ease;
    }
    @keyframes avMmIn{from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}

    .av-mm-item{border-bottom:1px solid var(--bg2)}
    .av-mm-btn{
      width:100%;display:flex;align-items:center;justify-content:space-between;
      padding:14px 16px;font-size:15px;font-weight:700;color:var(--ink2);
      background:none;text-align:left;cursor:pointer;border:none;text-decoration:none;
      font-family:var(--font-b,'Cabinet Grotesk',sans-serif);
    }
    .av-mm-sub{
      max-height:0;overflow:hidden;background:var(--bg);
      transition:max-height .3s ease,padding .3s ease;
    }
    .av-mm-sub.open{max-height:800px;padding:4px 0 8px}
    .av-mm-btn svg.av-mm-chev{transition:transform .25s ease;flex-shrink:0}
    .av-mm-btn.open svg.av-mm-chev{transform:rotate(90deg)}
    .av-mm-sub-label{
      font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;
      color:var(--ink4);padding:10px 28px 4px;font-family:var(--font-b);
    }
    .av-mm-sub-link{
      display:flex;align-items:center;gap:9px;
      padding:9px 28px;cursor:pointer;transition:all var(--ease);
      font-size:13.5px;font-weight:600;color:var(--ink2);text-decoration:none;
    }
    .av-mm-sub-link:hover{background:var(--g-ll);color:var(--g3)}
    .av-mm-cta{
      padding:14px;display:grid;grid-template-columns:1fr 1fr;
      gap:8px;border-top:1px solid var(--bg2);
    }
    .av-mm-cta-btn{
      padding:11px;border-radius:var(--r10);font-size:13.5px;font-weight:700;
      cursor:pointer;text-align:center;text-decoration:none;display:block;
      font-family:var(--font-b,'Cabinet Grotesk',sans-serif);
    }
    .av-mm-cta-ghost{
      background:var(--bg2);color:var(--ink3);
      border:1.5px solid var(--border);
    }
    .av-mm-cta-primary{background:var(--g3);color:#fff;border:none}

    /* wrap util */
    .av-wrap{max-width:1260px;margin:0 auto;padding:0 20px}
    @media(min-width:768px){.av-wrap{padding:0 32px}}
    @media(min-width:1280px){.av-wrap{padding:0 24px}}
  `;
  document.head.appendChild(style);

  /* ── 3. Helper: chevron SVG ── */
  const chev = `<svg class="av-chev" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const mmChev = `<svg class="av-mm-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>`;

  /* ── 4. Topbar ── */
  const topbarHTML = `
  <div class="av-topbar">
    <div class="av-wrap av-topbar-in">
      <div class="av-topbar-left">
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

  /* ── 5. Header with full multi-column dropdowns ── */
  const headerHTML = `
  <header class="av-header" id="av-header">
    <div class="av-header-in">

      <a class="av-logo" href="index.html">
        <img src="/frontend/assets/images/cars/brands/logo.png" alt="AutoViindu" class="av-logo-img">
      </a>

      <nav class="av-header-nav">

        <!-- HOME -->
        <div class="av-item">
          <a class="av-link ${isActive(['index.html',''])}" href="index.html">Home</a>
        </div>

        <!-- NEW CARS -->
        <div class="av-item">
          <button class="av-link ${isActive(['cars'])}">New Cars ${chev}</button>
          <div class="av-dd">

            <div class="av-col">
              <span class="av-lbl">Body type</span>
              <a class="av-row" href="index.html#suv">
                <div class="av-ri"><span class="av-rt">SUV / Crossover</span><span class="av-rs">Nepal's #1 category</span></div>
              </a>
              <a class="av-row" href="index.html#sedan">
                <div class="av-ri"><span class="av-rt">Sedan</span><span class="av-rs">Family &amp; city comfort</span></div>
              </a>
              <a class="av-row" href="index.html#hatchback">
                <div class="av-ri"><span class="av-rt">Hatchback</span><span class="av-rs">Compact city cars</span></div>
              </a>
              <a class="av-row" href="index.html#pickup">
                <div class="av-ri"><span class="av-rt">Pickup / Truck</span><span class="av-rs">Off-road &amp; commercial</span></div>
              </a>
              <a class="av-row" href="index.html#van">
                <div class="av-ri"><span class="av-rt">Van / MPV</span><span class="av-rs">Passenger &amp; cargo</span></div>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Terrain</span>
              <a class="av-row" href="index.html#mountain">
                <div class="av-ri"><span class="av-rt">Mountain &amp; Hilly Roads</span><span class="av-rs">High ground clearance</span></div>
              </a>
              <a class="av-row" href="index.html#city">
                <div class="av-ri"><span class="av-rt">City Commute</span><span class="av-rs">Compact &amp; fuel-efficient</span></div>
              </a>
            </div>

            <div class="av-col">
              <span class="av-lbl">Fuel type</span>
              <a class="av-row" href="index.html#electric">
                <div class="av-ri"><span class="av-rt">Electric (EV)</span><span class="av-rs">Fastest growing in Nepal</span></div>
                <span class="av-b av-b--g">Trending</span>
              </a>
              <a class="av-row" href="index.html#hybrid">
                <div class="av-ri"><span class="av-rt">Hybrid</span><span class="av-rs">Best of both worlds</span></div>
              </a>
              <a class="av-row" href="index.html#petrol">
                <div class="av-ri"><span class="av-rt">Petrol</span><span class="av-rs">Widest availability</span></div>
              </a>
              <a class="av-row" href="index.html#diesel">
                <div class="av-ri"><span class="av-rt">Diesel</span><span class="av-rs">Torque &amp; economy</span></div>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Budget</span>
              <a class="av-row" href="index.html#budget-under20"><div class="av-ri"><span class="av-rt">Under Rs. 20L</span></div></a>
              <a class="av-row" href="index.html#budget-20to40"><div class="av-ri"><span class="av-rt">Rs. 20L – Rs. 40L</span></div></a>
              <a class="av-row" href="index.html#budget-40to70"><div class="av-ri"><span class="av-rt">Rs. 40L – Rs. 70L</span></div></a>
              <a class="av-row" href="index.html#budget-70plus"><div class="av-ri"><span class="av-rt">Rs. 70L+</span></div></a>
            </div>

            <div class="av-col">
              <span class="av-lbl">Quick finds</span>
              <a class="av-row" href="index.html#latest"><div class="av-ri"><span class="av-rt">Latest arrivals</span></div></a>
              <a class="av-row" href="index.html#upcoming">
                <div class="av-ri"><span class="av-rt">Upcoming launches</span><span class="av-rs">Expected price &amp; date</span></div>
                <span class="av-b av-b--o">New</span>
              </a>
              <a class="av-row" href="index.html#bestseller"><div class="av-ri"><span class="av-rt">Best sellers in Nepal</span></div></a>
              <a class="av-row" href="index.html#brands"><div class="av-ri"><span class="av-rt">Browse by brand</span></div></a>
            </div>

          </div>
        </div>

        <!-- USED CARS -->
        <div class="av-item">
          <button class="av-link ${isActive(['used'])}">Used Cars ${chev}</button>
          <div class="av-dd">
            <div class="av-col" style="min-width:225px">
              <span class="av-lbl">Pre-owned</span>
              <a class="av-row" href="index.html#used">
                <div class="av-ri"><span class="av-rt">Browse used cars</span><span class="av-rs">Verified · certified pre-owned</span></div>
              </a>
              <a class="av-row" href="index.html#used-certified">
                <div class="av-ri"><span class="av-rt">Certified used cars</span><span class="av-rs">140-point inspected</span></div>
                <span class="av-b av-b--b">Verified</span>
              </a>
              <a class="av-row" href="index.html#used-history">
                <div class="av-ri"><span class="av-rt">Vehicle history report</span><span class="av-rs">Accident &amp; ownership check</span></div>
              </a>
              <a class="av-row" href="tel:+9779701076240">
                <div class="av-ri"><span class="av-rt">Sell your car</span><span class="av-rs">Get instant valuation</span></div>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Filter by</span>
              <a class="av-row" href="index.html#used-year"><div class="av-ri"><span class="av-rt">Year</span></div></a>
              <a class="av-row" href="index.html#used-price"><div class="av-ri"><span class="av-rt">Price range</span></div></a>
              <a class="av-row" href="index.html#used-mileage">
                <div class="av-ri"><span class="av-rt">Mileage</span><span class="av-rs">Low km preferred</span></div>
              </a>
              <a class="av-row" href="index.html#used-brand"><div class="av-ri"><span class="av-rt">Brand</span></div></a>
              <div class="av-sep"></div>
              <span class="av-lbl">Finance</span>
              <a class="av-row" href="index.html#emi">
                <div class="av-ri"><span class="av-rt">EMI calculator</span><span class="av-rs">Check monthly payments</span></div>
              </a>
              <a class="av-row" href="insurance-services.html">
                <div class="av-ri"><span class="av-rt">Banks &amp; finance options</span></div>
              </a>
            </div>
          </div>
        </div>

        <!-- COMPARE -->
        <div class="av-item">
          <button class="av-link ${isActive(['compare'])}">Compare ${chev}</button>
          <div class="av-dd">

            <div class="av-col" style="min-width:205px">
              <span class="av-lbl">Tools</span>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">New car comparison</span><span class="av-rs">Side-by-side specs &amp; price</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">EV vs Petrol</span><span class="av-rs">Real cost over 5 years</span></div>
                <span class="av-b av-b--g">Popular</span>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Hybrid vs EV</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Compare up to 5 cars</span></div>
                <span class="av-b av-b--o">New</span>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Smart compare</span>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">True cost calculator</span><span class="av-rs">Price + tax + fuel + maintenance</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Nepal road suitability</span></div>
              </a>
            </div>

            <div class="av-col" style="min-width:215px">
              <span class="av-lbl">Popular comparisons</span>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">MG ZS EV vs BYD Atto 3</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Hyundai Creta vs Kia Seltos</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Tata Nexon vs Punch</span><span class="av-rs">Budget SUV battle</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Hyundai Venue vs Sonet</span><span class="av-rs">Compact SUV rivals</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Maruti Swift vs Hyundai i20</span><span class="av-rs">Hatchback showdown</span></div>
              </a>
              <a class="av-row" href="index.html#compare">
                <div class="av-ri"><span class="av-rt">Fortuner vs Endeavour</span></div>
              </a>
            </div>

          </div>
        </div>

        <!-- SERVICES -->
        <div class="av-item">
          <a class="av-link ${isActive(['services.html','dotm-services.html','parts-accessories.html','maintenance-repairs.html','insurance-services.html','other-services.html','book-service.html'])}" href="services.html">Services ${chev}</a>
          <div class="av-dd">
            <div class="av-col" style="min-width:230px">
              <span class="av-lbl">All services</span>
              <a class="av-row" href="dotm-services.html">
                <div class="av-ri"><span class="av-rt">DOTM services</span><span class="av-rs">Bluebook, fitness, transfers</span></div>
              </a>
              <a class="av-row" href="parts-accessories.html">
                <div class="av-ri"><span class="av-rt">Parts &amp; accessories</span><span class="av-rs">Genuine OEM &amp; accessories</span></div>
              </a>
              <a class="av-row" href="maintenance-repairs.html">
                <div class="av-ri"><span class="av-rt">Maintenance &amp; repairs</span><span class="av-rs">Servicing, AC, EV diagnostics</span></div>
              </a>
              <a class="av-row" href="insurance-services.html">
                <div class="av-ri"><span class="av-rt">Insurance &amp; financing</span><span class="av-rs">EMI plans, insurance, trade-in</span></div>
              </a>
              <a class="av-row" href="other-services.html">
                <div class="av-ri"><span class="av-rt">Other services</span><span class="av-rs">GPS, ceramic coat, roadside</span></div>
              </a>
              <div class="av-sep"></div>
              <a class="av-row" href="book-service.html">
                <div class="av-ri"><span class="av-rt">Book a service</span><span class="av-rs">Schedule your appointment</span></div>
                <span class="av-b av-b--g">Quick</span>
              </a>
            </div>
          </div>
        </div>

        <!-- NEWS & REVIEWS -->
        <div class="av-item">
          <a class="av-link ${isActive(['videos.html'])}" href="videos.html">News &amp; Reviews ${chev}</a>
          <div class="av-dd">

            <div class="av-col">
              <span class="av-lbl">Watch</span>
              <a class="av-row" href="videos.html">
                <div class="av-ri"><span class="av-rt">Latest videos</span><span class="av-rs">New uploads &amp; trending reels</span></div>
              </a>
              <a class="av-row" href="videos.html?type=reviews">
                <div class="av-ri"><span class="av-rt">Car reviews</span><span class="av-rs">Detailed walkarounds</span></div>
              </a>
              <a class="av-row" href="videos.html?type=shorts">
                <div class="av-ri"><span class="av-rt">Short reels</span><span class="av-rs">Quick highlights &amp; clips</span></div>
              </a>
              <a class="av-row" href="videos.html?type=ev">
                <div class="av-ri"><span class="av-rt">EV videos</span><span class="av-rs">Nepal EV revolution</span></div>
              </a>
              <div class="av-sep"></div>
              <span class="av-lbl">Latest news</span>
              <a class="av-row" href="index.html#news"><div class="av-ri"><span class="av-rt">Upcoming launches</span><span class="av-rs">Price &amp; tax updates</span></div></a>
              <a class="av-row" href="index.html#news"><div class="av-ri"><span class="av-rt">Budget, excise &amp; customs</span></div></a>
              <a class="av-row" href="index.html#news"><div class="av-ri"><span class="av-rt">Market trends</span></div></a>
            </div>

            <div class="av-col">
              <span class="av-lbl">Guides &amp; info</span>
              <a class="av-row" href="index.html#guide">
                <div class="av-ri"><span class="av-rt">Buying guide</span><span class="av-rs">Tips for Nepal buyers</span></div>
              </a>
              <a class="av-row" href="index.html#guide">
                <div class="av-ri"><span class="av-rt">Maintenance tips</span><span class="av-rs">Nepal roads &amp; monsoon care</span></div>
              </a>
              <a class="av-row" href="index.html#guide">
                <div class="av-ri"><span class="av-rt">Women &amp; cars</span><span class="av-rs">Growing segment in Nepal</span></div>
              </a>
              <a class="av-row" href="index.html#awards">
                <div class="av-ri"><span class="av-rt">Nepal car awards</span><span class="av-rs">Best cars of the year</span></div>
              </a>
            </div>

          </div>
        </div>

        <!-- TOOLS -->
        <div class="av-item">
          <button class="av-link">
            Tools <span class="av-b av-b--o" style="font-size:10px;padding:2px 6px;border-radius:4px;margin-left:2px">New</span>
            ${chev}
          </button>
          <div class="av-dd av-dd--r">
            <div class="av-col" style="min-width:215px">
              <span class="av-lbl">Smart tools</span>
              <a class="av-row" href="index.html#matchmaker">
                <div class="av-ri"><span class="av-rt">Find my perfect car</span><span class="av-rs">Answer questions, get matched</span></div>
              </a>
              <a class="av-row" href="index.html#emi">
                <div class="av-ri"><span class="av-rt">EMI calculator</span><span class="av-rs">Estimate monthly payments</span></div>
              </a>
              <a class="av-row" href="index.html#charging">
                <div class="av-ri"><span class="av-rt">EV charging map</span><span class="av-rs">Find chargers near you</span></div>
              </a>
              <a class="av-row" href="index.html#testdrive">
                <div class="av-ri"><span class="av-rt">Test drive at home</span></div>
              </a>
              <a class="av-row" href="index.html#tmv">
                <div class="av-ri"><span class="av-rt">True market value</span><span class="av-rs">What others paid in Nepal</span></div>
              </a>
            </div>
          </div>
        </div>

      </nav>

      <div class="av-header-ctas">
        <a href="tel:+9779701076240" class="av-btn-sell">Sell My Car</a>
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

  /* ── 6. Mobile menu ── */
  function mmSection(id, label, groups) {
    /* groups = [{label, links:[{href,text}]}] */
    const inner = groups.map(g => {
      const lbl  = g.label ? `<div class="av-mm-sub-label">${g.label}</div>` : '';
      const rows = g.links.map(l => `<a class="av-mm-sub-link" href="${l.href}">${l.text}</a>`).join('');
      return lbl + rows;
    }).join('');
    return `
    <div class="av-mm-item">
      <button class="av-mm-btn" id="av-mm-${id}-btn" type="button">
        <span>${label}</span>${mmChev}
      </button>
      <div class="av-mm-sub" id="av-mm-${id}-sub">${inner}</div>
    </div>`;
  }

  const mobileMenuHTML = `
  <div class="av-mm" id="av-mm">
    <div class="av-mm-backdrop" id="av-mm-backdrop"></div>
    <div class="av-mm-panel">

      <div class="av-mm-item">
        <a class="av-mm-btn" href="index.html" style="text-decoration:none">Home</a>
      </div>

      ${mmSection('cars', 'New Cars', [
        { label: 'By Body Type', links: [
          { href:'index.html#suv',       text:'SUV / Crossover' },
          { href:'index.html#sedan',     text:'Sedan' },
          { href:'index.html#hatchback', text:'Hatchback' },
          { href:'index.html#pickup',    text:'Pickup / Truck' },
          { href:'index.html#van',       text:'Van / MPV' },
        ]},
        { label: 'By Fuel Type', links: [
          { href:'index.html#electric', text:'Electric (EV)' },
          { href:'index.html#hybrid',   text:'Hybrid' },
          { href:'index.html#petrol',   text:'Petrol' },
          { href:'index.html#diesel',   text:'Diesel' },
        ]},
        { label: 'By Budget', links: [
          { href:'index.html#budget-under20', text:'Under Rs. 20L' },
          { href:'index.html#budget-20to40',  text:'Rs. 20L – 40L' },
          { href:'index.html#budget-40to70',  text:'Rs. 40L – 70L' },
          { href:'index.html#budget-70plus',  text:'Rs. 70L+' },
        ]},
        { label: 'Quick Finds', links: [
          { href:'index.html#latest',     text:'Latest Arrivals' },
          { href:'index.html#upcoming',   text:'Upcoming Launches' },
          { href:'index.html#bestseller', text:'Best Sellers in Nepal' },
          { href:'index.html#brands',     text:'Browse by Brand' },
        ]},
      ])}

      ${mmSection('used', 'Used Cars', [
        { label: '', links: [
          { href:'index.html#used',           text:'Browse Used Cars' },
          { href:'tel:+9779701076240',         text:'Sell Your Car' },
          { href:'index.html#used-certified',  text:'Certified Cars' },
          { href:'index.html#used-history',    text:'Vehicle History Report' },
        ]},
        { label: 'Finance', links: [
          { href:'index.html#emi',         text:'EMI Calculator' },
          { href:'insurance-services.html', text:'Banks & Finance Options' },
        ]},
      ])}

      ${mmSection('compare', 'Compare Cars', [
        { label: '', links: [
          { href:'index.html#compare', text:'Start Comparison' },
          { href:'index.html#compare', text:'MG ZS EV vs BYD Atto 3' },
          { href:'index.html#compare', text:'Tata Nexon vs Punch' },
          { href:'index.html#compare', text:'Hyundai Creta vs Kia Seltos' },
          { href:'index.html#compare', text:'Hyundai Venue vs Sonet' },
          { href:'index.html#compare', text:'Maruti Swift vs Hyundai i20' },
          { href:'index.html#compare', text:'Fortuner vs Endeavour' },
        ]},
        { label: 'Smart Tools', links: [
          { href:'index.html#compare', text:'True Cost Calculator' },
          { href:'index.html#compare', text:'Nepal Road Suitability Score' },
        ]},
      ])}

      ${mmSection('services', 'Our Services', [
        { label: '', links: [
          { href:'dotm-services.html',       text:'DOTM Services' },
          { href:'parts-accessories.html',   text:'Parts & Accessories' },
          { href:'maintenance-repairs.html', text:'Maintenance & Repairs' },
          { href:'insurance-services.html',  text:'Insurance & Financing' },
          { href:'other-services.html',      text:'Other Services' },
          { href:'book-service.html',        text:'Book a Service' },
        ]},
      ])}

      ${mmSection('news', 'News & Reviews', [
        { label: 'Watch', links: [
          { href:'videos.html',              text:'Latest Videos' },
          { href:'videos.html?type=reviews', text:'Car Reviews' },
          { href:'videos.html?type=shorts',  text:'Short Reels' },
          { href:'videos.html?type=ev',      text:'EV Videos' },
        ]},
        { label: 'Latest News', links: [
          { href:'index.html#news', text:'Upcoming Launches' },
          { href:'index.html#news', text:'Budget & Customs News' },
          { href:'index.html#news', text:'Market Trends' },
        ]},
        { label: 'Guides', links: [
          { href:'index.html#guide',  text:'Buying Guide' },
          { href:'index.html#guide',  text:'Maintenance Tips' },
          { href:'index.html#awards', text:'Nepal Car Awards' },
        ]},
      ])}

      ${mmSection('tools', 'Smart Tools', [
        { label: '', links: [
          { href:'index.html#matchmaker', text:'Find My Perfect Car' },
          { href:'index.html#emi',        text:'EMI Calculator' },
          { href:'index.html#charging',   text:'EV Charging Map' },
          { href:'index.html#testdrive',  text:'Test Drive at Home' },
          { href:'index.html#tmv',        text:'True Market Value' },
        ]},
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

  /* ── 7. Inject into DOM ── */
  const container = document.createElement('div');
  container.id = 'av-nav-root';
  container.innerHTML = topbarHTML + headerHTML + mobileMenuHTML;
  document.body.insertBefore(container, document.body.firstChild);

  /* ── 8. Scroll shadow ── */
  window.addEventListener('scroll', function () {
    document.getElementById('av-header')?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── 9. Dropdown hover logic (with gap-bridge + timer) ── */
  (function () {
    var current = null, timer = null;

    function openItem(item) {
      if (current && current !== item) closeItem(current, true);
      clearTimeout(timer);
      item.classList.add('open');
      current = item;
    }

    function closeItem(item, now) {
      if (!item) return;
      if (now) {
        item.classList.remove('open');
        if (current === item) current = null;
      } else {
        timer = setTimeout(function () {
          item.classList.remove('open');
          if (current === item) current = null;
        }, 120);
      }
    }

    /* attach after DOM is ready */
    function attachHover() {
      document.querySelectorAll('#av-nav-root .av-item').forEach(function (item) {
        item.addEventListener('mouseenter', function () { openItem(item); });
        item.addEventListener('mouseleave', function () { closeItem(item); });
        var btn = item.querySelector('.av-link');
        if (btn) {
          btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              item.classList.contains('open') ? closeItem(item, true) : openItem(item);
            }
            if (e.key === 'Escape') closeItem(item, true);
          });
        }
      });

      document.addEventListener('click', function (e) {
        if (current && !current.contains(e.target)) closeItem(current, true);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && current) closeItem(current, true);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachHover);
    } else {
      attachHover();
    }
  })();

  /* ── 10. Mobile menu & accordion ── */
  (function () {
    function init() {
      var burger   = document.getElementById('av-burger');
      var mm       = document.getElementById('av-mm');
      var backdrop = document.getElementById('av-mm-backdrop');

      function closeMM() {
        mm?.classList.remove('open');
        burger?.classList.remove('open');
        document.body.style.overflow = '';
      }

      burger?.addEventListener('click', function () {
        var isOpen = mm.classList.contains('open');
        if (isOpen) { closeMM(); }
        else { mm.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; }
      });

      backdrop?.addEventListener('click', closeMM);

      /* accordion */
      ['cars','used','compare','services','news','tools'].forEach(function (id) {
        var btn = document.getElementById('av-mm-' + id + '-btn');
        var sub = document.getElementById('av-mm-' + id + '-sub');
        if (!btn || !sub) return;
        btn.addEventListener('click', function () {
          var wasOpen = sub.classList.contains('open');
          document.querySelectorAll('.av-mm-sub').forEach(s => s.classList.remove('open'));
          document.querySelectorAll('.av-mm-btn').forEach(b => b.classList.remove('open'));
          if (!wasOpen) { sub.classList.add('open'); btn.classList.add('open'); }
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMM();
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();

})();