import sys

with open('public/assets/js/app.js', 'r') as f:
    content = f.read()

start_marker = "  document.getElementById('app-root').innerHTML=`\n  <div class=\"page-hero\">"
end_marker = "  mq.addEventListener('change',applyOrder);"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    sys.exit(1)

end_idx += len(end_marker)

new_content = """  document.getElementById('app-root').innerHTML=`
  <div style="background:linear-gradient(160deg,var(--g0),var(--g1));padding:14px 0 16px;position:relative;overflow:hidden">
    <div class="wrap">
      <div class="breadcrumb">
        <a onclick="AV.goTo('home')">Home</a><span class="bc-sep">/</span>
        <a onclick="AV.renderUsed()">Used Cars</a><span class="bc-sep">/</span>
        <span style="color:rgba(255,255,255,.7)">${car.brand} ${car.model}</span>
      </div>
      <h1 style="font-family:var(--font-h);font-size:clamp(24px,4vw,38px);font-weight:800;color:#fff;line-height:1.1;letter-spacing:-.5px;margin:2px 0 10px;position:relative;z-index:2">
        ${car.brand} ${car.model} <span style="color:var(--gold-t)">${car.year}</span>
      </h1>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;position:relative;z-index:2">
        <span class="dp-hero-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 22V6l4-4h6l4 4v16"/><path d="M9 22V12h6v10"/><rect x="17" y="10" width="4" height="4"/></svg> ${car.type}</span>
        <span class="dp-hero-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${car.km} km</span>
        <span class="dp-hero-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> ${car.transmission}</span>
        <div style="font-size:12px;color:rgba(255,255,255,.5);font-weight:600">
          ★ ${car.rating} <span style="font-weight:400;margin-left:2px">(${car.reviews} reviews)</span>
        </div>
        ${car.certified?'<span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:var(--pill);background:rgba(26,107,42,.3);color:#4dd870;border:1px solid rgba(26,107,42,.45)">✓ AutoViindu Certified</span>':''}
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" style="position:absolute;right:-5%;top:-50%;width:500px;height:500px;pointer-events:none">
        <path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><path d="M5 12h14"/>
      </svg>
    </div>
  </div>
  <div class="detail-layout">

    <!-- MAIN CONTENT -->
    <div style="min-width:0;padding-bottom:60px">
      <!-- Gallery -->
      <div id="ud-gal-wrap" style="margin-bottom:24px">
        <div style="position:relative;height:320px;border-radius:12px;overflow:hidden;background:var(--bg2);box-shadow:var(--sh1)" id="ud-gal-main">
          <img id="ud-gal-img" src="${imgs[0]}" style="width:100%;height:100%;object-fit:cover;transition:opacity .2s" alt="${car.brand} ${car.model}">
          ${imgs.length>1?`
          <button onclick="window._udGalNav(-1)" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1);transition:background .2s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></button>
          <button onclick="window._udGalNav(1)"  style="position:absolute;top:50%;right:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(255,255,255,.9);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh1);transition:background .2s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg></button>`:''}
          <div style="position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:var(--pill);backdrop-filter:blur(4px)" id="ud-gal-cnt">1/${imgs.length}</div>
        </div>
        ${imgs.length>1?`<div style="display:flex;gap:8px;padding:12px 0;overflow-x:auto">
          ${imgs.map((img,i)=>`<div onclick="window._udGalSet(${i})" style="width:72px;height:48px;border-radius:8px;overflow:hidden;border:2px solid ${i===0?'var(--g3)':'transparent'};cursor:pointer;flex-shrink:0;background:var(--bg2);transition:all var(--ease)" id="ud-thumb-${i}"><img src="${img}" style="width:100%;height:100%;object-fit:cover"></div>`).join('')}
        </div>`:''}
      </div>
 
      <!-- Tabs -->
      <div class="dp-tabs-wrap" style="margin-bottom:20px">
        <div class="dp-tabs">
          <button class="dp-tab active" onclick="AV.dpTab(this,'ud-pane-ov')">Overview</button>
          <button class="dp-tab" onclick="AV.dpTab(this,'ud-pane-sp')">Specs & Features</button>
          <button class="dp-tab" onclick="AV.dpTab(this,'ud-pane-inspect')">Inspection Report</button>
        </div>
      </div>
 
      <!-- OVERVIEW -->
      <div class="dp-pane active" id="ud-pane-ov">
        <div style="font-size:14px;color:var(--ink3);line-height:1.7;margin-bottom:20px">${car.overview}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">
          ${(car.highlights||[]).map(h=>`<span class="dp-hl-tag">${h}</span>`).join('')}
        </div>
        <div class="section-hd" style="font-size:18px;margin-bottom:12px">Key Specifications</div>
        <div class="dp-qs-grid" style="margin-bottom:24px">
          ${Object.entries(car.specs).map(([k,v])=>`<div class="dp-qs-cell"><div class="dp-qs-val">${v}</div><div class="dp-qs-lbl">${k}</div></div>`).join('')}
        </div>
      </div>
 
      <!-- SPECS & FEATURES -->
      <div class="dp-pane" id="ud-pane-sp">
        <div class="section-hd" style="font-size:18px;margin-bottom:12px">Detailed Specs</div>
        <table class="dp-spec-table" style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${[['Brand',car.brand],['Model',car.model],['Year',car.year],['Variant',car.variant],['KM Driven',car.km+' km'],['Fuel Type',car.type],['Transmission',car.transmission],['Owners',car.owners],['Color',car.color],...Object.entries(car.specs)].map(([k,v],i)=>`<tr style="${i%2===0?'':'background:var(--bg)'}"><td style="padding:10px 14px;border-bottom:1px solid var(--border);font-size:13.5px;font-weight:700;color:var(--ink2);width:40%">${k}</td><td style="padding:10px 14px;border-bottom:1px solid var(--border);font-size:13.5px;color:var(--ink3)">${v}</td></tr>`).join('')}
        </table>
        ${car.features&&car.features.length?`<div class="section-hd" style="font-size:18px;margin-bottom:12px">Features</div>
        <div class="dp-feat-grid" style="margin-bottom:24px">
          ${car.features.map(f=>`<div class="dp-feat-item"><div class="dp-feat-chk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg></div><span>${f}</span></div>`).join('')}
        </div>`:''}
      </div>
 
      <!-- INSPECTION -->
      <div class="dp-pane" id="ud-pane-inspect">
        <div style="display:flex;align-items:center;gap:12px;background:var(--g-ll);border:1px solid rgba(26,107,42,.15);border-radius:var(--r12);padding:16px;margin-bottom:20px">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g3)" stroke-width="2.5" width="28" height="28"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          <div><div style="font-size:15px;font-weight:800;color:var(--g3)">140-Point AutoViindu Inspection</div><div style="font-size:13px;color:var(--ink4);margin-top:2px">Professionally checked & verified</div></div>
        </div>
        <div class="uc-check-grid" style="margin-bottom:20px">
          ${car.inspection.map(item=>`<div class="uc-check-item" style="padding:12px;background:var(--bg);border-radius:10px;border:1px solid var(--border)">
            <div class="uc-check-dot" style="background:${item.ok?'#16a34a':'#dc2626'};width:10px;height:10px"></div>
            <div style="flex:1">
              <div class="uc-check-label" style="font-size:13.5px">${item.label}</div>
              <div style="font-size:12px;color:var(--ink4);margin-top:2px">${item.status}</div>
            </div>
            <span style="margin-left:auto">${checkIcon(item.ok)}</span>
          </div>`).join('')}
        </div>
      </div>
 
      <!-- Similar used cars -->
      <div style="padding-top:32px;margin-top:16px;border-top:1px solid var(--border)">
        <div style="font-family:var(--font-h);font-size:22px;font-weight:800;color:var(--ink);margin-bottom:20px">Similar Used Cars</div>
        <div class="used-grid" style="grid-template-columns:repeat(2,1fr)">
          ${USED.filter(c=>c.id!==id).slice(0,4).map(c=>usedCard(c)).join('')}
        </div>
      </div>
 
    </div>

    <!-- SIDEBAR -->
    <div class="detail-sidebar">
      <div class="dp-scard">
        <!-- Price -->
        <div class="dp-price-box">
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:var(--ink4);margin-bottom:4px">Asking Price</div>
          <div class="dp-price-main" style="color:var(--g3)">${car.price}</div>
          <div class="dp-price-note">${car.variant} · Negotiable</div>
  
          <!-- CTAs -->
          <div class="dp-cta-stack" style="margin-top:16px">
            <button class="dp-cta-primary" onclick="alert('+977-9701076240')">Call / WhatsApp Seller</button>
            <button class="dp-cta-gold" onclick="alert('Test drive: +977-9701076240')">Book Test Drive</button>
          </div>
        </div>
 
        <!-- EMI block -->
        <div class="dp-emi-box" id="ud-emi-wrap">
          <div class="dp-emi-hd"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg> EMI Calculator</div>
          ${buildEMI(car.priceNum)}
        </div>
 
        <!-- Quick specs -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:20px">
          ${[['KM Driven',car.km+' km'],['Owners',car.owners+' owner'],['Color',car.color],['Year',car.year],['Fuel',car.type],['Transmission',car.transmission]].map(([k,v])=>`
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
            <div style="font-family:var(--font-d);font-size:13px;font-weight:700;color:var(--g3)">${v}</div>
            <div style="font-size:11px;color:var(--ink4);margin-top:2px">${k}</div>
          </div>`).join('')}
        </div>

        <div class="dp-contact-row" style="border-top:1px solid var(--border)">
          <a href="tel:+9779701076240" style="color:var(--ink)">+977-9701076240</a> &nbsp;·&nbsp; Nayabazar, Kathmandu
        </div>
      </div>
 
      <!-- Seller card -->
      <div style="margin-top:20px">
        <div class="uc-seller-card" style="background:var(--white);border:1px solid var(--border);border-radius:16px;padding:20px">
          <div class="uc-seller-head" style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div class="uc-seller-avatar" style="width:48px;height:48px;border-radius:50%;background:var(--g3);color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">A</div>
            <div>
              <div class="uc-seller-name" style="font-size:16px;font-weight:700;color:var(--ink)">${car.seller.name}</div>
              ${car.seller.verified?'<span class="uc-seller-badge" style="font-size:11px;color:#16a34a;font-weight:600">✓ Verified Dealer</span>':''}
            </div>
          </div>
          <div class="uc-seller-stats" style="display:flex;justify-content:space-between;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:12px 0;margin-bottom:16px">
            <div class="uc-ss-cell" style="text-align:center"><div class="uc-ss-val" style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.sold}+</div><div class="uc-ss-lbl" style="font-size:11px;color:var(--ink4)">Cars sold</div></div>
            <div class="uc-ss-cell" style="text-align:center"><div class="uc-ss-val" style="font-size:14px;font-weight:800;color:var(--ink)">${car.seller.rating}★</div><div class="uc-ss-lbl" style="font-size:11px;color:var(--ink4)">Rating</div></div>
            <div class="uc-ss-cell" style="text-align:center"><div class="uc-ss-val" style="font-size:14px;font-weight:800;color:var(--ink)">4yr</div><div class="uc-ss-lbl" style="font-size:11px;color:var(--ink4)">On AutoViindu</div></div>
          </div>
          <button onclick="alert('+977-9701076240')" style="width:100%;padding:12px;background:var(--bg);color:var(--ink);border:1px solid var(--border);border-radius:var(--r8);font-family:var(--font-b);font-size:13.5px;font-weight:700;cursor:pointer;transition:all .2s" onmouseover="this.style.background='var(--border)'" onmouseout="this.style.background='var(--bg)'">Message Seller</button>
        </div>
      </div>
    </div>
  </div>`;
"""

updated_content = content[:start_idx] + new_content + content[end_idx:]

with open('public/assets/js/app.js', 'w') as f:
    f.write(updated_content)

print("Updated used car details layout!")
