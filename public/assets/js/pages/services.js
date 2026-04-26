/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — SERVICES PAGE
   window.renderServices() → renders #services
═══════════════════════════════════════════════════════ */
window.renderServices = function () {
  document.title = 'Car Services Nepal — AutoViindu';
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('services');

  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';
  var phone = IC.phone || '📞';
  var shield = IC.shield || '🛡';

  var services = [
    {
      id: 'maintenance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="28" height="28"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
      color: '#1A6B2A', bg: '#EEF7F0',
      title: 'Maintenance & Repairs', desc: 'Engine servicing, brake checks, oil changes and complete vehicle health.',
      link: 'maintenance', linkLabel: 'Book Service',
      items: ['Engine Oil & Filter', 'Brake Inspection', 'Suspension Check', 'Full Diagnostic Scan'],
    },
    {
      id: 'insurance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="28" height="28"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
      color: '#1A4DB8', bg: '#EEF3FC',
      title: 'Insurance Services', desc: 'Third-party and comprehensive car insurance from Nepal\'s top providers.',
      link: null, linkLabel: 'Get a Quote',
      items: ['Third-Party Insurance', 'Comprehensive Cover', 'Renewal Assistance', 'Claims Support'],
    },
    {
      id: 'parts', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="28" height="28"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93M21 12h-2M5 12H3M12 19v2M12 3v2"/></svg>',
      color: '#B8900E', bg: '#FDF6E0',
      title: 'Parts & Accessories', desc: 'Genuine OEM parts and premium accessories for all popular Nepal car brands.',
      link: null, linkLabel: 'Browse Parts',
      items: ['OEM Genuine Parts', 'Aftermarket Accessories', 'Tyres & Alloys', 'Interior Accessories'],
    },
    {
      id: 'dotm', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="28" height="28"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>',
      color: '#C8271E', bg: '#FFF0EF',
      title: 'DOTM & Registration', desc: 'Vehicle registration, blue book transfers, and DOTM services — hassle-free.',
      link: null, linkLabel: 'Learn More',
      items: ['New Registration', 'Blue Book Transfer', 'Tax Payment Assistance', 'DOTM Inspection'],
    },
    {
      id: 'booking', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="28" height="28"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-.95a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
      color: '#0E7F73', bg: '#E6F5F4',
      title: 'Book a Service', desc: 'Schedule your vehicle service at a time that works for you. Pick-up available.',
      link: null, linkLabel: 'Book Now',
      items: ['Online Scheduling', 'Pick-Up & Drop', 'SMS Reminders', 'Live Job Tracking'],
    },
    {
      id: 'other', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="28" height="28"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
      color: '#6B35C7', bg: '#F0EBFA',
      title: 'Other Services', desc: 'Tinting, body wrap, detailing, and more premium automotive services.',
      link: null, linkLabel: 'Explore',
      items: ['Window Tinting', 'Body Wrap & Detailing', 'Dashcam Installation', 'GPS Tracking Fit'],
    },
  ];

  var statsHtml = [
    ['500+', 'Services Monthly'], ['4.9/5', 'Customer Rating'],
    ['15+', 'Expert Technicians'], ['2hr', 'Avg. Turnaround']
  ].map(function (s) {
    return '<div style="text-align:center;padding:20px 16px;background:var(--white);border:1px solid var(--border);border-radius:var(--r14)">' +
      '<div style="font-family:var(--font-display);font-size:26px;font-weight:800;color:var(--green)">' + s[0] + '</div>' +
      '<div style="font-size:12px;color:var(--ink-4);margin-top:3px">' + s[1] + '</div>' +
      '</div>';
  }).join('');

  var cardsHtml = services.map(function (s) {
    var items = s.items.map(function (item) {
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--bg-2)">' +
        '<span style="color:' + s.color + ';flex-shrink:0">✓</span>' +
        '<span style="font-size:13px;color:var(--ink-2)">' + item + '</span>' +
        '</div>';
    }).join('');

    return '<div style="background:var(--white);border:1.5px solid var(--border);border-radius:var(--r16);overflow:hidden;transition:all var(--ease)" ' +
      'onmouseenter="this.style.borderColor=\'' + s.color + '\';this.style.boxShadow=\'var(--shadow-md)\'" ' +
      'onmouseleave="this.style.borderColor=\'var(--border)\';this.style.boxShadow=\'\'">' +
      '<div style="padding:20px 20px 0">' +
      '<div style="width:52px;height:52px;background:' + s.bg + ';border-radius:var(--r12);display:flex;align-items:center;justify-content:center;color:' + s.color + ';margin-bottom:14px">' + s.icon + '</div>' +
      '<div style="font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--ink);margin-bottom:5px">' + s.title + '</div>' +
      '<p style="font-size:13px;color:var(--ink-4);line-height:1.6;margin-bottom:14px">' + s.desc + '</p>' +
      items +
      '</div>' +
      '<div style="padding:14px 20px;border-top:1px solid var(--bg-2);margin-top:12px">' +
      '<button onclick="' + (s.link ? 'AV.goTo(\'' + s.link + '\')' : 'alert(\'Call us: +977-9701076240\')') + '" ' +
      'style="display:inline-flex;align-items:center;gap:6px;padding:9px 18px;background:' + s.color + ';color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-body);font-size:13px;font-weight:700;cursor:pointer">' +
      s.linkLabel + '</button>' +
      '</div>' +
      '</div>';
  }).join('');

  var root = document.getElementById('app-root');
  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><span style="color:rgba(255,255,255,.7)">Services</span></div>' +
    '<h1 class="page-title">Our Services</h1>' +
    '<div class="page-sub">Complete automotive care across Nepal</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:36px;padding-bottom:64px">' +

    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:40px">' + statsHtml + '</div>' +

    '<div style="display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:48px">' + cardsHtml + '</div>' +

    '<div style="background:var(--ink-2);border-radius:var(--r20);padding:32px;text-align:center">' +
    '<div style="font-family:var(--font-display);font-size:22px;font-weight:700;color:#fff;margin-bottom:8px">Need expert advice?</div>' +
    '<p style="font-size:13px;color:rgba(255,255,255,.45);margin-bottom:18px">Call our automotive specialists for a free consultation — Kathmandu based.</p>' +
    '<a href="tel:+9779701076240" class="btn btn-primary">📞 Call +977-9701076240</a>' +
    '</div>' +

    '</div>';
};