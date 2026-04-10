/* ═══════════════════════════════════════════════════════
   AUTOVIINDU — VIDEOS PAGE
   window.renderVideos() → renders #videos
═══════════════════════════════════════════════════════ */
window.renderVideos = function () {
  document.title = 'Car Videos Nepal — Reviews & Comparisons | AutoViindu';
  if (window.AV && window.AV.setActiveNav) window.AV.setActiveNav('videos');

  var IC = window.AV_ICONS || {};
  var chevR = IC.chevR || '›';

  var VIDEOS = [
    { id:'dQw4w9WgXcQ', title:'MG Hector 2024 Full Review', sub:'Is it worth Rs. 26L in Nepal?', brand:'MG', duration:'14:32', views:'48K', category:'Reviews', thumb:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=360&fit=crop' },
    { id:'dQw4w9WgXcQ', title:'Hyundai IONIQ 5 — Real World Range Test Nepal', sub:'Charging, load-shedding survival & V2L tested', brand:'Hyundai', duration:'22:10', views:'32K', category:'EV Special', thumb:'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=640&h=360&fit=crop' },
    { id:'dQw4w9WgXcQ', title:'Kia Seltos vs Hyundai Creta 2024 Comparison', sub:'Which compact SUV wins in Nepal?', brand:'Kia', duration:'18:44', views:'61K', category:'Comparisons', thumb:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&h=360&fit=crop' },
    { id:'dQw4w9WgXcQ', title:'Toyota Fortuner 2024 — Mountain Drive Review', sub:'Tested on Kathmandu to Pokhara highway', brand:'Toyota', duration:'25:08', views:'87K', category:'Road Tests', thumb:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop' },
    { id:'dQw4w9WgXcQ', title:'BYD Atto 3 vs IONIQ 5 — EV Comparison Nepal', sub:'Best electric SUV under Rs. 55L?', brand:'BYD', duration:'20:15', views:'29K', category:'EV Special', thumb:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=640&h=360&fit=crop' },
    { id:'dQw4w9WgXcQ', title:'Honda City 2024 — Best Value Sedan in Nepal', sub:'Full review with EMI breakdown', brand:'Honda', duration:'16:50', views:'53K', category:'Reviews', thumb:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=640&h=360&fit=crop' },
    { id:'dQw4w9WgXcQ', title:'Top 5 Budget Cars Under Rs. 25L in Nepal 2024', sub:'Best value cars for the money right now', brand:'AutoViindu', duration:'12:30', views:'71K', category:'Comparisons', thumb:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=640&h=360&fit=crop' },
    { id:'dQw4w9WgXcQ', title:'Suzuki Grand Vitara — Off-Road & City Test', sub:'Hybrid SUV for Nepal\'s diverse terrain', brand:'Suzuki', duration:'19:05', views:'38K', category:'Road Tests', thumb:'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=640&h=360&fit=crop' },
  ];

  var cats = ['All','Reviews','Comparisons','EV Special','Road Tests'];
  var activeCat = 'All';

  var playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

  var catChips = cats.map(function (c) {
    return '<span class="chip' + (c === activeCat ? ' active' : '') + '" ' +
      'onclick="document.querySelectorAll(\'.video-filter-chip\').forEach(function(el){el.classList.remove(\'active\')});this.classList.add(\'active\');' +
      'document.querySelectorAll(\'.video-card-outer\').forEach(function(el){el.style.display=(el.dataset.cat===\'' + c + '\'||' + (c === 'All' ? 'true' : 'false') + ')?\'block\':\'none\'});" ' +
      'class="video-filter-chip">' + c + '</span>';
  }).join('');

  var featured = VIDEOS[0];
  var featuredHtml =
    '<div class="video-featured" style="margin-bottom:32px;display:grid;grid-template-columns:1fr;gap:16px">' +
    '<div style="position:relative;border-radius:var(--r16);overflow:hidden;cursor:pointer;aspect-ratio:16/9" onclick="window.open(\'https://youtube.com/watch?v=' + featured.id + '\',\'_blank\')">' +
    '<img src="' + featured.thumb + '" style="width:100%;height:100%;object-fit:cover">' +
    '<div style="position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center">' +
    '<div style="width:60px;height:60px;background:rgba(255,255,255,.9);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#0d1117;padding-left:4px">' + playIcon + '</div>' +
    '</div>' +
    '<span style="position:absolute;bottom:10px;right:10px;font-size:11px;font-weight:700;padding:3px 8px;background:rgba(0,0,0,.75);color:#fff;border-radius:var(--pill)">' + featured.duration + '</span>' +
    '</div>' +
    '<div>' +
    '<span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;background:var(--green-l);color:var(--green);text-transform:uppercase;letter-spacing:.5px">' + featured.brand + '</span>' +
    '<h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--ink);margin:8px 0 6px">' + featured.title + '</h2>' +
    '<p style="font-size:13px;color:var(--ink-4);line-height:1.6;margin-bottom:14px">' + featured.sub + '</p>' +
    '<div style="display:flex;gap:14px;font-size:12.5px;color:var(--ink-4)">' +
    '<span>👁 ' + featured.views + ' views</span><span>⏱ ' + featured.duration + '</span>' +
    '</div>' +
    '<button onclick="window.open(\'https://youtube.com/watch?v=' + featured.id + '\',\'_blank\')" class="btn btn-primary" style="margin-top:16px">' + playIcon + ' Watch Now</button>' +
    '</div></div>';

  var gridHtml = VIDEOS.slice(1).map(function (v) {
    return '<div class="video-card-outer" data-cat="' + v.category + '" style="background:var(--white);border:1px solid var(--border);border-radius:var(--r14);overflow:hidden;cursor:pointer;transition:all var(--ease)" ' +
      'onclick="window.open(\'https://youtube.com/watch?v=' + v.id + '\',\'_blank\')" ' +
      'onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'var(--shadow-md)\'" ' +
      'onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">' +
      '<div style="position:relative;aspect-ratio:16/9;overflow:hidden">' +
      '<img src="' + v.thumb + '" style="width:100%;height:100%;object-fit:cover" loading="lazy">' +
      '<div style="position:absolute;inset:0;background:rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0">' +
      '<div style="width:44px;height:44px;background:rgba(255,255,255,.9);border-radius:50%;display:flex;align-items:center;justify-content:center;padding-left:3px">' + playIcon + '</div>' +
      '</div>' +
      '<span style="position:absolute;bottom:6px;right:6px;font-size:10px;font-weight:700;padding:2px 7px;background:rgba(0,0,0,.75);color:#fff;border-radius:var(--pill)">' + v.duration + '</span>' +
      '</div>' +
      '<div style="padding:12px">' +
      '<span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:99px;background:var(--green-l);color:var(--green)">' + v.brand + '</span>' +
      '<div style="font-size:14px;font-weight:700;color:var(--ink);margin:7px 0 4px;line-height:1.4">' + v.title + '</div>' +
      '<div style="font-size:12px;color:var(--ink-4);line-height:1.5">' + v.sub + '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-top:10px">' +
      '<span style="font-size:11.5px;color:var(--ink-4)">👁 ' + v.views + '</span>' +
      '<span style="font-size:11.5px;color:var(--ink-4)">⏱ ' + v.duration + '</span>' +
      '</div></div></div>';
  }).join('');

  var root = document.getElementById('app-root');
  root.innerHTML =
    '<div class="page-hero"><div class="wrap">' +
    '<div class="breadcrumb"><a onclick="AV.goTo(\'home\')">Home</a><span class="sep">' + chevR + '</span><span style="color:rgba(255,255,255,.7)">Videos</span></div>' +
    '<h1 class="page-title">Car Videos</h1>' +
    '<div class="page-sub">Expert reviews, comparisons &amp; road tests from Nepal</div>' +
    '</div></div>' +

    '<div class="wrap" style="padding-top:32px;padding-bottom:64px">' +

    '<div class="filter-chips" style="margin-bottom:28px">' + catChips + '</div>' +

    featuredHtml +

    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:40px">' + gridHtml + '</div>' +

    '<div style="text-align:center;padding:28px;background:var(--bg);border-radius:var(--r20)">' +
    '<div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--ink);margin-bottom:6px">More videos every week</div>' +
    '<p style="font-size:13px;color:var(--ink-4);margin-bottom:16px">Subscribe to our YouTube for weekly Nepal car reviews, comparisons and road tests</p>' +
    '<button onclick="window.open(\'https://youtube.com/@autoviindu\',\'_blank\')" class="btn btn-primary">▶ Subscribe on YouTube</button>' +
    '</div>' +

    '</div>';
};