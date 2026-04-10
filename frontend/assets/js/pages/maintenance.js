/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — MAINTENANCE & REPAIRS PAGE
   window.renderMaintenance() → renders #maintenance
═══════════════════════════════════════════════════════ */
window.renderMaintenance = function () {
  'use strict';
  document.title = 'Car Maintenance & Repairs Nepal — AutoViindu';
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('services');

  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';

  var SERVICES = [
    {
      icon: '🔧', color: '#1A6B2A', bg: '#EEF7F0',
      title: 'Scheduled Maintenance',
      desc: 'Oil changes, filter replacements, fluid top-ups and full multi-point inspections as per manufacturer intervals.',
      price: 'From Rs. 2,500', time: '2–4 hrs',
      items: ['Engine Oil & Filter Change', 'Air Filter Replacement', 'Coolant Flush', 'Brake Fluid Check', 'Tyre Rotation & Pressure', '45-Point Inspection'],
    },
    {
      icon: '🛞', color: '#1A4DB8', bg: '#EEF3FC',
      title: 'Brake Service',
      desc: 'Complete brake inspection and repair including pads, rotors, calipers and brake fluid for all car types.',
      price: 'From Rs. 4,000', time: '3–5 hrs',
      items: ['Brake Pad Replacement', 'Rotor Resurfacing / Replacement', 'Caliper Service', 'Brake Fluid Flush', 'ABS System Check', 'Handbrake Adjustment'],
    },
    {
      icon: '❄️', color: '#0891B2', bg: '#ECFEFF',
      title: 'AC Service & Repair',
      desc: 'Full air-conditioning diagnostics, refrigerant refill and compressor repair for Nepal\'s hot summers and dusty roads.',
      price: 'From Rs. 3,500', time: '2–3 hrs',
      items: ['AC Gas Recharge (R134a)', 'Compressor Inspection', 'Cabin Air Filter Change', 'AC Evaporator Clean', 'Leak Detection Test', 'Thermostat Calibration'],
    },
    {
      icon: '⚡', color: '#7C3AED', bg: '#F5F3FF',
      title: 'Electrical & Battery',
      desc: 'Full electrical system diagnosis, battery health testing, alternator checks and EV/Hybrid high-voltage support.',
      price: 'From Rs. 1,500', time: '1–3 hrs',
      items: ['Battery Load Test & Replacement', 'Alternator / Starter Diagnosis', 'Fuse & Relay Inspection', 'ECU Scan & Error Clearing', 'EV Battery Health Report', 'Wiring Harness Inspection'],
    },
    {
      icon: '🏗️', color: '#B8900E', bg: '#FDF6E0',
      title: 'Suspension & Steering',
      desc: 'Shock absorbers, struts, ball joints, tie rods and wheel alignment — essential for Nepal\'s unpaved roads.',
      price: 'From Rs. 5,000', time: '4–6 hrs',
      items: ['Shock Absorber Replacement', 'Ball Joint & Tie Rod Check', '4-Wheel Alignment', 'Wheel Balancing', 'Steering Rack Inspection', 'CV Joint Boot Replacement'],
    },
    {
      icon: '🔩', color: '#C8271E', bg: '#FFF0EF',
      title: 'Engine Overhaul',
      desc: 'Full engine diagnostics, timing belt/chain service, valve clearance and major engine reconditioning.',
      price: 'From Rs. 25,000', time: '2–5 days',
      items: ['Timing Belt / Chain Service', 'Valve Clearance Adjustment', 'Engine Gasket Replacement', 'Piston Ring Inspection', 'Turbocharger Service', 'Engine Mount Replacement'],
    },
  ];

  var PACKAGES = [
    { title: 'Basic Care', price: 'Rs. 3,999', period: '6 months', color: '#1A6B2A', bg: '#EEF7F0',
      includes: ['Oil & Filter Change', 'Air Filter Check', 'Tyre Pressure & Rotation', 'Brake Visual Inspection', 'Basic Multi-point Check'] },
    { title: 'Comprehensive', price: 'Rs. 8,499', period: '6 months', color: '#1A4DB8', bg: '#EEF3FC', badge: 'Most Popular',
      includes: ['All Basic Care items', 'Coolant & Fluid Flush', 'AC Filter & Gas Check', 'Battery Health Test', '60-Point Inspection', 'Free Vehicle Health Card'] },
    { title: 'Premium Shield', price: 'Rs. 14,999', period: '1 year', color: '#B8900E', bg: '#FDF6E0',
      includes: ['All Comprehensive items', 'Brake Pad Replacement', 'Suspension Check', 'Wheel Alignment', 'Engine Scan & Report', 'Priority Booking', '24-hr Roadside Assist'] },
  ];

  var FAQ = [
    { q: 'How often should I service my car in Nepal?', a: 'Every 5,000–10,000 km or 6 months — whichever comes first. Nepal\'s dusty roads and stop-and-go traffic in Kathmandu valley mean more frequent oil and filter changes are strongly recommended.' },
    { q: 'Do you service electric and hybrid cars?', a: 'Yes. We handle EVs (IONIQ 5, BYD Atto 3, Nexon EV) and hybrids (Prius, Civic e:HEV) including high-voltage battery health reports, software updates and regenerative brake servicing.' },
    { q: 'Can you pick up my car?', a: 'Yes — we offer free pick-up and drop within Kathmandu ring road for Comprehensive and Premium packages. Extra charges apply for Lalitpur and Bhaktapur.' },
    { q: 'Do you provide genuine spare parts?', a: 'We use OEM or OEM-equivalent parts sourced from authorized distributors. We never use grey-market parts. All parts come with a 6-month / 10,000 km warranty.' },
    { q: 'How long does a standard service take?', a: 'A basic oil-and-filter service takes 2–3 hours. Comprehensive service: 4–6 hours. Major engine work may require 2–5 days. We provide a time estimate before work begins.' },
  ];

  var root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
      '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span>' +
        '<a onclick="AV.goTo(\'services\')">Services</a><span class="sep">' + chevR + '</span>' +
        '<span style="color:rgba(255,255,255,.7)">Maintenance &amp; Repairs</span></div>' +
      '<h1 class="page-title">Maintenance &amp; Repairs</h1>' +
      '<div class="page-sub">Certified technicians &middot; Genuine parts &middot; All brands</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:32px;padding-bottom:80px">' +

      /* Quick contact strip */
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:18px 22px;background:var(--green-ll);border:1.5px solid rgba(26,107,42,.18);border-radius:var(--r16);margin-bottom:36px">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<div style="width:40px;height:40px;background:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px">🔧</div>' +
          '<div><div style="font-size:14px;font-weight:800;color:var(--ink)">Book a Service Appointment</div>' +
               '<div style="font-size:12px;color:var(--ink-3)">Same-day slots available · Mon–Sat, 8 AM – 6 PM</div></div>' +
        '</div>' +
        '<a href="tel:+9779701076240" class="btn btn-primary" style="font-size:14px">📞 +977-9701076240</a>' +
      '</div>' +

      /* Services Grid */
      '<div style="font-family:var(--font-display);font-size:26px;font-weight:800;color:var(--ink);margin-bottom:6px">Our Services</div>' +
      '<div style="font-size:13.5px;color:var(--ink-3);margin-bottom:24px">Expert care for every make and model sold in Nepal</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:48px">' +
        SERVICES.map(function(s){
          return '<div style="background:var(--white);border:1px solid var(--border);border-radius:var(--r16);padding:22px;transition:all var(--ease)" onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
            '<div style="width:46px;height:46px;background:' + s.bg + ';border-radius:var(--r12);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px">' + s.icon + '</div>' +
            '<div style="font-size:16px;font-weight:800;color:var(--ink);margin-bottom:6px">' + s.title + '</div>' +
            '<div style="font-size:12.5px;color:var(--ink-3);margin-bottom:14px;line-height:1.7">' + s.desc + '</div>' +
            '<ul style="list-style:none;margin-bottom:16px;display:flex;flex-direction:column;gap:5px">' +
              s.items.map(function(item){ return '<li style="display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ink-2)"><span style="color:' + s.color + ';font-weight:800">✓</span>' + item + '</li>'; }).join('') +
            '</ul>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border)">' +
              '<div><div style="font-size:14px;font-weight:800;color:var(--ink)">' + s.price + '</div><div style="font-size:11px;color:var(--ink-4)">' + s.time + '</div></div>' +
              '<button onclick="alert(\'Book: +977-9701076240\')" style="padding:8px 16px;background:' + s.color + ';color:#fff;border:none;border-radius:var(--r8);font-family:var(--font-body);font-size:12.5px;font-weight:700;cursor:pointer">Book Now</button>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      /* Packages */
      '<div style="font-family:var(--font-display);font-size:26px;font-weight:800;color:var(--ink);margin-bottom:6px">Service Packages</div>' +
      '<div style="font-size:13.5px;color:var(--ink-3);margin-bottom:24px">Save more with our bundled maintenance plans</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-bottom:48px">' +
        PACKAGES.map(function(p){
          return '<div style="background:var(--white);border:2px solid ' + p.color + '33;border-radius:var(--r16);padding:22px;position:relative">' +
            (p.badge ? '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:' + p.color + ';color:#fff;font-size:10.5px;font-weight:800;padding:3px 14px;border-radius:99px;white-space:nowrap">' + p.badge + '</div>' : '') +
            '<div style="font-size:13.5px;font-weight:800;color:' + p.color + ';text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">' + p.title + '</div>' +
            '<div style="font-size:28px;font-weight:900;color:var(--ink);margin-bottom:2px">' + p.price + '</div>' +
            '<div style="font-size:12px;color:var(--ink-4);margin-bottom:16px">valid for ' + p.period + '</div>' +
            '<ul style="list-style:none;display:flex;flex-direction:column;gap:7px;margin-bottom:20px">' +
              p.includes.map(function(item){ return '<li style="display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--ink-2)"><span style="color:' + p.color + ';font-weight:800">✓</span>' + item + '</li>'; }).join('') +
            '</ul>' +
            '<button onclick="alert(\'Purchase Package: +977-9701076240\')" style="width:100%;padding:11px;background:' + p.color + ';color:#fff;border:none;border-radius:var(--r10);font-family:var(--font-body);font-size:13.5px;font-weight:700;cursor:pointer">Get This Package</button>' +
          '</div>';
        }).join('') +
      '</div>' +

      /* Why choose us */
      '<div style="background:var(--bg-2);border-radius:var(--r20);padding:32px;margin-bottom:48px">' +
        '<div style="font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--ink);margin-bottom:20px;text-align:center">Why Service With AutoViindu?</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">' +
          [
            ['🏅', 'Certified Technicians', 'ASE & brand-certified for Toyota, Honda, Hyundai, BYD and more'],
            ['🔩', 'Genuine OEM Parts', 'No grey-market parts — every part comes with a 6-month warranty'],
            ['💰', 'Transparent Pricing', 'Fixed price estimates before work begins. No hidden charges'],
            ['📱', 'Live Status Updates', 'WhatsApp updates at every stage. See your car\'s progress'],
            ['🚗', 'Free Pick & Drop', 'Free within Kathmandu ring road for Comprehensive packages'],
            ['⚡', 'EV/Hybrid Certified', 'High-voltage battery service, software updates, regen brake care'],
          ].map(function(item){
            return '<div style="text-align:center;padding:16px 10px">' +
              '<div style="font-size:28px;margin-bottom:8px">' + item[0] + '</div>' +
              '<div style="font-size:13px;font-weight:800;color:var(--ink);margin-bottom:4px">' + item[1] + '</div>' +
              '<div style="font-size:11.5px;color:var(--ink-3);line-height:1.6">' + item[2] + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +

      /* FAQ */
      '<div style="font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--ink);margin-bottom:20px">Frequently Asked Questions</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:48px">' +
        FAQ.map(function(faq, i){
          return '<details style="background:var(--white);border:1px solid var(--border);border-radius:var(--r12);overflow:hidden">' +
            '<summary style="padding:16px 18px;font-size:13.5px;font-weight:700;color:var(--ink);cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between">' + faq.q +
              '<span style="font-size:18px;color:var(--ink-4);margin-left:12px">+</span>' +
            '</summary>' +
            '<div style="padding:0 18px 16px;font-size:13px;color:var(--ink-3);line-height:1.75">' + faq.a + '</div>' +
          '</details>';
        }).join('') +
      '</div>' +

      /* CTA */
      '<div style="background:linear-gradient(135deg,#1A6B2A 0%,#0F4019 100%);border-radius:var(--r20);padding:40px 32px;text-align:center">' +
        '<div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px">Book Today</div>' +
        '<div style="font-family:var(--font-display);font-size:28px;font-weight:800;color:#fff;margin-bottom:8px">Keep Your Car at Its Best</div>' +
        '<div style="font-size:14px;color:rgba(255,255,255,.7);margin-bottom:24px;max-width:480px;margin-left:auto;margin-right:auto">Expert care, transparent pricing and genuine parts — everything your car needs, in one place.</div>' +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">' +
          '<a href="tel:+9779701076240" class="btn btn-primary" style="background:#fff;color:var(--green);font-size:15px;padding:14px 28px">📞 Call Now</a>' +
          '<button onclick="AV.goTo(\'services\')" style="padding:14px 28px;background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.25);border-radius:var(--r12);font-family:var(--font-body);font-size:15px;font-weight:700;cursor:pointer">All Services</button>' +
        '</div>' +
      '</div>' +

    '</div>';
};