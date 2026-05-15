import sys

with open('public/assets/js/app.js', 'r') as f:
    content = f.read()

start_marker = "function renderUsedDetail(id){"
end_marker = "}\n \n/* ── FILTER / SORT helpers for listing ── */"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    sys.exit(1)

end_idx += len("}")

new_function = """function renderUsedDetail(id){
  const car=USED.find(c=>c.id===id);
  if(!car){renderUsed();return}
  clearInterval(heroTimer);
  document.title=`${car.brand} ${car.model} ${car.year} — AutoViindu`;
  window.scrollTo({top:0,behavior:'smooth'});
  setNav('used');
 
  const Rs=n=>n>=100000?`Rs. ${(n/100000).toFixed(2)}L`:`Rs. ${n.toLocaleString()}`;
  window.Rs = Rs;
  const calcEMI=(p,ar,m)=>{const r=ar/12/100;return r===0?p/m:p*(r*Math.pow(1+r,m))/(Math.pow(1+r,m)-1)};
  const checkIcon=(ok)=>ok
    ?`<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>`
    :`<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" width="11" height="11"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
 
  let galIdx=0;
  const imgs=car.images||[car.img];

  /* ── SVG icon paths ── */
  const _P = {
    cal:  `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    fuel: `<path d="M3 22V6l4-4h6l4 4v16"/><path d="M9 22V12h6v10"/><rect x="17" y="10" width="4" height="4"/>`,
    pow:  `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    body: `<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><line x1="5" y1="12" x2="19" y2="12"/>`,
    sts:  `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    box:  `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
    list: `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,
    feat: `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
    chk:  `<polyline points="20 6 9 17 4 12"/>`,
    chev: `<polyline points="6 9 12 15 18 9"/>`,
    ph:   `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.84-1.84a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>`,
    calc: `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>`,
  };
  const svgI = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${_P[k]}</svg>`;

  function kiGrid() {
    return [
      { k:'cal',  val: car.year, lbl:'Year' },
      { k:'fuel', val: car.type, lbl:'Fuel' },
      { k:'body', val: car.km + ' km', lbl:'Odometer' },
      { k:'sts',  val: car.owners, lbl:'Owners' },
      { k:'list', val: car.transmission, lbl:'Trans.' },
    ].map(it => `
      <div class="dp-ki-cell">
        <div class="dp-ki-icon">${svgI(it.k)}</div>
        <div class="dp-ki-val">${it.val}</div>
        <div class="dp-ki-lbl">${it.lbl}</div>
      </div>`).join('');
  }

  function qsStrip() {
    return [
      ['Brand', car.brand],
      ['Model', car.model],
      ['Color', car.color],
      ['Variant', car.variant],
    ].map(([l,val]) => `
      <div class="dp-qs-cell">
        <div class="dp-qs-val">${val}</div>
        <div class="dp-qs-lbl">${l}</div>
      </div>`).join('');
  }

  function specTable() {
    return `<table class="dp-spec-table">
      ${Object.entries(car.specs).map(([k,val]) => `<tr><td>${k}</td><td>${val}</td></tr>`).join('')}
    </table>`;
  }

  function featGrid() {
    const all = [...new Set([...(car.features||[]), ...(car.highlights||[])])];
    if (!all.length) return `<p style="font-size:13px;color:var(--ink4)">No feature data available.</p>`;
    return `<div class="dp-feat-grid">
      ${all.map(f => `<div class="dp-feat-item"><div class="dp-feat-chk">${svgI('chk')}</div><span>${f}</span></div>`).join('')}
    </div>`;
  }

  function inspectGrid() {
    return `<div class="uc-check-grid" style="display:flex;flex-direction:column;gap:12px;">
      ${car.inspection.map(item=>`<div class="uc-check-item" style="padding:12px;background:var(--bg);border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;gap:10px;">
        <div class="uc-check-dot" style="background:${item.ok?'#16a34a':'#dc2626'};width:10px;height:10px;border-radius:50%"></div>
        <div style="flex:1">
          <div class="uc-check-label" style="font-size:13.5px;font-weight:700;color:var(--ink2)">${item.label}</div>
          <div style="font-size:12px;color:var(--ink4);margin-top:2px">${item.status}</div>
        </div>
        <span style="margin-left:auto">${checkIcon(item.ok)}</span>
      </div>`).join('')}
    </div>`;
  }

  function accord(id, iconKey, title, body, open=false) {
    return `<div class="dp-accord-wrap${open?' open':''}" id="${id}">
      <div class="dp-accord-hd" onclick="AV.dpAccord(this)">
        <div class="dp-accord-title">${svgI(iconKey)} ${title}</div>
        <div class="dp-accord-arr">${svgI('chev')}</div>
      </div>
      <div class="dp-accord-body">${body}</div>
    </div>`;
  }

  function emiHTML(pfx) {
    const dp=20, dt=60, dr=10.5;
    const loan = car.priceNum*(1-dp/100);
    const emi  = calcEMI(loan,dr,dt);
    const tot  = emi*dt, intr = tot-loan;
    return `
      <div class="dp-emi-field">
        <div class="dp-emi-label">Down payment <span class="val" id="${pfx}-dpv">${dp}%</span></div>
        <input type="range" min="10" max="60" step="5" value="${dp}" id="${pfx}-dp"
          oninput="document.getElementById('${pfx}-dpv').textContent=this.value+'%';AV.emiCalcUsed('${id}','${pfx}')">
      </div>
      <div class="dp-emi-field">
        <div class="dp-emi-label">Tenure <span class="val"><span id="${pfx}-ten">${dt}</span> months</span></div>
        <div class="tenure-btns">
          ${[12,24,36,48,60,72].map(m=>`<button class="ten-btn${m===dt?' active':''}"
            onclick="this.closest('.tenure-btns').querySelectorAll('.ten-btn').forEach(b=>b.classList.remove('active'));
                     this.classList.add('active');
                     document.getElementById('${pfx}-ten').textContent=${m};
                     AV.emiCalcUsed('${id}','${pfx}')">${m}m</button>`).join('')}
        </div>
      </div>
      <div class="dp-emi-field">
        <div class="dp-emi-label">Interest rate <span class="val" id="${pfx}-ratev">${dr}%</span></div>
        <input type="range" min="7" max="18" step="0.5" value="${dr}" id="${pfx}-rate"
          oninput="document.getElementById('${pfx}-ratev').textContent=this.value+'%';AV.emiCalcUsed('${id}','${pfx}')">
      </div>
      <div class="dp-emi-result">
        <div style="font-size:10px;color:var(--ink4);margin-bottom:2px">Monthly EMI</div>
        <div class="dp-emi-amount" id="${pfx}-amt">Rs. ${Math.round(emi).toLocaleString()}</div>
        <div style="font-size:11px;color:var(--ink4)">/month</div>
      </div>
      <div class="dp-emi-break">
        <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="${pfx}-loan">${Rs(Math.round(loan))}</div><div class="dp-emi-bd-lbl">Loan amount</div></div>
        <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="${pfx}-int">${Rs(Math.round(intr))}</div><div class="dp-emi-bd-lbl">Interest</div></div>
        <div class="dp-emi-bd"><div class="dp-emi-bd-val" id="${pfx}-tot">${Rs(Math.round(tot))}</div><div class="dp-emi-bd-lbl">Total payable</div></div>
        <div class="dp-emi-bd"><div class="dp-emi-bd-val">${car.price}</div><div class="dp-emi-bd-lbl">Vehicle price</div></div>
      </div>
      <button onclick="alert('Finance: +977-9701076240')" class="dp-cta-ghost" style="margin-top:10px;width:100%">Apply for finance →</button>`;
  }

  function sidebarHTML() {
    return `<div class="dp-scard">
      <div class="dp-price-box">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:4px">Asking price</div>
        <div class="dp-price-main">${car.price}</div>
        <div class="dp-price-note">${car.variant} · Negotiable</div>
        <div class="dp-cta-stack" style="margin-top:16px;">
          <button class="dp-cta-primary" onclick="alert('+977-9701076240')">Call / WhatsApp Seller</button>
          <button class="dp-cta-gold" onclick="alert('Test drive: +977-9701076240')">Book test drive</button>
        </div>
      </div>

      <div class="dp-emi-box">
        <div class="dp-emi-hd">${svgI('calc')} EMI Calculator</div>
        <div id="emi-sb-wrap">${emiHTML('sb')}</div>
      </div>
      
      <!-- Seller Profile Box -->
      <div style="padding:20px;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--g3);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">A</div>
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--ink)">${car.seller.name}</div>
            ${car.seller.verified?'<span style="font-size:11px;color:#16a34a;font-weight:600">✓ Verified Dealer</span>':''}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;background:var(--bg);border-radius:8px;padding:12px 0;margin-bottom:16px">
          <div style="text-align:center;flex:1;border-right:1px solid var(--border)"><div style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.sold}+</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">Cars sold</div></div>
          <div style="text-align:center;flex:1;border-right:1px solid var(--border)"><div style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.rating}★</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">Rating</div></div>
          <div style="text-align:center;flex:1"><div style="font-size:14px;font-weight:800;color:var(--ink)">4yr</div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase">On AutoViindu</div></div>
        </div>
        <button onclick="alert('+977-9701076240')" style="width:100%;padding:12px;background:var(--white);color:var(--ink);border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-b);font-size:13.5px;font-weight:700;cursor:pointer;">Message Seller</button>
      </div>

      <div class="dp-contact-row">
        ${svgI('ph')} <a href="tel:+9779701076240">+977-9701076240</a>&nbsp;·&nbsp;Mon–Sat 9am–6pm
      </div>
    </div>`;
  }

  function similarCars() {
    const similar = USED.filter(c=>c.id!==id).slice(0,4);
    if (!similar.length) return '';
    return `<div class="dp-similar">
      <div class="section-hd">Similar Used Cars</div>
      <div class="used-grid" style="grid-template-columns:repeat(2,1fr)">
        ${similar.map(c=>usedCard(c)).join('')}
      </div>
    </div>`;
  }

  document.getElementById('app-root').innerHTML = `
  <div style="background:linear-gradient(160deg,var(--g0),var(--g1));padding:14px 0 16px;position:relative;overflow:hidden">
    <div class="wrap">
      <div class="breadcrumb">
        <a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span>
        <a onclick="AV.renderUsed()">Used Cars</a><span class="bc-sep">/</span>
        <span style="color:rgba(255,255,255,.7)">${car.brand} ${car.model}</span>
      </div>
      <!-- Desktop title only -->
      <div id="dp-desk-hd" style="display:none">
        <h1 style="font-family:var(--font-d);font-size:clamp(22px,3.5vw,32px);color:#fff;font-weight:700;line-height:1.1;margin-bottom:5px">
          ${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span>
        </h1>
        <div style="font-size:12px;color:rgba(255,255,255,.45);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          ${car.type} · ${car.transmission} · ${car.km} km
          <span class="cc-rating"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${car.rating}</span>
          <span>${car.reviews} reviews</span>
          ${car.certified?`<span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:var(--pill);background:rgba(26,107,42,.3);color:#4dd870;border:1px solid rgba(26,107,42,.45)">✓ AutoViindu Certified</span>`:''}
        </div>
      </div>
    </div>
  </div>

  <div class="wrap dp-layout detail-page-body">

    <!-- ═══ LEFT: main content ═══ -->
    <div style="min-width:0">

      <!-- Gallery -->
      <div class="dp-gallery-card">
        <div id="gal-wrap">
          <div style="position:relative;height:320px;border-radius:12px;overflow:hidden;background:var(--bg2);box-shadow:var(--sh1)" id="ud-gal-main">
            <img id="ud-gal-img" src="${imgs[0]}" style="width:100%;height:100%;object-fit:cover;transition:opacity .2s" alt="${car.brand} ${car.model}">
            ${imgs.length>1?`
            <button onclick="window._udGalNav(-1)" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button onclick="window._udGalNav(1)"  style="position:absolute;top:50%;right:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg></button>`:''}
            <div style="position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:var(--pill);backdrop-filter:blur(4px)" id="ud-gal-cnt">1/${imgs.length}</div>
          </div>
          ${imgs.length>1?`<div style="display:flex;gap:8px;padding:12px 0;overflow-x:auto">
            ${imgs.map((img,i)=>`<div onclick="window._udGalSet(${i})" style="width:72px;height:48px;border-radius:8px;overflow:hidden;border:2px solid ${i===0?'var(--g3)':'transparent'};cursor:pointer;flex-shrink:0;background:var(--bg2);transition:all var(--ease)" id="ud-thumb-${i}"><img src="${img}" style="width:100%;height:100%;object-fit:cover"></div>`).join('')}
          </div>`:''}
        </div>
      </div>

      <!-- Quick stats horizontal strip -->
      <div class="dp-qs-strip">${qsStrip()}</div>

      <!-- Mobile title (hidden on desktop) -->
      <div class="dp-mob-title">
        <h1>${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span></h1>
        <div class="dp-mob-title-sub">
          ${car.type} · ${car.transmission} · ${car.km} km
          <span class="cc-rating"><svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${car.rating}</span>
        </div>
      </div>

      <!-- Key info grid with icons -->
      <div class="dp-ki-wrap"><div class="dp-ki-grid">${kiGrid()}</div></div>

      <div style="padding:14px 16px;background:var(--white);border-bottom:1px solid var(--border)">
        <p style="font-size:13.5px;color:var(--ink3);line-height:1.85;margin:0">${car.overview}</p>
      </div>

      <!-- Inspection Report -->
      ${accord('acc-insp','chk','140-Point Inspection Report',`<div id="insp-body">${inspectGrid()}</div>`,true)}

      <!-- Specifications -->
      ${accord('acc-spec','list','Specifications',`<div id="spec-body">${specTable()}</div>`)}

      <!-- Features & Highlights -->
      ${accord('acc-feat','feat','Features & Highlights',`<div id="feat-body">${featGrid()}</div>`)}

      <!-- EMI Calculator — mobile accordion, hidden on desktop -->
      <div class="dp-mob-emi-acc">
        ${accord('acc-emi','calc','EMI Calculator',`<div id="emi-mob-wrap">${emiHTML('mob')}</div>`)}
      </div>

      <!-- Similar cars -->
      ${similarCars()}
    </div>

    <!-- ═══ RIGHT: sticky sidebar (desktop only) ═══ -->
    <div class="dp-sidebar" id="dp-sidebar">
      ${sidebarHTML()}
    </div>
  </div>

  <!-- Mobile sticky bottom bar -->
  <div class="dp-mob-bar">
    <div class="dp-mob-price">
      <div class="dp-mob-price-lbl">Asking Price</div>
      <div class="dp-mob-price-val">${car.price}</div>
    </div>
    <div class="dp-mob-btns">
      <button class="dp-mob-btn-g" onclick="alert('Test drive: +977-9701076240')">Test Drive</button>
      <button class="dp-mob-btn-p" onclick="alert('+977-9701076240')">Contact Seller</button>
    </div>
  </div>`;

  /* desktop: show hero title + sidebar */
  const mq = window.matchMedia('(min-width:900px)');
  function applyMQ(e) {
    const dh = document.getElementById('dp-desk-hd');
    const sb = document.getElementById('dp-sidebar');
    if (dh) dh.style.display = e.matches ? 'block' : 'none';
    if (sb) sb.style.display = e.matches ? 'flex'  : 'none';
  }
  applyMQ(mq);
  mq.addEventListener('change', applyMQ);

  window._udGalNav=function(dir){
    gi=(gi+dir+imgs.length)%imgs.length;
    const img=document.getElementById('ud-gal-img');
    if(img){img.style.opacity='0';setTimeout(()=>{img.src=imgs[gi];img.style.opacity='1'},200)}
    document.querySelectorAll('[id^="ud-thumb-"]').forEach((t,i)=>t.style.borderColor=i===gi?'var(--g3)':'transparent');
    const c=document.getElementById('ud-gal-cnt');if(c)c.textContent=`${gi+1}/${imgs.length}`;
  };
  window._udGalSet=function(idx){
    gi=idx;
    const img=document.getElementById('ud-gal-img');
    if(img){img.style.opacity='0';setTimeout(()=>{img.src=imgs[idx];img.style.opacity='1'},200)}
    document.querySelectorAll('[id^="ud-thumb-"]').forEach((t,i)=>t.style.borderColor=i===idx?'var(--g3)':'transparent');
    const c=document.getElementById('ud-gal-cnt');if(c)c.textContent=`${idx+1}/${imgs.length}`;
  };

  /* ── EMI recalc ── */
  AV.emiCalcUsed = function(id, pfx) {
    const dpPct= +(document.getElementById(`${pfx}-dp`)?.value    || 20);
    const ten  = +(document.getElementById(`${pfx}-ten`)?.textContent || 60);
    const rate = +(document.getElementById(`${pfx}-rate`)?.value   || 10.5);
    const loan = car.priceNum*(1-dpPct/100);
    const emi  = calcEMI(loan,rate,ten);
    const tot  = emi*ten;
    const set  = (id,val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
    set(`${pfx}-amt`,  `Rs. ${Math.round(emi).toLocaleString()}`);
    set(`${pfx}-loan`, Rs(Math.round(loan)));
    set(`${pfx}-int`,  Rs(Math.round(tot-loan)));
    set(`${pfx}-tot`,  Rs(Math.round(tot)));
  };
}
"""

updated_content = content[:start_idx] + new_function + content[end_idx:]

with open('public/assets/js/app.js', 'w') as f:
    f.write(updated_content)

print("Updated used car details successfully using dp-layout!")
